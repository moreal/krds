import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import { FAB } from '../src';

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach(dispose => dispose()));

test('FAB plus token renders an actual pictogram without wrapped token text', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const dispose = render(() => <FAB label="새 신청" icon="plus"/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const icon = host.querySelector('[data-krds-part="icon"]')!;
  expect(icon.querySelector('svg path')).not.toBeNull();
  expect(icon.textContent).toBe('');
  expect(host.querySelector('button')?.textContent).toBe('새 신청');
});

test('Expanded FAB owns a real backdrop that closes and restores its trigger', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const dispose = render(() => <FAB label="신청 작업" icon="plus" defaultExpanded actions={[{ id: 'new', label: '새 신청', onAction() {} }]}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const action = host.querySelector<HTMLButtonElement>('[data-krds-part="action"]')!;
  action.focus();
  const overlay = host.querySelector<HTMLElement>('[data-krds-part="overlay"]');
  expect(overlay).not.toBeNull();
  overlay!.click();
  await Promise.resolve();
  const trigger = host.querySelector('[data-krds-part="trigger"]');
  expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(trigger);
  expect(host.querySelector('[data-krds-part="overlay"]')).toBeNull();
});

test('Icon-only FAB keeps its required accessible name while hiding only the visual label', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const dispose = render(() => <FAB label="새 신청" icon="plus" showLabel={false}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  expect(host.querySelector('button')?.getAttribute('aria-label')).toBe('새 신청');
  expect(host.querySelector('[data-krds-part="root"]')?.getAttribute('data-krds-variant')).toBe('single-icon');
  expect(host.querySelector<HTMLElement>('[data-krds-part="label"]')?.hidden).toBe(true);
});
