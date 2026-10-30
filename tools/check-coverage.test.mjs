import assert from 'node:assert/strict';
import {after,before,test} from 'node:test';
import {createHash} from 'node:crypto';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,resolve} from 'node:path';
import {inspectCoverage} from './check-coverage.mjs';
const project=resolve(import.meta.dirname,'..');
const load=path=>JSON.parse(readFileSync(resolve(project,path),'utf8'));
let root,baseline;
const write=(path,value)=>{const full=resolve(root,path);mkdirSync(dirname(full),{recursive:true});writeFileSync(full,typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value));};
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
function mutateCoverage(change){const value=structuredClone(baseline);change(value);write('catalog/coverage.json',value);return inspectCoverage(root);}
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQ5sAAAAASUVORK5CYII=','base64');
before(()=>{
 root=mkdtempSync(resolve(tmpdir(),'krds-coverage-unit-'));
 const catalog=load('catalog/components.json'),manifest=load('upstream/krds/manifest.json');
 baseline=load('catalog/coverage.json');
 for(const name of ['story-cases','fixture-cases','full-catalog-stories','full-catalog-scenarios','full-catalog-contracts'])write(`catalog/${name}.json`,load(`catalog/${name}.json`));
 for(const name of ['story-coverage','full-catalog-story-coverage']){const tracker=load(`catalog/${name}.json`);for(const row of tracker.entries){row.status='verified';row.evidencePaths=[`evidence/${row.framework}/stories.json`];}write(`catalog/${name}.json`,tracker);}
 const stories=[...load('catalog/story-cases.json').cases,...load('catalog/full-catalog-stories.json').cases];
 const cases=[...load('catalog/fixture-cases.json').cases,...load('catalog/full-catalog-scenarios.json').cases];
 // Synthetic complete evidence exists only in the disposable unit fixture, never in repository coverage.
 for(const item of catalog.components){
  const content=`Synthetic frozen test source ${item.id}`;const sha=createHash('sha256').update(content).digest('hex');
  item.source={...item.source,bytes:Buffer.byteLength(content),sha256:sha};
  const frozen=manifest.components.find(record=>record.id===item.canonicalId);frozen.source={...item.source};
  write(item.source.localPath,content);write(item.specPath,`Synthetic contract ${item.id}`);write(`docs/${item.id}.md`,`Synthetic documentation ${item.id}`);
 }
 write('catalog/components.json',catalog);write('upstream/krds/manifest.json',manifest);write('reviews/native.md','Approved independent synthetic native scope.');
 for(const framework of baseline.stableFrameworks){
  const web=catalog.components.filter(item=>item.webApplicable);
  write(`packages/${framework}/package.json`,{name:`@unofficial-krds/${framework}`,type:'module',exports:{'.':{types:'./dist/index.d.ts',import:'./dist/index.js'}}});
  write(`packages/${framework}/dist/index.js`,web.map(item=>`export const ${item.exportName} = '${item.id}';`).join('\n'));
  write(`packages/${framework}/dist/index.d.ts`,web.map(item=>`export declare const ${item.exportName}: string;`).join('\n'));
  write(`packages/${framework}/src/index.ts`,web.map(item=>`export {${item.exportName}} from './components/${item.id}/index.js';`).join('\n'));
  write(`apps/fixture-${framework}/package.json`,{name:`synthetic-fixture-${framework}`,private:true,type:'module',dependencies:{[`@unofficial-krds/${framework}`]:'workspace:^'}});

  const summary={kind:'contract',mode:'catalog',results:[{framework,status:'passed',exitCode:0,canonicalSelection:true,tests:cases.map(entry=>({title:`${framework} ${entry.componentId}/${entry.caseId}`,status:'passed',nativeHealth:true,classification:'passed'}))}]};
  const raw={errors:[],stats:{unexpected:0,skipped:0},suites:[{specs:cases.map(entry=>({title:`${framework} ${entry.componentId}/${entry.caseId}`,ok:true,tests:[{status:'expected',results:[{status:'passed',attachments:[{name:'native-health.json',body:Buffer.from(JSON.stringify({healthy:true,framework,fixture:{componentId:entry.componentId,caseId:entry.caseId}})).toString('base64')}]}]}]}))}]};
  write(`evidence/${framework}/behavior.json`,summary);write(`evidence/${framework}/raw.json`,raw);
  write(`evidence/${framework}/stories.json`,{kind:'stories',mode:'catalog',results:[{framework,status:'passed',canonicalSelection:true,stories:stories.map(entry=>({id:entry.id,status:'passed',requests:[],violations:[],axe:{violations:[]}}))}]});
  for(const entry of stories)write(`evidence/${framework}/screenshots/${entry.id}.png`,png);
  for(const item of catalog.components.filter(record=>record.webApplicable)){
   const native=`packages/${framework}/src/components/${item.id}/index.ts`,story=`apps/storybook-${framework}/src/stories/${item.id}.stories.ts`;
   write(native,`export const ${item.exportName} = 'native ${framework} ${item.id}';`);write(story,`export const LocalCase = { args: { componentId: '${item.id}' } };`);
   const row=baseline.coverage.find(record=>record.componentId===item.id&&record.framework===framework);
   const kinds=['typecheck','build','visual',...(framework==='lit'?['shadow-dom']:[]),...(framework==='qwik'?['lazy-first-event']:[]),...(framework==='angular'?['partial-apf',...(['native-select','date-input','radio-group','checkbox','switch','textarea','text-input','file-upload','range-slider','quantity-toggle'].includes(item.id)?['cva-form-reset']:[])]:[]),...(['accessible-media','visually-hidden'].includes(item.id)?['manual-accessibility']:[]),...(['favicon','image','identifier','header','footer','accessible-media'].includes(item.id)?['local-assets-provenance']:[])];
   const checks=kinds.map(kind=>{
    const reportPath=`evidence/${framework}/${item.id}/${kind}.json`,logPath=`evidence/${framework}/${item.id}/${kind}.log`;
    write(logPath,`Synthetic unit fixture ${kind} execution`);write(reportPath,{kind,framework,componentId:item.id,status:'passed',executed:true,exitCode:0,command:'synthetic unit evidence only',observations:['synthetic native assertion'],logPath});return {kind,reportPath};
   });
   const publicApi={packageName:`@unofficial-krds/${framework}`,exportName:item.exportName,packageJsonPath:`packages/${framework}/package.json`,entryPoint:'.',importSpecifier:`@unofficial-krds/${framework}`,runtimeEntryPath:`packages/${framework}/dist/index.js`,typesEntryPath:`packages/${framework}/dist/index.d.ts`,entrySourcePaths:[`packages/${framework}/src/index.ts`],artifactPaths:[`packages/${framework}/dist/index.js`,`packages/${framework}/dist/index.d.ts`],consumerWorkspacePath:`apps/fixture-${framework}/package.json`,consumerSourcePaths:[`apps/fixture-${framework}/src/public-api-${item.id}.ts`],reportPath:`evidence/${framework}/${item.id}/public-consumer.json`};
   write(publicApi.consumerSourcePaths[0],`import {${item.exportName}} from '${publicApi.importSpecifier}'; export const consumedValue = ${item.exportName};`);
   write(`evidence/${framework}/${item.id}/public-consumer.log`,'Synthetic public API execution and compile fixture only');
   write(publicApi.reportPath,{...publicApi,kind:'public-api-consumer',framework,componentId:item.id,status:'passed',executed:true,exitCode:0,runtimeImported:true,typesCompiled:true,command:'synthetic workspace consumer import and compile',observations:['named public value import executed and declaration consumed'],logPath:`evidence/${framework}/${item.id}/public-consumer.log`});
   row.status='verified';row.evidencePaths=[native,story,`evidence/${framework}/raw.json`];row.verification={componentId:item.id,framework,nativeRenderer:framework,profile:'stable',status:'accepted',candidate:false,reviewAcceptance:{status:'approved',independent:true,critical:0,important:0,componentId:item.id,framework,reviewer:'synthetic unit reviewer'},sourceSha256:item.source.sha256,specPath:item.specPath,reviewPath:'reviews/native.md',docsPath:`docs/${item.id}.md`,nativeSourcePaths:[native],storySourcePaths:[story],behavior:{caseIds:cases.filter(entry=>entry.componentId===item.id).map(entry=>entry.caseId),reportPath:`evidence/${framework}/behavior.json`,rawPath:`evidence/${framework}/raw.json`},stories:{storyIds:stories.filter(entry=>entry.componentId===item.id).map(entry=>entry.id),reportPath:`evidence/${framework}/stories.json`,screenshotDirectory:`evidence/${framework}/screenshots`},checks,publicApi};
  }
 }
 for(const row of baseline.coverage.filter(entry=>baseline.stableFrameworks.includes(entry.framework))){
  const proof=row.verification;const paths=new Set([proof.specPath,proof.docsPath,proof.reviewPath,...proof.nativeSourcePaths,...proof.storySourcePaths,proof.behavior.reportPath,proof.behavior.rawPath,proof.stories.reportPath,...proof.stories.storyIds.map(id=>`${proof.stories.screenshotDirectory}/${id}.png`),...proof.checks.flatMap(check=>[check.reportPath,read(check.reportPath).logPath]),proof.publicApi.packageJsonPath,...proof.publicApi.entrySourcePaths,...proof.publicApi.artifactPaths,proof.publicApi.consumerWorkspacePath,...proof.publicApi.consumerSourcePaths,proof.publicApi.reportPath,read(proof.publicApi.reportPath).logPath]);
  proof.fileHashes=Object.fromEntries([...paths].map(path=>[path,createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex')]));
 }
 write('catalog/coverage.json',baseline);
});
after(()=>rmSync(root,{recursive:true,force:true}));
test('accepts all 378 complete synthetic stable evidence pairs, preview remains separate',()=>{const result=mutateCoverage(()=>{});assert.deepEqual(result.errors,[]);assert.equal(result.acceptedPairs,378);});
test('fails closed for repository tracking without promotion',()=>{const result=mutateCoverage(value=>{for(const row of value.coverage)row.status='planned';});assert.ok(result.errors.length>0);assert.equal(result.acceptedPairs,0);});
test('rejects absent stable framework pair',()=>assert.ok(mutateCoverage(value=>value.coverage.splice(value.coverage.findIndex(row=>row.framework==='qwik'),1)).errors.some(error=>/every web component/.test(error))));
test('rejects wrapper or wrong framework',()=>assert.ok(mutateCoverage(value=>value.coverage[0].framework='react-wrapper').errors.length));
test('rejects component N/A exemption unsupported by frozen platform scope',()=>assert.ok(mutateCoverage(value=>value.coverage[0].status='not-applicable').errors.length));
test('rejects unsupported verified claim without native proof',()=>assert.ok(mutateCoverage(value=>delete value.coverage[0].verification).errors.some(error=>/verification metadata/.test(error))));
test('rejects candidate/preview metadata masquerading as stable',()=>assert.ok(mutateCoverage(value=>value.coverage[0].verification.candidate=true).errors.some(error=>/candidate\/preview/.test(error))));
test('rejects mismatched framework health even under a passing aggregate',()=>{
 const path='evidence/solid/raw.json',raw=read(path),changed=structuredClone(raw);const attachment=changed.suites[0].specs.find(spec=>spec.title==='solid masthead/outcome-01').tests[0].results[0].attachments[0];attachment.body=Buffer.from(JSON.stringify({healthy:true,framework:'react',fixture:{componentId:'masthead',caseId:'outcome-01'}})).toString('base64');write(path,changed);
 try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/raw native health/.test(error)));}finally{write(path,raw);}
});
test('rejects zero raw tests despite successful summary',()=>{
 const path='evidence/solid/raw.json',raw=read(path);write(path,{suites:[]});try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/zero raw executed/.test(error)));}finally{write(path,raw);}
});
test('rejects skipped raw outcome even when aggregate is passed',()=>{
 const path='evidence/solid/raw.json',raw=read(path),changed=structuredClone(raw);changed.suites[0].specs.find(spec=>spec.title==='solid masthead/outcome-01').tests[0].results[0].status='skipped';write(path,changed);try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/unskipped raw/.test(error)));}finally{write(path,raw);}
});
test('rejects missing native story case rather than accepting probes',()=>{
 const path='evidence/solid/stories.json',report=read(path),changed=structuredClone(report);changed.results[0].stories=changed.results[0].stories.filter(story=>story.id!=='krds-masthead--default-specimen');write(path,changed);try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/krds-masthead--default-specimen lacks/.test(error)));}finally{write(path,report);}
});
test('rejects foreign renderer source paths',()=>assert.ok(mutateCoverage(value=>value.coverage[0].verification.nativeSourcePaths=['packages/react/src/components/masthead/index.ts']).errors.some(error=>/same-framework native/.test(error))));
test('rejects absent framework-native specific evidence',()=>assert.ok(mutateCoverage(value=>{const row=value.coverage.find(row=>row.componentId==='masthead'&&row.framework==='qwik');row.verification.checks=row.verification.checks.filter(check=>check.kind!=='lazy-first-event');}).errors.some(error=>/lazy-first-event/.test(error))));
test('rejects unsafe or empty evidence paths',()=>assert.ok(mutateCoverage(value=>value.coverage[0].verification.docsPath='../outside.md').errors.some(error=>/documentation required/.test(error))));
test('rejects missing source bytes and stale source hash',()=>{const path='upstream/krds/raw/components/component_02_01.html',old=readFileSync(resolve(root,path));write(path,'tampered');try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/source bytes\/hash/.test(error)));}finally{write(path,old);}});
test('rejects unexecuted required framework check',()=>{
 const path='evidence/solid/masthead/typecheck.json',report=read(path);write(path,{...report,executed:false});try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/missing executed typecheck/.test(error)));}finally{write(path,report);}
});
test('rejects omitted required outcome list',()=>assert.ok(mutateCoverage(value=>value.coverage[0].verification.behavior.caseIds=[]).errors.some(error=>/every required outcome/.test(error))));

