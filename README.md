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
| `registry/ui/` | The shadcn/ui components apps install (button, badge, card, input, label, table, tabs, checkbox, switch) |
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

- `registry/ui/` was written to match shadcn/ui's new-york v4 components because
  the shadcn website was unreachable from the build environment. Two
  deliberate differences from upstream: `Button` emits `data-variant` (used by
  the one-primary test) and the destructive variants use
  `text-destructive-foreground` (white text fails on clay in dark mode). When
  refreshing from upstream, keep those two and run `pnpm check`.
- Hosting the registry: any static host works. Serve `public/r/` and put its
  URL in each app's `components.json` (see `components.example.json`).

## Licence

`UNLICENSED` — proprietary to Daeratul Aqeeq. The Kanz al-Lulu typeface is
© 2025 Abdulqadir Abdeali Jariwala and is distributed for use in Daeratul Aqeeq
products.
