# T06 controls exact uncommitted scoped changes

Baseline reviewed T05 foundation. Sharedintegration/providers/publicbarrel/fixture and othercomponents are distinctowners; fullT06acceptance later.

## packages/solid/src/components/button/index.tsx

```diff
--- base/packages/solid/src/components/button/index.tsx
+++ packages/solid/src/components/button/index.tsx
@@ -0,0 +1,35 @@
+import { children, createEffect, splitProps, type JSX } from 'solid-js';
+
+export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
+  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
+  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
+  /** Decorative content after the action label; excluded from the accessible name. */
+  icon?: JSX.Element;
+}
+
+/** Native button activation and form algorithms remain owned by the browser. */
+export function Button(props: ButtonProps): JSX.Element {
+  const [local, native] = splitProps(props, ['children', 'icon', 'variant', 'size', 'type', 'disabled']);
+  const content = children(() => local.children);
+  function validate() {
+    if (!['primary', 'secondary', 'tertiary', 'text', 'icon'].includes(local.variant ?? 'primary')) throw new TypeError('Invalid Button variant');
+    if (!['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(local.size ?? 'medium')) throw new TypeError('Invalid Button size');
+    if (!['button', 'submit', 'reset'].includes(local.type ?? 'button')) throw new TypeError('Invalid Button type');
+  }
+  validate();
+  let label!: HTMLSpanElement;
+  const root = <button {...native} type={local.type ?? 'button'} disabled={local.disabled}
+    data-krds-component="button" data-krds-part="root" data-krds-state={local.disabled ? 'disabled' : ''}
+    data-krds-variant={local.variant ?? 'primary'} data-krds-size={local.size ?? 'medium'}>
+    <span ref={element => { label = element; }} data-krds-component="button" data-krds-part="label" data-krds-state="">{content()}</span>
+    {local.icon != null && <span data-krds-component="button" data-krds-part="icon" data-krds-state="" aria-hidden="true">{local.icon}</span>}
+  </button>;
+  createEffect(() => {
+    validate();
+    content();
+    const visibleLabel = label.cloneNode(true) as HTMLSpanElement;
+    visibleLabel.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
+    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !visibleLabel.textContent?.trim()) throw new TypeError('Button requires an accessible action name');
+  });
+  return root;
+}
```

## apps/fixture-solid/tests/siheom/button.test.tsx

