/** Deterministic artwork from the repository's original Pretendard GOV outlines. */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { create } from 'fontkitten';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '../../..');
const assetRoot = 'apps/docs/public/local-assets/branding';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const toolchain = await json('compatibility/toolchain.json');
assert.equal(process.versions.node, toolchain.node.version, 'Use node tools/yarn.mjs workspace @unofficial-krds/docs generate:branding');
const provenance = await json('packages/fonts/provenance.json');
const fontSpecs = [
  { weight: 700, name: 'Bold', sha256: 'd78ab7c3708fe868dcc5e3696281771b3cdc6a891de571f93331f98840d8941b' },
  { weight: 500, name: 'Medium', sha256: '0c72b4e0ab4d89a0b2bba4d92690d0a36609392611a1d2c366f842552627897d' },
];
const fonts = new Map(), sources = [];
for (const spec of fontSpecs) {
  const path = `packages/fonts/fonts/PretendardGOV-${spec.name}.woff2`;
  const bytes = await readFile(resolve(root, path));
  const original = provenance.find(entry => entry.id === `font-PretendardGOV-${spec.name}`);
  assert.equal(hash(bytes), spec.sha256, `Pinned font bytes: ${path}`);
  assert.equal(original.sha256, spec.sha256); assert.equal(original.modified, false);
  fonts.set(spec.weight, create(bytes));
  sources.push({ path, sha256: spec.sha256, weight: spec.weight, sourceId: original.id, upstreamUrl: original.upstreamUrl, versionOrCommit: original.versionOrCommit, retrievedAt: original.retrievedAt, license: original.licenseIdOrRef, licenseTextPath: original.licenseTextPath });
}
// Explicit Latin advance layout: font hmtx advances, no implicit shaping/kerning.
// Tracking and the word gap are expressed in the original 2048-unit em grid.
const runs = [{ text: 'KRDS', weight: 700, tracking: -20 }, { text: 'Native', weight: 500, tracking: -12 }];
const glyphs = []; let cursor = 0;
for (const [index, run] of runs.entries()) {
  if (index) cursor += 320;
  for (const [i, character] of [...run.text].entries()) {
    const glyph = fonts.get(run.weight).glyphForCodePoint(character.codePointAt(0));
    assert.notEqual(glyph.id, 0); glyphs.push({ glyph, x: cursor });
    cursor += glyph.advanceWidth + (i === run.text.length - 1 ? 0 : run.tracking);
  }
}
const bounds = {
  minX: Math.min(...glyphs.map(({glyph,x}) => glyph.bbox.minX + x)),
  maxX: Math.max(...glyphs.map(({glyph,x}) => glyph.bbox.maxX + x)),
  minY: Math.min(...glyphs.map(({glyph}) => glyph.bbox.minY)),
  maxY: Math.max(...glyphs.map(({glyph}) => glyph.bbox.maxY)),
};
const height = 40, padding = 2, scale = (height - padding * 2) / (bounds.maxY - bounds.minY);
const width = Math.ceil((bounds.maxX - bounds.minX) * scale + padding * 2);
const paths = glyphs.map(({glyph,x}) => glyph.path.transform(scale, 0, 0, -scale, padding + (x - bounds.minX) * scale, padding + bounds.maxY * scale).toSVG());
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
const artwork = (color, data=paths) => data.map(d => `<path fill="${color}" d="${d}"/>`).join('');
const wordmark = color => svg(width,height,artwork(color));
const k = fonts.get(700).glyphForCodePoint(75), kScale = 0.64 * 512 / k.bbox.height;
const kPath = k.path.transform(kScale, 0, 0, -kScale, (512 - k.bbox.width*kScale)/2 - k.bbox.minX*kScale, (512+k.bbox.height*kScale)/2 + k.bbox.minY*kScale).toSVG();
const icon = (color,background) => svg(512,512,(background ? `<path fill="${background}" d="M0 0H512V512H0Z"/>` : '') + artwork(color,[kPath]));
const socialScale = 760 / width;
const social = svg(1200,630,`<path fill="white" d="M0 0H1200V630H0Z"/>` + glyphs.map(({glyph,x}) => `<path fill="black" d="${glyph.path.transform(scale*socialScale,0,0,-scale*socialScale,220+(padding+(x-bounds.minX)*scale)*socialScale,(630-height*socialScale)/2+(padding+bounds.maxY*scale)*socialScale).toSVG()}"/>`).join(''));
const outputs = [];
async function save(name, bytes, info={}) {
  const path = name === 'mark.svg' ? 'apps/docs/public/mark.svg' : `${assetRoot}/${name}`;
  await mkdir(resolve(root, path, '..'), { recursive: true });
  await writeFile(resolve(root,path),bytes);
  const buffer = Buffer.from(bytes); outputs.push({path,bytes:buffer.length,sha256:hash(buffer),...info});
}
for (const color of ['black','white']) {
  await save(`wordmark-${color}.svg`,wordmark(color),{width,height,background:'transparent',purpose:'horizontal wordmark'});
  await save(`icon-${color}.svg`,icon(color),{width:512,height:512,background:'transparent',purpose:'compact glyph'});
  for (const multiplier of [1,2,3]) await save(`wordmark-${color}@${multiplier}x.png`,await sharp(Buffer.from(wordmark(color))).resize(width*multiplier,height*multiplier).png({compressionLevel:9}).toBuffer(),{width:width*multiplier,height:height*multiplier,background:'transparent',purpose:'wordmark raster'});
}
const favicon = icon('white','black');
await save('favicon.svg',favicon,{width:512,height:512,background:'black',purpose:'favicon'});
await save('mark.svg',favicon,{width:512,height:512,background:'black',purpose:'compatibility favicon alias'});
const faviconPngs = [];
for (const size of [16,32,48,180,192,512]) {
  const bytes = await sharp(Buffer.from(favicon)).resize(size,size).png({compressionLevel:9}).toBuffer();
  if(size<=48) faviconPngs.push({size,bytes});
  await save(size<=48 ? `favicon-${size}.png` : size===180 ? 'apple-touch-icon.png' : `app-icon-${size}.png`,bytes,{width:size,height:size,background:'black',purpose:size<=48?'favicon':size===180?'Apple touch icon':'application icon'});
}
// ICO directory with standard PNG-compressed images (no extra raster tool).
const header = Buffer.alloc(6+faviconPngs.length*16); header.writeUInt16LE(1,2);header.writeUInt16LE(faviconPngs.length,4);
let offset = header.length;
for (const [index,{size,bytes}] of faviconPngs.entries()) {const p=6+index*16;header[p]=size;header[p+1]=size;header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(bytes.length,p+8);header.writeUInt32LE(offset,p+12);offset+=bytes.length;}
await save('favicon.ico',Buffer.concat([header,...faviconPngs.map(({bytes})=>bytes)]),{sizes:[16,32,48],background:'black',purpose:'legacy favicon'});
await save('social.svg',social,{width:1200,height:630,background:'white',purpose:'social preview'});
await save('social.png',await sharp(Buffer.from(social)).png({compressionLevel:9}).toBuffer(),{width:1200,height:630,background:'white',purpose:'social preview'});
const manifest = {
  schemaVersion:1,name:'KRDS Native',canonicalSource:`${assetRoot}/wordmark-black.svg`,
  authoring:{wordmark:'KRDS Bold 700 / Native Medium 500; black or white; no additional symbol or tagline.',compact:'Actual Pretendard GOV Bold K, optically centered by its ink bounds at 64% square height; white on black favicon.',layout:'Latin hmtx advances only; no shaping, kerning or ligatures. Original 2048-unit em; tracking KRDS -20, Native -12; between-word gap 320 units after the final S advance. Outlines retain original glyph geometry.',wordmarkSize:{width,height},social:'1200×630 white; black wordmark centered at 760px width.'},
  rights:{artwork:'Independent typographic project artwork under the project MIT grant; no official KRDS or government identity or endorsement.',font:'Original Pretendard GOV font software remains unmodified under OFL-1.1, with its attribution and Reserved Font Names. Artwork is a document created using the font; it does not relicense font software.',evidence:['compliance/project-identity.json','packages/fonts/provenance.json','LICENSES/Pretendard-GOV-OFL-1.1.txt']},
  fonts:sources,tools:{node:toolchain.node.version,yarn:toolchain.packageManager.version,fontkitten:'1.0.3',sharp:sharp.versions.sharp,libvips:sharp.versions.vips,generator:'apps/docs/scripts/generate-branding.mjs',generatorSha256:hash(await readFile(import.meta.filename))},outputs,
};
await mkdir(resolve(root,'apps/docs/branding'),{recursive:true});
await writeFile(resolve(root,'apps/docs/branding/source.json'),JSON.stringify(manifest,null,2)+'\n');
// Register generated artwork in the existing web distribution inventory.
const inventoryPath = 'compliance/distribution-provenance.json';
const inventory = await json(inventoryPath);
const destinations = new Set(outputs.map(record=>record.path));
inventory.assets = inventory.assets.filter(record=>!record.destinations.some(path=>destinations.has(path)));
for (const output of outputs) inventory.assets.push({sourcePath:output.path,sha256:output.sha256,bytes:output.bytes,origin:'Independent KRDS Native typographic artwork using original Pretendard GOV glyphs; not an official KRDS/government identity',rights:'independent',rightsStatus:'verified',evidence:['apps/docs/branding/source.json','apps/docs/scripts/generate-branding.mjs','LICENSES/Pretendard-GOV-OFL-1.1.txt','packages/fonts/provenance.json'],destinations:[output.path]});
await writeFile(resolve(root,inventoryPath),JSON.stringify(inventory,null,2)+'\n');
console.log(`Generated ${outputs.length} monochrome assets; wordmark ${width}×${height}. Source: ${relative(root,resolve(root,'apps/docs/branding/source.json'))}`);
