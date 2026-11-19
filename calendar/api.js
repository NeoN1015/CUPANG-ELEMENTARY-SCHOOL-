// Shared helpers for the principal and teacher dashboards.
window.CES = (function () {
  async function api(url, options = {}) {
    const opts = { ...options, headers: { ...(options.headers || {}) } };
    if (opts.body && typeof opts.body !== "string") {
      opts.body = JSON.stringify(opts.body);
      opts.headers["Content-Type"] = "application/json";
    }
    const res = await fetch(url, opts);
    if (res.status === 401) {
      location.href = "/home.html?login=required";
      throw new Error("Please log in");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  let toastTimer;
  function toast(message, isError = false) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.toggle("error", isError);
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
  }

  // Build DOM safely (text only, never innerHTML with user data).
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "class") el.className = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    children.flat().forEach((c) => c != null && c !== false && el.append(c instanceof Node ? c : String(c)));
    return el;
  }

  function formatTime(t) {
    if (!t) return "";
    const [hh, mm] = t.split(":");
    const n = parseInt(hh, 10);
    return `${n % 12 || 12}:${mm} ${n >= 12 ? "PM" : "AM"}`;
  }
  function formatDate(d) {
    if (!d) return "";
    return new Date(`${d}T00:00`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  const ready = (async () => {
    const { user } = await api("/api/me");
    if (!user) {
      location.href = "/home.html?login=required";
      return null;
    }
    document.querySelectorAll("[data-user-name]").forEach((el) => (el.textContent = user.name));
    document.querySelectorAll("[data-logout]").forEach((b) =>
      b.addEventListener("click", async () => {
        await api("/api/logout", { method: "POST" });
        location.href = "/home.html";
      })
    );
    document.querySelectorAll("[data-change-password]").forEach((b) => b.addEventListener("click", changePassword));
    return user;
  })();

  function changePassword() {
    const dlg = h("dialog", {},
      h("h2", {}, "Change password"),
      h("form", { class: "stack", method: "dialog" },
        h("label", {}, "Current password", h("input", { type: "password", name: "current", required: true, autocomplete: "current-password" })),
        h("label", {}, "New password (min 8 characters)", h("input", { type: "password", name: "next", required: true, minlength: "8", autocomplete: "new-password" })),
        h("div", { class: "buttons" },
          h("button", { type: "button", class: "secondary", onclick: () => dlg.close() }, "Cancel"),
          h("button", { type: "submit" }, "Save"))
      )
    );
    dlg.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      try {
        const r = await api("/api/me/password", { method: "POST", body: { current: f.current.value, next: f.next.value } });
        toast(r.message);
        dlg.close();
      } catch (err) {
        toast(err.message, true);
      }
    });
    dlg.addEventListener("close", () => dlg.remove());
    document.body.appendChild(dlg);
    dlg.showModal();
  }

  return { api, toast, h, formatTime, formatDate, ready };
})();
