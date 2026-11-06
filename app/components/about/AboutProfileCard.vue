<template>
  <div
    ref="interactionSurface"
    class="profile-card-interaction"
    :class="{ 'is-interacting': isInteracting }"
    role="group"
    tabindex="0"
    :aria-labelledby="nameId"
    :aria-describedby="instructionsId"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerleave="resetTilt"
    @pointercancel="resetTilt"
    @pointerup="handlePointerUp"
    @keydown="handleKeydown"
    @blur="resetTilt"
  >
    <figure class="profile-card">
      <div class="card-aura" aria-hidden="true" />
      <div class="card-frame" aria-hidden="true" />
      <div class="card-inlay" aria-hidden="true" />
      <div class="card-foil" aria-hidden="true" />
      <div class="card-emblem" aria-hidden="true"><NeonIcon name="cube" /></div>
      <div class="card-badges" aria-hidden="true">
        <span class="developer-badge">DEV<small>FULL STACK</small></span>
        <span class="country-badge"><i />PL</span>
      </div>
      <picture class="profile-portrait-source">
        <source srcset="/images/hologram-avatar.webp" type="image/webp" />
        <img
          class="profile-portrait"
          src="/images/hologram-avatar.png"
          alt=""
          width="1312"
          height="1199"
          decoding="async"
        />
      </picture>
      <div class="card-shine" aria-hidden="true" />
      <figcaption class="card-caption">
        <span class="card-edition">DEVELOPER COLLECTION</span>
        <p :id="nameId" class="card-name">Łukasz</p>
        <p>Full-stack developer</p>
        <span class="card-technologies">Vue <i /> Nuxt <i /> Unity</span>
      </figcaption>
    </figure>
    <span class="interaction-cue" aria-hidden="true">Move to explore</span>
    <span :id="instructionsId" class="sr-only">
      {{
        isMotionReduced
          ? "Card motion is reduced to match your system settings."
          : "Move your pointer over the card or use the arrow keys to tilt it. Press Home or Escape to reset."
      }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, useTemplateRef } from "vue";
import NeonIcon from "@/components/ui/NeonIcon.vue";

const MAX_TILT_DEGREES = 10;
const KEYBOARD_TILT_STEP = 3;
const interactionSurface = useTemplateRef<HTMLDivElement>("interactionSurface");
const nameId = useId();
const instructionsId = useId();
const isInteracting = ref(false);
const isMotionReduced = ref(false);

let motionPreference: MediaQueryList | null = null;
let animationFrame: number | null = null;
let touchOrigin: { x: number; y: number } | null = null;
let tilt = { x: 0, y: 0, lightX: 50, lightY: 30 };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function paintTilt() {
  animationFrame = null;
  const surface = interactionSurface.value;
  if (!surface) return;

  surface.style.setProperty("--tilt-x", `${tilt.x}deg`);
  surface.style.setProperty("--tilt-y", `${tilt.y}deg`);
  surface.style.setProperty("--light-x", `${tilt.lightX}%`);
  surface.style.setProperty("--light-y", `${tilt.lightY}%`);
}

function scheduleTilt() {
  if (animationFrame === null) animationFrame = requestAnimationFrame(paintTilt);
}

function resetTilt() {
  if (animationFrame !== null) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  touchOrigin = null;
  isInteracting.value = false;
  tilt = { x: 0, y: 0, lightX: 50, lightY: 30 };
  paintTilt();
}

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType !== "touch") return;
  if (!event.isPrimary) {
    resetTilt();
    return;
  }
  touchOrigin = { x: event.clientX, y: event.clientY };
}

