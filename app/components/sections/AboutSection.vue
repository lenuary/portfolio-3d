<template>
  <HoloWindow section-id="about" @navigate="emit('navigate', $event)" @ready="emit('ready')">
    <div class="about-layout">
      <AboutProfileCard />
      <div class="about-copy">
        <AboutDetails />
        <AboutInterests />
        <AboutTechnologyStack />
      </div>
    </div>
  </HoloWindow>
</template>

<script setup lang="ts">
import AboutDetails from "@/components/about/AboutDetails.vue";
import AboutInterests from "@/components/about/AboutInterests.vue";
import AboutProfileCard from "@/components/about/AboutProfileCard.vue";
import AboutTechnologyStack from "@/components/about/AboutTechnologyStack.vue";
import HoloWindow from "@/components/ui/HoloWindow.vue";
import type { SectionId } from "@/data/navigation";

const emit = defineEmits<{ navigate: [sectionId: SectionId]; ready: [] }>();
</script>

<style scoped>
.about-layout {
  display: grid;
  grid-template-columns: 0.85fr 1.35fr;
  gap: 45px;
  align-items: center;
  min-height: 386px;
  padding: 4px 0 18px;
}
.about-copy {
  padding: 0 3px 0 0;
}
@media (min-width: 1300px) {
  .about-layout {
    gap: 55px;
  }
}
@media (max-width: 900px) and (min-width: 701px) {
  .about-layout {
    grid-template-columns: 0.75fr 1.4fr;
    gap: 20px;
  }
}
@media (max-width: 700px) {
  .about-layout {
    grid-template-columns: 1fr;
    gap: 21px;
    padding-bottom: 12px;
  }
}
</style>
