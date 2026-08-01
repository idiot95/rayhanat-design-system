"use client";

import {
  Stack, Cluster, Grid, Card, Badge, Button, Link, Mark, Divider,
  Prose, Lede, ProseHeading, Callout, CodeBlock, DefinitionList, BulletList
} from "@al-rayhaanat/system";
import { Page, Demo } from "../components/demo.jsx";
import { SECTIONS } from "./nav.js";

const PACKAGES = SECTIONS[1].items;

/**
 * Clear space is half the mark's height on every side, and every step of the
 * mark scale lands exactly on the spacing scale — so the exclusion zone is
 * always a token, never a measured gap.
 */
const MARK_SCALE = [
  { size: 16, form: "simple", space: 8, token: "--space-3", use: "Inline with body text, favicons." },
  { size: 24, form: "full", space: 12, token: "--space-4", use: "Nav rails, top bars, list rows." },
  { size: 32, form: "full", space: 16, token: "--space-5", use: "Page headers, cards." },
  { size: 48, form: "full", space: 24, token: "--space-7", use: "Empty states, sign-in." },
  { size: 64, form: "full", space: 32, token: "--space-8", use: "Covers, marketing heroes." }
];

/** The mark inside its exclusion zone, drawn to scale. */
function ClearSpace({ size, space }) {
  return (
    <Stack gap={3} align="center">
      <div style={{ padding: space, borderWidth: "var(--border-hairline)", borderStyle: "dashed",
        borderColor: "var(--border-interactive)", borderRadius: "var(--radius-sm)",
        background: "var(--interactive-subtle)", lineHeight: 0 }}>
        <Mark size={size} />
      </div>
      <Stack gap={1} align="center">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
          color: "var(--text-primary)" }}>{size}px</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
          color: "var(--text-muted)" }}>+{space}</span>
      </Stack>
    </Stack>
  );
}

