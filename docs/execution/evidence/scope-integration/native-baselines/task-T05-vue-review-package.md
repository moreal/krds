# T05 vue exact uncommitted native scope diff

Baseline reviewed T01 app probes captured before T05. Common protocol/runners and shared root changes separately reviewed. All authored changed app source/config/tests follow; generated browser screenshots/outputs are evidence, not source.

## apps/fixture-vue/package.json

```diff
--- base/apps/fixture-vue/package.json
+++ apps/fixture-vue/package.json
@@ -1,37 +1,39 @@
 {
   "name": "@krds-native/fixture-vue",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "yarn siheom:local",
     "lint": "node ../../tools/check-workspace.mjs",
-    "typecheck": "tsc -p tsconfig.json --noEmit",
+    "typecheck": "vue-tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
-    "contract": "playwright test",
-    "siheom": "vitest run --config vitest.config.ts"
+    "contract": "node ../../tools/run-contract-tests.mjs --framework vue",
+    "siheom": "node ../../tools/run-siheom-tests.mjs --framework vue",
+    "siheom:local": "vitest run --config vitest.config.ts"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@siheom/core": "0.4.1",
     "@siheom/vue": "0.3.2",
     "@testing-library/dom": "10.4.2",
     "@testing-library/jest-dom": "7.0.1",
     "@testing-library/user-event": "14.6.8",
     "@testing-library/vue": "8.1.0",
     "@types/node": "24.13.3",
     "@vitejs/plugin-vue": "6.0.10",
     "@vitest/browser-playwright": "4.1.10",
     "@vue/compiler-dom": "3.5.44",
     "@vue/compiler-sfc": "3.5.44",
+    "@vue/server-renderer": "3.5.44",
     "playwright": "1.64.1",
     "playwright-core": "1.64.1",
     "typescript": "6.0.2",
     "vite": "8.3.5",
     "vitest": "4.1.10",
     "vue": "3.5.44",
     "vue-tsc": "3.3.14"
   },
   "dependencies": {
     "@krds-native/styles": "workspace:^",
```

## apps/fixture-vue/playwright.config.ts

```diff
--- base/apps/fixture-vue/playwright.config.ts
+++ apps/fixture-vue/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/contract', use: { baseURL: 'http://127.0.0.1:4173' } });
```

## apps/fixture-vue/project.json

```diff
--- base/apps/fixture-vue/project.json
+++ apps/fixture-vue/project.json
@@ -34,21 +34,51 @@
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-vue lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-vue contract"
-      }
+        "command": "node tools/yarn.mjs test:contract --framework vue"
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
+        "{workspaceRoot}/tools/run-contract-tests.mjs",
+        "{workspaceRoot}/tools/run-siheom-tests.mjs"
+      ]
     },
     "siheom": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-vue siheom"
-      }
+        "command": "node tools/yarn.mjs test:siheom --framework vue"
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
+        "{workspaceRoot}/tools/run-contract-tests.mjs",
+        "{workspaceRoot}/tools/run-siheom-tests.mjs"
+      ]
     }
   }
 }
```

## apps/fixture-vue/src/FixtureApp.ts

```diff
--- base/apps/fixture-vue/src/FixtureApp.ts
+++ apps/fixture-vue/src/FixtureApp.ts
@@ -0,0 +1,33 @@
+/** Test infrastructure only: no KRDS component coverage. */
+import { defineComponent, h, onUnmounted, shallowRef } from 'vue';
+import { WorkspaceProbe } from '@krds-native/vue';
+import { createFixtureBridge } from '@krds-native/test-contracts/driver';
+
+export const FixtureApp = defineComponent({
+  name: 'FixtureApp',
+  setup() {
+    const url = new URL(window.location.href);
+    const componentId = decodeURIComponent(url.pathname.split('/')[2] ?? '');
+    const caseId = url.searchParams.get('case') ?? '';
+    const isProbe = componentId === '__probe' && caseId === 'native-state';
+    const bridge = createFixtureBridge('vue', isProbe ? { count: 0, label: 'Probe increment', disabled: false } : {});
+    const state = shallowRef<Record<string, unknown>>(bridge.getState());
+    const unsubscribe = bridge.subscribe(next => { state.value = next; });
+    onUnmounted(() => { unsubscribe(); bridge.dispose(); });
+    function increment() {
+      const count = Number(state.value.count) + 1;
+      void bridge.setState({ count });
+      bridge.recordEvent('change', { value: count });
+    }
+    return () => h('main', [
+      h('div', { role: 'status', 'aria-label': 'Fixture health' }, 'ready'),
+      isProbe
+        ? h('section', { 'aria-label': 'Test infrastructure probe' }, [
+          h('button', { type: 'button', disabled: Boolean(state.value.disabled), onClick: increment }, String(state.value.label)),
+          h('div', { role: 'status', 'aria-label': 'Probe value' }, String(state.value.count)),
+        ])
+        : h('p', { role: 'note' }, `Component not implemented: ${componentId}/${caseId}`),
+      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(WorkspaceProbe)]),
+    ]);
+  },
+});
```

