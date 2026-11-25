import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { Accordion } from '../src/lib/components/accordion/accordion';
import { TextList } from '../src/lib/components/text-list/text-list';

function mount<T>(component: new (...args: never[]) => T, inputs: Record<string, unknown>): ComponentFixture<T> {
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
  fixture.detectChanges(); return fixture;
}
const sections = [{ id: 'eligibility', title: '신청 자격', content: '자격 안내' }, { id: 'documents', title: '제출 서류', content: '서류 안내' }];
const outline = [{ id: 'steps', content: '신청 단계', children: [{ id: 'prepare', content: '자료 준비', children: [{ id: 'check', content: '파일 확인' }] }] }, { id: 'submit', content: '제출' }];
const headings = (root: ParentNode) => [...root.querySelectorAll('button[aria-controls]')].map(button => button.parentElement?.tagName);
const roles = (root: ParentNode, selector: string) => [...root.querySelectorAll(selector)].map(node => node.getAttribute('role'));

// KRDS accordion accessibility (component_04_07 L1117): the header title follows the page outline with h1–h6.
test('Accordion headers are h3 by default and follow headingLevel', () => {
  expect(headings(mount(Accordion, { items: sections }).nativeElement)).toEqual(['H3', 'H3']);
  expect(headings(mount(Accordion, { items: sections, headingLevel: 5 }).nativeElement)).toEqual(['H5', 'H5']);
});

// KRDS text list accessibility (component_04_13 L1118–1119): with list-style none, lists carry role="list" and items role="listitem".
test('TextList states list and listitem roles on every level', () => {
  for (const ordered of [false, true]) {
    const root = mount(TextList, { ordered, items: outline }).nativeElement;
    expect(roles(root, 'ul,ol')).toEqual(['list', 'list', 'list']);
    expect(roles(root, 'li')).toEqual(['listitem', 'listitem', 'listitem', 'listitem']);
  }
});
