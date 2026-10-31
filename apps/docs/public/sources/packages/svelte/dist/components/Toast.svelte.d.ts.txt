import type { Component, Snippet } from 'svelte';
import type { ToastContract } from '@unofficial-krds/contracts';
export type ToastProps = ToastContract & { style?:string };
declare const component: Component<ToastProps>;
export default component;
