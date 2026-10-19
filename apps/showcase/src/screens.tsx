import type * as React from "react";
import {
  ArrowLeft, ArrowRight, BarChart3, Bell, BookUser, CalendarDays, ChevronDown, ChevronLeft, ChevronRight,
  CircleAlert, CheckCircle2, Clock, Download, Fingerprint, House, Inbox, Info, LayoutGrid, ListChecks, Loader2,
  Mail, MapPin, Plus, ScrollText, Search, SlidersHorizontal, Ticket, Trash2, TriangleAlert, Upload, User, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mark } from "@/components/brand/mark";
import { Wordmark } from "@/components/brand/wordmark";
import { Bloom } from "@/components/brand/bloom";
import { PageHeader } from "@/components/brand/page-header";
import { ModuleBadge, TodayDot } from "@/components/brand/module-badge";
import { MODULES, moduleByKey, type ModuleEntry } from "@/components/brand/modules";
import { Sidebar, NavGroup, NavItem, ModuleSwitcher, UserChip } from "@/components/brand/sidebar";
import { MobileBar, BottomNav, type Tab } from "@/components/brand/mobile-nav";
import { DateRow } from "@/components/brand/date-tile";
import { EmptyState } from "@/components/brand/empty-state";
import { cn } from "@/lib/utils";

const USER = { name: "Husain Kapadia", its: "30411786" };

/* ── frames ─────────────────────────────────────────────────────────────── */

function BrowserFrame({ url, label, children }: { url: string; label: string; children: React.ReactNode }) {
  return (
    <figure data-screen={label} className="overflow-hidden rounded-xl border bg-muted shadow-sm">
      <div className="flex items-center gap-3 border-b px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">{url}</span>
      </div>
      {children}
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

function Phone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure data-screen={label} className="flex w-[320px] max-w-full flex-col items-center gap-3">
      <div className="w-full overflow-hidden rounded-[2.2rem] border-[6px] border-foreground/85 bg-background shadow-lg">
        <div className="relative flex h-[640px] flex-col overflow-hidden">{children}</div>
      </div>
      <figcaption className="text-sm text-muted-foreground">{label}</figcaption>
    </figure>
  );
}

function StatusBar() {
  return (
    <div aria-hidden="true" className="relative flex justify-between px-6 pt-3 pb-1 text-[11px] font-semibold tabular-nums">
      <span>09:41</span><span>5G · 82%</span>
    </div>
  );
}

/* ── module: Hoto ───────────────────────────────────────────────────────── */

type EventRow = { day: string; time: string; title: string; venue: string; booked: string; status: string; today?: boolean };

const EVENTS: EventRow[] = [
  { day: "Mon 19 Oct", time: "19:30", title: "Evening majlis", venue: "Main hall", booked: "412 / 600", status: "Published", today: true },
  { day: "Mon 19 Oct", time: "21:15", title: "Volunteers briefing", venue: "Room 2", booked: "38 / 40", status: "Published", today: true },
  { day: "Tue 20 Oct", time: "18:00", title: "Children's class", venue: "Library", booked: "54 / 80", status: "Published" },
  { day: "Thu 22 Oct", time: "20:30", title: "Committee meeting", venue: "Office", booked: "11 / 14", status: "Draft" },
  { day: "Fri 23 Oct", time: "13:00", title: "Community lunch", venue: "Courtyard", booked: "260 / 300", status: "Published" },
  { day: "Sat 24 Oct", time: "17:00", title: "Sports evening", venue: "Ground", booked: "—", status: "Needs venue" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "Needs venue") return <Badge variant="outline" className="border-destructive/50 text-destructive">{status}</Badge>;
  return <Badge variant={status === "Published" ? "secondary" : "outline"}>{status}</Badge>;
}

