import { For } from 'solid-js';
import { TextList } from '@unofficial-krds/solid/text-list';
import { Table } from '@unofficial-krds/solid/table';
import { HomeIntro } from './HomeIntro';
import type { DocBlock, DocInline as Inline } from '../content';
import { DocInline } from './DocInline';
import { CodeBlock } from './CodeBlock';
const text = (nodes: Inline[]): string => nodes.map(node=>'value' in node?node.value:node.type==='break'?' ':text(node.children)).join('');
export function DocBlocks(props: { blocks: DocBlock[]; listDepth?: number }) {
 return <For each={props.blocks}>{block=>{
  switch(block.type){
   case 'heading': {
    const children=<DocInline nodes={block.children} />;
    switch(block.level){case 1:return <h1 id={block.id}>{children}</h1>;case 2:return <h2 id={block.id}>{children}</h2>;case 3:return <h3 id={block.id}>{children}</h3>;case 4:return <h4 id={block.id}>{children}</h4>;case 5:return <h5 id={block.id}>{children}</h5>;default:return <h6 id={block.id}>{children}</h6>;}
   }
   case 'paragraph': return <p><DocInline nodes={block.children} /></p>;
   case 'code': return <CodeBlock value={block.value} language={block.language} />;
   case 'quote': return <blockquote><DocBlocks blocks={block.blocks} listDepth={props.listDepth} /></blockquote>;
   case 'rule': return <hr />;
   case 'list': {
    const items=block.items.map(item=>({id:item.id,content:''}));
    const lookup=new Map(block.items.map(item=>[item.id,item.blocks]));
    return <TextList ordered={block.ordered} start={block.start} marker={['dot','hollow','dash'][(props.listDepth??0)%3] as 'dot'|'hollow'|'dash'} items={items} renderItem={item=><DocBlocks blocks={lookup.get(item.id)!} listDepth={(props.listDepth??0)+1} />} />;
   }
   case 'table': {
    const columns=block.headers.map((header,index)=>({id:`column-${index}`,label:text(header),kind:'text' as const}));
    const rows=block.rows.map((row,index)=>({id:`row-${index}`,cells:Object.fromEntries(row.map((cell,i)=>[`column-${i}`,text(cell)]))}));
    return <div class="docs-table"><Table caption={block.caption} columns={columns} rows={rows} renderHeader={column=><div style={{'text-align':block.align[Number(column.id.slice(7))]??'start'}}><DocInline nodes={block.headers[Number(column.id.slice(7))]!} /></div>} renderCell={(row,column)=><div style={{'text-align':block.align[Number(column.id.slice(7))]??'start'}}><DocInline nodes={block.rows[Number(row.id.slice(4))]![Number(column.id.slice(7))]!} /></div>} /></div>;
   }
   case 'home': return <HomeIntro />;
  }
 }}</For>;
}
