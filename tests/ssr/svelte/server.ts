import {render as svelteRender} from 'svelte/server';
import App from './App.svelte';
export function render(){return svelteRender(App);}
