import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDemoSelection } from '../src/demo-selection.ts';
const records=['solid','react'].flatMap(framework=>['default','secondary'].map(exampleId=>({framework,exampleId,status:'playable'})));
test('allowlisted query wins, Solid default and invalid values stay safe',()=>{
 assert.equal(resolveDemoSelection({records}).framework,'solid');
 assert.equal(resolveDemoSelection({records,query:'?framework=react',sessionFramework:'solid'}).framework,'react');
 assert.equal(resolveDemoSelection({records,query:'?framework=bogus',sessionFramework:'react'}).framework,'react');
 assert.equal(resolveDemoSelection({records:records.filter(r=>r.framework==='solid'||r.exampleId==='default'),query:'?framework=react&example=secondary'}).exampleId,'default');
});
import {matchesPreviewEvent} from '../../../tools/docs-previews/protocol.ts';
import {readFile} from 'node:fs/promises';
const identity={version:1,framework:'react',componentId:'button',exampleId:'default',token:'abcdefghijklmnop'};
test('transport rejects wrong origin, source, token, stale identities and extra fields',()=>{
 const source={};const event={origin:'https://docs.test',source,data:{...identity,type:'ready'}};
 assert.ok(matchesPreviewEvent(event,event.origin,source,identity));
 assert.equal(matchesPreviewEvent({...event,origin:'https://evil.test'},event.origin,source,identity),null);
 assert.equal(matchesPreviewEvent({...event,source:{}},event.origin,source,identity),null);
 for(const patch of [{token:'ponmlkjihgfedcba'},{framework:'solid'},{componentId:'modal'},{extra:true}])assert.equal(matchesPreviewEvent({...event,data:{...event.data,...patch}},event.origin,source,identity),null);
});
test('typed demo block and page-scoped validated source join are explicit',async()=>{
 const generator=await readFile(new URL('../scripts/generate-routes.mjs',import.meta.url),'utf8');
 assert.match(generator,/validateRegistry\(registry,undefined,\{readSource\}\)/);assert.match(generator,/componentPages\.get\(page.sourcePath\)/);
 const join=await readFile(new URL('../scripts/demo-files.mjs',import.meta.url),'utf8');assert.match(join,/sha256\(bytes\)!==expected/);
 const page=JSON.parse(await readFile(new URL('../src/generated/pages.json',import.meta.url))).find(page=>page.sourcePath==='components/button.md');
 assert.equal(page.blocks.filter(block=>block.type==='demo').length,1);
 assert.deepEqual(page.headings.map(heading=>heading.id),page.blocks.filter(block=>block.type==='heading').map(block=>block.id));
 assert.equal(page.blocks[2].type,'demo');assert.equal(new Set(page.headings.map(heading=>heading.id)).size,page.headings.length);
});
test('both selectors share allowlisted URL updates and retain fragments',async()=>{
 const source=await readFile(new URL('../src/components/NativeDemo.tsx',import.meta.url),'utf8');
 assert.match(source,/change\(selected\(\)\.framework,value\)/);
 assert.match(source,/IntersectionObserver/);
 const url=new URL('https://docs.test/krds/components/button.html?framework=solid#api');
 const next=resolveDemoSelection({records,query:'?framework=react&example=secondary'});
 url.searchParams.set('framework',next.framework);url.searchParams.set('example',next.exampleId);
 assert.equal(url.hash,'#api');assert.equal(resolveDemoSelection({records,query:url.search}).exampleId,'secondary');
});
// Task 7 runner planning: coverage is enforced without filters and no empty/missing suite passes.
import { parseArgs, coverage, planRows, verdict, stable as stableFrameworks, pilots as solid2Pilots, FORMS, OVERLAY, QWIK_QRL } from './native-previews/plan.mjs';
const acceptanceDoc=JSON.parse(await readFile(new URL('../demo-acceptance.json',import.meta.url)));
const families=acceptanceDoc.items.map(i=>i.componentId);
const kind=new Map(acceptanceDoc.items.map(i=>[i.componentId,i.classification]));
const playableRow=(framework,componentId,exampleId='default')=>({framework,componentId,exampleId,status:'playable',acceptanceId:`${componentId}-default`,classification:kind.get(componentId)});
const completeRegistry=[...stableFrameworks.flatMap(f=>families.map(id=>playableRow(f,id))),...families.map(id=>solid2Pilots.includes(id)?playableRow('solid-next',id):{framework:'solid-next',componentId:id,exampleId:'default',status:'unavailable',reason:'x'}),playableRow('react','button','secondary')];
const definitionsOf=registry=>({schemaVersion:1,demos:registry.map(({framework,componentId,exampleId,status})=>({framework,componentId,exampleId,status}))});
test('runner flags filter development runs only',()=>{
 assert.deepEqual(parseArgs([]),{frameworks:[],slice:null,browser:'chromium',filtered:false});
 const o=parseArgs(['--framework','react','--slice=2/4','--browser','webkit']);assert.deepEqual([o.frameworks,o.slice,o.browser,o.filtered],[['react'],{kind:'shard',index:2,total:4},'webkit',true]);
 assert.deepEqual(parseArgs(['--slice','button,modal']).slice,{kind:'components',components:['button','modal']});
 for(const bad of [['--framework','preact'],['--browser','firefox'],['--slice','5/4'],['--bogus']])assert.throws(()=>parseArgs(bad));
});
test('unfiltered coverage requires 378 stable + 6 Solid 2 playable + 48 unavailable rows',()=>{
 const options=parseArgs([]);
 assert.deepEqual(coverage({registry:completeRegistry,definitions:definitionsOf(completeRegistry),acceptance:acceptanceDoc,options}).problems,[]);
 const missing=completeRegistry.filter(r=>!(r.framework==='vue'&&r.componentId==='tabs'));
 const problems=coverage({registry:missing,definitions:definitionsOf(completeRegistry),acceptance:acceptanceDoc,options}).problems;
 assert.ok(problems.some(p=>p.includes('missing promised pair vue/tabs/default')));assert.ok(problems.some(p=>p.includes('expected 378')));
 const reactOnly=completeRegistry.filter(r=>r.framework==='react');
 assert.ok(coverage({registry:reactOnly,definitions:definitionsOf(reactOnly),acceptance:acceptanceDoc,options}).problems.some(p=>p.includes('missing playable default solid/')));
 assert.deepEqual(coverage({registry:reactOnly,definitions:definitionsOf(reactOnly),acceptance:acceptanceDoc,options:parseArgs(['--framework','react'])}).problems,[]);
 const wrongKind=completeRegistry.map(r=>r.framework==='react'&&r.componentId==='badge'?{...r,classification:'interactive'}:r);
 assert.ok(coverage({registry:wrongKind,definitions:definitionsOf(wrongKind),acceptance:acceptanceDoc,options}).problems.some(p=>p.includes('acceptance mismatch react/badge')));
});
test('Chromium plans every playable and unavailable row; WebKit rotates stable frameworks plus all pilots and breadth',()=>{
 const chromiumRows=planRows({registry:completeRegistry,options:parseArgs([])});
 assert.equal(chromiumRows.filter(r=>r.entry.status==='playable'&&r.entry.exampleId==='default').length,384);
 assert.equal(chromiumRows.filter(r=>r.entry.status==='unavailable').length,48);assert.equal(chromiumRows.length,433);
 const webkitRows=planRows({registry:completeRegistry,options:parseArgs(['--browser','webkit'])});
 const rotation=webkitRows.filter(r=>r.reasons.includes('webkit-rotation'));
 assert.deepEqual([...new Set(rotation.map(r=>r.entry.componentId))].sort(),[...families].sort());
 assert.deepEqual(new Set(rotation.map(r=>r.entry.framework)),new Set(stableFrameworks));
 assert.deepEqual(webkitRows.filter(r=>r.entry.framework==='solid-next'&&r.entry.status==='playable').map(r=>r.entry.componentId).sort(),[...solid2Pilots].sort());
 for(const f of stableFrameworks)for(const id of [...FORMS,...OVERLAY])assert.ok(webkitRows.some(r=>r.entry.framework===f&&r.entry.componentId===id),`${f}/${id} in WebKit`);
 for(const id of QWIK_QRL)assert.ok(webkitRows.some(r=>r.entry.framework==='qwik'&&r.entry.componentId===id));
 const shards=[1,2,3].map(i=>planRows({registry:completeRegistry,options:parseArgs(['--slice',`${i}/3`])}).length);assert.equal(shards.reduce((a,b)=>a+b),433);
});
test('verdict rejects empty suites, missing, failed, duplicate and unplanned results',()=>{
 assert.deepEqual(verdict([],[]),['empty suite: no planned rows']);
 const planned=planRows({registry:completeRegistry.filter(r=>r.framework==='react'),options:parseArgs(['--framework','react'])});
 const ok=planned.map(({entry})=>({framework:entry.framework,componentId:entry.componentId,exampleId:entry.exampleId,status:'passed'}));
 assert.deepEqual(verdict(planned,ok),[]);
 assert.ok(verdict(planned,ok.slice(1)).some(p=>p.startsWith('no result for planned row')));
 assert.ok(verdict(planned,[...ok,ok[0]]).some(p=>p.startsWith('duplicate result')));
 assert.ok(verdict(planned,ok.map((r,i)=>i?r:{...r,status:'failed',error:'x'})).some(p=>p.startsWith('failed ')));
 assert.ok(verdict(planned,[...ok,{framework:'vue',componentId:'tabs',exampleId:'default',status:'passed'}]).some(p=>p.startsWith('unplanned')));
});

