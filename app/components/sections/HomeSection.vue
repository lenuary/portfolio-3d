<template>
  <section
    class="home-container"
    :class="{ 'is-intro-active': isIntroActive, 'is-intro-visible': isIntroVisible }"
    :style="introStyles"
    aria-labelledby="home-title"
  >
    <HomeHeading
      :accessible-label="`${homeData.greeting} ${homeData.namePrefix}${homeData.name}`"
      :greeting="displayedGreeting"
      :name-prefix="displayedNamePrefix"
      :name="displayedName"
      :cursor="activeCursor"
    />
    <HomeIntroduction :role="homeData.role" :paragraphs="homeData.introParagraphs" />
    <HomeHighlights :highlights="homeData.highlights" />
    <HomeStoryButton :disabled="isIntroActive" @discover="emit('navigate', 'about')" />
  </section>
</template>

<script setup lang="ts">
import HomeHeading from "@/components/home/HomeHeading.vue";
import HomeHighlights from "@/components/home/HomeHighlights.vue";
import HomeIntroduction from "@/components/home/HomeIntroduction.vue";
import HomeStoryButton from "@/components/home/HomeStoryButton.vue";
import { useHomeIntro } from "@/composables/useHomeIntro";
import { homeData } from "@/data/homeData";
import type { SectionId } from "@/data/navigation";

const emit = defineEmits<{ navigate: [sectionId: SectionId]; ready: [] }>();
const {
  displayedGreeting,
  displayedNamePrefix,
  displayedName,
  activeCursor,
  isIntroActive,
  isIntroVisible,
  introStyles,
} = useHomeIntro(() => emit("ready"));
</script>

<style scoped>
.home-container {
  @apply pointer-events-auto flex max-w-4xl flex-col items-start space-y-8 text-left;
  position: relative;
  isolation: isolate;
  width: calc(100% - 2rem);
  margin-left: 2rem;
}

/* A fixed scrim keeps text readable even when the room behind it is bright. */
.home-container::before {
  position: absolute;
  inset: -18px;
  z-index: -1;
  border-radius: 24px;
  background: var(--color-home-scrim);
  content: "";
  pointer-events: none;
}

.home-container.is-intro-active:not(.is-intro-visible) :deep(.intro-element) {
  opacity: 0;
  transform: translateY(15px);
}

.home-container.is-intro-active.is-intro-visible :deep(.intro-element) {
  opacity: 1;
  transform: none;
  transition-property: opacity, transform;
  transition-duration: var(--intro-duration);
  transition-delay: calc(var(--intro-stagger) * var(--intro-order, 0));
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

@media (min-width: 768px) {
  .home-container {
    width: calc(100% - 6rem);
    margin-left: 6rem;
  }
}

@media (min-width: 1024px) {
  .home-container {
    width: calc(100% - 12rem);
    margin-left: 12rem;
  }
}

@media (max-width: 700px) {
  .home-container {
    width: 100%;
    margin-left: 0;
  }
}
</style>
