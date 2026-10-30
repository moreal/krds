import type { Component, Snippet } from 'svelte';
import type { CoachMarkContract } from '@unofficial-krds/contracts';
export type CoachMarkProps = CoachMarkContract & { panelId?:string };
declare const component: Component<CoachMarkProps>;
export default component;
