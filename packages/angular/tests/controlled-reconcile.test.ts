import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { Checkbox } from '../src/lib/components/checkbox/checkbox';
import { Switch } from '../src/lib/components/switch/switch';
import { NativeSelect } from '../src/lib/components/native-select/native-select';

const settle = () => new Promise(resolve => setTimeout(resolve, 100));
const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];

@Component({ selector: 'host-accept', standalone: true, imports: [Checkbox, Switch, NativeSelect], template: `
  <krds-checkbox label="c" [checked]="c()" (checkedChange)="c.set($event.checked)"/>
  <krds-switch label="s" [checked]="s()" (checkedChange)="s.set($event.checked)"/>
  <krds-native-select id="sel" label="n" [options]="options" [value]="v()" (valueChange)="v.set($event.value)"/>` })
class Accept { c = signal(false); s = signal(false); v = signal('a'); options = options; }

@Component({ selector: 'host-reject', standalone: true, imports: [Checkbox, Switch, NativeSelect], template: `
  <krds-checkbox label="c" [checked]="false"/><krds-switch label="s" [checked]="false"/>
  <krds-native-select id="sel" label="n" [options]="options" value="a"/>` })
class Reject { options = options; }

async function mount<T>(type: new () => T) {
  const fixture = TestBed.createComponent(type); fixture.detectChanges(); await settle(); fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  return { fixture, checkbox: root.querySelector<HTMLInputElement>('input[type=checkbox]:not([role=switch])')!, toggle: root.querySelector<HTMLInputElement>('input[role=switch]')!, select: root.querySelector<HTMLSelectElement>('select')! };
}

test('controlled checkbox, switch and select keep the native state synchronously after the user acts', async () => {
  const { fixture, checkbox, toggle, select } = await mount(Accept);
  checkbox.click(); expect(checkbox.checked).toBe(true);
  toggle.click(); expect(toggle.checked).toBe(true);
  select.value = 'b'; select.dispatchEvent(new Event('change', { bubbles: true })); expect(select.value).toBe('b');
  await settle(); fixture.detectChanges();
  expect([fixture.componentInstance.c(), fixture.componentInstance.s(), fixture.componentInstance.v()]).toEqual([true, true, 'b']);
  expect([checkbox.checked, toggle.checked, select.value]).toEqual([true, true, 'b']);
});

test('controlled checkbox, switch and select revert a change the owner rejects after the next render', async () => {
  const { fixture, checkbox, toggle, select } = await mount(Reject);
  checkbox.click(); toggle.click(); select.value = 'b'; select.dispatchEvent(new Event('change', { bubbles: true }));
  await settle(); fixture.detectChanges(); await settle();
  expect([checkbox.checked, toggle.checked, select.value]).toEqual([false, false, 'a']);
});
