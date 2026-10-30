# T08-lit exact native pilot changes

Before bytes are reconstructed and hash-verified from original T01/T05 source snapshots plus frozen scope v2 raw overrides (task-native-pilots-base/BASELINE-MANIFEST.json). All native component additions and full existing integration deltas are shown. Runtime metadata/legal assets unchanged from separate reviewed scope task are excluded. No commits.

## apps/fixture-lit/harness.html

```diff
--- pre-native/apps/fixture-lit/harness.html
+++ apps/fixture-lit/harness.html
@@ -0,0 +1 @@
+<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lit native behavior harness</title></head><body><main id="app"></main><script type="module" src="/src/harness.ts"></script></body></html>
```

## apps/fixture-lit/hydrate.html

```diff
--- pre-native/apps/fixture-lit/hydrate.html
+++ apps/fixture-lit/hydrate.html
@@ -0,0 +1 @@
+<!doctype html><html lang="ko"><head><meta charset="UTF-8"><title>Lit hydration</title></head><body><main id="app"></main><script type="module" src="/src/hydrate.ts"></script></body></html>
```

## apps/fixture-lit/package.json

```diff
--- pre-native/apps/fixture-lit/package.json
+++ apps/fixture-lit/package.json
@@ -1,15 +1,15 @@
 {
   "name": "@unofficial-krds/fixture-lit",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --test tests/contract/native-probe.test.mjs",
+    "test": "node --test tests/contract/*.test.mjs",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
     "contract": "node ../../tools/run-contract-tests.mjs --framework lit"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@lit-labs/ssr": "4.1.0",
```

## apps/fixture-lit/src/assets.d.ts

```diff
--- pre-native/apps/fixture-lit/src/assets.d.ts
+++ apps/fixture-lit/src/assets.d.ts
@@ -0,0 +1 @@
+declare module '*.css';
```

## apps/fixture-lit/src/harness.ts

```diff
--- pre-native/apps/fixture-lit/src/harness.ts
+++ apps/fixture-lit/src/harness.ts
@@ -0,0 +1,12 @@
+/** Browser-only native behavior harness, separate from public library code and stories. */
+import '@unofficial-krds/tokens/tokens.css';
+import { LitElement, html } from 'lit';
+import { registerKrdsElements, machineProps } from '@unofficial-krds/lit';
+registerKrdsElements(customElements);
+class DirectiveHarness extends LitElement {
+    static override properties = { props: { attribute: false } };
+    declare props: Record<string, unknown>;
+    constructor() { super(); this.props = {}; }
+    override render() { return html `<button ${machineProps(this.props)}>Directive action</button>`; }
+}
+customElements.define('krds-directive-harness', DirectiveHarness);
```

## apps/fixture-lit/src/hydrate.ts

```diff
--- pre-native/apps/fixture-lit/src/hydrate.ts
+++ apps/fixture-lit/src/hydrate.ts
@@ -0,0 +1,13 @@
+import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
+import '@unofficial-krds/tokens/tokens.css';
+// Load element classes only after the official hydration hook has been installed.
+const { registerKrdsElements } = await import('@unofficial-krds/lit');
+const state = JSON.parse(document.getElementById('krds-hydration-state')?.textContent ?? '{}') as Record<string, Record<string, unknown>>;
+for (const [id, props] of Object.entries(state)) {
+    const element = document.getElementById(id);
+    if (element)
+        Object.assign(element, props);
+}
+registerKrdsElements(customElements);
+for (const element of document.querySelectorAll('[defer-hydration]'))
+    element.removeAttribute('defer-hydration');
```

## apps/fixture-lit/src/main.ts

```diff
--- pre-native/apps/fixture-lit/src/main.ts
+++ apps/fixture-lit/src/main.ts
@@ -1,47 +1,47 @@
-/** Native test infrastructure only. No KRDS component coverage. */
+import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
+import '@unofficial-krds/tokens/tokens.css';
 import { LitElement, html } from 'lit';
-import { WorkspaceProbe } from '@unofficial-krds/lit';
+import { registerKrdsElements } from '@unofficial-krds/lit';
 import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
 import type { FixtureBridge } from '@unofficial-krds/test-contracts';
-
-// Resolve the adapter's built public entry without a development source alias.
-if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);
-
+registerKrdsElements(customElements);
 class LitFixture extends LitElement {
-  static override properties = { state: { state: true } };
-  declare private state: Record<string, unknown>;
-  private bridge?: FixtureBridge;
-  private unsubscribe?: () => void;
-  private readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? '');
-  private readonly caseId = new URLSearchParams(location.search).get('case') ?? '';
-  constructor() { super(); this.state = {}; }
-
-  override connectedCallback() {
-    super.connectedCallback();
-    this.bridge = createFixtureBridge('lit', this.componentId === '__probe'
-      ? { count: 0, label: 'Probe increment', disabled: false } : {});
-    this.unsubscribe = this.bridge.subscribe(state => { this.state = state; });
-  }
-  override disconnectedCallback() {
-    this.unsubscribe?.();
-    this.bridge?.dispose();
-    super.disconnectedCallback();
-  }
-  private increment() {
-    if (this.state.disabled) return;
-    const count = Number(this.state.count) + 1;
-    this.bridge!.recordEvent('change', { value: count });
-    void this.bridge!.setState({ count });
-  }
-  override render() {
-    return html`
-      <p role="status" aria-label="Fixture health">ready</p>
-      ${this.componentId === '__probe' && this.caseId === 'native-state' ? html`
-        <button ?disabled=${Boolean(this.state.disabled)} @click=${this.increment}>${String(this.state.label)}</button>
-        <p role="status" aria-label="Probe value">${String(this.state.count)}</p>
-      ` : html`<p role="note">Component not implemented: ${this.componentId}/${this.caseId}</p>`}
-    `;
-  }
+    static override properties = { state: { state: true } };
+    declare private state: Record<string, unknown>;
+    private bridge?: FixtureBridge;
+    private unsubscribe?: () => void;
+    private readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? '');
+    private readonly caseId = new URLSearchParams(location.search).get('case') ?? '';
+    constructor() { super(); this.state = {}; }
+    override createRenderRoot() { return this; }
+    override connectedCallback() { super.connectedCallback(); const initial: Record<string, unknown> = { value: 'seoul', triggerVisible: true, open: false }; if (this.componentId === 'date-input')
+        initial.value = this.caseId === 'timezone-invariance' ? '2024-02-29' : null; if (this.componentId === 'tabs')
+        initial.value = 'first'; this.bridge = createFixtureBridge('lit', initial); this.unsubscribe = this.bridge.subscribe(state => { this.state = state; }); }
+    override disconnectedCallback() { this.unsubscribe?.(); this.bridge?.dispose(); super.disconnectedCallback(); }
+    private value = (event: CustomEvent<{
+        value: unknown;
+    }>) => { event.stopPropagation(); this.bridge?.recordEvent('valueChange', event.detail); if (!this.state.reject)
+        void this.bridge?.setState({ value: event.detail.value }); };
+    private modal = (event: CustomEvent<{
+        open: boolean;
+    }>) => { this.bridge?.recordEvent('openChange', event.detail); if (!this.state.reject)
+        void this.bridge?.setState({ open: event.detail.open }); };
+    override render() { return html `<main style="max-width:58rem;margin:1rem auto;padding:1rem"><p role="status" aria-label="Fixture health">ready</p>${this.pilot()}</main>`; }
+    private pilot() {
+        if (this.componentId === 'button')
+            return html `<krds-button ?disabled=${this.state.disabled ?? true} @click=${() => this.bridge?.recordEvent('click', {})}>저장</krds-button>`;
+        if (this.componentId === 'native-select')
+            return html `<form id="select-form"><krds-native-select label="지역" name="region" .options=${[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'blocked', label: '사용 불가', disabled: true }]} .value=${this.caseId === 'form-reset' ? undefined : this.state.value} .defaultValue=${this.caseId === 'form-reset' ? 'seoul' : undefined} .disabled=${Boolean(this.state.disabled)} .required=${Boolean(this.state.required)} @value-change=${this.value}></krds-native-select><button type="reset">초기화</button></form>`;
+        if (this.componentId === 'modal')
+            return html `${this.state.triggerVisible ? html `<button type="button" @click=${(event: Event) => { (event.currentTarget as HTMLButtonElement).focus(); void this.bridge?.setState({ open: true }); }}>열기</button>` : ''}<button id="next-task" type="button">다음 작업</button><krds-modal .open=${Boolean(this.state.open)} title="확인" .body=${html `<p>작업 내용을 확인하세요.</p><button type="button">본문 작업</button>`} return-focus-id="next-task" @open-change=${this.modal}></krds-modal>`;
+        if (this.componentId === 'tabs')
+            return html `<krds-tabs label="작업" .items=${[{ value: 'first', label: '첫 번째', content: html `<input aria-label="보존되는 값" value="초기 값">` }, { value: 'second', label: '두 번째', content: '두 번째 내용' }, { value: 'disabled', label: '사용 불가', content: '비활성', disabled: true }]} .value=${String(this.state.value)} .activationMode=${this.state.activationMode ?? 'manual'} @value-change=${this.value}></krds-tabs>`;
+        if (this.componentId === 'calendar')
+            return html `<krds-calendar label="날짜 선택" reference-date="2024-02-01" @value-change=${this.value}></krds-calendar>`;
+        if (this.componentId === 'date-input')
+            return html `<form id="date-form"><krds-date-input label="날짜" name="visit" .value=${this.caseId === 'timezone-invariance' ? this.state.value : undefined} .disabled=${Boolean(this.state.disabled)} .required=${Boolean(this.state.required)} .withCalendar=${this.state.withCalendar !== false} reference-date="2024-02-01" @value-change=${this.value}></krds-date-input><button type="submit">제출</button><button type="reset">초기화</button></form>`;
+        return html `<p role="note">Unknown fixture ${this.componentId}/${this.caseId}</p>`;
+    }
 }
 customElements.define('krds-lit-fixture', LitFixture);
 document.getElementById('app')!.append(document.createElement('krds-lit-fixture'));
```

## apps/fixture-lit/tests/contract/hydration.test.mjs

```diff
--- pre-native/apps/fixture-lit/tests/contract/hydration.test.mjs
+++ apps/fixture-lit/tests/contract/hydration.test.mjs
@@ -0,0 +1,20 @@
+import test from 'node:test';import assert from 'node:assert/strict';import {readFile,writeFile} from 'node:fs/promises';
+import {browserPath,serveProduction} from '../../../../tools/testing/support.mjs';
+import {render} from '@lit-labs/ssr';import {html} from 'lit';import {registerKrdsElements} from '@unofficial-krds/lit';
+process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;const {chromium,webkit}=await import('playwright');
+registerKrdsElements(customElements);
+for(const browserName of ['chromium','webkit'])test(`Lit ${browserName} hydrates all six SSR shadow roots and reuses native DOM`,async()=>{
+ const options=[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}],items=[{value:'first',label:'첫 번째',content:'첫 번째 내용'},{value:'second',label:'두 번째',content:'두 번째 내용'}];
+ const markup=[...render(html`<krds-button id="ssr-button" defer-hydration>저장</krds-button><krds-native-select id="ssr-select" defer-hydration label="지역" .options=${options} .value=${'seoul'}></krds-native-select><krds-modal id="ssr-modal" defer-hydration title="확인"></krds-modal><krds-tabs id="ssr-tabs" defer-hydration label="작업" .items=${items}></krds-tabs><krds-calendar id="ssr-calendar" defer-hydration label="날짜 선택" reference-date="2024-02-01"></krds-calendar><krds-date-input id="ssr-date" defer-hydration label="방문일" .value=${'2024-02-29'}></krds-date-input>`)].join('');
+ const skeleton=await readFile(new URL('../../dist/hydrate.html',import.meta.url),'utf8');const htmlOutput=skeleton.replace('<main id="app"></main>',`<main id="app">${markup}</main><script id="krds-hydration-state" type="application/json">${JSON.stringify({'ssr-select':{options,value:'seoul'},'ssr-tabs':{items},'ssr-date':{value:'2024-02-29'}})}</script><script>window.ssrNodes=[...document.querySelectorAll('main > *')].map(host=>host.shadowRoot?.querySelector('button,select,input,table,[role="tablist"]'));</script>`);
+ await writeFile(new URL('../../dist/ssr-test.html',import.meta.url),htmlOutput);const server=await serveProduction(new URL('../../dist',import.meta.url).pathname);let browser;
+ try{browser=await({chromium,webkit})[browserName].launch();const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.stack??String(error)));await page.goto(`${server.origin}/ssr-test.html`);await page.waitForFunction(()=>customElements.get('krds-date-input'));
+  assert.equal(await page.locator('krds-button').evaluate(async element=>{await element.updateComplete;return element.shadowRoot.querySelector('button')===window.ssrNodes[0];}),true);
+  assert.equal(await page.locator('krds-date-input').evaluate(async element=>{await element.updateComplete;return element.shadowRoot.querySelector('input')===window.ssrNodes[5];}),true);
+  assert.equal(await page.getByRole('textbox',{name:'방문일'}).inputValue(),'2024-02-29');assert.equal(await page.getByRole('combobox',{name:'지역'}).inputValue(),'seoul');
+  await page.getByRole('combobox',{name:'지역'}).selectOption('busan');assert.equal(await page.getByRole('combobox',{name:'지역'}).inputValue(),'seoul');
+  await page.getByRole('tab',{name:'두 번째'}).click();assert.equal(await page.getByRole('tab',{name:'두 번째'}).getAttribute('aria-selected'),'true');
+  await page.locator('krds-button').evaluate(element=>{window.actions=0;element.addEventListener('click',()=>window.actions++);});await page.getByRole('button',{name:'저장',exact:true}).click();assert.equal(await page.evaluate(()=>window.actions),1);
+  assert.equal(await page.getByRole('table').count(),1);assert.deepEqual(errors,[]);
+ }finally{await browser?.close();await server.close();}
+});
```

## apps/fixture-lit/tests/contract/interactions.test.mjs

