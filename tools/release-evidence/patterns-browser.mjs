#!/usr/bin/env node
/** Invoke the actual root T11 producers, changing only Qwik root/output literals. */
import {spawnSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {patternProducer,redirectQwikProducer} from './patterns.mjs';
import {hash,ref} from './producers.mjs';
const root=resolve(import.meta.dirname,'../..'),framework=process.argv[2],producer=patternProducer(framework);
if(!['svelte','angular','qwik'].includes(framework))throw new Error('Use the existing fixture producer for this framework');
const output=process.env.KRDS_RELEASE_PATTERN_OUTPUT,artifact=process.env.KRDS_RELEASE_PATTERN_ARTIFACT;
if(!output||!artifact)throw new Error('An explicitly leased artifact and fresh retained output are required');
if(framework==='qwik'){
 const source=await readFile(join(root,producer.entry),'utf8'),derived=redirectQwikProducer(source,root,output),path=join(output,'qwik-producer-redirected.mjs');
 await writeFile(path,derived);await writeFile(join(output,'producer.json'),JSON.stringify({source:producer.entry,sourceSha256:hash(source),redirected:await ref(root,path)},null,2)+'\n');
 process.env.KRDS_PATTERN_PRODUCTION=artifact;await import(pathToFileURL(path).href);
}else{
 const args=[producer.entry,...(framework==='svelte'?[artifact,output]:['--dist',artifact,'--output',output])],child=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit',env:process.env});
 if(child.error)throw child.error;if(child.signal)throw new Error(`Native producer terminated by ${child.signal}`);process.exitCode=child.status??1;
}
