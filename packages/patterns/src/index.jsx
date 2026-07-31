/**
 * @al-rayhaanat/patterns — the composed pieces every team would otherwise
 * rebuild: overlays, disclosure, navigation, and the four states a screen can
 * be in (empty, loading, error, denied).
 *
 * Depends on @al-rayhaanat/tokens, /icons, /ui.
 *
 * DEVIATION ON RECORD: §3.7 says build on Radix primitives. This hand-rolls the
 * behaviour — focus trap, Escape, scroll lock, roving tabindex, ARIA wiring —
 * because the package had to be reviewable with no npm install. Every overlay
 * here is a thin shell around a `useDismissable` + `useFocusTrap` pair, so
 * swapping in `@radix-ui/react-dialog`, `-popover`, `-tabs` and
 * `-accordion` replaces the shell and keeps the styling layer untouched. Do that
 * before shipping to production: Radix has years of edge cases in it that this
 * does not (nested overlays, iOS scroll behaviour, portal focus return).
 */
"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { Icon, Mark, Spinner } from "@al-rayhaanat/icons";
import { Button, IconButton, Card, Input, Divider, Badge } from "@al-rayhaanat/ui";
import { Transition, FadeIn } from "@al-rayhaanat/motion";

/* ── behaviour shared by every overlay ──────────────────────────────────── */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * contained: the overlay lives inside a frame rather than over the document —
 * a phone preview, an embedded shell, a storybook cell. The trap keeps its
 * keyboard behaviour but must NOT lock body scroll or steal focus on mount,
 * because the page around the frame is still the user’s page.
 */
function useFocusTrap(open, onClose, contained) {
  const ref = useRef(null);
  const returnTo = useRef(null);
  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement;
    const node = ref.current;
    if (!contained) {
      const first = node && node.querySelector(FOCUSABLE);
      (first || node)?.focus();
    }
    const onKey = e => {
      if (e.key === "Escape") { e.stopPropagation(); onClose && onClose(); return; }
      if (e.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    if (!contained) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (!contained) document.body.style.overflow = prev;
      if (!contained && returnTo.current && returnTo.current.focus) returnTo.current.focus();
    };
  }, [open, onClose, contained]);
  return ref;
}

function useDismissable(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = e => { if (ref.current && !ref.current.contains(e.target)) onClose && onClose(); };
    const onKey = e => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  return ref;
}

const backdrop = {
  position: "fixed", inset: 0, zIndex: "var(--z-overlay)", display: "grid",
  background: "color-mix(in srgb, var(--color-sand-950) 55%, transparent)"
};
/* Contained overlays need a positioned ancestor — the shell root supplies it. */
const scrim = contained => (contained ? { ...backdrop, position: "absolute" } : backdrop);

/* ══ overlays ══════════════════════════════════════════════════════════════ */

/** Centred modal. Focus-trapped, Escape closes, scroll locked, focus returned. */
export function Modal({ open, onClose, title, description, actions, size = "md", contained, children }) {
  const ref = useFocusTrap(open, onClose, contained);
  if (!open) return null;
  const width = { sm: 380, md: 520, lg: 720 }[size] || 520;
  return (
    <Transition show={open} preset="fade" duration="fast"
      style={{ ...scrim(contained), placeItems: "center", padding: "var(--space-6)", zIndex: "var(--z-modal)" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <Transition show={open} preset="scale" duration="normal"
        role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}
        style={{ inlineSize: "100%", maxInlineSize: width, background: "var(--surface-raised)",
          borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)",
          borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)",
          padding: "var(--space-7)", display: "grid", gap: "var(--space-5)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
          <Mark size={22} style={{ marginBlockStart: 2 }} />
          <div style={{ display: "grid", gap: "var(--space-2)", marginInlineEnd: "auto" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)",
              fontSize: "var(--text-xl)", lineHeight: "var(--leading-xl)" }}>{title}</h2>
            {description && <p style={{ margin: 0, fontSize: "var(--text-sm)",
              color: "var(--text-secondary)" }}>{description}</p>}
          </div>
          <IconButton name="x" label="Close" variant="ghost" size="sm" onClick={onClose} />
        </div>
        {children && <div style={{ fontSize: "var(--text-sm)" }}>{children}</div>}
        {actions && <div style={{ display: "flex", justifyContent: "flex-end",
          gap: "var(--space-3)" }}>{actions}</div>}
      </Transition>
    </Transition>
  );
}

