#!/usr/bin/env node
/** Run the actual T12 browser producer while recording exact delivered response bytes. */
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {redirectDocsProducer} from './producers.mjs';
import {monitorDocsBrowser} from './docs-responses.mjs';
const root=resolve(import.meta.dirname,'../..'),dist=resolve(root,'apps/docs/dist');
const producerOutput=process.env.KRDS_RELEASE_DOCS_OUTPUT;if(!producerOutput)throw new Error('A fresh redirected producer-output directory is required');
const require=createRequire(resolve(root,'apps/docs/package.json'));
const {chromium,webkit}=require('@playwright/test');const monitors=[];const output=process.env.KRDS_RELEASE_DOCS_SERVED;
if(!output)throw new Error('A retained served-response output path is required');
for(const engine of [chromium,webkit]){const launch=engine.launch.bind(engine);engine.launch=async(...args)=>{const browser=await launch(...args);monitors.push(monitorDocsBrowser(browser,{root,dist,name:engine.name(),base:'/krds/'}));return browser;};}
const source=await readFile(resolve(root,'apps/docs/tests/browser.mjs'),'utf8');const derived=redirectDocsProducer(source,root,producerOutput);const derivedPath=resolve(dirname(output),'t12-producer-redirected.mjs');await writeFile(derivedPath,derived);await import(pathToFileURL(derivedPath).href);for(const monitor of monitors)await monitor.drain();const failures=monitors.flatMap(monitor=>monitor.failures),responses=monitors.flatMap(monitor=>monitor.responses);if(failures.length)throw new Error(failures.join('; '));if(!responses.length)throw new Error('Zero actual docs response bytes captured');await mkdir(dirname(resolve(output)),{recursive:true});await writeFile(resolve(output),JSON.stringify({schemaVersion:1,kind:'actual-docs-responses',producerSha256:createHash('sha256').update(source).digest('hex'),redirectedProducer:{path:relative(root,derivedPath),sha256:createHash('sha256').update(derived).digest('hex'),bytes:Buffer.byteLength(derived)},producerOutput:relative(root,resolve(producerOutput)),responses},null,2)+'\n');
