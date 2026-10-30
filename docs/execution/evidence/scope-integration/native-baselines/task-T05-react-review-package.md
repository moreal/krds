# T05 react exact uncommitted native scope diff

Baseline reviewed T01 app probes captured before T05. Common protocol/runners and shared root changes separately reviewed. All authored changed app source/config/tests follow; generated browser screenshots/outputs are evidence, not source.

## apps/fixture-react/package.json

```diff
--- base/apps/fixture-react/package.json
+++ apps/fixture-react/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/fixture-react",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node ../../tools/run-siheom-tests.mjs --framework react",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
-    "contract": "playwright test",
-    "siheom": "vitest run --config vitest.config.ts"
+    "contract": "node ../../tools/run-contract-tests.mjs --framework react",
+    "siheom": "node ../../tools/run-siheom-tests.mjs --framework react",
+    "siheom:local": "vitest run --config vitest.config.ts"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@siheom/core": "0.4.1",
     "@siheom/react": "0.4.1",
     "@testing-library/dom": "10.4.2",
     "@testing-library/jest-dom": "7.0.1",
     "@testing-library/react": "16.3.3",
     "@testing-library/user-event": "14.6.8",
```

## apps/fixture-react/playwright.config.ts

```diff
--- base/apps/fixture-react/playwright.config.ts
+++ apps/fixture-react/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/contract', use: { baseURL: 'http://127.0.0.1:4173' } });
```

## apps/fixture-react/project.json

```diff
--- base/apps/fixture-react/project.json
+++ apps/fixture-react/project.json
@@ -23,32 +23,73 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-react typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-react test"
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
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-react lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-react contract"
-      }
+        "command": "node tools/yarn.mjs test:contract --framework react"
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
+        "{workspaceRoot}/catalog/story-coverage.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/packages/test-contracts/**/*",
+        "{workspaceRoot}/tools/run-*-tests.mjs",
+        "{workspaceRoot}/specs/components/**/*",
+        "{workspaceRoot}/compatibility/frameworks.json"
+      ]
     },
     "siheom": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-react siheom"
-      }
+        "command": "node tools/yarn.mjs test:siheom --framework react"
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
+        "{workspaceRoot}/catalog/story-coverage.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/packages/test-contracts/**/*",
+        "{workspaceRoot}/tools/run-*-tests.mjs",
+        "{workspaceRoot}/specs/components/**/*",
+        "{workspaceRoot}/compatibility/frameworks.json"
+      ]
     }
   }
 }
```

## apps/fixture-react/src/FixtureApp.tsx

```diff
--- base/apps/fixture-react/src/FixtureApp.tsx
+++ apps/fixture-react/src/FixtureApp.tsx
@@ -0,0 +1,32 @@
+import { useEffect, useState } from 'react';
+import { WorkspaceProbe } from '@krds-native/react';
+import type { FixtureBridge } from '@krds-native/test-contracts';
+import { createFixtureBridge } from '@krds-native/test-contracts/driver';
+import { NativeProbe } from './NativeProbe';
+
+interface FixtureRoute { componentId: string; caseId: string }
+function currentRoute(): FixtureRoute {
+  return { componentId: decodeURIComponent(location.pathname.split('/')[2] ?? ''), caseId: new URLSearchParams(location.search).get('case') ?? '' };
+}
+const initialState = { count: 0, label: 'Probe increment', disabled: false };
+
+export function FixtureApp(route: Partial<FixtureRoute> = {}) {
+  const { componentId, caseId } = { ...currentRoute(), ...route };
+  const [state, setState] = useState<Record<string, unknown>>(initialState);
+  const [bridge, setBridge] = useState<FixtureBridge>();
+  useEffect(() => {
+    const channel = createFixtureBridge('react', componentId === '__probe' ? initialState : {});
+    const unsubscribe = channel.subscribe(setState);
+    setBridge(channel);
+    return () => { unsubscribe(); channel.dispose(); };
+  }, [componentId, caseId]);
+  return <main>
+    <h1>React fixture</h1>
+    <WorkspaceProbe />
+    {bridge && <div role="status" aria-label="Fixture health">ready</div>}
+    {componentId === '__probe' && caseId === 'native-state'
+      ? <NativeProbe count={Number(state.count)} label={String(state.label)} disabled={Boolean(state.disabled)}
+          onChange={(value) => { bridge?.recordEvent('change', { value }); void bridge?.setState({ count: value }); }} />
+      : <p role="note">Component not implemented: {componentId}/{caseId}</p>}
+  </main>;
+}
```

