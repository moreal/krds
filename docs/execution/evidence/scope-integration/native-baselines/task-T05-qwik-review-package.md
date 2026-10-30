# T05 qwik exact uncommitted native scope diff

Baseline reviewed T01 app probes captured before T05. Common protocol/runners and shared root changes separately reviewed. All authored changed app source/config/tests follow; generated browser screenshots/outputs are evidence, not source.

## apps/fixture-qwik/index.html

```diff
--- base/apps/fixture-qwik/index.html
+++ apps/fixture-qwik/index.html
@@ -1,2 +1,2 @@
 <!doctype html>
-<html lang="en"><head><meta charset="utf-8"><title>T01 compiler probe</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
+<html lang="ko"><head><meta charset="utf-8"><title>Qwik native fixture infrastructure</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
```

## apps/fixture-qwik/package.json

```diff
--- base/apps/fixture-qwik/package.json
+++ apps/fixture-qwik/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/fixture-qwik",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "vitest run --config vitest.config.ts",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
-    "contract": "playwright test",
-    "siheom": "vitest run --config vitest.config.ts"
+    "contract": "node ../../tools/run-contract-tests.mjs --framework qwik",
+    "siheom": "node ../../tools/run-siheom-tests.mjs --framework qwik",
+    "siheom:local": "vitest run --config vitest.config.ts"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@builder.io/qwik": "1.20.3",
     "@builder.io/qwik-city": "1.20.3",
     "@noma.to/qwik-testing-library": "1.7.1",
     "@playwright/test": "1.64.1",
     "@siheom/core": "0.4.1",
     "@siheom/qwik": "0.3.2",
     "@testing-library/dom": "10.4.2",
```

## apps/fixture-qwik/playwright.config.ts

```diff
--- base/apps/fixture-qwik/playwright.config.ts
+++ apps/fixture-qwik/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/contract', use: { baseURL: 'http://127.0.0.1:4173' } });
```

## apps/fixture-qwik/project.json

```diff
--- base/apps/fixture-qwik/project.json
+++ apps/fixture-qwik/project.json
@@ -23,32 +23,70 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-qwik typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-qwik test"
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
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-qwik lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-qwik contract"
-      }
+        "command": "node tools/yarn.mjs test:contract --framework qwik"
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
+        "{workspaceRoot}/catalog/story-cases.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/tools/run-contract-tests.mjs",
+        "{workspaceRoot}/tools/run-siheom-tests.mjs",
+        "{workspaceRoot}/tools/run-story-tests.mjs",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/tools/testing/**/*"
+      ]
     },
     "siheom": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-qwik siheom"
-      }
+        "command": "node tools/yarn.mjs test:siheom --framework qwik"
+      },
+      "cache": false,
+      "dependsOn": [
+        "^build"
+      ],
+      "inputs": [
+        "default",
+        "^default",
+        "{workspaceRoot}/catalog/fixture-cases.json",
+        "{workspaceRoot}/catalog/story-cases.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/tools/run-contract-tests.mjs",
+        "{workspaceRoot}/tools/run-siheom-tests.mjs",
+        "{workspaceRoot}/tools/run-story-tests.mjs",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/tools/testing/**/*"
+      ]
     }
   }
 }
```

## apps/fixture-qwik/src/main.tsx

```diff
--- base/apps/fixture-qwik/src/main.tsx
+++ apps/fixture-qwik/src/main.tsx
@@ -1,4 +1,3 @@
-/** T01 toolchain probe only; no component coverage. */
 import { render } from '@builder.io/qwik';
-import { WorkspaceProbe } from '@krds-native/qwik';
-void render(document, <WorkspaceProbe />);
+import Root from './root';
+render(document.getElementById('app')!, <Root />);
```

## apps/fixture-qwik/src/root.tsx

