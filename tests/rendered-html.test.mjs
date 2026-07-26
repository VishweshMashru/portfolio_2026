import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("builds the Next.js portfolio", async () => {
  const [buildId, layout, page] = await Promise.all([
    readFile(new URL("../.next/BUILD_ID", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.ok(buildId.trim());
  assert.match(layout, /Vishwesh Mashruwala — Portfolio/);
  assert.match(page, /Vishwesh Mashruwala/);
  assert.match(page, /Software\. Hardware\./);
  assert.match(page, /These are not equal claims of experience/);
  assert.doesNotMatch(`${layout}\n${page}`, /\b(?:starter|drizzle|database)\b/i);
});

test("includes direct contact methods", async () => {
  const source = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /mailto:vishweshmash86@gmail\.com/);
  assert.match(source, /tel:\+919537517519/);
  assert.match(source, /https:\/\/wa\.me\/919537517519/);
});

test("includes the once-per-session animated loading wheel", async () => {
  const [page, styles, loader] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    stat(new URL("../public/loading-wheel.png", import.meta.url)),
  ]);

  assert.match(styles, /loading-wheel\.png/);
  assert.match(page, /sessionStorage/);
  assert.ok(loader.size > 0);
});

test("includes four honest coming-soon art sections with original artwork and music", async () => {
  const [page, styles, track] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    stat(new URL("../public/art-mode-track.mp3", import.meta.url)),
  ]);

  assert.match(page, /Open art mode/);
  assert.match(page, /Return to software portfolio/);
  assert.match(page, /localStorage/);
  assert.match(page, /3D Art/);
  assert.match(page, /Digital Art/);
  assert.match(page, /Video Editing/);
  assert.match(page, /Photos/);
  assert.match(page, /Coming soon\./);
  assert.match(page, /art-mode-track\.mp3/);
  assert.match(page, /Pause Art Mode music/);
  assert.doesNotMatch(page, /Lettering|Kinetic type study|Personal<br \/>practice|My visual/);
  assert.match(styles, /name-signature\.png/);
  assert.doesNotMatch(styles, /y2k-dark-hero/);
  assert.ok(track.size > 0);
});
