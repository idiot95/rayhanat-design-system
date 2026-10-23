# al-Rayhaanat v2

The design system for Daeratul Aqeeq apps: **stock shadcn/ui, one brand theme,
eleven brand components, and the checks that hold them in place.**

v1 hand-built 154 components and enforced its rules in prose. v2 builds almost
nothing: components come from shadcn, the brand is a theme file, and every rule
is a lint rule or a test that fails CI.

## What is here

| Path | What it is |
|---|---|
| `registry/theme/theme.css` | The theme: tokens (light and dark), eight module hue slots, Kanz al-Lulu for Arabic script, Tailwind's default palette removed |
| `registry/ui/` | The twenty-five shadcn/ui components apps install: button, badge, card, input, label, table, tabs, checkbox, switch, dialog, sheet, dropdown-menu, select, popover, command, tooltip, sonner, alert, separator, skeleton, avatar, progress, scroll-area, textarea, radio-group |
| `registry/brand/` | The eleven brand components: `Mark`, `Bloom`, `Wordmark`, `PageHeader`, `ModuleBadge` + `TodayDot`, `Sidebar` parts, `MobileBar` + `BottomNav`, `DateRow`, `EmptyState`, and the `modules` manifest |
| `registry.json` → `public/r/` | The shadcn registry, built with `pnpm registry:build` and served as static files |
| `brand/flower-v2.svg` | The V2 flower, as supplied. `Mark` renders it; nothing else may |
| `brand/fonts/` | Kanz al-Lulu |
| `eslint/brand-caps.js` | The hard caps as lint rules, importable by any app |
| `scripts/` | Contrast cap and no-fork (drift) cap |
| `tests/brand.spec.ts` | The rendered caps: mark integrity, one primary per screen, axe |
| `apps/showcase/` | Every screen and component, consuming the registry like a real app |
| `AGENTS.md` | The manifest for people and AI agents |

## Commands

```bash
pnpm install
pnpm dev              # the showcase
pnpm check            # every cap: lint, typecheck, contrast, drift, build, Playwright
pnpm registry:build   # regenerate public/r from registry.json
```

## The flower

The V2 mark has three layers: sand outer petals `#f5ecdf`, rose inner petals
`#dd8a8d`, crimson centre `#e72350`. Four forms are permitted, and only through
`<Mark />`:

| | Colour | Grayscale |
|---|---|---|
| Full | `<Mark />` | `<Mark tone="grayscale" />` |
| Inner layer only | `<Mark variant="inner" />` | `<Mark variant="inner" tone="grayscale" />` |

Below 32px `Mark` always renders the inner layer: the pale outer petals blur
into a halo at small sizes. Recolouring, inverting, tinting, outlining, fading
or redrawing it is not permitted. Modules are identified by a lucide icon on their hue
(`ModuleBadge`), never by the flower.

## Hard caps

| Cap | Enforced by |
|---|---|
| Only brand colours exist | Tailwind palette reset in `theme.css`; lint bans colour literals and arbitrary colour classes |
| The flower is never altered | `Mark` accepts only `size`, `variant`, `tone`, `title`; lint bans other props and filter utilities; Playwright reads every rendered mark's fills, filter and ancestors |
| The flower lives in one file | Lint bans its path data outside `brand/mark.tsx` |
| Cormorant on page titles only | `font-display` allowed only in `PageHeader` and `Wordmark` |
| Module hue in two places | `*-module` classes allowed only in `module-badge.tsx` |
| No other UI or icon libraries | Lint `no-restricted-imports` |
| No forks | `scripts/check-drift.mjs` compares app copies with the registry |
| One primary button per screen | Playwright, per `[data-screen]` |
| Readable colours | `scripts/check-contrast.mjs`: 4.5:1 text, 3:1 controls, both modes |
| Accessible pages | axe in Playwright |

## Notes

- The **first nine** components in `registry/ui/` were written by hand to match
  shadcn/ui's new-york v4 because the shadcn website was unreachable from the
  build environment. Two deliberate differences from upstream: `Button` emits
  `data-variant` (used by the one-primary test) and the destructive variants use
  `text-destructive-foreground` (white text fails on clay in dark mode). When
  refreshing from upstream, keep those two and run `pnpm check`.
- The **other sixteen** were taken verbatim from
  `ui.shadcn.com/r/styles/new-york-v4/<name>.json`, so refreshing them is a
  clean diff rather than a re-reading. Four substitutions were applied, and
  they are the only places these files differ from upstream:

  | Substitution | Where | Why |
  |---|---|---|
  | `from "cn"` → `from "@/lib/utils"` | 15 files | `cn()` is `@rayhanat/utils` here |
  | `@/registry/new-york-v4/ui/*` → `@/components/ui/*` | `dialog`, `command` | the alias apps actually install into |
  | `bg-black/50` → `bg-foreground/50` | `dialog`, `sheet` overlays | the palette reset deletes `black`, so upstream's overlay emits **no colour at all** — an invisible scrim, which lint cannot catch because `black` is a named utility and not an arbitrary one |
  | `next-themes` removed | `sonner` | the theme is `data-theme` on `<html>` from a cookie, not a React provider; the toaster's colours are already tokens, so `theme="system"` is the only correct value |

  `import * as React from "react"` was added to `skeleton` and `sonner`, which
  upstream leaves to the UMD global that this repo's `tsconfig` rejects.
- Hosting the registry: any static host works. Serve `public/r/` and put its
  URL in each app's `components.json` (see `components.example.json`).
  `vercel.json` deploys the showcase at `/` and the registry at `/r/{name}.json`
  from one build, so staging a registry change is a push.

## Licence

`UNLICENSED` — proprietary to Daeratul Aqeeq. The Kanz al-Lulu typeface is
© 2025 Abdulqadir Abdeali Jariwala and is distributed for use in Daeratul Aqeeq
products.
