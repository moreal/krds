# Framework compatibility

Versions, peer ranges and support states are generated from the current native package manifests, compatibility targets and coverage records. A stable **target** is not a declaration that all 54 components have passed acceptance. Independent review, behavioral evidence, visuals, source rights and isolated consumption remain separate gates.

| Native renderer | Package | Selected runtime/compiler | Public peers | Recorded coverage |
| --- | --- | --- | --- | --- |
| React native JSX | `@unofficial-krds/react@0.1.0` | `react@19.3.1`<br>`react-dom@19.3.1`<br>`@vitejs/plugin-react@6.1.2`<br>`@types/react@19.3.0`<br>`@types/react-dom@19.3.0` | `react@^19.3.1`<br>`react-dom@^19.3.1` | 54 planned |
| Solid 1 native JSX | `@unofficial-krds/solid@0.1.0` | `solid-js@1.9.18`<br>`vite-plugin-solid@2.11.14`<br>`babel-preset-solid@1.9.16`<br>`@babel/core@7.28.5` | `solid-js@^1.9.18` | 48 planned, 6 implemented |
| Svelte 5 native source/snippets | `@unofficial-krds/svelte@0.1.0` | `svelte@5.57.3`<br>`@sveltejs/package@3.0.1`<br>`@sveltejs/kit@3.1.0`<br>`@sveltejs/vite-plugin-svelte@7.3.1`<br>`svelte-check@4.7.7` | `svelte@^5.57.3` | 54 planned |
| Vue 3 native SFC/slots | `@unofficial-krds/vue@0.1.0` | `vue@3.5.44`<br>`@vue/compiler-sfc@3.5.44`<br>`@vitejs/plugin-vue@6.0.10`<br>`vue-tsc@3.3.14` | `vue@^3.5.44` | 54 planned |
| Lit native custom elements/DOM events | `@unofficial-krds/lit@0.1.0` | `lit@3.3.3`<br>`@lit-labs/ssr@4.1.0`<br>`@lit-labs/ssr-client@1.1.8` | `lit@^3.3.3` | 54 planned |
| Qwik 1 native component$/QRL | `@unofficial-krds/qwik@0.1.0` | `@builder.io/qwik@1.20.3`<br>`@builder.io/qwik-city@1.20.3` | `@builder.io/qwik@^1.20.3` | 54 planned |
| Angular 22 native standalone components/inputs/outputs | `@unofficial-krds/angular@0.1.0` | `@angular/core@22.2.4`<br>`@angular/compiler@22.2.4`<br>`@angular/compiler-cli@22.2.4`<br>`@angular/cli@22.2.5`<br>`@angular/build@22.2.5`<br>`@angular-devkit/build-angular@22.2.5`<br>`@angular/ssr@22.2.5`<br>`ng-packagr@22.2.5`<br>`@angular/common@22.2.4`<br>`@angular/forms@22.2.4`<br>`@angular/router@22.2.4`<br>`@angular/platform-browser@22.2.4`<br>`@angular/platform-browser-dynamic@22.2.4`<br>`@angular/platform-server@22.2.4`<br>`@angular/animations@22.2.4`<br>`@angular-devkit/core@22.2.5`<br>`@angular-devkit/architect@0.2202.5`<br>`rxjs@7.8.2`<br>`zone.js@0.16.3`<br>`tslib@2.8.1` | `@angular/common@^22.2.4`<br>`@angular/core@^22.2.4`<br>`@angular/forms@^22.2.4` | 54 planned |
| Solid 2 native runtime and @solidjs/web renderer · **preview** | `@unofficial-krds/solid-next@0.1.0-preview.0` | `solid-js@2.0.0-rc.19`<br>`@solidjs/web@2.0.0-rc.19`<br>`@solidjs/compiler@2.0.0-rc.19`<br>`@solidjs/babel-plugin@2.0.0-rc.19`<br>`@solidjs/vite-plugin@3.0.0-next.53`<br>`@babel/core@7.28.5`<br>`@babel/preset-typescript@7.28.5` | `@solidjs/web@2.0.0-rc.19`<br>`solid-js@2.0.0-rc.19` | 54 planned |

## What the evidence means

`planned` reserves work. `in-progress` records active work. `implemented` records implementation without full acceptance. `blocked` records an unresolved gate. `verified` requires the controller-owned native evidence and independent review defined by the coverage schema. Preview is isolated from stable totals. See each component for its recorded state.

## Package and browser boundaries

Qwik uses Vite 7; the other selected native Vite workspaces use Vite 8. Angular owns its CLI/ng-packagr partial APF output and CVA forms. Solid 1 and Solid 2 have isolated runtime, compiler and renderer graphs. Svelte 2/3 are not current stable targets. The declared peer range is not evidence that every version within it has been tested.

[Native examples and compiler evidence](./examples) · [Solid 1 → 2](./solid-migration) · [Testing roles](../getting-started/testing)