export default function Overview() {
  return (
    <Page
      title="al-Rayhaanat Design System"
      description="Tokens, components and layout for Daeratul Aqeeq products. One install, 148 components, light and dark, Latin and Arabic."
      meta={<Cluster gap={2}><Badge tone="accent">v1.3.0</Badge><Badge>React 18+</Badge></Cluster>}
    >
      <Card style={{ padding: "var(--space-8)" }}>
        <Cluster gap={6} align="start">
          <Mark size={64} />
          <Stack gap={4} style={{ flex: "1 1 320px", minInlineSize: 0 }}>
            <Prose>
              <Lede>
                Every component on this site is rendered by the packages in this
                repository, imported the way a product imports them.
              </Lede>
              <p style={{ color: "var(--text-secondary)" }}>
                Use the toggles in the top bar. They set <code>data-theme</code>,{" "}
                <code>dir</code> and <code>lang</code> on the root element and nothing
                else — no provider, no context, no re-render of a theme value through
                the tree. Watch the whole page follow.
              </p>
            </Prose>
            <Cluster gap={3}>
              <Button variant="primary" icon="book-open" onClick={() => { window.location.href = "/foundations"; }}>
                Foundations
              </Button>
              <Button variant="secondary" icon="grid" onClick={() => { window.location.href = "/ui"; }}>
                Components
              </Button>
            </Cluster>
          </Stack>
        </Cluster>
      </Card>

      <Divider label="The mark" />

      <Grid min="330px" gap={5}>
        <Demo name="Clear space" note="Half the mark's height on every side. Nothing sets in it — not type, not a rule, not the edge of a card.">
          <Stack gap={5}>
            <Cluster gap={6} align="end">
              {MARK_SCALE.slice(1, 4).map(m => <ClearSpace key={m.size} {...m} />)}
            </Cluster>
            <Prose>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                The dashed field is the exclusion zone, drawn to scale. Because clear
                space is half the height, every step lands on the spacing scale exactly —
                so the padding around a mark is always <code>var(--space-*)</code>, never
                a measured gap.
              </p>
            </Prose>
          </Stack>
        </Demo>

        <Demo name="Sizes" note="The mark simplifies itself as it shrinks — you never pick the artwork, only the size.">
          <Stack gap={4}>
            {MARK_SCALE.map(m => (
              <Cluster key={m.size} gap={4} align="center">
                <span style={{ inlineSize: 68, display: "flex", justifyContent: "center" }}>
                  <Mark size={m.size} />
                </span>
                <Stack gap={1} style={{ flex: "1 1 auto", minInlineSize: 0 }}>
                  <Cluster gap={2}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                      color: "var(--text-primary)" }}>{m.size}px</span>
                    <Badge tone={m.form === "full" ? "accent" : "neutral"}>{m.form}</Badge>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                      color: "var(--text-muted)" }}>clear {m.space} · {m.token}</span>
                  </Cluster>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{m.use}</span>
                </Stack>
              </Cluster>
            ))}
          </Stack>
        </Demo>
      </Grid>

      <Grid min="330px" gap={5}>
        <Demo name="Grounds" note="brand carries the outer rank on its light-ground step so the silhouette reads on paper. brandTrue is the literal cream — for ink grounds and print.">
          <Grid min="130px" gap={4}>
            <Stack gap={3} align="center" style={{ padding: "var(--space-6)",
              background: "var(--canvas)", borderRadius: "var(--radius-md)",
              borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)" }}>
              <Mark size={44} tone="brand" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                color: "var(--text-muted)" }}>brand</span>
            </Stack>
            <Stack gap={3} align="center" style={{ padding: "var(--space-6)",
              background: "var(--surface-inverse)", borderRadius: "var(--radius-md)" }}>
              <Mark size={44} tone="brandTrue" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                color: "var(--text-inverse)" }}>brandTrue</span>
            </Stack>
            <Stack gap={3} align="center" style={{ padding: "var(--space-6)",
              background: "var(--surface-sunken)", borderRadius: "var(--radius-md)" }}>
              <Mark size={44} tone="quiet" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                color: "var(--text-muted)" }}>quiet</span>
            </Stack>
          </Grid>
        </Demo>

        <Demo name="Never">
          <BulletList
            marker="dash"
            items={[
              "Never set anything inside the clear space — including the wordmark.",
              "Never mirror the mark. It is the one glyph that holds its orientation under RTL.",
              "Never recolour it outside the tones above, and never apply a gradient or a shadow.",
              "Never redraw it at a small size — pass a smaller `size` and let it simplify."
            ]}
          />
        </Demo>
      </Grid>

      <Divider label="Install" />

      <Grid min="320px" gap={5}>
        <Stack gap={3}>
          <ProseHeading level={3}>One dependency</ProseHeading>
          <CodeBlock caption="terminal">{"pnpm add @al-rayhaanat/system"}</CodeBlock>
          <CodeBlock caption="app/layout.jsx">
            {'import "@al-rayhaanat/system/tokens.css";\n\n<html lang="en" dir="ltr" data-theme="light">'}
          </CodeBlock>
        </Stack>
        <Stack gap={3}>
          <ProseHeading level={3}>One required line</ProseHeading>
          <CodeBlock caption="next.config.mjs">
            {'export default {\n  transpilePackages: ["@al-rayhaanat/system"]\n};'}
          </CodeBlock>
          <Callout tone="info" title="This site proves it">
            The docs app you are reading is a Next.js App Router project consuming the
            packages as source JSX. If that line were missing, this page would not build.
          </Callout>
        </Stack>
      </Grid>

      <Divider label="Packages" />

      <Grid min="240px" gap={4}>
        {PACKAGES.map(p => (
          <Card key={p.label} interactive as="a" href={p.href}
            style={{ padding: "var(--space-5)", textDecoration: "none", display: "block" }}>
            <Stack gap={2}>
              <Cluster gap={3} justify="space-between">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)",
                  color: "var(--text-primary)" }}>{p.label}</span>
                <Badge tone="neutral">{p.count}</Badge>
              </Cluster>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                {DESCRIPTIONS[p.label]}
              </span>
            </Stack>
          </Card>
        ))}
      </Grid>

      <Divider label="Why one package" />

      <Callout tone="warning" variant="card" title="A subset loses behaviour silently">
        <DefinitionList
          pairs={[
            ["patterns without motion", "Overlays appear instantly and prefers-reduced-motion is never consulted — that handling lives in motion."],
            ["ui without tokens.css", "Every var(--*) falls back to nothing. No colour, no type, no spacing. It still renders, which is the dangerous part."],
            ["filters without table", "A filter bar with nothing underneath it."],
            ["shell without patterns", "The mobile drawer has no focus trap."]
          ]}
        />
      </Callout>

      <Prose>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          Working with an AI agent? Copy{" "}
          <Link href="https://github.com/idiot95/rayhanat-design-system/blob/main/AGENTS.md" external>
            AGENTS.md
          </Link>{" "}
          into the consuming project — Claude Code, Cursor, Copilot, Windsurf, Zed and
          Aider all read it automatically.
        </p>
      </Prose>
    </Page>
  );
}

const DESCRIPTIONS = {
  ui: "Primitives and layout — buttons, fields, Stack, Grid, Split.",
  prose: "Rich text — callouts, five list markers, steps, quotations, code.",
  patterns: "Overlays, disclosure, toasts, the four screen states.",
  filters: "Declared and dynamic filters with the URL as state.",
  slides: "Deck layouts and buildDeck() for pptxgenjs.",
  forms: "FormField and the aria wiring it does for you.",
  shell: "Four app frames and multi-level navigation.",
  charts: "Line, area, bar, donut, sparkline, KPI stat.",
  motion: "Transitions with reduced-motion handled once, here.",
  icons: "The mark, the petal, and 42 glyphs with mirror flags.",
  table: "One headless core, many presentations."
};
