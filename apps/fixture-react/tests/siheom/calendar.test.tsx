import { expect, test, afterEach } from 'vitest';
import { assertions, createReactSiheom, given, query } from '@siheom/react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component, StrictMode, useState, type ReactNode } from 'react';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@unofficial-krds/react';
import { FixtureApp } from '../../src/FixtureApp';
const { runSiheom } = createReactSiheom();
afterEach(cleanup);

test('calendar canonical native table, selection remains tentative until Confirm', async () => {
  await runSiheom(given.render(<FixtureApp componentId="calendar" caseId="selection-confirm" />), assertions.visible(query.button('확인')));
  expect(document.querySelectorAll('tbody tr')).toHaveLength(6);
  expect(document.querySelectorAll('tbody td')).toHaveLength(42);
  const day = screen.getByRole('button', { name: '2024년 2월 29일 목요일' });
  await userEvent.click(day);
  expect(window.__KRDS_FIXTURE__?.readEvents()).toEqual([]);
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(window.__KRDS_FIXTURE__?.readEvents()).toEqual([{ name: 'valueChange', detail: { value: '2024-02-29' } }]);
});

test('native Button submits named submitter once; default button and disabled do not submit', async () => {
  const submits: FormData[] = []; let calls = 0;
  render(<form onSubmit={event => { event.preventDefault(); submits.push(new FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter)); }}><Button onClick={() => calls++}>Action</Button><Button type="submit" name="action" value="save">Save</Button><Button disabled onClick={() => calls++}>Disabled</Button></form>);
  await userEvent.click(screen.getByText('Action')); expect(calls).toBe(1); expect(submits).toHaveLength(0);
  await userEvent.click(screen.getByText('Save')); expect(submits[0].get('action')).toBe('save');
  await userEvent.click(screen.getByText('Disabled')); expect(calls).toBe(1);
});

test('select rejection, explicit no-selection and reset preserve actual FormData without notifications', async () => {
  const events: string[] = [];
  const mounted = render(<form><NativeSelect label="Region" name="region" value="a" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} onValueChange={({ value }) => events.push(value)} /></form>);
  const select = screen.getByRole('combobox') as HTMLSelectElement;
  await userEvent.selectOptions(select, 'b'); expect(select.value).toBe('a'); expect(events).toEqual(['b']);
  mounted.rerender(<form><NativeSelect label="Region" name="region" value="b" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} onValueChange={({ value }) => events.push(value)} /></form>);
  expect(select.value).toBe('b'); expect(events).toEqual(['b']); mounted.unmount();
  render(<form><NativeSelect label="Empty" name="empty" defaultValue="" options={[{ value: 'a', label: 'A', disabled: true }]} /><Button type="reset">Reset</Button></form>);
  const empty = screen.getByRole('combobox') as HTMLSelectElement; expect(empty.selectedIndex).toBe(-1); expect(new FormData(empty.form!).has('empty')).toBe(false);
  await userEvent.click(screen.getByText('Reset')); expect(empty.selectedIndex).toBe(-1);
});

test('manual tabs retain sequential stops and mounted panel state; automatic rejection emits one per gesture', async () => {
  const events: string[] = [];
  const items = [{ value: 'a', label: 'A', panel: <input aria-label="Local state" defaultValue="keep" /> }, { value: 'b', label: 'B', panel: 'Second' }];
  const mounted = render(<Tabs aria-label="Sections" items={items} />);
  const tabs = screen.getAllByRole('tab'); expect(tabs.map(tab => tab.tabIndex)).toEqual([0, 0]);
  tabs[0].focus(); await userEvent.keyboard('{ArrowRight}'); expect(tabs[1]).toHaveFocus(); expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  await userEvent.keyboard('{Enter}'); expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  expect(document.querySelector('input')?.value).toBe('keep'); mounted.unmount();
  render(<Tabs aria-label="Auto" items={items} value="a" activationMode="automatic" onValueChange={({ value }) => events.push(value)} />);
  await userEvent.click(screen.getByRole('tab', { name: 'B' })); expect(events).toEqual(['b']); expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
  await userEvent.click(screen.getByRole('tab', { name: 'B' })); expect(events).toEqual(['b', 'b']);
});

