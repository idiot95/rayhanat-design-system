"use client";

import {
  DataTable, ToolbarTable, Badge, Dot, Stack, Cluster, Callout, Prose, Button
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

const ROWS = [
  { id: 1, ref: "PL-0142", title: "Endpaper, marbled", chapter: "Bindery", state: "open", folios: 12, updated: "1447-03-12" },
  { id: 2, ref: "PL-0143", title: "Colophon, gilt", chapter: "Colophon", state: "review", folios: 4, updated: "1447-03-14" },
  { id: 3, ref: "PL-0151", title: "Frontispiece", chapter: "Bindery", state: "closed", folios: 21, updated: "1447-02-28" },
  { id: 4, ref: "PL-0160", title: "Rose leaf, pressed", chapter: "Proof", state: "open", folios: 7, updated: "1447-03-19" },
  { id: 5, ref: "PL-0161", title: "Spine, tooled", chapter: "Bindery", state: "review", folios: 9, updated: "1447-03-21" },
  { id: 6, ref: "PL-0166", title: "Marginalia, red", chapter: "Endpaper", state: "open", folios: 31, updated: "1447-03-22" },
  { id: 7, ref: "PL-0171", title: "Watermark study", chapter: "Proof", state: "closed", folios: 2, updated: "1447-01-30" },
  { id: 8, ref: "PL-0180", title: "Binding, quarter calf", chapter: "Bindery", state: "open", folios: 16, updated: "1447-03-24" }
];

const STATE_TONE = { open: "success", review: "warning", closed: "neutral" };

const COLUMNS = [
  { key: "ref", label: "Reference", width: 120 },
  { key: "title", label: "Plate" },
  { key: "chapter", label: "Chapter", width: 130 },
  {
    key: "state",
    label: "State",
    width: 130,
    /* render receives (value, row) — the cell's own value first. */
    render: value => (
      <Cluster gap={2}>
        <Dot tone={STATE_TONE[value] === "neutral" ? "accent" : STATE_TONE[value]} />
        <Badge tone={STATE_TONE[value]}>{value}</Badge>
      </Cluster>
    )
  },
  {
    key: "folios",
    label: "Folios",
    align: "end",
    width: 100,
    /* aggregate receives the group's rows and returns what the footer shows. */
    aggregate: rows => rows.reduce((sum, r) => sum + r.folios, 0)
  },
  { key: "updated", label: "Updated", align: "end", width: 130 }
];

export default function TablePage() {
  return (
    <Page
      title="table"
      description="One headless core, many presentations. useTableState holds sorting, selection, grouping and expansion; the presentational components read it."
      meta={<Badge tone="accent">6 exports</Badge>}
    >
      <Callout tone="info" title="Swap the core, keep the surface">
        <Prose>
          <p>
            <code>useTableState</code> is deliberately replaceable — swap it for{" "}
            <code>useReactTable</code> and every presentation below keeps working, because
            none of them reach past the state object.
          </p>
        </Prose>
      </Callout>

      <Group title="The composition products reach for">
        <Demo name="ToolbarTable" note="The three ghost controls over a table, with the toolbar state owned by the component so the two cannot disagree. Search expands inline; sort and filter open small menus; all three close on Escape." pad={5}>
          <ToolbarTable
            columns={COLUMNS}
            rows={ROWS}
            facetKey="chapter"
            searchKeys={["ref", "title", "chapter"]}
            title="Plates"
            actions={<Button size="sm" icon="plus">Add plate</Button>}
            selectable
            stickyFirstColumn
            caption="Open plates in the bindery register"
          />
        </Demo>
      </Group>

      <Group title="DataTable, feature by feature">
        <Demo name="DataTable" note="columns: [{ key, label, align, width, render, editable, aggregate }] — everything else is opt-in." pad={5}>
          <DataTable columns={COLUMNS} rows={ROWS.slice(0, 5)} caption="The plain table" />
        </Demo>

        <Demo name="selectable · bulkActions" note="Selection lives in the core, so the bulk action bar and the header checkbox cannot fall out of step." pad={5}>
          <DataTable
            columns={COLUMNS}
            rows={ROWS.slice(0, 5)}
            selectable
            bulkActions={n => (
              <Cluster gap={3}>
                <Button size="sm" variant="secondary">Approve {n}</Button>
                <Button size="sm" variant="danger">Delete</Button>
              </Cluster>
            )}
          />
        </Demo>

        <Demo name="groupBy · summary" note="`aggregate` on a column drives both the group footer and the summary row." pad={5}>
          <DataTable columns={COLUMNS} rows={ROWS} groupBy="chapter" summary />
        </Demo>

        <Demo name="expandable" note="A row reveals detail without navigating away from the list." pad={5}>
          <DataTable
            columns={COLUMNS.slice(0, 4)}
            rows={ROWS.slice(0, 4)}
            expandable={row => (
              <Stack gap={2}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  {row.title} — {row.folios} folios, last touched {row.updated}.
                </span>
                <Cluster gap={3}>
                  <Button size="sm" variant="secondary">Open</Button>
                  <Button size="sm" variant="ghost">History</Button>
                </Cluster>
              </Stack>
            )}
          />
        </Demo>

        <Demo name="density · stickyFirstColumn · maxHeight" note="maxHeight turns on the sticky header." pad={5}>
          <DataTable
            columns={COLUMNS}
            rows={ROWS}
            density="compact"
            stickyFirstColumn
            maxHeight={240}
          />
        </Demo>

        <Demo name="resizable · columnControls" note="Column widths and visibility, kept in the core so they survive a re-render." pad={5}>
          <DataTable columns={COLUMNS} rows={ROWS.slice(0, 5)} resizable columnControls />
        </Demo>

        <Demo name="loading · emptyState" note="A table has states too — never a blank rectangle." pad={5}>
          <Stack gap={6}>
            <DataTable columns={COLUMNS} rows={[]} loading />
            <DataTable columns={COLUMNS} rows={[]} />
          </Stack>
        </Demo>
      </Group>
    </Page>
  );
}
