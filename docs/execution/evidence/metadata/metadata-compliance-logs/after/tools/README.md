# Workspace bootstrap

Use `node tools/yarn.mjs <arguments>` from the repository root. The wrapper launches the vendored Yarn 4.14.1 with the selected Node 24.18.0 binary from `compatibility/toolchain.json`, and puts that Node first on the child PATH. If the current Node already matches, it uses the current executable, so another machine can use its own Node 24.18.0 installation. It does not change global tools. The root workspace pins Corepack 0.36.0; inspect it with `node tools/yarn.mjs exec corepack --version`. The machine's preexisting Corepack 0.35.0 shim is deliberately bypassed.

```sh
node tools/yarn.mjs install --immutable
node tools/yarn.mjs verify:workspace
node tools/yarn.mjs test:workspace
node tools/yarn.mjs nx show projects
node tools/yarn.mjs nx run krds-contracts:build
node tools/yarn.mjs nx run krds-contracts:typecheck
node tools/yarn.mjs nx run krds-contracts:test
```

Nx targets also call this wrapper: a bare `yarn` inside a generic command executor would otherwise invoke the unprepared global Corepack shim. Node entry scripts reject a mismatching Node version. `lint` is the repository's dependency/import-boundary and configuration check; it does not claim stylistic lint coverage. Bootstrap tests verify that directly selected tool/runtime packages resolve to their exact versions from each workspace's symlink environment. The contracts workspace additionally runs Vitest 4.1.10, ready for T02's semantic tests.

All source entries and stories created by T01 are labeled compiler probes, excluded from catalog coverage. Shared asset/font probes contain no upstream asset payload. Fixture `contract`, `siheom`, and Storybook `stories` targets invoke real Playwright/Vitest runners. Their behavioral suites are owned by later tasks; absent tests fail normally. There is no Lit or Solid 2 siheom target because upstream does not support those combinations. Storybook Solid 2 uses a workspace-local `vite-plugin-solid` alias to the exact official `@solidjs/vite-plugin@3.0.0-next.53` for the community integration's peer name; its static/browser integration remains unverified. Svelte fixture apps are native Vite/Svelte compiler probes; they are not evidence of the later SvelteKit production-consumer gate. Qwik's library build needs `vite build --mode lib`; the selected optimizer infers its target from that mode. SSR/resume/first interaction are separate later gates.

The exact `.yarnrc.yml` `packageExtensions` add missing peer forwarding in `@nx/js`, Angular's compatibility library builder, native Vue/Lit Storybook integrations, Vue Testing Library, the Qwik community Storybook integration, and Storybook's React-based manager UI. Every consumer declares the actual versions itself. These extensions do not replace runtime packages or override versions. React in a non-React Storybook manifest serves the Storybook manager, not the native preview renderer.

Eight transitive peer warnings remain, with full `yarn explain peer-requirements` output in the T01 report logs:

- `p88ede4`, `pae8a39`, `p1ef116`, `p53213c`, `pdf6714`, `p475665`: VitePress 1.6.4's DocSearch/Algolia dependency tree does not forward `@algolia/client-search`, `algoliasearch`, and `search-insights`. This scaffold does not configure Algolia/DocSearch or remote search. These are unused feature paths, not claims that the published peers are satisfied. Revisit before enabling that feature.
- `p87e785`, `p85c163`: optional `@oxc-parser/binding-wasm32-wasi@0.150.0` provides `@emnapi/{core,runtime}@2.0.0-alpha.3`, while its runtime requests `^1.7.1 || 2.0.0-beta.2`. The selected macOS ARM64 native binding is used here. WASI/fallback-platform support is not verified.

Yarn reports that its pnpm linker cannot provide different workspace peer versions. The direct-resolution bootstrap tests verify Solid 1.9.18 and Solid 2.0.0-rc.19 (including `@solidjs/web`/compiler/plugin), and Qwik's Vite 7.3.1 versus Vite 8.3.5, separately in each workspace. No root resolutions are allowed. Independent tarball consumers and framework browser/SSR checks remain necessary.

The environment disables dependency build scripts. Nx, Angular, Qwik and Vite native probes executed successfully using the installed platform packages; no global build-script policy was changed. The Angular application builder exited 129 at startup within the sandbox and passed outside it, with `NG_BUILD_MAX_WORKERS=2`. The full Nx verification command therefore needs that environment's local-build approval. The Angular library build uses the T00-selected official `@angular-devkit/build-angular:ng-packagr` compatibility builder; Angular 22 warns that this name is deprecated in favor of `@angular/build:ng-packagr`. It still produces partial compilation, FESM2022 and declarations. ng-packagr replaces the source workspace's `dist/` export paths with paths relative to its APF output and emits an expected override warning.

No package is authorized for publishing. User-confirmed independent-code metadata is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com>, with the completed MIT grant in LICENSES/MIT.txt; KRDS and third-party materials retain their original conditions. The user selected scope @unofficial-krds and repository https://github.com/moreal/krds; naming metadata does not prove account ownership. Atomic scope integration and the remaining candidate checks are separate from publication authorization. See compliance/project-identity.json and compliance/metadata-evidence.json.
