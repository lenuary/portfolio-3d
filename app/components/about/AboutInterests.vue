<template>
  <ul class="interest-grid" role="list" aria-label="Areas of interest">
    <li v-for="interest in interests" :key="interest.label" class="interest-card">
      <NeonIcon :name="interest.icon" />
      <span>{{ interest.label }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import NeonIcon from "@/components/ui/NeonIcon.vue";
const interests = [
  { label: "Development", icon: "code" },
  { label: "GameDev", icon: "gamepad" },
  { label: "3D / Unity", icon: "cube" },
  { label: "AI Projects", icon: "brain" },
] as const;
</script>

<style scoped>
.interest-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 27px;
}
.interest-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  border: 1px solid #db8ff62b;
  border-radius: 11px;
  background: linear-gradient(145deg, #b25aca20, #8f3cad10 60%, #a84bd127);
  box-shadow:
    inset 0 1px 8px #d88aff0a,
    0 5px 12px #0002;
  transition:
    background 0.2s,
    transform 0.2s,
    border-color 0.2s;
}
.interest-card:hover {
  transform: translateY(-4px);
  border-color: #dc76fa66;
  background-color: #a832c91a;
}
.interest-card svg {
  width: 34px;
  height: 34px;
  color: #f0b0ff;
  filter: drop-shadow(0 0 7px #d63aff77);
}
.interest-card span {
  font-size: 11px;
  white-space: nowrap;
}
@media (max-width: 900px) and (min-width: 701px) {
  .interest-grid {
    gap: 8px;
  }
  .interest-card span {
    font-size: 9px;
  }
}
@media (max-width: 700px) {
  .interest-grid {
    gap: 8px;
  }
  .interest-card {
    min-height: 84px;
    gap: 10px;
  }
  .interest-card svg {
    width: 28px;
    height: 28px;
  }
  .interest-card span {
    font-size: 9px;
  }
}
</style>
