import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import * as solid from '@krds-native/solid';
import { assertions, query, runSiheom } from '@siheom/solid';

const DateInput = (props: any) => {
  expect(typeof (solid as any).DateInput).toBe('function');
  return (solid as any).DateInput(props);
};
const enter = (input: HTMLElement) => fireEvent.keyDown(input, { key: 'Enter' });

test('date input retains raw draft, commits leap date once and submits canonical value', async () => {
  const changes: unknown[] = [];
  render(() => <form><DateInput label="방문일" name="visit" onValueChange={(v:any) => changes.push(v)} /></form>);
  await runSiheom(assertions.visible(query.textbox('방문일')));
  const input = screen.getByRole('textbox', { name: '방문일' }) as HTMLInputElement;
  expect(input).toHaveAttribute('type', 'text');
  fireEvent.input(input, { target: { value: '2024-02-29' } });
  expect(changes).toEqual([]);
  enter(input);
  fireEvent.focusOut(input);
  expect(changes).toEqual([{ value: '2024-02-29' }]);
  expect(new FormData(input.form!).get('visit')).toBe('2024-02-29');
});

test('invalid/non-padded drafts stay visible, expose linked errors and block stale form submission', () => {
  const changes: unknown[] = [];
  render(() => <form><DateInput label="날짜" name="date" defaultValue="2024-02-29" onValueChange={(v:any) => changes.push(v)} /><button type="submit">제출</button></form>);
  const input = screen.getByRole('textbox', { name: '날짜' }) as HTMLInputElement;
  fireEvent.input(input, { target: { value: '2024-2-30' } });
  enter(input);
  expect(input.value).toBe('2024-2-30');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input.validity.valid).toBe(false);
  expect(screen.getByText('YYYY-MM-DD 형식의 올바른 날짜를 입력하세요')).toBeVisible();
  expect(input.getAttribute('aria-describedby')).toContain(screen.getByText('YYYY-MM-DD 형식의 올바른 날짜를 입력하세요').id);
  expect(input.form!.checkValidity()).toBe(false);
  expect(changes).toEqual([]);
});

test('controlled rejected edit restores display and external update emits nothing', () => {
  const changes: unknown[] = [];
  const [value, setValue] = createSignal<string|null>('0001-01-01');
  render(() => <DateInput label="날짜" value={value()} onValueChange={(v:any) => changes.push(v)} />);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.input(input, { target: { value: '9999-12-31' } }); enter(input);
  expect(input.value).toBe('0001-01-01');
  setValue('2024-02-29');
  expect(input.value).toBe('2024-02-29');
  expect(changes).toEqual([{ value: '9999-12-31' }]);
});

test('range fields defer group commit, reject reversed/incomplete and apply inclusive limits', () => {
  const changes: unknown[] = [];
  render(() => <DateInput mode="range" label="기간" name="period" min="2024-02-01" max="2024-02-29" onValueChange={(v:any) => changes.push(v)} />);
  const start = screen.getByRole('textbox', { name: '시작일' });
  const end = screen.getByRole('textbox', { name: '종료일' });
  fireEvent.input(start, { target: { value: '2024-02-29' } });
  fireEvent.focusOut(start, { relatedTarget: end });
  expect(changes).toEqual([]);
  fireEvent.input(end, { target: { value: '2024-02-01' } }); enter(end);
  expect(screen.getByText('종료일은 시작일보다 빠를 수 없습니다')).toBeVisible();
  fireEvent.input(start, { target: { value: '2024-02-01' } });
  fireEvent.input(end, { target: { value: '2024-02-29' } }); enter(end);
  expect(changes).toEqual([{ value: { start: '2024-02-01', end: '2024-02-29' } }]);
});

test('composition and keycode 229 suppress validation and Enter commits until later explicit Enter', () => {
  const changes: unknown[] = [];
  render(() => <DateInput label="날짜" onValueChange={(v:any) => changes.push(v)} />);
  const input = screen.getByRole('textbox');
  fireEvent.compositionStart(input);
  fireEvent.input(input, { target: { value: '2024-02-29' } }); enter(input);
  fireEvent.compositionEnd(input);
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
  expect(changes).toEqual([]);
  enter(input);
  expect(changes).toEqual([{ value: '2024-02-29' }]);
});

test('native reset restores baseline without callback; canceled reset and disabled entries obey forms', async () => {
  const changes: unknown[] = [];
  const [disabled, setDisabled] = createSignal(false);
  render(() => <form><DateInput label="날짜" name="date" disabled={disabled()} defaultValue="2024-02-01" onValueChange={(v:any) => changes.push(v)} /></form>);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.input(input, { target: { value: '2024-02-29' } }); enter(input);
  input.form!.reset(); await Promise.resolve();
  expect(input.value).toBe('2024-02-01');
  expect(changes).toHaveLength(1);
  setDisabled(true);
  expect(new FormData(input.form!).has('date')).toBe(false);
});

