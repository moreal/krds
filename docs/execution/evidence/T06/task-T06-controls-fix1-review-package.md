# T06 controls fix round 1 exact changes
Original review and implementer report remain binding. Compare these before-fix bytes to current frozen source. No commits.

## apps/fixture-solid/tests/siheom/native-select.test.tsx

```diff
--- before-fix/apps/fixture-solid/tests/siheom/native-select.test.tsx
+++ apps/fixture-solid/tests/siheom/native-select.test.tsx
@@ -136,10 +136,36 @@
   expect(new FormData(select.form!).has('region')).toBe(false);
 });
 
 test('invalid values, duplicate options, absent names and conflicting modes are configuration errors', () => {
   expect(() => render(() => <NativeSelect label="지역" options={options} value="missing" />)).toThrow(TypeError);
   expect(() => render(() => <NativeSelect label="지역" options={[options[1]!, options[1]!]} />)).toThrow(TypeError);
   expect(() => render(() => <NativeSelect options={options} />)).toThrow(TypeError);
   expect(() => render(() => <NativeSelect label="지역" options={options} size="huge" />)).toThrow(TypeError);
   expect(() => render(() => <NativeSelect label="지역" options={options} value="seoul" defaultValue="busan" />)).toThrow(TypeError);
 });
+
+const unnamedLabels: { name: string; label: () => JSX.Element }[] = [
+  { name: 'empty', label: () => '' },
+  { name: 'whitespace', label: () => '   ' },
+  { name: 'false', label: () => false },
+  { name: 'aria-hidden-only JSX', label: () => <span aria-hidden="true">지역</span> },
+];
+
+test.each(unnamedLabels)('rejects $name label without an accessible alternative', ({ label }) => {
+  expect(() => render(() => <NativeSelect options={options} label={label()} />)).toThrow(TypeError);
+});
+
+test.each(unnamedLabels)('accepts explicit accessible aria-label with $name label', ({ label }) => {
+  const view = render(() => <NativeSelect options={options} label={label()} aria-label="지역" />);
+  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
+});
+
+test('accepts explicit accessible aria-labelledby with decorative label content', () => {
+  const view = render(() => <><span id="region-accessible-name">거주 지역</span><NativeSelect options={options} label={<span aria-hidden="true">⌄</span>} aria-labelledby="region-accessible-name" /></>);
+  expect(view.getByRole('combobox', { name: '거주 지역' })).toHaveAccessibleName('거주 지역');
+});
+
+test('preserves visually hidden accessible label text', () => {
+  const view = render(() => <NativeSelect options={options} label={<span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', 'clip-path': 'inset(50%)' }}>지역</span>} />);
+  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
+});
```

## apps/storybook-solid/src/stories/native-select.stories.tsx

```diff
--- before-fix/apps/storybook-solid/src/stories/native-select.stories.tsx
+++ apps/storybook-solid/src/stories/native-select.stories.tsx
@@ -7,21 +7,21 @@
   id: 'krds-native-select',
   title: 'KRDS/NativeSelect',
   component: NativeSelect,
   args: { options, label: '지역', name: 'region', size: 'medium' },
 } satisfies Meta<typeof NativeSelect>;
 export default meta;
 type Story = StoryObj<typeof meta>;
 
 export const Default: Story = { args: { defaultValue: 'seoul' } };
 export const Controlled: Story = {
-  args: { value: 'seoul' },
+  args: { value: 'seoul', options: [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }] },
   render: args => {
     const [value, setValue] = createSignal(args.value ?? 'seoul');
     return <NativeSelect {...args} value={value()} onValueChange={details => setValue(details.value)} />;
   },
 };
 export const RejectedChange: Story = { args: { value: 'seoul', hint: '현재 지역은 서울로 고정되어 있습니다.' } };
 export const Selected: Story = { args: { defaultValue: 'busan' } };
 export const Disabled: Story = { args: { disabled: true, defaultValue: 'seoul' } };
 export const Invalid: Story = { args: { options: [{ value: '', label: '지역 선택' }, ...options], defaultValue: '', required: true, invalid: true, hint: '거주 중인 지역을 선택하세요.', error: '지역을 선택하세요.' } };
 export const FormReset: Story = {
```

## packages/solid/src/components/native-select/index.tsx