/** Side sheet. Enters from the inline-start or inline-end edge, so RTL is free. */
export function Drawer({ open, onClose, title, side = "end", width = 420, actions, touch, contained, children }) {
  const ref = useFocusTrap(open, onClose, contained);
  if (!open) return null;
  return (
    <Transition show={open} preset="fade" duration="fast"
      style={{ ...scrim(contained), zIndex: "var(--z-modal)",
        justifyItems: side === "start" ? "start" : "end" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <Transition show={open} preset="slide-inline" duration="normal"
        role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}
        style={{ inlineSize: "100%", maxInlineSize: width, blockSize: "100%", minBlockSize: 0,
          background: "var(--surface)", boxShadow: "var(--shadow-xl)",
          [side === "start" ? "borderInlineEndWidth" : "borderInlineStartWidth"]: "var(--border-hairline)",
          borderInlineStyle: "solid", borderColor: "var(--border)",
          display: "grid", gridTemplateRows: "auto minmax(0,1fr) auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: "var(--space-3)",
          padding: "var(--space-5) var(--space-6)",
          borderBlockEnd: "var(--border-hairline) solid var(--border)" }}>
          <h2 style={{ margin: 0, marginInlineEnd: "auto", fontFamily: "var(--font-display)",
            fontWeight: "var(--weight-semibold)", fontSize: "var(--text-lg)" }}>{title}</h2>
          <IconButton name="x" label="Close" variant="ghost" size={touch ? "lg" : "sm"}
            onClick={onClose} />
        </header>
        <div style={{ overflow: "auto", overscrollBehavior: "contain",
          padding: "var(--space-6)", fontSize: "var(--text-sm)" }}>{children}</div>
        {actions && <footer style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)",
          padding: "var(--space-5) var(--space-6)",
          borderBlockStart: "var(--border-hairline) solid var(--border)" }}>{actions}</footer>}
      </Transition>
    </Transition>
  );
}

/**
 * Bottom sheet — the phone form of a popover or a small modal. Enters from the
 * block-end edge, keeps a drag handle, and never covers the whole screen: the
 * page behind it is the way out.
 */
export function BottomSheet({ open, onClose, title, actions, contained, children }) {
  const ref = useFocusTrap(open, onClose, contained);
  if (!open) return null;
  return (
    <Transition show={open} preset="fade" duration="fast"
      style={{ ...scrim(contained), alignItems: "end", zIndex: "var(--z-modal)" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <Transition show={open} preset="fade-up" duration="normal"
        role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}
        style={{ inlineSize: "100%", maxBlockSize: "86%", minBlockSize: 0, background: "var(--surface-raised)",
          borderStartStartRadius: "var(--radius-xl)", borderStartEndRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)", display: "grid",
          gridTemplateRows: "auto auto minmax(0,1fr) auto" }}>
        <span style={{ inlineSize: 44, blockSize: 4, borderRadius: "var(--radius-full)",
          background: "var(--border-strong)", marginInline: "auto",
          marginBlock: "var(--space-3)" }} />
        <header style={{ display: "flex", alignItems: "center", gap: "var(--space-3)",
          paddingInline: "var(--space-5)", paddingBlockEnd: "var(--space-3)",
          borderBlockEnd: "var(--border-hairline) solid var(--border)" }}>
          <h2 style={{ margin: 0, marginInlineEnd: "auto", fontFamily: "var(--font-display)",
            fontWeight: "var(--weight-semibold)", fontSize: "var(--text-lg)" }}>{title}</h2>
          <IconButton name="x" label="Close" variant="ghost" size="lg" onClick={onClose} />
        </header>
        <div style={{ overflow: "auto", padding: "var(--space-5)", fontSize: "var(--text-sm)" }}>{children}</div>
        {actions && <footer style={{ display: "flex", gap: "var(--space-3)",
          padding: "var(--space-5)", paddingBlockStart: "var(--space-4)",
          borderBlockStart: "var(--border-hairline) solid var(--border)" }}>{actions}</footer>}
      </Transition>
    </Transition>
  );
}

/** A destructive confirmation. Danger button, never a bare "OK". */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Delete", tone = "danger" }) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm"
      actions={<>
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant={tone} size="sm" icon={tone === "danger" ? "trash" : undefined}
          onClick={() => { onConfirm && onConfirm(); onClose && onClose(); }}>{confirmLabel}</Button>
      </>} />
  );
}

