# License scope

Copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com>

Independently authored project code is licensed under the MIT License. The complete permission, condition and disclaimer are in [LICENSES/MIT.txt](LICENSES/MIT.txt). This copyright notice identifies the independent project code holder supplied by the user.

KRDS Native is an independent implementation. KRDS originals and adaptations retain their verified KRDS KOGL Type 1 attribution conditions, identified internally as `LicenseRef-KRDS-KOGL-Type-1`. This is a local reference, not an official SPDX identifier. KRDS materials are credited to 행정안전부 / Ministry of the Interior and Safety as identified by the [official KRDS copyright policy](https://www.krds.go.kr/html/eng/utility/utility_05.html). The independent-code MIT grant does not replace those original conditions or assign government coownership to independent project code. Rewriting or translating upstream material does not by itself make it independent code.

The full preserved KRDS and KOGL conditions accompany packages containing KRDS materials. Package `ISC` metadata and the pinned upstream README's reference to KRDS terms differ; `compliance/license-policy.json` preserves that discrepancy without asserting a dual-license election or universal legal priority.

Distributed fonts and third-party code retain their original license, copyright notices and Reserved Font Names where applicable. Each package's `provenance.json`, `ATTRIBUTION.md`, `THIRD-PARTY-NOTICES.md` and `LICENSES/` describe its actual included materials. External dependencies retain their own package notices. Unresolved individual rights records are investigation evidence and cannot list a public package in `distributedIn`.

This project is not an official government or KRDS distribution and does not imply sponsorship, certification or endorsement. Local metadata, packaging and candidate preparation are separate from authenticated account ownership and publication authorization; this license grant does not authorize npm publication, pushing or tagging. See `compliance/project-identity.json` for the supplied metadata and separate remaining checks.

## Package scope: @unofficial-krds/styles

## KRDS resources/css/common/common.css

- Source: [https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/common/common.css](https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/common/common.css)
- Version/commit: d6bb184c823e4757f05807ea4646a23e3133b6e6
- Upstream path: resources/css/common/common.css
- SHA-256: `92942dcc081821af80677645247ab4ebfedea219fac8729275368ee022e34aab`
- Conditions: LicenseRef-KRDS-KOGL-Type-1; [preserved full text](LICENSES/KRDS-copyright-en.html)
- Copyright: No material-specific copyright notice provided by original; no holder/year inferred.
- Changes: Reworked common foundation as scoped public attributes with focus-visible, forced colors and reduced-motion rules. Separated explicit global reset and optional installed/local font selection; omitted remote assets, original scripts and global defaults from component entries. Plain CSS strings use identical source bytes. T06 native-renderer correction: decorate only nonempty errors so persistent empty polite regions remain visually empty.
- Local paths: `upstream/krds/raw/kit/resources/css/common/common.css`, `packages/styles/src/base.css`, `packages/styles/src/reset.css`, `packages/styles/src/fonts.css`, `packages/styles/dist/base.css`, `packages/styles/dist/reset.css`, `packages/styles/dist/fonts.css`, `packages/styles/dist/all.css`, `packages/styles/dist/button.css`, `packages/styles/dist/native-select.css`, `packages/styles/dist/modal.css`, `packages/styles/dist/tabs.css`, `packages/styles/dist/date-input.css`, `packages/styles/dist/calendar.css`, `packages/styles/dist/lit.js`
- Source note: No material-specific copyright notice in original; provider and policy evidence retained without inventing a file notice.
- Source note: No conflicting file-level license header found. Original KRDS JavaScript is reference evidence only, never executed or distributed alongside adapter state control.

## KRDS resources/css/component/component.css

- Source: [https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/component/component.css](https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/component/component.css)
- Version/commit: d6bb184c823e4757f05807ea4646a23e3133b6e6
- Upstream path: resources/css/component/component.css
- SHA-256: `bc8df76feeb4012a6cb16a13f8702f95a67162e7d2dbf6aa5642be94daefa812`
- Conditions: LicenseRef-KRDS-KOGL-Type-1; [preserved full text](LICENSES/KRDS-copyright-en.html)
- Copyright: No material-specific copyright notice provided by original; no holder/year inferred.
- Changes: Adapted six pilot styles to documented public component/part/state/variant/size attributes with native semantics left to adapters; added wrapping, constrained viewport layouts and non-color state cues. Omitted original DOM-specific classes, JavaScript, icon assets and unrelated components; generated ordinary CSS and identical runtime-free strings. Calendar in-range uses a dashed border rather than outline so the independent focus-visible outline and forced-colors Highlight focus cue remain available; range endpoints retain double borders. T06 native-renderer corrections: selected Calendar dates use Canvas/ButtonText with non-color state borders in forced colors; nonwrapping digits/weekday labels and intrinsic table width scroll locally under narrow text enlargement; native DateInput popup receives explicit centered viewport-bounded sizing. Calendar table scrolling is isolated in a private native wrapper with focus-ring padding, keeping month navigation and footer actions stationary; narrow headers use separate heading/navigation rows to avoid year-arrow overlap.
- Local paths: `upstream/krds/raw/kit/resources/css/component/component.css`, `packages/styles/src/components/button.css`, `packages/styles/src/components/native-select.css`, `packages/styles/src/components/modal.css`, `packages/styles/src/components/tabs.css`, `packages/styles/src/components/date-input.css`, `packages/styles/src/components/calendar.css`, `packages/styles/dist/all.css`, `packages/styles/dist/button.css`, `packages/styles/dist/native-select.css`, `packages/styles/dist/modal.css`, `packages/styles/dist/tabs.css`, `packages/styles/dist/date-input.css`, `packages/styles/dist/calendar.css`, `packages/styles/dist/lit.js`
- Source note: No material-specific copyright notice in original; provider and policy evidence retained without inventing a file notice.
- Source note: No conflicting file-level license header found. Original KRDS JavaScript is reference evidence only, never executed or distributed alongside adapter state control.

## KRDS resources/css/token/krds_tokens.css

- Source: [https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/token/krds_tokens.css](https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/token/krds_tokens.css)
- Version/commit: d6bb184c823e4757f05807ea4646a23e3133b6e6
- Upstream path: resources/css/token/krds_tokens.css
- SHA-256: `2e06b0d8393bca671edaab1ca0c7c42ded2ae03b3d03c6ede60f763a93d81569`
- Conditions: LicenseRef-KRDS-KOGL-Type-1; [preserved full text](LICENSES/KRDS-copyright-en.html)
- Copyright: No material-specific copyright notice provided by original; no holder/year inferred.
- Changes: Preserved every original CSS custom-property name, literal value and alias in generated token declarations; added :host targeting for shadow roots and embedded declarations in component/all CSS and plain strings. No official token values re-estimated.
- Local paths: `upstream/krds/raw/kit/resources/css/token/krds_tokens.css`, `packages/tokens/dist/tokens.css`, `packages/styles/dist/all.css`, `packages/styles/dist/button.css`, `packages/styles/dist/native-select.css`, `packages/styles/dist/modal.css`, `packages/styles/dist/tabs.css`, `packages/styles/dist/date-input.css`, `packages/styles/dist/calendar.css`, `packages/styles/dist/lit.js`
- Source note: No material-specific copyright notice in original; provider and policy evidence retained without inventing a file notice.
- Source note: No conflicting file-level license header found. Original KRDS JavaScript is reference evidence only, never executed or distributed alongside adapter state control.

## KRDS tokens/transformed_tokens.json

- Source: [https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/tokens/transformed_tokens.json](https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/tokens/transformed_tokens.json)
- Version/commit: d6bb184c823e4757f05807ea4646a23e3133b6e6
- Upstream path: tokens/transformed_tokens.json
- SHA-256: `5eb255d593ec0b0fa41207223df1288f97295b632dfac50629e60e4e4dc0a52e`
- Conditions: LicenseRef-KRDS-KOGL-Type-1; [preserved full text](LICENSES/KRDS-copyright-en.html)
- Copyright: No material-specific copyright notice provided by original; no holder/year inferred.
- Changes: Normalized all 768 original keyed tokens without changing numeric/string values, raw aliases, types or descriptions; generated resolved records, CSS aliases, original-key map and public type declarations; embedded generated token CSS in standalone component/all CSS and identical plain CSS strings.
- Local paths: `upstream/krds/raw/kit/tokens/transformed_tokens.json`, `packages/tokens/src/source-map.json`, `packages/tokens/dist/source-map.json`, `packages/tokens/dist/tokens.json`, `packages/tokens/dist/tokens.css`, `packages/tokens/dist/index.js`, `packages/tokens/dist/index.d.ts`, `packages/styles/dist/all.css`, `packages/styles/dist/button.css`, `packages/styles/dist/native-select.css`, `packages/styles/dist/modal.css`, `packages/styles/dist/tabs.css`, `packages/styles/dist/date-input.css`, `packages/styles/dist/calendar.css`, `packages/styles/dist/lit.js`
- Source note: No material-specific copyright notice in original; provider and policy evidence retained without inventing a file notice.
- Source note: No conflicting file-level license header found. Original KRDS JavaScript is reference evidence only, never executed or distributed alongside adapter state control.
