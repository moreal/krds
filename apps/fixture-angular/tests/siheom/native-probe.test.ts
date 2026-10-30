/** Native infrastructure only; this does not assert KRDS component coverage. */
import { Component, getDebugNode, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/dom';
import { actions, assertions, given, query, runSiheom } from '@siheom/angular';
import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { NativeProbe } from '../../src/native-probe';
@Component({
    selector: 'test-controlled-probe', standalone: true, imports: [NativeProbe],
    template: `<krds-native-probe [count]="count()" [label]="label()" (change)="count.set($event)" />`,
})
class ControlledProbe {
    count = signal(0);
    label = signal('Probe increment');
}
test('native adapter render, click, controlled state update and cleanup', async () => {
    await runSiheom(given.render(ControlledProbe), assertions.textContent(query.status('Probe value'), '0'), actions.click(query.button('Probe increment')), assertions.textContent(query.status('Probe value'), '1'));
    const controller = getDebugNode(screen.getByRole('button'))!.injector.get(ControlledProbe);
    controller.count.set(7);
    controller.label.set('Updated probe');
    await runSiheom(assertions.textContent(query.status('Probe value'), '7'), actions.click(query.button('Updated probe')), assertions.textContent(query.status('Probe value'), '8'));
    TestBed.resetTestingModule();
    expect(screen.queryByRole('button')).toBeNull();
    expect(document.querySelector('krds-native-probe')).toBeNull();
});
test('native adapter synthetic click focuses the native button', async () => {
    await runSiheom(given.render(ControlledProbe), actions.click(query.button('Probe increment')), assertions.focused(query.button('Probe increment')));
});
test('Playwright provider trusted click focuses the native button', async () => {
    await runSiheom(given.render(ControlledProbe));
    let trusted = false;
    screen.getByRole('button', { name: 'Probe increment' }).addEventListener('click', event => { trusted = event.isTrusted; }, { once: true });
    await userEvent.click(page.getByRole('button', { name: 'Probe increment' }));
    expect(trusted).toBe(true);
    await runSiheom(assertions.focused(query.button('Probe increment')), assertions.textContent(query.status('Probe value'), '1'));
});