import {validateRegistry} from '../../../tools/docs-previews/contract.mjs';
test('generate-routes validation (no options, docs cwd) accepts acceptance-derived absentReferences and rejects others',async()=>{
 const registry=JSON.parse(await readFile(new URL('../public/demo-registry.json',import.meta.url),'utf8'));
 const row=registry.find(r=>r.absentReferences);
 assert.ok(row,'registry carries an absentReferences row');
 assert.doesNotThrow(()=>validateRegistry(registry));
 assert.throws(()=>validateRegistry([{...row,absentReferences:['/krds/previews/qwik/local-assets/other.svg']}]),/absent reference/);
});

import {clampFrameHeight} from '../src/demo-frame.ts';
test('frame size messages clamp to the registry minHeight, then layout floors, and at most 1200',()=>{
 const inline={layout:'inline',minHeight:240},tall={layout:'inline',minHeight:720},overlay={layout:'overlay',minHeight:640},tallOverlay={layout:'overlay',minHeight:900};
 assert.equal(clampFrameHeight(inline,100),240);assert.equal(clampFrameHeight(inline,500),500);
 assert.equal(clampFrameHeight(tall,300),720,'registry minimum survives size messages');assert.equal(clampFrameHeight(tall,800),800);
 assert.equal(clampFrameHeight(overlay,300),640);assert.equal(clampFrameHeight(tallOverlay,700),900);
 assert.equal(clampFrameHeight({layout:'overlay',minHeight:240},300),640,'overlay floor applies below a smaller registry minimum');
 assert.equal(clampFrameHeight(inline,5000),1200);assert.equal(clampFrameHeight(tall,Number.NaN),720);
});
test('NativeDemo applies the shared clamp to the server height, each load and every size message',async()=>{
 const source=await readFile(new URL('../src/components/NativeDemo.tsx',import.meta.url),'utf8');
 assert.equal((source.match(/clampFrameHeight\(/g)??[]).length,3);
 assert.match(source,/key===sized\?value:record\.minHeight/,'a reset keeps the height on screen');
 assert.doesNotMatch(source,/overlay'\?640:240/);
});
import {excerptLabel} from '../src/demo-source-view.ts';
test('excerpt label names the line span and symbol',()=>{
 assert.equal(excerptLabel({startLine:12,endLine:40},'TabsExample'),'발췌 · 줄 12–40 · TabsExample');
});
import {demoFiles} from '../scripts/demo-files.mjs';
import {createHash} from 'node:crypto';
test('page source join inlines excerpts instead of a ranged full file, and full files only without ranges',async()=>{
 const hash=b=>createHash('sha256').update(b).digest('hex');
 const full=Buffer.from('import x;\nexport function Tabs(){}\n'),start=10,end=full.length;
 const files=new Map([['/krds/demo-sources/a.tsx.txt',full],[`/krds/demo-sources/a.tsx.excerpt-${start}-${end}.txt`,full.subarray(start,end)],['/krds/demo-sources/host.ts.txt',Buffer.from('host')]]);
 const read=async url=>files.get(url);
 const record={sources:[{path:'a.tsx',role:'example',language:'tsx',symbolOrBranch:'Tabs',sha256:hash(full),downloadUrl:'/krds/demo-sources/a.tsx.txt',ranges:[{start,end,startLine:2,endLine:2,sha256:hash(full.subarray(start,end))}],excerpts:[{startLine:2,endLine:2,sha256:hash(full.subarray(start,end)),downloadUrl:`/krds/demo-sources/a.tsx.excerpt-${start}-${end}.txt`}]},{path:'host.ts',role:'host',language:'typescript',symbolOrBranch:'host',sha256:hash('host'),downloadUrl:'/krds/demo-sources/host.ts.txt'}]};
 const [ranged,plain]=await demoFiles(record,read);
 assert.equal('value' in ranged,false,'a ranged monolith is not inlined');
 assert.equal(ranged.excerpts[0].value,'export function Tabs(){}\n');
 assert.equal(plain.value,'host');
 files.set(`/krds/demo-sources/a.tsx.excerpt-${start}-${end}.txt`,Buffer.from('tampered'));
 await assert.rejects(demoFiles(record,read),/Stale preview source/);
});
import {pngStats,isBlank} from './native-previews/png.mjs';
import {deflateSync,crc32} from 'node:zlib';
test('shell capture gate decodes PNGs and rejects a flat unpainted frame (review M10)',()=>{
 const chunk=(kind,body)=>{const head=Buffer.alloc(8);head.writeUInt32BE(body.length);head.write(kind,4,'latin1');const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(kind,'latin1'),body])));return Buffer.concat([head,body,crc]);};
 const png=(w,h,pixel,filter=0)=>{const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;const rows=[];for(let y=0;y<h;y++){const row=Buffer.alloc(1+w*4);row[0]=filter;for(let x=0;x<w;x++){const [r,g,b]=pixel(x,y);row.set([r,g,b,255],1+x*4);}rows.push(row);}return Buffer.concat([Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(Buffer.concat(rows))),chunk('IEND',Buffer.alloc(0))]);};
 const blank=pngStats(png(32,32,()=>[255,255,255]));assert.deepEqual([blank.colors,blank.varied],[1,0]);assert.ok(isBlank(blank));
 const painted=pngStats(png(32,32,(x,y)=>[x*8,y*8,(x+y)*4]));assert.ok(painted.colors>=16&&!isBlank(painted));
});
test('shell 320 px + 200% capture is a painted, preview-in-view gate',async()=>{
 const shell=await readFile(new URL('./native-previews/shell.mjs',import.meta.url),'utf8');
 assert.match(shell,/paintedScreenshot\(page, resolve\(dir, `\$\{component\}-320-text-200\.png`\)\)/);
 assert.doesNotMatch(shell,/page\.screenshot\(/,'every shell page capture is gated non-blank');
});
test('runner order and hooks: full-file toggle after baselines, registry floor in shell, acceptance in visual (run 7)',async()=>{
 const row=await readFile(new URL('./native-previews/row.mjs',import.meta.url),'utf8'),shell=await readFile(new URL('./native-previews/shell.mjs',import.meta.url),'utf8'),visual=await readFile(new URL('./native-previews/visual.mjs',import.meta.url),'utf8'),scenarios=await readFile(new URL('./native-previews/scenarios.mjs',import.meta.url),'utf8');
 assert.ok(row.indexOf("'전체 파일 보기'")>row.indexOf("'reset returns to initial baseline'"),'shell control activation must follow the initial/reset baselines');
 assert.doesNotMatch(shell,/=== '240px'/);assert.match(shell,/frameFloor\(/);
 assert.match(visual,/acceptance: acceptance\?\.get\(entry\.acceptanceId\)/);
 assert.doesNotMatch(scenarios,/endsWith\(state\.src\)/,'no fixed loaded-image path');
});