```diff
--- base/apps/fixture-qwik/src/root.tsx
+++ apps/fixture-qwik/src/root.tsx
@@ -1,3 +1,37 @@
-import { component$ } from '@builder.io/qwik';
+import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
+import { createFixtureBridge } from '@krds-native/test-contracts/driver';
 import { WorkspaceProbe } from '@krds-native/qwik';
-export default component$(() => <html><head><title>T01 probe</title></head><body><WorkspaceProbe /></body></html>);
+
+/** Client-only T05 infrastructure. This does not exercise production SSR/resume. */
+export default component$(() => {
+  const state = useStore({ ready: false, probe: false, component: '', caseId: '', count: 0, label: 'Probe increment', disabled: false });
+  useVisibleTask$(({ cleanup }) => {
+    const component = decodeURIComponent(location.pathname.split('/')[2] ?? '');
+    state.component = component;
+    state.caseId = new URLSearchParams(location.search).get('case') ?? '';
+    state.probe = component === '__probe';
+    // Bridge and unsubscribe never enter serializable Qwik state or a captured event QRL.
+    const bridge = createFixtureBridge('qwik', { count: 0, label: 'Probe increment', disabled: false });
+    const unsubscribe = bridge.subscribe((next) => {
+      state.count = Number(next.count ?? 0);
+      state.label = String(next.label ?? 'Probe increment');
+      state.disabled = Boolean(next.disabled);
+    });
+    state.ready = true;
+    cleanup(() => { unsubscribe(); bridge.dispose(); });
+  });
+  return <main>
+    <WorkspaceProbe />
+    <div role="status" aria-label="Fixture health">{state.ready ? 'ready' : 'mounting'}</div>
+    {state.probe ? <>
+      <button disabled={state.disabled} onClick$={async () => {
+        const bridge = window.__KRDS_FIXTURE__;
+        if (!bridge) throw new Error('Fixture bridge is not mounted');
+        const count = Number(bridge.getState().count ?? 0) + 1;
+        bridge.recordEvent('change', { value: count });
+        await bridge.setState({ count });
+      }}>{state.label}</button>
+      <div role="status" aria-label="Probe value">{state.count}</div>
+    </> : <p role="note">Component not implemented: {state.component}/{state.caseId}</p>}
+  </main>;
+});
```

## apps/fixture-qwik/tests/setup.ts

```diff
--- base/apps/fixture-qwik/tests/setup.ts
+++ apps/fixture-qwik/tests/setup.ts
@@ -0,0 +1,5 @@
+import '@noma.to/qwik-testing-library/setup/qwik-v1';
+import '@testing-library/jest-dom/vitest';
+import { afterEach } from 'vitest';
+import { cleanup } from '@noma.to/qwik-testing-library';
+afterEach(cleanup);
```

## apps/fixture-qwik/tests/siheom/button.test.tsx

```diff
--- base/apps/fixture-qwik/tests/siheom/button.test.tsx
+++ apps/fixture-qwik/tests/siheom/button.test.tsx
@@ -0,0 +1,19 @@
+import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
+import { test } from 'vitest';
+import Root from '../../src/root';
+
+test('disabled KRDS button remains missing after native fixture health', async () => {
+  const previous = location.href;
+  history.replaceState(null, '', '/fixtures/button?case=disabled');
+  try {
+    await runSiheom(
+      given.render(<Root />),
+      assertions.textContent(query.status('Fixture health'), 'ready'),
+      assertions.textContent(query.note(''), 'Component not implemented: button/disabled'),
+      assertions.disabled(query.button('저장')),
+      actions.click(query.button('저장')),
+    );
+  } finally {
+    history.replaceState(null, '', previous);
+  }
+});
```

## apps/fixture-qwik/tests/siheom/native-probe.test.tsx

```diff
--- base/apps/fixture-qwik/tests/siheom/native-probe.test.tsx
+++ apps/fixture-qwik/tests/siheom/native-probe.test.tsx
@@ -0,0 +1,39 @@
+import { component$, useStore } from '@builder.io/qwik';
+import { cleanup, screen, waitFor } from '@noma.to/qwik-testing-library';
+import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
+import { expect, test } from 'vitest';
+
+// Test-only native component; JSX is passed to the published @siheom/qwik given.
+const NativeProbe = component$(() => {
+  const state = useStore({ count: 0, value: 'initial' });
+  return <section>
+    <button onClick$={() => state.count++}>Probe increment</button>
+    <div role="status" aria-label="Probe value">{state.count}</div>
+    <label>Controlled value<input value={state.value} onInput$={(_, element) => state.value = element.value} /></label>
+    <div role="status" aria-label="Controlled echo">{state.value}</div>
+  </section>;
+});
+
+test('published native siheom render, click, controlled update and cleanup', async () => {
+  await runSiheom(
+    given.render(<NativeProbe />),
+    assertions.textContent(query.status('Probe value'), '0'),
+    actions.click(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '1'),
+    actions.fill(query.textbox('Controlled value'), 'updated'),
+    assertions.value(query.textbox('Controlled value'), 'updated'),
+    assertions.textContent(query.status('Controlled echo'), 'updated'),
+  );
+  cleanup();
+  await waitFor(() => expect(screen.queryByRole('button', { name: 'Probe increment' })).toBeNull());
+});
+
+test('native siheom focus is a separate browser result', async () => {
+  await runSiheom(
+    given.render(<NativeProbe />),
+    actions.click(query.button('Probe increment')),
+    assertions.focused(query.button('Probe increment')),
+    actions.tab(query.button('Probe increment')),
+    assertions.focused(query.textbox('Controlled value')),
+  );
+});
```

