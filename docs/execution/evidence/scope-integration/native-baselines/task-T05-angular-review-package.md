# T05 Angular exact native scope changes

Baseline T01app probes captured beforeT05. Sharedroot/core integration separatelyreviewed; all authoredchangedappsource/config/tests follow.

## apps/fixture-angular/index.html

```diff
--- base/apps/fixture-angular/index.html
+++ apps/fixture-angular/index.html
@@ -1,2 +1,2 @@
 <!doctype html>
-<html lang="en"><head><meta charset="utf-8"><title>T01 compiler probe</title></head><body><krds-workspace-probe></krds-workspace-probe></body></html>
+<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="/"><title>Angular native fixtures</title></head><body><krds-fixture-app></krds-fixture-app></body></html>
```

## apps/fixture-angular/package.json

```diff
--- base/apps/fixture-angular/package.json
+++ apps/fixture-angular/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/fixture-angular",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
     "test": "node --test ../../tools/workspace-probe.test.mjs",
     "lint": "node ../../tools/check-workspace.mjs",
-    "typecheck": "ngc -p tsconfig.json --noEmit",
+    "typecheck": "ngc -p tsconfig.test.json --noEmit",
     "build:local": "ng build fixture-angular",
-    "contract": "playwright test",
-    "siheom": "vitest run --config vitest.config.ts"
+    "contract": "node ../../tools/run-contract-tests.mjs --framework angular",
+    "siheom": "node ../../tools/run-siheom-tests.mjs --framework angular",
+    "siheom:local": "vitest run --config vitest.config.ts"
   },
   "devDependencies": {
     "@angular-devkit/architect": "0.2202.5",
     "@angular-devkit/build-angular": "22.2.5",
     "@angular-devkit/core": "22.2.5",
     "@angular/animations": "22.2.4",
     "@angular/build": "22.2.5",
     "@angular/cli": "22.2.5",
     "@angular/common": "22.2.4",
     "@angular/compiler": "22.2.4",
```

## apps/fixture-angular/project.json

```diff
--- base/apps/fixture-angular/project.json
+++ apps/fixture-angular/project.json
@@ -34,21 +34,31 @@
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-angular lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-angular contract"
-      }
+        "command": "node tools/yarn.mjs test:contract --framework angular"
+      },
+      "cache": false,
+      "dependsOn": [
+        "build",
+        "^build"
+      ]
     },
     "siheom": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-angular siheom"
-      }
+        "command": "node tools/yarn.mjs test:siheom --framework angular"
+      },
+      "cache": false,
+      "dependsOn": [
+        "build",
+        "^build"
+      ]
     }
   }
 }
```

## apps/fixture-angular/src/fixture-app.ts

```diff
--- base/apps/fixture-angular/src/fixture-app.ts
+++ apps/fixture-angular/src/fixture-app.ts
@@ -0,0 +1,32 @@
+import { Component, signal, type OnDestroy } from '@angular/core';
+import { WorkspaceProbe } from '@krds-native/angular';
+import { createFixtureBridge } from '@krds-native/test-contracts/driver';
+import { NativeProbe } from './native-probe';
+
+@Component({
+  selector: 'krds-fixture-app', standalone: true, imports: [NativeProbe, WorkspaceProbe],
+  template: `<h1>Angular native fixture</h1>
+    <krds-workspace-probe hidden />
+    <p role="status" aria-label="Fixture health">ready</p>
+    @if (isProbe) {
+      <krds-native-probe [count]="count()" [label]="label()" [disabled]="disabled()" (change)="update($event)" />
+    } @else {
+      <p role="note">Component not implemented: {{ componentId }}/{{ caseId }}</p>
+    }`,
+})
+export class FixtureApplication implements OnDestroy {
+  readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? 'unknown');
+  readonly caseId = new URLSearchParams(location.search).get('case') ?? 'unknown';
+  readonly isProbe = this.componentId === '__probe' && this.caseId === 'native-state';
+  readonly state = signal<Record<string, unknown>>({});
+  readonly bridge = createFixtureBridge('angular', this.isProbe ? { count: 0, label: 'Probe increment', disabled: false } : {});
+  private readonly unsubscribe = this.bridge.subscribe(next => this.state.set(next));
+  count() { return Number(this.state()['count'] ?? 0); }
+  label() { return String(this.state()['label'] ?? 'Probe increment'); }
+  disabled() { return this.state()['disabled'] === true; }
+  update(value: number) {
+    this.bridge.recordEvent('change', { value });
+    void this.bridge.setState({ count: value });
+  }
+  ngOnDestroy() { this.unsubscribe(); this.bridge.dispose(); }
+}
```

