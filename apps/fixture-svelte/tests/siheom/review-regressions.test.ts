import { afterEach, expect, test } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { userEvent } from 'vitest/browser';
import { Calendar, DateInput } from '@unofficial-krds/svelte';
import ReviewRangesHarness from './ReviewRangesHarness.svelte';

const reorderedRange = { end: '2024-02-18', start: '2024-02-12' };
const owners = new Set<HTMLFormElement>();
let ownerId = 0;

function formOwner() {
    const form = document.createElement('form');
    form.id = `review-form-${++ownerId}`;
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Submit review form';
    form.append(submit);
    document.body.append(form);
    owners.add(form);
    return { form, submit };
}

afterEach(() => {
    for (const form of owners) form.remove();
    owners.clear();
});

test('R1 unchanged reordered range Enter emits no value request', async () => {
    const changes: unknown[] = [];
    const view = render(DateInput, { props: {
        mode: 'range', label: 'Unchanged range', value: reorderedRange,
        withCalendar: false, onValueChange: detail => changes.push(detail),
    } });
    await fireEvent.keyDown(view.getAllByRole('textbox')[0], { key: 'Enter' });
    expect(changes).toEqual([]);
});

test('R1 unchanged reordered range group blur emits no value request', async () => {
    const changes: unknown[] = [];
    const view = render(DateInput, { props: {
        mode: 'range', label: 'Unchanged range', value: reorderedRange,
        withCalendar: false, onValueChange: detail => changes.push(detail),
    } });
    const field = view.getAllByRole('textbox')[0];
    const { submit: outside } = formOwner();
    outside.type = 'button';
    await userEvent.click(field);
    await userEvent.click(outside);
    await tick();
    expect(changes).toEqual([]);
});

test('R1 unchanged reordered range permits native submit without a value request', async () => {
    const { form, submit } = formOwner();
    const changes: unknown[] = [];
    render(DateInput, { props: {
        mode: 'range', label: 'Submitted range', name: 'trip', form: form.id,
        value: reorderedRange, withCalendar: false,
        onValueChange: detail => changes.push(detail),
    } });
    const submissions: { blocked: boolean; values: [string, FormDataEntryValue][] }[] = [];
    form.addEventListener('submit', event => {
        submissions.push({ blocked: event.defaultPrevented, values: Array.from(new FormData(form).entries()) });
        event.preventDefault(); // Stop test navigation after observing the adapter's decision.
    });
    await userEvent.click(submit);
    expect(submissions).toEqual([{ blocked: false, values: [
        ['trip.start', '2024-02-12'], ['trip.end', '2024-02-18'],
    ] }]);
    expect(changes).toEqual([]);
});

test('R1 reselecting an unchanged reordered Calendar range emits only Confirm', async () => {
    const changes: unknown[] = [];
    const confirmations: unknown[] = [];
    const view = render(Calendar, { props: {
        mode: 'range', label: 'Unchanged calendar', value: reorderedRange,
        onValueChange: detail => changes.push(detail), onConfirm: detail => confirmations.push(detail),
    } });
    await fireEvent.click(view.getByRole('button', { name: /^2024년 2월 12일 월요일/ }));
    await fireEvent.click(view.getByRole('button', { name: /^2024년 2월 18일 일요일/ }));
    await fireEvent.click(view.getByRole('button', { name: '확인' }));
    await tick();
    expect(changes).toEqual([]);
    expect(confirmations).toEqual([{ value: { start: '2024-02-12', end: '2024-02-18' } }]);
});

for (const [description, end, max] of [
    ['format', '2024-02-30', undefined],
    ['bound', '2024-02-21', '2024-02-20'],
] as const) {
    test(`R2 end-only ${description} error leaves start valid and native submit focuses end`, async () => {
        const { form, submit } = formOwner();
        const view = render(DateInput, { props: {
            mode: 'range', label: 'Validation ownership', form: form.id,
            defaultValue: { start: '2024-02-12', end: '2024-02-18' },
            withCalendar: false, max,
        } });
        const [startField, endField] = view.getAllByRole('textbox') as HTMLInputElement[];
        await fireEvent.input(endField, { target: { value: end } });
        await userEvent.click(submit);
        expect(startField.validity.valid).toBe(true);
        expect(startField.getAttribute('aria-invalid')).not.toBe('true');
        expect(endField.validity.customError).toBe(true);
        expect(endField.getAttribute('aria-invalid')).toBe('true');
        expect(document.activeElement).toBe(endField);
        const message = view.container.querySelector('[data-krds-part="error"]');
        expect(message?.textContent?.trim()).toBeTruthy();
        expect(endField.getAttribute('aria-describedby')).toContain(message!.id);
    });
}

test('R2 both malformed fields are invalid and native submit focuses start first', async () => {
    const { form, submit } = formOwner();
    const view = render(DateInput, { props: {
        mode: 'range', label: 'Both invalid', form: form.id, withCalendar: false,
        defaultValue: { start: '2024-02-12', end: '2024-02-18' },
    } });
    const [startField, endField] = view.getAllByRole('textbox') as HTMLInputElement[];
    await fireEvent.input(startField, { target: { value: '2024-02-30' } });
    await fireEvent.input(endField, { target: { value: '2024-02-31' } });
    await userEvent.click(submit);
    expect(startField.getAttribute('aria-invalid')).toBe('true');
    expect(endField.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(startField);
});

test('R2 the explicit failed-submit path reports the affected end input', async () => {
    const { form } = formOwner();
    const view = render(DateInput, { props: {
        mode: 'range', label: 'Explicit submit', form: form.id, withCalendar: false,
        defaultValue: { start: '2024-02-12', end: '2024-02-18' },
    } });
    const [startField, endField] = view.getAllByRole('textbox') as HTMLInputElement[];
    await fireEvent.input(endField, { target: { value: '2024-02-30' } });
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    await tick();
    expect(event.defaultPrevented).toBe(true);
    expect(startField.validity.valid).toBe(true);
    expect(document.activeElement).toBe(endField);
});

test('R3 two range calendar openers include task context and preserve the translated action', () => {
    const view = render(ReviewRangesHarness);
    const outbound = view.getByRole('button', { name: 'Outbound dates Open calendar' });
    const returning = view.getByRole('button', { name: 'Return dates Choose dates' });
    expect(outbound.textContent).toBe('Open calendar');
    expect(returning.textContent).toBe('Choose dates');
    expect(outbound.getAttribute('aria-controls')).not.toBe(returning.getAttribute('aria-controls'));
});
