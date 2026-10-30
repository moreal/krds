# T05 solid-next exact uncommitted native scope diff

Baseline reviewed T01 app probes captured before T05. Common protocol/runners and shared root changes are separate core scope. All authored changed app source/config/tests follow; generated browser screenshots/outputs are evidence, not source.

## apps/fixture-solid-next/index.html

```diff
--- base/apps/fixture-solid-next/index.html
+++ apps/fixture-solid-next/index.html
@@ -1,2 +1,2 @@
 <!doctype html>
-<html lang="en"><head><meta charset="utf-8"><title>T01 compiler probe</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
+<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Solid 2 native fixture</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
```

## apps/fixture-solid-next/package.json

```diff
--- base/apps/fixture-solid-next/package.json
+++ apps/fixture-solid-next/package.json
@@ -1,21 +1,21 @@
 {
   "name": "@krds-native/fixture-solid-next",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1 playwright test --config playwright.config.ts",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
-    "contract": "playwright test"
+    "contract": "node ../../tools/run-contract-tests.mjs --framework solid-next"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@babel/core": "7.28.5",
     "@babel/preset-typescript": "7.28.5",
     "@playwright/test": "1.64.1",
     "@solidjs/babel-plugin": "2.0.0-rc.19",
     "@solidjs/compiler": "2.0.0-rc.19",
     "@solidjs/vite-plugin": "3.0.0-next.53",
     "@solidjs/web": "2.0.0-rc.19",
```

## apps/fixture-solid-next/playwright.config.ts

```diff
--- base/apps/fixture-solid-next/playwright.config.ts
+++ apps/fixture-solid-next/playwright.config.ts
@@ -1,2 +1,22 @@
 import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/contract', use: { baseURL: 'http://127.0.0.1:4173' } });
+export default defineConfig({
+  testDir: './tests',
+  testMatch: 'native-probe.spec.ts',
+  forbidOnly: true,
+  retries: 0,
+  workers: 1,
+  timeout: 15000,
+  outputDir: process.env.KRDS_REPORT_DIR
+    ? `${process.env.KRDS_REPORT_DIR}/artifacts`
+    : `../../test-results/t05/solid-next-native-${Date.now()}-${process.pid}/artifacts`,
+  reporter: [['list']],
+  use: {
+    browserName: 'chromium',
+    viewport: { width: 1280, height: 800 },
+    locale: 'ko-KR',
+    timezoneId: 'Asia/Seoul',
+    colorScheme: 'light',
+    reducedMotion: 'reduce',
+    serviceWorkers: 'block',
+  },
+});
```

## apps/fixture-solid-next/project.json

```diff
--- base/apps/fixture-solid-next/project.json
+++ apps/fixture-solid-next/project.json
@@ -21,28 +21,32 @@
       }
     },
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-solid-next typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
+      "cache": false,
+      "dependsOn": ["build", "^build"],
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-solid-next test"
       }
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-solid-next lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
+      "cache": false,
+      "dependsOn": ["build", "^build"],
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-solid-next contract"
+        "command": "node tools/yarn.mjs test:contract --framework solid-next"
       }
     }
   }
 }
```

## apps/fixture-solid-next/src/main.tsx

```diff
--- base/apps/fixture-solid-next/src/main.tsx
+++ apps/fixture-solid-next/src/main.tsx
@@ -1,4 +1,51 @@
-/** T01 toolchain probe only; no component coverage. */
+/** T05 native infrastructure only; actual KRDS components belong to T09. */
+import { createSignal, onCleanup, onSettled } from 'solid-js';
 import { render } from '@solidjs/web';
 import { WorkspaceProbe } from '@krds-native/solid-next';
-render(() => <WorkspaceProbe />, document.getElementById('app')!);
+import { createFixtureBridge } from '@krds-native/test-contracts/driver';
+
+const route = new URL(window.location.href);
+const componentId = decodeURIComponent(route.pathname.split('/')[2] ?? 'unknown');
+const caseId = route.searchParams.get('case') ?? 'unknown';
+const isProbe = componentId === '__probe' && caseId === 'native-state';
+const initialState: Record<string, unknown> = isProbe
+  ? { count: 0, label: 'Probe increment', disabled: false }
+  : {};
+const bridge = createFixtureBridge('solid-next', initialState);
+
+function Fixture() {
+  const [state, setState] = createSignal(initialState);
+  // Solid 2 lifecycle callbacks run after render. Returning the subscription
+  // cleanup keeps bridge writes outside a component's tracked execution.
+  onSettled(() => bridge.subscribe(next => setState(next)));
+  onCleanup(() => bridge.dispose());
+
+  function increment() {
+    const current = bridge.getState();
+    if (current.disabled) return;
+    const value = Number(current.count) + 1;
+    void bridge.setState({ count: value });
+    bridge.recordEvent('change', { value });
+  }
+
+  return (
+    <main>
+      <h1>Solid 2 native fixture</h1>
+      <WorkspaceProbe />
+      <p role="status" aria-label="Fixture health">ready</p>
+      {isProbe ? (
+        <section aria-label="Infrastructure probe">
+          <button type="button" disabled={Boolean(state().disabled)} onClick={increment}>
+            {String(state().label)}
+          </button>
+          <p role="status" aria-label="Probe value">{String(state().count)}</p>
+        </section>
+      ) : (
+        <p role="note">Component not implemented: {componentId}/{caseId}</p>
+      )}
+    </main>
+  );
+}
+
+const dispose = render(() => <Fixture />, document.getElementById('app')!);
+window.addEventListener('pagehide', () => dispose(), { once: true });
```

