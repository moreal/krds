import { createHighlighterCoreSync, createCssVariablesTheme } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import typescript from 'shiki/langs/typescript.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import svelte from 'shiki/langs/svelte.mjs';
import vue from 'shiki/langs/vue.mjs';
import html from 'shiki/langs/html.mjs';
import css from 'shiki/langs/css.mjs';
import json from 'shiki/langs/json.mjs';
import shellscript from 'shiki/langs/shellscript.mjs';
/** @typedef {{ t: string; c?: string }} CodeToken */

/**
 * Build-time syntax highlighting for documentation code blocks. Colors are not
 * baked in: the CSS-variables theme emits `var(--docs-code-token-*)` so the
 * site stylesheet maps each token class to a KRDS color token (content.css).
 * Languages are fixed to what the documentation Markdown actually uses; an
 * unknown language renders plain. Runs synchronously so parseDocument stays sync.
 */
const theme = createCssVariablesTheme({ name: 'krds-docs', variablePrefix: '--docs-code-', variableDefaults: {}, fontStyle: false });
const highlighter = createHighlighterCoreSync({ themes: [theme], langs: [typescript, tsx, javascript, svelte, vue, html, css, json, shellscript], engine: createJavaScriptRegexEngine({ forgiving: true }) });
export const highlightLanguages = new Set(highlighter.getLoadedLanguages());

/** @returns {CodeToken[][] | undefined} one array per line; `c` is a CSS color expression */
export function highlight(code, language) {
  if (!highlightLanguages.has(language)) return undefined;
  return highlighter.codeToTokensBase(code, { lang: language, theme: 'krds-docs' }).map(line => line.map(token => token.color && token.color !== `var(--docs-code-foreground)` ? { t: token.content, c: token.color } : { t: token.content }));
}