test('rejects self-declared or unresolved review approval',()=>assert.ok(mutateCoverage(value=>value.coverage[0].verification.reviewAcceptance.important=1).errors.some(error=>/zero-open-finding/.test(error))));

test('rejects missing independent native story tracking despite a passed render report',()=>{const path='catalog/full-catalog-story-coverage.json',tracker=read(path),changed=structuredClone(tracker);changed.entries[0].status='planned';write(path,changed);try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/native story tracking.*not verified/.test(error)));}finally{write(path,tracker);}});

test('rejects native source changed after accepted executed evidence',()=>{const path='packages/solid/src/components/masthead/index.ts',old=readFileSync(resolve(root,path));write(path,'changed after execution');try{assert.ok(mutateCoverage(()=>{}).errors.some(error=>/stale evidence hash/.test(error)));}finally{write(path,old);}});

test('additive staged package exports equal complete JSON data and preserve pilot selection',async()=>{
 const shared=await import('../packages/test-contracts/dist/index.js');
 assert.deepEqual(shared.fullCatalogStoryCases,load('catalog/full-catalog-stories.json').cases);
 assert.deepEqual(shared.fullCatalogScenarios,load('catalog/full-catalog-scenarios.json').cases);
 assert.equal(shared.pilotScenarios.length,10);assert.equal(shared.storyStateCases.length,6);
});

