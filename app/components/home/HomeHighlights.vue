<template>
  <ul class="intro-element home-highlights" style="--intro-order: 2" aria-label="At a glance">
    <li v-for="highlight in highlights" :key="highlight.kind" class="highlight-card">
      <span
        class="highlight-icon"
        :class="`highlight-icon--${highlight.kind}`"
        aria-hidden="true"
        >{{ highlight.icon }}</span
      >
      {{ highlight.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { HomeHighlight } from "@/data/homeData";
defineProps<{ highlights: readonly HomeHighlight[] }>();
</script>

<style scoped>
.home-highlights {
  @apply flex flex-wrap gap-4 pt-3 text-sm font-semibold text-zinc-200;
}

.highlight-card {
  @apply flex items-center gap-2 rounded-xl border border-white/10 bg-black/70 px-5 py-2.5 backdrop-blur-md;
  transition:
    background-color 0.3s,
    border-color 0.3s,
    box-shadow 0.3s,
    transform 0.3s;
}

.highlight-card:hover {
  @apply border-fuchsia-500/60 bg-black/90;
  transform: translateY(-6px);
  box-shadow: 0 10px 20px #d946ef33;
}

.highlight-icon {
  @apply text-lg text-blue-400;
  transition: transform 0.3s;
}

.highlight-icon--stack {
  @apply text-sm font-bold;
}
.highlight-card:hover .highlight-icon {
  transform: scale(1.25);
}
.highlight-card:hover .highlight-icon--current-work {
  transform: scale(1.25) translate(4px, -4px);
}
</style>
