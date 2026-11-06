<template>
  <div class="portfolio-app">
    <a class="skip-link" href="#portfolio-content">Skip to content</a>
    <div ref="sceneContainer" class="office-scene" aria-hidden="true" />

    <main
      id="portfolio-content"
      class="portfolio-main"
      :class="{ 'is-home': activeSection === 'home' }"
      :aria-busy="isTransitioning"
      tabindex="-1"
    >
      <Transition name="section" @after-enter="focusSectionHeading">
        <component
          :is="activeSectionComponent"
          v-if="!isTransitioning"
          @navigate="navigateToSection"
          @ready="isNavigationReady = true"
        />
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import AboutSection from "@/components/sections/AboutSection.vue";
import ContactSection from "@/components/sections/ContactSection.vue";
import HomeSection from "@/components/sections/HomeSection.vue";
import ProjectsSection from "@/components/sections/ProjectsSection.vue";
import { useOfficeScene } from "@/composables/useOfficeScene";
import type { SectionId } from "@/data/navigation";

const sceneContainer = useTemplateRef<HTMLDivElement>("sceneContainer");
const activeSection = ref<SectionId>("home");
const sectionComponents = {
  home: HomeSection,
  about: AboutSection,
  projects: ProjectsSection,
  contact: ContactSection,
};
const activeSectionComponent = computed(() => sectionComponents[activeSection.value]);
let shouldFocusHeading = false;

function navigateToSection(sectionId: SectionId) {
  if (isTransitioning.value || activeSection.value === sectionId) return;

  shouldFocusHeading = true;
  transitionToSection(activeSection.value, sectionId, () => {
    activeSection.value = sectionId;
  });
}

function focusSectionHeading(sectionElement: Element) {
  if (!shouldFocusHeading) return;

  sectionElement.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
  shouldFocusHeading = false;
}

const { isTransitioning, isNavigationReady, transitionToSection } = useOfficeScene(
  sceneContainer,
  activeSection,
  navigateToSection,
);
</script>

<style scoped>
.portfolio-app {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #36133f, var(--color-page) 75%);
  color: #fff;
}

.office-scene {
  position: absolute;
  inset: 0;
}

.portfolio-main {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 32px 5vw;
  pointer-events: none;
}

.portfolio-main.is-home {
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  pointer-events: auto;
}

.portfolio-main.is-home :deep(.home-container) {
  margin-block: auto;
  flex-shrink: 0;
}

.section-enter-active,
.section-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.section-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.section-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

@media (max-width: 700px) {
  .portfolio-main {
    padding: 15px 12px;
  }

  .portfolio-main.is-home {
    padding: 25px 22px;
  }

  .portfolio-main.is-home :deep(.home-container) {
    margin: 0;
  }
}
</style>
