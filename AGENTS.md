# al-Rayhaanat Design System — agent instructions

This project uses `@al-rayhaanat/system` for all UI. Read this before writing
any component, style or layout.

The system is not a suggestion layer. Most of the rules below are enforced by
`@al-rayhaanat/config` and **fail the build**, not warn.

---

## The one-paragraph version

Import components from `@al-rayhaanat/system`. Never write a raw hex colour, a
pixel value, or a physical direction (`margin-left`, `left`, `text-align: left`)
— use semantic CSS variables and logical properties. Never rebuild a component
that already exists; there are 154 exports and the list is below. Theme and
direction come from `<html data-theme dir lang>` and nothing else.

---

## Setup that must already be true

```jsx
// app/layout.jsx — the token stylesheet is imported ONCE, at the root
import "@al-rayhaanat/system/tokens.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

```js
// next.config.mjs — required on Next.js, which does not transpile node_modules
export default { transpilePackages: ["@al-rayhaanat/system"] };
```

If components render but are completely unstyled, `tokens.css` was never
imported. If the build fails on an unexpected `<` inside `node_modules`,
`transpilePackages` is missing. Neither is a bug in the package.

Vite, Remix and Astro need no transpile config.

---

## Rules

### 1. Use the component before you write one

Check the export table below first. If something close exists, compose it.
`Stack`, `Cluster`, `Grid` and `Split` cover nearly every layout — reach for
them before writing a flexbox by hand.

Do not install or import: `lucide-react`, `react-icons`, `@heroicons/react`,
`framer-motion`. Those imports are lint errors. Icons come from the system's
`Icon` (which carries RTL mirror flags), motion from `Transition`/`FadeIn`/
`Collapse`/`Stagger` (which consult `prefers-reduced-motion` for you).

### 2. Semantic tokens only

```jsx
// correct
<div style={{ color: "var(--text-muted)", background: "var(--surface-sunken)" }} />

// lint error — raw colour
<div style={{ color: "#6b6257" }} />

// lint error — a ramp step is for the token layer, not application code
<div style={{ color: "var(--color-sand-600)" }} />

