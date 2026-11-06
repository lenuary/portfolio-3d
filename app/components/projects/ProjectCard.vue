<template>
  <article
    class="project-card"
    aria-roledescription="slide"
    :aria-label="`${position} of ${total}: ${project.title}`"
  >
    <ProjectMedia :key="project.title" :project="project" />
    <div class="project-copy">
      <div class="project-title-row">
        <h2>{{ project.title }}</h2>
        <a
          class="source-link"
          :href="project.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`View ${project.title} on GitHub (opens in a new tab)`"
        >
          <NeonIcon name="code" />
        </a>
      </div>
      <p class="project-category">{{ project.category }}</p>
      <div class="project-bottom-row">
        <ul class="project-tags" aria-label="Technologies">
          <li v-for="technology in project.technologies.slice(0, 3)" :key="technology">
            {{ technology }}
          </li>
        </ul>
        <a
          class="project-link"
          :href="project.previewUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Visit ${project.title} (opens in a new tab)`"
        >
          <NeonIcon name="arrow-up-right" />
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import NeonIcon from "@/components/ui/NeonIcon.vue";
import ProjectMedia from "@/components/projects/ProjectMedia.vue";
import type { Project } from "@/data/projectsData";

defineProps<{ project: Project; position: number; total: number }>();
</script>

<style scoped>
.project-card {
  position: relative;
  z-index: 3;
  overflow: hidden;
  min-width: 0;
  padding: 12px 12px 11px;
  background: linear-gradient(155deg, #45205b, #251035 64%, #3d1c4d);
  border: 1.5px solid #e8adff;
  border-radius: 18px;
  box-shadow:
    0 0 5px #f7c9ff,
    0 0 19px #cc3dffb8,
    inset 0 0 16px #ba44f45c,
    0 15px 30px #0009;
  transform: perspective(1200px) rotateY(-6deg) rotateZ(-3deg);
  animation: project-levitate 5.8s ease-in-out infinite;
}
.project-copy {
  padding: 11px 3px 1px;
}
.project-title-row,
.project-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 7px;
}
.project-title-row h2 {
  margin: 0;
  font-size: clamp(20px, 2.2vw, 27px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.8px;
}
.source-link {
  display: grid;
  flex-shrink: 0;
  width: 24px;
  height: 26px;
  place-items: center;
  color: #e4acf6;
}
.source-link:hover {
  color: #fff;
  opacity: 1;
}
.source-link svg {
  width: 19px;
  height: 19px;
}
.project-category {
  margin: 5px 0 12px;
  font-size: 13px;
  line-height: 1.3;
  color: #ded0e8;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.project-tags li {
  padding: 5px 9px;
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  color: #f5e4ff;
  border: 1px solid #ce7dfb26;
  border-radius: 7px;
  background: linear-gradient(180deg, #ac55d36b, #78359d73);
  box-shadow: inset 0 1px 0 #e7bcff15;
  white-space: nowrap;
}
.project-link {
  flex-shrink: 0;
  display: grid;
  width: 27px;
  height: 27px;
  place-items: center;
  color: #e9a1ff;
}
.project-link svg {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
}
.project-link:hover svg {
  transform: translate(2px, -2px);
  color: #fff;
}

.project-card:hover,
.project-card:focus-within {
  animation-play-state: paused;
}

@keyframes project-levitate {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -8px;
  }
}

@media (max-width: 760px) {
  .project-card {
    padding: 10px;
  }
  .project-category {
    font-size: 11px;
  }
  .project-tags {
    gap: 4px;
  }
  .project-tags li {
    padding: 5px 6px;
    font-size: 9px;
  }
  .project-title-row h2 {
    font-size: 21px;
  }
}

@media (max-width: 520px) {
  .project-card {
    border-radius: 14px;
    transform: rotateZ(-2deg);
  }
  .project-title-row h2 {
    font-size: 24px;
  }
  .project-category {
    font-size: 12px;
  }
  .project-tags li {
    font-size: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    animation: none;
  }
}
</style>
