import type { Component, Snippet } from 'svelte';
import type { VisuallyHiddenContract } from '@unofficial-krds/contracts';
export type VisuallyHiddenProps = VisuallyHiddenContract & { children?:Snippet; surrogate?:Snippet };
declare const component: Component<VisuallyHiddenProps>;
export default component;