```diff
--- pre-native/apps/fixture-lit/tests/contract/interactions.test.mjs
+++ apps/fixture-lit/tests/contract/interactions.test.mjs
@@ -0,0 +1,26 @@
+import test from 'node:test';import assert from 'node:assert/strict';import {browserPath,serveProduction} from '../../../../tools/testing/support.mjs';process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;const {chromium,webkit}=await import('playwright');
+for(const browserName of ['chromium','webkit'])test(`Lit ${browserName} native modal/date/range/keyboard interactions`,async()=>{
+ const server=await serveProduction(new URL('../../dist',import.meta.url).pathname,{fixture:true});let browser;
+ try{browser=await({chromium,webkit})[browserName].launch();const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));await page.goto(`${server.origin}/harness.html`);await page.waitForFunction(()=>customElements.get('krds-date-input'));
+  await page.evaluate(async()=>{const form=document.createElement('form');const date=document.createElement('krds-date-input');date.label='기간';date.name='period';date.mode='range';date.defaultValue={start:'2024-02-12',end:'2024-02-18'};date.referenceDate='2024-02-01';form.append(date);document.querySelector('main').append(form);window.changes=[];date.addEventListener('value-change',event=>window.changes.push(event.detail));await date.updateComplete;});
+  const start=page.getByRole('textbox',{name:'시작일',exact:true}),end=page.getByRole('textbox',{name:'종료일',exact:true});
+  await start.fill('2024-02-29');await end.focus();assert.deepEqual(await page.evaluate(()=>window.changes),[]);await end.fill('2024-02-28');await end.press('Enter');assert.equal(await end.getAttribute('aria-invalid'),'true');assert.deepEqual(await page.evaluate(()=>window.changes),[]);
+  await end.fill('2024-03-01');await end.press('Enter');assert.deepEqual(await page.evaluate(()=>window.changes),[{value:{start:'2024-02-29',end:'2024-03-01'}}]);assert.deepEqual(await page.evaluate(()=>[...new FormData(document.querySelector('form'))]),[['period.start','2024-02-29'],['period.end','2024-03-01']]);
+  await start.fill('bad draft');await page.getByRole('button',{name:'달력 열기',exact:true}).click();const dialog=page.getByRole('dialog',{name:'날짜 선택',exact:true});await dialog.waitFor();
+  const selected=page.getByRole('button',{name:/^2024년 2월 29일 목요일/});await selected.waitFor();assert.equal(await selected.evaluate(el=>el===el.getRootNode().activeElement),true);await selected.press('Tab');assert.equal(await page.getByRole('button',{name:/^2024년 3월 1일 금요일/}).evaluate(el=>el===el.getRootNode().activeElement),true);
+  await page.getByRole('button',{name:'취소',exact:true}).click();assert.equal(await start.inputValue(),'bad draft');assert.equal(await page.getByRole('button',{name:'달력 열기',exact:true}).evaluate(el=>el===el.getRootNode().activeElement),true);
+  await page.getByRole('button',{name:'달력 열기',exact:true}).click();await page.getByRole('button',{name:/^2024년 2월 20일 화요일/}).click();assert.equal(await page.getByRole('button',{name:'확인',exact:true}).isDisabled(),true);await page.getByRole('button',{name:/^2024년 2월 19일 월요일/}).click();await page.getByRole('button',{name:'확인',exact:true}).click();assert.equal(await start.inputValue(),'2024-02-19');assert.equal(await end.inputValue(),'2024-02-20');assert.equal(await page.getByRole('dialog').count(),0);
+  // External controlled updates and rejected direct commits replace drafts without extra notifications.
+  await page.evaluate(async()=>{document.querySelector('main').innerHTML='';const date=document.createElement('krds-date-input');date.label='제어 날짜';date.value='2024-02-29';date.withCalendar=false;document.querySelector('main').append(date);window.requests=[];date.addEventListener('value-change',event=>window.requests.push(event.detail));await date.updateComplete;});
+  const controlled=page.getByRole('textbox',{name:'제어 날짜'});await controlled.fill('2024-03-01');await controlled.press('Enter');assert.equal(await controlled.inputValue(),'2024-02-29');assert.deepEqual(await page.evaluate(()=>window.requests),[{value:'2024-03-01'}]);
+  await controlled.dispatchEvent('compositionstart');await controlled.fill('이월');await controlled.press('Enter');assert.equal(await controlled.inputValue(),'이월');await controlled.dispatchEvent('compositionend',{data:'이월'});assert.equal(await controlled.getAttribute('aria-invalid'),null);assert.deepEqual(await page.evaluate(()=>window.requests),[{value:'2024-03-01'}]);await controlled.press('Enter');assert.equal(await controlled.getAttribute('aria-invalid'),'true');
+  // Every enabled Calendar date is sequentially reachable; additive navigation never commits.
+  await page.evaluate(async()=>{document.querySelector('main').innerHTML='';const calendar=document.createElement('krds-calendar');calendar.referenceDate='2024-02-29';calendar.label='키보드 날짜';calendar.min='2024-02-01';calendar.max='2024-03-03';document.querySelector('main').append(calendar);window.changes=[];calendar.addEventListener('value-change',event=>window.changes.push(event.detail));await calendar.updateComplete;});
+  const leap=page.getByRole('button',{name:'2024년 2월 29일 목요일',exact:true});await leap.focus();await leap.press('ArrowRight');const march=page.getByRole('button',{name:'2024년 3월 1일 금요일',exact:true});assert.equal(await march.evaluate(el=>el===el.getRootNode().activeElement),true);assert.deepEqual(await page.evaluate(()=>window.changes),[]);await march.press('PageUp');assert.equal(await page.getByRole('button',{name:'2024년 2월 1일 목요일',exact:true}).evaluate(el=>el===el.getRootNode().activeElement),true);
+  // Controlled rejected Modal dismissal keeps native top-layer interaction isolation and focus.
+  await page.evaluate(async()=>{document.querySelector('main').innerHTML='<button id="opener">외부 열기</button><button id="fallback">대체 작업</button>';const modal=document.createElement('krds-modal');modal.title='제어 대화상자';modal.open=false;modal.returnFocusId='fallback';const first=document.createElement('button');first.textContent='첫 작업';modal.body=first;document.querySelector('main').append(modal);await modal.updateComplete;window.dismissals=[];modal.addEventListener('open-change',event=>window.dismissals.push(event.detail));document.getElementById('opener').focus();modal.open=true;await modal.updateComplete;});
+  const nativeDialog=page.getByRole('dialog',{name:'제어 대화상자'});assert.equal(await nativeDialog.evaluate(el=>el===el.getRootNode().activeElement),true);await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'첫 작업'}).evaluate(el=>el===el.getRootNode().activeElement),true);await page.keyboard.press('Shift+Tab');assert.equal(await page.getByRole('button',{name:'닫기'}).evaluate(el=>el===el.getRootNode().activeElement),true);await page.keyboard.press('Escape');assert.equal(await nativeDialog.isVisible(),true);assert.deepEqual(await page.evaluate(()=>window.dismissals),[{open:false}]);
+  await page.evaluate(async()=>{document.getElementById('opener').remove();const modal=document.querySelector('krds-modal');modal.open=false;await modal.updateComplete;});assert.equal(await page.getByRole('button',{name:'대체 작업'}).evaluate(el=>el===document.activeElement),true);assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
+  assert.deepEqual(errors,[]);
+ }finally{await browser?.close();await server.close();}
+});
```

## apps/fixture-lit/tests/contract/native-pilots.test.mjs

```diff
--- pre-native/apps/fixture-lit/tests/contract/native-pilots.test.mjs
+++ apps/fixture-lit/tests/contract/native-pilots.test.mjs
@@ -0,0 +1,44 @@
+import test from 'node:test';
+import assert from 'node:assert/strict';
+import {browserPath,serveProduction} from '../../../../tools/testing/support.mjs';
+process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
+const {chromium,webkit}=await import('playwright');
+for(const browserName of ['chromium','webkit'])test(`Lit ${browserName} native forms, state, Shadow DOM and lifecycle`,async()=>{
+ const server=await serveProduction(new URL('../../dist',import.meta.url).pathname,{fixture:true});let browser;
+ try{
+  browser=await ({chromium,webkit})[browserName].launch();const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
+  await page.goto(`${server.origin}/harness.html`);await page.waitForFunction(()=>customElements.get('krds-date-input'));
+  await page.evaluate(async()=>{
+   const form=document.createElement('form');form.id='native-form';form.innerHTML='<fieldset><krds-native-select name="region" label="지역"></krds-native-select><krds-date-input name="visit" label="방문일"></krds-date-input><krds-button name="action" value="save" type="submit">저장</krds-button><krds-button type="reset">초기화</krds-button><krds-button>기본 작업</krds-button></fieldset>';document.querySelector('main').append(form);
+   const select=form.querySelector('krds-native-select');select.options=[{value:'',label:'선택하세요'},{value:'seoul',label:'서울'},{value:'busan',label:'부산'}];select.defaultValue='seoul';
+   const date=form.querySelector('krds-date-input');date.defaultValue='2024-02-29';date.withCalendar=false;
+   window.submissions=[];window.resets=0;window.changes=[];form.addEventListener('submit',event=>{event.preventDefault();window.submissions.push({entries:[...new FormData(form,event.submitter)],submitter:event.submitter?.name,value:event.submitter?.value});});form.addEventListener('reset',()=>window.resets++);form.addEventListener('value-change',event=>window.changes.push(event.detail));await Promise.all([...form.querySelectorAll('krds-button,krds-date-input,krds-native-select')].map(element=>element.updateComplete));
+  });
+  assert.deepEqual(await page.evaluate(()=>[...new FormData(document.querySelector('form'))]),[['region','seoul'],['visit','2024-02-29']]);
+  await page.getByRole('button',{name:'기본 작업',exact:true}).click();assert.equal(await page.evaluate(()=>window.submissions.length),0);
+  await page.getByRole('button',{name:'저장',exact:true}).click();assert.deepEqual(await page.evaluate(()=>window.submissions),[{entries:[['region','seoul'],['visit','2024-02-29'],['action','save']],submitter:'action',value:'save'}]);
+  await page.getByRole('combobox',{name:'지역'}).selectOption('busan');await page.getByRole('textbox',{name:'방문일'}).fill('2024-03-01');await page.getByRole('textbox',{name:'방문일'}).press('Enter');
+  await page.getByRole('button',{name:'초기화'}).click();assert.equal(await page.getByRole('combobox',{name:'지역'}).inputValue(),'seoul');assert.equal(await page.getByRole('textbox',{name:'방문일'}).inputValue(),'2024-02-29');assert.equal(await page.evaluate(()=>window.resets),1);assert.equal(await page.evaluate(()=>window.changes.length),2);
+  await page.evaluate(()=>document.querySelector('fieldset').disabled=true);await page.getByRole('textbox',{name:'방문일'}).waitFor();assert.equal(await page.getByRole('textbox',{name:'방문일'}).isDisabled(),true);assert.deepEqual(await page.evaluate(()=>[...new FormData(document.querySelector('form'))]),[]);
+  await page.evaluate(()=>document.querySelector('fieldset').disabled=false);
+  await page.getByRole('textbox',{name:'방문일'}).fill('2023-02-29');await page.getByRole('button',{name:'저장',exact:true}).click();assert.equal(await page.evaluate(()=>window.submissions.length),1);assert.equal(await page.evaluate(()=>document.querySelector('krds-date-input').formControl.internals.validity.valid),false);
+  await page.getByRole('textbox',{name:'방문일'}).fill('2024-03-02');await page.getByRole('button',{name:'저장',exact:true}).click();assert.equal(await page.evaluate(()=>window.submissions.length),2);assert.deepEqual(await page.evaluate(()=>window.submissions.at(-1).entries),[['region','seoul'],['visit','2024-03-02'],['action','save']]);
+  await page.evaluate(async()=>{const select=document.querySelector('krds-native-select');select.required=true;select.formStateRestoreCallback('');await select.updateComplete;});
+  assert.equal(await page.evaluate(()=>document.querySelector('krds-native-select').formControl.internals.validity.valueMissing),true);
+  await page.evaluate(async()=>{const select=document.querySelector('krds-native-select');select.formStateRestoreCallback('busan');await select.updateComplete;const date=document.querySelector('krds-date-input');date.formStateRestoreCallback('"2024-02-28"');await date.updateComplete;});
+  assert.deepEqual(await page.evaluate(()=>[...new FormData(document.querySelector('form'))]),[['region','busan'],['visit','2024-02-28']]);
+  await page.evaluate(async()=>{const form=document.querySelector('form');form.addEventListener('reset',event=>event.preventDefault(),{once:true});form.reset();await new Promise(resolve=>setTimeout(resolve,0));});assert.equal(await page.getByRole('combobox',{name:'지역'}).inputValue(),'busan');
+  await page.evaluate(()=>{const button=[...document.querySelectorAll('krds-button')].find(element=>element.textContent==='기본 작업');window.actions=0;button.addEventListener('click',()=>window.actions++);});
+  const nativeAction=page.getByRole('button',{name:'기본 작업',exact:true});await nativeAction.press('Enter');await nativeAction.press('Space');assert.equal(await page.evaluate(()=>window.actions),2);
+  await page.evaluate(async()=>{const form=document.createElement('form');form.id='outside-form';document.querySelector('main').append(form);const select=document.createElement('krds-native-select');select.setAttribute('form','outside-form');select.label='외부 지역';select.name='external';select.options=[{value:'seoul',label:'서울'}];document.querySelector('main').append(select);await select.updateComplete;});
+  assert.deepEqual(await page.evaluate(()=>[...new FormData(document.getElementById('outside-form'))]),[['external','seoul']]);
+  // Controlled rejection must restore displayed parent state and submit canonical state once.
+  await page.evaluate(async()=>{document.querySelector('main').innerHTML='';const select=document.createElement('krds-native-select');select.label='제어 지역';select.options=[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}];select.value='seoul';document.querySelector('main').append(select);window.requests=[];select.addEventListener('value-change',event=>window.requests.push(event.detail));await select.updateComplete;});
+  await page.getByRole('combobox',{name:'제어 지역'}).selectOption('busan');assert.equal(await page.getByRole('combobox',{name:'제어 지역'}).inputValue(),'seoul');assert.deepEqual(await page.evaluate(()=>window.requests),[{value:'busan'}]);
+  // Directive removes/replaces listener, property, style and attribute; reconnect restores one listener.
+  const directive=await page.evaluate(async()=>{const el=document.createElement('krds-directive-harness');document.querySelector('main').append(el);let first=0,second=0;el.props={onClick:()=>first++,title:'old',style:{color:'red','--theme-test':'red'},disabled:true,'.testProperty':'old'};await el.updateComplete;const button=el.shadowRoot.querySelector('button');el.props={onclick:()=>second++,style:{backgroundColor:'blue'}};await el.updateComplete;button.click();const removed=!button.hasAttribute('title')&&!button.disabled&&button.testProperty===undefined&&!button.style.color&&!button.style.getPropertyValue('--theme-test');el.remove();button.click();document.querySelector('main').append(el);await el.updateComplete;button.click();return{first,second,removed};});assert.deepEqual(directive,{first:0,second:2,removed:true});
+  // Official Vanilla service must stop on detach and restart on reconnect; no borrowed renderer.
+  const lifecycle=await page.evaluate(async()=>{const el=document.createElement('krds-tabs');el.label='수명주기';el.items=[{value:'a',label:'A',content:'A panel'},{value:'b',label:'B',content:'B panel'}];document.querySelector('main').append(el);await el.updateComplete;await el.updateComplete;const started=el.machine.active;let notifications=0;const stop=el.machine.subscribe(()=>notifications++);el.machine.getApi().setValue('b');await new Promise(resolve=>setTimeout(resolve,20));const value=el.selectedValue;el.remove();const stopped=!el.machine.active;document.querySelector('main').append(el);await el.updateComplete;await el.updateComplete;const restarted=el.machine.active;stop();return{started,stopped,restarted,value,notifications:notifications>0};});assert.deepEqual(lifecycle,{started:true,stopped:true,restarted:true,value:'b',notifications:true});
+  assert.deepEqual(errors,[]);
+ }finally{await browser?.close();await server.close();}
+});
```

## apps/fixture-lit/tests/contract/native-probe.test.mjs

```diff
--- pre-native/apps/fixture-lit/tests/contract/native-probe.test.mjs
+++ apps/fixture-lit/tests/contract/native-probe.test.mjs
@@ -1,43 +0,0 @@
-import test from 'node:test';
-import assert from 'node:assert/strict';
-import { chromium } from 'playwright';
-import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
-
-process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
-
-// Removing the Lit state subscription, click event or teardown must break this test.
-test('Lit production probe updates through its bridge and disposes on native disconnect', async () => {
-  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname, { fixture: true });
-  let browser;
-  try {
-    browser = await chromium.launch();
-    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' });
-    await page.goto(`${server.origin}/fixtures/__probe?case=native-state`);
-    await page.getByRole('status', { name: 'Fixture health' }).waitFor({ timeout: 5000 });
-    assert.deepEqual(await page.evaluate(() => ({ protocol: window.__KRDS_FIXTURE__.protocol, framework: window.__KRDS_FIXTURE__.framework })), { protocol: 1, framework: 'lit' });
-    const value = page.getByRole('status', { name: 'Probe value' });
-    assert.equal(await value.textContent(), '0');
-    await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
-    assert.equal(await value.textContent(), '1');
-    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ count: 7, label: 'Updated probe' }));
-    await page.getByRole('button', { name: 'Updated probe', exact: true }).click();
-    assert.equal(await value.textContent(), '8');
-    assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [{ name: 'change', detail: { value: 1 } }, { name: 'change', detail: { value: 8 } }]);
-    assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__.getState().count), 8);
-    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ disabled: true }));
-    assert.equal(await page.getByRole('button', { name: 'Updated probe' }).isDisabled(), true);
-    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ disabled: false }));
-    await page.getByRole('button', { name: 'Updated probe' }).focus();
-    assert.equal(await page.getByRole('button', { name: 'Updated probe' }).evaluate(button => button === button.getRootNode().activeElement), true);
-    await page.evaluate(() => document.querySelector('krds-lit-fixture').remove());
-    assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__ === undefined), true);
-    await page.goto(`${server.origin}/fixtures/button?case=disabled`);
-    await page.getByRole('status', { name: 'Fixture health' }).waitFor();
-    assert.equal(await page.getByRole('note').textContent(), 'Component not implemented: button/disabled');
-    assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), []);
-    assert.equal(await page.getByRole('button').count(), 0);
-  } finally {
-    await browser?.close();
-    await server.close();
-  }
-});
```

