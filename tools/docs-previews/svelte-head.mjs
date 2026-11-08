/**
 * Svelte compiles `<svelte:head>` to `$.head(hash(filename), …)` using the component's absolute
 * filename, which no compiler option controls and vite-plugin-svelte always passes absolute. The
 * token is only a hydration marker matched against SSR output of the same build, so the preview
 * (client rendered) may use any stable id. This Vite plugin swaps the absolute-path hash for the
 * hash of the repository-relative path so the deployed bundle does not depend on the checkout
 * location. Owned by the preview tooling; consumed by apps/fixture-svelte/vite.docs-preview.config.ts.
 */
import { relative } from 'node:path';
/** Svelte `hash` (src/utils.js): djb2 variant, base 36. */
export function svelteHash(str) {
  str = str.replace(/\r/g, '');
  let hash = 5381;
  let i = str.length;
  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
  return (hash >>> 0).toString(36);
}
export function portableSvelteHeadIds({ root }) {
  return {
    name: 'krds-portable-svelte-head-ids',
    enforce: 'post',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!file.endsWith('.svelte')) return null;
      const absolute = svelteHash(file);
      if (!code.includes(absolute)) return null;
      const portable = svelteHash(relative(root, file).replaceAll('\\', '/'));
      const pattern = new RegExp(`(\\.head\\(\\s*)(["'\`])${absolute}\\2`, 'g');
      let count = 0;
      const out = code.replace(pattern, (_, call, quote) => { count++; return `${call}${quote}${portable}${quote}`; });
      return count ? { code: out, map: null } : null;
    },
  };
}
