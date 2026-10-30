import {hydrate,unmount} from 'svelte';
import App from './App.svelte';
const before=document.querySelector('#ssr-button');const instance=hydrate(App,{target:document.querySelector('#app')!});
(globalThis as any).__ssrReused=before===document.querySelector('#ssr-button');
(globalThis as any).__ssrReady=true;(globalThis as any).__ssrUnmount=()=>unmount(instance);
