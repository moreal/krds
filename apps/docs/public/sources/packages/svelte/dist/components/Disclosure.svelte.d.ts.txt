import type { Component, Snippet } from 'svelte';
import type { DisclosureContract } from '@unofficial-krds/contracts';
export type DisclosureProps = DisclosureContract & { children?: Snippet };
declare const component: Component<DisclosureProps>;
export default component;
