# T07-vue exact native pilot changes

Before bytes are reconstructed and hash-verified from original T01/T05 source snapshots plus frozen scope v2 raw overrides (task-native-pilots-base/BASELINE-MANIFEST.json). All native component additions and full existing integration deltas are shown. Runtime metadata/legal assets unchanged from separate reviewed scope task are excluded. No commits.

## apps/fixture-vue/package.json

```diff
--- pre-native/apps/fixture-vue/package.json
+++ apps/fixture-vue/package.json
@@ -5,17 +5,19 @@
   "type": "module",
   "scripts": {
     "test": "yarn siheom:local",
     "lint": "node ../../tools/check-workspace.mjs",
     "typecheck": "vue-tsc -p tsconfig.json --noEmit",
     "build:local": "vite build",
     "contract": "node ../../tools/run-contract-tests.mjs --framework vue",
     "siheom": "node ../../tools/run-siheom-tests.mjs --framework vue",
-    "siheom:local": "vitest run --config vitest.config.ts"
+    "siheom:local": "vitest run --config vitest.config.ts",
+    "test:consumer": "node tests/ssr-consumer.mjs",
+    "test:visual": "node tests/visual-inspect.mjs"
   },
   "devDependencies": {
     "@axe-core/playwright": "4.14.0",
     "@playwright/test": "1.64.1",
     "@siheom/core": "0.4.1",
     "@siheom/vue": "0.3.2",
     "@testing-library/dom": "10.4.2",
     "@testing-library/jest-dom": "7.0.1",
```

## apps/fixture-vue/src/ConsumerExample.vue

```diff
--- pre-native/apps/fixture-vue/src/ConsumerExample.vue
+++ apps/fixture-vue/src/ConsumerExample.vue
@@ -0,0 +1,7 @@
+<script setup lang="ts">
+import { ref } from 'vue';
+import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs, type DateValue } from '@unofficial-krds/vue';
+import ButtonSubpath from '@unofficial-krds/vue/button';
+const region=ref('seoul');const date=ref<DateValue>('2024-02-29');const tab=ref('summary');const open=ref(false);
+</script>
+<template><KrdsProvider locale="ko-KR"><Button type="button" @click="open=true">열기</Button><ButtonSubpath>하위 경로</ButtonSubpath><NativeSelect v-model="region" label="지역" :options="[{value:'seoul',label:'서울'}]"/><Tabs v-model="tab" label="신청 정보" :items="[{value:'summary',label:'요약'}]"><template #summary><DateInput v-model="date" name="visit" label="방문일" reference-date="2024-02-15"/></template></Tabs><Calendar v-model="date" label="방문일" reference-date="2024-02-15"/><Modal v-model="open" title="확인"><template #default="{close}"><Button data-krds-close @click="close">취소</Button></template></Modal></KrdsProvider></template>
```

## apps/fixture-vue/src/FixtureApp.ts

```diff
--- pre-native/apps/fixture-vue/src/FixtureApp.ts
+++ apps/fixture-vue/src/FixtureApp.ts
@@ -1,33 +1,2 @@
-/** Test infrastructure only: no KRDS component coverage. */
-import { defineComponent, h, onUnmounted, shallowRef } from 'vue';
-import { WorkspaceProbe } from '@unofficial-krds/vue';
-import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
-
-export const FixtureApp = defineComponent({
-  name: 'FixtureApp',
-  setup() {
-    const url = new URL(window.location.href);
-    const componentId = decodeURIComponent(url.pathname.split('/')[2] ?? '');
-    const caseId = url.searchParams.get('case') ?? '';
-    const isProbe = componentId === '__probe' && caseId === 'native-state';
-    const bridge = createFixtureBridge('vue', isProbe ? { count: 0, label: 'Probe increment', disabled: false } : {});
-    const state = shallowRef<Record<string, unknown>>(bridge.getState());
-    const unsubscribe = bridge.subscribe(next => { state.value = next; });
-    onUnmounted(() => { unsubscribe(); bridge.dispose(); });
-    function increment() {
-      const count = Number(state.value.count) + 1;
-      void bridge.setState({ count });
-      bridge.recordEvent('change', { value: count });
-    }
-    return () => h('main', [
-      h('div', { role: 'status', 'aria-label': 'Fixture health' }, 'ready'),
-      isProbe
-        ? h('section', { 'aria-label': 'Test infrastructure probe' }, [
-          h('button', { type: 'button', disabled: Boolean(state.value.disabled), onClick: increment }, String(state.value.label)),
-          h('div', { role: 'status', 'aria-label': 'Probe value' }, String(state.value.count)),
-        ])
-        : h('p', { role: 'note' }, `Component not implemented: ${componentId}/${caseId}`),
-      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(WorkspaceProbe)]),
-    ]);
-  },
-});
+/** Native Vue fixture; component state is local and observable through the test bridge. */
+export { default as FixtureApp } from './VuePilots.vue';
```

## apps/fixture-vue/src/VisualMatrix.vue

```diff
--- pre-native/apps/fixture-vue/src/VisualMatrix.vue
+++ apps/fixture-vue/src/VisualMatrix.vue
@@ -0,0 +1,22 @@
+<script setup lang="ts">
+import { ref } from 'vue';
+import { Button, NativeSelect, DateInput, Tabs, Calendar, Modal } from '@unofficial-krds/vue';
+const open=ref(false);
+const sizes=['xsmall','small','medium','large','xlarge'] as const;
+</script>
+<template>
+<section aria-label="Native Vue visual matrix" style="display:grid;gap:1rem;max-width:100%">
+<h1>Vue 네이티브 파일럿</h1>
+<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap"><Button v-for="size in sizes" :key="size" :size="size">{{size}}</Button><Button disabled>비활성화</Button><Button variant="icon" aria-label="정보"><template #icon>ⓘ</template></Button></div>
+<NativeSelect label="지역" size="small" :options="[{value:'seoul',label:'서울'}]" hint="지역을 선택하세요"/>
+<NativeSelect label="큰 선택" size="large" :options="[{value:'seoul',label:'서울'}]" invalid error="선택을 확인하세요"/>
+<NativeSelect label="비활성 지역" :options="[{value:'seoul',label:'서울'}]" disabled/>
+<DateInput label="방문일" default-value="2024-02-29" invalid error="날짜를 확인하세요" reference-date="2024-02-15"/>
+<DateInput label="비활성 날짜" default-value="2024-02-29" disabled/>
+<DateInput mode="range" label="신청 기간" :default-value="{start:'2024-02-12',end:'2024-02-18'}" reference-date="2024-02-15"/>
+<Tabs label="지역 정보" :items="[{value:'first',label:'첫 번째'},{value:'second',label:'두 번째'},{value:'third',label:'사용 불가',disabled:true}]"><template #first>신청 안내</template><template #second><input aria-label="상세 입력"/></template></Tabs>
+<Calendar mode="range" label="방문 범위" :default-value="{start:'2024-02-12',end:'2024-02-18'}" reference-date="2024-02-15" today="2024-02-15" min="2024-02-03" max="2024-03-10"/>
+<Button @click="open=true">모달 열기</Button>
+<Modal v-model="open" title="신청 확인"><p>이 모달은 작은 화면에서도 스크롤할 수 있습니다.</p><label for="modal-note">메모</label><input id="modal-note"/><template #actions="{close}"><Button data-krds-close @click="close">취소</Button></template></Modal>
+</section>
+</template>
```

## apps/fixture-vue/src/VuePilots.vue

```diff
--- pre-native/apps/fixture-vue/src/VuePilots.vue
+++ apps/fixture-vue/src/VuePilots.vue
@@ -0,0 +1,13 @@
+<script setup lang="ts">
+import VisualMatrix from './VisualMatrix.vue';
+import { onUnmounted, shallowRef } from 'vue';
+import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/vue';
+import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
+const url=new URL(window.location.href);const componentId=decodeURIComponent(url.pathname.split('/')[2]??'');const caseId=url.searchParams.get('case')??'';
+const initial:Record<string,unknown>=componentId==='button'?{disabled:true,label:'저장'}:componentId==='native-select'?{value:'seoul'}:componentId==='modal'?{open:false,triggerVisible:true}:componentId==='tabs'?{value:'first'}:componentId==='calendar'?{value:null}:componentId==='date-input'?{value:null}:{};
+const bridge=createFixtureBridge('vue',initial);const state=shallowRef(bridge.getState());const unsubscribe=bridge.subscribe(next=>state.value=next);onUnmounted(()=>{unsubscribe();bridge.dispose();});
+const options=[{value:'seoul',label:'서울'},{value:'busan',label:'부산'},{value:'disabled',label:'선택 불가',disabled:true}];const items=[{value:'first',label:'첫 번째'},{value:'second',label:'두 번째'},{value:'third',label:'세 번째',disabled:true}];
+function changed(detail:{value:unknown}){bridge.recordEvent('valueChange',detail);if(!state.value.reject)void bridge.setState({value:detail.value});}
+function opened(detail:{open:boolean}){bridge.recordEvent('openChange',detail);if(!state.value.reject)void bridge.setState({open:detail.open});}
+</script>
+<template><KrdsProvider><main style="padding:1rem"><div role="status" aria-label="Fixture health">ready</div><VisualMatrix v-if="componentId==='__visual'"/><template v-else-if="componentId==='button'"><Button :disabled="Boolean(state.disabled)" @click="bridge.recordEvent('click',{})">{{state.label}}</Button></template><form v-else-if="componentId==='native-select'" @submit.prevent><NativeSelect v-if="caseId==='form-reset'" label="지역" name="region" :options="options" default-value="seoul" @value-change="bridge.recordEvent('valueChange',$event)" /><NativeSelect v-else label="지역" name="region" :options="options" :value="String(state.value)" @value-change="changed" /><Button type="reset">초기화</Button></form><template v-else-if="componentId==='modal'"><Button v-if="state.triggerVisible" @click="opened({open:true})">열기</Button><Button id="modal-alternate">다음 작업</Button><Modal :open="Boolean(state.open)" title="확인" return-focus-id="modal-alternate" @open-change="opened"><p>작업을 확인하세요.</p></Modal></template><Tabs v-else-if="componentId==='tabs'" label="정보" :items="items" :value="String(state.value)" @value-change="changed"><template #first>첫 번째 내용</template><template #second><input aria-label="유지되는 입력" /></template></Tabs><Calendar v-else-if="componentId==='calendar'" :value="state.value as string|null" reference-date="2024-02-15" label="방문일" @value-change="changed" /><form v-else-if="componentId==='date-input'" @submit.prevent><DateInput label="날짜" name="date" :value="state.value as string|null" reference-date="2024-02-15" @value-change="changed" /><Button type="submit">제출</Button><Button type="reset">초기화</Button></form><p v-else role="note">Component not implemented: {{componentId}}/{{caseId}}</p></main></KrdsProvider></template>
```

## apps/fixture-vue/src/env.d.ts

```diff
--- pre-native/apps/fixture-vue/src/env.d.ts
+++ apps/fixture-vue/src/env.d.ts
@@ -0,0 +1 @@
+/// <reference types="vite/client" />
```

## apps/fixture-vue/src/main.ts

```diff
--- pre-native/apps/fixture-vue/src/main.ts
+++ apps/fixture-vue/src/main.ts
@@ -1,5 +1,8 @@
+import '@unofficial-krds/styles/reset.css';
+import '@unofficial-krds/styles/fonts.css';
+import '@unofficial-krds/styles/all.css';
 import { createApp } from 'vue';
 import { FixtureApp } from './FixtureApp';
 const app = createApp(FixtureApp);
 app.mount('#app');
 window.addEventListener('pagehide', () => app.unmount(), { once: true });
```

## apps/fixture-vue/tests/production-behavior.mjs

```diff
--- pre-native/apps/fixture-vue/tests/production-behavior.mjs
+++ apps/fixture-vue/tests/production-behavior.mjs
@@ -0,0 +1,19 @@
+import assert from 'node:assert/strict';
+import { writeFile } from 'node:fs/promises';
+import { join } from 'node:path';
+import { chromium } from 'playwright';
+import { serveProduction, root } from '../../../tools/testing/support.mjs';
+process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
+const server=await serveProduction(join(root,'apps/fixture-vue/dist'),{fixture:true});const browser=await chromium.launch();const results=[];
+try {
+ const page=await browser.newPage();
+ await page.goto(server.origin+'/fixtures/button?case=disabled');await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({disabled:false}));
+ const button=page.getByRole('button',{name:'저장',exact:true});await button.click();await button.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');assert.equal((await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents())).length,3);
+ await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({disabled:true}));const box=await button.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);assert.equal((await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents())).length,3);results.push({case:'native button pointer Enter Space and disabled',passed:true,events:3});
+ await page.goto(server.origin+'/fixtures/tabs?case=manual-activation');const first=page.getByRole('tab',{name:'첫 번째',exact:true}),second=page.getByRole('tab',{name:'두 번째',exact:true});await first.focus();await page.keyboard.press('Tab');assert.equal(await second.evaluate(el=>el===document.activeElement),true);assert.equal(await first.getAttribute('aria-selected'),'true');await page.keyboard.press('Enter');assert.equal(await second.getAttribute('aria-selected'),'true');results.push({case:'real sequential Tab then Enter selection',passed:true});
+ await page.goto(server.origin+'/fixtures/calendar?case=selection-confirm');const dates=page.locator('tbody button');await dates.first().focus();let sequential=true;for(let index=1;index<42;index++){await page.keyboard.press('Tab');sequential &&= await dates.nth(index).evaluate(el=>el===document.activeElement);}assert.equal(sequential,true);assert.deepEqual(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents()),[]);results.push({case:'all 42 native date buttons reached sequentially without value events',passed:true});
+ await page.goto(server.origin+'/fixtures/date-input?case=timezone-invariance');await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({value:'2024-02-29'}));const field=page.getByRole('textbox',{name:'날짜',exact:true});const trigger=page.getByRole('button',{name:'달력 열기',exact:true});await trigger.click();const selected=page.getByRole('button',{name:'2024년 2월 29일 목요일, 선택됨',exact:true});await selected.waitFor();assert.equal(await selected.evaluate(el=>el===document.activeElement),true);await page.getByRole('button',{name:'확인',exact:true}).click();assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);assert.deepEqual(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents()),[]);
+ await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({reject:true}));await field.fill('2024-03-01');await field.press('Enter');await page.waitForFunction(()=>document.querySelector('input[type="text"]').value==='2024-02-29');assert.deepEqual(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents()),[{name:'valueChange',detail:{value:'2024-03-01'}}]);results.push({case:'popup selected-date focus same Confirm and rejected controlled Enter',passed:true});
+ await page.close();
+} finally {await browser.close();await server.close();await writeFile(join(root,'.superpowers/sdd/PLAN/t07-vue-logs/production-behavior.json'),JSON.stringify(results,null,2));}
+console.log(JSON.stringify(results,null,2));
```

