import type { Component, Snippet } from 'svelte';
import type { AccordionContract } from '@unofficial-krds/contracts';
export type AccordionProps = AccordionContract & { panel?: Snippet<[{id:string;title:string;content:string}]> };
declare const component: Component<AccordionProps>;
export default component;
