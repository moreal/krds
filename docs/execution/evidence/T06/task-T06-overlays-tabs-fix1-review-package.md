# T06 overlays-tabs fix round 1 exact changes
Original review and implementer report remain binding. Compare these before-fix bytes to current frozen source. No commits.

## apps/fixture-solid/tests/siheom/modal.test.tsx

```diff
--- before-fix/apps/fixture-solid/tests/siheom/modal.test.tsx
+++ apps/fixture-solid/tests/siheom/modal.test.tsx
@@ -109,10 +109,27 @@
   } finally { unrelated.remove(); }
 });
 
 test('removing an open parent with its nested modal restores the outer opener', async () => {
   const Modal = modal(); let remove!: () => void;
   render(() => { const [open, setOpen] = createSignal(false); const [mounted, setMounted] = createSignal(true); const [child, setChild] = createSignal(false); remove = () => setMounted(false); return <><button id="outer-opener" onClick={() => setOpen(true)}>바깥 열기</button><Show when={mounted()}><Modal open={open()} title="부모 제거"><button id="nested-opener" onClick={() => setChild(true)}>안쪽 열기</button><Modal open={child()} title="자식 제거" /></Modal></Show></>; });
   document.getElementById('outer-opener')!.focus(); document.getElementById('outer-opener')!.click(); await tick();
   document.getElementById('nested-opener')!.focus(); document.getElementById('nested-opener')!.click(); await tick();
   remove(); await tick(); expect(document.querySelector('[role="dialog"]')).toBeNull(); expect(document.activeElement).toBe(document.getElementById('outer-opener')); expect(document.body.style.overflow).not.toBe('hidden');
 });
+
+test('modal cannot reuse backdrop ownership across two different pointer gestures', async () => {
+  const Modal = modal(); const events: unknown[] = [];
+  render(() => <Modal open title="포인터 경계" closeOnOutsideClick onOpenChange={(d: unknown) => events.push(d)}><button>내용 동작</button></Modal>); await tick();
+  const backdrop = document.querySelector<HTMLElement>('[data-krds-part="backdrop"]')!;
+  const pointer = (target: HTMLElement, type: string) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, isPrimary: true }));
+  pointer(backdrop, 'pointerdown'); pointer(dialog(), 'pointerup');
+  pointer(dialog(), 'pointerdown'); pointer(backdrop, 'pointerup');
+  expect(events).toEqual([]); expect(dialog()).not.toBeNull();
+  pointer(backdrop, 'pointerdown'); pointer(backdrop, 'pointerup'); expect(events).toEqual([{ open: false }]);
+});
+
+test('modal rejects blank primitive titles and blank explicit icon labels', () => {
+  const Modal = modal();
+  for (const title of ['', '   ', false]) expect(() => render(() => <Modal title={title} />)).toThrow(TypeError);
+  for (const closeLabel of ['', '   ']) expect(() => render(() => <Modal title="명명된 대화상자" closeLabel={closeLabel} />)).toThrow(TypeError);
+});
```

## apps/fixture-solid/tests/siheom/tabs.test.tsx