## apps/fixture-react/src/NativeProbe.tsx

```diff
--- base/apps/fixture-react/src/NativeProbe.tsx
+++ apps/fixture-react/src/NativeProbe.tsx
@@ -0,0 +1,13 @@
+/** Test infrastructure only; never KRDS component coverage. */
+export interface NativeProbeProps {
+  count: number;
+  label: string;
+  disabled: boolean;
+  onChange: (value: number) => void;
+}
+export function NativeProbe({ count, label, disabled, onChange }: NativeProbeProps) {
+  return <section aria-label="Native React infrastructure probe">
+    <button disabled={disabled} onClick={() => onChange(count + 1)}>{label}</button>
+    <div role="status" aria-label="Probe value">{count}</div>
+  </section>;
+}
```

## apps/fixture-react/src/main.tsx

```diff
--- base/apps/fixture-react/src/main.tsx
+++ apps/fixture-react/src/main.tsx
@@ -1,4 +1,3 @@
-/** T01 toolchain probe only; no component coverage. */
 import { createRoot } from 'react-dom/client';
-import { WorkspaceProbe } from '@krds-native/react';
-createRoot(document.getElementById('app')!).render(<WorkspaceProbe />);
+import { FixtureApp } from './FixtureApp';
+createRoot(document.getElementById('app')!).render(<FixtureApp />);
```

## apps/fixture-react/tests/setup.ts

```diff
--- base/apps/fixture-react/tests/setup.ts
+++ apps/fixture-react/tests/setup.ts
@@ -0,0 +1,7 @@
+import '@testing-library/jest-dom/vitest';
+import { afterEach } from 'vitest';
+import { cleanupReactRoots } from '@siheom/react';
+
+declare global { var IS_REACT_ACT_ENVIRONMENT: boolean | undefined; }
+globalThis.IS_REACT_ACT_ENVIRONMENT = true;
+afterEach(async () => { await cleanupReactRoots(); });
```

## apps/fixture-react/tests/siheom/button.test.tsx

```diff
--- base/apps/fixture-react/tests/siheom/button.test.tsx
+++ apps/fixture-react/tests/siheom/button.test.tsx
@@ -0,0 +1,14 @@
+/** Canonical missing-component RED gates, separate from infrastructure probes and stories. */
+import { expect, test } from 'vitest';
+import { assertions, createReactSiheom, given, query } from '@siheom/react';
+import { FixtureApp } from '../../src/FixtureApp';
+const { runSiheom } = createReactSiheom();
+test.each(['disabled'])('button/%s requires the actual KRDS component', async (caseId) => {
+  await runSiheom(
+    given.render(<FixtureApp componentId="button" caseId={caseId} />),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+  );
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('react');
+  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
+  await runSiheom(assertions.disabled(query.button('저장')));
+});
```

## apps/fixture-react/tests/siheom/date-input.test.tsx

```diff
--- base/apps/fixture-react/tests/siheom/date-input.test.tsx
+++ apps/fixture-react/tests/siheom/date-input.test.tsx
@@ -0,0 +1,14 @@
+/** Canonical missing-component RED gates, separate from infrastructure probes and stories. */
+import { expect, test } from 'vitest';
+import { assertions, createReactSiheom, given, query } from '@siheom/react';
+import { FixtureApp } from '../../src/FixtureApp';
+const { runSiheom } = createReactSiheom();
+test.each(['leap-year', 'ime', 'timezone-invariance'])('date-input/%s requires the actual KRDS component', async (caseId) => {
+  await runSiheom(
+    given.render(<FixtureApp componentId="date-input" caseId={caseId} />),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+  );
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('react');
+  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
+  await runSiheom(assertions.visible(query.textbox('날짜')));
+});
```

## apps/fixture-react/tests/siheom/modal.test.tsx

