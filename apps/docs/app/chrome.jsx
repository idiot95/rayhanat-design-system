"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppShell, SideNav, TopBar, Button, Cluster, ToastProvider } from "@al-rayhaanat/system";
import { SECTIONS, PAGES } from "./nav.js";

/**
 * The docs chrome is built from the system's own shell, so the site is its own
 * first consumer: if AppShell, SideNav or TopBar break, the documentation stops
 * rendering rather than quietly documenting something that no longer works.
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

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.setAttribute("dir", dir);
    html.setAttribute("lang", lang);
  }, [theme, dir, lang]);

  const current = PAGES.find(p => p.href === pathname)?.label ?? "Overview";

  const toggle = (on, onLabel, offLabel, onClick) => (
    <Button variant="ghost" size="sm" aria-pressed={on} onClick={onClick}>
      {on ? onLabel : offLabel}
    </Button>
  );

  return (
    <ToastProvider>
      <AppShell
        style={{ blockSize: "100dvh" }}
        sideNav={
          <SideNav
            brand="al-Rayhaanat"
            groups={SECTIONS}
            current={current}
            footer={
              <span style={{ paddingInline: "var(--space-4)", fontSize: "var(--text-3xs)",
                color: "var(--text-muted)" }}>
                v1.3.0 · 153 components
              </span>
            }
          />
        }
        topBar={
          <TopBar
            dense
            sticky
            brand="Design system"
            items={[]}
            actions={
              <Cluster gap={2}>
                {toggle(theme === "dark", "Dark", "Light", () =>
                  setTheme(t => (t === "dark" ? "light" : "dark")))}
                {toggle(dir === "rtl", "RTL", "LTR", () =>
                  setDir(d => (d === "rtl" ? "ltr" : "rtl")))}
                {toggle(lang === "ar", "العربية", "English", () =>
                  setLang(l => (l === "ar" ? "en" : "ar")))}
              </Cluster>
            }
          />
        }
      >
        {children}
      </AppShell>
    </ToastProvider>
  );
}
