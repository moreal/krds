import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { html } from 'lit';
import { render } from '@lit-labs/ssr';
import { registerKrdsElements } from '../dist/index.js';
registerKrdsElements(customElements);

test('Accordion SSR retains actual trigger controls and hiding without naming generic panels', async () => {
 const items = [{id: 'eligibility', title: '신청 자격', content: '자격 안내'}, {id: 'documents', title: '제출 서류', content: '서류 안내'}, {id: 'contact', title: '문의', content: '문의 안내'}];
 const output = [...render(html`<krds-accordion .items=${items} .defaultOpenIds=${['eligibility', 'documents']}></krds-accordion>`)].join('');
 if (process.env.KRDS_ACCORDION_SSR_EVIDENCE) await writeFile(process.env.KRDS_ACCORDION_SSR_EVIDENCE, output);
 const markup = output.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
 const panels = [...markup.matchAll(/<div[^<>]*data-krds-part="panel"[^<>]*>/g)].map(match => match[0]);
 assert.equal(panels.length, 3);
 for (const item of items) {
  const panel = panels.find(tag => tag.includes(`id="panel-${item.id}"`));
  assert.ok(panel);
  assert.doesNotMatch(panel, /aria-label|\srole=/);
  assert.match(markup, new RegExp(`<button[^<>]*id="trigger-${item.id}"[^<>]*aria-controls="panel-${item.id}"`));
  assert.ok(markup.includes(item.title));
  assert.equal(/\shidden(?:\s|=|>)/.test(panel), item.id === 'contact');
 }
});