## apps/fixture-vue/src/main.ts

```diff
--- base/apps/fixture-vue/src/main.ts
+++ apps/fixture-vue/src/main.ts
@@ -1,4 +1,5 @@
-/** T01 toolchain probe only; no component coverage. */
 import { createApp } from 'vue';
-import { WorkspaceProbe } from '@krds-native/vue';
-createApp(WorkspaceProbe).mount('#app');
+import { FixtureApp } from './FixtureApp';
+const app = createApp(FixtureApp);
+app.mount('#app');
+window.addEventListener('pagehide', () => app.unmount(), { once: true });
```

## apps/fixture-vue/tests/setup.ts

```diff
--- base/apps/fixture-vue/tests/setup.ts
+++ apps/fixture-vue/tests/setup.ts
@@ -0,0 +1,4 @@
+import '@testing-library/jest-dom/vitest';
+import { afterEach } from 'vitest';
+import { cleanup } from '@testing-library/vue';
+afterEach(() => cleanup());
```

## apps/fixture-vue/tests/siheom/button.test.ts

```diff
--- base/apps/fixture-vue/tests/siheom/button.test.ts
+++ apps/fixture-vue/tests/siheom/button.test.ts
@@ -0,0 +1,13 @@
+/** Canonical pilot behavior remains RED until the owning component task ships. */
+import { expect, test } from 'vitest';
+import { actions, assertions, given, query, runSiheom } from '@siheom/vue';
+import { FixtureApp } from '../../src/FixtureApp';
+
+test('button/disabled: healthy route must expose the actual disabled KRDS button', async () => {
+  history.replaceState(null, '', '/fixtures/button?case=disabled');
+  await runSiheom(given.render(FixtureApp), assertions.textContent(query.status('Fixture health'), 'ready'));
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('vue');
+  await window.__KRDS_FIXTURE__!.setState({ disabled: true, label: '저장' });
+  await runSiheom(assertions.disabled(query.button('저장')), actions.click(query.button('저장')));
+  expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
+});
```

## apps/fixture-vue/tests/siheom/native-probe.test.ts

```diff
--- base/apps/fixture-vue/tests/siheom/native-probe.test.ts
+++ apps/fixture-vue/tests/siheom/native-probe.test.ts
@@ -0,0 +1,47 @@
+/** Actual @siheom/vue rendering; default adapter input is synthetic user-event. */
+import { expect, test } from 'vitest';
+import { page } from 'vitest/browser';
+import { cleanup } from '@testing-library/vue';
+import { screen } from '@testing-library/dom';
+import { actions, assertions, given, query, runSiheom } from '@siheom/vue';
+import { FixtureApp } from '../../src/FixtureApp';
+
+function openProbe() {
+  history.replaceState(null, '', '/fixtures/__probe?case=native-state');
+}
+
+test('native render, click, controlled state, disabled input and cleanup', async () => {
+  openProbe();
+  await runSiheom(
+    given.render(FixtureApp),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+    assertions.textContent(query.status('Probe value'), '0'),
+    actions.click(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '1'),
+  );
+  const bridge = window.__KRDS_FIXTURE__!;
+  expect(bridge.framework).toBe('vue');
+  expect(bridge.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }]);
+  await bridge.setState({ count: 7, label: 'Updated probe' });
+  await runSiheom(
+    assertions.textContent(query.status('Probe value'), '7'),
+    actions.click(query.button('Updated probe')),
+    assertions.textContent(query.status('Probe value'), '8'),
+  );
+  expect(bridge.getState().count).toBe(8);
+  await bridge.setState({ disabled: true });
+  await runSiheom(assertions.disabled(query.button('Updated probe')), actions.click(query.button('Updated probe')));
+  expect(bridge.getState().count).toBe(8);
+  expect(bridge.readEvents()).toHaveLength(2);
+  cleanup();
+  expect(screen.queryByRole('button', { name: 'Updated probe' })).toBeNull();
+  expect(window.__KRDS_FIXTURE__).toBeUndefined();
+  expect(() => bridge.recordEvent('late', {})).toThrow('disposed');
+});
+
+test('real provider click focus is checked separately with the published adapter', async () => {
+  openProbe();
+  await runSiheom(given.render(FixtureApp));
+  await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
+  await runSiheom(assertions.focused(query.button('Probe increment')));
+});
```

