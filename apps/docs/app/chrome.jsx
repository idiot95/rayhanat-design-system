"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AppShell, SideNav, TopBar, Button, Cluster, ToastProvider,
  MobileShell, useBreakpoint
} from "@al-rayhaanat/system";
import { SECTIONS, PAGES } from "./nav.js";

const RAIL_KEY = "arh.docs.rail";

/** The four places worth a permanent target on a phone. */
const TABS = [
  { label: "Overview", icon: "book-open", href: "/" },
  { label: "Tokens", icon: "layers", href: "/foundations" },
  { label: "ui", icon: "grid", href: "/ui" },
  { label: "Contracts", icon: "check", href: "/contracts" }
];

/**
 * The docs chrome is built from the system's own shell, so the site is its own
 * first consumer: if AppShell, SideNav or TopBar break, the documentation stops
 * rendering rather than quietly documenting something that no longer works.
 *
 * Below the md breakpoint it swaps AppShell for MobileShell rather than letting
 * a 240px rail eat half a phone screen — the same swap a product makes, shown by
 * making it.
 *
 * The three toggles write to <html> and nothing else. There is no context and no
 * theme state threaded through the tree — that is the behaviour being shown, not
 * a shortcut taken to build the site.
 */
export function Chrome({ children }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [dir, setDir] = useState("ltr");
  const [lang, setLang] = useState("en");
  const [collapsed, setCollapsed] = useState(false);
  /* The server has no viewport, so the first client render must match the HTML
     it is hydrating. Choose the frame only once mounted. */
  const [mounted, setMounted] = useState(false);
  const bp = useBreakpoint();
  const phone = mounted && bp.isPhone;

  useEffect(() => {
    setMounted(true);
    try {
      if (window.localStorage.getItem(RAIL_KEY) === "collapsed") setCollapsed(true);
    } catch { /* private mode — the rail just starts open */ }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.setAttribute("dir", dir);
    html.setAttribute("lang", lang);
  }, [theme, dir, lang]);

  const toggleRail = () => setCollapsed(c => {
    const next = !c;
    try { window.localStorage.setItem(RAIL_KEY, next ? "collapsed" : "open"); } catch { /* ignore */ }
    return next;
  });

  const current = PAGES.find(p => p.href === pathname)?.label ?? "Overview";

  const toggle = (on, onLabel, offLabel, onClick) => (
    <Button variant="ghost" size="sm" aria-pressed={on} onClick={onClick}>
      {on ? onLabel : offLabel}
    </Button>
  );

  const controls = (
    <Cluster gap={2}>
      {toggle(theme === "dark", "Dark", "Light", () =>
        setTheme(t => (t === "dark" ? "light" : "dark")))}
      {toggle(dir === "rtl", "RTL", "LTR", () =>
        setDir(d => (d === "rtl" ? "ltr" : "rtl")))}
      {toggle(lang === "ar", "العربية", "English", () =>
        setLang(l => (l === "ar" ? "en" : "ar")))}
    </Cluster>
  );

  if (phone) {
    return (
      <ToastProvider>
        <MobileShell
          brand="al-Rayhaanat"
          groups={SECTIONS}
          tabs={TABS}
          current={current}
          title={current}
          actions={controls}
          style={{ blockSize: "100dvh" }}
        >
          {children}
        </MobileShell>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AppShell
        style={{ blockSize: "100dvh" }}
        sideNav={
          <SideNav
            brand="al-Rayhaanat"
            groups={SECTIONS}
            current={current}
            collapsed={collapsed}
            onToggleCollapsed={toggleRail}
            footer={
              collapsed ? null : (
                <span style={{ paddingInline: "var(--space-4)", fontSize: "var(--text-3xs)",
                  color: "var(--text-muted)" }}>
                  v1.3.0 · 154 components
                </span>
              )
            }
          />
        }
        topBar={
          <TopBar dense sticky brand="Design system" items={[]} actions={controls} />
        }
      >
        {children}
      </AppShell>
    </ToastProvider>
  );
}
