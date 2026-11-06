<template>
  <HoloWindow section-id="projects" @navigate="emit('navigate', $event)" @ready="emit('ready')">
    <div class="projects-view">
      <header class="projects-heading">
        <h1 id="projects-title" tabindex="-1">Selected <span>Projects</span></h1>
        <p>Applications, games and experiments I've built.</p>
      </header>
      <ProjectCarousel />
    </div>
  </HoloWindow>
</template>

<script setup lang="ts">
import ProjectCarousel from "@/components/projects/ProjectCarousel.vue";
import HoloWindow from "@/components/ui/HoloWindow.vue";
import type { SectionId } from "@/data/navigation";

const emit = defineEmits<{ navigate: [section: SectionId]; ready: [] }>();
</script>

<style scoped>
.projects-view {
  position: relative;
  width: 100%;
  padding: 4px 0 0;
}
.projects-heading {
  position: relative;
  z-index: 2;
  padding: 0 30px;
}
.projects-heading h1 {
  margin: 0;
  font-size: clamp(27px, 3vw, 37px);
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -1.1px;
  text-shadow: 0 2px 9px #0008;
}
.projects-heading h1 span {
  color: var(--color-accent);
}
.projects-heading p {
  margin: 10px 0 0;
  font-size: 13px;
  color: #e8dcf0;
}

@media (max-width: 760px) {
  .projects-heading {
    padding: 0 10px;
  }
}
@media (max-width: 520px) {
  .projects-view {
    padding-top: 8px;
  }
  .projects-heading h1 {
    font-size: 28px;
  }
  .projects-heading p {
    margin-top: 8px;
    font-size: 11px;
  }
}
</style>
