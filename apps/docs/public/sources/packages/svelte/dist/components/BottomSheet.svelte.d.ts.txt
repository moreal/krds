import type { Component, Snippet } from 'svelte';
import type { BottomSheetContract } from '@unofficial-krds/contracts';
export type BottomSheetProps = BottomSheetContract & { children?:Snippet };
declare const component: Component<BottomSheetProps>;
export default component;