## apps/fixture-vue/tests/siheom/native-behavior.test.ts

```diff
--- pre-native/apps/fixture-vue/tests/siheom/native-behavior.test.ts
+++ apps/fixture-vue/tests/siheom/native-behavior.test.ts
@@ -0,0 +1,151 @@
+import { test, expect } from 'vitest';
+import { defineComponent, h, nextTick, ref } from 'vue';
+import { render, screen } from '@testing-library/vue';
+import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/vue';
+
+const fireEvent = {
+ change: async (el: Element) => { el.dispatchEvent(new Event('change', {bubbles:true})); await nextTick(); },
+ update: async (el: HTMLInputElement, value:string) => { el.value=value; el.dispatchEvent(new Event('input', {bubbles:true})); await nextTick(); },
+ keyDown: async (el: Element, init:KeyboardEventInit) => { el.dispatchEvent(new KeyboardEvent('keydown', {bubbles:true,cancelable:true,...init})); await nextTick(); },
+ compositionStart: async (el: Element) => { el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true})); await nextTick(); },
+ compositionEnd: async (el: Element) => { el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true})); await nextTick(); }
+};
+const settle = async () => { await nextTick(); await new Promise(resolve => setTimeout(resolve, 10)); };
+
+test('Button uses native submitter, default button, reset and disabled action boundaries', async () => {
+  let clicks = 0; let submits = 0; let submitter = '';
+  const app = defineComponent({ setup: () => () => h('form', { onSubmit: (event: SubmitEvent) => { event.preventDefault(); submits++; submitter = new FormData(event.target as HTMLFormElement, event.submitter).get('action') as string; } }, [h(Button, { onClick: () => clicks++ }, () => 'Action'), h(Button, { type: 'submit', name: 'action', value: 'save' }, () => 'Submit'), h(Button, { disabled: true, onClick: () => clicks++ }, () => 'Disabled')]) });
+  render(app); screen.getByRole('button', { name: 'Action' }).click(); expect(submits).toBe(0); expect(clicks).toBe(1);
+  screen.getByRole('button', { name: 'Submit' }).click(); expect(submits).toBe(1); expect(submitter).toBe('save');
+  screen.getByRole('button', { name: 'Disabled' }).click(); expect(clicks).toBe(1);
+});
+
+test('NativeSelect rejects controlled input, emits once and retains exact uncontrolled reset baseline', async () => {
+  const events: unknown[] = []; const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
+  const view = render(NativeSelect, { props: { label: 'Region', options, value: 'a', onValueChange: (value: unknown) => events.push(value) } });
+  const select = screen.getByRole('combobox') as HTMLSelectElement;
+  select.value = 'b'; await fireEvent.change(select); await settle(); expect(select.value).toBe('a'); expect(events).toEqual([{ value: 'b' }]);
+  await view.rerender({ value: 'b' }); await settle(); expect(events).toHaveLength(1); expect(select.value).toBe('b');
+});
+
+test('Tabs preserve all sequential stops, manual arrows, mounted panels and rejected selection', async () => {
+  const events: unknown[] = []; render(Tabs, { props: { label: 'Sections', value: 'a', items: [{value:'a',label:'Alpha'},{value:'disabled',label:'Disabled',disabled:true},{value:'b',label:'Beta'}], onValueChange: (event:unknown)=>events.push(event) }, slots: {a:'Alpha panel', b:'Beta panel'} });
+  const alpha=screen.getByRole('tab',{name:'Alpha'}); const beta=screen.getByRole('tab',{name:'Beta'});
+  expect(alpha.tabIndex).toBe(0); expect(beta.tabIndex).toBe(0); alpha.focus(); await fireEvent.keyDown(alpha,{key:'ArrowRight'}); expect(document.activeElement).toBe(beta); expect(alpha.getAttribute('aria-selected')).toBe('true'); beta.click(); await settle(); expect(alpha.getAttribute('aria-selected')).toBe('true'); expect(events).toEqual([{value:'b'}]); expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(3);
+});
+
+test('Calendar keeps tentative selection separate, six native table rows and all enabled date stops', async () => {
+  const events:unknown[]=[];render(Calendar,{props:{referenceDate:'2024-02-15',onValueChange:(e:unknown)=>events.push(e)}});
+  expect(document.querySelectorAll('tbody tr')).toHaveLength(6);const date=screen.getByRole('button',{name:'2024년 2월 29일 목요일'});expect(date.tabIndex).toBe(0);date.click();await settle();expect(events).toEqual([]);screen.getByRole('button',{name:'확인'}).click();await settle();expect(events).toEqual([{value:'2024-02-29'}]);
+});
+
+test('DateInput retains invalid draft, IME, canonical FormData and zero-event reset', async () => {
+  const events:unknown[]=[];render(defineComponent({setup:()=>()=>h('form',[h(DateInput,{label:'Visit',name:'visit',defaultValue:'2024-02-29',onValueChange:(e:unknown)=>events.push(e)}),h('button',{type:'reset'},'Reset')])}));
+  const field=screen.getByRole('textbox',{name:'Visit'}) as HTMLInputElement;const form=field.form!;
+  await fireEvent.update(field,'2023-02-29');await fireEvent.keyDown(field,{key:'Enter'});expect(field.value).toBe('2023-02-29');expect(field.getAttribute('aria-invalid')).toBe('true');expect(new FormData(form).get('visit')).toBe('2024-02-29');expect(events).toEqual([]);
+  await fireEvent.compositionStart(field);await fireEvent.update(field,'이월');await fireEvent.keyDown(field,{key:'Enter',isComposing:true});expect(field.value).toBe('이월');expect(events).toEqual([]);await fireEvent.compositionEnd(field);
+  screen.getByRole('button',{name:'Reset'}).click();await settle();expect(field.value).toBe('2024-02-29');expect(events).toEqual([]);
+});
+
+test('DateInput controlled rejected commit restores prop and never replays prop changes', async () => {
+  const events:unknown[]=[];const view=render(DateInput,{props:{label:'Date',value:'2024-02-29',onValueChange:(e:unknown)=>events.push(e)}});const field=screen.getByRole('textbox') as HTMLInputElement;
+  await fireEvent.update(field,'2024-03-01');await fireEvent.keyDown(field,{key:'Enter'});await settle();expect(field.value).toBe('2024-02-29');expect(events).toEqual([{value:'2024-03-01'}]);await view.rerender({value:'2024-04-01'});await settle();expect(field.value).toBe('2024-04-01');expect(events).toHaveLength(1);
+});
+
+test('Modal rejected Escape stays isolated; actual close and unmount restore opener and body states', async () => {
+  const open=ref(false);const events:unknown[]=[];const app=defineComponent({setup:()=>()=>h('div',[h('button',{onClick:()=>open.value=true},'Open'),h(Modal,{open:open.value,title:'Confirm',onOpenChange:(e:unknown)=>events.push(e)},()=>h('input',{'aria-label':'Inside'}))])});const view=render(app);
+  const opener=screen.getByRole('button',{name:'Open'});opener.focus();opener.click();await settle();const dialog=screen.getByRole('dialog');expect(document.activeElement).toBe(dialog);expect(document.body.style.overflow).toBe('hidden');await fireEvent.keyDown(dialog,{key:'Escape'});await settle();expect(screen.getByRole('dialog')).toBeTruthy();expect(events).toEqual([{open:false}]);open.value=false;await settle();expect(document.activeElement).toBe(opener);expect(document.body.style.overflow).toBe('');opener.click();await settle();view.unmount();await settle();expect(document.body.style.overflow).toBe('');expect(events).toHaveLength(1);
+});
+
+test('NativeSelect absent selection and canceled reset preserve semantic FormData', async () => {
+  const events: unknown[]=[];
+  render(defineComponent({setup:()=>()=>h('form',{onReset:(e:Event)=>e.preventDefault()},[h(NativeSelect,{label:'No enabled region',name:'region',options:[{value:'off',label:'Unavailable',disabled:true}],onValueChange:(e:unknown)=>events.push(e)}),h('button',{type:'reset'},'Reset absent')])}));
+  const select=screen.getByRole('combobox') as HTMLSelectElement;
+  expect(select.selectedIndex).toBe(-1);expect(new FormData(select.form!).has('region')).toBe(false);screen.getByRole('button',{name:'Reset absent'}).click();await settle();expect(select.selectedIndex).toBe(-1);expect(events).toEqual([]);
+});
+
+test('automatic Tabs reject once per focus/click gesture and allow future deliberate gestures', async () => {
+  const events:unknown[]=[];
+  render(Tabs,{props:{label:'Automatic',activationMode:'automatic',value:'a',items:[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}],onValueChange:(e:unknown)=>events.push(e)}});
+  const beta=screen.getByRole('tab',{name:'Beta'});
+  beta.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true}));beta.focus();beta.click();await settle();expect(events).toEqual([{value:'b'}]);
+  beta.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true}));beta.click();await settle();expect(events).toHaveLength(2);expect(screen.getByRole('tab',{name:'Alpha'}).getAttribute('aria-selected')).toBe('true');
+});
+
+test('Calendar range, clear, cancel, keyboard bounds and disabled controls remain native', async () => {
+  const events:unknown[]=[];const confirmations:unknown[]=[];
+  const view=render(Calendar,{props:{mode:'range',referenceDate:'2024-02-15',min:'2024-02-01',max:'2024-02-29',onValueChange:(e:unknown)=>events.push(e),onConfirm:(e:unknown)=>confirmations.push(e)}});
+  screen.getByRole('button',{name:'2024년 2월 20일 화요일'}).click();await settle();expect((screen.getByRole('button',{name:'확인'}) as HTMLButtonElement).disabled).toBe(true);
+  screen.getByRole('button',{name:'2024년 2월 12일 월요일'}).click();await settle();screen.getByRole('button',{name:'확인'}).click();await settle();expect(events).toEqual([{value:{start:'2024-02-12',end:'2024-02-20'}}]);
+  const leap=screen.getByRole('button',{name:'2024년 2월 29일 목요일'});leap.focus();await fireEvent.keyDown(leap,{key:'ArrowRight'});expect(document.activeElement).toBe(leap);expect(events).toHaveLength(1);
+  screen.getByRole('button',{name:'지우기'}).click();screen.getByRole('button',{name:'취소'}).click();await settle();expect(events).toHaveLength(1);
+  await view.rerender({disabled:true});await settle();expect(Array.from(document.querySelectorAll('section[data-krds-component="calendar"] button')).every(el=>(el as HTMLButtonElement).disabled)).toBe(true);expect(confirmations).toHaveLength(1);
+});
+
+test('DateInput range groups, popup cancel/confirm and invalid draft submission preserve committed values', async () => {
+  const events:unknown[]=[];let submits=0;
+  render(defineComponent({setup:()=>()=>h('form',{onSubmit:(e:Event)=>{e.preventDefault();submits++;}},[h(DateInput,{mode:'range',label:'Visit range',name:'visit',defaultValue:{start:'2024-02-12',end:'2024-02-18'},referenceDate:'2024-02-15',onValueChange:(e:unknown)=>events.push(e)}),h('button',{type:'submit'},'Submit range')])}));
+  const start=screen.getByRole('textbox',{name:'시작일'}) as HTMLInputElement;const end=screen.getByRole('textbox',{name:'종료일'}) as HTMLInputElement;
+  await fireEvent.update(start,'2024-02-20');end.focus();start.dispatchEvent(new FocusEvent('focusout',{bubbles:true,relatedTarget:end}));await settle();expect(events).toEqual([]);
+  screen.getByRole('button',{name:'Visit range 달력 열기'}).click();await settle();expect(screen.getByRole('dialog')).toBeTruthy();screen.getByRole('button',{name:'취소'}).click();await settle();expect(start.value).toBe('2024-02-20');expect(events).toEqual([]);
+  screen.getByRole('button',{name:'Submit range'}).click();await settle();expect(submits).toBe(0);expect(new FormData(start.form!).get('visit.start')).toBe('2024-02-12');expect(events).toEqual([]);
+  await fireEvent.update(start,'2024-02-12');await fireEvent.keyDown(start,{key:'Enter'});await settle();screen.getByRole('button',{name:'Visit range 달력 열기'}).click();await settle();screen.getByRole('button',{name:'확인'}).click();await settle();expect(screen.queryByRole('dialog')).toBeNull();expect(events).toEqual([]);
+});
+
+test('Modal ignores composing/handled Escape, traps focus and guards backdrop drags', async () => {
+  const events:unknown[]=[];render(Modal,{props:{defaultOpen:true,title:'Guarded',closeOnOutsideClick:true,onOpenChange:(e:unknown)=>events.push(e)},slots:{default:()=>[h('button',{},'First'),h('button',{},'Last')]}});await settle();
+  const dialog=screen.getByRole('dialog');const first=screen.getByRole('button',{name:'First'});const close=screen.getByRole('button',{name:'닫기'});close.focus();await fireEvent.keyDown(close,{key:'Tab'});expect(document.activeElement).toBe(first);
+  await fireEvent.keyDown(first,{key:'Tab',shiftKey:true});expect(document.activeElement).toBe(close);
+  await fireEvent.keyDown(dialog,{key:'Escape',isComposing:true});expect(events).toEqual([]);
+  const handled=new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});handled.preventDefault();dialog.dispatchEvent(handled);expect(events).toEqual([]);
+  const backdrop=document.querySelector('[data-krds-component="modal"][data-krds-part="backdrop"]')!;
+  dialog.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,isPrimary:true}));backdrop.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0,isPrimary:true}));expect(events).toEqual([]);
+  backdrop.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,isPrimary:true}));backdrop.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0,isPrimary:true}));await settle();expect(events).toEqual([{open:false}]);expect(screen.queryByRole('dialog')).toBeNull();
+});
+
+test('nested Modal handles only topmost Escape and restores parent isolation and original states', async () => {
+  const parent=ref(false),child=ref(false);const events:string[]=[];const originalOverflow=document.body.style.overflow;document.body.style.overflow='clip';
+  const preexisting=document.createElement('aside');preexisting.inert=true;document.body.append(preexisting);
+  const view=render(defineComponent({setup:()=>()=>h('div',[h('button',{onClick:()=>parent.value=true},'Parent opener'),h(Modal,{open:parent.value,title:'Parent',onOpenChange:(detail:{open:boolean})=>{events.push('parent');parent.value=detail.open;}},()=>[h('button',{onClick:()=>child.value=true},'Child opener'),h(Modal,{open:child.value,title:'Child',onOpenChange:(detail:{open:boolean})=>{events.push('child');child.value=detail.open;}},()=> 'Child content')])])}));
+  try {
+    screen.getByRole('button',{name:'Parent opener'}).click();await settle();screen.getByRole('button',{name:'Child opener'}).click();await settle();
+    const childDialog=screen.getByRole('dialog',{name:'Child'});await fireEvent.keyDown(childDialog,{key:'Escape'});await settle();expect(events).toEqual(['child']);expect(screen.getByRole('dialog',{name:'Parent'})).toBeTruthy();expect(document.body.style.overflow).toBe('hidden');
+    await fireEvent.keyDown(screen.getByRole('dialog',{name:'Parent'}),{key:'Escape'});await settle();expect(events).toEqual(['child','parent']);expect(document.body.style.overflow).toBe('clip');expect(preexisting.inert).toBe(true);
+    for(let index=0;index<3;index++){screen.getByRole('button',{name:'Parent opener'}).click();await settle();parent.value=false;await settle();}
+    expect(events).toHaveLength(2);expect(document.body.style.overflow).toBe('clip');
+  } finally {view.unmount();preexisting.remove();document.body.style.overflow=originalOverflow;}
+});
+
+test('rich native slots preserve functional accessible names and description relationships', async () => {
+  render(NativeSelect,{props:{options:[{value:'a',label:'A'}],invalid:true},slots:{label:()=>h('span',[h('strong','방문'),' 지역']),hint:()=>h('em','지역 안내'),error:()=>h('span','선택 오류')}});
+  const select=screen.getByRole('combobox',{name:'방문 지역'});const ids=select.getAttribute('aria-describedby')!.split(' ');expect(ids).toHaveLength(2);expect(ids.map(id=>document.getElementById(id)?.textContent)).toEqual(['지역 안내','선택 오류']);expect(select.getAttribute('aria-invalid')).toBe('true');
+});
+
+test('native date rendering respects Gregorian century rules, strict ASCII years and bounds', async () => {
+  const events:unknown[]=[];render(DateInput,{props:{label:'Gregorian',withCalendar:false,min:'0001-01-01',max:'9999-12-31',onValueChange:(e:unknown)=>events.push(e)}});const field=screen.getByRole('textbox') as HTMLInputElement;
+  for(const value of ['1900-02-29','2024-2-29',' 2024-02-29','2024/02/29']){await fireEvent.update(field,value);await fireEvent.keyDown(field,{key:'Enter'});expect(field.getAttribute('aria-invalid')).toBe('true');}
+  expect(events).toEqual([]);
+  for(const value of ['0001-01-01','2000-02-29','9999-12-31']){await fireEvent.update(field,value);await fireEvent.keyDown(field,{key:'Enter'});await settle();expect(field.getAttribute('aria-invalid')).toBeNull();expect(field.value).toBe(value);}
+  expect(events).toEqual([{value:'0001-01-01'},{value:'2000-02-29'},{value:'9999-12-31'}]);
+});
+
+test('Calendar boundary months leave out-of-era cells empty and disable unavailable navigation', async () => {
+  const view=render(Calendar,{props:{referenceDate:'0001-01-01',value:null}});expect(document.querySelectorAll('tbody td')).toHaveLength(42);expect(document.querySelectorAll('tbody button')).toHaveLength(41);expect((screen.getByRole('button',{name:'이전 달'}) as HTMLButtonElement).disabled).toBe(true);
+  await view.rerender({value:'9999-12-31'});await settle();expect(document.querySelectorAll('tbody td')).toHaveLength(42);expect(document.querySelectorAll('tbody button').length).toBeLessThan(42);expect((screen.getByRole('button',{name:'다음 달'}) as HTMLButtonElement).disabled).toBe(true);
+});
+
+test('native configuration rejects competing defaults, malformed enums and invalid date shapes', () => {
+  expect(() => render(NativeSelect,{props:{label:'Region',value:'a',defaultValue:'a',options:[{value:'a',label:'A'}]}})).toThrow(TypeError);
+  expect(() => render(Tabs,{props:{label:'Tabs',value:'a',defaultValue:'a',items:[{value:'a',label:'A'}]}})).toThrow(TypeError);
+  expect(() => render(Modal,{props:{title:'Dialog',open:false,defaultOpen:false}})).toThrow(TypeError);
+  expect(() => render(DateInput,{props:{label:'Date',value:'2024-02-29',defaultValue:null}})).toThrow(TypeError);
+  expect(() => render(Calendar,{props:{value:'2023-02-29'}})).toThrow(RangeError);
+  expect(() => render(DateInput,{props:{label:'Range',mode:'range',value:'2024-02-29'}})).toThrow(TypeError);
+});
+
+test('Vue provide/inject locale and direction remain reactive through native modal portals', async () => {
+  const locale=ref<'en-US'|'ko-KR'>('en-US');const direction=ref<'ltr'|'rtl'>('rtl');
+  render(defineComponent({setup:()=>()=>h(KrdsProvider,{locale:locale.value,direction:direction.value},()=>h(Modal,{title:'Provider dialog',defaultOpen:true},()=>h(Calendar,{label:'Dates',referenceDate:'2024-02-15'})))}));await settle();
+  expect(screen.getByRole('button',{name:'Close'})).toBeTruthy();expect(screen.getByRole('heading',{name:'February 2024'})).toBeTruthy();expect(screen.getByRole('dialog').closest('[data-krds-part="root"]')?.getAttribute('dir')).toBe('rtl');
+  locale.value='ko-KR';direction.value='ltr';await settle();expect(screen.getByRole('button',{name:'닫기'})).toBeTruthy();expect(screen.getByRole('heading',{name:'2024년 2월'})).toBeTruthy();expect(screen.getByRole('dialog').closest('[data-krds-part="root"]')?.getAttribute('dir')).toBe('ltr');
+});
```

