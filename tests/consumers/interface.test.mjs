import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { sourceSnapshot, scopePackageIds, artifactSetHash } from './scopes.mjs';
import { captureStep, validateStep, evidenceRef, validateRef } from './evidence.mjs';
import { node } from './lib.mjs';

test('stable complete source inventory survives isolated preview changes and detects added stable files', async()=>{
 const baseRoot=await mkdtemp('/private/tmp/krds-scope-unit-');
 try{
  for(const id of scopePackageIds('all')){await mkdir(join(baseRoot,'packages',id,'src'),{recursive:true});await writeFile(join(baseRoot,'packages',id,'package.json'),JSON.stringify({name:`@unofficial-krds/${id}`,version:'0.0.0'}));await writeFile(join(baseRoot,'packages',id,'src/index.ts'),id);}
  for(const name of ['package.json','.yarnrc.yml','tsconfig.base.json','LICENSE.md','ATTRIBUTION.md','compliance/license-policy.json','compliance/provenance.schema.json','tools/distribution-provenance.mjs','upstream/krds/raw/kit/tokens/transformed_tokens.json','upstream/krds/raw/kit/tokens/figma_token.json','yarn.lock','compatibility/toolchain.json','compatibility/frameworks.json','compliance/provenance.json','compliance/project-identity.json','tools/yarn.mjs','tools/check-node.mjs','tools/build.mjs','tools/generate-notices.mjs','tools/verify-licenses.mjs','.yarn/releases/yarn-4.14.1.cjs']){await mkdir(join(baseRoot,name,'..'),{recursive:true});await writeFile(join(baseRoot,name),name.endsWith('.json')?(name.endsWith('provenance.json')?'[]':'{}'):'fixture source');}
  const stable=await sourceSnapshot({baseRoot,scope:'stable'}),preview=await sourceSnapshot({baseRoot,scope:'preview'});
  await writeFile(join(baseRoot,'packages/solid-next/src/extra.ts'),'preview edit');
  assert.deepEqual(await sourceSnapshot({baseRoot,scope:'stable'}),stable);
  assert.notDeepEqual(await sourceSnapshot({baseRoot,scope:'preview'}),preview);
  await rm(join(baseRoot,'packages/solid-next'),{recursive:true});assert.deepEqual(await sourceSnapshot({baseRoot,scope:'stable'}),stable);
  await writeFile(join(baseRoot,'packages/react/src/added.ts'),'new stable source');assert.notDeepEqual(await sourceSnapshot({baseRoot,scope:'stable'}),stable);
 }finally{await rm(baseRoot,{recursive:true,force:true});}
});

test('stable artifact binding does not include unavailable or changed preview candidates',()=>{
 const packages=scopePackageIds('all').map(id=>({name:`@unofficial-krds/${id}`,version:'0.0.0',sha256:'a'.repeat(64),normalizedContentSha256:'b'.repeat(64),packedManifest:{name:`@unofficial-krds/${id}`,version:'0.0.0'},files:[]}));
 const stable=artifactSetHash({packages},'stable');const changed=structuredClone(packages);changed.find(p=>p.name.endsWith('/solid-next')).sha256='c'.repeat(64);
 assert.equal(artifactSetHash({packages:changed},'stable'),stable);assert.equal(artifactSetHash({packages:changed.filter(p=>!p.name.endsWith('/solid-next'))},'stable'),stable);assert.notEqual(artifactSetHash({packages:changed},'all'),artifactSetHash({packages},'all'));
});

test('actual captured command receipt rejects changed logs, command identity, and nonzero execution',async()=>{
 const baseRoot=await mkdtemp('/private/tmp/krds-step-unit-');
 try{
  const expected={executable:node,args:['--version'],cwd:baseRoot};
  const step=await captureStep('node-identity',expected,{baseRoot,output:join(baseRoot,'evidence')});
  await validateStep(step,{baseRoot,expectedCommand:expected});
  const original=await import('node:fs/promises').then(fs=>fs.readFile(join(baseRoot,step.log.path)));
  await writeFile(join(baseRoot,step.log.path),'unrelated text');await assert.rejects(validateStep(step,{baseRoot,expectedCommand:expected}),/hash|bytes/iu);
  await writeFile(join(baseRoot,step.log.path),original);const changed=structuredClone(step);changed.command.args=['--help'];await assert.rejects(validateStep(changed,{baseRoot,expectedCommand:expected}),/command/iu);
  const failed=await captureStep('actual-failure',{...expected,args:['-e','process.exit(7)']},{baseRoot,output:join(baseRoot,'failure')});await assert.rejects(validateStep(failed,{baseRoot,expectedCommand:failed.command}),error=>error.code==='EVIDENCE_FAILED');
  const signaled=await captureStep('actual-signal',{...expected,args:['-e',"process.kill(process.pid,'SIGTERM')"]},{baseRoot,output:join(baseRoot,'signal')});assert.equal(signaled.signal,'SIGTERM');await assert.rejects(validateStep(signaled,{baseRoot,expectedCommand:signaled.command}),error=>error.code==='EVIDENCE_FAILED');
 }finally{await rm(baseRoot,{recursive:true,force:true});}
});

test('hash-bound lock/compiler/candidate files reject changes to accepted bytes',async()=>{
 const baseRoot=await mkdtemp('/private/tmp/krds-proof-unit-');try{
  for(const name of ['yarn.lock','compiler.js','candidate.js']){await writeFile(join(baseRoot,name),`actual interface fixture ${name}`);const ref=await evidenceRef(join(baseRoot,name),baseRoot);await validateRef(ref,baseRoot);await writeFile(join(baseRoot,name),'changed');await assert.rejects(validateRef(ref,baseRoot),/hash|bytes/iu);}
 }finally{await rm(baseRoot,{recursive:true,force:true});}
});