test('date drafts preserve IME, reject invalid leap day, commit once, reset and submit canonical range values', async () => {
  const events: unknown[] = []; let formData: FormData | undefined;
  const mounted = render(<form onSubmit={event => { event.preventDefault(); formData = new FormData(event.currentTarget); }}><DateInput label="Visit" name="visit" defaultValue="2024-02-28" withCalendar={false} onValueChange={detail => events.push(detail)} /><Button type="reset">Reset</Button><Button type="submit">Submit</Button></form>);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.compositionStart(input); fireEvent.change(input, { target: { value: '이월' } }); fireEvent.keyDown(input, { key: 'Enter', isComposing: true }); expect(input.value).toBe('이월'); expect(events).toEqual([]); fireEvent.compositionEnd(input);
  fireEvent.change(input, { target: { value: '2023-02-29' } }); await userEvent.keyboard('{Enter}'); input.focus(); await userEvent.keyboard('{Enter}'); expect(input).toHaveAttribute('aria-invalid', 'true'); expect(events).toEqual([]);
  await userEvent.clear(input); await userEvent.type(input, '2024-02-29{Enter}'); expect(events).toEqual([{ value: '2024-02-29' }]);
  await userEvent.click(screen.getByText('Submit')); expect(formData?.get('visit')).toBe('2024-02-29'); expect(events).toHaveLength(1);
  await userEvent.click(screen.getByText('Reset')); expect(input.value).toBe('2024-02-28'); expect(events).toHaveLength(1); mounted.unmount();
  render(<form><DateInput mode="range" label="Trip" name="trip" defaultValue={{ start: '2024-02-28', end: '2024-02-29' }} /></form>);
  const fields = screen.getAllByRole('textbox') as HTMLInputElement[]; const data = new FormData(fields[0].form!); expect([...data]).toEqual([['trip.start', '2024-02-28'], ['trip.end', '2024-02-29']]);
});

test('controlled date rejection restores parent; prop changes emit nothing; popup Cancel preserves invalid draft', async () => {
  const events: unknown[] = [];
  const mounted = render(<DateInput label="Date" value="2024-02-28" referenceDate="2024-02-15" onValueChange={detail => events.push(detail)} />);
  const input = screen.getByRole('textbox') as HTMLInputElement;
  await userEvent.clear(input); await userEvent.type(input, '2024-02-29{Enter}'); expect(input.value).toBe('2024-02-28'); expect(events).toEqual([{ value: '2024-02-29' }]);
  mounted.rerender(<DateInput label="Date" value="2024-03-01" referenceDate="2024-02-15" onValueChange={detail => events.push(detail)} />); expect(input.value).toBe('2024-03-01'); expect(events).toHaveLength(1);
  await userEvent.clear(input); await userEvent.type(input, 'bad'); await userEvent.click(screen.getByRole('button', { name: '달력 열기' })); expect(screen.getByRole('dialog')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: '취소' })); expect(input.value).toBe('bad'); expect(screen.getByRole('button', { name: '달력 열기' })).toHaveFocus();
});

test('calendar range sorts click endpoints, rejects partial Confirm and supports additive keyboard without events', async () => {
  const events: unknown[] = [];
  render(<Calendar mode="range" referenceDate="2024-02-15" min="2024-02-01" max="2024-03-31" onValueChange={detail => events.push(detail)} />);
  const first = screen.getByRole('button', { name: '2024년 2월 20일 화요일' }); await userEvent.click(first); expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: '2024년 2월 12일 월요일' })); await userEvent.click(screen.getByRole('button', { name: '확인' })); expect(events).toEqual([{ value: { start: '2024-02-12', end: '2024-02-20' } }]);
  first.focus(); await userEvent.keyboard('{ArrowRight}'); expect(document.activeElement).toHaveAttribute('data-date', '2024-02-21'); expect(events).toHaveLength(1);
});

test('StrictMode modal rejection retains isolation; actual close/unmount restores focus and existing scroll/inert states', async () => {
  const requests: boolean[] = [];
  function Example() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>Open</Button><Button onClick={() => setOpen(false)}>External</Button><Modal open={open} title="Dialog" onOpenChange={({ open }) => requests.push(open)}><button type="button">First</button></Modal></>; }
  const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'clip';
  const mounted = render(<StrictMode><Example /></StrictMode>); const opener = screen.getByRole('button', { name: 'Open' });
  await userEvent.click(opener); expect(screen.getByRole('dialog')).toHaveFocus(); expect(document.body.style.overflow).toBe('hidden');
  await userEvent.keyboard('{Escape}'); expect(requests).toEqual([false]); expect(screen.getByRole('dialog')).toBeVisible(); expect(document.body.style.overflow).toBe('hidden');
  mounted.unmount(); expect(document.body.style.overflow).toBe('clip'); expect(document.querySelector('[data-krds-component="modal"][data-krds-part="root"]')).toBeNull(); document.body.style.overflow = oldOverflow;
});

