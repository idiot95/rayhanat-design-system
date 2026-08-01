"use client";

import { useState } from "react";
import {
  Modal, Drawer, BottomSheet, ConfirmDialog, Popover, Tooltip, Tabs, Accordion,
  Breadcrumb, Pagination, CommandPalette, useToast, Toast,
  EmptyState, ErrorState, LoadingState, AccessDenied,
  GhostButton, GhostMenu, GhostMenuItem, GhostToolbar, ExpandingSearch,
  Button, Stack, Cluster, Grid, Badge, Prose, Divider
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

const SORTS = [
  { key: "ref", label: "Reference" },
  { key: "chapter", label: "Chapter" },
  { key: "folios", label: "Folios" },
  { key: "updated", label: "Last updated" }
];

const CHAPTERS = ["Bindery", "Endpaper", "Colophon", "Proof"];

/** ExpandingSearch owns its open state, never the query — so the caller holds it. */
function SelfSearch({ size }) {
  const [q, setQ] = useState("");
  return (
    <Cluster gap={3} align="center">
      <ExpandingSearch size={size} value={q} onChange={setQ} placeholder={`Search — ${size}`} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
        color: "var(--text-muted)" }}>{q || "—"}</span>
    </Cluster>
  );
}

/** The three controls as a product actually wires them: one open at a time. */
function GhostBar() {
  const [openControl, setOpenControl] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(null);
  const [chapters, setChapters] = useState([]);

  const only = name => next => setOpenControl(next ? name : null);
  const toggleChapter = c =>
    setChapters(cs => (cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]));

  return (
    <Stack gap={4}>
      <GhostToolbar>
        <ExpandingSearch
          value={query}
          onChange={setQuery}
          placeholder="Search plates"
          open={openControl === "search"}
          onOpenChange={only("search")}
        />
        <GhostMenu
          icon="sliders"
          label="Sort"
          tone="accent"
          active={!!sort}
          count={sort ? 1 : 0}
          open={openControl === "sort"}
          onOpenChange={only("sort")}
        >
          {SORTS.map(s => (
            <GhostMenuItem key={s.key} label={s.label} selected={sort === s.key}
              onClick={() => setSort(sort === s.key ? null : s.key)} />
          ))}
        </GhostMenu>
        <GhostMenu
          icon="filter"
          label="Filter"
          tone="success"
          active={chapters.length > 0}
          count={chapters.length}
          open={openControl === "filter"}
          onOpenChange={only("filter")}
        >
          {CHAPTERS.map(c => (
            <GhostMenuItem key={c} label={c} selected={chapters.includes(c)}
              role="menuitemcheckbox" onClick={() => toggleChapter(c)} />
          ))}
        </GhostMenu>
      </GhostToolbar>

      <Cluster gap={3}>
        <Badge tone={query ? "accent" : "neutral"}>query: {query || "—"}</Badge>
        <Badge tone={sort ? "accent" : "neutral"}>sort: {sort || "—"}</Badge>
        <Badge tone={chapters.length ? "success" : "neutral"}>
          filter: {chapters.length ? chapters.join(", ") : "—"}
        </Badge>
      </Cluster>
    </Stack>
  );
}

const COMMANDS = [
  { label: "New record", icon: "plus", group: "Create", shortcut: "⌘N", run: () => {} },
  { label: "Open members", icon: "users", group: "Go to", shortcut: "⌘M", run: () => {} },
  { label: "Export as deck", icon: "download", group: "Export", run: () => {} },
  { label: "Toggle dark theme", icon: "eye", group: "View", run: () => {} }
];

