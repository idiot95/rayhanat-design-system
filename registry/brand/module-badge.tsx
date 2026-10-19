import { cn } from "@/lib/utils";
import { moduleByKey, type ModuleKey } from "@/components/brand/modules";

/** A module's icon on a square tinted with its hue. One of the three places a module hue may appear. */
export function ModuleBadge({ module, size = "md" }: { module: ModuleKey; size?: "sm" | "md" | "lg" }) {
  const { icon: Icon } = moduleByKey(module);
  return (
    <span
      data-module={module}
      className={cn(
        "grid shrink-0 place-items-center rounded-md bg-module/15 text-module",
        size === "sm" && "size-6 [&>svg]:size-3.5",
        size === "md" && "size-7 [&>svg]:size-4",
        size === "lg" && "size-10 [&>svg]:size-5"
      )}
    >
      <Icon aria-hidden="true" />
    </span>
  );
}

/** The dot that marks today in a module's lists. The second place a module hue may appear. */
export function TodayDot({ on = true }: { on?: boolean }) {
  return <span aria-hidden="true" className={cn("inline-block size-1.5 shrink-0 rounded-full", on ? "bg-module" : "bg-transparent")} />;
}
