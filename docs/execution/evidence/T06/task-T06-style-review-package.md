# T06 shared style exact changes

Native visual repairs scoped to three CSS sources and essential derivation records. Metadata identity/new MIT grant and generated notices are independently reviewed in separate metadata change package, not part of this source repair. Original hashes/localPaths[0]/distribution targets must remain preserved. Ordinary CSS and Lit plain strings must remain equal. Final images/report supplied by lead and inspected by T04; reviewer must inspect relevant actual images and supplied checks.

## packages/styles/src/base.css

```diff
--- before-T06-style/packages/styles/src/base.css
+++ packages/styles/src/base.css
@@ -9,21 +9,21 @@
 [data-krds-component]:is(button, input, select) { font: inherit; }
 [data-krds-component]:focus-visible {
   outline: var(--krds-number-2) solid var(--krds-light-color-border-primary);
   outline-offset: var(--krds-number-2);
 }
 [data-krds-component][hidden] { display: none !important; }
 [data-krds-component][data-krds-part="error"] {
   color: var(--krds-light-color-text-danger);
   font-weight: 700;
 }
-[data-krds-component][data-krds-part="error"]::before { content: "! "; }
+[data-krds-component][data-krds-part="error"]:not(:empty)::before { content: "! "; }
 [data-krds-component][data-krds-part="hint"] { color: var(--krds-light-color-text-subtle); }
 [data-krds-component]:is(button, input, select):is(:disabled, [data-krds-state~="disabled"]) {
   cursor: not-allowed;
   border-style: dashed;
 }
 @media (forced-colors: active) {
   [data-krds-component] { forced-color-adjust: auto; }
   [data-krds-component]:focus-visible { outline-color: Highlight; }
   [data-krds-component]:is(button, input, select) { border-color: ButtonText; }
   [data-krds-component]:is(button, input, select):disabled { color: GrayText; border-color: GrayText; }
```

## packages/styles/src/components/calendar.css

