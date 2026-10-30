# T06 overlays-tabs exact uncommitted scoped changes

Baseline reviewed T05 foundation. Sharedintegration/providers/publicbarrel/fixture and othercomponents are distinctowners; fullT06acceptance later.

## packages/solid/src/components/modal/index.tsx

```diff
--- base/packages/solid/src/components/modal/index.tsx
+++ packages/solid/src/components/modal/index.tsx
@@ -0,0 +1,173 @@
+import { createMemo, createSignal, createUniqueId, onCleanup, onMount, Show, splitProps, untrack, type JSX } from 'solid-js';
+import { Portal } from 'solid-js/web';
+import type { OpenChangeDetails } from '@krds-native/contracts';
+import { useKrdsEnvironment } from '../../providers';
+
+export interface ModalProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'onChange'> {
+  title: JSX.Element;
+  titleId?: string;
+  description?: JSX.Element;
+  descriptionId?: string;
+  children?: JSX.Element;
+  actions?: JSX.Element;
+  open?: boolean;
+  defaultOpen?: boolean;
+  onOpenChange?: (details: OpenChangeDetails) => void;
+  closeOnOutsideClick?: boolean;
+  showCloseButton?: boolean;
+  initialFocusId?: string;
+  returnFocusId?: string;
+  closeLabel?: string;
+  locale?: 'ko-KR' | 'en-US';
+}
+
+const focusableSelector = 'a[href],area[href],button,input:not([type="hidden"]),select,textarea,iframe,object,embed,[tabindex],[contenteditable="true"],audio[controls],video[controls]';
+function usable(element: Element | null | undefined): element is HTMLElement {
+  if (!element || !('focus' in element) || !element.isConnected || element.closest('[hidden],[inert]') || element.matches(':disabled,[aria-disabled="true"]')) return false;
+  const doc = element.ownerDocument;
+  const style = doc.defaultView?.getComputedStyle(element);
+  return style?.display !== 'none' && style?.visibility !== 'hidden' && element.getClientRects().length > 0 && element.matches(focusableSelector);
+}
+function focusables(root: HTMLElement) {
+  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(element => usable(element) && element.tabIndex >= 0);
+}
+interface ModalEntry { root: HTMLElement; content: HTMLElement; }
+interface ModalDocument {
+  entries: ModalEntry[];
+  inert: Map<HTMLElement, string | null>;
+  overflow: string;
+  priority: string;
+  observer?: MutationObserver;
+}
+const documents = new WeakMap<Document, ModalDocument>();
+function refreshIsolation(doc: Document, state: ModalDocument) {
+  for (const [element, attribute] of state.inert) {
+    if (attribute === null) element.removeAttribute('inert'); else element.setAttribute('inert', attribute);
+  }
+  state.inert.clear();
+  let branch: HTMLElement | null = state.entries.at(-1)?.root ?? null;
+  while (branch?.parentElement) {
+    for (const sibling of branch.parentElement.children) {
+      if (sibling === branch || !(sibling instanceof (doc.defaultView?.HTMLElement ?? HTMLElement))) continue;
+      const element = sibling as HTMLElement;
+      state.inert.set(element, element.getAttribute('inert'));
+      element.inert = true;
+    }
+    if (branch.parentElement === doc.body) break;
+    branch = branch.parentElement;
+  }
+}
+function register(doc: Document, entry: ModalEntry) {
+  let state = documents.get(doc);
+  if (!state) { state = { entries: [], inert: new Map(), overflow: '', priority: '' }; documents.set(doc, state); }
+  if (!state.entries.length) {
+    state.overflow = doc.body.style.getPropertyValue('overflow'); state.priority = doc.body.style.getPropertyPriority('overflow');
+    doc.body.style.setProperty('overflow', 'hidden');
+    state.observer = new MutationObserver(() => refreshIsolation(doc, state!));
+    state.observer.observe(doc.body, { childList: true, subtree: true });
+  }
+  state.entries.push(entry); entry.root.style.zIndex = String(1000 + state.entries.length);
+  refreshIsolation(doc, state);
+  return {
+    top: () => state!.entries.at(-1) === entry,
+    release: () => {
+      const index = state!.entries.indexOf(entry); if (index < 0) return;
+      state!.entries.splice(index, 1); refreshIsolation(doc, state!);
+      if (!state!.entries.length) {
+        state!.observer?.disconnect();
+        if (state!.overflow) doc.body.style.setProperty('overflow', state!.overflow, state!.priority); else doc.body.style.removeProperty('overflow');
+      }
+    },
+  };
+}
+function restoreFocus(doc: Document, opener: HTMLElement | undefined, ancestors: HTMLElement[], returnId: string | undefined) {
+  const target = usable(opener) ? opener : (returnId && usable(doc.getElementById(returnId)) ? doc.getElementById(returnId) as HTMLElement : ancestors.find(usable));
+  if (target) { target.focus({ preventScroll: true }); return; }
+  // A parent modal still owns focus if an open child was removed with its opener.
+  const parent = documents.get(doc)?.entries.at(-1)?.content;
+  if (parent) { parent.focus({ preventScroll: true }); return; }
+  const previous = doc.body.getAttribute('tabindex');
+  doc.body.setAttribute('tabindex', '-1'); doc.body.focus({ preventScroll: true });
+  if (previous === null) doc.body.removeAttribute('tabindex'); else doc.body.setAttribute('tabindex', previous);
+}
+
+/** A Solid-owned portal and actual-open lifecycle; rejected controlled requests retain isolation. */
+export function Modal(props: ModalProps) {
+  const [local, rest] = splitProps(props, ['title', 'titleId', 'description', 'descriptionId', 'children', 'actions', 'open', 'defaultOpen', 'onOpenChange', 'closeOnOutsideClick', 'showCloseButton', 'initialFocusId', 'returnFocusId', 'closeLabel', 'locale', 'id', 'ref']);
+  const environment = useKrdsEnvironment();
+  const generated = `krds-modal-${createUniqueId()}`;
+  const contentId = () => local.id ?? generated;
+  const controlled = local.open !== undefined;
+  if (controlled && local.defaultOpen !== undefined) throw new TypeError('Modal cannot combine open and defaultOpen');
+  const [internal, setInternal] = createSignal(local.defaultOpen ?? false);
+  const isOpen = createMemo(() => {
+    if ((local.open !== undefined) !== controlled) throw new TypeError('Modal cannot change controlled mode');
+    if (local.title == null || local.title === '') throw new TypeError('Modal requires a visible title');
+    if (local.locale !== undefined && !['ko-KR', 'en-US'].includes(local.locale)) throw new TypeError('Invalid Modal locale');
+    return controlled ? local.open! : internal();
+  });
+  const requestClose = () => {
+    if (!isOpen()) return;
+    if (!controlled) setInternal(false);
+    local.onOpenChange?.({ open: false });
+  };
+  const initiallyOpen = isOpen();
+  let firstOpening = true;
+  function OpenModal() {
+    const doc = environment.getDocument();
+    if (!doc) return null;
+    const active = doc.activeElement;
+    // Initial mount is not an opening action, even when an unrelated control was focused.
+    const withoutOpeningAction = firstOpening && initiallyOpen;
+    firstOpening = false;
+    const opener = !withoutOpeningAction && active !== doc.body && active && 'focus' in active ? active as HTMLElement : undefined;
+    const ancestors: HTMLElement[] = []; let ancestor = opener?.parentElement;
+    while (ancestor && ancestor !== doc.body) { ancestors.push(ancestor); ancestor = ancestor.parentElement; }
+    let root!: HTMLDivElement; let content!: HTMLDivElement;
+    let controller: ReturnType<typeof register> | undefined;
+    let pointerStart: number | undefined;
+    const entryFocus = () => {
+      const first = focusables(content)[0];
+      const requested = local.initialFocusId ? doc.getElementById(local.initialFocusId) : content;
+      if (requested !== content && requested !== first) throw new TypeError('Modal initialFocusId must identify the dialog or its first interactive element');
+      (requested as HTMLElement).focus({ preventScroll: true });
+    };
+    const keydown = (event: KeyboardEvent) => {
+      if (!controller?.top() || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
+      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); requestClose(); }
+      else if (event.key === 'Tab') {
+        const elements = focusables(content); const first = elements[0]; const last = elements.at(-1);
+        if (!first) { event.preventDefault(); content.focus(); }
+        else if (event.shiftKey && (doc.activeElement === first || doc.activeElement === content)) { event.preventDefault(); last!.focus(); }
+        else if (!event.shiftKey && (doc.activeElement === last || doc.activeElement === content)) { event.preventDefault(); first.focus(); }
+      }
+    };
+    const focusin = (event: FocusEvent) => { if (controller?.top() && !content.contains(event.target as Node)) content.focus({ preventScroll: true }); };
+    onMount(() => {
+      controller = register(doc, { root, content });
+      doc.addEventListener('keydown', keydown); doc.addEventListener('focusin', focusin);
+      // Portal content is attached before onMount, and configuration errors remain catchable by Solid ErrorBoundary.
+      if (local.showCloseButton === false && !focusables(content).some(element => element.matches('button,[role="button"]'))) throw new TypeError('Modal without its icon close button requires an enabled explicit close action');
+      entryFocus();
+    });
+    onCleanup(() => {
+      doc.removeEventListener('keydown', keydown); doc.removeEventListener('focusin', focusin);
+      const wasTop = controller?.top(); controller?.release();
+      if (wasTop) restoreFocus(doc, opener, ancestors, untrack(() => local.returnFocusId));
+    });
+    return <Portal mount={doc.body}><div ref={root} data-krds-component="modal" data-krds-part="root" data-krds-state="open" dir={rest.dir ?? environment.direction()} lang={(local.locale ?? environment.locale()).slice(0, 2)} style={{ position: 'fixed', inset: '0', 'z-index': '1000' }}>
+      <div data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open"
+        onPointerDown={event => { pointerStart = controller?.top() && event.target === event.currentTarget && event.button === 0 && event.isPrimary ? event.pointerId : undefined; }}
+        onPointerCancel={() => { pointerStart = undefined; }}
+        onPointerUp={event => { const dismiss = pointerStart === event.pointerId && event.target === event.currentTarget && event.button === 0 && event.isPrimary; pointerStart = undefined; if (dismiss && local.closeOnOutsideClick && controller?.top()) requestClose(); }} />
+      <div {...rest} ref={element => { content = element; if (typeof local.ref === 'function') local.ref(element); }} id={contentId()} role="dialog" aria-modal="true" aria-labelledby={local.titleId ?? `${contentId()}-title`} aria-describedby={local.description != null ? local.descriptionId ?? `${contentId()}-description` : undefined} tabIndex={-1} data-krds-component="modal" data-krds-part="content" data-krds-state="open">
+        <h2 id={local.titleId ?? `${contentId()}-title`} data-krds-component="modal" data-krds-part="title" data-krds-state="">{local.title}</h2>
+        <Show when={local.description != null}><div id={local.descriptionId ?? `${contentId()}-description`} data-krds-component="modal" data-krds-part="description" data-krds-state="">{local.description}</div></Show>
+        <div data-krds-component="modal" data-krds-part="body" data-krds-state="">{local.children}</div>
+        <Show when={local.actions != null}><div data-krds-component="modal" data-krds-part="actions" data-krds-state="">{local.actions}</div></Show>
+        <Show when={local.showCloseButton !== false}><button type="button" aria-label={local.closeLabel ?? ((local.locale ?? environment.locale()) === 'en-US' ? 'Close' : '닫기')} onClick={requestClose} data-krds-component="modal" data-krds-part="close" data-krds-state=""><span aria-hidden="true">×</span></button></Show>
+      </div>
+    </div></Portal>;
+  }
+  return <Show when={isOpen()}><OpenModal /></Show>;
+}
```

