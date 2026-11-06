<template>
  <section
    class="holo-window"
    :class="{ 'is-expanded': isExpanded, 'is-minimized': isMinimized }"
    :aria-labelledby="`${sectionId}-window-title`"
  >
    <div class="holo-shell">
      <header class="window-bar">
        <div class="window-identity">
          <NeonIcon name="hologram" class="window-mark" />
          <span class="window-number">{{ activeSection.number }} / {{ sectionCount }}</span>
          <span class="window-divider" aria-hidden="true">/</span>
          <span :id="`${sectionId}-window-title`" class="window-title">{{
            activeSection.title
          }}</span>
        </div>
        <div class="window-controls">
          <button
            type="button"
            :aria-label="isMinimized ? 'Restore window' : 'Minimize window'"
            :aria-expanded="!isMinimized"
            :aria-controls="`${sectionId}-window-content`"
            @click="isMinimized = !isMinimized"
          >
            <NeonIcon name="minimize" />
          </button>
          <button
            type="button"
            :aria-label="isExpanded ? 'Restore window size' : 'Expand window'"
            :aria-pressed="isExpanded"
            @click="isExpanded = !isExpanded"
          >
            <NeonIcon name="maximize" />
          </button>
          <button
            type="button"
            aria-label="Close window and return home"
            @click="emit('navigate', 'home')"
          >
            <NeonIcon name="close" />
          </button>
        </div>
      </header>
      <div
        v-show="!isMinimized"
        :id="`${sectionId}-window-content`"
        class="window-content"
        role="region"
        :aria-label="`${activeSection.title} content`"
        tabindex="0"
      >
        <slot />
      </div>
      <footer class="window-footer">
        <nav aria-label="Portfolio sections">
          <button
            v-for="section in portfolioSections"
            :key="section.id"
            type="button"
            :class="{ active: section.id === sectionId }"
            :aria-current="section.id === sectionId ? 'page' : undefined"
            @click="emit('navigate', section.id)"
          >
            <span aria-hidden="true">{{ section.number }}</span> {{ section.label }}
          </button>
        </nav>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import NeonIcon from "@/components/ui/NeonIcon.vue";
import { portfolioSections, type SectionId } from "@/data/navigation";

const props = defineProps<{ sectionId: SectionId }>();
const emit = defineEmits<{ navigate: [sectionId: SectionId]; ready: [] }>();
const isMinimized = ref(false);
const isExpanded = ref(false);
const sectionCount = portfolioSections.length.toString().padStart(2, "0");
const activeSection = computed(
  () => portfolioSections.find((section) => section.id === props.sectionId) ?? portfolioSections[0],
);
onMounted(() => emit("ready"));
</script>

<style scoped>
.holo-window {
  --window-cut: polygon(
    0 28px,
    28px 0,
    61% 0,
    calc(61% + 15px) 5px,
    calc(100% - 32px) 5px,
    100% 35px,
    100% 32%,
    calc(100% - 5px) calc(32% + 12px),
    calc(100% - 5px) 67%,
    100% calc(67% + 12px),
    100% calc(100% - 32px),
    calc(100% - 32px) 100%,
    64% 100%,
    calc(64% - 13px) calc(100% - 5px),
    28px calc(100% - 5px),
    0 calc(100% - 33px),
    0 75%,
    5px calc(75% - 12px),
    5px 27%,
    0 calc(27% - 12px)
  );
  position: relative;
  width: min(1080px, 100%);
  margin: auto;
  padding: 1px;
  pointer-events: auto;
  isolation: isolate;
  border-radius: 28px;
  box-shadow:
    0 0 25px #cb38ff24,
    0 22px 40px #0007;
  transition: width 0.3s ease;
  color: var(--color-text);
  text-align: left;
  user-select: text;
}
.holo-window::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  clip-path: var(--window-cut);
  background: linear-gradient(135deg, #f0a0ff, #8c30a68c 22%, #84369e6b 55%, #ef99ff);
}
.holo-shell {
  position: relative;
  clip-path: var(--window-cut);
  background:
    radial-gradient(ellipse at 4% 0%, var(--color-panel-glow-top), transparent 39%),
    radial-gradient(ellipse at 88% 100%, var(--color-panel-glow-bottom), transparent 45%),
    linear-gradient(
      110deg,
      var(--color-panel-start),
      var(--color-panel-middle) 55%,
      var(--color-panel-end)
    );
}
.holo-shell::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid #d96bf31c;
  clip-path: var(--window-cut);
  pointer-events: none;
}
.window-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 69px;
  padding: 4px 35px 0;
  gap: 12px;
}
.window-identity {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}
.window-mark {
  width: 17px;
  height: 17px;
  color: #edacff;
  filter: drop-shadow(0 0 5px #dc43ff);
}
.window-number {
  color: #e9d1ef;
  font-size: 12px;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}
.window-divider {
  margin: 0 3px;
  font-size: 12px;
  color: #bb73c64a;
}
.window-title {
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.65px;
}
.window-controls {
  display: flex;
  gap: 5px;
}
.window-controls button {
  padding: 5px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: #efb1ff;
  border-radius: 4px;
  transition: background 0.2s;
}
.window-controls svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  filter: drop-shadow(0 0 4px #f16fff);
}
.window-controls button:hover {
  background: #d95bff29;
}
.window-controls button:last-child:hover {
  background: #ef44a750;
}
.window-content {
  padding: 14px 45px 14px;
  max-height: calc(100svh - 210px);
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
  scroll-padding-block: 12px;
  scrollbar-width: thin;
  scrollbar-color: #9731b6 #21102d;
  overscroll-behavior: contain;
}
.window-footer {
  margin: 2px 35px 0;
  padding: 14px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.window-footer nav {
  display: flex;
  gap: 20px;
}
.window-footer button {
  min-height: 32px;
  font-size: 11px;
  color: #dbc1e3;
  transition: color 0.2s;
  padding: 4px 0;
}
.window-footer button span {
  color: #c5a0d4;
  font-size: 8px;
  margin-right: 4px;
}
.window-footer button:hover,
.window-footer button.active {
  color: #f5b2ff;
  text-shadow: 0 0 12px #e53fff88;
}
.window-footer button.active span {
  color: #f5b2ff;
}
.window-footer button.active {
  text-decoration: underline;
  text-underline-offset: 5px;
}
button {
  cursor: pointer;
}
button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}
.is-expanded {
  width: min(1340px, 100%);
}
.is-minimized .window-footer {
  padding-top: 0;
}
@media (max-width: 700px) {
  .window-bar {
    padding: 5px 22px 0;
    height: 60px;
  }
  .window-identity {
    gap: 7px;
  }
  .window-title {
    font-size: 11px;
  }
  .window-number {
    font-size: 10px;
  }
  .window-controls {
    gap: 0;
  }
  .window-controls button {
    width: 28px;
  }
  .window-content {
    padding: 12px 24px;
    max-height: calc(100svh - 175px);
  }
  .window-footer {
    margin: 0 24px;
    padding-bottom: 25px;
    justify-content: center;
  }
  .window-footer nav {
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
@media (max-width: 380px) {
  .window-mark,
  .window-divider {
    display: none;
  }
  .window-content {
    padding-inline: 20px;
  }
  .window-footer nav {
    gap: 11px;
  }
}
</style>