```diff
--- base/apps/fixture-react/tests/siheom/modal.test.tsx
+++ apps/fixture-react/tests/siheom/modal.test.tsx
@@ -0,0 +1,14 @@
+/** Canonical missing-component RED gates, separate from infrastructure probes and stories. */
+import { expect, test } from 'vitest';
+import { assertions, createReactSiheom, given, query } from '@siheom/react';
+import { FixtureApp } from '../../src/FixtureApp';
+const { runSiheom } = createReactSiheom();
+test.each(['focus-return', 'trigger-removed'])('modal/%s requires the actual KRDS component', async (caseId) => {
+  await runSiheom(
+    given.render(<FixtureApp componentId="modal" caseId={caseId} />),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+  );
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('react');
+  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
+  await runSiheom(assertions.visible(query.button('모달 열기')));
+});
```

## apps/fixture-react/tests/siheom/native-probe.test.tsx

```diff
--- base/apps/fixture-react/tests/siheom/native-probe.test.tsx
+++ apps/fixture-react/tests/siheom/native-probe.test.tsx
@@ -0,0 +1,43 @@
+import { act, useState } from 'react';
+import { expect, test } from 'vitest';
+import { userEvent } from 'vitest/browser';
+import { actions, assertions, cleanupReactRoots, createReactSiheom, given, query } from '@siheom/react';
+import { NativeProbe } from '../../src/NativeProbe';
+
+const { runSiheom } = createReactSiheom({ user: userEvent });
+
+test('native React render, provider click, controlled update and cleanup', async () => {
+  let update: (count: number) => void = () => { throw new Error('not mounted'); };
+  let lastValue = 0;
+  function ControlledProbe() {
+    const [count, setCount] = useState(0);
+    update = setCount;
+    return <NativeProbe count={count} label="Probe increment" disabled={false}
+      onChange={(value) => { lastValue = value; setCount(value); }} />;
+  }
+  await runSiheom(
+    given.render(<ControlledProbe />),
+    assertions.textContent(query.status('Probe value'), '0'),
+    actions.click(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '1'),
+  );
+  expect(lastValue).toBe(1);
+  await act(async () => { update(7); });
+  await runSiheom(
+    assertions.textContent(query.status('Probe value'), '7'),
+    actions.click(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '8'),
+  );
+  expect(lastValue).toBe(8);
+  await cleanupReactRoots();
+  expect(document.querySelector('button')).toBeNull();
+  expect(document.querySelector('[aria-label="Probe value"]')).toBeNull();
+});
+
+test('provider click moves focus onto the native button', async () => {
+  await runSiheom(
+    given.render(<NativeProbe count={0} label="Focus probe" disabled={false} onChange={() => {}} />),
+    actions.click(query.button('Focus probe')),
+    assertions.focused(query.button('Focus probe')),
+  );
+});
```

## apps/fixture-react/tests/siheom/native-select.test.tsx

```diff
--- base/apps/fixture-react/tests/siheom/native-select.test.tsx
+++ apps/fixture-react/tests/siheom/native-select.test.tsx
@@ -0,0 +1,14 @@
+/** Canonical missing-component RED gates, separate from infrastructure probes and stories. */
+import { expect, test } from 'vitest';
+import { assertions, createReactSiheom, given, query } from '@siheom/react';
+import { FixtureApp } from '../../src/FixtureApp';
+const { runSiheom } = createReactSiheom();
+test.each(['controlled', 'form-reset'])('native-select/%s requires the actual KRDS component', async (caseId) => {
+  await runSiheom(
+    given.render(<FixtureApp componentId="native-select" caseId={caseId} />),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+  );
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('react');
+  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
+  await runSiheom(assertions.visible(query.combobox('지역')));
+});
```

## apps/fixture-react/tests/siheom/tabs.test.tsx

```diff
--- base/apps/fixture-react/tests/siheom/tabs.test.tsx
+++ apps/fixture-react/tests/siheom/tabs.test.tsx
@@ -0,0 +1,14 @@
+/** Canonical missing-component RED gates, separate from infrastructure probes and stories. */
+import { expect, test } from 'vitest';
+import { assertions, createReactSiheom, given, query } from '@siheom/react';
+import { FixtureApp } from '../../src/FixtureApp';
+const { runSiheom } = createReactSiheom();
+test.each(['manual-activation'])('tabs/%s requires the actual KRDS component', async (caseId) => {
+  await runSiheom(
+    given.render(<FixtureApp componentId="tabs" caseId={caseId} />),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+  );
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('react');
+  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
+  await runSiheom(assertions.visible(query.tab('첫 번째')));
+});
```

## apps/fixture-react/tsconfig.json

