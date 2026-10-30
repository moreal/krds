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
  ast.walkAtRules((rule) => {
    if (rule.name.toLowerCase() === 'import') throw new Error(`${file}: imports require explicit audited build expansion`);
    if (/https?:|url\(/iu.test(rule.params)) throw new Error(`${file}: assets require a separately audited opt-in entry`);
  });
  const declared = new Set(tokenNames);
  ast.walkDecls((decl) => { if (decl.prop.startsWith('--')) declared.add(decl.prop); });
  ast.walkDecls((decl) => {
    for (const match of decl.value.matchAll(/var\(\s*(--[\w-]+)/gu)) if (!declared.has(match[1])) throw new Error(`${file}: unknown token reference ${match[1]}`);
    if (/https?:|url\(/iu.test(decl.value)) throw new Error(`${file}: assets require a separately audited opt-in entry`);
  });
  ast.walkRules((rule) => {
    // Check each owned compound independently. An ancestor root's state does not
    // become a descendant icon's state; repeated component identities delimit ownership.
    const owned = [...rule.selector.matchAll(/\[data-krds-component="([^"]+)"\]([\s\S]*?)(?=\[data-krds-component="|$)/gu)];
    for (const [, identity, selector] of owned) {
      const spec = contract.components[identity];
      if (!spec) throw new Error(`${file}: unknown component ${identity}`);
      const parts = [...selector.matchAll(/\[data-krds-part="([^"]+)"\]/gu)].map((match) => match[1]);
      for (const part of parts) if (!spec.parts.includes(part)) throw new Error(`${file}: ${identity} unknown public part ${part}`);
      for (const state of selector.matchAll(/\[data-krds-state~="([^"]+)"\]/gu)) {
        if (!Object.values(spec.states).flat().includes(state[1])) throw new Error(`${file}: ${identity} unknown state ${state[1]}`);
        for (const part of parts) if (!(spec.states[part] ?? []).includes(state[1])) throw new Error(`${file}: ${identity} part ${part} does not support state ${state[1]}`);
      }
      const presentation = { variant: spec.variants, size: spec.sizes, orientation: spec.orientations, ...spec.presentation };
      for (const match of selector.matchAll(/\[data-krds-([\w-]+)(?:[~^$*|])?="([^"]+)"\]/gu)) {
        const [, attribute, value] = match;
        if (attribute === 'part' || attribute === 'state' || attribute === 'component' || attribute === 'internal') continue;
        const allowed = presentation[attribute];
        if (!allowed) throw new Error(`${file}: ${identity} unknown presentation axis ${attribute}`);
        // Prefix/suffix placement selectors are permitted only if they match a supported value.
        const operator = match[0].match(/([~^$*|])=/u)?.[1];
        const valid = operator === '^' ? allowed.some((item) => item.startsWith(value)) : operator === '$' ? allowed.some((item) => item.endsWith(value)) : allowed.includes(value);
        if (!valid) throw new Error(`${file}: ${identity} unknown ${attribute} ${value}`);
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
  const shadow = { base: raw.base, ...Object.fromEntries(components.map((name) => [name, raw[name]])), all: `${raw.base}\n${components.map((name) => raw[name]).join('\n')}` };
  const module = `/** Plain CSS strings: consumer may wrap with Lit unsafeCSS; no Lit runtime dependency. */\nexport const styles = ${JSON.stringify(result)};\n/** Inheritance-safe shadow CSS. Install tokens once on a document ancestor. */\nexport const shadowStyles = ${JSON.stringify(shadow)};\n`;
  await writeFile(resolve(dir, 'dist/lit.js'), module);
  await writeFile(resolve(dir, 'dist/lit.d.ts'), `export declare const styles: Readonly<Record<${Object.keys(result).map((name) => JSON.stringify(name)).join(' | ')}, string>>;\nexport declare const shadowStyles: Readonly<Record<${Object.keys(shadow).map((name) => JSON.stringify(name)).join(' | ')}, string>>;\n`);
  await writeFile(resolve(dir, 'dist/index.js'), `export { styles } from './lit.js';\n`);
  await writeFile(resolve(dir, 'dist/index.d.ts'), `export { styles } from './lit.js';\n`);
  await writeFile(resolve(dir, 'dist/parts.json'), `${JSON.stringify(contract, null, 2)}\n`);
  console.log(`Parsed/validated ${Object.keys(raw).length} CSS sources; generated ${Object.keys(result).length} CSS entries and identical plain strings for ${components.length} component contracts.`);
  return result;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await build();