function handlePointerMove(event: PointerEvent) {
  if (isMotionReduced.value) return;

  if (event.pointerType === "touch") {
    if (!event.isPrimary || !touchOrigin) return;
    const horizontalDistance = Math.abs(event.clientX - touchOrigin.x);
    const verticalDistance = Math.abs(event.clientY - touchOrigin.y);
    if (horizontalDistance < 8 || horizontalDistance <= verticalDistance) return;
  }

  const surface = interactionSurface.value;
  if (!surface) return;

  // Measure the stationary hit area so the tilted card cannot feed movement back into itself.
  const bounds = surface.getBoundingClientRect();
  const horizontalPosition = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  const verticalPosition = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
  tilt = {
    x: (0.5 - verticalPosition) * MAX_TILT_DEGREES * 2,
    y: (horizontalPosition - 0.5) * MAX_TILT_DEGREES * 2,
    lightX: horizontalPosition * 100,
    lightY: verticalPosition * 100,
  };
  isInteracting.value = true;
  scheduleTilt();
}

function handlePointerUp(event: PointerEvent) {
  if (event.pointerType === "touch") resetTilt();
}

function handleKeydown(event: KeyboardEvent) {
  const supportedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "Escape"];
  if (!supportedKeys.includes(event.key)) return;
  if (isMotionReduced.value && event.key.startsWith("Arrow")) return;
  event.preventDefault();

  if (event.key === "Home" || event.key === "Escape") {
    resetTilt();
    return;
  }
  if (isMotionReduced.value) return;

  const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : -1;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    tilt.y = clamp(tilt.y + direction * KEYBOARD_TILT_STEP, -MAX_TILT_DEGREES, MAX_TILT_DEGREES);
  } else {
    tilt.x = clamp(tilt.x + direction * KEYBOARD_TILT_STEP, -MAX_TILT_DEGREES, MAX_TILT_DEGREES);
  }
  tilt.lightX = 50 + (tilt.y / MAX_TILT_DEGREES) * 40;
  tilt.lightY = 50 - (tilt.x / MAX_TILT_DEGREES) * 40;
  isInteracting.value = true;
  scheduleTilt();
}

function updateMotionPreference() {
  isMotionReduced.value = motionPreference?.matches ?? false;
  if (isMotionReduced.value) resetTilt();
}

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateMotionPreference();
  motionPreference.addEventListener("change", updateMotionPreference);
});

onBeforeUnmount(() => {
  if (animationFrame !== null) cancelAnimationFrame(animationFrame);
  motionPreference?.removeEventListener("change", updateMotionPreference);
});
</script>

<style scoped>
.profile-card-interaction {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --light-x: 50%;
  --light-y: 30%;
  position: relative;
  width: min(280px, 100%);
  aspect-ratio: 4 / 5;
  margin: 10px auto 28px;
  perspective: 1000px;
  touch-action: pan-y pinch-zoom;
  border-radius: 24px;
}

.profile-card-interaction:focus-visible {
  outline-offset: 8px;
}

.profile-card {
  --card-cut: polygon(8% 0, 92% 0, 100% 6%, 100% 87%, 93% 94%, 50% 100%, 7% 94%, 0 87%, 0 6%);
  position: absolute;
  inset: 0;
  margin: 0;
  transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transform-style: preserve-3d;
  transition: transform 450ms cubic-bezier(0.2, 0.7, 0.2, 1);
  color: #fff6ff;
}

.is-interacting .profile-card {
  transition-duration: 120ms;
}

