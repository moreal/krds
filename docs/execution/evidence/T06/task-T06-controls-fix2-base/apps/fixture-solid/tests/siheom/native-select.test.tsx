import { beforeEach, expect, test } from 'vitest';
import { createSignal, type Component, type JSX } from 'solid-js';
import { fireEvent, render } from '@solidjs/testing-library';
import { assertions, given, query, runSiheom } from '@siheom/solid';
import * as Krds from '@krds-native/solid';
import { FixtureApp } from '../../src/fixture-app';

type Option = { value: string; label: string; disabled?: boolean };
type TestSelectProps = Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'children'> & {
  options: Option[]; label?: JSX.Element; hint?: JSX.Element; error?: JSX.Element; size?: string;
  value?: string; defaultValue?: string; invalid?: boolean; onValueChange?: (details: { value: string }) => void;
};
const NativeSelect = Reflect.get(Krds, 'NativeSelect') as Component<TestSelectProps>;
const options = [{ value: 'blocked', label: '선택 불가', disabled: true }, { value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
function change(select: HTMLSelectElement, value: string) { select.value = value; fireEvent.change(select); }
const settleReset = () => new Promise<void>(resolve => queueMicrotask(resolve));
beforeEach(() => expect(NativeSelect, 'public native Solid NativeSelect').toBeTypeOf('function'));

test.each(['controlled', 'form-reset'])('canonical native-select/%s exposes the real select', async caseId => {
  await runSiheom(given.render(() => <FixtureApp componentId="native-select" caseId={caseId} />), assertions.textContent(query.status('Fixture health'), 'ready'));
  await runSiheom(assertions.visible(query.combobox('지역')));
});

test('first enabled option initializes native FormData without a callback or submission', () => {
  const changes: unknown[] = [];
  let submits = 0;
  const view = render(() => <form onSubmit={e => { e.preventDefault(); submits++; }}><NativeSelect options={options} label="지역" name="region" onValueChange={d => changes.push(d)} /></form>);
  const select = view.getByRole('combobox', { name: '지역' }) as HTMLSelectElement;
  expect(select.tagName).toBe('SELECT');
  expect([...select.options].map(o => o.value)).toEqual(['blocked', 'seoul', 'busan']);
  expect(select.options[0]!.disabled).toBe(true);
  expect(select.value).toBe('seoul');
  expect(new FormData(select.form!).get('region')).toBe('seoul');
  expect(changes).toEqual([]);
  change(select, 'busan');
  expect(changes).toEqual([{ value: 'busan' }]);
  expect(new FormData(select.form!).get('region')).toBe('busan');
  fireEvent.change(select);
  fireEvent.input(select);
  expect(changes).toEqual([{ value: 'busan' }]);
  expect(submits).toBe(0);
});

test('controlled requests restore a declined value even when its prop never changes', () => {
  const changes: unknown[] = [];
  const [value, setValue] = createSignal('seoul');
  const [disabled, setDisabled] = createSignal(false);
  const view = render(() => <form><NativeSelect options={options} label="지역" name="region" value={value()} disabled={disabled()} onValueChange={d => changes.push(d)} /></form>);
  const select = view.getByRole('combobox') as HTMLSelectElement;
  change(select, 'busan');
  expect(changes).toEqual([{ value: 'busan' }]);
  expect(select.value).toBe('seoul');
  expect(new FormData(select.form!).get('region')).toBe('seoul');
  change(select, 'busan');
  expect(changes).toEqual([{ value: 'busan' }, { value: 'busan' }]);
  setValue('busan');
  expect(select.value).toBe('busan');
  setDisabled(true);
  setValue('blocked');
  expect(select.value).toBe('blocked');
  expect(select.disabled).toBe(true);
  expect(new FormData(select.form!).has('region')).toBe(false);
  change(select, 'seoul');
  expect(select.value).toBe('blocked');
  expect(changes).toHaveLength(2);
});

test('disabled option changes are ignored and required empty placeholder blocks form validity', () => {
  const changes: unknown[] = [];
  const view = render(() => <form><NativeSelect label="지역" options={[{ value: '', label: '지역 선택' }, ...options]} required name="region" onValueChange={d => changes.push(d)} /></form>);
  const select = view.getByRole('combobox') as HTMLSelectElement;
  expect(select.value).toBe('');
  expect(select.validity.valueMissing).toBe(true);
  expect(new FormData(select.form!).get('region')).toBe('');
  change(select, 'blocked');
  expect(select.value).toBe('');
  expect(changes).toEqual([]);
  change(select, 'busan');
  expect(select.validity.valid).toBe(true);
  expect(changes).toEqual([{ value: 'busan' }]);
});

test('hint and visible error remain associated with an explicitly identified label', () => {
  const view = render(() => <NativeSelect id="region-control" label="지역" hint="거주 지역" error="지역을 선택하세요" invalid size="large" options={options} aria-describedby="external-help" />);
  const select = view.getByRole('combobox', { name: '지역' }) as HTMLSelectElement;
  expect(select.id).toBe('region-control');
  expect(select.getAttribute('aria-invalid')).toBe('true');
  const ids = select.getAttribute('aria-describedby')!.split(' ');
  expect(ids).toContain('external-help');
  expect(ids.map(id => document.getElementById(id)?.textContent)).toEqual(expect.arrayContaining(['거주 지역', '지역을 선택하세요']));
  expect(select.dataset.krdsSize).toBe('large');
  expect(select.closest('[data-krds-part="root"]')?.getAttribute('data-krds-state')).toBe('invalid');
});

test('reset restores captured uncontrolled default and honors cancellation without notifying', async () => {
  const changes: unknown[] = [];
  const [defaultValue, setDefaultValue] = createSignal('busan');
  let canceled = true;
  const view = render(() => <form onReset={e => { if (canceled) e.preventDefault(); }}><NativeSelect label="지역" name="region" options={options} defaultValue={defaultValue()} onValueChange={d => changes.push(d)} /></form>);
  const select = view.getByRole('combobox') as HTMLSelectElement;
  expect(select.value).toBe('busan');
  setDefaultValue('seoul');
  change(select, 'seoul');
  select.form!.reset();
  await settleReset();
  expect(select.value).toBe('seoul');
  canceled = false;
  select.form!.reset();
  await settleReset();
  expect(select.value).toBe('busan');
  expect(new FormData(select.form!).get('region')).toBe('busan');
  expect(changes).toEqual([{ value: 'seoul' }]);
});

test('controlled reset reapplies the current prop and external form association works', async () => {
  const changes: unknown[] = [];
  const [value, setValue] = createSignal('seoul');
  const view = render(() => <><form id="external-form" /><NativeSelect form="external-form" label="지역" name="region" options={options} value={value()} onValueChange={d => changes.push(d)} /></>);
  const select = view.getByRole('combobox') as HTMLSelectElement;
  setValue('busan');
  select.form!.reset();
  await settleReset();
  expect(select.value).toBe('busan');
  expect(new FormData(select.form!).get('region')).toBe('busan');
  expect(changes).toEqual([]);
});

test('no enabled options preserve absent selection across reset with no successful value', async () => {
  const view = render(() => <form><NativeSelect label="지역" name="region" options={[options[0]!]} /></form>);
  const select = view.getByRole('combobox') as HTMLSelectElement;
  expect(select.selectedIndex).toBe(-1);
  expect(new FormData(select.form!).has('region')).toBe(false);
  select.form!.reset();
  await settleReset();
  expect(select.selectedIndex).toBe(-1);
  expect(new FormData(select.form!).has('region')).toBe(false);
});

test('invalid values, duplicate options, absent names and conflicting modes are configuration errors', () => {
  expect(() => render(() => <NativeSelect label="지역" options={options} value="missing" />)).toThrow(TypeError);
  expect(() => render(() => <NativeSelect label="지역" options={[options[1]!, options[1]!]} />)).toThrow(TypeError);
  expect(() => render(() => <NativeSelect options={options} />)).toThrow(TypeError);
  expect(() => render(() => <NativeSelect label="지역" options={options} size="huge" />)).toThrow(TypeError);
  expect(() => render(() => <NativeSelect label="지역" options={options} value="seoul" defaultValue="busan" />)).toThrow(TypeError);
});

const unnamedLabels: { name: string; label: () => JSX.Element }[] = [
  { name: 'empty', label: () => '' },
  { name: 'whitespace', label: () => '   ' },
  { name: 'false', label: () => false },
  { name: 'aria-hidden-only JSX', label: () => <span aria-hidden="true">지역</span> },
];

test.each(unnamedLabels)('rejects $name label without an accessible alternative', ({ label }) => {
  expect(() => render(() => <NativeSelect options={options} label={label()} />)).toThrow(TypeError);
});

test.each(unnamedLabels)('accepts explicit accessible aria-label with $name label', ({ label }) => {
  const view = render(() => <NativeSelect options={options} label={label()} aria-label="지역" />);
  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
});

test('accepts explicit accessible aria-labelledby with decorative label content', () => {
  const view = render(() => <><span id="region-accessible-name">거주 지역</span><NativeSelect options={options} label={<span aria-hidden="true">⌄</span>} aria-labelledby="region-accessible-name" /></>);
  expect(view.getByRole('combobox', { name: '거주 지역' })).toHaveAccessibleName('거주 지역');
});

test('preserves visually hidden accessible label text', () => {
  const view = render(() => <NativeSelect options={options} label={<span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', 'clip-path': 'inset(50%)' }}>지역</span>} />);
  expect(view.getByRole('combobox', { name: '지역' })).toHaveAccessibleName('지역');
});