## apps/fixture-qwik/tsconfig.json

```diff
--- base/apps/fixture-qwik/tsconfig.json
+++ apps/fixture-qwik/tsconfig.json
@@ -3,13 +3,15 @@
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ],
     "jsx": "react-jsx",
     "jsxImportSource": "@builder.io/qwik"
   },
   "include": [
     "src/**/*.ts",
-    "src/**/*.tsx"
+    "src/**/*.tsx",
+    "tests/**/*.ts",
+    "tests/**/*.tsx"
   ]
 }
```

## apps/fixture-qwik/vite.config.ts

```diff
--- base/apps/fixture-qwik/vite.config.ts
+++ apps/fixture-qwik/vite.config.ts
@@ -1,3 +1,11 @@
 import { defineConfig } from 'vite';
 import { qwikVite } from '@builder.io/qwik/optimizer';
-export default defineConfig({ plugins: [qwikVite()], build: { outDir: 'dist' } });
+import { QWIK_LOADER } from '@builder.io/qwik/loader';
+
+export default defineConfig({
+  plugins: [qwikVite({ csr: true }), {
+    name: 'fixture-qwik-loader',
+    transformIndexHtml: () => [{ tag: 'script', children: QWIK_LOADER, injectTo: 'head' }],
+  }],
+  build: { outDir: 'dist', emptyOutDir: true },
+});
```

## apps/fixture-qwik/vitest.config.ts

```diff
--- base/apps/fixture-qwik/vitest.config.ts
+++ apps/fixture-qwik/vitest.config.ts
@@ -1,4 +1,34 @@
+import { createServer } from 'node:net';
 import { defineConfig } from 'vitest/config';
 import { playwright } from '@vitest/browser-playwright';
 import { qwikVite } from '@builder.io/qwik/optimizer';
-export default defineConfig({ plugins: [qwikVite()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
+
+// Vitest treats api.port=0 as its default 63315; reserve an ephemeral loopback port explicitly.
+const apiPort = await new Promise<number>((resolve, reject) => {
+  const reservation = createServer();
+  reservation.once('error', reject);
+  reservation.listen(0, '127.0.0.1', () => {
+    const address = reservation.address();
+    if (!address || typeof address === 'string') { reservation.close(); reject(new Error('No browser API port')); return; }
+    reservation.close((error) => error ? reject(error) : resolve(address.port));
+  });
+});
+
+export default defineConfig({
+  plugins: [qwikVite({ csr: true })],
+  // Qwik excludes native Qwik packages from prebundling; explicitly optimize the DOM CJS dependencies.
+  optimizeDeps: { include: ['@testing-library/dom', '@testing-library/jest-dom/vitest', '@testing-library/user-event'] },
+  test: {
+    include: process.env.KRDS_TEST_MODE === 'probe'
+      ? ['tests/siheom/native-probe.test.tsx']
+      : ['tests/siheom/button.test.tsx'],
+    setupFiles: ['tests/setup.ts'],
+    passWithNoTests: false,
+    browser: {
+      enabled: true, provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }), headless: true,
+      api: { port: apiPort, host: '127.0.0.1' },
+      instances: [{ browser: 'chromium' }],
+      viewport: { width: 1280, height: 800 },
+    },
+  },
+});
```

## apps/storybook-qwik/.storybook/main.ts

```diff
--- base/apps/storybook-qwik/.storybook/main.ts
+++ apps/storybook-qwik/.storybook/main.ts
@@ -1 +1,7 @@
-export default { framework: 'storybook-framework-qwik', stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], core: { disableTelemetry: true } };
+import { createRequire } from 'node:module';
+const require = createRequire(import.meta.url);
+export default {
+  framework: require.resolve('storybook-framework-qwik/package.json').replace(/package\.json$/, ''),
+  stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [],
+  core: { disableTelemetry: true },
+};
```

## apps/storybook-qwik/package.json

