// Teacher memo inbox: read-only, with unread markers and read receipts.
(async function () {
  const { api, toast, h, formatTime, formatDate, ready } = window.CES;
  const user = await ready;
  if (!user || user.role !== "teacher") return;

  const list = document.getElementById("memoList");
  const badge = document.getElementById("unreadBadge");
  let memos = [];

  function updateBadge() {
    const n = memos.filter((m) => !m.is_read).length;
    badge.textContent = n;
    badge.hidden = n === 0;
  }

  async function markRead(m, el) {
    if (m.is_read) return;
    try {
      await api(`/api/memos/${m.id}/read`, { method: "POST" });
      m.is_read = 1;
      el.classList.remove("unread");
      el.querySelector(".mark").replaceWith(h("span", {}, "✓ Read"));
      updateBadge();
    } catch (e) {
      toast(e.message, true);
    }
  }

  try {
    memos = await api("/api/memos");
  } catch (e) {
    return toast(e.message, true);
  }

  list.replaceChildren();
  if (!memos.length) list.append(h("p", { class: "empty" }, "No memos from the principal yet."));
  memos.forEach((m) => {
    const el = h("article", { class: "memo" + (m.urgent ? " urgent" : "") + (m.is_read ? "" : " unread") },
      h("h3", {}, m.title,
        m.urgent ? h("span", { class: "badge urgent" }, "Urgent") : null,
        m.is_read ? null : h("span", { class: "badge" }, "New")),
      h("div", { class: "meta" }, `From ${m.sender} · To ${m.recipient} · ${formatDate(m.date)}${m.time ? " " + formatTime(m.time) : ""}`),
      h("div", { class: "meta" }, h("strong", {}, "Subject: "), m.subject),
      h("div", { class: "body" }, m.content),
      h("div", { class: "foot" },
        m.is_read ? h("span", {}, "✓ Read") : h("button", { class: "small mark", onclick: () => markRead(m, el) }, "Mark as read")));
    list.append(el);
  });
  updateBadge();
})();
