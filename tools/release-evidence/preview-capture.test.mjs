/** Synthetic protocol children only: these tests never claim real native acceptance. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,writeFile,readFile,rm,symlink} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import * as api from './producers.mjs';
import {assemble} from './assemble.mjs';
const repository=resolve(import.meta.dirname,'../..');
const candidate={sourceCommit:'a'.repeat(40),lockfileSha256:'b'.repeat(64)};
const scopes={preview:{sourceFingerprint:'c'.repeat(64),artifactSetSha256:'d'.repeat(64)}};
async function fixture(mode='passed'){
 const root=await mkdtemp('/private/tmp/krds-preview-capture-unit-');
 for(const path of ['tools/release-evidence','tests/consumers','compatibility','catalog'])await mkdir(join(root,path),{recursive:true});
 await cp(join(repository,'tools/release-evidence'),join(root,'tools/release-evidence'),{recursive:true});
 await cp(join(repository,'tests/consumers'),join(root,'tests/consumers'),{recursive:true});
 await cp(join(repository,'compatibility/toolchain.json'),join(root,'compatibility/toolchain.json'));
 await cp(join(repository,'catalog/fixture-cases.json'),join(root,'catalog/fixture-cases.json'));
 await symlink(join(repository,'node_modules'),join(root,'node_modules'),'dir');
 await writeFile(join(root,'package.json'),'{"type":"module"}');
 await mkdir(join(root,'apps/fixture-solid-next/dist'),{recursive:true});
 await writeFile(join(root,'apps/fixture-solid-next/dist/index.html'),'Synthetic protocol fixture only');
 // A real selected-Node child verifies the unchanged enumerated argv and writes
 // complete runner-shaped outputs. It substitutes only the expensive browser boundary.
 await writeFile(join(root,'tools/yarn.mjs'),`import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
const root=process.cwd(),mode=${JSON.stringify(mode)};
if(['typecheck','build:local'].includes(process.argv.at(-1)))process.exit(0);
assert.deepEqual(process.argv.slice(2),['test:contract','--framework','solid-next']);
const framework=mode==='wrong-framework'?'vue':'solid-next';
const cases=JSON.parse(await readFile(join(root,'catalog/fixture-cases.json'))).cases;
const directory=join(root,'test-results/t05',mode==='stale'?'contract-old':'contract-'+randomUUID());
await mkdir(join(directory,framework),{recursive:true});
const titles=cases.map(row=>framework+' '+row.componentId+'/'+row.caseId);
const raw={suites:[{specs:titles.map((title,index)=>({title,tests:[{expectedStatus:'passed',results:[{status:'passed',attachments:[{name:'native-health.json',body:Buffer.from(JSON.stringify({healthy:mode!=='bad-health',framework,fixture:cases[index]})).toString('base64')}]}]}]}))}]};
const bytes=await readFile(join(root,'apps/fixture-solid-next/dist/index.html'));
const report={kind:'contract',mode:'pilot',results:[{framework,status:'passed',exitCode:0,artifactSnapshot:{stableVerified:true,files:[{path:'/index.html',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}]},tests:titles.map(title=>({title,status:'passed',classification:'passed',nativeHealth:true}))}]};
await writeFile(join(directory,framework,'playwright.json'),JSON.stringify(raw));
await writeFile(join(directory,framework,'command.log'),'Synthetic selected-Node child; no native browser execution');
await writeFile(join(directory,'report.json'),JSON.stringify(report));
if(mode!=='missing-report')console.log('Report: '+join(directory,'report.json'));
if(mode==='duplicate-report')console.log('Report: '+join(directory,'report.json'));
if(mode==='failed'){console.error('Actual synthetic child failure');process.exitCode=7;}
`);
 if(mode==='stale')await mkdir(join(root,'test-results/t05/contract-old'),{recursive:true});
 const {record}=await import(pathToFileURL(join(root,'tools/release-evidence/record.mjs')));
 const run=async(recipeName='preview-contracts',extra={})=>{const row=await record({recipeName,candidate,scopes,output:`test-results/${recipeName}`,execute:true,...extra});await writeFile(join(root,`test-results/${recipeName}/record.json`),JSON.stringify(row));return {...row,captureRef:await api.ref(root,`test-results/${recipeName}/record.json`)};};
 return {root,run,close:()=>rm(root,{recursive:true,force:true})};
}
async function inspect(f,capture){
 const types=await f.run('preview-types'),build=await f.run('preview-build');
 const report=assemble('preview',candidate,scopes,[types,build,capture]);
 await writeFile(join(f.root,'test-results/preview.json'),JSON.stringify(report));
 return api.inspectReleaseEvidence(f.root,'preview',{schemaVersion:3,reports:{preview:await api.ref(f.root,'test-results/preview.json')}},candidate,scopes);
}
test('preview recorder binds fresh ten-case raw output from its exact same invocation and assembles it',async()=>{
 const f=await fixture();try{const capture=await f.run();assert.equal(capture.execution.exitCode,0);assert.equal(capture.outputError,undefined);assert.match(capture.result?.path??'',/outputs\/current\/solid-next\/playwright.json$/u);assert.equal(capture.sourceUnchanged,true);assert.equal(capture.releaseAccepted,false);assert.equal(capture.outputs.files.length,3);assert.equal((await inspect(f,capture)).status,'passed');}finally{await f.close();}
});
test('preview rejects explicit result substitution and a foreign framework before execution',async()=>{
 const f=await fixture();try{await assert.rejects(f.run('preview-contracts',{resultPath:'historical.json'}),/--result/u);await assert.rejects(f.run('preview-contracts',{framework:'vue'}),/framework/u);}finally{await f.close();}
});
for(const mode of ['stale','missing-report','duplicate-report'])test(`preview ${mode} discovery fails closed`,async()=>{
 const f=await fixture(mode);try{const capture=await f.run();assert.equal(capture.result,null);assert.ok(capture.outputError);assert.notEqual((await inspect(f,capture)).status,'passed');}finally{await f.close();}
});
for(const mode of ['wrong-framework','bad-health','failed'])test(`preview retains ${mode} outputs without accepting them`,async()=>{
 const f=await fixture(mode);try{const capture=await f.run();assert.ok(capture.outputs);assert.equal(capture.releaseAccepted,false);if(mode==='failed'){assert.equal(capture.execution.exitCode,7);assert.match((await readFile(join(f.root,capture.execution.stderr.path))).toString(),/Actual synthetic child failure/u);}assert.notEqual((await inspect(f,capture)).status,'passed');}finally{await f.close();}
});
for(const target of ['raw','summary','inventory','stdout','execution','source','substitution'])test(`preview rejects altered ${target} binding`,async()=>{
 const f=await fixture();try{const capture=await f.run();assert.ok(capture.result,'fresh raw binding is required before mutation');
 if(target==='raw')await writeFile(join(f.root,capture.result.path),'{}');
 if(target==='summary')await writeFile(join(f.root,capture.outputs.retainedDirectory,'report.json'),'{}');
 if(target==='inventory')await writeFile(join(f.root,capture.outputs.retainedDirectory,'extra.txt'),'unretained bytes');
 if(target==='stdout')await writeFile(join(f.root,capture.execution.stdout.path),'Report: foreign/report.json\n');
 if(target==='execution')capture.execution.command.args.push('--probe');
 if(target==='source'){await writeFile(join(f.root,'tools/yarn.mjs'),'changed source');await assert.rejects(inspect(f,capture),/Recorded source candidates differ/u);return;}
 if(target==='substitution'){await writeFile(join(f.root,'test-results/historical.json'),await readFile(join(f.root,capture.result.path)));capture.result=await api.ref(f.root,'test-results/historical.json');}
 assert.notEqual((await inspect(f,capture)).status,'passed');}finally{await f.close();}
});