## apps/fixture-angular/src/main.ts

```diff
--- base/apps/fixture-angular/src/main.ts
+++ apps/fixture-angular/src/main.ts
@@ -1,5 +1,3 @@
-/** T01 toolchain probe only; no component coverage. */
-import '@angular/compiler';
 import { bootstrapApplication } from '@angular/platform-browser';
-import { WorkspaceProbe } from '@krds-native/angular';
-void bootstrapApplication(WorkspaceProbe);
+import { FixtureApplication } from './fixture-app';
+void bootstrapApplication(FixtureApplication).catch(error => { console.error(error); });
```

## apps/fixture-angular/src/native-probe.ts

```diff
--- base/apps/fixture-angular/src/native-probe.ts
+++ apps/fixture-angular/src/native-probe.ts
@@ -0,0 +1,14 @@
+/** Test-only native renderer probe, never KRDS catalog coverage. */
+import { Component, EventEmitter, Input, Output } from '@angular/core';
+
+@Component({
+  selector: 'krds-native-probe', standalone: true,
+  template: `<button type="button" [disabled]="disabled" (click)="change.emit(count + 1)">{{ label }}</button>
+    <output role="status" aria-label="Probe value">{{ count }}</output>`,
+})
+export class NativeProbe {
+  @Input() count = 0;
+  @Input() label = 'Probe increment';
+  @Input() disabled = false;
+  @Output() change = new EventEmitter<number>();
+}
```

## apps/fixture-angular/tests/setup.ts

```diff
--- base/apps/fixture-angular/tests/setup.ts
+++ apps/fixture-angular/tests/setup.ts
@@ -0,0 +1,8 @@
+import '@angular/compiler';
+import '@testing-library/jest-dom/vitest';
+import { TestBed } from '@angular/core/testing';
+import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
+import '@testing-library/angular';
+import { afterEach } from 'vitest';
+TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
+afterEach(() => TestBed.resetTestingModule());
```

## apps/fixture-angular/tests/siheom/button.test.ts

```diff
--- base/apps/fixture-angular/tests/siheom/button.test.ts
+++ apps/fixture-angular/tests/siheom/button.test.ts
@@ -0,0 +1,6 @@
+import { test } from 'vitest';
+import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
+test('disabled button is unavailable after healthy native fixture mount', async () => {
+  await openPilot('button', 'disabled');
+  await runSiheom(assertions.disabled(query.button('저장')));
+});
```

## apps/fixture-angular/tests/siheom/date-input.test.ts

```diff
--- base/apps/fixture-angular/tests/siheom/date-input.test.ts
+++ apps/fixture-angular/tests/siheom/date-input.test.ts
@@ -0,0 +1,6 @@
+import { test } from 'vitest';
+import { openPilot, actions, query, runSiheom } from './pilot-fixture';
+for (const caseId of ['leap-year', 'ime', 'timezone-invariance']) test(`date input ${caseId} after healthy fixture mount`, async () => {
+  await openPilot('date-input', caseId);
+  await runSiheom(actions.fill(query.textbox('날짜'), '2023-02-29'));
+});
```

## apps/fixture-angular/tests/siheom/modal.test.ts

```diff
--- base/apps/fixture-angular/tests/siheom/modal.test.ts
+++ apps/fixture-angular/tests/siheom/modal.test.ts
@@ -0,0 +1,6 @@
+import { test } from 'vitest';
+import { openPilot, actions, query, runSiheom } from './pilot-fixture';
+for (const caseId of ['focus-return', 'trigger-removed']) test(`modal ${caseId} after healthy fixture mount`, async () => {
+  await openPilot('modal', caseId);
+  await runSiheom(actions.click(query.button('열기')));
+});
```

## apps/fixture-angular/tests/siheom/native-probe.test.ts

