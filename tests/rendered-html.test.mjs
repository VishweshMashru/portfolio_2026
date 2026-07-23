import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the Next.js portfolio", async () => {
  const [buildId, layout, page] = await Promise.all([
    readFile(new URL("../.next/BUILD_ID", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.ok(buildId.trim());
  assert.match(layout, /Vishwesh Mashruwala — Independent Maker/);
  assert.match(page, /Vishwesh Mashruwala/);
  assert.match(page, /Software, hardware/);
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