```diff
--- base/apps/fixture-react/tsconfig.json
+++ apps/fixture-react/tsconfig.json
@@ -2,13 +2,16 @@
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ],
     "jsx": "react-jsx"
   },
   "include": [
     "src/**/*.ts",
-    "src/**/*.tsx"
+    "src/**/*.tsx",
+    "tests/**/*.ts",
+    "tests/**/*.tsx",
+    "vitest.config.ts"
   ]
 }
```

## apps/fixture-react/vitest.config.ts

```diff
--- base/apps/fixture-react/vitest.config.ts
+++ apps/fixture-react/vitest.config.ts
@@ -1,4 +1,26 @@
+import { resolve } from 'node:path';
 import { defineConfig } from 'vitest/config';
 import { playwright } from '@vitest/browser-playwright';
 import react from '@vitejs/plugin-react';
-export default defineConfig({ plugins: [react()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
+
+const artifacts = resolve(import.meta.dirname, `../../test-results/t05/react-siheom-native-${Date.now()}-${process.pid}`);
+
+export default defineConfig({
+  plugins: [react()],
+  test: {
+    include: process.env.KRDS_TEST_MODE === 'probe'
+      ? ['tests/siheom/native-probe.test.tsx']
+      : ['tests/siheom/{button,native-select,modal,tabs,date-input}.test.tsx'],
+    setupFiles: ['tests/setup.ts'],
+    attachmentsDir: resolve(artifacts, 'attachments'),
+    passWithNoTests: false,
+    browser: {
+      enabled: true,
+      screenshotDirectory: resolve(artifacts, 'screenshots'),
+      provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }),
+      headless: true,
+      viewport: { width: 1280, height: 800 },
+      instances: [{ browser: 'chromium' }],
+    },
+  },
+});
```

## apps/storybook-react/.storybook/main.ts

```diff
--- base/apps/storybook-react/.storybook/main.ts
+++ apps/storybook-react/.storybook/main.ts
@@ -1 +1,11 @@
-export default { framework: '@storybook/react-vite', stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], core: { disableTelemetry: true } };
+import { createRequire } from 'node:module';
+import { dirname } from 'node:path';
+import type { StorybookConfig } from '@storybook/react-vite';
+const require = createRequire(import.meta.url);
+const config: StorybookConfig = {
+  framework: { name: dirname(require.resolve('@storybook/react-vite/package.json')), options: {} },
+  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
+  addons: [],
+  core: { disableTelemetry: true },
+};
+export default config;
```

## apps/storybook-react/index.html

```diff
--- base/apps/storybook-react/index.html
+++ apps/storybook-react/index.html
@@ -1,2 +0,0 @@
-<!doctype html>
-<html lang="en"><head><meta charset="utf-8"><title>T01 compiler probe</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
```

## apps/storybook-react/package.json

```diff
--- base/apps/storybook-react/package.json
+++ apps/storybook-react/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/storybook-react",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node ../../tools/run-story-tests.mjs --framework react",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
-    "build:local": "storybook build --output-dir dist",
-    "storybook-build": "storybook build --output-dir dist",
-    "stories": "playwright test"
+    "build:local": "yarn storybook-build:local",
+    "storybook-build": "yarn storybook-build:local",
+    "stories": "node ../../tools/run-story-tests.mjs --framework react",
+    "storybook-build:local": "storybook build --output-dir dist --disable-telemetry"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@storybook/react-vite": "10.6.5",
     "@types/node": "24.13.3",
     "@types/react": "19.3.0",
     "@types/react-dom": "19.3.0",
     "@vitejs/plugin-react": "6.1.2",
     "@vitest/browser-playwright": "4.1.10",
```

## apps/storybook-react/playwright.config.ts

```diff
--- base/apps/storybook-react/playwright.config.ts
+++ apps/storybook-react/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/stories' });
```

## apps/storybook-react/project.json

```diff
--- base/apps/storybook-react/project.json
+++ apps/storybook-react/project.json
@@ -23,32 +23,61 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-react typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-react test"
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
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-react lint"
       }
     },
     "storybook-build": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-react storybook-build"
-      }
+        "command": "node tools/yarn.mjs workspace @krds-native/storybook-react storybook-build:local"
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
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-react stories"
-      }
+        "command": "node tools/yarn.mjs test:stories --framework react"
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
+        "{workspaceRoot}/catalog/story-coverage.json",
+        "{workspaceRoot}/compatibility/testing.json",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/packages/test-contracts/**/*",
+        "{workspaceRoot}/tools/run-*-tests.mjs",
+        "{workspaceRoot}/specs/components/**/*",
+        "{workspaceRoot}/compatibility/frameworks.json"
+      ]
     }
   }
 }
```

