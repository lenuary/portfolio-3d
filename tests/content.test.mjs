import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { portfolioSections } from "../app/data/navigation.ts";
import { projectsData } from "../app/data/projectsData.ts";

test("section identifiers and display numbers are unique", () => {
  assert.equal(
    new Set(portfolioSections.map((section) => section.id)).size,
    portfolioSections.length,
  );
  assert.equal(
    new Set(portfolioSections.map((section) => section.number)).size,
    portfolioSections.length,
  );
});

test("each project has existing media and safe external links", async () => {
  assert.ok(projectsData.length > 0);
  assert.equal(new Set(projectsData.map((project) => project.title)).size, projectsData.length);

  for (const project of projectsData) {
    await access(new URL(`../public${project.imageSrc}`, import.meta.url));
    for (const source of project.videoSources ?? []) {
      assert.ok(["video/webm", "video/mp4"].includes(source.type));
      assert.ok(source.src.startsWith("/images/projects/"));
      await access(new URL(`../public${source.src}`, import.meta.url));
    }
    assert.ok(project.imageWidth > 0 && project.imageHeight > 0);
    assert.equal(new URL(project.sourceUrl).protocol, "https:");
    assert.equal(new URL(project.previewUrl).protocol, "https:");
  }
});
