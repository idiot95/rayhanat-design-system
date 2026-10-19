import type * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleBadge } from "@/components/brand/module-badge";
import type { ModuleKey } from "@/components/brand/modules";

/*
 * Sidebar parts. No flower, no petals: the active item is a tinted fill.
 * Modules appear as their lucide icon (in lists) or ModuleBadge (switcher).
 */
export function Sidebar({ collapsed, className, children }: { collapsed?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <aside className={cn("flex flex-col gap-1 border-e bg-card p-3", collapsed ? "w-16" : "w-[236px]", className)}>
      {children}
    </aside>
  );
}

export function NavGroup({ label, collapsed, children }: { label?: string; collapsed?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && !collapsed && <p className="px-2 pt-3 pb-1 text-xs text-muted-foreground">{label}</p>}
      {label && collapsed && <span aria-hidden="true" className="mx-auto my-2 h-px w-6 bg-border" />}
      {children}
    </div>
  );
}

export function NavItem({
  icon,
  label,
  href = "#",
  active,
  collapsed,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: number;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex shrink-0 items-center gap-2.5 rounded-md py-1.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:size-4 [&>svg]:shrink-0",
        collapsed ? "justify-center px-0 py-2" : "px-2",
        active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
      )}
    >
      {icon}
      {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
      {!collapsed && badge != null && <span className="rounded-full bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground">{badge}</span>}
    </a>
  );
}

/** Top of a module's sidebar: which module you are in, and the way back to the gateway. */
export function ModuleSwitcher({ module, name, collapsed }: { module: ModuleKey; name: string; collapsed?: boolean }) {
  return (
    <button
      type="button"
      aria-label={collapsed ? `${name}: switch module` : undefined}
      className={cn("flex items-center gap-2 rounded-md border bg-background py-1.5 text-start text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", collapsed ? "justify-center px-1.5" : "px-2")}
    >
      <ModuleBadge module={module} />
      {!collapsed && (
        <>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-[11px] text-muted-foreground">Daeratul Aqeeq</span>
          </span>
          <ChevronsUpDown aria-hidden="true" className="size-3.5 text-muted-foreground" />
        </>
      )}
    </button>
  );
}

export function UserChip({ name, its, collapsed }: { name: string; its: string; collapsed?: boolean }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span className={cn("flex items-center gap-2 rounded-md py-1.5", collapsed ? "justify-center" : "px-2")}>
      <span aria-hidden={collapsed ? undefined : true} title={collapsed ? name : undefined}
        className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">{initials}</span>
      {!collapsed && (
        <span className="flex min-w-0 flex-col text-xs leading-tight">
          <span className="truncate font-medium">{name}</span>
          <span className="text-muted-foreground tabular-nums">ITS {its}</span>
        </span>
      )}
    </span>
  );
}
