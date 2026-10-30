# T06 integration lead exact frozen diff

Source scope supplied by implementer (26 paths, including deleted probe). Component families, date helpers, common observers and shared CSS receive separate clean scoped reviews. No commits. Actual final production/native/story/visual results belong to task-T06-lead-report.md.

## apps/fixture-solid/index.html

```diff
--- T05/apps/fixture-solid/index.html
+++ apps/fixture-solid/index.html
@@ -1,2 +1,2 @@
 <!doctype html>
-<html lang="en"><head><meta charset="utf-8"><title>T01 compiler probe</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
+<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>KRDS Solid native pilots</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>
```

## apps/fixture-solid/src/examples.tsx

```diff
--- T05/apps/fixture-solid/src/examples.tsx
+++ apps/fixture-solid/src/examples.tsx
@@ -0,0 +1,38 @@
+import { createSignal } from 'solid-js';
+import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@krds-native/solid';
+
+/** Compiled documentation examples use only the built public package. */
+export function ControlledRegionExample() {
+  const [region, setRegion] = createSignal('seoul');
+  return <NativeSelect label="지역" name="region" value={region()}
+    options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
+    onValueChange={({ value }) => setRegion(value)} />;
+}
+
+export function VisitDateExample() {
+  return <KrdsProvider locale="ko-KR"><form>
+    <DateInput label="방문일" name="visitDate" defaultValue="2024-02-29" referenceDate="2024-02-01" />
+    <Button type="submit">신청</Button><Button type="reset">초기화</Button>
+  </form></KrdsProvider>;
+}
+
+export function RangeCalendarExample() {
+  return <Calendar mode="range" label="방문 기간 선택" referenceDate="2024-02-15"
+    defaultValue={{ start: '2024-02-12', end: '2024-02-18' }} />;
+}
+
+export function ConfirmationExample() {
+  const [open, setOpen] = createSignal(false);
+  return <><Button onClick={() => setOpen(true)}>열기</Button>
+    <Modal title="확인" open={open()} onOpenChange={({ open }) => setOpen(open)}>
+      <p>입력한 정보를 확인하세요.</p>
+    </Modal>
+  </>;
+}
+
+export function SectionsExample() {
+  return <Tabs label="정보 구분" defaultValue="first" items={[
+    { value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> },
+    { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> },
+  ]} />;
+}
```

## apps/fixture-solid/src/fixture-app.tsx

