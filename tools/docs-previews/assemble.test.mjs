import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sha256 } from './contract.mjs';
import { writeArtifactManifest } from './manifest.mjs';
import { assemble, validateFrameworkReferences } from './assemble.mjs';
function fixture(componentId='button',{ranged=true}={}) {
 const root=mkdtempSync(join(tmpdir(),'preview-assemble-'));
 const put=(path,bytes)=>{mkdirSync(join(root,path,'..'),{recursive:true});writeFileSync(join(root,path),bytes)};
 put('catalog/full-catalog-contracts.json',JSON.stringify({items:[{id:componentId}]}));
 const bytes=Buffer.from('한\nexport const Example = 1;\n');
 put('example.ts',bytes); put('host.ts','mount(Example)');
 const range={start:0,end:3,startLine:1,endLine:1,sha256:sha256(bytes.subarray(0,3))};
 const definition={framework:'react',componentId,exampleId:'default',status:'playable',acceptanceId:componentId+'-default',classification:'interactive',sources:[{path:'example.ts',role:'example',language:'typescript',symbolOrBranch:'Example',...(ranged?{ranges:[range]}:{})}]};
 const definitions={schemaVersion:1,demos:[definition]};
 put('apps/docs/demo-definitions.json',JSON.stringify(definitions));
 put('apps/fixture-react/dist/docs-preview/index.html','<script type="module" src="/krds/previews/react/assets/main.js"></script>');
 put('apps/fixture-react/dist/docs-preview/assets/main.js','export const mounted = true;');
 const outputDir=join(root,'apps/fixture-react/dist/docs-preview');
 const original=path=>({path,sha256:sha256(readFileSync(join(root,path)))});
 const manifest=writeArtifactManifest({root,outputDir,framework:'react',definitions,bindings:[{componentId,exampleId:'default',entryUrl:`/krds/previews/react/index.html?component=${componentId}&example=default`,hostPath:'host.ts',sourcePath:'example.ts',symbolOrBranch:'Example',sha256:sha256(bytes),...(ranged?{ranges:[range]}:{})}],modules:{identity:{package:'@unofficial-krds/react',version:'0.1.0',renderer:'react-dom@19',compiler:'vite@8'},inputs:[{id:'compiled',package:'fixture-react',version:'0.0.0',sha256:sha256('compiled'),originals:[original('example.ts'),original('host.ts')]}]}});
 return {root,put,manifest,bytes};
}
test('deterministic allowlist copy preserves complete source bytes and exact ranges',()=>{
 const {root,put,bytes}=fixture(); put('apps/fixture-react/dist/docs-preview/private.txt','not declared');
 const first=assemble({root,frameworks:['react'],complete:false});
 assert.equal(first.length,1); assert.deepEqual(readFileSync(join(root,'apps/docs/public/demo-sources/example.ts.txt')),bytes);
 assert.equal(first[0].sources[0].ranges[0].sha256,sha256(bytes.subarray(0,3)));
 assert.throws(()=>readFileSync(join(root,'apps/docs/public/previews/react/private.txt')));
 assert.deepEqual(assemble({root,frameworks:['react'],complete:false}),first);
 assert.throws(()=>assemble({root,frameworks:['react'],complete:true}),/Complete assembly requires every framework/);
});
for(const variant of ['tampered source','missing source','escape','undeclared module','stale manifest','absent index','absent chunk','undeclared chunk']) test(`reject ${variant} before replacing published output`,()=>{
 const {root,put,manifest}=fixture(); put('apps/docs/public/previews/sentinel','keep');
 if(variant==='tampered source')put('example.ts','changed');
 if(variant==='missing source')rmSync(join(root,'example.ts'));
 if(variant==='escape')manifest.files[0].path='../escape';
 if(variant==='undeclared module')manifest.modules[0].originals=[];
 if(variant==='undeclared chunk')manifest.files=manifest.files.filter(f=>!f.path.endsWith('.js'));
 if(variant==='stale manifest')manifest.files[0].sha256='0'.repeat(64);
 if(variant==='absent index')rmSync(join(root,'apps/fixture-react/dist/docs-preview/index.html'));
 if(variant==='absent chunk')rmSync(join(root,'apps/fixture-react/dist/docs-preview/assets/main.js'));
 put('apps/fixture-react/dist/docs-preview/artifact-manifest.json',JSON.stringify(manifest));
 assert.throws(()=>assemble({root,frameworks:['react'],complete:false}));
 assert.equal(readFileSync(join(root,'apps/docs/public/previews/sentinel'),'utf8'),'keep');
});
for (const [name,path,content] of [
 ['CSS unquoted url','assets/main.css','@font-face{src:url(/krds/previews/react/assets/missing.woff2)}'],
 ['CSS import','assets/main.css','@import "missing.css";'],
 ['remote dynamic import','assets/main.js','import("https://example.com/runtime.js")'],
 ['wrong-prefix dynamic import','assets/main.js','import("/elsewhere/runtime.js")'],
 ['static import','assets/main.js','import "missing.js";'],
 ['export from','assets/main.js','export * from "./missing.js";'],
 ['URL constructor','assets/main.js','new URL("./missing.svg", import.meta.url)'],
 ['preload chunk table','assets/main.js','const deps=["assets/missing.js"];'],
 ['HTML srcset','extra.html','<img srcset="assets/missing.png 1x, assets/other.png 2x">'],
 ['HTML unquoted src','extra.html','<img src=assets/missing.png>'],
 ['HTML inline script','extra.html','<script>import("https://example.com/runtime.js")</script>'],
 ['HTML inline style','extra.html','<div style="background:url(assets/missing.png)"></div>'],
 ['CSS remote import','assets/main.css','@import url(https://example.com/style.css);'],
 ['CSS escaped url() argument','assets/main.css','a{background:url("\\2e\\2e/x.png")}'],
 ['CSS escaped unquoted url()','assets/main.css','a{background:url(\\2e\\2e/x.png)}'],
 ['CSS escaped src','assets/main.css','@font-face{src:\\75rl(x.woff2)}'],
 ['CSS escaped import','assets/main.css','@import "\\2e\\2e/x.css";'],
 ['CSS escaped import url','assets/main.css','@import url("\\2e\\2e/x.css");'],
 ['JS escaped import','assets/main.js','import("https:\\u002f\\u002fexample.com/runtime.js")'],
]) test(`reject ${name} omitted/remote dependency`,()=>{
 const {root,put,manifest}=fixture();
 const base='apps/fixture-react/dist/docs-preview/';
 put(base+path,content);
 manifest.files=manifest.files.filter(f=>f.path!==path);
 manifest.files.push({path,sha256:sha256(content),size:Buffer.byteLength(content)});
 put(base+'artifact-manifest.json',JSON.stringify(manifest));
 assert.throws(()=>assemble({root,frameworks:['react'],complete:false}),/artifact (?:dependency|reference)/);
});
test('accept declared emitted imports, CSS assets, srcset, canonical base and inert Qwik JSON',()=>{
 const {root,put,manifest}=fixture();
 const files={
  'assets/dep.js':'export const value = 1;',
  'assets/picture.svg':'<svg/>',
  'assets/font.woff2':'font',
  'assets/sheet.css':'@import "./more.css";@font-face{src:url(./font.woff2)} a{background:url("./picture.svg")}',
  'assets/more.css':'a{color:red}',
  'assets/main.js':'import "./dep.js";export * from "./dep.js";import(`./dep.js`);new URL("./picture.svg",import.meta.url);const deps=["assets/dep.js"];',
  'extra.html':'<base href="/krds/previews/react/"><link href="assets/sheet.css" rel="stylesheet"><img src=assets/picture.svg srcset="assets/picture.svg 1x, assets/picture.svg 2x"><script type="qwik/json">{"state":true}</script>',
 };
 for(const [path,content] of Object.entries(files)) {
  put('apps/fixture-react/dist/docs-preview/'+path,content);
  manifest.files=manifest.files.filter(f=>f.path!==path);
  manifest.files.push({path,sha256:sha256(content),size:Buffer.byteLength(content)});
 }
 put('apps/fixture-react/dist/docs-preview/artifact-manifest.json',JSON.stringify(manifest));
 assert.equal(assemble({root,frameworks:['react'],complete:false}).length,1);
});

