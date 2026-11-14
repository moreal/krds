import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act, type ReactNode } from 'react';
import { SideNavigation } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(view: ReactNode) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(view)); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return host; }
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
const parts = (host: Element, name: string) => [...host.querySelectorAll<HTMLElement>(`[data-krds-component="side-navigation"][data-krds-part="${name}"]`)];
const shown = (host: Element) => parts(host, 'link').filter(node => !node.closest('[hidden]')).map(node => node.textContent);
const trigger = (host: Element, label: string) => parts(host, 'trigger').find(node => node.textContent?.startsWith(label))!;
const click = (node: HTMLElement) => act(async () => { node.click(); });

// KRDS component_03_04 L1013–1015: at most two levels at once; deeper levels are disclosed progressively under a header.
test('SideNavigation shows two levels and enters a deeper branch under a header with a way back', async () => {
  const changes: (readonly string[])[] = [];
  const host = await mount(<SideNavigation title="업무" items={items} currentId="new" onExpandedChange={event => changes.push(event.ids)}/>);
  expect(shown(host)).toEqual(['신규 신청', '내역']);
  expect(host.textContent).not.toContain('작성 안내');
  expect(trigger(host, '서류').getAttribute('aria-expanded')).toBe('false');

  await click(trigger(host, '서류'));
  const header = parts(host, 'header')[0]!;
  expect(changes.at(-1)).toEqual(['apply', 'docs']);
  expect(header.textContent).toBe('서류');
  expect(document.activeElement).toBe(header);
  expect(shown(host)).toEqual(['작성 안내']);
  const back = parts(host, 'parent-link')[0]!;
  expect([back.tagName, back.textContent]).toEqual(['BUTTON', '상위 메뉴']);

  // Inside the branch the first shown level expands inline, so two levels are visible again.
  await click(trigger(host, '서식'));
  expect(shown(host)).toEqual(['서식 가', '작성 안내']);

  await click(parts(host, 'parent-link')[0]!);
  expect(parts(host, 'header')[0]!.textContent).toBe('신청');
  expect(document.activeElement).toBe(trigger(host, '서류'));
  await click(parts(host, 'parent-link')[0]!);
  expect(parts(host, 'header')[0]!.textContent).toBe('업무');
  expect(parts(host, 'parent-link')).toEqual([]);
});

test('SideNavigation opens on the branch of a deep current item with every ancestor expanded', async () => {
  const host = await mount(<SideNavigation title="업무" items={items} currentId="form-a"/>);
  expect(parts(host, 'header')[0]!.textContent).toBe('서류');
  expect(shown(host)).toEqual(['서식 가', '작성 안내']);
  expect(host.querySelector('[aria-current="page"]')?.textContent).toBe('서식 가');
  expect(trigger(host, '서식').getAttribute('aria-expanded')).toBe('true');
});
