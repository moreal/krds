#!/usr/bin/env node
/** Serial release producer wiring. Missing human/host facts are never manufactured. */
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {assertNode, git, root} from './common.mjs';
import {assertVerifySource} from './check-release-phase.mjs';
import {stable, hash, outputRoots, validateInventory, inspectReleaseEvidence} from '../release-evidence/producers.mjs';
import {captureStep, nodeCommand} from '../release-evidence/receipts.mjs';
import {verifyRelease} from '../verify-release.mjs';

const kinds=['ci','preview','patterns','documentation','manualAccessibility','independentReview'];
export function releaseSteps({directory,ssrDirectory,extras={}}){
  const seed=`${directory}/source-candidate.json`,candidate=`${directory}/candidate-verification.json`,manifest='artifacts/manifest.json',steps=[],records=Object.fromEntries(kinds.map(kind=>[kind,[]]));
  const command=(id,args,extra={})=>steps.push({id,args,...extra});
  function record(recipe,kind='ci',framework){
    const id=recipe==='patterns'?`patterns-${framework}`:recipe,output=`${directory}/${id.replaceAll(':','-')}`;
    command(id,['tools/release-evidence/record.mjs','--recipe',recipe,...(framework?['--framework',framework]:[]),'--candidate',kind==='ci'&&recipe.split(':').length===2?seed:candidate,...(kind==='ci'?[]:['--manifest',manifest]),'--output',output,...(framework==='qwik'?['--artifact',`${ssrDirectory}-stable/qwik/production-inputs`]:[]),'--execute'],{recipe});
    records[kind].push(`${output}/record.json`);
  }
  record('ci:install');
  command('toolchain',['tools/ci/check-toolchain.mjs','--installed']);
  command('phase',['tools/ci/check-release-phase.mjs','--phase','verify-candidate']);
  command('gates',['tools/ci/required-gates.mjs']);
  command('browsers',['tools/yarn.mjs','exec','playwright','install','--with-deps','chromium','firefox','webkit']);
  for(const recipe of ['workspace','catalog','coverage','selection','affected','targets','cache'])record(`ci:${recipe}`);
  command('compatibility',['tools/yarn.mjs','verify:compatibility']);
  command('ssr-stable',['tools/yarn.mjs','test:ssr'],{environment:{KRDS_SSR_REPORT_DIR:`${ssrDirectory}-stable`}});
  command('ssr-preview',['tools/run-ssr-tests.mjs','--framework','solid-next'],{environment:{KRDS_SSR_REPORT_DIR:`${ssrDirectory}-preview`}});
  command('licenses',['tools/yarn.mjs','verify:licenses']);
  command('pack',['tools/yarn.mjs','pack:all','--build']);
  command('tarballs',['tools/yarn.mjs','inspect:tarballs']);
  command('candidate',[],{action:'candidate'});
  for(const framework of stable)for(const tool of ['contracts','stories'])for(const mode of ['pilot','catalog'])record(`ci:${tool}:${framework}:${mode}`);
  for(const framework of stable.filter(id=>id!=='lit'))record(`ci:siheom:${framework}`);
  for(const browser of ['firefox','webkit'])for(const tool of ['contract','stories'])for(const catalog of [false,true])command(`${tool}-${browser}-${catalog?'catalog':'pilot'}`,['tools/yarn.mjs',`test:${tool}`,'--all-stable',...(catalog?['--catalog']:[]),'--browser',browser]);
  for(const framework of stable)record('patterns','patterns',framework);
  for(const recipe of ['docs-tests','docs-browser'])record(recipe,'documentation');
  for(const recipe of ['preview-types','preview-build','preview-contracts'])record(recipe,'preview');
  command('consumers',['tools/yarn.mjs','test:consumers']);
  command('final-output-check',[],{action:'final-output-check'});
  for(const kind of kinds)command(`assemble-${kind}`,['tools/release-evidence/assemble.mjs','--kind',kind,'--candidate',candidate,'--manifest',manifest,...records[kind].flatMap(path=>['--record',path]),...(extras[kind]?['--extras',extras[kind]]:[]),'--output',`${directory}/assembled-${kind}`],{kind});
  // Ordering alone is not a dependency: acceptance failures must not suppress other producers.
  const dependencies={
    'ci:targets':['ci:selection'],'ci:cache':['ci:selection'],
    'ssr-stable':['browsers'],'ssr-preview':['browsers'],
    tarballs:['pack'],candidate:['pack'],consumers:['pack'],
    'final-output-check':['candidate','ci:targets','compatibility','ssr-stable','ssr-preview'],
  };
  for(const step of steps){
    step.dependsOn=dependencies[step.id]??[];
    if(['ci:install','toolchain','phase','candidate','final-output-check'].includes(step.id))step.stopOnFailure=true;
    if(step.recipe?.startsWith('ci:contracts:')||step.recipe?.startsWith('ci:stories:')||step.recipe?.startsWith('ci:siheom:')||step.recipe==='patterns'||['docs-browser','preview-contracts'].includes(step.recipe))step.dependsOn=['candidate','browsers'];
    else if(['docs-tests','preview-types','preview-build'].includes(step.recipe))step.dependsOn=['candidate'];
    else if(/^(contract|stories)-(firefox|webkit)-/u.test(step.id))step.dependsOn=['browsers'];
    if(step.kind)step.dependsOn=['final-output-check'];
  }
  return steps;
}

