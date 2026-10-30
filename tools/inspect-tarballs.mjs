#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { root, json, hash, fingerprint, packages, internalRange, runtimeFramework } from '../tests/consumers/lib.mjs';
import { selectCandidates, artifactSetHash, scopedPackages, validateSnapshot } from '../tests/consumers/scopes.mjs';
import { validateRef, validateStep, yarnCommand, blocked, harnessSnapshot } from '../tests/consumers/evidence.mjs';
import {verifyPackageCompliance} from '../tests/consumers/compliance.mjs';
import { verify } from './verify-licenses.mjs';
export function unpack(bytes) {
 const tar=gunzipSync(bytes), entries=new Map();
 for(let offset=0;offset+512<=tar.length;) {
  const header=tar.subarray(offset,offset+512); if(header.every(byte=>byte===0)) break;
  const text=(a,b)=>header.subarray(a,b).toString().replace(/\0.*$/su,'');
  const checksum=parseInt(text(148,156).trim(),8);const actualChecksum=[...header].reduce((sum,byte,index)=>sum+(index>=148&&index<156?32:byte),0);if(checksum!==actualChecksum)throw new Error('Invalid tar header checksum');
  const name=[text(345,500),text(0,100)].filter(Boolean).join('/');
  const size=parseInt(text(124,136).trim(),8)||0, type=text(156,157);
  if(!name.startsWith('package/') || name.split('/').includes('..') || name.includes('\\')) throw new Error(`Unsafe tar path: ${name}`);
  if(type==='0'||type==='') { const local=name.slice(8); if(entries.has(local))throw new Error(`Duplicate tar path ${local}`); entries.set(local,tar.subarray(offset+512,offset+512+size)); }
  else if(type!=='5') throw new Error(`Unsupported tar member type ${type}: ${name}`);
  offset+=512+Math.ceil(size/512)*512;
 }
 if(!entries.size) throw new Error('Empty tarball');
 return entries;
}
const targets=value=>typeof value==='string'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(targets):[];
const forbidden=/@(?:siheom|storybook|vitest|playwright)\/|(?:^|["'\/])(?:vitest|playwright|storybook)(?:["'\/]|$)/u;
export async function inspect(manifest, { debug = false, scope = 'all', baseRoot = root } = {}) {
 if(!['all','stable','preview'].includes(scope))throw new Error(`Unknown artifact scope ${scope}`);
 if((manifest.debugOnly || /debug/u.test(manifest.status??'')) && !debug)throw new Error("Debug inventories cannot satisfy final artifact gates");
 const selected=selectCandidates(manifest,scope);
 const publicPackages=await scopedPackages({scope,baseRoot});const sourceNames=new Map(publicPackages.map(({pkg})=>[pkg.name,pkg.version]));const names=new Map(selected.map(candidate=>[candidate.name,candidate.version]));
 if(!debug){
  const binding=manifest.scopes?.[scope];if(manifest.schemaVersion!==2||!binding)throw blocked(`Missing ${scope} source/build/artifact binding`);
  const acceptedCompliance=JSON.parse(await validateRef(binding.packageCompliance,baseRoot));if(JSON.stringify(acceptedCompliance)!==JSON.stringify(await verifyPackageCompliance({baseRoot,scope})))throw blocked(`Changed ${scope} package license/provenance compliance`);
  if(binding.artifactSetSha256!==artifactSetHash(manifest,scope))throw blocked(`Changed ${scope} artifact set`);
  await validateSnapshot(binding.sourceSnapshot,{baseRoot,scope,inputsOnly:false});if(binding.sourceFingerprint!==binding.sourceSnapshot.sha256)throw blocked(`Mismatched ${scope} source fingerprint`);
  const build=JSON.parse(await validateRef(binding.buildEvidence,baseRoot));if(JSON.stringify(build.producerSnapshot)!==JSON.stringify(await harnessSnapshot(baseRoot)))throw blocked('Build producer/harness inventory changed');if(build.schemaVersion!==2||build.scope!==scope||build.sourceSnapshot.sha256!==binding.sourceFingerprint||build.inputSnapshot.sha256!==binding.inputFingerprint)throw blocked(`Mismatched ${scope} build attestation`);
  await validateSnapshot(build.sourceSnapshot,{baseRoot,scope,inputsOnly:false});await validateSnapshot(build.inputSnapshot,{baseRoot,scope,inputsOnly:true});
  if(build.steps?.length!==selected.length)throw blocked(`Incomplete ${scope} actual build steps`);
  for(const candidate of selected){const step=build.steps.find(step=>step.package===candidate.name);if(!step||build.steps.filter(step=>step.package===candidate.name).length!==1)throw blocked(`Missing actual public build ${candidate.name}`);await validateStep(step,{baseRoot,expectedCommand:yarnCommand(['workspace',candidate.name,'run','build:local'],baseRoot)});}
 }
 const result=[];
 for(const candidate of selected) {
  if(!debug&&sourceNames.get(candidate.name)!==candidate.version)throw new Error(`Candidate/source version drift ${candidate.name}`);
  if(!names.has(candidate.name))throw new Error(`Unknown candidate ${candidate.name}`);
  const bytes=await readFile(join(baseRoot,candidate.tarball)), entries=unpack(bytes);
  const pkg=JSON.parse(entries.get('package.json')?.toString()??'null');
  if(!pkg || pkg.private || pkg.name!==candidate.name || pkg.version!==candidate.version) throw new Error(`Packed identity mismatch ${candidate.name}`);
  if(candidate.sha256&&candidate.sha256!==hash(bytes))throw new Error(`Tarball hash drift ${pkg.name}`);
  const dryBytes=await readFile(join(baseRoot,candidate.dryRun)); if(hash(dryBytes)!==candidate.dryRunSha256)throw new Error(`Dry-run drift ${pkg.name}`);
  const dry=dryBytes.toString().trim().split(/\r?\n/u).filter(Boolean).map(line=>JSON.parse(line)).filter(line=>line.location).map(line=>line.location).sort();
  if(JSON.stringify(dry)!==JSON.stringify([...entries.keys()].sort()))throw new Error(`Dry-run/file list mismatch ${pkg.name}`);
  for(const required of ['README.md','LICENSE.md','ATTRIBUTION.md','THIRD-PARTY-NOTICES.md','provenance.json']) if(!entries.get(required)?.length)throw new Error(`${pkg.name}: missing ${required}`);
  if(![...entries.keys()].some(name=>name.startsWith('LICENSES/')))throw new Error(`${pkg.name}: missing original license documents`);
  for(const [name,data] of entries) {
   if(!debug && /(?:^|\/)WorkspaceProbe(?:[./]|$)/u.test(name))throw new Error(`${pkg.name}: stale bootstrap probe payload ${name}`);
   if(name==='package.json')continue;
   if(!debug){const source=await readFile(join(baseRoot,candidate.workspace,name)); if(!source.equals(data))throw new Error(`${pkg.name}: stale packed bytes ${name}`);}
   if(/\.(?:[cm]?js|d\.ts|css|json|map)$/u.test(name) && data.includes(Buffer.from(root)))throw new Error(`${pkg.name}: repository absolute path in ${name}`);
   if(/\.d\.(?:ts|mts|cts)$/u.test(name)){if(forbidden.test(data.toString()))throw new Error(`${pkg.name}: test tool public types ${name}`);const own=pkg.name.slice('@unofficial-krds/'.length);for(const match of data.toString().matchAll(/(?:from\s*|import\s*\()(['"])([^'"]+)\1/gu)){const specifier=match[2],parts=specifier.split('/'),dependency=specifier.startsWith('@')?parts.slice(0,2).join('/'):parts[0],framework=runtimeFramework(dependency);if(framework&&framework!==own&&!(own==='solid-next'&&dependency==='solid-js'))throw new Error(`${pkg.name}: foreign framework public type ${dependency} in ${name}`);}}
   if(name.endsWith('.map')) {const map=JSON.parse(data); if(map.sources?.some(s=>s.startsWith('/')||s.startsWith('file:')))throw new Error(`${pkg.name}: absolute sourcemap source ${name}`);}
  }
  for(const target of [...targets(pkg.exports),pkg.main,pkg.module,pkg.types].filter(Boolean)) {
   if(!target.startsWith('./') || target.includes('..',2))throw new Error(`${pkg.name}: unsafe export ${target}`);
   const path=target.slice(2);
   if(path.includes('*')) {const [prefix,suffix]=path.split('*'); if(![...entries.keys()].some(name=>name.startsWith(prefix)&&name.endsWith(suffix)))throw new Error(`${pkg.name}: empty wildcard export ${target}`);}
   else if(!entries.has(path))throw new Error(`${pkg.name}: missing export ${target}`);
  }
  for(const kind of ['dependencies','optionalDependencies','peerDependencies']) for(const [name,range] of Object.entries(pkg[kind]??{})) {
   if(/(?:workspace:|file:|link:|portal:|\/Users\/|\/private\/|\/tmp\/)/u.test(range))throw new Error(`${pkg.name}: nonportable ${kind} ${name} ${range}`);
   if(name.startsWith('@unofficial-krds/')&&(!names.has(name)||!internalRange(names.get(name),range)))throw new Error(`${pkg.name}: original packed internal range ${name}@${range} rejects candidate ${names.get(name)}`);
   if(forbidden.test(`"${name}"`))throw new Error(`${pkg.name}: test tool runtime dependency ${name}`);
  }
  const normalizedFiles=[...entries].sort(([a],[b])=>a.localeCompare(b)).map(([path,data])=>({path,size:data.length,sha256:hash(data)}));
  const normalizedContentSha256=hash(JSON.stringify(normalizedFiles));
  if(candidate.normalizedContentSha256&&candidate.normalizedContentSha256!==normalizedContentSha256)throw new Error(`Normalized content drift ${pkg.name}`);
  result.push({...candidate,sha256:hash(bytes),normalizedContentSha256,packedManifest:pkg,files:normalizedFiles});
 }
 if(!debug && manifest.scopes[scope].sourceFingerprint!==await fingerprint({scope,baseRoot}))throw blocked('Source changed during inspection');
 return {...manifest,inspectedScope:scope,inspectedPackageNames:result.map(candidate=>candidate.name),packages:result};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
 const scope=process.argv.find(arg=>arg.startsWith('--scope='))?.split('=')[1]??'all';if(scope==='all')await verify(root); const manifest=await json(join(root,scope==='all'?'artifacts/manifest.json':`artifacts/manifest-${scope}.json`)); const inspected=await inspect(manifest,{scope}); console.log(`Validated ${inspected.packages.length} tarballs, file/content hashes, original internal ranges, exports, types, CSS and notices.`);
}
