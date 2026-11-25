// @ts-check

/**
 * Progressive scroll-triggered reveal controller for below-the-fold sections.
 * Uses CSS `animation-timeline: view()` when supported by the browser, and falls
 * back cleanly to IntersectionObserver + GPU-composited transforms otherwise.
 * Always keeps content statically visible under `prefers-reduced-motion: reduce`.
 */
export function createScrollRevealController() {
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsCssViewTimeline =
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline: view()");

  /** @type {IntersectionObserver | null} */
  let observer = null;

  function revealAllImmediately() {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("is-inview");
    });
  }

  /**
   * Observe all `[data-reveal]` elements currently in the DOM.
   * Safe to call again after filter re-renders.
   */
  function refresh() {
    const targets = Array.from(document.querySelectorAll("[data-reveal]"));
    if (targets.length === 0) return;

    if (reducedMotionQuery.matches) {
      document.documentElement.classList.remove("reveal-js-ready");
      revealAllImmediately();
      return;
    }

    if (supportsCssViewTimeline) {
      document.documentElement.classList.add("supports-view-timeline");
      // Still mark visible for fallback selectors if needed
      revealAllImmediately();
      return;
    }

    document.documentElement.classList.add("reveal-js-ready");

    if (!observer && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.14,
          rootMargin: "0px 0px -8% 0px",
        }
      );
    }

    if (!observer) {
      revealAllImmediately();
      return;
    }

    targets.forEach((el) => {
      if (!el.classList.contains("is-inview")) {
        observer?.observe(el);
      }
    });
  }

  reducedMotionQuery.addEventListener("change", () => {
    if (reducedMotionQuery.matches) {
      observer?.disconnect();
      observer = null;
      document.documentElement.classList.remove("reveal-js-ready");
      revealAllImmediately();
    } else {
      refresh();
    }
  });

  refresh();
  return { refresh };
}