```diff
--- before-fix/packages/solid/src/components/native-select/index.tsx
+++ packages/solid/src/components/native-select/index.tsx
@@ -18,20 +18,21 @@
   const [local, native] = splitProps(props, ['options', 'value', 'defaultValue', 'label', 'hint', 'error', 'invalid', 'size', 'id', 'disabled', 'onValueChange', 'onChange', 'ref', 'aria-describedby']);
   const generatedId = `krds-select-${createUniqueId()}`;
   const id = () => local.id ?? generatedId;
   const controlled = local.value !== undefined;
   if (controlled && local.defaultValue !== undefined) throw new TypeError('NativeSelect value and defaultValue are mutually exclusive');
   const initialValue = controlled ? local.value! : local.defaultValue ?? local.options.find(option => !option.disabled)?.value ?? '';
   const [uncontrolledValue, setUncontrolledValue] = createSignal(initialValue);
   const value = () => controlled ? local.value! : uncontrolledValue();
   const state = () => [local.disabled && 'disabled', local.invalid && 'invalid'].filter(Boolean).join(' ');
   let control!: HTMLSelectElement;
+  let labelElement: HTMLLabelElement | undefined;
   let disposed = false;
 
   function validate() {
     if ((local.value !== undefined) !== controlled) throw new TypeError('NativeSelect cannot change controlled mode');
     if (controlled && local.defaultValue !== undefined) throw new TypeError('NativeSelect value and defaultValue are mutually exclusive');
     if (!['small', 'medium', 'large'].includes(local.size ?? 'medium')) throw new TypeError('Invalid NativeSelect size');
     const values = new Set<string>();
     for (const option of local.options) {
       if (typeof option.value !== 'string' || typeof option.label !== 'string' || values.has(option.value)) throw new TypeError('NativeSelect options require unique string values and string labels');
       values.add(option.value);
@@ -59,32 +60,40 @@
       const handler = local.onChange;
       if (typeof handler === 'function') handler(event);
       else if (handler) handler[0](handler[1], event);
     } finally {
       // A declined controlled request does not invalidate a Solid dependency.
       restoreSelection();
     }
   };
 
   const root = <div data-krds-component="native-select" data-krds-part="root" data-krds-state={state()}>
-    <Show when={local.label != null}><label for={id()} data-krds-component="native-select" data-krds-part="label" data-krds-state="">{local.label}</label></Show>
+    <Show when={local.label != null}><label ref={element => { labelElement = element; }} for={id()} data-krds-component="native-select" data-krds-part="label" data-krds-state="">{local.label}</label></Show>
     <select {...native} ref={element => { control = element; if (typeof local.ref === 'function') local.ref(element); }}
       id={id()} disabled={local.disabled} aria-invalid={local.invalid ? 'true' : undefined}
       aria-describedby={[local['aria-describedby'], local.hint != null && `${id()}-hint`, local.error != null && `${id()}-error`].filter(Boolean).join(' ') || undefined}
       onChange={handleChange} data-krds-component="native-select" data-krds-part="control" data-krds-state={state()} data-krds-size={local.size ?? 'medium'}>
       <For each={local.options}>{option => <option value={option.value} disabled={option.disabled}>{option.label}</option>}</For>
     </select>
     <Show when={local.hint != null}><div id={`${id()}-hint`} data-krds-component="native-select" data-krds-part="hint" data-krds-state="">{local.hint}</div></Show>
     <Show when={local.error != null}><div id={`${id()}-error`} data-krds-component="native-select" data-krds-part="error" data-krds-state="">{local.error}</div></Show>
   </div>;
 
-  createEffect(() => { validate(); restoreSelection(); });
+  createEffect(() => {
+    validate();
+    // Inspect rendered label content: visually hidden text remains accessible,
+    // whereas aria-hidden/hidden descendants contribute no functional name.
+    const accessibleLabel = local.label != null ? labelElement?.cloneNode(true) as HTMLLabelElement | undefined : undefined;
+    accessibleLabel?.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
+    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !accessibleLabel?.textContent?.trim()) throw new TypeError('NativeSelect requires an accessible name');
+    restoreSelection();
+  });
   onMount(() => {
     const ownerDocument = control.ownerDocument;
     const reset = (event: Event) => {
       if (event.target !== control.form) return;
       queueMicrotask(() => {
         if (disposed || event.defaultPrevented || event.target !== control.form) return;
         if (!controlled) setUncontrolledValue(initialValue);
         restoreSelection();
       });
     };
```
