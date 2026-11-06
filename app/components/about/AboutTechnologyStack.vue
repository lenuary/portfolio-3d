<template>
  <dl class="stack-grid">
    <div v-for="technologyGroup in technologyStack" :key="technologyGroup.label" class="stack-item">
      <dt>{{ technologyGroup.label }}</dt>
      <dd>{{ technologyGroup.technology }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
const technologyStack = [
  { label: "Frontend", technology: "Vue / Nuxt" },
  { label: "GameDev", technology: "Unity / C#" },
  { label: "Backend", technology: "Firebase" },
  { label: "3D & Motion", technology: "Three.js / GSAP" },
] as const;
</script>

<style scoped>
.stack-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 28px;
}
.stack-item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  gap: 8px;
}
.stack-item dt {
  font-size: 11px;
  font-weight: 700;
}
.stack-item dd {
  margin: 0;
  text-align: right;
  font-size: 10px;
  color: var(--color-text-muted);
}
.stack-item::after {
  content: "";
  grid-column: 1 / -1;
  height: 5px;
  border-radius: 8px;
  background: linear-gradient(90deg, #c338ea, #e15af1aa 70%, #e15af100), #c67ee72b;
}
@media (max-width: 900px) and (min-width: 701px) {
  .stack-grid {
    gap: 16px;
  }
}
@media (max-width: 700px) {
  .stack-grid {
    gap: 17px;
  }
  .stack-item {
    gap: 5px;
  }
  .stack-item dd {
    font-size: 9px;
  }
}
</style>
