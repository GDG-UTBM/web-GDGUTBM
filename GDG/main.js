document.addEventListener("DOMContentLoaded", () => {
  // ===== Drawer (menu mobile)
  const burger = document.querySelector(".burger");
  const drawer = document.getElementById("mobileMenu");
  if (burger && drawer) {
    const closeTargets = drawer.querySelectorAll("[data-close]");
    const links = drawer.querySelectorAll("a");

    const open = () => {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    burger.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      isOpen ? close() : open();
    });

    closeTargets.forEach((el) => el.addEventListener("click", close));
    links.forEach((a) => a.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // ===== Hero slider
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  if (slides.length) {
    let i = slides.findIndex((s) => s.classList.contains("is-active"));
    if (i < 0) i = 0;

    window.setInterval(() => {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 6500);
  }
});




// ===== Partners carousel + progress highlight =====
(() => {
  const track = document.getElementById("partnersTrack");
  const link = document.querySelector(".proof-partner-link");
  const nameEl = document.querySelector(".proof-partner-name");

  if (!track || !link || !nameEl) return;

  const items = Array.from(track.querySelectorAll(".partner"));
  if (!items.length) return;
  const section = document.querySelector(".proof-partners-section");


  let index = 0;
  const stepMs = 3200;
  let timer = null;

  const setActive = (i) => {
    section?.classList.add("is-switching");

    window.setTimeout(() => {
      items.forEach((el) => el.classList.remove("is-active"));
      const el = items[i];
      el.classList.add("is-active");

      const nm = el.getAttribute("data-name") || "Partenaire";
      const url = el.getAttribute("data-url") || "#";

      nameEl.textContent = nm;
      link.href = url;
      link.setAttribute("aria-label", `Visiter le site de ${nm}`);

      section?.classList.remove("is-switching");
    }, 120);
  };


  items.forEach((el, i) => {
    el.addEventListener("click", () => {
      index = i;
      setActive(index);
      restart();
    });
  });

  const tick = () => {
    index = (index + 1) % items.length;
    setActive(index);
  };

  const restart = () => {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(tick, stepMs);
  };

  // init
  setActive(index);
  restart();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (timer) window.clearInterval(timer);
      timer = null;
    } else {
      restart();
    }
  });
})();


// ===== Events carousel (center + side) =====
(() => {
  const track = document.getElementById("eventsTrack");
  const viewport = document.getElementById("eventsViewport");
  const prev = document.querySelector(".events-nav--prev");
  const next = document.querySelector(".events-nav--next");

  if (!track || !viewport) return;

  const slides = Array.from(track.querySelectorAll(".event-slide"));
  if (!slides.length) return;

  let index = 0;

  const applyActive = () => {
    slides.forEach((s) => s.classList.remove("is-active"));
    slides[index].classList.add("is-active");
  };

  const getStep = () => {
    const slide = slides[0];
    const slideWidth = slide.getBoundingClientRect().width;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return slideWidth + gap;
  };

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    applyActive();

    const viewportRect = viewport.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();

    const slide = slides[index];
    const slideRect = slide.getBoundingClientRect();

    const slideCenterInViewport =
      (slideRect.left - viewportRect.left) + (slideRect.width / 2);

    const dx = slideCenterInViewport - (viewportRect.width / 2);

    const currentTransform = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    let currentX = currentTransform.m41;

    let targetX = currentX - dx;

    const maxLeft = 0;
    const maxRight = viewportRect.width - track.scrollWidth;

    if (targetX > maxLeft) targetX = maxLeft;
    if (targetX < maxRight) targetX = maxRight;

    track.style.transform = `translateX(${targetX}px)`;
  };



  prev?.addEventListener("click", () => go(index - 1));
  next?.addEventListener("click", () => go(index + 1));

  // ===== Drag / swipe (mobile + desktop)
  let isDragging = false;
  let pointerId = null;
  let startX = 0;
  let startTranslate = 0;
  let lastX = 0;
  let lastT = 0;

  const getTranslateX = () => {
    const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    return m.m41 || 0;
  };

  const setTranslateX = (x) => {
    track.style.transform = `translateX(${x}px)`;
  };

  const clampTranslate = (x) => {
    const viewportW = viewport.getBoundingClientRect().width;
    const maxLeft = 0;
    const maxRight = viewportW - track.scrollWidth;
    if (x > maxLeft) x = maxLeft;
    if (x < maxRight) x = maxRight;
    return x;
  };

  let moved = false;

  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDragging = true;
    moved = false;
    pointerId = e.pointerId;

    startX = e.clientX;
    lastX = startX;

    startTranslate = getTranslateX();
    lastT = startTranslate;

    track.style.transition = "none";

    viewport.setPointerCapture(pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isDragging || e.pointerId !== pointerId) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;

    const nextT = clampTranslate(startTranslate + dx);
    setTranslateX(nextT);

    const nowX = e.clientX;
    lastT = nextT;
    lastX = nowX;
  });

  const finishDrag = () => {
    if (!isDragging) return;
    isDragging = false;

    track.style.transition = "transform 520ms cubic-bezier(.2,.8,.2,1)";

    const endTranslate = getTranslateX();
    const delta = endTranslate - startTranslate;

    const threshold = Math.min(120, viewport.getBoundingClientRect().width * 0.18);

    if (Math.abs(delta) > threshold) {
      if (delta < 0) go(index + 1);
      else go(index - 1);
    } else {
      go(index);
    }
  };

  viewport.addEventListener("pointerup", (e) => {
    if (e.pointerId !== pointerId) return;
    finishDrag();
  });

  viewport.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== pointerId) return;
    finishDrag();
  });

  viewport.addEventListener("click", (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);


  window.addEventListener("resize", () => go(index));

  // init
  go(0);
})();

// ===== HERO floating shapes  =====
(() => {
  const root = document.querySelector(".hero--panorama");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const shapes = Array.from(root.querySelectorAll(".hero-float .gshape"));
  if (!shapes.length) return;

  const params = shapes.map((el, idx) => {
    const ax = 10 + (idx % 3) * 4;     // 10..18
    const ay = 12 + ((idx + 1) % 4) * 3; // 12..21

    const sx = 0.00055 + idx * 0.00007;
    const sy = 0.00062 + idx * 0.00006;

    const px = (idx * 1.7) % (Math.PI * 2);
    const py = (idx * 2.3) % (Math.PI * 2);

    const rot = 1.2 + (idx % 3) * 0.4;
    return { el, ax, ay, sx, sy, px, py, rot };
  });

  let raf = 0;

  const animate = (t) => {
    for (const p of params) {
      const x =
        p.ax * Math.sin(t * p.sx + p.px) +
        (p.ax * 0.35) * Math.sin(t * (p.sx * 1.9) + p.py);

      const y =
        p.ay * Math.sin(t * p.sy + p.py) +
        (p.ay * 0.35) * Math.sin(t * (p.sy * 1.7) + p.px);
      const r = p.rot * Math.sin(t * (p.sy * 0.9) + p.px);

      p.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg)`;
    }

    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);

  // stop propre si la page est cachée
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(animate);
    }
  });
})();