## apps/fixture-solid/tests/siheom/modal.test.tsx

```diff
--- base/apps/fixture-solid/tests/siheom/modal.test.tsx
+++ apps/fixture-solid/tests/siheom/modal.test.tsx
@@ -0,0 +1,118 @@
+import { afterEach, expect, test } from 'vitest';
+import { cleanup, render } from '@solidjs/testing-library';
+import { createSignal, Show } from 'solid-js';
+import { given, runSiheom } from '@siheom/solid';
+import userEvent from '@testing-library/user-event';
+import * as Native from '@krds-native/solid';
+
+afterEach(cleanup);
+const tick = async () => { await Promise.resolve(); await Promise.resolve(); };
+const modal = () => { expect(Native).toHaveProperty('Modal'); return (Native as any).Modal; };
+const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')!;
+const key = (name: string, extras: KeyboardEventInit = {}) => document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...extras }));
+
+test('modal has native dialog semantics, final close control and default contextual focus', async () => {
+  const Modal = modal();
+  await runSiheom(given.render(() => <Modal defaultOpen title="확인" description="설명" actions={<button>확인 동작</button>}><input aria-label="입력" /></Modal>));
+  await tick();
+  expect(dialog().getAttribute('aria-modal')).toBe('true');
+  expect(document.getElementById(dialog().getAttribute('aria-labelledby')!)?.textContent).toBe('확인');
+  expect(document.getElementById(dialog().getAttribute('aria-describedby')!)?.textContent).toBe('설명');
+  expect(document.activeElement).toBe(dialog());
+  expect(dialog().lastElementChild?.getAttribute('data-krds-part')).toBe('close');
+  expect(dialog().lastElementChild?.getAttribute('type')).toBe('button');
+});
+
+test('modal rejected controlled Escape retains isolation until prop close and restores usable opener first', async () => {
+  const Modal = modal(); const events: unknown[] = [];
+  let setOpen!: (value: boolean) => void;
+  render(() => { const [open, update] = createSignal(false); setOpen = update; return <><button id="opener" onClick={() => update(true)}>열기</button><button id="fallback">다음 작업</button><Modal open={open()} title="확인" returnFocusId="fallback" onOpenChange={(detail: unknown) => events.push(detail)}><button>본문</button></Modal></>; });
+  const opener = document.getElementById('opener')!; opener.focus(); opener.click(); await tick();
+  expect(document.activeElement).toBe(dialog());
+  expect(document.body.style.overflow).toBe('hidden');
+  expect(opener.closest('[inert]')).not.toBeNull();
+  key('Escape'); await tick();
+  expect(events).toEqual([{ open: false }]);
+  expect(dialog()).not.toBeNull(); expect(document.activeElement).toBe(dialog());
+  expect(opener.closest('[inert]')).not.toBeNull();
+  setOpen(false); await tick();
+  expect(document.querySelector('[role="dialog"]')).toBeNull();
+  expect(document.activeElement).toBe(opener);
+  expect(document.body.style.overflow).not.toBe('hidden');
+  expect(events).toHaveLength(1);
+});
+
+test('modal cycles Tab and Shift+Tab and ignores composing/handled Escape', async () => {
+  const Modal = modal(); const events: unknown[] = [];
+  render(() => <Modal defaultOpen title="확인" onOpenChange={(d: unknown) => events.push(d)}><button id="first">첫 동작</button><button onKeyDown={e => { if (e.key === 'Escape') e.preventDefault(); }}>내부</button></Modal>);
+  await tick(); const first = document.getElementById('first')!; const close = dialog().lastElementChild as HTMLElement;
+  close.focus(); key('Tab'); expect(document.activeElement).toBe(first);
+  first.focus(); key('Tab', { shiftKey: true }); expect(document.activeElement).toBe(close);
+  key('Escape', { isComposing: true }); expect(events).toHaveLength(0);
+  (dialog().querySelectorAll('button')[1] as HTMLElement).focus(); key('Escape'); expect(events).toHaveLength(0);
+  first.focus(); key('Escape'); await tick(); expect(events).toEqual([{ open: false }]); expect(dialog()).toBeNull();
+});
+
+test('modal removes opener safely, restores supplied fallback and cleans up on unmount without events', async () => {
+  const Modal = modal(); const events: unknown[] = []; let remove!: () => void; let hide!: () => void;
+  render(() => { const [opened, setOpen] = createSignal(false); const [opener, setOpener] = createSignal(true); const [mounted, setMounted] = createSignal(true); remove = () => setOpener(false); hide = () => setMounted(false); return <><Show when={opener()}><button id="remove-opener" onClick={() => setOpen(true)}>열기</button></Show><button id="next-task">다음 작업</button><Show when={mounted()}><Modal open={opened()} title="확인" returnFocusId="next-task" onOpenChange={(d: unknown) => events.push(d)} /></Show></>; });
+  document.getElementById('remove-opener')!.focus(); document.getElementById('remove-opener')!.click(); await tick(); remove(); hide(); await tick();
+  expect(document.activeElement).toBe(document.getElementById('next-task')); expect(document.body.style.overflow).not.toBe('hidden'); expect(document.querySelector('[inert]')).toBeNull(); expect(events).toEqual([]);
+});
+
+test('modal honors first interactive initial focus and only complete primary backdrop gestures dismiss', async () => {
+  const Modal = modal(); const events: unknown[] = [];
+  render(() => <Modal defaultOpen title="확인" initialFocusId="entry" closeOnOutsideClick onOpenChange={(d: unknown) => events.push(d)}><button id="entry">첫 동작</button></Modal>); await tick();
+  expect(document.activeElement).toBe(document.getElementById('entry'));
+  const backdrop = document.querySelector<HTMLElement>('[data-krds-component="modal"][data-krds-part="backdrop"]')!;
+  const pointer = (target: HTMLElement, type: string, button = 0) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, button, pointerId: 1, isPrimary: true }));
+  pointer(dialog(), 'pointerdown'); pointer(backdrop, 'pointerup'); expect(events).toHaveLength(0);
+  pointer(backdrop, 'pointerdown', 2); pointer(backdrop, 'pointerup', 2); expect(events).toHaveLength(0);
+  pointer(backdrop, 'pointerdown'); pointer(backdrop, 'pointerup'); await tick(); expect(events).toEqual([{ open: false }]);
+});
+
+test('modal nested topmost isolation, Escape and focus restoration preserve parent', async () => {
+  const Modal = modal(); const user = userEvent.setup();
+  render(() => { const [child, setChild] = createSignal(false); return <Modal defaultOpen title="부모"><button id="child-opener" onClick={() => setChild(true)}>자식 열기</button><Modal open={child()} title="자식" onOpenChange={(d: {open: boolean}) => setChild(d.open)} /></Modal>; });
+  await tick(); await user.click(document.getElementById('child-opener')!); await tick();
+  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
+  key('Escape'); await tick();
+  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1); expect(document.activeElement).toBe(document.getElementById('child-opener')); expect(document.body.style.overflow).toBe('hidden');
+});
+
+test('modal preserves previous inert and scroll states and defaults backdrop to no dismissal', async () => {
+  const Modal = modal(); const preserved = document.createElement('aside'); preserved.inert = true; document.body.append(preserved); const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'clip';
+  try {
+    const result = render(() => <Modal defaultOpen title="기본" />); await tick();
+    document.querySelector<HTMLElement>('[data-krds-part="backdrop"]')!.click(); expect(dialog()).not.toBeNull();
+    result.unmount(); await tick(); expect(preserved.inert).toBe(true); expect(document.body.style.overflow).toBe('clip');
+  } finally { preserved.remove(); document.body.style.overflow = oldOverflow; }
+});
+
+test('modal rejects controlled/default conflict and later initial focus target', async () => {
+  const Modal = modal();
+  expect(() => render(() => <Modal title="충돌" open defaultOpen />)).toThrow(TypeError);
+  // Initial focus validation occurs after portal mount, so error boundary catches it reactively.
+  let thrown: unknown;
+  const { ErrorBoundary } = await import('solid-js');
+  render(() => <ErrorBoundary fallback={error => { thrown = error; return <p>설정 오류</p>; }}><Modal title="잘못된 초점" defaultOpen initialFocusId="later"><button>첫 동작</button><button id="later">나중 동작</button></Modal></ErrorBoundary>);
+  await tick(); expect(thrown).toBeInstanceOf(TypeError);
+});
+
+test('an initially open modal has no opener and uses fallback even if another control had focus', async () => {
+  const Modal = modal();
+  const unrelated = document.createElement('button'); unrelated.textContent = '다른 작업'; document.body.append(unrelated); unrelated.focus();
+  try {
+    const result = render(() => <><button id="initial-fallback">다음 작업</button><Modal defaultOpen title="초기 안내" returnFocusId="initial-fallback" /></>); await tick();
+    dialog().querySelector<HTMLButtonElement>('[data-krds-part="close"]')!.click(); await tick();
+    expect(document.activeElement).toBe(document.getElementById('initial-fallback')); result.unmount();
+  } finally { unrelated.remove(); }
+});
+
+test('removing an open parent with its nested modal restores the outer opener', async () => {
+  const Modal = modal(); let remove!: () => void;
+  render(() => { const [open, setOpen] = createSignal(false); const [mounted, setMounted] = createSignal(true); const [child, setChild] = createSignal(false); remove = () => setMounted(false); return <><button id="outer-opener" onClick={() => setOpen(true)}>바깥 열기</button><Show when={mounted()}><Modal open={open()} title="부모 제거"><button id="nested-opener" onClick={() => setChild(true)}>안쪽 열기</button><Modal open={child()} title="자식 제거" /></Modal></Show></>; });
+  document.getElementById('outer-opener')!.focus(); document.getElementById('outer-opener')!.click(); await tick();
+  document.getElementById('nested-opener')!.focus(); document.getElementById('nested-opener')!.click(); await tick();
+  remove(); await tick(); expect(document.querySelector('[role="dialog"]')).toBeNull(); expect(document.activeElement).toBe(document.getElementById('outer-opener')); expect(document.body.style.overflow).not.toBe('hidden');
+});
```