```diff
--- before-fix/apps/fixture-solid/tests/siheom/tabs.test.tsx
+++ apps/fixture-solid/tests/siheom/tabs.test.tsx
@@ -68,10 +68,44 @@
   const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
   render(() => <Tabs label="초점 이동" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
   all()[0]!.focus(); await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }]);
 });
 
 test('active panels with only hidden content controls remain reachable by Tab', () => {
   const Tabs = tabs();
   render(() => <Tabs label="빈 컨트롤" items={[{ value: 'hidden', label: '정보', content: <button hidden>숨겨진 동작</button> }]} />);
   expect(document.querySelector<HTMLElement>('[role="tabpanel"]')!.tabIndex).toBe(0);
 });
+
+test('an abandoned tab pointer gesture cannot suppress a later rejected keyboard retry', async () => {
+  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
+  render(() => <><Tabs label="방치된 포인터" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} /><button id="outside-pointer">바깥</button></>);
+  all()[0]!.focus();
+  all()[0]!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 7, isPrimary: true }));
+  document.getElementById('outside-pointer')!.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 7, isPrimary: true }));
+  all()[2]!.focus(); expect(events).toEqual([{ value: 'second' }]);
+  await user.keyboard('{Enter}'); expect(events).toEqual([{ value: 'second' }, { value: 'second' }]);
+  await user.keyboard(' '); expect(events).toHaveLength(3);
+});
+
+test('tab panels retain their context stop when text precedes a later or nested control', async () => {
+  const Tabs = tabs();
+  const view = render(() => <>
+    <Tabs label="본문 먼저" items={[{ value: 'text', label: '본문', content: <><p>먼저 읽을 설명</p><button>나중 동작</button></> }]} />
+    <Tabs label="직접 동작 먼저" items={[{ value: 'action', label: '동작', content: <><button>첫 동작</button><p>뒤 설명</p></> }]} />
+    <Tabs label="중첩 동작" items={[{ value: 'nested', label: '중첩', content: <div><button>중첩 동작</button></div> }]} />
+    <Tabs label="숨김 첫 동작" items={[{ value: 'hidden', label: '숨김', content: <><button hidden>숨김</button><button>보이는 나중 동작</button></> }]} />
+  </>);
+  const panels = view.getAllByRole('tabpanel');
+  expect(panels[0]!.tabIndex).toBe(0); expect(panels[1]!.hasAttribute('tabindex')).toBe(false); expect(panels[2]!.tabIndex).toBe(0); expect(panels[3]!.tabIndex).toBe(0);
+  const user = userEvent.setup(); view.getByRole('tab', { name: '본문' }).focus(); await user.tab(); expect(document.activeElement).toBe(panels[0]);
+});
+
+test('tabs reject blank primitive names and ignore blank naming overrides when another valid name exists', () => {
+  const Tabs = tabs();
+  for (const label of ['', '   ', false]) expect(() => render(() => <Tabs label={label} items={items()} />)).toThrow(TypeError);
+  expect(() => render(() => <Tabs aria-label="   " items={items()} />)).toThrow(TypeError);
+  expect(() => render(() => <Tabs aria-labelledby="   " items={items()} />)).toThrow(TypeError);
+  const view = render(() => <><Tabs label="보이는 이름" aria-labelledby="   " aria-label="   " items={items()} /><Tabs aria-label="직접 이름" aria-labelledby="" items={items()} /></>);
+  expect(view.getByRole('tablist', { name: '보이는 이름' })).not.toBeNull();
+  expect(view.getByRole('tablist', { name: '직접 이름' }).hasAttribute('aria-labelledby')).toBe(false);
+});
```

## packages/solid/src/components/modal/index.tsx