test('calendar cancel preserves invalid draft; confirm commits once and returns focus to opener', async () => {
  const changes: unknown[] = [];
  render(() => <DateInput label="날짜" defaultValue="2024-02-12" onValueChange={(v:any) => changes.push(v)} />);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.input(input, { target: { value: '잘못된 날짜' } }); enter(input);
  const trigger = screen.getByRole('button', { name: '달력 열기' });
  fireEvent.click(trigger);
  expect(await screen.findByRole('dialog', { name: '날짜 선택' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '취소' })); await Promise.resolve();
  expect(input.value).toBe('잘못된 날짜');
  fireEvent.click(trigger);
  await screen.findByRole('dialog', { name: '날짜 선택' });
  fireEvent.click(screen.getByRole('button', { name: /^2024년 2월 29일/ }));
  fireEvent.click(screen.getByRole('button', { name: '확인' })); await Promise.resolve();
  expect(input.value).toBe('2024-02-29');
  expect(changes).toEqual([{ value: '2024-02-29' }]);
  expect(document.activeElement).toBe(trigger);
});

test('required empty draft blocks validity and popup empty confirm; valid pending submit commits once', () => {
  const changes: unknown[] = [];
  render(() => <form><DateInput label="날짜" name="date" required onValueChange={(v:any) => changes.push(v)} /></form>);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  expect(input.form!.checkValidity()).toBe(false);
  fireEvent.input(input, { target: { value: '2024-02-29' } });
  fireEvent.submit(input.form!);
  expect(new FormData(input.form!).get('date')).toBe('2024-02-29');
  expect(changes).toEqual([{ value: '2024-02-29' }]);
});

test('popup returns focus to explicit fallback when its opener disappears', async () => {
  const [withCalendar,setWithCalendar]=createSignal(true);
  render(() => <><DateInput label="날짜" withCalendar={withCalendar()} returnFocusId="date-fallback" /><button id="date-fallback">다음 작업</button></>);
  fireEvent.click(screen.getByRole('button',{name:'달력 열기'}));
  await screen.findByRole('dialog',{name:'날짜 선택'});
  setWithCalendar(false);
  fireEvent.click(screen.getByRole('button',{name:'취소'}));
  await Promise.resolve();
  expect(document.activeElement).toBe(screen.getByRole('button',{name:'다음 작업'}));
});

test('native submit rejects a declined controlled pending commit and never sends stale values', () => {
  const changes:unknown[]=[];
  render(() => <form><DateInput label="날짜" name="date" value="2024-02-01" onValueChange={(value:any)=>changes.push(value)} /></form>);
  const input=screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.input(input,{target:{value:'2024-02-29'}});
  const submit=new SubmitEvent('submit',{bubbles:true,cancelable:true});
  input.form!.dispatchEvent(submit);
  expect(submit.defaultPrevented).toBe(true);
  expect(input.value).toBe('2024-02-01');
  expect(changes).toEqual([{value:'2024-02-29'}]);
});

test('canceled native reset keeps draft and committed value untouched', async () => {
  render(() => <form onReset={event=>event.preventDefault()}><DateInput label="날짜" name="date" defaultValue="2024-02-01" /></form>);
  const input=screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.input(input,{target:{value:'2024-02-29'}}); enter(input);
  fireEvent.input(input,{target:{value:'unfinished'}});
  input.form!.reset(); await Promise.resolve();
  expect(input.value).toBe('unfinished');
  expect(new FormData(input.form!).get('date')).toBe('2024-02-29');
});

test('popup Escape closes only the topmost dialog and ignores composing Escape', async () => {
  const Modal=(solid as any).Modal;
  render(() => <Modal title="바깥 대화상자" defaultOpen><DateInput label="날짜" /></Modal>);
  fireEvent.click(screen.getByRole('button',{name:'달력 열기'}));
  const popup=await screen.findByRole('dialog',{name:'날짜 선택'});
  fireEvent.keyDown(popup,{key:'Escape',isComposing:true});
  expect(popup).toBeVisible();
  fireEvent.keyDown(popup,{key:'Escape'});
  await Promise.resolve();
  expect(screen.queryByRole('dialog',{name:'날짜 선택'})).toBeNull();
  expect(screen.getByRole('dialog',{name:'바깥 대화상자'})).toBeVisible();
});

test('two range calendar openers include their distinct JSX task labels', () => {
  render(() => <>
    <DateInput mode="range" label={<strong>방문 기간</strong>} />
    <DateInput mode="range" label={<strong>접수 기간</strong>} />
  </>);
  expect(screen.getByRole('button',{name:'방문 기간 달력 열기'})).toBeVisible();
  expect(screen.getByRole('button',{name:'접수 기간 달력 열기'})).toBeVisible();
});
