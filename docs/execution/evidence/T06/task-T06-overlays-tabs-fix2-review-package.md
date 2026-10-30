# T06 overlays-tabs fix round 2 exact scoped changes

Current source frozen. Review original open finding and new breakage in this fix diff only. Controls includes the separately evidenced same Button text-alternative guard gap with observed two-test RED. Covering GREEN is lead-owned and appended before dispatch.

## apps/fixture-solid/tests/siheom/tabs.test.tsx

```diff
--- before-fix2/apps/fixture-solid/tests/siheom/tabs.test.tsx
+++ apps/fixture-solid/tests/siheom/tabs.test.tsx
@@ -102,10 +102,26 @@
 
 test('tabs reject blank primitive names and ignore blank naming overrides when another valid name exists', () => {
   const Tabs = tabs();
   for (const label of ['', '   ', false]) expect(() => render(() => <Tabs label={label} items={items()} />)).toThrow(TypeError);
   expect(() => render(() => <Tabs aria-label="   " items={items()} />)).toThrow(TypeError);
   expect(() => render(() => <Tabs aria-labelledby="   " items={items()} />)).toThrow(TypeError);
   const view = render(() => <><Tabs label="보이는 이름" aria-labelledby="   " aria-label="   " items={items()} /><Tabs aria-label="직접 이름" aria-labelledby="" items={items()} /></>);
   expect(view.getByRole('tablist', { name: '보이는 이름' })).not.toBeNull();
   expect(view.getByRole('tablist', { name: '직접 이름' }).hasAttribute('aria-labelledby')).toBe(false);
 });
+
+test('touch capture release after pointerup preserves only its corresponding focus-click pairing', () => {
+  const Tabs = tabs(); const events: unknown[] = [];
+  render(() => <Tabs label="터치 포인터 해제" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
+  const second = all()[2]!;
+  const pointer = (type: string, id: number) => second.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: id, pointerType: 'touch', isPrimary: true }));
+  all()[0]!.focus(); pointer('pointerdown', 11); second.focus();
+  expect(events).toEqual([{ value: 'second' }]);
+  pointer('pointerup', 11); pointer('lostpointercapture', 11);
+  second.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, button: 0 }));
+  expect(events).toEqual([{ value: 'second' }]);
+  // A later deliberate gesture still requests selection after the controlled rejection.
+  pointer('pointerdown', 12); pointer('pointerup', 12); pointer('lostpointercapture', 12);
+  second.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, button: 0 }));
+  expect(events).toEqual([{ value: 'second' }, { value: 'second' }]);
+});
```

## packages/solid/src/components/tabs/index.tsx

```diff
--- before-fix2/packages/solid/src/components/tabs/index.tsx
+++ packages/solid/src/components/tabs/index.tsx
@@ -67,25 +67,26 @@
   let pointerTarget: HTMLButtonElement | undefined;
   const clearPointer = () => { pointerId = undefined; pointerTarget = undefined; pointerFocused = undefined; };
   onMount(() => {
     const doc = list.ownerDocument;
     const endPointer = (event: PointerEvent) => {
       if (pointerId !== event.pointerId || !pointerTarget?.contains(event.target as Node) || event.button !== 0 || !event.isPrimary) clearPointer();
       // A completed gesture on its originating tab may still produce its paired click.
       pointerId = undefined;
     };
     doc.addEventListener('pointerdown', clearPointer, true); doc.addEventListener('pointerup', endPointer, true);
-    doc.addEventListener('pointercancel', clearPointer, true); doc.addEventListener('lostpointercapture', clearPointer, true);
+    // Capture release is not cancellation: its corresponding click can follow lostpointercapture.
+    doc.addEventListener('pointercancel', clearPointer, true);
     doc.addEventListener('keydown', clearPointer, true); doc.defaultView?.addEventListener('blur', clearPointer);
     onCleanup(() => {
       doc.removeEventListener('pointerdown', clearPointer, true); doc.removeEventListener('pointerup', endPointer, true);
-      doc.removeEventListener('pointercancel', clearPointer, true); doc.removeEventListener('lostpointercapture', clearPointer, true);
+      doc.removeEventListener('pointercancel', clearPointer, true);
       doc.removeEventListener('keydown', clearPointer, true); doc.defaultView?.removeEventListener('blur', clearPointer); clearPointer();
     });
   });
   const request = (item: TabItem) => {
     if (item.disabled || item.value === selected()) return;
     if (!controlled) setInternal(item.value);
     local.onValueChange?.({ value: item.value });
   };
   const navigate = (event: KeyboardEvent, item: TabItem) => {
     if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
```
