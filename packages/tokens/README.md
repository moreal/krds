# @unofficial-krds/tokens

Source-preserving KRDS kit 1.1.0 tokens. Import `tokens` and `tokenNames` from the package, or opt into `@unofficial-krds/tokens/tokens.css`. `tokens.json` retains all 768 transformed source keys, raw values, raw aliases, types, descriptions, explicit references and resolved values. `source-map.json` connects every output CSS name to both frozen Figma and transformed keys/values. No numeric values are guessed or rounded.

`node scripts/build.mjs` validates aliases (cycles, missing references and type conflicts), rejects output-name collisions, and produces CSS, JSON and declarations in `dist/`. The generated CSS preserves every official token declaration; it also targets `:host` so the same token text can initialize shadow roots. Original KRDS rem dimensions assume its optional 62.5% root font size; importing tokens alone does not change the host application's root font size.

Derived KRDS materials retain their own terms: see LICENSE.md, ATTRIBUTION.md, THIRD-PARTY-NOTICES.md and provenance.json. Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under LICENSES/MIT.txt; publication remains unauthorized. Token tests do not establish native component, visual or accessibility acceptance.
