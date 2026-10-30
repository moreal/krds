import {createSSRApp} from 'vue';
import App from './App.vue';
const before=document.querySelector('#ssr-button');const app=createSSRApp(App);app.mount('#app');
(globalThis as any).__ssrReused=before===document.querySelector('#ssr-button');
(globalThis as any).__ssrReady=true;(globalThis as any).__ssrUnmount=()=>app.unmount();
