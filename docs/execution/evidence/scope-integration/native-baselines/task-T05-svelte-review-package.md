# T05 svelte exact uncommitted native scope diff

Baseline reviewed T01 app probes captured before T05. Common protocol/runners and shared root changes are separate core scope. All authored changed app source/config/tests follow; generated browser screenshots/outputs are evidence, not source.

## apps/fixture-svelte/package.json

```diff
--- base/apps/fixture-svelte/package.json
+++ apps/fixture-svelte/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/fixture-svelte",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node ../../tools/yarn.mjs test:siheom --framework svelte",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "svelte-check --tsconfig ./tsconfig.json",
     "build:local": "vite build",
-    "contract": "playwright test",
-    "siheom": "vitest run --config vitest.config.ts"
+    "contract": "node ../../tools/yarn.mjs test:contract --framework svelte",
+    "siheom": "node ../../tools/yarn.mjs test:siheom --framework svelte",
+    "siheom:local": "vitest run --config vitest.config.ts"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@siheom/core": "0.4.1",
     "@siheom/svelte": "0.3.2",
     "@sveltejs/kit": "3.1.0",
     "@sveltejs/package": "3.0.1",
     "@sveltejs/vite-plugin-svelte": "7.3.1",
     "@testing-library/dom": "10.4.2",
```

## apps/fixture-svelte/project.json

```diff
--- base/apps/fixture-svelte/project.json
+++ apps/fixture-svelte/project.json
@@ -23,32 +23,62 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-svelte typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-svelte test"
-      }
+      },
+      "cache": false,
+      "dependsOn": [
+        "build",
+        "^build"
+      ]
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-svelte lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-svelte contract"
-      }
+      },
+      "cache": false,
+      "dependsOn": [
+        "build",
+        "^build"
+      ],
+      "inputs": [
+        "default",
+        "^default",
+        "{workspaceRoot}/catalog/fixture-cases.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/tools/testing/**/*",
+        "{workspaceRoot}/tools/run-contract-tests.mjs"
+      ]
     },
     "siheom": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-svelte siheom"
-      }
+      },
+      "cache": false,
+      "dependsOn": [
+        "build",
+        "^build"
+      ],
+      "inputs": [
+        "default",
+        "^default",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/tools/run-siheom-tests.mjs"
+      ]
     }
   }
 }
```

## apps/fixture-svelte/src/App.svelte

```diff
--- base/apps/fixture-svelte/src/App.svelte
+++ apps/fixture-svelte/src/App.svelte
@@ -1,5 +1,39 @@
-<!-- T01 compiler probe; no catalog coverage. -->
 <script lang="ts">
-  import { WorkspaceProbe } from "@krds-native/svelte";
+  import { onMount } from 'svelte';
+  import { WorkspaceProbe } from '@krds-native/svelte';
+  import { createFixtureBridge } from '@krds-native/test-contracts/driver';
+  import type { FixtureBridge } from '@krds-native/test-contracts';
+
+  const componentId = decodeURIComponent(window.location.pathname.split('/')[2] ?? 'unknown');
+  const caseId = new URLSearchParams(window.location.search).get('case') ?? 'default';
+  const isProbe = componentId === '__probe' && caseId === 'native-state';
+  let ready = $state(false);
+  let probeState = $state<Record<string, unknown>>({ count: 0, label: 'Probe increment', disabled: false });
+  let bridge: FixtureBridge | undefined;
+
+  onMount(() => {
+    bridge = createFixtureBridge('svelte', isProbe ? probeState : {});
+    const unsubscribe = bridge.subscribe((next) => { probeState = next; });
+    ready = true;
+    return () => { unsubscribe(); bridge?.dispose(); };
+  });
+
+  function increment() {
+    if (!bridge || probeState.disabled) return;
+    const count = Number(probeState.count) + 1;
+    void bridge.setState({ count });
+    bridge.recordEvent('change', { value: count });
+  }
 </script>
-<WorkspaceProbe />
+
+<main>
+  <h1>Svelte native fixture</h1>
+  <WorkspaceProbe />
+  {#if ready}<p role="status" aria-label="Fixture health">ready</p>{/if}
+  {#if isProbe}
+    <button type="button" disabled={Boolean(probeState.disabled)} onclick={increment}>{String(probeState.label)}</button>
+    <p role="status" aria-label="Probe value">{String(probeState.count)}</p>
+  {:else}
+    <p role="note">Component not implemented: {componentId}/{caseId}</p>
+  {/if}
+</main>
```