## apps/fixture-vue/tests/siheom/pilots.test.ts

```diff
--- pre-native/apps/fixture-vue/tests/siheom/pilots.test.ts
+++ apps/fixture-vue/tests/siheom/pilots.test.ts
@@ -0,0 +1,11 @@
+import { test, expect } from 'vitest';
+import { given, assertions, query, runSiheom } from '@siheom/vue';
+import { FixtureApp } from '../../src/FixtureApp';
+
+test('native six pilots expose semantic controls rather than probe placeholders', async () => {
+  history.replaceState(null, '', '/fixtures/calendar?case=selection-confirm');
+  await runSiheom(given.render(FixtureApp), assertions.textContent(query.status('Fixture health'), 'ready'));
+  expect(document.querySelector('table[data-krds-part="table"]')).not.toBeNull();
+  expect(document.querySelectorAll('tbody tr')).toHaveLength(6);
+  expect(document.querySelectorAll('tbody td')).toHaveLength(42);
+});
```

## apps/fixture-vue/tests/ssr-consumer.mjs

```diff
--- pre-native/apps/fixture-vue/tests/ssr-consumer.mjs
+++ apps/fixture-vue/tests/ssr-consumer.mjs
@@ -0,0 +1,15 @@
+import assert from 'node:assert/strict';
+import { createSSRApp, h } from 'vue';
+import { renderToString } from '@vue/server-renderer';
+import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/vue';
+import ButtonSubpath from '@unofficial-krds/vue/button';
+assert.equal(typeof document, 'undefined');
+const html=await renderToString(createSSRApp({render:()=>h(KrdsProvider,{},()=>[
+ h(Button,{type:'submit'},()=> '저장'),h(ButtonSubpath,{},()=> '하위 경로'),
+ h(NativeSelect,{label:'지역',options:[{value:'a',label:'A'}]}),
+ h(Tabs,{label:'정보',items:[{value:'a',label:'첫 번째'}]},{a:()=> '내용'}),
+ h(Calendar,{label:'방문일',referenceDate:'2024-02-15'}),
+ h(DateInput,{label:'날짜',value:'2024-02-29',withCalendar:false}),
+ h(Modal,{title:'확인'})])}));
+assert.match(html,/<button/);assert.match(html,/<select/);assert.match(html,/<table/);assert.match(html,/2024-02-29/);assert.doesNotMatch(html,/role="dialog"/);
+console.log('Built public root/subpath native Vue SSR without DOM globals: passed');
```

## apps/fixture-vue/tests/visual-inspect.mjs

```diff
--- pre-native/apps/fixture-vue/tests/visual-inspect.mjs
+++ apps/fixture-vue/tests/visual-inspect.mjs
@@ -0,0 +1,34 @@
+import { mkdir, writeFile } from 'node:fs/promises';
+import { join } from 'node:path';
+import { chromium } from 'playwright';
+import AxeBuilder from '@axe-core/playwright';
+import { serveProduction, root } from '../../../tools/testing/support.mjs';
+process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
+const directory=join(root,'.superpowers/sdd/PLAN/t07-vue-logs/visual');await mkdir(directory,{recursive:true});
+const server=await serveProduction(join(root,'apps/fixture-vue/dist'),{fixture:true});const browser=await chromium.launch();const results=[];
+try {
+ for(const variant of ['normal','narrow','zoom200','text200','forced-colors']) {
+  const context=await browser.newContext({viewport:variant==='narrow'?{width:320,height:800}:{width:1280,height:900},locale:'ko-KR',timezoneId:'Asia/Seoul',reducedMotion:'reduce',forcedColors:variant==='forced-colors'?'active':'none'});
+  const page=await context.newPage();const errors=[];const requests=[];page.on('pageerror',error=>errors.push(String(error)));page.on('request',request=>{if(!request.url().startsWith(server.origin))requests.push(request.url());});
+  await page.goto(server.origin+'/fixtures/__visual?case=matrix');await page.getByRole('heading',{name:'Vue 네이티브 파일럿'}).waitFor();await page.evaluate(()=>document.fonts.ready);
+  if(variant==='text200')await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
+  if(variant==='zoom200')await page.evaluate(()=>{document.documentElement.style.zoom='2';});
+  const focus=page.getByRole('button',{name:'medium',exact:true});await focus.focus();
+  await page.screenshot({path:join(directory,variant+'.png'),fullPage:true,animations:'disabled'});
+  if(variant==='normal') {
+    for(const [name,locator] of [
+      ['select',page.getByRole('combobox',{name:'지역',exact:true})],
+      ['date-input',page.getByRole('textbox',{name:'방문일',exact:true})],
+      ['tabs',page.getByRole('tab',{name:'첫 번째',exact:true})],
+      ['calendar',page.locator('[data-krds-component="calendar"][data-krds-part="day"][data-date="2024-02-15"]')]
+    ]) { await locator.focus(); await page.screenshot({path:join(directory,`focused-${name}.png`),fullPage:true,animations:'disabled'}); }
+    await focus.focus();
+  }
+  const geometry=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,focused:document.activeElement?.textContent,focusOutline:getComputedStyle(document.activeElement).outlineStyle,tableScroll:Array.from(document.querySelectorAll('[data-krds-internal="table-scroll"]')).map(el=>({client:el.clientWidth,scroll:el.scrollWidth}))}));
+  const axe=await new AxeBuilder({page}).analyze();
+  await page.getByRole('button',{name:'모달 열기',exact:true}).click();await page.getByRole('dialog',{name:'신청 확인'}).waitFor();await page.screenshot({path:join(directory,variant+'-modal.png'),fullPage:true,animations:'disabled'});const modalAxe=await new AxeBuilder({page}).analyze();
+  results.push({variant,geometry,axe:axe.violations,modalAxe:modalAxe.violations,errors,externalRequests:requests});await context.close();
+ }
+} finally {await browser.close();await server.close();await writeFile(join(directory,'raw-results.json'),JSON.stringify(results,null,2));}
+console.log(JSON.stringify(results.map(r=>({variant:r.variant,geometry:r.geometry,axe:r.axe.map(x=>x.id),modalAxe:r.modalAxe.map(x=>x.id),errors:r.errors,externalRequests:r.externalRequests})),null,2));
+if(results.some(r=>r.axe.length||r.modalAxe.length||r.errors.length||r.externalRequests.length))process.exitCode=1;
```

## apps/fixture-vue/tsconfig.json

