# al-Rayhaanat — packages

Fourteen packages plus one umbrella. Each may import only from the ones above it
in this table, and every one of them is real React except `tokens` and `config`.

| Package | Depends on | What it is |
| --- | --- | --- |
| `@al-rayhaanat/tokens` | — | DTCG source and every generated target: CSS vars, TS, Tailwind preset, SCSS, Figma variables, pptx theme, the self-hosted Kanz al-Lulu face. |
| `@al-rayhaanat/config` | — | ESLint, TypeScript and Prettier config. **Install first** — it is the enforcement mechanism. |
| `@al-rayhaanat/icons` | tokens | The mark (auto-simplifying by size, never mirrors), Petal, Spinner, 42 Lucide glyphs with mirror flags. |
| `@al-rayhaanat/motion` | tokens | Transition, FadeIn, Collapse, Stagger, PageTransition. `prefers-reduced-motion` handled once, here. |
| `@al-rayhaanat/ui` | tokens, icons | Primitives and layout, `useBreakpoint`, `Truncate`, `OverflowRow`. |
| `@al-rayhaanat/prose` | tokens, icons, ui | Rich text: callouts, five list markers, steps, quotations, code, footnotes. |
| `@al-rayhaanat/contracts` | tokens, icons, ui | The behaviour every family owes its caller, as data, plus the minimum test suite. |
| `@al-rayhaanat/table` | tokens, icons, ui | One headless core, many presentations. |
| `@al-rayhaanat/filters` | tokens, icons, ui, table | Declared and dynamic filters with the URL as state. |
| `@al-rayhaanat/patterns` | tokens, icons, ui, motion | Overlays, disclosure, toasts, ghost toolbar controls, the four screen states. |
| `@al-rayhaanat/forms` | tokens, icons, ui | FormField and the aria wiring; optional React Hook Form adapter. |
| `@al-rayhaanat/shell` | tokens, icons, ui, motion, patterns | Four frames, multi-level navigation, menus. |
| `@al-rayhaanat/charts` | tokens, icons, ui | Line, area, bar, donut, sparkline, KPI stat. |
| `@al-rayhaanat/slides` | tokens, icons, ui, charts | Deck layouts, `buildDeck()` for pptxgenjs, the `.potx` spec. |
| **`@al-rayhaanat/system`** | **all of the above** | The whole thing in one dependency. |
| `@al-rayhaanat/access` | jose, next | **Not in `system`, and not UI.** The module side of User Access: verify the signed envelope, gate the route with `accessProxy`, check every write with `requireAccess`. Add it only to a module the access console governs. |

## Install this

```bash
npm i @al-rayhaanat/system
```

```jsx
// app/layout.jsx — once, at the root
import "@al-rayhaanat/system/tokens.css";

export default function Layout({ children }) {
  return <html lang="en" dir="ltr" data-theme="light"><body>{children}</body></html>;
}
```

```jsx
import { AppShell, SideNav, DataTable, FilteredTable, Callout, Button } from "@al-rayhaanat/system";
```

### One required line of config

The packages ship **source JSX**, not a pre-built `dist` — deliberately, so the
components stay readable and debuggable in the app that consumes them. Next.js
does not transpile `node_modules` by default, so add:

```js
// next.config.mjs
export default { transpilePackages: ["@al-rayhaanat/system"] };
```

Installing individual packages instead? List each one you import:

```js
transpilePackages: [
  "@al-rayhaanat/ui", "@al-rayhaanat/icons", "@al-rayhaanat/motion",
  "@al-rayhaanat/patterns", "@al-rayhaanat/shell", "@al-rayhaanat/table",
  "@al-rayhaanat/filters", "@al-rayhaanat/forms", "@al-rayhaanat/prose",
  "@al-rayhaanat/charts", "@al-rayhaanat/slides", "@al-rayhaanat/contracts"
]
```

Vite and Remix need nothing — both transpile workspace sources already, and
`@al-rayhaanat/tokens` is plain JS and CSS so it never needs listing. Every
package declares this in its manifest under `arh.requiresTranspile`, so a
consuming build can assert it rather than discover it at compile time.

## Why the umbrella exists

The split is real — a marketing site should not ship the table core, and separate
packages keep ownership legible. But **a product that installs a subset loses
behaviour silently**, and that is worse than a slightly larger bundle:

- `/patterns` without `/motion` — overlays appear instantly, and
  `prefers-reduced-motion` is never consulted, because the handling lives in
  `/motion`.
- `/ui` without `tokens.css` — every `var(--*)` falls back to nothing: no colour,
  no type, no spacing. It renders, which is the dangerous part.
- `/filters` without `/table` — a filter bar with nothing under it.
- `/shell` without `/patterns` — the mobile drawer has no focus trap.
- Anything without `/config` — raw hex values and physical margins come back
  within a sprint, and RTL breaks quietly.

So the default is `@al-rayhaanat/system`. Reach for individual packages only when
bundle size has been **measured** and the saving is real; then use the table
above and install every dependency listed beside what you want.

## Versioning

All packages move together on one version (currently `1.3.0`) and are released
with Changesets. Sibling dependencies are `workspace:*`, so a partial upgrade is
not expressible — the whole set moves or none of it does. That is deliberate: a
`/shell` newer than its `/patterns` is exactly the kind of drift this system
exists to prevent.

## Scripts

```bash
pnpm build:tokens   # style-dictionary → every generated target
pnpm lint           # the rules that fail the build
pnpm typecheck      # tsc --noEmit, strict
pnpm test           # the contracts' minimum suite
pnpm check:all      # all four, in order — what CI runs
```
