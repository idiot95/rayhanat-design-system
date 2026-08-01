"use client";

import {
  CONTRACTS, ContractTable, Badge, Card, Stack, Cluster, Grid,
  Callout, Prose, CodeBlock, BulletList, DefinitionList
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

export default function ContractsPage() {
  return (
    <Page
      title="contracts"
      description="The behaviour every component family owes its caller — as data, not prose, so the documentation board, the review checklist and the test suite read the same list."
      meta={<Cluster gap={2}>
        <Badge tone="accent">2 exports</Badge>
        <Badge>{CONTRACTS.length} families</Badge>
      </Cluster>}
    >
      <Callout tone="accent" variant="card" title="Why appearance is only half a design system">
        <Prose>
          <p>
            A system that specifies only how things look drifts the moment two teams build
            the same interaction differently. These records specify the other half: the
            states a family must carry, the keys it must answer, the ARIA it must emit,
            what it must do under RTL and reduced motion, and what it must never do.
          </p>
        </Prose>
      </Callout>

      <Group title="The whole table">
        <Demo name="ContractTable" note="Every family, every column. Scrolls horizontally rather than wrapping — the rows are meant to be compared." pad={0}>
          <ContractTable />
        </Demo>
      </Group>

      <Group title="Family by family">
        {CONTRACTS.map(c => (
          <Card key={c.family} style={{ padding: "var(--space-6)" }}>
            <Stack gap={5}>
              <Stack gap={2}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                  fontWeight: "var(--weight-semibold)" }}>{c.family}</span>
                <Cluster gap={2}>
                  {c.states.split("·").map(s => (
                    <Badge key={s} tone="neutral">{s.trim()}</Badge>
                  ))}
                </Cluster>
              </Stack>

              <DefinitionList
                pairs={[
                  ["Keyboard", c.keyboard],
                  ["ARIA", c.aria],
                  ["RTL", c.rtl],
                  ["Motion", c.motion]
                ]}
              />

              <Callout tone="danger" title="Never">{c.never}</Callout>

              <Stack gap={3}>
                <span style={{ fontSize: "var(--text-3xs)", letterSpacing: "var(--tracking-kicker)",
                  textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Minimum tests
                </span>
                <BulletList marker="check" dense items={c.tests} />
              </Stack>
            </Stack>
          </Card>
        ))}
      </Group>

      <Group title="Using it">
        <Demo name="CONTRACTS" note="The same array drives the table above and the suite below. A family added here has to be answered in both.">
          <Grid min="320px" gap={5}>
            <CodeBlock caption="the minimum suite">
              {'import { CONTRACTS } from "@al-rayhaanat/system";\n\nCONTRACTS.forEach(c =>\n  describe(c.family, () =>\n    c.tests.forEach(t => it(t, () => {\n      /* … */\n    }))\n  )\n);'}
            </CodeBlock>
            <CodeBlock caption="one record">
              {JSON.stringify(CONTRACTS[0], null, 2)}
            </CodeBlock>
          </Grid>
        </Demo>
      </Group>
    </Page>
  );
}
