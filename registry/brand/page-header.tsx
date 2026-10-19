import type * as React from "react";
import { cn } from "@/lib/utils";

/*
 * The page title. The only component (with Wordmark) allowed to use the
 * display face, so Cormorant stays on titles and nowhere else.
 */
export function PageHeader({
  title,
  eyebrow,
  description,
  lead,
  actions,
  size = "md",
  as: Tag = "h1",
}: {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** A ModuleBadge, inside a module. */
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  size?: "md" | "lg";
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        {lead}
        <div>
          {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
          <Tag className={cn("font-display leading-tight font-semibold", size === "lg" ? "text-4xl" : "text-3xl")}>{title}</Tag>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
