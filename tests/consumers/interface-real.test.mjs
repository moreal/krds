import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,copyFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {root,node,json,hash,config} from './lib.mjs';
import {captureStep,captureConsumerReceipt,inspectResolutionReceipt,evidenceRef} from './evidence.mjs';

test('real retained outside installation rejects altered accepted lock/compiler/candidate evidence',async()=>{
 const original=await json(join(root,'artifacts/consumers/react-minimum.json'));
 const manifest=await json(join(root,'artifacts/debug-inventory.json'));
 const framework=(await json(join(root,'compatibility/frameworks.json'))).frameworks.find(row=>row.id==='react');
 const expectedPins={...framework.pins,typescript:config.sharedPins.typescript,'@types/node':config.sharedPins['@types/node'],playwright:config.environments[framework.toolchain].pins.playwright,vite:config.environments[framework.toolchain].pins.vite};
 const packagePath=join(original.directory,'package.json'),packageBytes=await readFile(packagePath);
 const baseRoot=await mkdtemp('/private/tmp/krds-real-receipt-unit-'),probe=join(original.directory,'resolve-interface-proof.mjs');
 try{
  const pkg=JSON.parse(packageBytes);pkg.resolutions=Object.fromEntries(Object.entries(pkg.resolutions).filter(([name])=>Object.hasOwn(pkg.dependencies,name)));await writeFile(packagePath,JSON.stringify(pkg,null,2));
  await copyFile(join(root,'tests/consumers/templates/resolve.mjs'),probe);
  const step=await captureStep('actual-installed-identity-probe',{executable:node,args:[probe],cwd:original.directory},{baseRoot,output:join(baseRoot,'step')});assert.equal(step.exitCode,0);
  const identities=JSON.parse(await readFile(join(baseRoot,step.stdout.path),'utf8'));
  const ref=await captureConsumerReceipt({baseRoot,directory:original.directory,output:join(baseRoot,'receipt'),manifest,id:'react',expectedPins,resolutions:identities});
  const row={id:'react',directory:original.directory,receipt:ref};await inspectResolutionReceipt(row,manifest,{baseRoot,framework,validateTemplate:false,validateOutputs:false});
  const receipt=JSON.parse(await readFile(join(baseRoot,ref.path),'utf8'));
  const lock=receipt.config.find(file=>file.consumerPath==='yarn.lock'),lockPath=join(baseRoot,lock.path),lockBytes=await readFile(lockPath);await writeFile(lockPath,'changed lock');await assert.rejects(inspectResolutionReceipt(row,manifest,{baseRoot,framework,validateTemplate:false,validateOutputs:false}),/hash|bytes/iu);await writeFile(lockPath,lockBytes);
  const receiptPath=join(baseRoot,ref.path);
  for(const mutation of ['compiler','candidate']){const changed=structuredClone(receipt);if(mutation==='compiler')changed.identities.find(entry=>entry.name==='typescript').entrySha256='0'.repeat(64);else changed.candidates[0].files[0].sha256='0'.repeat(64);await writeFile(receiptPath,JSON.stringify(changed));row.receipt=await evidenceRef(receiptPath,baseRoot);await assert.rejects(inspectResolutionReceipt(row,manifest,{baseRoot,framework,validateTemplate:false,validateOutputs:false}),/compiler|Candidate/iu);}
 }finally{await writeFile(packagePath,packageBytes);await rm(probe,{force:true});await rm(baseRoot,{recursive:true,force:true});}
});
