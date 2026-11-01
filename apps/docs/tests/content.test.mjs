import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const site = resolve(import.meta.dirname, '..');
const modulePath = resolve(site, 'scripts/content.mjs');
const api = async () => { try { return await import(modulePath); } catch (error) { if(error.code==='ERR_MODULE_NOT_FOUND') assert.fail('typed Markdown content parser must exist'); throw error; } };

test('rich tables, raw anchors and nested mixed lists retain inline and block structure', async () => {
 const {parseDocument}=await api();
 const page=parseDocument('# Rich\n\n| API | Value |\n| --- | --- |\n| `a\\|b` | [**guide**](../guide?x=1#part)<br>next |\n\n3. **parent**\n   - [child](./child)\n     1. `third`\n\n<a href="../_legal/index.html" target="_self">rights</a>\n', 'components/rich.md');
 const table=page.blocks.find(x=>x.type==='table');
 assert.equal(table.rows[0][0][0].value,'a|b');
 assert.equal(table.rows[0][1][0].href,'/krds/guide.html?x=1#part');
 assert.equal(table.rows[0][1][0].children[0].type,'strong');
 assert.equal(table.rows[0][1][1].type,'break');
 const list=page.blocks.find(x=>x.type==='list');
 assert.equal(list.ordered,true); assert.equal(list.start,3);
 assert.equal(list.items[0].blocks[1].ordered,false);
 assert.equal(list.items[0].blocks[1].items[0].blocks[1].ordered,true);
 assert.equal(page.blocks.at(-1).children[0].href,'/krds/_legal/index.html');
});
test('base helper preserves relative, already based, query, fragment and external destinations', async()=>{
 const {docUrl}=await api();
 for(const [input,expected] of [['../legal/','/krds/legal/'],['/krds/sources/a.txt?x=1#part','/krds/sources/a.txt?x=1#part'],['./button.md#api','/krds/components/button.html#api'],['#api','#api'],['?x=1','/krds/components/rich.html?x=1'],['https://example.test/a','https://example.test/a'],['mailto:dev@example.test','mailto:dev@example.test']]) assert.equal(docUrl(input,'components/rich.md'),expected);
 assert.throws(()=>docUrl('javascript:alert(1)','a.md'),/Unsupported URL/);
});
test('fenced native source remains inert and duplicate Korean/code headings match old slugs',async()=>{
 const {parseDocument,slugify}=await api();
 const source='## 한글 `Code`\n\n## 한글 `Code`\n\n```tsx\n<Button onClick={() => alert(1)}>x</Button>\n```\n\n```svelte\n<script>let n = 1;</script>\n```\n';
 const page=parseDocument(source,'example.md');
 assert.deepEqual(page.headings.map(x=>x.id),[slugify('한글 Code'),slugify('한글 Code')+'-1']);
 assert.equal(page.blocks[2].value,'<Button onClick={() => alert(1)}>x</Button>');
 assert.equal(page.blocks[3].language,'svelte');
 assert.equal(parseDocument('`&amp;` and &amp;', 'entities.md').blocks[0].children[0].value,'&amp;');
 assert.deepEqual(parseDocument('## Repeat\n\n## Repeat-1\n\n## Repeat','duplicate.md').headings.map(h=>h.id),['repeat','repeat-1','repeat-2']);
 assert.throws(()=>parseDocument('# x\n\n<script>alert(1)</script>','bad.md'),/bad.md:3.*Unsupported/);
 assert.throws(()=>parseDocument('<a href="/a" onclick="bad()">x<\/a>','bad.md'),/Unsupported/);
});
test('all real documents parse once with baseline heading parity and deterministic search records',async()=>{
 const {buildPages,buildSearchRecords}=await api(); const pages=await buildPages(site);
 const baseline=JSON.parse(await readFile(resolve(site,'tests/fixtures/vitepress-baseline.json'),'utf8'));
 assert.equal(pages.length,134);
 for(const before of baseline.pages.filter(x=>x.path!=='_legal/index.html')){
  const page=pages.find(x=>x.outputPath===before.path);assert.ok(page,before.path);
  assert.deepEqual(page.headings.map(x=>x.id),before.headingIds,before.path);
 }
 assert.ok(pages.find(x=>x.sourcePath==='components/button.md').blocks.some(x=>x.type==='table'));
 assert.ok(pages.find(x=>x.sourcePath==='examples/solid-2.md').blocks.some(x=>x.type==='code'));
 const records=buildSearchRecords(pages);assert.deepEqual(records,buildSearchRecords(await buildPages(site)));
 assert.ok(records.some(x=>x.title==='Badge'&&x.text.includes('배지')));
});

test('zero is a valid ordered-list start and unordered lists retain their default',async()=>{
 const {parseDocument}=await api();
 const ordered=parseDocument('0. zero\n1. one\n','zero.md').blocks[0];
 assert.equal(ordered.ordered,true);assert.equal(ordered.start,0);
 const unordered=parseDocument('- item\n','unordered.md').blocks[0];
 assert.equal(unordered.ordered,false);assert.equal(unordered.start,1);
});
test('browser-recognized encoded dots and backslashes stay beneath the base',async()=>{
 const {docUrl}=await api();const suffix='?next=%2Fdeep%3Fx#frag%2Fpart';
 const cases=[
  ['/%2e%2e/outside','/krds/outside.html'],
  ['../%2e%2e/outside','/krds/outside.html'],
  ['/%2e/%2E%2e/outside','/krds/outside.html'],
  ['/krds/.%2E/outside','/krds/outside.html'],
  ['..\\%2E.\\outside.md','/krds/outside.html'],
  ['/krds\\components\\button.md','/krds/components/button.html'],
  ['/sources/a%2Fb%3F.txt','/krds/sources/a%2Fb%3F.txt'],
 ];
 for(const [input,expected]of cases){const result=docUrl(input+suffix,'components/probe.md');assert.equal(result,expected+suffix,input);assert.ok(new URL(result,'https://moreal.github.io').pathname.startsWith('/krds/'),input);}
 assert.equal(docUrl('https://example.test/%2e%2e/outside'+suffix),'https://example.test/%2e%2e/outside'+suffix);
});
