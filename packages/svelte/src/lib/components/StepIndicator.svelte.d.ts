import type { Component, Snippet } from 'svelte';
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
export type StepIndicatorProps = StepIndicatorContract & { optionalAction?:Snippet<[StepIndicatorContract['steps'][number],StepIndicatorContract['steps'][number]|undefined]> };
declare const component: Component<StepIndicatorProps>;
export default component;
