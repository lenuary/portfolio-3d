<template>
  <h1 id="home-title" class="home-title" tabindex="-1">
    <span class="sr-only">{{ accessibleLabel }}</span>
    <span aria-hidden="true">
      {{ greeting }}
      <span v-if="cursor === 'greeting'" class="typing-cursor text-zinc-400">_</span>
      <br />
      {{ namePrefix }}
      <span class="home-name">{{ name }}</span>
      <span v-if="cursor === 'name'" class="typing-cursor text-fuchsia-500">_</span>
    </span>
  </h1>
</template>

<script setup lang="ts">
defineProps<{
  accessibleLabel: string;
  greeting: string;
  namePrefix: string;
  name: string;
  cursor: "greeting" | "name" | null;
}>();
</script>

<style scoped>
.home-title {
  @apply origin-left text-7xl font-extrabold leading-tight tracking-tight text-white;
  min-height: 180px;
  text-shadow: 0 4px 25px #000;
  transition: transform 0.5s;
}

.home-title:hover {
  transform: scale(1.05) translateX(8px);
}

.typing-cursor {
  @apply animate-pulse;
}

.home-name {
  color: var(--color-accent-text);
  text-shadow:
    0 4px 25px #000,
    0 0 30px #d946efe6;
}

@media (min-width: 768px) {
  .home-title {
    @apply text-8xl;
    min-height: 192px;
  }
}

@media (max-width: 700px) {
  .home-title {
    font-size: clamp(40px, 10vw, 66px);
    min-height: max(118px, 2.5em);
  }
}
</style>