```diff
--- pre-native/apps/fixture-vue/tsconfig.json
+++ apps/fixture-vue/tsconfig.json
@@ -6,11 +6,12 @@
       "node"
     ]
   },
   "include": [
     "src/**/*.ts",
     "src/**/*.tsx",
     "tests/**/*.ts",
     "*.config.ts",
-    ".storybook/**/*.ts"
+    ".storybook/**/*.ts",
+    "src/**/*.vue"
   ]
 }
```

## apps/storybook-vue/.storybook/preview.ts

```diff
--- pre-native/apps/storybook-vue/.storybook/preview.ts
+++ apps/storybook-vue/.storybook/preview.ts
@@ -0,0 +1,5 @@
+import type { Preview } from '@storybook/vue3-vite';
+import '@unofficial-krds/styles/reset.css';
+import '@unofficial-krds/styles/fonts.css';
+import '@unofficial-krds/styles/all.css';
+export default { parameters: { layout: 'centered' } } satisfies Preview;
```

## apps/storybook-vue/src/env.d.ts

```diff
--- pre-native/apps/storybook-vue/src/env.d.ts
+++ apps/storybook-vue/src/env.d.ts
@@ -0,0 +1 @@
+/// <reference types="vite/client" />
```

## apps/storybook-vue/src/main.ts

```diff
--- pre-native/apps/storybook-vue/src/main.ts
+++ apps/storybook-vue/src/main.ts
@@ -1,4 +1,3 @@
-/** T01 toolchain probe only; no component coverage. */
 import { createApp } from 'vue';
-import { WorkspaceProbe } from '@unofficial-krds/vue';
-createApp(WorkspaceProbe).mount('#app');
+import Pilots from './stories/Pilots.vue';
+createApp(Pilots, { component: 'button' }).mount('#app');
```

## apps/storybook-vue/src/stories/NativeProbe.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/NativeProbe.ts
+++ apps/storybook-vue/src/stories/NativeProbe.ts
@@ -1,11 +1,11 @@
 /** Native Vue story-only infrastructure; no KRDS component coverage. */
 import { defineComponent, h } from 'vue';
-import { WorkspaceProbe } from '@unofficial-krds/vue';
+import { Button } from '@unofficial-krds/vue';
 export const NativeProbe = defineComponent({
   name: 'NativeProbe',
   props: {
     count: { type: Number, default: 0 },
     label: { type: String, default: 'Probe increment' },
     disabled: { type: Boolean, default: false },
     loading: { type: Boolean, default: false },
     errorMessage: { type: String, default: '' },
@@ -13,12 +13,12 @@
   setup(props) {
     return () => h('main', [
       props.errorMessage
         ? h('div', { role: 'alert' }, props.errorMessage)
         : h('section', [
           h('button', { type: 'button', disabled: props.disabled }, props.label),
           h('div', { role: 'status', 'aria-label': 'Probe value' }, String(props.count)),
         ]),
-      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(WorkspaceProbe)]),
+      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(Button, {}, () => 'Native Button')]),
     ]);
   },
 });
```

## apps/storybook-vue/src/stories/Pilots.vue

```diff
--- pre-native/apps/storybook-vue/src/stories/Pilots.vue
+++ apps/storybook-vue/src/stories/Pilots.vue
@@ -0,0 +1,6 @@
+<script setup lang="ts">
+import { ref } from 'vue';
+import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/vue';
+defineProps<{component:string}>();const selected=ref('seoul');const tab=ref('first');const date=ref<string|null>(null);const open=ref(true);
+</script>
+<template><KrdsProvider><main style="padding:1rem"><Button v-if="component==='button'" disabled>저장</Button><NativeSelect v-else-if="component==='native-select'" v-model="selected" label="지역" :options="[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]" /><Modal v-else-if="component==='modal'" v-model="open" title="확인"><p>작업을 확인하세요.</p></Modal><Tabs v-else-if="component==='tabs'" v-model="tab" label="정보" :items="[{value:'first',label:'첫 번째'},{value:'second',label:'두 번째'}]"><template #first>첫 번째 내용</template><template #second>두 번째 내용</template></Tabs><DateInput v-else-if="component==='date-input'" v-model="date" label="날짜" invalid error="YYYY-MM-DD 형식의 올바른 날짜를 입력하세요" reference-date="2024-02-15" /><Calendar v-else-if="component==='calendar'" mode="range" :default-value="{start:'2024-02-12',end:'2024-02-18'}" reference-date="2024-02-15" today="2024-02-15" label="방문일" /></main></KrdsProvider></template>
```

## apps/storybook-vue/src/stories/calendar.stories.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/calendar.stories.ts
+++ apps/storybook-vue/src/stories/calendar.stories.ts
@@ -0,0 +1,3 @@
+import Pilots from './Pilots.vue';
+export default {title:'KRDS/Calendar',component:Pilots,args:{component:'calendar'}};
+export const SelectedRange={};
```

## apps/storybook-vue/src/stories/date-input.stories.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/date-input.stories.ts
+++ apps/storybook-vue/src/stories/date-input.stories.ts
@@ -0,0 +1,3 @@
+import Pilots from './Pilots.vue';
+export default {title:'KRDS/Date Input',component:Pilots,args:{component:'date-input'}};
+export const Invalid={};
```

## apps/storybook-vue/src/stories/modal.stories.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/modal.stories.ts
+++ apps/storybook-vue/src/stories/modal.stories.ts
@@ -0,0 +1,3 @@
+import Pilots from './Pilots.vue';
+export default {title:'KRDS/Modal',component:Pilots,args:{component:'modal'}};
+export const Open={};
```

## apps/storybook-vue/src/stories/pilots.stories.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/pilots.stories.ts
+++ apps/storybook-vue/src/stories/pilots.stories.ts
@@ -0,0 +1,5 @@
+import type { Meta, StoryObj } from '@storybook/vue3-vite';
+import Pilots from './Pilots.vue';
+const meta={title:'KRDS/Button',component:Pilots,args:{component:'button'}} satisfies Meta<typeof Pilots>;
+export default meta;
+export const Disabled:StoryObj<typeof meta>={};
```

## apps/storybook-vue/src/stories/select.stories.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/select.stories.ts
+++ apps/storybook-vue/src/stories/select.stories.ts
@@ -0,0 +1,3 @@
+import Pilots from './Pilots.vue';
+export default {title:'KRDS/Native Select',component:Pilots,args:{component:'native-select'}};
+export const Controlled={};
```

## apps/storybook-vue/src/stories/tabs.stories.ts

```diff
--- pre-native/apps/storybook-vue/src/stories/tabs.stories.ts
+++ apps/storybook-vue/src/stories/tabs.stories.ts
@@ -0,0 +1,3 @@
+import Pilots from './Pilots.vue';
+export default {title:'KRDS/Tabs',component:Pilots,args:{component:'tabs'}};
+export const Manual={};
```

## apps/storybook-vue/tsconfig.json

```diff
--- pre-native/apps/storybook-vue/tsconfig.json
+++ apps/storybook-vue/tsconfig.json
@@ -6,11 +6,12 @@
       "node"
     ]
   },
   "include": [
     "src/**/*.ts",
     "src/**/*.tsx",
     "tests/**/*.ts",
     "*.config.ts",
-    ".storybook/**/*.ts"
+    ".storybook/**/*.ts",
+    "src/**/*.vue"
   ]
 }
```

## docs/compatibility/vue.md

```diff
--- pre-native/docs/compatibility/vue.md
+++ docs/compatibility/vue.md
@@ -0,0 +1,29 @@
+# Vue native pilot
+
+The six controls use Vue 3.5.44 SFCs, native rendering, typed props/emits, slots and provide/inject. Vue remains a peer with an exact development copy. No foreign renderer or adapter is imported. The pilot does not establish full catalog or release readiness.
+
+```vue
+<script setup lang="ts">
+import { ref } from 'vue';
+import { DateInput, KrdsProvider } from '@unofficial-krds/vue';
+import '@unofficial-krds/styles/reset.css';
+import '@unofficial-krds/styles/fonts.css';
+import '@unofficial-krds/styles/all.css';
+const visit = ref<string | null>('2024-02-29');
+</script>
+<template>
+  <KrdsProvider locale="ko-KR">
+    <DateInput v-model="visit" label="방문일" name="visit" reference-date="2024-02-15" />
+  </KrdsProvider>
+</template>
+```
+
+Root named exports are Button, NativeSelect, Modal, Tabs, Calendar, DateInput and KrdsProvider, plus semantic TypeScript types. Default component subpaths are `/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`. `v-model` and controlled `value`/`open` are supported. Requests emit `value-change` (`{value}`) and `open-change` (`{open}`); parent props remain authoritative. Do not bind both controlled forms to one component.
+
+NativeSelect and DateInput expose `label`, `hint`, and `error` slots. Tabs exposes a rich `label` slot with `{item}` and named panel slots matching item values. Modal exposes `title`, `description`, default body and `actions` with `{close}`, and `trigger` with `{open,isOpen}`. Without the icon close control an enabled explicit action marked `data-krds-close` is required. Initial focus IDs may target only the dialog or its first interactive element. Enabled tabs and dates all remain sequential Tab stops.
+
+KrdsProvider supplies reactive locale/direction and an optional document getter. Built root/subpath imports and SSR of closed controls use no DOM globals. Open modal portals require a mounted browser document. IDs use Vue useId; consumers must keep SSR/hydration app prefixes consistent.
+
+DateInput uses strict ASCII Gregorian dates, separate raw drafts and canonical hidden form values. Mode is immutable; range commits are complete or empty. Enter/group blur commit, IME preserves drafts, and Calendar remains tentative until Confirm. No implicit clock exists. Form reset emits no value events.
+
+`apps/fixture-vue/src/ConsumerExample.vue` is compiled with vue-tsc against the public built package and default subpath. `apps/fixture-vue/tests/ssr-consumer.mjs` verifies built public native Vue SSR. Behavioral tests live separately under the fixture's `tests/siheom`; state-only stories live under `apps/storybook-vue/src/stories`. Exact evidence and remaining gates are in `.superpowers/sdd/PLAN/task-T07-vue-report.md`.
```

## packages/vue/README.md

```diff
--- pre-native/packages/vue/README.md
+++ packages/vue/README.md
@@ -1,5 +1,20 @@
 # @unofficial-krds/vue
 
-T01 workspace/compiler probe only. This entry is not a KRDS component and contributes no catalog coverage. Native implementation, independent consumer validation, and rights reconciliation remain pending.
+Native Vue 3.5.44 six-component pilot: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. This is an independent implementation; it does not claim official KRDS endorsement, full catalog coverage or release readiness. Original KRDS and font rights remain separate from the independent-code MIT grant; see LICENSE.md, ATTRIBUTION.md and THIRD-PARTY-NOTICES.md.
 
-Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under the MIT grant in LICENSES/MIT.txt. KRDS and third-party materials retain their separate recorded terms. Publication is not authorized.
+```vue
+<script setup lang="ts">
+import { ref } from 'vue';
+import { Button, DateInput } from '@unofficial-krds/vue';
+import '@unofficial-krds/styles/all.css';
+const visit = ref<string | null>(null);
+</script>
+<template>
+  <DateInput v-model="visit" label="방문일" name="visit" reference-date="2024-02-15" />
+  <Button type="submit">신청</Button>
+</template>
+```
+
+Use root named exports or default component subpaths `/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`. Controlled inputs accept `value` (Modal `open`) or `v-model`; requests emit `value-change` (`{value}`) and `open-change` (`{open}`). The parent remains authoritative. Native slots support rich labels, hints/errors, modal body/actions and persistent tab panels. `KrdsProvider` supplies locale, direction and document access without browser globals at import time.
+
+See `docs/compatibility/vue.md` in the repository for the compiled consumer example, form/date behavior, SSR limits and verification evidence. Publication, pushing and tagging are not authorized by the pilot implementation.
```

## packages/vue/package.json

```diff
--- pre-native/packages/vue/package.json
+++ packages/vue/package.json
@@ -1,14 +1,14 @@
 {
   "name": "@unofficial-krds/vue",
   "version": "0.0.0",
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "yarn typecheck",
     "lint": "node ../../tools/check-workspace.mjs",
     "prepublishOnly": "node ../../tools/block-publish.mjs",
     "build:local": "vite build && vue-tsc -p tsconfig.json --emitDeclarationOnly",
     "typecheck": "vue-tsc -p tsconfig.json --noEmit"
   },
   "devDependencies": {
     "@types/node": "24.13.3",
     "@vitejs/plugin-vue": "6.0.10",
@@ -16,17 +16,17 @@
     "@vue/compiler-sfc": "3.5.44",
     "playwright": "1.64.1",
     "typescript": "6.0.2",
     "vite": "8.3.5",
     "vitest": "4.1.10",
     "vue": "3.5.44",
     "vue-tsc": "3.3.14"
   },
-  "description": "KRDS Native vue: T01 toolchain probe only",
+  "description": "Native Vue six-component KRDS pilot",
   "license": "SEE LICENSE IN LICENSE.md",
   "files": [
     "dist",
     "README.md",
     "LICENSE.md",
     "LICENSES",
     "ATTRIBUTION.md",
     "THIRD-PARTY-NOTICES.md",
@@ -35,16 +35,40 @@
   "sideEffects": false,
   "main": "./dist/index.js",
   "module": "./dist/index.js",
   "types": "./dist/index.d.ts",
   "exports": {
     ".": {
       "types": "./dist/index.d.ts",
       "import": "./dist/index.js"
+    },
+    "./button": {
+      "types": "./dist/components/button/Button.vue.d.ts",
+      "import": "./dist/button.js"
+    },
+    "./native-select": {
+      "types": "./dist/components/native-select/NativeSelect.vue.d.ts",
+      "import": "./dist/native-select.js"
+    },
+    "./modal": {
+      "types": "./dist/components/modal/Modal.vue.d.ts",
+      "import": "./dist/modal.js"
+    },
+    "./tabs": {
+      "types": "./dist/components/tabs/Tabs.vue.d.ts",
+      "import": "./dist/tabs.js"
+    },
+    "./calendar": {
+      "types": "./dist/components/calendar/Calendar.vue.d.ts",
+      "import": "./dist/calendar.js"
+    },
+    "./date-input": {
+      "types": "./dist/components/date-input/DateInput.vue.d.ts",
+      "import": "./dist/date-input.js"
     }
   },
   "peerDependencies": {
     "vue": "^3.5.44"
   },
   "dependencies": {
     "@ark-ui/vue": "5.40.0",
     "@unofficial-krds/contracts": "workspace:^",
```

