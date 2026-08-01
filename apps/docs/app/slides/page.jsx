"use client";

import {
  Slide, SlideCover, SlideDivider, SlideContent, SlideBullets, SlideStats,
  SlideChart, SlideTable, SlideQuote, SlideClose, DECK_RHYTHM,
  BarChart, BulletList, Badge, Stack, Grid, Callout, Prose, CodeBlock
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

/**
 * Slide already carries `aspect-ratio: 16 / 9` and `container-type: size`, so it
 * establishes its own container for the `cqw` units and sizes itself off its
 * width. The frame therefore adds nothing but the rule around it — declaring a
 * second aspect ratio here makes the two boxes disagree.
 */
const FRAME = {
  borderWidth: "var(--border-hairline)",
  borderStyle: "solid",
  borderColor: "var(--border)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden"
};

function Deck({ children }) {
  return <div style={FRAME}>{children}</div>;
}

const CHART_ROWS = [
  { x: "Muh", plates: 128 },
  { x: "Saf", plates: 141 },
  { x: "Rab I", plates: 137 },
  { x: "Rab II", plates: 162 }
];

export default function SlidesPage() {
  return (
    <Page
      title="slides"
      description="Deck layouts that hold up past twenty slides, and buildDeck() so the same content renders to pptxgenjs."
      meta={<Badge tone="accent">12 exports</Badge>}
    >
      <Callout tone="info" title="The same components the app renders">
        <Prose>
          <p>
            A chart on a slide is the chart component, not a screenshot of it. That is why
            a deck built from live data cannot drift from the dashboard it was taken from.
          </p>
        </Prose>
      </Callout>

      <Group title="The run">
        <Demo name="SlideCover" note="The mark at 12cqw, the title at 7cqw, and nothing else.">
          <Deck>
            <SlideCover
              kicker="Daeratul Aqeeq"
              title="The bindery register"
              meta="Rabī' II 1447"
            />
          </Deck>
        </Demo>

        <Demo name="SlideDivider" note="Ink ground, mark ghosted at the corner under 24% value. The only dark field in the run.">
          <Deck>
            <SlideDivider numeral="I" title="What was catalogued" note="Four months of intake" />
          </Deck>
        </Demo>

        <Demo name="SlideContent" note="One or two columns. `aside` is any node — a chart, a table, a plate.">
          <Deck>
            <SlideContent
              kicker="Intake"
              title="Every plate now carries its own reference"
              aside={<BulletList marker="petal" items={["238 plates", "1,024 members", "4 chapters"]} />}
            >
              <Prose>
                <p>
                  The reference is assigned at intake rather than at approval, so a plate
                  that never completes review still has a name in the correspondence about
                  it.
                </p>
              </Prose>
            </SlideContent>
          </Deck>
        </Demo>

        <Demo name="SlideBullets" note="The petal as the marker. Six at most — past that, split the slide.">
          <Deck>
            <SlideBullets
              kicker="Method"
              title="How a plate enters the register"
              items={[
                "Intake assigns the reference.",
                "The chapter is recorded before condition.",
                "Review is a state, not a folder.",
                "Closure requires a folio count."
              ]}
            />
          </Deck>
        </Demo>

        <Demo name="SlideStats" note="Three or four figures. More than that is a table.">
          <Deck>
            <SlideStats
              title="The quarter"
              stats={[
                { label: "Plates", value: "238" },
                { label: "Members", value: "1,024" },
                { label: "Median wait", value: "3.2", unit: "days" }
              ]}
            />
          </Deck>
        </Demo>

        <Demo name="SlideChart">
          <Deck>
            <SlideChart
              kicker="Intake"
              title="Plates catalogued by month"
              note="Four months, one series."
              chart={<BarChart rows={CHART_ROWS} keys={["plates"]} height={200} />}
            />
          </Deck>
        </Demo>

        <Demo name="SlideTable" note="Eight rows at most — a deck is not a ledger.">
          <Deck>
            <SlideTable
              title="Open plates"
              columns={[
                { key: "ref", label: "Reference" },
                { key: "title", label: "Plate" },
                { key: "folios", label: "Folios", align: "end" }
              ]}
              rows={[
                { ref: "PL-0142", title: "Endpaper, marbled", folios: 12 },
                { ref: "PL-0160", title: "Rose leaf, pressed", folios: 7 },
                { ref: "PL-0166", title: "Marginalia, red", folios: 31 }
              ]}
            />
          </Deck>
        </Demo>

        <Demo name="SlideQuote · SlideClose">
          <Grid min="320px" gap={5}>
            <Deck>
              <SlideQuote
                quote="A warning in a multi-team system is a value someone hard-coded last quarter."
                cite="The enforcement mechanism"
              />
            </Deck>
            <Deck>
              <SlideClose title="Thank you" meta="daeratul-aqeeq.org" />
            </Deck>
          </Grid>
        </Demo>

        <Demo name="Slide" note="The frame every slide sits in. tone: paper | ink.">
          <Grid min="280px" gap={5}>
            <Deck><Slide tone="paper">Paper ground</Slide></Deck>
            <Deck><Slide tone="ink">Ink ground</Slide></Deck>
            <Deck>
              <Slide tone="paper" lang="ar" dir="rtl">دائرة العقيق</Slide>
            </Deck>
          </Grid>
        </Demo>
      </Group>

      <Group title="The rhythm">
        <Demo name="DECK_RHYTHM" note="Exported as data so a generator, a template and a reviewer all read the same sequence.">
          <BulletList marker="mark" items={DECK_RHYTHM} />
        </Demo>

        <Demo name="buildDeck()" note="The same content, rendered to pptxgenjs rather than to the DOM.">
          <CodeBlock caption="export.mjs">
            {'import PptxGenJS from "pptxgenjs";\nimport { buildDeck } from "@al-rayhaanat/system";\n\nconst pptx = new PptxGenJS();\nbuildDeck(pptx, [\n  { type: "cover", title: "The bindery register", meta: "Rabī\' II 1447" },\n  { type: "divider", numeral: "I", title: "What was catalogued" },\n  { type: "stats", title: "The quarter", stats: [{ label: "Plates", value: "238" }] }\n]);\nawait pptx.writeFile({ fileName: "register.pptx" });'}
          </CodeBlock>
        </Demo>
      </Group>
    </Page>
  );
}
