/**
 * One nav definition, read by the rail, the mobile drawer and the page headers.
 * `count` is the package's export count — the same number the READMEs quote, so
 * a drift between them is visible rather than discovered.
 */
export const SECTIONS = [
  {
    label: "Start",
    items: [
      { label: "Overview", href: "/", icon: "book-open" },
      { label: "Foundations", href: "/foundations", icon: "layers" },
      { label: "Contracts", href: "/contracts", icon: "check" }
    ]
  },
  {
    label: "Packages",
    items: [
      { label: "ui", href: "/ui", icon: "grid", count: 34 },
      { label: "prose", href: "/prose", icon: "file-text", count: 18 },
      { label: "patterns", href: "/patterns", icon: "layers", count: 23 },
      { label: "filters", href: "/filters", icon: "filter", count: 13 },
      { label: "slides", href: "/slides", icon: "image", count: 12 },
      { label: "forms", href: "/forms", icon: "pencil", count: 11 },
      { label: "shell", href: "/shell", icon: "menu", count: 10 },
      { label: "charts", href: "/charts", icon: "table", count: 9 },
      { label: "motion", href: "/motion", icon: "clock", count: 8 },
      { label: "icons", href: "/icons", icon: "star", count: 7 },
      { label: "table", href: "/table", icon: "table", count: 6 }
    ]
  }
];

/** Flat index, for the header and the prev/next pair. */
export const PAGES = SECTIONS.flatMap(s => s.items);