test('accept plain CSS string escapes that carry no reference',()=>{
 const {root,put,manifest}=fixture();
 const path='assets/sheet.css', content='a::after{content:"\\2191";quotes:"\\201C" "\\201D";font-family:"\\B9D1\\C740  \\ACE0\\B515"} b::after{content:"\\2193"}';
 put('apps/fixture-react/dist/docs-preview/'+path,content);
 manifest.files=manifest.files.filter(f=>f.path!==path);
 manifest.files.push({path,sha256:sha256(content),size:Buffer.byteLength(content)});
 put('apps/fixture-react/dist/docs-preview/artifact-manifest.json',JSON.stringify(manifest));
 assert.equal(assemble({root,frameworks:['react'],complete:false}).length,1);
});

const missing='/krds/previews/react/local-assets/intentional-missing-image.svg';
function absentFixture(componentId,path,content,{acceptanceComponent='image',name='intentional-missing-image.svg'}={}) {
 const f=fixture(componentId), base='apps/fixture-react/dist/docs-preview/';
 f.put('apps/docs/demo-acceptance.json',JSON.stringify({items:[{componentId:acceptanceComponent,initialState:{src:'/local-assets/example-landscape.svg',failureSpecimen:{src:'/local-assets/'+name}}}]}));
 f.put(base+path,content);
 f.manifest.files=f.manifest.files.filter(x=>x.path!==path);
 f.manifest.files.push({path,sha256:sha256(content),size:Buffer.byteLength(content)});
 f.put(base+'artifact-manifest.json',JSON.stringify(f.manifest));
 return f;
}
test('tolerate acceptance-derived intentionally absent reference in HTML and JS, recorded on the registry row',()=>{
 for(const [path,content] of [['image/default/index.html',`<img src="${missing}">`],['assets/main.js',`export const s=["${missing}"];`]]) {
  const {root}=absentFixture('image',path,content);
  const rows=assemble({root,frameworks:['react'],complete:false});
  assert.deepEqual(rows[0].absentReferences,[missing]);
 }
});
test('absentReferences is recorded on the acceptance component row even when no reference is detected (runtime-built URLs)',()=>{
 const {root}=absentFixture('image','assets/other.js','export {};');
 assert.deepEqual(assemble({root,frameworks:['react'],complete:false})[0].absentReferences,[missing]);
});
test('no absentReferences field for a component the acceptance inventory does not name',()=>{
 const {root}=absentFixture('button','assets/other.js','export {};');
 assert.equal('absentReferences' in assemble({root,frameworks:['react'],complete:false})[0],false);
});
test('reject a different missing reference and one not derived from acceptance',()=>{
 for(const content of ['/krds/previews/react/local-assets/example-landscape.svg','/krds/previews/react/local-assets/other-missing.svg','/krds/previews/react/local-assets/intentional-missing-photo.svg','/krds/previews/vue/local-assets/intentional-missing-image.svg']) {
  const {root}=absentFixture('image','assets/main.js',`export const s=["${content}"];`);
  assert.throws(()=>assemble({root,frameworks:['react'],complete:false}),/undeclared artifact dependency/);
 }
});
test('reject the absent reference in another component example or when acceptance does not name the component',()=>{
 let f=absentFixture('image','button/default/index.html',`<img src="${missing}">`);
 assert.throws(()=>assemble({root:f.root,frameworks:['react'],complete:false}),/undeclared artifact dependency/);
 f=absentFixture('button','assets/main.js',`export const s=["${missing}"];`);
 assert.throws(()=>assemble({root:f.root,frameworks:['react'],complete:false}),/undeclared artifact dependency/);
 f=absentFixture('button','button/default/index.html',`<img src="${missing}">`,{acceptanceComponent:'button'});
 assert.equal(assemble({root:f.root,frameworks:['react'],complete:false})[0].absentReferences[0],missing);
});

