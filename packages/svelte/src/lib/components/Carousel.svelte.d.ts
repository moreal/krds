import type { Component, Snippet } from 'svelte';
import type { CarouselContract } from '@unofficial-krds/contracts';
export type CarouselProps = CarouselContract & { slide?:Snippet<[{id:string;label:string;content:string}]> };
declare const component: Component<CarouselProps>;
export default component;
