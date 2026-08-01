"use client";

import {
  LineChart, AreaChart, BarChart, DonutChart, Sparkline, Stat, Legend,
  SERIES, CHART_RULES, BulletList, Badge, Grid, Stack, Cluster
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

const MONTHS = ["Muh", "Saf", "Rab I", "Rab II", "Jum I", "Jum II"];

const ROWS = MONTHS.map((x, i) => ({
  x,
  registered: [128, 141, 137, 162, 178, 173][i],
  approved: [96, 112, 118, 129, 151, 148][i],
  lapsed: [12, 9, 14, 11, 8, 13][i]
}));

const DONUT = [
  { label: "Bindery", value: 412 },
  { label: "Endpaper", value: 268 },
  { label: "Colophon", value: 173 },
  { label: "Proof", value: 88 }
];

export default function ChartsPage() {
  return (
    <Page
      title="charts"
      description="Six chart forms and the rules that make a chart review a matter of evidence rather than taste."
      meta={<Badge tone="accent">9 exports</Badge>}
    >
      <Group title="KPI">
        <Demo name="Stat" note="One figure, its label, its movement — and never movement alone.">
          <Grid min="200px" gap={4}>
            <Stat label="Registered" value="1,024" delta={8.4} deltaLabel="vs last month"
              trend={[128, 141, 137, 162, 178, 173]} />
            <Stat label="Approved" value="871" delta={5.1} deltaLabel="vs last month"
              trend={[96, 112, 118, 129, 151, 148]} />
            <Stat label="Lapsed" value="67" delta={-2.3} deltaLabel="vs last month"
              trend={[12, 9, 14, 11, 8, 13]} />
            <Stat label="Median wait" value="3.2" unit="days" delta={-11} deltaLabel="improving" />
          </Grid>
        </Demo>

        <Demo name="Sparkline" note="A figure's shape, inline, with no axes.">
          <Cluster gap={6}>
            {[
              [4, 7, 5, 9, 12, 10, 14],
              [14, 11, 12, 8, 9, 6, 5],
              [6, 6, 7, 6, 8, 7, 9]
            ].map((values, i) => (
              <Cluster key={i} gap={3}>
                <Sparkline values={values} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-muted)" }}>{values[values.length - 1]}</span>
              </Cluster>
            ))}
          </Cluster>
        </Demo>
      </Group>

      <Group title="Series">
        <Demo name="LineChart" note="rows: [{ x, a, b }] · keys: ['a','b']">
          <LineChart
            rows={ROWS}
            keys={["registered", "approved"]}
            title="Registrations against approvals"
            note="Six months. The legend carries the meaning — never hue alone."
          />
        </Demo>

        <Demo name="AreaChart" note="A line chart with its fill on.">
          <AreaChart rows={ROWS} keys={["registered"]} title="Registrations" />
        </Demo>

        <Demo name="BarChart">
          <Grid min="320px" gap={5}>
            <BarChart rows={ROWS} keys={["approved", "lapsed"]} title="Grouped" />
            <BarChart rows={ROWS} keys={["approved", "lapsed"]} stacked title="Stacked" />
          </Grid>
        </Demo>

        <Demo name="DonutChart" note="A total in the middle, because a ring without a number is decoration.">
          <Grid min="260px" gap={5}>
            <DonutChart data={DONUT} title="Members by chapter" unit="members" />
            <DonutChart data={DONUT.slice(0, 2)} title="Two-way split" size={160} />
          </Grid>
        </Demo>

        <Demo name="Legend" note="Always present when there is more than one series.">
          <Legend keys={["registered", "approved", "lapsed"]} />
        </Demo>
      </Group>

      <Group title="The sequence">
        <Demo name="SERIES" note="Lightness alternates as well as hue: dark, mid, dark, mid…">
          <Cluster gap={2}>
            {SERIES.map((c, i) => (
              <Stack key={c} gap={1} align="center">
                <span style={{ inlineSize: 44, blockSize: 44, background: c,
                  borderRadius: "var(--radius-sm)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                  color: "var(--text-muted)" }}>{i + 1}</span>
              </Stack>
            ))}
          </Cluster>
        </Demo>

        <Demo name="CHART_RULES" note="Exported as data, so a chart review is not a matter of taste.">
          <BulletList marker="check" items={CHART_RULES} />
        </Demo>
      </Group>
    </Page>
  );
}