```diff
--- T05/apps/fixture-solid/src/fixture-app.tsx
+++ apps/fixture-solid/src/fixture-app.tsx
@@ -1,28 +1,118 @@
-import { createSignal, onCleanup, onMount, Show } from 'solid-js';
-import { WorkspaceProbe } from '@krds-native/solid';
+import { createSignal, Match, onCleanup, onMount, Show, Switch } from 'solid-js';
+import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@krds-native/solid';
+import type { ButtonProps, NativeSelectProps } from '@krds-native/solid';
 import { createFixtureBridge } from '@krds-native/test-contracts/driver';
 
-/** Native test infrastructure. This is deliberately not a KRDS implementation. */
+/** Production native Solid fixture; bridge data stays outside the public adapter. */
 export function FixtureApp(props: { componentId: string; caseId: string }) {
-  const bridge = createFixtureBridge('solid', { count: 0, label: 'Probe increment', disabled: false });
+  const initialState = props.componentId === '__probe'
+    ? { count: 0, label: 'Probe increment', disabled: false }
+    : props.componentId === 'calendar' && props.caseId === 'selection-confirm'
+    ? { value: null, referenceDate: '2024-02-01', min: '2024-02-01', max: '2024-03-31', disabled: false, rejectChanges: false }
+    : ['date-input', 'calendar'].includes(props.componentId)
+    ? { value: props.caseId.includes('range') ? { start: '2024-02-12', end: '2024-02-18' } : props.componentId === 'calendar' ? '2024-02-29' : null,
+        referenceDate: '2024-02-15', today: '2024-02-15', disabled: props.caseId === 'disabled', invalid: props.caseId === 'invalid', rejectChanges: props.caseId === 'rejected' }
+    : { value: props.componentId === 'tabs' ? 'first' : 'seoul', label: '저장', disabled: props.componentId === 'button' && props.caseId === 'disabled', invalid: false, rejectChanges: props.caseId === 'rejected', open: false, triggerVisible: true };
+  const bridge = createFixtureBridge('solid', initialState);
   const [state, setState] = createSignal(bridge.getState());
   const [ready, setReady] = createSignal(false);
   const unsubscribe = bridge.subscribe(next => setState(next));
   onMount(() => setReady(true));
   onCleanup(() => { unsubscribe(); bridge.dispose(); });
   const increment = () => {
     const count = Number(state().count) + 1;
     void bridge.setState({ count });
     bridge.recordEvent('change', { value: count });
   };
+  const selectOptions = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
+  const selectChange = (detail: { value: string }) => {
+    bridge.recordEvent('valueChange', detail);
+    if (!state().rejectChanges) void bridge.setState({ value: detail.value });
+  };
+  const openChange = (detail: { open: boolean }) => {
+    bridge.recordEvent('openChange', detail);
+    if (!state().rejectChanges) void bridge.setState({ open: detail.open });
+  };
+  const dateChange = (detail: { value: string | null | { start: string | null; end: string | null } }) => {
+    bridge.recordEvent('valueChange', detail);
+    if (!state().rejectChanges) void bridge.setState({ value: detail.value });
+  };
+  const singleDate = () => typeof state().value === 'string' ? String(state().value) : null;
+  const rangeDate = () => state().value as { start: string | null; end: string | null };
+  const dateBound = (name: 'min' | 'max') => typeof state()[name] === 'string' ? String(state()[name]) : undefined;
   return (
-    <main>
+    <KrdsProvider locale="ko-KR"><main>
+      <h1>KRDS {props.componentId}</h1>
       <div role="status" aria-label="Fixture health">{ready() ? 'ready' : 'mounting'}</div>
-      <Show when={props.componentId === '__probe' && props.caseId === 'native-state'} fallback={<p role="note">Component not implemented: {props.componentId}/{props.caseId}</p>}>
+      <Switch fallback={<p role="note">Component not implemented: {props.componentId}/{props.caseId}</p>}>
+      <Match when={props.componentId === '__probe' && props.caseId === 'native-state'}>
         <button disabled={Boolean(state().disabled)} onClick={increment}>{String(state().label)}</button>
         <div role="status" aria-label="Probe value">{String(state().count)}</div>
-      </Show>
-      <div aria-hidden="true"><WorkspaceProbe /></div>
-    </main>
+      </Match>
+      <Match when={props.componentId === 'button'}>
+        <Button size={state().size as ButtonProps['size']} disabled={Boolean(state().disabled)} onClick={() => bridge.recordEvent('click', {})}>{String(state().label)}</Button>
+      </Match>
+      <Match when={props.componentId === 'native-select'}>
+        <form>
+          <Show when={props.caseId === 'form-reset'} fallback={
+            <NativeSelect id="solid-region" name="region" label="지역" options={selectOptions}
+              size={state().size as NativeSelectProps['size']} value={String(state().value)} onValueChange={selectChange} disabled={Boolean(state().disabled)}
+              invalid={Boolean(state().invalid)} hint="거주 지역을 선택하세요" error={state().invalid ? '지역을 확인하세요' : undefined} />
+          }>
+            <NativeSelect id="solid-region" name="region" label="지역" options={selectOptions}
+              size={state().size as NativeSelectProps['size']} defaultValue="seoul" onValueChange={selectChange} disabled={Boolean(state().disabled)} hint="거주 지역을 선택하세요" />
+          </Show>
+          <Button type="reset">초기화</Button>
+        </form>
+      </Match>
+      <Match when={props.componentId === 'modal'}>
+        <Show when={state().triggerVisible}><Button onClick={() => { if (!state().open) openChange({ open: true }); }}>열기</Button></Show>
+        <Button id="solid-next-task">다음 작업</Button>
+        <Modal id="solid-confirmation" title="확인" description="진행할 내용을 확인하세요" open={Boolean(state().open)}
+          onOpenChange={openChange} closeOnOutsideClick={Boolean(state().closeOnOutsideClick)} returnFocusId="solid-next-task" actions={<Button onClick={() => openChange({ open: false })}>확인</Button>}>
+          <Show when={props.caseId === 'nested-date'} fallback={<p>이 작업을 계속하시겠습니까?</p>}>
+            <DateInput label="날짜" defaultValue="2024-02-29" referenceDate="2024-02-15" />
+          </Show>
+        </Modal>
+      </Match>
+      <Match when={props.componentId === 'tabs'}>
+        <Tabs id="solid-sections" label="정보 구분" value={String(state().value)} onValueChange={selectChange}
+          activationMode={props.caseId === 'automatic' ? 'automatic' : 'manual'}
+          items={[
+            { value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> },
+            { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> },
+            { value: 'disabled', label: '사용 불가', content: <p>사용할 수 없는 내용</p>, disabled: true },
+          ]} />
+      </Match>
+      <Match when={props.componentId === 'date-input'}>
+        <form onSubmit={event => {
+          event.preventDefault();
+          bridge.recordEvent('submit', Object.fromEntries(new FormData(event.currentTarget)));
+        }}>
+          <Show when={props.caseId.includes('range')} fallback={
+            <DateInput id="solid-date" label="날짜" name="visit" value={singleDate()} onValueChange={dateChange}
+              disabled={Boolean(state().disabled)} invalid={Boolean(state().invalid)} error={state().invalid ? '날짜를 확인하세요' : undefined}
+              returnFocusId="solid-next-task" referenceDate={String(state().referenceDate)} today={String(state().today)} min={dateBound('min')} max={dateBound('max')} />
+          }>
+            <DateInput id="solid-date-range" mode="range" label="방문 기간" name="visit" value={rangeDate()} onValueChange={dateChange}
+              returnFocusId="solid-next-task" disabled={Boolean(state().disabled)} referenceDate={String(state().referenceDate)} today={String(state().today)} min={dateBound('min')} max={dateBound('max')} />
+          </Show>
+          <Button type="submit">제출</Button><Button type="reset">초기화</Button>
+        </form>
+        <Button id="solid-next-task">다음 작업</Button>
+      </Match>
+      <Match when={props.componentId === 'calendar'}>
+        <Show when={props.caseId.includes('range')} fallback={
+          <Calendar id="solid-calendar" label="날짜 선택" value={singleDate()} onValueChange={dateChange}
+            onConfirm={detail => { if (props.caseId !== 'selection-confirm') bridge.recordEvent('confirm', detail); }} onCancel={() => bridge.recordEvent('cancel', {})}
+            disabled={Boolean(state().disabled)} referenceDate={String(state().referenceDate)} today={typeof state().today === 'string' ? String(state().today) : undefined} min={dateBound('min')} max={dateBound('max')} />
+        }>
+          <Calendar id="solid-calendar-range" mode="range" label="기간 선택" value={rangeDate()} onValueChange={dateChange}
+            onConfirm={detail => bridge.recordEvent('confirm', detail)} onCancel={() => bridge.recordEvent('cancel', {})}
+            disabled={Boolean(state().disabled)} referenceDate={String(state().referenceDate)} today={String(state().today)} min={dateBound('min')} max={dateBound('max')} />
+        </Show>
+      </Match>
+      </Switch>
+    </main></KrdsProvider>
   );
 }
```