export async function runSteps(steps,run){
  const results=[];let exitCode=0;
  for(const step of steps){
    const blockedBy=(step.dependsOn??[]).filter(id=>{const prerequisite=results.find(row=>row.id===id);return !prerequisite||prerequisite.exitCode!==0||prerequisite.signal;});
    if(blockedBy.length){results.push({id:step.id,executed:false,status:'blocked',blockedBy,exitCode:1,signal:null});exitCode ||= 1;continue;}
    let result;try{result=await run(step);}catch(error){result={exitCode:1,signal:null,error:error.message};}
    results.push({id:step.id,...result});
    if(result.exitCode!==0||result.signal){exitCode ||= Number.isInteger(result.exitCode)&&result.exitCode>0?result.exitCode:1;if(step.stopOnFailure)break;}
  }
  return {results,exitCode};
}

export async function mergeIndexes(baseRoot,fragments,candidate,scopes,inspect=inspectReleaseEvidence){
  const index={schemaVersion:3,reports:{}},blocked=[];
  for(const {kind,path}of fragments){
    const fragment=JSON.parse(await readFile(resolve(baseRoot,path),'utf8'));
    if(!kinds.includes(kind)||fragment.schemaVersion!==3||Object.keys(fragment.reports??{}).length!==1||!fragment.reports[kind]||index.reports[kind])throw new Error('Invalid/duplicate producer index fragment');
    const result=await inspect(baseRoot,kind,fragment,candidate,scopes);
    if(result.status==='passed')index.reports[kind]=fragment.reports[kind];else blocked.push({kind,...result});
  }
  return {index,blocked};
}

export async function validateFinalOutputs(baseRoot,before,current,target){
  if(JSON.stringify(current.candidate)!==JSON.stringify(before.candidate))throw new Error('Final candidate source/lock/artifact bytes changed after capture');
  await validateInventory(baseRoot,target.producedArtifacts,await outputRoots(baseRoot),{outputs:true});
  for(const id of ['M1-compatibility-types-build','M2-compatibility-types-build','M1-ssr-hydration-browser-timezones','M2-ssr-hydration-browser-timezones']){
    const check=current.checks.find(row=>row.id===id);if(check?.status!=='passed')throw new Error(`${id}: ${JSON.stringify(check?.details??'missing actual output proof')}`);
  }
}

