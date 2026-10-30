#!/usr/bin/env node
/** Read-only acceptance of real executions. Never builds, publishes, pushes, tags or signs. */
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,realpathSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,dirname,isAbsolute,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const stable=['solid','react','svelte','vue','lit','qwik','angular'];
const pilots=['button','native-select','modal','tabs','date-input','calendar'];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const hex=value=>typeof value==='string'&&/^[a-f0-9]{64}$/u.test(value);
const nonempty=value=>typeof value==='string'&&value.trim().length>0;
const equalSet=(actual,expected)=>Array.isArray(actual)&&actual.length===expected.length&&new Set(actual).size===actual.length&&expected.every(item=>actual.includes(item));
export function milestones(checks){
 const combine=rows=>!rows.length?'blocked':rows.some(row=>row.status==='failed')?'failed':rows.every(row=>row.status==='passed')?'passed':'blocked';
 const M1=combine(checks.filter(row=>row.milestone==='M1')),M2=combine(checks.filter(row=>row.milestone==='M2'));
 const M3=combine([...checks.filter(row=>row.milestone==='M3'),{status:M1},{status:M2}]);
 return {M1,M2,M3,exitCode:M3==='passed'?0:1};
}
export function validateBinding(evidence,candidate){
 return ['sourceCommit','sourceFingerprint','repositorySourceSha256','lockfileSha256','artifactManifestSha256'].flatMap(key=>!candidate?.[key]||evidence?.[key]!==candidate[key]?[`missing/stale candidate ${key}`]:[]);
}
export function validateExecutedRows(rows,required){
 if(!Array.isArray(rows)||!rows.length)return ['zero/missing actual executed rows'];
 const errors=[];const ids=new Set();
 for(const row of rows){if(ids.has(row.id))errors.push(`duplicate outcome ${row.id}`);ids.add(row.id);if(row.status!=='passed'||row.executed!==true||row.exitCode!==0||row.skipped===true||!Array.isArray(row.observations)||!row.observations.length)errors.push(`missing actual passed outcome ${row.id}`);}
 for(const id of required)if(!ids.has(id))errors.push(`missing required outcome ${id}`);
 return errors;
}
export function validateBrowserRows(rows,requiredChecks=browserChecks.native){
 if(!Array.isArray(rows)||rows.length!==9)return ['all nine actual browser/timezone outcomes required'];
 const errors=[];const seen=new Set();
 for(const row of rows){const key=`${row.browser}:${row.timezoneId}`;if(seen.has(key))errors.push(`duplicate browser outcome ${key}`);seen.add(key);if(row.status!=='passed'||row.skipped===true||row.executed===false||row.exitCode!==undefined&&row.exitCode!==0||!nonempty(row.version)||!Array.isArray(row.checks)||!row.checks.length||!requiredChecks.every(check=>row.checks.includes(check)))errors.push(`missing actual browser outcome ${key}`);}
 for(const browser of ['chromium','firefox','webkit'])for(const timezone of ['UTC','Asia/Seoul','America/Los_Angeles'])if(!seen.has(`${browser}:${timezone}`))errors.push(`missing ${browser}:${timezone}`);
 return errors;
}
function safeFile(root,path){
 root=realpathSync(root);
 if(!nonempty(path)||path.includes('\\'))throw new Error('invalid evidence path');
 const full=resolve(root,path),rel=relative(root,full);
 if(rel==='..'||rel.startsWith('../')||isAbsolute(rel))throw new Error(`evidence escapes repository: ${path}`);
 const real=realpathSync(full),resolved=relative(root,real);
 if(resolved==='..'||resolved.startsWith('../')||!statSync(real).isFile())throw new Error(`evidence must be a repository file: ${path}`);
 return real;
}
export function validateSnapshot(root,snapshot,expected=inventorySnapshot(root)){
 const errors=[];
 if(!Array.isArray(snapshot?.files)||!snapshot.files.length)return ['empty/missing executed snapshot'];
 if(!equalSet(snapshot.files.map(file=>file.path),expected.files.map(file=>file.path)))errors.push('complete snapshot inventory/path set differs from current source');
 const normalized=files=>files.map(file=>[file.path,file.sha256,file.bytes]).sort(([a],[b])=>a.localeCompare(b));if(JSON.stringify(normalized(snapshot.files))!==JSON.stringify(normalized(expected.files)))errors.push('complete current snapshot record inventory differs from expected source/output');
 if(hash(JSON.stringify(snapshot.files))!==snapshot.sha256)errors.push('snapshot aggregate hash mismatch');
 const seen=new Set();
 for(const record of snapshot.files){
  try{if(seen.has(record.path))throw new Error('duplicate path');seen.add(record.path);const bytes=readFileSync(safeFile(root,record.path));if(!hex(record.sha256)||hash(bytes)!==record.sha256||record.bytes!==undefined&&record.bytes!==bytes.length)throw new Error('stale bytes');}
  catch(error){errors.push(`${record.path}: ${error.message}`);}
 }
 return errors;
}
export function inventorySnapshot(root){
 const records=[];
 function visit(path){for(const entry of readdirSync(resolve(root,path),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(['node_modules','.git'].includes(entry.name))continue;if(entry.isSymbolicLink())throw new Error('Source inventory symlink requires explicit producer handling');const next=path?`${path}/${entry.name}`:entry.name;if(entry.isDirectory())visit(next);else if(entry.isFile()){const bytes=readFileSync(resolve(root,next));records.push({path:next,sha256:hash(bytes),bytes:bytes.length});}}}
 visit('');return {files:records,sha256:hash(JSON.stringify(records))};
}
export function canonicalArtifactHandoff(input,inspected){
 for(const actual of inspected.packages){const original=input.packages.find(item=>item.name===actual.name);if(!original||!actual.files?.length||['files','packedManifest','sha256','normalizedContentSha256'].some(key=>JSON.stringify(original[key])!==JSON.stringify(actual[key])))throw new Error(`Tarball metadata/inventory differs from actual unpacked bytes: ${actual.name}`);}
 return inspected;
}
export function validateMatrixCommand(command,args,recordedNode,selectedNode=process.versions.node){
 const errors=[];if(process.versions.node!==selectedNode)errors.push('Verifier itself is not the selected Node');
 try{if(!Array.isArray(command)||realpathSync(command[0])!==realpathSync(process.execPath))errors.push('Recorded executable is not the selected Node identity');}catch{errors.push('Recorded executable identity unavailable');}
 if(JSON.stringify(command?.slice(1))!==JSON.stringify(args))errors.push('Recorded argv differs');
 if(recordedNode!==undefined&&recordedNode!==selectedNode)errors.push('Recorded Node version differs from selected version');
 return errors;
}
export async function collectRetainedStageInventory(report,directory,targets){
 const {collectStageEvidence}=await import('../tests/compatibility/stage-evidence.mjs');const records=new Map();
 for(const stage of report.stages??[]){if(!targets.includes(stage.framework))continue;if(!stage.artifactEvidence)throw new Error(`Missing actual retained stage evidence ${stage.framework}/${stage.name}`);
  const actual=await collectStageEvidence(stage.framework,stage.name,join(directory,stage.framework),report.sourceBeforeSha256);
  if(JSON.stringify(actual)!==JSON.stringify(stage.artifactEvidence))throw new Error('Recorded stage inventory differs from actual source-bound consumed artifacts');
  for(const record of [...actual.files,...actual.metadata])records.set(record.path,record);
 }
 if(!records.size)throw new Error('No genuine retained stage artifact inventory');return [...records.values()].sort((a,b)=>a.path.localeCompare(b.path));
}
export async function inspectIndexedEvidence(root,name,index,candidate,scopes={}){
 const {inspectReleaseEvidence}=await import('./release-evidence/producers.mjs');return inspectReleaseEvidence(root,name,index,candidate,scopes);
}
export function validateGitTree(root,tree,sourcePaths){
 const expected=new Map(tree.map(entry=>[entry.path,entry.oid]));const errors=[];
 for(const path of sourcePaths){if(!expected.has(path)){errors.push(`untracked candidate source: ${path}`);continue;}try{const bytes=readFileSync(safeFile(root,path));const oid=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');if(oid!==expected.get(path))errors.push(`candidate bytes differ from HEAD: ${path}`);}catch{errors.push(`missing HEAD source: ${path}`);}}
 for(const path of expected.keys())if(!sourcePaths.includes(path))errors.push(`deleted HEAD source: ${path}`);
 return errors;
}
export function selectScope(packages,scope){
 if(!['stable','preview','all'].includes(scope))throw new Error(`Unknown evidence scope ${scope}`);
 return packages.filter(item=>scope==='all'||(scope==='stable'?item.name!=='@unofficial-krds/solid-next':['assets','contracts','fonts','styles','tokens','solid-next'].some(id=>item.name===`@unofficial-krds/${id}`)));
}
export async function inspectConsumerEvidence(root,report,scope,context){
 try{
  const {inspectConsumers}=await import('../tests/consumers/evidence.mjs');
  if(typeof inspectConsumers!=='function')return {status:'blocked',details:['Canonical consumer producer evidence validator is not implemented']};
  const result=await inspectConsumers(report,{scope,manifest:context.manifest,baseRoot:root});
  return {status:'passed',details:[`${scope} canonical consumer step/resolution/lock/installed-byte evidence validated`],paths:result?.paths??[]};
 }catch(error){return {status:error.code==='EVIDENCE_FAILED'?'failed':'blocked',details:[`Canonical ${scope} consumer evidence: ${error.message}`]};}
}
export function executionStatus({current,status,exitCode,skipped,executed}){
 if(!current||skipped===true||executed===false||status==='skipped'||status==='unsupported'||status===undefined)return 'blocked';
 if(status==='failed'||Number.isInteger(exitCode)&&exitCode!==0)return 'failed';
 return status==='passed'&&exitCode===0?'passed':'blocked';
}
export function selectMatrixRun(root,kind,targets){
 const base=`test-results/t13/${kind}-runs`;
 if(!existsSync(join(root,base)))return {status:'blocked',details:[`Missing actual ${kind} matrix runs`]};
 for(const name of readdirSync(join(root,base)).sort().reverse()){
  if(!statSync(join(root,base,name)).isDirectory())continue;
  const path=`${base}/${name}/results.json`;
  if(!existsSync(join(root,path))){
   const before=`${base}/${name}/source-before.json`;
   if(existsSync(join(root,before))){try{const snapshot=JSON.parse(readFileSync(safeFile(root,before),'utf8'));const recorded=[...stable,'solid-next'].filter(id=>snapshot.files?.some(file=>file.path.startsWith(`packages/${id}/`)));if(recorded.length&&!targets.some(id=>recorded.includes(id)))continue;}catch{}}
   return {status:'blocked',details:[`Latest relevant matrix is unfinished/missing: ${path}`]};
  }
  try{const report=JSON.parse(readFileSync(safeFile(root,path),'utf8'));const recorded=report.options?.frameworks??report.rows?.map(row=>row.framework);if(!Array.isArray(recorded)||!recorded.length)return {status:'blocked',details:[`Latest matrix has no target identity: ${path}`]};if(!targets.some(id=>recorded.includes(id)))continue;return {status:'selected',path,report};}
  catch(error){return {status:'blocked',details:[`Latest matrix is unreadable: ${path}: ${error.message}`]};}
 }
 return {status:'blocked',details:[`No designated relevant ${kind} matrix`]};
}
export function scopedSnapshot(snapshot,targets){
 const foreign=[...stable,'solid-next'].filter(id=>!targets.includes(id));
 const files=snapshot.files.filter(file=>!foreign.some(id=>file.path.startsWith(`packages/${id}/`)||file.path.startsWith(`apps/fixture-${id}/`)));
 return {files,sha256:hash(JSON.stringify(files))};
}
const browserChecks={
 native:['DOM-free official server rendering','SSR node reuse','first button one event','first select one event','date-only canonical form value','label/tab IDs','open-modal unmount cleanup','no page/hydration errors','no remote requests'],
 qwik:['production SSR serialization','cold render QRL','first action one event','SSR native node retained','first select one event','date-only form','open-modal unmount cleanup','zero page errors/remote requests'],
 angular:['official partial APF CLI SSR','provideClientHydration node reuse','OnPush zoneless first click one event','Reactive Forms select/date controls','date-only FormData','tabs linked state','open-modal application destroy cleanup','no errors/remote requests']
};
function sourceTree(root){
 const records=[];
 const omit=new Set(['node_modules','.git','.nx','.yarn','.angular','.svelte-kit','.vite','dist','test-results','coverage','__screenshots__','.DS_Store']);
 function visit(path){if(!existsSync(resolve(root,path)))return;const info=statSync(resolve(root,path));if(info.isDirectory()){for(const entry of readdirSync(resolve(root,path),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(omit.has(entry.name)||entry.isSymbolicLink()||path==='docs'&&['execution','releases'].includes(entry.name))continue;visit(`${path}/${entry.name}`);}}else if(info.isFile())records.push([path,hash(readFileSync(resolve(root,path)))]);}
 for(const path of ['package.json','yarn.lock','.yarnrc.yml','nx.json','PLAN.md','packages','apps','catalog','compatibility','compliance','specs','tests','tools','docs','.github','LICENSES','LICENSE.md','ATTRIBUTION.md'])visit(path);
 return {sha256:hash(JSON.stringify(records)),fileCount:records.length,paths:records.map(([path])=>path)};
}
export async function verifyRelease(root,{write=true}={}){
 root=realpathSync(root);const checks=[],evidence=[];
 const read=path=>JSON.parse(readFileSync(safeFile(root,path),'utf8'));
 const digest=path=>hash(readFileSync(safeFile(root,path)));
 const record=(id,milestone,status,details,paths=[])=>{checks.push({id,milestone,status,details});for(const path of paths){try{evidence.push({path:relative(root,safeFile(root,path)),sha256:digest(path)});}catch{}}};
 async function gate(id,milestone,action){try{const result=await action();record(id,milestone,'passed',result?.details??'Validated actual evidence',result?.paths??[]);}catch(error){record(id,milestone,error.code==='ENOENT'||error.code==='EVIDENCE_BLOCKED'?'blocked':error.blocked?'blocked':'failed',[error.message]);}}
 const blocked=message=>{const error=new Error(message);error.blocked=true;throw error;};
 const toolchain=read('compatibility/toolchain.json'),identity=read('compliance/project-identity.json');
 const sourceBefore=sourceTree(root);
 const git=spawnSync('git',['rev-parse','--verify','HEAD'],{cwd:root,encoding:'utf8'});
 const sourceCommit=git.status===0?git.stdout.trim():null;
 const {fingerprint}=await import('../tests/consumers/lib.mjs');
 let currentFingerprint=null;try{currentFingerprint=await fingerprint();}catch{}
 const candidate={sourceCommit,sourceFingerprint:currentFingerprint,repositorySourceSha256:sourceBefore.sha256,repositorySourceFileCount:sourceBefore.fileCount,lockfileSha256:digest('yarn.lock'),artifactManifestSha256:existsSync(join(root,'artifacts/manifest.json'))?digest('artifacts/manifest.json'):null};
 const publicPackages=readdirSync(join(root,'packages')).filter(dir=>existsSync(join(root,'packages',dir,'package.json'))).map(dir=>({dir,pkg:read(`packages/${dir}/package.json`)})).filter(({pkg})=>!pkg.private);
 const stableVersions=[...new Set(publicPackages.filter(item=>item.dir!=='solid-next').map(item=>item.pkg.version))];
 const version=stableVersions.length===1?stableVersions[0]:'inconsistent-versions';
 if(!/^[0-9A-Za-z.-]+$/u.test(version))throw new Error('Unsafe candidate version');
 const releaseDir=`docs/releases/${version}`;
 await gate('selected-toolchain','M3',()=>{if(process.versions.node!==toolchain.node.version)throw new Error(`Selected Node ${toolchain.node.version} required; received ${process.versions.node}`);if(read('package.json').packageManager!==toolchain.packageManager.packageManagerField||!/^nodeLinker: pnpm$/mu.test(readFileSync(join(root,'.yarnrc.yml'),'utf8')))throw new Error('Pinned Yarn/nodeLinker differs');return {paths:['compatibility/toolchain.json','yarn.lock','.yarnrc.yml']};});
 await gate('candidate-commit','M3',()=>{if(!sourceCommit)blocked('HEAD is unborn: no real candidate commit. Content hashes are diagnostic only; no commit was created.');if(process.env.KRDS_RELEASE_SOURCE_SHA&&sourceCommit!==process.env.KRDS_RELEASE_SOURCE_SHA)throw new Error('Candidate differs from requested CI source SHA');
  const listing=spawnSync('git',['-c','core.fsmonitor=false','ls-tree','-rz','--full-tree',sourceCommit],{cwd:root,encoding:'utf8'});if(listing.status!==0)blocked('Cannot inspect reviewed HEAD tree');
  const tree=listing.stdout.split('\0').filter(Boolean).map(line=>{const [metadata,path]=line.split('\t');return {path,oid:metadata.split(' ')[2]};}).filter(entry=>sourceBefore.paths.includes(entry.path));
  const relation=validateGitTree(root,tree,sourceBefore.paths);if(relation.length)blocked(`Candidate is not the reviewed clean HEAD tree; no reproducible version-plan transform is implemented: ${relation.slice(0,8).join('; ')}`);
  const generated=path=>/^(?:docs\/releases\/|artifacts\/|test-results\/|\.nx\/|\.superpowers\/|\.agents\/|\.codex\/|\.aws\/)/u.test(path);
  const changed=spawnSync('git',['-c','core.fsmonitor=false','diff','--name-only','--no-ext-diff',sourceCommit],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});if(changed.status!==0||changed.stdout.trim().split('\n').filter(Boolean).some(path=>!generated(path)))blocked('Candidate tracked source/worktree differs from reviewed HEAD');
  const untracked=spawnSync('git',['-c','core.fsmonitor=false','ls-files','--others','--exclude-standard'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});if(untracked.status!==0||untracked.stdout.trim().split('\n').filter(Boolean).some(path=>!generated(path)))blocked('Candidate has untracked source outside reviewed HEAD');
  return {details:[`Reviewed HEAD source bytes match ${sourceCommit}`]};});
 await gate('stable-catalog-native-stories-requests-behavior','M1',async()=>{const {inspectCoverage}=await import('./check-coverage.mjs');const result=inspectCoverage(root);if(result.errors.length||result.stablePairs!==378||result.acceptedPairs!==378)blocked(`Existing actual coverage gate lacks accepted evidence: ${result.acceptedPairs}/${result.stablePairs} accepted; ${result.errors.length} gaps. ${result.errors.slice(0,12).join('; ')}`);return {details:[result],paths:['catalog/coverage.json','catalog/story-coverage.json','catalog/full-catalog-story-coverage.json']};});
 const manifests={};
 async function inspectArtifacts(scope){
  const path=scope!=='all'&&existsSync(join(root,`artifacts/manifest-${scope}.json`))?`artifacts/manifest-${scope}.json`:'artifacts/manifest.json';
  const manifest=read(path);
  if(manifest.debugOnly||manifest.status==='debug-only-source-not-accepted'||manifest.releaseAuthorized!==false)throw new Error('Debug/unauthorized artifact inventory cannot satisfy acceptance');
  const selectedSource=selectScope(publicPackages.map(({pkg})=>pkg),scope);const expectedNames=selectScope([...stable,'solid-next','assets','contracts','fonts','styles','tokens'].map(id=>({name:`@unofficial-krds/${id}`})),scope).map(item=>item.name);if(!equalSet(selectedSource.map(item=>item.name),expectedNames))blocked(`Missing ${scope} public source identity`);if(!Array.isArray(manifest.packages)||!selectedSource.every(pkg=>manifest.packages.filter(item=>item.name===pkg.name&&item.version===pkg.version).length===1))blocked(`Missing ${scope} candidate identities/versions`);
  if(!manifest.scopes?.[scope])blocked(`Canonical ${scope} source/build/artifact attestation is missing; global all13 fingerprint cannot substitute`);
  const {inspect}=await import('./inspect-tarballs.mjs');const inspected=await inspect(manifest,{scope});manifests[scope]=canonicalArtifactHandoff(manifest,inspected);
  const selected=selectScope(manifest.packages,scope);
  if(inspected.packages.length!==selected.length)throw new Error(`Artifact inspector has not implemented required ${scope} isolation`);
  return {paths:[path,...(manifest.scopes[scope].buildEvidence?.path?[manifest.scopes[scope].buildEvidence.path]:[]),...selected.map(item=>item.tarball)],details:[`${selected.length} actual ${scope} tarballs inspected against current source/build bytes`]};
 }
 await gate('stable-actual-candidate-tarballs','M1',()=>inspectArtifacts('stable'));
 await gate('preview-actual-candidate-tarballs','M2',()=>inspectArtifacts('preview'));
 await gate('all-actual-candidate-tarballs','M3',()=>inspectArtifacts('all'));
 await gate('stable-outside-tarball-consumers','M1',()=>checkConsumers('stable'));
 await gate('preview-outside-tarball-consumer','M2',()=>checkConsumers('preview'));
 await gate('all-outside-tarball-consumers','M3',()=>checkConsumers('all'));
 async function checkConsumers(scope){
  const path=scope!=='all'&&existsSync(join(root,`artifacts/consumer-results-${scope}.json`))?`artifacts/consumer-results-${scope}.json`:'artifacts/consumer-results.json';
  const report=read(path);
  if(!manifests[scope])blocked(`Missing accepted ${scope} artifact evidence for consumers`);
  const result=await inspectConsumerEvidence(root,report,scope,{manifest:manifests[scope],candidate});
  if(result.status==='failed')throw new Error(result.details.join('; '));
  if(result.status!=='passed')blocked(result.details.join('; '));
  return result;
 }
 async function matrix(kind,targets){
  const selected=selectMatrixRun(root,kind,targets);if(selected.status!=='selected')blocked(selected.details.join('; '));
  const {path,report}=selected,directory=dirname(path);
  const {snapshot}=await import('../tests/compatibility/evidence.mjs');
  const expected=await snapshot(targets),before=read(`${directory}/source-before.json`),after=read(`${directory}/source-after.json`);
  if(report.sourceBeforeSha256!==before.sha256||report.sourceAfterSha256!==after.sha256||hash(JSON.stringify(before.files))!==before.sha256||hash(JSON.stringify(after.files))!==after.sha256)blocked(`Selected ${kind} run lacks intact recorded snapshots: ${path}`);
  const scopedBefore=scopedSnapshot(before,targets),scopedAfter=scopedSnapshot(after,targets);
  if(scopedBefore.sha256!==scopedAfter.sha256)blocked(`Selected ${kind} target source changed during run: ${path}`);
  const drift=validateSnapshot(root,scopedAfter,expected);if(drift.length)blocked(`Selected ${kind} run is stale/incomplete; no older fallback: ${drift.slice(0,4).join('; ')}`);
  function requireExecution(execution,label,codeKey='exitCode',expectedArgs){
   if(!execution?.command?.length||!execution.log||!hex(execution.logSha256))blocked(`Selected ${kind} execution receipt missing: ${label}`);
   const identity=validateMatrixCommand(execution.command,expectedArgs,kind==='ssr'?report.node:undefined,toolchain.node.version);if(identity.length)blocked(`Selected ${kind} execution identity differs: ${label}: ${identity.join('; ')}`);
   const bytes=readFileSync(safeFile(root,execution.log));if(!bytes.length||hash(bytes)!==execution.logSha256)blocked(`Selected ${kind} execution log empty/stale: ${label}`);
   if(execution?.artifactError&&execution?.[codeKey]===0)blocked(`Selected ${kind} original retained evidence is incomplete: ${label}`);
   const outcome=executionStatus({current:true,status:execution?.status,exitCode:execution?.[codeKey],skipped:execution?.skipped,executed:execution?.executed});
   if(outcome==='failed')throw new Error(`Current actual ${kind} execution failed: ${label}`);
   if(outcome!=='passed'||!execution.command?.length||!execution.log||!hex(execution.logSha256))blocked(`Selected ${kind} execution missing/skipped: ${label}`);
  }
  if(kind==='compatibility'){
   if(report.scope!=='installed exact pins and consuming workspace types/production builds')blocked('Metadata-only compatibility audit is not actual types/build evidence');
   for(const target of targets){const rows=report.rows?.filter(row=>row.framework===target);if(rows?.length!==1)blocked(`Selected compatibility matrix lacks ${target}`);const row=rows[0];for(const name of ['package-types','package-build','fixture-types','fixture-build']){const workspace=read(name.startsWith('package')?`packages/${target}/package.json`:`apps/fixture-${target}/package.json`).name;requireExecution(row.checks?.find(check=>check.kind===name),`${target}/${name}`,'exitCode',['tools/yarn.mjs','workspace',workspace,name.endsWith('types')?'typecheck':'build:local']);}if(row.status==='failed')throw new Error(`Current actual compatibility row failed: ${target}`);if(row.status!=='passed')blocked(`Unexecuted compatibility row: ${target}`);}
  }else{
   if(!targets.every(target=>report.options?.frameworks?.includes(target))||!equalSet(report.options?.browsers?.split(','),['chromium','firefox','webkit'])||!equalSet(report.options?.timezones?.split(','),['UTC','Asia/Seoul','America/Los_Angeles']))blocked('Selected SSR target/browser/timezone matrix is incomplete');
   for(const target of targets){const stages=report.stages?.filter(stage=>stage.framework===target)??[];for(const stage of stages){const args=stage.name==='native-server-hydration'?['tests/ssr/native.mjs',target]:stage.name==='production-build'?['tools/yarn.mjs','workspace','@unofficial-krds/fixture-qwik','build:local']:stage.name==='precise-resume'?['tests/ssr/qwik/resume.mjs']:stage.name==='cross-browser-resume'?['tests/ssr/qwik/cross-browser.mjs']:stage.name==='partial-apf-ssr'?['tests/ssr/angular/verify.mjs']:['tests/ssr/angular/hydration.mjs'];requireExecution(stage,`${target}/${stage.name}`,'code',args);}}
   const artifacts=read(`${directory}/tested-artifacts.json`);let retained;try{retained=await collectRetainedStageInventory(report,resolve(root,directory),targets);}catch(error){blocked(`Selected SSR actual retained stage evidence invalid: ${error.message}`);}
   const expectedArtifacts=await snapshot(targets,{outputs:true,artifactRoots:retained.map(file=>file.path)});const foreign=[...stable,'solid-next'].filter(id=>!targets.includes(id));const selectedArtifacts=scopedSnapshot({...artifacts,files:artifacts.files.filter(file=>!foreign.some(id=>file.path.startsWith(`${directory}/${id}/`)))},targets);
   if(report.testedArtifactsSha256!==artifacts.sha256||hash(JSON.stringify(artifacts.files))!==artifacts.sha256||validateSnapshot(root,selectedArtifacts,expectedArtifacts).length)blocked('Selected SSR tested output inventory is stale/incomplete');
   for(const target of targets){const stages=report.stages?.filter(stage=>stage.framework===target);const names=target==='qwik'?['production-build','precise-resume','cross-browser-resume']:target==='angular'?['partial-apf-ssr','native-hydration']:['native-server-hydration'];for(const name of names){const args=name==='native-server-hydration'?['tests/ssr/native.mjs',target]:name==='production-build'?['tools/yarn.mjs','workspace','@unofficial-krds/fixture-qwik','build:local']:name==='precise-resume'?['tests/ssr/qwik/resume.mjs']:name==='cross-browser-resume'?['tests/ssr/qwik/cross-browser.mjs']:name==='partial-apf-ssr'?['tests/ssr/angular/verify.mjs']:['tests/ssr/angular/hydration.mjs'];requireExecution(stages?.find(stage=>stage.name===name),`${target}/${name}`,'code',args);}
    const browserStage=stages.find(stage=>stage.name===(target==='qwik'?'cross-browser-resume':target==='angular'?'native-hydration':'native-server-hydration'));
    const raw=readFileSync(safeFile(root,browserStage.log),'utf8').trim().split(/\r?\n/u).reverse().flatMap(line=>{try{const value=JSON.parse(line);return Array.isArray(value)?[value]:Array.isArray(value.results)?[value.results]:[];}catch{return [];}})[0];
    const outcomes=validateBrowserRows(raw,browserChecks[target==='qwik'?'qwik':target==='angular'?'angular':'native']);if(outcomes.length)blocked(`${target} actual browser evidence invalid: ${outcomes.join('; ')}`);
   }
  }
  return {paths:[path,`${directory}/source-before.json`,`${directory}/source-after.json`,...(kind==='ssr'?[`${directory}/tested-artifacts.json`]:[])],details:[`Designated latest exact ${kind} execution and complete current inventories validated`,...targets]};
 }
 for(const [channel,targets]of [['M1',stable],['M2',['solid-next']]]){await gate(`${channel}-compatibility-types-build`,channel,()=>matrix('compatibility',targets));await gate(`${channel}-ssr-hydration-browser-timezones`,channel,()=>matrix('ssr',targets));}
 await gate('preview-exact-rc-six-native-pilots','M2',()=>{const pkg=read('packages/solid-next/package.json');for(const name of ['solid-js','@solidjs/web'])if(pkg.peerDependencies?.[name]!=='2.0.0-rc.19'||pkg.devDependencies?.[name]!=='2.0.0-rc.19')throw new Error(`Preview exact RC19 runtime differs: ${name}`);for(const name of ['@solidjs/compiler','@solidjs/babel-plugin'])if(pkg.devDependencies?.[name]!=='2.0.0-rc.19')throw new Error(`Preview exact RC19 compiler differs: ${name}`);for(const id of pilots)if(!pkg.exports?.[`./${id}`])throw new Error(`Preview lacks public native pilot ${id}`);if(!/six[- ](?:pilot|component)/iu.test(readFileSync(join(root,'packages/solid-next/README.md'),'utf8')))throw new Error('Public preview six-pilot limitation absent');return {paths:['packages/solid-next/package.json','packages/solid-next/README.md','catalog/COVERAGE.md']};});
 // Additional acceptance is indexed and hash-bound only when actual producers finish.
 // An index alone never awards a gate: every referenced report needs actual outcomes/logs.
 let index;
 try{index=read(`${releaseDir}/acceptance-evidence.json`);}catch{}
 async function indexed(name){
  const result=await inspectIndexedEvidence(root,name,index,candidate,Object.fromEntries(Object.entries(manifests).map(([scope,manifest])=>[scope,manifest.scopes[scope]])));
  if(result.status==='failed')throw new Error(result.details.join('; '));
  if(result.status!=='passed')blocked(result.details.join('; '));
  return result;
 }
 await gate('preview-six-native-behavior-types-build-ssr','M2',()=>indexed('preview','exact-rc19-six-pilot-acceptance',pilots.flatMap(id=>['native-behavior','types','build','ssr'].map(check=>`${id}:${check}`))));
 await gate('native-service-compositions','M1',()=>indexed('patterns','native-pattern-acceptance',stable.flatMap(id=>['application','search','consent','layout'].map(flow=>`${id}:${flow}`))));
 await gate('manual-accessibility','M1',()=>indexed('manualAccessibility'));
 await gate('independent-native-artifact-review','M3',()=>indexed('independentReview','independent-release-review',['native-boundaries','catalog-completeness','actual-tarballs','licenses','ssr','user-flows']));
 await gate('candidate-ci-required-executions','M3',()=>indexed('ci','candidate-ci-executions',['immutable-install','build','typecheck','test','lint','nx-affected','cache-restoration','story-network-policy','required-siheom']));
 await gate('documentation-and-versioning','M3',()=>indexed('documentation','release-documentation-review',['installation','compatibility','license-provenance','known-limitations','extension-guide','version-changelog']));
 await gate('licenses-provenance-distribution','M3',async()=>{const {verify}=await import('./verify-licenses.mjs');await verify(root);return {paths:['compliance/project-identity.json','compliance/provenance.json','compliance/license-policy.json'].filter(path=>existsSync(join(root,path)))};});
 await gate('ownership-and-independent-code-grant','M3',()=>{if(identity.scopeOwnership?.status!=='confirmed'||identity.repository?.ownershipVerified!==true)blocked('npm scope and repository ownership remain unauthenticated; user-selected names/URL are not ownership evidence');if(identity.copyright?.status!=='confirmed'||identity.copyright.independentCodeHolder!=='Lee Dogeon <dev.moreal@gmail.com>')throw new Error('Confirmed independent-code rights differ');return {paths:['compliance/project-identity.json','LICENSES/MIT.txt']};});
 await gate('version-changelog-candidate','M3',()=>{if(stableVersions.length!==1||version==='0.0.0')blocked(`Actual release version is not prepared (${stableVersions.join(', ')})`);for(const {dir,pkg}of publicPackages){const path=`packages/${dir}/CHANGELOG.md`;if(!existsSync(join(root,path))||!readFileSync(join(root,path),'utf8').includes(pkg.version))blocked(`Missing actual version ${pkg.version} changelog: ${path}`);}return {details:publicPackages.map(({pkg})=>`${pkg.name}@${pkg.version}`)};});
 await gate('ci-candidate-handoff','M3',()=>{const path=process.env.KRDS_RELEASE_EVIDENCE_DIRECTORY?`${process.env.KRDS_RELEASE_EVIDENCE_DIRECTORY}/candidate.json`:'test-results/ci/candidate.json';const ci=read(path);if(ci.sourceSha!==sourceCommit||!sourceCommit||ci.lockfileSha256!==candidate.lockfileSha256||ci.artifactManifestSha256!==candidate.artifactManifestSha256||ci.publicationAuthorized!==false)throw new Error('CI candidate is missing/stale/cross-source or authorizes publication');if(digest(`${dirname(path)}/candidate.tgz`)!==ci.archiveSha256)throw new Error('CI candidate archive drift');return {paths:[path]};});
 const after=sourceTree(root);if(after.sha256!==sourceBefore.sha256)record('source-drift-during-verification','M3','blocked',['Source changed while verifier inspected evidence; rerun after source freeze']);
 const result={schemaVersion:1,kind:'release-verification',status:'intermediate',createdAt:new Date().toISOString(),command:'node tools/yarn.mjs verify:release',candidate,version,packages:publicPackages.map(({pkg})=>({name:pkg.name,version:pkg.version,channel:pkg.name.endsWith('/solid-next')?'solid2-preview':'stable'})),krdsBaselineId:identity.krdsBaselineId,environment:{node:process.versions.node,yarn:toolchain.packageManager.version,platform:process.platform,arch:process.arch},...milestones(checks),checks,evidence,publicationAuthorized:false,publicationPerformed:false,limitations:['Passing this verifier prepares a reviewable candidate only; publication, pushing and tagging require separate authorization.','Unborn HEAD and content hashes never substitute for a real candidate commit.']};
 result.status=result.M3==='passed'?'verified-candidate':'intermediate';
 if(write){mkdirSync(join(root,releaseDir),{recursive:true});writeFileSync(join(root,releaseDir,'verification.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(join(root,releaseDir,'verification.exit-code.txt'),`${result.exitCode}\n`);writeFileSync(join(root,releaseDir,'artifacts.json'),JSON.stringify({status:result.status,candidate,packages:manifests.all?.packages??[],scopes:manifests,evidence,publicationAuthorized:false},null,2)+'\n');writeFileSync(join(root,releaseDir,'verification.md'),`# Intermediate release verification: ${version}\n\nM1: **${result.M1}**. M2: **${result.M2}**. M3: **${result.M3}**. Exit code: **${result.exitCode}**.\n\nCandidate commit: ${sourceCommit??'unavailable (unborn HEAD)'}. Diagnostic source fingerprint: \`${currentFingerprint}\`.\n\n${checks.map(check=>`- ${check.id}: **${check.status}** — ${typeof check.details==='string'?check.details:JSON.stringify(check.details)}`).join('\n')}\n\nFull machine evidence: [verification.json](./verification.json). This intermediate report does not declare T16 or release preparation complete.\n`);}
 if(write){
  const frameworks=read('compatibility/frameworks.json').frameworks;
  writeFileSync(join(root,releaseDir,'compatibility.md'),`# Candidate compatibility — ${version}\n\nStatus: **${result.status}**. M1: **${result.M1}**; M2: **${result.M2}**. Declared pins below are targets; the actual execution gates remain authoritative in [verification.json](./verification.json).\n\n| Framework | Channel | Exact declared pins |\n| --- | --- | --- |\n${frameworks.map(row=>`| ${row.id} | ${row.id==='solid-next'?'six-pilot RC19 preview':'stable target'} | ${Object.entries(row.pins).map(([name,pin])=>`${name}@${pin}`).join(', ')} |`).join('\n')}\n\nSolid 2 covers only Button, NativeSelect, Modal, Tabs, DateInput and Calendar with exact 2.0.0-rc.19 runtime/compiler. Full stable catalog support and unsupported siheom adapters are not implied. Chromium/Firefox/WebKit and UTC/Asia/Seoul/America/Los_Angeles results require current native matrix snapshots; metadata-only audits do not pass. Authentic assistive-technology, media-equivalence, real zoom, forced-colors and visibility review remains separate.\n`);
  writeFileSync(join(root,releaseDir,'licenses.md'),`# Candidate rights and provenance — ${version}\n\nStatus: **${result.status}**. The actual license/provenance and ownership gates are preserved in [verification.json](./verification.json).\n\nIndependent project code has the completed 2026 MIT grant for Lee Dogeon <dev.moreal@gmail.com> in LICENSES/MIT.txt. It does not relicense original KRDS, derived assets or font materials. Preserve compliance/provenance.json, the compliance license policy and each actual tarball's LICENSE.md, ATTRIBUTION.md, THIRD-PARTY-NOTICES.md, LICENSES/ and provenance.json. Original KRDS provider attribution remains separate.\n\nSelected metadata scope: ${identity.localPackageScope}. Repository: ${identity.repository.releaseMetadataRepositoryUrl}. Ownership status: ${identity.scopeOwnership.status}; repository authenticated: ${identity.repository.ownershipVerified===true}. Naming intent, local notice verification and local packing do not authorize publication, pushing or tagging.\n`);
  writeFileSync(join(root,releaseDir,'release-summary.md'),`# Candidate handoff — ${version}\n\nStatus: **${result.status}**. M1: **${result.M1}**, M2: **${result.M2}**, M3: **${result.M3}**; process exit **${result.exitCode}**. This report documents current evidence and does not make incomplete release preparation complete.\n\nCandidate commit: ${sourceCommit??'unavailable (unborn HEAD)'}. Public source/build fingerprint: ${candidate.sourceFingerprint}. Lockfile: ${candidate.lockfileSha256}. Exact candidate artifact manifest: ${candidate.artifactManifestSha256??'missing'}. KRDS baseline: ${result.krdsBaselineId}. Environment: Node ${result.environment.node}, Yarn ${result.environment.yarn}, ${result.environment.platform}/${result.environment.arch}.\n\n${result.packages.map(pkg=>`- ${pkg.name}@${pkg.version} (${pkg.channel})`).join('\n')}\n\nInstall only inspected candidate tarballs after outside consumer acceptance. Example same-framework public import: import { Button } from '@unofficial-krds/react/button'; follow that package README for CSS and optional fonts. This document does not claim registry availability. License/source locations are described in [licenses.md](./licenses.md); declared targets and limits in [compatibility.md](./compatibility.md).\n\nReproduce the frozen candidate using .github/workflows/release-prepare.yml: immutable Yarn install, actual full workspace/type/build/behavior/story/siheom and native matrix runs, regenerated notices, serialized pack:all --build, inspect:tarballs, all 15 outside consumers, authentic manual review, and candidate archive handoff. Then run node tools/yarn.mjs verify:release. The verifier inspects existing executions without repeating broad native runs.\n\nOutstanding requirements:\n\n${checks.filter(check=>check.status!=='passed').map(check=>`- ${check.id}: ${check.status} — ${JSON.stringify(check.details)}`).join('\n')}\n\nNext-version work must preserve native renderer/compiler isolation and repeat the exact current-source evidence after catalog or support changes. No publication, pushing or tagging has been performed or authorized.\n`);
 }
 return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length!==2)throw new Error('Usage: node tools/yarn.mjs verify:release (no skipped gates or execution flags)');
 try{const result=await verifyRelease(resolve(import.meta.dirname,'..'));console.log(JSON.stringify(result,null,2));process.exitCode=result.exitCode;}catch(error){console.error(`Release verification failed before acceptance: ${error.stack}`);process.exitCode=1;}
}
