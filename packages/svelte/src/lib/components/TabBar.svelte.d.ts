import type { Component, Snippet } from 'svelte';
import type { TabBarContract } from '@unofficial-krds/contracts';
export type TabBarProps = TabBarContract & { icons?:Readonly<Record<string,Snippet>> };
declare const component: Component<TabBarProps>;
export default component;