## apps/fixture-svelte/tests/setup.ts

```diff
--- base/apps/fixture-svelte/tests/setup.ts
+++ apps/fixture-svelte/tests/setup.ts
@@ -0,0 +1,7 @@
+import '@testing-library/jest-dom/vitest';
+import { afterEach } from 'vitest';
+import { cleanup } from '@testing-library/svelte';
+afterEach(() => {
+  cleanup();
+  window.history.replaceState({}, '', '/');
+});
```

## apps/fixture-svelte/tests/siheom/button.test.ts

```diff
--- base/apps/fixture-svelte/tests/siheom/button.test.ts
+++ apps/fixture-svelte/tests/siheom/button.test.ts
@@ -0,0 +1,14 @@
+import { expect, test } from 'vitest';
+import { assertions, given, query, runSiheom } from '@siheom/svelte';
+import App from '../../src/App.svelte';
+
+test('disabled KRDS button remains absent after native fixture health', async () => {
+  window.history.replaceState({}, '', '/fixtures/button?case=disabled');
+  await runSiheom(
+    given.render(App),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+    assertions.textContent(query.note(''), 'Component not implemented: button/disabled'),
+  );
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('svelte');
+  await runSiheom(assertions.disabled(query.button('저장')));
+});
```

## apps/fixture-svelte/tests/siheom/native-probe.test.ts

```diff
--- base/apps/fixture-svelte/tests/siheom/native-probe.test.ts
+++ apps/fixture-svelte/tests/siheom/native-probe.test.ts
@@ -0,0 +1,52 @@
+import { beforeEach, expect, test } from 'vitest';
+import { cleanup } from '@testing-library/svelte';
+import { actions, assertions, given, query, runSiheom, defaultGivens, svelteEffects } from '@siheom/svelte';
+import { createRunSiheom, createDefaultActions, defaultAssertions } from '@siheom/core';
+import { userEvent } from 'vitest/browser';
+const runProviderSiheom = createRunSiheom({
+  givens: defaultGivens, effects: svelteEffects, assertions: defaultAssertions,
+  actions: createDefaultActions({ user: userEvent }),
+});
+import App from '../../src/App.svelte';
+
+beforeEach(() => window.history.replaceState({}, '', '/fixtures/__probe?case=native-state'));
+
+test('native Svelte render, click, controlled update and cleanup', async () => {
+  await runSiheom(
+    given.render(App),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+    assertions.textContent(query.status('Probe value'), '0'),
+    actions.click(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '1'),
+  );
+  const bridge = window.__KRDS_FIXTURE__!;
+  expect(bridge.framework).toBe('svelte');
+  expect(bridge.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }]);
+  await bridge.setState({ count: 7, label: 'Updated probe' });
+  await runSiheom(
+    assertions.textContent(query.status('Probe value'), '7'),
+    actions.click(query.button('Updated probe')),
+    assertions.textContent(query.status('Probe value'), '8'),
+  );
+  expect(bridge.getState().count).toBe(8);
+  expect(bridge.readEvents()).toEqual([
+    { name: 'change', detail: { value: 1 } },
+    { name: 'change', detail: { value: 8 } },
+  ]);
+  await bridge.setState({ disabled: true });
+  await runSiheom(assertions.disabled(query.button('Updated probe')));
+  cleanup();
+  expect(document.querySelector('button')).toBeNull();
+  expect(window.__KRDS_FIXTURE__).toBeUndefined();
+});
+
+test('siheom Playwright provider click focuses the native button', async () => {
+  await runProviderSiheom(given.render(App));
+  let trusted = false;
+  document.querySelector('button')!.addEventListener('click', (event) => { trusted = event.isTrusted; }, { once: true });
+  await runProviderSiheom(
+    actions.click(query.button('Probe increment')),
+    assertions.focused(query.button('Probe increment')),
+  );
+  expect(trusted).toBe(true);
+});
```

