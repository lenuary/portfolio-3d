import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const stylesheet = await readFile(new URL("../app/assets/css/main.css", import.meta.url), "utf8");
const pagination = await readFile(
  new URL("../app/components/projects/ProjectPagination.vue", import.meta.url),
  "utf8",
);

function color(hex) {
  const normalized = hex.slice(1);
  assert.match(normalized, /^[\da-f]{6}(?:[\da-f]{2})?$/i, `Unsupported color: ${hex}`);
  return {
    channels: [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16)),
    alpha: normalized.length === 8 ? parseInt(normalized.slice(6), 16) / 255 : 1,
  };
}

function token(name) {
  const value = stylesheet.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6,8});`, "i"))?.[1];
  assert.ok(value, `Missing color token: --${name}`);
  return color(value);
}

function composite(foreground, background) {
  return {
    channels: foreground.channels.map(
      (channel, index) =>
        channel * foreground.alpha + background.channels[index] * (1 - foreground.alpha),
    ),
    alpha: 1,
  };
}

function luminance({ channels }) {
  const linear = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function channelUpperBound(colors) {
  return {
    channels: [0, 1, 2].map((index) => Math.max(...colors.map((value) => value.channels[index]))),
    alpha: 1,
  };
}

// Combine the brightest allowed channels and full glow strengths, even where they do not overlap.
const panelBase = channelUpperBound(
  ["color-panel-start", "color-panel-middle", "color-panel-end"].map(token),
);
const panelBound = composite(
  token("color-panel-glow-top"),
  composite(token("color-panel-glow-bottom"), panelBase),
);
const homeBound = composite(token("color-home-scrim"), color("#ffffff"));
const terminalBound = composite(color("#26302633"), color("#160e1e"));
const cases = [];

function check(name, foreground, background, minimum) {
  const ratio = contrast(foreground, background);
  cases.push({ name, ratio, minimum, pass: ratio >= minimum });
}

check("Home body over scrim and white scene", color("#e4e4e7"), homeBound, 4.5);
// Home's h1 is bold and at least 40px at every breakpoint, so the large-text threshold applies.
check("Home large h1 accent over scrim and white scene", token("color-accent-text"), homeBound, 3);
check("Home secondary CTA text", color("#d4d4d8"), homeBound, 4.5);
check("Panel primary text over conservative glow bound", token("color-text"), panelBound, 4.5);
check("Panel muted text over conservative glow bound", token("color-text-muted"), panelBound, 4.5);
check("Panel navigation numbers", color("#c5a0d4"), panelBound, 4.5);
check("Panel accent headings", token("color-accent-text"), panelBound, 4.5);
check("Panel focus ring", token("color-focus"), panelBound, 3);
const paginationColor = pagination.match(
  /\.project-pagination span\s*\{[^}]*background:\s*(#[\da-f]{6});/i,
)?.[1];
assert.ok(paginationColor, "Missing inactive project pagination color.");
check("Inactive project pagination dots", color(paginationColor), panelBound, 3);

for (const state of ["start", "end", "hover-start", "hover-end"]) {
  const background = token(`color-action-${state}`);
  check(`Send Message ${state}`, color("#ffffff"), background, 4.5);
  check(`Send Message focus against ${state}`, token("color-focus"), background, 3);
}

check("Contact field placeholder", color("#62bd91"), terminalBound, 4.5);
check("Contact field text", color("#43ffae"), terminalBound, 4.5);
check("Contact field boundary", token("color-field-border"), terminalBound, 3);
check("Contact field focus", color("#93efc2"), terminalBound, 3);
check("Contact helper/status text", color("#d0b4db"), terminalBound, 4.5);
check("About card small edition label", color("#d7a3e8"), color("#301443"), 4.5);
check("About card technology labels", color("#e3b7f3"), color("#301443"), 4.5);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ cases, passed: cases.every((entry) => entry.pass) }, null, 2));
} else {
  for (const entry of cases) {
    console.log(
      `${entry.pass ? "PASS" : "FAIL"} ${entry.name}: ${entry.ratio.toFixed(2)}:1 (min ${entry.minimum}:1)`,
    );
  }
  console.log(
    "Source-color checks only: not a browser screenshot, assistive-technology test or WCAG certification.",
  );
}

assert.ok(
  cases.every((entry) => entry.pass),
  "Some source-color contrast checks failed.",
);
