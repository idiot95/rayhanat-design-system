# @al-rayhaanat/docs

The documentation site. Fourteen statically prerendered routes — one per
package, plus foundations and the contracts.

```bash
pnpm dev      # from the repository root
```

## Why it consumes the packages the hard way

The site imports `@al-rayhaanat/system` through `workspace:*` and transpiles it
as source JSX, exactly as a product does. Its chrome is the system's own
`AppShell`, `SideNav` and `TopBar`. Nothing here re-implements a component, and
`components/demo.jsx` is deliberately thin — a docs site that invents its own
card and its own heading scale stops being evidence that the system works.

`next.config.mjs` carries the one required line of config. If it were missing,
this app would not build, which is the intended proof.

## Layout

```
app/
  layout.jsx      imports tokens.css once; sets data-theme / dir / lang
  chrome.jsx      the shell, and the three toggles that write to <html>
  nav.js          one nav definition, read by the rail and the page headers
  page.jsx        overview, and the mark's clear-space specification
  foundations/    every token, generated from the token data at runtime
  contracts/      CONTRACTS rendered as a table and family by family
  <package>/      one page per package
components/
  demo.jsx        Page, Group and Demo — the only wrappers
```

## Two things that will bite you

**A green build does not mean the pages render.** `AppShell` wraps its main
content in `FadeIn`, which returns `null` on the server, so `next build`
prerenders the chrome and never executes the page bodies. Prop-shape errors
survive it silently. Verify in a browser, or temporarily bypass the chrome in
`layout.jsx` to force real SSR.

**The document does not scroll.** `AppShell` is `100dvh` with `overflow: auto`
on its `<main>`, so the scroll container is the main pane. Full-page screenshots
and printing capture one viewport unless you unset that first.

## Adding a page

Add the route to `SECTIONS` in `app/nav.js`, then create
`app/<name>/page.jsx`. Mark it `"use client"` — the demos hold state, and
`DataTable` columns pass `render` functions, which cannot cross the server
boundary.
