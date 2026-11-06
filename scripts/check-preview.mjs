import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { homeData } from "../app/data/homeData.ts";
import { projectsData } from "../app/data/projectsData.ts";

const baseUrl = new URL(process.argv[2] ?? "http://127.0.0.1:3001/");
assert.ok(["http:", "https:"].includes(baseUrl.protocol), "Preview URL must use HTTP or HTTPS.");

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function plainText(markup) {
  return markup
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function waitForHtml() {
  const deadline = performance.now() + 10_000;
  let lastError;

  while (performance.now() < deadline) {
    const requestStarted = performance.now();
    try {
      const response = await fetch(baseUrl, {
        signal: AbortSignal.timeout(
          Math.max(1, Math.floor(Math.min(1500, deadline - requestStarted))),
        ),
      });
      if (response.status === 200) {
        const html = await response.text();
        return { response, html, responseMs: performance.now() - requestStarted };
      }

      lastError = new Error(`Preview returned HTTP ${response.status}.`);
      await response.body?.cancel();
    } catch (error) {
      lastError = error;
    }

    const remainingMs = deadline - performance.now();
    if (remainingMs > 0) await delay(Math.min(200, remainingMs));
  }

  throw new Error(`Preview did not become ready within 10 seconds: ${lastError?.message}`);
}

async function checkMedia(mediaPath, contentType) {
  const response = await fetch(new URL(mediaPath, baseUrl), {
    method: "HEAD",
    signal: AbortSignal.timeout(3000),
  });
  assert.equal(response.status, 200, `${mediaPath} must return HTTP 200.`);
  assert.equal(
    response.headers.get("content-type")?.split(";")[0]?.toLowerCase(),
    contentType,
    `${mediaPath} must be served as ${contentType}.`,
  );
}

async function main() {
  const { response, html, responseMs } = await waitForHtml();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html(?:;|$)/i);

  const documentTag = html.match(/<html\b[^>]*>/i)?.[0];
  assert.equal(attribute(documentTag ?? "", "lang"), "en", "Document language must be en.");
  assert.equal(
    plainText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    "Łukasz | Full-stack developer",
    "Production HTML must contain the portfolio title.",
  );

  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .find((tag) => attribute(tag, "name") === "description");
  assert.ok(
    (attribute(descriptionTag ?? "", "content") ?? "").trim().length > 40,
    "Production HTML must contain a useful meta description.",
  );

  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  assert.ok(heading, "Production HTML must contain the Home h1.");
  const visibleHeading = heading.replace(
    /<span\b[^>]*class=["'][^"']*\bsr-only\b[^"']*["'][^>]*>[\s\S]*?<\/span>/gi,
    "",
  );
  assert.equal(
    plainText(visibleHeading),
    `${homeData.greeting} ${homeData.namePrefix}${homeData.name}`.replace(/\s+/g, " ").trim(),
    "The visible SSR heading must be complete, not just the screen-reader label.",
  );

  const storyButton = [...html.matchAll(/<button\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .find((tag) => /\bstory-button\b/.test(attribute(tag, "class") ?? ""));
  assert.ok(storyButton, "The Home CTA must exist in server-rendered HTML.");
  assert.doesNotMatch(
    storyButton,
    /\sdisabled(?:\s|=|\/?\>)/i,
    "The Home CTA must be available before client-side animation starts.",
  );

  const imagePaths = [
    ...new Set([
      ...projectsData.map((project) => project.imageSrc),
      "/images/hologram-avatar.webp",
    ]),
  ];
  const videoSources = projectsData.flatMap((project) => project.videoSources ?? []);
  await Promise.all([
    ...imagePaths.map((imagePath) => checkMedia(imagePath, "image/webp")),
    ...videoSources.map((source) => checkMedia(source.src, source.type)),
  ]);

  const robots = await fetch(new URL("/robots.txt", baseUrl), {
    signal: AbortSignal.timeout(3000),
  });
  assert.equal(robots.status, 200, "robots.txt must return HTTP 200.");
  assert.match(await robots.text(), /User-agent:\s*\*/i);

  console.log(
    `HTTP integration PASS: SSR metadata, visible Home, CTA, ${imagePaths.length} WebP headers, ${videoSources.length} video headers and robots.txt.`,
  );
  console.log(
    `Local HTML response: ${responseMs.toFixed(1)} ms, ${Buffer.byteLength(html, "utf8")} bytes. This is not a Lighthouse or real-user performance score.`,
  );
}

await main().catch((error) => {
  console.error(`HTTP integration FAIL: ${error.message}`);
  process.exitCode = 1;
});