## apps/fixture-solid/src/fixture.css

```diff
--- T05/apps/fixture-solid/src/fixture.css
+++ apps/fixture-solid/src/fixture.css
@@ -0,0 +1,6 @@
+body { margin: 0; }
+main { max-width: 90rem; margin-inline: auto; padding: 3.2rem; }
+main > h1 { margin-block: 0 1.6rem; font-size: 2.4rem; }
+main > [aria-label="Fixture health"] { margin-block-end: 2.4rem; }
+main form { display: grid; gap: 2.4rem; }
+@media (max-width: 40rem) { main { padding: 1.6rem; } }
```

## apps/fixture-solid/src/main.tsx

```diff
--- T05/apps/fixture-solid/src/main.tsx
+++ apps/fixture-solid/src/main.tsx
@@ -1,9 +1,13 @@
 import { render } from 'solid-js/web';
 import { FixtureApp } from './fixture-app';
+import '@krds-native/styles/reset.css';
+import '@krds-native/styles/fonts.css';
+import '@krds-native/styles/all.css';
+import './fixture.css';
 
 const route = /^\/fixtures\/([^/]+)$/.exec(window.location.pathname);
 const componentId = route ? decodeURIComponent(route[1]) : 'unknown';
 const caseId = new URLSearchParams(window.location.search).get('case') ?? 'default';
 const dispose = render(() => <FixtureApp componentId={componentId} caseId={caseId} />, document.getElementById('app')!);
 if (import.meta.hot) import.meta.hot.dispose(dispose);
 window.addEventListener('pagehide', dispose, { once: true });
```

## apps/fixture-solid/vitest.config.ts

```diff
--- T05/apps/fixture-solid/vitest.config.ts
+++ apps/fixture-solid/vitest.config.ts
@@ -1,20 +1,21 @@
 import { defineConfig } from 'vitest/config';
 import { playwright } from '@vitest/browser-playwright';
 import solid from 'vite-plugin-solid';
 
 export default defineConfig({
   plugins: [solid()],
   test: {
     // Suppress vite-plugin-solid's automatic jsdom fallback; execution is real browser mode below.
     environment: 'node',
-    include: process.env.KRDS_TEST_MODE === 'probe' ? ['tests/siheom/native-probe.test.tsx'] : ['tests/siheom/button.test.tsx'],
+    include: process.env.KRDS_TEST_MODE === 'probe' ? ['tests/siheom/native-probe.test.tsx'] : ['tests/siheom/*.test.tsx'],
+    exclude: process.env.KRDS_TEST_MODE === 'probe' ? [] : ['tests/siheom/native-probe.test.tsx'],
     setupFiles: ['tests/setup.ts'],
     passWithNoTests: false,
     browser: {
       enabled: true,
       provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }),
       headless: true,
       screenshotDirectory: `test-results/siheom-${process.pid}`,
       viewport: { width: 1280, height: 800 },
       instances: [{ browser: 'chromium' }],
     },
```

## apps/storybook-solid/.storybook/preview-head.html

```diff
--- T05/apps/storybook-solid/.storybook/preview-head.html
+++ apps/storybook-solid/.storybook/preview-head.html
@@ -0,0 +1 @@
+<script>document.documentElement.lang = 'ko';</script>
```

## apps/storybook-solid/.storybook/preview.ts

```diff
--- T05/apps/storybook-solid/.storybook/preview.ts
+++ apps/storybook-solid/.storybook/preview.ts
@@ -1,5 +1,8 @@
 import type { Preview } from 'storybook-solidjs-vite';
+import '@krds-native/styles/reset.css';
+import '@krds-native/styles/fonts.css';
+import '@krds-native/styles/all.css';
 
 export default {
   parameters: { layout: 'centered' },
 } satisfies Preview;
```

## apps/storybook-solid/src/main.tsx