/** Anchored panel. Dismisses on outside click and Escape. */
export function Popover({ trigger, children, align = "start", width = 260 }) {
  const [open, setOpen] = useState(false);
  const ref = useDismissable(open, () => setOpen(false));
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <span onClick={() => setOpen(o => !o)}>{trigger}</span>
      {open && (
        <Transition show={open} preset="fade-down" duration="fast"
          role="dialog" style={{ position: "absolute", insetBlockStart: "calc(100% + var(--space-2))",
          [align === "end" ? "insetInlineEnd" : "insetInlineStart"]: 0, inlineSize: width,
          zIndex: "var(--z-popover)", background: "var(--surface-raised)",
          borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
          borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)",
          padding: "var(--space-5)", display: "grid", gap: "var(--space-3)",
          fontSize: "var(--text-sm)" }}>
          {children}
        </Transition>
      )}
    </span>
  );
}

/** Hover/focus label. Matted card, never a black bubble. */
export function Tooltip({ label, children, side = "block-start" }) {
  const [on, setOn] = useState(false);
  const id = useMemo(() => "tt" + Math.random().toString(36).slice(2, 7), []);
  return (
    <span onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)} onBlur={() => setOn(false)}
      style={{ position: "relative", display: "inline-flex" }} aria-describedby={on ? id : undefined}>
      {children}
      {on && (
        <Transition show={on} preset="fade" duration="fast" as="span" role="tooltip" id={id}
          style={{ position: "absolute", insetBlockEnd: side === "block-start" ? "calc(100% + var(--space-2))" : undefined,
            insetBlockStart: side === "block-end" ? "calc(100% + var(--space-2))" : undefined,
            insetInlineStart: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap",
            zIndex: "var(--z-tooltip)", fontSize: "var(--text-2xs)",
            paddingInline: "var(--space-3)", paddingBlock: "var(--space-1)",
            background: "var(--surface-raised)", color: "var(--text-primary)",
            borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-md)",
            borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)" }}>
          {label}
        </Transition>
      )}
    </span>
  );
}

/* ══ disclosure and navigation ═════════════════════════════════════════════ */

