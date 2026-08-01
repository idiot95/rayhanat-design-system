"use client";

import { useState } from "react";
import {
  Button, IconButton, Link, Badge, Tag, Dot, Avatar, Skeleton, Card, Divider, Label,
  Input, SearchField, Textarea, Select, Checkbox, Radio, Switch,
  Stack, Cluster, Grid, Split, SidebarLayout, Center, ScrollArea, Container, Spacer,
  AspectRatio, BlockDemo, Truncate, OverflowRow, useBreakpoint, BREAKPOINTS
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

const FRAME = {
  background: "var(--surface-sunken)", borderRadius: "var(--radius-md)",
  padding: "var(--space-4)"
};

export default function UiPage() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("plate");
  const [on, setOn] = useState(true);
  const bp = useBreakpoint();

  return (
    <Page
      title="ui"
      description="Primitives and layout. Everything else in the system is built on these."
      meta={<Badge tone="accent">35 exports</Badge>}
    >
      <Group title="Actions">
        <Demo name="Button" note='variant: primary | secondary | ghost | danger · size: sm | md | lg'>
          <Stack gap={5}>
            {["sm", "md", "lg"].map(size => (
              <Cluster key={size} gap={3}>
                {["primary", "secondary", "ghost", "danger"].map(variant => (
                  <Button key={variant} variant={variant} size={size}>
                    {variant}
                  </Button>
                ))}
              </Cluster>
            ))}
            <Cluster gap={3}>
              <Button icon="check">Leading icon</Button>
              <Button iconEnd="arrow-right">Trailing icon</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </Cluster>
            <Button block variant="secondary">block</Button>
          </Stack>
        </Demo>

        <Demo name="IconButton" note="`label` is required — it becomes the accessible name.">
          <Cluster gap={3}>
            {["search", "plus", "pencil", "trash", "settings"].map(n => (
              <IconButton key={n} name={n} label={n} />
            ))}
            <IconButton name="check" label="Confirm" variant="primary" />
            <IconButton name="x" label="Dismiss" variant="ghost" />
            <IconButton name="trash" label="Delete" variant="danger" />
          </Cluster>
        </Demo>

        <Demo name="Link" note="Underlined by default — colour alone never carries the affordance.">
          <Cluster gap={5}>
            <Link href="#">An internal link</Link>
            <Link href="https://example.org" external>An external link</Link>
          </Cluster>
        </Demo>

        <Demo name="OverflowRow" note="Collapses what will not fit into an overflow menu. `keep` is how many stay visible at phone width.">
          <OverflowRow keep={2}>
            <Button size="sm" variant="secondary">Approve</Button>
            <Button size="sm" variant="secondary">Reassign</Button>
            <Button size="sm" variant="secondary">Duplicate</Button>
            <Button size="sm" variant="secondary">Archive</Button>
          </OverflowRow>
        </Demo>
      </Group>

      <Group title="Status and identity">
        <Demo name="Badge · Tag · Dot">
          <Stack gap={4}>
            <Cluster gap={3}>
              {["neutral", "accent", "secondary", "success", "warning", "danger", "info"].map(t => (
                <Badge key={t} tone={t}>{t}</Badge>
              ))}
            </Cluster>
            <Cluster gap={3}>
              <Badge tone="success" icon="check">Verified</Badge>
              <Badge tone="warning" icon="bell">Awaiting review</Badge>
            </Cluster>
            <Cluster gap={3}>
              <Tag onRemove={() => {}}>Removable</Tag>
              <Tag tone="neutral" onRemove={() => {}}>state: open</Tag>
            </Cluster>
            <Cluster gap={4}>
              {["accent", "success", "warning", "danger"].map(t => (
                <Cluster key={t} gap={2}>
                  <Dot tone={t} />
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{t}</span>
                </Cluster>
              ))}
            </Cluster>
          </Stack>
        </Demo>

        <Demo name="Avatar · Skeleton">
          <Stack gap={5}>
            <Cluster gap={3}>
              <Avatar initials="AJ" />
              <Avatar initials="MK" size={28} />
              <Avatar size={48} />
            </Cluster>
            <Stack gap={2} style={{ maxInlineSize: 320 }}>
              <Skeleton height={18} />
              <Skeleton />
              <Skeleton width="70%" />
            </Stack>
          </Stack>
        </Demo>

        <Demo name="Truncate">
          <Stack gap={3} style={{ maxInlineSize: 320 }}>
            <Truncate>
              A single line that is far too long for the measure it has been given, clipped with an ellipsis.
            </Truncate>
            <Truncate lines={2}>
              Two lines this time. The title attribute carries the full text, so the clipped content is still reachable by anyone hovering or reading with assistive technology.
            </Truncate>
          </Stack>
        </Demo>
      </Group>

      <Group title="Fields">
        <Demo name="Input · SearchField · Textarea · Select">
          <Grid min="240px" gap={5}>
            <Stack gap={3}>
              <Label htmlFor="d-a" required>Outlined</Label>
              <Input id="d-a" placeholder="Family name" />
              <Input placeholder="Soft" variant="soft" />
              <Input placeholder="Pill" pill />
              <Input placeholder="Invalid" invalid />
              <Input placeholder="Disabled" disabled />
            </Stack>
            <Stack gap={3}>
              <SearchField />
              <Select options={["Bindery", "Endpaper", "Colophon"]} />
              <Textarea rows={4} placeholder="Notes" />
            </Stack>
          </Grid>
        </Demo>

        <Demo name="Checkbox · Radio · Switch">
          <Grid min="200px" gap={5}>
            <Stack gap={3}>
              <Checkbox label="The tick is a petal" checked={checked}
                onChange={e => setChecked(e.target.checked)} />
              <Checkbox label="Unchecked" />
              <Checkbox label="Invalid" invalid />
              <Checkbox label="Disabled" disabled />
            </Stack>
            <Stack gap={3}>
              {["plate", "proof", "colophon"].map(v => (
                <Radio key={v} name="demo-radio" value={v} label={v}
                  checked={radio === v} onChange={() => setRadio(v)} />
              ))}
            </Stack>
            <Stack gap={3}>
              <Switch label="An immediate state change" checked={on}
                onChange={e => setOn(e.target.checked)} />
              <Switch label="Off" />
              <Switch label="Disabled" disabled />
            </Stack>
          </Grid>
        </Demo>
      </Group>

      <Group title="Layout">
        <Demo name="Stack · Cluster · Grid · Split" note="The four blocks that cover nearly every layout. Each miniature is BlockDemo.">
          <Grid min="200px" gap={6}>
            {["stack", "cluster", "grid", "split"].map(kind => (
              <Stack key={kind} gap={3}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-muted)" }}>{kind}</span>
                <BlockDemo kind={kind} />
              </Stack>
            ))}
          </Grid>
        </Demo>

        <Demo name="Split" note="Two panes that become one column when they cannot hold their minimum. No breakpoint involved — narrow the window.">
          <Split min="220px" gap={5}>
            <div style={FRAME}>First pane</div>
            <div style={FRAME}>Second pane</div>
          </Split>
        </Demo>

        <Demo name="SidebarLayout" note="Content plus a rail. The rail holds its width; the pair stacks when the content would fall below contentMin.">
          <SidebarLayout rail="180px" gap={5}>
            <div style={{ ...FRAME, minBlockSize: 96 }}>Content</div>
            <div style={{ ...FRAME, minBlockSize: 96 }}>Rail</div>
          </SidebarLayout>
        </Demo>

        <Demo name="Grid" note="Auto-fit on a minimum track width by default. Pass `columns` only where the count carries meaning.">
          <Stack gap={5}>
            <Grid min="120px" gap={3}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={FRAME}>{i + 1}</div>
              ))}
            </Grid>
            <Grid columns={3} gap={3}>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} style={FRAME}>columns=3</div>
              ))}
            </Grid>
          </Stack>
        </Demo>

        <Demo name="AspectRatio · ScrollArea · Center · Container · Spacer">
          <Grid min="240px" gap={5}>
            <Stack gap={2}>
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>AspectRatio 16 / 9</span>
              <AspectRatio ratio="16 / 9">
                <div style={{ ...FRAME, blockSize: "100%" }} />
              </AspectRatio>
            </Stack>
            <Stack gap={2}>
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>ScrollArea</span>
              <ScrollArea maxBlock={120}>
                <Stack gap={2}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} style={FRAME}>Row {i + 1}</div>
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          </Grid>
        </Demo>

        <Demo name="Card">
          <Grid min="200px" gap={5}>
            <Card style={{ padding: "var(--space-5)" }}>Default</Card>
            <Card tone="raised" style={{ padding: "var(--space-5)" }}>Raised</Card>
            <Card interactive style={{ padding: "var(--space-5)" }}>Interactive — hover and focus</Card>
          </Grid>
        </Demo>

        <Demo name="Divider">
          <Stack gap={5}>
            <Divider />
            <Divider label="With a caption" />
            <Divider mark />
          </Stack>
        </Demo>
      </Group>

      <Group title="Breakpoints">
        <Demo name="useBreakpoint()" note="For structural changes only. Grid and Split reflow on their own.">
          <Stack gap={3}>
            <Cluster gap={3}>
              <Badge tone="accent">{bp.name ?? String(bp)}</Badge>
              {Object.entries(bp)
                .filter(([, v]) => typeof v === "boolean")
                .map(([k, v]) => (
                  <Badge key={k} tone={v ? "success" : "neutral"}>{k}: {String(v)}</Badge>
                ))}
            </Cluster>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
              color: "var(--text-muted)" }}>
              BREAKPOINTS {JSON.stringify(BREAKPOINTS)}
            </span>
          </Stack>
        </Demo>
      </Group>

      <Center measure="var(--bp-md)">
        <Container size="prose">
          <Spacer size={4} />
        </Container>
      </Center>
    </Page>
  );
}
