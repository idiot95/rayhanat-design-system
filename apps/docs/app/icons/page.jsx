"use client";

import { useState } from "react";
import {
  Mark, Petal, Spinner, Icon, ICON_NAMES, MIRRORED,
  Badge, Card, Grid, Stack, Cluster, Callout, SearchField, Prose
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

export default function IconsPage() {
  const [q, setQ] = useState("");
  const hits = ICON_NAMES.filter(n => n.includes(q.trim().toLowerCase()));

  return (
    <Page
      title="icons"
      description="The mark, the petal, and the glyph set — each one carrying its own mirror flag so RTL costs nothing at the call site."
      meta={<Cluster gap={2}><Badge tone="accent">7 exports</Badge><Badge>{ICON_NAMES.length} glyphs</Badge></Cluster>}
    >
      <Callout tone="warning" title="One icon source">
        Importing <code>lucide-react</code>, <code>react-icons</code> or{" "}
        <code>@heroicons/react</code> is a lint error. Those packages have no mirror flags
        and no token sizes, so an icon from one of them silently breaks RTL.
      </Callout>

      <Group title="The mark">
        <Demo name="Mark" note="Auto-simplifies by size — the three-layer set resolves to fewer layers as it gets smaller. Never mirrors.">
          <Cluster gap={6} align="end">
            {[16, 22, 32, 48, 64, 96].map(size => (
              <Stack key={size} gap={2} align="center">
                <Mark size={size} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                  color: "var(--text-muted)" }}>{size}</span>
              </Stack>
            ))}
          </Cluster>
        </Demo>

        <Demo name="Mark tones" note="brand · brandTrue (for ink grounds and print) · mono · quiet · outline">
          <Grid min="140px" gap={5}>
            {["brand", "brandTrue", "mono", "quiet", "outline"].map(tone => (
              <Card key={tone} style={{ padding: "var(--space-5)" }}>
                <Stack gap={3} align="center">
                  <Mark size={44} tone={tone} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{tone}</span>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Demo>

        <Demo name="Petal · Spinner">
          <Cluster gap={7} align="center">
            <Cluster gap={3}>
              {[0, 45, 90, 135].map(r => <Petal key={r} size={20} rotate={r} />)}
              <Petal size={20} opacity={0.4} />
            </Cluster>
            <Cluster gap={5}>
              <Spinner label="Loading" />
              <Spinner variant="bloom" size={24} label="Pending" />
            </Cluster>
          </Cluster>
        </Demo>
      </Group>

      <Group title="Glyphs">
        <Demo name="Icon" note="aria-hidden by default; pass `label` to make it semantic. Sizes: 16 beside 13–14px text, 20 in buttons, 24 standalone.">
          <Stack gap={5}>
            <SearchField
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={`Search ${ICON_NAMES.length} glyphs`}
              style={{ maxInlineSize: 280 }}
            />
            <Grid min="110px" gap={4}>
              {hits.map(name => (
                <Card key={name} style={{ padding: "var(--space-4)" }}>
                  <Stack gap={3} align="center">
                    <Icon name={name} size={22} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                      color: "var(--text-muted)", textAlign: "center", wordBreak: "break-word" }}>
                      {name}
                    </span>
                    {MIRRORED.has(name) && <Badge tone="accent">mirrors</Badge>}
                  </Stack>
                </Card>
              ))}
            </Grid>
            {hits.length === 0 && (
              <Prose>
                <p style={{ color: "var(--text-muted)" }}>Nothing matches “{q}”.</p>
              </Prose>
            )}
          </Stack>
        </Demo>

        <Demo name="MIRRORED" note="Directional glyphs flip under dir=rtl. Everything else — and the mark — does not. Switch the top bar to RTL and watch this row.">
          <Cluster gap={5}>
            {[...MIRRORED].map(name => (
              <Stack key={name} gap={2} align="center">
                <Icon name={name} size={24} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                  color: "var(--text-muted)" }}>{name}</span>
              </Stack>
            ))}
          </Cluster>
        </Demo>

        <Demo name="Sizes and stroke" note="Above 24, drop strokeWidth to 1.25 so the glyph does not out-weigh the text beside it.">
          <Cluster gap={6} align="end">
            {[16, 20, 24, 32, 44].map(size => (
              <Stack key={size} gap={2} align="center">
                <Icon name="bookmark" size={size} strokeWidth={size > 24 ? 1.25 : 1.5} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                  color: "var(--text-muted)" }}>{size}</span>
              </Stack>
            ))}
          </Cluster>
        </Demo>
      </Group>
    </Page>
  );
}
