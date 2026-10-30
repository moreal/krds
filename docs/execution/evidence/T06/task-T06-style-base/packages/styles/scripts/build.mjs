import postcss from 'postcss';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = resolve(import.meta.dirname, '..');
const contract = JSON.parse(readFileSync(resolve(dir, 'src/parts.json'), 'utf8'));
const components = Object.keys(contract.components);
export function validateCss(css, file, tokenNames) {
  const ast = postcss.parse(css, { from: file });
  const declared = new Set(tokenNames);
  ast.walkDecls((decl) => { if (decl.prop.startsWith('--')) declared.add(decl.prop); });
  ast.walkDecls((decl) => {
    for (const match of decl.value.matchAll(/var\(\s*(--[\w-]+)/gu)) if (!declared.has(match[1])) throw new Error(`${file}: unknown token reference ${match[1]}`);
    if (/https?:|url\(/iu.test(decl.value)) throw new Error(`${file}: assets require a separately audited opt-in entry`);
  });
  ast.walkRules((rule) => {
    const identities = [...rule.selector.matchAll(/\[data-krds-component="([^"]+)"\]/gu)].map((m) => m[1]);
    for (const identity of identities) {
      const spec = contract.components[identity];
      if (!spec) throw new Error(`${file}: unknown component ${identity}`);
      for (const part of rule.selector.matchAll(/\[data-krds-part="([^"]+)"\]/gu)) if (!spec.parts.includes(part[1])) throw new Error(`${file}: ${identity} unknown public part ${part[1]}`);
      for (const state of rule.selector.matchAll(/\[data-krds-state~="([^"]+)"\]/gu)) {
        if (!Object.values(spec.states).flat().includes(state[1])) throw new Error(`${file}: ${identity} unknown state ${state[1]}`);
        for (const part of rule.selector.matchAll(/\[data-krds-part="([^"]+)"\]/gu)) if (!(spec.states[part[1]] ?? []).includes(state[1])) throw new Error(`${file}: ${identity} part ${part[1]} does not support state ${state[1]}`);
      }
      for (const [attribute, field] of [['variant', 'variants'], ['size', 'sizes'], ['orientation', 'orientations']]) {
        for (const match of rule.selector.matchAll(new RegExp(`\\[data-krds-${attribute}="([^"]+)"\\]`, 'gu'))) if (!(spec[field] ?? []).includes(match[1])) throw new Error(`${file}: ${identity} unknown ${attribute} ${match[1]}`);
      }
    }
    if (/\[data-krds-state=/u.test(rule.selector)) throw new Error(`${file}: state selectors must use token membership (~=)`);
  });
  return ast;
}
export async function build() {
  const tokens = JSON.parse(await readFile(resolve(dir, '../tokens/dist/tokens.json'), 'utf8'));
  const tokenCss = await readFile(resolve(dir, '../tokens/dist/tokens.css'), 'utf8');
  const tokenNames = new Set(Object.values(tokens).map((token) => token.cssName));
  const raw = {};
  for (const name of ['base', 'reset', 'fonts', ...components]) {
    const path = resolve(dir, `src/${components.includes(name) ? 'components/' : ''}${name}.css`);
    raw[name] = await readFile(path, 'utf8');
    validateCss(raw[name], path, tokenNames);
  }
  // A component entry is independently importable with tokens and the scoped foundation.
  const result = { base: raw.base, reset: raw.reset, fonts: raw.fonts };
  for (const name of components) result[name] = `${tokenCss}\n${raw.base}\n${raw[name]}`;
  result.all = `${tokenCss}\n${raw.base}\n${components.map((name) => raw[name]).join('\n')}`;
  await rm(resolve(dir, 'dist'), { recursive: true, force: true });
  await mkdir(resolve(dir, 'dist'), { recursive: true });
  for (const [name, css] of Object.entries(result)) await writeFile(resolve(dir, `dist/${name}.css`), css);
  const module = `/** Plain CSS strings: consumer may wrap with Lit unsafeCSS; no Lit runtime dependency. */\nexport const styles = ${JSON.stringify(result)};\n`;
  await writeFile(resolve(dir, 'dist/lit.js'), module);
  await writeFile(resolve(dir, 'dist/lit.d.ts'), `export declare const styles: Readonly<Record<${Object.keys(result).map((name) => JSON.stringify(name)).join(' | ')}, string>>;\n`);
  await writeFile(resolve(dir, 'dist/index.js'), `export { styles } from './lit.js';\n`);
  await writeFile(resolve(dir, 'dist/index.d.ts'), `export { styles } from './lit.js';\n`);
  await writeFile(resolve(dir, 'dist/parts.json'), `${JSON.stringify(contract, null, 2)}\n`);
  console.log(`Parsed/validated ${Object.keys(raw).length} CSS sources; generated ${Object.keys(result).length} CSS entries and identical plain strings for six component contracts.`);
  return result;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await build();
