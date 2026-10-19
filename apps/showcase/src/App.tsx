import type * as React from "react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mark } from "@/components/brand/mark";
import { PageHeader } from "@/components/brand/page-header";
import {
  GatewayHome, GatewayMobile, GatewaySignIn, Kit, MarkForms, MemberViews, ModuleDesktop, ModuleMobile, NavStates,
} from "./screens";

type Theme = "light" | "dark";

function initialTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "dark" || set === "light") return set;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const SECTIONS = [
  ["mark", "Mark"],
  ["theme", "Theme"],
  ["module", "Module"],
  ["gateway", "Gateway"],
  ["member", "Member app"],
  ["nav", "Nav pane"],
  ["kit", "Component kit"],
  ["caps", "Hard caps"],
] as const;

export function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 pb-16">
      <div className="sticky top-[env(safe-area-inset-top,0px)] z-20 -mx-4 border-b bg-page/90 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-3">
          <Mark size={22} />
          <nav aria-label="Sections" className="flex min-w-0 flex-1 gap-1 overflow-x-auto text-sm">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 rounded-md px-2.5 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">{label}</a>
            ))}
          </nav>
          <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />}<span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </Button>
        </div>
      </div>

      <header className="flex max-w-3xl flex-col gap-4 pt-4">
        <PageHeader size="lg" eyebrow="al-Rayhaanat v2 · gateway kit" title="One brand level, every app" />
        <p className="text-lg text-muted-foreground">
          Stock shadcn/ui with one theme and ten brand components. The flower is the V2 mark, used whole: full colour,
          inner layer, or grayscale. It is never recoloured, so modules are told apart by an icon on their own hue instead.
        </p>
      </header>

      <Section id="mark" kicker="The flower" title="Four permitted forms"
        text="Sand outer petals, rose inner petals, crimson centre. Grayscale and removing the outer layer are allowed; nothing else is.">
        <MarkForms />
      </Section>

      <Section id="theme" kicker="The decision" title="One theme" text="All the brand values. Everything else is shadcn/ui and lucide as shipped.">
        <ThemeTable />
      </Section>

      <Section id="module" kicker="Staff" title="Back-office module: Hoto"
        text="The module's hue appears in two places: its badge (switcher, page title, mobile bar) and the dot that marks today.">
        <ModuleDesktop />
        <ModuleMobile />
      </Section>

      <Section id="gateway" kicker="Staff" title="Gateway" text="Sign-in, then home: module cards and what needs attention.">
        <GatewaySignIn />
        <GatewayHome />
        <GatewayMobile />
      </Section>

      <Section id="member" kicker="Members" title="Member app" text="Same theme as the staff tools, plus an Arabic welcome.">
        <MemberViews />
      </Section>

      <Section id="nav" kicker="Navigation" title="Nav pane states" text="No flower and no petals in the sidebar. The active page is a tinted fill.">
        <NavStates />
      </Section>

      <Section id="kit" kicker="Parts" title="Component kit" text="Every part used above, on its own.">
        <Kit />
      </Section>

      <Section id="caps" kicker="Enforcement" title="Hard caps" text="Each rule is checked by a machine on every pull request. The manifest (AGENTS.md) explains them; CI enforces them.">
        <Caps />
      </Section>
    </div>
  );
}

function Section({ id, kicker, title, text, children }: { id: string; kicker: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-16 flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-1">
        <p className="text-sm text-muted-foreground">{kicker}</p>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{text}</p>
      </div>
      {children}
    </section>
  );
}

const TOKENS: [string, string, string, string, string][] = [
  ["Primary action", "--primary", "#7c0b29", "#f79baf", "Default button, links, progress"],
  ["Ground", "--page / --background", "#faf6ef #fffdfa", "#100d0a #17130f", "Page and app surfaces"],
  ["Tinted fill", "--accent", "#f8eef0", "#2a1017", "Active nav item, date tiles"],
  ["Control border", "--input", "#9c8a6d", "#7a6b53", "Inputs, checkboxes: 3:1 minimum"],
  ["Errors", "--destructive", "#b53318", "#efa894", "Clay, never crimson"],
  ["Focus", "--ring", "#c81643", "#f06a88", "Focus outline"],
  ["Page titles", "--font-display", "Cormorant Garamond", "", "PageHeader and Wordmark only"],
  ["Arabic & Lisan ud-Dawat", "@font-face", "Kanz al-Lulu", "", "By character, automatically"],
  ["Module hue", "--hue-1 … --hue-8", "Eight fixed slots", "", "ModuleBadge and TodayDot only"],
];

function ThemeTable() {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <Table className="min-w-[760px]">
        <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Token</TableHead><TableHead>Light</TableHead><TableHead>Dark</TableHead><TableHead>Used for</TableHead></TableRow></TableHeader>
        <TableBody>
          {TOKENS.map(([role, token, light, dark, use]) => (
            <TableRow key={role}>
              <TableCell className="font-medium">{role}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{token}</TableCell>
              <TableCell><Swatch value={light} /></TableCell>
              <TableCell>{dark && <Swatch value={dark} />}</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">{use}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Swatch({ value }: { value: string }) {
  const hexes = value.match(/#[0-9a-f]{6}/gi);
  return (
    <span className="flex items-center gap-2 font-mono text-xs">
      {hexes?.map((h) => <span key={h} aria-hidden="true" className="size-4 rounded border" style={{ background: h }} />)}
      <span className={hexes ? "" : "font-sans text-sm"}>{value}</span>
    </span>
  );
}

const CAPS: [string, string][] = [
  ["Only brand colours exist", "Tailwind's palette is reset in theme.css; lint bans hex, rgb, hsl, oklch and arbitrary colour classes"],
  ["The flower is never altered", "Mark accepts only variant and tone, and drops the outer layer below 32px; lint bans styling it; e2e reads every rendered mark's fills, filter and size"],
  ["The flower lives in one file", "Its path data and colours may appear only in components/brand/mark.tsx"],
  ["Cormorant on page titles only", "font-display is allowed in PageHeader and Wordmark, nowhere else"],
  ["Module hue in its badge and today dot only", "bg-module / text-module allowed in module-badge.tsx only; hues come from eight slots"],
  ["No other UI or icon libraries", "Lint blocks MUI, Mantine, Chakra, Ant, react-icons, Heroicons and others"],
  ["shadcn and brand components are not forked", "CI compares each app's components/ui and components/brand with the registry"],
  ["One primary button per screen", "Playwright counts default buttons inside every screen"],
  ["Readable colours", "A script checks every token pair for 4.5:1 text and 3:1 controls, light and dark"],
  ["Accessible pages", "axe runs on the whole showcase in Playwright"],
];

function Caps() {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <Table className="min-w-[640px]">
        <TableHeader><TableRow><TableHead>Cap</TableHead><TableHead>Enforced by</TableHead></TableRow></TableHeader>
        <TableBody>
          {CAPS.map(([cap, how]) => (
            <TableRow key={cap}>
              <TableCell className="font-medium">{cap}</TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">{how}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
