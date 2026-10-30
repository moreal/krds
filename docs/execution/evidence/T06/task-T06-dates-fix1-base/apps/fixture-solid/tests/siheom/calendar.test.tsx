import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import * as solid from '@krds-native/solid';
import { assertions, query, runSiheom } from '@siheom/solid';

const Calendar = (props: any) => {
  expect(typeof (solid as any).Calendar).toBe('function');
  return (solid as any).Calendar(props);
};
const day = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}`) });

test('calendar renders six native rows, full Korean names and sequential enabled dates', async () => {
  render(() => <Calendar label="날짜 선택" referenceDate="2024-02-15" today="2024-02-29" />);
  expect(screen.getByRole('table', { name: '2024년 2월' }).querySelectorAll('tbody tr')).toHaveLength(6);
  await runSiheom(assertions.visible(query.button('확인')));
  const leap = day('2024년 2월 29일 목요일');
  expect(leap).toHaveAttribute('aria-current', 'date');
  expect(leap).not.toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('columnheader', { name: '목요일' })).toBeVisible();
});

test('calendar selection is tentative, confirms once and cancel restores committed selection', () => {
  const changes: unknown[] = [], confirms: unknown[] = [], cancels: unknown[] = [];
  render(() => <Calendar label="날짜 선택" defaultValue="2024-02-12" onValueChange={(v:any) => changes.push(v)} onConfirm={(v:any) => confirms.push(v)} onCancel={() => cancels.push(true)} />);
  fireEvent.click(day('2024년 2월 14일'));
  expect(changes).toEqual([]);
  fireEvent.click(screen.getByRole('button', { name: '취소' }));
  expect(day('2024년 2월 12일')).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(day('2024년 2월 14일'));
  fireEvent.click(screen.getByRole('button', { name: '확인' }));
  fireEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(changes).toEqual([{ value: '2024-02-14' }]);
  expect(confirms).toEqual([{ value: '2024-02-14' }, { value: '2024-02-14' }]);
  expect(cancels).toHaveLength(1);
});

test('calendar range sorts clicked endpoints, prevents partial confirmation and exposes range states', () => {
  const changes: unknown[] = [];
  render(() => <Calendar mode="range" label="기간" referenceDate="2024-02-15" onValueChange={(v:any) => changes.push(v)} />);
  fireEvent.click(day('2024년 2월 18일'));
  expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
  fireEvent.click(day('2024년 2월 12일'));
  expect(day('2024년 2월 15일')).toHaveAttribute('data-krds-state', expect.stringContaining('in-range'));
  expect(day('2024년 2월 12일')).toHaveAccessibleName(/시작일/);
  fireEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(changes).toEqual([{ value: { start: '2024-02-12', end: '2024-02-18' } }]);
});

test('calendar respects inclusive bounds and Gregorian year edges without phantom dates', () => {
  render(() => <Calendar label="날짜" referenceDate="0001-01-01" min="0001-01-01" max="0001-01-03" />);
  expect(screen.getByRole('button', { name: '이전 달' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
  expect(day('1년 1월 1일')).toBeEnabled();
  expect(day('1년 1월 4일')).toBeDisabled();
  expect(screen.queryByRole('button', { name: /0년 12월/ })).toBeNull();
});

test('calendar keyboard changes focus without selecting; month/year movement clamps leap days', async () => {
  const changes: unknown[] = [];
  render(() => <Calendar label="날짜" referenceDate="2024-02-29" onValueChange={(v:any) => changes.push(v)} />);
  day('2024년 2월 29일').focus();
  fireEvent.keyDown(document.activeElement!, { key: 'PageDown', shiftKey: true });
  await Promise.resolve();
  expect(document.activeElement).toHaveAccessibleName(/^2025년 2월 28일/);
  fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
  await Promise.resolve();
  expect(document.activeElement).toHaveAccessibleName(/^2025년 3월 1일/);
  expect(changes).toEqual([]);
});

test('controlled rejected confirm restores parent selection; external updates never emit', async () => {
  const changes: unknown[] = [];
  const [value, setValue] = createSignal<string|null>('2024-02-12');
  render(() => <Calendar label="날짜" value={value()} onValueChange={(v:any) => changes.push(v)} />);
  fireEvent.click(day('2024년 2월 14일'));
  fireEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(day('2024년 2월 12일')).toHaveAttribute('aria-pressed', 'true');
  setValue('2024-03-01');
  expect(day('2024년 3월 1일')).toHaveAttribute('aria-pressed', 'true');
  expect(changes).toEqual([{ value: '2024-02-14' }]);
});

test('disabled calendar suppresses all actions; optional clear commits empty', () => {
  const changes: unknown[] = [];
  const [disabled, setDisabled] = createSignal(true);
  render(() => <Calendar label="날짜" disabled={disabled()} defaultValue="9999-12-31" onValueChange={(v:any) => changes.push(v)} />);
  expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
  setDisabled(false);
  fireEvent.click(screen.getByRole('button', { name: '지우기' }));
  fireEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(changes).toEqual([{ value: null }]);
});
