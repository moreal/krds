#!/usr/bin/env node
/** Rebind current docs snapshots and bundler-emitted original fonts, never historical inputs. */
import assert from 'node:assert/strict';
import { nativePreviewInventory, verifyNativeInventory, nativeDistributionDiff } from './docs-previews/provenance.mjs';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const bytes=path=>readFile(resolve(root,path));
const json=async path=>JSON.parse(await bytes(path));
const hash=value=>createHash('sha256').update(value).digest('hex');
const write=async(path,value)=>writeFile(resolve(root,path),JSON.stringify(value,null,2)+'\n');
const metadataPath='apps/docs/public/docs-metadata.json',metadataBytes=await bytes(metadataPath),metadata=JSON.parse(metadataBytes);
const baseline=await json('apps/docs/tests/fixtures/vitepress-baseline.json'),allowlist=await json('apps/docs/migration-current-inputs.json');
const inventory=await json('compliance/distribution-provenance.json'),manifest=await json('upstream/krds/manifest.json');
const previous=new Map(inventory.documentation.records.map(record=>[record.sourcePath,record]));
const current=new Map(metadata.distributedSources.map(record=>[record.outputPath,record]));
assert.equal(current.size,609);assert.deepEqual([...current.keys()].sort(),baseline.downloads.map(record=>record.outputPath));
const changes=[];
for(const before of baseline.downloads){
 const after=current.get(before.outputPath),actual=await bytes(`apps/docs/public/${after.outputPath}`);
 assert.equal(hash(actual),after.sha256);assert.equal(actual.length,after.bytes);
 assert.deepEqual(await bytes(`apps/docs/dist/${after.outputPath}`),actual);
 if(before.sha256!==after.sha256){
  const allowed=allowlist.records.find(record=>record.sourcePath===before.sourcePath);
  assert.ok(allowed&&before.kind==='current-input',`Unlisted or historical docs change: ${before.sourcePath}`);
  assert.equal(hash(await bytes(before.sourcePath)),after.sha256);
  changes.push({sourcePath:before.sourcePath,before:before.sha256,after:after.sha256,reason:allowed.reason});
 }
}
for(const record of baseline.declarations)assert.equal(hash(await bytes(record.checkpointPath)),record.sha256);
for(const checkpoint of baseline.checkpoints)for(const proof of checkpoint.proofInputs)assert.equal(hash(await bytes(proof.path)),proof.sha256);
for(const input of metadata.sourceInputs)assert.equal(hash(await bytes(input.path)),input.sha256);
const records=metadata.distributedSources.map(record=>{
 const original=previous.get(record.sourcePath);assert.ok(original,'No unreviewed new download rights classifications');
 assert.equal(original.destination,`apps/docs/public/${record.outputPath}`);
 return {...original,sha256:record.sha256,bytes:record.bytes};
});
const sources=await json('compliance/provenance.json');
const fonts=sources.filter(entry=>entry.distributedIn.includes('@unofficial-krds/fonts')&&entry.localPaths.some(path=>path.startsWith('packages/fonts/fonts/')&&path.endsWith('.woff2')));
assert.equal(fonts.length,3);
const built=await readdir(resolve(root,'apps/docs/dist/_astro'));
const fontAssets=[];
for(const source of fonts){
 assert.equal(source.modified,false);assert.equal(source.rightsStatus,'verified');
 const sourcePath=source.localPaths.find(path=>path.startsWith('packages/fonts/fonts/')),original=await bytes(sourcePath);assert.equal(hash(original),source.sha256);
 const destinations=[];
 for(const path of built.filter(path=>path.endsWith('.woff2')))if((await bytes(`apps/docs/dist/_astro/${path}`)).equals(original))destinations.push(`apps/docs/dist/_astro/${path}`);
 assert.equal(destinations.length,1,`Exactly one original emitted font: ${source.id}`);
 fontAssets.push({sourceId:source.id,sourcePath,sha256:source.sha256,bytes:original.length,modified:false,destinations});
}
const metadataSha256=hash(metadataBytes);
const documentation={...inventory.documentation,records,referenceOnlySources:metadata.referenceOnlySources,metadataSha256};
// Stable rebinding: no wall-clock timestamp may perturb identical builds.
const dependencyInventory=await json('compliance/provenance-dependencies.json');
const bundledDependencies=(await json('apps/docs/.astro/client-dependencies.json')).map(record=>{
 const original=dependencyInventory.packages[`${record.name}@${record.version}`];assert.ok(original?.licenseDocuments?.length,`Original bundled dependency notice required: ${record.name}`);
 return {...record,manifestPath:original.manifestPath,manifestSha256:original.manifestSha256,licenseDocuments:original.licenseDocuments};
});
assert.ok(bundledDependencies.some(record=>record.name==='solid-js'));
// Native previews: separate current inventory; legacy downloads/fonts above stay exact.
const nativePreviews=nativePreviewInventory({root,distribution:inventory,sources,dependencies:dependencyInventory});
verifyNativeInventory(root,nativePreviews,{sourceEntries:sources,dependencies:dependencyInventory,distribution:inventory});
const nativeDiff=nativeDistributionDiff(inventory.nativePreviews,nativePreviews);
inventory.nativePreviews=nativePreviews;
inventory.documentation=documentation;inventory.fontAssets=fontAssets;inventory.bundledDependencies=bundledDependencies;
manifest.documentationDistribution={...manifest.documentationDistribution,snapshots:records.filter(record=>record.rights!=='independent'),referenceOnlySources:metadata.referenceOnlySources,fontAssets,bundledDependencies,nativePreviews};
await write('apps/docs/migration-current-input-diff.json',{schemaVersion:1,changes});
await write('apps/docs/native-preview-distribution-diff.json',nativeDiff);
await write('compliance/distribution-provenance.json',inventory);await write('upstream/krds/manifest.json',manifest);
console.log(JSON.stringify({downloads:records.length,changedCurrentInputs:changes,fontAssets,nativePreviews:{artifacts:nativePreviews.artifacts.length,fontAssets:nativePreviews.fontAssets.length,added:nativeDiff.added.length,removed:nativeDiff.removed.length,changed:nativeDiff.changed.length}},null,2));