test('nested native modals let only topmost process Escape and restore the parent opener', async () => {
  function Nested() {
    const [outer, setOuter] = useState(false); const [inner, setInner] = useState(false);
    return <><Button onClick={() => setOuter(true)}>Outer</Button><Modal open={outer} title="Parent" onOpenChange={({ open }) => setOuter(open)}><Button onClick={() => setInner(true)}>Inner</Button><Modal open={inner} title="Child" onOpenChange={({ open }) => setInner(open)}>Nested</Modal></Modal></>;
  }
  render(<Nested />); await userEvent.click(screen.getByRole('button', { name: 'Outer' })); await userEvent.click(screen.getByRole('button', { name: 'Inner' }));
  expect(screen.getByRole('dialog', { name: 'Child' })).toHaveFocus(); expect(screen.getByRole('dialog', { name: 'Parent' }).closest('[inert]')).not.toBeNull();
  await userEvent.keyboard('{Escape}'); expect(screen.queryByRole('dialog', { name: 'Child' })).toBeNull(); expect(screen.getByRole('button', { name: 'Inner' })).toHaveFocus();
  await userEvent.keyboard('{Escape}'); expect(screen.getByRole('button', { name: 'Outer' })).toHaveFocus();
});

test('modal ignores handled/composing Escape and outside drags; primary backdrop gesture requests once', async () => {
  const events: boolean[] = [];
  render(<Modal defaultOpen title="Gesture" closeOnOutsideClick onOpenChange={({ open }) => events.push(open)}><input aria-label="Editor" onKeyDown={event => { if (event.key === 'Escape' && !event.nativeEvent.isComposing) event.preventDefault(); }} /></Modal>);
  const editor = screen.getByRole('textbox'); editor.focus();
  fireEvent.keyDown(editor, { key: 'Escape', isComposing: true }); fireEvent.keyDown(editor, { key: 'Escape' }); expect(events).toEqual([]);
  const backdrop = document.querySelector('[data-krds-part="backdrop"]')!;
  fireEvent.pointerDown(backdrop, { pointerId: 1, isPrimary: true, button: 0 }); fireEvent.pointerUp(editor, { pointerId: 1, isPrimary: true, button: 0 }); fireEvent.pointerUp(backdrop, { pointerId: 1, isPrimary: true, button: 0 }); expect(events).toEqual([]);
  fireEvent.pointerDown(backdrop, { pointerId: 2, isPrimary: true, button: 2 }); fireEvent.pointerUp(backdrop, { pointerId: 2, isPrimary: true, button: 2 }); expect(events).toEqual([]);
  fireEvent.pointerDown(backdrop, { pointerId: 3, isPrimary: true, button: 0 }); fireEvent.pointerUp(backdrop, { pointerId: 3, isPrimary: true, button: 0 }); expect(events).toEqual([false]);
});

test('native DateInput pending valid submit commits before FormData; rejected controlled submit is blocked', async () => {
  let submitted: FormData | undefined; const values: unknown[] = [];
  const mounted = render(<form onSubmit={event => { event.preventDefault(); if (!event.defaultPrevented) submitted = new FormData(event.currentTarget); }}><DateInput label="Pending" name="pending" withCalendar={false} onValueChange={detail => values.push(detail)} /><Button type="submit">Send</Button></form>);
  const input = screen.getByRole('textbox'); fireEvent.change(input, { target: { value: '2024-02-29' } });
  let prevented = false; input.closest('form')!.addEventListener('submit', event => { prevented = event.defaultPrevented; submitted = new FormData(input.closest('form')!); });
  await act(async () => { input.closest('form')!.requestSubmit(); }); expect(prevented).toBe(false); expect(submitted?.get('pending')).toBe('2024-02-29'); expect(values).toEqual([{ value: '2024-02-29' }]); mounted.unmount();
  render(<form><DateInput label="Rejected" value="2024-02-28" name="rejected" withCalendar={false} /></form>);
  const rejected = screen.getByRole('textbox') as HTMLInputElement; fireEvent.change(rejected, { target: { value: '2024-02-29' } });
  let blocked = false; rejected.form!.addEventListener('submit', event => { blocked = event.defaultPrevented; event.preventDefault(); });
  await act(async () => { rejected.form!.requestSubmit(); }); expect(blocked).toBe(true); expect(rejected.value).toBe('2024-02-28');
});

