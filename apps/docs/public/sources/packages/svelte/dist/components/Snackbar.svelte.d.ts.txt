import type { Component, Snippet } from 'svelte';
import type { SnackbarContract } from '@unofficial-krds/contracts';
export type SnackbarProps = SnackbarContract & { style?:string };
declare const component: Component<SnackbarProps>;
export default component;
