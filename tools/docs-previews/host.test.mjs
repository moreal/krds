import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const temp=mkdtempSync(join(tmpdir(),'preview-host-'));
writeFileSync(join(temp,'protocol.ts'),readFileSync(new URL('./protocol.ts',import.meta.url)));
writeFileSync(join(temp,'host.ts'),readFileSync(new URL('./host.ts',import.meta.url),'utf8').replace("from './protocol'","from './protocol.ts'"));
const { createPreviewHost }=await import(pathToFileURL(join(temp,'host.ts')));
test('native host validates identity and strict parent init, measures readiness and cleans up',()=>{
 const sent=[], listeners=new Map(), attrs={}, controls=[]; let measured, disconnected=false, frame;
 const parent={postMessage:(data,origin)=>sent.push({data,origin})};
 globalThis.window={parent,location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name),requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame:()=>{frame=null}};
 globalThis.document={documentElement:{dataset:attrs},createElement:tag=>({tag,dataset:{},style:{},children:[],append(...n){this.children.push(...n)},addEventListener(name,fn){this[name]=fn},remove(){controls.pop()}})};
 globalThis.ResizeObserver=class{constructor(fn){measured=fn}observe(){}disconnect(){disconnected=true}};
 const root={scrollHeight:300,getBoundingClientRect:()=>({height:250,top:8}),append:el=>controls.push(el),addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();frame();
 assert.deepEqual(sent.map(x=>x.data.type),['ready','size']);assert.equal(sent[1].data.height,324);assert.ok(sent.every(x=>x.origin==='https://local'));
 const init={...host.identity,type:'init',presentation:{colorMode:'forced-colors',reducedMotion:true}};
 const listener=listeners.get('message');
 for(const event of [{origin:'https://other',source:parent,data:init},{origin:'https://local',source:{},data:init},{origin:'https://local',source:parent,data:{...init,token:'wrongwrongwrongwrong'}}])listener(event);
 assert.deepEqual(attrs,{});listener({origin:'https://local',source:parent,data:init});assert.equal(attrs.previewColorMode,'forced-colors');
 const row=controls[0];
 assert.equal(controls.length,1);assert.equal(row.tag,'div');assert.equal(row.dataset.previewReturnRow,'');assert.equal(row.style.marginBlockStart,'16px');
 const exit=row.children.find(c=>c.dataset&&c.dataset.previewReturn!==undefined);assert.ok(exit,'[data-preview-return] still resolves inside the row');assert.equal(exit.tag,'button');
 exit.click();assert.equal(sent.at(-1).data.type,'return-focus');
 host.dispose();host.dispose();assert.ok(disconnected);assert.equal(listeners.size,0);assert.equal(controls.length,0);const count=sent.length;host.ready();measured();assert.equal(sent.length,count);
 window.location.search='?component=button&example=default&token=invalid';assert.throws(()=>createPreviewHost({framework:'react',root}),/identity/);
});
test('native host measures the actual document bottom spacing instead of a fixed allowance',()=>{
 const sent=[]; let frame;
 globalThis.window={parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){}};
 const body={}; const html={dataset:{}};
 globalThis.document={documentElement:html,body,createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 globalThis.getComputedStyle=el=>el===body?{paddingBottom:'24px',marginBottom:'0px',borderBottomWidth:'0px'}:{paddingBottom:'0px',marginBottom:'4px',borderBottomWidth:'0px'};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const root={scrollHeight:300,getBoundingClientRect:()=>({height:250,top:8}),append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();frame();
 assert.equal(sent.at(-1).height,300+8+24+4);
 getComputedStyle=el=>({paddingBottom:'4px',marginBottom:'0px',borderBottomWidth:'0px'});host.ready();frame();
 assert.equal(sent.at(-1).height,300+8+16,'a floor of 16px keeps content away from the frame edge');
 delete globalThis.getComputedStyle;host.dispose();
});
test('native host announces readiness and measures only after document fonts are ready',async()=>{
 const sent=[]; let frame; let resolveFonts; const fontsReady=new Promise(resolve=>{resolveFonts=resolve;});
 globalThis.window={parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){frame=null}};
 globalThis.document={documentElement:{dataset:{}},fonts:{ready:fontsReady},createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const root={scrollHeight:300,getBoundingClientRect:()=>({height:250,top:8}),append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();await Promise.resolve();
 assert.deepEqual(sent,[],'nothing is announced before fonts settle');
 resolveFonts();await fontsReady;await Promise.resolve();frame();
 assert.deepEqual(sent.map(message=>message.type),['ready','size']);
 host.dispose();
});

test('native host unions absolute descendants and measures fixed ones by content need, monotonically',()=>{
 const sent=[]; let frame;
 globalThis.window={scrollY:0,innerHeight:1200,parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){}};
 globalThis.document={documentElement:{dataset:{}},body:{},createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 const child=(position,bottom,extra={},dims={})=>{const c={style:{position,display:'block',visibility:'visible',...extra},rect:{width:100,height:50,bottom},scrollHeight:0,offsetHeight:0,clientHeight:0,...dims};c.getBoundingClientRect=()=>c.rect;return c};
 // The fixed sheet's rect bottom equals the viewport; its content need is only 300.
 const sheet=child('fixed',1200,{bottom:'0px'},{scrollHeight:300,offsetHeight:300,clientHeight:300});
 let children=[child('static',900),sheet,child('absolute',700,{visibility:'hidden'}),child('absolute',800,{display:'none'}),child('fixed',950,{},{scrollHeight:900,offsetHeight:900,clientHeight:900,})];
 children[4].rect={width:0,height:0,bottom:950};
 globalThis.getComputedStyle=el=>children.includes(el)?el.style:{paddingBottom:'0px',marginBottom:'0px',borderBottomWidth:'0px',position:'static'};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const root={scrollHeight:100,getBoundingClientRect:()=>({height:100,top:0}),querySelectorAll:()=>children,append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();frame();
 assert.equal(sent.at(-1).height,100+16,'bottom-anchored fixed sheets contribute nothing');
 for(const h of [662,684,706,1200]){sheet.offsetHeight=h;sheet.scrollHeight=h;sheet.clientHeight=h;sheet.rect.bottom=h;sheet.rect.top=h-300;window.innerHeight=h;frame();}
 assert.equal(sent.at(-1).height,100+16,'a viewport-tracking sheet never grows the frame');
 const popup=child('fixed',0,{bottom:'1px'},{scrollHeight:360,offsetHeight:360,clientHeight:360});popup.rect={width:100,height:360,top:180,bottom:540};children=[popup];frame();
 assert.ok(sent.at(-1).height>=540+16,'top-anchored fixed popup extends from its top by its scrollHeight');
 window.scrollY=100;children=[child('absolute',720,{})];frame();
 assert.equal(sent.at(-1).height,820+16,'absolute rects add the document scroll offset');
 children=[];frame();assert.equal(sent.at(-1).height,820+16,'never smaller within a session');
 delete globalThis.getComputedStyle;host.dispose();
});
test('native host size sequence 575 -> 280 -> 575 never reports smaller, and ready restarts the session',()=>{
 const sent=[]; let frame;
 globalThis.window={scrollY:0,innerHeight:1200,parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){}};
 globalThis.document={documentElement:{dataset:{}},body:{},createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 let bottom=559; const popup={style:{position:'absolute',display:'block',visibility:'visible'},getBoundingClientRect:()=>({width:100,height:100,bottom})};
 globalThis.getComputedStyle=el=>el===popup?popup.style:{paddingBottom:'0px',marginBottom:'0px',borderBottomWidth:'0px',position:'static'};
 const root={scrollHeight:100,getBoundingClientRect:()=>({height:100,top:0}),querySelectorAll:()=>[popup],append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();
 const heights=[];for(const b of [559,264,559]){bottom=b;frame();heights.push(sent.at(-1).height);}
 assert.deepEqual(heights,[575,575,575]);
 bottom=264;host.ready();frame();assert.equal(sent.at(-1).height,280,'ready starts a fresh session');
 delete globalThis.getComputedStyle;host.dispose();
});
test('native host re-measures when a positioned child appears after ready and stops after dispose',()=>{
 const sent=[]; let frame, mutate, mutationDisconnected=false;
 globalThis.window={scrollY:0,innerHeight:1200,parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){frame=null}};
 globalThis.document={documentElement:{dataset:{}},body:{},createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 globalThis.MutationObserver=class{constructor(fn){mutate=fn}observe(){}disconnect(){mutationDisconnected=true}};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const popup={style:{position:'absolute',display:'block',visibility:'visible'},getBoundingClientRect:()=>({width:100,height:300,bottom:559})};
 let children=[];
 globalThis.getComputedStyle=el=>el===popup?popup.style:{paddingBottom:'0px',marginBottom:'0px',borderBottomWidth:'0px',position:'static'};
 const root={scrollHeight:100,getBoundingClientRect:()=>({height:100,top:0}),querySelectorAll:()=>children,append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();frame();
 assert.equal(sent.at(-1).height,116);
 children=[popup];mutate();frame();
 assert.equal(sent.at(-1).height,559+16);
 host.dispose();assert.ok(mutationDisconnected);const count=sent.length;frame=null;mutate();assert.equal(frame,null);assert.equal(sent.length,count);
 delete globalThis.MutationObserver;delete globalThis.getComputedStyle;
});

test('native host scans document.body for portalled overlays: absolute extends, viewport-anchored fixed does not',()=>{
 const sent=[]; let frame, mutate, observed;
 globalThis.window={scrollY:0,innerHeight:1200,parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){}};
 let inBody=[];
 const body={querySelectorAll:()=>inBody};
 globalThis.document={documentElement:{dataset:{}},body,createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 globalThis.MutationObserver=class{constructor(fn){mutate=fn}observe(target){observed=target}disconnect(){}};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const el=(position,style,rect)=>({style:{position,display:'block',visibility:'visible',...style},getBoundingClientRect:()=>rect,scrollHeight:200,offsetHeight:200,clientHeight:200});
 globalThis.getComputedStyle=e=>e.style??{paddingBottom:'0px',marginBottom:'0px',borderBottomWidth:'0px',position:'static'};
 const root={scrollHeight:100,getBoundingClientRect:()=>({height:100,top:0}),querySelectorAll:()=>[],append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();frame();
 assert.equal(observed,body);assert.equal(sent.at(-1).height,116);
 inBody=[el('fixed',{bottom:'0px'},{width:100,height:900,top:0,bottom:1200})];mutate();frame();
 assert.equal(sent.at(-1).height,116,'viewport-anchored fixed in body is excluded');
 inBody.push(el('absolute',{},{width:100,height:300,top:250,bottom:541}));mutate();frame();
 assert.equal(sent.at(-1).height,541+16);
 delete globalThis.MutationObserver;delete globalThis.getComputedStyle;host.dispose();
});

test('native host classifies fixed boxes by geometry: popup extends, sheet and full-height panel are excluded',()=>{
 const sent=[]; let frame;
 globalThis.window={scrollY:0,innerHeight:195,parent:{postMessage:data=>sent.push(data)},location:{search:'?component=button&example=default&token=0123456789abcdef',origin:'https://local'},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frame=fn;return 1},cancelAnimationFrame(){}};
 let list=[];
 globalThis.document={documentElement:{dataset:{}},body:{querySelectorAll:()=>list},createElement:()=>({dataset:{},style:{},append(){},addEventListener(){},remove(){}})};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const fixed=(top,bottom,content)=>({style:{position:'fixed',display:'block',visibility:'visible',bottom:'0px'},getBoundingClientRect:()=>({width:100,height:bottom-top,top,bottom}),scrollHeight:content,offsetHeight:bottom-top,clientHeight:bottom-top});
 globalThis.getComputedStyle=e=>e.style??{paddingBottom:'0px',marginBottom:'0px',borderBottomWidth:'0px',position:'static'};
 const root={scrollHeight:100,getBoundingClientRect:()=>({height:100,top:0}),append(){},addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'react',root});host.ready();
 list=[fixed(100,195,95)];frame();assert.equal(sent.at(-1).height,116,'bottom sheet (bottom === innerHeight) excluded');
 list=[fixed(0,195,300)];frame();assert.equal(sent.at(-1).height,116,'full-height panel excluded');
 for(const h of [662,684,706]){window.innerHeight=h;list=[fixed(h-200,h,200)];frame();}
 assert.equal(sent.at(-1).height,116,'viewport-tracking sheet stays flat');
 window.innerHeight=195;list=[fixed(92,555,463)];frame();
 assert.ok(sent.at(-1).height>=555+16,'popup top 92/bottom 555 extends the frame');
 delete globalThis.getComputedStyle;host.dispose();
});
test('full-page return navigates to the preserved .html component route (astro build.format preserve)',()=>{
 const assigned=[]; const controls=[];
 const win={location:{search:'?component=tabs&example=default',origin:'https://local',assign:url=>assigned.push(url)},addEventListener(){},removeEventListener(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
 win.parent=win; globalThis.window=win;
 globalThis.document={documentElement:{dataset:{}},createElement:tag=>({tag,dataset:{},style:{},children:[],append(...n){this.children.push(...n)},addEventListener(name,fn){this[name]=fn},remove(){}})};
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const root={scrollHeight:10,getBoundingClientRect:()=>({height:10,top:0}),append:el=>controls.push(el),addEventListener(){},removeEventListener(){}};
 const host=createPreviewHost({framework:'qwik',root});host.ready();
 controls[0].children[0].click();
 assert.deepEqual(assigned,['/krds/components/tabs.html']);
 host.dispose();
});
