import test from 'node:test';
import assert from 'node:assert/strict';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import * as pilots from '../dist/index.js';

test('Lit pilots expose native classes without global registration at source import', () => {
  for (const name of ['Button', 'NativeSelect', 'Modal', 'Tabs', 'Calendar', 'DateInput']) {
    assert.equal(typeof pilots[name], 'function', `${name} native LitElement class is required`);
    assert.equal(customElements.get(`krds-${name.replace(/[A-Z]/g, (letter, index) => `${index ? '-' : ''}${letter.toLowerCase()}`)}`), undefined);
  }
});

test('Lit SSR emits declarative open Shadow DOM and actual six-pilot semantics', async () => {
  assert.equal(typeof pilots.registerKrdsElements, 'function', 'explicit registration API is required');
  pilots.registerKrdsElements(customElements);
  const output = [...render(html`<krds-button>저장</krds-button><krds-native-select label="지역" .options=${[{value:'seoul',label:'서울'}]}></krds-native-select><krds-modal title="확인"></krds-modal><krds-tabs label="작업" .items=${[{value:'first',label:'첫 번째',content:'내용'}]}></krds-tabs><krds-calendar label="날짜 선택" reference-date="2024-02-01"></krds-calendar><krds-date-input label="방문일"></krds-date-input>`)].join('');
  assert.equal((output.match(/shadowrootmode="open"/g) ?? []).length, 6);
  assert.match(output, /<select/);
  assert.match(output, /role="tablist"/);
  assert.match(output, /<table/);
  assert.match(output, /type="text"/);
  assert.match(output, /YYYY-MM-DD/);
});

test('explicit registration is idempotent only for the same class and preflights collisions', () => {
  const entries=new Map();let writes=0;
  const registry={get:name=>entries.get(name),define:(name,definition)=>{entries.set(name,definition);writes++;}};
  pilots.registerKrdsElements(registry);pilots.registerKrdsElements(registry);
  assert.equal(writes,6);
  entries.set('krds-tabs',class Collision{});
  assert.throws(()=>pilots.registerKrdsElements(registry),/collision/i);
  assert.equal(writes,6);
});

test('native SSR rejects duplicate options, incompatible modes and invalid date configuration', () => {
  assert.throws(()=>[...render(html`<krds-native-select label="지역" .options=${[{value:'a',label:'A'},{value:'a',label:'Duplicate'}]}></krds-native-select>`)],TypeError);
  assert.throws(()=>[...render(html`<krds-tabs label="작업" .value=${'a'} .defaultValue=${'a'} .items=${[{value:'a',label:'A',content:'Panel'}]}></krds-tabs>`)],TypeError);
  assert.throws(()=>[...render(html`<krds-date-input label="방문일" .value=${'2023-02-29'}></krds-date-input>`)],RangeError);
  assert.throws(()=>[...render(html`<krds-date-input label="기간" .mode=${'range'} .value=${{start:'2024-02-29',end:null}}></krds-date-input>`)],RangeError);
  assert.throws(()=>[...render(html`<krds-calendar min="2024-03-01" max="2024-02-29"></krds-calendar>`)],RangeError);
});