test('ranged sources carry ranges and an exact hash-checked excerpt beside the full-file download',()=>{
 const {root,bytes}=fixture();
 const [row]=assemble({root,frameworks:['react'],complete:false});
 const excerpt={startLine:1,endLine:1,sha256:sha256(bytes.subarray(0,3)),downloadUrl:'/krds/demo-sources/example.ts.excerpt-0-3.txt'};
 assert.deepEqual(row.sources[0].excerpts,[excerpt]);
 assert.deepEqual(row.sources[0].ranges,[{start:0,end:3,startLine:1,endLine:1,sha256:excerpt.sha256}]);
 assert.deepEqual(readFileSync(join(root,'apps/docs/public/demo-sources/example.ts.excerpt-0-3.txt')),bytes.subarray(0,3));
 assert.deepEqual(readFileSync(join(root,'apps/docs/public/demo-sources/example.ts.txt')),bytes);
 const registry=JSON.parse(readFileSync(join(root,'apps/docs/public/demo-registry.json'),'utf8'));
 assert.deepEqual(registry[0].sources[0].excerpts,[excerpt]);
});
test('unranged sources stay full-file only, with no excerpt',()=>{
 const {root,bytes}=fixture('button',{ranged:false});
 const [row]=assemble({root,frameworks:['react'],complete:false});
 assert.equal('ranges' in row.sources[0],false); assert.equal('excerpts' in row.sources[0],false);
 assert.deepEqual(readFileSync(join(root,'apps/docs/public/demo-sources/example.ts.txt')),bytes);
});

test('CI stage validation shares the assembler policy: acceptance-derived absent HTML reference tolerated, others rejected',()=>{
 // Regression: the CI validator once called validateReferences without the acceptance
 // tolerance, so the qwik SSR image failure specimen passed locally and failed in CI.
 const read=root=>({manifest:JSON.parse(readFileSync(join(root,'apps/fixture-react/dist/docs-preview/artifact-manifest.json'),'utf8')),outputDir:join(root,'apps/fixture-react/dist/docs-preview'),definitions:JSON.parse(readFileSync(join(root,'apps/docs/demo-definitions.json'),'utf8')),acceptance:JSON.parse(readFileSync(join(root,'apps/docs/demo-acceptance.json'),'utf8'))});
 const ok=read(absentFixture('image','image/default/index.html',`<img src="${missing}">`).root);
 assert.deepEqual([...validateFrameworkReferences(ok.manifest,ok.outputDir,{framework:'react',definitions:ok.definitions,acceptance:ok.acceptance}).get('image')],[missing]);
 const other=read(absentFixture('image','image/default/index.html','<img src="/krds/previews/react/local-assets/other-missing.svg">').root);
 assert.throws(()=>validateFrameworkReferences(other.manifest,other.outputDir,{framework:'react',definitions:other.definitions,acceptance:other.acceptance}),/undeclared artifact dependency/);
 assert.throws(()=>validateFrameworkReferences(ok.manifest,ok.outputDir,{framework:'react',acceptance:ok.acceptance}),/needs the demo definitions/);
});
