<template>
  <nav class="project-pagination" aria-label="Choose a project">
    <button
      v-for="(project, index) in projects"
      :key="project.title"
      type="button"
      :class="{ active: activeIndex === index }"
      :aria-label="`Show ${project.title}`"
      :aria-current="activeIndex === index ? 'true' : undefined"
      @click="emit('select', index)"
    >
      <span />
    </button>
  </nav>
</template>

<script setup lang="ts">
import type { Project } from "@/data/projectsData";

defineProps<{ projects: readonly Project[]; activeIndex: number }>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<style scoped>
.project-pagination {
  position: relative;
  z-index: 4;
  display: flex;
  justify-content: center;
  gap: 2px;
  margin: 5px 0 0;
}
.project-pagination button {
  display: grid;
  width: 24px;
  height: 32px;
  place-items: center;
  border: 0;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
}
.project-pagination span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ab81bc;
  box-shadow: inset 0 0 0 1px #e0a7f24a;
  transition:
    background 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
}
.project-pagination button.active span {
  transform: scale(1.2);
  background: #ef92ff;
  box-shadow:
    0 0 8px #d93aff,
    inset 0 0 0 1px #f2b9ff;
}

@media (max-width: 520px) {
  .project-pagination {
    margin-top: 0;
  }
}
</style>
