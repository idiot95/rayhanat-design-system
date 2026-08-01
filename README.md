<div align="center">

<img src="assets/motif-flower.svg" width="72" alt="">

# al-Rayhaanat Design System

**Tokens, components and layout for Daeratul Aqeeq products.**
One install, 148 components, light and dark, Latin and Arabic.

`v1.3.0` · React 18+ · [Token reference](packages/tokens/README.md) · [Package map](packages/README.md) · [For AI agents](AGENTS.md)

</div>

---

## Install

Two steps. The first is once per machine; the second is once per project.

### 1. Authenticate (once per machine)

These packages live on **GitHub Packages**, not public npm, so your package
manager needs a token before it can see them.

Create a token with the **`read:packages`** scope only:

> https://github.com/settings/tokens/new?scopes=read:packages&description=al-rayhaanat

Add it to your shell profile (`~/.zshrc` on macOS):

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Then `source ~/.zshrc` (or open a new terminal).

### 2. Point the scope at GitHub (once per project)

In the root of the project that will use the design system, create `.npmrc`:

```ini
@al-rayhaanat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Commit that file — it contains no secret, only a redirect and a variable
reference. The token itself stays in your environment.

### 3. Install

```bash
pnpm add @al-rayhaanat/system      # npm install / yarn add work too
```

---

## One required line of config

The packages ship **source JSX**, not a pre-built bundle — deliberately, so
components stay readable and debuggable inside the app that consumes them.
Next.js does not transpile `node_modules` by default:

```js
// next.config.mjs
export default { transpilePackages: ["@al-rayhaanat/system"] };
```

**Vite, Remix and Astro need nothing.** They transpile workspace sources
already.

Skip this on Next.js and the build fails with a syntax error pointing at a
`<` character inside `node_modules` — that error means this line is missing,
not that the package is broken.

---

## Quick start

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

```jsx
// anywhere
import { AppShell, SideNav, DataTable, Callout, Button } from "@al-rayhaanat/system";

