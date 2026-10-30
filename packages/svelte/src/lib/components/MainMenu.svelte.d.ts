import type { Component, Snippet } from 'svelte';
import type { MainMenuContract } from '@unofficial-krds/contracts';
export type MainMenuProps = MainMenuContract & { embedded?:boolean; hideMobileTrigger?:boolean };
declare const component: Component<MainMenuProps>;
export default component;
