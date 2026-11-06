import { computed, nextTick, onScopeDispose, ref, type Ref } from "vue";
import type { Project } from "@/data/projectsData";

type Direction = -1 | 1;

export function useProjectCarousel(
  carouselElement: Ref<HTMLElement | null>,
  projects: readonly [Project, ...Project[]],
) {
  const activeProjectIndex = ref(0);
  const isTransitioning = ref(false);
  const projectAt = (index: number) =>
    projects[(index + projects.length) % projects.length] ?? projects[0];
  const activeProject = computed(() => projectAt(activeProjectIndex.value));
  const previousProject = computed(() => projectAt(activeProjectIndex.value - 1));
  const nextProject = computed(() => projectAt(activeProjectIndex.value + 1));

  let requestedIndex = 0;
  let requestedDirection: Direction = 1;
  let animations: Animation[] = [];
  let motionPreference: MediaQueryList | null = null;
  let isDisposed = false;

  function cancelAnimations() {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  }

  function handleMotionPreferenceChange(event: MediaQueryListEvent) {
    if (event.matches) animations.forEach((animation) => animation.finish());
  }

  function shouldReduceMotion() {
    if (typeof window === "undefined") return true;
    if (!motionPreference) {
      motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      motionPreference.addEventListener("change", handleMotionPreferenceChange);
    }
    return motionPreference.matches;
  }

  async function animateCards(phase: "leave" | "enter", direction: Direction) {
    const slots = carouselElement.value?.querySelectorAll<HTMLElement>("[data-project-slot]");
    if (shouldReduceMotion() || !slots?.length) return;

    const keyframes: Keyframe[] =
      phase === "leave"
        ? [
            { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
            { transform: `translate3d(${-direction * 44}px, 8px, 0) scale(.94)`, opacity: 0 },
          ]
        : [
            { transform: `translate3d(${direction * 64}px, -6px, 0) scale(.94)`, opacity: 0 },
            { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
          ];

    animations = Array.from(slots)
      .filter((slot) => typeof slot.animate === "function")
      .map((slot) =>
        slot.animate(keyframes, {
          duration: phase === "leave" ? 180 : 360,
          easing: phase === "leave" ? "ease-in" : "cubic-bezier(.16, 1, .3, 1)",
          fill: "both",
        }),
      );

    // Cancelling an animation on unmount rejects finished; it is an expected lifecycle event.
    await Promise.all(animations.map((animation) => animation.finished)).catch(() => {});
  }

  async function showRequestedProject(): Promise<void> {
    if (isDisposed || isTransitioning.value || requestedIndex === activeProjectIndex.value) return;
    isTransitioning.value = true;
    const targetIndex = requestedIndex;
    const direction = requestedDirection;

    try {
      await animateCards("leave", direction);
      if (isDisposed) return;

      activeProjectIndex.value = targetIndex;
      await nextTick();
      if (isDisposed) return;

      cancelAnimations();
      await animateCards("enter", direction);
    } finally {
      cancelAnimations();
      isTransitioning.value = false;
    }

    // Rapid clicks keep the latest requested destination instead of stacking stale transitions.
    if (!isDisposed) await showRequestedProject();
  }

  function selectProject(index: number, direction?: Direction) {
    const targetIndex = ((index % projects.length) + projects.length) % projects.length;
    const forwardDistance = (targetIndex - requestedIndex + projects.length) % projects.length;
    requestedDirection = direction ?? (forwardDistance <= projects.length / 2 ? 1 : -1);
    requestedIndex = targetIndex;
    return showRequestedProject();
  }

  function selectNextProject() {
    return selectProject(requestedIndex + 1, 1);
  }

  function selectPreviousProject() {
    return selectProject(requestedIndex - 1, -1);
  }

  onScopeDispose(() => {
    isDisposed = true;
    cancelAnimations();
    motionPreference?.removeEventListener("change", handleMotionPreferenceChange);
  });

  return {
    activeProjectIndex,
    activeProject,
    previousProject,
    nextProject,
    isTransitioning,
    selectProject,
    selectNextProject,
    selectPreviousProject,
  };
}
