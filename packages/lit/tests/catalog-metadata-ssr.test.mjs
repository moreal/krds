import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { recipes } from './catalog-recipes.mjs';
import { registerKrdsElements } from '../dist/index.js';

registerKrdsElements(customElements);
const excluded = new Set(['favicon', 'carousel', 'tag', 'bottom-sheet', 'tooltip', 'contextual-help']);
const evidenceDirectory = process.env.KRDS_LIT_METADATA_EVIDENCE;
if (evidenceDirectory) await mkdir(evidenceDirectory, { recursive: true });

for (const [id, properties] of recipes.filter(([id]) => !excluded.has(id))) {
  test(`${id} standalone SSR exposes owned CSS and shadow-part selectors before hydration`, async () => {
    const props = { ...properties };
    if (id === 'pagination') props.hrefForPage = page => `#page-${page}`;
    const opening = `<krds-${id} ${Object.keys(props).map((name, index) => `.${name}=__BIND_${index}__`).join(' ')}></krds-${id}>`;
    const strings = opening.split(/__BIND_\d+__/);
    strings.raw = [...strings];
    const output = [...render({ _$litType$: 1, strings, values: Object.values(props) })].join('');
    if (evidenceDirectory) await writeFile(join(evidenceDirectory, `${id}.html`), output);
    const nativeMarkup = output.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
    const ownedTags = [...nativeMarkup.matchAll(new RegExp(`<[^!][^>]*\\bdata-krds-component="${id}"[^>]*>`, 'g'))].map(match => match[0]);
    assert.ok(ownedTags.some(tag => /\bdata-krds-part="root"/.test(tag)), `${id} root must match its component/part CSS selector before hydration`);
    for (const tag of ownedTags) {
      const part = tag.match(/\bdata-krds-part="([^"]+)"/)?.[1];
      assert.ok(part, `${id} owned element needs one part token`);
      assert.match(tag, /\bdata-krds-state="[^"]*"/, `${id}/${part} must serialize even an empty state set`);
      assert.ok(tag.includes(` part="${part}"`), `${id}/${part} must retain the matching public shadow part`);
    }
  });
}

test('SSR preserves selected dynamic state and dynamic pagination part names', async () => {
  const output = [...render(html`<krds-accordion .items=${[{ id: 'a', title: '안내', content: '내용' }]} .defaultOpenIds=${['a']}></krds-accordion><krds-spinner label="처리 중" .completionMessage=${'처리 완료'} .pending=${true} .value=${40}></krds-spinner><krds-pagination .pageCount=${3} .defaultPage=${1} .hrefForPage=${page => `#page-${page}`}></krds-pagination>`)].join('');
  if (evidenceDirectory) await writeFile(join(evidenceDirectory, 'dynamic-states.html'), output);
  assert.match(output, /<section[^>]*data-krds-component="accordion"[^>]*data-krds-part="item"[^>]*data-krds-state="open"/);
  assert.match(output, /<button[^>]*data-krds-component="accordion"[^>]*data-krds-part="trigger"[^>]*aria-expanded="true"/);
  assert.match(output, /<progress[^>]*data-krds-component="spinner"[^>]*data-krds-part="indicator"[^>]*data-krds-state="determinate"/);
  assert.doesNotMatch(output, /<a[^>]*data-krds-component="pagination"[^>]*data-krds-part="previous"/, 'the first page has no previous link');
  assert.match(output, /<a[^>]*data-krds-component="pagination"[^>]*data-krds-part="next"[^>]*data-krds-state=""[^>]*part="next"/);
});