## packages/vue/src/WorkspaceProbe.vue

```diff
--- pre-native/packages/vue/src/WorkspaceProbe.vue
+++ packages/vue/src/WorkspaceProbe.vue
@@ -1,2 +0,0 @@
-<!-- T01 compiler probe only. -->
-<template><span data-workspace-probe="vue">T01 compiler probe</span></template>
```

## packages/vue/src/components/button/Button.vue

```diff
--- pre-native/packages/vue/src/components/button/Button.vue
+++ packages/vue/src/components/button/Button.vue
@@ -0,0 +1,28 @@
+<script setup lang="ts">
+import { useKrds } from '../context';
+const context = useKrds();
+import { useAttrs, useSlots, watchEffect } from 'vue';
+import { oneOf } from '../control';
+const props = withDefaults(defineProps<{
+    type?: 'button' | 'submit' | 'reset';
+    disabled?: boolean;
+    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
+    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
+    name?: string;
+    value?: string;
+    form?: string;
+}>(), { type: 'button', disabled: false, variant: 'primary', size: 'medium' });
+const attrs = useAttrs(); const slots = useSlots();
+if (!slots.default && !attrs['aria-label'] && !attrs['aria-labelledby']) throw new TypeError('Button needs an accessible name.');
+watchEffect(() => { oneOf(props.type, ['button','submit','reset'], 'button type'); oneOf(props.variant, ['primary','secondary','tertiary','text','icon'], 'button variant'); oneOf(props.size, ['xsmall','small','medium','large','xlarge'], 'button size'); });
+</script>
+<template>
+<button data-krds-component="button" data-krds-part="root" :dir="context.direction.value" :data-krds-state="disabled?'disabled':undefined" :data-krds-variant="variant" :data-krds-size="size" :type="type" :disabled="disabled" :name="name" :value="value" :form="form">
+<span v-if="$slots.icon" data-krds-component="button" data-krds-part="icon" aria-hidden="true">
+<slot name="icon" />
+</span>
+<span data-krds-component="button" data-krds-part="label">
+<slot />
+</span>
+</button>
+</template>
```

## packages/vue/src/components/calendar/Calendar.vue

```diff
--- pre-native/packages/vue/src/components/calendar/Calendar.vue
+++ packages/vue/src/components/calendar/Calendar.vue
@@ -0,0 +1,144 @@
+<script setup lang="ts">
+import { controlContract, oneOf } from '../control';
+import { addDays, addMonths, calendarMonthGrid, daysInMonth, parseIsoDate, weekday } from '@unofficial-krds/contracts';
+import { computed, nextTick, ref, useId, watch } from 'vue';
+import { useKrds } from '../context';
+import { bounds, calendarWords, copy, dictionary, empty, ends, equal, interpolate, validate } from '../date-model';
+import type { CalendarTranslations, DateValue, DateMode } from '../types';
+const p = withDefaults(defineProps<{
+    mode?: DateMode;
+    value?: DateValue;
+    modelValue?: DateValue;
+    defaultValue?: DateValue;
+    min?: string;
+    max?: string;
+    disabled?: boolean;
+    required?: boolean;
+    locale?: 'ko-KR' | 'en-US';
+    translations?: Partial<CalendarTranslations>;
+    referenceDate?: string;
+    today?: string;
+    label?: string;
+    id?: string;
+}>(), { mode: 'single', disabled: false, required: false, referenceDate: '2000-01-01' });
+controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
+const emit = defineEmits<{
+    'update:modelValue': [
+        value: DateValue
+    ];
+    valueChange: [
+        detail: {
+            value: DateValue;
+        }
+    ];
+    confirm: [
+        detail: {
+            value: DateValue;
+        }
+    ];
+    cancel: [
+    ];
+}>();
+const context = useKrds();
+const id = p.id ?? useId();
+oneOf(p.mode, ['single','range'], 'date mode');
+const initialMode = p.mode;
+const range = computed(() => p.mode === 'range');
+const limits = computed(() => bounds(p));
+const words = computed(() => { const w = dictionary(calendarWords((p.locale ?? context.locale.value) === 'en-US'), p.translations); if (w.weekdays.length !== 7 || w.weekdayLabels.length !== 7 || w.months.length !== 12)
+    throw new TypeError('Complete weekday and month arrays required'); return w; });
+const local = ref<DateValue>(copy(p.defaultValue ?? empty(range.value)));
+const committed = computed(() => validate(p.modelValue !== undefined ? p.modelValue : p.value !== undefined ? p.value : local.value, range.value, limits.value.min, limits.value.max));
+const tentative = ref<DateValue>(copy(committed.value));
+function startMonth(v: DateValue) { const d = ends(v)[0] ?? p.referenceDate; return (d < limits.value.min ? limits.value.min : d > limits.value.max ? limits.value.max : d).slice(0, 7) + '-01'; }
+const month = ref(startMonth(committed.value));
+const root = ref<HTMLElement>();
+watch(() => p.mode, () => { if (p.mode !== initialMode)
+    throw new TypeError('Calendar mode is immutable'); });
+watch(committed, v => { tentative.value = copy(v); month.value = startMonth(v); }, { deep: true });
+const grid = computed(() => calendarMonthGrid(month.value));
+const rows = computed(() => Array.from({ length: 6 }, (_, i) => grid.value.slice(i * 7, i * 7 + 7)));
+const unavailable = (d: string) => p.disabled || d < limits.value.min || d > limits.value.max;
+const selected = (d: string) => { const [a, b] = ends(tentative.value); return range.value ? !!a && d >= a && d <= (b ?? a) : a === d; };
+function state(d: string) { const [a, b] = ends(tentative.value); return [d === p.today ? 'today' : '', selected(d) ? 'selected' : '', range.value && d === a ? 'range-start' : '', range.value && d === b ? 'range-end' : '', range.value && a && b && d > a && d < b ? 'in-range' : '', d.slice(0, 7) !== month.value.slice(0, 7) ? 'outside-month' : '', unavailable(d) ? 'disabled' : ''].filter(Boolean).join(' '); }
+function fields(d: string) { const part = parseIsoDate(d)!; return { ...part, weekday: words.value.weekdays[weekday(d)]!, monthName: words.value.months[part.month - 1]! }; }
+const heading = computed(() => interpolate(words.value.monthLabel, fields(month.value)));
+function name(d: string) { const [a, b] = ends(tentative.value); return [interpolate(words.value.dateLabel, fields(d)), d === p.today ? words.value.today : '', selected(d) ? words.value.selected : '', unavailable(d) ? words.value.unavailable : '', d.slice(0, 7) !== month.value.slice(0, 7) ? words.value.adjacentMonth : '', range.value && d === a ? words.value.startLabel : '', range.value && d === b ? words.value.endLabel : ''].filter(Boolean).join(', '); }
+function choose(d: string) { if (unavailable(d))
+    return; const [a, b] = ends(tentative.value); tentative.value = range.value ? (!a || b ? { start: d, end: null } : { start: d < a ? d : a, end: d < a ? a : d }) : d; month.value = d.slice(0, 7) + '-01'; }
+const complete = computed(() => { const [a, b] = ends(tentative.value); return !p.disabled && (!range.value || !!a === !!b) && (!p.required || !!a) && (!a || !unavailable(a)) && (!b || !unavailable(b)); });
+function confirm() { if (!complete.value)
+    return; const next = copy(tentative.value); if (!equal(next, committed.value)) {
+    if (p.modelValue === undefined && p.value === undefined)
+        local.value = copy(next);
+    emit('update:modelValue', copy(next));
+    emit('valueChange', { value: copy(next) });
+} emit('confirm', { value: copy(next) }); void nextTick(() => { tentative.value = copy(committed.value); }); }
+function cancel() { if (p.disabled)
+    return; tentative.value = copy(committed.value); emit('cancel'); }
+function canMonth(delta: number) { const target = addMonths(month.value, delta); if (!target)
+    return false; const part = parseIsoDate(target)!; const last = target.slice(0, 8) + String(daysInMonth(part.year, part.month)).padStart(2, '0'); return last >= limits.value.min && target <= limits.value.max; }
+function moveMonth(delta: number) { if (!p.disabled && canMonth(delta))
+    month.value = addMonths(month.value, delta)!; }
+async function focusDate(d: string) { month.value = d.slice(0, 7) + '-01'; await nextTick(); root.value?.querySelector<HTMLElement>(`[data-date="${d}"]`)?.focus(); }
+function key(e: KeyboardEvent, d: string) { if (e.defaultPrevented || e.isComposing || e.keyCode === 229 || p.disabled)
+    return; let target: string | null = null; let direction = 1; let withinMonth = false; let weekEnd: string | null = null; const delta: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }; if (e.key in delta) {
+    direction = Math.sign(delta[e.key]!);
+    target = addDays(d, delta[e.key]!);
+}
+else if (e.key === 'Home' || e.key === 'End') {
+    direction = e.key === 'Home' ? 1 : -1;
+    target = addDays(d, e.key === 'Home' ? -weekday(d) : 6 - weekday(d));
+    weekEnd = d;
+}
+else if (e.key === 'PageUp' || e.key === 'PageDown') {
+    direction = e.key === 'PageUp' ? -1 : 1;
+    target = addMonths(d, direction * (e.shiftKey ? 12 : 1));
+    withinMonth = true;
+}
+else
+    return; e.preventDefault(); const monthKey = target?.slice(0, 7); while (target && unavailable(target)) {
+    if (target < limits.value.min && direction < 0 || target > limits.value.max && direction > 0)
+        return;
+    target = addDays(target, direction);
+    if (withinMonth && target?.slice(0, 7) !== monthKey)
+        return;
+    if (weekEnd && target && (direction > 0 ? target > weekEnd : target < weekEnd))
+        return;
+} if (target)
+    void focusDate(target); }
+function today() { if (p.today && !unavailable(p.today))
+    void focusDate(p.today); }
+defineExpose({ focusInitial: async () => { await nextTick(); const selected = root.value?.querySelector<HTMLElement>('button[data-date][aria-pressed="true"]:not(:disabled)'); const first = root.value?.querySelector<HTMLElement>('button[data-date]:not([data-krds-state*="outside-month"]):not(:disabled)'); (selected ?? first ?? root.value?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus(); } });
+</script>
+<template>
+<section :id="id" ref="root" data-krds-component="calendar" data-krds-part="root" :aria-label="label" :dir="context.direction.value">
+<header data-krds-component="calendar" data-krds-part="header">
+<button type="button" data-krds-component="calendar" data-krds-part="previous" :disabled="disabled||!canMonth(-1)" :aria-label="words.previousMonth" @click="moveMonth(-1)">‹</button>
+<h2 :id="`${id}-heading`" data-krds-component="calendar" data-krds-part="heading" aria-live="polite">{{heading}}</h2>
+<button type="button" data-krds-component="calendar" data-krds-part="next" :disabled="disabled||!canMonth(1)" :aria-label="words.nextMonth" @click="moveMonth(1)">›</button>
+</header>
+<div data-krds-component="calendar" data-krds-internal="table-scroll">
+<table data-krds-component="calendar" data-krds-part="table" :aria-labelledby="`${id}-heading`">
+<thead>
+<tr>
+<th v-for="(day,index) in words.weekdayLabels" :key="index" scope="col" data-krds-component="calendar" data-krds-part="weekday" :aria-label="words.weekdays[index]">{{day}}</th>
+</tr>
+</thead>
+<tbody>
+<tr v-for="(week,index) in rows" :key="index">
+<td v-for="(day,column) in week" :key="column" data-krds-component="calendar" data-krds-part="cell">
+<button v-if="day" type="button" data-krds-component="calendar" data-krds-part="day" :data-date="day" :data-krds-state="state(day)" :disabled="unavailable(day)" :aria-label="name(day)" :aria-current="day===p.today?'date':undefined" :aria-pressed="selected(day)" @click="choose(day)" @keydown="key($event,day)">{{interpolate(words.visibleDayLabel,fields(day))}}</button>
+</td>
+</tr>
+</tbody>
+</table>
+</div>
+<footer data-krds-component="calendar" data-krds-part="footer">
+<button v-if="p.today" type="button" data-krds-component="calendar" data-krds-part="today" :disabled="disabled||unavailable(p.today)" @click="today">{{words.today}}</button>
+<button v-if="!required" type="button" data-krds-component="calendar" data-krds-part="clear" :disabled="disabled" @click="tentative=empty(range)">{{words.clear}}</button>
+<button type="button" data-krds-component="calendar" data-krds-part="cancel" :disabled="disabled" @click="cancel">{{words.cancel}}</button>
+<button type="button" data-krds-component="calendar" data-krds-part="confirm" :disabled="!complete" @click="confirm">{{words.confirm}}</button>
+</footer>
+</section>
+</template>
```

## packages/vue/src/components/context.ts

