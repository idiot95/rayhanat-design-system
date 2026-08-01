"use client";

import { useState } from "react";
import {
  Transition, FadeIn, Collapse, Stagger, useReducedMotion, PRESETS, MOTION,
  Button, Card, Badge, Callout, Stack, Cluster, Grid, Select
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

const TILE = {
  padding: "var(--space-5)", background: "var(--interactive-subtle)",
  color: "var(--interactive)", borderRadius: "var(--radius-md)",
  fontSize: "var(--text-sm)"
};

export default function MotionPage() {
  const [show, setShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState("fade-up");
  const [run, setRun] = useState(0);
  const reduced = useReducedMotion();

  return (
    <Page
      title="motion"
      description="Transitions with prefers-reduced-motion consulted once, here. Nothing else in the system asks."
      meta={
        <Cluster gap={2}>
          <Badge tone="accent">8 exports</Badge>
          <Badge tone={reduced ? "warning" : "neutral"}>
            prefers-reduced-motion: {reduced ? "reduce" : "no-preference"}
          </Badge>
        </Cluster>
      }
    >
      <Callout tone="info" title="This page is live">
        The badge above reads the media query and re-renders when it changes. Turn on
        Reduce Motion in your system settings and every specimen below settles instantly
        — without a single component being told about it.
      </Callout>

      <Group title="Entrances">
        <Demo name="Transition" note="Keeps the node in the DOM until the exit finishes, which is the whole reason this component exists.">
          <Stack gap={5}>
            <Cluster gap={3}>
              <Button variant="secondary" onClick={() => setShow(s => !s)}>
                {show ? "Unmount" : "Mount"}
              </Button>
              <Select
                value={preset}
                onChange={e => setPreset(e.target.value)}
                options={Object.keys(PRESETS)}
              />
            </Cluster>
            <div style={{ minBlockSize: 72 }}>
              <Transition show={show} preset={preset} duration="normal">
                <div style={TILE}>preset: {preset}</div>
              </Transition>
            </div>
          </Stack>
        </Demo>

        <Demo name="FadeIn" note="The common case: appear once, on mount.">
          <Stack gap={5}>
            <Button variant="secondary" onClick={() => setRun(r => r + 1)}>Replay</Button>
            <Grid min="140px" gap={4} key={`fade-${run}`}>
              {["fade", "fade-up", "fade-down", "scale"].filter(p => p in PRESETS).map(p => (
                <FadeIn key={p} preset={p}>
                  <div style={TILE}>{p}</div>
                </FadeIn>
              ))}
            </Grid>
          </Stack>
        </Demo>

        <Demo name="Stagger" note="Children enter in sequence. `step` is the gap between them, in ms.">
          <Stack gap={5}>
            <Button variant="secondary" onClick={() => setRun(r => r + 1)}>Replay</Button>
            <Stagger step={80} key={`stagger-${run}`}>
              {["Bindery", "Endpaper", "Colophon", "Proof", "Rose leaf"].map(n => (
                <Card key={n} style={{ padding: "var(--space-4)" }}>{n}</Card>
              ))}
            </Stagger>
          </Stack>
        </Demo>
      </Group>

      <Group title="Disclosure">
        <Demo name="Collapse" note="Animates the block size, not `display` — so the content is measurable and the row does not jump.">
          <Stack gap={4}>
            <Button variant="secondary" onClick={() => setOpen(o => !o)}>
              {open ? "Collapse" : "Expand"}
            </Button>
            <Collapse open={open}>
              <div style={TILE}>
                Height disclosure. The panel keeps its content in the DOM, so a form inside
                it does not lose its state each time it closes.
              </div>
            </Collapse>
          </Stack>
        </Demo>
      </Group>

      <Group title="The contract">
        <Demo name="PRESETS" note="Named entrances, as data.">
          <Cluster gap={2}>
            {Object.keys(PRESETS).map(p => <Badge key={p} tone="neutral">{p}</Badge>)}
          </Cluster>
        </Demo>

        <Demo name="MOTION" note="Durations and easings, for documentation and for tests. The same values the tokens carry.">
          <Grid min="240px" gap={5}>
            <Stack gap={2}>
              {Object.entries(MOTION.duration).map(([k, v]) => (
                <Cluster key={k} gap={3} justify="space-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                    color: "var(--text-muted)" }}>{v}</span>
                </Cluster>
              ))}
            </Stack>
            <Stack gap={2}>
              {Object.entries(MOTION.easing).map(([k, v]) => (
                <Stack key={k} gap={1}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{v}</span>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Demo>
      </Group>
    </Page>
  );
}