## apps/fixture-vue/tsconfig.json

```diff
--- base/apps/fixture-vue/tsconfig.json
+++ apps/fixture-vue/tsconfig.json
@@ -1,13 +1,16 @@
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ]
   },
   "include": [
     "src/**/*.ts",
-    "src/**/*.tsx"
+    "src/**/*.tsx",
+    "tests/**/*.ts",
+    "*.config.ts",
+    ".storybook/**/*.ts"
   ]
 }
```

## apps/fixture-vue/vitest.config.ts

```diff
--- base/apps/fixture-vue/vitest.config.ts
+++ apps/fixture-vue/vitest.config.ts
@@ -1,4 +1,15 @@
 import { defineConfig } from 'vitest/config';
 import { playwright } from '@vitest/browser-playwright';
 import vue from '@vitejs/plugin-vue';
-export default defineConfig({ plugins: [vue()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
+export default defineConfig({
+  plugins: [vue()],
+  test: {
+    include: process.env.KRDS_TEST_MODE === 'probe'
+      ? ['tests/siheom/native-probe.test.ts']
+      : ['tests/siheom/*.test.ts'],
+    exclude: process.env.KRDS_TEST_MODE === 'probe' ? [] : ['tests/siheom/native-probe.test.ts'],
+    setupFiles: ['tests/setup.ts'],
+    passWithNoTests: false,
+    browser: { enabled: true, provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }), headless: true, viewport: { width: 1280, height: 800 }, instances: [{ browser: 'chromium' }] },
+  },
+});
```

## apps/storybook-vue/.storybook/main.ts

```diff
--- base/apps/storybook-vue/.storybook/main.ts
+++ apps/storybook-vue/.storybook/main.ts
@@ -1 +1,11 @@
-export default { framework: '@storybook/vue3-vite', stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], core: { disableTelemetry: true } };
+import { createRequire } from 'node:module';
+import { dirname } from 'node:path';
+import type { StorybookConfig } from '@storybook/vue3-vite';
+const require = createRequire(import.meta.url);
+const config: StorybookConfig = {
+  framework: { name: dirname(require.resolve('@storybook/vue3-vite/package.json')), options: {} },
+  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
+  addons: [],
+  core: { disableTelemetry: true },
+};
+export default config;
```

## apps/storybook-vue/package.json

```diff
--- base/apps/storybook-vue/package.json
+++ apps/storybook-vue/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/storybook-vue",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "yarn stories",
     "lint": "node ../../tools/check-workspace.mjs",
-    "typecheck": "tsc -p tsconfig.json --noEmit",
-    "build:local": "storybook build --output-dir dist",
-    "storybook-build": "storybook build --output-dir dist",
-    "stories": "playwright test"
+    "typecheck": "vue-tsc -p tsconfig.json --noEmit",
+    "build:local": "yarn storybook-build:local",
+    "storybook-build": "yarn storybook-build:local",
+    "stories": "node ../../tools/run-story-tests.mjs --framework vue",
+    "storybook-build:local": "storybook build --output-dir dist --disable-telemetry"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@storybook/vue3-vite": "10.6.5",
     "@types/node": "24.13.3",
     "@types/react": "19.3.0",
     "@vitejs/plugin-vue": "6.0.10",
     "@vitest/browser-playwright": "4.1.10",
     "@vue/compiler-sfc": "3.5.44",
```