test('a controlled parent accepting a pending date may submit the fresh canonical value', async () => {
  function Accepted() { const [value, setValue] = useState<string | null>('2024-02-28'); return <form><DateInput label="Accepted" name="accepted" value={value} withCalendar={false} onValueChange={({ value }) => setValue(value)} /></form>; }
  render(<Accepted />); const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.change(input, { target: { value: '2024-02-29' } }); let blocked = true; let value: FormDataEntryValue | null = null;
  input.form!.addEventListener('submit', event => { blocked = event.defaultPrevented; value = new FormData(input.form!).get('accepted'); event.preventDefault(); });
  await act(async () => { input.form!.requestSubmit(); }); expect(blocked).toBe(false); expect(value).toBe('2024-02-29');
});

test('calendar month/year keyboard movement clamps focus without selecting and year edges leave empty cells', async () => {
  const events: unknown[] = [];
  const mounted = render(<Calendar defaultValue="2024-01-31" onValueChange={detail => events.push(detail)} />);
  const date = screen.getByRole('button', { name: /2024년 1월 31일 수요일/ }); date.focus(); await userEvent.keyboard('{PageDown}'); expect(document.activeElement).toHaveAttribute('data-date', '2024-02-29');
  await userEvent.keyboard('{Shift>}{PageDown}{/Shift}'); expect(document.activeElement).toHaveAttribute('data-date', '2025-02-28'); expect(events).toEqual([]); mounted.unmount();
  render(<Calendar referenceDate="9999-12-31" />); expect(document.querySelectorAll('tbody td')).toHaveLength(42); expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled(); expect([...document.querySelectorAll('[data-date]')].every(node => /^\d{4}-\d{2}-\d{2}$/.test(node.getAttribute('data-date')!))).toBe(true);
});

test('repeated StrictMode mounts clean document listeners and preserve existing inert state', async () => {
  const retained = document.createElement('div'); retained.inert = true; document.body.append(retained); let requests = 0;
  for (let iteration = 0; iteration < 3; iteration++) {
    const mounted = render(<StrictMode><Modal open title={`Repeat ${iteration}`} onOpenChange={() => requests++}>Body</Modal></StrictMode>);
    await userEvent.keyboard('{Escape}'); expect(requests).toBe(iteration + 1); mounted.unmount();
    fireEvent.keyDown(document.body, { key: 'Escape' }); expect(requests).toBe(iteration + 1); expect(retained.inert).toBe(true); expect(document.body.style.overflow).not.toBe('hidden');
  }
  retained.remove();
});

test('canceled native reset keeps DateInput and select user values without extra changes', async () => {
  const events: unknown[] = [];
  render(<form onReset={event => event.preventDefault()}><NativeSelect label="Selection" name="selection" defaultValue="a" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} onValueChange={detail => events.push(detail)} /><DateInput label="Reset date" name="reset-date" defaultValue="2024-02-28" withCalendar={false} onValueChange={detail => events.push(detail)} /><Button type="reset">Canceled reset</Button></form>);
  const select = screen.getByRole('combobox') as HTMLSelectElement; await userEvent.selectOptions(select, 'b'); const date = screen.getByRole('textbox') as HTMLInputElement; await userEvent.clear(date); await userEvent.type(date, '2024-02-29{Enter}');
  await userEvent.click(screen.getByText('Canceled reset')); expect(select.value).toBe('b'); expect(date.value).toBe('2024-02-29'); expect(events).toEqual([{ value: 'b' }, { value: '2024-02-29' }]);
});

test('unmounting an open nested modal tree restores document isolation and scroll once', async () => {
  const overflow = document.body.style.overflow; document.body.style.overflow = 'clip';
  const mounted = render(<Modal open title="Outer initial"><Modal open title="Inner initial">Nested body</Modal></Modal>);
  expect(screen.getByRole('dialog', { name: 'Inner initial' })).toHaveFocus(); mounted.unmount();
  expect(document.body.style.overflow).toBe('clip'); expect(document.querySelector('[data-krds-component="modal"][data-krds-part="root"]')).toBeNull(); document.body.style.overflow = overflow;
});

