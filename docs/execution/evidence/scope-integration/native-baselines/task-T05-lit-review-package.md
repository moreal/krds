# T05 lit exact uncommitted native scope diff

Baseline reviewed T01 app probes captured before T05. Common protocol/runners and shared root changes are separate core scope. All authored changed app source/config/tests follow; generated browser screenshots/outputs are evidence, not source.

## apps/fixture-lit/index.html

```diff
--- base/apps/fixture-lit/index.html
+++ apps/fixture-lit/index.html
@@ -1,2 +1,2 @@
 <!doctype html>
-<html lang="en"><head><meta charset="utf-8"><title>T01 compiler probe</title></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>
+<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lit native test fixture</title></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>
```

## apps/fixture-lit/package.json

```diff
--- base/apps/fixture-lit/package.json
+++ apps/fixture-lit/package.json
@@ -1,21 +1,21 @@
 {
   "name": "@krds-native/fixture-lit",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node --test tests/contract/native-probe.test.mjs",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
-    "contract": "playwright test"
+    "contract": "node ../../tools/run-contract-tests.mjs --framework lit"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@lit-labs/ssr": "4.1.0",
     "@lit-labs/ssr-client": "1.1.8",
     "@playwright/test": "1.64.1",
     "@types/node": "24.13.3",
     "@vitest/browser-playwright": "4.1.10",
     "lit": "3.3.3",
     "playwright": "1.64.1",
```

## apps/fixture-lit/playwright.config.ts

```diff
--- base/apps/fixture-lit/playwright.config.ts
+++ apps/fixture-lit/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/contract', use: { baseURL: 'http://127.0.0.1:4173' } });
```

## apps/fixture-lit/project.json

```diff
--- base/apps/fixture-lit/project.json
+++ apps/fixture-lit/project.json
@@ -23,26 +23,45 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-lit typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-lit test"
-      }
+      },
+      "dependsOn": [
+        "build",
+        "^build"
+      ],
+      "cache": false
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/fixture-lit lint"
       }
     },
     "contract": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/fixture-lit contract"
-      }
+        "command": "node tools/yarn.mjs test:contract --framework lit"
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
+        "{workspaceRoot}/specs/components/**/*",
+        "{workspaceRoot}/playwright.config.ts",
+        "{workspaceRoot}/packages/test-contracts/**/*",
+        "{workspaceRoot}/compatibility/testing.json"
+      ]
     }
   }
 }
```

## apps/fixture-lit/src/main.ts

```diff
--- base/apps/fixture-lit/src/main.ts
+++ apps/fixture-lit/src/main.ts
@@ -1,4 +1,47 @@
-/** T01 toolchain probe only; no component coverage. */
+/** Native test infrastructure only. No KRDS component coverage. */
+import { LitElement, html } from 'lit';
 import { WorkspaceProbe } from '@krds-native/lit';
-customElements.define('krds-workspace-probe', WorkspaceProbe);
-document.getElementById('app')!.append(document.createElement('krds-workspace-probe'));
+import { createFixtureBridge } from '@krds-native/test-contracts/driver';
+import type { FixtureBridge } from '@krds-native/test-contracts';
+
+// Resolve the adapter's built public entry without a development source alias.
+if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);
+
+class LitFixture extends LitElement {
+  static override properties = { state: { state: true } };
+  declare private state: Record<string, unknown>;
+  private bridge?: FixtureBridge;
+  private unsubscribe?: () => void;
+  private readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? '');
+  private readonly caseId = new URLSearchParams(location.search).get('case') ?? '';
+  constructor() { super(); this.state = {}; }
+
+  override connectedCallback() {
+    super.connectedCallback();
+    this.bridge = createFixtureBridge('lit', this.componentId === '__probe'
+      ? { count: 0, label: 'Probe increment', disabled: false } : {});
+    this.unsubscribe = this.bridge.subscribe(state => { this.state = state; });
+  }
+  override disconnectedCallback() {
+    this.unsubscribe?.();
+    this.bridge?.dispose();
+    super.disconnectedCallback();
+  }
+  private increment() {
+    if (this.state.disabled) return;
+    const count = Number(this.state.count) + 1;
+    this.bridge!.recordEvent('change', { value: count });
+    void this.bridge!.setState({ count });
+  }
+  override render() {
+    return html`
+      <p role="status" aria-label="Fixture health">ready</p>
+      ${this.componentId === '__probe' && this.caseId === 'native-state' ? html`
+        <button ?disabled=${Boolean(this.state.disabled)} @click=${this.increment}>${String(this.state.label)}</button>
+        <p role="status" aria-label="Probe value">${String(this.state.count)}</p>
+      ` : html`<p role="note">Component not implemented: ${this.componentId}/${this.caseId}</p>`}
+    `;
+  }
+}
+customElements.define('krds-lit-fixture', LitFixture);
+document.getElementById('app')!.append(document.createElement('krds-lit-fixture'));
```

