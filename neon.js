// @ts-check
(() => {
  const hero = document.getElementById("neon-hero");
  const powerSwitch = document.getElementById("power-switch");
  const switchCaption = document.getElementById("switch-caption");
  const enterLink = document.getElementById("enter-link");

  if (!hero || !powerSwitch) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** @type {number[]} */
  let pendingTimers = [];
  let isPoweredOn = false;

  function clearTimers() {
    pendingTimers.forEach((id) => window.clearTimeout(id));
    pendingTimers = [];
  }

  /** @param {() => void} fn @param {number} delay */
  function schedule(fn, delay) {
    const id = window.setTimeout(() => {
      pendingTimers = pendingTimers.filter((t) => t !== id);
      fn();
    }, delay);
    pendingTimers.push(id);
  }

  /** @param {boolean} on */
  function updateSwitchUI(on) {
    powerSwitch.setAttribute("aria-checked", on ? "true" : "false");
    if (switchCaption) {
      switchCaption.textContent = on ? "ON" : "OFF";
    }
  }

  function powerOff() {
    clearTimers();
    isPoweredOn = false;
    updateSwitchUI(false);

    hero.dataset.power = "off";
    hero.dataset.the = "off";
    hero.dataset.pump = "off";
    hero.dataset.room = "off";
  }

  function powerOn() {
    clearTimers();
    isPoweredOn = true;
    updateSwitchUI(true);
    hero.dataset.power = "on";

    if (reducedMotion.matches) {
      hero.dataset.the = "lit";
      hero.dataset.pump = "lit";
      hero.dataset.room = "lit";
      return;
    }

    // Reset word states before running staggered ignition sequence
    hero.dataset.the = "off";
    hero.dataset.pump = "off";
    hero.dataset.room = "off";

    // 1. THE snaps on immediately
    hero.dataset.the = "lit";

    // 2. PUMP surges to full blinding white ~150ms later
    schedule(() => {
      if (!isPoweredOn) return;
      hero.dataset.pump = "lit";
    }, 150);

    // 3. ROOM flickers on ~300ms after PUMP (+450ms total)
    schedule(() => {
      if (!isPoweredOn) return;
      hero.dataset.room = "igniting";
    }, 450);

    // 4. Transition ROOM into steady lit state with failing-ballast second-O flicker
    schedule(() => {
      if (!isPoweredOn) return;
      hero.dataset.room = "lit";
    }, 840);
  }

  powerSwitch.addEventListener("click", () => {
    if (isPoweredOn) {
      powerOff();
    } else {
      powerOn();
    }
  });

  // Auto-trigger power-on sequence 400ms after load (instant when reduced motion is preferred)
  if (reducedMotion.matches) {
    powerOn();
  } else {
    schedule(() => {
      if (!isPoweredOn) {
        powerOn();
      }
    }, 400);
  }

  // Keep steady state clean if the user toggles reduced-motion live
  reducedMotion.addEventListener("change", () => {
    if (isPoweredOn && reducedMotion.matches) {
      clearTimers();
      hero.dataset.the = "lit";
      hero.dataset.pump = "lit";
      hero.dataset.room = "lit";
    }
  });

  // Ensure returning via browser Back (bfcache) never stays faded out
  window.addEventListener("pageshow", () => {
    hero.classList.remove("is-leaving");
  });

  // Subtle fade-out before entering the studio showcase
  if (enterLink instanceof HTMLAnchorElement) {
    enterLink.addEventListener("click", (e) => {
      if (
        reducedMotion.matches ||
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      e.preventDefault();
      const targetHref = enterLink.href;
      hero.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = targetHref;
      }, 200);
    });
  }
})();