.card-aura {
  position: absolute;
  inset: 8% -12% -5%;
  border-radius: 50%;
  background: radial-gradient(ellipse, #d13ef14a, transparent 70%);
  filter: blur(20px);
  transform: translateZ(-20px);
}

.card-frame,
.card-inlay,
.card-foil,
.card-shine {
  overflow: hidden;
  position: absolute;
  inset: 0;
  clip-path: var(--card-cut);
  pointer-events: none;
}

.card-frame {
  background: linear-gradient(
    125deg,
    #f6c9ff,
    #7e398f 16%,
    #d57bef 30%,
    #3a1553 48%,
    #bd62e1 68%,
    #f6c7ff 88%,
    #8c409f
  );
  filter: drop-shadow(0 0 12px #d33aff77);
}

.card-inlay {
  inset: 3px;
  background:
    radial-gradient(ellipse at 55% 28%, #9f35d461, transparent 58%),
    linear-gradient(155deg, #4a1a68, #1a092a 70%, #4b1a65);
}

.card-foil {
  inset: 7px;
  opacity: 0.45;
  background:
    repeating-linear-gradient(
      125deg,
      transparent 0 15px,
      #d2a1ff15 15px 16px,
      transparent 16px 31px
    ),
    linear-gradient(40deg, #5c36cf26, transparent 50%, #f582eb22);
}

.card-emblem {
  position: absolute;
  top: 11%;
  left: 12%;
  width: 76%;
  color: #d6a2ff;
  opacity: 0.11;
  transform: translateZ(8px);
}

.card-emblem svg {
  width: 100%;
  height: auto;
}

.card-badges {
  position: absolute;
  inset: 8% 9% auto;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transform: translateZ(30px);
}

.developer-badge {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #f5d4ff;
  font-size: 21px;
  font-weight: 850;
  letter-spacing: -0.7px;
  line-height: 1;
}

.developer-badge small {
  color: #d3addf;
  font-size: 6px;
  letter-spacing: 1.3px;
  font-weight: 650;
}

.country-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
}

.country-badge i {
  width: 16px;
  height: 10px;
  border: 1px solid #f4c6ff66;
  background: linear-gradient(#fff 0 50%, #e85b8b 50% 100%);
}

.profile-portrait {
  position: absolute;
  z-index: 1;
  top: 2%;
  left: -4%;
  width: 108%;
  max-width: none;
  height: 78%;
  object-fit: contain;
  object-position: center bottom;
  transform: translateZ(42px);
  filter: drop-shadow(0 0 9px #bc51f655);
  mask-image: linear-gradient(#000 68%, transparent 98%);
  -webkit-mask-image: linear-gradient(#000 68%, transparent 98%);
  pointer-events: none;
}

.profile-portrait-source {
  display: contents;
}

.card-shine {
  inset: 3px;
  z-index: 3;
  opacity: 0.5;

  mix-blend-mode: screen;
  transform: translateZ(45px);
  transition: opacity 300ms ease;
}

.card-shine::before {
  content: "";
  position: absolute;
  inset: -50%;
  background: radial-gradient(ellipse at center, #f8cfff52, #ec99ff0d 28%, transparent 57%);
  transform: translate3d(calc((var(--light-x) - 50%) / 3), calc((var(--light-y) - 50%) / 3), 0);
}

.is-interacting .card-shine {
  opacity: 0.9;
}

.card-caption {
  position: absolute;
  z-index: 4;
  right: 10%;
  bottom: 9%;
  left: 10%;
  padding-top: 13px;
  border-top: 1px solid #eaa6ff61;
  text-align: center;
  transform: translateZ(50px);
  background: linear-gradient(#301443, #210c32);
  text-shadow: 0 2px 10px #0d031c;
}

.card-edition {
  display: block;
  margin-bottom: 5px;
  color: #d7a3e8;
  font-size: 6px;
  letter-spacing: 2px;
}

.card-caption .card-name {
  color: #fff6ff;
  margin: 0 0 3px;
  font-size: clamp(23px, 2.5vw, 31px);
  font-weight: 850;
  line-height: 1;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-caption p {
  margin: 0;
  color: #f0d8f6;
  font-size: 11px;
}

.card-technologies {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  color: #e3b7f3;
  font-size: 8px;
  font-weight: 550;
}

.card-technologies i {
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #d362f4;
}

.interaction-cue {
  position: absolute;
  top: calc(100% + 16px);
  width: 100%;
  color: #d1a8df;
  font-size: 8px;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  pointer-events: none;
}

@media (max-width: 900px) and (min-width: 701px) {
  .profile-card-interaction {
    width: min(240px, 100%);
  }

  .developer-badge {
    font-size: 18px;
  }

  .card-caption .card-name {
    font-size: 24px;
  }
}

@media (max-width: 700px) {
  .card-aura {
    inset-inline: 0;
  }

  .profile-card-interaction {
    width: min(255px, 100%);
    margin-top: 5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-card {
    transform: none;
    transition: none;
  }

  .card-shine {
    transition: none;
  }
}
</style>
