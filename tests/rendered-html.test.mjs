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

test("uses the Mahoraga video as a sound-enabled Art Mode transition", async () => {
  const [page, styles, transitionVideo] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/mahoragawheel.mp4", import.meta.url)),
  ]);

  assert.match(styles, /art-transition-video/);
  assert.match(styles, /art-transition-leave/);
  assert.match(page, /mahoragawheel\.mp4/);
  assert.match(page, /video\.muted = false/);
  assert.match(page, /video\.volume = 1/);
  assert.match(page, /track\.volume = 0/);
  assert.match(page, /Skip to Art mode/);
  assert.doesNotMatch(page, /autoPlay/);
  assert.match(page, /playsInline/);
  assert.match(page, /onEnded=\{finishArtTransition\}/);
  assert.doesNotMatch(page, /sessionStorage/);
  assert.match(transitionVideo.subarray(0, 64).toString("latin1"), /ftyp/);
});

test("includes four honest coming-soon art sections with original pixel artwork and music", async () => {
  const [page, styles, track, pixelWordmark, pixelStudy, pixelPhone] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    stat(new URL("../public/art-mode-track.mp3", import.meta.url)),
    stat(new URL("../public/pixel-wordmark.png", import.meta.url)),
    stat(new URL("../public/pixel-study-red.png", import.meta.url)),
    stat(new URL("../public/pixel-phone.png", import.meta.url)),
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
  assert.match(styles, /pixel-wordmark\.png/);
  assert.match(styles, /pixel-study-red\.png/);
  assert.match(styles, /pixel-phone\.png/);
  assert.match(styles, /image-rendering: pixelated/);
  assert.doesNotMatch(styles, /y2k-dark-hero/);
  assert.ok(track.size > 0);
  assert.ok(pixelWordmark.size > 0);
  assert.ok(pixelStudy.size > 0);
  assert.ok(pixelPhone.size > 0);
});
