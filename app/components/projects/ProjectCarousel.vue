<template>
  <div class="projects-carousel">
    <section
      ref="carouselElement"
      class="project-carousel"
      aria-roledescription="carousel"
      aria-labelledby="projects-title"
      @keydown.left.stop.prevent="selectPreviousProject"
      @keydown.right.stop.prevent="selectNextProject"
      @wheel="handleWheel"
      @touchstart.passive="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchcancel="touchStart = null"
    >
      <button
        class="carousel-arrow previous-arrow"
        type="button"
        aria-label="Previous project"
        @click="selectPreviousProject"
      >
        <NeonIcon name="arrow-left" />
      </button>

      <div class="preview-slot" data-project-slot>
        <ProjectPreview :project="previousProject" side="left" @select="selectPreviousProject" />
      </div>

      <div class="featured-project">
        <ProjectHologram />
        <div class="featured-card-slot" data-project-slot>
          <ProjectCard
            :project="activeProject"
            :position="activeProjectIndex + 1"
            :total="projectsData.length"
          />
        </div>
      </div>

      <div class="preview-slot" data-project-slot>
        <ProjectPreview :project="nextProject" side="right" @select="selectNextProject" />
      </div>

      <button
        class="carousel-arrow next-arrow"
        type="button"
        aria-label="Next project"
        @click="selectNextProject"
      >
        <NeonIcon name="arrow-right" />
      </button>
    </section>

    <ProjectPagination
      :projects="projectsData"
      :active-index="activeProjectIndex"
      @select="selectProject"
    />
    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{ activeProject.title }}. {{ activeProject.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import ProjectCard from "@/components/projects/ProjectCard.vue";
import ProjectHologram from "@/components/projects/ProjectHologram.vue";
import ProjectPagination from "@/components/projects/ProjectPagination.vue";
import ProjectPreview from "@/components/projects/ProjectPreview.vue";
import NeonIcon from "@/components/ui/NeonIcon.vue";
import { useProjectCarousel } from "@/composables/useProjectCarousel";
import { projectsData } from "@/data/projectsData";

const carouselElement = useTemplateRef<HTMLElement>("carouselElement");
const {
  activeProjectIndex,
  activeProject,
  previousProject,
  nextProject,
  isTransitioning,
  selectProject,
  selectNextProject,
  selectPreviousProject,
} = useProjectCarousel(carouselElement, projectsData);

let wheelDistance = 0;
let lastWheelChange = -Infinity;
let touchStart: { x: number; y: number } | null = null;

function handleWheel(event: WheelEvent) {
  if (event.ctrlKey) return;
  const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
  const content = carouselElement.value?.closest(".window-content");
  // On short screens vertical scrolling must remain available for reading the panel.
  if (!isHorizontal && content && content.scrollHeight > content.clientHeight + 1) return;

  event.preventDefault();
  const now = performance.now();
  if (isTransitioning.value || now - lastWheelChange < 650) {
    wheelDistance = 0;
    return;
  }

  const delta = (isHorizontal ? event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : 1);
  if (Math.sign(delta) !== Math.sign(wheelDistance)) wheelDistance = 0;
  wheelDistance += delta;
  if (Math.abs(wheelDistance) < 40) return;

  lastWheelChange = now;
  wheelDistance > 0 ? selectNextProject() : selectPreviousProject();
  wheelDistance = 0;
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length !== 1) {
    touchStart = null;
    return;
  }
  const touch = event.touches[0];
  touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
}

function handleTouchEnd(event: TouchEvent) {
  const touch = event.changedTouches[0];
  if (!touchStart || !touch) return;
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

  if (event.cancelable) event.preventDefault();
  deltaX < 0 ? selectNextProject() : selectPreviousProject();
}
</script>

<style scoped>
.project-carousel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(100px, 1fr) minmax(240px, 1.95fr) minmax(100px, 1fr);
  align-items: center;
  gap: 22px;
  max-width: 810px;
  height: 345px;
  margin: -2px auto 0;
  padding: 0 37px;
  isolation: isolate;
  touch-action: pan-y pinch-zoom;
}
.preview-slot {
  min-width: 0;
  position: relative;
  z-index: 1;
}
.preview-slot :deep(.project-preview) {
  width: 100%;
}
.featured-project {
  position: relative;
  z-index: 2;
  align-self: center;
  min-width: 0;
  padding-bottom: 14px;
}
.featured-card-slot {
  position: relative;
  z-index: 3;
}
.carousel-arrow {
  position: absolute;
  z-index: 5;
  top: calc(50% - 15px);
  display: grid;
  width: 34px;
  height: 44px;
  padding: 2px;
  place-items: center;
  color: #f8d6ff;
  background: transparent;
  border: 0;
  cursor: pointer;
  filter: drop-shadow(0 0 3px #f1a4ff) drop-shadow(0 0 6px #d22aff);
  transition: transform 0.2s;
}
.carousel-arrow:hover {
  transform: scale(1.15);
}
.carousel-arrow svg {
  width: 29px;
  height: 35px;
}
.previous-arrow {
  left: -4px;
}
.next-arrow {
  right: -4px;
}
@media (max-width: 760px) {
  .project-carousel {
    grid-template-columns: minmax(65px, 1fr) minmax(200px, 2.4fr) minmax(65px, 1fr);
    gap: 12px;
    height: 330px;
    padding: 0 23px;
  }
}
@media (max-width: 520px) {
  .project-carousel {
    display: block;
    height: auto;
    max-width: 345px;
    margin-top: 25px;
    padding: 0 25px 32px;
  }
  .preview-slot {
    display: none;
  }
  .featured-project {
    padding-bottom: 10px;
  }
  .carousel-arrow {
    top: calc(50% - 34px);
    width: 28px;
  }
  .previous-arrow {
    left: -5px;
  }
  .next-arrow {
    right: -5px;
  }
  .carousel-arrow svg {
    width: 24px;
  }
}
</style>