```diff
--- T05/apps/storybook-solid/src/main.tsx
+++ apps/storybook-solid/src/main.tsx
@@ -1,4 +1,2 @@
-/** T01 toolchain probe only; no component coverage. */
 import { render } from 'solid-js/web';
-import { WorkspaceProbe } from '@krds-native/solid';
-render(() => <WorkspaceProbe />, document.getElementById('app')!);
+render(() => <p>Open the native Solid component stories.</p>, document.getElementById('app')!);
```

## apps/storybook-solid/src/vite-env.d.ts

```diff
--- T05/apps/storybook-solid/src/vite-env.d.ts
+++ apps/storybook-solid/src/vite-env.d.ts
@@ -0,0 +1 @@
+/// <reference types="vite/client" />
```

## catalog/coverage.json

```diff
--- T05/catalog/coverage.json
+++ catalog/coverage.json
@@ -686,21 +686,21 @@
     {
       "componentId": "critical-alert",
       "framework": "solid-next",
       "status": "planned",
       "specPath": "specs/components/critical-alert.md",
       "evidencePaths": []
     },
     {
       "componentId": "calendar",
       "framework": "solid",
-      "status": "planned",
+      "status": "in-progress",
       "specPath": "specs/components/calendar.md",
       "evidencePaths": []
     },
     {
       "componentId": "calendar",
       "framework": "react",
       "status": "planned",
       "specPath": "specs/components/calendar.md",
       "evidencePaths": []
     },
@@ -798,21 +798,21 @@
     {
       "componentId": "disclosure",
       "framework": "solid-next",
       "status": "planned",
       "specPath": "specs/components/disclosure.md",
       "evidencePaths": []
     },
     {
       "componentId": "modal",
       "framework": "solid",
-      "status": "planned",
+      "status": "in-progress",
       "specPath": "specs/components/modal.md",
       "evidencePaths": []
     },
     {
       "componentId": "modal",
       "framework": "react",
       "status": "planned",
       "specPath": "specs/components/modal.md",
       "evidencePaths": []
     },
@@ -1078,21 +1078,21 @@
     {
       "componentId": "carousel",
       "framework": "solid-next",
       "status": "planned",
       "specPath": "specs/components/carousel.md",
       "evidencePaths": []
     },
     {
       "componentId": "tabs",
       "framework": "solid",
-      "status": "planned",
+      "status": "in-progress",
       "specPath": "specs/components/tabs.md",
       "evidencePaths": []
     },
     {
       "componentId": "tabs",
       "framework": "react",
       "status": "planned",
       "specPath": "specs/components/tabs.md",
       "evidencePaths": []
     },
@@ -1358,21 +1358,21 @@
     {
       "componentId": "link",
       "framework": "solid-next",
       "status": "planned",
       "specPath": "specs/components/link.md",
       "evidencePaths": []
     },
     {
       "componentId": "button",
       "framework": "solid",
-      "status": "planned",
+      "status": "in-progress",
       "specPath": "specs/components/button.md",
       "evidencePaths": []
     },
     {
       "componentId": "button",
       "framework": "react",
       "status": "planned",
       "specPath": "specs/components/button.md",
       "evidencePaths": []
     },
@@ -1582,21 +1582,21 @@
     {
       "componentId": "checkbox",
       "framework": "solid-next",
       "status": "planned",
       "specPath": "specs/components/checkbox.md",
       "evidencePaths": []
     },
     {
       "componentId": "native-select",
       "framework": "solid",
-      "status": "planned",
+      "status": "in-progress",
       "specPath": "specs/components/native-select.md",
       "evidencePaths": []
     },
     {
       "componentId": "native-select",
       "framework": "react",
       "status": "planned",
       "specPath": "specs/components/native-select.md",
       "evidencePaths": []
     },
@@ -2198,21 +2198,21 @@
     {
       "componentId": "tts",
       "framework": "solid-next",
       "status": "planned",
       "specPath": "specs/components/tts.md",
       "evidencePaths": []
     },
     {
       "componentId": "date-input",
       "framework": "solid",
-      "status": "planned",
+      "status": "in-progress",
       "specPath": "specs/components/date-input.md",
       "evidencePaths": []
     },
     {
       "componentId": "date-input",
       "framework": "react",
       "status": "planned",
       "specPath": "specs/components/date-input.md",
       "evidencePaths": []
     },
```

## catalog/fixture-cases.json

```diff
--- T05/catalog/fixture-cases.json
+++ catalog/fixture-cases.json
@@ -106,13 +106,33 @@
       "componentId": "date-input",
       "caseId": "timezone-invariance",
       "description": "semantic date remains unchanged in Pacific/Kiritimati and America/Los_Angeles without unsolicited events",
       "status": "required-unimplemented",
       "environment": {
         "locale": "ko-KR",
         "direction": "ltr",
         "colorMode": "light",
         "nowIso": "2024-02-29T12:00:00.000Z"
       }
+    },
+    {
+      "componentId": "calendar",
+      "caseId": "selection-confirm",
+      "description": "standalone tentative date selection emits only after Confirm",
+      "status": "required",
+      "state": {
+        "mode": "single",
+        "value": null,
+        "referenceDate": "2024-02-01",
+        "min": "2024-02-01",
+        "max": "2024-03-31",
+        "locale": "ko-KR"
+      },
+      "environment": {
+        "locale": "ko-KR",
+        "direction": "ltr",
+        "colorMode": "light",
+        "nowIso": "2024-02-29T12:00:00.000Z"
+      }
     }
   ]
 }
```

