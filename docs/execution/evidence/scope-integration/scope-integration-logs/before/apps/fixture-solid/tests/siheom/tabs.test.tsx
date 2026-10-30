import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { given, runSiheom } from '@siheom/solid';
import userEvent from '@testing-library/user-event';
import * as Native from '@krds-native/solid';

afterEach(cleanup);
const tabs = () => { expect(Native).toHaveProperty('Tabs'); return (Native as any).Tabs; };
const items = () => [{ value: 'first', label: '첫 번째', content: <input aria-label="유지 입력" /> }, { value: 'disabled', label: '비활성', content: '숨김', disabled: true }, { value: 'second', label: '두 번째', content: '둘째 내용' }];
const all = () => [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
const key = (name: string) => document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));

test('tabs preserve sequential access and manual selection while arrows skip disabled tabs', async () => {
  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
  await runSiheom(given.render(() => <Tabs label="정보" items={items()} onValueChange={(d: unknown) => events.push(d)} />));
  expect(all().map(tab => tab.tabIndex)).toEqual([0, -1, 0]);
  all()[0]!.focus(); key('ArrowRight'); expect(document.activeElement).toBe(all()[2]); expect(all()[0]!.getAttribute('aria-selected')).toBe('true'); expect(events).toEqual([]);
  await user.keyboard('{Enter}'); expect(all()[2]!.getAttribute('aria-selected')).toBe('true'); expect(events).toEqual([{ value: 'second' }]);
  all()[0]!.focus(); await user.tab(); expect(document.activeElement).toBe(all()[2]);
  key('Home'); expect(document.activeElement).toBe(all()[0]); key('End'); expect(document.activeElement).toBe(all()[2]);
  key('ArrowRight'); expect(document.activeElement).toBe(all()[0]);
});

test('tabs retain hidden panel state, stable relationships and emit no programmatic changes', async () => {
  const Tabs = tabs(); const events: unknown[] = []; let select!: (value: string) => void;
  render(() => { const [value, setValue] = createSignal('first'); select = setValue; return <Tabs id="stable" label="정보" items={items()} value={value()} onValueChange={(d: unknown) => events.push(d)} />; });
  const entry = document.querySelector<HTMLInputElement>('input')!; entry.value = '보존';
  const ids = all().map(tab => tab.id); const focused = document.activeElement;
  select('second'); expect(document.activeElement).toBe(focused); expect(events).toEqual([]); expect(entry.closest('[role="tabpanel"]')!.hasAttribute('hidden')).toBe(true);
  select('first'); expect(entry.value).toBe('보존'); expect(all().map(tab => tab.id)).toEqual(ids);
  for (const tab of all()) expect(document.getElementById(tab.getAttribute('aria-controls')!)!.getAttribute('aria-labelledby')).toBe(tab.id);
  expect(entry.closest('[role="tabpanel"]')!.getAttribute('tabindex')).toBeNull();
});

test('automatic controlled rejection emits once per focus-click gesture and retries later clicks', async () => {
  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
  render(() => <Tabs label="정보" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
  await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }]); expect(all()[0]!.getAttribute('aria-selected')).toBe('true');
  await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }, { value: 'second' }]);
  all()[0]!.focus(); all()[2]!.focus(); expect(events).toHaveLength(3);
});

test('tabs support vertical keyboard policy, unique instance ids and empty/all-disabled state', () => {
  const Tabs = tabs();
  const view = render(() => <><Tabs label="세로" orientation="vertical" items={items()} /><Tabs label="빈 탭" items={[]} /><Tabs label="비활성 탭" items={[{ value: 'off', label: '꺼짐', content: '없음', disabled: true }]} /><Tabs label="두 번째 인스턴스" items={items()} /></>);
  const first = all()[0]!; first.focus(); expect(key('ArrowRight')).toBe(true); expect(document.activeElement).toBe(first); key('ArrowDown'); expect(document.activeElement).toBe(all()[2]);
  const ids = [...document.querySelectorAll('[id]')].map(el => el.id); expect(new Set(ids).size).toBe(ids.length);
  expect(view.getByRole('tablist', { name: '빈 탭' }).querySelector('[aria-selected="true"]')).toBeNull();
  expect(view.getByRole('tablist', { name: '비활성 탭' }).querySelector('[aria-selected="true"]')).toBeNull();
});

test('tabs reject duplicate values and invalid selected values as configuration errors', () => {
  const Tabs = tabs();
  expect(() => render(() => <Tabs label="중복" items={[...items(), items()[0]!]} />)).toThrow(TypeError);
  expect(() => render(() => <Tabs label="누락" items={items()} value="absent" />)).toThrow(TypeError);
  expect(() => render(() => <Tabs label="중복 모드" items={items()} value="first" defaultValue="first" />)).toThrow(TypeError);
});

