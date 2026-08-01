"use client";

import {
  AppShell, MarketingShell, FocusShell, MobileShell,
  TopBar, SideNav, MenuBar, UserMenu, PageHeader, Toolbar,
  Button, IconButton, Badge, Card, Stack, Cluster, Tabs, Callout, Prose, SearchField
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

/** Every frame is shown inside a fixed viewport so the page stays navigable. */
const VIEWPORT = {
  blockSize: 420, overflow: "hidden", position: "relative",
  borderWidth: "var(--border-hairline)", borderStyle: "solid",
  borderColor: "var(--border)", borderRadius: "var(--radius-lg)"
};

const GROUPS = [
  {
    label: "Register",
    items: [
      { label: "Plates", icon: "image", count: 238, href: "#" },
      { label: "Members", icon: "users", count: 1024, href: "#" },
      {
        label: "Bindery", icon: "layers", href: "#", defaultOpen: true,
        children: [
          { label: "Open", href: "#" },
          { label: "In review", href: "#" },
          { label: "Closed", href: "#" }
        ]
      }
    ]
  },
  {
    label: "Office",
    items: [
      { label: "Reports", icon: "table", href: "#" },
      { label: "Settings", icon: "settings", href: "#" }
    ]
  }
];

const MENUS = [
  { label: "File", items: [{ label: "New plate", run: () => {} }, "-", { label: "Export", run: () => {} }] },
  { label: "Edit", items: [{ label: "Undo", run: () => {} }, { label: "Redo", run: () => {} }] },
  { label: "View", items: [{ label: "Compact rows", run: () => {} }, { label: "Show facets", run: () => {} }] }
];

const USER = {
  name: "Abdulqadir J.",
  initials: "AJ",
  role: "Archive office",
  items: [{ label: "Profile", icon: "user", run: () => {} }, "-", { label: "Sign out", icon: "log-out", run: () => {} }]
};

const TABS = [
  { label: "Plates", icon: "image", href: "#" },
  { label: "Members", icon: "users", href: "#" },
  { label: "Search", icon: "search", href: "#" },
  { label: "More", icon: "menu", href: "#" }
];

export default function ShellPage() {
  return (
    <Page
      title="shell"
      description="Four frames. The sidebar sits on the inline start, so it moves to the right under RTL without a line of code changing."
      meta={<Badge tone="accent">10 exports</Badge>}
    >
      <Callout tone="info" title="This site is the fifth specimen">
        The chrome around this page is <code>AppShell</code>, <code>SideNav</code> and{" "}
        <code>TopBar</code>. Toggle RTL in the top bar and watch the rail move — the frames
        below will move with it.
      </Callout>

      <Group title="AppShell">
        <Demo name="AppShell + SideNav + TopBar + PageHeader" note="The admin frame: rail, top bar, scrolling main." pad={0}>
          <div style={VIEWPORT}>
            <AppShell
              style={{ blockSize: "100%" }}
              sideNav={<SideNav brand="Bindery" groups={GROUPS} current="Plates" />}
              topBar={
                <TopBar
                  dense
                  brand="Register"
                  items={["Overview", "Plates", "Members"]}
                  current="Plates"
                  search
                  user={USER}
                  actions={<Button size="sm" icon="plus">New</Button>}
                />
              }
              header={
                <PageHeader
                  breadcrumb={[{ label: "Register", href: "#" }, { label: "Plates" }]}
                  title="Plates"
                  description="Everything catalogued in the bindery register."
                  meta={<><span>238 records</span><span>Updated 1447-03-24</span></>}
                  actions={<Cluster gap={3}>
                    <Button variant="secondary" size="sm" icon="download">Export</Button>
                    <Button variant="primary" size="sm" icon="plus">Add plate</Button>
                  </Cluster>}
                  tabs={<Tabs items={["All", "Open", "In review"]} value="All" onChange={() => {}} />}
                />
              }
            >
              <Stack gap={4}>
                <Toolbar>
                  <SearchField size="sm" style={{ maxInlineSize: 200 }} />
                  <Button size="sm" variant="ghost" icon="filter">Filter</Button>
                  <Button size="sm" variant="ghost" icon="sliders">Columns</Button>
                </Toolbar>
                {["Endpaper, marbled", "Colophon, gilt", "Frontispiece"].map(t => (
                  <Card key={t} style={{ padding: "var(--space-5)" }}>{t}</Card>
                ))}
              </Stack>
            </AppShell>
          </div>
        </Demo>

        <Demo name="SideNav" note="Grouped, multi-level. Level 1 is a heading, level 2 is a destination or a disclosure, level 3 is a destination. Collapses to icons." pad={0}>
          <Cluster gap={0} align="stretch" style={{ ...VIEWPORT, blockSize: 340 }}>
            <SideNav brand="Bindery" groups={GROUPS} current="In review" />
            <SideNav brand={false} groups={GROUPS} current="Plates" collapsed />
          </Cluster>
        </Demo>
      </Group>

      <Group title="TopBar">
        <Demo name="TopBar" note="`dense` for the app shell, tall for marketing. `menus` swaps the nav for a MenuBar." pad={0}>
          <Stack gap={0}>
            <TopBar brand="al-Rayhaanat" items={["Product", "Register", "Support"]} current="Register"
              actions={<Button size="sm" variant="primary">Sign in</Button>} />
            <TopBar dense brand="Register" menus={MENUS} search user={USER} />
          </Stack>
        </Demo>

        <Demo name="MenuBar · UserMenu" note="File / Edit menus for tool-shaped products; the signed-in identity and what hangs off it.">
          <Cluster gap={6} justify="space-between">
            <MenuBar menus={MENUS} />
            <UserMenu {...USER} />
          </Cluster>
        </Demo>
      </Group>

      <Group title="MarketingShell">
        <Demo name="MarketingShell" note="Public site and sign-in pages: top bar, centred measure, no chrome." pad={0}>
          <div style={{ ...VIEWPORT, overflow: "auto" }}>
            <MarketingShell
              topBar={<TopBar items={["Product", "Register", "Support"]} current="Product"
                actions={<Button size="sm" variant="primary">Sign in</Button>} />}
              footer={<span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                © Daeratul Aqeeq
              </span>}
            >
              <Prose>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)" }}>
                  One register, every plate
                </h1>
                <p>
                  The centred measure and the page gutter come from the frame, so a
                  marketing page and an app page share a spine even though they share no
                  navigation.
                </p>
              </Prose>
            </MarketingShell>
          </div>
        </Demo>
      </Group>

      <Group title="FocusShell">
        <Demo name="FocusShell" note="One task, one way out. No navigation to wander into — for checkout, onboarding, a destructive migration." pad={0}>
          <div style={{ ...VIEWPORT, blockSize: 320, overflow: "auto" }}>
            <FocusShell
              title="Register a new member"
              description="Four steps. Nothing is saved until the last one."
              exitLabel="Back to register"
              onExit={() => {}}
            >
              <Stack gap={4}>
                <Card style={{ padding: "var(--space-5)" }}>Step 1 — Identity</Card>
                <Cluster gap={3}>
                  <Button variant="secondary">Back</Button>
                  <Button variant="primary">Continue</Button>
                </Cluster>
              </Stack>
            </FocusShell>
          </div>
        </Demo>
      </Group>

      <Group title="MobileShell">
        <Demo name="MobileShell" note="Hamburger drawer for the full tree, bottom tab bar for the four places people go constantly. Every target is at least 44px." pad={5}>
          <div style={{ ...VIEWPORT, inlineSize: 360, maxInlineSize: "100%", blockSize: 520,
            marginInline: "auto" }}>
            <MobileShell
              contained
              brand="Bindery"
              groups={GROUPS}
              tabs={TABS}
              current="Plates"
              title="Plates"
              actions={<IconButton size="sm" variant="ghost" name="plus" label="Add plate" />}
              style={{ blockSize: "100%" }}
            >
              <Stack gap={3}>
                {["Endpaper, marbled", "Colophon, gilt", "Frontispiece", "Rose leaf"].map(t => (
                  <Card key={t} style={{ padding: "var(--space-4)" }}>{t}</Card>
                ))}
              </Stack>
            </MobileShell>
          </div>
        </Demo>
      </Group>
    </Page>
  );
}
