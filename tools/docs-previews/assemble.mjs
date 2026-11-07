import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { frameworks as allowedFrameworks, intentionalAbsentReferences, loadAcceptance, readContained, sha256, validateArtifact, validateDefinitions, validateRegistry } from './contract.mjs';
const json = path => JSON.parse(readFileSync(path, 'utf8'));
// Assembly is a docs build operation; use its directly declared parser dependencies.
const requireDocs = createRequire(new URL('../../apps/docs/package.json', import.meta.url));
const ts = requireDocs('typescript');
const postcss = requireDocs('postcss');
const assetExtension = /\.(?:[cm]?js|css|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico|wasm|mp[34]|webm|ogg|wav)(?:[?#].*)?$/i;
function javascriptReferences(text, file) {
 const tree = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
 if (tree.parseDiagnostics.length) throw new Error(`${file}: unsupported artifact reference JavaScript syntax`);
 const refs = [];
 const literal = node => node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node));
 const add = node => { if (literal(node)) refs.push(node.text); };
 function visit(node) {
  if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) add(node.moduleSpecifier);
  if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) add(node.arguments[0]);
  if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'URL') add(node.arguments?.[0]);
  // Native bundler preload tables are literal arrays. Resolve them at artifact root when
  // they start with assets/ or build/, as Vite/Qwik's emitted preload tables do.
  if (ts.isArrayLiteralExpression(node)) for (const element of node.elements) if (literal(element) && assetExtension.test(element.text)) refs.push({ url: element.text, rootRelative: /^(?:assets|build)\//.test(element.text) });
  ts.forEachChild(node, visit);
 }
 visit(tree);
 return refs;
}
function cssReferences(text, file) {
 const refs = [];
 const urls = value => {
  // This bounded CSS URL grammar accepts quoted/unquoted URLs. Escaped URLs are
  // rejected rather than interpreted incompletely; emitted builders need none.
  for (const match of value.matchAll(/url\(\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|([^)]*))\s*\)/gi)) {
   const url=(match[1] ?? match[2] ?? match[3]).trim();
   if (url.includes('\\')) throw new Error(`${file}: unsupported escaped artifact reference`);
   refs.push(url);
  }
 };
 const tree = postcss.parse(text, { from: file });
 tree.walkDecls(decl=>{
  // Backslashes are plain string/identifier escapes (content, quotes, font-family) unless the
  // value is read for references: src, anything with a function that takes a URL, or escaped property names.
  if (decl.prop.includes('\\') || (decl.value.includes('\\') && (decl.prop.toLowerCase()==='src' || /url\(|image-set\(|src\(/i.test(decl.value)))) throw new Error(`${file}: unsupported escaped artifact reference CSS value`);
  urls(decl.value);
 });
 tree.walkAtRules(rule=>{
  const carriesUrl=['import','font-face','namespace'].includes(rule.name.toLowerCase()) || /url\(|image-set\(|src\(/i.test(rule.params);
  if (rule.name.includes('\\') || (carriesUrl && rule.params.includes('\\'))) throw new Error(`${file}: unsupported escaped artifact reference CSS rule`);
  urls(rule.params);
  if (rule.name.toLowerCase()==='import' && !/^\s*url\(/i.test(rule.params)) {
   const match=rule.params.match(/^\s*(["'])(.*?)\1/);
   if (!match || match[2].includes('\\')) throw new Error(`${file}: unsupported artifact reference CSS import`);
   refs.push(match[2]);
  }
 });
 return refs;
}
function htmlReferences(text, file, prefix) {
 const refs=[];
 const decode=value=>value.replace(/&(?:#(x[0-9a-f]+|[0-9]+)|(amp|quot|apos|lt|gt));/gi,(_,number,name)=>number?String.fromCodePoint(parseInt(number.replace(/^x/i,''),/^x/i.test(number)?16:10)):({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'})[name.toLowerCase()]);
 // Bounded emitted HTML grammar: comments, start/end tags and quoted/unquoted attributes.
 // Text inside script/style is parsed by its own language parser below.
 const stripped=text.replace(/<!--[\s\S]*?-->/g,'');
 const tags=stripped.replace(/<(script|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi,(_,kind,attrs,body)=>{
  if(kind.toLowerCase()==='style')refs.push(...cssReferences(body,file));
  else {
   const type=attrs.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
   const mime=(type?.[1]??type?.[2]??type?.[3]??'').toLowerCase();
   if(mime==='importmap')throw new Error(`${file}: unsupported artifact reference import map`);
   if(!mime || ['module','text/javascript','application/javascript'].includes(mime))refs.push(...javascriptReferences(body,file));
  }
  return `<${kind}${attrs}>`;
 });
 for(const tag of tags.matchAll(/<([a-z][a-z0-9:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)) {
  const isBase=tag[1].toLowerCase()==='base';
  if(isBase && !new RegExp(`^\\s*href=["']${prefix}["']\\s*$`).test(tag[2]))throw new Error(`${file}: unsupported artifact reference base element`);
  for(const attr of tag[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
   const name=attr[1].toLowerCase(), value=decode(attr[2]??attr[3]??attr[4]??'');
   if(name==='srcdoc')throw new Error(`${file}: unsupported artifact reference srcdoc`);
   if(!isBase && ['src','href','poster','data','background','action','formaction','xlink:href'].includes(name))refs.push(value);
   if(name==='style')refs.push(...cssReferences(`a{${value}}`,file));
   if(name==='srcset'||name==='imagesrcset') {
    // Data URLs contain commas and are deliberately unsupported in emitted srcset.
    if(/data:/i.test(value))throw new Error(`${file}: unsupported artifact reference data srcset`);
    refs.push(...value.split(',').map(candidate=>candidate.trim().split(/\s+/)[0]));
   }
  }
 }
 return refs;
}
/** `absent`: Map componentId -> allowed absent URLs. Returns Map componentId -> tolerated URLs actually referenced. */
export function validateReferences(manifest, outputDir, absent = new Map(), playableComponents = new Set(absent.keys())) {
 const tolerated = new Map();
 const paths = new Set(manifest.files.map(file => file.path));
 const prefix = `/krds/previews/${manifest.framework}/`;
 for (const file of manifest.files) {
  if (!/\.(?:html|js|mjs|css)$/.test(file.path)) continue;
  const text=readContained(outputDir,file.path).toString();
  const refs=file.path.endsWith('.html')?htmlReferences(text,file.path,prefix):file.path.endsWith('.css')?cssReferences(text,file.path):javascriptReferences(text,file.path);
  for (const reference of refs) {
   const ref=typeof reference==='string'?reference:reference.url;
   if (ref.startsWith('data:') || ref.startsWith('#')) continue;
   if (!ref || /[\\%&]/.test(ref) || /^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//')) throw new Error(`${file.path}: unsafe/remote artifact reference ${ref}`);
   const clean=ref.split(/[?#]/)[0];
   const target=clean.startsWith(prefix)?clean.slice(prefix.length):clean.startsWith('/')?null:reference.rootRelative?posix.normalize(clean):posix.normalize(posix.join(posix.dirname(file.path),clean));
   if (target && !paths.has(target)) {
    const url=prefix+target;
    const owner=[...absent].find(([componentId,urls])=>playableComponents.has(componentId)&&urls.includes(url)&&(file.path.endsWith('.html')?file.path.startsWith(`${componentId}/`):/\.m?js$/.test(file.path)));
    if (owner) { (tolerated.get(owner[0])??tolerated.set(owner[0],new Set()).get(owner[0])).add(url); continue; }
   }
   if (!target || !paths.has(target)) throw new Error(`${file.path}: undeclared artifact dependency ${ref}`);
  }
 }
 return tolerated;
}
/**
 * The one reference policy for a framework artifact, shared by the assembler and the CI stage
 * validator: references must resolve inside the manifest, except the acceptance-derived
 * intentionally absent URLs of that framework's playable components (e.g. the image failure
 * specimen). Validating with a narrower policy in one place and a wider one in the other
 * makes an artifact pass locally and fail in CI.
 */
export function validateFrameworkReferences(manifest, outputDir, { framework = manifest.framework, definitions, acceptance } = {}) {
 if (!definitions || !Array.isArray(definitions.demos)) throw new Error(`${framework}: reference validation needs the demo definitions`);
 const playable = new Set(definitions.demos.filter(d => d.framework === framework && d.status === 'playable').map(d => d.componentId));
 return validateReferences(manifest, outputDir, intentionalAbsentReferences(acceptance, framework), playable);
}
const labels = { react:'React', solid:'Solid 1', svelte:'Svelte', vue:'Vue', angular:'Angular', lit:'Lit', qwik:'Qwik', 'solid-next':'Solid 2' };
export function loadDefinitions({ root = process.cwd() } = {}) {
 const base=json(resolve(root,'apps/docs/demo-definitions.json'));
 for(const framework of allowedFrameworks) {
  const path=resolve(root,`apps/fixture-${framework}/src/docs-preview/definitions.json`);
  if(existsSync(path)) {
   const fragment=json(path);
   if(fragment.schemaVersion!==1 || !Array.isArray(fragment.demos) || fragment.demos.some(d=>d.framework!==framework)) throw new Error(`${path}: invalid framework fragment`);
   base.demos.push(...fragment.demos);
  }
 }
 return base;
}
/** All validation and input reads finish before generated destinations are removed. */
export function assemble({root=process.cwd(),frameworks=allowedFrameworks,complete=false}={}) {
 root=resolve(root);
 if(!Array.isArray(frameworks)||!frameworks.length||new Set(frameworks).size!==frameworks.length||frameworks.some(f=>!allowedFrameworks.includes(f)))throw new Error('Invalid framework selection');
 if(complete && (frameworks.length!==allowedFrameworks.length))throw new Error('Complete assembly requires every framework');
 const loaded=loadDefinitions({root});
 const definitions=complete?loaded:{schemaVersion:1,demos:loaded.demos.filter(d=>frameworks.includes(d.framework))};
 validateDefinitions(definitions,json(resolve(root,'catalog/full-catalog-contracts.json')),{complete});
 const acceptance=loadAcceptance(root);
 const selected=new Set(frameworks), copies=new Map(), sources=new Map(), registry=[];
 for(const framework of [...frameworks].sort()) {
  const rows=definitions.demos.filter(d=>d.framework===framework);
  const playable=rows.filter(d=>d.status==='playable');
  let manifest, artifactSha256, tolerated=new Map();
  if(playable.length) {
   const outputDir=resolve(root,`apps/fixture-${framework}/dist/docs-preview`);
   const manifestBytes=readContained(outputDir,'artifact-manifest.json');
   manifest=JSON.parse(manifestBytes.toString());
   if(manifest.framework!==framework)throw new Error(`${framework}: wrong artifact framework`);
   validateArtifact(manifest,definitions,{root,outputDir});
   tolerated=validateFrameworkReferences(manifest,outputDir,{framework,definitions,acceptance});
   artifactSha256=sha256(manifestBytes);
   for(const file of manifest.files)copies.set(`previews/${framework}/${file.path}`,readContained(outputDir,file.path));
   copies.set(`previews/${framework}/artifact-manifest.json`,manifestBytes);
  } else if(!rows.length) throw new Error(`${framework}: missing native definitions/artifact`);
  const packageMetadata=manifest?.identity ?? json(resolve(root,`packages/${framework}/package.json`));
  for(const d of rows) {
   const base={framework,componentId:d.componentId,exampleId:d.exampleId,label:labels[framework],channel:framework==='solid-next'?'preview':'stable',package:packageMetadata.package??packageMetadata.name,packageVersion:packageMetadata.version,status:d.status};
   if(d.status==='unavailable'){registry.push({...base,reason:d.reason});continue;}
   // Derived from the acceptance inventory for every framework row of the component; detection (above) only validates.
   const derivedAbsent=intentionalAbsentReferences(acceptance,framework);
   const bindings=manifest.bindings.filter(b=>b.componentId===d.componentId&&b.exampleId===d.exampleId);
   const urls=new Set(bindings.map(b=>b.entryUrl));
   if(urls.size!==1)throw new Error(`${framework}/${d.componentId}: inconsistent native entry URLs`);
   const sourceRecords=d.sources.map(source=>{
    const binding=bindings.find(b=>b.sourcePath===source.path);
    const bytes=readContained(root,source.path), target=`demo-sources/${source.path}.txt`;
    if(sha256(bytes)!==binding.sha256)throw new Error(`${source.path}: stale source`);
    if(sources.has(target)&&!sources.get(target).equals(bytes))throw new Error(`${source.path}: inconsistent source bytes`);
    sources.set(target,bytes);
    // Each range also ships as its exact bytes beside the full-file download, so pages show the
    // example symbol without inlining an all-components file.
    const excerpts=source.ranges?.map(range=>{
     const excerptTarget=`demo-sources/${source.path}.excerpt-${range.start}-${range.end}.txt`, excerptBytes=bytes.subarray(range.start,range.end);
     if(sources.has(excerptTarget)&&!sources.get(excerptTarget).equals(excerptBytes))throw new Error(`${source.path}: inconsistent excerpt bytes`);
     sources.set(excerptTarget,excerptBytes);
     return {startLine:range.startLine,endLine:range.endLine,sha256:range.sha256,downloadUrl:`/krds/${excerptTarget}`};
    });
    return {...source,sha256:binding.sha256,downloadUrl:`/krds/${target}`,...(excerpts?{excerpts}:{})};
   });
   registry.push({...base,entryUrl:[...urls][0],artifactSha256,minHeight:d.minHeight??(d.layout==='overlay'?640:240),layout:d.layout??'inline',sources:sourceRecords,acceptanceId:d.acceptanceId,classification:d.classification,...(derivedAbsent.has(d.componentId)?{absentReferences:[...derivedAbsent.get(d.componentId)].sort()}:{})});
  }
 }
 registry.sort((a,b)=>`${a.componentId}/${a.framework}/${a.exampleId}`.localeCompare(`${b.componentId}/${b.framework}/${b.exampleId}`));
 validateRegistry(registry,{schemaVersion:1,demos:definitions.demos.filter(d=>selected.has(d.framework))},{acceptance,readSource:url=>{const bytes=sources.get(url.replace(/^\/krds\//,''));if(!bytes)throw new Error(`${url}: unpublished source download`);return bytes;}});
 const publicDir=resolve(root,'apps/docs/public');
 for(const name of ['previews','demo-sources'])rmSync(resolve(publicDir,name),{recursive:true,force:true});
 for(const [path,bytes] of [...copies,...sources].sort(([a],[b])=>a.localeCompare(b))){const target=resolve(publicDir,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes);}
 mkdirSync(publicDir,{recursive:true});writeFileSync(resolve(publicDir,'demo-registry.json'),JSON.stringify(registry,null,2)+'\n');
 return registry;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const args=process.argv.slice(2), frameworks=[];
 for(let i=0;i<args.length;i++)if(args[i]==='--framework'){if(!args[i+1])throw new Error('--framework needs a value');frameworks.push(args[++i]);}else if(args[i]!=='--complete')throw new Error(`Unknown argument: ${args[i]}`);
 const complete=args.includes('--complete');
 const registry=assemble({frameworks:frameworks.length?frameworks:allowedFrameworks,complete});
 console.log(JSON.stringify({complete,frameworks:frameworks.length?frameworks:allowedFrameworks,entries:registry.length}));
}
