# Unofficial KRDS artwork

The canonical source is [wordmark-black.svg](../public/local-assets/branding/wordmark-black.svg): original Pretendard GOV glyph outlines with no text, installed-font, image, script or external-resource dependency. The white wordmark, compact K glyph and monochrome social image use the same outlines. `public/mark.svg` remains a compatibility alias for the favicon.

Regenerate from the repository root with the selected Node 24.18.0 and Yarn 4.14.1:

```sh
node tools/yarn.mjs workspace @unofficial-krds/docs generate:branding
```

[`branding/source.json`](../branding/source.json) records original font URLs, retrieval dates and hashes, authoring choices, tool versions, generator hash and every output hash. The generator uses exact direct development dependencies `fontkitten@1.0.3` and `sharp@0.34.5`, both already selected in the lock graph. It updates the existing `compliance/distribution-provenance.json` asset records. After a docs build, run `node tools/yarn.mjs exec node tools/refresh-docs-distribution.mjs` and `node tools/yarn.mjs generate:notices` to refresh deployment notices through the normal provenance flow.

`Unofficial` uses Medium 500 and precedes `KRDS` in Bold 700. Latin layout uses each original hmtx advance, without kerning, shaping or ligatures. In the original 2048-unit em, tracking is −12 for Unofficial and −20 for KRDS; the inter-word gap adds 320 units after the final l advance. Glyph geometry is unchanged. The 338×40 wordmark has 2px vertical clear space. Avoid smaller than 120px wide in UI; reserve its aspect ratio. The compact Bold K is centered by ink bounds at 64% of the square height. Favicons use white on black for browser chrome in either color scheme.

SVGs are the masters. Transparent black/white wordmark PNGs are supplied at 338×40, 676×80 and 1014×120. Favicons are 16, 32 and 48px (plus a PNG-compressed ICO), touch/app icons are 180, 192 and 512px, and the social preview is 1200×630. The social image is a centered black wordmark on white.

This is independent project artwork, separate from the official KRDS/government identity. The project's MIT grant covers independent artwork; original Pretendard GOV software remains unmodified under its [OFL terms and original attribution](../../../LICENSES/Pretendard-GOV-OFL-1.1.txt), including Reserved Font Names. Making outlined artwork does not relicense that font software. The artwork is a document created using the font under the OFL document exception. Source lineage is also preserved in [font provenance](../../../packages/fonts/provenance.json).

`test:branding` checks outline independence, pinned source bytes, all PNG dimensions and transparent formats, two byte-identical regenerations, and targeted Chromium/WebKit desktop/mobile rendering and metadata. No native component catalog coverage is awarded by these documentation checks.
