import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';
import { NativeSelect } from '@unofficial-krds/angular';
import { expect, test } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
// Detects CVAs that replay writes, lose touched/disabled/reset, or do not update Reactive Forms.
test('native Reactive Forms writes emit zero user events while edits, touched, disabled and reset stay connected', async () => {
    await openPilot('forms', 'reactive');
    const user = userEvent.setup();
    await runSiheom(assertions.value(query.combobox('폼 지역'), 'seoul'), assertions.value(query.textbox('폼 날짜'), '2024-02-29'));
    expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
    await user.click(screen.getByRole('button', { name: '프로그램 값' }));
    expect(screen.getByRole('combobox', { name: '폼 지역' })).toHaveValue('busan');
    expect(screen.getByRole('textbox', { name: '폼 날짜' })).toHaveValue('2024-03-01');
    expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
    await user.selectOptions(screen.getByRole('combobox', { name: '폼 지역' }), 'seoul');
    const date = screen.getByRole('textbox', { name: '폼 날짜' });
    await user.clear(date);
    await user.type(date, '2024-02-29{Enter}');
    await user.tab();
    expect(screen.getByRole('status', { name: 'Fixture health' })).toHaveTextContent('ready');
    expect(screen.getByLabelText('폼 상태')).toHaveTextContent('valid touched');
    expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([{ name: 'selectChange', detail: { value: 'seoul' } }, { name: 'dateChange', detail: { value: '2024-02-29' } }]);
    await user.click(screen.getByRole('button', { name: '비활성화' }));
    expect(date).toBeDisabled();
    expect(screen.getByRole('combobox', { name: '폼 지역' })).toBeDisabled();
    expect([...new FormData(document.getElementById('reactive-form') as HTMLFormElement)]).toEqual([]);
    await user.click(screen.getByRole('button', { name: '비활성화' }));
    await user.click(screen.getByRole('button', { name: '초기화' }));
    expect(date).toHaveValue('');
    expect(screen.getByRole('combobox', { name: '폼 지역' })).toHaveValue('seoul');
    expect(screen.getByLabelText('폼 상태')).toHaveTextContent('invalid untouched');
    expect(window.__KRDS_FIXTURE__!.readEvents()).toHaveLength(2);
});
test('native DateInput validator rejects impossible draft without replacing canonical Reactive Forms value', async () => {
    await openPilot('forms', 'reactive');
    const user = userEvent.setup();
    const date = screen.getByRole('textbox', { name: '폼 날짜' });
    await user.clear(date);
    await user.type(date, '2023-02-29{Enter}');
    expect(date).toHaveValue('2023-02-29');
    expect(date).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('폼 값')).toHaveTextContent('2024-02-29');
    expect(screen.getByLabelText('폼 상태')).toHaveTextContent('invalid');
    expect((date as HTMLInputElement).validity.valid).toBe(false);
    expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
});

@Component({ standalone: true, imports: [NativeSelect, ReactiveFormsModule], template: `<krds-native-select id="count-region" label="횟수 지역" [options]="options" [formControl]="region" required (valueChange)="requests.push($event.value)" />` })
class SelectionCountHarness {
    readonly region = new FormControl('seoul', { nonNullable: true });
    readonly requests: string[] = [];
    readonly options = [{ value: '', label: '선택' }, { value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
}
// A CVA user change already causes Angular to validate; a second validator callback must not replay it.
test('NativeSelect commits one Reactive Forms notification per native selection', async () => {
    const view = await render(SelectionCountHarness);
    const instance = view.fixture.componentInstance;
    const values: string[] = [];
    const subscription = instance.region.valueChanges.subscribe(value => values.push(value));
    const user = userEvent.setup(); const select = screen.getByRole('combobox', { name: '횟수 지역' });
    try {
        await user.selectOptions(select, 'busan');
        expect(values).toEqual(['busan']); expect(instance.requests).toEqual(['busan']);
        await user.selectOptions(select, 'busan'); expect(values).toEqual(['busan']);
        await user.selectOptions(select, '');
        expect(values).toEqual(['busan', '']); expect(instance.requests).toEqual(['busan', '']);
        expect(instance.region.hasError('required')).toBe(true);
    } finally { subscription.unsubscribe(); }
});
