import type * as React from "react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/mark";

/**
 * The flower with the name. "inline" for headers and sidebars; "stacked" for
 * sign-in screens, with an optional line underneath (a welcome, a product name).
 */
export function Wordmark({
  size = 24,
  layout = "inline",
  subtitle,
  withMark = true,
  className,
}: {
  size?: number;
  layout?: "inline" | "stacked";
  subtitle?: React.ReactNode;
  /** Set false when a <Bloom /> already carries the flower on the same surface. */
  withMark?: boolean;
  className?: string;
}) {
  if (layout === "stacked") {
    return (
      <div className={cn("flex flex-col items-start gap-2", className)}>
        {withMark && <Mark size={size} />}
        <span className="font-display text-3xl leading-tight font-semibold">Daeratul Aqeeq</span>
        {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
      </div>
    );
  }
  return (
    <span className={cn("flex items-center gap-2", className)}>
      {withMark && <Mark size={size} />}
      <span className="font-display text-lg leading-none font-semibold">Daeratul Aqeeq</span>
    </span>
  );
}
