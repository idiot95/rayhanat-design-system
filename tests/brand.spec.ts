import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/*
 * The caps that only a rendered page can prove. These run against the showcase;
 * point baseURL at any app to run them there.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
});

test("every flower is the V2 mark, unaltered", async ({ page }) => {
  const marks = await page.locator("svg[data-brand-mark]").evaluateAll((svgs) =>
    svgs.map((svg) => {
      const fills = [...svg.querySelectorAll("path, circle")].map((el) => getComputedStyle(el).fill);
      const ownFilter = getComputedStyle(svg).filter;
      // Anything above the mark that would change its colour also counts.
      const ancestors: string[] = [];
      for (let el = svg.parentElement; el; el = el.parentElement) {
        const cs = getComputedStyle(el);
        if (cs.filter !== "none") ancestors.push(`filter ${cs.filter}`);
        if (cs.mixBlendMode !== "normal") ancestors.push(`blend ${cs.mixBlendMode}`);
        if (Number(cs.opacity) < 1) ancestors.push(`opacity ${cs.opacity}`);
      }
      const size = Number(svg.getAttribute("width"));
      return { variant: svg.getAttribute("data-variant"), tone: svg.getAttribute("data-tone"), fills, ownFilter, ancestors, size };
    })
  );
  expect(marks.length).toBeGreaterThan(0);

  const SAND = "rgb(245, 236, 223)", ROSE = "rgb(221, 138, 141)", CRIMSON = "rgb(231, 35, 80)";
  for (const m of marks) {
    const expected = m.variant === "inner" ? [...Array(8).fill(ROSE), CRIMSON] : [...Array(8).fill(SAND), ...Array(8).fill(ROSE), CRIMSON];
    expect(m.fills, "layer colours").toEqual(expected);
    expect(m.ownFilter, "tone").toBe(m.tone === "grayscale" ? "grayscale(1)" : "none");
    expect(m.ancestors, "nothing above the mark alters it").toEqual([]);
    if (m.variant === "full") expect(m.size, "full mark only at 32px and up").toBeGreaterThanOrEqual(32);
  }
});

test("at most one primary button per screen", async ({ page }) => {
  const counts = await page.locator("[data-screen]").evaluateAll((screens) =>
    screens.map((s) => ({
      screen: s.getAttribute("data-screen"),
      primary: [...s.querySelectorAll('[data-slot="button"][data-variant="default"]')].filter((b) => (b as HTMLElement).offsetParent !== null).length,
    }))
  );
  expect(counts.length).toBeGreaterThan(0);
  for (const c of counts) expect(c.primary, c.screen ?? "").toBeLessThanOrEqual(1);
});

test("no accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
});

test("Arabic script renders in Kanz al-Lulu", async ({ page }) => {
  const arabic = page.locator('[lang="ar"]').first();
  await expect(arabic).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(() => {
    const face = [...document.fonts].find((f) => f.family.replace(/"/g, "") === "Kanz al-Lulu");
    return { status: face?.status ?? "missing", usable: document.fonts.check('16px "Kanz al-Lulu"', "أهلاً") };
  });
  expect(result).toEqual({ status: "loaded", usable: true });
});
