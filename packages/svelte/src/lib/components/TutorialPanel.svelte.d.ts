import type { Component, Snippet } from 'svelte';
import type { TutorialPanelContract } from '@unofficial-krds/contracts';
export type TutorialPanelProps = TutorialPanelContract & { help?:Snippet; openerId?:string; startActionPresent?:boolean; delegateEntry?:boolean; id?:string };
declare const component: Component<TutorialPanelProps>;
export default component;
