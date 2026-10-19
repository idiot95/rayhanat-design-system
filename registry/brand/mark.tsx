/*
 * The al-Rayhaanat flower (V2). The ONLY file that may contain its shape or its
 * colours. Four forms are allowed and nothing else:
 *
 *   <Mark />                                   full colour
 *   <Mark variant="inner" />                   outer sand layer removed
 *   <Mark tone="grayscale" />                  full, in grey
 *   <Mark variant="inner" tone="grayscale" />  inner, in grey
 *
 * Below 32px the outer sand layer is dropped automatically: at that size the
 * pale petals blur into a halo around the flower instead of reading as petals.
 *
 * Recolouring, inverting, tinting, outlining or re-drawing the flower is not
 * allowed. There is deliberately no className, style or colour prop, lint
 * rejects filters on it, and the e2e suite checks every rendered mark.
 */
const SAND = "#f5ecdf";
const ROSE = "#dd8a8d";
const CRIMSON = "#e72350";

const OUTER = [
  "M1000.05,1815.32s380.76-310.64,0-659.49c-380.76,348.84,0,659.49,0,659.49Z",
  "M444.6,1585.24s488.89,49.58,466.33-466.33c-515.91-22.57-466.33,466.33-466.33,466.33Z",
  "M214.53,1029.79s310.64,380.76,659.49,0c-348.84-380.76-659.49,0-659.49,0Z",
  "M444.6,474.34s-49.58,488.89,466.33,466.33c22.57-515.91-466.33-466.33-466.33-466.33Z",
  "M1000.05,244.26s-380.76,310.64,0,659.49c380.76-348.84,0-659.49,0-659.49Z",
  "M1555.5,474.34s-488.89-49.58-466.33,466.33c515.91,22.57,466.33-466.33,466.33-466.33Z",
  "M1785.58,1029.79s-310.64-380.76-659.49,0c348.84,380.76,659.49,0,659.49,0Z",
  "M1555.5,1585.24s49.58-488.89-466.33-466.33c-22.57,515.91,466.33,466.33,466.33,466.33Z",
];
const INNER = [
  "M1000.05,1618.61s255.26-241.41,0-514.15c-255.26,272.74,0,514.15,0,514.15Z",
  "M583.69,1446.15s351.2,9.8,363.56-363.56c-373.36,12.36-363.56,363.56-363.56,363.56Z",
  "M411.23,1029.79s241.41,255.26,514.15,0c-272.74-255.26-514.15,0-514.15,0Z",
  "M583.69,613.43s-9.8,351.2,363.56,363.56c-12.36-373.36-363.56-363.56-363.56-363.56Z",
  "M1000.05,440.97s-255.26,241.41,0,514.15c255.26-272.74,0-514.15,0-514.15Z",
  "M1416.41,613.43s-351.2-9.8-363.56,363.56c373.36-12.36,363.56-363.56,363.56-363.56Z",
  "M1588.87,1029.79s-241.41-255.26-514.15,0c272.74,255.26,514.15,0,514.15,0Z",
  "M1416.41,1446.15s9.8-351.2-363.56-363.56c12.36,373.36,363.56,363.56,363.56,363.56Z",
];

export type MarkProps = {
  /** Rendered width and height in px. */
  size?: number;
  /** "full" keeps all three layers; "inner" drops the outer sand petals. Below 32px it is always "inner". */
  variant?: "full" | "inner";
  /** "colour" is the brand palette; "grayscale" is the only permitted alternative. */
  tone?: "colour" | "grayscale";
  /** Accessible name. Omit when the mark is decorative (the usual case). */
  title?: string;
};

export const FULL_MARK_MIN_SIZE = 32;

export function Mark({ size = 24, variant: requested = "full", tone = "colour", title }: MarkProps) {
  const variant = size < FULL_MARK_MIN_SIZE ? "inner" : requested;
  const viewBox = variant === "full" ? "205 235 1590 1590" : "405 435 1190 1190";
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      data-brand-mark=""
      data-variant={variant}
      data-tone={tone}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={tone === "grayscale" ? { filter: "grayscale(1)" } : undefined}
      className="shrink-0"
    >
      {variant === "full" && OUTER.map((d) => <path key={d} d={d} fill={SAND} />)}
      {INNER.map((d) => <path key={d} d={d} fill={ROSE} />)}
      <circle cx="1000.05" cy="1029.79" r="212.56" fill={CRIMSON} />
    </svg>
  );
}