```diff
--- base/apps/fixture-angular/tests/siheom/native-probe.test.ts
+++ apps/fixture-angular/tests/siheom/native-probe.test.ts
@@ -0,0 +1,49 @@
+/** Native infrastructure only; this does not assert KRDS component coverage. */
+import { Component, getDebugNode, signal } from '@angular/core';
+import { TestBed } from '@angular/core/testing';
+import { screen } from '@testing-library/dom';
+import { actions, assertions, given, query, runSiheom } from '@siheom/angular';
+import { expect, test } from 'vitest';
+import { page, userEvent } from 'vitest/browser';
+import { NativeProbe } from '../../src/native-probe';
+
+@Component({
+  selector: 'test-controlled-probe', standalone: true, imports: [NativeProbe],
+  template: `<krds-native-probe [count]="count()" [label]="label()" (change)="count.set($event)" />`,
+})
+class ControlledProbe {
+  count = signal(0);
+  label = signal('Probe increment');
+}
+
+test('native adapter render, click, controlled state update and cleanup', async () => {
+  await runSiheom(given.render(ControlledProbe),
+    assertions.textContent(query.status('Probe value'), '0'),
+    actions.click(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '1'));
+  const controller = getDebugNode(screen.getByRole('button'))!.injector.get(ControlledProbe);
+  controller.count.set(7);
+  controller.label.set('Updated probe');
+  await runSiheom(assertions.textContent(query.status('Probe value'), '7'),
+    actions.click(query.button('Updated probe')),
+    assertions.textContent(query.status('Probe value'), '8'));
+  TestBed.resetTestingModule();
+  expect(screen.queryByRole('button')).toBeNull();
+  expect(document.querySelector('krds-native-probe')).toBeNull();
+});
+
+test('native adapter synthetic click focuses the native button', async () => {
+  await runSiheom(given.render(ControlledProbe), actions.click(query.button('Probe increment')),
+    assertions.focused(query.button('Probe increment')));
+});
+
+
+test('Playwright provider trusted click focuses the native button', async () => {
+  await runSiheom(given.render(ControlledProbe));
+  let trusted = false;
+  screen.getByRole('button', { name: 'Probe increment' }).addEventListener('click', event => { trusted = event.isTrusted; }, { once: true });
+  await userEvent.click(page.getByRole('button', { name: 'Probe increment' }));
+  expect(trusted).toBe(true);
+  await runSiheom(assertions.focused(query.button('Probe increment')),
+    assertions.textContent(query.status('Probe value'), '1'));
+});
```

## apps/fixture-angular/tests/siheom/native-select.test.ts

```diff
--- base/apps/fixture-angular/tests/siheom/native-select.test.ts
+++ apps/fixture-angular/tests/siheom/native-select.test.ts
@@ -0,0 +1,6 @@
+import { test } from 'vitest';
+import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
+for (const caseId of ['controlled', 'form-reset']) test(`native select ${caseId} after healthy fixture mount`, async () => {
+  await openPilot('native-select', caseId);
+  await runSiheom(assertions.value(query.combobox('지역'), 'seoul'));
+});
```

## apps/fixture-angular/tests/siheom/pilot-fixture.ts

```diff
--- base/apps/fixture-angular/tests/siheom/pilot-fixture.ts
+++ apps/fixture-angular/tests/siheom/pilot-fixture.ts
@@ -0,0 +1,14 @@
+import { actions, assertions, given, query, runSiheom } from '@siheom/angular';
+import { expect } from 'vitest';
+import { FixtureApplication } from '../../src/fixture-app';
+
+/** Verify the native route before asserting an intentionally missing feature. */
+export async function openPilot(componentId: string, caseId: string) {
+  history.replaceState(null, '', `/fixtures/${componentId}?case=${caseId}`);
+  await runSiheom(given.render(FixtureApplication),
+    assertions.textContent(query.status('Fixture health'), 'ready'),
+    assertions.textContent(query.note(''), `Component not implemented: ${componentId}/${caseId}`));
+  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
+  expect(window.__KRDS_FIXTURE__?.framework).toBe('angular');
+}
+export { actions, assertions, query, runSiheom };
```

## apps/fixture-angular/tests/siheom/tabs.test.ts

```diff
--- base/apps/fixture-angular/tests/siheom/tabs.test.ts
+++ apps/fixture-angular/tests/siheom/tabs.test.ts
@@ -0,0 +1,6 @@
+import { test } from 'vitest';
+import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
+test('manual tabs activation after healthy fixture mount', async () => {
+  await openPilot('tabs', 'manual-activation');
+  await runSiheom(assertions.selected(query.tab('첫 번째')));
+});
```

## apps/fixture-angular/tsconfig.test.json