// Independent review regressions: preserve the real native event sequence.
test.each([false, true])('review1 disabled DateInput does not intercept valid form submit (external=%s)', async external => {
  const changes: unknown[] = [];
  render(<>
    <form id="review-disabled-form">
      <input name="other" defaultValue="retained" />
      {!external && <DateInput label="Disabled date" name="date" disabled required onValueChange={detail => changes.push(detail)} />}
      <Button type="submit">Send disabled form</Button>
    </form>
    {external && <DateInput label="Disabled date" name="date" form="review-disabled-form" disabled required onValueChange={detail => changes.push(detail)} />}
  </>);
  const form = document.getElementById('review-disabled-form') as HTMLFormElement;
  let blocked: boolean | undefined;
  let data: Array<[string, FormDataEntryValue]> = [];
  form.addEventListener('submit', event => {
    blocked = event.defaultPrevented;
    data = [...new FormData(form)];
    event.preventDefault();
  });
  await userEvent.click(screen.getByRole('button', { name: 'Send disabled form' }));
  expect(blocked).toBe(false);
  expect(data).toEqual([['other', 'retained']]);
  expect(changes).toEqual([]);
});

test.each([
  { accepts: false, requested: '2024-02-29' },
  { accepts: true, requested: '2024-02-29' },
  { accepts: false, requested: null },
  { accepts: true, requested: null },
])('review1 pointer blur then submit retains controlled intent ($accepts, $requested)', async ({ accepts, requested }) => {
  const changes: unknown[] = [];
  function ControlledForm() {
    const [value, setValue] = useState<string | null>('2024-02-28');
    return <form id="review-controlled-form">
      <DateInput label="Requested date" name="requested" value={value} withCalendar={false}
        onValueChange={detail => { changes.push(detail); if (accepts) setValue(detail.value); }} />
      <Button type="submit">Send requested date</Button>
      <Button onClick={() => setValue(requested)}>Reconcile parent</Button>
    </form>;
  }
  render(<ControlledForm />);
  const form = document.getElementById('review-controlled-form') as HTMLFormElement;
  const submissions: Array<{ blocked: boolean; value: FormDataEntryValue | null }> = [];
  form.addEventListener('submit', event => {
    submissions.push({ blocked: event.defaultPrevented, value: new FormData(form).get('requested') });
    event.preventDefault();
  });
  const input = screen.getByRole('textbox') as HTMLInputElement;
  await userEvent.clear(input);
  if (requested) await userEvent.type(input, requested);
  // A real click blurs the field before the submit event, unlike requestSubmit().
  await userEvent.click(screen.getByRole('button', { name: 'Send requested date' }));
  expect(changes).toEqual([{ value: requested }]);
  expect(submissions).toEqual([{ blocked: !accepts, value: accepts ? requested ?? '' : '2024-02-28' }]);
  expect(input.value).toBe(accepts ? requested ?? '' : '2024-02-28');
  if (!accepts) {
    await userEvent.click(screen.getByRole('button', { name: 'Send requested date' }));
    expect(submissions.at(-1)?.blocked).toBe(true);
    expect(changes).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Reconcile parent' }));
    expect(input.value).toBe(requested ?? '');
    await userEvent.click(screen.getByRole('button', { name: 'Send requested date' }));
    expect(submissions.at(-1)).toEqual({ blocked: false, value: requested ?? '' });
    expect(changes).toHaveLength(1);
  }
});

test.each(['single', 'range'] as const)('review1 Calendar cannot confirm a %s draft invalidated by new bounds', async mode => {
  const changes: unknown[] = [];
  const confirms: unknown[] = [];
  const calendar = (min?: string) => mode === 'single'
    ? <Calendar value={null} min={min} referenceDate="2024-02-15" onValueChange={detail => changes.push(detail)} onConfirm={detail => confirms.push(detail)} />
    : <Calendar mode="range" value={{ start: null, end: null }} min={min} referenceDate="2024-02-15" onValueChange={detail => changes.push(detail)} onConfirm={detail => confirms.push(detail)} />;
  const mounted = render(calendar());
  await userEvent.click(screen.getByRole('button', { name: '2024년 2월 10일 토요일' }));
  if (mode === 'range') await userEvent.click(screen.getByRole('button', { name: '2024년 2월 20일 화요일' }));
  expect(screen.getByRole('button', { name: '확인' })).toBeEnabled();
  mounted.rerender(calendar('2024-02-15'));
  const confirm = screen.getByRole('button', { name: '확인' });
  expect(confirm).toBeDisabled();
  fireEvent.click(confirm);
  expect(changes).toEqual([]);
  expect(confirms).toEqual([]);
});

