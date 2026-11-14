import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');
registerKrdsElements(customElements);
const evidenceDirectory = process.env.KRDS_LIT_METADATA_BROWSER_EVIDENCE;
if (evidenceDirectory) await mkdir(evidenceDirectory, { recursive: true });

for (const engine of ['chromium', 'webkit']) {
  test(`${engine} SSR metadata selects styled native parts before hydration and survives first actions`, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'krds-lit-metadata-ssr-'));
    let server;
    let browser;
    try {
      await cp(new URL('../../dist', import.meta.url), directory, { recursive: true });
      const skeleton = await readFile(join(directory, 'hydrate.html'), 'utf8');
      const hydrateEntry = skeleton.match(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/)?.[1];
      assert.ok(hydrateEntry, 'the actual production hydration entry must exist');
      const state = {
        accordion: { items: [{ id: 'a', title: '안내', content: '상세 내용' }], defaultOpenIds: ['a'] },
        checkbox: { label: '동의', name: 'agreement', defaultChecked: true },
        spinner: { label: '처리 중', completionMessage: '처리 완료', pending: true, value: 40 },
        pagination: { pageCount: 3, defaultPage: 1 },
        'text-input': { label: '성명', name: 'person', defaultValue: '김' },
        'checkbox-false': { label: '선택 안 함', name: 'unchecked-agreement', defaultChecked: false },
        'switch-false': { label: '알림 꺼짐', name: 'notification', defaultChecked: false },
        'radio-group': { label: '지역', name: 'region', options: [{ value: 'a', label: '서울' }, { value: 'b', label: '부산' }], defaultValue: 'a' },
        'structured-list': { items: [{ id: 'item', title: '공고', metadata: [] }], selection: { ids: [] } },
      };
      const markup = [...render(html`<krds-accordion id="accordion" defer-hydration .items=${state.accordion.items} .defaultOpenIds=${state.accordion.defaultOpenIds}></krds-accordion><krds-checkbox id="checkbox" defer-hydration .label=${state.checkbox.label} .name=${state.checkbox.name} .defaultChecked=${true}></krds-checkbox><krds-spinner id="spinner" defer-hydration .label=${state.spinner.label} .completionMessage=${state.spinner.completionMessage} .pending=${true} .value=${40}></krds-spinner><krds-pagination id="pagination" defer-hydration .pageCount=${3} .defaultPage=${1} .hrefForPage=${page => `#page-${page}`}></krds-pagination><krds-text-input id="text-input" defer-hydration .label=${state['text-input'].label} .name=${state['text-input'].name} .defaultValue=${state['text-input'].defaultValue}></krds-text-input><krds-checkbox id="checkbox-false" defer-hydration .label=${state['checkbox-false'].label} .name=${state['checkbox-false'].name} .defaultChecked=${false}></krds-checkbox><krds-switch id="switch-false" defer-hydration .label=${state['switch-false'].label} .name=${state['switch-false'].name} .defaultChecked=${false}></krds-switch><krds-radio-group id="radio-group" defer-hydration .label=${state['radio-group'].label} .name=${state['radio-group'].name} .options=${state['radio-group'].options} .defaultValue=${'a'}></krds-radio-group><krds-structured-list id="structured-list" defer-hydration .items=${state['structured-list'].items} .selection=${state['structured-list'].selection}></krds-structured-list>`)].join('');
      const document = skeleton
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '')
        .replace('<main id="app"></main>', `<main id="app"><form>${markup}</form></main><script id="krds-hydration-state" type="application/json">${JSON.stringify(state).replaceAll('<', '\\u003c')}</script>`);
      await writeFile(join(directory, 'metadata.html'), document);
      server = await serveProduction(directory);
      if (evidenceDirectory) {
        await writeFile(join(evidenceDirectory, `${engine}.html`), document);
        await writeFile(join(evidenceDirectory, `${engine}-producer.json`), JSON.stringify(server.snapshot, null, 2));
      }
      browser = await ({ chromium, webkit })[engine].launch();
      const page = await browser.newPage({ reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      await page.goto(`${server.origin}/metadata.html`);
      const before = await page.evaluate(() => {
        const selectors = { accordion: '[data-krds-part="trigger"]', checkbox: '[data-krds-part="control"]', spinner: '[data-krds-part="indicator"]', pagination: '[data-krds-part="next"]', 'text-input': '[data-krds-part="control"]', 'checkbox-false': 'input', 'switch-false': 'input', 'radio-group': 'input[value="a"]', 'structured-list': 'input' };
        window.metadataNodes = {};
        window.metadataEvents = [];
        const metadata = {};
        for (const [id, selector] of Object.entries(selectors)) {
          const host = document.getElementById(id);
          window.metadataNodes[id] = host.shadowRoot.querySelector(selector);
          metadata[id] = [...host.shadowRoot.querySelectorAll('[data-krds-component]')].map(node => [node.getAttribute('data-krds-component'), node.getAttribute('data-krds-part'), node.getAttribute('data-krds-state'), node.getAttribute('part')]);
          for (const name of ['open-change', 'checked-change', 'page-change', 'value-change', 'selection-change']) host.addEventListener(name, event => window.metadataEvents.push({ id, name, detail: event.detail }));
        }
        const accordion = document.getElementById('accordion').shadowRoot;
        const spinner = document.getElementById('spinner').shadowRoot;
        const pagination = document.getElementById('pagination').shadowRoot;
        return {
          unregistered: customElements.get('krds-accordion') === undefined,
          metadata,
          triggerDisplay: getComputedStyle(accordion.querySelector('[data-krds-component="accordion"][data-krds-part="item"][data-krds-state~="open"] [data-krds-component="accordion"][data-krds-part="trigger"]')).display,
          spinnerDisplay: getComputedStyle(spinner.querySelector('[data-krds-component="spinner"][data-krds-part="root"][data-krds-state~="pending"]:has([data-krds-part="indicator"][data-krds-state~="determinate"])')).display,
          previousState: pagination.querySelector('[data-krds-part="previous"]')?.getAttribute('data-krds-state') ?? null,
          nextState: pagination.querySelector('[data-krds-part="next"]').getAttribute('data-krds-state'),
          checked: window.metadataNodes.checkbox.checked,
          value: window.metadataNodes['text-input'].value,
          fieldSelection: {
            checkbox: window.metadataNodes['checkbox-false'].checked,
            switch: window.metadataNodes['switch-false'].checked,
            radios: [...document.getElementById('radio-group').shadowRoot.querySelectorAll('input')].map(input => input.checked),
            structuredList: window.metadataNodes['structured-list'].checked,
          },
        };
      });
      if (evidenceDirectory) await writeFile(join(evidenceDirectory, `${engine}-before.json`), JSON.stringify(before, null, 2));
      assert.equal(before.unregistered, true);
      assert.notEqual(before.triggerDisplay, 'inline-block', 'component CSS must select the raw SSR trigger (not the browser default button box)');
      assert.equal(before.spinnerDisplay, 'inline-flex', 'component CSS must select the raw SSR state');
      assert.equal(before.previousState, null, 'the first page renders no previous link');
      assert.equal(before.nextState, '');
      assert.equal(before.checked, true);
      assert.equal(before.value, '김');
      assert.deepEqual(before.fieldSelection, { checkbox: false, switch: false, radios: [true, false], structuredList: false });
      for (const parts of Object.values(before.metadata)) {
        assert.ok(parts.length > 0);
        for (const [, part, state, shadowPart] of parts) {
          assert.equal(typeof state, 'string');
          assert.equal(shadowPart, part);
        }
      }
      await page.evaluate(async entry => { await import(entry); }, hydrateEntry);
      const after = await page.evaluate(async () => {
        const reused = {};
        const metadata = {};
        for (const [id, node] of Object.entries(window.metadataNodes)) {
          const host = document.getElementById(id);
          await host.updateComplete;
          reused[id] = node.isConnected && host.shadowRoot.contains(node);
          metadata[id] = [...host.shadowRoot.querySelectorAll('[data-krds-component]')].map(element => [element.getAttribute('data-krds-component'), element.getAttribute('data-krds-part'), element.getAttribute('data-krds-state'), element.getAttribute('part')]);
        }
        return { reused, metadata, checked: window.metadataNodes.checkbox.checked, value: window.metadataNodes['text-input'].value, events: window.metadataEvents, fieldSelection: {
          checkbox: window.metadataNodes['checkbox-false'].checked,
          switch: window.metadataNodes['switch-false'].checked,
          radios: [...document.getElementById('radio-group').shadowRoot.querySelectorAll('input')].map(input => input.checked),
          structuredList: window.metadataNodes['structured-list'].checked,
        } };
      });
      if (evidenceDirectory) await writeFile(join(evidenceDirectory, `${engine}-after.json`), JSON.stringify(after, null, 2));
      assert.deepEqual(after.reused, { accordion: true, checkbox: true, spinner: true, pagination: true, 'text-input': true, 'checkbox-false': true, 'switch-false': true, 'radio-group': true, 'structured-list': true });
      assert.deepEqual(after.metadata, before.metadata);
      assert.equal(after.checked, true);
      assert.equal(after.value, '김');
      assert.deepEqual(after.fieldSelection, before.fieldSelection);
      assert.deepEqual(after.events, []);
      await page.locator('#accordion').getByRole('button', { name: '안내' }).click();
      await page.locator('#checkbox').getByRole('checkbox').uncheck();
      await page.locator('#pagination').getByRole('link', { name: '다음', exact: true }).click();
      await page.locator('#text-input').getByRole('textbox').fill('첫 입력');
      await page.locator('#switch-false').getByRole('switch').click();
      await page.locator('#radio-group').getByRole('radio', { name: '부산' }).click();
      await page.locator('#structured-list').getByRole('checkbox', { name: '공고 선택' }).click();
      await page.locator('#structured-list').evaluate(async host => { await host.updateComplete; });
      assert.deepEqual(await page.evaluate(() => window.metadataEvents), [
        { id: 'accordion', name: 'open-change', detail: { ids: [] } },
        { id: 'checkbox', name: 'checked-change', detail: { checked: false } },
        { id: 'pagination', name: 'page-change', detail: { page: 2 } },
        { id: 'text-input', name: 'value-change', detail: { value: '첫 입력' } },
        { id: 'switch-false', name: 'checked-change', detail: { checked: true } },
        { id: 'radio-group', name: 'value-change', detail: { value: 'b' } },
        { id: 'structured-list', name: 'selection-change', detail: { ids: ['item'] } },
      ]);
      assert.equal(await page.locator('#accordion [data-krds-part="item"]').getAttribute('data-krds-state'), 'closed');
      assert.equal(await page.locator('#accordion [data-krds-part="trigger"]').getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('#checkbox [data-krds-part="control"]').getAttribute('data-krds-state'), 'unchecked');
      assert.equal(await page.locator('#pagination [data-krds-part="link"][aria-current="page"]').textContent(), '2');
      assert.equal(await page.locator('#switch-false').getByRole('switch').isChecked(), true);
      assert.equal(await page.locator('#switch-false [data-krds-part="control"]').getAttribute('data-krds-state'), 'checked');
      assert.equal(await page.locator('#radio-group').getByRole('radio', { name: '서울' }).isChecked(), false);
      assert.equal(await page.locator('#radio-group').getByRole('radio', { name: '부산' }).isChecked(), true);
      assert.equal(await page.locator('#radio-group input[value="b"]').getAttribute('data-krds-state'), 'checked');
      assert.equal(await page.locator('#structured-list').getByRole('checkbox', { name: '공고 선택' }).isChecked(), false, 'declined controlled selection must restore the actual native checkbox');
      assert.equal(await page.locator('#structured-list [data-krds-part="item"]').getAttribute('data-krds-state'), '');
      if (evidenceDirectory) await writeFile(join(evidenceDirectory, `${engine}-first-events.json`), JSON.stringify(await page.evaluate(() => window.metadataEvents), null, 2));
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ engine, producerSha256: server.snapshot.sha256, before, reused: after.reused }));
    } finally {
      await browser?.close();
      await server?.close();
      await rm(directory, { recursive: true, force: true });
    }
  });
}