## apps/fixture-lit/tests/contract/visuals.test.mjs

```diff
--- pre-native/apps/fixture-lit/tests/contract/visuals.test.mjs
+++ apps/fixture-lit/tests/contract/visuals.test.mjs
@@ -0,0 +1,16 @@
+import test from 'node:test';import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';import {browserPath,serveProduction} from '../../../../tools/testing/support.mjs';process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;const {chromium}=await import('playwright');
+const directory=new URL('../../../../.superpowers/sdd/PLAN/t08-lit-logs/visuals/',import.meta.url).pathname;
+test('Lit native visual matrix and inherited Shadow DOM/top-layer theme',async()=>{
+ await mkdir(directory,{recursive:true});const server=await serveProduction(new URL('../../dist',import.meta.url).pathname);let browser;const metrics=[];
+ try{browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:1000},locale:'ko-KR',reducedMotion:'reduce'});await page.goto(`${server.origin}/harness.html`);await page.waitForFunction(()=>customElements.get('krds-calendar'));
+  await page.evaluate(async()=>{const main=document.querySelector('main');main.style.cssText='max-width:60rem;padding:1rem;margin:auto;display:grid;gap:1rem';for(const size of ['xsmall','small','medium','large','xlarge']){const button=document.createElement('krds-button');button.size=size;button.textContent=`저장 ${size}`;button.style.display='inline-block';main.append(button);}const disabled=document.createElement('krds-button');disabled.textContent='사용 불가';disabled.disabled=true;main.append(disabled);const select=document.createElement('krds-native-select');select.label='지역';select.options=[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}];select.hint='거주 지역을 선택하세요';main.append(select);const tabs=document.createElement('krds-tabs');tabs.label='작업';tabs.items=[{value:'first',label:'첫 번째',content:'첫 번째 내용'},{value:'second',label:'두 번째',content:'두 번째 내용'},{value:'disabled',label:'비활성',content:'',disabled:true}];main.append(tabs);const date=document.createElement('krds-date-input');date.label='방문일';date.invalid=true;date.error='YYYY-MM-DD 형식의 올바른 날짜를 입력하세요';main.append(date);const calendar=document.createElement('krds-calendar');calendar.label='날짜 선택';calendar.mode='range';calendar.value={start:'2024-02-12',end:'2024-02-18'};calendar.referenceDate='2024-02-15';calendar.today='2024-02-15';main.append(calendar);await Promise.all([...main.children].map(element=>element.updateComplete));});
+  for(const variant of ['desktop','narrow','zoom-200','forced-colors']){
+   await page.setViewportSize(variant==='narrow'?{width:320,height:900}:variant==='zoom-200'?{width:640,height:1000}:{width:1280,height:1000});await page.emulateMedia({forcedColors:variant==='forced-colors'?'active':'none'});await page.evaluate(zoom=>{document.documentElement.style.fontSize=zoom?'32px':'16px';},variant==='zoom-200');
+   const focus=page.getByRole('button',{name:'저장 medium',exact:true});await focus.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.screenshot({path:`${directory}/${variant}.png`,fullPage:true});
+   const sizes=await page.locator('krds-button').evaluateAll(elements=>elements.slice(0,5).map(element=>element.shadowRoot.querySelector('button').getBoundingClientRect().height));
+   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`${variant} must keep page width bounded: ${JSON.stringify(await page.locator("main > *").evaluateAll(elements=>elements.map(element=>({tag:element.tagName,width:element.getBoundingClientRect().width,right:element.getBoundingClientRect().right}))))}`);assert.equal(sizes.every((height,index)=>index===0||height>=sizes[index-1]),true);metrics.push({variant,sizes,overflow});
+  }
+  await page.emulateMedia({forcedColors:'none'});await page.setViewportSize({width:640,height:800});await page.evaluate(async()=>{document.documentElement.style.fontSize='16px';document.documentElement.style.setProperty('--krds-light-color-button-primary-fill','rgb(64, 32, 128)');document.documentElement.style.setProperty('--krds-light-color-surface-white','rgb(238, 245, 255)');document.querySelector('main').innerHTML='';const opener=document.createElement('button');opener.textContent='대화상자 열기';document.querySelector('main').append(opener);opener.focus();const modal=document.createElement('krds-modal');modal.title='테마와 초점';modal.defaultOpen=true;modal.body=document.createElement('p');modal.body.textContent='Shadow DOM과 최상위 레이어가 상위 토큰을 상속합니다.';document.querySelector('main').append(modal);await modal.updateComplete;});
+  const dialog=page.getByRole('dialog',{name:'테마와 초점'});assert.equal(await dialog.evaluate(element=>getComputedStyle(element).backgroundColor),'rgb(238, 245, 255)');await page.getByRole('button',{name:'닫기'}).focus();await page.screenshot({path:`${directory}/modal-shadow-theme.png`,fullPage:true});metrics.push({dialogTheme:'rgb(238, 245, 255)'});await writeFile(`${directory}/metrics.json`,JSON.stringify(metrics,null,2));
+ }finally{await browser?.close();await server.close();}
+});
```

## apps/fixture-lit/vite.config.ts

```diff
--- pre-native/apps/fixture-lit/vite.config.ts
+++ apps/fixture-lit/vite.config.ts
@@ -1,2 +1,2 @@
 import { defineConfig } from 'vite';
-export default defineConfig({ plugins: [], build: { outDir: 'dist' } });
+export default defineConfig({ plugins: [], build: { rollupOptions: {output:{manualChunks:(id:string)=>id.includes('lit-html')?'lit-html':undefined},input: {main:'index.html',harness:'harness.html',hydrate:'hydrate.html'}}, outDir: 'dist' } });
```

## apps/storybook-lit/.storybook/preview.ts

```diff
--- pre-native/apps/storybook-lit/.storybook/preview.ts
+++ apps/storybook-lit/.storybook/preview.ts
@@ -1,3 +1,3 @@
-import type { Preview } from '@storybook/web-components-vite';
-const preview: Preview = { parameters: { layout: 'centered' } };
-export default preview;
+import '@unofficial-krds/tokens/tokens.css';
+import type {Preview} from '@storybook/web-components-vite';
+const preview:Preview={parameters:{layout:'padded'}};export default preview;
```

## apps/storybook-lit/package.json

```diff
--- pre-native/apps/storybook-lit/package.json
+++ apps/storybook-lit/package.json
@@ -1,15 +1,15 @@
 {
   "name": "@unofficial-krds/storybook-lit",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node ../../tools/run-story-tests.mjs --framework lit --probe",
+    "test": "node ../../tools/run-story-tests.mjs --framework lit",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "tsc -p tsconfig.json --noEmit",
     "build:local": "storybook build --output-dir dist",
     "storybook-build": "storybook build --output-dir dist",
     "stories": "node ../../tools/run-story-tests.mjs --framework lit",
     "storybook-build:local": "storybook build --output-dir dist"
   },
   "devDependencies": {
```

## apps/storybook-lit/src/assets.d.ts

```diff
--- pre-native/apps/storybook-lit/src/assets.d.ts
+++ apps/storybook-lit/src/assets.d.ts
@@ -0,0 +1 @@
+declare module '*.css';
```

## apps/storybook-lit/src/main.ts

```diff
--- pre-native/apps/storybook-lit/src/main.ts
+++ apps/storybook-lit/src/main.ts
@@ -1,4 +1,2 @@
-/** T01 toolchain probe only; no component coverage. */
-import { WorkspaceProbe } from '@unofficial-krds/lit';
-customElements.define('krds-workspace-probe', WorkspaceProbe);
-document.getElementById('app')!.append(document.createElement('krds-workspace-probe'));
+import { registerKrdsElements } from '@unofficial-krds/lit';
+registerKrdsElements(customElements);
```