```diff
--- base/apps/storybook-qwik/package.json
+++ apps/storybook-qwik/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/storybook-qwik",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node ../../tools/run-story-tests.mjs --framework qwik",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "storybook build --output-dir dist",
     "storybook-build": "storybook build --output-dir dist",
-    "stories": "playwright test"
+    "stories": "node ../../tools/run-story-tests.mjs --framework qwik",
+    "storybook-build:local": "storybook build --output-dir dist"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@builder.io/qwik": "1.20.3",
     "@builder.io/qwik-city": "1.20.3",
     "@playwright/test": "1.64.1",
     "@types/node": "24.13.3",
     "@types/react": "19.3.0",
     "@vitest/browser-playwright": "4.1.10",
     "playwright": "1.64.1",
```

## apps/storybook-qwik/playwright.config.ts

```diff
--- base/apps/storybook-qwik/playwright.config.ts
+++ apps/storybook-qwik/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/stories' });
```

## apps/storybook-qwik/project.json

```diff
--- base/apps/storybook-qwik/project.json
+++ apps/storybook-qwik/project.json
@@ -23,32 +23,54 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-qwik typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-qwik test"
-      }
+      },
+      "cache": false,
+      "dependsOn": [
+        "storybook-build",
+        "^build"
+      ]
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-qwik lint"
       }
     },
     "storybook-build": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-qwik storybook-build"
+        "command": "node tools/yarn.mjs workspace @krds-native/storybook-qwik storybook-build:local"
       }
     },
     "stories": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-qwik stories"
-      }
+        "command": "node tools/yarn.mjs test:stories --framework qwik"
+      },
+      "cache": false,
+      "dependsOn": [
+        "storybook-build",
+        "^build"
+      ],
+      "inputs": [
+        "default",
+        "^default",
+        "{workspaceRoot}/catalog/fixture-cases.json",
+        "{workspaceRoot}/catalog/story-cases.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/tools/run-contract-tests.mjs",
+        "{workspaceRoot}/tools/run-siheom-tests.mjs",
+        "{workspaceRoot}/tools/run-story-tests.mjs",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/tools/testing/**/*"
+      ]
     }
   }
 }
```

## apps/storybook-qwik/src/stories/native-probe.tsx

```diff
--- base/apps/storybook-qwik/src/stories/native-probe.tsx
+++ apps/storybook-qwik/src/stories/native-probe.tsx
@@ -0,0 +1,12 @@
+import { component$, useSignal } from '@builder.io/qwik';
+
+export interface NativeProbeProps { count?: number; label?: string; disabled?: boolean; errorMessage?: string; }
+
+/** Infrastructure only. Native Qwik state and local args; no component coverage. */
+export const NativeProbe = component$<NativeProbeProps>((props) => {
+  const count = useSignal(props.count ?? 0);
+  return props.errorMessage
+    ? <div role="alert">{props.errorMessage}</div>
+    : <section><button disabled={props.disabled} onClick$={() => count.value++}>{props.label}</button>
+      <div role="status" aria-label="Probe value">{count.value}</div></section>;
+});
```

## apps/storybook-qwik/src/stories/probe.stories.tsx

```diff
--- base/apps/storybook-qwik/src/stories/probe.stories.tsx
+++ apps/storybook-qwik/src/stories/probe.stories.tsx
@@ -1,4 +1,20 @@
-/** Toolchain probe: excluded from KRDS catalog/story coverage. */
-import { WorkspaceProbe } from '@krds-native/qwik';
-export default { title: 'Bootstrap/T01 probe', component: WorkspaceProbe };
-export const Probe = { render: () => <WorkspaceProbe />, args: {} };
+import type { Meta, StoryObj } from 'storybook-framework-qwik';
+import type { StoryStateCase } from '@krds-native/test-contracts';
+import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
+import { NativeProbe, type NativeProbeProps } from './native-probe';
+
+const argsFor = (id: string): NativeProbeProps => {
+  const fixture: StoryStateCase | undefined = infrastructureStoryCases.find((item) => item.id === id);
+  if (!fixture) throw new globalThis.Error(`Missing infrastructure state: ${id}`);
+  return fixture.state;
+};
+
+const meta = {
+  title: 'Infrastructure/Native probe', component: NativeProbe,
+  parameters: { krds: { infrastructureOnly: true, canonicalCasesPending: storyStateCases.map((item) => item.id) } },
+} satisfies Meta<NativeProbeProps>;
+export default meta;
+type Story = StoryObj<NativeProbeProps>;
+export const Default: Story = { args: argsFor('infrastructure-native-probe--default') };
+export const Loading: Story = { args: argsFor('infrastructure-native-probe--loading') };
+export const Error: Story = { args: argsFor('infrastructure-native-probe--error') };
```
