import type { Component, Snippet } from 'svelte';
import type { StructuredListContract } from '@unofficial-krds/contracts';
export type StructuredListProps = StructuredListContract & { toolbarContent?:Snippet; actions?:Snippet<[import("@unofficial-krds/contracts").StructuredListItem]> };
declare const component: Component<StructuredListProps>;
export default component;