## apps/fixture-lit/tests/contract/native-probe.test.mjs

```diff
--- base/apps/fixture-lit/tests/contract/native-probe.test.mjs
+++ apps/fixture-lit/tests/contract/native-probe.test.mjs
@@ -0,0 +1,43 @@
+import test from 'node:test';
+import assert from 'node:assert/strict';
+import { chromium } from 'playwright';
+import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
+
+process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
+
+// Removing the Lit state subscription, click event or teardown must break this test.
+test('Lit production probe updates through its bridge and disposes on native disconnect', async () => {
+  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname, { fixture: true });
+  let browser;
+  try {
+    browser = await chromium.launch();
+    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' });
+    await page.goto(`${server.origin}/fixtures/__probe?case=native-state`);
+    await page.getByRole('status', { name: 'Fixture health' }).waitFor({ timeout: 5000 });
+    assert.deepEqual(await page.evaluate(() => ({ protocol: window.__KRDS_FIXTURE__.protocol, framework: window.__KRDS_FIXTURE__.framework })), { protocol: 1, framework: 'lit' });
+    const value = page.getByRole('status', { name: 'Probe value' });
+    assert.equal(await value.textContent(), '0');
+    await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
+    assert.equal(await value.textContent(), '1');
+    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ count: 7, label: 'Updated probe' }));
+    await page.getByRole('button', { name: 'Updated probe', exact: true }).click();
+    assert.equal(await value.textContent(), '8');
+    assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [{ name: 'change', detail: { value: 1 } }, { name: 'change', detail: { value: 8 } }]);
+    assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__.getState().count), 8);
+    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ disabled: true }));
+    assert.equal(await page.getByRole('button', { name: 'Updated probe' }).isDisabled(), true);
+    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ disabled: false }));
+    await page.getByRole('button', { name: 'Updated probe' }).focus();
+    assert.equal(await page.getByRole('button', { name: 'Updated probe' }).evaluate(button => button === button.getRootNode().activeElement), true);
+    await page.evaluate(() => document.querySelector('krds-lit-fixture').remove());
+    assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__ === undefined), true);
+    await page.goto(`${server.origin}/fixtures/button?case=disabled`);
+    await page.getByRole('status', { name: 'Fixture health' }).waitFor();
+    assert.equal(await page.getByRole('note').textContent(), 'Component not implemented: button/disabled');
+    assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), []);
+    assert.equal(await page.getByRole('button').count(), 0);
+  } finally {
+    await browser?.close();
+    await server.close();
+  }
+});
```

## apps/storybook-lit/.storybook/main.ts

```diff
--- base/apps/storybook-lit/.storybook/main.ts
+++ apps/storybook-lit/.storybook/main.ts
@@ -1 +1,12 @@
-export default { framework: '@storybook/web-components-vite', stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], core: { disableTelemetry: true } };
+import { createRequire } from 'node:module';
+import { dirname } from 'node:path';
+import type { StorybookConfig } from '@storybook/web-components-vite';
+const require = createRequire(import.meta.url);
+// pnpm links keep framework packages local to this consuming workspace.
+const config: StorybookConfig = {
+  framework: dirname(require.resolve('@storybook/web-components-vite/package.json')),
+  stories: ['../src/stories/**/*.stories.ts'],
+  addons: [],
+  core: { disableTelemetry: true },
+};
+export default config;
```

## apps/storybook-lit/.storybook/preview.ts

```diff
--- base/apps/storybook-lit/.storybook/preview.ts
+++ apps/storybook-lit/.storybook/preview.ts
@@ -0,0 +1,3 @@
+import type { Preview } from '@storybook/web-components-vite';
+const preview: Preview = { parameters: { layout: 'centered' } };
+export default preview;
```

## apps/storybook-lit/package.json

```diff
--- base/apps/storybook-lit/package.json
+++ apps/storybook-lit/package.json
@@ -1,22 +1,23 @@
 {
   "name": "@krds-native/storybook-lit",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node ../../tools/run-story-tests.mjs --framework lit --probe",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "storybook build --output-dir dist",
     "storybook-build": "storybook build --output-dir dist",
-    "stories": "playwright test"
+    "stories": "node ../../tools/run-story-tests.mjs --framework lit",
+    "storybook-build:local": "storybook build --output-dir dist"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@lit-labs/ssr": "4.1.0",
     "@lit-labs/ssr-client": "1.1.8",
     "@playwright/test": "1.64.1",
     "@storybook/web-components-vite": "10.6.5",
     "@types/node": "24.13.3",
     "@types/react": "19.3.0",
     "@vitest/browser-playwright": "4.1.10",
```

## apps/storybook-lit/playwright.config.ts