## catalog/story-cases.json

```diff
--- T05/catalog/story-cases.json
+++ catalog/story-cases.json
@@ -186,32 +186,66 @@
         {
           "role": "tab",
           "name": "첫 번째"
         }
       ]
     },
     {
       "id": "krds-date-input--invalid",
       "componentId": "date-input",
       "state": {
-        "value": "2023-02-29",
-        "invalid": true
+        "value": null,
+        "invalid": true,
+        "errorMessage": "YYYY-MM-DD 형식의 올바른 날짜를 입력하세요"
       },
       "environment": {
         "locale": "ko-KR",
         "direction": "ltr",
         "colorMode": "light",
         "nowIso": "2024-02-29T12:00:00.000Z",
         "viewport": {
           "width": 1280,
           "height": 800
         }
       },
       "expected": [
         {
           "role": "textbox",
           "name": "날짜"
+        }
+      ]
+    },
+    {
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "state": {
+        "mode": "range",
+        "value": {
+          "start": "2024-02-12",
+          "end": "2024-02-18"
+        },
+        "referenceDate": "2024-02-15",
+        "today": "2024-02-15"
+      },
+      "environment": {
+        "locale": "ko-KR",
+        "direction": "ltr",
+        "colorMode": "light",
+        "nowIso": "2024-02-29T12:00:00.000Z",
+        "viewport": {
+          "width": 1280,
+          "height": 800
+        }
+      },
+      "expected": [
+        {
+          "role": "table",
+          "name": "2024년 2월"
+        },
+        {
+          "role": "button",
+          "name": "확인"
         }
       ]
     }
   ]
 }
```

## catalog/story-coverage.json

```diff
--- T05/catalog/story-coverage.json
+++ catalog/story-coverage.json
@@ -236,16 +236,65 @@
       "framework": "angular",
       "id": "krds-tabs--manual",
       "componentId": "tabs",
       "status": "planned",
       "evidencePaths": []
     },
     {
       "framework": "angular",
       "id": "krds-date-input--invalid",
       "componentId": "date-input",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "solid",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "react",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "svelte",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "vue",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "lit",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "qwik",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
+      "status": "planned",
+      "evidencePaths": []
+    },
+    {
+      "framework": "angular",
+      "id": "krds-calendar--selected-range",
+      "componentId": "calendar",
       "status": "planned",
       "evidencePaths": []
     }
   ],
   "probesExcluded": true
 }
```

## packages/solid/README.md

```diff
--- T05/packages/solid/README.md
+++ packages/solid/README.md
@@ -1,5 +1,60 @@
 # @krds-native/solid
 
-T01 workspace/compiler probe only. This entry is not a KRDS component and contributes no catalog coverage. Native implementation, independent consumer validation, and rights reconciliation remain pending.
+Native Solid 1 pilots: `Button`, `NativeSelect`, `Modal`, `Tabs`, `DateInput` and
+`Calendar`. These render through Solid and native HTML. Solid 2 RC has a separate package.
 
-Publishing authority and copyright holder are unconfirmed; do not publish.
+Import from `@krds-native/solid`, or from the individual `/button`, `/native-select`,
+`/modal`, `/tabs`, `/date-input`, `/calendar` and `/provider` entries. Public props use
+native Solid content and semantic plain-value callbacks; no Ark implementation types
+are part of this API.
+
+Styles are explicit imports. Choose individual component CSS or `all.css`:
+
+```tsx
+import '@krds-native/styles/reset.css';
+import '@krds-native/styles/fonts.css';
+import '@krds-native/styles/all.css';
+import { Button, DateInput, KrdsProvider } from '@krds-native/solid';
+
+function VisitDateExample() {
+  return <KrdsProvider locale="ko-KR"><form>
+    <DateInput label="방문일" name="visitDate" defaultValue="2024-02-29" referenceDate="2024-02-01" />
+    <Button type="submit">신청</Button><Button type="reset">초기화</Button>
+  </form></KrdsProvider>;
+}
+```
+
+`reset.css` opts into the KRDS root rem scale. `fonts.css` selects locally installed
+fonts and system fallbacks; it downloads no font. Component imports add no global CSS.
+`KrdsProvider` supplies reactive locale, direction and an optional owner document without
+wrapper DOM or mutation of the document language.
+
+Use `value`/`open` for controlled state and `defaultValue`/`defaultOpen` for uncontrolled
+state. They are mutually exclusive, and mode stays fixed after mount. A callback requests
+a change; a controlled parent may decline it, preserving the displayed committed value.
+Prop updates and form reset emit no semantic change events.
+
+```tsx
+import { createSignal } from 'solid-js';
+import { NativeSelect } from '@krds-native/solid';
+
+function ControlledRegionExample() {
+  const [region, setRegion] = createSignal('seoul');
+  return <NativeSelect label="지역" name="region" value={region()}
+    options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
+    onValueChange={({ value }) => setRegion(value)} />;
+}
+```
+
+Tabs default to manual activation and preserve sequential access to every enabled tab.
+Modal restores a usable opener before a configured fallback. DateInput uses strict
+date-only `YYYY-MM-DD` strings, separate text drafts, native form validation and tentative
+calendar selection. Calendar has no form value or implicit modal; Confirm commits its
+tentative selection. Range values are `{ start: string | null, end: string | null }`.
+
+The repository's `apps/fixture-solid/src/examples.tsx` compiles examples for all six public
+components. Component specifications live in `specs/components/`; the native fixture and
+Storybook demonstrate their local state without APIs or external assets. Pilot verification
+does not establish full catalog, screen-reader, release or independent-install acceptance.
+
+Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under the MIT grant in LICENSES/MIT.txt. KRDS and third-party materials retain their separate recorded terms. Publication is not authorized.
```

