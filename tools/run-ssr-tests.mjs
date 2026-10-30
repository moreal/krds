#!/usr/bin/env node
import '../tools/check-node.mjs';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {root,snapshot,sha256} from '../tests/compatibility/evidence.mjs';
import {collectStageEvidence} from '../tests/compatibility/stage-evidence.mjs';
import {prepareProductionEvidence} from '../tests/ssr/qwik/production-evidence.mjs';
const stable=['react','solid','svelte','vue','lit','qwik','angular'];
const options={frameworks:[],browsers:'chromium,firefox,webkit',timezones:'UTC,Asia/Seoul,America/Los_Angeles'};
for(let i=2;i<process.argv.length;i++){const arg=process.argv[i];if(arg==='--all-stable')options.frameworks.push(...stable);else if(['--framework','--browsers','--timezones'].includes(arg)){const value=process.argv[++i];if(!value||value.startsWith('--'))throw new Error(`Missing ${arg}`);if(arg==='--framework')options.frameworks.push(...value.split(','));else options[arg.slice(2)]=value;}else throw new Error(`Unknown argument ${arg}`);}
options.frameworks=[...new Set(options.frameworks)];if(!options.frameworks.length)throw new Error('Select --all-stable or --framework; empty SSR suites never pass');for(const framework of options.frameworks)if(![...stable,'solid-next'].includes(framework))throw new Error(`Unknown framework ${framework}`);for(const name of options.browsers.split(','))if(!['chromium','firefox','webkit'].includes(name))throw new Error(`Unknown browser ${name}`);for(const zone of options.timezones.split(','))new Intl.DateTimeFormat('en',{timeZone:zone});
const directory=resolve(process.env.KRDS_SSR_REPORT_DIR??join(root,'test-results/t13/ssr-runs',new Date().toISOString().replaceAll(':','-')));await mkdir(directory,{recursive:true});
const before=await snapshot(options.frameworks);await writeFile(join(directory,'source-before.json'),JSON.stringify(before,null,2));const stages=[];const retainedArtifactPaths=new Set();
async function run(framework,name,args){const file=join(directory,`${framework}-${name}.log`);const chunks=[];const env={...process.env,KRDS_BROWSERS:options.browsers,KRDS_TIMEZONES:options.timezones,KRDS_SSR_OUTPUT:join(directory,framework),KRDS_SSR_SOURCE_SHA256:before.sha256,NG_CLI_ANALYTICS:'false'};const result=await new Promise(resolveRun=>{const child=spawn(process.execPath,args,{cwd:root,env,stdio:['ignore','pipe','pipe']});for(const stream of[child.stdout,child.stderr])stream.on('data',bytes=>chunks.push(bytes));child.on('error',error=>resolveRun({code:1,error:String(error)}));child.on('close',(code,signal)=>resolveRun({code,signal}));});const log=Buffer.concat(chunks);await writeFile(file,log);let artifactEvidence,artifactError;try{if(name==='production-build'&&result.code===0)await prepareProductionEvidence(join(directory,framework),'production-build',before.sha256);artifactEvidence=await collectStageEvidence(framework,name,join(directory,framework),before.sha256);for(const record of[...artifactEvidence.files,...artifactEvidence.metadata])retainedArtifactPaths.add(record.path);}catch(error){artifactError=String(error);}const status=result.code===0&&!artifactError?'passed':'failed';stages.push({framework,name,command:[process.execPath,...args],...result,status,log:file,logSha256:sha256(log),artifactEvidence,artifactError});console.log(`${status==='passed'?'PASS':'FAIL'} ${framework} ${name}: ${file}${artifactError?` (${artifactError})`:''}`);return status==='passed';}
for(const framework of options.frameworks){
 if(['react','solid','svelte','vue','lit','solid-next'].includes(framework))await run(framework,'native-server-hydration',['tests/ssr/native.mjs',framework]);
 else if(framework==='qwik'){
  await run(framework,'production-build',['tools/yarn.mjs','workspace','@unofficial-krds/fixture-qwik','build:local']);
  await run(framework,'precise-resume',['tests/ssr/qwik/resume.mjs']);
  await run(framework,'cross-browser-resume',['tests/ssr/qwik/cross-browser.mjs']);
 }else if(framework==='angular'){
  await run(framework,'partial-apf-ssr',['tests/ssr/angular/verify.mjs']);
  await run(framework,'native-hydration',['tests/ssr/angular/hydration.mjs']);
 }
}
const artifacts=await snapshot(options.frameworks,{outputs:true,artifactRoots:[...retainedArtifactPaths]});await writeFile(join(directory,'tested-artifacts.json'),JSON.stringify(artifacts,null,2));const after=await snapshot(options.frameworks);await writeFile(join(directory,'source-after.json'),JSON.stringify(after,null,2));const changed=before.sha256!==after.sha256;const passed=stages.length>0&&stages.every(stage=>stage.status==='passed')&&!changed;
const result={schemaVersion:1,kind:'native-SSR-hydration-matrix',status:passed?'passed':'failed',sourceChangedDuringRun:changed,sourceBeforeSha256:before.sha256,sourceAfterSha256:after.sha256,testedArtifactsSha256:artifacts.sha256,node:process.versions.node,platform:process.platform,arch:process.arch,options,stages,publicationAuthorized:false,scope:'Six-pilot SSR/hydration or resumability integration; catalog, outside installs, manual accessibility and final frozen source approval are independent gates.'};await writeFile(join(directory,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,sourceChangedDuringRun:changed,report:join(directory,'results.json')}));if(!passed)process.exitCode=1;
