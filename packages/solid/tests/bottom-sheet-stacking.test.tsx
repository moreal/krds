import { afterEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'solid-js/web';
import type { JSX } from 'solid-js';
import '@unofficial-krds/styles/all.css';
import * as K from '../src';
const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).forEach(cleanup => cleanup()); });
function mount(view: () => JSX.Element) { const host = document.createElement('div'); document.body.append(host); const dispose = render(view, host); cleanups.push(() => { dispose(); host.remove(); }); return host; }
const hit = (node: Element) => { const box = node.getBoundingClientRect(); return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2); };

test('BottomSheet is a bottom-anchored surface above the modal backdrop: hit-testing a sheet control returns that control', async () => {
  await page.viewport(390, 700);
  const regions = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종'];
  mount(() => <K.BottomSheet title="지역 선택" defaultOpen={true} actions={<button type="button">적용</button>}><fieldset><legend>지역</legend>{regions.map(region => <label style={{ display: 'block' }}><input type="radio" name="region" value={region}/>{region}</label>)}</fieldset></K.BottomSheet>);
  await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
  const surface = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]')!, box = surface.getBoundingClientRect();
  expect({ bottom: Math.round(box.bottom), left: Math.round(box.left), width: Math.round(box.width) }, 'the sheet surface is anchored to the viewport bottom edge at full width').toEqual({ bottom: document.documentElement.clientHeight, left: 0, width: document.documentElement.clientWidth });
  expect(surface.contains(document.querySelector('[data-krds-component="bottom-sheet"][data-krds-part="handle"]')), 'the handle sits on the bottom-anchored surface').toBe(true);
  const apply = [...document.querySelectorAll('button')].find(node => node.textContent === '적용')!;
  const radios = [...document.querySelectorAll<HTMLInputElement>('input[name="region"]')];
  for (const control of [...radios, ...radios.map(radio => radio.closest('label')!), apply, document.querySelector('[data-krds-component="bottom-sheet"][data-krds-part="close"]')!]) {
    control.scrollIntoView({ block: 'nearest' });
    const target = hit(control);
    expect(target === control || control.contains(target), `${control.outerHTML.slice(0, 60)} is hit, not ${target?.outerHTML.slice(0, 90)}`).toBe(true);
  }
});

test('BottomSheet follows the shared sheet anatomy order: handle, then header (title, close), then body; the handle carries no text', async () => {
  mount(() => <K.BottomSheet title="지역 선택" description="한 곳을 고르세요" defaultOpen={true}><p>본문</p></K.BottomSheet>);
  await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
  const sheet = (name: string) => document.querySelector<HTMLElement>(`[data-krds-component="bottom-sheet"][data-krds-part="${name}"]`)!;
  const dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]')!;
  const order = [...dialog.querySelectorAll<HTMLElement>('[data-krds-part="handle"],[data-krds-part="header"],[data-krds-part="title"],[data-krds-part="close"],[data-krds-part="body"][data-krds-component="bottom-sheet"]')].map(node => node.getAttribute('data-krds-part'));
  expect(order).toEqual(['handle', 'header', 'title', 'close', 'body']);
  expect([sheet('title').parentElement, sheet('close').parentElement]).toEqual([sheet('header'), sheet('header')]);
  expect(dialog.querySelectorAll('h2').length, 'one visible title').toBe(1);
  expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).toBe(sheet('title'));
  expect(document.getElementById(dialog.getAttribute('aria-describedby')!)?.textContent).toBe('한 곳을 고르세요');
  expect(sheet('handle').textContent, 'the handle bar is drawn by CSS only').toBe('');
  expect(sheet('handle').getAttribute('aria-label')).toBe('시트 닫기');
  const handleBox = sheet('handle').getBoundingClientRect(), dialogBox = dialog.getBoundingClientRect();
  expect(Math.abs((handleBox.left + handleBox.right) / 2 - (dialogBox.left + dialogBox.right) / 2), 'the handle is centred at the sheet top').toBeLessThan(2);
});

test('a public Modal nested in the sheet body keeps its own title: the owned heading is keyed to the sheet title id only', async () => {
  mount(() => <K.BottomSheet title="지역 선택" defaultOpen={true}><K.Modal title="정말 닫을까요?" titleId="inner-title" description="선택이 사라집니다" descriptionId="inner-description" defaultOpen={true}><p>내부</p></K.Modal></K.BottomSheet>);
  await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
  const inner = [...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].find(dialog => dialog.getAttribute('aria-labelledby') === 'inner-title')!;
  expect([inner.querySelectorAll('h2').length, document.getElementById('inner-title')?.textContent, document.getElementById('inner-description')?.textContent]).toEqual([1, '정말 닫을까요?', '선택이 사라집니다']);
  expect(document.getElementById('inner-title')?.getAttribute('data-krds-component')).toBe('modal');
});

test('a public Modal nested in the sheet body dismisses without reporting its cause to the sheet', async () => {
  const sheetRequests: string[] = []; let cancels = 0;
  mount(() => <K.BottomSheet title="지역 선택" defaultOpen={true} dismissOnOutside={true} onOpenChange={({ reason }) => sheetRequests.push(reason)} onCancel={() => cancels++}><K.Modal title="정말 닫을까요?" titleId="inner-title" defaultOpen={true} closeOnOutsideClick={true}><button type="button">내부 동작</button></K.Modal></K.BottomSheet>);
  await new Promise(resolve => setTimeout(resolve, 50));
  const inner = () => [...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].find(dialog => dialog.getAttribute('aria-labelledby') === 'inner-title');
  expect(inner()).toBeTruthy();
  await userEvent.keyboard('{Escape}');
  await new Promise(resolve => setTimeout(resolve, 50));
  expect(inner(), 'Escape closes only the topmost nested Modal').toBeUndefined();
  expect([sheetRequests, cancels], 'the nested dismissal never reaches the sheet').toEqual([[], 0]);
  await userEvent.keyboard('{Escape}');
  await new Promise(resolve => setTimeout(resolve, 50));
  expect([sheetRequests, cancels], 'the sheet still reports its own Escape').toEqual([['escape'], 1]);
});
