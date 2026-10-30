#!/usr/bin/env node
/** Read-only subject capture; never asserts that review or manual work happened. */
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {inventory,sourceRoots,stable} from './producers.mjs';
const root=resolve(import.meta.dirname,'../..'),options={};for(let i=2;i<process.argv.length;i++){const key=process.argv[i],value=process.argv[++i];if(!['--kind','--framework','--output'].includes(key)||!value)throw new Error('Usage: snapshot --kind KIND [--framework native] --output test-results/path.json');options[key.slice(2)]=value;}
const frameworks=options.framework?[options.framework]:stable;if(frameworks.some(id=>![...stable,'solid-next'].includes(id)))throw new Error('Unknown native framework');
const output=resolve(root,options.output);if(!output.startsWith(`${root}/test-results/`)&&!output.startsWith(`${root}/docs/releases/`))throw new Error('Retained output must stay in test/release evidence');
const sourceInventory=await inventory(root,sourceRoots(options.kind,frameworks));const artifacts={};if(['manualAccessibility','patterns'].includes(options.kind))for(const framework of frameworks)artifacts[framework]=await inventory(root,[`apps/fixture-${framework}/dist`],{outputs:true});
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify({schemaVersion:3,kind:'unreviewed-subject-snapshot',capturedAt:new Date().toISOString(),sourceInventory,artifacts,reviewPerformed:false,manualSessionPerformed:false},null,2)+'\n');console.log(JSON.stringify({captured:true,reviewPerformed:false,manualSessionPerformed:false}));