## apps/fixture-svelte/tsconfig.json

```diff
--- base/apps/fixture-svelte/tsconfig.json
+++ apps/fixture-svelte/tsconfig.json
@@ -2,13 +2,15 @@
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ]
   },
   "include": [
     "src/**/*.ts",
     "src/**/*.tsx",
-    "src/**/*.svelte"
+    "src/**/*.svelte",
+    "tests/**/*.ts",
+    "vitest.config.ts"
   ]
 }
```

## apps/fixture-svelte/vitest.config.ts

```diff
--- base/apps/fixture-svelte/vitest.config.ts
+++ apps/fixture-svelte/vitest.config.ts
@@ -1,4 +1,21 @@
 import { defineConfig } from 'vitest/config';
 import { playwright } from '@vitest/browser-playwright';
 import { svelte } from '@sveltejs/vite-plugin-svelte';
-export default defineConfig({ plugins: [svelte()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
+
+export default defineConfig({
+  plugins: [svelte()],
+  test: {
+    include: process.env.KRDS_TEST_MODE === 'probe'
+      ? ['tests/siheom/native-probe.test.ts']
+      : ['tests/siheom/button.test.ts'],
+    setupFiles: ['./tests/setup.ts'],
+    passWithNoTests: false,
+    browser: {
+      enabled: true,
+      provider: playwright(),
+      headless: true,
+      instances: [{ browser: 'chromium' }],
+      viewport: { width: 1280, height: 800 },
+    },
+  },
+});
```

## apps/storybook-svelte/.storybook/main.ts

```diff
--- base/apps/storybook-svelte/.storybook/main.ts
+++ apps/storybook-svelte/.storybook/main.ts
@@ -1 +1,9 @@
-export default { framework: '@storybook/svelte-vite', stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], core: { disableTelemetry: true } };
+import { createRequire } from 'node:module';
+import { dirname } from 'node:path';
+const require = createRequire(import.meta.url);
+export default {
+  framework: { name: dirname(require.resolve('@storybook/svelte-vite/package.json')), options: {} },
+  stories: ['../src/stories/**/*.stories.ts'],
+  addons: [],
+  core: { disableTelemetry: true },
+};
```

## apps/storybook-svelte/package.json

```diff
--- base/apps/storybook-svelte/package.json
+++ apps/storybook-svelte/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/storybook-svelte",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node ../../tools/yarn.mjs test:stories --framework svelte",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "svelte-check --tsconfig ./tsconfig.json",
     "build:local": "storybook build --output-dir dist",
     "storybook-build": "storybook build --output-dir dist",
-    "stories": "playwright test"
+    "stories": "node ../../tools/yarn.mjs test:stories --framework svelte",
+    "storybook-build:local": "storybook build --output-dir dist"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@storybook/svelte-vite": "10.6.5",
     "@sveltejs/kit": "3.1.0",
     "@sveltejs/package": "3.0.1",
     "@sveltejs/vite-plugin-svelte": "7.3.1",
     "@types/node": "24.13.3",
     "@types/react": "19.3.0",
```

## apps/storybook-svelte/project.json

