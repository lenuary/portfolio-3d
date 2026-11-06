import assert from "node:assert/strict";
import test from "node:test";
import { effectScope, shallowRef } from "vue";
import { useProjectCarousel } from "../app/composables/useProjectCarousel.ts";
import { projectsData } from "../app/data/projectsData.ts";

function createCarousel(t, { reducedMotion = false } = {}) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const motionListeners = new Set();
  const motionPreference = {
    matches: reducedMotion,
    addEventListener: (_type, listener) => motionListeners.add(listener),
    removeEventListener: (_type, listener) => motionListeners.delete(listener),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { matchMedia: () => motionPreference },
  });

  const recordedAnimations = [];
  const slots = Array.from({ length: 3 }, () => ({
    animate() {
      let resolveFinished;
      let rejectFinished;
      const animation = {
        playState: "running",
        finished: new Promise((resolve, reject) => {
          resolveFinished = resolve;
          rejectFinished = reject;
        }),
        finish() {
          if (animation.playState !== "running") return;
          animation.playState = "finished";
          resolveFinished();
        },
        cancel() {
          if (animation.playState !== "running") return;
          animation.playState = "idle";
          rejectFinished(new Error("Animation cancelled"));
        },
      };
      recordedAnimations.push(animation);
      return animation;
    },
  }));
  const element = shallowRef({ querySelectorAll: () => slots });
  const scope = effectScope();
  const carousel = scope.run(() => useProjectCarousel(element, projectsData));

  t.after(() => {
    scope.stop();
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else delete globalThis.window;
  });

  return {
    ...carousel,
    scope,
    recordedAnimations,
    motionListeners,
    async finishPhase() {
      const pending = recordedAnimations.filter((animation) => animation.playState === "running");
      assert.equal(pending.length, 3);
      pending.forEach((animation) => animation.finish());
      await new Promise((resolve) => setImmediate(resolve));
    },
    enableReducedMotion() {
      motionPreference.matches = true;
      motionListeners.forEach((listener) => listener({ matches: true }));
    },
  };
}

test("previous selection wraps to the last project", async (t) => {
  const carousel = createCarousel(t, { reducedMotion: true });

  await carousel.selectPreviousProject();

  assert.equal(carousel.activeProjectIndex.value, projectsData.length - 1);
  assert.equal(carousel.activeProject.value.title, projectsData.at(-1).title);
  assert.equal(carousel.nextProject.value.title, projectsData[0].title);
  assert.equal(carousel.isTransitioning.value, false);
});

test("rapid requests settle at the latest destination", async (t) => {
  const carousel = createCarousel(t);
  const firstTransition = carousel.selectNextProject();
  carousel.selectNextProject();
  carousel.selectProject(3);

  assert.equal(carousel.activeProjectIndex.value, 0);
  assert.equal(carousel.isTransitioning.value, true);

  await carousel.finishPhase();
  assert.equal(carousel.activeProjectIndex.value, 1);
  await carousel.finishPhase();
  await carousel.finishPhase();
  assert.equal(carousel.activeProjectIndex.value, 3);
  await carousel.finishPhase();
  await firstTransition;

  assert.equal(carousel.activeProject.value.title, projectsData[3].title);
  assert.equal(carousel.isTransitioning.value, false);
});

test("unmount during exit cancels animations without changing the project", async (t) => {
  const carousel = createCarousel(t);
  const transition = carousel.selectNextProject();

  carousel.scope.stop();
  await transition;

  assert.equal(carousel.activeProjectIndex.value, 0);
  assert.equal(carousel.isTransitioning.value, false);
  assert.equal(carousel.motionListeners.size, 0);
  assert.ok(carousel.recordedAnimations.every((animation) => animation.playState === "idle"));
});

test("unmount during entrance discards a queued destination", async (t) => {
  const carousel = createCarousel(t);
  const transition = carousel.selectNextProject();
  await carousel.finishPhase();
  carousel.selectNextProject();

  carousel.scope.stop();
  await transition;

  assert.equal(carousel.activeProjectIndex.value, 1);
  assert.equal(carousel.isTransitioning.value, false);
  assert.equal(carousel.motionListeners.size, 0);
});

test("reduced motion changes projects without creating animations", async (t) => {
  const carousel = createCarousel(t, { reducedMotion: true });

  await carousel.selectNextProject();
  await carousel.selectProject(3);

  assert.equal(carousel.activeProjectIndex.value, 3);
  assert.equal(carousel.recordedAnimations.length, 0);
  assert.equal(carousel.isTransitioning.value, false);
});

test("enabling reduced motion finishes the current animation and queued change", async (t) => {
  const carousel = createCarousel(t);
  const transition = carousel.selectNextProject();
  carousel.selectProject(2);

  carousel.enableReducedMotion();
  await transition;

  assert.equal(carousel.activeProjectIndex.value, 2);
  assert.equal(carousel.recordedAnimations.length, 3);
  assert.equal(carousel.isTransitioning.value, false);
});
