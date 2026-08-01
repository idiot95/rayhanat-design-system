"use client";

import { useState } from "react";
import {
  Modal, Drawer, BottomSheet, ConfirmDialog, Popover, Tooltip, Tabs, Accordion,
  Breadcrumb, Pagination, CommandPalette, useToast, Toast,
  EmptyState, ErrorState, LoadingState, AccessDenied,
  Button, Stack, Cluster, Grid, Badge, Prose
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

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
      meta={<Badge tone="accent">18 exports</Badge>}
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