```diff
--- base/apps/fixture-solid/tests/siheom/button.test.tsx
+++ apps/fixture-solid/tests/siheom/button.test.tsx
@@ -1,10 +1,92 @@
-import { expect, test } from 'vitest';
+import { beforeEach, expect, test } from 'vitest';
+import { page, userEvent } from 'vitest/browser';
+import { createSignal, type Component, type JSX } from 'solid-js';
+import { render } from '@solidjs/testing-library';
 import { assertions, given, query, runSiheom } from '@siheom/solid';
+import * as Krds from '@krds-native/solid';
 import { FixtureApp } from '../../src/fixture-app';
 
-test('disabled button pilot is RED after native health and bridge succeed', async () => {
+type TestButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; icon?: JSX.Element };
+const Button = Reflect.get(Krds, 'Button') as Component<TestButtonProps>;
+beforeEach(() => expect(Button, 'public native Solid Button').toBeTypeOf('function'));
+
+test('canonical disabled button uses native disabled semantics', async () => {
   await runSiheom(given.render(() => <FixtureApp componentId="button" caseId="disabled" />), assertions.textContent(query.status('Fixture health'), 'ready'));
   expect(window.__KRDS_FIXTURE__?.framework).toBe('solid');
-  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
   await runSiheom(assertions.disabled(query.button('저장')));
 });
+
+test('default button never submits and pointer, Enter, Space activate exactly once', async () => {
+  let actions = 0;
+  let submissions = 0;
+  const view = render(() => <form onSubmit={e => { e.preventDefault(); submissions++; }}><Button onClick={() => actions++}>실행</Button></form>);
+  const button = view.getByRole('button', { name: '실행' }) as HTMLButtonElement;
+  expect(button.tagName).toBe('BUTTON');
+  expect(button.type).toBe('button');
+  await userEvent.click(page.getByRole('button', { name: '실행' }));
+  expect(actions).toBe(1);
+  await userEvent.keyboard('{Enter}');
+  expect(actions).toBe(2);
+  await userEvent.keyboard('[Space>]');
+  expect(actions).toBe(2);
+  await userEvent.keyboard('[/Space]');
+  expect(actions).toBe(3);
+  expect(submissions).toBe(0);
+});
+
+test('explicit submit supplies the submitter and reset uses the cancelable native algorithm', async () => {
+  const submissions: FormData[] = [];
+  let resets = 0;
+  let cancelReset = true;
+  const view = render(() => <form onSubmit={e => { e.preventDefault(); submissions.push(new FormData(e.currentTarget, e.submitter)); }} onReset={e => { resets++; if (cancelReset) e.preventDefault(); }}>
+    <input name="note" value="initial" />
+    <Button type="submit" name="action" value="save">제출</Button>
+    <Button type="reset">초기화</Button>
+  </form>);
+  const field = view.getByRole('textbox') as HTMLInputElement;
+  field.defaultValue = 'initial';
+  field.value = 'changed';
+  await userEvent.click(page.getByRole('button', { name: '제출' }));
+  expect(submissions).toHaveLength(1);
+  expect(submissions[0]!.get('action')).toBe('save');
+  await userEvent.click(page.getByRole('button', { name: '초기화' }));
+  expect(resets).toBe(1);
+  expect(field.value).toBe('changed');
+  cancelReset = false;
+  await userEvent.click(page.getByRole('button', { name: '초기화' }));
+  expect(resets).toBe(2);
+  expect(field.value).toBe('initial');
+});
+
+test('reactive disabled suppresses actions and form data while icon names stay accessible', () => {
+  let actions = 0;
+  const [disabled, setDisabled] = createSignal(false);
+  const view = render(() => <form onSubmit={event => event.preventDefault()}><Button type="submit" name="action" value="close" variant="icon" aria-label="닫기" disabled={disabled()} onClick={() => actions++}>×</Button></form>);
+  const button = view.getByRole('button', { name: '닫기' }) as HTMLButtonElement;
+  button.click();
+  expect(actions).toBe(1);
+  expect(new FormData(button.form!, button).get('action')).toBe('close');
+  setDisabled(true);
+  button.click();
+  expect(actions).toBe(1);
+  expect(button.disabled).toBe(true);
+  expect(new FormData(button.form!, button).has('action')).toBe(false);
+  expect(button.dataset.krdsState).toBe('disabled');
+  setDisabled(false);
+  expect(button.disabled).toBe(false);
+  expect(button.dataset.krdsState).toBe('');
+});
+
+test('invalid presentation options and missing accessible action names are configuration errors', () => {
+  expect(() => render(() => <Button variant="unknown">실행</Button>)).toThrow(TypeError);
+  expect(() => render(() => <Button size="unknown">실행</Button>)).toThrow(TypeError);
+  expect(() => render(() => <Button />)).toThrow(TypeError);
+});
+
+// A decorative glyph must never silently become the action's accessible name.
+test('decorative icons require an explicit accessible action name', () => {
+  expect(() => render(() => <Button icon={<span>×</span>} />)).toThrow(TypeError);
+  expect(() => render(() => <Button><span aria-hidden="true">×</span></Button>)).toThrow(TypeError);
+  const view = render(() => <Button aria-label="닫기" icon={<span>×</span>} />);
+  expect(view.getByRole('button', { name: '닫기' })).toBeVisible();
+});
```

## apps/storybook-solid/src/stories/button.stories.tsx

```diff
--- base/apps/storybook-solid/src/stories/button.stories.tsx
+++ apps/storybook-solid/src/stories/button.stories.tsx
@@ -0,0 +1,29 @@
+import type { Meta, StoryObj } from 'storybook-solidjs-vite';
+import { createSignal } from 'solid-js';
+import { Button } from '@krds-native/solid';
+
+const meta = {
+  id: 'krds-button',
+  title: 'KRDS/Button',
+  component: Button,
+  args: { children: '저장', variant: 'primary', size: 'medium' },
+} satisfies Meta<typeof Button>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+
+export const Default: Story = {};
+export const Disabled: Story = { args: { disabled: true } };
+export const Secondary: Story = { args: { variant: 'secondary' } };
+export const Tertiary: Story = { args: { variant: 'tertiary' } };
+export const Text: Story = { args: { variant: 'text', children: '자세히 보기' } };
+export const Icon: Story = { args: { variant: 'icon', 'aria-label': '닫기', children: <span aria-hidden="true">×</span> } };
+export const Loading: Story = {
+  args: { disabled: true, children: '저장 중' },
+  parameters: { docs: { description: { story: '요청을 소유한 화면이 진행 중인 작업의 버튼을 비활성화합니다.' } } },
+};
+export const LocalAction: Story = {
+  render: args => {
+    const [count, setCount] = createSignal(0);
+    return <div><Button {...args} onClick={() => setCount(value => value + 1)} /> <output aria-label="실행 횟수">{count()}</output></div>;
+  },
+};
```