// lint error — arbitrary Tailwind value
<div className="p-[13px] text-[#ff0000]" />
```

The ramps — `--color-sand-*`, `--color-clay-*`, `--color-crimson-*`,
`--color-amber-*`, `--color-green-*`, `--color-blue-*`, `--color-rose-*`,
`--color-slate-*` — exist so the semantic layer can be composed from them.
Never reference one from a product component.

### 3. Logical properties — RTL is in scope

Arabic is a first-class direction, not a later port.

| Never | Always |
| --- | --- |
| `marginLeft` / `marginRight` | `marginInlineStart` / `marginInlineEnd` |
| `paddingLeft` / `paddingRight` | `paddingInlineStart` / `paddingInlineEnd` |
| `borderLeft` / `borderRight` | `borderInlineStart` / `borderInlineEnd` |
| `left` / `right` | `insetInlineStart` / `insetInlineEnd` |
| `textAlign: "left"` / `"right"` | `textAlign: "start"` / `"end"` |
| `flexDirection: "row-reverse"` | let `dir` drive the flow |

Every one of these is a `no-restricted-syntax` error.

### 4. Spacing and type come off the scale

`gap`, `padding` and `margin` take `var(--space-N)`. The layout components take
the number directly — `<Stack gap={5}>` resolves to `var(--space-5)`.

```
--space-0  0     --space-4  12px   --space-8   32px   --space-12  64px
--space-px 1px   --space-5  16px   --space-9   40px   --space-14  80px
--space-1  2px   --space-6  20px   --space-10  48px   --space-16  96px
--space-2  4px   --space-7  24px
--space-3  8px
```

Type: `--text-3xs` … `--text-6xl`, each with a matching `--leading-*` step, and a
parallel `--text-ar-*` / `--leading-ar-*` scale that the Arabic face uses. Never
a literal `font-size: 15px`.

### 5. Theme and direction are not React state

There is no provider, no context, no `useTheme()`. Three attributes on `<html>`
drive everything:

| Attribute | Values | Effect |
| --- | --- | --- |
| `data-theme` | `light` · `dark` | Swaps the semantic colour layer |
| `dir` | `ltr` · `rtl` | Mirrors layout, flips directional icons |
| `lang` | `en` · `ar` | Selects Kanz al-Lulu and its corrected leading |

Never write a `dark:` conditional or a second palette. Never branch on theme in
JS. If a colour needs to change with the theme, it is a semantic token that
already does.

### 6. Accessibility floor

Enforced by `jsx-a11y` at `strict`:

- Never a `<div onClick>`. Use `Button`, `IconButton` or `Link`.
- `IconButton` requires `label`. `Icon` is `aria-hidden` unless given `label`.
- Every field has an associated label — `FormField` wires the ids for you.
- No `autoFocus`. No `tabIndex` on non-interactive elements.
- Focus-visible paints a 2px ring at 2px offset. Never remove it.

---

## What is available

Everything below is a named export of `@al-rayhaanat/system`.

**Layout & primitives** (`ui`, 35) — `Button` `IconButton` `Link` `Badge` `Tag`
`Dot` `Avatar` `Skeleton` `Card` `Divider` `Label` `Input` `SearchField`
`Textarea` `Select` `Checkbox` `Radio` `Switch` `Stack` `Cluster` `Grid`
`Split` `SidebarLayout` `Center` `ScrollArea` `Container` `Spacer`
`AspectRatio` `PageShell` `BlockDemo` `Truncate` `OverflowRow` `useBreakpoint`
`BREAKPOINTS` `useTabIndicator`

**Rich text** (`prose`, 18) — `Prose` `Lede` `ProseHeading` `Callout`
`BulletList` `NumberedList` `Steps` `DefinitionList` `Blockquote` `PullQuote`
`CodeBlock` `InlineCode` `Kbd` `Highlight` `FootnoteRef` `Footnotes` `Ornament`
`RICH_TEXT_BLOCKS`

**Overlays & states** (`patterns`, 23) — `Modal` `Drawer` `BottomSheet`
`ConfirmDialog` `Popover` `Tooltip` `Tabs` `Accordion` `Breadcrumb`
`Pagination` `CommandPalette` `ToastProvider` `useToast` `Toast` `EmptyState`
`ErrorState` `LoadingState` `AccessDenied` `GhostButton` `GhostMenu` `GhostMenuItem` `GhostToolbar` `ExpandingSearch`

**Filters** (`filters`, 13) — `FilteredTable` `FilterBar` `FilterChips`
`SavedViews` `ScopeTabs` `QuickFilters` `FacetList` `useFilters` `applyFilters`
`serializeFilters` `parseFilters` `isPresetActive` `OPERATORS`

**Slides** (`slides`, 12) — `Slide` `SlideCover` `SlideDivider` `SlideContent`
`SlideBullets` `SlideStats` `SlideChart` `SlideTable` `SlideQuote` `SlideClose`
`buildDeck` `DECK_RHYTHM`

**Forms** (`forms`, 11) — `Form` `FormField` `FieldSet` `FormSection`
`FormActions` `ValidationSummary` `TextField` `TextareaField` `SelectField`
`useFieldIds` `rhf`

**App frames** (`shell`, 10) — `AppShell` `MarketingShell` `MobileShell`
`FocusShell` `TopBar` `SideNav` `MenuBar` `UserMenu` `PageHeader` `Toolbar`

**Charts** (`charts`, 9) — `LineChart` `AreaChart` `BarChart` `DonutChart`
`Sparkline` `Stat` `Legend` `SERIES` `CHART_RULES`

**Motion** (`motion`, 8) — `Transition` `FadeIn` `Collapse` `Stagger`
`PageTransition` `useReducedMotion` `PRESETS` `MOTION`

**Icons** (`icons`, 7) — `Mark` `Petal` `Spinner` `Icon` `ICON_NAMES` `ICONS`
`MIRRORED`

**Table** (`table`, 6) — `DataTable` `ToolbarTable` `TableToolbar`
`ColumnOrder` `useTableState` `useTableToolbar`

**Contracts** (`contracts`, 2) — `CONTRACTS` `ContractTable`

### Common props

```jsx
<Button variant="primary|secondary|ghost|danger" size="sm|md|lg"
        icon="check" iconEnd loading disabled block />

<Callout tone="note|accent|success|warning|danger|info" variant="bar|card" title="…" />

