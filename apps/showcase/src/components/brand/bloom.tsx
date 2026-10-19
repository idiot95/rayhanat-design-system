import type * as React from "react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/mark";

/*
 * The flower at scale, cropped by the edge of its container: it blooms in from
 * a corner or an edge instead of sitting in a box like an icon. The mark itself
 * is untouched (no recolour, no fade); only its size and position change.
 *
 * The parent must be `relative overflow-hidden`. Keep text clear of the flower:
 * it is decoration, never a background for words. On phones, never place it
 * at the top of the screen: the status bar (time, signal, battery) lives there.
 * Use a bottom placement on the header band instead.
 */
type Placement = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "top" | "bottom";

export function Bloom({
  size,
  placement,
  crop = 0.4,
  tone = "colour",
  className,
}: {
  /** Diameter of the whole flower in px, before cropping. 96 and up. */
  size: number;
  placement: Placement;
  /** Share of the flower hidden past each cropping edge, 0–0.6. */
  crop?: number;
  tone?: "colour" | "grayscale";
  className?: string;
}) {
  const offset = -Math.round(size * Math.min(Math.max(crop, 0), 0.6));
  const style: React.CSSProperties = {};
  if (placement.startsWith("top")) style.top = offset;
  if (placement.startsWith("bottom")) style.bottom = offset;
  if (placement.endsWith("start")) style.insetInlineStart = offset;
  if (placement.endsWith("end")) style.insetInlineEnd = offset;
  if (placement === "top" || placement === "bottom") {
    style.insetInlineStart = "50%";
    style.translate = "-50% 0";
  }
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute flex", className)} style={style}>
      <Mark size={size} tone={tone} />
    </span>
  );
}
