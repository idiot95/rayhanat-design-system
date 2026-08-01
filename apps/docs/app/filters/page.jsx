"use client";

import { useState } from "react";
import {
  FilteredTable, FilterBar, FilterChips, SavedViews, ScopeTabs, QuickFilters, FacetList,
  useFilters, applyFilters, serializeFilters, OPERATORS,
  GhostToolbar, GhostMenu, GhostMenuItem, ExpandingSearch, DataTable,
  Badge, Stack, Cluster, Callout, CodeBlock, Prose, Dot
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

const FIELDS = [
  { key: "ref", label: "Reference", type: "text" },
  { key: "title", label: "Plate", type: "text" },
  { key: "chapter", label: "Chapter", type: "select", options: ["Bindery", "Endpaper", "Colophon", "Proof"] },
  { key: "state", label: "State", type: "select", options: ["open", "review", "closed"] },
  { key: "folios", label: "Folios", type: "number" },
  { key: "updated", label: "Updated", type: "date" }
];

const CHAPTER_VALUES = ["Bindery", "Endpaper", "Colophon", "Proof"];

const STATE_TONE = { open: "success", review: "warning", closed: "neutral" };

const COLUMNS = [
  { key: "ref", label: "Reference", width: 120 },
  { key: "title", label: "Plate" },
  { key: "chapter", label: "Chapter", width: 130 },
  { key: "state", label: "State", width: 110,
    /* render receives (value, row) — the cell's own value first. */
    render: value => <Badge tone={STATE_TONE[value]}>{value}</Badge> },
  { key: "folios", label: "Folios", align: "end", width: 90 }
];

const SCOPES = [
  { id: "all", label: "All", filters: [] },
  { id: "open", label: "Open", filters: [{ field: "state", operator: "is", value: "open" }] },
  { id: "review", label: "In review", filters: [{ field: "state", operator: "is", value: "review" }] },
  { id: "closed", label: "Closed", filters: [{ field: "state", operator: "is", value: "closed" }] }
];

const PRESETS = [
  { id: "bindery", label: "Bindery only", filters: [{ field: "chapter", operator: "is", value: "Bindery" }] },
  { id: "large", label: "Over 10 folios", filters: [{ field: "folios", operator: "gt", value: 10 }] }
];

/**
 * The labelled toolbar: search, then filter, columns and sort — each naming
 * itself the way the nav rail names its destinations, rather than leaving a
 * glyph to be decoded.
 */
function LabelledToolbar() {
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [hidden, setHidden] = useState([]);

  const only = name => next => setOpen(next ? name : null);
  const toggle = (list, set) => v =>
    set(cs => (cs.includes(v) ? cs.filter(x => x !== v) : [...cs, v]));

  const shown = COLUMNS.filter(c => !hidden.includes(c.key));
  const rows = ROWS
    .filter(r => !chapters.length || chapters.includes(r.chapter))
    .filter(r => !q || `${r.ref} ${r.title} ${r.chapter}`.toLowerCase().includes(q.toLowerCase()));
  const sorted = sort
    ? [...rows].sort((a, b) => String(a[sort]).localeCompare(String(b[sort])))
    : rows;

  return (
    <Stack gap={4}>
      <GhostToolbar gap={3}>
        <ExpandingSearch value={q} onChange={setQ} placeholder="Search plates"
          open={open === "search"} onOpenChange={only("search")} />
        <GhostMenu showLabel icon="filter" label="Filter" tone="success" align="start"
          active={chapters.length > 0} count={chapters.length}
          open={open === "filter"} onOpenChange={only("filter")}>
          {CHAPTER_VALUES.map(c => (
            <GhostMenuItem key={c} label={c} selected={chapters.includes(c)}
              role="menuitemcheckbox" onClick={() => toggle(chapters, setChapters)(c)} />
          ))}
        </GhostMenu>
        <GhostMenu showLabel icon="sliders" label="Columns" tone="accent" align="start"
          active={hidden.length > 0} count={hidden.length ? shown.length : 0}
          open={open === "columns"} onOpenChange={only("columns")}>
          {COLUMNS.map(c => (
            <GhostMenuItem key={c.key} label={c.label} selected={!hidden.includes(c.key)}
              role="menuitemcheckbox" onClick={() => toggle(hidden, setHidden)(c.key)} />
          ))}
        </GhostMenu>
        <GhostMenu showLabel icon="chevron-down" label="Sort" tone="accent" align="start"
          active={!!sort} count={sort ? 1 : 0}
          open={open === "sort"} onOpenChange={only("sort")}>
          {COLUMNS.map(c => (
            <GhostMenuItem key={c.key} label={c.label} selected={sort === c.key}
              onClick={() => setSort(sort === c.key ? null : c.key)} />
          ))}
        </GhostMenu>
      </GhostToolbar>
      <DataTable columns={shown} rows={sorted} caption="Plates" />
    </Stack>
  );
}

export default function FiltersPage() {
  const state = useFilters({ fields: FIELDS, syncUrl: false });
  const shown = applyFilters(ROWS, state.group);

  return (
    <Page
      title="filters"
      description="Declared and dynamic filters with the URL as the source of truth. A filtered view is a link — which is what makes it shareable, bookmarkable and reproducible in a bug report."
      meta={<Badge tone="accent">13 exports</Badge>}
    >
      <Callout tone="info" title="The query string is the whole payload">
        <Prose>
          <p>
            A saved view stores nothing but its query string. There is no server-side view
            record to migrate, and a view pasted into a chat message opens the same rows
            for whoever receives it.
          </p>
        </Prose>
      </Callout>

      <Group title="The toolbar, named">
        <Demo name="GhostToolbar with showLabel" note="Search, filter, columns and sort. `showLabel` writes the word beside the glyph — the same reading the nav rail gives its destinations — and the menus open from the inline start so they track the control rather than the far edge.">
          <LabelledToolbar />
        </Demo>
      </Group>

      <Group title="The composition products reach for">
        <Demo name="FilteredTable" note="Scopes, quick filters, the filter bar, the facet rail and the table — with the filter state in the URL and the row count reported." pad={5}>
          <FilteredTable
            fields={FIELDS}
            columns={COLUMNS}
            rows={ROWS}
            scopes={SCOPES}
            presets={PRESETS}
            facets={["chapter"]}
            storageKey="docs.plates"
            syncUrl={false}
          />
        </Demo>
      </Group>

      <Group title="The pieces">
        <Demo name="FilterBar" note="Add-filter, the rows, the combinator, the chips, saved views and the live query string.">
          <Stack gap={4}>
            <FilterBar state={state} />
            <Cluster gap={3}>
              <Badge tone="accent">{shown.length} of {ROWS.length} rows</Badge>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                color: "var(--text-muted)" }}>
                {serializeFilters(state.group) || "no filters"}
              </span>
            </Cluster>
          </Stack>
        </Demo>

        <Demo name="ScopeTabs" note="Mutually exclusive scopes. Counts are optional but nearly always worth the query.">
          <Stack gap={4}>
            <ScopeTabs state={state} scopes={SCOPES} />
            <ScopeTabs state={state} scopes={SCOPES} variant="rule" />
          </Stack>
        </Demo>

        <Demo name="QuickFilters" note="Additive one-click narrowings — each toggles its own filters in and out.">
          <QuickFilters state={state} presets={PRESETS} />
        </Demo>

        <Demo name="FilterChips" note="Active filters, each with its own clear, and a bulk clear at the end.">
          <FilterChips state={state} />
        </Demo>

        <Demo name="FacetList" note="One field's values with live counts, written back as an `any of` filter.">
          <div style={{ maxInlineSize: 240 }}>
            <FacetList state={state} field="chapter" rows={ROWS} title="Chapter" />
          </div>
        </Demo>

        <Demo name="SavedViews" note="Named views held in localStorage under `storageKey`.">
          <SavedViews state={state} />
        </Demo>
      </Group>

      <Group title="The operator table">
        <Demo name="OPERATORS" note="Which operators a field offers is decided by its declared type, not by the component rendering it.">
          <Stack gap={4}>
            {Object.entries(OPERATORS).map(([type, ops]) => (
              <Cluster key={type} gap={3}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-secondary)", inlineSize: 72 }}>{type}</span>
                <Cluster gap={2}>
                  {ops.map(o => (
                    <Badge key={o.op} tone="neutral">
                      {o.label}
                      {o.nullary && " ·"}
                      {o.binary && " ⇥"}
                    </Badge>
                  ))}
                </Cluster>
              </Cluster>
            ))}
          </Stack>
        </Demo>

        <Demo name="The field contract">
          <CodeBlock caption="fields">
            {JSON.stringify(FIELDS, null, 2)}
          </CodeBlock>
        </Demo>
      </Group>
    </Page>
  );
}
