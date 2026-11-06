<template>
  <div ref="mediaElement" class="project-media">
    <a
      class="media-link"
      :href="project.previewUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open ${project.title} (opens in a new tab)`"
    >
      <img
        :src="project.imageSrc"
        :width="project.imageWidth"
        :height="project.imageHeight"
        :alt="`${project.title} preview`"
        decoding="async"
      />
      <video
        v-if="showVideo"
        ref="videoElement"
        :poster="project.imageSrc"
        :width="project.imageWidth"
        :height="project.imageHeight"
        :autoplay="!isPausedByUser && isPageVisible"
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @error="hasVideoError = true"
      >
        <source v-for="source in project.videoSources" :key="source.src" v-bind="source" />
      </video>
      <span class="image-link"><NeonIcon name="arrow-up-right" /></span>
    </a>
    <button
      v-if="showVideo"
      class="playback-button"
      type="button"
      :aria-label="`${isPlaying ? 'Pause' : 'Play'} ${project.title} preview`"
      @click="togglePlayback"
    >
      {{ isPlaying ? "Pause" : "Play" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import NeonIcon from "@/components/ui/NeonIcon.vue";
import type { Project } from "@/data/projectsData";

const props = defineProps<{ project: Project }>();
const mediaElement = useTemplateRef<HTMLElement>("mediaElement");
const videoElement = useTemplateRef<HTMLVideoElement>("videoElement");
const isVisible = ref(false);
const isPageVisible = ref(true);
const prefersReducedMotion = ref(true);
const isPlaying = ref(false);
const isPausedByUser = ref(false);
const hasVideoError = ref(false);
const showVideo = computed(
  () =>
    !!props.project.videoSources?.length &&
    isVisible.value &&
    !prefersReducedMotion.value &&
    !hasVideoError.value,
);

let motionPreference: MediaQueryList | null = null;
let visibilityObserver: IntersectionObserver | null = null;

function updateMotionPreference() {
  prefersReducedMotion.value = motionPreference?.matches ?? true;
}

function updatePageVisibility() {
  isPageVisible.value = document.visibilityState === "visible";
}

async function playPreview() {
  try {
    await videoElement.value?.play();
  } catch {
    // Autoplay can be blocked; the poster and explicit Play button remain usable.
    isPlaying.value = false;
  }
}

function togglePlayback() {
  isPausedByUser.value = isPlaying.value;
  if (isPlaying.value) videoElement.value?.pause();
  else void playPreview();
}

watch([showVideo, isPageVisible], async () => {
  await nextTick();
  if (showVideo.value && isPageVisible.value && !isPausedByUser.value) await playPreview();
  else videoElement.value?.pause();
});

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateMotionPreference();
  motionPreference.addEventListener("change", updateMotionPreference);
  updatePageVisibility();
  document.addEventListener("visibilitychange", updatePageVisibility);

  if ("IntersectionObserver" in window && mediaElement.value) {
    visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible.value = entry?.isIntersecting ?? false;
    });
    visibilityObserver.observe(mediaElement.value);
  } else isVisible.value = true;
});

onBeforeUnmount(() => {
  videoElement.value?.pause();
  visibilityObserver?.disconnect();
  motionPreference?.removeEventListener("change", updateMotionPreference);
  document.removeEventListener("visibilitychange", updatePageVisibility);
});
</script>

<style scoped>
.project-media {
  position: relative;
  height: 155px;
  overflow: hidden;
  border-radius: 9px 9px 4px 4px;
  background: #150c23;
}
.media-link {
  display: block;
  height: 100%;
}
.media-link::after {
  position: absolute;
  inset: 0;
  content: "";
  pointer-events: none;
  box-shadow: inset 0 -15px 20px #190b3055;
}
.media-link img,
.media-link video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.3s;
}
.media-link video {
  position: absolute;
  inset: 0;
}
.media-link:hover img,
.media-link:hover video {
  transform: scale(1.035);
}
.image-link {
  position: absolute;
  top: 7px;
  right: 7px;
  display: grid;
  width: 27px;
  height: 27px;
  place-items: center;
  color: #f7c3ff;
  background: #371449;
  border: 1px solid #d17bf5;
  border-radius: 6px;
}
.image-link svg {
  width: 22px;
  height: 22px;
}
.playback-button {
  position: absolute;
  right: 7px;
  bottom: 7px;
  min-width: 44px;
  min-height: 32px;
  padding: 5px 9px;
  color: #fff;
  background: #281038;
  border: 1px solid #e8adff;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}
.playback-button:focus-visible,
.media-link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -3px;
}
@media (max-width: 760px) {
  .project-media {
    height: 140px;
  }
}
@media (max-width: 520px) {
  .project-media {
    height: 150px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .media-link img,
  .media-link video {
    transition: none;
  }
}
</style>