```diff
--- base/apps/fixture-angular/tsconfig.test.json
+++ apps/fixture-angular/tsconfig.test.json
@@ -0,0 +1,5 @@
+{
+  "extends": "./tsconfig.json",
+  "compilerOptions": { "types": ["node", "vitest/globals"] },
+  "include": ["src/**/*.ts", "tests/**/*.ts", "vitest.config.ts"]
+}
```

## apps/fixture-angular/vitest.config.ts

```diff
--- base/apps/fixture-angular/vitest.config.ts
+++ apps/fixture-angular/vitest.config.ts
@@ -1,3 +1,37 @@
 import { defineConfig } from 'vitest/config';
 import { playwright } from '@vitest/browser-playwright';
-export default defineConfig({ plugins: [], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
+import ts from 'typescript';
+import { createServer, type AddressInfo } from 'node:net';
+// Vitest 4 treats api.port=0 as its fixed default; reserve an OS-selected port explicitly.
+const reservation = createServer();
+await new Promise<void>((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
+const browserPort = (reservation.address() as AddressInfo).port;
+await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
+// Official TestBed JIT needs legacy Angular decorators transformed by the selected TypeScript compiler.
+// This test-only transform never replaces the production Angular CLI application builder.
+export default defineConfig({
+  plugins: [{
+    name: 'angular-testbed-jit-typescript', enforce: 'pre',
+    transform(source, id) {
+      if (!id.includes('/fixture-angular/') || !/\.ts$/.test(id) || id.includes('/node_modules/')) return;
+      return { code: ts.transpileModule(source, { compilerOptions: {
+        target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
+        experimentalDecorators: true, sourceMap: false,
+      }, fileName: id }).outputText, map: null };
+    },
+  }],
+  test: {
+    globals: true,
+    include: process.env.KRDS_TEST_MODE === 'probe' ? ['tests/siheom/native-probe.test.ts'] : ['tests/siheom/*.test.ts'],
+    exclude: process.env.KRDS_TEST_MODE === 'probe' ? [] : ['tests/siheom/native-probe.test.ts'],
+    setupFiles: ['tests/setup.ts'],
+    passWithNoTests: false,
+    browser: {
+      enabled: true, headless: true, api: { host: '127.0.0.1', port: browserPort },
+      viewport: { width: 1280, height: 800 },
+      screenshotDirectory: `../../.superpowers/sdd/PLAN/t05-angular-logs/siheom-${process.pid}-screenshots`,
+      provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }),
+      instances: [{ browser: 'chromium' }],
+    },
+  },
+});
```

## apps/storybook-angular/.storybook/main.ts

```diff
--- base/apps/storybook-angular/.storybook/main.ts
+++ apps/storybook-angular/.storybook/main.ts
@@ -1 +1,9 @@
-export default { framework: '@storybook/angular', stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], core: { disableTelemetry: true } };
+import { createRequire } from 'node:module';
+import { dirname } from 'node:path';
+const require = createRequire(import.meta.url);
+export default {
+  framework: dirname(require.resolve('@storybook/angular/package.json')),
+  stories: ['../src/stories/**/*.stories.ts'],
+  addons: [],
+  core: { disableTelemetry: true },
+};
```

## apps/storybook-angular/.storybook/preview.ts

```diff
--- base/apps/storybook-angular/.storybook/preview.ts
+++ apps/storybook-angular/.storybook/preview.ts
@@ -0,0 +1,3 @@
+import type { Preview } from '@storybook/angular';
+const preview: Preview = { parameters: { layout: 'padded' } };
+export default preview;
```

## apps/storybook-angular/angular.json

```diff
--- base/apps/storybook-angular/angular.json
+++ apps/storybook-angular/angular.json
@@ -17,17 +17,18 @@
               "browser": ""
             },
             "polyfills": []
           }
         },
         "build-storybook": {
           "builder": "@storybook/angular:build-storybook",
           "options": {
             "configDir": ".storybook",
             "browserTarget": "storybook-angular:build",
-            "outputDir": "dist"
+            "outputDir": "dist",
+            "compodoc": false
           }
         }
       }
     }
   }
 }
```

## apps/storybook-angular/package.json

