import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mobile top bar: menu, where you are, who you are. */
export function MobileBar({ title, lead, open, initials }: { title: string; lead?: React.ReactNode; open?: boolean; initials: string }) {
  return (
    <div className="flex items-center gap-2 border-b bg-background px-3 py-2">
      <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open ?? false}
        className="grid size-9 place-items-center rounded-md outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>
      {lead}
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</span>
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-secondary text-[11px] font-medium text-secondary-foreground">{initials}</span>
    </div>
  );
}

export type Tab = { key: string; icon: LucideIcon; label: string; href?: string };

/** Bottom tabs for the gateway and member apps. Active is the primary colour: no petal. */
export function BottomNav({ tabs, active }: { tabs: Tab[]; active: string }) {
  return (
    <nav aria-label="Tabs" className="mt-auto grid border-t bg-card px-2 pt-1.5 pb-4" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
      {tabs.map(({ key, icon: Icon, label, href = "#" }) => (
        <a key={key} href={href} aria-current={active === key ? "page" : undefined}
          className={cn("flex flex-col items-center gap-0.5 rounded-md py-1 text-[11px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            active === key ? "font-medium text-primary" : "text-muted-foreground")}>
          <Icon aria-hidden="true" className="size-5" />{label}
        </a>
      ))}
    </nav>
  );
}
