/**
 * al-Rayhaanat hard caps, as ESLint rules. Every rule here fails the build.
 *
 *   // eslint.config.js in an app
 *   import brandCaps from "./eslint/brand-caps.js";
 *   export default [...brandCaps];
 *
 * The messages say what to do instead, so a person or an AI agent can fix the
 * code without opening AGENTS.md.
 */

const COLOUR_LITERAL = String.raw`#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(`;
const ARBITRARY_COLOUR_CLASS = String.raw`\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|shadow|accent|caret|divide|placeholder)-\[(?:#|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color:|var\()`;
const FLOWER_ALTERING_CLASS = String.raw`\b(?:invert|hue-rotate|sepia|saturate|brightness|mix-blend)(?:-|\b)`;
const DISPLAY_FONT_CLASS = String.raw`\bfont-display\b`;
const MODULE_HUE_CLASS = String.raw`\b(?:bg|text|border|ring|fill|stroke|outline|decoration)-module\b`;

const CLASSNAME = "JSXAttribute[name.name='className']";
const inClassName = (pattern, message) => [
  { selector: `${CLASSNAME} Literal[value=/${pattern}/]`, message },
  { selector: `${CLASSNAME} TemplateElement[value.raw=/${pattern}/]`, message },
  { selector: `CallExpression[callee.name='cn'] Literal[value=/${pattern}/]`, message },
];

const colourRules = [
  { selector: `Literal[value=/${COLOUR_LITERAL}/]`, message: "Raw colour. Use a theme token class (bg-primary, text-muted-foreground) — only theme.css defines colours." },
  { selector: `TemplateElement[value.raw=/${COLOUR_LITERAL}/]`, message: "Raw colour. Use a theme token class — only theme.css defines colours." },
  ...inClassName(ARBITRARY_COLOUR_CLASS, "Arbitrary colour class. Use a token class: bg-primary, text-destructive, border-input."),
];
const flowerRules = [
  { selector: "JSXOpeningElement[name.name='Mark'] > JSXAttribute[name.name!=/^(size|variant|tone|title|key)$/]", message: "<Mark /> takes only size, variant (full | inner), tone (colour | grayscale) and title. The flower is never restyled." },
  { selector: "Literal[value=/1000\\.05/]", message: "Flower path data belongs in components/brand/mark.tsx only. Use <Mark />." },
];
const displayFontRules = inClassName(DISPLAY_FONT_CLASS, "Cormorant is for page titles. Use <PageHeader title=… /> instead of font-display.");
const moduleHueRules = inClassName(MODULE_HUE_CLASS, "Module hue is for <ModuleBadge /> and <TodayDot /> only.");
const flowerAlterRules = (scope) => inClassName(FLOWER_ALTERING_CLASS, `Filter or blend utilities are not allowed in ${scope}; they would alter the flower. Use the token colours instead.`);

const restrictedImports = {
  paths: [
    { name: "react-icons", message: "Use lucide-react." },
    { name: "@heroicons/react", message: "Use lucide-react." },
    { name: "@tabler/icons-react", message: "Use lucide-react." },
    { name: "antd", message: "Use the shadcn/ui components in components/ui." },
    { name: "@radix-ui/themes", message: "Use the shadcn/ui components in components/ui." },
  ],
  patterns: [
    { group: ["@mui/*", "@mantine/*", "@chakra-ui/*", "@headlessui/*", "@nextui-org/*", "@heroui/*"], message: "Use the shadcn/ui components in components/ui." },
    { group: ["@phosphor-icons/*", "@fortawesome/*"], message: "Use lucide-react." },
  ],
};

/** Everything an app's source must obey. */
export const appRules = {
  "no-restricted-syntax": ["error", ...colourRules, ...flowerRules, ...displayFontRules, ...moduleHueRules, ...flowerAlterRules("app code")],
  "no-restricted-imports": ["error", restrictedImports],
};

/**
 * Per-file exemptions. Each one is the single place a cap's subject is allowed
 * to live; the rest of the rules still apply to these files.
 */
export const exemptions = [
  {
    files: ["**/brand/mark.tsx"],
    rules: { "no-restricted-syntax": ["error", ...displayFontRules, ...moduleHueRules] },
  },
  {
    files: ["**/brand/page-header.tsx", "**/brand/wordmark.tsx"],
    rules: { "no-restricted-syntax": ["error", ...colourRules, ...flowerRules, ...moduleHueRules, ...flowerAlterRules("brand components")] },
  },
  {
    files: ["**/brand/module-badge.tsx"],
    rules: { "no-restricted-syntax": ["error", ...colourRules, ...flowerRules, ...displayFontRules, ...flowerAlterRules("brand components")] },
  },
  {
    // Stock shadcn: hover states use opacity modifiers (bg-primary/90), which is fine here.
    files: ["**/components/ui/**", "registry/ui/**"],
    rules: { "no-restricted-syntax": ["error", ...colourRules, ...flowerRules, ...displayFontRules, ...moduleHueRules] },
  },
];

/** Rule groups, for a file that needs every cap except one (see eslint.config.js). */
export const groups = { colourRules, flowerRules, displayFontRules, moduleHueRules, flowerAlterRules: flowerAlterRules("app code") };

export default [{ rules: appRules }, ...exemptions];
