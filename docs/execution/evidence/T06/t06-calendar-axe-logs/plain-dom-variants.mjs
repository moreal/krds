// Focused tool-behavior research only; zero KRDS renderer/catalog coverage.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const require = createRequire(resolve(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const axeEntry = require.resolve('axe-core', { paths: [dirname(require.resolve('@axe-core/playwright'))] });
const axePackage = JSON.parse(readFileSync(resolve(dirname(axeEntry), 'package.json')));
const full = '2024년 2월 29일 목요일';
const state = `${full}, 오늘, 선택됨`;
const variants = [
  ['ko-aria-label', `<button id="target" aria-label="${full}">29</button>`, full],
  ['ko-aria-label-state', `<button id="target" aria-label="${state}" aria-current="date" aria-pressed="true">29</button>`, state],
  ['en-aria-label', '<button id="target" aria-label="Thursday, February 29, 2024">29</button>', 'Thursday, February 29, 2024'],
  ['ko-aria-hidden-number', `<button id="target" aria-label="${full}"><span aria-hidden="true">29</span></button>`, full],
  ['ko-labelledby-hidden-date', `<span id="date" hidden>${full}</span><button id="target" aria-labelledby="date">29</button>`, full],
  ['ko-name-from-content', '<button id="target"><span class="sr">2024년 2월 </span>29<span class="sr">일 목요일</span></button>', full],
  ['ko-name-from-content-hidden-number', `<button id="target"><span aria-hidden="true">29</span><span class="sr">${full}</span></button>`, full],
  ['ko-visible-day-suffix', `<button id="target" aria-label="${full}">29일</button>`, full],
];
const out = process.argv[2] ?? resolve(import.meta.dirname, 'plain-dom-results.json');
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ locale: 'ko-KR', timezoneId: 'Asia/Seoul' });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const observations = [];
  for (const [id, markup, expectedName] of variants) {
    await page.setContent(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Plain DOM axe naming research</title><style>.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}button{font:20px sans-serif;min-width:44px;min-height:44px}</style></head><body><main>${markup}</main></body></html>`);
    const snapshot = await page.locator('#target').ariaSnapshot();
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#target' });
    const axTree = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
    const chromiumComputedName = axTree.nodes.find(node => node.role?.value === 'button')?.name?.value;
    const data = await page.locator('#target').evaluate(el => ({ outerHTML: el.outerHTML, textContent: el.textContent, innerText: el.innerText }));
    const raw = await new AxeBuilder({ page }).withRules(['label-content-name-mismatch']).analyze();
    const axeNames = await page.evaluate(() => {
      window.axe.utils.getFlattenedTree(document.documentElement);
      const el = document.querySelector('#target');
      return { accessibleName: window.axe.commons.text.accessibleText(el), visibleText: window.axe.commons.text.visible(el) };
    });
    const tokens = await page.evaluate(({ label, name }) => {
      // Exact relevant axe curation for these emoji-/parenthesis-free samples.
      const tokensFor = text => [...new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, ' '))].map(x => x.segment.trim()).filter(Boolean);
      return { browserLanguage: navigator.language, segmenterLocale: new Intl.Segmenter(undefined, { granularity: 'word' }).resolvedOptions().locale, visibleTokens: tokensFor(label), nameTokens: tokensFor(name) };
    }, { label: axeNames.visibleText, name: axeNames.accessibleName });
    observations.push({ id, expectedName, chromiumComputedName, exactNamePreserved: chromiumComputedName === expectedName, snapshot, ...data, ...axeNames, tokens, raw });
    console.log(JSON.stringify({ id, expectedName, chromiumComputedName, exactNamePreserved: chromiumComputedName === expectedName, snapshot, ...axeNames, violations: raw.violations.map(v => ({ id: v.id, nodes: v.nodes.length })), passes: raw.passes.map(v => v.id), inapplicable: raw.inapplicable.map(v => v.id), incomplete: raw.incomplete.map(v => v.id) }));
  }
  const result = { scope: 'Temporary plain DOM research: zero KRDS renderer/catalog coverage', node: process.version, playwright: require('playwright/package.json').version, axePlaywright: JSON.parse(readFileSync(resolve(dirname(require.resolve('@axe-core/playwright')), '../package.json'))).version, axeCore: axePackage.version, axeEntry, browserVersion: browser.version(), chromiumExecutableReportedByPlaywright: chromium.executablePath(), launchMode: 'default headless Chromium shell; PLAYWRIGHT_BROWSERS_PATH=' + process.env.PLAYWRIGHT_BROWSERS_PATH, observations };
  writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
} finally { await browser.close(); }
