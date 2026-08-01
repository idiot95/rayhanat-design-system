"use client";

import {
  tokens, Stack, Cluster, Grid, Card, Badge, Callout, Prose, CodeBlock, Truncate
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

/**
 * Every specimen below is generated from the token data itself, not transcribed
 * from it. A token added, renamed or removed shows up here on the next build —
 * which is the only way a foundations page stays true.
 */

const SEMANTIC_GROUPS = [
  { title: "Surface", match: k => k.startsWith("canvas") || k.startsWith("surface") },
  { title: "Text", match: k => k.startsWith("text-") },
  { title: "Interactive", match: k => k.startsWith("interactive") || k.startsWith("secondary") },
  { title: "Status", match: k => /^(success|warning|danger|info)/.test(k) },
  { title: "Border & focus", match: k => k.startsWith("border") || k === "focus-ring" }
];

function Swatch({ name }) {
  return (
    <Stack gap={2}>
      <span style={{ blockSize: 44, borderRadius: "var(--radius-md)",
        background: `var(--${name})`,
        borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)" }} />
      <Stack gap={1}>
        <Truncate style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
          color: "var(--text-primary)" }}>{`--${name}`}</Truncate>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
          color: "var(--text-muted)" }}>
          {tokens.semantic.light[name]} · {tokens.semantic.dark[name]}
        </span>
      </Stack>
    </Stack>
  );
}

