import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; items: unknown; currentId: string };
const items = [
  { id: 'apply', label: '신청', children: [
    { id: 'new', label: '신규 신청', href: '/local/new' },
    { id: 'docs', label: '서류', children: [
      { id: 'forms', label: '서식', children: [{ id: 'form-a', label: '서식 가', href: '/local/form-a' }] },
      { id: 'guide', label: '작성 안내', href: '/local/guide' },
    ] },
  ] },
  { id: 'history', label: '내역', href: '/local/history' },
];
async function mount(currentId: string) {
  const host = document.createElement('krds-side-navigation') as Host;
  host.title = '업무'; host.items = items; host.currentId = currentId;
  document.body.append(host); cleanup.push(() => host.remove());
  await host.updateComplete;
  return host;
}
const parts = (host: Host, name: string) => [...host.shadowRoot!.querySelectorAll<HTMLElement>(`[data-krds-part="${name}"]`)];
const shown = (host: Host) => parts(host, 'link').filter(node => !node.closest('[hidden]')).map(node => node.textContent);
const trigger = (host: Host, label: string) => parts(host, 'trigger').find(node => node.textContent?.startsWith(label))!;
const click = async (host: Host, node: HTMLElement) => { node.click(); await host.updateComplete; };

// KRDS component_03_04 L1013–1015: at most two levels at once; deeper levels are disclosed progressively under a header.
test('SideNavigation shows two levels and enters a deeper branch under a header with a way back', async () => {
  const host = await mount('new');
  const changes: string[][] = [];
  host.addEventListener('expanded-change', event => changes.push((event as CustomEvent<{ ids: string[] }>).detail.ids));
  expect(shown(host)).toEqual(['신규 신청', '내역']);
  expect(host.shadowRoot!.textContent).not.toContain('작성 안내');
  expect(trigger(host, '서류').getAttribute('aria-expanded')).toBe('false');

  await click(host, trigger(host, '서류'));
  const header = parts(host, 'header')[0]!;
  expect(changes.at(-1)).toEqual(['apply', 'docs']);
  expect(header.textContent).toBe('서류');
  expect(host.shadowRoot!.activeElement).toBe(header);
  expect(shown(host)).toEqual(['작성 안내']);
  const back = parts(host, 'parent-link')[0]!;
  expect([back.tagName, back.textContent]).toEqual(['BUTTON', '상위 메뉴']);

  // Inside the branch the first shown level expands inline, so two levels are visible again.
  await click(host, trigger(host, '서식'));
  expect(shown(host)).toEqual(['서식 가', '작성 안내']);

  await click(host, parts(host, 'parent-link')[0]!);
  expect(parts(host, 'header')[0]!.textContent).toBe('신청');
  expect(host.shadowRoot!.activeElement).toBe(trigger(host, '서류'));
  await click(host, parts(host, 'parent-link')[0]!);
  expect(parts(host, 'header')[0]!.textContent).toBe('업무');
  expect(parts(host, 'parent-link')).toEqual([]);
});

test('SideNavigation opens on the branch of a deep current item instead of showing every level', async () => {
  const host = await mount('form-a');
  expect(parts(host, 'header')[0]!.textContent).toBe('서류');
  expect(shown(host)).toEqual(['서식 가', '작성 안내']);
  expect(host.shadowRoot!.querySelector('[aria-current="page"]')?.textContent).toBe('서식 가');
  expect(host.shadowRoot!.textContent).not.toContain('신규 신청');
});
