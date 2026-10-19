import type * as React from "react";
import { Clock } from "lucide-react";

/** A list row that leads with the day and date. Member-facing lists use this. */
export function DateRow({ day, date, title, meta, trailing }: { day: string; date: string; title: string; meta: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <div className="flex w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-accent py-1.5 text-accent-foreground">
        <span className="text-[10px] font-semibold uppercase">{day}</span>
        <span className="text-2xl leading-none font-semibold tabular-nums">{date}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock aria-hidden="true" className="size-3" /> {meta}</p>
      </div>
      {trailing}
    </div>
  );
}
