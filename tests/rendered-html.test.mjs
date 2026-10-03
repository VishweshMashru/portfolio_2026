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

test("ships the Figma cover as valid local PNG assets with the existing music", async () => {
  for (const name of ["portrait-left.png", "portrait-right.png"]) {
    const image = await readFile(new URL(`../public/art-cover/${name}`, import.meta.url));
    assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.ok(image.readUInt32BE(16) > 0, `${name} has a width`);
    assert.ok(image.readUInt32BE(20) > 0, `${name} has a height`);
  }
  const track = await stat(new URL("../public/art-mode-track.mp3", import.meta.url));
  assert.ok(track.size > 0);
});
