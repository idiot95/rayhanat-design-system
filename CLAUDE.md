# CLAUDE.md

This project uses the **al-Rayhaanat Design System** (`@al-rayhaanat/system`).

**Read [`AGENTS.md`](AGENTS.md) before writing any UI.** It is the full
instruction set — the component inventory, the token names, and the rules that
fail the build. This file is only a pointer; it deliberately does not duplicate
that content.

The four things worth knowing before you open it:

1. Import UI from `@al-rayhaanat/system`. Do not add another component or icon
   library — `lucide-react`, `react-icons`, `@heroicons/react` and
   `framer-motion` are lint errors.
2. Semantic CSS variables only — `var(--text-muted)`, `var(--surface-sunken)`.
   A raw hex, a pixel value or a ramp step (`--color-sand-600`) fails lint.
3. Logical properties only — `marginInlineStart`, never `marginLeft`. Arabic
   RTL is in scope.
4. Theme and direction live on `<html data-theme dir lang>`. There is no
   provider and no `useTheme()`.