## packages/solid/src/components/native-select/index.tsx

```diff
--- base/packages/solid/src/components/native-select/index.tsx
+++ packages/solid/src/components/native-select/index.tsx
@@ -0,0 +1,96 @@
+import { createEffect, createSignal, createUniqueId, For, onCleanup, onMount, Show, splitProps, type JSX } from 'solid-js';
+import type { SelectOption, ValueChangeDetails } from '@krds-native/contracts';
+
+export interface NativeSelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'value' | 'size' | 'multiple'> {
+  options: SelectOption[];
+  value?: string;
+  defaultValue?: string;
+  label?: JSX.Element;
+  hint?: JSX.Element;
+  error?: JSX.Element;
+  invalid?: boolean;
+  size?: 'small' | 'medium' | 'large';
+  onValueChange?: (details: ValueChangeDetails<string>) => void;
+}
+
+/** Platform single-select with authoritative Solid state and native form participation. */
+export function NativeSelect(props: NativeSelectProps): JSX.Element {
+  const [local, native] = splitProps(props, ['options', 'value', 'defaultValue', 'label', 'hint', 'error', 'invalid', 'size', 'id', 'disabled', 'onValueChange', 'onChange', 'ref', 'aria-describedby']);
+  const generatedId = `krds-select-${createUniqueId()}`;
+  const id = () => local.id ?? generatedId;
+  const controlled = local.value !== undefined;
+  if (controlled && local.defaultValue !== undefined) throw new TypeError('NativeSelect value and defaultValue are mutually exclusive');
+  const initialValue = controlled ? local.value! : local.defaultValue ?? local.options.find(option => !option.disabled)?.value ?? '';
+  const [uncontrolledValue, setUncontrolledValue] = createSignal(initialValue);
+  const value = () => controlled ? local.value! : uncontrolledValue();
+  const state = () => [local.disabled && 'disabled', local.invalid && 'invalid'].filter(Boolean).join(' ');
+  let control!: HTMLSelectElement;
+  let disposed = false;
+
+  function validate() {
+    if ((local.value !== undefined) !== controlled) throw new TypeError('NativeSelect cannot change controlled mode');
+    if (controlled && local.defaultValue !== undefined) throw new TypeError('NativeSelect value and defaultValue are mutually exclusive');
+    if (!['small', 'medium', 'large'].includes(local.size ?? 'medium')) throw new TypeError('Invalid NativeSelect size');
+    const values = new Set<string>();
+    for (const option of local.options) {
+      if (typeof option.value !== 'string' || typeof option.label !== 'string' || values.has(option.value)) throw new TypeError('NativeSelect options require unique string values and string labels');
+      values.add(option.value);
+    }
+    if (typeof value() !== 'string' || (value() !== '' && !values.has(value()))) throw new TypeError('NativeSelect value must exist in options');
+    if (local.label == null && !props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) throw new TypeError('NativeSelect requires an accessible name');
+  }
+  validate();
+
+  function restoreSelection() {
+    if (!control) return;
+    const selectedValue = value();
+    if (selectedValue === '' && !local.options.some(option => option.value === '')) control.selectedIndex = -1;
+    else control.value = selectedValue;
+  }
+
+  const handleChange: JSX.ChangeEventHandler<HTMLSelectElement, Event> = event => {
+    const next = event.currentTarget.value;
+    const option = local.options.find(option => option.value === next);
+    try {
+      if (!local.disabled && option && !option.disabled && next !== value()) {
+        if (!controlled) setUncontrolledValue(next);
+        local.onValueChange?.({ value: next });
+      }
+      const handler = local.onChange;
+      if (typeof handler === 'function') handler(event);
+      else if (handler) handler[0](handler[1], event);
+    } finally {
+      // A declined controlled request does not invalidate a Solid dependency.
+      restoreSelection();
+    }
+  };
+
+  const root = <div data-krds-component="native-select" data-krds-part="root" data-krds-state={state()}>
+    <Show when={local.label != null}><label for={id()} data-krds-component="native-select" data-krds-part="label" data-krds-state="">{local.label}</label></Show>
+    <select {...native} ref={element => { control = element; if (typeof local.ref === 'function') local.ref(element); }}
+      id={id()} disabled={local.disabled} aria-invalid={local.invalid ? 'true' : undefined}
+      aria-describedby={[local['aria-describedby'], local.hint != null && `${id()}-hint`, local.error != null && `${id()}-error`].filter(Boolean).join(' ') || undefined}
+      onChange={handleChange} data-krds-component="native-select" data-krds-part="control" data-krds-state={state()} data-krds-size={local.size ?? 'medium'}>
+      <For each={local.options}>{option => <option value={option.value} disabled={option.disabled}>{option.label}</option>}</For>
+    </select>
+    <Show when={local.hint != null}><div id={`${id()}-hint`} data-krds-component="native-select" data-krds-part="hint" data-krds-state="">{local.hint}</div></Show>
+    <Show when={local.error != null}><div id={`${id()}-error`} data-krds-component="native-select" data-krds-part="error" data-krds-state="">{local.error}</div></Show>
+  </div>;
+
+  createEffect(() => { validate(); restoreSelection(); });
+  onMount(() => {
+    const ownerDocument = control.ownerDocument;
+    const reset = (event: Event) => {
+      if (event.target !== control.form) return;
+      queueMicrotask(() => {
+        if (disposed || event.defaultPrevented || event.target !== control.form) return;
+        if (!controlled) setUncontrolledValue(initialValue);
+        restoreSelection();
+      });
+    };
+    ownerDocument.addEventListener('reset', reset, true);
+    onCleanup(() => { disposed = true; ownerDocument.removeEventListener('reset', reset, true); });
+    restoreSelection();
+  });
+  return root;
+}
```

