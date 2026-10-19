#!/usr/bin/env node
/**
 * Contrast cap: every text/background pair in the theme must reach 4.5:1, and
 * every control boundary 3:1, in light and dark. Reads the theme file itself,
 * so a token change that breaks contrast fails CI.
 *
 *   node scripts/check-contrast.mjs registry/theme/theme.css
 */
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "registry/theme/theme.css";
const css = readFileSync(file, "utf8");

function block(startPattern) {
  const i = css.search(startPattern);
  if (i < 0) throw new Error(`No block matching ${startPattern} in ${file}`);
  const open = css.indexOf("{", i);
  let depth = 0;
  for (let j = open; j < css.length; j++) {
    if (css[j] === "{") depth++;
    if (css[j] === "}" && --depth === 0) return css.slice(open + 1, j);
  }
  throw new Error("Unclosed block");
}
const vars = (body) => Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));

const light = vars(block(/^:root\s*\{/m));
const dark = { ...light, ...vars(block(/^:root\[data-theme="dark"\]\s*\{/m)) };

/* colour parsing: #hex and oklch(L C H) */
function toLinear(c) { return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function hexToLinear(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255));
}
function oklchToLinear(str) {
  const [L, C, H] = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/).slice(1).map(Number);
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}
function luminance(value, table) {
  const resolved = value.startsWith("var(") ? table[value.match(/var\(--([a-z0-9-]+)\)/)[1]] : value;
  const [r, g, b] = resolved.startsWith("#") ? hexToLinear(resolved) : oklchToLinear(resolved);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b, t) => { const [x, y] = [luminance(t[a], t), luminance(t[b], t)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const TEXT = 4.5, UI = 3;
const pairs = [
  ["foreground", "background", TEXT], ["foreground", "page", TEXT], ["card-foreground", "card", TEXT],
  ["muted-foreground", "background", TEXT], ["muted-foreground", "card", TEXT], ["muted-foreground", "muted", TEXT],
  ["primary-foreground", "primary", TEXT], ["primary", "background", TEXT], ["primary", "card", TEXT],
  ["secondary-foreground", "secondary", TEXT], ["accent-foreground", "accent", TEXT],
  ["destructive-foreground", "destructive", TEXT], ["destructive", "background", TEXT], ["destructive", "card", TEXT],
  ["success", "card", TEXT], ["warning", "card", TEXT],
  ["input", "background", UI], ["input", "card", UI], ["ring", "background", UI],
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`hue-${n}`, "card", UI]),
];

let failed = 0;
for (const [mode, table] of [["light", light], ["dark", dark]]) {
  for (const [fg, bg, min] of pairs) {
    const r = ratio(fg, bg, table);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${mode.padEnd(5)} ${fg.padEnd(22)} on ${bg.padEnd(10)} ${r.toFixed(2).padStart(5)}:1  (needs ${min})`);
  }
}
if (failed) { console.error(`\n${failed} pair(s) below the contrast cap.`); process.exit(1); }
console.log("\nAll token pairs meet the contrast caps.");