test.each(['single', 'range'] as const)('review1 DateInput popup revalidates a %s draft when max changes', async mode => {
  const changes: unknown[] = [];
  const input = (max?: string) => mode === 'single'
    ? <DateInput label="Bounded date" value={null} max={max} referenceDate="2024-02-15" onValueChange={detail => changes.push(detail)} />
    : <DateInput mode="range" label="Bounded dates" value={{ start: null, end: null }} max={max} referenceDate="2024-02-15" onValueChange={detail => changes.push(detail)} />;
  const mounted = render(input());
  await userEvent.click(screen.getByRole('button', { name: /달력 열기$/ }));
  await userEvent.click(screen.getByRole('button', { name: '2024년 2월 10일 토요일' }));
  if (mode === 'range') await userEvent.click(screen.getByRole('button', { name: '2024년 2월 20일 화요일' }));
  mounted.rerender(input('2024-02-05'));
  expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
  expect(changes).toEqual([]);
  await userEvent.click(screen.getByRole('button', { name: '취소' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(changes).toEqual([]);
});

class ReviewConfigurationBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() { return this.state.error ? <output role="alert">{this.state.error.name}</output> : this.props.children; }
}
const reviewOwnershipCases = [
  {
    name: 'NativeSelect',
    controlled: () => <NativeSelect label="Ownership" value="" options={[{ value: '', label: 'Empty' }]} />,
    uncontrolled: () => <NativeSelect label="Ownership" options={[{ value: '', label: 'Empty' }]} />,
    conflict: () => <NativeSelect label="Ownership" value="" defaultValue="" options={[{ value: '', label: 'Empty' }]} />,
  },
  {
    name: 'Tabs',
    controlled: () => <Tabs aria-label="Ownership" value="" items={[]} />,
    uncontrolled: () => <Tabs aria-label="Ownership" items={[]} />,
    conflict: () => <Tabs aria-label="Ownership" value="" defaultValue="" items={[]} />,
  },
  {
    name: 'Calendar',
    controlled: () => <Calendar value={null} />,
    uncontrolled: () => <Calendar />,
    conflict: () => <Calendar value={null} defaultValue={null} />,
  },
  {
    name: 'DateInput',
    controlled: () => <DateInput label="Ownership" value={null} />,
    uncontrolled: () => <DateInput label="Ownership" />,
    conflict: () => <DateInput label="Ownership" value={null} defaultValue={null} />,
  },
  {
    name: 'Modal',
    controlled: () => <Modal title="Ownership" open={false} />,
    uncontrolled: () => <Modal title="Ownership" />,
    conflict: () => <Modal title="Ownership" open={false} defaultOpen={false} />,
  },
];
for (const widget of reviewOwnershipCases) {
  test(`review1 ${widget.name} rejects conflicting defaults and both ownership changes`, () => {
    const options = { onCaughtError: () => {} };
    const wrap = (child: ReactNode) => <ReviewConfigurationBoundary>{child}</ReviewConfigurationBoundary>;
    const conflicting = render(wrap(widget.conflict()), options);
    expect(screen.getByRole('alert')).toHaveTextContent('TypeError');
    conflicting.unmount();
    for (const [before, after] of [[widget.controlled, widget.uncontrolled], [widget.uncontrolled, widget.controlled], [widget.controlled, widget.conflict]]) {
      const mounted = render(wrap(before()), options);
      expect(screen.queryByRole('alert')).toBeNull();
      mounted.rerender(wrap(after()));
      expect(screen.getByRole('alert')).toHaveTextContent('TypeError');
      mounted.unmount();
    }
  });
}

test('review1 DateInput reads the uncontrolled default only once, including its reset baseline', async () => {
  const changes: unknown[] = [];
  const field = (defaultValue: string) => <form>
    <DateInput label="Initial default" name="initial" defaultValue={defaultValue} withCalendar={false} onValueChange={detail => changes.push(detail)} />
    <Button type="reset">Restore initial default</Button>
  </form>;
  const mounted = render(field('2024-02-28'));
  mounted.rerender(field('2023-02-29'));
  const input = screen.getByRole('textbox') as HTMLInputElement;
  expect(input.value).toBe('2024-02-28');
  expect(changes).toEqual([]);
  await userEvent.clear(input);
  await userEvent.type(input, '2024-02-29{Enter}');
  await userEvent.click(screen.getByRole('button', { name: 'Restore initial default' }));
  expect(input.value).toBe('2024-02-28');
  expect(changes).toEqual([{ value: '2024-02-29' }]);
});

test.each(['single', 'range'] as const)('review2 a new %s popup Confirm retries a rejected value exactly once', async mode => {
  const changes: unknown[] = [];
  const parent = mode === 'single' ? '2024-02-28' : { start: '2024-02-10', end: '2024-02-12' };
  const requested = mode === 'single' ? '2024-02-29' : { start: '2024-02-20', end: '2024-02-22' };
  render(mode === 'single'
    ? <DateInput label="Retry date" value={parent as string} onValueChange={detail => changes.push(detail)} />
    : <DateInput mode="range" label="Retry range" value={parent as { start: string; end: string }} onValueChange={detail => changes.push(detail)} />);
  for (let attempt = 1; attempt <= 2; attempt++) {
    await userEvent.click(screen.getByRole('button', { name: /달력 열기$/ }));
    if (mode === 'single') {
      await userEvent.click(screen.getByRole('button', { name: '2024년 2월 29일 목요일' }));
    } else {
      await userEvent.click(screen.getByRole('button', { name: '2024년 2월 20일 화요일' }));
      await userEvent.click(screen.getByRole('button', { name: '2024년 2월 22일 목요일' }));
    }
    await userEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(changes).toEqual(Array.from({ length: attempt }, () => ({ value: requested })));
    const fields = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(fields.map(field => field.value)).toEqual(mode === 'single' ? [parent] : ['2024-02-10', '2024-02-12']);
  }
});

test.each(['single', 'range'] as const)('review2 confirming authoritative %s parent value supersedes rejected intent before submit', async mode => {
  const changes: unknown[] = [];
  const parent = mode === 'single' ? '2024-02-28' : { start: '2024-02-10', end: '2024-02-12' };
  const requested = mode === 'single' ? '2024-02-29' : { start: '2024-02-20', end: '2024-02-22' };
  render(<form id="review2-confirm-form">
    {mode === 'single'
      ? <DateInput label="Current date" name="current" value={parent as string} onValueChange={detail => changes.push(detail)} />
      : <DateInput mode="range" label="Current range" name="current" value={parent as { start: string; end: string }} onValueChange={detail => changes.push(detail)} />}
    <Button type="submit">Submit confirmed parent</Button>
  </form>);
  const form = document.getElementById('review2-confirm-form') as HTMLFormElement;
  const submissions: Array<{ blocked: boolean; data: Array<[string, FormDataEntryValue]> }> = [];
  form.addEventListener('submit', event => {
    submissions.push({ blocked: event.defaultPrevented, data: [...new FormData(form)] });
    event.preventDefault();
  });
  await userEvent.click(screen.getByRole('button', { name: /달력 열기$/ }));
  if (mode === 'single') {
    await userEvent.click(screen.getByRole('button', { name: '2024년 2월 29일 목요일' }));
  } else {
    await userEvent.click(screen.getByRole('button', { name: '2024년 2월 20일 화요일' }));
    await userEvent.click(screen.getByRole('button', { name: '2024년 2월 22일 목요일' }));
  }
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(changes).toEqual([{ value: requested }]);
  // Reopening initializes the popup from authoritative A, not rejected B.
  await userEvent.click(screen.getByRole('button', { name: /달력 열기$/ }));
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(changes).toEqual([{ value: requested }]);
  await userEvent.click(screen.getByRole('button', { name: 'Submit confirmed parent' }));
  expect(submissions).toEqual([{
    blocked: false,
    data: mode === 'single' ? [['current', parent]] : [['current.start', '2024-02-10'], ['current.end', '2024-02-12']],
  }]);
  expect(changes).toEqual([{ value: requested }]);
});