```diff
--- before-T06-style/packages/styles/src/components/calendar.css
+++ packages/styles/src/components/calendar.css
@@ -1,16 +1,24 @@
 [data-krds-component="calendar"][data-krds-part="root"] { inline-size: min(100%, 36rem); padding: var(--krds-padding-5); background: var(--krds-light-color-surface-white); color: var(--krds-light-color-text-basic); }
 [data-krds-component="calendar"][data-krds-part="header"] { display: flex; align-items: center; justify-content: space-between; gap: var(--krds-gap-2); }
-[data-krds-component="calendar"][data-krds-part="heading"] { font-weight: 700; }
-[data-krds-component="calendar"][data-krds-part="table"] { inline-size: 100%; table-layout: fixed; border-collapse: collapse; }
-[data-krds-component="calendar"]:is([data-krds-part="weekday"], [data-krds-part="cell"]) { text-align: center; padding: var(--krds-number-1); }
-[data-krds-component="calendar"][data-krds-part="day"] { inline-size: 100%; min-block-size: 2em; padding: var(--krds-number-1); border: var(--krds-number-1) solid transparent; border-radius: var(--krds-radius-small1); background: transparent; color: inherit; }
+[data-krds-component="calendar"][data-krds-part="heading"] { font-weight: 700; overflow-wrap: normal; word-break: keep-all; }
+/* Private scroll wrapper keeps month navigation and footer actions in view. */
+[data-krds-component="calendar"][data-krds-internal="table-scroll"] { overflow-x: auto; overscroll-behavior-inline: contain; padding: var(--krds-number-3); scroll-padding-inline: var(--krds-number-3); }
+[data-krds-component="calendar"][data-krds-part="table"] { inline-size: 100%; min-inline-size: 17.5em; table-layout: auto; border-collapse: collapse; }
+[data-krds-component="calendar"]:is([data-krds-part="weekday"], [data-krds-part="cell"]) { text-align: center; padding: var(--krds-number-1); white-space: nowrap; overflow-wrap: normal; }
+[data-krds-component="calendar"][data-krds-part="day"] { inline-size: 100%; min-inline-size: 2.5em; min-block-size: 2em; white-space: nowrap; overflow-wrap: normal; font-variant-numeric: tabular-nums; padding: var(--krds-number-1); border: var(--krds-number-1) solid transparent; border-radius: var(--krds-radius-small1); background: transparent; color: inherit; }
 [data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="today"] { border-color: currentColor; text-decoration: underline; }
 [data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="selected"] { background: var(--krds-light-color-button-primary-fill); color: var(--krds-light-color-text-inverse-static); font-weight: 700; border-color: currentColor; }
 [data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="in-range"] { border-style: dashed; border-color: currentColor; }
 [data-krds-component="calendar"][data-krds-part="day"]:is([data-krds-state~="range-start"], [data-krds-state~="range-end"]) { border-style: double; border-width: var(--krds-number-3); }
 [data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="outside-month"] { text-decoration: underline dotted; }
 [data-krds-component="calendar"][data-krds-part="day"]:disabled { color: var(--krds-light-color-text-disabled-on); text-decoration: line-through; }
 [data-krds-component="calendar"][data-krds-part="footer"] { display: flex; flex-wrap: wrap; gap: var(--krds-gap-2); margin-block-start: var(--krds-gap-3); }
 [data-krds-component="calendar"]:is([data-krds-part="previous"], [data-krds-part="next"], [data-krds-part="today"], [data-krds-part="clear"], [data-krds-part="cancel"], [data-krds-part="confirm"]) { min-block-size: 2em; padding: var(--krds-padding-2); }
-@media (forced-colors: active) { [data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="selected"] { background: Highlight; color: HighlightText; } }
-@media (max-width: 24rem) { [data-krds-component="calendar"][data-krds-part="root"] { padding: var(--krds-padding-2); } }
+@media (forced-colors: active) { [data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="selected"] { background: Canvas; color: ButtonText; } }
+@media (max-width: 24rem) {
+  [data-krds-component="calendar"][data-krds-part="root"] { padding: var(--krds-padding-2); }
+  [data-krds-component="calendar"][data-krds-part="header"] { display: grid; grid-template-columns: 1fr 1fr; }
+  [data-krds-component="calendar"][data-krds-part="heading"] { grid-column: 1 / -1; grid-row: 1; text-align: center; }
+  [data-krds-component="calendar"][data-krds-part="previous"] { grid-column: 1; grid-row: 2; justify-self: start; }
+  [data-krds-component="calendar"][data-krds-part="next"] { grid-column: 2; grid-row: 2; justify-self: end; }
+}
```

## packages/styles/src/components/date-input.css

```diff
--- before-T06-style/packages/styles/src/components/date-input.css
+++ packages/styles/src/components/date-input.css
@@ -1,10 +1,25 @@
 [data-krds-component="date-input"][data-krds-part="root"] { display: flex; flex-wrap: wrap; gap: var(--krds-gap-2); border: 0; padding: 0; margin: 0; }
 [data-krds-component="date-input"]:is([data-krds-part="label"], [data-krds-part="hint"], [data-krds-part="error"]) { flex-basis: 100%; }
 [data-krds-component="date-input"][data-krds-part="label"] { font-weight: 700; }
 [data-krds-component="date-input"]:is([data-krds-part="control"], [data-krds-part="start-input"], [data-krds-part="end-input"]) { flex: 1 1 10em; inline-size: 10em; min-block-size: var(--krds-size-height-7); padding: var(--krds-padding-4); border: var(--krds-number-1) solid var(--krds-light-color-input-border); border-radius: var(--krds-radius-medium2); background: var(--krds-light-color-input-surface); color: var(--krds-light-color-text-basic); }
 [data-krds-component="date-input"]:is(input)[data-krds-state~="invalid"] { border-color: var(--krds-light-color-input-border-error); border-width: var(--krds-number-2); }
 [data-krds-component="date-input"]:is(input):disabled { background: var(--krds-light-color-input-surface-disabled); }
 [data-krds-component="date-input"][data-krds-part="trigger"] { flex: 0 0 auto; min-block-size: var(--krds-size-height-7); padding: var(--krds-padding-4); }
 [data-krds-component="date-input"][data-krds-part="trigger"][data-krds-state~="open"] { text-decoration: underline; }
-[data-krds-component="date-input"][data-krds-part="popup"] { max-inline-size: 100%; max-block-size: calc(100dvh - var(--krds-gap-5)); overflow: auto; }
+[data-krds-component="date-input"][data-krds-part="popup"] {
+  position: fixed;
+  inset: 0;
+  margin: auto;
+  inline-size: min(40rem, calc(100vw - var(--krds-gap-5)));
+  max-inline-size: calc(100vw - var(--krds-gap-5));
+  max-block-size: calc(100dvh - var(--krds-gap-5));
+  padding: var(--krds-padding-6);
+  overflow: auto;
+  overscroll-behavior: contain;
+  border: var(--krds-number-1) solid var(--krds-light-color-border-gray);
+  border-radius: var(--krds-radius-xlarge1);
+  background: var(--krds-light-color-surface-white);
+  color: var(--krds-light-color-text-basic);
+}
+[data-krds-component="date-input"][data-krds-part="popup"]::backdrop { background: var(--krds-color-light-alpha-black50); }
 [data-krds-component="date-input"][data-krds-part="popup"][data-krds-state~="closed"] { display: none; }
```