```diff
--- before-fix/packages/solid/src/components/modal/index.tsx
+++ packages/solid/src/components/modal/index.tsx
@@ -95,78 +95,92 @@
 export function Modal(props: ModalProps) {
   const [local, rest] = splitProps(props, ['title', 'titleId', 'description', 'descriptionId', 'children', 'actions', 'open', 'defaultOpen', 'onOpenChange', 'closeOnOutsideClick', 'showCloseButton', 'initialFocusId', 'returnFocusId', 'closeLabel', 'locale', 'id', 'ref']);
   const environment = useKrdsEnvironment();
   const generated = `krds-modal-${createUniqueId()}`;
   const contentId = () => local.id ?? generated;
   const controlled = local.open !== undefined;
   if (controlled && local.defaultOpen !== undefined) throw new TypeError('Modal cannot combine open and defaultOpen');
   const [internal, setInternal] = createSignal(local.defaultOpen ?? false);
   const isOpen = createMemo(() => {
     if ((local.open !== undefined) !== controlled) throw new TypeError('Modal cannot change controlled mode');
-    if (local.title == null || local.title === '') throw new TypeError('Modal requires a visible title');
+    if (local.title == null || typeof local.title === 'boolean' || (typeof local.title === 'string' && !local.title.trim())) throw new TypeError('Modal requires a visible title');
+    if (local.closeLabel !== undefined && !local.closeLabel.trim()) throw new TypeError('Modal closeLabel cannot be blank');
     if (local.locale !== undefined && !['ko-KR', 'en-US'].includes(local.locale)) throw new TypeError('Invalid Modal locale');
     return controlled ? local.open! : internal();
   });
   const requestClose = () => {
     if (!isOpen()) return;
     if (!controlled) setInternal(false);
     local.onOpenChange?.({ open: false });
   };
   const initiallyOpen = isOpen();
   let firstOpening = true;
   function OpenModal() {
     const doc = environment.getDocument();
     if (!doc) return null;
     const active = doc.activeElement;
     // Initial mount is not an opening action, even when an unrelated control was focused.
     const withoutOpeningAction = firstOpening && initiallyOpen;
     firstOpening = false;
     const opener = !withoutOpeningAction && active !== doc.body && active && 'focus' in active ? active as HTMLElement : undefined;
     const ancestors: HTMLElement[] = []; let ancestor = opener?.parentElement;
     while (ancestor && ancestor !== doc.body) { ancestors.push(ancestor); ancestor = ancestor.parentElement; }
-    let root!: HTMLDivElement; let content!: HTMLDivElement;
+    let root!: HTMLDivElement; let content!: HTMLDivElement; let backdrop!: HTMLDivElement;
     let controller: ReturnType<typeof register> | undefined;
     let pointerStart: number | undefined;
+    const clearPointer = () => { pointerStart = undefined; };
+    const pointerDown = (event: PointerEvent) => {
+      pointerStart = controller?.top() && event.target === backdrop && event.button === 0 && event.isPrimary ? event.pointerId : undefined;
+    };
+    const pointerUp = (event: PointerEvent) => {
+      const dismiss = pointerStart === event.pointerId && event.target === backdrop && event.button === 0 && event.isPrimary;
+      clearPointer();
+      if (dismiss && local.closeOnOutsideClick && controller?.top()) requestClose();
+    };
     const entryFocus = () => {
       const first = focusables(content)[0];
       const requested = local.initialFocusId ? doc.getElementById(local.initialFocusId) : content;
       if (requested !== content && requested !== first) throw new TypeError('Modal initialFocusId must identify the dialog or its first interactive element');
       (requested as HTMLElement).focus({ preventScroll: true });
     };
     const keydown = (event: KeyboardEvent) => {
       if (!controller?.top() || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
       if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); requestClose(); }
       else if (event.key === 'Tab') {
         const elements = focusables(content); const first = elements[0]; const last = elements.at(-1);
         if (!first) { event.preventDefault(); content.focus(); }
         else if (event.shiftKey && (doc.activeElement === first || doc.activeElement === content)) { event.preventDefault(); last!.focus(); }
         else if (!event.shiftKey && (doc.activeElement === last || doc.activeElement === content)) { event.preventDefault(); first.focus(); }
       }
     };
     const focusin = (event: FocusEvent) => { if (controller?.top() && !content.contains(event.target as Node)) content.focus({ preventScroll: true }); };
     onMount(() => {
       controller = register(doc, { root, content });
       doc.addEventListener('keydown', keydown); doc.addEventListener('focusin', focusin);
+      // Observe the complete gesture, including ends outside the backdrop or a stopped bubble.
+      doc.addEventListener('pointerdown', pointerDown, true); doc.addEventListener('pointerup', pointerUp, true);
+      doc.addEventListener('pointercancel', clearPointer, true); doc.addEventListener('lostpointercapture', clearPointer, true);
+      doc.defaultView?.addEventListener('blur', clearPointer);
       // Portal content is attached before onMount, and configuration errors remain catchable by Solid ErrorBoundary.
       if (local.showCloseButton === false && !focusables(content).some(element => element.matches('button,[role="button"]'))) throw new TypeError('Modal without its icon close button requires an enabled explicit close action');
       entryFocus();
     });
     onCleanup(() => {
       doc.removeEventListener('keydown', keydown); doc.removeEventListener('focusin', focusin);
+      doc.removeEventListener('pointerdown', pointerDown, true); doc.removeEventListener('pointerup', pointerUp, true);
+      doc.removeEventListener('pointercancel', clearPointer, true); doc.removeEventListener('lostpointercapture', clearPointer, true);
+      doc.defaultView?.removeEventListener('blur', clearPointer); clearPointer();
       const wasTop = controller?.top(); controller?.release();
       if (wasTop) restoreFocus(doc, opener, ancestors, untrack(() => local.returnFocusId));
     });
     return <Portal mount={doc.body}><div ref={root} data-krds-component="modal" data-krds-part="root" data-krds-state="open" dir={rest.dir ?? environment.direction()} lang={(local.locale ?? environment.locale()).slice(0, 2)} style={{ position: 'fixed', inset: '0', 'z-index': '1000' }}>
-      <div data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open"
-        onPointerDown={event => { pointerStart = controller?.top() && event.target === event.currentTarget && event.button === 0 && event.isPrimary ? event.pointerId : undefined; }}
-        onPointerCancel={() => { pointerStart = undefined; }}
-        onPointerUp={event => { const dismiss = pointerStart === event.pointerId && event.target === event.currentTarget && event.button === 0 && event.isPrimary; pointerStart = undefined; if (dismiss && local.closeOnOutsideClick && controller?.top()) requestClose(); }} />
+      <div ref={backdrop} data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" />
       <div {...rest} ref={element => { content = element; if (typeof local.ref === 'function') local.ref(element); }} id={contentId()} role="dialog" aria-modal="true" aria-labelledby={local.titleId ?? `${contentId()}-title`} aria-describedby={local.description != null ? local.descriptionId ?? `${contentId()}-description` : undefined} tabIndex={-1} data-krds-component="modal" data-krds-part="content" data-krds-state="open">
         <h2 id={local.titleId ?? `${contentId()}-title`} data-krds-component="modal" data-krds-part="title" data-krds-state="">{local.title}</h2>
         <Show when={local.description != null}><div id={local.descriptionId ?? `${contentId()}-description`} data-krds-component="modal" data-krds-part="description" data-krds-state="">{local.description}</div></Show>
         <div data-krds-component="modal" data-krds-part="body" data-krds-state="">{local.children}</div>
         <Show when={local.actions != null}><div data-krds-component="modal" data-krds-part="actions" data-krds-state="">{local.actions}</div></Show>
         <Show when={local.showCloseButton !== false}><button type="button" aria-label={local.closeLabel ?? ((local.locale ?? environment.locale()) === 'en-US' ? 'Close' : '닫기')} onClick={requestClose} data-krds-component="modal" data-krds-part="close" data-krds-state=""><span aria-hidden="true">×</span></button></Show>
       </div>
     </div></Portal>;
   }
   return <Show when={isOpen()}><OpenModal /></Show>;
```

