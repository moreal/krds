import { afterEach, expect, test } from 'vitest';
import { mount, unmount, tick } from 'svelte';
import { Accordion, TextList } from '../src/lib/index';
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
async function host(render: (target: HTMLElement) => ReturnType<typeof mount>) {
  const target = document.createElement('div'); document.body.append(target);
  const app = render(target);
  cleanup.push(async () => { await unmount(app); target.remove(); }); await tick(); return target;
}
const sections = [{ id: 'eligibility', title: '신청 자격', content: '자격 안내' }, { id: 'documents', title: '제출 서류', content: '서류 안내' }];
const outline = [{ id: 'steps', content: '신청 단계', children: [{ id: 'prepare', content: '자료 준비', children: [{ id: 'check', content: '파일 확인' }] }] }, { id: 'submit', content: '제출' }];
const headings = (root: ParentNode) => [...root.querySelectorAll('button[aria-controls]')].map(button => button.parentElement?.tagName);
const roles = (root: ParentNode, selector: string) => [...root.querySelectorAll(selector)].map(node => node.getAttribute('role'));

// KRDS accordion accessibility (component_04_07 L1117): the header title follows the page outline with h1–h6.
test('Accordion headers are h3 by default and follow headingLevel', async () => {
  expect(headings(await host(target => mount(Accordion, { target, props: { items: sections } })))).toEqual(['H3', 'H3']);
  expect(headings(await host(target => mount(Accordion, { target, props: { items: sections, headingLevel: 5 } })))).toEqual(['H5', 'H5']);
});

// KRDS text list accessibility (component_04_13 L1118–1119): with list-style none, lists carry role="list" and items role="listitem".
test('TextList states list and listitem roles on every level', async () => {
  for (const ordered of [false, true]) {
    const root = await host(target => mount(TextList, { target, props: { ordered, items: outline } }));
    expect(roles(root, 'ul,ol')).toEqual(['list', 'list', 'list']);
    expect(roles(root, 'li')).toEqual(['listitem', 'listitem', 'listitem', 'listitem']);
  }
});
