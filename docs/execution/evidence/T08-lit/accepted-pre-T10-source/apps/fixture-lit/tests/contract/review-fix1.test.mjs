import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');
registerKrdsElements(customElements);
const options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }];

for (const engine of ['chromium', 'webkit']) {
  test(`review 1 ${engine}: non-first native selection exists before hydration and reuses the select`, async () => {
    const markup = [...render(html`<krds-native-select id="controlled" defer-hydration label="제어 지역" .options=${options} .value=${'busan'}></krds-native-select><krds-native-select id="uncontrolled" defer-hydration label="기본 지역" .options=${options} .defaultValue=${'busan'}></krds-native-select>`)].join('');
    const skeleton = await readFile(new URL('../../dist/hydrate.html', import.meta.url), 'utf8');
    const state = { controlled: { options, value: 'busan' }, uncontrolled: { options, defaultValue: 'busan' } };
    const document = skeleton.replace('<main id="app"></main>', `<main id="app">${markup}</main><script id="krds-hydration-state" type="application/json">${JSON.stringify(state)}</script>`);
    await writeFile(new URL(`../../dist/review-selection-${engine}.html`, import.meta.url), document);
    const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
    const browser = await ({ chromium, webkit })[engine].launch();
    try {
      const page = await browser.newPage();
      await page.route('**/*.js', route => route.abort());
      await page.goto(`${server.origin}/review-selection-${engine}.html`);
      assert.deepEqual(await page.locator('krds-native-select').evaluateAll(hosts => hosts.map(host => host.shadowRoot.querySelector('select').value)), ['busan', 'busan']);
      await page.evaluate(() => { window.serverSelects = [...document.querySelectorAll('krds-native-select')].map(host => host.shadowRoot.querySelector('select')); });
      await page.unroute('**/*.js');
      const module = await page.locator('script[type="module"]').getAttribute('src');
      await page.evaluate(async source => { await import(source); }, module);
      assert.deepEqual(await page.locator('krds-native-select').evaluateAll(async hosts => {
        await Promise.all(hosts.map(host => host.updateComplete));
        return hosts.map((host, index) => ({ same: host.shadowRoot.querySelector('select') === window.serverSelects[index], value: host.shadowRoot.querySelector('select').value }));
      }), [{ same: true, value: 'busan' }, { same: true, value: 'busan' }]);
      await page.getByRole('combobox', { name: '제어 지역' }).selectOption('seoul');
      assert.equal(await page.getByRole('combobox', { name: '제어 지역' }).inputValue(), 'busan');
      await page.getByRole('combobox', { name: '기본 지역' }).selectOption('seoul');
      assert.equal(await page.getByRole('combobox', { name: '기본 지역' }).inputValue(), 'seoul');
    } finally { await browser.close(); await server.close(); }
  });

  test(`review 2 ${engine}: range validity and native submission focus target the affected endpoint`, async () => {
    const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
    const browser = await ({ chromium, webkit })[engine].launch();
    try {
      const page = await browser.newPage();
      await page.goto(`${server.origin}/harness.html`);
      await page.waitForFunction(() => customElements.get('krds-date-input'));
      await page.evaluate(async () => {
        const form = document.createElement('form');
        const date = document.createElement('krds-date-input');
        Object.assign(date, { label: '기간', name: 'period', mode: 'range', defaultValue: { start: '2024-02-29', end: '2024-03-01' }, min: '2024-02-01', max: '2024-03-31', withCalendar: false });
        form.append(date); document.querySelector('main').append(form);
        window.changes = []; window.submits = 0;
        date.addEventListener('value-change', event => window.changes.push(event.detail));
        form.addEventListener('submit', event => { event.preventDefault(); window.submits++; });
        await date.updateComplete;
      });
      const end = page.getByRole('textbox', { name: '종료일', exact: true });
      for (const raw of ['bad', '2024-04-01', '']) {
        await end.fill(raw);
        await page.evaluate(() => document.querySelector('form').requestSubmit());
        const observation = await page.locator('krds-date-input').evaluate(async host => {
          await host.updateComplete;
          const [start, end] = host.shadowRoot.querySelectorAll('input');
          return { startValid: start.validity.valid, endValid: end.validity.valid, startInvalid: start.getAttribute('aria-invalid'), endInvalid: end.getAttribute('aria-invalid'), focused: host.shadowRoot.activeElement?.id, values: [...new FormData(document.querySelector('form'))], changes: window.changes, submits: window.submits };
        });
        assert.deepEqual(observation, { startValid: true, endValid: false, startInvalid: null, endInvalid: 'true', focused: 'end', values: [['period.start', '2024-02-29'], ['period.end', '2024-03-01']], changes: [], submits: 0 });
      }
    } finally { await browser.close(); await server.close(); }
  });

  test(`review 3 ${engine}: explicit naming reaches semantic controls across actual host roots`, async () => {
    const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
    const browser = await ({ chromium, webkit })[engine].launch();
    try {
      const page = await browser.newPage();
      const errors = []; page.on('pageerror', error => errors.push(String(error)));
      await page.goto(`${server.origin}/harness.html`);
      await page.waitForFunction(() => customElements.get('krds-tabs'));
      await page.evaluate(async () => {
        const root = document.querySelector('main');
        for (const kind of ['tabs', 'calendar']) {
          for (const mode of ['label', 'labelledby', 'shadow-labelledby']) {
            const container = document.createElement('div'); root.append(container);
            const parent = mode.startsWith('shadow') ? container.attachShadow({ mode: 'open' }) : container;
            const label = document.createElement('span'); label.id = `${kind}-${mode}-label`; label.textContent = `${kind} ${mode}`; parent.append(label);
            const element = document.createElement(`krds-${kind}`);
            if (kind === 'tabs') element.items = [{ value: 'a', label: 'A', content: 'Panel' }];
            element.setAttribute(mode === 'label' ? 'aria-label' : 'aria-labelledby', mode === 'label' ? label.textContent : label.id);
            parent.append(element); await element.updateComplete;
          }
        }
      });
      for (const kind of ['tabs', 'calendar']) for (const mode of ['label', 'labelledby', 'shadow-labelledby']) {
        const role = kind === 'tabs' ? 'tablist' : 'region';
        await page.getByRole(role, { name: `${kind} ${mode}`, exact: true }).waitFor({ timeout: 1000 });
      }
      await page.evaluate(() => {
        for (const container of document.querySelector('main').children) {
          for (const label of (container.shadowRoot ?? container).querySelectorAll('span[id$="-label"]')) label.textContent += ' 갱신';
        }
      });
      for (const kind of ['tabs', 'calendar']) for (const mode of ['labelledby', 'shadow-labelledby']) {
        await page.getByRole(kind === 'tabs' ? 'tablist' : 'region', { name: `${kind} ${mode} 갱신`, exact: true }).waitFor({ timeout: 1000 });
      }
      const rejected = await page.evaluate(async () => {
        const results = [];
        for (const [kind, reference] of [['tabs', ''], ['calendar', 'missing-label']]) {
          const element = document.createElement(`krds-${kind}`);
          if (kind === 'tabs') element.items = [{ value: 'a', label: 'A', content: 'Panel' }];
          element.setAttribute('aria-labelledby', reference);
          const result = element.updateComplete.then(() => false, error => error instanceof TypeError);
          document.querySelector('main').append(element);
          results.push(await result);
          element.remove();
        }
        return results;
      });
      assert.deepEqual(rejected, [true, true]);
      assert.deepEqual(errors, []);
    } finally { await browser.close(); await server.close(); }
  });

  test(`review 4 ${engine}: an inert outer shadow host forces the supplied usable return target`, async () => {
    const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
    const browser = await ({ chromium, webkit })[engine].launch();
    try {
      const page = await browser.newPage();
      await page.goto(`${server.origin}/harness.html`);
      await page.waitForFunction(() => customElements.get('krds-modal'));
      await page.evaluate(async () => {
        const container = document.createElement('div'); container.id = 'shadow-opener';
        const shadow = container.attachShadow({ mode: 'open' }); shadow.innerHTML = '<button>열기</button>';
        const fallback = document.createElement('button'); fallback.id = 'fallback'; fallback.textContent = '다음 작업';
        const modal = document.createElement('krds-modal'); Object.assign(modal, { title: '확인', open: false, returnFocusId: 'fallback' });
        document.querySelector('main').append(container, fallback, modal); await modal.updateComplete;
        shadow.querySelector('button').focus(); modal.open = true; await modal.updateComplete;
        container.inert = true; modal.open = false; await modal.updateComplete;
      });
      assert.equal(await page.getByRole('button', { name: '다음 작업', exact: true }).evaluate(button => button === document.activeElement), true);
    } finally { await browser.close(); await server.close(); }
  });
}
