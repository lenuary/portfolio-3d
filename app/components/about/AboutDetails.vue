<template>
  <div class="about-details">
    <header>
      <h1 tabindex="-1">My <span>Journey</span></h1>
      <p class="about-subtitle">{{ aboutData.subtitle }}</p>
    </header>
    <p class="about-intro">{{ aboutData.introduction }}</p>
  </div>
</template>

<script setup lang="ts">
import { aboutData } from "@/data/aboutData";
</script>

<style scoped>
h1 {
  font-size: clamp(30px, 3vw, 44px);
  line-height: 1.12;
  font-weight: 850;
  letter-spacing: -1.3px;
  margin: 0 0 11px;
  text-shadow: 0 3px 10px #0008;
}
h1 span {
  color: var(--color-accent-text);
  text-shadow: 0 0 24px #d742f02b;
}
.about-subtitle {
  font-size: 12px;
  color: #f1deef;
  margin: 0 0 25px;
  font-weight: 500;
}
.about-intro {
  font-size: 14px;
  line-height: 1.8;
  color: #f0e6f2;
  margin: 0 0 22px;
  max-width: 500px;
}
@media (max-width: 700px) {
  .about-subtitle {
    margin-bottom: 17px;
  }
  .about-intro {
    font-size: 13px;
  }
}
</style>
