// Events panel shared by the principal and teacher dashboards.
// Principal: add/edit/delete any event, approve teacher events.
// Teacher: add events (pending approval), edit/delete only their own.
(async function () {
  const { api, toast, h, formatTime, formatDate, ready } = window.CES;
  const user = await ready;
  if (!user) return;

  const CATEGORY_COLORS = { General: "#1f5a32", Holiday: "#a3332a", Exam: "#5b4a8a", PTA: "#7a4a2a", Program: "#8a6410", };
  const table = document.getElementById("eventTable");
  const modal = document.getElementById("eventModal");
  const form = document.getElementById("eventForm");
  const filter = document.getElementById("eventFilter");
  let events = [];
  let editingId = null;

  const canEdit = (ev) => user.role === "principal" || ev.created_by === user.id;

  const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    allDayText: "All day",
    initialView: window.matchMedia("(max-width: 640px)").matches ? "listMonth" : "dayGridMonth",
    height: "auto",
    headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,listMonth" },
    eventTimeFormat: (a) => `${a.date.hour % 12 || 12}:${String(a.date.minute).padStart(2, "0")} ${a.date.hour >= 12 ? "PM" : "AM"}`,
    dateClick: (info) => openModal(null, info.dateStr),
    eventClick: (info) => {
      const ev = events.find((e) => String(e.id) === info.event.id);
      if (ev && canEdit(ev)) openModal(ev);
      else if (ev) toast(`${ev.name}${ev.description ? " — " + ev.description : ""}`);
    },
  });
  calendar.render();

  async function load() {
    try {
      events = await api("/api/events");
    } catch (e) {
      return toast(e.message, true);
    }
    render();
  }

  function render() {
    const mode = filter ? filter.value : "all";
    const shown = events.filter((e) =>
      mode === "pending" ? e.status === "pending" : mode === "mine" ? e.created_by === user.id : true
    );

    calendar.removeAllEvents();
    events.forEach((e) =>
      calendar.addEvent({
        id: String(e.id),
        title: (e.status === "pending" ? "⏳ " : "") + e.name,
        start: e.time ? `${e.date}T${e.time}` : e.date,
        end: e.time && e.endTime ? `${e.date}T${e.endTime}` : undefined,
        allDay: !e.time,
        color: e.status === "pending" ? "#b9770e" : CATEGORY_COLORS[e.category] || CATEGORY_COLORS.General,
      })
    );

    table.replaceChildren();
    if (!shown.length) {
      table.append(h("tr", {}, h("td", { colspan: 5, class: "empty" }, "No events to show.")));
    }
    shown.forEach((e) => {
      const time = e.time ? `${formatTime(e.time)}${e.endTime ? " – " + formatTime(e.endTime) : ""}` : "All day";
      const actions = h("td", { class: "actions" });
      if (user.role === "principal" && e.status === "pending") {
        actions.append(h("button", { class: "small", onclick: () => approve(e) }, "Approve"));
      }
      if (canEdit(e)) {
        actions.append(
          h("button", { class: "small secondary", onclick: () => openModal(e) }, "Edit"),
          h("button", { class: "small danger", onclick: () => remove(e) }, "Delete")
        );
      }
      table.append(
        h("tr", {},
          h("td", {}, h("strong", {}, e.name), h("br"),
            h("span", { class: "badge" + (e.status === "pending" ? " pending" : "") }, e.status === "pending" ? "Pending approval" : e.category || "General"),
            e.created_by_name ? h("div", { class: "meta", style: "font-size:12px;color:var(--muted);margin-top:4px" }, `by ${e.created_by_name}`) : null),
          h("td", {}, formatDate(e.date)),
          h("td", {}, time),
          h("td", {}, e.description || "—"),
          actions)
      );
    });

    const pendingCount = events.filter((e) => e.status === "pending").length;
    const badge = document.getElementById("pendingBadge");
    if (badge) {
      badge.textContent = pendingCount;
      badge.hidden = pendingCount === 0;
    }
  }

  function openModal(ev, date) {
    editingId = ev ? ev.id : null;
    form.reset();
    document.getElementById("modalTitle").textContent = ev ? "Edit event" : "Add event";
    form.name.value = ev ? ev.name : "";
    form.date.value = ev ? ev.date : date || "";
    form.time.value = ev ? ev.time || "" : "";
    form.endTime.value = ev ? ev.endTime || "" : "";
    form.category.value = ev ? ev.category || "General" : "General";
    form.description.value = ev ? ev.description || "" : "";
    const note = document.getElementById("approvalNote");
    if (note) note.hidden = user.role !== "teacher";
    modal.showModal();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(form));
    try {
      const r = await api(editingId ? `/api/events/${editingId}` : "/api/events", {
        method: editingId ? "PUT" : "POST",
        body,
      });
      toast(r.message);
      modal.close();
      load();
    } catch (err) {
      toast(err.message, true);
    }
  });

  async function remove(ev) {
    if (!confirm(`Delete "${ev.name}"?`)) return;
    try {
      toast((await api(`/api/events/${ev.id}`, { method: "DELETE" })).message);
      load();
    } catch (err) {
      toast(err.message, true);
    }
  }

  async function approve(ev) {
    try {
      toast((await api(`/api/events/${ev.id}/approve`, { method: "POST" })).message);
      load();
    } catch (err) {
      toast(err.message, true);
    }
  }

  document.getElementById("openModalBtn").addEventListener("click", () => openModal(null));
  document.querySelectorAll("[data-close-event]").forEach((b) => b.addEventListener("click", () => modal.close()));
  if (filter) filter.addEventListener("change", render);

  load();
})();
