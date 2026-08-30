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

test("enters Art Mode without a video transition", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(page, /mahoragawheel\.mp4/);
  assert.doesNotMatch(page, /art-transition-video/);
  assert.doesNotMatch(page, /Skip to Art mode/);
  assert.doesNotMatch(page, /finishArtTransition/);
  assert.match(page, /track\.volume = \.48/);
  assert.doesNotMatch(page, /sessionStorage/);
});

test("includes four authored art sections with supplied artwork, an interactive model, and music", async () => {
  const [page, artStyles, model, track, render, sketch, obj, mtl] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/art-mode.css", import.meta.url), "utf8"),
    readFile(new URL("../app/ObjArtwork.tsx", import.meta.url), "utf8"),
    stat(new URL("../public/art-mode-track.mp3", import.meta.url)),
    stat(new URL("../public/first-blend.png", import.meta.url)),
    stat(new URL("../public/digital-sketch.png", import.meta.url)),
    stat(new URL("../public/first-study.obj", import.meta.url)),
    stat(new URL("../public/first-study.mtl", import.meta.url)),
  ]);

  assert.match(page, /Open art mode/);
  assert.match(page, /Return to software portfolio/);
  assert.match(page, /localStorage/);
  assert.match(page, /Digital art/);
  assert.match(page, /3D model/);
  assert.ok(page.indexOf('title: "Digital art"') < page.indexOf('title: "3D model"'));
  assert.match(page, /Video editing/);
  assert.match(page, /Miscellaneous/);
  assert.match(page, /CAD design/);
  assert.match(page, /PCB layouts/);
  assert.doesNotMatch(page, /Motion loops/);
  assert.doesNotMatch(page, /Photo diary/);
  assert.match(page, /first-blend\.png/);
  assert.match(page, /digital-sketch\.png/);
  assert.match(page, /art-mode-track\.mp3/);
  assert.match(page, /Pause Art Mode music/);
  assert.match(artStyles, /art-media--3d/);
  assert.match(artStyles, /art-video-empty/);
  assert.match(artStyles, /art-misc-grid/);
  assert.match(model, /OBJLoader/);
  assert.match(model, /getObjectByName\("Plane"\)/);
  assert.match(model, /Drag to rotate/);
  assert.ok(track.size > 0);
  assert.ok(render.size > 0);
  assert.ok(sketch.size > 0);
  assert.ok(obj.size > 0);
  assert.ok(mtl.size > 0);
});
