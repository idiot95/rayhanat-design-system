#!/usr/bin/env node
/**
 * No-fork cap: an app's copies of the registry files must match the registry
 * byte for byte. Change a component in registry/ and re-run `shadcn add` in the
 * apps; never edit an app's copy.
 *
 *   node scripts/check-drift.mjs [appSrcDir ...]     (default: apps/showcase/src)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const apps = process.argv.slice(2).length ? process.argv.slice(2) : ["apps/showcase/src"];
const pairs = [
  ["registry/ui", "components/ui"],
  ["registry/brand", "components/brand"],
  ["registry/lib", "lib"],
];
const files = [["registry/theme/theme.css", "styles/rayhanat.css"]];

let drift = 0;
for (const app of apps) {
  const compare = (src, dest) => {
    if (!existsSync(dest)) { console.log(`MISSING ${dest}`); drift++; return; }
    if (readFileSync(src, "utf8") !== readFileSync(dest, "utf8")) { console.log(`CHANGED ${dest} (differs from ${src})`); drift++; }
  };
  for (const [reg, rel] of pairs) {
    for (const name of readdirSync(reg)) compare(path.join(reg, name), path.join(app, rel, name));
  }
  for (const [reg, rel] of files) compare(reg, path.join(app, rel));
}
if (drift) { console.error(`\n${drift} file(s) drifted from the registry. Edit registry/, then reinstall with shadcn add.`); process.exit(1); }
console.log("No drift: app copies match the registry.");
