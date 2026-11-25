// @ts-check

/**
 * DOM rendering helpers for The Pump Room showcase.
 */

/**
 * @param {string} id
 * @param {string} value
 */
export function setText(id, value) {
  const el = document.getElementById(id);
  if (el && typeof value === "string") el.textContent = value;
}

/**
 * Render the 3-up metrics grid inside the NOW ON THE BENCH monitor.
 * @param {import('./types.js').MetricItem[]} metrics
 */
export function renderBenchMetrics(metrics) {
  const metricsEl = document.getElementById("featured-metrics");
  if (!metricsEl || !Array.isArray(metrics)) return;

  metricsEl.innerHTML = "";
  metrics.forEach((item) => {
    const box = document.createElement("div");
    box.className = "metric-box";
    const dt = document.createElement("dt");
    dt.textContent = item.label;
    const dd = document.createElement("dd");
    dd.textContent = item.value;
    box.append(dt, dd);
    metricsEl.appendChild(box);
  });
}

/**
 * Update the bench monitor card text and metrics for the active stage.
 * @param {import('./types.js').BenchStage} stageData
 */
export function renderBenchStage(stageData) {
  setText("featured-badge", stageData.badge);
  setText("featured-subtitle", stageData.subtitle);
  setText("featured-title", stageData.title);
  setText("featured-summary", stageData.summary);
  renderBenchMetrics(stageData.metrics);
}

/**
 * @param {import('./types.js').ProjectItem} project
 * @param {string} [extraClass]
 */
function createVisualBlock(project, extraClass = "") {
  const visual = document.createElement("div");
  const styleName = project.visualStyle || "broadcast";
  visual.className = `card-visual visual-${styleName}${extraClass ? " " + extraClass : ""}`;

  if (project.image) {
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.title;
    img.loading = "lazy";
    visual.appendChild(img);
  }

  const catChip = document.createElement("span");
  catChip.className = "visual-label";
  catChip.textContent = project.categoryLabel || project.category;

  const status = document.createElement("span");
  status.className = `status-badge status-${project.statusTone || "amber"}`;
  status.textContent = project.status;

  visual.append(catChip, status);
  return visual;
}

/**
 * Populate static brand copy, updates feed, and quick links.
 * @param {import('./types.js').SiteContent} data
 */
export function renderStaticSections(data) {
  setText("nav-brand-name", data.brand.name);
  setText("nav-brand-domain", data.brand.domain);
  setText("hero-status", data.brand.statusLabel);
  setText("hero-title", data.brand.tagline);
  setText("hero-description", data.brand.description);
  setText("about-heading", data.brand.aboutHeading);
  setText("about-copy", data.brand.aboutCopy);
  setText("about-domain-chip", data.brand.domain);
  setText("about-host-chip", data.brand.locationTag);
  setText("footer-brand", data.brand.name);
  setText("footer-domain", data.brand.domain);
  setText("current-year", String(new Date().getFullYear()));

  // Render updates timeline
  const updatesEl = document.getElementById("updates-list");
  if (updatesEl && Array.isArray(data.updates)) {
    updatesEl.innerHTML = "";
    data.updates.forEach((entry, idx) => {
      const item = document.createElement("article");
      item.className = "update-item reveal-item";
      item.dataset.reveal = "up";
      item.style.setProperty("--reveal-delay", `${idx * 70}ms`);

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

  // Render quick links in About section
  const aboutLinksEl = document.getElementById("about-links");
  if (aboutLinksEl && Array.isArray(data.links)) {
    aboutLinksEl.innerHTML = "";
    data.links.forEach((link) => {
      const a = document.createElement("a");
      a.className = "quick-link";
      a.href = link.href;
      if (/^https?:\/\//.test(link.href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }

      const left = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = link.label;
      const note = document.createElement("span");
      note.textContent = link.note || "";
      left.append(strong, note);

      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";

      a.append(left, arrow);
      aboutLinksEl.appendChild(a);
    });
  }
}

/**
 * Render category filters and showcase project cards.
 * @param {{
 *   data: import('./types.js').SiteContent;
 *   onOpenProject: (project: import('./types.js').ProjectItem) => void;
 *   onAfterRender?: () => void;
 * }} options
 */
export function initProjectsShowcase({ data, onOpenProject, onAfterRender }) {
  const filtersEl = document.getElementById("category-filters");
  const projectsEl = document.getElementById("projects-grid");
  let activeCategory = "all";

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = "";
    data.categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `filter-btn${cat.id === activeCategory ? " is-active" : ""}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(cat.id === activeCategory));
      btn.textContent = cat.label;
      btn.addEventListener("click", () => {
        activeCategory = cat.id;
        renderFilters();
        renderProjects(true);
      });
      filtersEl.appendChild(btn);
    });
  }

  /**
   * @param {boolean} [immediateVisible]
   */
  function renderProjects(immediateVisible = false) {
    if (!projectsEl) return;
    projectsEl.innerHTML = "";

    const filtered =
      activeCategory === "all"
        ? data.projects
        : data.projects.filter((project) => project.category === activeCategory);

    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "section-subcopy";
      empty.textContent = "Nothing posted in this category yet — check back soon.";
      projectsEl.appendChild(empty);
      return;
    }

    filtered.forEach((project, idx) => {
      const card = document.createElement("article");
      card.className = `project-card reveal-item${immediateVisible ? " is-inview" : ""}`;
      card.dataset.reveal = "card";
      card.style.setProperty("--reveal-delay", `${idx * 75}ms`);

      const visual = createVisualBlock(project);

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
      (project.tags || []).forEach((tagText) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagText;
        tags.appendChild(tag);
      });

      const actions = document.createElement("div");
      actions.className = "card-actions";
      (project.links || [{ label: "View Details", action: "modal" }]).forEach((link) => {
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
          btn.addEventListener("click", () => onOpenProject(project));
          actions.appendChild(btn);
        }
      });

      body.append(meta, title, summary, tags, actions);
      card.append(visual, body);
      projectsEl.appendChild(card);
    });

    onAfterRender?.();
  }

  renderFilters();
  renderProjects(false);
}