## packages/solid/package.json

```diff
--- T05/packages/solid/package.json
+++ packages/solid/package.json
@@ -1,52 +1,80 @@
 {
   "name": "@krds-native/solid",
   "version": "0.0.0",
   "type": "module",
   "scripts": {
-    "test": "node --test ../../tools/workspace-probe.test.mjs",
+    "test": "vitest run --config vitest.config.ts",
     "lint": "node ../../tools/check-workspace.mjs",
     "prepublishOnly": "node ../../tools/block-publish.mjs",
     "build:local": "vite build && tsc -p tsconfig.json --emitDeclarationOnly",
-    "typecheck": "tsc -p tsconfig.json --noEmit"
+    "typecheck": "tsc -p tsconfig.json --noEmit && tsc -p tsconfig.test.json --noEmit"
   },
   "devDependencies": {
     "@babel/core": "7.28.5",
     "@types/node": "24.13.3",
     "@vitest/browser-playwright": "4.1.10",
     "babel-preset-solid": "1.9.16",
     "playwright": "1.64.1",
     "solid-js": "1.9.18",
     "typescript": "6.0.2",
     "vite": "8.3.5",
     "vite-plugin-solid": "2.11.14",
     "vitest": "4.1.10"
   },
-  "description": "KRDS Native solid: T01 toolchain probe only",
+  "description": "Native Solid 1 KRDS pilot components",
   "license": "SEE LICENSE IN LICENSE.md",
   "files": [
     "dist",
     "README.md",
     "LICENSE.md",
     "LICENSES",
     "ATTRIBUTION.md",
     "THIRD-PARTY-NOTICES.md",
     "provenance.json"
   ],
   "sideEffects": false,
   "main": "./dist/index.js",
   "module": "./dist/index.js",
   "types": "./dist/index.d.ts",
   "exports": {
     ".": {
       "types": "./dist/index.d.ts",
       "import": "./dist/index.js"
+    },
+    "./provider": {
+      "types": "./dist/providers/index.d.ts",
+      "import": "./dist/provider.js"
+    },
+    "./button": {
+      "types": "./dist/components/button/index.d.ts",
+      "import": "./dist/button.js"
+    },
+    "./native-select": {
+      "types": "./dist/components/native-select/index.d.ts",
+      "import": "./dist/native-select.js"
+    },
+    "./modal": {
+      "types": "./dist/components/modal/index.d.ts",
+      "import": "./dist/modal.js"
+    },
+    "./tabs": {
+      "types": "./dist/components/tabs/index.d.ts",
+      "import": "./dist/tabs.js"
+    },
+    "./date-input": {
+      "types": "./dist/components/date-input/index.d.ts",
+      "import": "./dist/date-input.js"
+    },
+    "./calendar": {
+      "types": "./dist/components/calendar/index.d.ts",
+      "import": "./dist/calendar.js"
     }
   },
   "peerDependencies": {
     "solid-js": "^1.9.18"
   },
   "dependencies": {
     "@ark-ui/solid": "5.40.0",
     "@krds-native/contracts": "workspace:^",
     "@krds-native/styles": "workspace:^",
     "@krds-native/tokens": "workspace:^"
```

## packages/solid/src/WorkspaceProbe.tsx

```diff
--- T05/packages/solid/src/WorkspaceProbe.tsx
+++ packages/solid/src/WorkspaceProbe.tsx
@@ -1,2 +0,0 @@
-/** T01 compiler probe only; no catalog coverage. */
-export function WorkspaceProbe() { return <span data-workspace-probe="solid">T01 compiler probe</span>; }
```

## packages/solid/src/index.ts

```diff
--- T05/packages/solid/src/index.ts
+++ packages/solid/src/index.ts
@@ -1,2 +1,15 @@
-/** T01 compiler probe only; no catalog coverage. */
-export { WorkspaceProbe } from './WorkspaceProbe';
+/** Native Solid 1 KRDS components. Styles are explicit, separate imports. */
+export { KrdsProvider, useKrdsEnvironment } from './providers';
+export type { KrdsProviderProps, KrdsEnvironment, KrdsLocale } from './providers';
+export { Button } from './components/button';
+export type { ButtonProps } from './components/button';
+export { NativeSelect } from './components/native-select';
+export type { NativeSelectProps } from './components/native-select';
+export { Modal } from './components/modal';
+export type { ModalProps } from './components/modal';
+export { Tabs } from './components/tabs';
+export type { TabsProps, TabItem } from './components/tabs';
+export { DateInput } from './components/date-input';
+export type { DateInputProps, DateInputTranslations } from './components/date-input';
+export { Calendar } from './components/calendar';
+export type { CalendarProps, CalendarTranslations } from './components/calendar';
```

