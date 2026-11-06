import assert from "node:assert/strict";
import test from "node:test";
import { effectScope, ref } from "vue";
import { useTypewriter } from "../app/composables/useTypewriter.ts";

test("typing preserves Unicode characters and completes", async () => {
  const scope = effectScope();
  const typewriter = scope.run(useTypewriter);
  const output = ref("");

  assert.equal(await typewriter.typeText(output, "Łukasz 👋", 0), true);
  assert.equal(output.value, "Łukasz 👋");
  scope.stop();
});

test("leaving the component cancels typing and settles pending work", async () => {
  const scope = effectScope();
  const typewriter = scope.run(useTypewriter);
  const output = ref("");
  const typing = typewriter.typeText(output, "Portfolio", 60_000);
  const pendingDelay = typewriter.wait(60_000);

  scope.stop();
  const textAtDisposal = output.value;

  assert.equal(await typing, false);
  assert.equal(await pendingDelay, false);
  assert.equal(await typewriter.typeText(output, "Unexpected text", 0), false);
  assert.equal(output.value, textAtDisposal);
});
