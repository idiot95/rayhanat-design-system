# Token pipeline — current state and what must be reconciled

**Short version: do not run `pnpm build:tokens` against the committed `dist/`
until the three items below are closed. `packages/tokens/dist/` is currently
authoritative and is richer than its own generator.**

CI and the release workflow deliberately do *not* rebuild tokens. That is a
temporary guard, not a design choice.

---

## Why the guard exists

`packages/tokens/README.md` states that `brand.json` is the only place a raw
value is written and everything in `dist/` is generated from it. That is the
intended design and it is worth restoring — but it is not true of the current
files. Three specific gaps:

### 1. `chartSequence` exists only in the generated output

`dist/tokens.js` and `dist/tokens.ts` both export:

```js
export const chartSequence = ['#2c5fa8','#e7234f','#1f7a5c','#8a5a00',
                              '#7c0b29','#93b4e4','#dd8a8d','#8fccb0'];
```

There is no `chartSequence` anywhere in `brand.json`. A rebuild deletes it, and
`@al-rayhaanat/charts` loses its series ordering.

Every one of those eight values *is* an existing token, so this is recoverable
by adding an ordered list of references to `brand.json`:

| Position | Hex | Token |
| --- | --- | --- |
| 1 | `#2c5fa8` | `{color.blue.500}` |
| 2 | `#e7234f` | `{color.crimson.500}` |
| 3 | `#1f7a5c` | `{color.green.500}` |
| 4 | `#8a5a00` | `{color.amber.500}` |
| 5 | `#7c0b29` | `{color.crimson.800}` |
| 6 | `#93b4e4` | `{color.blue.300}` |
| 7 | `#dd8a8d` | `{color.rose.500}` |
| 8 | `#8fccb0` | `{color.green.300}` |

### 2. The generator emits a different public API than the one that ships

`arh/ts` dumps the `brand.json` tree verbatim. The committed artifacts expose a
curated, reshaped API. They do not match:

| Generator emits | `dist/tokens.js` actually exports |
| --- | --- |
| `color` (ramps **and** `light`/`dark` nested inside) | `color` (ramps only) + `semantic` (`{ light, dark }`) |
| `palette` (object, no metadata) | `palettes` (**array**, each with `name`, `mode`, `use`, `roles`) |
| `dimension.space` / `dimension.radius` | `space` / `radius` (flattened, unitless numbers) |
| `typography.size` / `typography.lineHeight` (26 flat keys incl. `ar-*`) | `text` (13 steps, each `{ size, leading, arSize, arLeading }`) |
| `typography.arabic` | `arabic` |
| `shadow` | *not exported* |
| — | `chartSequence` |

Anything importing `semantic`, `palettes`, `text` or `chartSequence` breaks on a
rebuild. Today that is `@al-rayhaanat/system` (`export * as tokens`) and any
product code using the JS token API.

The `palettes` metadata *is* recoverable: each palette in `brand.json` carries a
`$description` shaped `"<use> (<mode>)"`, e.g.

```
"The default product surface — admin portal, member app, forms, tables. (Light · default)"
```

which splits cleanly into the `use` and `mode` fields.

### 3. There is no `js` target at all

`packages/tokens/package.json` resolves the package's main entry to
`./dist/tokens.js`:

```json
"exports": { ".": { "types": "./dist/tokens.ts", "default": "./dist/tokens.js" } }
```

But `tokens/style-dictionary.config.mjs` defines only `css`, `ts`, `tailwind`,
`scss`, `pptx` and `figma` platforms. Nothing generates `tokens.js`. It is an
orphan — hand-maintained in practice, and silently divergent from `tokens.ts`
whenever either is touched.

---

## What has already been fixed

**The DTCG value bug.** `brand.json` is DTCG format — 298 `$value` keys and zero
legacy `value` keys. Style Dictionary v4 only mirrors `$value` onto `.value` for
its *built-in* formats; custom formats get the token untouched. Every custom
format here read `t.value`, which was `undefined` for every token, so
`JSON.stringify` dropped the leaves and the build emitted:

```ts
export const color = { "sand": {}, "slate": {}, "crimson": {} } as const;
export const zIndex = {} as const;
```

`tokens/style-dictionary.config.mjs` now reads through a `val()` helper
(`t.$value ?? t.value`). Verified: the build emits real hex values and a correct
pptx theme. This fix is necessary but **not sufficient** — items 1–3 above still
make a rebuild destructive.

---

## Closing this out

1. Add `chartSequence` to `brand.json` as an ordered list of token references.
2. Rewrite the `arh/ts` format to emit the shipped API shape (`color`,
   `semantic`, `palettes`, `space`, `radius`, `text`, `arabic`, `motion`,
   `zIndex`, `breakpoint`, `chartSequence`), parsing `mode`/`use` out of each
   palette's `$description`.
3. Add an `arh/js` format and a `js` platform emitting `tokens.js` from the same
   tree, so the two entry points cannot drift.
4. Rebuild, and diff against the committed `dist/`. **The diff must be empty.**
   That is the acceptance test — it proves the generator reproduces what ships.
5. Re-enable the rebuild-and-diff step in `.github/workflows/ci.yml` (the
   removed block is preserved in that file's comments) and drop the
   `build:tokens` guard note from `release.yml`.

One caveat on step 4: `dist/tokens.css` and `dist/tokens.ts` currently disagree
about Arabic leading — `tokens.css` says `--leading-ar-xs: 1.73` where
`tokens.ts` says `arLeading: 1.53`, and similarly for `sm`, `lg`, and `3xl`–`6xl`.
`tokens.css` is the newer file. Decide which is correct against
`brand.json`'s `typography.lineHeight` before treating an empty diff as success,
because one of the two is already wrong today. Per `packages/tokens/README.md`
the floor is 1.45 and marks clip below 1.67 for vocalised text, so this is a
rendering correctness question, not a formatting one.
