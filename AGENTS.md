# AGENTS.md — al-Rayhaanat v2

Read this before writing any UI for a Daeratul Aqeeq app. It is short on purpose.
Every rule below is also enforced by lint or tests, so breaking one fails CI with a
message that says what to do instead.

## What this system is

- **Components:** stock [shadcn/ui](https://ui.shadcn.com), installed from this
  repository's registry. Do not write your own buttons, inputs, tables or dialogs.
- **Icons:** `lucide-react` only.
- **Brand:** one theme file (`registry/theme/theme.css`) and ten brand
  components (`registry/brand/`). That is all of it.

Install into an app:

```bash
# components.json → "registries": { "@rayhanat": "https://<registry-host>/r/{name}.json" }
npx shadcn@3.8.5 add @rayhanat/theme @rayhanat/button @rayhanat/sidebar   # …whatever you need
```

Then in the app's CSS entry:

```css
@import "tailwindcss";
@import "./styles/rayhanat.css";
```

Copy `brand/fonts/KanzalLulu-Regular.ttf` to the app's `public/fonts/`, and load
Cormorant Garamond from Google Fonts in `index.html`.

## The rules

1. **Colours come from tokens only.** Use `bg-primary`, `text-muted-foreground`,
   `border-input`, `text-destructive`… Tailwind's default palette is switched
   off, so `bg-red-500` does not exist. Never write hex, rgb, hsl or oklch, and
   never use arbitrary colour classes like `bg-[#…]`.
2. **The flower is `<Mark />` and nothing else.** It has four permitted forms:
   `<Mark />`, `<Mark variant="inner" />`, `<Mark tone="grayscale" />`,
   `<Mark variant="inner" tone="grayscale" />`. Never recolour, invert, tint,
   outline, fade or redraw it, and never use a petal on its own. Below 32px
   the mark drops its outer layer by itself; you do not need to choose.
3. **Modules are an icon, not a flower.** A module is `<ModuleBadge module="key" />`:
   its lucide icon on its hue. The module hue (`bg-module`, `text-module`) is
   used only inside `ModuleBadge` and `TodayDot`.
4. **Cormorant is for page titles.** Use `<PageHeader title=… />`. Never write
   `font-display` yourself. Section and card titles use the system font.
5. **One primary button per screen.** The default `<Button>` is the main
   action; everything else is `outline`, `secondary`, `ghost` or `link`.
6. **Errors are clay.** `variant="destructive"` and `text-destructive` with an
   icon and words. Never crimson for an error.
7. **No other UI or icon libraries.** No MUI, Mantine, Chakra, Ant, Headless UI,
   react-icons, Heroicons, Font Awesome.
8. **Never edit files in `components/ui` or `components/brand` inside an app.**
   Change them in this repository's `registry/`, rebuild the registry, and
   reinstall with `shadcn add`. CI compares the copies byte for byte.
9. **Arabic and Lisan ud-Dawat render in Kanz al-Lulu automatically.** Mark the
   text with `lang="ar"` and `dir="rtl"`; do not set a font. Use logical
   properties (`ms-`, `pe-`, `start-`) so layouts mirror.

## Where things go

| You need | Use |
|---|---|
| Page title | `PageHeader` (`registry/brand/page-header.tsx`) |
| App sidebar | `Sidebar`, `NavGroup`, `NavItem`, `ModuleSwitcher`, `UserChip` |
| Mobile header / tabs | `MobileBar`, `BottomNav` |
| Logo | `Wordmark` (inline or stacked) or `Mark` |
| The flower as a large, cropped graphic | `Bloom` (sign-in panels, app headers; never behind text; on phones never at the top, where the status bar is) |
| A module's identity | `ModuleBadge`; today's rows: `TodayDot` |
| Member-facing list rows | `DateRow` |
| Empty list | `EmptyState` |
| Anything else | the shadcn component of that name |

## Adding a module

1. Add an entry to `registry/brand/modules.ts`: `key`, `name`, a lucide `icon`,
   `blurb`, `href`.
2. Give it the next free hue slot in `registry/theme/theme.css`:
   `[data-module="key"] { --module: var(--hue-N); }`. There are eight slots and
   no others.
3. Run `pnpm check`, then `pnpm registry:build`.
4. In the module's app, set `data-module="key"` on its root element.

## Before you finish

```bash
pnpm check   # lint · typecheck · contrast · drift · build · Playwright (mark, one primary, axe)
```
