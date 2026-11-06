<template>
  <p class="intro-element home-subtitle" style="--intro-order: 0">{{ role }}</p>
  <div class="intro-element home-descriptions" style="--intro-order: 1">
    <p v-for="paragraph in paragraphs" :key="paragraph" class="description-item">
      {{ paragraph }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ role: string; paragraphs: readonly string[] }>();
</script>

<style scoped>
.home-subtitle {
  @apply text-2xl font-bold text-zinc-100;
  text-shadow:
    0 4px 30px #000,
    0 2px 10px #000;
  transition:
    color 0.5s,
    transform 0.5s;
}

.home-subtitle:hover {
  color: #fff;
  transform: translateX(12px);
}

.home-descriptions {
  @apply max-w-3xl space-y-5 text-base font-medium text-zinc-200;
  text-shadow:
    0 4px 20px #000,
    0 2px 8px #000;
}

.description-item {
  transition:
    color 0.3s,
    transform 0.3s;
}

.description-item:hover {
  color: #fff;
  transform: translateX(8px);
}

@media (min-width: 768px) {
  .home-subtitle {
    @apply text-3xl;
  }
  .home-descriptions {
    @apply text-lg;
  }
}

@media (max-width: 700px) {
  .home-subtitle {
    font-size: 18px;
  }
  .home-descriptions {
    font-size: 13px;
  }
}
</style>