## apps/storybook-solid/src/stories/modal.stories.tsx

```diff
--- base/apps/storybook-solid/src/stories/modal.stories.tsx
+++ apps/storybook-solid/src/stories/modal.stories.tsx
@@ -0,0 +1,19 @@
+import type { Meta, StoryObj } from 'storybook-solidjs-vite';
+import { createSignal } from 'solid-js';
+import { Modal, type ModalProps } from '@krds-native/solid';
+
+function LocalModal(args: ModalProps) {
+  const [open, setOpen] = createSignal(args.open ?? false);
+  return <><button type="button" onClick={() => setOpen(true)}>열기</button><button id="story-modal-next-task" type="button">다음 작업</button><Modal {...args} open={open()} onOpenChange={detail => setOpen(detail.open)} returnFocusId="story-modal-next-task" actions={<button type="button" onClick={() => setOpen(false)}>확인</button>}>{args.children ?? <p>변경 내용을 확인한 후 계속하세요.</p>}</Modal></>;
+}
+const meta = {
+  id: 'krds-modal', title: 'KRDS/Modal', component: Modal,
+  args: { title: '확인', description: '이 작업의 내용을 확인하세요.', open: false },
+  render: args => <LocalModal {...args} />,
+} satisfies Meta<typeof Modal>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+export const Default: Story = {};
+export const Open: Story = { args: { open: true } };
+export const Error: Story = { args: { open: true, children: <p role="alert">저장하지 못했습니다. 내용을 확인하세요.</p> } };
+export const Loading: Story = { args: { open: true, children: <p role="status" aria-busy="true">처리 중입니다.</p> } };
```

