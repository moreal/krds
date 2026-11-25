import { component$ } from '@builder.io/qwik';
import { Accordion } from '../../src/components/accordion';
import { TextList } from '../../src/components/text-list';

/** Local-only fixtures: no API, CDN or external assets. */
const sections = [{ id: 'eligibility', title: '신청 자격', content: '자격 안내' }, { id: 'documents', title: '제출 서류', content: '서류 안내' }];
const outline = [{ id: 'steps', content: '신청 단계', children: [{ id: 'prepare', content: '자료 준비', children: [{ id: 'check', content: '파일 확인' }] }] }, { id: 'submit', content: '제출' }];
export const AccordionDefault = component$(() => <Accordion items={sections}/>);
export const AccordionLevelFive = component$(() => <Accordion items={sections} headingLevel={5}/>);
export const TextListUnordered = component$(() => <TextList items={outline}/>);
export const TextListOrdered = component$(() => <TextList ordered items={outline}/>);
