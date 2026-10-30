# T06 controls fix round 2 exact scoped changes

Current source frozen. Review original open finding and new breakage in this fix diff only. Controls includes the separately evidenced same Button text-alternative guard gap with observed two-test RED. Covering GREEN is lead-owned and appended before dispatch.

## apps/fixture-solid/tests/siheom/button.test.tsx

```diff
--- before-fix2/apps/fixture-solid/tests/siheom/button.test.tsx
+++ apps/fixture-solid/tests/siheom/button.test.tsx
@@ -83,10 +83,21 @@
   expect(() => render(() => <Button />)).toThrow(TypeError);
 });
 
 // A decorative glyph must never silently become the action's accessible name.
 test('decorative icons require an explicit accessible action name', () => {
   expect(() => render(() => <Button icon={<span>×</span>} />)).toThrow(TypeError);
   expect(() => render(() => <Button><span aria-hidden="true">×</span></Button>)).toThrow(TypeError);
   const view = render(() => <Button aria-label="닫기" icon={<span>×</span>} />);
   expect(view.getByRole('button', { name: '닫기' })).toBeVisible();
 });
+
+test('accepts a native action name from a local image text alternative', () => {
+  const localAsset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
+  const view = render(() => <Button><img src={localAsset} alt="저장" /></Button>);
+  expect(view.getByRole('button', { name: '저장' })).toHaveAccessibleName('저장');
+});
+
+test('accepts a native action name from a named image-role child', () => {
+  const view = render(() => <Button><span role="img" aria-label="저장" /></Button>);
+  expect(view.getByRole('button', { name: '저장' })).toHaveAccessibleName('저장');
+});
```

## apps/fixture-solid/tests/siheom/native-select.test.tsx

```diff
--- before-fix2/apps/fixture-solid/tests/siheom/native-select.test.tsx
+++ apps/fixture-solid/tests/siheom/native-select.test.tsx
@@ -162,10 +162,29 @@
 
 test('accepts explicit accessible aria-labelledby with decorative label content', () => {
   const view = render(() => <><span id="region-accessible-name">거주 지역</span><NativeSelect options={options} label={<span aria-hidden="true">⌄</span>} aria-labelledby="region-accessible-name" /></>);
   expect(view.getByRole('combobox', { name: '거주 지역' })).toHaveAccessibleName('거주 지역');
 });
 
 test('preserves visually hidden accessible label text', () => {
   const view = render(() => <NativeSelect options={options} label={<span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', 'clip-path': 'inset(50%)' }}>지역</span>} />);
   expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
 });
+
+test('accepts native accessible label text alternatives from a local image', () => {
+  const localAsset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
+  const view = render(() => <NativeSelect options={options} label={<img src={localAsset} alt="지역" />} />);
+  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
+});
+
+test('accepts native accessible label text alternatives from a named image role', () => {
+  const view = render(() => <NativeSelect options={options} label={<span role="img" aria-label="지역" />} />);
+  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
+});
+
+test('preserves a valid native label while an inactive ancestor hides the field', () => {
+  const [inactive, setInactive] = createSignal(true);
+  const view = render(() => <div hidden={inactive()}><NativeSelect options={options} label="지역" /></div>);
+  expect(view.getByRole('combobox', { hidden: true })).toBeInTheDocument();
+  setInactive(false);
+  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
+});
```

## packages/solid/src/components/button/index.tsx

```diff
--- before-fix2/packages/solid/src/components/button/index.tsx
+++ packages/solid/src/components/button/index.tsx
@@ -20,16 +20,21 @@
   let label!: HTMLSpanElement;
   const root = <button {...native} type={local.type ?? 'button'} disabled={local.disabled}
     data-krds-component="button" data-krds-part="root" data-krds-state={local.disabled ? 'disabled' : ''}
     data-krds-variant={local.variant ?? 'primary'} data-krds-size={local.size ?? 'medium'}>
     <span ref={element => { label = element; }} data-krds-component="button" data-krds-part="label" data-krds-state="">{content()}</span>
     {local.icon != null && <span data-krds-component="button" data-krds-part="icon" data-krds-state="" aria-hidden="true">{local.icon}</span>}
   </button>;
   createEffect(() => {
     validate();
     content();
-    const visibleLabel = label.cloneNode(true) as HTMLSpanElement;
-    visibleLabel.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
-    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !visibleLabel.textContent?.trim()) throw new TypeError('Button requires an accessible action name');
+    // Conservative meaningful-content guard, not full accessible-name computation.
+    // The separate icon slot is decorative; native alternatives in label content
+    // can provide the action name even when they contain no DOM text nodes.
+    const accessibleLabel = label.cloneNode(true) as HTMLSpanElement;
+    accessibleLabel.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
+    const hasImageAlternative = [...accessibleLabel.querySelectorAll('img[alt], [role="img"][aria-label]')]
+      .some(element => Boolean(element.getAttribute('alt')?.trim() || element.getAttribute('aria-label')?.trim()));
+    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !accessibleLabel.textContent?.trim() && !hasImageAlternative) throw new TypeError('Button requires an accessible action name');
   });
   return root;
 }
```

## packages/solid/src/components/native-select/index.tsx

```diff
--- before-fix2/packages/solid/src/components/native-select/index.tsx
+++ packages/solid/src/components/native-select/index.tsx
@@ -73,25 +73,28 @@
       aria-describedby={[local['aria-describedby'], local.hint != null && `${id()}-hint`, local.error != null && `${id()}-error`].filter(Boolean).join(' ') || undefined}
       onChange={handleChange} data-krds-component="native-select" data-krds-part="control" data-krds-state={state()} data-krds-size={local.size ?? 'medium'}>
       <For each={local.options}>{option => <option value={option.value} disabled={option.disabled}>{option.label}</option>}</For>
     </select>
     <Show when={local.hint != null}><div id={`${id()}-hint`} data-krds-component="native-select" data-krds-part="hint" data-krds-state="">{local.hint}</div></Show>
     <Show when={local.error != null}><div id={`${id()}-error`} data-krds-component="native-select" data-krds-part="error" data-krds-state="">{local.error}</div></Show>
   </div>;
 
   createEffect(() => {
     validate();
-    // Inspect rendered label content: visually hidden text remains accessible,
-    // whereas aria-hidden/hidden descendants contribute no functional name.
+    // Conservative presence guard, not a complete accessible-name computation.
+    // Preserve visually hidden text and native image text alternatives; ignore
+    // decorative descendants without rejecting fields in inactive ancestors.
     const accessibleLabel = local.label != null ? labelElement?.cloneNode(true) as HTMLLabelElement | undefined : undefined;
     accessibleLabel?.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
-    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !accessibleLabel?.textContent?.trim()) throw new TypeError('NativeSelect requires an accessible name');
+    const hasImageAlternative = [...accessibleLabel?.querySelectorAll('img[alt], [role="img"][aria-label]') ?? []]
+      .some(element => Boolean(element.getAttribute('alt')?.trim() || element.getAttribute('aria-label')?.trim()));
+    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !accessibleLabel?.textContent?.trim() && !hasImageAlternative) throw new TypeError('NativeSelect requires an accessible name');
     restoreSelection();
   });
   onMount(() => {
     const ownerDocument = control.ownerDocument;
     const reset = (event: Event) => {
       if (event.target !== control.form) return;
       queueMicrotask(() => {
         if (disposed || event.defaultPrevented || event.target !== control.form) return;
         if (!controlled) setUncontrolledValue(initialValue);
         restoreSelection();
```