```diff
--- base/apps/storybook-angular/package.json
+++ apps/storybook-angular/package.json
@@ -2,21 +2,22 @@
   "name": "@krds-native/storybook-angular",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
     "test": "node --test ../../tools/workspace-probe.test.mjs",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "ngc -p tsconfig.json --noEmit",
     "build:local": "ng run storybook-angular:build-storybook",
     "storybook-build": "ng run storybook-angular:build-storybook",
-    "stories": "playwright test"
+    "stories": "node ../../tools/run-story-tests.mjs --framework angular",
+    "storybook-build:local": "ng run storybook-angular:build-storybook"
   },
   "devDependencies": {
     "@angular-devkit/architect": "0.2202.5",
     "@angular-devkit/build-angular": "22.2.5",
     "@angular-devkit/core": "22.2.5",
     "@angular/animations": "22.2.4",
     "@angular/build": "22.2.5",
     "@angular/cli": "22.2.5",
     "@angular/common": "22.2.4",
     "@angular/compiler": "22.2.4",
```

## apps/storybook-angular/project.json

```diff
--- base/apps/storybook-angular/project.json
+++ apps/storybook-angular/project.json
@@ -34,21 +34,32 @@
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-angular lint"
       }
     },
     "storybook-build": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-angular storybook-build"
-      }
+        "command": "node tools/yarn.mjs workspace @krds-native/storybook-angular storybook-build:local"
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
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-angular stories"
-      }
+        "command": "node tools/yarn.mjs test:stories --framework angular"
+      },
+      "cache": false,
+      "dependsOn": [
+        "storybook-build",
+        "^build"
+      ]
     }
   }
 }
```

## apps/storybook-angular/src/stories/native-probe.ts

```diff
--- base/apps/storybook-angular/src/stories/native-probe.ts
+++ apps/storybook-angular/src/stories/native-probe.ts
@@ -0,0 +1,16 @@
+/** Native Storybook infrastructure only; this is not a KRDS widget. */
+import { Component, Input } from '@angular/core';
+@Component({
+  selector: 'krds-story-native-probe', standalone: true,
+  template: `@if (errorMessage) { <p role="alert">{{ errorMessage }}</p> } @else {
+    <button type="button" [disabled]="disabled || loading" (click)="count = count + 1">{{ label }}</button>
+    <output role="status" aria-label="Probe value">{{ count }}</output>
+  }`,
+})
+export class NativeStoryProbe {
+  @Input() count = 0;
+  @Input() label = 'Probe increment';
+  @Input() disabled = false;
+  @Input() loading = false;
+  @Input() errorMessage = '';
+}
```

## apps/storybook-angular/src/stories/probe.stories.ts

```diff
--- base/apps/storybook-angular/src/stories/probe.stories.ts
+++ apps/storybook-angular/src/stories/probe.stories.ts
@@ -1,4 +1,12 @@
-/** Toolchain probe: excluded from KRDS catalog/story coverage. */
-import { WorkspaceProbe } from '@krds-native/angular';
-export default { title: 'Bootstrap/T01 probe', component: WorkspaceProbe };
-export const Probe = { args: {} };
+/** Test-only infrastructure stories; excluded from KRDS catalog coverage. */
+import type { Meta, StoryObj } from '@storybook/angular';
+import type { StoryStateCase } from '@krds-native/test-contracts';
+import { infrastructureStoryCases } from '@krds-native/test-contracts/fixtures';
+import { NativeStoryProbe } from './native-probe';
+const state = (id: StoryStateCase['id']) => ({ ...infrastructureStoryCases.find(item => item.id === id)!.state });
+const meta: Meta<NativeStoryProbe> = { title: 'Infrastructure/Native probe', component: NativeStoryProbe };
+export default meta;
+type Story = StoryObj<NativeStoryProbe>;
+export const Default: Story = { args: state('infrastructure-native-probe--default') };
+export const Loading: Story = { args: state('infrastructure-native-probe--loading') };
+export const Error: Story = { args: state('infrastructure-native-probe--error') };
```

## apps/storybook-angular/tsconfig.json

```diff
--- base/apps/storybook-angular/tsconfig.json
+++ apps/storybook-angular/tsconfig.json
@@ -1,14 +1,15 @@
 {
   "extends": "../../tsconfig.base.json",
   "compilerOptions": {
-    "noEmit": true,
+    "noEmit": false,
     "types": [
       "node"
     ],
     "experimentalDecorators": true
   },
   "include": [
     "src/**/*.ts",
-    "src/**/*.tsx"
+    "src/**/*.tsx",
+    ".storybook/**/*.ts"
   ]
 }
```
