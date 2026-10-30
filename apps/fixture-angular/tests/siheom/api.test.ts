import userEvent from '@testing-library/user-event';
import { Component } from '@angular/core';
import { render } from '@testing-library/angular';
import { screen } from '@testing-library/dom';
import { expect, test } from 'vitest';
import { Button, NativeSelect, DateInput, Calendar } from '@unofficial-krds/angular';
@Component({ standalone: true, imports: [Button, NativeSelect, DateInput, Calendar], template: `<button krdsButton disabled>비활성 작업</button><krds-native-select id="attribute-select" label="필수 지역" required [options]="options" /><krds-date-input id="attribute-date" label="필수 날짜" required disabled />` })
class BooleanAttributeHarness {
    readonly options = [{ value: '', label: '지역 선택' }, { value: 'seoul', label: '서울' }];
}
// Detects Angular attribute inputs accidentally treating the empty HTML attribute as false.
test('native boolean attributes disable controls and connect required validity', async () => {
    await render(BooleanAttributeHarness);
    expect(screen.getByRole('button', { name: '비활성 작업' })).toBeDisabled();
    const select = screen.getByRole('combobox', { name: '필수 지역' }) as HTMLSelectElement;
    expect(select.required).toBe(true);
    expect(select.validity.valueMissing).toBe(true);
    expect(screen.getByRole('textbox', { name: '필수 날짜' })).toBeDisabled();
});

@Component({ standalone: true, imports: [NativeSelect], template: `<form><krds-native-select id="empty-select" label="비어 있는 지역" name="region" [options]="options" /></form>` })
class EmptySelectionHarness { readonly options = [{ value: '', label: '사용 불가', disabled: true }, { value: 'seoul', label: '서울', disabled: true }]; }
test('all-disabled uncontrolled select has no selection or successful form value, including a disabled empty option', async () => {
  await render(EmptySelectionHarness);
  const select = screen.getByRole('combobox', { name: '비어 있는 지역' }) as HTMLSelectElement;
  expect(select.selectedIndex).toBe(-1);
  expect(new FormData(select.form!).has('region')).toBe(false);
});

test('range default cannot use the single-date null shape', async () => {
  await expect(render(DateInput, { inputs: { id: 'bad-range', label: '기간', mode: 'range', defaultValue: null } })).rejects.toThrow(TypeError);
});

// Untyped consumers must receive configuration errors instead of silently different behavior.
test('malformed native component enumerations are rejected', async () => {
  await expect(render(Button, { componentInputs: { type: 'navigate' } })).rejects.toThrow(TypeError);
});

test('committing an unchanged controlled range ignores object property insertion order', async () => {
  const changes: unknown[] = [];
  await render(DateInput, { inputs: { id: 'ordered-range', label: '방문 기간', mode: 'range', value: { end: '2024-02-29', start: '2024-02-28' } }, on: { valueChange: details => changes.push(details) } });
  const user = userEvent.setup(); const start = screen.getByRole('textbox', { name: '시작일' });
  await user.click(start); await user.keyboard('{Enter}'); expect(changes).toEqual([]);
});

test('reselecting the same controlled calendar range emits Confirm once and no value change regardless of object key order', async () => {
  const changes: unknown[] = []; const confirmations: unknown[] = [];
  await render(Calendar, { inputs: { id: 'ordered-calendar', label: '날짜 선택', mode: 'range', value: { end: '2024-02-29', start: '2024-02-28' } }, on: { valueChange: details => changes.push(details), confirmed: details => confirmations.push(details) } });
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: /^2024년 2월 28일 수요일/ }));
  await user.click(screen.getByRole('button', { name: /^2024년 2월 29일 목요일/ }));
  await user.click(screen.getByRole('button', { name: '확인' }));
  expect(changes).toEqual([]); expect(confirmations).toEqual([{ value: { start: '2024-02-28', end: '2024-02-29' } }]);
});

test('range endpoint payload members must be strings or null', async () => {
  await expect(render(DateInput, { componentInputs: { id: 'bad-members', label: '기간', mode: 'range', value: { start: undefined, end: undefined } } })).rejects.toThrow(TypeError);
});