function assertSource(){
  const head=git(['rev-parse','--verify','HEAD^{commit}']);
  assertVerifySource({head,expectedSha:process.env.KRDS_RELEASE_SOURCE_SHA,trackedChanges:git(['diff','--name-only','--no-ext-diff','-z',head]).split('\0').filter(Boolean),untrackedFiles:git(['ls-files','--others','--exclude-standard','-z']).split('\0').filter(Boolean)});
  return head;
}

export async function collect(){
  assertNode();
  if(process.argv.length!==2)throw new Error('collect-release-evidence.mjs takes no arguments; optional authored extras use KRDS_RELEASE_*_EXTRAS');
  const sourceCommit=assertSource(),stamp=`${new Date().toISOString().replaceAll(':','-')}-${randomUUID()}`;
  const directory=`test-results/release/${stamp}`,ssrDirectory=`test-results/t13/ssr-runs/${stamp}`;
  await mkdir(resolve(root,directory),{recursive:true});
  const write=async(path,value)=>writeFile(resolve(root,path),JSON.stringify(value,null,2)+'\n');
  await write(`${directory}/source-candidate.json`,{sourceCommit,lockfileSha256:hash(await readFile(join(root,'yarn.lock')))});
  const extras=Object.fromEntries([['patterns','PATTERN_REVIEW'],['documentation','DOCS_REVIEW'],['manualAccessibility','MANUAL_ACCESSIBILITY'],['independentReview','INDEPENDENT_REVIEW']].flatMap(([kind,key])=>process.env[`KRDS_RELEASE_${key}_EXTRAS`]?[[kind,process.env[`KRDS_RELEASE_${key}_EXTRAS`]]]:[]));
  const steps=releaseSteps({directory,ssrDirectory,extras});let candidateDocument;
  const result=await runSteps(steps,async step=>{
    console.log(`Release producer: ${step.id}`);
    if(step.action){
      assertSource();const current=await verifyRelease(root,{write:false});
      if(step.action==='candidate'){candidateDocument=current;await write(`${directory}/candidate-verification.json`,current);}
      else{
        const target=JSON.parse(await readFile(resolve(root,`${directory}/ci-targets/record.json`),'utf8'));
        await validateFinalOutputs(root,candidateDocument,current,target);
      }
      return {exitCode:0,signal:null};
    }
    const execution=await captureStep(step.id,nodeCommand(root,step.args,step.environment),{baseRoot:root,output:resolve(root,`${directory}/orchestration/${step.id}`)});
    console.log(await readFile(resolve(root,execution.stdout.path),'utf8'));console.error(await readFile(resolve(root,execution.stderr.path),'utf8'));
    return execution;
  });
  let merged={index:{schemaVersion:3,reports:{}},blocked:[]};
  if(result.results.some(row=>row.id==='final-output-check'&&row.exitCode===0)){
    const fragments=steps.filter(step=>step.kind&&result.results.find(row=>row.id===step.id)?.exitCode===0).map(step=>({kind:step.kind,path:`${directory}/assembled-${step.kind}/${step.kind}.index.json`}));
    const manifest=JSON.parse(await readFile(resolve(root,'artifacts/manifest.json'),'utf8'));
    merged=await mergeIndexes(root,fragments,candidateDocument.candidate,manifest.scopes);
    const version=candidateDocument.version;if(!/^[0-9A-Za-z.-]+$/u.test(version))throw new Error('Unsafe candidate version');
    await mkdir(resolve(root,`docs/releases/${version}`),{recursive:true});
    await write(`docs/releases/${version}/acceptance-evidence.json`,merged.index);
  }
  const missing=kinds.filter(kind=>!merged.index.reports[kind]);
  const summary={...result,...merged,missing,publicationAuthorized:false,publicationPerformed:false};
  await write(`${directory}/orchestration.json`,summary);
  console.log(JSON.stringify({directory,exitCode:result.exitCode|| (missing.length?1:0),missing,publicationAuthorized:false}));
  return result.exitCode||(missing.length?1:0);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=await collect();