## apps/storybook-vue/playwright.config.ts

```diff
--- base/apps/storybook-vue/playwright.config.ts
+++ apps/storybook-vue/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/stories' });
```

## apps/storybook-vue/project.json

```diff
--- base/apps/storybook-vue/project.json
+++ apps/storybook-vue/project.json
@@ -34,21 +34,41 @@
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-vue lint"
       }
     },
     "storybook-build": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-vue storybook-build"
-      }
+        "command": "node tools/yarn.mjs workspace @krds-native/storybook-vue storybook-build:local"
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
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-vue stories"
-      }
+        "command": "node tools/yarn.mjs test:stories --framework vue"
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

## apps/storybook-vue/src/stories/NativeProbe.ts

```diff
--- base/apps/storybook-vue/src/stories/NativeProbe.ts
+++ apps/storybook-vue/src/stories/NativeProbe.ts
@@ -0,0 +1,24 @@
+/** Native Vue story-only infrastructure; no KRDS component coverage. */
+import { defineComponent, h } from 'vue';
+import { WorkspaceProbe } from '@krds-native/vue';
+export const NativeProbe = defineComponent({
+  name: 'NativeProbe',
+  props: {
+    count: { type: Number, default: 0 },
+    label: { type: String, default: 'Probe increment' },
+    disabled: { type: Boolean, default: false },
+    loading: { type: Boolean, default: false },
+    errorMessage: { type: String, default: '' },
+  },
+  setup(props) {
+    return () => h('main', [
+      props.errorMessage
+        ? h('div', { role: 'alert' }, props.errorMessage)
+        : h('section', [
+          h('button', { type: 'button', disabled: props.disabled }, props.label),
+          h('div', { role: 'status', 'aria-label': 'Probe value' }, String(props.count)),
+        ]),
+      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(WorkspaceProbe)]),
+    ]);
+  },
+});
```

## apps/storybook-vue/src/stories/probe.stories.ts

```diff
--- base/apps/storybook-vue/src/stories/probe.stories.ts
+++ apps/storybook-vue/src/stories/probe.stories.ts
@@ -1,4 +1,17 @@
-/** Toolchain probe: excluded from KRDS catalog/story coverage. */
-import { WorkspaceProbe } from '@krds-native/vue';
-export default { title: 'Bootstrap/T01 probe', component: WorkspaceProbe };
-export const Probe = { args: {} };
+/** Local state-only infrastructure, excluded from KRDS catalog coverage. */
+import type { Meta, StoryObj } from '@storybook/vue3-vite';
+import type { StoryStateCase } from '@krds-native/test-contracts';
+import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
+import { NativeProbe } from './NativeProbe';
+const meta = { title: 'Infrastructure/Native probe', component: NativeProbe } satisfies Meta<typeof NativeProbe>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+function state(id: string): Story['args'] {
+  const fixture: StoryStateCase | undefined = infrastructureStoryCases.find(item => item.id === id);
+  if (!fixture) throw new globalThis.Error(`Missing infrastructure state: ${id}`);
+  return fixture.state;
+}
+// Retain the canonical state catalog as metadata; missing canonical stories stay RED.
+export const Default: Story = { args: state('infrastructure-native-probe--default'), parameters: { krds: { infrastructureOnly: true, canonicalStateCount: storyStateCases.length } } };
+export const Loading: Story = { args: state('infrastructure-native-probe--loading') };
+export const Error: Story = { args: state('infrastructure-native-probe--error') };
```

## apps/storybook-vue/tsconfig.json

```diff
--- base/apps/storybook-vue/tsconfig.json
+++ apps/storybook-vue/tsconfig.json
@@ -1,13 +1,16 @@
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ]
   },
   "include": [
     "src/**/*.ts",
-    "src/**/*.tsx"
+    "src/**/*.tsx",
+    "tests/**/*.ts",
+    "*.config.ts",
+    ".storybook/**/*.ts"
   ]
 }
```
