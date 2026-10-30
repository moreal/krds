import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { render } from '@lit-labs/ssr';
import { html, unsafeStatic } from 'lit/static-html.js';
import { recipes } from './catalog-recipes.mjs';
import * as library from '../dist/index.js';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
library.registerKrdsElements(customElements);
for (const [id, props, text] of recipes) test(`native ${id} emits meaningful standalone declarative Shadow DOM`, () => {
  // These are test-only native static templates. No generic renderer is exported from the package.
  const attributes = Object.keys(props).map(name => `.${name}=`);
  const opening = `<krds-${id} ${attributes.map((attribute, index) => `${attribute}__BIND_${index}__`).join(' ')}>`;
  const chunks = opening.split(/__BIND_\d+__/); chunks[chunks.length - 1] += `</krds-${id}>`;
  const strings = Object.assign(chunks, { raw: [...chunks] });
  const values = Object.values(props);
  if (id === 'pagination') { strings[0] = strings[0].replace('>', ''); /* separate required host href mapping below */ }
  let output;
  if (id === 'pagination') output = [...render(html`<krds-pagination .pageCount=${3} .hrefForPage=${page => `#page-${page}`}></krds-pagination>`)].join('');
  else output = [...render({ _$litType$: 1, strings, values })].join('');
  assert.match(output, /shadowrootmode="open"/);
  if (text !== null && id !== 'header') assert.ok(output.includes(text), `${id} content must exist before hydration`);
  if (id !== 'favicon') {
    const nativeOutput = output.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '');
    const root = nativeOutput.match(new RegExp(`<[a-z][^<>]*data-krds-component="${id}"[^<>]*data-krds-part="root"[^<>]*>`))?.[0];
    assert.ok(root, `${id} must serialize its actual owned root metadata before hydration`);
    assert.match(root, /data-krds-state="[^"]*"/);
    assert.match(root, /\spart="root"/);
  }
  assert.ok(manifest.exports[`./${id}`], `${id} has an independent public subpath`);
});

test('all 54 explicit definitions preflight the complete registry before any writes', () => {
  const entries = new Map([['krds-tooltip', class Collision {}]]); let writes = 0;
  const registry = { get: name => entries.get(name), define: (name, value) => { writes++; entries.set(name, value); } };
  assert.throws(() => library.registerKrdsElements(registry), /collision/i);
  assert.equal(writes, 0);
  assert.equal(Object.keys(manifest.exports).length, 56);
});

test('public Favicon helper emits actual local head links for selected standalone SSR', () => {
  const output = [...render(library.faviconLinks({ light: { href: '/local-assets/specimen-icon-light.svg', type: 'image/svg+xml', sizes: '16x16' }, dark: { href: '/local-assets/specimen-icon-dark.svg', type: 'image/svg+xml', sizes: '16x16' } }))].join('');
  assert.match(output, /rel="icon"/);
  assert.match(output, /prefers-color-scheme: dark/);
  assert.match(output, /sizes="16x16"/);
  assert.doesNotMatch(output, /https?:/);
});

test('CriticalAlert urgency never invents assertive speech and retains its named banner', () => {
  for (const urgency of ['high', 'medium', 'low']) {
    const output = [...render(html`<krds-critical-alert .urgency=${urgency} label="안전 안내" message="로컬 안전 안내"></krds-critical-alert>`)].join('');
    assert.match(output, /role="banner"/);
    assert.match(output, /aria-label="안전 안내"/);
    assert.doesNotMatch(output, /role="alert"|aria-live="assertive"/);
  }
});

test('TTS omitted optional label has its default purposeful playback name', () => {
  const markup = [...render(html`<krds-tts .summary=${'로컬 안내'} .state=${'idle'}></krds-tts>`)].join('');
  assert.match(markup, /음성 안내 재생/);
});

test('Modal open SSR renders native dialog without browser-only opener capture', () => {
  const markup = [...render(html`<krds-modal .open=${true} .title=${'신청 확인'} .body=${html`<p>확인할 신청 내용</p>`}></krds-modal>`)].join('');
  assert.match(markup, /<dialog/);
  assert.match(markup, /신청 확인/);
  assert.match(markup, /확인할 신청 내용/);
});

test('Masthead never serializes an official-government claim for false or omitted eligibility', () => {
  const claim = '이 누리집은 대한민국 공식 전자정부 누리집입니다.';
  const absent = [...render(html`<krds-masthead></krds-masthead>`)].join('');
  const ineligible = [...render(html`<krds-masthead .governmentService=${false}></krds-masthead>`)].join('');
  const hypothetical = [...render(html`<krds-masthead .governmentService=${true}></krds-masthead>`)].join('');
  assert.ok(!absent.includes(claim)); assert.ok(!ineligible.includes(claim)); assert.ok(hypothetical.includes(claim));
});

test('F10: autoplay permission serializes without browser globals and stays truthfully paused before mounting', () => {
  const output = [...render(html`<krds-carousel .autoplay=${true} .items=${[{id:'a',label:'A',content:'첫 내용'},{id:'b',label:'B',content:'둘째 내용'}]}></krds-carousel>`)].join('');
  assert.match(output, /data-krds-state="paused"/);
  assert.match(output, /자동 재생 중지/);
});