export function ModuleSidebar({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  return (
    <Sidebar collapsed={collapsed} className={className}>
      <ModuleSwitcher module="hoto" name="Hoto" collapsed={collapsed} />
      <NavGroup collapsed={collapsed}>
        <div className="h-2" />
        <NavItem collapsed={collapsed} icon={<CalendarDays />} label="Calendar" />
        <NavItem collapsed={collapsed} icon={<ListChecks />} label="Events" active badge={212} />
        <NavItem collapsed={collapsed} icon={<MapPin />} label="Venues" />
        <NavItem collapsed={collapsed} icon={<Users />} label="Volunteers" />
      </NavGroup>
      <NavGroup label="Data" collapsed={collapsed}>
        <NavItem collapsed={collapsed} icon={<Upload />} label="Imports" />
        <NavItem collapsed={collapsed} icon={<BarChart3 />} label="Attendance" />
      </NavGroup>
      <div className="mt-auto flex flex-col gap-1 border-t pt-2">
        <NavItem collapsed={collapsed} icon={<LayoutGrid />} label="All modules" />
        <UserChip collapsed={collapsed} {...USER} />
      </div>
    </Sidebar>
  );
}

export function ModuleDesktop() {
  return (
    <BrowserFrame url="hoto.daeratulaqeeq.org/events" label="Hoto · desktop">
      <div data-module="hoto" className="flex min-h-[600px] bg-background">
        <ModuleSidebar className="hidden md:flex" />
        <main className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-6">
          <PageHeader as="h3" title="Events" description="1448H calendar · 212 events" lead={<ModuleBadge module="hoto" size="lg" />}
            actions={<><Button variant="outline" size="sm"><Upload /> Import</Button><Button size="sm"><Plus /> New event</Button></>} />
          <Tabs defaultValue="up" className="gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <TabsList>
              <TabsTrigger value="up">Upcoming</TabsTrigger><TabsTrigger value="past">Past</TabsTrigger><TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <div className="relative ms-auto">
              <Search aria-hidden="true" className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Search events" placeholder="Search events" className="h-8 w-48 ps-8" />
            </div>
            <Button variant="outline" size="sm"><SlidersHorizontal /> Filter</Button>
          </div>
          <TabsContent value="up" className="overflow-x-auto rounded-lg border">
            <Table className="min-w-[640px]">
              <TableHeader><TableRow>
                <TableHead>When</TableHead><TableHead>Event</TableHead><TableHead>Venue</TableHead>
                <TableHead className="text-end">Booked</TableHead><TableHead>Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {EVENTS.map((e) => (
                  <TableRow key={e.title}>
                    <TableCell className="py-3 tabular-nums">
                      <span className="flex items-center gap-2">
                        <TodayDot on={e.today} />
                        <span className={e.today ? "font-medium" : "text-muted-foreground"}>{e.day}</span>
                        <span className="text-muted-foreground">{e.time}</span>
                        {e.today && <span className="sr-only">(today)</span>}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell className="text-muted-foreground">{e.venue}</TableCell>
                    <TableCell className="text-end tabular-nums">{e.booked}</TableCell>
                    <TableCell><StatusBadge status={e.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          </Tabs>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing 1–6 of 212</span>
            <span className="flex gap-1">
              <Button variant="outline" size="icon" className="size-8" aria-label="Previous page"><ChevronLeft className="rtl:rotate-180" /></Button>
              <Button variant="outline" size="icon" className="size-8" aria-label="Next page"><ChevronRight className="rtl:rotate-180" /></Button>
            </span>
          </div>
        </main>
      </div>
    </BrowserFrame>
  );
}

export function ModuleMobile() {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <Phone label="Hoto · phone list">
        <div data-module="hoto" className="flex h-full flex-col">
          <StatusBar />
          <MobileBar title="Events" initials="HK" lead={<ModuleBadge module="hoto" size="sm" />} />
          <div className="flex flex-col gap-3 p-3">
            <Tabs defaultValue="up" className="gap-3"><TabsList className="w-full">
              <TabsTrigger value="up">Upcoming</TabsTrigger><TabsTrigger value="past">Past</TabsTrigger><TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="up">
            <ul className="flex flex-col divide-y rounded-lg border bg-card">
              {EVENTS.slice(0, 5).map((e) => (
                <li key={e.title} className="flex items-center gap-3 px-3 py-2.5">
                  <TodayDot on={e.today} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{e.title}</span>
                    <span className="block text-xs text-muted-foreground tabular-nums">{e.day} · {e.time} · {e.venue}</span>
                  </span>
                  <Badge variant={e.status === "Published" ? "secondary" : "outline"}>{e.status === "Published" ? e.booked.split(" ")[0] : e.status}</Badge>
                </li>
              ))}
            </ul>
            </TabsContent>
            </Tabs>
          </div>
          <div className="mt-auto border-t p-3 pb-5"><Button className="w-full"><Plus /> New event</Button></div>
        </div>
      </Phone>
      <Phone label="Hoto · phone menu open">
        <div data-module="hoto" className="relative flex h-full flex-col">
          <StatusBar />
          <MobileBar title="Events" open initials="HK" lead={<ModuleBadge module="hoto" size="sm" />} />
          <div aria-hidden="true" className="flex flex-col gap-2 p-3 opacity-40">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 rounded-lg bg-muted" />)}
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 top-[86px] bottom-0 bg-foreground/30" />
          <ModuleSidebar className="absolute start-0 top-[86px] bottom-0 shadow-xl" />
        </div>
      </Phone>
    </div>
  );
}

/* ── gateway ────────────────────────────────────────────────────────────── */

export function GatewaySidebar({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  return (
    <Sidebar collapsed={collapsed} className={className}>
      {collapsed ? (
        <span title="Gateway" className="mx-auto grid size-8 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-foreground">G</span>
      ) : (
        <div className="flex flex-col px-2 pt-1 pb-3 leading-tight">
          <span className="font-semibold">Gateway</span>
          <span className="text-[11px] text-muted-foreground">Daeratul Aqeeq</span>
        </div>
      )}
      <NavGroup collapsed={collapsed}>
        {collapsed && <div className="h-2" />}
        <NavItem collapsed={collapsed} icon={<House />} label="Home" active />
        <NavItem collapsed={collapsed} icon={<Inbox />} label="Inbox" badge={4} />
        <NavItem collapsed={collapsed} icon={<BookUser />} label="Directory" />
        <NavItem collapsed={collapsed} icon={<ScrollText />} label="Audit log" />
      </NavGroup>
      <NavGroup label="Modules" collapsed={collapsed}>
        {MODULES.map((m) => <NavItem key={m.key} collapsed={collapsed} icon={<m.icon />} label={m.name} />)}
      </NavGroup>
      <div className="mt-auto border-t pt-2"><UserChip collapsed={collapsed} {...USER} /></div>
    </Sidebar>
  );
}

export function GatewaySignIn() {
  return (
    <BrowserFrame url="gateway.daeratulaqeeq.org/sign-in" label="Gateway · sign in">
      <div className="grid min-h-[540px] bg-background md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden border-e bg-card p-10 md:flex">
          <Bloom size={420} placement="bottom-end" crop={0.38} />
          <Wordmark withMark={false} className="relative" />
          <div className="relative flex max-w-[16rem] flex-col gap-6">
            <PageHeader as="h2" size="lg" title="One sign-in for every module." />
            <div className="flex items-center gap-2">
              {MODULES.map((m) => <ModuleBadge key={m.key} module={m.key} />)}
              <span className="text-sm text-muted-foreground">3 modules</span>
            </div>
          </div>
          <p className="relative max-w-[14rem] text-xs text-muted-foreground">Staff only. Members sign in through the member app.</p>
        </div>
        <div className="flex items-center justify-center p-6 md:p-10">
          <form className="flex w-full max-w-sm flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <span className="md:hidden"><Mark size={36} /></span>
            <PageHeader as="h3" title="Sign in" description="Use your ITS number and staff password." />
            <div className="grid gap-2"><Label htmlFor="g-its">ITS number</Label><Input id="g-its" inputMode="numeric" defaultValue="30411786" /></div>
            <div className="grid gap-2">
              <div className="flex justify-between"><Label htmlFor="g-pw">Password</Label><a href="#" className="text-sm text-muted-foreground underline underline-offset-4">Forgot?</a></div>
              <Input id="g-pw" type="password" defaultValue="correct-horse" />
            </div>
            <Button type="submit" className="w-full">Sign in</Button>
            <div aria-hidden="true" className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            <Button type="button" variant="outline" className="w-full"><Mail /> Email me a one-time code</Button>
          </form>
        </div>
      </div>
    </BrowserFrame>
  );
}

const ATTENTION: [ModuleEntry["key"], string, string][] = [
  ["registration", "31 registrations awaiting review", "Oldest waiting 2 days"],
  ["access", "2 role requests from Karachi", "Steward access to Registration"],
  ["hoto", "Sports evening has no venue", "Saturday 24 October, 17:00"],
];

export function ModuleCard({ module, stat }: { module: ModuleEntry; stat: string }) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4">
        <span className="mb-1"><ModuleBadge module={module.key} size="lg" /></span>
        <CardTitle>{module.name}</CardTitle>
        <CardDescription>{module.blurb}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-4 pt-1 text-sm">
        <span className="text-muted-foreground tabular-nums">{stat}</span>
        <a href="#" className="flex items-center gap-1 font-medium text-primary">Open<span className="sr-only"> {module.name}</span> <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" /></a>
      </CardContent>
    </Card>
  );
}

export function GatewayHome() {
  return (
    <BrowserFrame url="gateway.daeratulaqeeq.org" label="Gateway · home">
      <div className="flex min-h-[560px] bg-background">
        <GatewaySidebar className="hidden md:flex" />
        <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">
          <PageHeader as="h3" size="lg" eyebrow="Monday 19 October" title="Salaam, Husain"
            actions={<Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>} />
          <div className="grid gap-3 sm:grid-cols-3">
            {MODULES.map((m, i) => <ModuleCard key={m.key} module={m} stat={["5 roles", "212 events", "214 / 300"][i]} />)}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Needs your attention</h4>
            <ul className="flex flex-col divide-y rounded-lg border bg-card">
              {ATTENTION.map(([k, t, s]) => (
                <li key={t} className="flex items-center gap-3 px-4 py-3">
                  <ModuleBadge module={k} />
                  <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{t}</span><span className="block text-xs text-muted-foreground">{s}</span></span>
                  <Button variant="outline" size="sm">Review<span className="sr-only">: {t}</span></Button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </BrowserFrame>
  );
}

const GATEWAY_TABS: Tab[] = [
  { key: "home", icon: House, label: "Home" }, { key: "inbox", icon: Inbox, label: "Inbox" },
  { key: "modules", icon: LayoutGrid, label: "Modules" }, { key: "me", icon: User, label: "Me" },
];

export function GatewayMobile() {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <Phone label="Gateway · phone home">
        <div className="relative overflow-hidden border-b">
          <Bloom size={168} placement="bottom-end" crop={0.5} />
          <StatusBar />
          <div className="relative px-4 pt-6 pb-4"><PageHeader as="h3" eyebrow="Monday 19 October" title="Salaam, Husain" /></div>
        </div>
        <div className="flex flex-col gap-4 px-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {MODULES.map((m, i) => (
              <a key={m.key} href="#" className="flex flex-col gap-2 rounded-xl border bg-card p-3">
                <ModuleBadge module={m.key} />
                <span className="text-sm font-medium leading-tight">{m.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{["5 roles", "212 events", "31 to review"][i]}</span>
              </a>
            ))}
            <a href="#" className="flex flex-col items-start justify-center gap-1 rounded-xl border border-dashed p-3 text-xs text-muted-foreground"><Plus aria-hidden="true" className="size-4" />Request a module</a>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium">Needs your attention</p>
            {ATTENTION.slice(0, 2).map(([k, t]) => (
              <a key={t} href="#" className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs">
                <ModuleBadge module={k} size="sm" /><span className="flex-1">{t}</span><ChevronRight aria-hidden="true" className="size-4 text-muted-foreground rtl:rotate-180" />
              </a>
            ))}
          </div>
        </div>
        <BottomNav tabs={GATEWAY_TABS} active="home" />
      </Phone>
      <Phone label="Gateway · phone sign in">
        <div className="relative overflow-hidden border-b bg-card pb-6">
          <Bloom size={184} placement="bottom-end" crop={0.5} />
          <StatusBar />
          <Wordmark layout="stacked" withMark={false} subtitle="Staff gateway" className="relative px-6 pt-12" />
        </div>
        <form className="flex flex-1 flex-col gap-4 p-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2"><Label htmlFor="gm-its">ITS number</Label><Input id="gm-its" inputMode="numeric" defaultValue="30411786" /></div>
          <div className="grid gap-2"><Label htmlFor="gm-pw">Password</Label><Input id="gm-pw" type="password" defaultValue="correct-horse" /></div>
          <Button type="submit" className="w-full">Sign in</Button>
          <Button type="button" variant="outline" className="w-full"><Fingerprint /> Use device passkey</Button>
          <p className="mt-auto text-center text-xs text-muted-foreground">Members: use the member app instead.</p>
        </form>
      </Phone>
    </div>
  );
}

/* ── member app ─────────────────────────────────────────────────────────── */

function MemberTop() {
  return (
    <div className="relative overflow-hidden bg-card pb-12">
      <Bloom size={184} placement="bottom-end" crop={0.5} />
      <StatusBar />
      <Wordmark layout="stacked" withMark={false} className="relative px-6 pt-12"
        subtitle={<span lang="ar" dir="rtl" className="text-xl">أهلاً وسهلاً</span>} />
    </div>
  );
}

const MEMBER_TABS: Tab[] = [
  { key: "home", icon: House, label: "Home" }, { key: "schedule", icon: CalendarDays, label: "Schedule" },
  { key: "pass", icon: Ticket, label: "Pass" }, { key: "me", icon: User, label: "Me" },
];

export function MemberViews() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <Phone label="Member · enter ITS">
        <MemberTop />
        <form className="relative -mt-5 flex flex-1 flex-col gap-4 rounded-t-3xl bg-background p-6" onSubmit={(e) => e.preventDefault()}>
          <PageHeader as="h3" title="Sign in" />
          <div className="grid gap-2">
            <Label htmlFor="m-its">ITS number</Label>
            <Input id="m-its" inputMode="numeric" defaultValue="40217753" aria-describedby="m-its-hint" className="h-11 text-base tracking-wider tabular-nums" />
            <p id="m-its-hint" className="text-xs text-muted-foreground">8 digits, printed on your ITS card.</p>
          </div>
          <Button type="submit" size="lg" className="w-full">Send code</Button>
          <p className="text-xs text-muted-foreground">We'll text a 6-digit code to the mobile number on your ITS record.</p>
          <p className="mt-auto text-center text-sm text-muted-foreground">Trouble signing in? <a href="#" className="font-medium text-primary underline underline-offset-4">Get help</a></p>
        </form>
      </Phone>
      <Phone label="Member · enter code">
        <StatusBar />
        <div className="flex items-center px-3 py-1"><Button variant="ghost" size="icon" aria-label="Back"><ArrowLeft className="rtl:rotate-180" /></Button></div>
        <div className="flex flex-1 flex-col gap-5 px-6 pt-2">
          <Mark size={36} />
          <PageHeader as="h3" title="Enter your code" description="Sent to +91 ••••• •4821" />
          <div className="flex gap-2" role="group" aria-label="6-digit code">
            {["4", "8", "1", "2", "", ""].map((d, i) => (
              <span key={i} className={cn("grid h-12 flex-1 place-items-center rounded-md border bg-card text-xl font-medium tabular-nums",
                i === 4 ? "border-ring ring-[3px] ring-ring/30" : "border-input")}>{d}</span>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock aria-hidden="true" className="size-4" /> Resend in 0:24</p>
          <Button size="lg" className="mt-auto mb-8 w-full" disabled>Verify</Button>
        </div>
      </Phone>
      <Phone label="Member · error">
        <MemberTop />
        <form className="relative -mt-5 flex flex-1 flex-col gap-4 rounded-t-3xl bg-background p-6" onSubmit={(e) => e.preventDefault()}>
          <PageHeader as="h3" title="Sign in" />
          <div className="grid gap-2">
            <Label htmlFor="m-its-e">ITS number</Label>
            <Input id="m-its-e" inputMode="numeric" defaultValue="4021775" aria-invalid="true" aria-describedby="m-its-e-err" className="h-11 text-base tracking-wider tabular-nums" />
            <p id="m-its-e-err" className="flex items-start gap-1.5 text-sm text-destructive"><CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> That's 7 digits. ITS numbers have 8. Check the number on your card.</p>
          </div>
          <Button type="submit" size="lg" className="w-full">Send code</Button>
        </form>
      </Phone>
      <Phone label="Member · home">
        <StatusBar />
        <div className="flex flex-1 flex-col gap-4 overflow-hidden px-5 pt-3">
          <div className="flex items-start justify-between">
            <PageHeader as="h3" eyebrow={<span lang="ar" dir="rtl">السلام عليكم</span>} title="Fatema" />
            <Button variant="ghost" size="icon" aria-label="Messages"><Bell /></Button>
          </div>
          <Card className="gap-3 py-4">
            <CardHeader className="px-4">
              <div className="flex items-center justify-between"><CardTitle className="text-sm">Your registration</CardTitle><Badge variant="secondary">In review</Badge></div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-4">
              <ol className="grid grid-cols-3 gap-1 text-[11px]">
                {([["Submitted", "done"], ["In review", "now"], ["Pass issued", "next"]] as const).map(([s, state]) => (
                  <li key={s} className="flex flex-col gap-1.5">
                    <span className={cn("h-1 rounded-full", state === "done" ? "bg-primary" : state === "now" ? "bg-primary/40" : "bg-muted")} />
                    <span className={state === "next" ? "text-muted-foreground" : "text-foreground"}>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-muted-foreground">We'll message you when your pass is ready.</p>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Up next</p>
            <DateRow day="Mon" date="19" title="Evening majlis" meta="19:30 · Main hall" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Services</p>
            <div className="grid grid-cols-3 gap-2">
              {([["hoto", "Schedule"], ["registration", "Family"], ["access", "Account"]] as const).map(([k, label]) => (
                <a key={k} href="#" className="flex flex-col items-center gap-2 rounded-xl border bg-card px-2 py-3 text-xs">
                  <ModuleBadge module={k} />{label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <BottomNav tabs={MEMBER_TABS} active="home" />
      </Phone>
    </div>
  );
}

/* ── nav states ─────────────────────────────────────────────────────────── */

export function NavStates() {
  const items: [string, React.ReactNode][] = [
    ["Module · expanded", <ModuleSidebar key="a" />],
    ["Module · rail", <ModuleSidebar key="b" collapsed />],
    ["Gateway · expanded", <GatewaySidebar key="c" />],
    ["Gateway · rail", <GatewaySidebar key="d" collapsed />],
  ];
  return (
    <div className="flex flex-wrap items-start gap-6">
      {items.map(([label, el]) => (
        <figure key={label} className="flex flex-col gap-2">
          <div data-module="hoto" className="flex h-[460px] overflow-hidden rounded-xl border bg-background">{el}</div>
          <figcaption className="text-sm text-muted-foreground">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ── the mark ───────────────────────────────────────────────────────────── */

export function MarkForms() {
  const forms: [string, React.ReactNode][] = [
    ["Full colour", <Mark key="1" size={96} />],
    ["Inner layer", <Mark key="2" size={96} variant="inner" />],
    ["Grayscale", <Mark key="3" size={96} tone="grayscale" />],
    ["Grayscale, inner", <Mark key="4" size={96} variant="inner" tone="grayscale" />],
  ];
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {forms.map(([label, el]) => (
          <figure key={label} className="flex flex-col items-center gap-3 rounded-xl border bg-background p-5">
            {el}
            <figcaption className="text-center text-sm">{label}</figcaption>
          </figure>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-xl border bg-background p-5 text-sm">
        <p className="font-semibold">Never</p>
        <ul className="flex flex-col gap-1.5 text-muted-foreground">
          {["Recolour any layer, or tint it to a module hue", "Invert it, or swap the layer colours", "Outline it, or redraw petals as a pattern", "Fade it with opacity or blend modes", "Use any petal on its own as a marker"].map((t) => (
            <li key={t} className="flex gap-2"><X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />{t}</li>
          ))}
        </ul>
        <p className="mt-auto pt-2 text-xs text-muted-foreground">Enforced by &lt;Mark /&gt;'s props, lint and an end-to-end test that reads the colours of every rendered mark.</p>
      </div>
    </div>
  );
}

/* ── component kit ──────────────────────────────────────────────────────── */

function KitCard({ title, note, className, children }: { title: string; note?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-4 rounded-xl border bg-background p-5", className)}>
      <div><h3 className="font-semibold">{title}</h3>{note && <p className="text-sm text-muted-foreground">{note}</p>}</div>
      {children}
    </div>
  );
}

export function Kit() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <KitCard title="Page titles" note="Cormorant via PageHeader only; everything under it is system sans.">
        <PageHeader as="h4" size="lg" eyebrow="Monday 19 October" title="Salaam, Husain" />
        <div data-module="hoto"><PageHeader as="h4" title="Events" description="1448H calendar · 212 events" lead={<ModuleBadge module="hoto" size="lg" />} /></div>
        <div><h4 className="text-base font-semibold">Section heading</h4><p className="text-sm text-muted-foreground">Card and section titles stay in the system font.</p></div>
      </KitCard>

      <KitCard title="Buttons" note="Only the default button carries the brand colour.">
        <div className="flex flex-wrap gap-2"><Button>Save</Button><Button variant="outline">Cancel</Button><Button variant="secondary">Draft</Button><Button variant="ghost">More</Button></div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline"><Download /> Export</Button>
          <Button size="sm" variant="secondary" disabled><Loader2 className="animate-spin" /> Saving…</Button>
          <Button size="icon" variant="outline" aria-label="Delete"><Trash2 /></Button>
        </div>
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="destructive"><Trash2 /> Delete event</Button><Button size="sm" variant="link">View all</Button></div>
      </KitCard>

      <KitCard title="Badges and modules">
        <div className="flex flex-wrap gap-1.5">
          <Badge>1448H</Badge><Badge variant="secondary">Published</Badge><Badge variant="outline">Draft</Badge><StatusBadge status="Needs venue" />
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {MODULES.map((m) => <span key={m.key} className="flex items-center gap-1.5"><ModuleBadge module={m.key} size="sm" />{m.name}</span>)}
        </div>
        <p className="text-xs text-muted-foreground">A module is an icon on its hue at 15%. Never the flower.</p>
      </KitCard>

      <KitCard title="Form fields" note="Errors are clay, with an icon and words.">
        <div className="grid gap-1.5"><Label htmlFor="k-its">ITS number</Label><Input id="k-its" defaultValue="30411786" aria-describedby="k-its-h" /><p id="k-its-h" className="text-xs text-muted-foreground">8 digits</p></div>
        <div className="grid gap-1.5">
          <Label htmlFor="k-mob">Mobile</Label><Input id="k-mob" defaultValue="98201" aria-invalid="true" aria-describedby="k-mob-e" />
          <p id="k-mob-e" className="flex items-center gap-1.5 text-xs text-destructive"><CircleAlert aria-hidden="true" className="size-3.5" /> Enter all 10 digits</p>
        </div>
        <div className="grid gap-1.5"><Label htmlFor="k-dis">Jamiat</Label><Input id="k-dis" defaultValue="Mumbai" disabled /></div>
      </KitCard>

      <KitCard title="Choices">
        <div className="grid gap-1.5">
          <Label htmlFor="k-venue">Venue</Label>
          <button id="k-venue" type="button" className="flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs">Main hall <ChevronDown aria-hidden="true" className="size-4 opacity-60" /></button>
        </div>
        <div className="flex items-center gap-3"><Switch id="k-sw" defaultChecked /><Label htmlFor="k-sw">Send SMS reminders</Label></div>
        <div className="flex items-center gap-3"><Checkbox id="k-cb" defaultChecked /><Label htmlFor="k-cb">Open to families</Label></div>
        <div className="flex items-center gap-3"><Checkbox id="k-cb2" /><Label htmlFor="k-cb2">Requires a pass</Label></div>
      </KitCard>

      <KitCard title="Tabs">
        <Tabs defaultValue="up">
          <TabsList><TabsTrigger value="up">Upcoming</TabsTrigger><TabsTrigger value="past">Past</TabsTrigger><TabsTrigger value="draft">Drafts</TabsTrigger></TabsList>
          <TabsContent value="up" className="text-sm text-muted-foreground">6 upcoming events</TabsContent>
          <TabsContent value="past" className="text-sm text-muted-foreground">148 past events</TabsContent>
          <TabsContent value="draft" className="text-sm text-muted-foreground">2 drafts</TabsContent>
        </Tabs>
        <Tabs defaultValue="a">
          <TabsList className="w-full"><TabsTrigger value="a"><ListChecks /> List</TabsTrigger><TabsTrigger value="b"><CalendarDays /> Calendar</TabsTrigger></TabsList>
          <TabsContent value="a" className="text-sm text-muted-foreground">Shown as a list</TabsContent>
          <TabsContent value="b" className="text-sm text-muted-foreground">Shown as a calendar</TabsContent>
        </Tabs>
      </KitCard>

      <KitCard title="Notices" className="lg:col-span-2">
        <div className="grid gap-2 sm:grid-cols-2">
          {([
            [Info, "text-muted-foreground", "Registration closes 12 November.", "86 places left."],
            [CheckCircle2, "text-success", "Schedule imported.", "212 events added."],
            [TriangleAlert, "text-warning", "2 events have no venue.", "Assign one before publishing."],
            [CircleAlert, "text-destructive", "Import failed on row 14.", "The date is not in the 1448H calendar."],
          ] as const).map(([Icon, tone, a, b]) => (
            <div key={a} className="flex gap-2.5 rounded-lg border bg-card p-3 text-sm">
              <Icon aria-hidden="true" className={cn("mt-0.5 size-4 shrink-0", tone)} />
              <span><span className="font-medium">{a}</span> <span className="text-muted-foreground">{b}</span></span>
            </div>
          ))}
        </div>
        <div role="status" className="flex items-center gap-2.5 rounded-lg bg-foreground p-3 text-sm text-background shadow-md sm:w-80">
          <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" /><span className="flex-1">Event published</span>
          <a href="#" className="text-xs underline underline-offset-4">Undo</a>
        </div>
      </KitCard>

      <KitCard title="Stat tiles">
        <div className="grid grid-cols-3 gap-2">
          {[["Registered", "214"], ["To review", "31"], ["Places left", "86"]].map(([k, v]) => (
            <div key={k} className="rounded-lg border bg-card p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="text-3xl font-semibold tabular-nums">{v}</p></div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm"><span>Places taken</span><span className="tabular-nums text-muted-foreground">214 / 300</span></div>
          <div role="progressbar" aria-label="Places taken" aria-valuenow={214} aria-valuemin={0} aria-valuemax={300} className="h-2 rounded-full bg-muted"><div className="h-full w-[71%] rounded-full bg-primary" /></div>
        </div>
      </KitCard>

      <KitCard title="Table" note="Compact rows; a dot in the module hue marks today." className="lg:col-span-2">
        <div data-module="hoto" className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[520px]">
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Event</TableHead><TableHead className="text-end">Booked</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {EVENTS.slice(0, 4).map((e) => (
                <TableRow key={e.title}>
                  <TableCell className="tabular-nums"><span className="flex items-center gap-2"><TodayDot on={e.today} />{e.day} <span className="text-muted-foreground">{e.time}</span></span></TableCell>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell className="text-end tabular-nums">{e.booked}</TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </KitCard>

      <KitCard title="List rows" note="Staff lists are compact; member lists lead with a date tile.">
        <ul className="flex flex-col divide-y rounded-lg border bg-card">
          {EVENTS.slice(0, 2).map((e) => (
            <li key={e.title} className="flex items-center gap-3 px-3 py-2">
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{e.title}</span><span className="block text-xs text-muted-foreground tabular-nums">{e.day} · {e.time}</span></span>
              <StatusBadge status={e.status} />
            </li>
          ))}
        </ul>
        <DateRow day="Thu" date="22" title="Committee meeting" meta="20:30 · Office" trailing={<Badge variant="outline">Going</Badge>} />
      </KitCard>

      <KitCard title="Module card"><ModuleCard module={moduleByKey("registration")} stat="214 / 300" /></KitCard>

      <KitCard title="Empty state" note="The inner mark in grayscale.">
        <EmptyState title="No events on Sunday" description="Add one, or copy last week's plan." action={<Button size="sm"><Plus /> Add event</Button>} />
      </KitCard>

      <KitCard title="Dialog">
        <div className="rounded-lg bg-foreground/25 p-4">
          <div role="dialog" aria-labelledby="k-dlg-t" aria-describedby="k-dlg-d" className="flex flex-col gap-4 rounded-lg border bg-background p-5 shadow-lg">
            <div>
              <h4 id="k-dlg-t" className="text-lg font-semibold">Delete this event?</h4>
              <p id="k-dlg-d" className="text-sm text-muted-foreground">Evening majlis on Monday 19 October. 412 bookings will be cancelled and members told by SMS.</p>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" size="sm">Keep event</Button><Button variant="destructive" size="sm">Delete event</Button></div>
          </div>
        </div>
      </KitCard>

      <KitCard title="Mobile bars" note="Top bar for staff apps; tabs for the gateway and member app.">
        <div className="overflow-hidden rounded-lg border bg-background">
          <div data-module="hoto"><MobileBar title="Events" initials="HK" lead={<ModuleBadge module="hoto" size="sm" />} /></div>
          <div className="h-6" />
          <BottomNav tabs={MEMBER_TABS} active="home" />
        </div>
      </KitCard>
    </div>
  );
}
