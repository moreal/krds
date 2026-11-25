import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown> };
// KRDS component_10_02 L896-905, L918: the default options pair the official wording with the scale; the trigger shows the selected one.
const facts = (root: ParentNode) => ({ options: [...root.querySelectorAll('[data-krds-component="resize"][data-krds-part="option"]')].map(node => node.textContent?.trim()), trigger: root.querySelector('[data-krds-component="resize"][data-krds-part="trigger"]')?.textContent?.trim() });
const expected = { options: ['작게 90%', '보통 100%', '조금 크게 110%', '크게 130%', '가장 크게 150%'], trigger: '화면 크기 보통 100%' };
test('Resize defaults to the five official labelled scales', async () => {
  const host = document.createElement('krds-resize') as Host; document.body.append(host); await host.updateComplete; cleanup.push(() => host.remove());
  expect(facts(host.shadowRoot!)).toEqual(expected);
});
