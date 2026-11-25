// @ts-check

/**
 * Accessible project detail modal controller.
 *
 * @param {(id: string, value: string) => void} setText
 */
export function createProjectModal(setText) {
  const modalBackdrop = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close");

  /** @type {HTMLElement | null} */
  let lastFocusedElement = null;

  /**
   * @param {import('./types.js').ProjectItem} project
   */
  function open(project) {
    if (!modalBackdrop) return;
    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    setText("modal-category", project.categoryLabel || project.category);
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
      (project.tags || []).forEach((tagLabel) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagLabel;
        tagsEl.appendChild(tag);
      });
    }

    const actionsEl = document.getElementById("modal-actions");
    if (actionsEl) {
      actionsEl.innerHTML = "";
      const externalLinks = (project.links || []).filter((link) => Boolean(link.href));
      externalLinks.forEach((link) => {
        if (!link.href) return;
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

      const doneBtn = document.createElement("button");
      doneBtn.type = "button";
      doneBtn.className = "btn btn-sm btn-outline";
      doneBtn.textContent = "Close";
      doneBtn.addEventListener("click", close);
      actionsEl.appendChild(doneBtn);
    }

    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    modalCloseBtn?.focus();
  }

  function close() {
    if (!modalBackdrop || modalBackdrop.hidden) return;
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
  }

  modalCloseBtn?.addEventListener("click", close);
  modalBackdrop?.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  return { open, close };
}
