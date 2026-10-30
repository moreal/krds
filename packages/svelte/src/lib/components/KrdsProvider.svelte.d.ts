import type { Component, Snippet } from 'svelte';
import type { KrdsContext } from './context.js';
declare const KrdsProvider: Component<KrdsContext & {
    children: Snippet;
}>;
export default KrdsProvider;