## upstream/krds/manifest.json

```diff
--- before-T06-style/upstream/krds/manifest.json
+++ upstream/krds/manifest.json
@@ -2107,154 +2107,154 @@
       "sha256": "92942dcc081821af80677645247ab4ebfedea219fac8729275368ee022e34aab",
       "localPath": "upstream/krds/raw/kit/resources/css/common/common.css",
       "retrievedAt": "2026-10-29T23:30:50.752460+00:00",
       "bytes": 41826,
       "status": "retrieved-and-git-blob-matched",
       "rightsStatus": "KRDS terms apply; ISC package metadata conflicts with README policy; reconcile before redistribution",
       "copyrightHolder": null,
       "copyrightYear": null,
       "derivation": {
         "task": "T04",
-        "changeSummary": "Reworked common foundation as scoped public attributes with focus-visible, forced colors and reduced-motion rules. Separated explicit global reset and optional installed/local font selection; omitted remote assets, original scripts and global defaults from component entries. Plain CSS strings use identical source bytes.",
+        "changeSummary": "Reworked common foundation as scoped public attributes with focus-visible, forced colors and reduced-motion rules. Separated explicit global reset and optional installed/local font selection; omitted remote assets, original scripts and global defaults from component entries. Plain CSS strings use identical source bytes. T06 native-renderer correction: decorate only nonempty errors so persistent empty polite regions remain visually empty.",
         "outputs": [
           {
             "localPath": "packages/styles/src/base.css",
-            "sha256": "bb12d8d5489667badbf48b4b09028052ad6dc39979d82f9405967b24d79a259e"
+            "sha256": "96c37c221d6e55be3c44087252ecc0f9d75e1663e2bca282c56081eb41473ab7"
           },
           {
             "localPath": "packages/styles/src/reset.css",
             "sha256": "42bd0535effc5a33ebebb9fc2094770e012d31b423c80ae9773cd655c5d5d244"
           },
           {
             "localPath": "packages/styles/src/fonts.css",
             "sha256": "56935ddd8fcbfdc190d9b3b586ef1154a11afb15f50e56ceca7b3c4590dc20cd"
           },
           {
             "localPath": "packages/styles/dist/base.css",
-            "sha256": "bb12d8d5489667badbf48b4b09028052ad6dc39979d82f9405967b24d79a259e"
+            "sha256": "96c37c221d6e55be3c44087252ecc0f9d75e1663e2bca282c56081eb41473ab7"
           },
           {
             "localPath": "packages/styles/dist/reset.css",
             "sha256": "42bd0535effc5a33ebebb9fc2094770e012d31b423c80ae9773cd655c5d5d244"
           },
           {
             "localPath": "packages/styles/dist/fonts.css",
             "sha256": "56935ddd8fcbfdc190d9b3b586ef1154a11afb15f50e56ceca7b3c4590dc20cd"
           },
           {
             "localPath": "packages/styles/dist/all.css",
-            "sha256": "92f4b428868068eedc7b6bbf11750c038e8418a667d44e55ed61408cb9d9965d"
+            "sha256": "56a4458e7efe5940cc1eeb34e5cbe77444a3254a8f64b2028abe55b46bf3e38a"
           },
           {
             "localPath": "packages/styles/dist/button.css",
-            "sha256": "f86828628aac5013198ee17c0ceafb1efcdda539279d639764673fc0e9c81702"
+            "sha256": "b51970b3d60c05dc116236c0ee86c6c9aa2f08c49f64f5ef5efcf873a8383af3"
           },
           {
             "localPath": "packages/styles/dist/native-select.css",
-            "sha256": "73ce032e17dc6ef9c4d6fcdf5008b9d81de0a4752994631880fb4fcfd4abe7fa"
+            "sha256": "d0b646a0f9dc0b204a53af50fa6de64745968260290e1e6c913b5295c0416fd6"
           },
           {
             "localPath": "packages/styles/dist/modal.css",
-            "sha256": "f3bce9586eb96fa86428424eef551dc7474dda6ff9a2973e2e13a320280ca5e7"
+            "sha256": "688ef8299de1eac5de8de162e8d694125d948ad0b155fd82a66d739e9eb92f4f"
           },
           {
             "localPath": "packages/styles/dist/tabs.css",
-            "sha256": "5fe401a46fb64e554d2699a09119590bd45eda93abf9323cf294eeada2be78bf"
+            "sha256": "01d3232d6bf0e8e25c827ce88201ee9a9ba05d4a3593d09f158f67347759506e"
           },
           {
             "localPath": "packages/styles/dist/date-input.css",
-            "sha256": "031d0232556ad5052bd3775406cac82a46937d7b75593fe4a985f5a8c8c63e2e"
+            "sha256": "af2c060b5f23a323db51df94c9a6ae5adfe98c418d099213ff759a2392c902eb"
           },
           {
             "localPath": "packages/styles/dist/calendar.css",
-            "sha256": "188d063996fd484e80c4733744692897f60134f17bad07aaa14d4d3f6bc77a3e"
+            "sha256": "c764e30690ff10c1b9ad77bc05359e03b4bc6ed6695f67b3282968a760beb4de"
           },
           {
             "localPath": "packages/styles/dist/lit.js",
-            "sha256": "eb66fde5a9b7cd3e0514b0cba181865553c100f0ffdec9be97e7956e11f9dcc4"
+            "sha256": "8e373373f317b7301332a4737ebfc65185b211600f7dbc94c407100099ff615b"
           }
         ]
       }
     },
     {
       "id": "resources/css/component/component.css",
       "sourcePath": "resources/css/component/component.css",
       "sourceUrl": "https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/component/component.css",
       "gitCommit": "d6bb184c823e4757f05807ea4646a23e3133b6e6",
       "gitBlobSha1": "eb7fe1c0707517135f5224efe3852de1e4d1578d",
       "sha256": "bc8df76feeb4012a6cb16a13f8702f95a67162e7d2dbf6aa5642be94daefa812",
       "localPath": "upstream/krds/raw/kit/resources/css/component/component.css",
       "retrievedAt": "2026-10-29T23:30:50.752565+00:00",
       "bytes": 529722,
       "status": "retrieved-and-git-blob-matched",
       "rightsStatus": "KRDS terms apply; ISC package metadata conflicts with README policy; reconcile before redistribution",
       "copyrightHolder": null,
       "copyrightYear": null,
       "derivation": {
         "task": "T04",
-        "changeSummary": "Adapted six pilot styles to documented public component/part/state/variant/size attributes with native semantics left to adapters; added wrapping, constrained viewport layouts and non-color state cues. Omitted original DOM-specific classes, JavaScript, icon assets and unrelated components; generated ordinary CSS and identical runtime-free strings. Calendar in-range uses a dashed border rather than outline so the independent focus-visible outline and forced-colors Highlight focus cue remain available; range endpoints retain double borders.",
+        "changeSummary": "Adapted six pilot styles to documented public component/part/state/variant/size attributes with native semantics left to adapters; added wrapping, constrained viewport layouts and non-color state cues. Omitted original DOM-specific classes, JavaScript, icon assets and unrelated components; generated ordinary CSS and identical runtime-free strings. Calendar in-range uses a dashed border rather than outline so the independent focus-visible outline and forced-colors Highlight focus cue remain available; range endpoints retain double borders. T06 native-renderer corrections: selected Calendar dates use Canvas/ButtonText with non-color state borders in forced colors; nonwrapping digits/weekday labels and intrinsic table width scroll locally under narrow text enlargement; native DateInput popup receives explicit centered viewport-bounded sizing. Calendar table scrolling is isolated in a private native wrapper with focus-ring padding, keeping month navigation and footer actions stationary; narrow headers use separate heading/navigation rows to avoid year-arrow overlap.",
         "outputs": [
           {
             "localPath": "packages/styles/src/components/button.css",
             "sha256": "1fb9acfec8e49cba884c68441f9cf57d7174a0e3a3faff994cd6a736c1099058"
           },
           {
             "localPath": "packages/styles/src/components/native-select.css",
             "sha256": "d4e94e5cee19890d7c5adf034ab634b8706dbc2daeb343e507a4804fba57a06e"
           },
           {
             "localPath": "packages/styles/src/components/modal.css",
             "sha256": "c4f341d878c4df70026faab452bc0fb4c7bb2a29b341dee871310492d81dff40"
           },
           {
             "localPath": "packages/styles/src/components/tabs.css",
             "sha256": "8ab650dbcd6a6e0c03c5959a44083e512de0936a794bed09232074a48452038e"
           },
           {
             "localPath": "packages/styles/src/components/date-input.css",
-            "sha256": "a422cd9890aaf034f85fd1d6036d7e28d14742d3f3d5d4eb36c164020a924560"
+            "sha256": "7a9bf80f3c4d64398f80604ddc96e7d18193f71d1eeebf0ae45105773793e28b"
           },
           {
             "localPath": "packages/styles/src/components/calendar.css",
-            "sha256": "ea3717a59b4419adec0fde2d8c5e0488561a218380a98433060c1b23d311c91a"
+            "sha256": "4603faf56e949424d19a2b43a081abf94aa14173ff9db3980c8e3ed7363ddbee"
           },
           {
             "localPath": "packages/styles/dist/all.css",
-            "sha256": "92f4b428868068eedc7b6bbf11750c038e8418a667d44e55ed61408cb9d9965d"
+            "sha256": "56a4458e7efe5940cc1eeb34e5cbe77444a3254a8f64b2028abe55b46bf3e38a"
           },
           {
             "localPath": "packages/styles/dist/button.css",
-            "sha256": "f86828628aac5013198ee17c0ceafb1efcdda539279d639764673fc0e9c81702"
+            "sha256": "b51970b3d60c05dc116236c0ee86c6c9aa2f08c49f64f5ef5efcf873a8383af3"
           },
           {
             "localPath": "packages/styles/dist/native-select.css",
-            "sha256": "73ce032e17dc6ef9c4d6fcdf5008b9d81de0a4752994631880fb4fcfd4abe7fa"
+            "sha256": "d0b646a0f9dc0b204a53af50fa6de64745968260290e1e6c913b5295c0416fd6"
           },
           {
             "localPath": "packages/styles/dist/modal.css",
-            "sha256": "f3bce9586eb96fa86428424eef551dc7474dda6ff9a2973e2e13a320280ca5e7"
+            "sha256": "688ef8299de1eac5de8de162e8d694125d948ad0b155fd82a66d739e9eb92f4f"
           },
           {
             "localPath": "packages/styles/dist/tabs.css",
-            "sha256": "5fe401a46fb64e554d2699a09119590bd45eda93abf9323cf294eeada2be78bf"
+            "sha256": "01d3232d6bf0e8e25c827ce88201ee9a9ba05d4a3593d09f158f67347759506e"
           },
           {
             "localPath": "packages/styles/dist/date-input.css",
-            "sha256": "031d0232556ad5052bd3775406cac82a46937d7b75593fe4a985f5a8c8c63e2e"
+            "sha256": "af2c060b5f23a323db51df94c9a6ae5adfe98c418d099213ff759a2392c902eb"
           },
           {
             "localPath": "packages/styles/dist/calendar.css",
-            "sha256": "188d063996fd484e80c4733744692897f60134f17bad07aaa14d4d3f6bc77a3e"
+            "sha256": "c764e30690ff10c1b9ad77bc05359e03b4bc6ed6695f67b3282968a760beb4de"
           },
           {
             "localPath": "packages/styles/dist/lit.js",
-            "sha256": "eb66fde5a9b7cd3e0514b0cba181865553c100f0ffdec9be97e7956e11f9dcc4"
+            "sha256": "8e373373f317b7301332a4737ebfc65185b211600f7dbc94c407100099ff615b"
           }
         ]
       }
     },
     {
       "id": "resources/css/token/krds_tokens.css",
       "sourcePath": "resources/css/token/krds_tokens.css",
       "sourceUrl": "https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/token/krds_tokens.css",
       "gitCommit": "d6bb184c823e4757f05807ea4646a23e3133b6e6",
       "gitBlobSha1": "1dbf354b60dfe6808823b4878b3f15c05dae6b3f",
@@ -2269,49 +2269,49 @@
       "derivation": {
         "task": "T04",
         "changeSummary": "Preserved every original CSS custom-property name, literal value and alias in generated token declarations; added :host targeting for shadow roots and embedded declarations in component/all CSS and plain strings. No official token values re-estimated.",
         "outputs": [
           {
             "localPath": "packages/tokens/dist/tokens.css",
             "sha256": "fb2cff0a7654e14c553c218368fedbbec508634a1ad5226da38018c502510d47"
           },
           {
             "localPath": "packages/styles/dist/all.css",
-            "sha256": "92f4b428868068eedc7b6bbf11750c038e8418a667d44e55ed61408cb9d9965d"
+            "sha256": "56a4458e7efe5940cc1eeb34e5cbe77444a3254a8f64b2028abe55b46bf3e38a"
           },
           {
             "localPath": "packages/styles/dist/button.css",
-            "sha256": "f86828628aac5013198ee17c0ceafb1efcdda539279d639764673fc0e9c81702"
+            "sha256": "b51970b3d60c05dc116236c0ee86c6c9aa2f08c49f64f5ef5efcf873a8383af3"
           },
           {
             "localPath": "packages/styles/dist/native-select.css",
-            "sha256": "73ce032e17dc6ef9c4d6fcdf5008b9d81de0a4752994631880fb4fcfd4abe7fa"
+            "sha256": "d0b646a0f9dc0b204a53af50fa6de64745968260290e1e6c913b5295c0416fd6"
           },
           {
             "localPath": "packages/styles/dist/modal.css",
-            "sha256": "f3bce9586eb96fa86428424eef551dc7474dda6ff9a2973e2e13a320280ca5e7"
+            "sha256": "688ef8299de1eac5de8de162e8d694125d948ad0b155fd82a66d739e9eb92f4f"
           },
           {
             "localPath": "packages/styles/dist/tabs.css",
-            "sha256": "5fe401a46fb64e554d2699a09119590bd45eda93abf9323cf294eeada2be78bf"
+            "sha256": "01d3232d6bf0e8e25c827ce88201ee9a9ba05d4a3593d09f158f67347759506e"
           },
           {
             "localPath": "packages/styles/dist/date-input.css",
-            "sha256": "031d0232556ad5052bd3775406cac82a46937d7b75593fe4a985f5a8c8c63e2e"
+            "sha256": "af2c060b5f23a323db51df94c9a6ae5adfe98c418d099213ff759a2392c902eb"
           },
           {
             "localPath": "packages/styles/dist/calendar.css",
-            "sha256": "188d063996fd484e80c4733744692897f60134f17bad07aaa14d4d3f6bc77a3e"
+            "sha256": "c764e30690ff10c1b9ad77bc05359e03b4bc6ed6695f67b3282968a760beb4de"
           },
           {
             "localPath": "packages/styles/dist/lit.js",
-            "sha256": "eb66fde5a9b7cd3e0514b0cba181865553c100f0ffdec9be97e7956e11f9dcc4"
+            "sha256": "8e373373f317b7301332a4737ebfc65185b211600f7dbc94c407100099ff615b"
           }
         ]
       }
     },
     {
       "id": "resources/js/component/ui-script.js",
       "sourcePath": "resources/js/component/ui-script.js",
       "sourceUrl": "https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/js/component/ui-script.js",
       "gitCommit": "d6bb184c823e4757f05807ea4646a23e3133b6e6",
       "gitBlobSha1": "ab6f9ab62d2db27c98e60cbb4be2256928a07a22",
@@ -2390,49 +2390,49 @@
           {
             "localPath": "packages/tokens/dist/index.js",
             "sha256": "78c5eee2a2554e490001f166906fb98d5a2748459b8feb594911ace70d05977c"
           },
           {
             "localPath": "packages/tokens/dist/index.d.ts",
             "sha256": "f91fe779f4630e4eceac6d0f662eb0faea9e5ada92fc9304b41f0c7ab8125d85"
           },
           {
             "localPath": "packages/styles/dist/all.css",
-            "sha256": "92f4b428868068eedc7b6bbf11750c038e8418a667d44e55ed61408cb9d9965d"
+            "sha256": "56a4458e7efe5940cc1eeb34e5cbe77444a3254a8f64b2028abe55b46bf3e38a"
           },
           {
             "localPath": "packages/styles/dist/button.css",
-            "sha256": "f86828628aac5013198ee17c0ceafb1efcdda539279d639764673fc0e9c81702"
+            "sha256": "b51970b3d60c05dc116236c0ee86c6c9aa2f08c49f64f5ef5efcf873a8383af3"
           },
           {
             "localPath": "packages/styles/dist/native-select.css",
-            "sha256": "73ce032e17dc6ef9c4d6fcdf5008b9d81de0a4752994631880fb4fcfd4abe7fa"
+            "sha256": "d0b646a0f9dc0b204a53af50fa6de64745968260290e1e6c913b5295c0416fd6"
           },
           {
             "localPath": "packages/styles/dist/modal.css",
-            "sha256": "f3bce9586eb96fa86428424eef551dc7474dda6ff9a2973e2e13a320280ca5e7"
+            "sha256": "688ef8299de1eac5de8de162e8d694125d948ad0b155fd82a66d739e9eb92f4f"
           },
           {
             "localPath": "packages/styles/dist/tabs.css",
-            "sha256": "5fe401a46fb64e554d2699a09119590bd45eda93abf9323cf294eeada2be78bf"
+            "sha256": "01d3232d6bf0e8e25c827ce88201ee9a9ba05d4a3593d09f158f67347759506e"
           },
           {
             "localPath": "packages/styles/dist/date-input.css",
-            "sha256": "031d0232556ad5052bd3775406cac82a46937d7b75593fe4a985f5a8c8c63e2e"
+            "sha256": "af2c060b5f23a323db51df94c9a6ae5adfe98c418d099213ff759a2392c902eb"
           },
           {
             "localPath": "packages/styles/dist/calendar.css",
-            "sha256": "188d063996fd484e80c4733744692897f60134f17bad07aaa14d4d3f6bc77a3e"
+            "sha256": "c764e30690ff10c1b9ad77bc05359e03b4bc6ed6695f67b3282968a760beb4de"
           },
           {
             "localPath": "packages/styles/dist/lit.js",
-            "sha256": "eb66fde5a9b7cd3e0514b0cba181865553c100f0ffdec9be97e7956e11f9dcc4"
+            "sha256": "8e373373f317b7301332a4737ebfc65185b211600f7dbc94c407100099ff615b"
           }
         ]
       }
     }
   ],
   "externalAssetsNotCleared": [
     {
       "sourcePath": "resources/fonts/PretendardGOV-Bold.subset.woff",
       "gitBlobSha1": "8112a05c62236228c7877cc8598aa8f937c9a042",
       "sourceUrl": "https://github.com/KRDS-uiux/krds-uiux/blob/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/fonts/PretendardGOV-Bold.subset.woff",
```

