/** Enumerated T11 producers and lossless same-invocation native output bindings. */
import {mkdir,stat} from 'node:fs/promises';
import {resolve,join,relative,dirname} from 'node:path';
import {blocked,bytes,ref,readRef,inventory,validateInventory,parsePatterns,hash} from './producers.mjs';
const check=(value,message)=>{if(!value)throw blocked(message);};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const producers={
 solid:{entry:'apps/fixture-solid/scripts/patterns-browser.mjs',result:'browser-results.json'},
 react:{entry:'apps/fixture-react/scripts/patterns-browser.mjs',result:'results.json'},
 vue:{entry:'apps/fixture-vue/scripts/patterns-browser.mjs',result:'results.json'},
 lit:{entry:'apps/fixture-lit/scripts/patterns-browser.mjs',result:'report.json'},
 svelte:{entry:'scripts/patterns-svelte-browser.mjs',result:'results.json',statusRows:true,rootScripts:['scripts/patterns-svelte-browser.mjs']},
 angular:{entry:'scripts/patterns-angular.mjs',result:'results.json',statusRows:true,rootScripts:['scripts/patterns-angular.mjs']},
 qwik:{entry:'tests/patterns/qwik/browser.mjs',result:'browser.json',statusRows:true,caseNames:['form/error-summary-focus','form/retry-success+native-formdata+duplicate+command-replay','form/reset-cancels-pending+native-canceled-reset','search/filter-resets-page+links+history','search/empty-results','search/retry-success','search/query-during-loading+immutable-payload','consent/required-refusal','consent/optional-refusal-success','consent/modal-focus-return+trap+scroll+cancel-late','consent/retry-in-dialog','layout/skip-main','layout/navigate-current+popstate','layout/narrow-navigation+current-activation+cancel','layout/footer-policy']}
};
export function patternProducer(framework){check(Object.hasOwn(producers,framework),'Unknown native pattern producer');return {...producers[framework],rootScripts:producers[framework].rootScripts??[]};}
export function patternEnvironment(root,framework,destination,artifact){
 patternProducer(framework);const fixture=resolve(root,artifact??`apps/fixture-${framework}/dist${framework==='angular'?'/browser':''}`);
 const env={PATTERN_STATIC_ROOT:fixture,KRDS_PATTERN_DIST:fixture,PLAYWRIGHT_BROWSERS_PATH:'/private/tmp/krds-playwright-1.64.1'};
 if(destination){const output=resolve(destination,'native-output');if(framework==='solid')env.PATTERN_OUTPUT=output;
  else if(framework==='react')env.KRDS_PATTERN_REPORT=output;
  else if(['vue','lit'].includes(framework))env.KRDS_PATTERN_RUN=relative(resolve(root,`.superpowers/sdd/PLAN/t11-${framework}-logs`),output);
  else if(['svelte','angular','qwik'].includes(framework)){env.KRDS_RELEASE_PATTERN_OUTPUT=output;env.KRDS_RELEASE_PATTERN_ARTIFACT=fixture;}
 }return env;
}
export function patternArtifactRoots(framework,artifact){return [artifact??`apps/fixture-${framework}/dist`,`packages/${framework}/dist`,'packages/test-contracts/dist'];}
export function validatePatternStdout(stdout,raw,framework){
 const parsed=parsePatterns(raw,framework),rows=Array.isArray(raw)?raw:raw.results;
 check(!/^FAIL /mu.test(stdout),'Actual pattern subprocess failure');
 if(framework==='svelte'){let printed;try{printed=JSON.parse(stdout);}catch{throw blocked('Missing original Svelte JSON stdout');}check(same(printed.results,rows)&&same(printed.errors,raw.errors)&&same(printed.external,raw.external),'Original Svelte stdout/result differs');}
 else if(framework==='angular'){let printed;try{printed=JSON.parse(stdout);}catch{throw blocked('Missing original Angular summary stdout');}check(printed.passed===rows.length&&printed.failed===0&&same(printed.errors,raw.errors)&&same(printed.externalRequests,raw.externalRequests),'Original Angular stdout/result differs');}
 else if(framework==='qwik'){const lines=[...stdout.matchAll(/^Qwik T11 browser (\d+)\/(\d+)\s*$/gmu)];check(lines.length===1&&Number(lines[0][1])===rows.length&&Number(lines[0][2])===rows.length,'Original Qwik stdout/result differs');}
 else for(const id of parsed.caseIds){const label=framework==='react'?`pattern-${id.replace('/','-')}`:framework==='lit'?`${id.split('/')[1]} true`:id;check(stdout.split(/\r?\n/u).filter(line=>framework==='lit'?line.trimEnd()===label:line===`PASS ${label}`).length===(framework==='lit'?rows.filter(row=>row.id===id.split('/')[1]).length:1),`Original subprocess did not execute ${id}`);}
 return parsed;
}
export function redirectQwikProducer(source,root,output){
 const from="const root=resolve(import.meta.dirname,'../../..'),require=createRequire(resolve(root,'apps/fixture-qwik/package.json'));";
 const out="const directory=resolve(root,'.superpowers/sdd/PLAN/t11-qwik-logs'),production=process.env.KRDS_PATTERN_PRODUCTION;";
 check(source.split(from).length===2&&source.split(out).length===2,'Qwik producer changed; root/output-only transform needs review');
 return source.replace(from,`const root=${JSON.stringify(resolve(root))},require=createRequire(resolve(root,'apps/fixture-qwik/package.json'));`).replace(out,`const directory=${JSON.stringify(resolve(output))},production=process.env.KRDS_PATTERN_PRODUCTION;`);
}
export async function preparePatternOutputs(root,framework,destination,artifact){
 const sourceDirectory=resolve(destination,'native-output');
 const state={schemaVersion:1,framework,directory:relative(root,destination),sourceDirectory:relative(root,sourceDirectory),fresh:true,artifact:artifact??null};
 try{await stat(sourceDirectory);throw blocked('Native producer output already exists');}catch(error){if(error.code!=='ENOENT')throw error;}
 await mkdir(sourceDirectory,{recursive:true});return state;
}
export async function retainPatternOutputs(root,framework,destination,state,execution,candidate){
 const output=join(destination,'native-output');
 const files=await inventory(root,[relative(root,output)],{outputs:true}),result=await ref(root,join(output,patternProducer(framework).result));
 return {schemaVersion:1,kind:'native-pattern-output',framework,inputBinding:candidate,executionResultSha256:execution.rawResult.sha256,producerStdoutSha256:execution.stdout.sha256,producerState:state,directory:relative(root,output),inventory:files,result};
}
export async function validatePatternResultBinding(root,capture,submitted){
 const output=capture.outputs,state=output?.producerState,framework=capture.framework;patternProducer(framework);
 const directory=dirname(dirname(capture.execution.rawResult.path));
 check(output?.schemaVersion===1&&output.kind==='native-pattern-output'&&output.framework===framework&&same(output.inputBinding,capture.candidate)&&output.executionResultSha256===capture.execution.rawResult.sha256&&output.producerStdoutSha256===capture.execution.stdout.sha256,'Native result does not belong to original captured process');
 check(state?.schemaVersion===1&&state.framework===framework&&state.fresh===true&&state.directory===directory&&output.directory===`${directory}/native-output`&&same(submitted,capture.result)&&same(submitted,output.result)&&submitted.path===`${output.directory}/${patternProducer(framework).result}`,'Historical or unrelated pattern result substituted');
 check(state.sourceDirectory===output.directory,'Wrong canonical native output source');
 await validateInventory(root,output.inventory,[output.directory],{outputs:true});check(output.inventory.files.some(row=>same(row,submitted)),'Original native result omitted from complete output closure');
 if(state.artifact)check(state.artifact===`${directory}/inputs/fixture`,'Immutable diagnostic artifact must be retained in the same capture');
 const environment=patternEnvironment(root,framework,resolve(root,directory),state.artifact??undefined);
 check(same(capture.execution.command.environment,environment),'Pattern output/artifact environment was substituted');
 const raw=JSON.parse(await readRef(root,submitted));
 if(['svelte','angular'].includes(framework))check(raw.artifact===environment.KRDS_RELEASE_PATTERN_ARTIFACT,'Native producer served another artifact root');
 if(framework==='qwik'){const producer=JSON.parse(await bytes(root,`${output.directory}/producer.json`)),source=await bytes(root,patternProducer(framework).entry);check(producer.sourceSha256===hash(source),'Original Qwik source changed');check((await readRef(root,producer.redirected)).toString()===redirectQwikProducer(source.toString(),root,resolve(root,output.directory)),'Qwik redirected producer changed assertions');}
 const stdout=await bytes(root,capture.execution.stdout.path);check(hash(stdout)===capture.execution.stdout.sha256,'Original native stdout changed');validatePatternStdout(stdout.toString(),raw,framework);
 return {raw,environment,artifact:state.artifact??undefined};
}
