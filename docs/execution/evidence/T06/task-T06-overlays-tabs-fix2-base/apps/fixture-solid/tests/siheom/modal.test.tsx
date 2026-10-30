import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from '@solidjs/testing-library';
import { createSignal, Show } from 'solid-js';
import { given, runSiheom } from '@siheom/solid';
import userEvent from '@testing-library/user-event';
import * as Native from '@krds-native/solid';

afterEach(cleanup);
const tick = async () => { await Promise.resolve(); await Promise.resolve(); };
const modal = () => { expect(Native).toHaveProperty('Modal'); return (Native as any).Modal; };
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')!;
const key = (name: string, extras: KeyboardEventInit = {}) => document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...extras }));

test('modal has native dialog semantics, final close control and default contextual focus', async () => {
  const Modal = modal();
  await runSiheom(given.render(() => <Modal defaultOpen title="확인" description="설명" actions={<button>확인 동작</button>}><input aria-label="입력" /></Modal>));
  await tick();
  expect(dialog().getAttribute('aria-modal')).toBe('true');
  expect(document.getElementById(dialog().getAttribute('aria-labelledby')!)?.textContent).toBe('확인');
  expect(document.getElementById(dialog().getAttribute('aria-describedby')!)?.textContent).toBe('설명');
  expect(document.activeElement).toBe(dialog());
  expect(dialog().lastElementChild?.getAttribute('data-krds-part')).toBe('close');
  expect(dialog().lastElementChild?.getAttribute('type')).toBe('button');
});

test('modal rejected controlled Escape retains isolation until prop close and restores usable opener first', async () => {
  const Modal = modal(); const events: unknown[] = [];
  let setOpen!: (value: boolean) => void;
  render(() => { const [open, update] = createSignal(false); setOpen = update; return <><button id="opener" onClick={() => update(true)}>열기</button><button id="fallback">다음 작업</button><Modal open={open()} title="확인" returnFocusId="fallback" onOpenChange={(detail: unknown) => events.push(detail)}><button>본문</button></Modal></>; });
  const opener = document.getElementById('opener')!; opener.focus(); opener.click(); await tick();
  expect(document.activeElement).toBe(dialog());
  expect(document.body.style.overflow).toBe('hidden');
  expect(opener.closest('[inert]')).not.toBeNull();
  key('Escape'); await tick();
  expect(events).toEqual([{ open: false }]);
  expect(dialog()).not.toBeNull(); expect(document.activeElement).toBe(dialog());
  expect(opener.closest('[inert]')).not.toBeNull();
  setOpen(false); await tick();
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(document.activeElement).toBe(opener);
  expect(document.body.style.overflow).not.toBe('hidden');
  expect(events).toHaveLength(1);
});

test('modal cycles Tab and Shift+Tab and ignores composing/handled Escape', async () => {
  const Modal = modal(); const events: unknown[] = [];
  render(() => <Modal defaultOpen title="확인" onOpenChange={(d: unknown) => events.push(d)}><button id="first">첫 동작</button><button onKeyDown={e => { if (e.key === 'Escape') e.preventDefault(); }}>내부</button></Modal>);
  await tick(); const first = document.getElementById('first')!; const close = dialog().lastElementChild as HTMLElement;
  close.focus(); key('Tab'); expect(document.activeElement).toBe(first);
  first.focus(); key('Tab', { shiftKey: true }); expect(document.activeElement).toBe(close);
  key('Escape', { isComposing: true }); expect(events).toHaveLength(0);
  (dialog().querySelectorAll('button')[1] as HTMLElement).focus(); key('Escape'); expect(events).toHaveLength(0);
  first.focus(); key('Escape'); await tick(); expect(events).toEqual([{ open: false }]); expect(dialog()).toBeNull();
});

test('modal removes opener safely, restores supplied fallback and cleans up on unmount without events', async () => {
  const Modal = modal(); const events: unknown[] = []; let remove!: () => void; let hide!: () => void;
  render(() => { const [opened, setOpen] = createSignal(false); const [opener, setOpener] = createSignal(true); const [mounted, setMounted] = createSignal(true); remove = () => setOpener(false); hide = () => setMounted(false); return <><Show when={opener()}><button id="remove-opener" onClick={() => setOpen(true)}>열기</button></Show><button id="next-task">다음 작업</button><Show when={mounted()}><Modal open={opened()} title="확인" returnFocusId="next-task" onOpenChange={(d: unknown) => events.push(d)} /></Show></>; });
  document.getElementById('remove-opener')!.focus(); document.getElementById('remove-opener')!.click(); await tick(); remove(); hide(); await tick();
  expect(document.activeElement).toBe(document.getElementById('next-task')); expect(document.body.style.overflow).not.toBe('hidden'); expect(document.querySelector('[inert]')).toBeNull(); expect(events).toEqual([]);
});

test('modal honors first interactive initial focus and only complete primary backdrop gestures dismiss', async () => {
  const Modal = modal(); const events: unknown[] = [];
  render(() => <Modal defaultOpen title="확인" initialFocusId="entry" closeOnOutsideClick onOpenChange={(d: unknown) => events.push(d)}><button id="entry">첫 동작</button></Modal>); await tick();
  expect(document.activeElement).toBe(document.getElementById('entry'));
  const backdrop = document.querySelector<HTMLElement>('[data-krds-component="modal"][data-krds-part="backdrop"]')!;
  const pointer = (target: HTMLElement, type: string, button = 0) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, button, pointerId: 1, isPrimary: true }));
  pointer(dialog(), 'pointerdown'); pointer(backdrop, 'pointerup'); expect(events).toHaveLength(0);
  pointer(backdrop, 'pointerdown', 2); pointer(backdrop, 'pointerup', 2); expect(events).toHaveLength(0);
  pointer(backdrop, 'pointerdown'); pointer(backdrop, 'pointerup'); await tick(); expect(events).toEqual([{ open: false }]);
});