export default function Foundations() {
  const semanticKeys = Object.keys(tokens.semantic.light);
  const textSteps = Object.entries(tokens.text);

  return (
    <Page
      title="Foundations"
      description="The token layer. Products reference semantic names only — the ramps exist so the semantics can be composed from them."
      meta={<Badge tone="accent">{semanticKeys.length} semantic tokens</Badge>}
    >
      <Callout tone="danger" variant="card" title="Ramps are not for product code">
        <Prose>
          <p>
            A raw hex, an <code>rgb()</code>, an arbitrary Tailwind value or a ramp step
            such as <code>--color-sand-600</code> in application code is a lint error, not
            a warning. Compose from the semantic names below.
          </p>
        </Prose>
      </Callout>

      <Group title="Semantic colour">
        <Prose>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            Each swatch paints the live variable, so it follows the theme toggle. The two
            hex values beneath it are the light and dark resolutions from the token data.
          </p>
        </Prose>
        {SEMANTIC_GROUPS.map(g => (
          <Demo key={g.title} name={g.title}>
            <Grid min="150px" gap={5}>
              {semanticKeys.filter(g.match).map(k => <Swatch key={k} name={k} />)}
            </Grid>
          </Demo>
        ))}
      </Group>

      <Group title="Ramps">
        <Demo name="tokens.color" note="For composing the semantic layer. Never referenced from a product component.">
          <Stack gap={4}>
            {Object.entries(tokens.color).map(([ramp, steps]) => (
              <Stack key={ramp} gap={2}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-secondary)" }}>{ramp}</span>
                <Cluster gap={1}>
                  {Object.entries(steps).map(([step, hex]) => (
                    <Stack key={step} gap={1} style={{ inlineSize: 52 }}>
                      <span title={`${ramp}-${step} ${hex}`}
                        style={{ blockSize: 32, background: hex, borderRadius: "var(--radius-sm)",
                          borderWidth: "var(--border-hairline)", borderStyle: "solid",
                          borderColor: "var(--border)" }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                        color: "var(--text-muted)" }}>{step}</span>
                    </Stack>
                  ))}
                </Cluster>
              </Stack>
            ))}
          </Stack>
        </Demo>
      </Group>

      <Group title="Named palettes">
        <Demo name="tokens.palettes" note="Whole-surface combinations, each with a stated use.">
          <Grid min="260px" gap={5}>
            {tokens.palettes.map(p => (
              <Card key={p.name} style={{ padding: 0, overflow: "hidden" }}>
                <span style={{ display: "flex", blockSize: 56 }}>
                  {Object.values(p.roles).map((hex, i) => (
                    <span key={i} style={{ flex: 1, background: hex }} />
                  ))}
                </span>
                <Stack gap={2} style={{ padding: "var(--space-5)" }}>
                  <Cluster gap={3} justify="space-between">
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
                      {p.name}
                    </span>
                    <Badge tone="neutral">{p.mode}</Badge>
                  </Cluster>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                    {p.use}
                  </span>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Demo>
      </Group>

      <Group title="Space">
        <Demo name="--space-*" note="Layout components take the step number directly: <Stack gap={5}>.">
          <Stack gap={3}>
            {Object.entries(tokens.space).map(([step, px]) => (
              <Cluster key={step} gap={4}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-muted)", inlineSize: 72 }}>{`--space-${step}`}</span>
                <span style={{ blockSize: 12, inlineSize: px || 1,
                  background: "var(--interactive-solid)", borderRadius: "var(--radius-sm)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-muted)" }}>{px}px</span>
              </Cluster>
            ))}
          </Stack>
        </Demo>
      </Group>

      <Group title="Type">
        <Demo name="--text-* / --text-ar-*" note="Every Latin step has an Arabic counterpart with its own size factor and leading floor.">
          <Stack gap={5}>
            {textSteps.map(([step, v]) => (
              <Stack key={step} gap={2}>
                <Cluster gap={3}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{`--text-${step}`}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>
                    {v.size}px / {v.leading} · ar {v.arSize}px / {v.arLeading}
                  </span>
                </Cluster>
                <span style={{ fontSize: `var(--text-${step})`, lineHeight: `var(--leading-${step})` }}>
                  Daeratul Aqeeq
                </span>
                <span lang="ar" dir="rtl" style={{ fontFamily: "var(--font-arabic)",
                  fontSize: `var(--text-ar-${step})`, lineHeight: `var(--leading-ar-${step})` }}>
                  دائرة العقيق
                </span>
              </Stack>
            ))}
          </Stack>
        </Demo>

        <Demo name="tokens.arabic" note="How the Arabic scale is derived from the Latin one.">
          <CodeBlock>{JSON.stringify(tokens.arabic, null, 2)}</CodeBlock>
        </Demo>
      </Group>

      <Group title="Radius, shadow, motion">
        <Grid min="280px" gap={5}>
          <Demo name="--radius-*">
            <Cluster gap={4}>
              {Object.entries(tokens.radius).map(([k, v]) => (
                <Stack key={k} gap={2} align="center">
                  <span style={{ inlineSize: 56, blockSize: 56, background: "var(--interactive-subtle)",
                    borderRadius: `var(--radius-${k})`,
                    borderWidth: "var(--border-hairline)", borderStyle: "solid",
                    borderColor: "var(--border-interactive)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{k} · {v}</span>
                </Stack>
              ))}
            </Cluster>
          </Demo>

          <Demo name="--shadow-*">
            <Cluster gap={5}>
              {["sm", "md", "lg", "xl"].map(k => (
                <Stack key={k} gap={2} align="center">
                  <span style={{ inlineSize: 56, blockSize: 56, background: "var(--surface)",
                    borderRadius: "var(--radius-md)", boxShadow: `var(--shadow-${k})` }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{k}</span>
                </Stack>
              ))}
            </Cluster>
          </Demo>
        </Grid>

        <Demo name="tokens.motion" note="Durations and easings, as data. The motion package reads the same values.">
          <Grid min="240px" gap={5}>
            <CodeBlock caption="duration">{JSON.stringify(tokens.motion.duration, null, 2)}</CodeBlock>
            <CodeBlock caption="easing">{JSON.stringify(tokens.motion.easing, null, 2)}</CodeBlock>
          </Grid>
        </Demo>
      </Group>

      <Group title="Breakpoints & chart sequence">
        <Grid min="280px" gap={5}>
          <Demo name="tokens.breakpoint" note="Grid and Split reflow on content width — most layouts need none of these.">
            <Stack gap={2}>
              {Object.entries(tokens.breakpoint).map(([k, v]) => (
                <Cluster key={k} gap={3} justify="space-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)" }}>
                    {`--bp-${k}`}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                    color: "var(--text-muted)" }}>{v}</span>
                </Cluster>
              ))}
            </Stack>
          </Demo>

          <Demo name="tokens.chartSequence" note="Lightness alternates as well as hue, so the order survives deuteranopia and a photocopier.">
            <Cluster gap={2}>
              {tokens.chartSequence.map((hex, i) => (
                <Stack key={hex} gap={1} align="center">
                  <span style={{ inlineSize: 36, blockSize: 36, background: hex,
                    borderRadius: "var(--radius-sm)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{i + 1}</span>
                </Stack>
              ))}
            </Cluster>
          </Demo>
        </Grid>
      </Group>
    </Page>
  );
}
