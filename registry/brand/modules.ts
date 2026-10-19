import type { LucideIcon } from "lucide-react";
import { CalendarDays, ShieldCheck, UserPlus } from "lucide-react";

/*
 * The module manifest. One entry per module; the gateway lists these and each
 * module's sidebar uses its own. A module's colour comes from its hue slot in
 * theme.css ([data-module="key"]), never from here.
 */
export type ModuleKey = "access" | "hoto" | "registration";

export type ModuleEntry = {
  key: ModuleKey;
  name: string;
  /** A lucide icon. Modules are never represented by the flower. */
  icon: LucideIcon;
  blurb: string;
  href: string;
};

export const MODULES: ModuleEntry[] = [
  { key: "access", name: "User Access", icon: ShieldCheck, blurb: "Who may do what, and in which jamiat.", href: "https://useraccess.daeratulaqeeq.org" },
  { key: "hoto", name: "Hoto", icon: CalendarDays, blurb: "Programme schedules for the year.", href: "https://hoto.daeratulaqeeq.org" },
  { key: "registration", name: "Registration", icon: UserPlus, blurb: "Member sign-ups and review.", href: "https://registration.daeratulaqeeq.org" },
];

export const moduleByKey = (key: ModuleKey) => MODULES.find((m) => m.key === key)!;