## packages/solid/src/providers/index.ts

```diff
--- T05/packages/solid/src/providers/index.ts
+++ packages/solid/src/providers/index.ts
@@ -0,0 +1,2 @@
+export { KrdsProvider, useKrdsEnvironment } from './krds-provider';
+export type { KrdsProviderProps, KrdsEnvironment, KrdsLocale } from './krds-provider';
```

## packages/solid/src/providers/krds-provider.tsx

```diff
--- T05/packages/solid/src/providers/krds-provider.tsx
+++ packages/solid/src/providers/krds-provider.tsx
@@ -0,0 +1,40 @@
+import { createContext, useContext, type Accessor, type JSX } from 'solid-js';
+
+export type KrdsLocale = 'ko-KR' | 'en-US';
+export interface KrdsProviderProps {
+  locale?: KrdsLocale;
+  direction?: 'ltr' | 'rtl';
+  /** Optional document used by native portal and focus operations. */
+  ownerDocument?: Document;
+  children: JSX.Element;
+}
+
+export interface KrdsEnvironment {
+  locale: Accessor<KrdsLocale>;
+  direction: Accessor<'ltr' | 'rtl'>;
+  /** Resolved lazily: importing this package never reads browser globals. */
+  getDocument: () => Document | undefined;
+}
+
+const defaultEnvironment: KrdsEnvironment = {
+  locale: () => 'ko-KR',
+  direction: () => 'ltr',
+  getDocument: () => typeof document === 'undefined' ? undefined : document,
+};
+const KrdsContext = createContext<KrdsEnvironment>(defaultEnvironment);
+
+/** Native Solid context; adds no wrapper DOM, CSS, fonts or global mutation. */
+export function KrdsProvider(props: KrdsProviderProps) {
+  const inherited = useContext(KrdsContext);
+  const environment: KrdsEnvironment = {
+    locale: () => props.locale ?? inherited.locale(),
+    direction: () => props.direction ?? inherited.direction(),
+    getDocument: () => props.ownerDocument ?? inherited.getDocument(),
+  };
+  return <KrdsContext.Provider value={environment}>{props.children}</KrdsContext.Provider>;
+}
+
+/** Component locale props take precedence over this context's locale. */
+export function useKrdsEnvironment(): KrdsEnvironment {
+  return useContext(KrdsContext);
+}
```

## packages/solid/tests/provider.test.tsx

```diff
--- T05/packages/solid/tests/provider.test.tsx
+++ packages/solid/tests/provider.test.tsx
@@ -0,0 +1,40 @@
+import { expect, test } from 'vitest';
+import { createSignal } from 'solid-js';
+import { render } from 'solid-js/web';
+import { KrdsProvider, useKrdsEnvironment } from '../src/providers';
+
+test('native context inherits reactively without wrapper DOM or document mutation', async () => {
+  const host = document.createElement('div');
+  document.body.append(host);
+  const originalLanguage = document.documentElement.lang;
+  const [locale, setLocale] = createSignal<'ko-KR' | 'en-US'>('en-US');
+  let environment: ReturnType<typeof useKrdsEnvironment> | undefined;
+  function Consumer() {
+    environment = useKrdsEnvironment();
+    return <span>{environment.locale()}:{environment.direction()}</span>;
+  }
+  const dispose = render(() => <KrdsProvider locale={locale()} direction="rtl"><KrdsProvider><Consumer /></KrdsProvider></KrdsProvider>, host);
+  try {
+    expect(host.innerHTML).toBe('<span>en-US:rtl</span>');
+    expect(environment!.getDocument()).toBe(document);
+    setLocale('ko-KR');
+    expect(host.textContent).toBe('ko-KR:rtl');
+    expect(document.documentElement.lang).toBe(originalLanguage);
+  } finally { dispose(); host.remove(); }
+});
+
+test('native provider resolves an explicit owner document and optional defaults', () => {
+  const host = document.createElement('div');
+  const otherDocument = document.implementation.createHTMLDocument('secondary');
+  let selected: Document | undefined;
+  function Consumer() {
+    const environment = useKrdsEnvironment();
+    selected = environment.getDocument();
+    return <span>{environment.locale()}:{environment.direction()}</span>;
+  }
+  const dispose = render(() => <KrdsProvider ownerDocument={otherDocument}><Consumer /></KrdsProvider>, host);
+  try {
+    expect(selected).toBe(otherDocument);
+    expect(host.textContent).toBe('ko-KR:ltr');
+  } finally { dispose(); }
+});
```

## packages/solid/tsconfig.test.json

```diff
--- T05/packages/solid/tsconfig.test.json
+++ packages/solid/tsconfig.test.json
@@ -0,0 +1,10 @@
+{
+  "extends": "../../tsconfig.base.json",
+  "compilerOptions": {
+    "noEmit": true,
+    "jsx": "preserve",
+    "jsxImportSource": "solid-js",
+    "types": ["node"]
+  },
+  "include": ["tests/**/*.tsx", "vitest.config.ts"]
+}
```

