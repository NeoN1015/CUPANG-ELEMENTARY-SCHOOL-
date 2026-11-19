// Principal-only panels: teacher/student accounts and the contact-message inbox.
(async function () {
  const { api, toast, h, ready } = window.CES;
  const user = await ready;
  if (!user || user.role !== "principal") return;

  // ---- Accounts ----
  const accForm = document.getElementById("accountForm");
  const accTable = document.getElementById("accountTable");
  const idLabel = document.getElementById("accountIdLabel");

  function syncRole() {
    const student = accForm.role.value === "student";
    idLabel.firstChild.textContent = student ? "LRN (12 digits)" : "Employee ID";
    accForm.login_id.pattern = student ? "\\d{12}" : ".*";
    accForm.login_id.inputMode = student ? "numeric" : "text";
  }
  accForm.role.addEventListener("change", syncRole);
  syncRole();

  async function loadAccounts() {
    let users;
    try {
      users = await api("/api/users");
    } catch (e) {
      return toast(e.message, true);
    }
    accTable.replaceChildren();
    if (!users.length) accTable.append(h("tr", {}, h("td", { colspan: 4, class: "empty" }, "No accounts yet.")));
    users.forEach((u) =>
      accTable.append(
        h("tr", {},
          h("td", {}, u.name),
          h("td", {}, h("span", { class: "badge" }, u.role)),
          h("td", {}, u.login_id),
          h("td", { class: "actions" },
            h("button", { class: "small danger", onclick: async () => {
              if (!confirm(`Remove ${u.name}'s account?`)) return;
              try { toast((await api(`/api/users/${u.id}`, { method: "DELETE" })).message); loadAccounts(); }
              catch (e) { toast(e.message, true); }
            } }, "Remove")))
      )
    );
  }

  accForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      toast((await api("/api/users", { method: "POST", body: Object.fromEntries(new FormData(accForm)) })).message);
      accForm.reset();
      syncRole();
      loadAccounts();
    } catch (err) {
      toast(err.message, true);
    }
  });

  // ---- Messages ----
  const msgList = document.getElementById("messageList");
  const msgBadge = document.getElementById("messageBadge");

  async function loadMessages() {
    let msgs;
    try {
      msgs = await api("/api/messages");
    } catch (e) {
      return toast(e.message, true);
    }
    const unread = msgs.filter((m) => !m.is_read).length;
    msgBadge.textContent = unread;
    msgBadge.hidden = unread === 0;
    msgList.replaceChildren();
    if (!msgs.length) return msgList.append(h("p", { class: "empty" }, "No messages from visitors yet."));
    msgs.forEach((m) =>
      msgList.append(
        h("article", { class: "memo" + (m.is_read ? "" : " unread") },
          h("h3", {}, m.name, m.is_read ? null : h("span", { class: "badge" }, "New")),
          h("div", { class: "meta" }, h("a", { href: `mailto:${m.email}` }, m.email), ` · ${m.created_at}`),
          h("div", { class: "body" }, m.message),
          h("div", { class: "foot" },
            h("span", { class: "spacer" }),
            m.is_read ? null : h("button", { class: "small secondary", onclick: async () => {
              await api(`/api/messages/${m.id}/read`, { method: "POST" }).catch((e) => toast(e.message, true));
              loadMessages();
            } }, "Mark as read"),
            h("button", { class: "small danger", onclick: async () => {
              if (!confirm("Delete this message?")) return;
              await api(`/api/messages/${m.id}`, { method: "DELETE" }).catch((e) => toast(e.message, true));
              loadMessages();
            } }, "Delete")))
      )
    );
  }

  loadAccounts();
  loadMessages();
})();