## packages/solid/src/components/tabs/index.tsx

```diff
--- before-fix/packages/solid/src/components/tabs/index.tsx
+++ packages/solid/src/components/tabs/index.tsx
@@ -21,53 +21,74 @@
 }
 
 const focusableSelector = 'a[href],button:not(:disabled),input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
 
 /** Native Solid tabs. All enabled tabs participate in sequential keyboard navigation. */
 export function Tabs(props: TabsProps) {
   const [local, rest] = splitProps(props, ['items', 'label', 'value', 'defaultValue', 'onValueChange', 'activationMode', 'orientation', 'id', 'aria-label', 'aria-labelledby']);
   const environment = useKrdsEnvironment();
   const generated = `krds-tabs-${createUniqueId()}`;
   const rootId = () => local.id ?? generated;
+  const hasVisibleLabel = () => local.label != null && typeof local.label !== 'boolean' && (typeof local.label !== 'string' || !!local.label.trim());
+  const ariaLabel = () => local['aria-label']?.trim() || undefined;
+  const ariaLabelledby = () => local['aria-labelledby']?.trim() || undefined;
   const controlled = local.value !== undefined;
   if (controlled && local.defaultValue !== undefined) throw new TypeError('Tabs cannot combine value and defaultValue');
   const initial = local.defaultValue ?? local.items.find(item => !item.disabled)?.value ?? '';
   const [internal, setInternal] = createSignal(initial);
   const ids = new Map<string, string>();
   const tabId = (item: TabItem) => {
     if (item.id) return item.id;
     if (!ids.has(item.value)) ids.set(item.value, `${generated}-item-${ids.size + 1}`);
     return ids.get(item.value)!;
   };
   const selected = createMemo(() => {
     if ((local.value !== undefined) !== controlled) throw new TypeError('Tabs cannot change controlled mode');
     if (local.activationMode !== undefined && !['manual', 'automatic'].includes(local.activationMode)) throw new TypeError('Invalid Tabs activationMode');
     if (local.orientation !== undefined && !['horizontal', 'vertical'].includes(local.orientation)) throw new TypeError('Invalid Tabs orientation');
-    if (local.label == null && !local['aria-label'] && !local['aria-labelledby']) throw new TypeError('Tabs requires an accessible tablist label');
+    if (!hasVisibleLabel() && !ariaLabel() && !ariaLabelledby()) throw new TypeError('Tabs requires an accessible tablist label');
     const values = new Set<string>(); const domIds = new Set<string>([rootId(), `${rootId()}-label`]);
     for (const item of local.items) {
       if (typeof item.value !== 'string' || !item.value.trim() || values.has(item.value)) throw new TypeError('Tabs requires unique nonempty item values');
       values.add(item.value);
       if (item.id !== undefined && !item.id.trim()) throw new TypeError('Tabs item IDs cannot be empty');
       for (const id of [tabId(item), `${tabId(item)}-panel`]) {
         if (domIds.has(id)) throw new TypeError('Tabs requires unique item IDs');
         domIds.add(id);
       }
     }
     const value = controlled ? local.value! : internal();
     const enabled = local.items.filter(item => !item.disabled);
     if (enabled.length ? !enabled.some(item => item.value === value) : value !== '') throw new TypeError('Tabs selection must identify an enabled item');
     return value;
   });
   let list!: HTMLDivElement;
   let pointerFocused: string | undefined;
-  let pointerGesture = false;
+  let pointerId: number | undefined;
+  let pointerTarget: HTMLButtonElement | undefined;
+  const clearPointer = () => { pointerId = undefined; pointerTarget = undefined; pointerFocused = undefined; };
+  onMount(() => {
+    const doc = list.ownerDocument;
+    const endPointer = (event: PointerEvent) => {
+      if (pointerId !== event.pointerId || !pointerTarget?.contains(event.target as Node) || event.button !== 0 || !event.isPrimary) clearPointer();
+      // A completed gesture on its originating tab may still produce its paired click.
+      pointerId = undefined;
+    };
+    doc.addEventListener('pointerdown', clearPointer, true); doc.addEventListener('pointerup', endPointer, true);
+    doc.addEventListener('pointercancel', clearPointer, true); doc.addEventListener('lostpointercapture', clearPointer, true);
+    doc.addEventListener('keydown', clearPointer, true); doc.defaultView?.addEventListener('blur', clearPointer);
+    onCleanup(() => {
+      doc.removeEventListener('pointerdown', clearPointer, true); doc.removeEventListener('pointerup', endPointer, true);
+      doc.removeEventListener('pointercancel', clearPointer, true); doc.removeEventListener('lostpointercapture', clearPointer, true);
+      doc.removeEventListener('keydown', clearPointer, true); doc.defaultView?.removeEventListener('blur', clearPointer); clearPointer();
+    });
+  });
   const request = (item: TabItem) => {
     if (item.disabled || item.value === selected()) return;
     if (!controlled) setInternal(item.value);
     local.onValueChange?.({ value: item.value });
   };
   const navigate = (event: KeyboardEvent, item: TabItem) => {
     if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
     const enabled = local.items.filter(option => !option.disabled);
     const index = enabled.findIndex(option => option.value === item.value);
     const previous = local.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
@@ -77,33 +98,35 @@
     else if (event.key === next) target = enabled[(index + 1) % enabled.length];
     else if (event.key === 'Home') target = enabled[0];
     else if (event.key === 'End') target = enabled[enabled.length - 1];
     if (!target) return;
     event.preventDefault();
     Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(tab => tab.id === tabId(target!))?.focus();
   };
   // Keep validation active even when there are no children to read selected().
   createEffect(() => { selected(); });
   return <div {...rest} id={rootId()} dir={rest.dir ?? environment.direction()} data-krds-component="tabs" data-krds-part="root" data-krds-state="">
-    {local.label != null && <div id={`${rootId()}-label`}>{local.label}</div>}
-    <div ref={list} role="tablist" aria-label={local['aria-label']} aria-labelledby={local['aria-labelledby'] ?? (local.label != null ? `${rootId()}-label` : undefined)} aria-orientation={local.orientation ?? 'horizontal'} data-krds-component="tabs" data-krds-part="list" data-krds-state="" data-krds-orientation={local.orientation ?? 'horizontal'}>
+    {hasVisibleLabel() && <div id={`${rootId()}-label`}>{local.label}</div>}
+    <div ref={list} role="tablist" aria-label={ariaLabel()} aria-labelledby={ariaLabelledby() ?? (hasVisibleLabel() ? `${rootId()}-label` : undefined)} aria-orientation={local.orientation ?? 'horizontal'} data-krds-component="tabs" data-krds-part="list" data-krds-state="" data-krds-orientation={local.orientation ?? 'horizontal'}>
       <For each={local.items}>{item => <button type="button" role="tab" id={tabId(item)} disabled={item.disabled} tabIndex={item.disabled ? -1 : 0} aria-selected={selected() === item.value} aria-controls={`${tabId(item)}-panel`} data-krds-component="tabs" data-krds-part="trigger" data-krds-state={[selected() === item.value && 'selected', item.disabled && 'disabled'].filter(Boolean).join(' ')}
-        onPointerDown={event => { pointerGesture = event.button === 0; pointerFocused = undefined; }}
-        onPointerCancel={() => { pointerGesture = false; pointerFocused = undefined; }}
-        onFocus={() => { if (local.activationMode === 'automatic') { if (pointerGesture) pointerFocused = item.value; request(item); } }}
-        onBlur={event => { if (!list.contains(event.relatedTarget as Node | null)) { pointerGesture = false; pointerFocused = undefined; } }}
-        onClick={() => { const paired = pointerFocused === item.value; pointerGesture = false; pointerFocused = undefined; if (!paired) request(item); }}
+        onPointerDown={event => { if (event.button === 0 && event.isPrimary) { pointerId = event.pointerId; pointerTarget = event.currentTarget; pointerFocused = undefined; } }}
+        onFocus={event => { if (local.activationMode === 'automatic') { if (pointerTarget === event.currentTarget) pointerFocused = item.value; request(item); } }}
+        onBlur={event => { if (!list.contains(event.relatedTarget as Node | null)) clearPointer(); }}
+        onClick={event => { const paired = event.detail > 0 && pointerFocused === item.value && pointerTarget === event.currentTarget; clearPointer(); if (!paired) request(item); }}
         onKeyDown={event => navigate(event, item)}>{item.label}</button>}</For>
     </div>
     <For each={local.items}>{item => {
       let panel!: HTMLDivElement;
       const [hasFocusable, setHasFocusable] = createSignal(false);
-      const inspect = () => setHasFocusable(Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).some(element => {
-        const style = element.ownerDocument.defaultView?.getComputedStyle(element);
-        return element.tabIndex >= 0 && !element.closest('[hidden],[inert]') && !element.matches(':disabled') && style?.visibility !== 'hidden' && element.getClientRects().length > 0;
-      }));
+      const inspect = () => {
+        // Leading text or a nonfocusable wrapper is context, even when a later descendant is interactive.
+        const first = Array.from(panel.childNodes).find(node => node.nodeType === 1 || (node.nodeType === 3 && !!node.textContent?.trim()));
+        const element = first?.nodeType === 1 ? first as HTMLElement : undefined;
+        const style = element?.ownerDocument.defaultView?.getComputedStyle(element);
+        setHasFocusable(!!element && element.matches(focusableSelector) && element.tabIndex >= 0 && !element.closest('[hidden],[inert]') && !element.matches(':disabled') && style?.visibility !== 'hidden' && element.getClientRects().length > 0);
+      };
       onMount(() => { inspect(); const observer = new MutationObserver(inspect); observer.observe(panel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'tabindex', 'hidden', 'href', 'style', 'class'] }); onCleanup(() => observer.disconnect()); });
       // The panel remains mounted; selection never recreates its local controls.
       return <div ref={panel} role="tabpanel" id={`${tabId(item)}-panel`} aria-labelledby={tabId(item)} hidden={selected() !== item.value} tabIndex={hasFocusable() ? undefined : 0} data-krds-component="tabs" data-krds-part="panel" data-krds-state={selected() === item.value ? 'active' : 'inactive'}>{item.content}</div>;
     }}</For>
   </div>;
 }
```
