// Public (visitor/student) event calendar - read only.
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("event-calendar");
    const eventTable = document.getElementById("eventTable");
    if (!calendarEl || !window.FullCalendar) return;

    const CATEGORY_COLORS = {
        General: "#1f5a32", Holiday: "#a3332a", Exam: "#5b4a8a", PTA: "#7a4a2a", Program: "#8a6410",
    };

    const calendar = new FullCalendar.Calendar(calendarEl, {
        allDayText: "All day",
        initialView: window.matchMedia("(max-width: 640px)").matches ? "listMonth" : "dayGridMonth",
        height: "auto",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listMonth",
        },
        eventTimeFormat: (a) => `${a.date.hour % 12 || 12}:${String(a.date.minute).padStart(2, "0")} ${a.date.hour >= 12 ? "PM" : "AM"}`,
        eventClick: (info) => {
            info.jsEvent.preventDefault();
            const panel = document.getElementById("event-detail");
            if (!panel) return;
            panel.querySelector("h4").textContent = info.event.title;
            panel.querySelector(".when").textContent = info.event.start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) +
                (info.event.allDay ? " · All day" : " · " + info.event.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
            panel.querySelector(".desc").textContent = info.event.extendedProps.description || "No further details.";
            panel.hidden = false;
            panel.focus();
        },
    });
    calendar.render();

    function formatTime(t) {
        if (!t) return "All day";
        const [h, m] = t.split(":");
        const hour = parseInt(h, 10);
        return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
    }

    fetch("api/events")
        .then((res) => (res.ok ? res.json() : []))
        .then((events) => {
            if (eventTable) {
                eventTable.innerHTML = "";
                if (!events.length) eventTable.innerHTML = '<tr><td colspan="4" class="muted">No events posted yet.</td></tr>';
            }
            events.forEach((event) => {
                calendar.addEvent({
                    id: event.id,
                    title: event.name,
                    start: event.time ? `${event.date}T${event.time}` : event.date,
                    end: event.time && event.endTime ? `${event.date}T${event.endTime}` : undefined,
                    allDay: !event.time,
                    color: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General,
                    extendedProps: { description: event.description || "" },
                });
                if (eventTable) {
                    const row = eventTable.insertRow();
                    row.insertCell(0).textContent = event.name;
                    row.insertCell(1).textContent = new Date(`${event.date}T00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    row.insertCell(2).textContent = event.endTime
                        ? `${formatTime(event.time)} - ${formatTime(event.endTime)}`
                        : formatTime(event.time);
                    row.insertCell(3).textContent = event.description || "—";
                }
            });
        })
        .catch((error) => console.error("Error fetching events:", error));
});
