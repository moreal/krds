import type { Component, Snippet } from 'svelte';
import type { ContextualHelpContract } from '@unofficial-krds/contracts';
export type ContextualHelpProps = ContextualHelpContract & { children?:Snippet };
declare const component: Component<ContextualHelpProps>;
export default component;
