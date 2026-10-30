import {hydrate} from 'solid-js/web';
import App from './App';
const before=document.querySelector('#ssr-button');
const dispose=hydrate(()=><App/>,document.querySelector('#app')!);
(globalThis as any).__ssrReused=before===document.querySelector('#ssr-button');
(globalThis as any).__ssrReady=true;(globalThis as any).__ssrUnmount=dispose;