## packages/solid/src/components/tabs/index.tsx

```diff
--- base/packages/solid/src/components/tabs/index.tsx
+++ packages/solid/src/components/tabs/index.tsx
@@ -0,0 +1,109 @@
+import { createEffect, createMemo, createSignal, createUniqueId, For, onCleanup, onMount, splitProps, type JSX } from 'solid-js';
+import type { ValueChangeDetails } from '@krds-native/contracts';
+import { useKrdsEnvironment } from '../../providers';
+
+export interface TabItem {
+  value: string;
+  label: JSX.Element;
+  content: JSX.Element;
+  disabled?: boolean;
+  /** Stable tab ID; its panel uses this ID followed by "-panel". */
+  id?: string;
+}
+export interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
+  items: readonly TabItem[];
+  label?: JSX.Element;
+  value?: string;
+  defaultValue?: string;
+  onValueChange?: (details: ValueChangeDetails<string>) => void;
+  activationMode?: 'manual' | 'automatic';
+  orientation?: 'horizontal' | 'vertical';
+}
+
+const focusableSelector = 'a[href],button:not(:disabled),input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
+
+/** Native Solid tabs. All enabled tabs participate in sequential keyboard navigation. */
+export function Tabs(props: TabsProps) {
+  const [local, rest] = splitProps(props, ['items', 'label', 'value', 'defaultValue', 'onValueChange', 'activationMode', 'orientation', 'id', 'aria-label', 'aria-labelledby']);
+  const environment = useKrdsEnvironment();
+  const generated = `krds-tabs-${createUniqueId()}`;
+  const rootId = () => local.id ?? generated;
+  const controlled = local.value !== undefined;
+  if (controlled && local.defaultValue !== undefined) throw new TypeError('Tabs cannot combine value and defaultValue');
+  const initial = local.defaultValue ?? local.items.find(item => !item.disabled)?.value ?? '';
+  const [internal, setInternal] = createSignal(initial);
+  const ids = new Map<string, string>();
+  const tabId = (item: TabItem) => {
+    if (item.id) return item.id;
+    if (!ids.has(item.value)) ids.set(item.value, `${generated}-item-${ids.size + 1}`);
+    return ids.get(item.value)!;
+  };
+  const selected = createMemo(() => {
+    if ((local.value !== undefined) !== controlled) throw new TypeError('Tabs cannot change controlled mode');
+    if (local.activationMode !== undefined && !['manual', 'automatic'].includes(local.activationMode)) throw new TypeError('Invalid Tabs activationMode');
+    if (local.orientation !== undefined && !['horizontal', 'vertical'].includes(local.orientation)) throw new TypeError('Invalid Tabs orientation');
+    if (local.label == null && !local['aria-label'] && !local['aria-labelledby']) throw new TypeError('Tabs requires an accessible tablist label');
+    const values = new Set<string>(); const domIds = new Set<string>([rootId(), `${rootId()}-label`]);
+    for (const item of local.items) {
+      if (typeof item.value !== 'string' || !item.value.trim() || values.has(item.value)) throw new TypeError('Tabs requires unique nonempty item values');
+      values.add(item.value);
+      if (item.id !== undefined && !item.id.trim()) throw new TypeError('Tabs item IDs cannot be empty');
+      for (const id of [tabId(item), `${tabId(item)}-panel`]) {
+        if (domIds.has(id)) throw new TypeError('Tabs requires unique item IDs');
+        domIds.add(id);
+      }
+    }
+    const value = controlled ? local.value! : internal();
+    const enabled = local.items.filter(item => !item.disabled);
+    if (enabled.length ? !enabled.some(item => item.value === value) : value !== '') throw new TypeError('Tabs selection must identify an enabled item');
+    return value;
+  });
+  let list!: HTMLDivElement;
+  let pointerFocused: string | undefined;
+  let pointerGesture = false;
+  const request = (item: TabItem) => {
+    if (item.disabled || item.value === selected()) return;
+    if (!controlled) setInternal(item.value);
+    local.onValueChange?.({ value: item.value });
+  };
+  const navigate = (event: KeyboardEvent, item: TabItem) => {
+    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
+    const enabled = local.items.filter(option => !option.disabled);
+    const index = enabled.findIndex(option => option.value === item.value);
+    const previous = local.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
+    const next = local.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
+    let target: TabItem | undefined;
+    if (event.key === previous) target = enabled[(index - 1 + enabled.length) % enabled.length];
+    else if (event.key === next) target = enabled[(index + 1) % enabled.length];
+    else if (event.key === 'Home') target = enabled[0];
+    else if (event.key === 'End') target = enabled[enabled.length - 1];
+    if (!target) return;
+    event.preventDefault();
+    Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(tab => tab.id === tabId(target!))?.focus();
+  };
+  // Keep validation active even when there are no children to read selected().
+  createEffect(() => { selected(); });
+  return <div {...rest} id={rootId()} dir={rest.dir ?? environment.direction()} data-krds-component="tabs" data-krds-part="root" data-krds-state="">
+    {local.label != null && <div id={`${rootId()}-label`}>{local.label}</div>}
+    <div ref={list} role="tablist" aria-label={local['aria-label']} aria-labelledby={local['aria-labelledby'] ?? (local.label != null ? `${rootId()}-label` : undefined)} aria-orientation={local.orientation ?? 'horizontal'} data-krds-component="tabs" data-krds-part="list" data-krds-state="" data-krds-orientation={local.orientation ?? 'horizontal'}>
+      <For each={local.items}>{item => <button type="button" role="tab" id={tabId(item)} disabled={item.disabled} tabIndex={item.disabled ? -1 : 0} aria-selected={selected() === item.value} aria-controls={`${tabId(item)}-panel`} data-krds-component="tabs" data-krds-part="trigger" data-krds-state={[selected() === item.value && 'selected', item.disabled && 'disabled'].filter(Boolean).join(' ')}
+        onPointerDown={event => { pointerGesture = event.button === 0; pointerFocused = undefined; }}
+        onPointerCancel={() => { pointerGesture = false; pointerFocused = undefined; }}
+        onFocus={() => { if (local.activationMode === 'automatic') { if (pointerGesture) pointerFocused = item.value; request(item); } }}
+        onBlur={event => { if (!list.contains(event.relatedTarget as Node | null)) { pointerGesture = false; pointerFocused = undefined; } }}
+        onClick={() => { const paired = pointerFocused === item.value; pointerGesture = false; pointerFocused = undefined; if (!paired) request(item); }}
+        onKeyDown={event => navigate(event, item)}>{item.label}</button>}</For>
+    </div>
+    <For each={local.items}>{item => {
+      let panel!: HTMLDivElement;
+      const [hasFocusable, setHasFocusable] = createSignal(false);
+      const inspect = () => setHasFocusable(Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).some(element => {
+        const style = element.ownerDocument.defaultView?.getComputedStyle(element);
+        return element.tabIndex >= 0 && !element.closest('[hidden],[inert]') && !element.matches(':disabled') && style?.visibility !== 'hidden' && element.getClientRects().length > 0;
+      }));
+      onMount(() => { inspect(); const observer = new MutationObserver(inspect); observer.observe(panel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'tabindex', 'hidden', 'href', 'style', 'class'] }); onCleanup(() => observer.disconnect()); });
+      // The panel remains mounted; selection never recreates its local controls.
+      return <div ref={panel} role="tabpanel" id={`${tabId(item)}-panel`} aria-labelledby={tabId(item)} hidden={selected() !== item.value} tabIndex={hasFocusable() ? undefined : 0} data-krds-component="tabs" data-krds-part="panel" data-krds-state={selected() === item.value ? 'active' : 'inactive'}>{item.content}</div>;
+    }}</For>
+  </div>;
+}
```