## apps/storybook-react/src/main.tsx

```diff
--- base/apps/storybook-react/src/main.tsx
+++ apps/storybook-react/src/main.tsx
@@ -1,4 +0,0 @@
-/** T01 toolchain probe only; no component coverage. */
-import { createRoot } from 'react-dom/client';
-import { WorkspaceProbe } from '@krds-native/react';
-createRoot(document.getElementById('app')!).render(<WorkspaceProbe />);
```

## apps/storybook-react/src/stories/native-probe.stories.tsx

```diff
--- base/apps/storybook-react/src/stories/native-probe.stories.tsx
+++ apps/storybook-react/src/stories/native-probe.stories.tsx
@@ -0,0 +1,33 @@
+/** Infrastructure states only; these do not contribute KRDS catalog coverage. */
+import { useState } from 'react';
+import type { Meta, StoryObj } from '@storybook/react-vite';
+import type { StoryStateCase } from '@krds-native/test-contracts';
+import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
+import { WorkspaceProbe } from '@krds-native/react';
+
+type ProbeArgs = { count: number; label: string; disabled: boolean; errorMessage?: string };
+function NativeStoryProbe({ count, label, disabled, errorMessage }: ProbeArgs) {
+  const [value, setValue] = useState(count);
+  return <main><h1>Native React infrastructure</h1><WorkspaceProbe />
+    {errorMessage ? <div role="alert">{errorMessage}</div> : <>
+      <button disabled={disabled} onClick={() => setValue(value + 1)}>{label}</button>
+      <div role="status" aria-label="Probe value">{value}</div>
+    </>}
+  </main>;
+}
+function argsFor(id: string): ProbeArgs {
+  const entry: StoryStateCase | undefined = infrastructureStoryCases.find((item) => item.id === id);
+  if (!entry) throw new globalThis.Error(`Missing infrastructure state: ${id}`);
+  return { count: 0, label: 'Probe increment', disabled: false, ...entry.state };
+}
+// The real component story states stay separate; absent implementations receive no canonical story IDs.
+const meta = {
+  title: 'Infrastructure/Native probe',
+  component: NativeStoryProbe,
+  parameters: { krds: { infrastructure: true, pendingCanonicalStates: storyStateCases.map(({ id }) => id) } },
+} satisfies Meta<typeof NativeStoryProbe>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+export const Default: Story = { args: argsFor('infrastructure-native-probe--default') };
+export const Loading: Story = { args: argsFor('infrastructure-native-probe--loading') };
+export const Error: Story = { args: argsFor('infrastructure-native-probe--error') };
```

## apps/storybook-react/src/stories/probe.stories.ts

```diff
--- base/apps/storybook-react/src/stories/probe.stories.ts
+++ apps/storybook-react/src/stories/probe.stories.ts
@@ -1,4 +0,0 @@
-/** Toolchain probe: excluded from KRDS catalog/story coverage. */
-import { WorkspaceProbe } from '@krds-native/react';
-export default { title: 'Bootstrap/T01 probe', component: WorkspaceProbe };
-export const Probe = { args: {} };
```

## apps/storybook-react/tsconfig.json

```diff
--- base/apps/storybook-react/tsconfig.json
+++ apps/storybook-react/tsconfig.json
@@ -2,13 +2,14 @@
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
     "noEmit": true,
     "types": [
       "node"
     ],
     "jsx": "react-jsx"
   },
   "include": [
     "src/**/*.ts",
-    "src/**/*.tsx"
+    "src/**/*.tsx",
+    ".storybook/**/*.ts"
   ]
 }
```

## apps/storybook-react/vite.config.ts

```diff
--- base/apps/storybook-react/vite.config.ts
+++ apps/storybook-react/vite.config.ts
@@ -1,3 +0,0 @@
-import { defineConfig } from 'vite';
-import react from '@vitejs/plugin-react';
-export default defineConfig({ plugins: [react()], build: { outDir: 'dist' } });
```
