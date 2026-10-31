import type { Component, Snippet } from 'svelte';
import type { FABContract } from '@unofficial-krds/contracts';
export type FABProps = FABContract & { style?:string };
declare const component: Component<FABProps>;
export default component;
