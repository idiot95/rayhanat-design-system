"use client";

import { PageHeader, Stack, Card, Divider } from "@al-rayhaanat/system";

/**
 * The three wrappers every docs page is built from. They are deliberately thin —
 * a docs site that invents its own card and its own heading scale stops being
 * evidence that the system works.
 */

/** One documentation page: header, then a stack of specimens. */
export function Page({ title, description, meta, children }) {
  return (
    <Stack gap={7} style={{ maxInlineSize: "var(--bp-xl)", marginInline: "auto" }}>
      <PageHeader title={title} description={description} meta={meta} />
      {children}
    </Stack>
  );
}

/** A titled group of specimens. */
export function Group({ title, children }) {
  return (
    <Stack gap={5}>
      <Divider label={title} />
      {children}
    </Stack>
  );
}

/**
 * One specimen: what it is, then the thing itself on a surface. The label sits
 * above the frame rather than inside it, so the component is never boxed in a
 * container it would not have in a product.
 */
export function Demo({ name, note, children, pad = 6 }) {
  return (
    <Stack gap={3}>
      <Stack gap={1}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
          color: "var(--text-primary)" }}>{name}</span>
        {note && (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{note}</span>
        )}
      </Stack>
      <Card style={{ padding: `var(--space-${pad})` }}>{children}</Card>
    </Stack>
  );
}
