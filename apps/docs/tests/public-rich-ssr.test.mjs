import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToString, ssr } from 'solid-js/web';
import { TextList } from '@unofficial-krds/solid/text-list';
import { Table } from '@unofficial-krds/solid/table';
import { Link } from '@unofficial-krds/solid/link';
import { Header } from '@unofficial-krds/solid/header';
import { parseDocument } from '../scripts/content.mjs';
test('actual public server subpaths render rich props and keep string fallbacks',()=>{
 const list=renderToString(()=>TextList({ordered:true,items:[{id:'a',content:'fallback'}],renderItem:item=>ssr('<strong>'+item.content+'</strong>')}));
 assert.match(list,/<strong>fallback<\/strong>/); assert.match(list,/data-krds-ordering="ordered"/);
 const link=renderToString(()=>Link({href:'#api',label:ssr('<code>API</code>')}));assert.match(link,/<code>API<\/code>/);
 assert.match(renderToString(()=>TextList({ordered:true,start:3,items:[{id:'a',content:'three'}]})),/start="3"/);
 const props={caption:'API',columns:[{id:'api',label:'API',kind:'text'}],rows:[{id:'a',cells:{api:'default'}}]};
 assert.match(renderToString(()=>Table({...props,renderHeader:column=>ssr('<strong>'+column.label+'</strong>'),renderCell:(row,column)=>ssr('<code>'+row.cells[column.id]+'</code>')})),/<code>default<\/code>/);
 assert.match(renderToString(()=>Table({...props,renderHeader:column=>ssr('<code>'+column.label+'</code>')})),/<code>API<\/code>/);
 assert.match(renderToString(()=>Table(props)),/>default</);
 const rowHeader=renderToString(()=>Table({...props,rowHeaderColumnId:'api',renderCell:()=>ssr('<code>row header</code>')}));assert.match(rowHeader,/scope="row"[^>]*><code>row header<\/code>/);
 assert.match(renderToString(()=>TextList({items:[{id:'a',content:'one',children:[{id:'b',content:'two',children:[{id:'c',content:'three'}]}]}]})),/>three</);
});

test('parsed zero-start ordered Markdown reaches the real public ol unchanged',()=>{
 const list=parseDocument('0. zero\n1. one\n','zero.md').blocks[0];
 assert.equal(list.type,'list');
 const result=renderToString(()=>TextList({ordered:list.ordered,start:list.start,items:list.items.map(item=>({id:item.id,content:'entry'}))}));
 assert.match(result,/<ol[^>]*start="0"/);
});

test('public Header search ID is optional and belongs to its own button',()=>{
 const props={home:{href:'/krds/',label:'Home',logo:{src:'/krds/mark.svg',alt:'Unofficial KRDS'}},utilityItems:[],mainNavigation:[],search:{label:'문서 검색',onRequest(){}}};
 const old=renderToString(()=>Header(props));assert.match(old,/data-krds-part="search"/);assert.doesNotMatch(old,/id="docs-search-trigger"/);
 const named=renderToString(()=>Header({...props,searchTriggerId:'docs-search-trigger'}));assert.match(named,/<button[^>]*id="docs-search-trigger"[^>]*data-krds-part="search"/);
});

test('NativeDemoSource SSR shows a labelled excerpt with a full-file toggle and download, and full files unchanged', async () => {
  const { getViteConfig } = await import('astro/config');
  const { createServer } = await import('vite');
  const config = await getViteConfig({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })({ mode: 'test', command: 'serve' });
  const server = await createServer({ ...config, configFile: false, root: new URL('..', import.meta.url).pathname });
  try {
    const { NativeDemoSource } = await server.ssrLoadModule('/src/components/NativeDemoSource.tsx');
    const web = await server.ssrLoadModule('solid-js/web');
    const base = { path: 'src/docs-preview/CatalogExamples.tsx', role: 'example', language: 'tsx', symbolOrBranch: 'TabsExample', sha256: 'a'.repeat(64), downloadUrl: '/krds/demo-sources/src/docs-preview/CatalogExamples.tsx.txt' };
    const excerpt = { startLine: 12, endLine: 40, sha256: 'b'.repeat(64), downloadUrl: '/krds/demo-sources/src/docs-preview/CatalogExamples.tsx.excerpt-1-2.txt', value: 'export function TabsExample() {}' };
    const ranged = web.renderToString(() => NativeDemoSource({ files: [{ ...base, excerpts: [excerpt] }] }));
    assert.match(ranged, /발췌 · 줄 12–40 · TabsExample/);
    assert.match(ranged, /export function TabsExample\(\) \{\}/);
    assert.match(ranged, /data-krds-component="disclosure"[\s\S]*전체 파일 보기/);
    assert.match(ranged, /<div[^>]*hidden[^>]*data-krds-part="content"|<div[^>]*data-krds-part="content"[^>]*hidden/, 'full file is collapsed by default');
    assert.match(ranged, /href="\/krds\/demo-sources\/src\/docs-preview\/CatalogExamples\.tsx\.txt"/);
    const plain = web.renderToString(() => NativeDemoSource({ files: [{ ...base, value: 'const whole = 1;' }] }));
    assert.match(plain, /const whole = 1;/);
    assert.doesNotMatch(plain, /발췌|전체 파일 보기|data-krds-component="disclosure"/);
    assert.match(plain, /href="\/krds\/demo-sources\/src\/docs-preview\/CatalogExamples\.tsx\.txt"/);
  } finally { await server.close(); }
});