## apps/fixture-solid/tests/siheom/tabs.test.tsx

```diff
--- base/apps/fixture-solid/tests/siheom/tabs.test.tsx
+++ apps/fixture-solid/tests/siheom/tabs.test.tsx
@@ -0,0 +1,77 @@
+import { afterEach, expect, test } from 'vitest';
+import { cleanup, render } from '@solidjs/testing-library';
+import { createSignal } from 'solid-js';
+import { given, runSiheom } from '@siheom/solid';
+import userEvent from '@testing-library/user-event';
+import * as Native from '@krds-native/solid';
+
+afterEach(cleanup);
+const tabs = () => { expect(Native).toHaveProperty('Tabs'); return (Native as any).Tabs; };
+const items = () => [{ value: 'first', label: '첫 번째', content: <input aria-label="유지 입력" /> }, { value: 'disabled', label: '비활성', content: '숨김', disabled: true }, { value: 'second', label: '두 번째', content: '둘째 내용' }];
+const all = () => [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
+const key = (name: string) => document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
+
+test('tabs preserve sequential access and manual selection while arrows skip disabled tabs', async () => {
+  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
+  await runSiheom(given.render(() => <Tabs label="정보" items={items()} onValueChange={(d: unknown) => events.push(d)} />));
+  expect(all().map(tab => tab.tabIndex)).toEqual([0, -1, 0]);
+  all()[0]!.focus(); key('ArrowRight'); expect(document.activeElement).toBe(all()[2]); expect(all()[0]!.getAttribute('aria-selected')).toBe('true'); expect(events).toEqual([]);
+  await user.keyboard('{Enter}'); expect(all()[2]!.getAttribute('aria-selected')).toBe('true'); expect(events).toEqual([{ value: 'second' }]);
+  all()[0]!.focus(); await user.tab(); expect(document.activeElement).toBe(all()[2]);
+  key('Home'); expect(document.activeElement).toBe(all()[0]); key('End'); expect(document.activeElement).toBe(all()[2]);
+  key('ArrowRight'); expect(document.activeElement).toBe(all()[0]);
+});
+
+test('tabs retain hidden panel state, stable relationships and emit no programmatic changes', async () => {
+  const Tabs = tabs(); const events: unknown[] = []; let select!: (value: string) => void;
+  render(() => { const [value, setValue] = createSignal('first'); select = setValue; return <Tabs id="stable" label="정보" items={items()} value={value()} onValueChange={(d: unknown) => events.push(d)} />; });
+  const entry = document.querySelector<HTMLInputElement>('input')!; entry.value = '보존';
+  const ids = all().map(tab => tab.id); const focused = document.activeElement;
+  select('second'); expect(document.activeElement).toBe(focused); expect(events).toEqual([]); expect(entry.closest('[role="tabpanel"]')!.hasAttribute('hidden')).toBe(true);
+  select('first'); expect(entry.value).toBe('보존'); expect(all().map(tab => tab.id)).toEqual(ids);
+  for (const tab of all()) expect(document.getElementById(tab.getAttribute('aria-controls')!)!.getAttribute('aria-labelledby')).toBe(tab.id);
+  expect(entry.closest('[role="tabpanel"]')!.getAttribute('tabindex')).toBeNull();
+});
+
+test('automatic controlled rejection emits once per focus-click gesture and retries later clicks', async () => {
+  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
+  render(() => <Tabs label="정보" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
+  await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }]); expect(all()[0]!.getAttribute('aria-selected')).toBe('true');
+  await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }, { value: 'second' }]);
+  all()[0]!.focus(); all()[2]!.focus(); expect(events).toHaveLength(3);
+});
+
+test('tabs support vertical keyboard policy, unique instance ids and empty/all-disabled state', () => {
+  const Tabs = tabs();
+  const view = render(() => <><Tabs label="세로" orientation="vertical" items={items()} /><Tabs label="빈 탭" items={[]} /><Tabs label="비활성 탭" items={[{ value: 'off', label: '꺼짐', content: '없음', disabled: true }]} /><Tabs label="두 번째 인스턴스" items={items()} /></>);
+  const first = all()[0]!; first.focus(); expect(key('ArrowRight')).toBe(true); expect(document.activeElement).toBe(first); key('ArrowDown'); expect(document.activeElement).toBe(all()[2]);
+  const ids = [...document.querySelectorAll('[id]')].map(el => el.id); expect(new Set(ids).size).toBe(ids.length);
+  expect(view.getByRole('tablist', { name: '빈 탭' }).querySelector('[aria-selected="true"]')).toBeNull();
+  expect(view.getByRole('tablist', { name: '비활성 탭' }).querySelector('[aria-selected="true"]')).toBeNull();
+});
+
+test('tabs reject duplicate values and invalid selected values as configuration errors', () => {
+  const Tabs = tabs();
+  expect(() => render(() => <Tabs label="중복" items={[...items(), items()[0]!]} />)).toThrow(TypeError);
+  expect(() => render(() => <Tabs label="누락" items={items()} value="absent" />)).toThrow(TypeError);
+  expect(() => render(() => <Tabs label="중복 모드" items={items()} value="first" defaultValue="first" />)).toThrow(TypeError);
+});
+
+test('tabs dynamic items preserve valid selection and defaultValue is read once', () => {
+  const Tabs = tabs(); let change!: () => void; let defaultChange!: (value: string) => void;
+  render(() => { const [options, setOptions] = createSignal(items()); const [initial, setInitial] = createSignal('second'); change = () => setOptions([items()[0]!, items()[2]!, { value: 'third', label: '셋째', content: '셋째 내용' }]); defaultChange = setInitial; return <Tabs label="동적" items={options()} defaultValue={initial()} />; });
+  defaultChange('first'); expect(all().find(tab => tab.getAttribute('aria-selected') === 'true')?.textContent).toBe('두 번째');
+  const selectedId = all()[2]!.id; change(); expect(all().find(tab => tab.getAttribute('aria-selected') === 'true')?.id).toBe(selectedId); expect(all()).toHaveLength(3);
+});
+
+test('automatic click between already focused tabs never duplicates a rejected request', async () => {
+  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
+  render(() => <Tabs label="초점 이동" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
+  all()[0]!.focus(); await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }]);
+});
+
+test('active panels with only hidden content controls remain reachable by Tab', () => {
+  const Tabs = tabs();
+  render(() => <Tabs label="빈 컨트롤" items={[{ value: 'hidden', label: '정보', content: <button hidden>숨겨진 동작</button> }]} />);
+  expect(document.querySelector<HTMLElement>('[role="tabpanel"]')!.tabIndex).toBe(0);
+});
```