export default function PatternsPage() {
  const [open, setOpen] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [page, setPage] = useState(2);
  const toast = useToast();
  const close = () => setOpen(null);

  return (
    <Page
      title="patterns"
      description="Overlays, disclosure, toasts and the four screen states. Every overlay traps focus, closes on Escape and returns focus to its trigger."
      meta={<Badge tone="accent">23 exports</Badge>}
    >
      <Group title="Overlays">
        <Demo name="Modal · Drawer · BottomSheet · ConfirmDialog · CommandPalette" note="Open one, then press Tab and Escape. The scroll behind is locked and focus comes back to the button you pressed.">
          <Cluster gap={3}>
            <Button onClick={() => setOpen("modal")}>Modal</Button>
            <Button variant="secondary" onClick={() => setOpen("drawer")}>Drawer</Button>
            <Button variant="secondary" onClick={() => setOpen("sheet")}>BottomSheet</Button>
            <Button variant="danger" onClick={() => setOpen("confirm")}>ConfirmDialog</Button>
            <Button variant="ghost" onClick={() => setOpen("palette")}>CommandPalette</Button>
          </Cluster>
        </Demo>

        <Modal
          open={open === "modal"}
          onClose={close}
          title="Approve registration"
          description="The member will be notified once this is approved."
          actions={
            <Cluster gap={3}>
              <Button variant="secondary" onClick={close}>Cancel</Button>
              <Button variant="primary" onClick={close}>Approve</Button>
            </Cluster>
          }
        >
          <Prose>
            <p>
              A modal is centred, focus-trapped and scroll-locked. Its actions sit in the
              footer with the primary last in the reading order, so they flip with{" "}
              <code>dir</code>.
            </p>
          </Prose>
        </Modal>

        <Drawer
          open={open === "drawer"}
          onClose={close}
          title="Record detail"
          actions={<Button variant="secondary" onClick={close}>Close</Button>}
        >
          <Prose>
            <p>
              A drawer enters from the inline-end edge by default, so switching to RTL
              moves it to the other side with no code change. Pass{" "}
              <code>side=&quot;start&quot;</code> to anchor it the other way.
            </p>
          </Prose>
        </Drawer>

        <BottomSheet open={open === "sheet"} onClose={close} title="Actions">
          <Stack gap={3}>
            <Button block variant="secondary" onClick={close}>Duplicate</Button>
            <Button block variant="secondary" onClick={close}>Archive</Button>
          </Stack>
        </BottomSheet>

        <ConfirmDialog
          open={open === "confirm"}
          onClose={close}
          onConfirm={close}
          title="Delete this plate?"
          description="This cannot be undone."
          confirmLabel="Delete"
        />

        <CommandPalette open={open === "palette"} onClose={close} commands={COMMANDS} />
      </Group>

      <Group title="Ghost controls">
        <Demo name="GhostToolbar · ExpandingSearch · GhostMenu" note="Press the magnifier: the glyph becomes the field rather than a field appearing beside it, so the widening is what tells you where the caret went. Escape clears and closes; leaving it empty collapses it again.">
          <GhostBar />
        </Demo>

        <Demo name="GhostButton" note="No fill and no border at rest, so a row of them reads as one quiet group. Hover or focus any of them.">
          <Stack gap={5}>
            <Cluster gap={2}>
              {["search", "sliders", "filter", "download", "printer", "settings"].map(i => (
                <GhostButton key={i} icon={i} label={i} />
              ))}
            </Cluster>
            <Divider label="tones, active" />
            <Cluster gap={4}>
              {[
                ["accent", "filter", "Filter", 3],
                ["success", "check", "Approved", 12],
                ["warning", "bell", "Needs review", 2],
                ["danger", "trash", "Flagged", 1],
                ["info", "file-text", "Drafts", 5],
                ["neutral", "eye", "Watched", 8]
              ].map(([tone, icon, label, count]) => (
                <Stack key={tone} gap={2} align="center">
                  <GhostButton icon={icon} label={label} tone={tone} active count={count} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                    color: "var(--text-muted)" }}>{tone}</span>
                </Stack>
              ))}
            </Cluster>
            <Divider label="sizes" />
            <Cluster gap={4} align="center">
              {["sm", "md", "lg"].map(s => (
                <GhostButton key={s} icon="filter" label={`Filter ${s}`} size={s} active />
              ))}
            </Cluster>
          </Stack>
        </Demo>

        <Demo name="Colour is state, not decoration" note="A tinted control means something is applied — so it is never used to brand a toolbar. The dot is the redundant channel, because tone alone cannot carry meaning.">
          <Cluster gap={7}>
            <Stack gap={2} align="center">
              <GhostButton icon="filter" label="Filter" />
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>at rest</span>
            </Stack>
            <Stack gap={2} align="center">
              <GhostButton icon="filter" label="Filter" active count={3} />
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>3 applied</span>
            </Stack>
            <Stack gap={2} align="center">
              <GhostButton icon="filter" label="Filter" disabled />
              <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>disabled</span>
            </Stack>
          </Cluster>
        </Demo>

        <Demo name="ExpandingSearch, standalone" note="It owns its open state; the query stays yours. Widths and sizes come off the same scale as the buttons beside it.">
          <Stack gap={5}>
            {["sm", "md", "lg"].map(s => (
              <Cluster key={s} gap={4} align="center">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)",
                  color: "var(--text-muted)", inlineSize: 28 }}>{s}</span>
                <SelfSearch size={s} />
              </Cluster>
            ))}
          </Stack>
        </Demo>
      </Group>

      <Group title="Disclosure">
        <Demo name="Popover · Tooltip" note="Both dismiss on outside click and Escape. The tooltip is a matted card, never a black bubble.">
          <Cluster gap={5}>
            <Popover trigger={<Button variant="secondary">Open popover</Button>}>
              <Stack gap={3}>
                <span style={{ fontSize: "var(--text-sm)" }}>An anchored panel.</span>
                <Button size="sm" variant="ghost">An action inside it</Button>
              </Stack>
            </Popover>
            <Tooltip label="Focus me with the keyboard too">
              <Button variant="ghost">Hover or focus</Button>
            </Tooltip>
          </Cluster>
        </Demo>

        <Demo name="Tabs" note="Roving tabindex; the arrow keys respect dir.">
          <Stack gap={5}>
            <Tabs
              items={["Overview", "Members", "Plates", "Settings"]}
              value={tab}
              onChange={setTab}
            />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Selected: {tab}
            </span>
            <Tabs items={["Pill", "Variant"]} value="Pill" onChange={() => {}} variant="pill" />
          </Stack>
        </Demo>

        <Demo name="Accordion">
          <Accordion
            multiple
            defaultOpen={["umbrella"]}
            items={[
              { id: "umbrella", title: "Why one package", meta: "system",
                body: "A product that installs a subset loses behaviour silently, which is worse than a slightly larger bundle." },
              { id: "jsx", title: "Why source JSX", meta: "distribution",
                body: "So components stay readable and debuggable inside the app that consumes them." },
              { id: "tokens", title: "Why the tokens are committed", meta: "pipeline",
                body: "The generator currently emits a different public API than the packages consume." }
            ]}
          />
        </Demo>
      </Group>

      <Group title="Navigation">
        <Demo name="Breadcrumb" note="The separator is a chevron, and it mirrors under RTL. The last item is aria-current, not a link.">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Packages", href: "/" },
            { label: "patterns" }
          ]} />
        </Demo>

        <Demo name="Pagination" note="Figures set tabular; the arrows mirror under RTL.">
          <Pagination page={page} pageCount={12} total={238} pageSize={20} onChange={setPage} />
        </Demo>
      </Group>

      <Group title="Toasts">
        <Demo name="ToastProvider · useToast · Toast" note="The provider wraps this whole site once, in the layout. Anything below it can push.">
          <Stack gap={5}>
            <Cluster gap={3}>
              {["neutral", "success", "warning", "danger"].map(tone => (
                <Button key={tone} variant="secondary" size="sm"
                  onClick={() => toast.push({
                    tone,
                    title: `A ${tone} toast`,
                    body: "It dismisses itself, and stacks if you press again."
                  })}>
                  push {tone}
                </Button>
              ))}
            </Cluster>
            {/* Toast is a fixed min(360px, 90vw) — it is built for the toast
                stack, not a grid, so the tracks have to clear 360px. */}
            <Grid min="380px" gap={4}>
              {["neutral", "success", "warning", "danger"].map(tone => (
                <Toast key={tone} tone={tone} title={`Toast — ${tone}`}
                  body="Rendered statically here so the four tones can be compared."
                  onDismiss={() => {}} />
              ))}
            </Grid>
          </Stack>
        </Demo>
      </Group>

      <Group title="The four screen states">
        <Demo name="EmptyState · LoadingState · ErrorState · AccessDenied" note="Never a dead end: each one carries the way forward.">
          <Grid min="300px" gap={5}>
            <EmptyState
              title="No plates yet"
              description="Plates you scan will appear here."
              action={<Button variant="primary" icon="plus">Add a plate</Button>}
            />
            <LoadingState label="Loading plates" />
            <ErrorState
              title="That did not load"
              description="The register did not answer in time."
              detail="GET /api/plates — 504"
              onRetry={() => {}}
            />
            <AccessDenied resource="the bindery register" contact="the archive office" />
          </Grid>
        </Demo>
      </Group>
    </Page>
  );
}
