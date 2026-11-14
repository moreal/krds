import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; [key: string]: unknown };
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Tooltip with touchToggle still opens on mouse hover and on keyboard focus, and a touch tap toggles it', async () => {
  const tooltip = document.createElement('krds-tooltip') as Host;
  Object.assign(tooltip, { touchToggle: true, text: '설명', triggerLabel: '정보', triggerId: 'touch-hover-trigger', textId: 'touch-hover-text' });
  document.body.append(tooltip); cleanup.push(() => tooltip.remove());
  await tooltip.updateComplete;
  const root = tooltip.shadowRoot!.querySelector<HTMLElement>('[data-krds-part="root"]')!, trigger = tooltip.shadowRoot!.querySelector('button')!, popup = tooltip.shadowRoot!.querySelector<HTMLElement>('[role="tooltip"]')!;
  const settle = async () => { await tooltip.updateComplete; return popup.hidden; };

  root.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
  expect(await settle()).toBe(false);
  root.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
  await wait(200);
  expect(await settle()).toBe(true);

  trigger.focus();
  expect(await settle()).toBe(false);
  trigger.blur(); await wait(0);
  expect(await settle()).toBe(true);

  // A touch contact leaves opening to the click, so the tap toggles instead of opening and closing at once.
  root.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
  expect(await settle()).toBe(true);
  trigger.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true, composed: true }));
  root.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'touch' }));
  trigger.focus(); trigger.click();
  expect(await settle()).toBe(false);
  await wait(200);
  expect(await settle()).toBe(false);
  trigger.click();
  expect(await settle()).toBe(true);
});
