import { afterEach, expect, test } from 'vitest';
import { createApp, h, nextTick, type Component } from 'vue';
import { Accordion, TextList } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
async function mount(component: Component, props: Record<string, unknown>) {
  const host = document.createElement('div'); document.body.append(host);
  const app = createApp({ render: () => h(component, props) }); app.mount(host);
  cleanup.push(() => { app.unmount(); host.remove(); }); await nextTick(); return host;
}
const sections = [{ id: 'eligibility', title: '신청 자격', content: '자격 안내' }, { id: 'documents', title: '제출 서류', content: '서류 안내' }];
const outline = [{ id: 'steps', content: '신청 단계', children: [{ id: 'prepare', content: '자료 준비', children: [{ id: 'check', content: '파일 확인' }] }] }, { id: 'submit', content: '제출' }];
const headings = (root: ParentNode) => [...root.querySelectorAll('button[aria-controls]')].map(button => button.parentElement?.tagName);
const roles = (root: ParentNode, selector: string) => [...root.querySelectorAll(selector)].map(node => node.getAttribute('role'));

// KRDS accordion accessibility (component_04_07 L1117): the header title follows the page outline with h1–h6.
test('Accordion headers are h3 by default and follow headingLevel', async () => {
  expect(headings(await mount(Accordion, { items: sections }))).toEqual(['H3', 'H3']);
  expect(headings(await mount(Accordion, { items: sections, headingLevel: 5 }))).toEqual(['H5', 'H5']);
});

// KRDS text list accessibility (component_04_13 L1118–1119): with list-style none, lists carry role="list" and items role="listitem".
test('TextList states list and listitem roles on every level', async () => {
  for (const ordered of [false, true]) {
    const host = await mount(TextList, { ordered, items: outline });
    expect(roles(host, 'ul,ol')).toEqual(['list', 'list', 'list']);
    expect(roles(host, 'li')).toEqual(['listitem', 'listitem', 'listitem', 'listitem']);
  }
});
