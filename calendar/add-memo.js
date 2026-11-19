// Principal memo management: create, edit, delete, see who has read each memo.
(async function () {
  const { api, toast, h, formatTime, formatDate, ready } = window.CES;
  const user = await ready;
  if (!user || user.role !== "principal") return;

  const form = document.getElementById("memoForm");
  const list = document.getElementById("memoList");
  const cancelBtn = document.getElementById("memoCancel");
  let editingId = null;

  function resetForm() {
    editingId = null;
    form.reset();
    form.sender.value = user.name;
    form.recipient.value = "All Teachers";
    form.date.value = new Date().toISOString().slice(0, 10);
    document.getElementById("memoFormTitle").textContent = "New memo";
    form.querySelector("[type=submit]").textContent = "Post memo";
    cancelBtn.hidden = true;
  }

  async function load() {
    let memos;
    try {
      memos = await api("/api/memos");
    } catch (e) {
      return toast(e.message, true);
    }
    list.replaceChildren();
    if (!memos.length) return list.append(h("p", { class: "empty" }, "No memos yet. Post one using the form."));
    memos.forEach((m) => {
      const readsBox = h("div", { hidden: true, style: "margin-top:8px;font-size:13px" });
      list.append(
        h("article", { class: "memo" + (m.urgent ? " urgent" : "") },
          h("h3", {}, m.title, m.urgent ? h("span", { class: "badge urgent" }, "Urgent") : null),
          h("div", { class: "meta" },
            `From ${m.sender} · To ${m.recipient} · ${formatDate(m.date)}${m.time ? " " + formatTime(m.time) : ""}`),
          h("div", { class: "meta" }, h("strong", {}, "Subject: "), m.subject),
          h("div", { class: "body" }, m.content),
          h("div", { class: "foot" },
            h("button", { class: "small secondary", onclick: () => toggleReads(m, readsBox) }, `Read by ${m.read_count} of ${m.teacher_count}`),
            h("span", { class: "spacer" }),
            h("button", { class: "small secondary", onclick: () => edit(m) }, "Edit"),
            h("button", { class: "small danger", onclick: () => remove(m) }, "Delete")),
          readsBox)
      );
    });
  }

  async function toggleReads(m, box) {
    if (!box.hidden) return (box.hidden = true);
    try {
      const reads = await api(`/api/memos/${m.id}/reads`);
      box.replaceChildren(
        reads.length
          ? h("ul", { style: "padding-left:18px" }, reads.map((r) => h("li", {}, `${r.name} (${r.login_id}) — ${r.read_at}`)))
          : "No teacher has opened this memo yet."
      );
      box.hidden = false;
    } catch (e) {
      toast(e.message, true);
    }
  }

  function edit(m) {
    editingId = m.id;
    ["sender", "recipient", "subject", "title", "content", "date", "time"].forEach((k) => (form[k].value = m[k] || ""));
    form.urgent.checked = !!m.urgent;
    document.getElementById("memoFormTitle").textContent = "Edit memo";
    form.querySelector("[type=submit]").textContent = "Save changes";
    cancelBtn.hidden = false;
    form.scrollIntoView({ behavior: "smooth" });
  }

  async function remove(m) {
    if (!confirm(`Delete memo "${m.title}"?`)) return;
    try {
      toast((await api(`/api/memos/${m.id}`, { method: "DELETE" })).message);
      if (editingId === m.id) resetForm();
      load();
    } catch (e) {
      toast(e.message, true);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(form));
    body.urgent = form.urgent.checked;
    try {
      const r = await api(editingId ? `/api/memos/${editingId}` : "/api/memos", { method: editingId ? "PUT" : "POST", body });
      toast(r.message);
      resetForm();
      load();
    } catch (err) {
      toast(err.message, true);
    }
  });
  cancelBtn.addEventListener("click", resetForm);

  resetForm();
  load();
})();