## packages/solid/vite.config.ts

```diff
--- T05/packages/solid/vite.config.ts
+++ packages/solid/vite.config.ts
@@ -1,7 +1,14 @@
 import { defineConfig } from 'vite';
 import solid from 'vite-plugin-solid';
 import manifest from './package.json' with { type: 'json' };
+import { existsSync } from 'node:fs';
+const componentIds = ['button', 'native-select', 'modal', 'tabs', 'date-input', 'calendar'];
+const entries = Object.fromEntries(componentIds.flatMap(id => {
+  const entry = ['ts', 'tsx'].map(extension => `src/components/${id}/index.${extension}`)
+    .find(path => existsSync(new URL(path, import.meta.url)));
+  return entry ? [[id, entry]] : [];
+}));
 export default defineConfig({
   plugins: [solid()],
-  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js' }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
+  build: { outDir: 'dist', lib: { entry: { index: 'src/index.ts', provider: 'src/providers/index.ts', ...entries }, formats: ['es'], fileName: (_format, name) => `${name}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
 });
```

## packages/solid/vitest.config.ts

```diff
--- T05/packages/solid/vitest.config.ts
+++ packages/solid/vitest.config.ts
@@ -0,0 +1,18 @@
+import { defineConfig } from 'vitest/config';
+import { playwright } from '@vitest/browser-playwright';
+import solid from 'vite-plugin-solid';
+
+export default defineConfig({
+  plugins: [solid()],
+  test: {
+    environment: 'node',
+    include: ['tests/**/*.test.tsx'],
+    passWithNoTests: false,
+    browser: {
+      enabled: true,
+      headless: true,
+      provider: playwright(),
+      instances: [{ browser: 'chromium' }],
+    },
+  },
+});
```

## packages/test-contracts/src/fixtures/index.ts

```diff
--- T05/packages/test-contracts/src/fixtures/index.ts
+++ packages/test-contracts/src/fixtures/index.ts
@@ -3,12 +3,13 @@
 export const infrastructureStoryCases: readonly StoryStateCase[] = [
   {id:'infrastructure-native-probe--default',componentId:'__probe',state:{count:0,label:'Probe increment',disabled:false},environment:storyEnvironment,expected:[{role:'button',name:'Probe increment'},{role:'status',name:'Probe value',visibleText:'0'}]},
   {id:'infrastructure-native-probe--loading',componentId:'__probe',state:{loading:true,label:'Loading',disabled:true},environment:storyEnvironment,expected:[{role:'button',name:'Loading'}]},
   {id:'infrastructure-native-probe--error',componentId:'__probe',state:{errorMessage:'Local error'},environment:storyEnvironment,expected:[{role:'alert',visibleText:'Local error'}]},
 ];
 export const storyStateCases: readonly StoryStateCase[] = [
   {id:'krds-button--disabled',componentId:'button',state:{disabled:true,label:'저장'},environment:storyEnvironment,expected:[{role:'button',name:'저장'}]},
   {id:'krds-native-select--controlled',componentId:'native-select',state:{value:'seoul',options:[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]},environment:storyEnvironment,expected:[{role:'combobox',name:'지역'}]},
   {id:'krds-modal--open',componentId:'modal',state:{open:true,title:'확인'},environment:storyEnvironment,expected:[{role:'dialog',name:'확인'}]},
   {id:'krds-tabs--manual',componentId:'tabs',state:{value:'first',activationMode:'manual'},environment:storyEnvironment,expected:[{role:'tab',name:'첫 번째'}]},
-  {id:'krds-date-input--invalid',componentId:'date-input',state:{value:'2023-02-29',invalid:true},environment:storyEnvironment,expected:[{role:'textbox',name:'날짜'}]},
+  {id:'krds-date-input--invalid',componentId:'date-input',state:{value:null,invalid:true,errorMessage:'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요'},environment:storyEnvironment,expected:[{role:'textbox',name:'날짜'}]},
+  {id:'krds-calendar--selected-range',componentId:'calendar',state:{mode:'range',value:{start:'2024-02-12',end:'2024-02-18'},referenceDate:'2024-02-15',today:'2024-02-15'},environment:storyEnvironment,expected:[{role:'table',name:'2024년 2월'},{role:'button',name:'확인'}]},
 ];
```

## packages/test-contracts/src/scenarios/index.ts

```diff
--- T05/packages/test-contracts/src/scenarios/index.ts
+++ packages/test-contracts/src/scenarios/index.ts
@@ -38,12 +38,13 @@
   },
   {
     "componentId": "date-input",
     "caseId": "ime",
     "description": "composition preserves local Korean input"
   },
   {
     "componentId": "date-input",
     "caseId": "timezone-invariance",
     "description": "semantic date remains unchanged in Pacific/Kiritimati and America/Los_Angeles without unsolicited events"
-  }
+  },
+  { componentId: "calendar", caseId: "selection-confirm", description: "standalone tentative date selection emits only after Confirm" }
 ];
```