```diff
--- pre-native/packages/vue/src/components/context.ts
+++ packages/vue/src/components/context.ts
@@ -0,0 +1,9 @@
+import { computed, defineComponent, inject, provide, type InjectionKey, type PropType, type ComputedRef } from 'vue';
+export interface KrdsContext {
+    locale: ComputedRef<'ko-KR' | 'en-US'>;
+    direction: ComputedRef<'ltr' | 'rtl'>;
+    document: () => Document | undefined;
+}
+const key: InjectionKey<KrdsContext> = Symbol('KRDS Vue context');
+export const KrdsProvider = defineComponent({ name: 'KrdsProvider', props: { locale: { type: String as PropType<'ko-KR' | 'en-US'>, default: 'ko-KR' }, direction: { type: String as PropType<'ltr' | 'rtl'>, default: 'ltr' }, document: Function as PropType<() => Document | undefined> }, setup(props, { slots }) { provide(key, { locale: computed(() => props.locale), direction: computed(() => props.direction), document: () => props.document?.() ?? (typeof document === 'undefined' ? undefined : document) }); return () => slots.default?.(); } });
+export function useKrds() { return inject(key, { locale: computed(() => 'ko-KR' as const), direction: computed(() => 'ltr' as const), document: () => typeof document === 'undefined' ? undefined : document }); }
```

## packages/vue/src/components/control.ts

```diff
--- pre-native/packages/vue/src/components/control.ts
+++ packages/vue/src/components/control.ts
@@ -0,0 +1,18 @@
+import { watchEffect } from 'vue';
+
+/** Retain the initial ownership boundary; defaults are initialization, not a second writer. */
+export function controlContract(read: () => { value: unknown; modelValue: unknown; defaultValue: unknown }) {
+  const initial = read();
+  const controlled = initial.value !== undefined || initial.modelValue !== undefined;
+  watchEffect(() => {
+    const state = read();
+    const current = state.value !== undefined || state.modelValue !== undefined;
+    if (current !== controlled) throw new TypeError('Controlled mode cannot change after mount.');
+    if (current && state.defaultValue !== undefined) throw new TypeError('A controlled value cannot be combined with a default.');
+    if (state.value !== undefined && state.modelValue !== undefined) throw new TypeError('Choose value/open or v-model as the controlled source.');
+  });
+  return controlled;
+}
+export function oneOf(value: unknown, allowed: readonly unknown[], name: string) {
+  if (!allowed.includes(value)) throw new TypeError(`Invalid ${name}.`);
+}
```

## packages/vue/src/components/date-input/DateInput.vue

```diff
--- pre-native/packages/vue/src/components/date-input/DateInput.vue
+++ packages/vue/src/components/date-input/DateInput.vue
@@ -0,0 +1,188 @@
+<script setup lang="ts">
+import { controlContract, oneOf } from '../control';
+import { computed, nextTick, onMounted, onUnmounted, ref, useId, useSlots, watch } from 'vue';
+import { parseIsoDate } from '@unofficial-krds/contracts';
+import Modal from '../modal/Modal.vue';
+import Calendar from '../calendar/Calendar.vue';
+import { useKrds } from '../context';
+import { bounds, copy, dateWords, dictionary, empty, ends, equal, interpolate, validate } from '../date-model';
+import type { DateInputTranslations, CalendarTranslations, DateMode, DateValue } from '../types';
+const p = withDefaults(defineProps<{
+    mode?: DateMode;
+    value?: DateValue;
+    modelValue?: DateValue;
+    defaultValue?: DateValue;
+    id?: string;
+    name?: string;
+    form?: string;
+    autocomplete?: string;
+    label?: string;
+    hint?: string;
+    error?: string;
+    invalid?: boolean;
+    required?: boolean;
+    disabled?: boolean;
+    min?: string;
+    max?: string;
+    locale?: 'ko-KR' | 'en-US';
+    translations?: Partial<DateInputTranslations>;
+    calendarTranslations?: Partial<CalendarTranslations>;
+    withCalendar?: boolean;
+    referenceDate?: string;
+    today?: string;
+}>(), { mode: 'single', required: false, disabled: false, withCalendar: true, referenceDate: '2000-01-01' });
+controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
+const emit = defineEmits<{
+    'update:modelValue': [
+        value: DateValue
+    ];
+    valueChange: [
+        detail: {
+            value: DateValue;
+        }
+    ];
+}>();
+const context = useKrds();
+const slots = useSlots();
+if (!p.label && !slots.label) throw new TypeError('DateInput needs a task-specific label.');
+const canonicalInputs = ref<HTMLInputElement[]>([]);
+const id = p.id ?? useId();
+oneOf(p.mode, ['single','range'], 'date mode');
+const firstMode = p.mode;
+const range = computed(() => p.mode === 'range');
+const limits = computed(() => bounds(p));
+const words = computed(() => dictionary(dateWords((p.locale ?? context.locale.value) === 'en-US'), p.translations));
+const baseline = copy(p.defaultValue ?? empty(range.value));
+const local = ref<DateValue>(copy(baseline));
+const controlled = computed(() => p.value !== undefined || p.modelValue !== undefined);
+const committed = computed(() => validate(p.modelValue !== undefined ? p.modelValue : p.value !== undefined ? p.value : local.value, range.value, limits.value.min, limits.value.max));
+const raw = ref<[
+    string,
+    string
+]>(['', '']);
+const error = ref('');
+const announced = ref('');
+const composing = ref(false);
+const popup = ref(false);
+const root = ref<HTMLElement>();
+const fields = ref<HTMLInputElement[]>([]);
+const calendar = ref<InstanceType<typeof Calendar>>();
+function display() { const [a, b] = ends(committed.value); raw.value = [a ?? '', b ?? '']; error.value = ''; announced.value = ''; validity(); }
+watch(committed, display, { deep: true, immediate: true });
+watch(() => p.mode, () => { if (p.mode !== firstMode)
+    throw new TypeError('DateInput mode is immutable'); });
+watch(() => p.disabled, disabled => { if (disabled)
+    popup.value = false; });
+function parsed(): { value?: DateValue; error: string; index?: number } {
+  const [start, end] = raw.value;
+  const wordsForDate = words.value;
+  if (!start && (!range.value || !end)) {
+    return p.required ? { error: wordsForDate.requiredError, index: 0 } : { value: empty(range.value), error: '' };
+  }
+  if (start && !parseIsoDate(start)) return { error: wordsForDate.formatError, index: 0 };
+  if (range.value && end && !parseIsoDate(end)) return { error: wordsForDate.formatError, index: 1 };
+  if (range.value && (!start || !end)) return { error: wordsForDate.incompleteRangeError, index: start ? 1 : 0 };
+  if (range.value && start > end) return { error: wordsForDate.orderError };
+  for (const [index, date] of (range.value ? [start, end] : [start]).entries()) {
+    if (date < limits.value.min) return { error: interpolate(wordsForDate.minError, { min: limits.value.min }), index };
+    if (date > limits.value.max) return { error: interpolate(wordsForDate.maxError, { max: limits.value.max }), index };
+  }
+  return { value: range.value ? { start, end } : start, error: '' };
+}
+function validity() {
+  if (composing.value) return;
+  const result = parsed();
+  fields.value.forEach((field, index) => field?.setCustomValidity(result.index === undefined || result.index === index ? result.error : ''));
+}
+function syncCanonical(value: DateValue) {
+  const [start, end] = ends(value);
+  if (canonicalInputs.value[0]) canonicalInputs.value[0].value = start ?? '';
+  if (canonicalInputs.value[1]) canonicalInputs.value[1].value = end ?? '';
+}
+function change(index: number, e: Event) { raw.value[index] = (e.target as HTMLInputElement).value; validity(); }
+function notify(value: DateValue) { if (equal(value, committed.value))
+    return; if (!controlled.value)
+    local.value = copy(value); emit('update:modelValue', copy(value)); emit('valueChange', { value: copy(value) }); }
+async function commit() { if (p.disabled || composing.value)
+    return false; const result = parsed(); error.value = result.error; if (result.error) {
+    if (announced.value !== result.error)
+        announced.value = result.error;
+    validity();
+    return false;
+} const next = result.value!; notify(next); await nextTick(); const accepted = equal(next, committed.value); display(); return accepted; }
+function key(e: KeyboardEvent) { if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229 && !composing.value) {
+    e.preventDefault();
+    void commit();
+} }
+function blur() { queueMicrotask(() => { const active = context.document()?.activeElement; if (!composing.value && !root.value?.contains(active ?? null) && !popup.value)
+    void commit(); }); }
+function compositionEnd(index: number, e: CompositionEvent) { raw.value[index] = (e.target as HTMLInputElement).value; composing.value = false; }
+async function open() { if (p.disabled || composing.value)
+    return; popup.value = true; await nextTick(); await calendar.value?.focusInitial(); }
+function confirmed(detail: {
+    value: DateValue;
+}) { notify(detail.value); popup.value = false; void nextTick(display); }
+function reset(e: Event) { queueMicrotask(() => { if (e.defaultPrevented)
+    return; if (!controlled.value)
+    local.value = copy(baseline); popup.value = false; display(); }); }
+function submit(e: Event) { if (p.disabled)
+    return; const result = parsed(); if (result.error || result.value === undefined) {
+    e.preventDefault();
+    error.value = result.error;
+    announced.value = result.error;
+    validity();
+    fields.value[result.index ?? 0]?.reportValidity();
+    return;
+} if (!equal(result.value, committed.value)) {
+    notify(result.value);
+    if (!controlled.value) syncCanonical(result.value);
+    if (controlled.value) {
+        e.preventDefault();
+        void nextTick(display);
+    }
+} }
+function beforeInvalid() { if (!composing.value) {
+    const result = parsed();
+    error.value = result.error;
+    announced.value = result.error;
+} }
+let form: HTMLFormElement | null = null;
+onMounted(() => { display(); form = fields.value[0]?.form ?? null; form?.addEventListener('reset', reset); form?.addEventListener('submit', submit, true); });
+onUnmounted(() => { form?.removeEventListener('reset', reset); form?.removeEventListener('submit', submit, true); });
+const described = computed(() => `${id}-hint${error.value || p.error || slots.error ? ` ${id}-error` : ''}`);
+const bad = computed(() => !!error.value || !!p.error || !!slots.error || p.invalid);
+const canonical = computed(() => ends(committed.value));
+</script>
+<template>
+<div ref="root" data-krds-component="date-input" data-krds-part="root" :dir="context.direction.value" :data-krds-state="[disabled?'disabled':'',bad?'invalid':''].filter(Boolean).join(' ')" @focusout="blur">
+<component :is="range?'fieldset':'div'" :disabled="range?disabled:undefined" style="border:0;padding:0;margin:0;min-width:0;width:100%">
+<legend v-if="range" data-krds-component="date-input" data-krds-part="label">
+<slot name="label">{{label}}</slot>
+</legend>
+<label v-else :for="`${id}-input`" data-krds-component="date-input" data-krds-part="label">
+<slot name="label">{{label}}</slot>
+</label>
+<div style="display:flex;flex-wrap:wrap;gap:var(--krds-gap-2);align-items:end">
+<div v-for="index in range?[0,1]:[0]" :key="index" style="display:grid;gap:var(--krds-gap-2)">
+<label v-if="range" :for="`${id}-${index}`">{{index===0?words.startLabel:words.endLabel}}</label>
+<input :id="range?`${id}-${index}`:`${id}-input`" :ref="(el)=>{if(el)fields[index]=el as HTMLInputElement}" type="text" inputmode="numeric" :data-krds-state="[disabled?'disabled':'',bad?'invalid':''].filter(Boolean).join(' ')" data-krds-component="date-input" :data-krds-part="range?(index===0?'start-input':'end-input'):'control'" :value="raw[index]" :form="p.form" :autocomplete="autocomplete" :required="required" :disabled="disabled" placeholder="YYYY-MM-DD" :aria-describedby="described" :aria-invalid="bad||undefined" @input="change(index,$event)" @keydown="key" @compositionstart="composing=true" @compositionend="compositionEnd(index,$event)" @invalid="beforeInvalid" />
+</div>
+<button v-if="withCalendar" :id="`${id}-trigger`" type="button" data-krds-component="date-input" data-krds-part="trigger" :data-krds-state="popup?'open':'closed'" :disabled="disabled" aria-haspopup="dialog" :aria-expanded="popup" :aria-controls="`${id}-popup`" :aria-label="range&&label?`${label} ${words.openCalendar}`:words.openCalendar" @click="open">{{words.openCalendar}}</button>
+</div>
+</component>
+<template v-if="name">
+<input :ref="(el)=>{if(el)canonicalInputs[0]=el as HTMLInputElement}" type="hidden" :name="range?`${name}.start`:name" :value="canonical[0]??''" :form="p.form" :disabled="disabled" />
+<input v-if="range" :ref="(el)=>{if(el)canonicalInputs[1]=el as HTMLInputElement}" type="hidden" :name="`${name}.end`" :value="canonical[1]??''" :form="p.form" :disabled="disabled" />
+</template>
+<div :id="`${id}-hint`" data-krds-component="date-input" data-krds-part="hint">
+<slot name="hint">{{hint??words.formatHint}}</slot>
+</div>
+<div v-if="error||p.error||$slots.error" :id="`${id}-error`" data-krds-component="date-input" data-krds-part="error">
+<slot name="error">{{error||p.error}}</slot>
+</div>
+<div role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">{{announced}}</div>
+<Modal :id="`${id}-popup`" :open="popup" :title="words.calendarTitle" :return-focus-id="`${id}-trigger`" @open-change="popup=$event.open">
+<Calendar ref="calendar" :mode="mode" :value="committed" :required="required" :disabled="disabled" :min="min" :max="max" :locale="locale" :translations="calendarTranslations" :reference-date="referenceDate" :today="today" @confirm="confirmed" @cancel="popup=false" />
+</Modal>
+</div>
+</template>
```

## packages/vue/src/components/date-model.ts