## apps/fixture-solid-next/tests/native-probe.spec.ts

```diff
--- base/apps/fixture-solid-next/tests/native-probe.spec.ts
+++ apps/fixture-solid-next/tests/native-probe.spec.ts
@@ -0,0 +1,73 @@
+import { test as base, expect } from '@playwright/test';
+import { fileURLToPath } from 'node:url';
+import { createFixtureDriver } from '@krds-native/test-contracts/driver';
+import { serveProduction } from '../../../tools/testing/support.mjs';
+
+// Use the same production server as the common runner; no dev server or HMR.
+const test = base.extend<{}, { origin: string }>({
+  origin: [async ({}, use) => {
+    const directory = fileURLToPath(new URL('../dist/', import.meta.url));
+    const server = await serveProduction(directory, { fixture: true });
+    try { await use(server.origin); } finally { await server.close(); }
+  }, { scope: 'worker' }],
+});
+
+test('native controlled state, disabled interaction, focus and event history', async ({ page, origin }) => {
+  const errors: string[] = [];
+  page.on('pageerror', error => errors.push(error.message));
+  const driver = createFixtureDriver(page, origin);
+  await driver.open({ framework: 'solid-next', componentId: '__probe', caseId: 'native-state' });
+  await expect(page.getByRole('status', { name: 'Fixture health', exact: true })).toHaveText('ready');
+  const button = page.getByRole('button', { name: 'Probe increment', exact: true });
+  await button.click();
+  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('1');
+  expect(await driver.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }]);
+  await driver.setState({ count: 7, label: 'Updated probe', disabled: true });
+  const updated = page.getByRole('button', { name: 'Updated probe', exact: true });
+  await expect(updated).toBeDisabled();
+  await updated.dispatchEvent('click');
+  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('7');
+  expect(await driver.readEvents()).toHaveLength(1);
+  await driver.setState({ disabled: false });
+  await updated.focus();
+  await expect(updated).toBeFocused();
+  await page.keyboard.press('Enter');
+  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('8');
+  expect(await driver.readEvents()).toEqual([
+    { name: 'change', detail: { value: 1 } },
+    { name: 'change', detail: { value: 8 } },
+  ]);
+  expect(await page.evaluate(() => window.__KRDS_FIXTURE__!.getState())).toMatchObject({ count: 8 });
+  expect(errors).toEqual([]);
+});
+
+test('all canonical pilot routes stay healthy while declaring missing components', async ({ page, origin }) => {
+  const driver = createFixtureDriver(page, origin);
+  for (const [componentId, caseId] of [
+    ['button', 'disabled'], ['native-select', 'controlled'], ['native-select', 'form-reset'],
+    ['modal', 'focus-return'], ['modal', 'trigger-removed'], ['tabs', 'manual-activation'],
+    ['date-input', 'leap-year'], ['date-input', 'ime'], ['date-input', 'timezone-invariance'],
+  ]) {
+    await driver.open({ framework: 'solid-next', componentId, caseId });
+    await expect(page.getByRole('status', { name: 'Fixture health', exact: true })).toHaveText('ready');
+    await expect(page.getByRole('note')).toHaveText(`Component not implemented: ${componentId}/${caseId}`);
+    await driver.setState({ healthy: true });
+    expect(await page.evaluate(() => window.__KRDS_FIXTURE__!.getState())).toEqual({ healthy: true });
+    expect(await driver.readEvents()).toEqual([]);
+  }
+});
+
+test('route navigation resets state and page lifecycle disposes the native root', async ({ page, origin }) => {
+  const driver = createFixtureDriver(page, origin);
+  const probe = { framework: 'solid-next', componentId: '__probe', caseId: 'native-state' } as const;
+  await driver.open(probe);
+  await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
+  await driver.open({ framework: 'solid-next', componentId: 'button', caseId: 'disabled' });
+  expect(await driver.readEvents()).toEqual([]);
+  await driver.open(probe);
+  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('0');
+  expect(await driver.readEvents()).toEqual([]);
+  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')));
+  expect(await page.evaluate(() => window.__KRDS_FIXTURE__)).toBeUndefined();
+  await expect(page.getByRole('button')).toHaveCount(0);
+});
```