test('tabs dynamic items preserve valid selection and defaultValue is read once', () => {
  const Tabs = tabs(); let change!: () => void; let defaultChange!: (value: string) => void;
  render(() => { const [options, setOptions] = createSignal(items()); const [initial, setInitial] = createSignal('second'); change = () => setOptions([items()[0]!, items()[2]!, { value: 'third', label: '셋째', content: '셋째 내용' }]); defaultChange = setInitial; return <Tabs label="동적" items={options()} defaultValue={initial()} />; });
  defaultChange('first'); expect(all().find(tab => tab.getAttribute('aria-selected') === 'true')?.textContent).toBe('두 번째');
  const selectedId = all()[2]!.id; change(); expect(all().find(tab => tab.getAttribute('aria-selected') === 'true')?.id).toBe(selectedId); expect(all()).toHaveLength(3);
});

test('automatic click between already focused tabs never duplicates a rejected request', async () => {
  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
  render(() => <Tabs label="초점 이동" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
  all()[0]!.focus(); await user.click(all()[2]!); expect(events).toEqual([{ value: 'second' }]);
});

test('active panels with only hidden content controls remain reachable by Tab', () => {
  const Tabs = tabs();
  render(() => <Tabs label="빈 컨트롤" items={[{ value: 'hidden', label: '정보', content: <button hidden>숨겨진 동작</button> }]} />);
  expect(document.querySelector<HTMLElement>('[role="tabpanel"]')!.tabIndex).toBe(0);
});

test('an abandoned tab pointer gesture cannot suppress a later rejected keyboard retry', async () => {
  const Tabs = tabs(); const events: unknown[] = []; const user = userEvent.setup();
  render(() => <><Tabs label="방치된 포인터" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} /><button id="outside-pointer">바깥</button></>);
  all()[0]!.focus();
  all()[0]!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 7, isPrimary: true }));
  document.getElementById('outside-pointer')!.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 7, isPrimary: true }));
  all()[2]!.focus(); expect(events).toEqual([{ value: 'second' }]);
  await user.keyboard('{Enter}'); expect(events).toEqual([{ value: 'second' }, { value: 'second' }]);
  await user.keyboard(' '); expect(events).toHaveLength(3);
});

test('tab panels retain their context stop when text precedes a later or nested control', async () => {
  const Tabs = tabs();
  const view = render(() => <>
    <Tabs label="본문 먼저" items={[{ value: 'text', label: '본문', content: <><p>먼저 읽을 설명</p><button>나중 동작</button></> }]} />
    <Tabs label="직접 동작 먼저" items={[{ value: 'action', label: '동작', content: <><button>첫 동작</button><p>뒤 설명</p></> }]} />
    <Tabs label="중첩 동작" items={[{ value: 'nested', label: '중첩', content: <div><button>중첩 동작</button></div> }]} />
    <Tabs label="숨김 첫 동작" items={[{ value: 'hidden', label: '숨김', content: <><button hidden>숨김</button><button>보이는 나중 동작</button></> }]} />
  </>);
  const panels = view.getAllByRole('tabpanel');
  expect(panels[0]!.tabIndex).toBe(0); expect(panels[1]!.hasAttribute('tabindex')).toBe(false); expect(panels[2]!.tabIndex).toBe(0); expect(panels[3]!.tabIndex).toBe(0);
  const user = userEvent.setup(); view.getByRole('tab', { name: '본문' }).focus(); await user.tab(); expect(document.activeElement).toBe(panels[0]);
});

test('tabs reject blank primitive names and ignore blank naming overrides when another valid name exists', () => {
  const Tabs = tabs();
  for (const label of ['', '   ', false]) expect(() => render(() => <Tabs label={label} items={items()} />)).toThrow(TypeError);
  expect(() => render(() => <Tabs aria-label="   " items={items()} />)).toThrow(TypeError);
  expect(() => render(() => <Tabs aria-labelledby="   " items={items()} />)).toThrow(TypeError);
  const view = render(() => <><Tabs label="보이는 이름" aria-labelledby="   " aria-label="   " items={items()} /><Tabs aria-label="직접 이름" aria-labelledby="" items={items()} /></>);
  expect(view.getByRole('tablist', { name: '보이는 이름' })).not.toBeNull();
  expect(view.getByRole('tablist', { name: '직접 이름' }).hasAttribute('aria-labelledby')).toBe(false);
});

test('touch capture release after pointerup preserves only its corresponding focus-click pairing', () => {
  const Tabs = tabs(); const events: unknown[] = [];
  render(() => <Tabs label="터치 포인터 해제" items={items()} value="first" activationMode="automatic" onValueChange={(d: unknown) => events.push(d)} />);
  const second = all()[2]!;
  const pointer = (type: string, id: number) => second.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: id, pointerType: 'touch', isPrimary: true }));
  all()[0]!.focus(); pointer('pointerdown', 11); second.focus();
  expect(events).toEqual([{ value: 'second' }]);
  pointer('pointerup', 11); pointer('lostpointercapture', 11);
  second.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, button: 0 }));
  expect(events).toEqual([{ value: 'second' }]);
  // A later deliberate gesture still requests selection after the controlled rejection.
  pointer('pointerdown', 12); pointer('pointerup', 12); pointer('lostpointercapture', 12);
  second.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, button: 0 }));
  expect(events).toEqual([{ value: 'second' }, { value: 'second' }]);
});