function withFileHealth({includeHash=true,changeAfterHash=false},inspect){
 const rawPath='evidence/solid/raw.json',raw=read(rawPath),changed=structuredClone(raw),healthPath='evidence/solid/health/masthead-01.json';
 const attachment=changed.suites[0].specs.find(spec=>spec.title==='solid masthead/outcome-01').tests[0].results[0].attachments[0];
 write(healthPath,{healthy:true,framework:'solid',fixture:{componentId:'masthead',caseId:'outcome-01'}});delete attachment.body;attachment.path='health/masthead-01.json';write(rawPath,changed);
 const healthHash=createHash('sha256').update(readFileSync(resolve(root,healthPath))).digest('hex');
 if(changeAfterHash)write(healthPath,{healthy:true,framework:'solid',fixture:{componentId:'masthead',caseId:'outcome-01'},changedAfterAcceptance:true});
 try{return mutateCoverage(value=>{for(const row of value.coverage.filter(row=>row.framework==='solid')){row.verification.fileHashes[rawPath]=createHash('sha256').update(readFileSync(resolve(root,rawPath))).digest('hex');if(includeHash)row.verification.fileHashes[healthPath]=healthHash;}inspect?.(value);});}finally{write(rawPath,raw);}
}
test('accepts correctly hash-bound file-backed native health',()=>assert.deepEqual(withFileHealth({}).errors,[]));
test('rejects file-backed native health without its accepted hash',()=>assert.ok(withFileHealth({includeHash:false}).errors.some(error=>/native attachment.*missing\/stale.*hash/.test(error))));
test('rejects changed file-backed native health before trusting its valid JSON',()=>assert.ok(withFileHealth({changeAfterHash:true}).errors.some(error=>/native attachment.*missing\/stale.*hash/.test(error))));
test('rejects verified internal component with no public API proof',()=>assert.ok(mutateCoverage(value=>delete value.coverage[0].verification.publicApi).errors.some(error=>/public API/.test(error))));
test('rejects a component removed from built public exports despite stale passed consumer metadata',()=>{
 const path='packages/solid/dist/index.js',old=readFileSync(resolve(root,path));write(path,"/* export const Masthead = 'comment only'; */\n"+old.toString().replace(/^export const Masthead =.*\n/m,''));
 try{const result=mutateCoverage(value=>{for(const row of value.coverage.filter(row=>row.framework==='solid'))row.verification.fileHashes[path]=createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex');});assert.ok(result.errors.some(error=>/public runtime export.*Masthead/.test(error)));}finally{write(path,old);}
});
test('rejects public consumer that bypasses package exports with an internal source import',()=>{
 const path='apps/fixture-solid/src/public-api-masthead.ts',old=readFileSync(resolve(root,path));write(path,"import {Masthead} from '../../../packages/solid/src/components/masthead/index.js'; export const consumedValue=Masthead;");
 try{const result=mutateCoverage(value=>value.coverage[0].verification.fileHashes[path]=createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex'));assert.ok(result.errors.some(error=>/named public value import/.test(error)));}finally{write(path,old);}
});

test('rejects a public name whose package entry point is absent from actual exports',()=>{
 const path='packages/solid/package.json',pkg=read(path);write(path,{...pkg,exports:{}});
 try{assert.ok(mutateCoverage(value=>{for(const row of value.coverage.filter(row=>row.framework==='solid'))row.verification.fileHashes[path]=createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex');}).errors.some(error=>/actual package exports/.test(error)));}finally{write(path,pkg);}
});
test('rejects an unexecuted public consumer compile even when native internal files build',()=>{
 const path='evidence/solid/masthead/public-consumer.json',report=read(path);write(path,{...report,typesCompiled:false});
 try{assert.ok(mutateCoverage(value=>value.coverage[0].verification.fileHashes[path]=createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex')).errors.some(error=>/actual executed public import/.test(error)));}finally{write(path,report);}
});
test('accepts actual hash-bound built JS and declaration re-export chains',()=>{
 const js='packages/solid/dist/index.js',types='packages/solid/dist/index.d.ts',oldJs=readFileSync(resolve(root,js)),oldTypes=readFileSync(resolve(root,types));
 const linkedJs='packages/solid/dist/public-masthead.js',linkedTypes='packages/solid/dist/public-masthead.d.ts';write(linkedJs,"export const Masthead='masthead';");write(linkedTypes,'export declare const Masthead: string;');write(js,oldJs.toString().replace(/^export const Masthead =.*\n/m,"export {Masthead} from './public-masthead.js';\n"));write(types,oldTypes.toString().replace(/^export declare const Masthead:.*\n/m,"export {Masthead} from './public-masthead.js';\n"));
 try{assert.deepEqual(mutateCoverage(value=>{for(const row of value.coverage.filter(row=>row.framework==='solid'))for(const path of [js,types,linkedJs,linkedTypes])row.verification.fileHashes[path]=createHash('sha256').update(readFileSync(resolve(root,path))).digest('hex');}).errors,[]);}finally{write(js,oldJs);write(types,oldTypes);}
});
