# Primary implementation references

- `https://lit.dev/docs/ssr/client-usage/`: use official `lit-element-hydrate-support.js` before element definitions; hydration reuses declarative shadow roots.
- `https://lit.dev/docs/ssr/server-usage/`: standalone Lit SSR render result and declarative Shadow DOM; explicit renderer registration is server-context-owned.
- `https://lit.dev/docs/ssr/authoring/`: SSR-compatible lifecycle restrictions; no browser document work during module import or server render.
- Installed exact `packages/lit/node_modules/@zag-js/vanilla/dist/machine.d.ts` and `machine.mjs`: VanillaMachine lifecycle, updateProps, service, subscribe and stop.
- Installed exact `packages/lit/node_modules/@zag-js/vanilla/dist/normalize-props.mjs`: normalizer emits lowercase attribute/event names (onfocusin/onfocusout/onclick/onkeydown).
- Installed exact `packages/lit/node_modules/@lit-labs/ssr-client/lit-element-hydrate-support.js`: global hook installation, defer-hydration support, actual shadow-root hydrate path.

No upstream KRDS JavaScript or new assets were incorporated. Existing common contracts, date arithmetic, styles and token package outputs are consumed under their existing provenance/licensing records.
