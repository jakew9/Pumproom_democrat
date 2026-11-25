// @ts-check

import { createProjectModal } from "./js/modal.js";
import {
  initProjectsShowcase,
  renderBenchStage,
  renderStaticSections,
  setText,
} from "./js/render.js";
import { createScrollRevealController } from "./js/scrollReveal.js";
import { initStickyBenchStage } from "./js/scrollStage.js";

/** @type {import('./js/types.js').SiteContent | undefined} */
const data = /** @type {any} */ (window).SITE_CONTENT;

if (data) {
  const modal = createProjectModal(setText);
  const reveal = createScrollRevealController();

  renderStaticSections(data);

  /** @type {import('./js/types.js').BenchStage[]} */
  const stages =
    Array.isArray(data.benchStages) && data.benchStages.length > 0
      ? data.benchStages
      : [
          {
            index: "01",
            shortLabel: "Active Build",
            badge: data.featured.badge,
            subtitle: data.featured.subtitle,
            title: data.featured.title,
            summary: data.featured.summary,
            caption: "Active build on the workbench.",
            visualMode: "eq",
            metrics: data.featured.metrics,
            projectId: data.featured.projectId,
          },
        ];

  let activeProjectId = stages[0].projectId;

  initStickyBenchStage({
    stages,
    onSelectStage: (stageData) => {
      activeProjectId = stageData.projectId;
      renderBenchStage(stageData);
    },
  });

  const spotlightBtn = document.getElementById("featured-open-btn");
  spotlightBtn?.addEventListener("click", () => {
    const target =
      data.projects.find((project) => project.id === activeProjectId) ||
      data.projects[0];
    if (target) modal.open(target);
  });

  initProjectsShowcase({
    data,
    onOpenProject: modal.open,
    onAfterRender: () => reveal.refresh(),
  });

  // Final pass to pick up all static reveal targets
  reveal.refresh();
}
