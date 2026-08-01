"use client";

import {
  Prose, Lede, ProseHeading, Callout, BulletList, NumberedList, Steps, DefinitionList,
  Blockquote, PullQuote, CodeBlock, InlineCode, Kbd, Highlight, FootnoteRef, Footnotes,
  Ornament, RICH_TEXT_BLOCKS, Badge, Stack, Grid, Cluster
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

const ITEMS = [
  "The measure holds at 78ch, so a column never outruns the eye.",
  "Blocks are parted by the token scale, not by a margin someone chose once.",
  "Every marker is a system mark rather than a browser default."
];

export default function ProsePage() {
  return (
    <Page
      title="prose"
      description="Rich text. What a body of content may contain, and nothing else."
      meta={<Badge tone="accent">18 exports</Badge>}
    >
      <Group title="The measure">
        <Demo name="Prose · Lede · ProseHeading · Ornament" note="Wrap any body content. The measure and the space between blocks come from here.">
          <Prose>
            <Lede>
              The opening paragraph sets the piece. One per article, never two — a second
              lede is just a paragraph that has been given a size it did not earn.
            </Lede>
            <p>
              Body copy sits at the reading measure. The space between blocks is a token
              step, so a page assembled from a rich-text field and a page assembled by
              hand have the same rhythm.
            </p>
            <ProseHeading level={2}>A heading inside prose</ProseHeading>
            <p>
              Levels two through four are available. The mark ornament is optional and
              belongs to the section, not the sentence.
            </p>
            <ProseHeading level={3} ornament>With the ornament</ProseHeading>
            <p>
              Inline pieces: <InlineCode>tokens.css</InlineCode>, a keyboard hint like{" "}
              <Kbd>⌘K</Kbd>, and <Highlight>an accent highlight</Highlight> which tints
              rather than fills, so the text underneath stays readable.
            </p>
            <Ornament />
            <p>
              An ornament parts sections inside a column without promoting the break to a
              heading.
            </p>
          </Prose>
        </Demo>
      </Group>

      <Group title="Callouts">
        <Demo name="Callout" note="tone: note · accent · success · warning · danger · info — variant: bar (default) · card · plain">
          <Stack gap={5}>
            <Grid min="280px" gap={4}>
              {["note", "accent", "success", "warning", "danger", "info"].map(tone => (
                <Callout key={tone} tone={tone} title={tone}>
                  A callout interrupts the column without becoming a box in it.
                </Callout>
              ))}
            </Grid>
            <Callout tone="danger" variant="card" title="card">
              Bordered and tinted — for something the reader must not scroll past.
            </Callout>
            <Callout tone="note" variant="plain">
              plain — no edge and no fill.
            </Callout>
          </Stack>
        </Demo>
      </Group>

      <Group title="Lists">
        <Demo name="BulletList" note="marker: petal (editorial default) · mark · dot · dash · check">
          <Grid min="240px" gap={5}>
            {["petal", "mark", "dot", "dash", "check"].map(marker => (
              <Stack key={marker} gap={2}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-muted)" }}>{marker}</span>
                <BulletList marker={marker} items={ITEMS.slice(0, 2)} />
              </Stack>
            ))}
          </Grid>
        </Demo>

        <Demo name="NumberedList · Steps · DefinitionList">
          <Grid min="260px" gap={6}>
            <Stack gap={2}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                color: "var(--text-muted)" }}>NumberedList</span>
              <NumberedList items={ITEMS} />
            </Stack>
            <Stack gap={2}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                color: "var(--text-muted)" }}>Steps</span>
              <Steps items={[
                "Authenticate once per machine.",
                "Point the scope at the registry.",
                "Install the umbrella package."
              ]} />
            </Stack>
            <Stack gap={2}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                color: "var(--text-muted)" }}>DefinitionList</span>
              <DefinitionList pairs={[
                ["data-theme", "Swaps the entire semantic colour layer."],
                ["dir", "Mirrors layout and flips directional icons."],
                ["lang", "Selects Kanz al-Lulu and its corrected leading."]
              ]} />
            </Stack>
          </Grid>
        </Demo>
      </Group>

      <Group title="Quotation and code">
        <Demo name="Blockquote" note="variant: rule · plate · inline">
          <Stack gap={5}>
            {["rule", "plate", "inline"].map(variant => (
              <Blockquote key={variant} variant={variant} cite="The token pipeline">
                A warning in a multi-team system is a value someone hard-coded last quarter.
              </Blockquote>
            ))}
          </Stack>
        </Demo>

        <Demo name="PullQuote">
          <PullQuote>
            It still renders, which is the dangerous part.
          </PullQuote>
        </Demo>

        <Demo name="CodeBlock">
          <CodeBlock caption="next.config.mjs">
            {'export default {\n  transpilePackages: ["@al-rayhaanat/system"]\n};'}
          </CodeBlock>
        </Demo>
      </Group>

      <Group title="Footnotes">
        <Demo name="FootnoteRef · Footnotes">
          <Prose>
            <p>
              The Arabic face carries its own leading floor<FootnoteRef n={1} />, and the
              contrast audit is recorded alongside the tokens<FootnoteRef n={2} />.
            </p>
            <Footnotes notes={[
              "Raise --leading-ar-floor from 1.45 to 1.70 when the content is vocalised.",
              "See packages/tokens/README.md for the full audit."
            ]} />
          </Prose>
        </Demo>
      </Group>

      <Group title="The permitted set">
        <Demo name="RICH_TEXT_BLOCKS" note="What a rich-text field may emit, and nothing else. Exported as data so an editor's toolbar and this list cannot disagree.">
          <Cluster gap={2}>
            {RICH_TEXT_BLOCKS.map(b => <Badge key={b} tone="neutral">{b}</Badge>)}
          </Cluster>
        </Demo>
      </Group>
    </Page>
  );
}
