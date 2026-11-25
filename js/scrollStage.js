// @ts-check

/**
 * Clamp a number into [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Smoothstep interpolation between edge0 and edge1.
 * @param {number} edge0
 * @param {number} edge1
 * @param {number} value
 */
function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Apple-style sticky hero stage & scroll-scrubbing controller.
 *
 * Drives ONLY GPU-composited CSS custom properties (`transform`, `opacity`,
 * `border-radius`, `clip-path`) tied reversibly to scroll progress inside
 * `.hero-runway`, while advancing the `NOW ON THE BENCH` monitor through
 * configured build stages.
 *
 * Collapses cleanly to a static, accessible layout when
 * `prefers-reduced-motion: reduce` is enabled.
 *
 * @param {{
 *   stages: import('./types.js').BenchStage[];
 *   onSelectStage: (stage: import('./types.js').BenchStage, stageIdx: number) => void;
 * }} options
 */
export function initStickyBenchStage({ stages, onSelectStage }) {
  const runway = document.getElementById("hero-runway");
  const stage = document.getElementById("hero-sticky-stage");
  const heroGrid = document.getElementById("hero-grid");
  const heroCopy = document.getElementById("hero-copy");
  const monitor = document.getElementById("studio-monitor");
  const stepTabsWrap = document.getElementById("bench-step-tabs");
  const progressCounter = document.getElementById("stage-progress-counter");
  const stageCaption = document.getElementById("stage-caption");

  if (!runway || !stage || !heroGrid || !monitor || stages.length === 0) {
    return { setActiveStage: () => {} };
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 901px)");

  let activeStageIndex = 0;
  let rafId = 0;
  let desktopCenterShiftX = 0;
  let mobileRiseShiftY = 0;

  /** @type {HTMLButtonElement[]} */
  const stepButtons = [];

  // Build interactive chapter step buttons in the scrub bar
  if (stepTabsWrap) {
    stepTabsWrap.innerHTML = "";
    stages.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `scrub-step-btn${idx === 0 ? " is-active" : ""}`;
      btn.setAttribute("aria-pressed", String(idx === 0));

      const num = document.createElement("span");
      num.className = "scrub-step-num";
      num.textContent = item.index;

      const label = document.createElement("span");
      label.className = "scrub-step-label";
      label.textContent = item.shortLabel;

      btn.append(num, label);
      btn.addEventListener("click", () => {
        if (reducedMotionQuery.matches) {
          applyStageContent(idx);
          return;
        }
        const runwayTop = runway.getBoundingClientRect().top + window.scrollY;
        const maxScroll = Math.max(1, runway.offsetHeight - stage.offsetHeight);
        const targetProgress =
          stages.length === 1 ? 0 : idx === 0 ? 0 : idx === stages.length - 1 ? 0.92 : (idx + 0.15) / stages.length;
        window.scrollTo({
          top: runwayTop + maxScroll * targetProgress,
          behavior: "smooth",
        });
      });

      stepButtons.push(btn);
      stepTabsWrap.appendChild(btn);
    });
  }

  /**
   * Update active stage UI state when scrub crosses a chapter boundary.
   * @param {number} idx
   */
  function applyStageContent(idx) {
    const safeIdx = clamp(idx, 0, stages.length - 1);
    activeStageIndex = safeIdx;
    const current = stages[safeIdx];

    stage.dataset.benchStage = current.index;
    monitor.dataset.visualMode = current.visualMode || "eq";

    if (progressCounter) {
      progressCounter.textContent = `${current.index} / 0${stages.length}`;
    }
    if (stageCaption) {
      stageCaption.textContent = current.caption;
    }

    stepButtons.forEach((btn, buttonIdx) => {
      const active = buttonIdx === safeIdx;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    onSelectStage(current, safeIdx);
  }

  /**
   * Measure rest geometry so desktop centering and mobile lift use exact
   * pixel deltas without mutating layout properties during scroll.
   */
  function measureGeometry() {
    // Temporarily reset transform variables to measure natural rest coordinates
    stage.style.setProperty("--bench-tx", "0px");
    stage.style.setProperty("--bench-ty", "0px");
    stage.style.setProperty("--bench-scale", "1");

    const gridRect = heroGrid.getBoundingClientRect();
    const monitorRect = monitor.getBoundingClientRect();

    if (desktopQuery.matches) {
      const gridCenterX = gridRect.left + gridRect.width / 2;
      const monitorCenterX = monitorRect.left + monitorRect.width / 2;
      desktopCenterShiftX = Math.round(gridCenterX - monitorCenterX);
      mobileRiseShiftY = 0;
    } else {
      desktopCenterShiftX = 0;
      const copyHeight = heroCopy ? heroCopy.getBoundingClientRect().height : 0;
      // Lift the monitor cleanly into the upper-center viewport as hero copy exits
      mobileRiseShiftY = Math.round(-Math.min(copyHeight * 0.72, 260));
    }
  }

  function resetStaticState() {
    stage.style.setProperty("--scroll-p", "0");
    stage.style.setProperty("--hero-exit", "0");
    stage.style.setProperty("--bench-expand", "0");
    stage.style.setProperty("--bench-tx", "0px");
    stage.style.setProperty("--bench-ty", "0px");
    stage.style.setProperty("--bench-scale", "1");
    stage.style.setProperty("--bench-radius", "20px");
    stage.style.setProperty("--cue-opacity", "0");
    if (heroCopy) {
      heroCopy.removeAttribute("aria-hidden");
      heroCopy.style.pointerEvents = "";
    }
  }

  function updateFromScroll() {
    rafId = 0;

    if (reducedMotionQuery.matches) {
      resetStaticState();
      return;
    }

    const runwayRect = runway.getBoundingClientRect();
    const scrollableDistance = Math.max(1, runway.offsetHeight - stage.offsetHeight);
    const scrolled = clamp(-runwayRect.top, 0, scrollableDistance);
    const p = clamp(scrolled / scrollableDistance, 0, 1);

    // Phase curves (smooth & completely reversible)
    const heroExit = smoothstep(0.03, 0.36, p);
    const benchExpand = smoothstep(0.06, 0.44, p);
    const benchSettle = smoothstep(0.86, 1.0, p);
    const cueOpacity = 1 - smoothstep(0.0, 0.14, p);

    const tx = desktopQuery.matches ? desktopCenterShiftX * benchExpand : 0;
    const ty = desktopQuery.matches
      ? -10 * benchExpand - 8 * benchSettle
      : mobileRiseShiftY * benchExpand;
    const scale = desktopQuery.matches
      ? 1 + 0.11 * benchExpand - 0.03 * benchSettle
      : 1 + 0.025 * benchExpand;
    const radius = 20 + 6 * benchExpand;

    stage.style.setProperty("--scroll-p", p.toFixed(4));
    stage.style.setProperty("--hero-exit", heroExit.toFixed(4));
    stage.style.setProperty("--bench-expand", benchExpand.toFixed(4));
    stage.style.setProperty("--bench-tx", `${tx.toFixed(2)}px`);
    stage.style.setProperty("--bench-ty", `${ty.toFixed(2)}px`);
    stage.style.setProperty("--bench-scale", scale.toFixed(4));
    stage.style.setProperty("--bench-radius", `${radius.toFixed(1)}px`);
    stage.style.setProperty("--cue-opacity", cueOpacity.toFixed(4));

    if (heroCopy) {
      const hidden = heroExit > 0.85;
      heroCopy.style.pointerEvents = hidden ? "none" : "";
      if (hidden) {
        heroCopy.setAttribute("aria-hidden", "true");
      } else {
        heroCopy.removeAttribute("aria-hidden");
      }
    }

    // Determine active scrub chapter across [0, 1]
    const nextStageIdx =
      p < 0.36 ? 0 : p < 0.72 ? Math.min(1, stages.length - 1) : stages.length - 1;
    if (nextStageIdx !== activeStageIndex) {
      applyStageContent(nextStageIdx);
    }
  }

  function scheduleUpdate() {
    if (rafId !== 0) return;
    rafId = window.requestAnimationFrame(updateFromScroll);
  }

  function handleResize() {
    if (reducedMotionQuery.matches) {
      resetStaticState();
      return;
    }
    measureGeometry();
    scheduleUpdate();
  }

  // Initial setup
  applyStageContent(0);
  if (reducedMotionQuery.matches) {
    resetStaticState();
  } else {
    measureGeometry();
    updateFromScroll();
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  reducedMotionQuery.addEventListener("change", () => {
    if (reducedMotionQuery.matches) {
      resetStaticState();
    } else {
      measureGeometry();
      scheduleUpdate();
    }
  });
  desktopQuery.addEventListener("change", handleResize);

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(handleResize);
    ro.observe(heroGrid);
  }

  return {
    setActiveStage: applyStageContent,
  };
}
