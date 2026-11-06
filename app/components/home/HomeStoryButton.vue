<template>
  <button
    type="button"
    class="intro-element story-button"
    style="--intro-order: 3"
    :disabled="disabled"
    @click="emit('discover')"
  >
    <span class="story-button-icon" aria-hidden="true">→</span>
    <span class="story-button-copy">
      <span class="story-button-title">Discover my story</span>
      <span class="story-button-subtitle">A little more about me</span>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ discover: [] }>();
</script>

<style scoped>
.story-button {
  @apply mt-6 flex items-center gap-5 rounded-2xl border border-white/10 bg-black/70 p-5 pr-14 backdrop-blur-md;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s,
    box-shadow 0.3s,
    transform 0.3s;
}

.story-button:not(:disabled):hover {
  @apply border-fuchsia-500/50 bg-black/90;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px #d946ef40;
}

.story-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 5px;
}
.story-button-icon {
  @apply flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg;
  flex-shrink: 0;
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.story-button:not(:disabled):hover .story-button-icon {
  @apply bg-fuchsia-600;
  transform: scale(1.1) rotate(12deg);
}

.story-button-copy {
  @apply text-left;
}
.story-button-title {
  @apply block text-xl font-bold text-white;
  transition: color 0.3s;
}
.story-button:not(:disabled):hover .story-button-title {
  @apply text-fuchsia-400;
}
.story-button-subtitle {
  @apply mt-0.5 block text-sm text-zinc-300;
  transition: color 0.3s;
}
.story-button:not(:disabled):hover .story-button-subtitle {
  @apply text-zinc-200;
}
</style>
