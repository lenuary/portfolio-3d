import { onBeforeUnmount, onMounted, ref } from "vue";
import { useTypewriter } from "@/composables/useTypewriter";
import { homeData } from "@/data/homeData";

const INTRO_TIMING = {
  initialDelay: 600,
  greetingInterval: 70,
  namePause: 300,
  prefixInterval: 60,
  nameInterval: 120,
  revealDuration: 800,
  revealStagger: 150,
} as const;

export function useHomeIntro(onReady: () => void) {
  const displayedGreeting = ref(homeData.greeting);
  const displayedNamePrefix = ref(homeData.namePrefix);
  const displayedName = ref(homeData.name);
  const activeCursor = ref<"greeting" | "name" | null>(null);
  const isIntroActive = ref(false);
  const isIntroVisible = ref(true);
  const { typeText, wait, cancel } = useTypewriter();
  const introStyles = {
    "--intro-duration": `${INTRO_TIMING.revealDuration}ms`,
    "--intro-stagger": `${INTRO_TIMING.revealStagger}ms`,
  };

  let motionPreference: MediaQueryList | null = null;
  let isUnmounted = false;
  let hasReportedReady = false;

  function completeIntro() {
    if (isUnmounted) return;

    displayedGreeting.value = homeData.greeting;
    displayedNamePrefix.value = homeData.namePrefix;
    displayedName.value = homeData.name;
    activeCursor.value = null;
    isIntroActive.value = false;
    isIntroVisible.value = true;

    if (!hasReportedReady) {
      hasReportedReady = true;
      onReady();
    }
  }

  function handleMotionPreferenceChange(event: MediaQueryListEvent) {
    if (!event.matches) return;

    cancel();
    completeIntro();
  }

  onMounted(async () => {
    try {
      motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      motionPreference.addEventListener("change", handleMotionPreferenceChange);

      if (motionPreference.matches) {
        completeIntro();
        return;
      }

      // SSR starts with complete content; only the mounted client enhances it with animation.
      isIntroActive.value = true;
      isIntroVisible.value = false;
      displayedGreeting.value = "";
      displayedNamePrefix.value = "";
      displayedName.value = "";
      activeCursor.value = "greeting";

      if (!(await wait(INTRO_TIMING.initialDelay))) return;
      if (!(await typeText(displayedGreeting, homeData.greeting, INTRO_TIMING.greetingInterval)))
        return;
      activeCursor.value = "name";
      if (!(await wait(INTRO_TIMING.namePause))) return;
      if (!(await typeText(displayedNamePrefix, homeData.namePrefix, INTRO_TIMING.prefixInterval)))
        return;
      if (!(await typeText(displayedName, homeData.name, INTRO_TIMING.nameInterval))) return;
      activeCursor.value = null;
      isIntroVisible.value = true;

      if (!(await wait(INTRO_TIMING.revealDuration + INTRO_TIMING.revealStagger * 3))) return;
      completeIntro();
    } catch {
      // Animation support is optional; content and navigation must remain available.
      completeIntro();
    }
  });

  onBeforeUnmount(() => {
    isUnmounted = true;
    cancel();
    motionPreference?.removeEventListener("change", handleMotionPreferenceChange);
  });

  return {
    displayedGreeting,
    displayedNamePrefix,
    displayedName,
    activeCursor,
    isIntroActive,
    isIntroVisible,
    introStyles,
  };
}
