import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; [key: string]: unknown };
const deepActive = () => { let active = document.activeElement; while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement; return active; };
const frame = () => new Promise(resolve => setTimeout(resolve, 0));

function mountModal(container: ParentNode = document.body) {
  const opener = document.createElement('button'); opener.type = 'button'; opener.textContent = '열기';
  const modal = document.createElement('krds-modal') as Host;
  Object.assign(modal, { open: false, title: '신청 확인', description: '확인 후 닫아 주세요.' });
  modal.addEventListener('open-change', ((event: CustomEvent) => { modal.open = event.detail.open; }) as EventListener);
  opener.addEventListener('click', () => { modal.open = true; });
  container.append(opener, modal);
  cleanup.push(() => { opener.remove(); modal.remove(); });
  return { opener, modal };
}

// WebKit does not focus a pointer-activated button; HTMLElement.click() reproduces that
// "activation without focus" deterministically in every engine.
test('Modal returns focus to a light-DOM opener that was activated without receiving focus (WebKit click)', async () => {
  const { opener, modal } = mountModal();
  document.body.focus();
  opener.click();
  await modal.updateComplete;
  expect(document.activeElement).not.toBe(opener);
  expect(modal.shadowRoot!.querySelector('dialog')!.open).toBe(true);
  await userEvent.keyboard('{Escape}');
  await modal.updateComplete; await frame();
  expect(modal.shadowRoot!.querySelector('dialog')).toBeNull();
  expect(deepActive()).toBe(opener);
});

test('Modal returns focus to a real pointer-clicked opener (WebKit leaves it unfocused)', async () => {
  const { opener, modal } = mountModal();
  await userEvent.click(opener);
  await modal.updateComplete;
  await userEvent.keyboard('{Escape}');
  await modal.updateComplete; await frame();
  expect(deepActive()).toBe(opener);
  // Leave no pointer resting where later fixtures mount (hover legitimately pauses Carousel).
  await userEvent.unhover(opener);
});

test('Modal returns focus to an opener inside another shadow root that was activated without focus', async () => {
  const outer = document.createElement('div'); document.body.append(outer); cleanup.push(() => outer.remove());
  const shadow = outer.attachShadow({ mode: 'open' });
  const { opener, modal } = mountModal(shadow);
  opener.click();
  await modal.updateComplete;
  await userEvent.keyboard('{Escape}');
  await modal.updateComplete; await frame();
  expect(shadow.activeElement).toBe(opener);
  expect(deepActive()).toBe(opener);
});

test('Modal still returns focus to a keyboard opener and ignores stale clicks from an earlier task', async () => {
  const { opener, modal } = mountModal();
  const stale = document.createElement('button'); stale.textContent = 'stale'; document.body.append(stale); cleanup.push(() => stale.remove());
  stale.click(); await frame();
  opener.focus(); await userEvent.keyboard('{Enter}');
  await modal.updateComplete;
  await userEvent.keyboard('{Escape}');
  await modal.updateComplete; await frame();
  expect(deepActive()).toBe(opener);
});

// Docs-matrix lit/carousel: autoplay must advance after connect with real timers and no interaction.
test('Carousel autoplay advances after connect under real timers without any interaction', async () => {
  const carousel = document.createElement('krds-carousel') as Host;
  Object.assign(carousel, { autoplay: true, intervalMs: 150, items: [{ id: 'a', label: '첫째', content: '1' }, { id: 'b', label: '둘째', content: '2' }, { id: 'c', label: '셋째', content: '3' }] });
  let callbacks = 0; carousel.addEventListener('playing-change', () => { callbacks++; });
  document.body.append(carousel); cleanup.push(() => carousel.remove());
  await carousel.updateComplete;
  const current = () => carousel.shadowRoot!.querySelector('[data-krds-part="slide"][data-krds-state~="active"]')!.getAttribute('aria-label');
  expect(current()).toMatch(/^1 \/ 3/);
  await expect.poll(current, { timeout: 2000 }).toMatch(/^2 \/ 3/);
  expect(callbacks).toBe(0);
  // The visible position lives in the Shadow DOM, so a light-DOM innerText observer cannot see it.
  expect(document.body.innerText).not.toMatch(/\d \/ 3/);
});
