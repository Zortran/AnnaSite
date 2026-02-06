(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ===== Reveal on scroll (тихо и плавно) =====
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.14 });

  revealEls.forEach(el => io.observe(el));

  // ===== Parallax фона (очень мягкий) =====
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parallaxSections = Array.from(document.querySelectorAll("[data-parallax] .bg-pattern"));

  function onScroll() {
    if (prefersReduced) return;
    const y = window.scrollY || 0;
    // очень мягко, без резких смещений
    const offset = Math.max(-40, Math.min(40, (y - 200) * 0.02));
    for (const el of parallaxSections) {
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== “Интерактивная типографика” на скролле (деликатно) =====
  const h1 = document.querySelector(".h1");
  function typeShift() {
    if (!h1 || prefersReduced) return;
    const y = window.scrollY || 0;
    const k = Math.max(-0.8, Math.min(0.8, (y - 120) * 0.0012));
    h1.style.letterSpacing = `${-0.02 + k * 0.006}em`;
  }
  window.addEventListener("scroll", typeShift, { passive: true });
  typeShift();

  // ===== Контакт-форма (демо): без внешних сервисов =====
  // Здесь мы не отправляем данные, чтобы не привязываться к заблокированным платформам.
  // Подключите свой endpoint (/api/contact) на вашем сервере.
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (note) note.textContent = "Отправка…";

      const fd = new FormData(form);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        contact: String(fd.get("contact") || "").trim(),
        message: String(fd.get("message") || "").trim()
      };

      // Мини-валидация
      if (!payload.name || !payload.contact || !payload.message) {
        if (note) note.textContent = "Пожалуйста, заполните все поля.";
        return;
      }

      try {
        // ВАРИАНТ 1 (рекомендуется): ваш серверный endpoint
        // const res = await fetch("/api/contact", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload)
        // });
        // if (!res.ok) throw new Error("Bad response");

        // Демо-режим:
        await new Promise(r => setTimeout(r, 450));

        if (note) note.textContent = "Спасибо. Я вернусь с ответом по указанному контакту.";
        form.reset();
      } catch (err) {
        if (note) note.textContent = "Не удалось отправить. Попробуйте позже или свяжитесь напрямую.";
      }
    });
  }
})();
