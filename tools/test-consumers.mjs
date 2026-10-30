#!/usr/bin/env node
import {copyFile,mkdir,mkdtemp,readFile,writeFile,realpath,access,readdir,link} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {createRequire} from 'node:module';
import {root,json,config,node,yarn,run,hash,files,fingerprint,requireOutside,auditBundleModules} from '../tests/consumers/lib.mjs';
import {scopeFrameworkIds,selectCandidates,artifactSetHash,sourceSnapshot} from '../tests/consumers/scopes.mjs';
import {captureStep,yarnCommand,captureConsumerReceipt,evidenceRef,harnessSnapshot} from '../tests/consumers/evidence.mjs';
import {inspect} from './inspect-tarballs.mjs';
import {ssrDriver,auditOutputs,emitLegalOutput,validateLegalOutput} from '../tests/consumers/outputs.mjs';
import {template} from '../tests/consumers/templates/index.mjs';
const scope=process.argv.find(arg=>arg.startsWith('--scope='))?.split('=')[1]??'all';
const debug=process.argv.includes('--debug-snapshot');
const inventoryArg=process.argv.find(arg=>arg.startsWith('--inventory='))?.slice(12);const caseLabel=process.argv.find(arg=>arg.startsWith('--case='))?.slice(7);if((inventoryArg||caseLabel)&&!debug)throw new Error('Alternate inventories/cases are debug-only');if(caseLabel&&!/^[a-z0-9-]+$/u.test(caseLabel))throw new Error('Invalid debug case label');
const manifestFile=inventoryArg?resolve(root,inventoryArg):join(root,'artifacts',debug?'debug-inventory.json':scope==='all'?'manifest.json':`manifest-${scope}.json`);if(!manifestFile.startsWith(join(root,'artifacts')+'/'))throw new Error('Debug inventory must be in artifacts');
const manifest=await json(manifestFile);
await inspect(manifest,{debug,scope});
const manifestSha256=hash(await readFile(manifestFile));
const frameworks=await json(join(root,'compatibility/frameworks.json'));
const filter=process.argv.find(arg=>arg.startsWith('--framework='))?.split('=')[1];
const rows=frameworks.frameworks.filter(framework=>scopeFrameworkIds(scope).includes(framework.id)&&(!filter||framework.id===filter)).flatMap(framework=>framework.id==='solid-next'?[{framework,profile:'exact-rc19'}]:['minimum','current'].map(profile=>({framework,profile})));
if(!rows.length)throw new Error(`Unknown framework ${filter}`);
const output=join(root,'artifacts/consumers',...(caseLabel?[caseLabel]:[]));await mkdir(output,{recursive:true});
const cache=await mkdtemp('/private/tmp/krds-consumer-cache-');
for(const filename of await readdir(join(root,'.yarn/cache'))){if(!filename.endsWith('.zip'))continue;const target=join(cache,filename.replace(/-[0-9a-f]{10}\.zip$/u,'-10c0.zip'));try{await link(join(root,'.yarn/cache',filename),target);}catch(error){if(error.code==='EEXIST')continue;await copyFile(join(root,'.yarn/cache',filename),target);}}
const producerSnapshot=await harnessSnapshot();
const records=[];
for(const {framework,profile} of rows){
 const id=framework.id,label=`${id}-${profile}`;const directory=await mkdtemp('/private/tmp/krds-consumer-');await requireOutside(directory);
 const record={schemaVersion:2,id,profile,harnessSnapshot:producerSnapshot,scopeBindings:Object.fromEntries(Object.entries(manifest.scopes??{}).map(([scope,binding])=>[scope,binding.artifactSetSha256])),steps:[],status:'running',directory,artifactManifestSha256:manifestSha256,startedAt:new Date().toISOString(),checks:{},logs:[]};
 let receiptContext;
 try{
  const source=template(id), pins={...framework.pins};
  // Both support bounds are the exact versions frozen in official registry evidence.
  // Equal bounds are recorded explicitly; current is never resolved via an unstable dist-tag.
  const officialEvidence=[];
  for(const [name,version] of Object.entries(pins)){
   const path=join(root,'upstream/krds/raw/npm',`${name.replaceAll('/','__')}.json`);
   try{const evidence=await json(path);if(evidence.version===version)officialEvidence.push({name,version,path:relative(root,path),sha256:hash(await readFile(path))});}catch(error){if(error.code!=='ENOENT')throw error;}
  }
  const devDependencies={...pins,typescript:config.sharedPins.typescript,'@types/node':config.sharedPins['@types/node'],playwright:config.environments[framework.toolchain].pins.playwright};
  if(id!=='angular')devDependencies.vite=config.environments[framework.toolchain].pins.vite;
  if(id==='vue')devDependencies['@vue/server-renderer']=pins.vue;
  const adapter=`@unofficial-krds/${id}`;
  let actual;const dependencies={};const resolutions={};const expectedInternal=new Set([adapter,'@unofficial-krds/styles','@unofficial-krds/tokens','@unofficial-krds/contracts','@unofficial-krds/assets','@unofficial-krds/fonts']);
  await mkdir(join(directory,'candidates'));
  for(const candidate of manifest.packages.filter(candidate=>expectedInternal.has(candidate.name))){const filename=candidate.tarball.split('/').at(-1);await copyFile(join(root,candidate.tarball),join(directory,'candidates',filename));resolutions[candidate.name]=`file:./candidates/${filename}`;if(expectedInternal.has(candidate.name))dependencies[candidate.name]=`file:./candidates/${filename}`;}
  const pkg={name:`krds-independent-${label}`,version:'1.0.0',private:true,type:'module',packageManager:`yarn@${config.packageManager.version}`,dependencies,devDependencies,resolutions};
  await writeFile(join(directory,'package.json'),JSON.stringify(pkg,null,2)+'\n');
  await writeFile(join(directory,'.yarnrc.yml'),`nodeLinker: pnpm\nenableGlobalCache: false\ncacheFolder: ${JSON.stringify(cache)}\nglobalFolder: ${JSON.stringify(join(cache,"global"))}\nenableNetwork: false\nenableMirror: false\nenableScripts: false\n`);
  for(const [name,content] of Object.entries(source.files)){await mkdir(resolve(directory,name,'..'),{recursive:true});await writeFile(join(directory,name),content);}
  for(const name of ['resolve.mjs','browser.mjs','bundle-evidence.mjs'])await copyFile(join(root,'tests/consumers/templates',name),join(directory,name));
  if(id!=='angular'){
   const path=join(directory,'vite.config.ts');let content=await readFile(path,'utf8');content=`import {evidence} from './bundle-evidence.mjs';\n${content}`;content=content.replace('plugins:[','plugins:[evidence(),');await writeFile(path,content);
   await writeFile(join(directory,'src/evidence.d.ts'),"declare module '*.mjs';\ndeclare module '*.css';\n");
  }
  const rootLock=await readFile(join(root,'yarn.lock'),'utf8');
  const seed=rootLock.split(/\n\n/u).filter(block=>!/^  resolution: .*@workspace:/mu.test(block)).join('\n\n');
  await writeFile(join(directory,'yarn.lock'),seed);record.resolutionSeed={source:'selected root non-workspace npm resolutions only',sha256:hash(rootLock),policy:'Consumer Yarn install rewrites/prunes its own lockfile; no workspace locators may survive.'};
  async function step(name,args){const captured=await captureStep(name,yarnCommand(args,directory),{output:join(output,`${label}.steps`,name)});record.steps.push(captured);record.logs.push(captured.log.path);await copyFile(join(root,captured.log.path),join(output,`${label}.${name}.log`));if(captured.exitCode!==0)throw new Error(`${name} actual execution failed (${captured.exitCode}); ${captured.log.path}`);record.checks[name]='passed';return (await readFile(join(root,captured.stdout.path))).toString();}
  await step('install',['install']);
  const lock=await readFile(join(directory,'yarn.lock'));if(!lock.length)throw new Error('Missing independent Yarn lockfile');record.lockfileSha256=hash(lock);if(/resolution:.*(?:@unofficial-krds\/[^@]+@workspace:|\/Users\/moreal\/github)/u.test(lock.toString()))throw new Error('Repository workspace/source locator survived consumer lock pruning');
  const requested={...Object.fromEntries(Object.entries(devDependencies)),...Object.fromEntries(manifest.packages.filter(candidate=>expectedInternal.has(candidate.name)).map(candidate=>[candidate.name,candidate.version]))};
  await writeFile(join(directory,'resolution-request.json'),JSON.stringify(requested));
  const resolved=await captureStep('resolve',{executable:node,args:[join(directory,'resolve.mjs')],cwd:directory},{output:join(output,`${label}.steps`,'resolve')});record.steps.push(resolved);if(resolved.exitCode!==0)throw new Error('Actual runtime/compiler resolution failed');actual=JSON.parse(await readFile(join(root,resolved.stdout.path),'utf8'));record.resolutions=actual;record.officialEvidence=officialEvidence;receiptContext={directory,output:join(output,`${label}.receipt`),manifest,id,expectedPins:devDependencies,resolutions:actual};
  for(const candidate of manifest.packages.filter(candidate=>expectedInternal.has(candidate.name))){
   const installed=actual.find(entry=>entry.name===candidate.name);if(!installed)throw new Error(`Missing installed candidate ${candidate.name}`);
   for(const file of candidate.files){const bytes=await readFile(join(installed.location,file.path));if(hash(bytes)!==file.sha256)throw new Error(`Installed candidate bytes differ: ${candidate.name}/${file.path}`);}
   if(!lock.toString().includes(`candidates/${candidate.tarball.split('/').at(-1)}`))throw new Error(`Lockfile does not identify candidate tarball ${candidate.name}`);
  }
  record.checks['candidate-bytes-and-runtime-compiler-resolution']='passed';
  await step('types',source.typecheck);
  if(id==='angular'){
   await step('build',['exec','ng','build','consumer','--stats-json']);
   const installed=actual.find(entry=>entry.name===adapter);const js=(await files(installed.location)).filter(path=>path.endsWith('.mjs'));const text=(await Promise.all(js.map(path=>readFile(join(installed.location,path),'utf8')))).join('\n');if(!text.includes('ɵɵngDeclareComponent'))throw new Error('Angular package is not partial APF');record.checks['angular-partial-apf-aot']='passed';
   await writeFile(join(directory,'ssr-check.mjs'),ssrDriver(id));
   await step('ssr',['exec','node','ssr-check.mjs']);record.checks['angular-reactive-form-apf-entry']='compiled';

  }else{
   await step('build',['exec','vite','build']);
   await step('ssr-build',['exec','vite','build','--ssr','src/ssr.tsx','--outDir','dist/server']);
   const entry=(await files(join(directory,'dist/server'))).find(path=>/^(ssr|entry\.ssr)\.m?js$/u.test(path));if(!entry)throw new Error('Missing independent SSR bundle');
   receiptContext.ssrEntry=entry;await writeFile(join(directory,'ssr-run.mjs'),ssrDriver(id,entry));
   try{await step('ssr',['exec','node','ssr-run.mjs']);}catch(error){record.ssrError=error.message;}
  }
  const bundleAudit=await auditOutputs(directory,id);record.bundle=bundleAudit;record.checks['native-client-server-bundle-isolation']='passed';
  const browserDir=id==='angular'?'dist/browser':'dist';
  const legal=await emitLegalOutput({directory,id,manifest,identities:actual,bundleAudit});await validateLegalOutput(directory,legal,{id,manifest,identities:actual,bundleAudit});receiptContext.outputClosure={legal,bundleAudit,ssrEntry:receiptContext.ssrEntry??null};record.checks['complete-minified-original-legal-output']='passed';
  await step('browser',['exec','node','browser.mjs',browserDir]);
  const ssrArtifact=join(output,`${label}.ssr.html`);await copyFile(join(directory,'ssr.html'),ssrArtifact);record.ssrArtifact=await evidenceRef(ssrArtifact);
  record.receipt=await captureConsumerReceipt(receiptContext);
  record.browser=JSON.parse(await readFile(join(output,`${label}.browser.log`),'utf8'));record.status=record.ssrError?'failed':debug?'passed-debug-only-source-not-accepted':'passed-development-snapshot';if(record.ssrError)record.error=record.ssrError;
 }catch(error){record.status='failed';record.error=error.message;console.error(`${label}: ${error.message}`);}
 if(receiptContext&&!record.receipt){try{record.receipt=await captureConsumerReceipt(receiptContext);}catch(error){record.receiptError=error.message;}}
 record.finishedAt=new Date().toISOString();records.push(record);await writeFile(join(output,`${label}.json`),JSON.stringify(record,null,2)+'\n');console.log(`${label}: ${record.status}`);
}
const scopes={};for(const channel of scope==='all'?['stable','preview','all']:[scope]){const binding=manifest.scopes?.[channel];if(binding)scopes[channel]={artifactSetSha256:binding.artifactSetSha256,sourceFingerprint:binding.sourceFingerprint};}
async function saveReport(channel,selectedRows){const binding=scopes[channel];const current=debug?false:binding?.sourceFingerprint===(await sourceSnapshot({scope:channel})).sha256;const required=scopeFrameworkIds(channel).length===1?1:channel==='stable'?14:15;const report={schemaVersion:2,executionMode:'native-consumers',createdAt:new Date().toISOString(),finishedAt:new Date().toISOString(),harnessSnapshot:producerSnapshot,requiredRowCount:required,executedRowCount:selectedRows.length,scope:channel,debugOnly:debug,status:debug?'debug-only-source-not-accepted':selectedRows.length===required&&selectedRows.every(row=>row.status==='passed-development-snapshot')&&current?'passed-development-snapshot':'failed',releaseAuthorized:false,artifactManifestSha256:manifestSha256,scopes,sourceFingerprintCurrent:current,rows:selectedRows};const filename=debug?(filter?`debug-consumer-results-${filter}${caseLabel?'-'+caseLabel:''}.json`:`debug-consumer-results${channel==='all'?'':'-'+channel}.json`):filter?`consumer-results-${filter}.json`:`consumer-results${channel==='all'?'':'-'+channel}.json`;await writeFile(join(root,'artifacts',filename),JSON.stringify(report,null,2)+'\n');return report;}
// Refresh every executed channel, including failed rows, so an older scoped pass
// cannot mask a newer relevant all-run failure on the same candidate.
if(scope==='all'&&!filter)for(const channel of ['stable','preview'])await saveReport(channel,records.filter(row=>scopeFrameworkIds(channel).includes(row.id)));
const report=await saveReport(scope,records);if(report.status==='failed'||records.some(row=>row.status==='failed'))process.exitCode=1;
