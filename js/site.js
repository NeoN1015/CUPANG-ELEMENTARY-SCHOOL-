// Shared behaviour for the public pages.
(function () {
  // Mobile menu
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
    });
  }

  // Login drawer (contents built by login.js)
  const drawer = document.querySelector(".account-form");
  document.querySelectorAll("[data-open-login]").forEach((b) =>
    b.addEventListener("click", () => {
      drawer.classList.add("active");
      const first = drawer.querySelector(".role-tab.active, .logged-in a, button");
      if (first) setTimeout(() => first.focus(), 50);
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("active")) drawer.classList.remove("active");
  });

  // Signature: window bays open like shutters the first time they enter view.
  // Hidden elements are clipped, and a fully clipped element never reports as
  // visible, so we watch each one's unclipped parent instead.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-motion");
    const waiting = new Map(); // parent -> [[el, hiddenClass, shownClass]]
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          (waiting.get(en.target) || []).forEach(([el, hide, show]) => {
            if (hide) el.classList.remove(hide);
            if (show) el.classList.add(show);
          });
          waiting.delete(en.target);
          io.unobserve(en.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const hold = (el, hide, show) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return; // already on screen: leave visible
      const parent = el.parentElement;
      if (hide) el.classList.add(hide);
      else el.classList.add(show === "in" ? el.dataset.motion : "");
      if (!waiting.has(parent)) { waiting.set(parent, []); io.observe(parent); }
      waiting.get(parent).push([el, hide, show]);
    };
    document.querySelectorAll("[data-shutters] .bay").forEach((b) => hold(b, "shut", null));
    // Headings paint on, text blocks rise.
    document.querySelectorAll(".section-head h2, .split h2, .rail-year, .values-board strong").forEach((el) => { el.dataset.motion = "reveal"; hold(el, null, "in"); });
    document.querySelectorAll(".section-head p, .lede, .rail-stop p, .records li, .values-board span, .span-photo, .feature").forEach((el) => { el.dataset.motion = "rise"; hold(el, null, "in"); });
  }

  // "View photo" buttons on the Facilities page open the matching photo.
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      const img = b.closest(".fac-row")?.querySelector(".fac-photo img");
      if (img) img.click();
    })
  );

  // Photo viewer: tap any photo or poster to see it full size.
  const viewer = document.createElement("dialog");
  viewer.className = "viewer";
  viewer.setAttribute("aria-label", "Photo viewer");
  viewer.innerHTML = '<button type="button" class="viewer-close" aria-label="Close photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.append(viewer);
  const vImg = viewer.querySelector("img");
  const vCap = viewer.querySelector("figcaption");
  viewer.querySelector(".viewer-close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => { if (e.target === viewer || e.target.tagName === "FIGURE") viewer.close(); });
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".bay.photo img, .span-photo img, [data-zoom] img");
    if (!img || !viewer.showModal) return;
    e.preventDefault();
    vImg.src = img.currentSrc || img.src;
    vImg.alt = img.alt;
    const cap = img.closest("figure, .feature")?.querySelector("figcaption");
    vCap.textContent = img.dataset.caption || (cap ? cap.textContent : img.alt);
    viewer.showModal();
  });

  // Home: the next three events, with today marked.
  const list = document.getElementById("next-events");
  if (list) {
    const pad = (n) => String(n).padStart(2, "0");
    const now = new Date();
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const fmtTime = (t) => {
      if (!t) return "All day";
      const [h, m] = t.split(":");
      const n = parseInt(h, 10);
      return `${n % 12 || 12}:${m} ${n >= 12 ? "PM" : "AM"}`;
    };
    fetch("api/events")
      .then((r) => (r.ok ? r.json() : []))
      .then((events) => {
        const upcoming = events.filter((e) => e.date >= today).slice(0, 3);
        list.replaceChildren();
        if (!upcoming.length) {
          const li = document.createElement("li");
          li.className = "next-empty";
          li.textContent = "No upcoming events posted yet. Check back soon.";
          list.append(li);
          return;
        }
        upcoming.forEach((e) => {
          const d = new Date(`${e.date}T00:00`);
          const li = document.createElement("li");
          if (e.date === today) li.classList.add("is-today");
          const day = document.createElement("span");
          day.className = "day";
          day.textContent = pad(d.getDate());
          const body = document.createElement("div");
          const when = document.createElement("span");
          when.className = "when";
          when.textContent = `${d.toLocaleDateString("en-US", { month: "short", weekday: "short" })} · ${fmtTime(e.time)}`;
          const what = document.createElement("span");
          what.className = "what";
          what.textContent = e.name;
          body.append(when, what);
          li.append(day, body);
          list.append(li);
        });
      })
      .catch(() => {
        list.replaceChildren();
        const li = document.createElement("li");
        li.className = "next-empty";
        li.textContent = "The calendar could not be loaded right now.";
        list.append(li);
      });
  }
})();