/** Tabs with a roving tabindex; arrow keys respect `dir`. */
export function Tabs({ items = [], value, onChange, variant = "rule", children }) {
  const [own, setOwn] = useState(items[0] && (items[0].id ?? items[0]));
  const active = value === undefined ? own : value;
  const set = id => { setOwn(id); onChange && onChange(id); };
  const onKey = e => {
    const ids = items.map(i => i.id ?? i);
    const rtl = getComputedStyle(document.documentElement).direction === "rtl";
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const i = ids.indexOf(active);
    if (e.key === fwd) set(ids[(i + 1) % ids.length]);
    if (e.key === back) set(ids[(i - 1 + ids.length) % ids.length]);
  };
  return (
    <div style={{ display: "grid", gap: "var(--space-5)" }}>
      <div role="tablist" onKeyDown={onKey}
        style={{ display: "flex", flexWrap: "wrap",
          gap: variant === "pill" ? "var(--space-2)" : "var(--space-5)",
          padding: variant === "pill" ? "var(--space-1)" : 0,
          borderRadius: variant === "pill" ? "var(--radius-full)" : 0,
          background: variant === "pill" ? "var(--surface-sunken)" : "transparent",
          inlineSize: variant === "pill" ? "fit-content" : undefined,
          maxInlineSize: "100%",
          borderBlockEnd: variant === "pill" ? "none" : "var(--border-hairline) solid var(--border)" }}>
        {items.map(item => {
          const id = item.id ?? item, label = item.label ?? item;
          const on = id === active;
          return (
            <button key={id} role="tab" aria-selected={on} tabIndex={on ? 0 : -1} onClick={() => set(id)}
              style={variant === "pill" ? {
                display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
                border: 0, cursor: "pointer", minBlockSize: 32,
                paddingInline: "var(--space-4)", paddingBlock: "var(--space-2)",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                fontWeight: on ? "var(--weight-medium)" : "var(--weight-regular)",
                color: on ? "var(--text-on-interactive)" : "var(--text-secondary)",
                background: on ? "var(--interactive-solid)" : "transparent",
                boxShadow: on ? "var(--shadow-sm)" : "none",
                transitionProperty: "background-color, color",
                transitionDuration: "var(--duration-fast)"
              } : {
                display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
                background: "transparent", border: 0, cursor: "pointer",
                paddingBlock: "0 var(--space-3)", paddingInline: 0,
                marginBlockEnd: "calc(var(--border-hairline) * -1)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                fontWeight: on ? "var(--weight-medium)" : "var(--weight-regular)",
                color: on ? "var(--interactive)" : "var(--text-secondary)",
                borderBlockEnd: `var(--border-thick) solid ${on ? "var(--interactive-solid)" : "transparent"}`,
                transitionProperty: "color, border-color",
                transitionDuration: "var(--duration-fast)"
              }}>
              {item.icon && <Icon name={item.icon} size={15} />}
              {label}
              {item.count !== undefined && (
                <span style={{ fontSize: "var(--text-2xs)", fontFeatureSettings: "'tnum'",
                  color: "var(--text-muted)" }}>{item.count}</span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{typeof children === "function" ? children(active) : children}</div>
    </div>
  );
}

/** Accordion. `multiple` allows more than one open panel. */
export function Accordion({ items = [], multiple, defaultOpen = [] }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen));
  const toggle = id => setOpen(s => {
    const next = new Set(multiple ? s : []);
    s.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  return (
    <div style={{ display: "grid" }}>
      {items.map(item => {
        const on = open.has(item.id);
        return (
          <div key={item.id} style={{ borderBlockEnd: "var(--border-hairline) solid var(--border)" }}>
            <button onClick={() => toggle(item.id)} aria-expanded={on}
              style={{ inlineSize: "100%", display: "flex", alignItems: "center", gap: "var(--space-3)",
                background: "transparent", border: 0, cursor: "pointer", textAlign: "start",
                padding: "var(--space-4) 0", fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)",
                color: "var(--text-primary)" }}>
              <Icon name={on ? "chevron-up" : "chevron-down"} size={16} mirror={false} />
              <span style={{ marginInlineEnd: "auto" }}>{item.title}</span>
              {item.meta && <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>{item.meta}</span>}
            </button>
            {on && <div style={{ padding: "0 0 var(--space-5) var(--space-7)",
              fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{item.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

/** Breadcrumb. The separator is a petal, and it flips with direction. */
export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center",
      gap: "var(--space-3)", fontSize: "var(--text-xs)", flexWrap: "wrap" }}>
      {items.map((item, i) => {
        const label = item.label ?? item;
        const last = i === items.length - 1;
        return (
          <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)" }}>
            {i > 0 && <Icon name="chevron-right" size={13} style={{ color: "var(--text-muted)" }} />}
            {last
              ? <span aria-current="page" style={{ color: "var(--text-primary)" }}>{label}</span>
              : <a href={item.href || "#"} style={{ color: "var(--text-secondary)", textDecoration: "none" }}>{label}</a>}
          </span>
        );
      })}
    </nav>
  );
}

/** Pagination. Figures set tabular; the arrows mirror under RTL. */
export function Pagination({ page = 1, pageCount = 1, onChange, total, pageSize }) {
  const go = n => onChange && onChange(Math.min(Math.max(1, n), pageCount));
  const window_ = useMemo(() => {
    const out = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(pageCount, page + 2); i++) out.push(i);
    return out;
  }, [page, pageCount]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
      {total !== undefined && (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)",
          fontFeatureSettings: "'tnum'", marginInlineEnd: "auto" }}>
          {(page - 1) * (pageSize || 0) + 1}–{Math.min(page * (pageSize || 0), total)} of {total}
        </span>
      )}
      <IconButton size="sm" variant="ghost" name="chevron-left" label="Previous page"
        disabled={page === 1} onClick={() => go(page - 1)} />
      {window_[0] > 1 && <span style={{ color: "var(--text-muted)" }}>…</span>}
      {window_.map(n => (
        <Button key={n} size="sm" variant={n === page ? "primary" : "ghost"} onClick={() => go(n)}
          style={{ minInlineSize: 32, paddingInline: "var(--space-3)",
            fontFeatureSettings: "'tnum'" }}>{n}</Button>
      ))}
      {window_[window_.length - 1] < pageCount && <span style={{ color: "var(--text-muted)" }}>…</span>}
      <IconButton size="sm" variant="ghost" name="chevron-right" label="Next page"
        disabled={page === pageCount} onClick={() => go(page + 1)} />
    </div>
  );
}

/** ⌘K palette. Filters as you type; Enter runs, Escape closes. */
export function CommandPalette({ open, onClose, commands = [], placeholder = "Search commands…", contained }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const ref = useFocusTrap(open, onClose, contained);
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter(c => (c.label + " " + (c.group || "")).toLowerCase().includes(s)) : commands;
  }, [q, commands]);
  useEffect(() => setI(0), [q]);
  if (!open) return null;
  const run = c => { c && c.run && c.run(); onClose && onClose(); };
  return (
    <div style={{ ...scrim(contained), placeItems: "start center", paddingBlockStart: "12vh",
      paddingInline: "var(--space-6)", zIndex: "var(--z-modal)" }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <Transition show={open} preset="scale" duration="fast"
        role="dialog" aria-modal="true" aria-label="Commands" ref={ref} tabIndex={-1}
        onKeyDown={e => {
          if (e.key === "ArrowDown") { e.preventDefault(); setI(x => Math.min(x + 1, hits.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setI(x => Math.max(x - 1, 0)); }
          if (e.key === "Enter") { e.preventDefault(); run(hits[i]); }
        }}
        style={{ inlineSize: "100%", maxInlineSize: 560, background: "var(--surface-raised)",
          borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)",
          borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)",
          overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)",
          padding: "var(--space-4) var(--space-5)",
          borderBlockEnd: "var(--border-hairline) solid var(--border)" }}>
          <Icon name="search" size={17} style={{ color: "var(--text-muted)" }} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder}
            style={{ flex: 1, border: 0, outline: "none", background: "transparent",
              fontFamily: "var(--font-body)", fontSize: "var(--text-md)", color: "var(--text-primary)" }} />
          <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
            color: "var(--text-muted)", borderWidth: "var(--border-hairline)", borderStyle: "solid",
            borderColor: "var(--border)", borderRadius: "var(--radius-sm)",
            paddingInline: "var(--space-2)" }}>esc</kbd>
        </div>
        <div role="listbox" style={{ maxBlockSize: 320, overflow: "auto", padding: "var(--space-2)" }}>
          {hits.length === 0 && (
            <div style={{ padding: "var(--space-6)", textAlign: "center", fontSize: "var(--text-sm)",
              color: "var(--text-muted)" }}>Nothing matches “{q}”.</div>
          )}
          {hits.map((c, n) => (
            <div key={c.label} role="option" aria-selected={n === i} onMouseEnter={() => setI(n)}
              onClick={() => run(c)}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)",
                cursor: "pointer", fontSize: "var(--text-sm)",
                background: n === i ? "var(--interactive-subtle)" : "transparent",
                color: n === i ? "var(--interactive)" : "var(--text-primary)" }}>
              {c.icon && <Icon name={c.icon} size={16} />}
              <span style={{ marginInlineEnd: "auto" }}>{c.label}</span>
              {c.group && <span style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>{c.group}</span>}
              {c.shortcut && <kbd style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
                color: "var(--text-muted)" }}>{c.shortcut}</kbd>}
            </div>
          ))}
        </div>
      </Transition>
    </div>
  );
}

