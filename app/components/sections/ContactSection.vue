<template>
  <HoloWindow section-id="contact" @navigate="emit('navigate', $event)" @ready="emit('ready')">
    <div class="contact-layout">
      <ContactDetails />
      <div class="terminal-scene">
        <ContactForm />
      </div>
      <ContactGlobe />
    </div>
  </HoloWindow>
</template>

<script setup lang="ts">
import ContactDetails from "@/components/contact/ContactDetails.vue";
import ContactForm from "@/components/contact/ContactForm.vue";
import ContactGlobe from "@/components/contact/ContactGlobe.vue";
import HoloWindow from "@/components/ui/HoloWindow.vue";
import type { SectionId } from "@/data/navigation";

const emit = defineEmits<{ navigate: [sectionId: SectionId]; ready: [] }>();
</script>

<style scoped>
.contact-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(245px, 1fr) minmax(290px, 1.12fr) minmax(125px, 0.5fr);
  align-items: center;
  gap: 15px;
  min-height: 435px;
  padding: 8px 4px 5px;
  min-width: 0;
}

.terminal-scene {
  position: relative;
  z-index: 2;
  padding: 20px 0 13px;
  min-width: 0;
}

@media (max-width: 1000px) {
  .contact-layout {
    grid-template-columns: minmax(230px, 1fr) minmax(275px, 1.12fr);
    gap: 28px;
    padding-inline: 10px;
  }
}

@media (max-width: 760px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 4px;
    padding-inline: 2px;
    min-height: auto;
  }

  .terminal-scene {
    max-width: 370px;
    width: 100%;
    margin-inline: auto;
    padding-top: 30px;
  }
}
</style>
