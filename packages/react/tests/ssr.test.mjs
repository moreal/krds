import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '../dist/index.js';

test('all public subpaths import in Node without browser globals', async () => {
  assert.equal(typeof globalThis.document, 'undefined');
  const {readFile}=await import('node:fs/promises');
  const manifest=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
  for (const entry of Object.values(manifest.exports)) assert.ok(await import(new URL('../'+entry.import,import.meta.url)));
});
test('SSR emits actual native button/select/tab semantics', () => {
  assert.match(renderToString(h(Button, { type: 'submit', name: 'save', value: 'yes' }, 'Save')), /<button[^>]*type="submit"/);
  assert.match(renderToString(h(NativeSelect, { label: 'Region', value: 'a', options: [{ value: 'a', label: 'A' }] })), /<select/);
  const tabs = renderToString(h(Tabs, { 'aria-label': 'Sections', items: [{ value: 'a', label: 'A', panel: 'One' }, { value: 'b', label: 'B', panel: 'Two' }] }));
  assert.equal((tabs.match(/role="tab"/g) ?? []).length, 2); assert.match(tabs, /hidden=""/);
});
test('SSR date output uses canonical Gregorian text independent of host time', () => {
  const markup = renderToString(h(DateInput, { label: 'Visit', name: 'visit', defaultValue: '2024-02-29', withCalendar: false }));
  assert.match(markup, /type="text"/); assert.match(markup, /type="hidden"[^>]*name="visit"[^>]*value="2024-02-29"/);
  const calendar = renderToString(h(Calendar, { referenceDate: '2024-02-15' }));
  assert.equal((calendar.match(/<tr>/g) ?? []).length, 7); assert.equal((calendar.match(/<td /g) ?? []).length, 42); assert.match(calendar, /2024년 2월 29일 목요일/);
});
test('wrong date shapes, invalid dates, bounds and tab selections throw during render', () => {
  assert.throws(() => renderToString(h(DateInput, { label: 'Date', defaultValue: '2023-02-29' })), RangeError);
  assert.throws(() => renderToString(h(Calendar, { mode: 'range', value: '2024-02-29' })), TypeError);
  assert.throws(() => renderToString(h(Calendar, { min: '2024-03-01', max: '2024-02-01' })), RangeError);
  assert.throws(() => renderToString(h(Tabs, { items: [{ value: 'a', label: 'A', panel: 'A', disabled: true }], value: 'a' })), RangeError);
});
test('native context resolves locale without DOM access; closed Modal emits no dialog', () => {
  const english = renderToString(h(KrdsProvider, { locale: 'en-US' }, h(Calendar, { referenceDate: '2024-02-15' })));
  assert.match(english, /February 2024/); assert.match(english, /Thursday, February 29, 2024/);
  assert.equal(renderToString(h(Modal, { title: 'Closed' })), '');
});

test('clean distribution contains no compiler-only WorkspaceProbe artifacts', async () => {
  const {readdir,readFile}=await import('node:fs/promises');
  const paths=await readdir(new URL('../dist/',import.meta.url),{recursive:true});
  assert.equal(paths.some(path=>path.includes('WorkspaceProbe')),false);
  assert.doesNotMatch(await readFile(new URL('../dist/index.d.ts',import.meta.url),'utf8'),/WorkspaceProbe/);
});
