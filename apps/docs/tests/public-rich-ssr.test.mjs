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
 const props={home:{href:'/krds/',label:'Home',logo:{src:'/krds/mark.svg',alt:'KRDS Native'}},utilityItems:[],mainNavigation:[],search:{label:'문서 검색',onRequest(){}}};
 const old=renderToString(()=>Header(props));assert.match(old,/data-krds-part="search"/);assert.doesNotMatch(old,/id="docs-search-trigger"/);
 const named=renderToString(()=>Header({...props,searchTriggerId:'docs-search-trigger'}));assert.match(named,/<button[^>]*id="docs-search-trigger"[^>]*data-krds-part="search"/);
});
