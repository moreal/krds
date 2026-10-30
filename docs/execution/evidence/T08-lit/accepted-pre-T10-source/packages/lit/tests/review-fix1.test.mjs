import test from 'node:test';
import assert from 'node:assert/strict';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { registerKrdsElements } from '../dist/index.js';

registerKrdsElements(customElements);
const options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];
const items = [{ value: 'first', label: '첫 번째', content: '내용' }];
const output = template => [...render(template)].join('');

test('review 1: SSR serializes a non-first controlled selected option', () => {
  const markup = output(html`<krds-native-select label="지역" .options=${options} .value=${'busan'}></krds-native-select>`);
  assert.match(markup, /<option\b[^>]*value="busan"[^>]* selected(?:[ >])/);
  assert.doesNotMatch(markup, /<option\b[^>]*value="seoul"[^>]* selected(?:[ >])/);
});

test('review 1: SSR serializes a non-first uncontrolled baseline', () => {
  const markup = output(html`<krds-native-select label="지역" .options=${options} .defaultValue=${'busan'}></krds-native-select>`);
  assert.match(markup, /<option\b[^>]*value="busan"[^>]* selected(?:[ >])/);
});

test('review 3: SSR applies explicit aria-label to the actual tablist and Calendar region', () => {
  const tabs = output(html`<krds-tabs aria-label="방문 작업" .items=${items}></krds-tabs>`);
  const calendar = output(html`<krds-calendar aria-label="방문 날짜"></krds-calendar>`);
  assert.match(tabs, /role="tablist"[^>]*aria-label="방문 작업"/);
  assert.match(calendar, /<section\b[^>]*aria-label="방문 날짜"/);
});

test('review 3: SSR resolves external labelledby through supplied plain-text reference context', () => {
  const labelReferences = { 'trip-task': '방문 일정' };
  const tabs = output(html`<h2 id="trip-task">방문 일정</h2><krds-tabs aria-labelledby="trip-task" .labelReferences=${labelReferences} .items=${items}></krds-tabs>`);
  const calendar = output(html`<h2 id="trip-task">방문 일정</h2><krds-calendar aria-labelledby="trip-task" .labelReferences=${labelReferences}></krds-calendar>`);
  assert.match(tabs, /role="tablist"[^>]*aria-label="방문 일정"/);
  assert.match(calendar, /<section\b[^>]*aria-label="방문 일정"/);
  assert.doesNotMatch(tabs, /role="tablist"[^>]*aria-labelledby="trip-task"/);
  assert.doesNotMatch(calendar, /<section\b[^>]*aria-labelledby="trip-task"/);
});

test('review 3: empty or unresolved SSR naming references are configuration errors', () => {
  assert.throws(() => output(html`<krds-tabs aria-labelledby="task" .labelReferences=${{task:''}} .items=${items}></krds-tabs>`), TypeError);
  assert.throws(() => output(html`<krds-calendar aria-labelledby="task"></krds-calendar>`), TypeError);
  assert.throws(() => output(html`<krds-calendar aria-label=" "></krds-calendar>`), TypeError);
});