## apps/fixture-solid/tests/siheom/native-select.test.tsx

```diff
--- base/apps/fixture-solid/tests/siheom/native-select.test.tsx
+++ apps/fixture-solid/tests/siheom/native-select.test.tsx
@@ -0,0 +1,145 @@
+import { beforeEach, expect, test } from 'vitest';
+import { createSignal, type Component, type JSX } from 'solid-js';
+import { fireEvent, render } from '@solidjs/testing-library';
+import { assertions, given, query, runSiheom } from '@siheom/solid';
+import * as Krds from '@krds-native/solid';
+import { FixtureApp } from '../../src/fixture-app';
+
+type Option = { value: string; label: string; disabled?: boolean };
+type TestSelectProps = Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'children'> & {
+  options: Option[]; label?: JSX.Element; hint?: JSX.Element; error?: JSX.Element; size?: string;
+  value?: string; defaultValue?: string; invalid?: boolean; onValueChange?: (details: { value: string }) => void;
+};
+const NativeSelect = Reflect.get(Krds, 'NativeSelect') as Component<TestSelectProps>;
+const options = [{ value: 'blocked', label: '선택 불가', disabled: true }, { value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
+function change(select: HTMLSelectElement, value: string) { select.value = value; fireEvent.change(select); }
+const settleReset = () => new Promise<void>(resolve => queueMicrotask(resolve));
+beforeEach(() => expect(NativeSelect, 'public native Solid NativeSelect').toBeTypeOf('function'));
+
+test.each(['controlled', 'form-reset'])('canonical native-select/%s exposes the real select', async caseId => {
+  await runSiheom(given.render(() => <FixtureApp componentId="native-select" caseId={caseId} />), assertions.textContent(query.status('Fixture health'), 'ready'));
+  await runSiheom(assertions.visible(query.combobox('지역')));
+});
+
+test('first enabled option initializes native FormData without a callback or submission', () => {
+  const changes: unknown[] = [];
+  let submits = 0;
+  const view = render(() => <form onSubmit={e => { e.preventDefault(); submits++; }}><NativeSelect options={options} label="지역" name="region" onValueChange={d => changes.push(d)} /></form>);
+  const select = view.getByRole('combobox', { name: '지역' }) as HTMLSelectElement;
+  expect(select.tagName).toBe('SELECT');
+  expect([...select.options].map(o => o.value)).toEqual(['blocked', 'seoul', 'busan']);
+  expect(select.options[0]!.disabled).toBe(true);
+  expect(select.value).toBe('seoul');
+  expect(new FormData(select.form!).get('region')).toBe('seoul');
+  expect(changes).toEqual([]);
+  change(select, 'busan');
+  expect(changes).toEqual([{ value: 'busan' }]);
+  expect(new FormData(select.form!).get('region')).toBe('busan');
+  fireEvent.change(select);
+  fireEvent.input(select);
+  expect(changes).toEqual([{ value: 'busan' }]);
+  expect(submits).toBe(0);
+});
+
+test('controlled requests restore a declined value even when its prop never changes', () => {
+  const changes: unknown[] = [];
+  const [value, setValue] = createSignal('seoul');
+  const [disabled, setDisabled] = createSignal(false);
+  const view = render(() => <form><NativeSelect options={options} label="지역" name="region" value={value()} disabled={disabled()} onValueChange={d => changes.push(d)} /></form>);
+  const select = view.getByRole('combobox') as HTMLSelectElement;
+  change(select, 'busan');
+  expect(changes).toEqual([{ value: 'busan' }]);
+  expect(select.value).toBe('seoul');
+  expect(new FormData(select.form!).get('region')).toBe('seoul');
+  change(select, 'busan');
+  expect(changes).toEqual([{ value: 'busan' }, { value: 'busan' }]);
+  setValue('busan');
+  expect(select.value).toBe('busan');
+  setDisabled(true);
+  setValue('blocked');
+  expect(select.value).toBe('blocked');
+  expect(select.disabled).toBe(true);
+  expect(new FormData(select.form!).has('region')).toBe(false);
+  change(select, 'seoul');
+  expect(select.value).toBe('blocked');
+  expect(changes).toHaveLength(2);
+});
+
+test('disabled option changes are ignored and required empty placeholder blocks form validity', () => {
+  const changes: unknown[] = [];
+  const view = render(() => <form><NativeSelect label="지역" options={[{ value: '', label: '지역 선택' }, ...options]} required name="region" onValueChange={d => changes.push(d)} /></form>);
+  const select = view.getByRole('combobox') as HTMLSelectElement;
+  expect(select.value).toBe('');
+  expect(select.validity.valueMissing).toBe(true);
+  expect(new FormData(select.form!).get('region')).toBe('');
+  change(select, 'blocked');
+  expect(select.value).toBe('');
+  expect(changes).toEqual([]);
+  change(select, 'busan');
+  expect(select.validity.valid).toBe(true);
+  expect(changes).toEqual([{ value: 'busan' }]);
+});
+
+test('hint and visible error remain associated with an explicitly identified label', () => {
+  const view = render(() => <NativeSelect id="region-control" label="지역" hint="거주 지역" error="지역을 선택하세요" invalid size="large" options={options} aria-describedby="external-help" />);
+  const select = view.getByRole('combobox', { name: '지역' }) as HTMLSelectElement;
+  expect(select.id).toBe('region-control');
+  expect(select.getAttribute('aria-invalid')).toBe('true');
+  const ids = select.getAttribute('aria-describedby')!.split(' ');
+  expect(ids).toContain('external-help');
+  expect(ids.map(id => document.getElementById(id)?.textContent)).toEqual(expect.arrayContaining(['거주 지역', '지역을 선택하세요']));
+  expect(select.dataset.krdsSize).toBe('large');
+  expect(select.closest('[data-krds-part="root"]')?.getAttribute('data-krds-state')).toBe('invalid');
+});
+
+test('reset restores captured uncontrolled default and honors cancellation without notifying', async () => {
+  const changes: unknown[] = [];
+  const [defaultValue, setDefaultValue] = createSignal('busan');
+  let canceled = true;
+  const view = render(() => <form onReset={e => { if (canceled) e.preventDefault(); }}><NativeSelect label="지역" name="region" options={options} defaultValue={defaultValue()} onValueChange={d => changes.push(d)} /></form>);
+  const select = view.getByRole('combobox') as HTMLSelectElement;
+  expect(select.value).toBe('busan');
+  setDefaultValue('seoul');
+  change(select, 'seoul');
+  select.form!.reset();
+  await settleReset();
+  expect(select.value).toBe('seoul');
+  canceled = false;
+  select.form!.reset();
+  await settleReset();
+  expect(select.value).toBe('busan');
+  expect(new FormData(select.form!).get('region')).toBe('busan');
+  expect(changes).toEqual([{ value: 'seoul' }]);
+});
+
+test('controlled reset reapplies the current prop and external form association works', async () => {
+  const changes: unknown[] = [];
+  const [value, setValue] = createSignal('seoul');
+  const view = render(() => <><form id="external-form" /><NativeSelect form="external-form" label="지역" name="region" options={options} value={value()} onValueChange={d => changes.push(d)} /></>);
+  const select = view.getByRole('combobox') as HTMLSelectElement;
+  setValue('busan');
+  select.form!.reset();
+  await settleReset();
+  expect(select.value).toBe('busan');
+  expect(new FormData(select.form!).get('region')).toBe('busan');
+  expect(changes).toEqual([]);
+});
+
+test('no enabled options preserve absent selection across reset with no successful value', async () => {
+  const view = render(() => <form><NativeSelect label="지역" name="region" options={[options[0]!]} /></form>);
+  const select = view.getByRole('combobox') as HTMLSelectElement;
+  expect(select.selectedIndex).toBe(-1);
+  expect(new FormData(select.form!).has('region')).toBe(false);
+  select.form!.reset();
+  await settleReset();
+  expect(select.selectedIndex).toBe(-1);
+  expect(new FormData(select.form!).has('region')).toBe(false);
+});
+
+test('invalid values, duplicate options, absent names and conflicting modes are configuration errors', () => {
+  expect(() => render(() => <NativeSelect label="지역" options={options} value="missing" />)).toThrow(TypeError);
+  expect(() => render(() => <NativeSelect label="지역" options={[options[1]!, options[1]!]} />)).toThrow(TypeError);
+  expect(() => render(() => <NativeSelect options={options} />)).toThrow(TypeError);
+  expect(() => render(() => <NativeSelect label="지역" options={options} size="huge" />)).toThrow(TypeError);
+  expect(() => render(() => <NativeSelect label="지역" options={options} value="seoul" defaultValue="busan" />)).toThrow(TypeError);
+});
```

