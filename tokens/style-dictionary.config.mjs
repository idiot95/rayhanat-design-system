/**
 * al-Rayhaanat — Style Dictionary build.
 *
 *   node --experimental-strip-types ./node_modules/.bin/style-dictionary build
 *   (or: npm run build:tokens)
 *
 * packages/tokens/brand.json is the ONLY place a raw value is written. Every target below
 * is generated. Nothing downstream may contain a hex, a px or a duration.
 *
 * Committed output lives in packages/tokens/dist/ so consumers need no build step.
 */
import StyleDictionary from 'style-dictionary';

const MODES = ['light', 'dark'];
const isSemantic = t => MODES.includes(t.path[1]) && t.path[0] === 'color';
const isMode = (t, m) => t.path[0] === 'color' && t.path[1] === m;
const varName = t => t.path.slice(2).join('-');

/**
 * brand.json is DTCG ($value/$type), and Style Dictionary v4 only mirrors
 * $value onto .value for its BUILT-IN formats when usesDtcg is set. Custom
 * formats receive the token untouched, so reading t.value alone yields
 * undefined for every token — JSON.stringify then drops the leaves and the
 * generated files come out as `{ "sand": {}, "slate": {} }`.
 *
 * Read through this helper, never t.value directly.
 */
const val = t => t.$value ?? t.value;

/* ── custom formats ─────────────────────────────────────────────────────── */

// 1. CSS custom properties: primitives in :root, semantics per data-theme.
StyleDictionary.registerFormat({
  name: 'arh/css',
  format: ({ dictionary }) => {
    const prim = dictionary.allTokens.filter(t => !isSemantic(t));
    const line = (n, v) => `  --${n}: ${v};`;
    const root = prim.map(t => line(t.path.join("-").replace(/^(color|dimension|typography|motion)-/, ""), val(t)));
    const block = m => dictionary.allTokens.filter(t => isMode(t, m)).map(t => line(varName(t), val(t)));
    return [
      '/* GENERATED FROM packages/tokens/brand.json BY STYLE DICTIONARY — DO NOT EDIT BY HAND. */',
      ':root {', ...root, '}',
      '', ':root, [data-theme="light"] {', ...block('light'), '}',
      '', '[data-theme="dark"] {', ...block('dark'), '}',
      '', '@media (prefers-reduced-motion: reduce) { :root {',
      '  --duration-fast: 0ms; --duration-normal: 0ms; --duration-slow: 0ms; --duration-deliberate: 0ms;',
      '} }'
    ].join('\n');
  }
});

// 2. TypeScript object — for chart series, motion helpers, anything in JS.
StyleDictionary.registerFormat({
  name: 'arh/ts',
  format: ({ dictionary }) => {
    const tree = {};
    dictionary.allTokens.forEach(t => {
      let n = tree;
      t.path.slice(0, -1).forEach(k => (n = n[k] ||= {}));
      n[t.path.at(-1)] = val(t);
    });
    return '// GENERATED FROM packages/tokens/brand.json — DO NOT EDIT BY HAND.\n' +
      Object.entries(tree).map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 2)} as const;`).join('\n\n') +
      '\n\nexport type SemanticToken = keyof typeof color.light;\n';
  }
});

// 3. Tailwind preset — semantic names map to the CSS variables, so dark mode is
//    a data attribute rather than a second palette.
StyleDictionary.registerFormat({
  name: 'arh/tailwind',
  format: ({ dictionary }) => {
    const semantic = dictionary.allTokens.filter(t => isMode(t, 'light')).map(t => varName(t));
    /* .cjs on purpose: a Tailwind config is required, not imported. */
    return `// GENERATED FROM packages/tokens/brand.json — DO NOT EDIT BY HAND.
const v = k => \`var(--\${k})\`;
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: { extend: {
    colors: { ${semantic.map(k => `'${k}': v('${k}')`).join(', ')} }
  } }
};
`;
  }
});

// 4. pptxgenjs theme — decks read the same tokens as the web.
StyleDictionary.registerFormat({
  name: 'arh/pptx',
  format: ({ dictionary }) => {
    const get = p => dictionary.allTokens.find(t => t.path.join('.') === p) ? val(dictionary.allTokens.find(t => t.path.join('.') === p)).replace('#','') : undefined;
    return `// GENERATED FROM packages/tokens/brand.json — DO NOT EDIT BY HAND.
export default {
  theme: {
    background: '${get('color.light.canvas')}',
    text: '${get('color.light.text-primary')}',
    accent1: '${get('color.crimson.500')}',
    accent2: '${get('color.rose.500')}',
    accent3: '${get('color.blue.500')}',
    accent4: '${get('color.green.500')}',
    accent5: '${get('color.amber.500')}',
    accent6: '${get('color.neutral.600')}'
  },
  // Office keeps Latin and complex-script (Arabic) font slots separately.
  fonts: { latin: 'Source Serif 4', latinBody: 'IBM Plex Sans', complexScript: 'Kanz al-Lulu' },
  layout: { name: 'ARH_16x9', width: 13.333, height: 7.5 }
};
`;
  }
});

// 5. Figma variables — designers import the same source.
StyleDictionary.registerFormat({
  name: 'arh/figma',
  format: ({ dictionary }) => JSON.stringify({
    collections: MODES.map(m => ({
      name: `color/${m}`, modes: [m],
      variables: dictionary.allTokens.filter(t => isMode(t, m))
        .map(t => ({ name: varName(t), type: 'COLOR', value: val(t) }))
    })).concat([{
      name: 'primitive',
      variables: dictionary.allTokens.filter(t => t.path[0] === 'color' && !isSemantic(t))
        .map(t => ({ name: t.path.slice(1).join('/'), type: 'COLOR', value: val(t) }))
    }])
  }, null, 2)
});

/* ── build ──────────────────────────────────────────────────────────────── */
export default {
  source: ['packages/tokens/brand.json'],
  platforms: {
    css:      { transformGroup: 'css', buildPath: 'packages/tokens/dist/', files: [{ destination: 'tokens.css', format: 'arh/css' }] },
    ts:       { transformGroup: 'js',  buildPath: 'packages/tokens/dist/', files: [{ destination: 'tokens.ts', format: 'arh/ts' }] },
    tailwind: { transformGroup: 'js',  buildPath: 'packages/tokens/dist/', files: [{ destination: 'tailwind.preset.cjs', format: 'arh/tailwind' }] },
    scss:     { transformGroup: 'scss', buildPath: 'packages/tokens/dist/', files: [{ destination: '_tokens.scss', format: 'scss/variables' }] },
    pptx:     { transformGroup: 'js',  buildPath: 'packages/slides/dist/', files: [{ destination: 'pptx.theme.js', format: 'arh/pptx' }] },
    figma:    { transformGroup: 'js',  buildPath: 'packages/tokens/dist/', files: [{ destination: 'figma.variables.json', format: 'arh/figma' }] }
  }
};
