# tokens/

The DTCG source moved into the package that exports it:

    packages/tokens/brand.json      ← the only place a raw value is written
    tokens/style-dictionary.config.mjs   ← the build that reads it

Nothing else belongs here. Edit `packages/tokens/brand.json`, then:

    pnpm build:tokens
