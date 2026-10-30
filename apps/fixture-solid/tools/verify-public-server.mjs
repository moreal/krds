import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderToString } from 'solid-js/web';
import * as Public from '@unofficial-krds/solid';
import { fullCatalogStoryCases } from '@unofficial-krds/test-contracts';

const repository = new URL('../../../', import.meta.url);
const definitions = JSON.parse(await readFile(new URL('catalog/full-catalog-contracts.json', repository), 'utf8')).items;
const pilots = [
  { id: 'button', exportName: 'Button', props: { children: '서버 버튼' } },
  { id: 'native-select', exportName: 'NativeSelect', props: { label: '지역', options: [{ value: 'seoul', label: '서울' }], value: 'seoul' } },
  { id: 'modal', exportName: 'Modal', props: { title: '대화상자', open: false } },
  { id: 'tabs', exportName: 'Tabs', props: { label: '정보', items: [{ value: 'one', label: '하나', content: '내용' }] } },
  { id: 'date-input', exportName: 'DateInput', props: { label: '방문일', referenceDate: '2024-02-01' } },
  { id: 'calendar', exportName: 'Calendar', props: { label: '방문 달력', referenceDate: '2024-02-01' } },
];
const cases = [...pilots, ...definitions.map(definition => ({ ...definition, props: fullCatalogStoryCases.find(story => story.componentId === definition.id).state }))];
const results = [];
for (const specimen of cases) {
  const entry = { componentId: specimen.id, exportName: specimen.exportName, mode: 'public-node-server-entry-smoke', coverageAwarded: false };
  const events = [];
  try {
    const subpath = await import(`@unofficial-krds/solid/${specimen.id}`);
    if (subpath[specimen.exportName] !== Public[specimen.exportName]) throw new Error('Public server root/subpath identity differs');
    const props = { ...specimen.props, hrefForPage: page => `/local/results?page=${page}` };
    for (const name of ['onAction','onRequest','onFilesChange','onFilesRejected','onValueChange','onCheckedChange','onOpenChange','onDismiss','onBackRequest','onStop','onStart','onPlayingChange','onIndexChange']) props[name] = detail => events.push({ name, detail });
    if (specimen.id === 'file-upload') props.files = [];
    const html = renderToString(() => Public[specimen.exportName](props));
    entry.htmlBytes = Buffer.byteLength(html);
    entry.html = html;
    entry.events = events;
    if (events.length) throw new Error('Server rendering emitted a host action');
    entry.status = 'passed';
    if (specimen.id === 'favicon') entry.limit = 'Head integration emits no server-owned link markup here; this smoke does not prove SSR head/favicon presence.';
  } catch (error) {
    entry.status = 'failed';
    entry.error = String(error?.stack ?? error);
  }
  results.push(entry);
}
const report = { mode: 'public-node-server-entry-smoke', document: typeof document, coverageAwarded: false, passed: results.filter(result => result.status === 'passed').length, total: results.length, results };
await writeFile(new URL('.superpowers/sdd/PLAN/t10-solid-logs/ssr-public-entry-smoke.json', repository), JSON.stringify(report, null, 2) + '\n');
process.stdout.write(`${report.passed}/${report.total} actual public server entry constructions; document=${report.document}.\n`);
for (const result of results.filter(result => result.status === 'failed')) process.stdout.write(`${result.componentId}: ${result.error}\n`);
if (report.passed !== report.total) process.exitCode = 1;
