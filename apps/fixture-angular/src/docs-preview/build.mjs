import { readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sha256 } from '../../../../tools/docs-previews/contract.mjs';
import { writeArtifactManifest } from '../../../../tools/docs-previews/manifest.mjs';
const fixture=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const root=resolve(fixture,'../..');
const outputDir=resolve(fixture,'dist/docs-preview');
const definitions=JSON.parse(readFileSync(resolve(fixture,'src/docs-preview/definitions.json'),'utf8'));
const snapshots=new Map(definitions.demos.flatMap(d=>d.sources.map(s=>[s.path,readFileSync(resolve(root,s.path))])));
for(const name of readdirSync(resolve(fixture,'src/docs-preview')))if(/\.(ts|css|html)$/.test(name)){const path=relative(root,resolve(fixture,'src/docs-preview',name));if(!snapshots.has(path))snapshots.set(path,readFileSync(resolve(root,path)));}
const result=spawnSync(process.execPath,[resolve(fixture,'node_modules/@angular/cli/bin/ng.js'),'run','fixture-angular:docs-preview'],{cwd:fixture,stdio:'inherit',env:{...process.env,NG_CLI_ANALYTICS:'false',NG_BUILD_MAX_WORKERS:'2'}});
if(result.status!==0) { console.error({status:result.status,signal:result.signal,error:result.error}); process.exit(result.status??1); }
const stats=JSON.parse(readFileSync(resolve(outputDir,'browser-stats.json'),'utf8'));
function packageIdentity(path){let dir=dirname(path);while(dir.startsWith(root)){const file=resolve(dir,'package.json');if(existsSync(file)){const p=JSON.parse(readFileSync(file,'utf8'));return {package:p.name,version:p.version};}dir=dirname(dir);}throw new Error(`Missing package identity ${path}`);}
const inputs=[];
// Source maps are disabled (no third-party sourcesContent is redistributed), so the compiled sources are
// the byte snapshots taken before the build; the check below fails if any file changed while compiling.
const compilerSources=new Map(snapshots);

for(const [output,record] of Object.entries(stats.outputs)){
 const out=resolve(outputDir,output);
 if(!existsSync(out)) continue;
 for(const input of Object.keys(record.inputs??{})){
  const absolute=resolve(fixture,input), path=relative(root,absolute);
  if(!existsSync(absolute)) continue;
  const originals=path.includes('node_modules')?[]:[{path,sha256:sha256(compilerSources.get(path)??readFileSync(absolute))}];
  inputs.push({id:`${output}#${input}`,sha256:sha256(readFileSync(out)),originals,...packageIdentity(absolute)});
 }
}
for(const [path,bytes] of snapshots)if(sha256(bytes)!==sha256(readFileSync(resolve(root,path))))throw new Error(`Source changed during Angular compilation: ${path}`);
const bindings=definitions.demos.flatMap(d=>d.sources.map(s=>({componentId:d.componentId,exampleId:d.exampleId,hostPath:'apps/fixture-angular/src/docs-preview/main.ts',sourcePath:s.path,symbolOrBranch:s.symbolOrBranch,sha256:sha256(snapshots.get(s.path)),entryUrl:`/krds/previews/angular/index.html?component=${d.componentId}&example=default`})));
rmSync(resolve(outputDir,'browser-stats.json'));
writeArtifactManifest({framework:'angular',root,outputDir,definitions,bindings,modules:{identity:{package:'@unofficial-krds/angular',version:'0.1.0',renderer:'@angular/platform-browser@22.2.4',compiler:'@angular/build@22.2.5'},inputs}});