```diff
--- base/apps/storybook-svelte/project.json
+++ apps/storybook-svelte/project.json
@@ -23,32 +23,57 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-svelte typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-svelte test"
-      }
+      },
+      "cache": false,
+      "dependsOn": [
+        "build",
+        "^build"
+      ]
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-svelte lint"
       }
     },
     "storybook-build": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-svelte storybook-build"
-      }
+        "command": "node tools/yarn.mjs workspace @krds-native/storybook-svelte storybook-build:local"
+      },
+      "dependsOn": [
+        "^build"
+      ],
+      "outputs": [
+        "{projectRoot}/dist"
+      ]
     },
     "stories": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-svelte stories"
-      }
+      },
+      "cache": false,
+      "dependsOn": [
+        "storybook-build",
+        "^build"
+      ],
+      "inputs": [
+        "default",
+        "^default",
+        "{workspaceRoot}/catalog/story-cases.json",
+        "{workspaceRoot}/catalog/story-coverage.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/tools/testing/**/*",
+        "{workspaceRoot}/tools/run-story-tests.mjs"
+      ]
     }
   }
 }
```

## apps/storybook-svelte/src/stories/NativeProbe.svelte

```diff
--- base/apps/storybook-svelte/src/stories/NativeProbe.svelte
+++ apps/storybook-svelte/src/stories/NativeProbe.svelte
@@ -0,0 +1,15 @@
+<script lang="ts">
+  // Infrastructure only; no KRDS component coverage.
+  import { WorkspaceProbe } from '@krds-native/svelte';
+  let { count = 0, label = 'Probe increment', disabled = false, loading = false, errorMessage = '' }: {
+    count?: number; label?: string; disabled?: boolean; loading?: boolean; errorMessage?: string;
+  } = $props();
+</script>
+
+<WorkspaceProbe />
+{#if errorMessage}
+  <p role="alert">{errorMessage}</p>
+{:else}
+  <button type="button" disabled={disabled || loading} onclick={() => { count += 1; }}>{label}</button>
+  <p role="status" aria-label="Probe value">{count}</p>
+{/if}
```

## apps/storybook-svelte/src/stories/probe.stories.ts

```diff
--- base/apps/storybook-svelte/src/stories/probe.stories.ts
+++ apps/storybook-svelte/src/stories/probe.stories.ts
@@ -1,4 +1,18 @@
-/** Toolchain probe: excluded from KRDS catalog/story coverage. */
-import { WorkspaceProbe } from '@krds-native/svelte';
-export default { title: 'Bootstrap/T01 probe', component: WorkspaceProbe };
-export const Probe = { args: {} };
+import type { Meta, StoryObj } from '@storybook/svelte-vite';
+import type { StoryStateCase } from '@krds-native/test-contracts';
+import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
+import NativeProbe from './NativeProbe.svelte';
+
+const meta = { title: 'Infrastructure/Native probe', component: NativeProbe, excludeStories: ['canonicalPilotStates'] } satisfies Meta<typeof NativeProbe>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+function state(id: string): Story['args'] {
+  const fixture: StoryStateCase | undefined = infrastructureStoryCases.find((item) => item.id === id);
+  if (!fixture) throw new globalThis.Error(`Missing infrastructure story state: ${id}`);
+  return fixture.state;
+}
+// Canonical states remain separate until the owning KRDS implementation tasks supply their stories.
+export const canonicalPilotStates: readonly StoryStateCase[] = storyStateCases;
+export const Default: Story = { args: state('infrastructure-native-probe--default') };
+export const Loading: Story = { args: state('infrastructure-native-probe--loading') };
+export const Error: Story = { args: state('infrastructure-native-probe--error') };
```

## apps/storybook-svelte/tsconfig.json

```diff
--- base/apps/storybook-svelte/tsconfig.json
+++ apps/storybook-svelte/tsconfig.json
@@ -2,13 +2,14 @@
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ]
   },
   "include": [
     "src/**/*.ts",
     "src/**/*.tsx",
-    "src/**/*.svelte"
+    "src/**/*.svelte",
+    ".storybook/**/*.ts"
   ]
 }
```