test('modal nested topmost isolation, Escape and focus restoration preserve parent', async () => {
  const Modal = modal(); const user = userEvent.setup();
  render(() => { const [child, setChild] = createSignal(false); return <Modal defaultOpen title="부모"><button id="child-opener" onClick={() => setChild(true)}>자식 열기</button><Modal open={child()} title="자식" onOpenChange={(d: {open: boolean}) => setChild(d.open)} /></Modal>; });
  await tick(); await user.click(document.getElementById('child-opener')!); await tick();
  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(2);
  key('Escape'); await tick();
  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1); expect(document.activeElement).toBe(document.getElementById('child-opener')); expect(document.body.style.overflow).toBe('hidden');
});

test('modal preserves previous inert and scroll states and defaults backdrop to no dismissal', async () => {
  const Modal = modal(); const preserved = document.createElement('aside'); preserved.inert = true; document.body.append(preserved); const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'clip';
  try {
    const result = render(() => <Modal defaultOpen title="기본" />); await tick();
    document.querySelector<HTMLElement>('[data-krds-part="backdrop"]')!.click(); expect(dialog()).not.toBeNull();
    result.unmount(); await tick(); expect(preserved.inert).toBe(true); expect(document.body.style.overflow).toBe('clip');
  } finally { preserved.remove(); document.body.style.overflow = oldOverflow; }
});

test('modal rejects controlled/default conflict and later initial focus target', async () => {
  const Modal = modal();
  expect(() => render(() => <Modal title="충돌" open defaultOpen />)).toThrow(TypeError);
  // Initial focus validation occurs after portal mount, so error boundary catches it reactively.
  let thrown: unknown;
  const { ErrorBoundary } = await import('solid-js');
  render(() => <ErrorBoundary fallback={error => { thrown = error; return <p>설정 오류</p>; }}><Modal title="잘못된 초점" defaultOpen initialFocusId="later"><button>첫 동작</button><button id="later">나중 동작</button></Modal></ErrorBoundary>);
  await tick(); expect(thrown).toBeInstanceOf(TypeError);
});

test('an initially open modal has no opener and uses fallback even if another control had focus', async () => {
  const Modal = modal();
  const unrelated = document.createElement('button'); unrelated.textContent = '다른 작업'; document.body.append(unrelated); unrelated.focus();
  try {
    const result = render(() => <><button id="initial-fallback">다음 작업</button><Modal defaultOpen title="초기 안내" returnFocusId="initial-fallback" /></>); await tick();
    dialog().querySelector<HTMLButtonElement>('[data-krds-part="close"]')!.click(); await tick();
    expect(document.activeElement).toBe(document.getElementById('initial-fallback')); result.unmount();
  } finally { unrelated.remove(); }
});

test('removing an open parent with its nested modal restores the outer opener', async () => {
  const Modal = modal(); let remove!: () => void;
  render(() => { const [open, setOpen] = createSignal(false); const [mounted, setMounted] = createSignal(true); const [child, setChild] = createSignal(false); remove = () => setMounted(false); return <><button id="outer-opener" onClick={() => setOpen(true)}>바깥 열기</button><Show when={mounted()}><Modal open={open()} title="부모 제거"><button id="nested-opener" onClick={() => setChild(true)}>안쪽 열기</button><Modal open={child()} title="자식 제거" /></Modal></Show></>; });
  document.getElementById('outer-opener')!.focus(); document.getElementById('outer-opener')!.click(); await tick();
  document.getElementById('nested-opener')!.focus(); document.getElementById('nested-opener')!.click(); await tick();
  remove(); await tick(); expect(document.querySelector('[role="dialog"]')).toBeNull(); expect(document.activeElement).toBe(document.getElementById('outer-opener')); expect(document.body.style.overflow).not.toBe('hidden');
});

test('modal cannot reuse backdrop ownership across two different pointer gestures', async () => {
  const Modal = modal(); const events: unknown[] = [];
  render(() => <Modal open title="포인터 경계" closeOnOutsideClick onOpenChange={(d: unknown) => events.push(d)}><button>내용 동작</button></Modal>); await tick();
  const backdrop = document.querySelector<HTMLElement>('[data-krds-part="backdrop"]')!;
  const pointer = (target: HTMLElement, type: string) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, isPrimary: true }));
  pointer(backdrop, 'pointerdown'); pointer(dialog(), 'pointerup');
  pointer(dialog(), 'pointerdown'); pointer(backdrop, 'pointerup');
  expect(events).toEqual([]); expect(dialog()).not.toBeNull();
  pointer(backdrop, 'pointerdown'); pointer(backdrop, 'pointerup'); expect(events).toEqual([{ open: false }]);
});

test('modal rejects blank primitive titles and blank explicit icon labels', () => {
  const Modal = modal();
  for (const title of ['', '   ', false]) expect(() => render(() => <Modal title={title} />)).toThrow(TypeError);
  for (const closeLabel of ['', '   ']) expect(() => render(() => <Modal title="명명된 대화상자" closeLabel={closeLabel} />)).toThrow(TypeError);
});