## apps/storybook-solid/src/stories/tabs.stories.tsx

```diff
--- base/apps/storybook-solid/src/stories/tabs.stories.tsx
+++ apps/storybook-solid/src/stories/tabs.stories.tsx
@@ -0,0 +1,20 @@
+import type { Meta, StoryObj } from 'storybook-solidjs-vite';
+import { createSignal } from 'solid-js';
+import { Tabs } from '@krds-native/solid';
+
+const items = [
+  { value: 'first', label: '첫 번째', content: <p>첫 번째 정보입니다.</p> },
+  { value: 'second', label: '두 번째', content: <p>두 번째 정보입니다.</p> },
+];
+const meta = {
+  id: 'krds-tabs', title: 'KRDS/Tabs', component: Tabs,
+  args: { label: '정보', items, activationMode: 'manual' },
+} satisfies Meta<typeof Tabs>;
+export default meta;
+type Story = StoryObj<typeof meta>;
+export const Default: Story = {};
+export const Manual: Story = { args: { activationMode: 'manual' } };
+export const Selected: Story = { args: { defaultValue: 'second' } };
+export const Disabled: Story = { args: { items: [...items, { value: 'disabled', label: '비활성', content: <p>사용할 수 없는 정보입니다.</p>, disabled: true }] } };
+export const Automatic: Story = { args: { activationMode: 'automatic' } };
+export const Controlled: Story = { render: args => { const [value, setValue] = createSignal('first'); return <Tabs {...args} value={value()} onValueChange={detail => setValue(detail.value)} />; } };
```
