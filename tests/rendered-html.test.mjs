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

test("includes four authored art sections with supplied artwork, an interactive model, and music", async () => {
  const [page, artStyles, model, track, render, sketch, obj, mtl, pixelPhone] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/art-mode.css", import.meta.url), "utf8"),
    readFile(new URL("../app/ObjArtwork.tsx", import.meta.url), "utf8"),
    stat(new URL("../public/art-mode-track.mp3", import.meta.url)),
    stat(new URL("../public/first-blend.png", import.meta.url)),
    stat(new URL("../public/digital-sketch.png", import.meta.url)),
    stat(new URL("../public/first-study.obj", import.meta.url)),
    stat(new URL("../public/first-study.mtl", import.meta.url)),
    stat(new URL("../public/pixel-phone.png", import.meta.url)),
  ]);

  assert.match(page, /Open art mode/);
  assert.match(page, /Return to software portfolio/);
  assert.match(page, /localStorage/);
  assert.match(page, /3D objects/);
  assert.match(page, /Digital sketches/);
  assert.match(page, /Motion loops/);
  assert.match(page, /Photo diary/);
  assert.match(page, /Opening soon/);
  assert.match(page, /first-blend\.png/);
  assert.match(page, /digital-sketch\.png/);
  assert.match(page, /art-mode-track\.mp3/);
  assert.match(page, /Pause Art Mode music/);
  assert.match(artStyles, /art-media--3d/);
  assert.match(artStyles, /pixel-phone\.png/);
  assert.match(artStyles, /image-rendering: pixelated/);
  assert.match(model, /OBJLoader/);
  assert.match(model, /getObjectByName\("Plane"\)/);
  assert.match(model, /Drag to rotate/);
  assert.ok(track.size > 0);
  assert.ok(render.size > 0);
  assert.ok(sketch.size > 0);
  assert.ok(obj.size > 0);
  assert.ok(mtl.size > 0);
  assert.ok(pixelPhone.size > 0);
});
