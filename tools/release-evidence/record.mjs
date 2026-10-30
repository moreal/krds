#!/usr/bin/env node
/** Explicit recorder. Never imports historical logs as a new execution. */
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {resolve,join,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {recipe,inventory,sourceRoots,ref,identicalSnapshot} from './record-support.mjs';
import {candidateBinding,outputRoots,prepareCIOutputs,retainCIOutputs} from './producers.mjs';
import {captureStep,nodeCommand,producerEnvironment} from './receipts.mjs';
import {patternEnvironment,patternArtifactRoots,preparePatternOutputs,retainPatternOutputs} from './patterns.mjs';
const root=resolve(import.meta.dirname,'../..');
export async function record({recipeName,framework,candidate,scopes,output,resultPath,artifactPath,execute=false}){
 const args=recipe(recipeName,framework),kind=recipeName==='patterns'?'patterns':recipeName.startsWith('docs-')?'documentation':recipeName.startsWith('preview-')?'preview':'ci';
 if(!execute)return {recipe:recipeName,command:nodeCommand(root,args,producerEnvironment(root,recipeName,framework)),sourceRoots:sourceRoots(kind),executionPerformed:false};
 const destination=resolve(root,output);if(!destination.startsWith(`${root}/test-results/`)&&!destination.startsWith(`${root}/docs/releases/`))throw new Error('Recorder output must be a retained test-results or docs/releases directory');
 if(kind==='preview'&&resultPath)throw new Error('Preview results are derived from fresh enumerated producer outputs; --result is unsupported');
 if(kind==='preview'&&framework&&framework!=='solid-next')throw new Error('Preview framework must be solid-next');
 if(kind==='patterns'&&resultPath)throw new Error('Pattern results are derived from fresh enumerated producer outputs; --result is unsupported');
 if(artifactPath&&(kind!=='patterns'||!['svelte','angular','qwik'].includes(framework)))throw new Error('--artifact is supported only by the three root native producers');
 if(kind==='patterns'&&framework==='qwik'&&!artifactPath)throw new Error('Qwik requires --artifact for the owner-leased production root with server.mjs and dist/');
 let binding=kind==='ci'?null:candidateBinding(kind,candidate,scopes);await mkdir(dirname(destination),{recursive:true});await mkdir(destination);let artifact;if(artifactPath){artifact=relative(root,join(destination,'inputs/fixture'));await cp(resolve(root,artifactPath),resolve(root,artifact),{recursive:true});}
 const before=await inventory(root,sourceRoots(kind));if(kind==='ci')binding={bindingMode:'source-before/outputs-after',sourceCommit:candidate?.sourceCommit,lockfileSha256:candidate?.lockfileSha256,sourceInventorySha256:before.sha256};const artifactRoots=kind==='patterns'?patternArtifactRoots(framework,artifact):kind==='documentation'?['apps/docs/dist','apps/docs/public']:[];const artifactsBefore=artifactRoots.length?await inventory(root,artifactRoots,{outputs:true}):null;
 // The command is an enumerated native recipe, never shell text from an evidence file.
 const environment={...(kind==='patterns'?patternEnvironment(root,framework,destination,artifact):producerEnvironment(root,recipeName,framework)),...(recipeName==='docs-browser'?{KRDS_RELEASE_DOCS_SERVED:join(destination,'served-docs.json'),KRDS_RELEASE_DOCS_OUTPUT:join(destination,'native-output')}:{})};
 const producerState=kind==='ci'||recipeName==='preview-contracts'?await prepareCIOutputs(root,recipeName,destination):kind==='patterns'?await preparePatternOutputs(root,framework,destination,artifact):null;
 const ci=process.env.GITHUB_ACTIONS==='true'?{provider:'github-actions',runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,workflow:process.env.GITHUB_WORKFLOW,sourceSha:process.env.GITHUB_SHA}:null;
 const execution=await captureStep(recipeName,nodeCommand(root,args,environment),{baseRoot:root,output:join(destination,'process')});let outputs=null,outputError;try{if(kind==='ci'||recipeName==='preview-contracts')outputs=await retainCIOutputs(root,recipeName,destination,producerState,execution,binding,ci);else if(kind==='patterns')outputs=await retainPatternOutputs(root,framework,destination,producerState,execution,binding);}catch(error){outputError=error.message;}
 const after=await inventory(root,sourceRoots(kind));const record={schemaVersion:3,kind:'captured-recipe',recipe:recipeName,framework,candidate:binding,sourceBefore:before,sourceAfter:after,artifactsBefore,artifactsAfter:artifactRoots.length?await inventory(root,artifactRoots,{outputs:true}):null,execution,producedArtifacts:recipeName==='ci:targets'&&execution.exitCode===0?await inventory(root,await outputRoots(root),{outputs:true}):null,sourceUnchanged:identicalSnapshot(before,after),outputs,outputError,result:(['ci','patterns'].includes(kind)||recipeName==='preview-contracts')?outputs?.result??null:recipeName==='docs-browser'?await ref(root,join(destination,'native-output/report.json')).catch(()=>null):resultPath?await ref(root,resultPath).catch(()=>null):null,served:recipeName==='docs-browser'&&execution.exitCode===0?await ref(root,join(destination,'served-docs.json')):null,ci,releaseAccepted:false};
 await writeFile(join(destination,'record.json'),JSON.stringify(record,null,2)+'\n');return record;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const opts={};for(let i=2;i<process.argv.length;i++){const key=process.argv[i];if(key==='--execute')opts.execute=true;else if(['--recipe','--framework','--candidate','--manifest','--output','--result','--artifact'].includes(key)){const value=process.argv[++i];if(!value)throw new Error(`Missing ${key}`);opts[key.slice(2)]=value;}else throw new Error(`Unknown ${key}`);}
 const input=opts.candidate?JSON.parse(await readFile(resolve(root,opts.candidate),'utf8')):undefined;const candidate=input?.candidate??input;
 const scopes=opts.manifest?JSON.parse(await readFile(resolve(root,opts.manifest),'utf8')).scopes:undefined;
 const result=await record({recipeName:opts.recipe,framework:opts.framework,candidate,scopes,output:opts.output,resultPath:opts.result,artifactPath:opts.artifact,execute:opts.execute});console.log(JSON.stringify(result,null,2));if(result.execution&&(result.execution.exitCode!==0||result.execution.signal||!result.sourceUnchanged||result.outputError))process.exitCode=1;
}