## apps/storybook-solid/src/stories/native-select.stories.tsx

```diff
--- base/apps/storybook-solid/src/stories/native-select.stories.tsx
+++ apps/storybook-solid/src/stories/native-select.stories.tsx
@@ -0,0 +1,30 @@
+import type { Meta, StoryObj } from 'storybook-solidjs-vite';
+import { createSignal } from 'solid-js';
+import { NativeSelect } from '@krds-native/solid';
+
+const options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'unavailable', label: '선택할 수 없는 지역', disabled: true }];
+const meta = {
+  id: 'krds-native-select',
+  title: 'KRDS/NativeSelect',
+  component: NativeSelect,
+  args: { options, label: '지역', name: 'region', size: 'medium' },
+} satisfies Meta<typeof NativeSelect>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+
+export const Default: Story = { args: { defaultValue: 'seoul' } };
+export const Controlled: Story = {
+  args: { value: 'seoul' },
+  render: args => {
+    const [value, setValue] = createSignal(args.value ?? 'seoul');
+    return <NativeSelect {...args} value={value()} onValueChange={details => setValue(details.value)} />;
+  },
+};
+export const RejectedChange: Story = { args: { value: 'seoul', hint: '현재 지역은 서울로 고정되어 있습니다.' } };
+export const Selected: Story = { args: { defaultValue: 'busan' } };
+export const Disabled: Story = { args: { disabled: true, defaultValue: 'seoul' } };
+export const Invalid: Story = { args: { options: [{ value: '', label: '지역 선택' }, ...options], defaultValue: '', required: true, invalid: true, hint: '거주 중인 지역을 선택하세요.', error: '지역을 선택하세요.' } };
+export const FormReset: Story = {
+  args: { defaultValue: 'seoul' },
+  render: args => <form><NativeSelect {...args} /><button type="reset">초기화</button></form>,
+};
```