```diff
--- base/apps/storybook-lit/playwright.config.ts
+++ apps/storybook-lit/playwright.config.ts
@@ -1,2 +0,0 @@
-import { defineConfig } from '@playwright/test';
-export default defineConfig({ testDir: 'tests/stories' });
```

## apps/storybook-lit/project.json

```diff
--- base/apps/storybook-lit/project.json
+++ apps/storybook-lit/project.json
@@ -23,32 +23,55 @@
     "typecheck": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-lit typecheck"
       }
     },
     "test": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-lit test"
-      }
+      },
+      "dependsOn": [
+        "build",
+        "^build"
+      ],
+      "cache": false
     },
     "lint": {
       "executor": "nx:run-commands",
       "options": {
         "command": "node tools/yarn.mjs workspace @krds-native/storybook-lit lint"
       }
     },
     "storybook-build": {
       "executor": "nx:run-commands",
       "options": {
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-lit storybook-build"
-      }
+        "command": "node tools/yarn.mjs workspace @krds-native/storybook-lit storybook-build:local"
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
-        "command": "node tools/yarn.mjs workspace @krds-native/storybook-lit stories"
-      }
+        "command": "node tools/yarn.mjs test:stories --framework lit"
+      },
+      "cache": false,
+      "dependsOn": [
+        "storybook-build"
+      ],
+      "inputs": [
+        "default",
+        "^default",
+        "{workspaceRoot}/catalog/story-cases.json",
+        "{workspaceRoot}/catalog/story-coverage.json",
+        "{workspaceRoot}/packages/test-contracts/**/*",
+        "{workspaceRoot}/playwright.config.ts"
+      ]
     }
   }
 }
```

## apps/storybook-lit/src/stories/probe.stories.ts

```diff
--- base/apps/storybook-lit/src/stories/probe.stories.ts
+++ apps/storybook-lit/src/stories/probe.stories.ts
@@ -1,6 +1,41 @@
-/** Toolchain probe: excluded from KRDS catalog/story coverage. */
-import { html } from 'lit';
+/** Test-only native WebComponents states; excluded from KRDS coverage. */
+import { LitElement, html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
 import { WorkspaceProbe } from '@krds-native/lit';
+import type { StoryStateCase } from '@krds-native/test-contracts';
+import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
+
 if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);
-export default { title: 'Bootstrap/T01 probe', render: () => html`<krds-workspace-probe></krds-workspace-probe>` };
-export const Probe = { args: {} };
+
+class NativeStoryProbe extends LitElement {
+  static override properties = {
+    count: { type: Number }, label: { type: String }, disabled: { type: Boolean }, errorMessage: { type: String },
+  };
+  declare count: number;
+  declare label: string;
+  declare disabled: boolean;
+  declare errorMessage: string;
+  constructor() { super(); this.count = 0; this.label = 'Probe increment'; this.disabled = false; this.errorMessage = ''; }
+  override render() {
+    if (this.errorMessage) return html`<p role="alert">${this.errorMessage}</p>`;
+    return html`<button ?disabled=${this.disabled} @click=${() => { this.count += 1; }}>${this.label}</button>
+      <p role="status" aria-label="Probe value">${this.count}</p>`;
+  }
+}
+if (!customElements.get('krds-lit-story-probe')) customElements.define('krds-lit-story-probe', NativeStoryProbe);
+
+type ProbeArgs = { count: number; label: string; disabled: boolean; errorMessage: string };
+const argsFor = (story: StoryStateCase): ProbeArgs => ({
+  count: Number(story.state.count ?? 0), label: String(story.state.label ?? 'Probe increment'),
+  disabled: Boolean(story.state.disabled), errorMessage: String(story.state.errorMessage ?? ''),
+});
+const meta = {
+  title: 'Infrastructure/Native probe',
+  parameters: { krds: { infrastructureOnly: true, pendingPilotStories: storyStateCases.map(story => story.id) } },
+  render: (args: ProbeArgs) => html`<krds-lit-story-probe .count=${args.count} .label=${args.label} .disabled=${args.disabled} .errorMessage=${args.errorMessage}></krds-lit-story-probe>`,
+} satisfies Meta<ProbeArgs>;
+export default meta;
+type Story = StoryObj<ProbeArgs>;
+export const Default: Story = { args: argsFor(infrastructureStoryCases[0]!) };
+export const Loading: Story = { args: argsFor(infrastructureStoryCases[1]!) };
+export const Error: Story = { args: argsFor(infrastructureStoryCases[2]!) };
```

## apps/storybook-lit/tsconfig.json

```diff
--- base/apps/storybook-lit/tsconfig.json
+++ apps/storybook-lit/tsconfig.json
@@ -1,13 +1,14 @@
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
+    ".storybook/**/*.ts"
   ]
 }
```
