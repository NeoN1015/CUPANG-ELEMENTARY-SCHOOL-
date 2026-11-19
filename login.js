// Role-based login panel shared by every public page.
// Principal: email + password | Teacher: employee ID + password | Student: LRN + password | Visitor: no login.
(function () {
  const ROLES = {
    principal: { label: "Principal", field: "Email address", type: "email", attrs: { autocomplete: "username" } },
    teacher: { label: "Teacher", field: "Employee ID", type: "text", attrs: { autocomplete: "username" } },
    student: {
      label: "Student",
      field: "LRN (12-digit Learner Reference Number)",
      type: "text",
      attrs: { inputmode: "numeric", pattern: "\\d{12}", maxlength: "12", title: "12-digit LRN", autocomplete: "username" },
    },
  };

  const panel = document.querySelector(".account-form");
  if (!panel) return;

  panel.innerHTML = `
    <button type="button" id="close-form" aria-label="Close login"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    <form class="login-form active" id="loginForm" novalidate>
      <h3>Log in</h3>
      <div class="role-tabs" role="tablist">
        ${Object.entries(ROLES)
          .map(([k, r], i) => `<button type="button" role="tab" class="role-tab${i === 0 ? " active" : ""}" data-role="${k}" aria-selected="${i === 0}">${r.label}</button>`)
          .join("")}
      </div>
      <label class="role-label" for="login-id"></label>
      <input id="login-id" name="login_id" class="box" required>
      <input id="login-password" type="password" name="password" placeholder="Password" class="box" autocomplete="current-password" required>
      <p class="login-message" role="alert"></p>
      <button type="submit" class="btn">Log in</button>
      <p class="login-hint">No account? Teacher and student accounts are created by the principal.</p>
      <button type="button" class="btn visitor-btn">Continue as visitor</button>
    </form>
    <div class="logged-in" hidden>
      <h3>Welcome back</h3>
      <p class="who"></p>
      <a class="btn dash-link" href="#">Go to dashboard</a>
      <button type="button" class="btn logout-btn">Logout</button>
    </div>`;

  const form = panel.querySelector("#loginForm");
  const idInput = panel.querySelector("#login-id");
  const label = panel.querySelector(".role-label");
  const msg = panel.querySelector(".login-message");
  let role = "principal";

  function setRole(next) {
    role = next;
    const r = ROLES[role];
    panel.querySelectorAll(".role-tab").forEach((t) => {
      const on = t.dataset.role === role;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
    });
    label.textContent = r.field;
    idInput.type = r.type;
    idInput.placeholder = r.field;
    ["inputmode", "pattern", "maxlength", "title"].forEach((a) => idInput.removeAttribute(a));
    Object.entries(r.attrs).forEach(([a, v]) => idInput.setAttribute(a, v));
    idInput.value = "";
    msg.textContent = "";
  }

  panel.querySelectorAll(".role-tab").forEach((t) => t.addEventListener("click", () => setRole(t.dataset.role)));
  setRole("principal");

  const close = () => panel.classList.remove("active");
  panel.querySelector("#close-form").addEventListener("click", close);
  panel.querySelector(".visitor-btn").addEventListener("click", close);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    if (!idInput.value.trim() || !form.password.value) {
      msg.textContent = "Please fill in all fields.";
      return;
    }
    if (role === "student" && !/^\d{12}$/.test(idInput.value.trim())) {
      msg.textContent = "LRN must be exactly 12 digits.";
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, login_id: idInput.value.trim(), password: form.password.value }),
      });
      const data = await res.json();
      if (!res.ok) {
        msg.textContent = data.error || "Login failed.";
        return;
      }
      window.location.href = data.redirect;
    } catch {
      msg.textContent = "Cannot reach the server. Start it with 'npm start' and open http://localhost:3000";
    }
  });

  // Show "logged in" state if a session already exists.
  fetch("/api/me")
    .then((r) => r.json())
    .then(({ user }) => {
      if (!user) {
        if (new URLSearchParams(location.search).get("login") === "required") {
          panel.classList.add("active");
          msg.textContent = "Please log in to continue.";
        }
        return;
      }
      form.classList.remove("active");
      const box = panel.querySelector(".logged-in");
      box.hidden = false;
      box.querySelector(".who").textContent = `${user.name} (${user.role})`;
      const dash = box.querySelector(".dash-link");
      if (user.role === "principal") dash.href = "/principal";
      else if (user.role === "teacher") dash.href = "/teacher";
      else dash.hidden = true;
      box.querySelector(".logout-btn").addEventListener("click", async () => {
        await fetch("/api/logout", { method: "POST" });
        location.reload();
      });
    })
    .catch(() => {});
})();
