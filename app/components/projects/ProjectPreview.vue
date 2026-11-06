<template>
  <button
    class="project-preview"
    :class="`preview-${side}`"
    type="button"
    :aria-label="`Show ${project.title}`"
    @click="emit('select')"
  >
    <span class="preview-image">
      <img
        :src="project.imageSrc"
        :width="project.imageWidth"
        :height="project.imageHeight"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
    <span class="preview-copy">
      <span class="preview-title">{{ project.title }}</span>
      <span class="preview-category">{{ project.category }}</span>
      <span class="preview-technologies">
        <span v-for="technology in project.technologies.slice(0, 3)" :key="technology">
          {{ technology }}
        </span>
      </span>
    </span>
    <NeonIcon name="arrow-up-right" class="preview-open" />
  </button>
</template>

<script setup lang="ts">
import NeonIcon from "@/components/ui/NeonIcon.vue";
import type { Project } from "@/data/projectsData";

defineProps<{ project: Project; side: "left" | "right" }>();
const emit = defineEmits<{ select: [] }>();
</script>

<style scoped>
.project-preview {
  position: relative;
  z-index: 1;
  height: 224px;
  overflow: hidden;
  padding: 10px;
  text-align: left;
  color: #f3e6fa;
  background: linear-gradient(145deg, #381645, #22102d);
  border: 1px solid #b74fea90;
  border-radius: 12px;
  box-shadow:
    inset 0 0 15px #9d3bd531,
    0 0 16px #9b2bc329;
  cursor: pointer;
  animation: preview-hover 6.4s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
}
.project-preview:hover .preview-image,
.project-preview:focus-visible .preview-image {
  opacity: 1;
  filter: saturate(1);
}
.project-preview:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 5px;
}
.project-preview:hover,
.project-preview:focus-visible {
  animation-play-state: paused;
}
.preview-left {
  animation-delay: -1.2s;
  transform: perspective(700px) rotateY(15deg) rotateZ(7deg) translateY(9px);
}
.preview-right {
  animation-delay: -3.4s;
  transform: perspective(700px) rotateY(-15deg) rotateZ(-7deg) translateY(9px);
}
.preview-image {
  display: block;
  height: 115px;
  overflow: hidden;
  border-radius: 6px;
  background: #180a29;
  opacity: 0.72;
  filter: saturate(0.75);
  transition:
    opacity 0.2s,
    filter 0.2s;
}
.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.preview-copy {
  display: block;
  padding: 10px 0 0;
}
.preview-title {
  display: block;
  font-size: 16px;
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.5px;
}
.preview-category {
  display: block;
  margin-top: 5px;
  font-size: 10px;
  line-height: 1.3;
}
.preview-technologies {
  display: flex;
  gap: 4px;
  overflow: hidden;
  margin-top: 8px;
}
.preview-technologies > span {
  padding: 3px 5px;
  white-space: nowrap;
  font-size: 8px;
  background: #a458ca40;
  border-radius: 5px;
}
.preview-open {
  position: absolute;
  right: 9px;
  bottom: 8px;
  width: 13px;
  height: 13px;
  color: #e497ff;
}
@keyframes preview-hover {
  0%,
  100% {
    translate: 0 3px;
  }
  50% {
    translate: 0 -5px;
  }
}
@media (max-width: 760px) {
  .project-preview {
    height: 194px;
    padding: 7px;
  }
  .preview-image {
    height: 95px;
  }
  .preview-title {
    font-size: 13px;
  }
  .preview-category {
    font-size: 9px;
  }
  .preview-technologies {
    display: none;
  }
}
@media (max-width: 520px) {
  .project-preview {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .project-preview {
    animation: none;
  }
  .preview-image {
    transition: none;
  }
}
</style>
