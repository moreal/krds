import { afterEach, expect, test } from 'vitest';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { CatalogView } from '../../src/catalog-view';
const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach(dispose => dispose()));
test('Actual false Masthead host prop never exposes the official sentence', () => {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(() => <CatalogView componentId="masthead" state={() => ({ governmentService: false, __host: { specimenLabel: '독립 예제' } })} emit={() => {}} patch={() => {}}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  expect(host.textContent).not.toContain('이 누리집은 대한민국 공식 전자정부 누리집입니다.');
});
test('Undeclared Tutorial composition leaves standalone Coach Stop as one openChange request', async () => {
  const host = document.createElement('div'); document.body.append(host); const events: string[] = [];
  const [state, setState] = createSignal<Record<string, any>>({ open: true, stepId: 'one', startActionId: 'standalone-start', steps: [{ id: 'one', targetId: 'standalone-target', title: 'Standalone', instruction: 'Act' }], __host: {} });
  const dispose = render(() => <CatalogView componentId="coach-mark" state={state} emit={(name, _detail, patch) => { events.push(name); if (patch) setState(previous => ({ ...previous, ...patch })); }} patch={patch => setState(previous => ({ ...previous, ...patch }))}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  await Promise.resolve(); await Promise.resolve();
  document.querySelector<HTMLButtonElement>('[data-krds-component="coach-mark"][data-krds-part="stop"]')!.click();
  expect(events).toEqual(['openChange']);
});
test('Badge samples render all real declared sizes and the full shared label', () => {
  const host = document.createElement('div'); document.body.append(host);
  const label = 'A complete long badge label';
  const dispose = render(() => <CatalogView componentId="badge" state={() => ({ label, size: 'medium', __host: { samples: [{ size: 'small' }, { size: 'medium' }, { size: 'large' }] } })} emit={() => {}} patch={() => {}}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  const badges = [...host.querySelectorAll('[data-krds-component="badge"][data-krds-part="root"]')];
  expect(badges).toHaveLength(4); expect(badges.map(node => node.textContent)).toEqual([label, label, label, label]);
  expect(badges.map(node => node.getAttribute('data-krds-size'))).toEqual(['medium', 'small', 'medium', 'large']);
});
test('TTS host actually disposes its local active driver and retains truthful lifecycle receipts', async () => {
  const host = document.createElement('div'); document.body.append(host); const requests: any[] = [];
  const [state, setState] = createSignal<Record<string, any>>({ state: 'idle', summary: 'Local speech summary', locale: 'ko', label: 'Voice', __host: {} });
  const patch = (change: Record<string, any>) => setState(previous => ({ ...previous, ...change }));
  const dispose = render(() => <CatalogView componentId="tts" state={state} emit={(name, detail) => { if (name === 'request') requests.push(detail); }} patch={patch}/>, host);
  cleanups.push(() => { dispose(); host.remove(); });
  host.querySelector<HTMLButtonElement>('[data-krds-part="play"]')!.click();
  expect(host.querySelector('[data-krds-host="speech-driver-active"]')?.textContent).toBe('true');
  expect(host.querySelector('[data-krds-host="speech-driver-lifecycle"]')?.textContent).toBe('playing');
  patch({ __host: { mounted: false } }); await Promise.resolve(); await Promise.resolve();
  expect(host.querySelector('[data-krds-component="tts"]')).toBeNull();
  expect(host.querySelector('[data-krds-host="speech-driver-active"]')?.textContent).toBe('false');
  expect(host.querySelector('[data-krds-host="speech-driver-lifecycle"]')?.textContent).toBe('disposed');
  expect(host.querySelector('[data-krds-host="speech-state"]')?.textContent).toBe('idle');
  expect(requests.filter(detail => detail.action === 'play')).toHaveLength(1);
  const stops = requests.filter(detail => detail.action === 'stop'); expect(stops.length).toBeLessThanOrEqual(1);
  for (const detail of stops) expect(detail).toEqual({ action: 'stop', summary: 'Local speech summary', locale: 'ko' });
});
