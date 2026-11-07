import { afterEach, expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
// Chromium computes element-reference ARIA; read the real accessibility tree over CDP.
async function axDescription(buttonName: string) {
  const c = cdp(); await c.send('Accessibility.enable'); await c.send('Page.enable');
  // Browser-mode tests run in a child frame of the runner page.
  const { frameTree } = await c.send('Page.getFrameTree') as { frameTree: { childFrames?: { frame: { id: string } }[] } };
  const frameId = frameTree.childFrames?.at(-1)?.frame.id;
  const { nodes } = await c.send('Accessibility.getFullAXTree', frameId ? { frameId } : {}) as { nodes: { role?: { value: string }, name?: { value: string }, description?: { value: string } }[] };
  const n = nodes.find(x => x.role?.value === 'button' && x.name?.value === buttonName);
  if (!n) throw new Error('no button node: ' + JSON.stringify(nodes.filter(x => x.role?.value === 'button')));
  return n.description?.value;
}
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
type Host = HTMLElement & { updateComplete: Promise<unknown> };
async function mount(attrs: Record<string, string>, extra = '') {
  const wrap = document.createElement('div');
  wrap.innerHTML = `<p id="help">도움말 설명</p><div id="menu">menu</div><krds-button ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}>저장</krds-button>${extra}`;
  document.body.append(wrap); cleanup.push(() => wrap.remove());
  const host = wrap.querySelector('krds-button') as Host; await host.updateComplete;
  return { wrap, host, inner: host.shadowRoot!.querySelector('button')! };
}
test('Button forwards host aria-describedby to the inner button description', async () => {
  const { host, inner } = await mount({ 'aria-describedby': 'help' });
  await expect.poll(() => axDescription('저장')).toBe('도움말 설명');
  host.setAttribute('aria-describedby', 'missing'); await host.updateComplete;
  expect(inner.ariaDescribedByElements ?? []).toHaveLength(0);
});
test('Button forwards aria-expanded, aria-haspopup and aria-controls', async () => {
  const { host, inner } = await mount({ 'aria-expanded': 'false', 'aria-haspopup': 'menu', 'aria-controls': 'menu' });
  expect(inner.getAttribute('aria-expanded')).toBe('false');
  expect(inner.getAttribute('aria-haspopup')).toBe('menu');
  expect(inner.ariaControlsElements?.map(e => e.id)).toEqual(['menu']);
  host.setAttribute('aria-expanded', 'true'); await host.updateComplete;
  expect(inner.getAttribute('aria-expanded')).toBe('true');
  host.removeAttribute('aria-expanded'); await host.updateComplete;
  expect(inner.hasAttribute('aria-expanded')).toBe(false);
});
test('Button keeps aria-label and aria-labelledby naming', async () => {
  const a = await mount({ 'aria-label': '이름' });
  expect(a.inner.getAttribute('aria-label')).toBe('이름');
  const b = await mount({ 'aria-labelledby': 'help' });
  await expect.poll(() => axDescription('도움말 설명')).toBeUndefined();
  expect(b.inner.getAttribute('aria-label')).toBe('도움말 설명');
});
test('Button resolves aria-describedby from a shadow-root host root', async () => {
  const outer = document.createElement('div'); document.body.append(outer); cleanup.push(() => outer.remove());
  const root = outer.attachShadow({ mode: 'open' });
  root.innerHTML = '<p id="sh">그림자 설명</p><krds-button aria-describedby="sh">확인</krds-button>';
  const host = root.querySelector('krds-button') as Host; await host.updateComplete;
  await expect.poll(() => axDescription('확인')).toBe('그림자 설명');
});
