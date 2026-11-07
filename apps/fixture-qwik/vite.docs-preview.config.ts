import { defineConfig, type Plugin } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { sha256 } from '../../tools/docs-previews/contract.mjs';

const app = process.cwd();
const root = resolve(app, '../..');
const stage = process.env.QWIK_DOCS_STAGE === 'server' ? 'server' : 'client';
const versionOf = (name: string) => (JSON.parse(readFileSync(resolve(app, 'node_modules', name, 'package.json'), 'utf8')) as { version: string }).version;

/** Qwik segment IDs are `<parent file>_<symbol path>.js`; the authoritative original is the parent source file. */
function sourceFile(id: string) {
  const file = id.split('?')[0].replace(/^\0/, '');
  if (existsSync(file) && statSync(file).isFile()) return file;
  const segment = /^(.*?\.(?:tsx|ts|jsx|js|mjs))_[\w$]+\.(?:js|jsx|tsx|ts|mjs)$/.exec(file)?.[1];
  return segment && existsSync(segment) ? segment : undefined;
}
/** Package identity from the owning package.json; virtual modules are attributed only to the plugin that provides them. */
function packageOf(id: string, file?: string) {
  if (!file) {
    if (/^\0?(@builder\.io\/qwik\/build|@qwik-client-manifest)$/.test(id) || id.includes('qwik')) return { name: '@builder.io/qwik', version: versionOf('@builder.io/qwik') };
    if (id.startsWith('\0vite/') || id.startsWith('vite/')) return { name: 'vite', version: versionOf('vite') };
    throw new Error(`No package identity for virtual module ${id}`);
  }
  for (let dir = dirname(file); dir.startsWith(root); dir = dirname(dir)) {
    const manifest = resolve(dir, 'package.json');
    if (existsSync(manifest)) { const pkg = JSON.parse(readFileSync(manifest, 'utf8')) as { name?: string; version?: string }; if (pkg.name) return { name: pkg.name, version: pkg.version ?? '0.0.0' }; }
  }
  throw new Error(`No package identity for ${file}`);
}
const normalize = (id: string) => id.replace(/^\0/, 'virtual:').split(root + '/').join('');

/**
 * Deployed-module inventory from the native bundler's emitted chunk membership (not transform inputs).
 * JS: modules with rendered code in an emitted chunk, hashed by that rendered code. CSS: modules extracted into an emitted
 * stylesheet, hashed by the processed CSS. Tree-shaken modules are excluded. Original file hashes are kept for freshness.
 */
function deployedInventory(): Plugin {
  const css = new Map<string, string>();
  return {
    name: 'krds-docs-deployed-inventory',
    transform(code, id) { if (/\.css($|\?)/.test(id)) css.set(id, sha256(code)); },
    // Runs after Vite's CSS extraction has emitted the deployed stylesheet assets.
    generateBundle: { order: 'post', handler(_options, bundle) {
      const modules: Record<string, unknown>[] = [];
      const chunks: { fileName: string; modules: number }[] = [];
      const stylesheets = Object.values(bundle).filter(output => output.type === 'asset' && output.fileName.endsWith('.css')).map(output => output.fileName);
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        let members = 0;
        const extractsCss = (output.viteMetadata?.importedCss.size ?? 0) > 0 || stylesheets.length > 0;
        for (const [id, info] of Object.entries(output.modules)) {
          const isCss = /\.css($|\?)/.test(id);
          if (info.renderedLength === 0 && !(isCss && extractsCss && css.has(id))) continue;
          const file = sourceFile(id);
          const original = file && file.startsWith(root + '/') && !file.includes('/node_modules/') ? [{ path: relative(root, file), sha256: sha256(readFileSync(file)) }] : [];
          const pkg = packageOf(id, file);
          modules.push({ id: normalize(id), sha256: isCss ? css.get(id)! : sha256(info.code ?? ''), originals: original, package: pkg.name, version: pkg.version, stage, chunk: isCss ? stylesheets.join(',') : output.fileName, kind: isCss ? 'css' : 'js' });
          members++;
        }
        chunks.push({ fileName: output.fileName, modules: members });
      }
      mkdirSync(resolve(app, 'dist/docs-preview-capture'), { recursive: true });
      writeFileSync(resolve(app, `dist/docs-preview-capture/${stage}.json`), JSON.stringify({ stage, chunks, stylesheets, modules }, null, 2));
    } },
  };
}

export default defineConfig({
  base: '/krds/previews/qwik/',
  publicDir: false,
  plugins: [
    deployedInventory(),
    qwikVite({
      client: { input: 'src/docs-preview/entry.client.tsx', outDir: 'dist/docs-preview' },
      // build.mjs passes the normalized client manifest; without it the optimizer would read a shared os.tmpdir() file.
      ssr: { input: 'src/docs-preview/entry.ssr.tsx', outDir: 'dist/docs-preview-server', ...(process.env.QWIK_DOCS_CLIENT_MANIFEST ? { manifestInput: JSON.parse(readFileSync(process.env.QWIK_DOCS_CLIENT_MANIFEST, 'utf8')) } : {}) },
    }),
  ],
  build: { outDir: 'dist/docs-preview', emptyOutDir: false, sourcemap: false, assetsInlineLimit: 0 },
});
