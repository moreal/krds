// Simple Icons (CC0-1.0) framework logos, kept as retrieved; see ./provenance.json.
import angular from './angular.svg?raw';
import lit from './lit.svg?raw';
import qwik from './qwik.svg?raw';
import react from './react.svg?raw';
import solid from './solid.svg?raw';
import svelte from './svelte.svg?raw';
import vue from './vuedotjs.svg?raw';
const path = (svg: string) => svg.match(/ d="([^"]+)"/)?.[1] ?? '';
const marks: Record<string, string> = { angular: path(angular), lit: path(lit), qwik: path(qwik), react: path(react), solid: path(solid), 'solid-next': path(solid), svelte: path(svelte), vue: path(vue) };
/** Path data on a 24×24 grid for a framework id, or undefined when the framework has no mark. */
export const frameworkMark = (framework: string): string | undefined => marks[framework];