/* ══ toasts ════════════════════════════════════════════════════════════════ */
const ToastCtx = createContext(null);

/** Wrap the app once; call `useToast().push({...})` anywhere. */
export function ToastProvider({ children, duration = 4000 }) {
  const [items, setItems] = useState([]);
  const push = useCallback(t => {
    const id = Math.random().toString(36).slice(2);
    setItems(x => [...x, { id, ...t }]);
    if (t.duration !== 0) setTimeout(() => setItems(x => x.filter(i => i.id !== id)), t.duration || duration);
  }, [duration]);
  const dismiss = useCallback(id => setItems(x => x.filter(i => i.id !== id)), []);
  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <div aria-live="polite" style={{ position: "fixed", insetBlockEnd: "var(--space-6)",
        insetInlineEnd: "var(--space-6)", zIndex: "var(--z-toast)", display: "grid",
        gap: "var(--space-3)", justifyItems: "end" }}>
        {items.map(t => (
          <FadeIn key={t.id} preset="fade-up" duration="fast">
            <Toast {...t} onDismiss={() => dismiss(t.id)} />
          </FadeIn>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  return useContext(ToastCtx) || { push: () => {}, dismiss: () => {} };
}

/** A single toast. `tone`: neutral | success | warning | danger. */
export function Toast({ title, body, tone = "neutral", action, onDismiss }) {
  const edge = { neutral: "var(--border-strong)", success: "var(--success)",
    warning: "var(--warning)", danger: "var(--danger)" }[tone];
  return (
    <div role="status" style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start",
      inlineSize: "min(360px, 90vw)", background: "var(--surface-raised)",
      borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
      borderWidth: "var(--border-hairline)", borderStyle: "solid", borderColor: "var(--border)",
      borderInlineStartWidth: "var(--border-thick)", borderInlineStartColor: edge,
      padding: "var(--space-4) var(--space-5)" }}>
      <div style={{ display: "grid", gap: "var(--space-1)", marginInlineEnd: "auto" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)",
          fontSize: "var(--text-sm)" }}>{title}</span>
        {body && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{body}</span>}
      </div>
      {action}
      <IconButton name="x" label="Dismiss" variant="ghost" size="sm" onClick={onDismiss} />
    </div>
  );
}