## compliance/provenance.json

```diff
--- before-T06-style/compliance/provenance.json
+++ compliance/provenance.json
@@ -148,21 +148,21 @@
       "packages/styles/dist/all.css",
       "packages/styles/dist/button.css",
       "packages/styles/dist/native-select.css",
       "packages/styles/dist/modal.css",
       "packages/styles/dist/tabs.css",
       "packages/styles/dist/date-input.css",
       "packages/styles/dist/calendar.css",
       "packages/styles/dist/lit.js"
     ],
     "modified": true,
-    "changeSummary": "Reworked common foundation as scoped public attributes with focus-visible, forced colors and reduced-motion rules. Separated explicit global reset and optional installed/local font selection; omitted remote assets, original scripts and global defaults from component entries. Plain CSS strings use identical source bytes.",
+    "changeSummary": "Reworked common foundation as scoped public attributes with focus-visible, forced colors and reduced-motion rules. Separated explicit global reset and optional installed/local font selection; omitted remote assets, original scripts and global defaults from component entries. Plain CSS strings use identical source bytes. T06 native-renderer correction: decorate only nonempty errors so persistent empty polite regions remain visually empty.",
     "distributedIn": [
       "@krds-native/styles"
     ]
   },
   {
     "id": "krds-resource-resources-css-component-component.css",
     "name": "KRDS resources/css/component/component.css",
     "sourceKind": "repository-file",
     "upstreamUrl": "https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/component/component.css",
     "versionOrCommit": "d6bb184c823e4757f05807ea4646a23e3133b6e6",
@@ -193,21 +193,21 @@
       "packages/styles/dist/all.css",
       "packages/styles/dist/button.css",
       "packages/styles/dist/native-select.css",
       "packages/styles/dist/modal.css",
       "packages/styles/dist/tabs.css",
       "packages/styles/dist/date-input.css",
       "packages/styles/dist/calendar.css",
       "packages/styles/dist/lit.js"
     ],
     "modified": true,
-    "changeSummary": "Adapted six pilot styles to documented public component/part/state/variant/size attributes with native semantics left to adapters; added wrapping, constrained viewport layouts and non-color state cues. Omitted original DOM-specific classes, JavaScript, icon assets and unrelated components; generated ordinary CSS and identical runtime-free strings. Calendar in-range uses a dashed border rather than outline so the independent focus-visible outline and forced-colors Highlight focus cue remain available; range endpoints retain double borders.",
+    "changeSummary": "Adapted six pilot styles to documented public component/part/state/variant/size attributes with native semantics left to adapters; added wrapping, constrained viewport layouts and non-color state cues. Omitted original DOM-specific classes, JavaScript, icon assets and unrelated components; generated ordinary CSS and identical runtime-free strings. Calendar in-range uses a dashed border rather than outline so the independent focus-visible outline and forced-colors Highlight focus cue remain available; range endpoints retain double borders. T06 native-renderer corrections: selected Calendar dates use Canvas/ButtonText with non-color state borders in forced colors; nonwrapping digits/weekday labels and intrinsic table width scroll locally under narrow text enlargement; native DateInput popup receives explicit centered viewport-bounded sizing. Calendar table scrolling is isolated in a private native wrapper with focus-ring padding, keeping month navigation and footer actions stationary; narrow headers use separate heading/navigation rows to avoid year-arrow overlap.",
     "distributedIn": [
       "@krds-native/styles"
     ]
   },
   {
     "id": "krds-resource-resources-css-token-krds_tokens.css",
     "name": "KRDS resources/css/token/krds_tokens.css",
     "sourceKind": "repository-file",
     "upstreamUrl": "https://raw.githubusercontent.com/KRDS-uiux/krds-uiux/d6bb184c823e4757f05807ea4646a23e3133b6e6/resources/css/token/krds_tokens.css",
     "versionOrCommit": "d6bb184c823e4757f05807ea4646a23e3133b6e6",
```