```diff
--- pre-native/packages/vue/src/components/date-model.ts
+++ packages/vue/src/components/date-model.ts
@@ -0,0 +1,32 @@
+import { parseIsoDate } from '@unofficial-krds/contracts';
+import type { DateValue, CalendarTranslations, DateInputTranslations } from './types';
+export const empty = (range: boolean): DateValue => range ? { start: null, end: null } : null;
+export const ends = (v: DateValue): [
+    string | null,
+    string | null
+] => v !== null && typeof v === 'object' ? [v.start, v.end] : [v, null];
+export const equal = (a: DateValue, b: DateValue) => ends(a).every((v, i) => v === ends(b)[i]);
+export const copy = (v: DateValue): DateValue => v && typeof v === 'object' ? { ...v } : v;
+export function strict(v: string) { if (typeof v !== 'string' || !parseIsoDate(v))
+    throw new RangeError('Expected strict ISO date'); return v; }
+export function bounds(p: {
+    min?: string;
+    max?: string;
+    referenceDate?: string;
+    today?: string;
+}) { const min = strict(p.min ?? '0001-01-01'), max = strict(p.max ?? '9999-12-31'); if (min > max)
+    throw new RangeError('min exceeds max'); strict(p.referenceDate ?? '2000-01-01'); if (p.today !== undefined)
+    strict(p.today); return { min, max }; }
+export function validate(v: DateValue, range: boolean, min: string, max: string) { if (range && (!v || typeof v !== 'object' || !('start' in v) || !('end' in v)))
+    throw new TypeError('Expected range'); if (!range && v !== null && typeof v !== 'string')
+    throw new TypeError('Expected date'); const [a, b] = ends(v); if (range && (a === null) !== (b === null))
+    throw new RangeError('Incomplete committed range'); for (const d of range ? [a, b] : [a])
+    if (d !== null && (strict(d) < min || d > max))
+        throw new RangeError('Unavailable date'); if (a && b && a > b)
+    throw new RangeError('Reversed range'); return v; }
+export function dictionary<T extends object>(base: T, override?: Partial<T>): T { const result = { ...base, ...override }; for (const v of Object.values(result))
+    if (typeof v === 'string' && !v.trim() || Array.isArray(v) && v.some(x => typeof x !== 'string' || !x.trim()))
+        throw new TypeError('Empty translation'); return result; }
+export const interpolate = (s: string, values: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (all, key) => String(values[key] ?? all));
+export function dateWords(en: boolean): DateInputTranslations { return en ? { startLabel: 'Start date', endLabel: 'End date', formatHint: 'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar: 'Open calendar', calendarTitle: 'Choose date', requiredError: 'Enter a date', formatError: 'Enter a valid date in YYYY-MM-DD format', incompleteRangeError: 'Enter both start and end dates', orderError: 'End date must not precede start date', minError: 'Enter a date on or after {min}', maxError: 'Enter a date on or before {max}' } : { startLabel: '시작일', endLabel: '종료일', formatHint: 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: '달력 열기', calendarTitle: '날짜 선택', requiredError: '날짜를 입력하세요', formatError: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: '시작일과 종료일을 모두 입력하세요', orderError: '종료일은 시작일보다 빠를 수 없습니다', minError: '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: '{max} 이전 날짜를 입력하세요 (당일 포함)' }; }
+export function calendarWords(en: boolean): CalendarTranslations { return en ? { previousMonth: 'Previous month', nextMonth: 'Next month', today: 'Today', clear: 'Clear', cancel: 'Cancel', confirm: 'Confirm', selected: 'Selected', unavailable: 'Unavailable', adjacentMonth: 'Outside displayed month', dateLabel: '{weekday}, {monthName} {day}, {year}', visibleDayLabel: '{day}', monthLabel: '{monthName} {year}', startLabel: 'Start date', endLabel: 'End date', weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] } : { previousMonth: '이전 달', nextMonth: '다음 달', today: '오늘', clear: '지우기', cancel: '취소', confirm: '확인', selected: '선택됨', unavailable: '선택할 수 없음', adjacentMonth: '다른 달', dateLabel: '{year}년 {month}월 {day}일 {weekday}', visibleDayLabel: '{day}일', monthLabel: '{year}년 {month}월', startLabel: '시작일', endLabel: '종료일', weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], weekdayLabels: ['일', '월', '화', '수', '목', '금', '토'], months: Array.from({ length: 12 }, (_, i) => `${i + 1}월`) }; }
```

## packages/vue/src/components/modal/Modal.vue

```diff
--- pre-native/packages/vue/src/components/modal/Modal.vue
+++ packages/vue/src/components/modal/Modal.vue
@@ -0,0 +1,140 @@
+<script setup lang="ts">
+import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, useId, watch, watchEffect } from 'vue';
+import { controlContract } from '../control';
+import { useKrds } from '../context';
+import { enter, leave, top, focusables, usable, restore, type ModalEntry } from './stack';
+const p = withDefaults(defineProps<{
+    open?: boolean;
+    modelValue?: boolean;
+    defaultOpen?: boolean;
+    title?: string;
+    description?: string;
+    id?: string;
+    titleId?: string;
+    descriptionId?: string;
+    closeLabel?: string;
+    showCloseButton?: boolean;
+    closeOnOutsideClick?: boolean;
+    initialFocusId?: string;
+    returnFocusId?: string;
+}>(), { open: undefined, modelValue: undefined, defaultOpen: undefined, showCloseButton: true, closeOnOutsideClick: false });
+controlContract(() => ({ value: p.open, modelValue: p.modelValue, defaultValue: p.defaultOpen }));
+watchEffect(() => { if ([p.open,p.modelValue,p.defaultOpen].some(value => value !== undefined && typeof value !== 'boolean')) throw new TypeError('Modal state must be boolean'); });
+const slots = useSlots();
+if (!p.title && !slots.title) throw new TypeError('Modal needs a visible title.');
+const emit = defineEmits<{
+    'update:modelValue': [
+        open: boolean
+    ];
+    openChange: [
+        detail: {
+            open: boolean;
+        }
+    ];
+}>();
+const context = useKrds();
+const id = p.id ?? useId();
+const local = ref(p.defaultOpen ?? false);
+const actual = computed(() => p.modelValue ?? p.open ?? local.value);
+const portal = ref<HTMLElement>();
+const dialog = ref<HTMLElement>();
+let entry: ModalEntry | undefined;
+let opener: HTMLElement | null = null;
+let ancestors: HTMLElement[] = [];
+let doc: Document | undefined;
+let started = false;
+let activationTarget: HTMLElement | null = null;
+let activationTimer: ReturnType<typeof setTimeout> | undefined;
+// WebKit can activate a native button without moving document.activeElement.
+function rememberActivation(event: MouseEvent) {
+  const candidate = event.target instanceof Element ? event.target.closest<HTMLElement>('button,input,select,textarea,a[href],[tabindex]') : null;
+  activationTarget = candidate;
+  if (activationTimer !== undefined) clearTimeout(activationTimer);
+  activationTimer = setTimeout(() => { activationTarget = null; activationTimer = undefined; }, 0);
+}
+function request(open: boolean) { if (actual.value === open)
+    return; if (p.open === undefined && p.modelValue === undefined)
+    local.value = open; emit('update:modelValue', open); emit('openChange', { open }); }
+function cleanup() { if (!entry || !doc)
+    return; doc.removeEventListener('keydown', key); doc.removeEventListener('focusin', focus); leave(doc, entry); entry = undefined; restore(doc, opener, p.returnFocusId, ancestors); opener = null; }
+function key(e: KeyboardEvent) { if (!entry || !doc || !top(doc, entry) || e.defaultPrevented || e.isComposing || e.keyCode === 229)
+    return; if (e.key === 'Escape') {
+    e.preventDefault();
+    e.stopPropagation();
+    request(false);
+}
+else if (e.key === 'Tab') {
+    const list = focusables(entry.dialog);
+    const index = list.indexOf(doc.activeElement as HTMLElement);
+    if (!list.length) {
+        e.preventDefault();
+        entry.dialog.focus();
+    }
+    else if (e.shiftKey && index <= 0) {
+        e.preventDefault();
+        list.at(-1)!.focus();
+    }
+    else if (!e.shiftKey && (index < 0 || index === list.length - 1)) {
+        e.preventDefault();
+        list[0]!.focus();
+    }
+} }
+function focus(e: FocusEvent) { if (entry && doc && top(doc, entry) && !entry.dialog.contains(e.target as Node))
+    entry.dialog.focus(); }
+async function activate(captureOpener = true) { doc = context.document(); if (!doc || !actual.value)
+    return; opener = captureOpener ? activationTarget ?? (doc.activeElement instanceof HTMLElement && doc.activeElement !== doc.body ? doc.activeElement : null) : null; ancestors = []; let ancestor = opener?.parentElement; while (ancestor) { ancestors.push(ancestor); ancestor = ancestor.parentElement; } await nextTick(); if (!actual.value || !portal.value || !dialog.value)
+    return; entry = { portal: portal.value, dialog: dialog.value }; enter(doc, entry); doc.addEventListener('keydown', key); doc.addEventListener('focusin', focus); const list = focusables(entry.dialog); if (!p.showCloseButton && !list.some(x => x.matches('[data-krds-close]')))
+    throw new TypeError('Modal needs an explicit close action'); let target: HTMLElement = entry.dialog; if (p.initialFocusId) {
+    const found = doc.getElementById(p.initialFocusId);
+    if (found !== entry.dialog && found !== list[0])
+        throw new RangeError('Initial focus must target dialog or first interactive element');
+    if (!usable(found))
+        throw new RangeError('Initial focus target unavailable');
+    target = found;
+} target.focus(); }
+watch(actual, (open) => { if (!started)
+    return; if (open)
+    void activate();
+else
+    cleanup(); }, { flush: 'post' });
+onMounted(() => {
+  started = true;
+  doc = context.document();
+  doc?.addEventListener('click', rememberActivation, true);
+  if (actual.value) void activate(false);
+});
+onUnmounted(() => {
+  doc?.removeEventListener('click', rememberActivation, true);
+  if (activationTimer !== undefined) clearTimeout(activationTimer);
+  cleanup();
+});
+let pointer = false;
+function down(e: PointerEvent) { pointer = e.target === e.currentTarget && e.button === 0 && e.isPrimary; }
+function up(e: PointerEvent) { const dismiss = pointer && e.target === e.currentTarget && e.button === 0 && e.isPrimary; pointer = false; if (dismiss && p.closeOnOutsideClick)
+    request(false); }
+defineExpose({ open: () => request(true), close: () => request(false) });
+</script>
+<template>
+<slot name="trigger" :open="()=>request(true)" :is-open="actual" />
+<Teleport v-if="actual" :to="context.document()?.body??'body'">
+<div ref="portal" data-krds-component="modal" data-krds-part="root" data-krds-state="open" :dir="context.direction.value">
+<div data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" @pointerdown="down" @pointerup="up">
+<section :id="id" ref="dialog" role="dialog" aria-modal="true" tabindex="-1" data-krds-component="modal" data-krds-part="content" data-krds-state="open" :aria-labelledby="titleId??`${id}-title`" :aria-describedby="description||$slots.description?descriptionId??`${id}-description`:undefined">
+<h2 :id="titleId??`${id}-title`" data-krds-component="modal" data-krds-part="title">
+<slot name="title">{{title}}</slot>
+</h2>
+<div v-if="description||$slots.description" :id="descriptionId??`${id}-description`" data-krds-component="modal" data-krds-part="description">
+<slot name="description">{{description}}</slot>
+</div>
+<div data-krds-component="modal" data-krds-part="body">
+<slot :close="()=>request(false)" />
+</div>
+<div v-if="$slots.actions" data-krds-component="modal" data-krds-part="actions">
+<slot name="actions" :close="()=>request(false)" />
+</div>
+<button v-if="showCloseButton" type="button" data-krds-component="modal" data-krds-part="close" :aria-label="closeLabel??(context.locale.value==='en-US'?'Close':'닫기')" @click="request(false)">{{closeLabel??(context.locale.value==='en-US'?'Close':'닫기')}}</button>
+</section>
+</div>
+</div>
+</Teleport>
+</template>
```

## packages/vue/src/components/modal/stack.ts

```diff
--- pre-native/packages/vue/src/components/modal/stack.ts
+++ packages/vue/src/components/modal/stack.ts
@@ -0,0 +1,79 @@
+export interface ModalEntry {
+  portal: HTMLElement;
+  dialog: HTMLElement;
+}
+interface Isolation {
+  overflow: string;
+  elements: Map<HTMLElement, boolean>;
+  observer: MutationObserver;
+}
+const stacks = new WeakMap<Document, ModalEntry[]>();
+const originals = new WeakMap<Document, Isolation>();
+
+export function usable(element: Element | null | undefined): element is HTMLElement {
+  if (!(element instanceof HTMLElement) || !element.isConnected) return false;
+  if (element.closest('[inert],[hidden]') || element.matches(':disabled')) return false;
+  return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
+}
+export function canFocus(element: Element | null | undefined): element is HTMLElement {
+  return usable(element) && element.matches('button,input,select,textarea,a[href],[tabindex],[contenteditable="true"]');
+}
+export function focusables(root: HTMLElement) {
+  return Array.from(root.querySelectorAll<HTMLElement>('button,input,select,textarea,a[href],[tabindex],[contenteditable="true"]'))
+    .filter(element => canFocus(element) && element.tabIndex >= 0);
+}
+export function top(doc: Document, entry: ModalEntry) {
+  return stacks.get(doc)?.at(-1) === entry;
+}
+function isolate(doc: Document) {
+  const state = originals.get(doc);
+  if (!state) return;
+  const active = stacks.get(doc)?.at(-1);
+  for (const child of Array.from(doc.body.children)) {
+    if (!(child instanceof HTMLElement)) continue;
+    if (!state.elements.has(child)) state.elements.set(child, child.inert);
+    child.inert = child !== active?.portal;
+  }
+}
+export function enter(doc: Document, entry: ModalEntry) {
+  if (!originals.has(doc)) {
+    const observer = new MutationObserver(() => isolate(doc));
+    originals.set(doc, { overflow: doc.body.style.overflow, elements: new Map(), observer });
+    observer.observe(doc.body, { childList: true });
+    doc.body.style.overflow = 'hidden';
+  }
+  const stack = stacks.get(doc) ?? [];
+  stack.push(entry);
+  stacks.set(doc, stack);
+  isolate(doc);
+}
+export function leave(doc: Document, entry: ModalEntry) {
+  stacks.set(doc, (stacks.get(doc) ?? []).filter(item => item !== entry));
+  if (stacks.get(doc)?.length) {
+    isolate(doc);
+    return;
+  }
+  const state = originals.get(doc);
+  if (!state) return;
+  state.observer.disconnect();
+  for (const [element, inert] of state.elements) element.inert = inert;
+  doc.body.style.overflow = state.overflow;
+  originals.delete(doc);
+}
+export function restore(doc: Document, opener: HTMLElement | null, alternate?: string, ancestors: HTMLElement[] = []) {
+  let target = canFocus(opener) ? opener : null;
+  if (!target && alternate) {
+    const candidate = doc.getElementById(alternate);
+    if (canFocus(candidate)) target = candidate;
+  }
+  if (!target) target = ancestors.find(canFocus) ?? null;
+  if (target) {
+    target.focus();
+    return;
+  }
+  const tabindex = doc.body.getAttribute('tabindex');
+  doc.body.tabIndex = -1;
+  doc.body.focus();
+  if (tabindex === null) doc.body.removeAttribute('tabindex');
+  else doc.body.setAttribute('tabindex', tabindex);
+}
```

