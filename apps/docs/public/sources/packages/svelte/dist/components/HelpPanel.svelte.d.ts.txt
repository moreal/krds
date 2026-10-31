import type { Component, Snippet } from 'svelte';
import type { HelpPanelContract } from '@unofficial-krds/contracts';
export type HelpPanelProps = HelpPanelContract & { openerId?:string; hideOpener?:boolean; hideTopicTriggers?:boolean };
declare const component: Component<HelpPanelProps>;
export default component;