## apps/storybook-lit/src/stories/button.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/button.stories.ts
+++ apps/storybook-lit/src/stories/button.stories.ts
@@ -0,0 +1,14 @@
+import { html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
+import { registerKrdsElements } from '@unofficial-krds/lit';
+import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
+registerKrdsElements(customElements);
+const meta = { title: 'KRDS/Button', render: (args: {
+        disabled: boolean;
+        label: string;
+    }) => html `<krds-button .disabled=${args.disabled}>${args.label}</krds-button>` } satisfies Meta<{
+    disabled: boolean;
+    label: string;
+}>;
+export default meta;
+export const Disabled: StoryObj = { args: storyStateCases.find(story => story.componentId === 'button')!.state };
```

## apps/storybook-lit/src/stories/calendar.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/calendar.stories.ts
+++ apps/storybook-lit/src/stories/calendar.stories.ts
@@ -0,0 +1,8 @@
+import { html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
+import { registerKrdsElements } from '@unofficial-krds/lit';
+import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
+registerKrdsElements(customElements);
+const meta = { title: 'KRDS/Calendar', render: (args: Record<string, unknown>) => html `<krds-calendar label="날짜 선택" .mode=${args.mode} .value=${args.value} .referenceDate=${args.referenceDate} .today=${args.today}></krds-calendar>` } satisfies Meta;
+export default meta;
+export const SelectedRange: StoryObj = { args: storyStateCases.find(story => story.componentId === 'calendar')!.state };
```

## apps/storybook-lit/src/stories/date-input.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/date-input.stories.ts
+++ apps/storybook-lit/src/stories/date-input.stories.ts
@@ -0,0 +1,8 @@
+import { html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
+import { registerKrdsElements } from '@unofficial-krds/lit';
+import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
+registerKrdsElements(customElements);
+const meta = { id: 'krds-date-input', title: 'KRDS/DateInput', render: (args: Record<string, unknown>) => html `<krds-date-input label="날짜" .value=${args.value} .invalid=${args.invalid} .error=${args.errorMessage}></krds-date-input>` } satisfies Meta;
+export default meta;
+export const Invalid: StoryObj = { args: storyStateCases.find(story => story.componentId === 'date-input')!.state };
```

## apps/storybook-lit/src/stories/modal.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/modal.stories.ts
+++ apps/storybook-lit/src/stories/modal.stories.ts
@@ -0,0 +1,8 @@
+import { html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
+import { registerKrdsElements } from '@unofficial-krds/lit';
+import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
+registerKrdsElements(customElements);
+const meta = { title: 'KRDS/Modal', render: (args: Record<string, unknown>) => html `<krds-modal .open=${args.open} .title=${args.title} .body=${html `<p>내용을 확인하세요.</p>`}></krds-modal>` } satisfies Meta;
+export default meta;
+export const Open: StoryObj = { args: storyStateCases.find(story => story.componentId === 'modal')!.state };
```

## apps/storybook-lit/src/stories/native-select.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/native-select.stories.ts
+++ apps/storybook-lit/src/stories/native-select.stories.ts
@@ -0,0 +1,8 @@
+import { html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
+import { registerKrdsElements } from '@unofficial-krds/lit';
+import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
+registerKrdsElements(customElements);
+const meta = { id: 'krds-native-select', title: 'KRDS/NativeSelect', render: (args: Record<string, unknown>) => html `<krds-native-select label="지역" .value=${args.value} .options=${args.options}></krds-native-select>` } satisfies Meta;
+export default meta;
+export const Controlled: StoryObj = { args: storyStateCases.find(story => story.componentId === 'native-select')!.state };
```

## apps/storybook-lit/src/stories/probe.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/probe.stories.ts
+++ apps/storybook-lit/src/stories/probe.stories.ts
@@ -1,41 +0,0 @@
-/** Test-only native WebComponents states; excluded from KRDS coverage. */
-import { LitElement, html } from 'lit';
-import type { Meta, StoryObj } from '@storybook/web-components-vite';
-import { WorkspaceProbe } from '@unofficial-krds/lit';
-import type { StoryStateCase } from '@unofficial-krds/test-contracts';
-import { infrastructureStoryCases, storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
-
-if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);
-
-class NativeStoryProbe extends LitElement {
-  static override properties = {
-    count: { type: Number }, label: { type: String }, disabled: { type: Boolean }, errorMessage: { type: String },
-  };
-  declare count: number;
-  declare label: string;
-  declare disabled: boolean;
-  declare errorMessage: string;
-  constructor() { super(); this.count = 0; this.label = 'Probe increment'; this.disabled = false; this.errorMessage = ''; }
-  override render() {
-    if (this.errorMessage) return html`<p role="alert">${this.errorMessage}</p>`;
-    return html`<button ?disabled=${this.disabled} @click=${() => { this.count += 1; }}>${this.label}</button>
-      <p role="status" aria-label="Probe value">${this.count}</p>`;
-  }
-}
-if (!customElements.get('krds-lit-story-probe')) customElements.define('krds-lit-story-probe', NativeStoryProbe);
-
-type ProbeArgs = { count: number; label: string; disabled: boolean; errorMessage: string };
-const argsFor = (story: StoryStateCase): ProbeArgs => ({
-  count: Number(story.state.count ?? 0), label: String(story.state.label ?? 'Probe increment'),
-  disabled: Boolean(story.state.disabled), errorMessage: String(story.state.errorMessage ?? ''),
-});
-const meta = {
-  title: 'Infrastructure/Native probe',
-  parameters: { krds: { infrastructureOnly: true, pendingPilotStories: storyStateCases.map(story => story.id) } },
-  render: (args: ProbeArgs) => html`<krds-lit-story-probe .count=${args.count} .label=${args.label} .disabled=${args.disabled} .errorMessage=${args.errorMessage}></krds-lit-story-probe>`,
-} satisfies Meta<ProbeArgs>;
-export default meta;
-type Story = StoryObj<ProbeArgs>;
-export const Default: Story = { args: argsFor(infrastructureStoryCases[0]!) };
-export const Loading: Story = { args: argsFor(infrastructureStoryCases[1]!) };
-export const Error: Story = { args: argsFor(infrastructureStoryCases[2]!) };
```

## apps/storybook-lit/src/stories/tabs.stories.ts

```diff
--- pre-native/apps/storybook-lit/src/stories/tabs.stories.ts
+++ apps/storybook-lit/src/stories/tabs.stories.ts
@@ -0,0 +1,8 @@
+import { html } from 'lit';
+import type { Meta, StoryObj } from '@storybook/web-components-vite';
+import { registerKrdsElements } from '@unofficial-krds/lit';
+import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
+registerKrdsElements(customElements);
+const meta = { title: 'KRDS/Tabs', render: (args: Record<string, unknown>) => html `<krds-tabs label="작업" .value=${args.value} .activationMode=${args.activationMode} .items=${[{ value: 'first', label: '첫 번째', content: '첫 번째 내용' }, { value: 'second', label: '두 번째', content: '두 번째 내용' }]}></krds-tabs>` } satisfies Meta;
+export default meta;
+export const Manual: StoryObj = { args: storyStateCases.find(story => story.componentId === 'tabs')!.state };
```

## docs/compatibility/lit.md

```diff
--- pre-native/docs/compatibility/lit.md
+++ docs/compatibility/lit.md
@@ -0,0 +1,13 @@
+# Lit compatibility
+
+The selected native profile uses Lit 3.3.3, TypeScript 6.0.2, Vite 8.3.5 and Playwright 1.64.1. Build/test commands run through `node tools/yarn.mjs`, which launches selected Node 24.18.0 and Yarn 4.14.1 without changing global tools.
+
+The six pilots render native Lit templates in open Shadow DOM. Registration is explicit and import-safe; native names and relationships remain within the owned shadow root. Native dialogs use the browser top layer and inherit the same token cascade. ElementInternals owns successful values and validity; the browser tests inspect actual FormData, native disabled-fieldset behavior, cancelable reset, restoration and named submitter submission.
+
+The official Vanilla Zag interpreter runs through a Lit ReactiveController. The Tabs consumer applies the public KRDS sequential-focus/manual-activation policy while the actual service handles requested selection. `machineProps` handles the official normalizer's lowercase event names and removes old listeners, attributes, properties and styles; tests cover replacement, disconnection and reconnection. No foreign renderer is imported.
+
+Standalone server rendering uses Lit Labs SSR 4.1.0. Chromium and WebKit hydrate all six custom elements with official SSR-client 1.1.8 support, reuse server-rendered native controls and execute first actions. The fixture splits lit-html into a shared chunk and dynamically loads element definitions after the hydration hook, avoiding evaluation-order loss of hydration support. Application JSON restores property-only options/items/value before upgrade; automatic arbitrary property serialization is not claimed.
+
+Storybook uses the native Web Components renderer 10.6.5. Stories are local args/state/templates and separate from behavior tests. The canonical runner's raw axe 4.14 findings and network results must both be inspected; exit zero alone is insufficient. The selected siheom release has no official Lit adapter, so Lit siheom execution is explicitly unsupported. Native Playwright suites remain mandatory.
+
+Chromium and WebKit provide native evidence. The inherited Firefox profile-creation failure is a tool/environment limitation, not a passing Firefox implementation result. The final T08 report records exact commands, visual artifacts and residual acceptance limits; no catalog coverage is promoted by this document.
```

## packages/lit/README.md

```diff
--- pre-native/packages/lit/README.md
+++ packages/lit/README.md
@@ -1,5 +1,34 @@
 # @unofficial-krds/lit
 
-T01 workspace/compiler probe only. This entry is not a KRDS component and contributes no catalog coverage. Native implementation, independent consumer validation, and rights reconciliation remain pending.
+Native Lit 3 pilots: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. Each class extends LitElement and uses an open Shadow DOM. Importing the public entries does not define custom elements or access a browser document.
 
-Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under the MIT grant in LICENSES/MIT.txt. KRDS and third-party materials retain their separate recorded terms. Publication is not authorized.
+```ts
+import '@unofficial-krds/tokens/tokens.css';
+import { registerKrdsElements } from '@unofficial-krds/lit/register';
+registerKrdsElements(customElements);
+```
+
+Registration uses `krds-button`, `krds-native-select`, `krds-modal`, `krds-tabs`, `krds-calendar` and `krds-date-input`. Re-registering the same classes is idempotent; a conflicting definition throws before any new registration. Import shared global reset/fonts separately if wanted. Component CSS is installed in each shadow root and inherits tokens from its host, including native top-layer dialogs. Use CSS `::part(...)` for local customization.
+
+Pass object and array data as properties in native Lit templates. Labels, hints and errors are plain text; Tabs item `content` and Modal `body`/`actions` can contain native Lit templates or DOM nodes. Slot Button content normally; Modal supports default body content and an `actions` slot. `locale` supports `ko-KR` and `en-US`; `direction`/the native `dir` attribute supplies direction. DOM queries and focus use each instance's owner document and shadow root.
+
+```ts
+import { html } from 'lit';
+const view = html`<krds-native-select label="지역" name="region"
+  .options=${[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
+  .defaultValue=${'seoul'}
+  @value-change=${(event: CustomEvent<{value: string}>) => console.log(event.detail.value)}
+></krds-native-select>`;
+```
+
+A defined `.value` or `.open` selects controlled mode; `.defaultValue`/`.defaultOpen` selects an uncontrolled initial baseline. Do not combine them or switch modes. Parents accept a request by updating the property. Controlled rejection restores the displayed parent value. Semantic `value-change`, `open-change` and Calendar `confirm`/`cancel` events bubble and are composed; details contain plain values. Native Button `click` remains the action event. Mount, parent updates and reset produce no value events.
+
+NativeSelect renders an actual single `<select>`. NativeSelect and DateInput are form-associated custom elements using ElementInternals, without hidden duplicate controls. `name`, `form`, required validity, disabled fieldsets, reset and state restoration are supported. DateInput editable drafts stay unnamed; its canonical value is the sole successful entry. Range entries use `name.start` and `name.end`. Invalid drafts block submission; valid pending drafts commit before FormData is constructed. A controlled rejected commit prevents that submission.
+
+Button renders a native shadow button. Since its native form owner cannot cross a shadow root, submit activation calls the external host form's `requestSubmit` with a temporary native named submitter; the submit event and `FormData(form, event.submitter)` expose its name/value. Reset invokes the cancelable native reset algorithm once. Neither operation adds a persistent hidden input. A prevented `click` prevents form activation.
+
+Modal uses native `<dialog>.showModal()` and its top layer for background interaction/accessibility isolation. The visible title and description share the dialog's root. Its default focus is the dialog; only an explicit dialog/first-interactive `initialFocusId` is accepted. All enabled tabs and calendar dates stay sequential Tab stops; arrows supplement that access. The close icon is last. Disabling `showCloseButton` requires an enabled action marked `data-krds-close`. `returnFocusId` is a fallback after an unusable saved opener. Button-trigger applications should focus the trigger before changing `.open`, including Safari pointer activation. DateInput does this internally.
+
+Standalone Lit Labs SSR and hydration are tested with the selected `@lit-labs/ssr` 4.1.0 and `@lit-labs/ssr-client` 1.1.8. Install the official hydration support before evaluating element classes. Persist application-owned property data before registration/upgrade; the library does not serialize arbitrary arrays/templates automatically. See `tests/ssr/lit/README.md` and the production fixture's `hydrate` entry. This is standalone Lit Labs evidence, not a blanket host-framework SSR claim.
+
+There is no supported upstream siheom Lit adapter in the selected toolchain. Native Chromium/WebKit contract, form, lifecycle, hydration and Playwright Storybook/axe checks run directly; no foreign renderer or widened peer substitutes for Lit. Full catalog verification and release checks remain separate from the six-pilot task. Independent code and KRDS-derived materials retain the separate licenses and attribution shipped with this package.
```

## packages/lit/package.json

```diff
--- pre-native/packages/lit/package.json
+++ packages/lit/package.json
@@ -1,31 +1,31 @@
 {
   "name": "@unofficial-krds/lit",
   "version": "0.0.0",
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "node --test tests/*.test.mjs",
     "lint": "node ../../tools/check-workspace.mjs",
     "prepublishOnly": "node ../../tools/block-publish.mjs",
     "build:local": "vite build && tsc -p tsconfig.json --emitDeclarationOnly",
     "typecheck": "tsc -p tsconfig.json --noEmit"
   },
   "devDependencies": {
     "@lit-labs/ssr": "4.1.0",
     "@lit-labs/ssr-client": "1.1.8",
     "@types/node": "24.13.3",
     "@vitest/browser-playwright": "4.1.10",
     "lit": "3.3.3",
     "playwright": "1.64.1",
     "typescript": "6.0.2",
     "vite": "8.3.5",
     "vitest": "4.1.10"
   },
-  "description": "KRDS Native lit: T01 toolchain probe only",
+  "description": "Native Lit Shadow DOM KRDS pilots with explicit registration and form association",
   "license": "SEE LICENSE IN LICENSE.md",
   "files": [
     "dist",
     "README.md",
     "LICENSE.md",
     "LICENSES",
     "ATTRIBUTION.md",
     "THIRD-PARTY-NOTICES.md",
@@ -34,16 +34,20 @@
   "sideEffects": false,
   "main": "./dist/index.js",
   "module": "./dist/index.js",
   "types": "./dist/index.d.ts",
   "exports": {
     ".": {
       "types": "./dist/index.d.ts",
       "import": "./dist/index.js"
+    },
+    "./register": {
+      "types": "./dist/register.d.ts",
+      "import": "./dist/register.js"
     }
   },
   "peerDependencies": {
     "lit": "^3.3.3"
   },
   "dependencies": {
     "@internationalized/date": "3.12.4",
     "@unofficial-krds/contracts": "workspace:^",
```

## packages/lit/src/components/base.ts

```diff
--- pre-native/packages/lit/src/components/base.ts
+++ packages/lit/src/components/base.ts
@@ -0,0 +1,74 @@
+import { LitElement, unsafeCSS, type PropertyDeclarations } from 'lit';
+import { shadowStyles } from '@unofficial-krds/styles/lit';
+export class KrdsElement extends LitElement {
+    static override styles = [unsafeCSS(shadowStyles.base), ...(['button', 'native-select', 'modal', 'tabs', 'calendar', 'date-input'] as const).map(name => unsafeCSS(shadowStyles[name])), unsafeCSS(':host{display:block;min-inline-size:0;max-inline-size:100%;color:var(--krds-color-text-primary,#1e2124);font-family:inherit} :host([hidden]){display:none} [hidden]{display:none!important} dialog::backdrop{background:var(--krds-color-light-alpha-black50)}')];
+    static override properties: PropertyDeclarations = { locale: { type: String }, direction: { type: String, attribute: 'dir' }, label: { type: String } };
+    declare locale: 'ko-KR' | 'en-US';
+    declare direction: 'ltr' | 'rtl';
+    declare label: string;
+    constructor() { super(); this.locale = 'ko-KR'; this.direction = 'ltr'; this.label = ''; }
+    static override get observedAttributes() { return [...new Set([...super.observedAttributes, 'aria-label', 'aria-labelledby'])]; }
+    override attributeChangedCallback(name: string, old: string | null, value: string | null) {
+        super.attributeChangedCallback(name, old, value);
+        if (name === 'aria-label' || name === 'aria-labelledby') this.requestUpdate();
+    }
+    /** Resolve host naming references into a same-root plain-text control name. */
+    protected get explicitName(): string | undefined {
+        const references = this.getAttribute('aria-labelledby')?.trim().split(/\s+/).filter(Boolean);
+        if (references?.length) {
+            const root = this.getRootNode() as Document | ShadowRoot;
+            const name = references.map(id => root.getElementById?.(id)?.textContent?.trim() ?? '').filter(Boolean).join(' ');
+            if (name) return name;
+        }
+        return this.getAttribute('aria-label') ?? undefined;
+    }
+    protected emit(name: string, detail: unknown) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }
+    protected named(part: string, component: string, state = '') { return { 'data-krds-component': component, 'data-krds-part': part, 'data-krds-state': state, part }; }
+}
+export class ValueState<T> {
+    private initialized = false;
+    private controlled = false;
+    private local!: T;
+    initial!: T;
+    read(value: T | undefined, defaultValue: T | undefined, fallback: () => T): T {
+        if (!this.initialized) {
+            this.controlled = value !== undefined;
+            if (this.controlled && defaultValue !== undefined)
+                throw new TypeError('Cannot combine value and defaultValue');
+            this.local = defaultValue !== undefined ? defaultValue : fallback();
+            this.initial = structuredClone(this.local);
+            this.initialized = true;
+        }
+        if ((value !== undefined) !== this.controlled)
+            throw new TypeError('Cannot change controlled mode');
+        return this.controlled ? value! : this.local;
+    }
+    set(value: T) { if (!this.controlled)
+        this.local = structuredClone(value); }
+    reset() { this.local = this.initial; }
+}
+export function unique(values: readonly string[], allowEmpty = false) { if (new Set(values).size !== values.length || values.some(value => typeof value !== 'string' || (!allowEmpty && !value.trim())))
+    throw new TypeError('Expected unique item values'); }
+export function deepActive(document: Document): Element | null { let active = document.activeElement; while (active?.shadowRoot?.activeElement)
+    active = active.shadowRoot.activeElement; return active; }
+export const focusable = 'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])';
+/** Logical focus order includes nested open shadow roots and assigned slots. */
+export function shadowFocusables(root: ParentNode): HTMLElement[] {
+    const result: HTMLElement[] = [];
+    for (const element of root.children) {
+        if (!(element instanceof HTMLElement) || element.hidden || element.inert)
+            continue;
+        if (element.matches(focusable) && element.getClientRects().length)
+            result.push(element);
+        if (element instanceof HTMLSlotElement) {
+            for (const assigned of element.assignedElements({ flatten: true })) {
+                if (assigned instanceof HTMLElement && assigned.matches(focusable) && assigned.getClientRects().length)
+                    result.push(assigned);
+                result.push(...shadowFocusables(assigned));
+            }
+        }
+        else
+            result.push(...shadowFocusables(element.shadowRoot ?? element));
+    }
+    return result;
+}
```

## packages/lit/src/components/button/index.ts

```diff
--- pre-native/packages/lit/src/components/button/index.ts
+++ packages/lit/src/components/button/index.ts
@@ -0,0 +1,51 @@
+import { html } from 'lit';
+import { ifDefined } from 'lit/directives/if-defined.js';
+import { KrdsElement } from '../base.js';
+import { FormControlController } from '../../controllers/form-control-controller.js';
+/** Native Shadow DOM button; bridges activation to the host's external form. */
+export class Button extends KrdsElement {
+    static formAssociated = true;
+    static override properties = { type: { type: String }, disabled: { type: Boolean, reflect: true }, name: { type: String, reflect: true }, value: { type: String }, variant: { type: String }, size: { type: String } };
+    declare type: 'button' | 'submit' | 'reset';
+    declare disabled: boolean;
+    declare name: string;
+    declare value: string;
+    declare variant: string;
+    declare size: string;
+    readonly formControl = new FormControlController(this);
+    constructor() { super(); this.type = 'button'; this.disabled = false; this.name = ''; this.value = ''; this.variant = 'primary'; this.size = 'medium'; }
+    get form() { return this.formControl.internals?.form ?? null; }
+    resetControl() { }
+    restoreControl() { }
+    formDisabledCallback(value: boolean) { this.formControl.disabledCallback(value); }
+    formResetCallback() { }
+    formStateRestoreCallback() { }
+    private activate = (event: MouseEvent) => {
+        queueMicrotask(() => {
+            if (event.defaultPrevented || this.formControl.disabled || !this.form)
+                return;
+            if (this.type === 'reset')
+                this.form.reset();
+            if (this.type === 'submit') {
+                // requestSubmit requires a real submitter belonging to the external form.
+                const submitter = this.ownerDocument.createElement('button');
+                submitter.type = 'submit';
+                submitter.name = this.name;
+                submitter.value = this.value;
+                submitter.hidden = true;
+                this.form.append(submitter);
+                try {
+                    this.form.requestSubmit(submitter);
+                }
+                finally {
+                    submitter.remove();
+                }
+            }
+        });
+    };
+    override render() {
+        if (!['button', 'submit', 'reset'].includes(this.type) || !['primary', 'secondary', 'tertiary', 'text', 'icon'].includes(this.variant) || !['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(this.size))
+            throw new TypeError('Invalid Button option');
+        return html `<button data-krds-component="button" data-krds-part="root" part="root" data-krds-state=${this.formControl.disabled ? 'disabled' : ''} type=${this.type} ?disabled=${this.formControl.disabled} data-krds-variant=${this.variant} data-krds-size=${this.size} aria-label=${ifDefined(this.explicitName)} @click=${this.activate}><span data-krds-component="button" data-krds-part="label" part="label" data-krds-state=""><slot></slot></span></button>`;
+    }
+}
```

## packages/lit/src/components/calendar/index.ts

```diff
--- pre-native/packages/lit/src/components/calendar/index.ts
+++ packages/lit/src/components/calendar/index.ts
@@ -0,0 +1,151 @@
+import { html, type PropertyValues } from 'lit';
+import { ifDefined } from 'lit/directives/if-defined.js';
+import { addDays, addMonths, calendarMonthGrid, parseIsoDate, weekday, daysInMonth, formatIsoDate } from '@unofficial-krds/contracts';
+import type { DateRangeValue } from '@unofficial-krds/contracts';
+import { KrdsElement, ValueState } from '../base.js';
+import { empty, equal, validateValue, translations, template, type DateValue, type CalendarTranslations } from './model.js';
+export class Calendar extends KrdsElement {
+    static override properties = { mode: { type: String }, value: { attribute: false }, defaultValue: { attribute: false }, min: { type: String }, max: { type: String }, disabled: { type: Boolean }, required: { type: Boolean }, referenceDate: { attribute: 'reference-date' }, today: { type: String }, translations: { attribute: false }, tentative: { state: true }, view: { state: true } };
+    declare mode: 'single' | 'range';
+    declare value: DateValue | undefined;
+    declare defaultValue: DateValue | undefined;
+    declare min: string | undefined;
+    declare max: string | undefined;
+    declare disabled: boolean;
+    declare required: boolean;
+    declare referenceDate: string;
+    declare today: string | undefined;
+    declare translations: Partial<CalendarTranslations>;
+    declare private tentative: DateValue;
+    declare private view: string;
+    private state = new ValueState<DateValue>();
+    private previous: DateValue | undefined;
+    private initialMode?: string;
+    constructor() { super(); this.mode = 'single'; this.disabled = false; this.required = false; this.referenceDate = '2000-01-01'; this.translations = {}; this.tentative = null; this.view = '2000-01-01'; }
+    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => empty(this.mode)); validateValue(value, this.mode, this.min, this.max); return value; }
+    override willUpdate(_changed: PropertyValues) {
+        if (this.initialMode && this.mode !== this.initialMode)
+            throw new TypeError('Calendar mode is immutable');
+        this.initialMode = this.mode;
+        if (!parseIsoDate(this.referenceDate) || (this.today !== undefined && !parseIsoDate(this.today)))
+            throw new RangeError('Invalid calendar reference date');
+        const committed = this.committedValue;
+        if (this.previous === undefined || !equal(committed, this.previous)) {
+            this.previous = structuredClone(committed);
+            this.tentative = structuredClone(committed);
+            const start = typeof committed === 'string' ? committed : committed && 'start' in committed ? committed.start : null;
+            this.view = start ?? this.referenceDate;
+            if (this.min && this.view.slice(0, 7) < this.min.slice(0, 7))
+                this.view = this.min;
+            if (this.max && this.view.slice(0, 7) > this.max.slice(0, 7))
+                this.view = this.max;
+        }
+    }
+    private unavailable(date: string) { return this.disabled || !!(this.min && date < this.min) || !!(this.max && date > this.max); }
+    private selected(date: string) { if (typeof this.tentative === 'string')
+        return date === this.tentative; if (!this.tentative)
+        return false; return !!this.tentative.start && date >= this.tentative.start && date <= (this.tentative.end ?? this.tentative.start); }
+    private select(date: string) { if (this.unavailable(date))
+        return; if (this.mode === 'single')
+        this.tentative = date;
+    else {
+        const range = this.tentative as DateRangeValue;
+        if (!range.start || range.end)
+            this.tentative = { start: date, end: null };
+        else
+            this.tentative = { start: range.start < date ? range.start : date, end: range.start < date ? date : range.start };
+    } this.view = date; }
+    private canConfirm() { try {
+        validateValue(this.tentative, this.mode, this.min, this.max);
+        if (this.required && (this.tentative === null || (typeof this.tentative === 'object' && !this.tentative.start)))
+            return false;
+        return !this.disabled;
+    }
+    catch {
+        return false;
+    } }
+    private confirm() { if (!this.canConfirm())
+        return; const value = structuredClone(this.tentative); if (!equal(value, this.committedValue)) {
+        this.state.set(value);
+        this.emit('value-change', { value });
+    } this.emit('confirm', { value }); this.requestUpdate(); }
+    private navigate(delta: number) { const target = addMonths(this.view, delta); if (!target)
+        return; const p = parseIsoDate(target)!; const end = formatIsoDate({ ...p, day: daysInMonth(p.year, p.month) }), start = formatIsoDate({ ...p, day: 1 }); if ((this.min && end < this.min) || (this.max && start > this.max))
+        return; this.view = target; }
+    private canNavigate(delta: number) { const target = addMonths(this.view, delta); if (!target)
+        return false; const p = parseIsoDate(target)!; return !this.disabled && !(this.min && formatIsoDate({ ...p, day: daysInMonth(p.year, p.month) }) < this.min) && !(this.max && formatIsoDate({ ...p, day: 1 }) > this.max); }
+    async focusDate(date: string) { this.view = date; await this.updateComplete; this.renderRoot.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus(); }
+    private key = (event: KeyboardEvent, date: string) => {
+        if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
+            return;
+        let target: string | null = null;
+        let direction = 1;
+        let limitMonth: string | undefined;
+        if (event.key === 'ArrowLeft') {
+            target = addDays(date, -1);
+            direction = -1;
+        }
+        else if (event.key === 'ArrowRight')
+            target = addDays(date, 1);
+        else if (event.key === 'ArrowUp') {
+            target = addDays(date, -7);
+            direction = -1;
+        }
+        else if (event.key === 'ArrowDown')
+            target = addDays(date, 7);
+        else if (event.key === 'Home') {
+            target = addDays(date, -weekday(date));
+            direction = 1;
+        }
+        else if (event.key === 'End') {
+            target = addDays(date, 6 - weekday(date));
+            direction = -1;
+        }
+        else if (event.key === 'PageUp' || event.key === 'PageDown') {
+            direction = event.key === 'PageUp' ? -1 : 1;
+            target = addMonths(date, direction * (event.shiftKey ? 12 : 1));
+            limitMonth = target?.slice(0, 7);
+        }
+        else
+            return;
+        event.preventDefault();
+        while (target && this.unavailable(target)) {
+            const next = addDays(target, direction);
+            if (!next || limitMonth && next.slice(0, 7) !== limitMonth || ['Home', 'End'].includes(event.key) && Math.abs(weekday(next) - weekday(date)) > 6) {
+                target = null;
+                break;
+            }
+            if (this.min && next < this.min || this.max && next > this.max) {
+                target = null;
+                break;
+            }
+            target = next;
+        }
+        if (target)
+            void this.focusDate(target);
+    };
+    override render() {
+        const t = translations(this.locale, this.translations), p = parseIsoDate(this.view)!;
+        const parts = { year: p.year, month: p.month, monthName: t.monthNames[p.month - 1] };
+        const heading = template(t.monthLabel, parts);
+        const grid = calendarMonthGrid(this.view);
+        const range = typeof this.tentative === 'object' ? this.tentative : null;
+        return html `<section data-krds-component="calendar" data-krds-part="root" part="root" data-krds-state=${this.disabled ? 'disabled' : ''} aria-label=${this.label || (this.locale === 'ko-KR' ? '날짜 선택' : 'Choose date')}><div data-krds-component="calendar" data-krds-part="header" part="header" data-krds-state=""><button data-krds-component="calendar" data-krds-part="previous" part="previous" data-krds-state="" type="button" ?disabled=${!this.canNavigate(-1)} @click=${() => this.navigate(-1)}>${t.previousMonth}</button><h2 data-krds-component="calendar" data-krds-part="heading" part="heading" data-krds-state="" id="heading" aria-live="polite">${heading}</h2><button data-krds-component="calendar" data-krds-part="next" part="next" data-krds-state="" type="button" ?disabled=${!this.canNavigate(1)} @click=${() => this.navigate(1)}>${t.nextMonth}</button></div>
+  <div data-krds-component="calendar" data-krds-internal="table-scroll"><table data-krds-component="calendar" data-krds-part="table" part="table" data-krds-state="" aria-labelledby="heading"><thead><tr>${t.weekdayNames.map(name => html `<th data-krds-component="calendar" data-krds-part="weekday" part="weekday" data-krds-state="" scope="col" aria-label=${name}>${this.locale === 'ko-KR' ? name.slice(0, 1) : name.slice(0, 3)}</th>`)}</tr></thead><tbody>${Array.from({ length: 6 }, (_, row) => html `<tr>${grid.slice(row * 7, row * 7 + 7).map(date => {
+            if (!date)
+                return html `<td data-krds-component="calendar" data-krds-part="cell" part="cell" data-krds-state=""></td>`;
+            const day = parseIsoDate(date)!;
+            const outside = date.slice(0, 7) !== this.view.slice(0, 7);
+            const selected = this.selected(date);
+            const disabled = this.unavailable(date);
+            const start = range?.start === date, end = range?.end === date;
+            const state = [this.today === date ? 'today' : '', selected ? 'selected' : '', start ? 'range-start' : '', end ? 'range-end' : '', selected && range && !start && !end ? 'in-range' : '', outside ? 'outside-month' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ');
+            const base = template(t.dateLabel, { year: day.year, month: day.month, day: day.day, weekday: t.weekdayNames[weekday(date)], monthName: t.monthNames[day.month - 1] });
+            const name = [base, this.today === date ? t.today : '', selected ? t.selected : '', disabled ? t.unavailable : '', outside ? t.adjacentMonth : '', start ? t.startLabel : '', end ? t.endLabel : ''].filter(Boolean).join(', ');
+            return html `<td data-krds-component="calendar" data-krds-part="cell" part="cell" data-krds-state=""><button data-krds-component="calendar" data-krds-part="day" part="day" data-krds-state=${state} type="button" data-date=${date} tabindex=${disabled ? -1 : 0} ?disabled=${disabled} aria-label=${name} aria-pressed=${String(selected)} aria-current=${ifDefined(this.today === date ? 'date' : undefined)} @click=${() => this.select(date)} @keydown=${(event: KeyboardEvent) => this.key(event, date)}>${template(t.visibleDayLabel, { year: day.year, month: day.month, day: day.day })}</button></td>`;
+        })}</tr>`)}</tbody></table></div><div data-krds-component="calendar" data-krds-part="footer" part="footer" data-krds-state="">
+   ${this.today ? html `<button data-krds-component="calendar" data-krds-part="today" part="today" data-krds-state="" type="button" ?disabled=${this.unavailable(this.today)} @click=${() => this.focusDate(this.today!)}>${t.today}</button>` : ''}
+   ${!this.required ? html `<button data-krds-component="calendar" data-krds-part="clear" part="clear" data-krds-state="" type="button" ?disabled=${this.disabled} @click=${() => { this.tentative = empty(this.mode); }}>${t.clear}</button>` : ''}
+   <button data-krds-component="calendar" data-krds-part="cancel" part="cancel" data-krds-state="" type="button" ?disabled=${this.disabled} @click=${() => { this.tentative = structuredClone(this.committedValue); this.emit('cancel', {}); }}>${t.cancel}</button><button data-krds-component="calendar" data-krds-part="confirm" part="confirm" data-krds-state="" type="button" ?disabled=${!this.canConfirm()} @click=${() => this.confirm()}>${t.confirm}</button></div></section>`;
+    }
+}
```

## packages/lit/src/components/calendar/model.ts

```diff
--- pre-native/packages/lit/src/components/calendar/model.ts
+++ packages/lit/src/components/calendar/model.ts
@@ -0,0 +1,62 @@
+import { parseIsoDate } from '@unofficial-krds/contracts';
+import type { DateRangeValue } from '@unofficial-krds/contracts';
+export type DateValue = string | null | DateRangeValue;
+export function empty(mode: string): DateValue { return mode === 'range' ? { start: null, end: null } : null; }
+export function equal(a: DateValue, b: DateValue) { return JSON.stringify(a) === JSON.stringify(b); }
+export function bounds(min?: string, max?: string) { for (const value of [min, max])
+    if (value !== undefined && !parseIsoDate(value))
+        throw new RangeError('Invalid date bound'); if (min && max && min > max)
+    throw new RangeError('min exceeds max'); }
+export function validateValue(value: DateValue, mode: string, min?: string, max?: string, partial = false) {
+    bounds(min, max);
+    if (!['single', 'range'].includes(mode))
+        throw new TypeError('Invalid date mode');
+    if (mode === 'single' && value !== null && typeof value !== 'string')
+        throw new TypeError('Single value must be date or null');
+    if (mode === 'range' && (typeof value !== 'object' || value === null || !('start' in value) || !('end' in value)))
+        throw new TypeError('Range value must contain start/end');
+    const entries = mode === 'single' ? [value as string | null] : [(value as DateRangeValue).start, (value as DateRangeValue).end];
+    for (const date of entries)
+        if (date !== null && (typeof date !== 'string' || !parseIsoDate(date) || (min && date < min) || (max && date > max)))
+            throw new RangeError('Invalid or out-of-bounds date');
+    if (mode === 'range') {
+        const range = value as DateRangeValue;
+        if (!partial && !!range.start !== !!range.end)
+            throw new RangeError('Incomplete range');
+        if (range.start && range.end && range.start > range.end)
+            throw new RangeError('Reversed range');
+    }
+}
+export const weekdays = { 'ko-KR': ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], 'en-US': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
+export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
+export interface CalendarTranslations {
+    previousMonth: string;
+    nextMonth: string;
+    today: string;
+    clear: string;
+    cancel: string;
+    confirm: string;
+    selected: string;
+    unavailable: string;
+    adjacentMonth: string;
+    dateLabel: string;
+    visibleDayLabel: string;
+    monthLabel: string;
+    startLabel: string;
+    endLabel: string;
+    weekdayNames: readonly string[];
+    monthNames: readonly string[];
+}
+export function translations(locale: 'ko-KR' | 'en-US', override: Partial<CalendarTranslations> = {}): CalendarTranslations {
+    if (!['ko-KR', 'en-US'].includes(locale))
+        throw new TypeError('Unsupported locale');
+    const ko = locale === 'ko-KR';
+    const resolved = { previousMonth: ko ? '이전 달' : 'Previous month', nextMonth: ko ? '다음 달' : 'Next month', today: ko ? '오늘' : 'Today', clear: ko ? '지우기' : 'Clear', cancel: ko ? '취소' : 'Cancel', confirm: ko ? '확인' : 'Confirm', selected: ko ? '선택됨' : 'Selected', unavailable: ko ? '선택할 수 없음' : 'Unavailable', adjacentMonth: ko ? '다른 달' : 'Outside displayed month', dateLabel: ko ? '{year}년 {month}월 {day}일 {weekday}' : '{weekday}, {monthName} {day}, {year}', visibleDayLabel: ko ? '{day}일' : '{day}', monthLabel: ko ? '{year}년 {month}월' : '{monthName} {year}', startLabel: ko ? '시작일' : 'Start date', endLabel: ko ? '종료일' : 'End date', weekdayNames: weekdays[locale], monthNames: months, ...override };
+    for (const value of Object.values(resolved))
+        if (typeof value === 'string' && !value.trim())
+            throw new TypeError('Translation cannot be empty');
+    if (resolved.weekdayNames.length !== 7 || resolved.monthNames.length !== 12 || [...resolved.weekdayNames, ...resolved.monthNames].some(value => !value.trim()))
+        throw new TypeError('Invalid calendar name arrays');
+    return resolved;
+}
+export function template(value: string, parts: Record<string, string | number>) { return value.replace(/\{(\w+)\}/g, (_, key) => String(parts[key] ?? `{${key}}`)); }
```

## packages/lit/src/components/date-input/index.ts

```diff
--- pre-native/packages/lit/src/components/date-input/index.ts
+++ packages/lit/src/components/date-input/index.ts
@@ -0,0 +1,152 @@
+import { html, type PropertyValues } from 'lit';
+import { ifDefined } from 'lit/directives/if-defined.js';
+import { live } from 'lit/directives/live.js';
+import { parseIsoDate } from '@unofficial-krds/contracts';
+import type { DateRangeValue } from '@unofficial-krds/contracts';
+import { KrdsElement, ValueState } from '../base.js';
+import { FormControlController } from '../../controllers/form-control-controller.js';
+import { empty, equal, validateValue, bounds, template, type DateValue } from '../calendar/model.js';
+import type { Calendar } from '../calendar/index.js';
+import type { Modal } from '../modal/index.js';
+export interface DateInputTranslations {
+    startLabel: string;
+    endLabel: string;
+    formatHint: string;
+    openCalendar: string;
+    calendarTitle: string;
+    requiredError: string;
+    formatError: string;
+    incompleteRangeError: string;
+    orderError: string;
+    minError: string;
+    maxError: string;
+}
+function dictionary(locale: string, overrides: Partial<DateInputTranslations>): DateInputTranslations { const ko = locale === 'ko-KR'; if (!ko && locale !== 'en-US')
+    throw new TypeError('Unsupported locale'); const t = { startLabel: ko ? '시작일' : 'Start date', endLabel: ko ? '종료일' : 'End date', formatHint: ko ? 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29' : 'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar: ko ? '달력 열기' : 'Open calendar', calendarTitle: ko ? '날짜 선택' : 'Choose date', requiredError: ko ? '날짜를 입력하세요' : 'Enter a date', formatError: ko ? 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요' : 'Enter a valid date in YYYY-MM-DD format', incompleteRangeError: ko ? '시작일과 종료일을 모두 입력하세요' : 'Enter both start and end dates', orderError: ko ? '종료일은 시작일보다 빠를 수 없습니다' : 'End date must not precede start date', minError: ko ? '{min} 이후 날짜를 입력하세요 (당일 포함)' : 'Enter a date on or after {min}', maxError: ko ? '{max} 이전 날짜를 입력하세요 (당일 포함)' : 'Enter a date on or before {max}', ...overrides }; if (Object.values(t).some(value => !value.trim()))
+    throw new TypeError('Translation cannot be empty'); return t; }
+export class DateInput extends KrdsElement {
+    static formAssociated = true;
+    static override properties = { mode: { type: String }, value: { attribute: false }, defaultValue: { attribute: false }, name: { type: String, reflect: true }, required: { type: Boolean }, disabled: { type: Boolean, reflect: true }, min: { type: String }, max: { type: String }, withCalendar: { attribute: 'with-calendar', type: Boolean }, referenceDate: { attribute: 'reference-date' }, today: { type: String }, translations: { attribute: false }, error: { type: String }, invalid: { type: Boolean }, autocomplete: { type: String }, draftStart: { state: true }, draftEnd: { state: true }, localError: { state: true }, popup: { state: true } };
+    declare mode: 'single' | 'range';
+    declare value: DateValue | undefined;
+    declare defaultValue: DateValue | undefined;
+    declare name: string;
+    declare required: boolean;
+    declare disabled: boolean;
+    declare min: string | undefined;
+    declare max: string | undefined;
+    declare withCalendar: boolean;
+    declare referenceDate: string;
+    declare today: string | undefined;
+    declare translations: Partial<DateInputTranslations>;
+    declare error: string;
+    declare invalid: boolean;
+    declare autocomplete: string;
+    declare private draftStart: string;
+    declare private draftEnd: string;
+    declare private localError: string;
+    declare private popup: boolean;
+    readonly formControl = new FormControlController(this);
+    private state = new ValueState<DateValue>();
+    private previous: DateValue | undefined;
+    private initialMode?: string;
+    private composing = false;
+    constructor() { super(); this.mode = 'single'; this.name = ''; this.required = false; this.disabled = false; this.withCalendar = true; this.referenceDate = '2000-01-01'; this.translations = {}; this.error = ''; this.invalid = false; this.autocomplete = 'off'; this.draftStart = ''; this.draftEnd = ''; this.localError = ''; this.popup = false; }
+    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => empty(this.mode)); validateValue(value, this.mode, this.min, this.max); return value; }
+    private display(value: DateValue) { this.draftStart = typeof value === 'string' ? value : value && typeof value === 'object' ? value.start ?? '' : ''; this.draftEnd = value && typeof value === 'object' ? value.end ?? '' : ''; }
+    override willUpdate(_changed: PropertyValues) { if (this.initialMode && this.initialMode !== this.mode)
+        throw new TypeError('DateInput mode is immutable'); this.initialMode = this.mode; bounds(this.min, this.max); if (!parseIsoDate(this.referenceDate) || (this.today !== undefined && !parseIsoDate(this.today)))
+        throw new RangeError('Invalid reference date'); const value = this.committedValue; if (this.previous === undefined || !equal(value, this.previous)) {
+        this.previous = structuredClone(value);
+        this.display(value);
+        this.localError = '';
+    } }
+    override updated() { this.syncForm(); if (this.popup)
+        void this.focusCalendar(); }
+    private async focusCalendar() { const modal = this.renderRoot.querySelector<Modal>('krds-modal'); if (!modal)
+        return; await modal.updateComplete; const calendar = modal.shadowRoot?.querySelector<Calendar>('krds-calendar'); if (!calendar || calendar.hasAttribute('data-focused'))
+        return; calendar.setAttribute('data-focused', ''); await calendar.updateComplete; const selected = calendar.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]:not(:disabled)') ?? calendar.shadowRoot?.querySelector<HTMLButtonElement>('button[data-date]:not(:disabled):not([data-krds-state~="outside-month"])') ?? calendar.shadowRoot?.querySelector<HTMLButtonElement>('button:not(:disabled)'); selected?.focus(); }
+    private rawValue(): DateValue { return this.mode === 'single' ? this.draftStart || null : { start: this.draftStart || null, end: this.draftEnd || null }; }
+    private problem() { const t = dictionary(this.locale, this.translations); const dates = this.mode === 'single' ? [this.draftStart] : [this.draftStart, this.draftEnd]; if (dates.some(date => date && !parseIsoDate(date)))
+        return t.formatError; if (this.mode === 'range' && !!dates[0] !== !!dates[1])
+        return t.incompleteRangeError; if (this.mode === 'range' && dates[0] && dates[1] && dates[0] > dates[1])
+        return t.orderError; if (this.required && dates.every(date => !date))
+        return t.requiredError; for (const date of dates) {
+        if (date && this.min && date < this.min)
+            return template(t.minError, { min: this.min });
+        if (date && this.max && date > this.max)
+            return template(t.maxError, { max: this.max });
+    } return ''; }
+    private syncForm() { const value = this.committedValue; let payload: string | FormData = typeof value === 'string' ? value : ''; if (this.mode === 'range') {
+        payload = new FormData();
+        if (this.name) {
+            const range = value as DateRangeValue;
+            payload.append(`${this.name}.start`, range.start ?? '');
+            payload.append(`${this.name}.end`, range.end ?? '');
+        }
+    } this.formControl.setValue(payload, JSON.stringify(value)); const input = this.renderRoot.querySelector<HTMLInputElement>('input') ?? undefined; for (const field of this.renderRoot.querySelectorAll<HTMLInputElement>('input'))
+        field.setCustomValidity(this.problem()); this.formControl.setValidity(this.problem(), input); }
+    private commit() { if (this.formControl.disabled || this.composing)
+        return false; const error = this.problem(); this.localError = error; if (error) {
+        this.syncForm();
+        return false;
+    } const next = this.rawValue(); if (!equal(next, this.committedValue)) {
+        this.state.set(next);
+        this.emit('value-change', { value: next });
+    } this.display(this.committedValue); this.requestUpdate(); this.syncForm(); return equal(next, this.committedValue); }
+    validateSubmission() { const result = this.commit(); if (!result) {
+        this.formControl.setValidity(this.localError || 'Commit the date before submitting', this.renderRoot.querySelector<HTMLInputElement>('input')!);
+        this.renderRoot.querySelector<HTMLInputElement>('input')?.focus();
+    } return result; }
+    resetControl() { this.state.reset(); this.display(this.committedValue); this.localError = ''; this.popup = false; this.requestUpdate(); }
+    restoreControl(state: string | FormData | File | null) { if (typeof state === 'string') {
+        const value = JSON.parse(state) as DateValue;
+        validateValue(value, this.mode, this.min, this.max);
+        this.state.set(value);
+        this.display(this.committedValue);
+        this.localError = '';
+        this.requestUpdate();
+    } }
+    formResetCallback() { this.resetControl(); }
+    formDisabledCallback(value: boolean) { this.formControl.disabledCallback(value); }
+    formStateRestoreCallback(state: string | FormData | File | null) { this.restoreControl(state); }
+    private input = (event: InputEvent, end = false) => { if (this.formControl.disabled)
+        return; const value = (event.target as HTMLInputElement).value; if (end)
+        this.draftEnd = value;
+    else
+        this.draftStart = value; if (!this.composing && !event.isComposing)
+        this.syncForm(); };
+    private key = (event: KeyboardEvent) => { if (event.key === 'Enter' && !this.composing && !event.isComposing && event.keyCode !== 229) {
+        event.preventDefault();
+        this.commit();
+    } };
+    private groupBlur = () => { queueMicrotask(() => { if (!this.popup && !this.renderRoot.contains(this.shadowRoot?.activeElement ?? null))
+        this.commit(); }); };
+    private accept = (event: CustomEvent<{
+        value: DateValue;
+    }>) => { event.stopPropagation(); const next = event.detail.value; if (!equal(next, this.committedValue)) {
+        this.state.set(next);
+        this.emit('value-change', { value: next });
+    } this.display(this.committedValue); this.localError = ''; this.popup = false; this.requestUpdate(); };
+    override render() {
+        if (!this.label)
+            throw new TypeError('DateInput needs a task label');
+        const t = dictionary(this.locale, this.translations);
+        const error = this.localError || this.error;
+        const invalid = !!error || this.invalid;
+        const state = [this.formControl.disabled ? 'disabled' : '', invalid ? 'invalid' : ''].filter(Boolean).join(' ');
+        const field = (end = false) => html `<input data-krds-component="date-input" data-krds-part=${this.mode === 'single' ? 'control' : end ? 'end-input' : 'start-input'} part=${this.mode === 'single' ? 'control' : end ? 'end-input' : 'start-input'} data-krds-state=${state} id=${end ? 'end' : 'control'} type="text" inputmode="numeric" autocomplete=${this.autocomplete} placeholder="YYYY-MM-DD" .value=${live(end ? this.draftEnd : this.draftStart)} ?disabled=${this.formControl.disabled} ?required=${this.required} aria-label=${ifDefined(this.mode === 'range' ? end ? t.endLabel : t.startLabel : undefined)} aria-invalid=${ifDefined(invalid ? 'true' : undefined)} aria-describedby=${error ? 'hint error' : 'hint'} @input=${(event: InputEvent) => this.input(event, end)} @keydown=${this.key} @compositionstart=${() => { this.composing = true; }} @compositionend=${(event: CompositionEvent) => { const text = (event.target as HTMLInputElement).value; if (end)
+            this.draftEnd = text;
+        else
+            this.draftStart = text; this.composing = false; }}>`;
+        return html `<div data-krds-component="date-input" data-krds-part="root" part="root" data-krds-state=${state} @focusout=${this.groupBlur}>
+  ${this.mode === 'single' ? html `<label data-krds-component="date-input" data-krds-part="label" part="label" data-krds-state="" for="control">${this.label}</label>${field()}` : html `<fieldset><legend data-krds-component="date-input" data-krds-part="label" part="label" data-krds-state="">${this.label}</legend>${field()}${field(true)}</fieldset>`}
+  ${this.withCalendar ? html `<button data-krds-component="date-input" data-krds-part="trigger" part="trigger" data-krds-state=${this.popup ? 'open' : 'closed'} id="calendar-trigger" type="button" ?disabled=${this.formControl.disabled} aria-label=${t.openCalendar} aria-haspopup="dialog" aria-expanded=${String(this.popup)} aria-controls="popup" @click=${(event: Event) => { (event.currentTarget as HTMLButtonElement).focus(); this.popup = true; }}>${t.openCalendar}</button>` : ''}
+  <p data-krds-component="date-input" data-krds-part="hint" part="hint" data-krds-state="" id="hint">${t.formatHint}</p><p data-krds-component="date-input" data-krds-part="error" part="error" data-krds-state="" id="error" role="status" aria-live="polite">${error}</p>
+  ${this.popup ? html `<krds-modal part="popup" id="popup" .open=${true} .title=${t.calendarTitle} .locale=${this.locale} .body=${html `<krds-calendar .mode=${this.mode} .value=${this.committedValue} .required=${this.required} .disabled=${this.formControl.disabled} .min=${this.min} .max=${this.max} .referenceDate=${this.referenceDate} .today=${this.today} .locale=${this.locale} .label=${t.calendarTitle} @value-change=${(event: Event) => event.stopPropagation()} @confirm=${this.accept} @cancel=${() => { this.popup = false; }}></krds-calendar>`} @open-change=${(event: CustomEvent<{
+            open: boolean;
+        }>) => { event.stopPropagation(); if (!event.detail.open)
+            this.popup = false; }}></krds-modal>` : ''}
+  </div>`;
+    }
+}
```

## packages/lit/src/components/modal/index.ts

```diff
--- pre-native/packages/lit/src/components/modal/index.ts
+++ packages/lit/src/components/modal/index.ts
@@ -0,0 +1,134 @@
+import { html, type PropertyValues } from 'lit';
+import { ifDefined } from 'lit/directives/if-defined.js';
+import { KrdsElement, ValueState, deepActive, focusable, shadowFocusables } from '../base.js';
+const locks = new WeakMap<Document, {
+    count: number;
+    overflow: string;
+}>();
+const stack: Modal[] = [];
+/** Native top-layer dialog preserves same-root names and inherited theme tokens. */
+export class Modal extends KrdsElement {
+    static override properties = { open: { type: Boolean }, defaultOpen: { attribute: 'default-open', type: Boolean }, title: { type: String }, description: { type: String }, body: { attribute: false }, actions: { attribute: false }, showCloseButton: { attribute: 'show-close-button', type: Boolean }, closeOnOutsideClick: { attribute: 'close-on-outside-click', type: Boolean }, initialFocusId: { attribute: 'initial-focus-id' }, returnFocusId: { attribute: 'return-focus-id' } };
+    declare open: boolean | undefined;
+    declare defaultOpen: boolean | undefined;
+    declare title: string;
+    declare description: string;
+    declare body: unknown;
+    declare actions: unknown;
+    declare showCloseButton: boolean;
+    declare closeOnOutsideClick: boolean;
+    declare initialFocusId: string | undefined;
+    declare returnFocusId: string | undefined;
+    private state = new ValueState<boolean>();
+    private opener: Element | null = null;
+    private active = false;
+    private outside = false;
+    constructor() { super(); this.title = ''; this.description = ''; this.body = ''; this.actions = ''; this.showCloseButton = true; this.closeOnOutsideClick = false; }
+    get isOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
+    requestOpen(open: boolean) { if (open === this.isOpen)
+        return; this.state.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
+    override willUpdate(_changed: PropertyValues) { if (this.isOpen && !this.active) {
+        this.opener = deepActive(this.ownerDocument);
+        if (this.opener === this.ownerDocument.body)
+            this.opener = null;
+    } }
+    override updated() {
+        if (!this.isConnected)
+            return;
+        if (this.isOpen && !this.active) {
+            const dialog = this.renderRoot.querySelector('dialog')!;
+            if (!this.title.trim())
+                throw new TypeError('Modal needs a visible title');
+            if (!this.showCloseButton && !this.focusables().some(element => element.hasAttribute('data-krds-close')))
+                throw new TypeError('Modal needs an enabled close action');
+            dialog.showModal();
+            this.active = true;
+            stack.push(this);
+            const lock = locks.get(this.ownerDocument) ?? { count: 0, overflow: this.ownerDocument.body.style.overflow };
+            lock.count++;
+            locks.set(this.ownerDocument, lock);
+            this.ownerDocument.body.style.overflow = 'hidden';
+            const target = this.initialFocusId ? this.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(this.initialFocusId)}`) ?? this.focusables().find(element => element.id === this.initialFocusId) : dialog;
+            const first = this.focusables()[0];
+            if (target !== dialog && target !== first)
+                throw new TypeError('initialFocusId must identify the dialog or first interactive element');
+            (target ?? dialog).focus();
+        }
+        else if (!this.isOpen && this.active)
+            this.cleanup();
+    }
+    private focusables() { return shadowFocusables(this.renderRoot); }
+    private usable(node: Element | null): node is HTMLElement { return !!node && node instanceof HTMLElement && node.isConnected && !node.closest('[inert]') && !node.matches(':disabled') && node.getClientRects().length > 0 && node.matches(focusable); }
+    private cleanup() {
+        this.renderRoot.querySelector('dialog')?.close();
+        this.active = false;
+        const index = stack.indexOf(this);
+        if (index >= 0)
+            stack.splice(index, 1);
+        const lock = locks.get(this.ownerDocument);
+        if (lock && !--lock.count) {
+            this.ownerDocument.body.style.overflow = lock.overflow;
+            locks.delete(this.ownerDocument);
+        }
+        let target: Element | null = this.opener;
+        if (!this.usable(target))
+            target = this.returnFocusId ? (this.getRootNode() as Document | ShadowRoot).querySelector(`#${CSS.escape(this.returnFocusId)}`) ?? this.ownerDocument.getElementById(this.returnFocusId) : null;
+        if (!this.usable(target)) {
+            target = this.opener?.parentElement ?? null;
+            while (target && !this.usable(target))
+                target = target.parentElement;
+        }
+        if (this.usable(target))
+            target.focus();
+        else {
+            const body = this.ownerDocument.body;
+            const prior = body.getAttribute('tabindex');
+            body.tabIndex = -1;
+            body.focus();
+            if (prior === null)
+                body.removeAttribute('tabindex');
+            else
+                body.setAttribute('tabindex', prior);
+        }
+        this.opener = null;
+    }
+    override disconnectedCallback() { if (this.active)
+        this.cleanup(); super.disconnectedCallback(); }
+    private key = (event: KeyboardEvent) => {
+        if (stack.at(-1) !== this || event.defaultPrevented) return;
+        if (event.isComposing || event.keyCode === 229) { if (event.key === 'Escape') event.preventDefault(); return; }
+        if (event.key === 'Escape') {
+            event.preventDefault();
+            event.stopPropagation();
+            this.requestOpen(false);
+        }
+        if (event.key === 'Tab') {
+            const elements = this.focusables();
+            const active = deepActive(this.ownerDocument);
+            const index = elements.indexOf(active as HTMLElement);
+            if (!elements.length) {
+                event.preventDefault();
+                this.renderRoot.querySelector('dialog')?.focus();
+            }
+            else if (event.shiftKey && index <= 0) {
+                event.preventDefault();
+                elements.at(-1)!.focus();
+            }
+            else if (!event.shiftKey && (index < 0 || index === elements.length - 1)) {
+                event.preventDefault();
+                elements[0].focus();
+            }
+        }
+    };
+    override render() {
+        if (!this.isOpen)
+            return html ``;
+        return html `<dialog data-krds-component="modal" data-krds-part="content" part="content" data-krds-state=${'open'} style="margin:0" id="dialog" role="dialog" aria-modal="true" aria-labelledby="title" aria-describedby=${ifDefined(this.description ? 'description' : undefined)} tabindex="-1" @click=${(event: Event) => { if ((event.target as Element).closest('[data-krds-close]'))
+            this.requestOpen(false); }} @keydown=${this.key} @cancel=${(event: Event) => { event.preventDefault(); this.requestOpen(false); }} @pointerdown=${(event: PointerEvent) => { const rect = (event.currentTarget as HTMLElement).getBoundingClientRect(); this.outside = event.button === 0 && event.isPrimary && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom); }} @pointerup=${(event: PointerEvent) => { const rect = (event.currentTarget as HTMLElement).getBoundingClientRect(); const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; if (this.closeOnOutsideClick && this.outside && outside && event.button === 0 && event.isPrimary)
+            this.requestOpen(false); this.outside = false; }}>
+      <h2 data-krds-component="modal" data-krds-part="title" part="title" data-krds-state="" id="title">${this.title}</h2>${this.description ? html `<p data-krds-component="modal" data-krds-part="description" part="description" data-krds-state="" id="description">${this.description}</p>` : ''}
+      <div data-krds-component="modal" data-krds-part="body" part="body" data-krds-state="">${this.body}<slot></slot></div><div data-krds-component="modal" data-krds-part="actions" part="actions" data-krds-state="">${this.actions}<slot name="actions"></slot></div>
+      ${this.showCloseButton ? html `<button data-krds-component="modal" data-krds-part="close" part="close" data-krds-state="" type="button" aria-label=${this.locale === 'en-US' ? 'Close' : '닫기'} @click=${() => this.requestOpen(false)}>${this.locale === 'en-US' ? 'Close' : '닫기'}</button>` : ''}
+    </dialog>`;
+    }
+}
```

## packages/lit/src/components/native-select/index.ts

```diff
--- pre-native/packages/lit/src/components/native-select/index.ts
+++ packages/lit/src/components/native-select/index.ts
@@ -0,0 +1,63 @@
+import { html, type PropertyValues } from 'lit';
+import { ifDefined } from 'lit/directives/if-defined.js';
+import { live } from 'lit/directives/live.js';
+import type { SelectOption } from '@unofficial-krds/contracts';
+import { KrdsElement, ValueState, unique } from '../base.js';
+import { FormControlController } from '../../controllers/form-control-controller.js';
+export class NativeSelect extends KrdsElement {
+    static formAssociated = true;
+    static override properties = { options: { attribute: false }, value: { type: String }, defaultValue: { attribute: 'default-value' }, name: { type: String, reflect: true }, disabled: { type: Boolean, reflect: true }, required: { type: Boolean }, invalid: { type: Boolean }, hint: { type: String }, error: { type: String }, size: { type: String } };
+    declare options: readonly SelectOption[];
+    declare value: string | undefined;
+    declare defaultValue: string | undefined;
+    declare name: string;
+    declare disabled: boolean;
+    declare required: boolean;
+    declare invalid: boolean;
+    declare hint: string;
+    declare error: string;
+    declare size: string;
+    readonly formControl = new FormControlController(this);
+    private selection = new ValueState<string>();
+    constructor() { super(); this.options = []; this.name = ''; this.disabled = false; this.required = false; this.invalid = false; this.hint = ''; this.error = ''; this.size = 'medium'; }
+    get committedValue() { const value = this.selection.read(this.value, this.defaultValue, () => this.options.find(option => !option.disabled)?.value ?? ''); if (value && !this.options.some(option => option.value === value))
+        throw new TypeError('Select value is absent from options'); return value; }
+    resetControl() { this.selection.reset(); this.requestUpdate(); }
+    restoreControl(state: string | FormData | File | null) { if (typeof state === 'string') {
+        this.selection.set(state);
+        this.requestUpdate();
+    } }
+    formResetCallback() { this.resetControl(); }
+    formDisabledCallback(value: boolean) { this.formControl.disabledCallback(value); }
+    formStateRestoreCallback(state: string | FormData | File | null) { this.restoreControl(state); }
+    override updated(_changed: PropertyValues) {
+        const select = this.renderRoot.querySelector('select')!;
+        // Native value='' can select an empty option; no matching option means no selection.
+        select.value = this.committedValue;
+        this.formControl.setValue(select.selectedIndex < 0 ? null : this.committedValue, this.committedValue);
+        this.formControl.internals?.setValidity(select.validity.valid ? {} : { valueMissing: select.validity.valueMissing }, select.validationMessage, select);
+    }
+    private change = (event: Event) => {
+        const select = event.target as HTMLSelectElement;
+        const next = select.value;
+        if (!this.formControl.disabled && next !== this.committedValue) {
+            this.selection.set(next);
+            this.emit('value-change', { value: next });
+        }
+        this.requestUpdate();
+        queueMicrotask(() => { select.value = this.committedValue; });
+    };
+    override render() {
+        unique(this.options.map(option => option.value), true);
+        if (!['small', 'medium', 'large'].includes(this.size))
+            throw new TypeError('Invalid select size');
+        if (!this.label && !this.explicitName)
+            throw new TypeError('Select needs a label');
+        const state = [this.formControl.disabled ? 'disabled' : '', this.invalid ? 'invalid' : ''].filter(Boolean).join(' ');
+        return html `<div data-krds-component="native-select" data-krds-part="root" part="root" data-krds-state=${state} data-krds-size=${this.size}>
+      ${this.label ? html `<label data-krds-component="native-select" data-krds-part="label" part="label" data-krds-state="" for="control">${this.label}</label>` : ''}
+      <select data-krds-component="native-select" data-krds-part="control" part="control" data-krds-state=${state} id="control" data-krds-size=${this.size} .value=${live(this.committedValue)} ?disabled=${this.formControl.disabled} ?required=${this.required} aria-label=${ifDefined(this.explicitName)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} aria-describedby=${ifDefined([this.hint ? 'hint' : '', this.error ? 'error' : ''].filter(Boolean).join(' ') || undefined)} @change=${this.change}>${this.options.map(option => html `<option value=${option.value} ?disabled=${option.disabled}>${option.label}</option>`)}</select>
+      ${this.hint ? html `<p data-krds-component="native-select" data-krds-part="hint" part="hint" data-krds-state="" id="hint">${this.hint}</p>` : ''}${this.error ? html `<p data-krds-component="native-select" data-krds-part="error" part="error" data-krds-state="" id="error">${this.error}</p>` : ''}
+    </div>`;
+    }
+}
```

## packages/lit/src/components/tabs/index.ts

```diff
--- pre-native/packages/lit/src/components/tabs/index.ts
+++ packages/lit/src/components/tabs/index.ts
@@ -0,0 +1,80 @@
+import { html, type PropertyValues } from 'lit';
+import { repeat } from 'lit/directives/repeat.js';
+import * as tabs from '@zag-js/tabs';
+import type { Machine } from '@zag-js/core';
+type TabsSchema = tabs.Machine extends Machine<infer T> ? T : never;
+import { KrdsElement, ValueState, unique, focusable } from '../base.js';
+import { ZagController } from '../../controllers/zag-controller.js';
+import { machineProps } from '../../directives/machine-props.js';
+export interface TabItem {
+    value: string;
+    label: unknown;
+    content: unknown;
+    disabled?: boolean;
+    id?: string;
+}
+export class Tabs extends KrdsElement {
+    static override properties = { items: { attribute: false }, value: { type: String }, defaultValue: { attribute: 'default-value' }, activationMode: { attribute: 'activation-mode' }, orientation: { type: String } };
+    declare items: readonly TabItem[];
+    declare value: string | undefined;
+    declare defaultValue: string | undefined;
+    declare activationMode: 'manual' | 'automatic';
+    declare orientation: 'horizontal' | 'vertical';
+    private state = new ValueState<string>();
+    readonly machine: ZagController<TabsSchema, ReturnType<typeof tabs.connect>>;
+    private pointerFocus?: string;
+    private pointerDown = false;
+    constructor() { super(); this.items = []; this.activationMode = 'manual'; this.orientation = 'horizontal'; this.machine = new ZagController(this, tabs.machine, { id: 'tabs', getRootNode: () => this.shadowRoot! }, tabs.connect); }
+    get selectedValue() { const value = this.state.read(this.value, this.defaultValue, () => this.items.find(item => !item.disabled)?.value ?? ''); if (this.items.some(item => !item.disabled) ? !this.items.some(item => item.value === value && !item.disabled) : value !== '')
+        throw new TypeError('Tabs value must identify an enabled item'); return value; }
+    protected override willUpdate(_changed: PropertyValues) {
+        unique(this.items.map(item => item.value));
+        unique(this.items.map((item, index) => item.id ?? `tab-${index}`));
+        if (!['manual', 'automatic'].includes(this.activationMode) || !['horizontal', 'vertical'].includes(this.orientation) || !this.label)
+            throw new TypeError('Invalid Tabs options or missing label');
+        this.machine.update({ id: 'tabs', getRootNode: () => this.shadowRoot!, value: this.selectedValue, activationMode: 'manual', orientation: this.orientation, composite: false, dir: this.direction, onValueChange: details => this.request(details.value) });
+    }
+    private request(value: string) { if (value === this.selectedValue || this.items.find(item => item.value === value)?.disabled)
+        return; this.state.set(value); this.emit('value-change', { value }); this.requestUpdate(); }
+    private key = (event: KeyboardEvent, index: number) => {
+        this.pointerFocus = undefined;
+        this.pointerDown = false;
+        if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
+            return;
+        const enabled = this.items.map((item, i) => item.disabled ? -1 : i).filter(i => i >= 0);
+        const current = enabled.indexOf(index);
+        let target: number | undefined;
+        const previous = this.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp', next = this.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
+        if (event.key === previous)
+            target = enabled[(current - 1 + enabled.length) % enabled.length];
+        else if (event.key === next)
+            target = enabled[(current + 1) % enabled.length];
+        else if (event.key === 'Home')
+            target = enabled[0];
+        else if (event.key === 'End')
+            target = enabled.at(-1);
+        if (target !== undefined) {
+            event.preventDefault();
+            this.renderRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
+        }
+    };
+    override updated() { for (const panel of this.renderRoot.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
+        panel.tabIndex = panel.querySelector(focusable) ? -1 : 0; }
+    override render() {
+        const selected = this.selectedValue;
+        const api = this.machine.active ? this.machine.getApi() : undefined;
+        return html `<div ${machineProps({ ...api?.getRootProps(), ...this.named('root', 'tabs') })} data-krds-component="tabs" data-krds-part="root" part="root" data-krds-state=""><p id="label">${this.label}</p><div ${machineProps({ ...api?.getListProps(), ...this.named('list', 'tabs'), onkeydown: undefined, role: 'tablist', 'aria-labelledby': 'label', 'aria-orientation': this.orientation, 'data-krds-orientation': this.orientation })} data-krds-component="tabs" data-krds-part="list" part="list" data-krds-state="" data-krds-orientation=${this.orientation} role="tablist" aria-labelledby="label" aria-orientation=${this.orientation}>
+    ${repeat(this.items, item => item.value, (item, index) => html `<button ${machineProps({ ...api?.getTriggerProps({ value: item.value, disabled: item.disabled }), ...this.named('trigger', 'tabs', [selected === item.value ? 'selected' : '', item.disabled ? 'disabled' : ''].filter(Boolean).join(' ')), onclick: undefined, onkeydown: undefined, id: item.id ?? `tab-${index}`, role: 'tab', type: 'button', disabled: !!item.disabled, tabIndex: item.disabled ? -1 : 0, 'aria-controls': `${item.id ?? `tab-${index}`}-panel`, 'aria-selected': String(selected === item.value) })} data-krds-component="tabs" data-krds-part="trigger" part="trigger" data-krds-state=${[selected===item.value?'selected':'',item.disabled?'disabled':''].filter(Boolean).join(' ')} role="tab" type="button" id=${item.id ?? `tab-${index}`} aria-selected=${String(selected === item.value)} aria-controls=${`${item.id ?? `tab-${index}`}-panel`} ?disabled=${item.disabled} tabindex=${item.disabled ? -1 : 0} @keydown=${(event: KeyboardEvent) => this.key(event, index)} @pointerdown=${() => { this.pointerFocus = undefined; this.pointerDown = true; }} @pointercancel=${() => { this.pointerFocus = undefined; this.pointerDown = false; }} @focus=${() => { if (this.activationMode === 'automatic') {
+            this.request(item.value);
+            if (this.pointerDown)
+                this.pointerFocus = item.value;
+        } }} @click=${() => { this.pointerDown = false; if (this.pointerFocus === item.value) {
+            this.pointerFocus = undefined;
+            return;
+        } if (api)
+            api.setValue(item.value);
+        else
+            this.request(item.value); }}>${item.label}</button>`)}</div>
+    ${repeat(this.items, item => item.value, (item, index) => html `<section data-krds-component="tabs" data-krds-part="panel" part="panel" data-krds-state=${selected === item.value ? 'active' : 'inactive'} role="tabpanel" id=${`${item.id ?? `tab-${index}`}-panel`} aria-labelledby=${item.id ?? `tab-${index}`} ?hidden=${selected !== item.value} tabindex="0">${item.content}</section>`)}</div>`;
+    }
+}
```

## packages/lit/src/controllers/form-control-controller.ts

```diff
--- pre-native/packages/lit/src/controllers/form-control-controller.ts
+++ packages/lit/src/controllers/form-control-controller.ts
@@ -0,0 +1,31 @@
+import type { ReactiveController, LitElement } from 'lit';
+export interface FormControlHost extends LitElement {
+    disabled: boolean;
+    resetControl(): void;
+    restoreControl(state: string | FormData | File | null): void;
+    validateSubmission?(): boolean;
+}
+/** One ElementInternals entry is the sole successful control for each FACE host. */
+export class FormControlController implements ReactiveController {
+    readonly internals?: ElementInternals;
+    fieldsetDisabled = false;
+    private form: HTMLFormElement | null = null;
+    constructor(readonly host: FormControlHost) { host.addController(this); this.internals = host.attachInternals?.();
+        host.addEventListener('invalid', () => { if (!this.disabled) host.validateSubmission?.(); }); }
+    get disabled() { return this.host.disabled || this.fieldsetDisabled; }
+    hostUpdated() {
+        const form = this.internals?.form ?? null;
+        if (this.form !== form) {
+            this.detach();
+            this.form = form;
+            form?.addEventListener('submit', this.submit, true);
+        }
+    }
+    hostDisconnected() { this.detach(); }
+    private detach() { this.form?.removeEventListener('submit', this.submit, true); this.form = null; }
+    private submit = (event: SubmitEvent) => { if (!this.disabled && this.host.validateSubmission && !this.host.validateSubmission())
+        event.preventDefault(); };
+    setValue(value: string | FormData | null, state?: string) { this.internals?.setFormValue(this.disabled ? null : value, state); }
+    setValidity(message: string, anchor?: HTMLElement) { this.internals?.setValidity(message ? { customError: true } : {}, message, anchor); }
+    disabledCallback(disabled: boolean) { this.fieldsetDisabled = disabled; this.host.requestUpdate(); }
+}
```

## packages/lit/src/controllers/zag-controller.ts

```diff
--- pre-native/packages/lit/src/controllers/zag-controller.ts
+++ packages/lit/src/controllers/zag-controller.ts
@@ -0,0 +1,42 @@
+import type { ReactiveController, ReactiveControllerHost } from 'lit';
+import { VanillaMachine, normalizeProps } from '@zag-js/vanilla';
+import type { Machine, MachineSchema, Service } from '@zag-js/core';
+export interface MachineBridge<P, A> {
+    start(): void;
+    update(props: P): void;
+    getApi(): A;
+    subscribe(listener: () => void): () => void;
+    stop(): void;
+}
+/** The official Vanilla interpreter owns service effects; Lit owns rendering. */
+export class ZagController<T extends MachineSchema, A> implements ReactiveController, MachineBridge<Partial<T['props']>, A> {
+    private service?: VanillaMachine<T>;
+    private unsubscribe?: () => void;
+    private listeners = new Set<() => void>();
+    private props: Partial<T['props']>;
+    constructor(private host: ReactiveControllerHost, private machine: Machine<T>, props: Partial<T['props']>, private connect: (service: Service<T>, normalize: typeof normalizeProps) => A) {
+        this.props = props;
+        host.addController(this);
+    }
+    hostConnected() { this.host.requestUpdate(); }
+    hostUpdated() { if ((this.host as ReactiveControllerHost & {
+        isConnected?: boolean;
+    }).isConnected !== false && !this.service)
+        this.start(); }
+    hostDisconnected() { this.stop(); }
+    start() {
+        if (this.service)
+            return;
+        this.service = new VanillaMachine(this.machine, this.props);
+        this.unsubscribe = this.service.subscribe(() => { this.host.requestUpdate(); for (const listener of this.listeners)
+            listener(); });
+        this.service.start();
+        this.host.requestUpdate();
+    }
+    update(props: Partial<T['props']>) { this.props = props; this.service?.updateProps(props); }
+    getApi(): A { if (!this.service)
+        throw new Error('Machine has not started'); return this.connect(this.service.service, normalizeProps); }
+    get active() { return !!this.service; }
+    subscribe(listener: () => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
+    stop() { this.unsubscribe?.(); this.unsubscribe = undefined; this.service?.stop(); this.service = undefined; }
+}
```

## packages/lit/src/directives/machine-props.ts

```diff
--- pre-native/packages/lit/src/directives/machine-props.ts
+++ packages/lit/src/directives/machine-props.ts
@@ -0,0 +1,61 @@
+import { noChange, type ElementPart } from 'lit';
+import { AsyncDirective } from 'lit/async-directive.js';
+import { directive, PartType, type PartInfo } from 'lit/directive.js';
+export type MachineProps = Record<string, unknown>;
+/** Element-position spread with reversible attrs/properties/styles/listeners. */
+class MachinePropsDirective extends AsyncDirective {
+    private element?: HTMLElement;
+    private previous: MachineProps = {};
+    private listeners = new Map<string, EventListener>();
+    constructor(info: PartInfo) { super(info); if (info.type !== PartType.ELEMENT)
+        throw new Error('machineProps requires element position'); }
+    render(_props: MachineProps) { return noChange; }
+    override update(part: ElementPart, [props]: [
+        MachineProps
+    ]) { this.element = part.element as HTMLElement; this.apply(props); return noChange; }
+    private apply(props: MachineProps) {
+        const el = this.element!;
+        for (const key of new Set([...Object.keys(this.previous), ...Object.keys(props)])) {
+            const value = props[key];
+            if (/^on[a-z]/i.test(key)) {
+                const event = key.slice(2).toLowerCase();
+                const old = this.listeners.get(event);
+                if (old)
+                    el.removeEventListener(event, old);
+                this.listeners.delete(event);
+                if (typeof value === 'function' && this.isConnected) {
+                    el.addEventListener(event, value as EventListener);
+                    this.listeners.set(event, value as EventListener);
+                }
+            }
+            else if (key === 'style') {
+                if (typeof value === 'string')
+                    el.style.cssText = value;
+                else {
+                    el.removeAttribute('style');
+                    for (const [name, entry] of Object.entries((value ?? {}) as Record<string, unknown>))
+                        if (entry != null) {
+                            if (name.startsWith('--') || name.includes('-'))
+                                el.style.setProperty(name, String(entry));
+                            else
+                                (el.style as unknown as Record<string, unknown>)[name] = entry;
+                        }
+                }
+            }
+            else if (key.startsWith('.'))
+                (el as unknown as Record<string, unknown>)[key.slice(1)] = value;
+            else if (['value', 'checked', 'disabled', 'selected', 'tabIndex', 'hidden', 'inert'].includes(key)) {
+                (el as unknown as Record<string, unknown>)[key] = value ?? (['value'].includes(key) ? '' : ['tabIndex'].includes(key) ? 0 : false);
+            }
+            else if (value == null || value === false)
+                el.removeAttribute(key);
+            else
+                el.setAttribute(key === 'className' ? 'class' : key, value === true ? '' : String(value));
+        }
+        this.previous = { ...props };
+    }
+    override disconnected() { for (const [event, listener] of this.listeners)
+        this.element?.removeEventListener(event, listener); this.listeners.clear(); }
+    override reconnected() { this.apply(this.previous); }
+}
+export const machineProps = directive(MachinePropsDirective);
```

## packages/lit/src/index.ts

```diff
--- pre-native/packages/lit/src/index.ts
+++ packages/lit/src/index.ts
@@ -1,3 +1,11 @@
-/** T01 compiler probe only; no catalog coverage. */
-import { LitElement, html } from 'lit';
-export class WorkspaceProbe extends LitElement { override render() { return html`<span data-workspace-probe="lit">T01 compiler probe</span>`; } }
+export { Button } from './components/button/index.js';
+export { NativeSelect } from './components/native-select/index.js';
+export { Modal } from './components/modal/index.js';
+export { Tabs, type TabItem } from './components/tabs/index.js';
+export { Calendar } from './components/calendar/index.js';
+export { DateInput, type DateInputTranslations } from './components/date-input/index.js';
+export type { DateValue, CalendarTranslations } from './components/calendar/model.js';
+export { ZagController, type MachineBridge } from './controllers/zag-controller.js';
+export { FormControlController } from './controllers/form-control-controller.js';
+export { machineProps, type MachineProps } from './directives/machine-props.js';
+export { registerKrdsElements } from './register.js';
```

## packages/lit/src/register.ts

```diff
--- pre-native/packages/lit/src/register.ts
+++ packages/lit/src/register.ts
@@ -0,0 +1,20 @@
+import { Button } from './components/button/index.js';
+import { NativeSelect } from './components/native-select/index.js';
+import { Modal } from './components/modal/index.js';
+import { Tabs } from './components/tabs/index.js';
+import { Calendar } from './components/calendar/index.js';
+import { DateInput } from './components/date-input/index.js';
+/** Explicit registration only. Importing either public entry defines no elements. */
+export function registerKrdsElements(registry: CustomElementRegistry) {
+    const prefix = 'krds';
+    const definitions = { 'button': Button, 'native-select': NativeSelect, 'modal': Modal, 'tabs': Tabs, 'calendar': Calendar, 'date-input': DateInput };
+    for (const [name, constructor] of Object.entries(definitions)) {
+        const tag = `${prefix}-${name}`;
+        const existing = registry.get(tag);
+        if (existing && existing !== constructor)
+            throw new Error(`Custom element collision: ${tag}`);
+    }
+    for (const [name, constructor] of Object.entries(definitions))
+        if (!registry.get(`${prefix}-${name}`))
+            registry.define(`${prefix}-${name}`, constructor);
+}
```

## packages/lit/tests/pilot-ssr.test.mjs

```diff
--- pre-native/packages/lit/tests/pilot-ssr.test.mjs
+++ packages/lit/tests/pilot-ssr.test.mjs
@@ -0,0 +1,42 @@
+import test from 'node:test';
+import assert from 'node:assert/strict';
+import { render } from '@lit-labs/ssr';
+import { html } from 'lit';
+import * as pilots from '../dist/index.js';
+
+test('Lit pilots expose native classes without global registration at source import', () => {
+  for (const name of ['Button', 'NativeSelect', 'Modal', 'Tabs', 'Calendar', 'DateInput']) {
+    assert.equal(typeof pilots[name], 'function', `${name} native LitElement class is required`);
+    assert.equal(customElements.get(`krds-${name.replace(/[A-Z]/g, (letter, index) => `${index ? '-' : ''}${letter.toLowerCase()}`)}`), undefined);
+  }
+});
+
+test('Lit SSR emits declarative open Shadow DOM and actual six-pilot semantics', async () => {
+  assert.equal(typeof pilots.registerKrdsElements, 'function', 'explicit registration API is required');
+  pilots.registerKrdsElements(customElements);
+  const output = [...render(html`<krds-button>저장</krds-button><krds-native-select label="지역" .options=${[{value:'seoul',label:'서울'}]}></krds-native-select><krds-modal title="확인"></krds-modal><krds-tabs label="작업" .items=${[{value:'first',label:'첫 번째',content:'내용'}]}></krds-tabs><krds-calendar label="날짜 선택" reference-date="2024-02-01"></krds-calendar><krds-date-input label="방문일"></krds-date-input>`)].join('');
+  assert.equal((output.match(/shadowrootmode="open"/g) ?? []).length, 6);
+  assert.match(output, /<select/);
+  assert.match(output, /role="tablist"/);
+  assert.match(output, /<table/);
+  assert.match(output, /type="text"/);
+  assert.match(output, /YYYY-MM-DD/);
+});
+
+test('explicit registration is idempotent only for the same class and preflights collisions', () => {
+  const entries=new Map();let writes=0;
+  const registry={get:name=>entries.get(name),define:(name,definition)=>{entries.set(name,definition);writes++;}};
+  pilots.registerKrdsElements(registry);pilots.registerKrdsElements(registry);
+  assert.equal(writes,6);
+  entries.set('krds-tabs',class Collision{});
+  assert.throws(()=>pilots.registerKrdsElements(registry),/collision/i);
+  assert.equal(writes,6);
+});
+
+test('native SSR rejects duplicate options, incompatible modes and invalid date configuration', () => {
+  assert.throws(()=>[...render(html`<krds-native-select label="지역" .options=${[{value:'a',label:'A'},{value:'a',label:'Duplicate'}]}></krds-native-select>`)],TypeError);
+  assert.throws(()=>[...render(html`<krds-tabs label="작업" .value=${'a'} .defaultValue=${'a'} .items=${[{value:'a',label:'A',content:'Panel'}]}></krds-tabs>`)],TypeError);
+  assert.throws(()=>[...render(html`<krds-date-input label="방문일" .value=${'2023-02-29'}></krds-date-input>`)],RangeError);
+  assert.throws(()=>[...render(html`<krds-date-input label="기간" .mode=${'range'} .value=${{start:'2024-02-29',end:null}}></krds-date-input>`)],RangeError);
+  assert.throws(()=>[...render(html`<krds-calendar min="2024-03-01" max="2024-02-29"></krds-calendar>`)],RangeError);
+});
```

## packages/lit/vite.config.ts

```diff
--- pre-native/packages/lit/vite.config.ts
+++ packages/lit/vite.config.ts
@@ -1,6 +1,6 @@
 import { defineConfig } from 'vite';
 import manifest from './package.json' with { type: 'json' };
 export default defineConfig({
   plugins: [],
-  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js' }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
+  build: { outDir: 'dist', lib: { entry: {index:'src/index.ts',register:'src/register.ts'}, formats: ['es'], fileName: (_format, entry) => `${entry}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
 });
```

## tests/ssr/lit/README.md

```diff
--- pre-native/tests/ssr/lit/README.md
+++ tests/ssr/lit/README.md
@@ -0,0 +1,5 @@
+# Lit SSR evidence
+
+Standalone server rendering runs in `packages/lit/tests/pilot-ssr.test.mjs` with the declared `@lit-labs/ssr` 4.1.0. Six native custom elements render declarative open shadow roots.
+
+The actual Chromium/WebKit hydration suite is `apps/fixture-lit/tests/contract/hydration.test.mjs`. It renders the package's built public exports, saves server DOM identities, loads the production `hydrate` entry with official `lit-element-hydrate-support`, then verifies DOM reuse and first interaction. Application-owned JSON restores property-only options/items/value before explicit registration; this is not a claim of automatic property serialization or a generic framework SSR integration.
```
