import {createElement} from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App';
const before=document.querySelector('#ssr-button');
const root=hydrateRoot(document.querySelector('#app')!,createElement(App),{onRecoverableError(error){(globalThis as any).__ssrErrors.push(String(error));}});
requestAnimationFrame(()=>{(globalThis as any).__ssrReady=true;(globalThis as any).__ssrReused=before===document.querySelector('#ssr-button');});
(globalThis as any).__ssrUnmount=()=>root.unmount();