<Stack gap={5} align="…">          // vertical rhythm; gap is a --space-N step
<Cluster gap={3} align justify>    // horizontal, wraps
<Grid min="240px" gap={5}>         // auto-fit; pass `columns` only when the count means something
<Split min="320px" gap={6}>        // two-up that collapses on its own
<Container size="prose|md|lg|full">
```

`Grid` and `Split` reflow on content width, so most responsive work needs no
breakpoint at all. Use `useBreakpoint()` only when the *structure* changes.

### Icons

42 glyphs: `search` `plus` `minus` `check` `x` `chevron-right` `chevron-left`
`chevron-down` `chevron-up` `arrow-right` `arrow-left` `arrow-up-right` `menu`
`sliders` `filter` `user` `users` `mail` `calendar` `clock` `file-text`
`folder` `book-open` `bookmark` `image` `table` `layers` `grid` `download`
`upload` `printer` `trash` `pencil` `eye` `lock` `bell` `star` `heart`
`external-link` `more-horizontal` `settings` `log-out`

Sizes come off the scale — 16 beside 13–14px text, 20 in buttons, 24
standalone. Directional glyphs mirror under `dir="rtl"` automatically.

---

## Semantic tokens

**Surface** `--canvas` `--surface` `--surface-raised` `--surface-sunken`
`--surface-inverse`

**Text** `--text-primary` `--text-secondary` `--text-muted` `--text-inverse`
`--text-on-interactive`

**Interactive** `--interactive` `--interactive-hover` `--interactive-active`
`--interactive-solid` `--interactive-solid-hover` `--interactive-subtle`
`--interactive-subtle-hover` `--secondary` `--secondary-subtle`

**Status** `--success` `--warning` `--danger` `--info`, each with a `-subtle`
tint; `--danger-hover`

**Border** `--border` `--border-hairline` `--border-control` `--border-thick`
`--border-strong` `--border-interactive` `--border-focus` `--focus-ring`

**Radius** `--radius-none|sm|md|lg|xl|full`
**Shadow** `--shadow-sm|md|lg|xl`
**Z** `--z-base` `--z-raised` `--z-sticky` `--z-dropdown` `--z-overlay`
`--z-modal` `--z-popover` `--z-tooltip` `--z-toast`
**Motion** `--duration-instant|fast|normal|slow|deliberate`,
`--ease-standard|emphasized|exit|spring`
**Type** `--font-body` `--font-display` `--font-mono` `--font-arabic`,
`--weight-regular|medium|semibold`,
`--tracking-tight|normal|wide|kicker`, and a `--leading-*` step paired with
every `--text-*` step (`--leading-ar-*` for the Arabic scale)
**Breakpoints** `--bp-sm|md|lg|xl|2xl`

Using Tailwind? The preset maps these to utility names, so dark mode stays a
data attribute:

```js
module.exports = { presets: [require("@al-rayhaanat/tokens/tailwind")] };
```

---

## Behavioural contracts

`CONTRACTS` is machine-readable: for each family it declares the states,
keyboard, ARIA, RTL and reduced-motion behaviour required, plus what the
component must never do. Ten families are covered — Action, Field, Selection,
Overlay, Disclosure, Data, Filters, Feedback, Navigation, Content.

When building something the system does not have, read the nearest contract and
satisfy it:

```jsx
import { CONTRACTS } from "@al-rayhaanat/system";
```

Selected absolutes:

- Never two primary buttons in one action group.
- A loading button keeps its width and sets `aria-busy`.
- An error message *replaces* the hint on a field — never both.
- `disabled` is the real attribute, not reduced opacity.
- Overlays trap focus, close on Escape, and restore focus to their trigger.

---

## Not to be done

- Do not add a UI or icon library — the system covers it, and the imports are
  lint errors.
- Do not write a theme toggle that swaps class names or palettes. Set
  `data-theme` on `<html>`.
- Do not import from a package's internals (`@al-rayhaanat/ui/src/*`) or from
  `@al-rayhaanat/tokens/dist/*`. Import the package root.
- Do not run `pnpm build:tokens` in the design system repo — it is currently
  destructive. `packages/tokens/dist/` is authoritative and committed.
- Do not copy a component's source into the app to modify it. If the system is
  wrong, change the system.
