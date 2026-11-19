// CES School Website - single backend
// Roles: principal (memos + events + accounts), teacher (read memos, add events),
// student/visitor (view events, send contact messages).
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DB_FILE = process.env.DB_FILE || path.join(ROOT, "school.db");

// ---------------------------------------------------------------------------
// Database helpers (promise wrappers around sqlite3)
// ---------------------------------------------------------------------------
const db = new sqlite3.Database(DB_FILE);
const run = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    })
  );
const get = (sql, params = []) =>
  new Promise((resolve, reject) => db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));
const all = (sql, params = []) =>
  new Promise((resolve, reject) => db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));

async function initDb() {
  await run("PRAGMA foreign_keys = ON");
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK (role IN ('principal','teacher','student')),
    login_id TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);
  await run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    endTime TEXT,
    description TEXT,
    category TEXT DEFAULT 'General',
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending','approved')),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);
  await run(`CREATE TABLE IF NOT EXISTS memos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    urgent INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);
  await run(`CREATE TABLE IF NOT EXISTS memo_reads (
    memo_id INTEGER NOT NULL REFERENCES memos(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TEXT DEFAULT (datetime('now','localtime')),
    PRIMARY KEY (memo_id, user_id)
  )`);
  await run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // Seed the principal account on first run.
  const principal = await get("SELECT id FROM users WHERE role = 'principal'");
  if (!principal) {
    const email = process.env.PRINCIPAL_EMAIL || "principal@ces.local";
    const password = process.env.PRINCIPAL_PASSWORD;
    if (!password) {
      console.warn("⚠️  No principal account yet. Set PRINCIPAL_EMAIL and PRINCIPAL_PASSWORD in .env and restart.");
    } else {
      await run("INSERT INTO users (role, login_id, name, password_hash) VALUES ('principal', ?, ?, ?)", [
        email,
        process.env.PRINCIPAL_NAME || "School Principal",
        await bcrypt.hash(password, 10),
      ]);
      console.log(`✅ Principal account created: ${email}`);
    }
  }

  // One-time import of events from the old events.db.
  const count = await get("SELECT COUNT(*) AS n FROM events");
  const oldDb = path.join(ROOT, "events.db");
  if (count.n === 0 && fs.existsSync(oldDb)) {
    try {
      await run("ATTACH DATABASE ? AS old", [oldDb]);
      const cols = (await all("PRAGMA old.table_info(events)")).map((c) => c.name);
      const col = (name) => (cols.includes(name) ? name : "NULL");
      const res = await run(
        `INSERT INTO events (name, date, time, endTime, description)
         SELECT name, date, ${col("time")}, ${col("endTime")}, ${col("description")}
         FROM old.events WHERE name IS NOT NULL AND date IS NOT NULL`
      );
      await run("DETACH DATABASE old");
      if (res.changes) console.log(`✅ Imported ${res.changes} event(s) from events.db`);
    } catch (e) {
      console.warn("Could not import old events:", e.message);
    }
  }
}

// ---------------------------------------------------------------------------
// App + middleware
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-only-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 },
  })
);

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.session.user;
    if (user && roles.includes(user.role)) return next();
    if (req.path.startsWith("/api/") || req.originalUrl.startsWith("/api/")) {
      return res.status(user ? 403 : 401).json({ error: user ? "Not allowed for your role" : "Please log in" });
    }
    return res.redirect("/home.html?login=required");
  };
}

const str = (v, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime = (v) => v === "" || /^\d{2}:\d{2}$/.test(v);

// ---------------------------------------------------------------------------
// Protected pages (must come before express.static)
// ---------------------------------------------------------------------------
app.get(["/principal", "/calendar/principal.html"], requireRole("principal"), (req, res) =>
  res.sendFile(path.join(ROOT, "calendar", "principal.html"))
);
app.get(["/teacher", "/calendar/calendar.html"], requireRole("teacher"), (req, res) =>
  res.sendFile(path.join(ROOT, "calendar", "calendar.html"))
);

// Never serve server-side files or databases as static content.
app.use((req, res, next) => {
  const p = decodeURIComponent(req.path).toLowerCase();
  if (
    /\.(db|sqbpro|env|php)$/.test(p) ||
    p.startsWith("/legacy") ||
    p.startsWith("/node_modules") ||
    p.startsWith("/sqlite3") ||
    ["/server.js", "/package.json", "/package-lock.json"].includes(p)
  ) {
    return res.status(404).end();
  }
  next();
});

app.get("/", (req, res) => res.redirect("/home.html"));

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." } });

app.post("/api/login", loginLimiter, wrap(async (req, res) => {
  const role = str(req.body.role, 20);
  const loginId = str(req.body.login_id, 100);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!["principal", "teacher", "student"].includes(role) || !loginId || !password) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }
  const user = await get("SELECT * FROM users WHERE login_id = ? AND role = ?", [loginId, role]);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials for the selected role." });
  }
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "Session error" });
    req.session.user = { id: user.id, role: user.role, name: user.name, login_id: user.login_id };
    const redirect = { principal: "/principal", teacher: "/teacher", student: "/home.html" }[user.role];
    res.json({ user: req.session.user, redirect });
  });
}));

app.post("/api/logout", (req, res) => req.session.destroy(() => res.json({ ok: true })));

app.get("/api/me", (req, res) => res.json({ user: req.session.user || null }));

app.post("/api/me/password", requireRole("principal", "teacher", "student"), wrap(async (req, res) => {
  const current = req.body.current || "";
  const next = req.body.next || "";
  if (next.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters." });
  const user = await get("SELECT password_hash FROM users WHERE id = ?", [req.session.user.id]);
  if (!user || !(await bcrypt.compare(current, user.password_hash))) {
    return res.status(400).json({ error: "Current password is incorrect." });
  }
  await run("UPDATE users SET password_hash = ? WHERE id = ?", [await bcrypt.hash(next, 10), req.session.user.id]);
  res.json({ message: "Password changed." });
}));

// ---------------------------------------------------------------------------
// Accounts (principal manages teachers and students)
// ---------------------------------------------------------------------------
app.get("/api/users", requireRole("principal"), wrap(async (req, res) => {
  res.json(await all("SELECT id, role, login_id, name, created_at FROM users WHERE role != 'principal' ORDER BY role, name"));
}));

app.post("/api/users", requireRole("principal"), wrap(async (req, res) => {
  const role = str(req.body.role, 20);
  const loginId = str(req.body.login_id, 100);
  const name = str(req.body.name, 100);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!["teacher", "student"].includes(role)) return res.status(400).json({ error: "Role must be teacher or student." });
  if (!loginId || !name) return res.status(400).json({ error: "Name and ID are required." });
  if (role === "student" && !/^\d{12}$/.test(loginId)) return res.status(400).json({ error: "LRN must be 12 digits." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  try {
    const r = await run("INSERT INTO users (role, login_id, name, password_hash) VALUES (?, ?, ?, ?)", [
      role, loginId, name, await bcrypt.hash(password, 10),
    ]);
    res.status(201).json({ id: r.id, message: "Account created." });
  } catch (e) {
    if (/UNIQUE/.test(e.message)) return res.status(409).json({ error: "That ID is already in use." });
    throw e;
  }
}));

app.delete("/api/users/:id", requireRole("principal"), wrap(async (req, res) => {
  const r = await run("DELETE FROM users WHERE id = ? AND role != 'principal'", [req.params.id]);
  if (!r.changes) return res.status(404).json({ error: "Account not found." });
  res.json({ message: "Account removed." });
}));

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
const EVENT_SELECT = `SELECT e.*, u.name AS created_by_name FROM events e LEFT JOIN users u ON u.id = e.created_by`;

// Public: approved events only. Staff: approved + their own pending (principal sees all).
app.get("/api/events", wrap(async (req, res) => {
  const user = req.session.user;
  let rows;
  if (user && user.role === "principal") rows = await all(`${EVENT_SELECT} ORDER BY date, time`);
  else if (user && user.role === "teacher")
    rows = await all(`${EVENT_SELECT} WHERE e.status = 'approved' OR e.created_by = ? ORDER BY date, time`, [user.id]);
  else rows = await all(`${EVENT_SELECT} WHERE e.status = 'approved' ORDER BY date, time`);
  res.json(rows);
}));

function readEvent(body) {
  const ev = {
    name: str(body.name, 200),
    date: str(body.date, 10),
    time: str(body.time, 5),
    endTime: str(body.endTime, 5),
    description: str(body.description, 2000),
    category: str(body.category, 40) || "General",
  };
  if (!ev.name || !isDate(ev.date)) return { error: "Event name and a valid date are required." };
  if (!isTime(ev.time) || !isTime(ev.endTime)) return { error: "Times must be HH:MM." };
  if (ev.time && ev.endTime && ev.endTime <= ev.time) return { error: "End time must be after start time." };
  return { ev };
}

async function canEditEvent(user, id) {
  const ev = await get("SELECT * FROM events WHERE id = ?", [id]);
  if (!ev) return { status: 404 };
  if (user.role === "principal" || ev.created_by === user.id) return { ev };
  return { status: 403 };
}

app.post("/api/events", requireRole("principal", "teacher"), wrap(async (req, res) => {
  const { ev, error } = readEvent(req.body);
  if (error) return res.status(400).json({ error });
  const user = req.session.user;
  const status = user.role === "principal" ? "approved" : "pending";
  const r = await run(
    "INSERT INTO events (name, date, time, endTime, description, category, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [ev.name, ev.date, ev.time, ev.endTime, ev.description, ev.category, status, user.id]
  );
  res.status(201).json({
    id: r.id,
    status,
    message: status === "pending" ? "Event submitted. It will be public once the principal approves it." : "Event added.",
  });
}));

app.put("/api/events/:id", requireRole("principal", "teacher"), wrap(async (req, res) => {
  const check = await canEditEvent(req.session.user, req.params.id);
  if (check.status) return res.status(check.status).json({ error: check.status === 404 ? "Event not found." : "You can only edit your own events." });
  const { ev, error } = readEvent(req.body);
  if (error) return res.status(400).json({ error });
  // A teacher editing an approved event sends it back for approval.
  const status = req.session.user.role === "principal" ? check.ev.status : "pending";
  await run(
    "UPDATE events SET name = ?, date = ?, time = ?, endTime = ?, description = ?, category = ?, status = ? WHERE id = ?",
    [ev.name, ev.date, ev.time, ev.endTime, ev.description, ev.category, status, req.params.id]
  );
  res.json({ message: "Event updated.", status });
}));

app.post("/api/events/:id/approve", requireRole("principal"), wrap(async (req, res) => {
  const r = await run("UPDATE events SET status = 'approved' WHERE id = ?", [req.params.id]);
  if (!r.changes) return res.status(404).json({ error: "Event not found." });
  res.json({ message: "Event approved." });
}));

app.delete("/api/events/:id", requireRole("principal", "teacher"), wrap(async (req, res) => {
  const check = await canEditEvent(req.session.user, req.params.id);
  if (check.status) return res.status(check.status).json({ error: check.status === 404 ? "Event not found." : "You can only delete your own events." });
  await run("DELETE FROM events WHERE id = ?", [req.params.id]);
  res.json({ message: "Event deleted." });
}));

// ---------------------------------------------------------------------------
// Memos (principal writes, teachers read)
// ---------------------------------------------------------------------------
app.get("/api/memos", requireRole("principal", "teacher"), wrap(async (req, res) => {
  const user = req.session.user;
  if (user.role === "principal") {
    const memos = await all(`SELECT m.*, (SELECT COUNT(*) FROM memo_reads r WHERE r.memo_id = m.id) AS read_count
                             FROM memos m ORDER BY m.date DESC, m.time DESC`);
    const teachers = await get("SELECT COUNT(*) AS n FROM users WHERE role = 'teacher'");
    return res.json(memos.map((m) => ({ ...m, teacher_count: teachers.n })));
  }
  res.json(await all(`SELECT m.*, (r.read_at IS NOT NULL) AS is_read FROM memos m
                      LEFT JOIN memo_reads r ON r.memo_id = m.id AND r.user_id = ?
                      ORDER BY m.date DESC, m.time DESC`, [user.id]));
}));

app.get("/api/memos/:id/reads", requireRole("principal"), wrap(async (req, res) => {
  res.json(await all(`SELECT u.name, u.login_id, r.read_at FROM memo_reads r JOIN users u ON u.id = r.user_id
                      WHERE r.memo_id = ? ORDER BY r.read_at`, [req.params.id]));
}));

function readMemo(body, user) {
  const m = {
    sender: str(body.sender, 100) || user.name,
    recipient: str(body.recipient, 100) || "All Teachers",
    subject: str(body.subject, 200),
    title: str(body.title, 200),
    content: str(body.content, 10000),
    date: str(body.date, 10),
    time: str(body.time, 5),
    urgent: body.urgent ? 1 : 0,
  };
  if (!m.subject || !m.title || !m.content || !isDate(m.date)) return { error: "Subject, title, content and date are required." };
  if (!isTime(m.time)) return { error: "Time must be HH:MM." };
  return { m };
}

app.post("/api/memos", requireRole("principal"), wrap(async (req, res) => {
  const { m, error } = readMemo(req.body, req.session.user);
  if (error) return res.status(400).json({ error });
  const r = await run(
    "INSERT INTO memos (from_user, sender, recipient, subject, title, content, date, time, urgent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [req.session.user.id, m.sender, m.recipient, m.subject, m.title, m.content, m.date, m.time, m.urgent]
  );
  res.status(201).json({ id: r.id, message: "Memo posted." });
}));

app.put("/api/memos/:id", requireRole("principal"), wrap(async (req, res) => {
  const { m, error } = readMemo(req.body, req.session.user);
  if (error) return res.status(400).json({ error });
  const r = await run(
    "UPDATE memos SET sender = ?, recipient = ?, subject = ?, title = ?, content = ?, date = ?, time = ?, urgent = ? WHERE id = ?",
    [m.sender, m.recipient, m.subject, m.title, m.content, m.date, m.time, m.urgent, req.params.id]
  );
  if (!r.changes) return res.status(404).json({ error: "Memo not found." });
  res.json({ message: "Memo updated." });
}));

app.delete("/api/memos/:id", requireRole("principal"), wrap(async (req, res) => {
  const r = await run("DELETE FROM memos WHERE id = ?", [req.params.id]);
  if (!r.changes) return res.status(404).json({ error: "Memo not found." });
  res.json({ message: "Memo deleted." });
}));

app.post("/api/memos/:id/read", requireRole("teacher"), wrap(async (req, res) => {
  await run("INSERT OR IGNORE INTO memo_reads (memo_id, user_id) VALUES (?, ?)", [req.params.id, req.session.user.id]);
  res.json({ ok: true });
}));

// ---------------------------------------------------------------------------
// Contact messages (public in, principal reads)
// ---------------------------------------------------------------------------
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, message: { error: "Too many messages. Please try again later." } });

let mailer = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  mailer = require("nodemailer").createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

app.post("/api/contact", contactLimiter, wrap(async (req, res) => {
  const name = str(req.body.name, 100);
  const email = str(req.body.email, 200);
  const message = str(req.body.message, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return res.status(400).json({ error: "Please enter your name, a valid email and a message." });
  }
  await run("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
  if (mailer) {
    mailer
      .sendMail({
        from: process.env.GMAIL_USER,
        replyTo: email,
        to: process.env.CONTACT_INBOX || process.env.GMAIL_USER,
        subject: `CES website message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      })
      .catch((e) => console.error("Email notification failed:", e.message));
  }
  res.status(201).json({ message: "Thank you! Your message has been sent." });
}));

app.get("/api/messages", requireRole("principal"), wrap(async (req, res) => {
  res.json(await all("SELECT * FROM messages ORDER BY created_at DESC"));
}));
app.post("/api/messages/:id/read", requireRole("principal"), wrap(async (req, res) => {
  await run("UPDATE messages SET is_read = 1 WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
}));
app.delete("/api/messages/:id", requireRole("principal"), wrap(async (req, res) => {
  await run("DELETE FROM messages WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
}));

// ---------------------------------------------------------------------------
// Static files + errors
// ---------------------------------------------------------------------------
app.use(express.static(ROOT, { index: false }));

app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`✅ CES server running on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error("Database init failed:", e);
    process.exit(1);
  });
