import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { marked } from 'marked';
/** @typedef {import('../src/content.ts').DocInline} DocInline */
/** @typedef {import('../src/content.ts').DocBlock} DocBlock */
/** @typedef {import('../src/content.ts').DocPage} DocPage */
const excluded = new Set(['node_modules', 'dist', 'src', 'public', '.astro', '.vitepress', 'tests']);
import { docUrl, decodeEntities as decode } from '../src/urls.ts';
export { docUrl } from '../src/urls.ts';
/** Exact VitePress 1.6.4 default slug algorithm, without a runtime VitePress dependency. */
export const slugify = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0000-\u001f]/g, '').replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '').replace(/^(\d)/, '_$1').toLowerCase();
export const inlineText = nodes => nodes.map(node => node.type === 'break' ? '\n' : 'value' in node ? node.value : inlineText(node.children)).join('');
const blockText = blocks => blocks.map(block => block.type === 'paragraph' || block.type === 'heading' ? inlineText(block.children) : block.type === 'code' ? block.value : block.type === 'list' ? block.items.map(item => blockText(item.blocks)).join('\n') : block.type === 'table' ? [...block.headers, ...block.rows.flat()].map(inlineText).join(' ') : block.type === 'quote' ? blockText(block.blocks) : '').join('\n');
/** @returns {DocPage} */
export function parseDocument(markdown, sourcePath) {
 const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
 const body = frontmatter ? markdown.slice(frontmatter[0].length) : markdown;
 const metadata = Object.fromEntries((frontmatter?.[1] ?? '').split('\n').filter(line => /^\w+:/.test(line)).map(line => { const i=line.indexOf(':');return [line.slice(0,i),line.slice(i+1).trim().replace(/^(['"])(.*)\1$/, '$2')]; }));
 const headings = []; const slugs = new Set(); let tableNumber = 0; let itemNumber = 0;
 const fail = (raw, reason) => { const offset = markdown.indexOf(raw); const line=markdown.slice(0,Math.max(0,offset)).split('\n').length; throw new Error(`${sourcePath}:${line}: Unsupported ${reason}`); };
 const inline = tokens => {
  const roots=[]; const stack=[{children: roots,tag: null}];
  for(const token of tokens) {
   const target=()=>stack.at(-1).children;
   switch(token.type){
    case 'text': if(token.tokens) target().push(...inline(token.tokens)); else target().push({type:'text',value:decode(token.text)}); break;
    case 'escape': target().push({type:'text',value:token.text}); break;
    case 'codespan': target().push({type:'code',value:token.text}); break;
    case 'br': target().push({type:'break'}); break;
    case 'strong': case 'em': case 'del': target().push({type:token.type,children:inline(token.tokens)}); break;
    case 'link': target().push({type:'link',href:docUrl(token.href,sourcePath),...(token.title?{title:decode(token.title)}:{}),children:inline(token.tokens)});break;
    case 'html': {
     const raw=token.raw.trim();
     if(/^<br\s*\/?\s*>$/i.test(raw)){target().push({type:'break'});break;}
     const end=raw.match(/^<\/(a|strong|b|em|i|del|s|code|kbd|sub|sup|mark|abbr)\s*>$/i);
     if(end){if(stack.length===1||stack.at(-1).tag!==end[1].toLowerCase())fail(token.raw,'unbalanced inline HTML');stack.pop();break;}
     const open=raw.match(/^<(a|strong|b|em|i|del|s|code|kbd|sub|sup|mark|abbr)((?:\s+[\s\S]*)?)>$/i);
     if(!open)fail(token.raw,'inline HTML');
     const tag=open[1].toLowerCase(); const attrs={}; let rest=open[2];
     while(rest.trim()) {const attr=rest.match(/^\s+([a-z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/i);if(!attr)fail(token.raw,'HTML attributes');const name=attr[1].toLowerCase();if(!['href','target','title','rel'].includes(name)||tag!=='a'&&name!=='title'||name in attrs)fail(token.raw,'HTML attributes');attrs[name]=decode(attr[2]??attr[3]);rest=rest.slice(attr[0].length);}
     if(tag==='a'&&(!attrs.href||attrs.target&&!['_self','_blank'].includes(attrs.target)))fail(token.raw,'anchor attributes');
     const type={a:'link',b:'strong',i:'em',s:'del',code:'code'}[tag]??tag;
     const node=type==='link'?{type,href:docUrl(attrs.href,sourcePath),...(attrs.target?{target:attrs.target}:{}),...(attrs.rel?{rel:attrs.rel}:{}),...(attrs.title?{title:attrs.title}:{}),children:[]}:{type,...(attrs.title?{title:attrs.title}:{}),children:[]};
     // Raw inline <code> is represented as code text after matching its closing tag.
     target().push(node); stack.push({tag,children:node.children,node});break;
    }
    default: fail(token.raw,`inline node ${token.type}`);
   }
  }
  if(stack.length!==1)fail(body,'unclosed inline HTML');
  const normalize = nodes => nodes.map(node => node.type==='code'&&node.children?{type:'code',value:inlineText(normalize(node.children))}:node.children?{...node,children:normalize(node.children)}:node);
  return normalize(roots);
 };
 const blocks = tokens => tokens.flatMap(token => {
  switch(token.type){
   case 'space': case 'def': return [];
   case 'heading': { const children=inline(token.tokens);const title=inlineText(children); const slug=slugify(title);let id=slug;let n=1;while(slugs.has(id))id=`${slug}-${n++}`;slugs.add(id);headings.push({id,title,level:token.depth});return [{type:'heading',level:token.depth,id,children}]; }
   case 'paragraph': case 'text': return [{type:'paragraph',children:inline(token.tokens??marked.Lexer.lexInline(token.text))}];
   case 'code': return [{type:'code',language:token.lang??'',value:token.text}];
   case 'list': return [{type:'list',ordered:token.ordered,start:typeof token.start==='number'?token.start:1,items:token.items.map(item=>{if(item.task)fail(item.raw,'task list');return {id:`item-${++itemNumber}`,blocks:blocks(item.tokens)};})}];
   case 'table': return [{type:'table',caption:`${headings.at(-1)?.title??metadata.title??sourcePath} — Table ${++tableNumber}`,headers:token.header.map(cell=>inline(cell.tokens)),rows:token.rows.map(row=>row.map(cell=>inline(cell.tokens))),align:token.align}];
   case 'blockquote': return [{type:'quote',blocks:blocks(token.tokens)}];
   case 'hr': return [{type:'rule'}];
   case 'html': if(sourcePath==='index.md'&&token.raw.trim()==='<HomeIntro />'){headings.push({id:'home-title',title:'KRDS Native 익숙한 디자인을, 나의 프레임워크로.',level:1},{id:'example-title',title:'문서 안에서 만나는 Solid 컴포넌트',level:2});return [{type:'home'}];}return [{type:'paragraph',children:inline(marked.Lexer.lexInline(token.raw))}];
   default: fail(token.raw,`block node ${token.type}`);
  }
 });
 const parsed=blocks(marked.lexer(body,{gfm:true}));
 const title=headings.find(h=>h.level===1)?.title??metadata.title??'KRDS Native';
 const outputPath=sourcePath.replace(/\.md$/,'.html');const route=docUrl('/'+outputPath,sourcePath);
 return {sourcePath,outputPath,route,title,lang:['index.md','getting-started/installation.md'].includes(sourcePath)?'ko-KR':'en',blocks:parsed,headings,breadcrumbs:[],currentId:sourcePath};
}
/** @returns {Promise<DocPage[]>} */
export async function buildPages(root) {
 async function files(directory){return (await Promise.all((await readdir(directory,{withFileTypes:true})).filter(e=>!excluded.has(e.name)).map(e=>e.isDirectory()?files(resolve(directory,e.name)):e.name.endsWith('.md')&&!(directory===root&&e.name==='README.md')?[resolve(directory,e.name)]:[]))).flat();}
 const pages=await Promise.all((await files(root)).sort().map(async file=>parseDocument(await readFile(file,'utf8'),relative(root,file).replaceAll('\\','/'))));
 pages.push({sourcePath:null,outputPath:'404.html',route:'/krds/404.html',title:'페이지를 찾을 수 없습니다',lang:'ko-KR',blocks:[{type:'paragraph',children:[{type:'text',value:'요청한 페이지를 찾을 수 없습니다.'}]}],headings:[],breadcrumbs:[],currentId:'404'});
 pages.sort((a,b)=>a.outputPath.localeCompare(b.outputPath,'en'));
 for(const page of pages){const section=page.sourcePath?.split('/')[0];const siblings=pages.filter(p=>p.sourcePath&&p.sourcePath.split('/')[0]===section);const index=siblings.indexOf(page);const nav=p=>({id:p.currentId,label:p.title,href:p.route});page.breadcrumbs=[{id:'home',label:'홈',href:'/krds/'},...(section&&section!==page.sourcePath?[{id:section,label:section,href:pages.find(p=>p.sourcePath===`${section}/index.md`)?.route??siblings[0].route}]:[])];if(index>0)page.previous=nav(siblings[index-1]);if(index>=0&&index<siblings.length-1)page.next=nav(siblings[index+1]);}
 return pages;
}
/** @returns {import('../src/content.ts').SearchRecord[]} */
export function buildSearchRecords(pages) {
 return pages.flatMap(page=>{
  const result=[{id:page.currentId,href:page.route,title:page.title,heading:'',text:blockText(page.blocks),lang:page.lang}];
  page.headings.forEach((heading,index)=>{const start=page.blocks.findIndex(b=>b.type==='heading'&&b.id===heading.id);const end=page.blocks.findIndex((b,i)=>i>start&&b.type==='heading');result.push({id:`${page.currentId}#${heading.id}`,href:`${page.route}#${heading.id}`,title:page.title,heading:heading.title,text:blockText(page.blocks.slice(start,end<0?undefined:end)),lang:page.lang});});return result;
 });
}
