import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';
import { expect, test } from 'vitest';
import { Calendar, DateInput, type DateValue } from '@unofficial-krds/angular';

// Empty display text is editable, but empty strings cannot cross the canonical API boundary.
const invalidValues: { label: string; mode: 'single' | 'range'; value: DateValue }[] = [
    { label: 'single empty string', mode: 'single', value: '' },
    { label: 'two empty endpoints', mode: 'range', value: { start: '', end: '' } },
    { label: 'empty start and absent end', mode: 'range', value: { start: '', end: null } },
    { label: 'absent start and empty end', mode: 'range', value: { start: null, end: '' } },
    { label: 'valid start and empty end', mode: 'range', value: { start: '2024-02-29', end: '' } },
];
for (const [name, component] of [['Calendar', Calendar], ['DateInput', DateInput]] as const) {
    for (const input of ['value', 'defaultValue'] as const) {
        test.each(invalidValues)(`${name} ${input} rejects $label with RangeError`, async ({ mode, value }) => {
            await expect(render<Calendar | DateInput>(component, { componentInputs: { id: 'canonical-date', label: '날짜', mode, [input]: value } })).rejects.toThrow(RangeError);
        });
    }
}

@Component({ standalone: true, imports: [DateInput, ReactiveFormsModule], template: `<krds-date-input id="canonical-cva" label="폼 날짜" [mode]="mode" [formControl]="control" (valueChange)="changes.push($event)" />` })
class CanonicalFormHarness {
    @Input() mode: 'single' | 'range' = 'single';
    readonly control = new FormControl<DateValue>(null);
    readonly changes: unknown[] = [];
}
test.each(invalidValues)('Reactive Forms CVA rejects $label without a user notification', async ({ mode, value }) => {
    const view = await render(CanonicalFormHarness, { inputs: { mode } });
    expect(() => view.fixture.componentInstance.control.setValue(value)).toThrow(RangeError);
    expect(view.fixture.componentInstance.changes).toEqual([]);
});

test('canonical null remains valid without a user notification', async () => {
    const changes: unknown[] = [];
    const view = await render(DateInput, { inputs: { id: 'empty-edit', label: '날짜', defaultValue: '2024-02-29' }, on: { valueChange: value => changes.push(value) } });
    view.fixture.componentInstance.writeValue(null);
    expect(view.fixture.componentInstance.current()).toBe(null);
    expect(changes).toEqual([]);
});