## packages/vue/src/components/native-select/NativeSelect.vue

```diff
--- pre-native/packages/vue/src/components/native-select/NativeSelect.vue
+++ packages/vue/src/components/native-select/NativeSelect.vue
@@ -0,0 +1,76 @@
+<script setup lang="ts">
+import { useKrds } from '../context';
+const context = useKrds();
+import { controlContract, oneOf } from '../control';
+import { computed, nextTick, onMounted, onUnmounted, ref, useAttrs, useSlots, useId, watchEffect } from 'vue';
+import type { SelectOption } from '../types';
+defineOptions({ inheritAttrs: false });
+const p = withDefaults(defineProps<{
+    options: SelectOption[];
+    value?: string;
+    modelValue?: string;
+    defaultValue?: string;
+    id?: string;
+    name?: string;
+    form?: string;
+    label?: string;
+    hint?: string;
+    error?: string;
+    required?: boolean;
+    disabled?: boolean;
+    invalid?: boolean;
+    size?: 'small' | 'medium' | 'large';
+}>(), { required: false, disabled: false, invalid: false, size: 'medium' });
+controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
+const attrs = useAttrs(); const slots = useSlots();
+if (!p.label && !slots.label && !attrs['aria-label'] && !attrs['aria-labelledby']) throw new TypeError('Select needs a label.');
+const emit = defineEmits<{
+    'update:modelValue': [
+        value: string
+    ];
+    valueChange: [
+        detail: {
+            value: string;
+        }
+    ];
+}>();
+const id = p.id ?? useId();
+const control = ref<HTMLSelectElement>();
+const initial = p.defaultValue ?? p.options.find(x => !x.disabled)?.value ?? '';
+const local = ref(initial);
+const controlled = computed(() => p.modelValue !== undefined || p.value !== undefined);
+const value = computed(() => p.modelValue ?? p.value ?? local.value);
+function sync() { if (control.value)
+    control.value.value = value.value; }
+watchEffect(() => { if ([p.value,p.modelValue,p.defaultValue].some(value => value !== undefined && typeof value !== 'string')) throw new TypeError('Select values must be strings'); oneOf(p.size, ['small','medium','large'], 'select size'); if (p.options.some(option => typeof option.value !== 'string' || typeof option.label !== 'string')) throw new TypeError('String option values and labels required'); if (new Set(p.options.map(x => x.value)).size !== p.options.length)
+    throw new TypeError('Option values must be unique'); if (value.value !== '' && !p.options.some(x => x.value === value.value))
+    throw new RangeError('Unknown select value'); void nextTick(sync); });
+function change(e: Event) { const next = (e.target as HTMLSelectElement).value; if (next !== value.value) {
+    if (!controlled.value)
+        local.value = next;
+    emit('update:modelValue', next);
+    emit('valueChange', { value: next });
+} void nextTick(sync); }
+function reset(e: Event) { queueMicrotask(() => { if (e.defaultPrevented)
+    return; if (!controlled.value)
+    local.value = initial; sync(); }); }
+let form: HTMLFormElement | null = null;
+onMounted(() => { sync(); form = control.value?.form ?? null; form?.addEventListener('reset', reset); });
+onUnmounted(() => form?.removeEventListener('reset', reset));
+</script>
+<template>
+<div data-krds-component="native-select" data-krds-part="root" :dir="context.direction.value" :data-krds-state="[disabled?'disabled':'',invalid?'invalid':''].filter(Boolean).join(' ')" :data-krds-size="size">
+<label v-if="label||$slots.label" :for="id" data-krds-component="native-select" data-krds-part="label">
+<slot name="label">{{label}}</slot>
+</label>
+<select v-bind="$attrs" :id="id" ref="control" data-krds-component="native-select" data-krds-part="control" :data-krds-size="size" :value="value" :name="name" :form="p.form" :required="required" :disabled="disabled" :aria-invalid="invalid||undefined" :aria-describedby="[hint||$slots.hint?`${id}-hint`:'',error||$slots.error?`${id}-error`:'',$attrs['aria-describedby']].filter(Boolean).join(' ')||undefined" @change="change">
+<option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled" :selected="option.value===value">{{option.label}}</option>
+</select>
+<div v-if="hint||$slots.hint" :id="`${id}-hint`" data-krds-component="native-select" data-krds-part="hint">
+<slot name="hint">{{hint}}</slot>
+</div>
+<div v-if="error||$slots.error" :id="`${id}-error`" data-krds-component="native-select" data-krds-part="error">
+<slot name="error">{{error}}</slot>
+</div>
+</div>
+</template>
```

## packages/vue/src/components/tabs/Tabs.vue

```diff
--- pre-native/packages/vue/src/components/tabs/Tabs.vue
+++ packages/vue/src/components/tabs/Tabs.vue
@@ -0,0 +1,76 @@
+<script setup lang="ts">
+import { useKrds } from '../context';
+const context = useKrds();
+import { controlContract, oneOf } from '../control';
+import { computed, nextTick, ref, useAttrs, useId, watchEffect } from 'vue';
+import type { TabItem } from '../types';
+const p = withDefaults(defineProps<{
+    items: TabItem[];
+    value?: string;
+    modelValue?: string;
+    defaultValue?: string;
+    label?: string;
+    id?: string;
+    activationMode?: 'manual' | 'automatic';
+    orientation?: 'horizontal' | 'vertical';
+}>(), { activationMode: 'manual', orientation: 'horizontal' });
+controlContract(() => ({ value: p.value, modelValue: p.modelValue, defaultValue: p.defaultValue }));
+const attrs = useAttrs();
+if (!p.label && !attrs['aria-label'] && !attrs['aria-labelledby']) throw new TypeError('Tablist needs a label.');
+const emit = defineEmits<{
+    'update:modelValue': [
+        value: string
+    ];
+    valueChange: [
+        detail: {
+            value: string;
+        }
+    ];
+}>();
+const id = p.id ?? useId();
+const local = ref(p.defaultValue ?? p.items.find(x => !x.disabled)?.value ?? '');
+const value = computed(() => p.modelValue ?? p.value ?? local.value);
+const root = ref<HTMLElement>();
+const panels = ref<HTMLElement[]>([]);
+let focusRequest: string | null = null;
+watchEffect(() => { if ([p.value,p.modelValue,p.defaultValue].some(value => value !== undefined && typeof value !== 'string') || p.items.some(item => typeof item.value !== 'string')) throw new TypeError('Tab values must be strings'); oneOf(p.activationMode, ['manual','automatic'], 'activation mode'); oneOf(p.orientation, ['horizontal','vertical'], 'orientation'); if (new Set(p.items.map(x => x.value)).size !== p.items.length || p.items.some(x => !x.value))
+    throw new TypeError('Unique nonempty tab values required'); if (!p.items.some(x => x.value === value.value && !x.disabled) && !(value.value === '' && !p.items.some(x => !x.disabled)))
+    throw new RangeError('Invalid selected tab'); void nextTick(() => panels.value.forEach(panel => { panel.tabIndex = panel.firstElementChild?.matches('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]') ? -1 : 0; })); });
+const tabId = (index: number) => `${id}-tab-${index}`, panelId = (index: number) => `${id}-panel-${index}`;
+function select(v: string) { if (v === value.value)
+    return; if (p.value === undefined && p.modelValue === undefined)
+    local.value = v; emit('update:modelValue', v); emit('valueChange', { value: v }); }
+function focus(v: string) { if (p.activationMode === 'automatic' && v !== value.value) {
+    focusRequest = v;
+    select(v);
+} }
+function click(v: string) { if (focusRequest === v) {
+    focusRequest = null;
+    return;
+} select(v); }
+function pointer() { focusRequest = null; }
+function key(e: KeyboardEvent, index: number) { focusRequest = null; const enabled = p.items.map((x, i) => !x.disabled ? i : -1).filter(x => x >= 0); let next: number | undefined; if (e.key === 'Home')
+    next = enabled[0];
+else if (e.key === 'End')
+    next = enabled.at(-1);
+else {
+    const delta = e.key === (p.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown') ? 1 : e.key === (p.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp') ? -1 : 0;
+    if (delta)
+        next = enabled[(enabled.indexOf(index) + delta + enabled.length) % enabled.length];
+} if (next !== undefined) {
+    e.preventDefault();
+    root.value?.querySelector<HTMLElement>(`#${CSS.escape(tabId(next))}`)?.focus();
+} }
+</script>
+<template>
+<div ref="root" data-krds-component="tabs" data-krds-part="root" :dir="context.direction.value">
+<div role="tablist" data-krds-component="tabs" data-krds-part="list" :aria-label="label??($attrs['aria-label'] as string|undefined)" :aria-labelledby="$attrs['aria-labelledby'] as string|undefined" :aria-orientation="orientation">
+<button v-for="(item,index) in items" :id="tabId(index)" :key="item.value" type="button" role="tab" data-krds-component="tabs" data-krds-part="trigger" :data-krds-state="[value===item.value?'selected':'',item.disabled?'disabled':''].filter(Boolean).join(' ')" :disabled="item.disabled" :tabindex="item.disabled?-1:0" :aria-selected="value===item.value" :aria-controls="panelId(index)" @pointerdown="pointer" @focus="focus(item.value)" @click="click(item.value)" @keydown="key($event,index)">
+<slot name="label" :item="item">{{item.label}}</slot>
+</button>
+</div>
+<section v-for="(item,index) in items" :id="panelId(index)" :key="item.value" :ref="(el)=>{if(el)panels[index]=el as HTMLElement}" role="tabpanel" data-krds-component="tabs" data-krds-part="panel" :data-krds-state="value===item.value?'active':'inactive'" :aria-labelledby="tabId(index)" :hidden="value!==item.value" tabindex="0">
+<slot :name="item.value" :item="item" />
+</section>
+</div>
+</template>
```

## packages/vue/src/components/types.ts

```diff
--- pre-native/packages/vue/src/components/types.ts
+++ packages/vue/src/components/types.ts
@@ -0,0 +1,41 @@
+import type { DateRangeValue, SelectOption, ValueChangeDetails, OpenChangeDetails } from '@unofficial-krds/contracts';
+export type { DateRangeValue, SelectOption, ValueChangeDetails, OpenChangeDetails };
+export type DateValue = string | null | DateRangeValue;
+export type DateMode = 'single' | 'range';
+export interface TabItem {
+    value: string;
+    label: string;
+    disabled?: boolean;
+}
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
+    weekdays: string[];
+    weekdayLabels: string[];
+    months: string[];
+}
```

## packages/vue/src/index.ts

```diff
--- pre-native/packages/vue/src/index.ts
+++ packages/vue/src/index.ts
@@ -1,2 +1,8 @@
-/** T01 compiler probe only; no catalog coverage. */
-export { default as WorkspaceProbe } from './WorkspaceProbe.vue';
+export { default as Button } from './components/button/Button.vue';
+export { default as NativeSelect } from './components/native-select/NativeSelect.vue';
+export { default as Modal } from './components/modal/Modal.vue';
+export { default as Tabs } from './components/tabs/Tabs.vue';
+export { default as Calendar } from './components/calendar/Calendar.vue';
+export { default as DateInput } from './components/date-input/DateInput.vue';
+export { KrdsProvider } from './components/context';
+export type { DateValue, DateMode, DateRangeValue, SelectOption, TabItem, DateInputTranslations, CalendarTranslations, ValueChangeDetails, OpenChangeDetails } from './components/types';
```

## packages/vue/vite.config.ts

```diff
--- pre-native/packages/vue/vite.config.ts
+++ packages/vue/vite.config.ts
@@ -1,7 +1,7 @@
 import { defineConfig } from 'vite';
 import vue from '@vitejs/plugin-vue';
 import manifest from './package.json' with { type: 'json' };
 export default defineConfig({
   plugins: [vue()],
-  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js' }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
+  build: { outDir: 'dist', lib: { entry: { index: 'src/index.ts', button: 'src/components/button/Button.vue', 'native-select': 'src/components/native-select/NativeSelect.vue', modal: 'src/components/modal/Modal.vue', tabs: 'src/components/tabs/Tabs.vue', calendar: 'src/components/calendar/Calendar.vue', 'date-input': 'src/components/date-input/DateInput.vue' }, formats: ['es'], fileName: (_format, name) => `${name}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
 });
```
