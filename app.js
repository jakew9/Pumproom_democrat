// @ts-check
(() => {
  const data = /** @type {any} */ (window).SITE_CONTENT;
  if (!data) return;

  /** @param {string} id @param {string} value */
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.textContent = value;
  };

  /** @param {number} v @param {number} min @param {number} max */
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /** @param {number} edge0 @param {number} edge1 @param {number} v */
  const smoothstep = (edge0, edge1, v) => {
    const t = clamp((v - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  // 1. Static brand copy
  setText("nav-brand-name", data.brand.name);
  setText("nav-brand-domain", data.brand.domain);
  setText("hero-status", data.brand.statusLabel);
  setText("hero-title", data.brand.tagline);
  setText("hero-description", data.brand.description);
  setText("footer-brand", data.brand.name);
  setText("footer-domain", data.brand.domain);
  setText("current-year", String(new Date().getFullYear()));

  // 2. Existing build detail modal
  const modalBackdrop = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close");
  /** @type {HTMLElement | null} */
  let lastFocused = null;

  /** @param {any} project */
  function openProjectModal(project) {
    if (!modalBackdrop) return;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    setText("modal-category", project.categoryLabel || "");
    setText("modal-title", project.title);
    setText("modal-date", project.date || "");
    setText("modal-summary", project.summary);
    setText("modal-details", project.details || "");

    const statusEl = document.getElementById("modal-status");
    if (statusEl) {
      statusEl.className = `status-badge status-${project.statusTone || "amber"}`;
      statusEl.textContent = project.status;
    }

    const visualWrap = document.getElementById("modal-visual");
    if (visualWrap) {
      visualWrap.innerHTML = "";
      visualWrap.className = `modal-visual card-visual visual-${project.visualStyle || "broadcast"}`;
      if (project.image) {
        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;
        visualWrap.appendChild(img);
      }
    }

    const tagsEl = document.getElementById("modal-tags");
    if (tagsEl) {
      tagsEl.innerHTML = "";
      (project.tags || []).forEach((/** @type {string} */ t) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = t;
        tagsEl.appendChild(tag);
      });
    }

    const actionsEl = document.getElementById("modal-actions");
    if (actionsEl) {
      actionsEl.innerHTML = "";
      (project.links || [])
        .filter((/** @type {any} */ l) => Boolean(l.href))
        .forEach((/** @type {any} */ link) => {
          const a = document.createElement("a");
          a.href = link.href;
          a.className = "btn btn-sm btn-primary";
          a.textContent = link.label;
          if (/^https?:\/\//.test(link.href)) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          actionsEl.appendChild(a);
        });

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "btn btn-sm btn-outline";
      closeBtn.textContent = "Close";
      closeBtn.addEventListener("click", closeProjectModal);
      actionsEl.appendChild(closeBtn);
    }

    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    modalCloseBtn?.focus();
  }

  function closeProjectModal() {
    if (!modalBackdrop || modalBackdrop.hidden) return;
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
    lastFocused?.focus();
  }

  modalCloseBtn?.addEventListener("click", closeProjectModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeProjectModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });

  // 3. Sticky Stage + Scroll Scrubbing for NOW ON THE BENCH
  const stages =
    Array.isArray(data.benchStages) && data.benchStages.length > 0
      ? data.benchStages
      : [{ index: "01", ...data.featured }];

  let activeStageIdx = 0;
  let activeProjectId = stages[0].projectId;

  /** @param {number} idx */
  function renderBenchStage(idx) {
    const safeIdx = clamp(idx, 0, stages.length - 1);
    activeStageIdx = safeIdx;
    const item = stages[safeIdx];
    activeProjectId = item.projectId;

    setText("featured-badge", item.badge);
    setText("featured-subtitle", item.subtitle);
    setText("featured-title", item.title);
    setText("featured-summary", item.summary);
    setText("stage-progress-counter", `${item.index} / 0${stages.length}`);

    const metricsEl = document.getElementById("featured-metrics");
    if (metricsEl && Array.isArray(item.metrics)) {
      metricsEl.innerHTML = "";
      item.metrics.forEach((/** @type {{ label: string; value: string }} */ m) => {
        const box = document.createElement("div");
        box.className = "metric-box";
        const dt = document.createElement("dt");
        dt.textContent = m.label;
        const dd = document.createElement("dd");
        dd.textContent = m.value;
        box.append(dt, dd);
        metricsEl.appendChild(box);
      });
    }
  }

  renderBenchStage(0);

  document.getElementById("featured-open-btn")?.addEventListener("click", () => {
    const target =
      data.projects.find((/** @type {any} */ p) => p.id === activeProjectId) ||
      data.projects[0];
    if (target) openProjectModal(target);
  });

  const runway = document.getElementById("hero-runway");
  const stage = document.getElementById("hero-sticky-stage");
  const heroGrid = document.getElementById("hero-grid");
  const heroCopy = document.getElementById("hero-copy");
  const monitor = document.getElementById("studio-monitor");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMedia = window.matchMedia("(min-width: 901px)");

  if (runway && stage && heroGrid && monitor) {
    let rafId = 0;
    let desktopShiftX = 0;
    let mobileShiftY = 0;

    const measure = () => {
      stage.style.setProperty("--bench-tx", "0px");
      stage.style.setProperty("--bench-ty", "0px");
      stage.style.setProperty("--bench-scale", "1");

      const gridRect = heroGrid.getBoundingClientRect();
      const monRect = monitor.getBoundingClientRect();

      if (desktopMedia.matches) {
        desktopShiftX = Math.round(
          gridRect.left + gridRect.width / 2 - (monRect.left + monRect.width / 2)
        );
        mobileShiftY = 0;
      } else {
        desktopShiftX = 0;
        const copyH = heroCopy ? heroCopy.getBoundingClientRect().height : 0;
        mobileShiftY = Math.round(-Math.min(copyH * 0.72, 240));
      }
    };

    const resetStatic = () => {
      stage.style.setProperty("--scroll-p", "0");
      stage.style.setProperty("--hero-exit", "0");
      stage.style.setProperty("--bench-expand", "0");
      stage.style.setProperty("--bench-tx", "0px");
      stage.style.setProperty("--bench-ty", "0px");
      stage.style.setProperty("--bench-scale", "1");
      stage.style.setProperty("--bench-radius", "20px");
      if (heroCopy) {
        heroCopy.style.pointerEvents = "";
        heroCopy.removeAttribute("aria-hidden");
      }
      if (activeStageIdx !== 0) renderBenchStage(0);
    };

    const updateScroll = () => {
      rafId = 0;
      if (reducedMotion.matches) {
        resetStatic();
        return;
      }

      const rect = runway.getBoundingClientRect();
      const maxScroll = Math.max(1, runway.offsetHeight - stage.offsetHeight);
      const p = clamp(-rect.top / maxScroll, 0, 1);

      const heroExit = smoothstep(0.03, 0.36, p);
      const benchExpand = smoothstep(0.06, 0.44, p);
      const benchSettle = smoothstep(0.86, 1.0, p);

      const tx = desktopMedia.matches ? desktopShiftX * benchExpand : 0;
      const ty = desktopMedia.matches
        ? -10 * benchExpand - 8 * benchSettle
        : mobileShiftY * benchExpand;
      const scale = desktopMedia.matches
        ? 1 + 0.1 * benchExpand - 0.03 * benchSettle
        : 1 + 0.025 * benchExpand;
      const radius = 20 + 6 * benchExpand;

      stage.style.setProperty("--scroll-p", p.toFixed(4));
      stage.style.setProperty("--hero-exit", heroExit.toFixed(4));
      stage.style.setProperty("--bench-expand", benchExpand.toFixed(4));
      stage.style.setProperty("--bench-tx", `${tx.toFixed(2)}px`);
      stage.style.setProperty("--bench-ty", `${ty.toFixed(2)}px`);
      stage.style.setProperty("--bench-scale", scale.toFixed(4));
      stage.style.setProperty("--bench-radius", `${radius.toFixed(1)}px`);

      if (heroCopy) {
        const faded = heroExit > 0.85;
        heroCopy.style.pointerEvents = faded ? "none" : "";
        if (faded) heroCopy.setAttribute("aria-hidden", "true");
        else heroCopy.removeAttribute("aria-hidden");
      }

      const nextIdx =
        p < 0.36 ? 0 : p < 0.72 ? Math.min(1, stages.length - 1) : stages.length - 1;
      if (nextIdx !== activeStageIdx) renderBenchStage(nextIdx);
    };

    const schedule = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateScroll);
    };

    const onResize = () => {
      if (reducedMotion.matches) {
        resetStatic();
        return;
      }
      measure();
      schedule();
    };

    if (reducedMotion.matches) {
      resetStatic();
    } else {
      measure();
      updateScroll();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    desktopMedia.addEventListener("change", onResize);
    reducedMotion.addEventListener("change", onResize);
    if ("ResizeObserver" in window) {
      new ResizeObserver(onResize).observe(heroGrid);
    }
  }

  // 4. Render minimal workbench cards (no filters)
  const projectsEl = document.getElementById("projects-grid");
  if (projectsEl && Array.isArray(data.projects)) {
    projectsEl.innerHTML = "";
    data.projects.forEach((/** @type {any} */ project, /** @type {number} */ idx) => {
      const card = document.createElement("article");
      card.className = "project-card reveal-item";
      card.dataset.reveal = "";
      card.style.setProperty("--reveal-delay", `${idx * 70}ms`);

      const visual = document.createElement("div");
      visual.className = `card-visual visual-${project.visualStyle || "broadcast"}`;
      if (project.image) {
        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;
        img.loading = "lazy";
        visual.appendChild(img);
      }

      const catChip = document.createElement("span");
      catChip.className = "visual-label";
      catChip.textContent = project.categoryLabel || "";

      const status = document.createElement("span");
      status.className = `status-badge status-${project.statusTone || "amber"}`;
      status.textContent = project.status;
      visual.append(catChip, status);

      const body = document.createElement("div");
      body.className = "card-body";

      const meta = document.createElement("div");
      meta.className = "card-meta";
      const dateSpan = document.createElement("span");
      dateSpan.textContent = project.date || "";
      const idSpan = document.createElement("span");
      idSpan.textContent = `#${project.id}`;
      meta.append(dateSpan, idSpan);

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = project.title;

      const summary = document.createElement("p");
      summary.className = "card-summary";
      summary.textContent = project.summary;

      const tags = document.createElement("div");
      tags.className = "tag-row";
      (project.tags || []).forEach((/** @type {string} */ t) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = t;
        tags.appendChild(tag);
      });

      const actions = document.createElement("div");
      actions.className = "card-actions";
      (project.links || [{ label: "Read Notes" }]).forEach((/** @type {any} */ link) => {
        if (link.href) {
          const a = document.createElement("a");
          a.href = link.href;
          a.className = "btn btn-sm btn-secondary";
          a.textContent = link.label;
          if (/^https?:\/\//.test(link.href)) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          actions.appendChild(a);
        } else {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-sm btn-outline";
          btn.textContent = link.label;
          btn.addEventListener("click", () => openProjectModal(project));
          actions.appendChild(btn);
        }
      });

      body.append(meta, title, summary, tags, actions);
      card.append(visual, body);
      projectsEl.appendChild(card);
    });
  }

  // 5. Render minimal bench updates list
  const updatesEl = document.getElementById("updates-list");
  if (updatesEl && Array.isArray(data.updates)) {
    updatesEl.innerHTML = "";
    data.updates.forEach((/** @type {any} */ entry, /** @type {number} */ idx) => {
      const item = document.createElement("article");
      item.className = "update-item reveal-item";
      item.dataset.reveal = "";
      item.style.setProperty("--reveal-delay", `${idx * 65}ms`);

      const meta = document.createElement("div");
      meta.className = "update-meta";
      const date = document.createElement("span");
      date.className = "update-date";
      date.textContent = entry.date;
      const tag = document.createElement("span");
      tag.className = "update-tag";
      tag.textContent = entry.tag;
      meta.append(date, tag);

      const content = document.createElement("div");
      content.className = "update-content";
      const h3 = document.createElement("h3");
      h3.textContent = entry.title;
      const p = document.createElement("p");
      p.textContent = entry.body;
      content.append(h3, p);

      item.append(meta, content);
      updatesEl.appendChild(item);
    });
  }

  // 6. Scroll-triggered reveals (CSS animation-timeline: view() with IO fallback)
  const supportsViewTimeline =
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline: view()");

  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (reducedMotion.matches) {
    revealTargets.forEach((el) => el.classList.add("is-inview"));
  } else if (supportsViewTimeline) {
    document.documentElement.classList.add("supports-view-timeline");
  } else if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-js-ready");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }
})();