export default function Members() {
  return (
    <AppShell nav={<SideNav items={nav} />}>
      <Callout tone="info">Registration closes on the 12th.</Callout>
      <DataTable columns={columns} rows={rows} />
      <Button variant="primary">Approve</Button>
    </AppShell>
  );
}
```

Three attributes on `<html>` drive everything:

| Attribute | Values | Effect |
| --- | --- | --- |
| `data-theme` | `light` · `dark` | Swaps the entire semantic colour layer |
| `dir` | `ltr` · `rtl` | Mirrors layout and flips directional icons |
| `lang` | `en` · `ar` | Selects Kanz al-Lulu and its corrected Arabic leading |

Nothing else needs to know about theme or direction. There is no provider, no
context, no `useTheme()` — it is CSS custom properties all the way down.

---

## What you get

Install `@al-rayhaanat/system` and all of this comes from one import:

| Package | Exports | What it is |
| --- | --- | --- |
| [`ui`](packages/ui) | 34 | Primitives and layout — `Button`, `Card`, `Input`, `Stack`, `Grid`, `Split`, `useBreakpoint` |
| [`prose`](packages/prose) | 18 | Rich text — `Callout`, `Steps`, `PullQuote`, `CodeBlock`, `Footnotes`, five list markers |
| [`patterns`](packages/patterns) | 18 | Overlays and states — `Modal`, `Drawer`, `Toast`, `CommandPalette`, `EmptyState`, `ErrorState` |
| [`filters`](packages/filters) | 13 | Declared and dynamic filters with the URL as state — `FilteredTable`, `FilterBar`, `SavedViews` |
| [`slides`](packages/slides) | 12 | Deck layouts plus `buildDeck()` for pptxgenjs |
| [`forms`](packages/forms) | 11 | `FormField` and the aria wiring; optional React Hook Form adapter |
| [`shell`](packages/shell) | 10 | Four app frames — `AppShell`, `MarketingShell`, `MobileShell`, `FocusShell` |
| [`charts`](packages/charts) | 9 | `LineChart`, `AreaChart`, `BarChart`, `DonutChart`, `Sparkline`, `Stat` |
| [`motion`](packages/motion) | 8 | `Transition`, `FadeIn`, `Collapse`, `Stagger` — `prefers-reduced-motion` handled once, here |
| [`icons`](packages/icons) | 7 | The mark (auto-simplifying by size), `Petal`, `Spinner`, 42 glyphs with mirror flags |
| [`table`](packages/table) | 6 | One headless core, many presentations — `DataTable`, `useTableState` |
| [`contracts`](packages/contracts) | 2 | The behaviour every family owes its caller, as data, plus the minimum test suite |
| [`tokens`](packages/tokens) | — | The token layer: CSS vars, TS, Tailwind preset, Figma variables, the Arabic face |
| [`config`](packages/config) | — | ESLint, TypeScript and Prettier config — the enforcement mechanism |

### Why one package and not fourteen

You *can* install the individual packages, but **the default is `system` and you
should have a measured reason to deviate.** A product that installs a subset
loses behaviour *silently*:

- `patterns` without `motion` → overlays appear instantly and
  `prefers-reduced-motion` is never consulted, because that handling lives in
  `motion`.
- `ui` without `tokens.css` → every `var(--*)` falls back to nothing. No colour,
  no type, no spacing. **It still renders**, which is the dangerous part.
- `filters` without `table` → a filter bar with nothing underneath it.
- `shell` without `patterns` → the mobile drawer has no focus trap.

If you do split, [`packages/README.md`](packages/README.md) lists what each one
needs, and every manifest declares it under `arh.requiresTranspile`.

---

## Tokens

Products reference **semantic** names only:

```css
color: var(--text-muted);
background: var(--surface-sunken);
border: 1px solid var(--border-control);
```

The ramps (`--color-crimson-500`) exist so semantics can be composed. Reaching
for one from application code is a lint error, as is a raw hex, an arbitrary
Tailwind value, or a physical `margin-left`.

Using Tailwind? The preset maps semantic names to the variables, so dark mode
stays a data attribute rather than a second palette:

```js
// tailwind.config.js
module.exports = { presets: [require("@al-rayhaanat/tokens/tailwind")] };
```

Not using React at all — a printed statement, an email, a legacy module?
`tokens.css` ships a CSS-only block layer (`.arh-stack`, `.arh-grid`,
`.arh-card`, `.arh-cluster`) that compiles to exactly what the React components
render.

Full reference, including the contrast audit and the Arabic type decisions:
[`packages/tokens/README.md`](packages/tokens/README.md).

---

## Using this with an AI coding agent

The design system ships machine-readable context so Claude Code, Cursor,
Copilot, Windsurf or any agent writes code that follows the system instead of
inventing its own.

Copy [`AGENTS.md`](AGENTS.md) into the root of the project that consumes the
design system. That single file is enough for most agents — Claude Code, Cursor,
Copilot, Windsurf, Zed and Aider all read it automatically.

For Claude Code specifically, [`CLAUDE.md`](CLAUDE.md) is a thinner pointer file
that defers to `AGENTS.md`. For Cursor, [`.cursor/rules/`](.cursor/rules) holds
the same guidance in its native format so the rules attach automatically by file
glob rather than filling the context window.

Pointing an agent at the system without installing anything?
[`llms.txt`](llms.txt) is a flat, token-efficient index of every component and
every token, designed to be pasted into a context window whole.

---

## The documentation site

[`apps/docs`](apps/docs) is a Next.js App Router project: fourteen pages, one
per package plus foundations and the contracts. Every specimen on it is rendered
by the packages in this repository, imported exactly the way a product imports
them.

That is the point of it. The site's own chrome is `AppShell`, `SideNav` and
`TopBar`, and its `next.config.mjs` carries the `transpilePackages` line
documented above — so the site **demonstrates** those instructions rather than
asserting them. If the shell breaks, the documentation stops rendering instead
of quietly describing something that no longer works. The foundations page
generates every swatch, scale and ramp from the token data at runtime, so a
renamed or removed token shows up there on the next build.

The three toggles in the top bar set `data-theme`, `dir` and `lang` on the root
element and nothing else. Watch the whole site follow.

### Deploying it

This is a monorepo, and the deployable app is not at the repository root — so
the one setting that matters is **Root Directory**:

> Vercel → Project → Settings → Build & Deployment → **Root Directory** →
> `apps/docs`

With that set, Vercel detects Next.js on its own, installs from the workspace
root so `packages/*` resolve, and builds the app in place. No `vercel.json` is
needed, and none is committed.

Do **not** point a repository-root project at `apps/docs/.next` with
`outputDirectory` instead. The root has no `next` dependency, so Vercel's
Next.js builder finds no app there, emits nothing routable, and every URL
returns `404: NOT_FOUND` from the edge — with a build that reports success.

The build consumes the packages through `workspace:*`, so **no registry token is
required** — it reads the source next door rather than installing from GitHub
Packages.

```bash
pnpm build               # the same build, locally
```

---

## Local development

```bash
git clone git@github.com:idiot95/rayhanat-design-system.git
cd rayhanat-design-system
corepack enable          # activates the pinned pnpm
pnpm install
pnpm dev                 # documentation site with every component, live
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Documentation site — every component, both themes, both directions |
| `pnpm build` | Production build of the documentation site |
| `pnpm lint` | The rules that fail the build |
| `pnpm typecheck` | `tsc --noEmit`, strict |
| `pnpm test` | The contracts' minimum suite |
| `pnpm build:bundle` | Regenerates `arh.global.jsx` for bundler-less surfaces |

> [!NOTE]
> `AppShell` wraps its main content in `FadeIn`, which renders `null` on the
> server. A green `next build` therefore does **not** prove a page renders — the
> prerender never executes it. Verify pages in a browser, or with the chrome
> bypassed.

> [!WARNING]
> **Do not run `pnpm build:tokens`.** It is currently destructive — it deletes
> `chartSequence` and reshapes the public token API. `packages/tokens/dist/` is
> authoritative and committed. See [`docs/TOKEN-PIPELINE.md`](docs/TOKEN-PIPELINE.md)
> for what has to be reconciled before that command is safe again.

---

## Releasing

All fifteen packages move together on one version. A `shell` newer than its
`patterns` is exactly the drift this system exists to prevent, so partial
upgrades are not expressible — sibling dependencies are `workspace:*`.

```bash
pnpm changeset          # describe the change, choose the bump
git add . && git commit -m "feat: ..." && git push
```

CI opens a **Version Packages** PR. Merging it publishes every package to
GitHub Packages and tags the release.

---

## Troubleshooting

<details>
<summary><b>401 Unauthorized on install</b></summary>

Your `GITHUB_TOKEN` is unset, expired, or missing the `read:packages` scope.
Check it is visible to the shell running the install:

```bash
echo $GITHUB_TOKEN
```

If the repository sits under an organisation that enforces SSO, the token also
has to be authorised for it — open the token's page, click **Configure SSO**, and
authorise that organisation. The 401 does not mention SSO anywhere, which is what
makes this the most common cause.
</details>

<details>
<summary><b>404 Not Found on install</b></summary>

Almost always a missing `.npmrc`, so the request went to public npm where these
packages do not exist. Confirm the file is in the directory you are installing
from, and that the scope line reads exactly `@al-rayhaanat:registry=...`.
</details>

<details>
<summary><b>Unexpected token '&lt;' inside node_modules</b></summary>

Next.js is not transpiling the packages. Add `transpilePackages` — see
[One required line of config](#one-required-line-of-config).
</details>

<details>
<summary><b>Components render but are completely unstyled</b></summary>

`tokens.css` was never imported, so every `var(--*)` resolves to nothing. Add
`import "@al-rayhaanat/system/tokens.css"` at your app's root — once, not per
component.
</details>

<details>
<summary><b>Arabic text renders in the wrong face or clips its marks</b></summary>

Set `lang="ar"` on the element (or `dir="rtl"`), which selects Kanz al-Lulu and
its corrected leading. If marks still clip, the content is vocalised — raise
`--leading-ar-floor` from `1.45` to `1.70`. Note that `tokens.css` and
`tokens.ts` currently disagree on some Arabic leading steps; see
[`docs/TOKEN-PIPELINE.md`](docs/TOKEN-PIPELINE.md).
</details>

---

## Licence

`UNLICENSED` — proprietary to Daeratul Aqeeq. The Kanz al-Lulu typeface is
© 2025 Abdulqadir Abdeali Jariwala and is distributed with this package for use
in Daeratul Aqeeq products.
