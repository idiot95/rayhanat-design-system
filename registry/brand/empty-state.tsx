import type * as React from "react";
import { Mark } from "@/components/brand/mark";

/** Empty lists: the inner mark in grey, a sentence, one action. */
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-muted"><Mark variant="inner" tone="grayscale" size={28} /></span>
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
