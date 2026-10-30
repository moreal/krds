# Candidate compatibility — 0.0.0

Status: **intermediate**. M1: **blocked**; M2: **blocked**. Declared pins below are targets; the actual execution gates remain authoritative in [verification.json](./verification.json).

| Framework | Channel | Exact declared pins |
| --- | --- | --- |
| react | stable target | react@19.3.1, react-dom@19.3.1, @vitejs/plugin-react@6.1.2, @types/react@19.3.0, @types/react-dom@19.3.0 |
| solid | stable target | solid-js@1.9.18, vite-plugin-solid@2.11.14, babel-preset-solid@1.9.16, @babel/core@7.28.5 |
| svelte | stable target | svelte@5.57.3, @sveltejs/package@3.0.1, @sveltejs/kit@3.1.0, @sveltejs/vite-plugin-svelte@7.3.1, svelte-check@4.7.7 |
| vue | stable target | vue@3.5.44, @vue/compiler-sfc@3.5.44, @vitejs/plugin-vue@6.0.10, vue-tsc@3.3.14 |
| lit | stable target | lit@3.3.3, @lit-labs/ssr@4.1.0, @lit-labs/ssr-client@1.1.8 |
| qwik | stable target | @builder.io/qwik@1.20.3, @builder.io/qwik-city@1.20.3 |
| angular | stable target | @angular/core@22.2.4, @angular/compiler@22.2.4, @angular/compiler-cli@22.2.4, @angular/cli@22.2.5, @angular/build@22.2.5, @angular-devkit/build-angular@22.2.5, @angular/ssr@22.2.5, ng-packagr@22.2.5, @angular/common@22.2.4, @angular/forms@22.2.4, @angular/router@22.2.4, @angular/platform-browser@22.2.4, @angular/platform-browser-dynamic@22.2.4, @angular/platform-server@22.2.4, @angular/animations@22.2.4, @angular-devkit/core@22.2.5, @angular-devkit/architect@0.2202.5, rxjs@7.8.2, zone.js@0.16.3, tslib@2.8.1 |
| solid-next | six-pilot RC19 preview | solid-js@2.0.0-rc.19, @solidjs/web@2.0.0-rc.19, @solidjs/compiler@2.0.0-rc.19, @solidjs/babel-plugin@2.0.0-rc.19, @solidjs/vite-plugin@3.0.0-next.53, @babel/core@7.28.5, @babel/preset-typescript@7.28.5 |

Solid 2 covers only Button, NativeSelect, Modal, Tabs, DateInput and Calendar with exact 2.0.0-rc.19 runtime/compiler. Full stable catalog support and unsupported siheom adapters are not implied. Chromium/Firefox/WebKit and UTC/Asia/Seoul/America/Los_Angeles results require current native matrix snapshots; metadata-only audits do not pass. Authentic assistive-technology, media-equivalence, real zoom, forced-colors and visibility review remains separate.
