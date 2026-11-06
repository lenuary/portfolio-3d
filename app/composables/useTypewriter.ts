import { onScopeDispose, type Ref } from "vue";

export function useTypewriter() {
  const controller = new AbortController();

  function wait(delayMs: number): Promise<boolean> {
    if (controller.signal.aborted) return Promise.resolve(false);

    return new Promise((resolve) => {
      const finish = (completed: boolean) => {
        clearTimeout(timeoutId);
        controller.signal.removeEventListener("abort", handleAbort);
        resolve(completed);
      };
      const handleAbort = () => finish(false);
      const timeoutId = setTimeout(() => finish(true), delayMs);

      controller.signal.addEventListener("abort", handleAbort, { once: true });
    });
  }

  async function typeText(target: Ref<string>, text: string, intervalMs = 60): Promise<boolean> {
    for (const character of text) {
      if (controller.signal.aborted) return false;
      target.value += character;
      if (!(await wait(intervalMs))) return false;
    }

    return !controller.signal.aborted;
  }

  function cancel() {
    controller.abort();
  }

  onScopeDispose(cancel);

  return { typeText, wait, cancel };
}