/* ══ the four states a screen can be in ════════════════════════════════════ */

/** Nothing here yet — always with the action that fills it. */
export function EmptyState({ title, description, action, compact }) {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", justifyItems: "center", textAlign: "center",
      padding: compact ? "var(--space-7)" : "var(--space-9) var(--space-6)" }}>
      <Mark size={compact ? 32 : 48} tone="quiet" />
      <div style={{ display: "grid", gap: "var(--space-2)", maxInlineSize: "48ch" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)",
          fontSize: "var(--text-lg)" }}>{title}</span>
        {description && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{description}</span>}
      </div>
      {action}
    </div>
  );
}

/** Something failed — never a dead end; always a way back. */
export function ErrorState({ title = "That did not load", description, onRetry, detail }) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", justifyItems: "center", textAlign: "center",
      padding: "var(--space-9) var(--space-6)" }}>
      <span style={{ display: "grid", placeItems: "center", inlineSize: 44, blockSize: 44,
        borderRadius: "var(--radius-full)", background: "var(--danger-subtle)", color: "var(--danger)" }}>
        <Icon name="x" size={22} />
      </span>
      <div style={{ display: "grid", gap: "var(--space-2)", maxInlineSize: "52ch" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)",
          fontSize: "var(--text-lg)" }}>{title}</span>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          {description || "The request did not complete. Nothing was changed."}
        </span>
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        {onRetry && <Button size="sm" icon="arrow-right" onClick={onRetry}>Try again</Button>}
        {detail && <Button size="sm" variant="ghost" onClick={() => setShowDetail(s => !s)}>
          {showDetail ? "Hide detail" : "Show detail"}</Button>}
      </div>
      {showDetail && detail && (
        <pre style={{ margin: 0, textAlign: "start", inlineSize: "100%", maxInlineSize: 560,
          overflow: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-3xs)",
          color: "var(--text-muted)", background: "var(--surface-sunken)",
          padding: "var(--space-4)", borderRadius: "var(--radius-md)" }}>{detail}</pre>
      )}
    </div>
  );
}

/** Waiting. The mark turns; nothing jumps when the content arrives. */
export function LoadingState({ label = "Loading" }) {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", justifyItems: "center",
      padding: "var(--space-9) var(--space-6)" }}>
      <Spinner size={28} label={label} />
    </div>
  );
}

/** Not provisioned. Says who to ask, not just "denied". */
export function AccessDenied({ resource = "this area", contact = "your administrator" }) {
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", justifyItems: "center", textAlign: "center",
      padding: "var(--space-9) var(--space-6)" }}>
      <span style={{ display: "grid", placeItems: "center", inlineSize: 44, blockSize: 44,
        borderRadius: "var(--radius-full)", background: "var(--surface-sunken)",
        color: "var(--text-muted)" }}>
        <Icon name="lock" size={20} />
      </span>
      <div style={{ display: "grid", gap: "var(--space-2)", maxInlineSize: "48ch" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-semibold)",
          fontSize: "var(--text-lg)" }}>You do not have access to {resource}</span>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Your account is signed in but not provisioned for it. Ask {contact} to grant the role.
        </span>
      </div>
      <Button size="sm" variant="secondary" icon="mail">Request access</Button>
    </div>
  );
}
