const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Independent KRDS consumer</title></head><body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body></html>';
const tsconfig={compilerOptions:{target:'ES2022',module:'ESNext',moduleResolution:'Bundler',lib:['ES2022','DOM','DOM.Iterable'],strict:true,skipLibCheck:true,verbatimModuleSyntax:true,esModuleInterop:true,noEmit:true,types:['node'],jsx:'preserve',ignoreDeprecations:'6.0'},include:['src/**/*','vite.config.ts']};
const css="import '@unofficial-krds/styles/button.css';\n";
const genericConfig=(plugin,expression,extra='')=>`import {defineConfig} from 'vite'; ${plugin}\nexport default defineConfig({plugins:[${expression}],${extra} build:{outDir:'dist',sourcemap:true,license:{fileName:'licenses.json'}}});`;
export function template(id){
 let dependencies={},devDependencies={},files={},typecheck=['exec','tsc','--noEmit'];
 files['index.html']=html; files['tsconfig.json']=JSON.stringify(tsconfig,null,2);
 if(id==='react') {
  files['vite.config.ts']=genericConfig("import react from '@vitejs/plugin-react';",'react()');
  files['src/App.tsx']="import {useState} from 'react'; import {Button} from '@unofficial-krds/react/button'; export function App(){const [count,set]=useState(0); return <><Button onClick={()=>set(count+1)}>Activate</Button><output>{count}</output></>;}";
  files['src/main.tsx']=css+"import {createRoot} from 'react-dom/client'; import {App} from './App'; createRoot(document.getElementById('app')!).render(<App/>);";
  files['src/ssr.tsx']="import {renderToString} from 'react-dom/server'; import {App} from './App'; export const html=()=>renderToString(<App/>);";
  files['tsconfig.json']=JSON.stringify({...tsconfig,compilerOptions:{...tsconfig.compilerOptions,jsx:'react-jsx'}},null,2);
 }
 if(id==='solid'||id==='solid-next') {
  const next=id==='solid-next', runtime=next?'@solidjs/web':'solid-js/web';
  files['vite.config.ts']=genericConfig(`import solid from '${next?'@solidjs/vite-plugin':'vite-plugin-solid'}';`,next?'solid()':'solid({ssr:true})');
  files['src/App.tsx']=`import {createSignal} from 'solid-js'; import {Button} from '@unofficial-krds/${id}/button'; export function App(){const [count,set]=createSignal(0); return <><Button onClick={()=>set(count()+1)}>Activate</Button><output>{count()}</output></>;}`;
  files['src/main.tsx']=css+`import {render} from '${runtime}'; import {App} from './App'; render(()=> <App/>,document.getElementById('app')!);`;
  files['src/ssr.tsx']=`import {renderToString} from '${runtime}'; import {App} from './App'; export const html=()=>renderToString(()=> <App/>);`;
  files['tsconfig.json']=JSON.stringify({...tsconfig,compilerOptions:{...tsconfig.compilerOptions,jsxImportSource:next?'@solidjs/web':'solid-js'}},null,2);
 }
 if(id==='vue') {
  files['vite.config.ts']=genericConfig("import vue from '@vitejs/plugin-vue';",'vue()');
  files['src/App.vue']='<script setup lang="ts">import {ref} from "vue"; import Button from "@unofficial-krds/vue/button"; const count=ref(0);</script><template><Button @click="count++">Activate</Button><output>{{count}}</output></template>';
  files['src/main.tsx']=css+"import {createApp} from 'vue'; import App from './App.vue'; createApp(App).mount('#app');";
  files['src/ssr.tsx']="import {createSSRApp} from 'vue'; import {renderToString} from '@vue/server-renderer'; import App from './App.vue'; export const html=()=>renderToString(createSSRApp(App));";
  typecheck=['exec','vue-tsc','--noEmit'];
 }
 if(id==='svelte') {
  files['vite.config.ts']=genericConfig("import {svelte} from '@sveltejs/vite-plugin-svelte';",'svelte()');
  files['src/App.svelte']='<script lang="ts">import {Button} from "@unofficial-krds/svelte"; let count=$state(0);</script><Button onclick={()=>count++}>Activate</Button><output>{count}</output>';
  files['src/main.tsx']=css+"import {mount} from 'svelte'; import App from './App.svelte'; mount(App,{target:document.getElementById('app')!});";
  files['src/ssr.tsx']="import {render} from 'svelte/server'; import App from './App.svelte'; export const html=()=>render(App).body;";
  typecheck=['exec','svelte-check','--tsconfig','tsconfig.json'];
 }
 if(id==='lit') {
  files['vite.config.ts']=genericConfig('','','');
  files['src/main.tsx']=css+"import {Button} from '@unofficial-krds/lit/button'; customElements.define('consumer-button',Button); const button=document.createElement('consumer-button'); button.textContent='Activate'; const output=document.createElement('output'); output.textContent='0'; button.addEventListener('click',()=>output.textContent=String(Number(output.textContent)+1)); document.getElementById('app')!.append(button,output);";
  files['src/ssr.tsx']="import '@lit-labs/ssr/lib/install-global-dom-shim.js'; import {render} from '@lit-labs/ssr'; import {html as litHtml} from 'lit'; import {Button} from '@unofficial-krds/lit/button'; customElements.define('consumer-button',Button); export const html=()=>[...render(litHtml`<consumer-button>Activate</consumer-button><output>0</output>`)].join('');";
 }
 if(id==='qwik') {
  files['index.html']='';
  files['vite.config.ts']=`import {defineConfig} from 'vite'; import {qwikVite} from '@builder.io/qwik/optimizer'; export default defineConfig({plugins:[qwikVite({client:{input:'src/entry.client.tsx',outDir:'dist'},ssr:{input:'src/ssr.tsx',outDir:'dist/server'}})],build:{outDir:'dist',sourcemap:true}});`;
  files['src/App.tsx']="import {component$,useSignal} from '@builder.io/qwik'; import {Button} from '@unofficial-krds/qwik'; export const App=component$(()=>{const count=useSignal(0);return <><Button onClick$={()=>count.value++}>Activate</Button><output>{count.value}</output></>;});";
  files['src/main.tsx']=css+"export {App as default} from './App';";
  files['src/entry.client.tsx']="export {App as default} from './App';";
  files['src/entry.dev.tsx']="import {render} from '@builder.io/qwik'; import {App} from './App'; export default ()=>render(document,<App/>);";
  files['src/ssr.tsx']="import {renderToString} from '@builder.io/qwik/server'; import {manifest} from '@qwik-client-manifest'; import {App} from './App'; export async function html(){return (await renderToString(<><head><title>Qwik consumer</title></head><body><App/></body></>,{manifest,base:'/build/',containerTagName:'html'})).html;} export default html;";
  files['src/env.d.ts']="/// <reference types='@builder.io/qwik' />\ndeclare module '@qwik-client-manifest' {export const manifest: import('@builder.io/qwik/optimizer').QwikManifest;}";
  files['tsconfig.json']=JSON.stringify({...tsconfig,compilerOptions:{...tsconfig.compilerOptions,jsx:'react-jsx',jsxImportSource:'@builder.io/qwik'}},null,2);
 }
 if(id==='angular') {
  files['index.html']='<!doctype html><html><head><meta charset="utf-8"><title>Angular APF consumer</title><base href="/"></head><body><consumer-app></consumer-app></body></html>';
  files['src/App.ts']="import {Component,signal} from '@angular/core'; import {FormControl,ReactiveFormsModule} from '@angular/forms'; import {Button} from '@unofficial-krds/angular/button'; import {NativeSelect} from '@unofficial-krds/angular/forms'; @Component({selector:'consumer-app',standalone:true,imports:[Button,NativeSelect,ReactiveFormsModule],template:'<button krdsButton (click)=\"count.update(increment)\">Activate</button><output>{{count()}}</output><krds-native-select id=\"region\" label=\"Region\" [options]=\"options\" [formControl]=\"region\"/><span id=\"cva-value\">{{region.value}}</span>'}) export class App {count=signal(0);increment=(value:number)=>value+1;region=new FormControl('a',{nonNullable:true});options=[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}];}";
  files['src/main.tsx']="import {bootstrapApplication,provideClientHydration} from '@angular/platform-browser'; import {provideZonelessChangeDetection} from '@angular/core'; import {App} from './App'; bootstrapApplication(App,{providers:[provideZonelessChangeDetection(),provideClientHydration()]}).catch(error=>{throw error;});";
  files['src/main.ts']=files['src/main.tsx'];delete files['src/main.tsx'];
  files['src/server.ts']="import {bootstrapApplication,provideClientHydration,type BootstrapContext} from '@angular/platform-browser'; import {provideZonelessChangeDetection} from '@angular/core'; import {provideServerRendering,RenderMode,withRoutes} from '@angular/ssr'; import {App} from './App'; export default (context:BootstrapContext)=>bootstrapApplication(App,{providers:[provideZonelessChangeDetection(),provideClientHydration(),provideServerRendering(withRoutes([{path:'**',renderMode:RenderMode.Prerender}]))]},context);";
  files['src/styles.css']="@import '@unofficial-krds/styles/button.css';\n@import '@unofficial-krds/styles/native-select.css';";
  files['tsconfig.json']=JSON.stringify({...tsconfig,compilerOptions:{...tsconfig.compilerOptions,experimentalDecorators:true,noEmit:false},angularCompilerOptions:{strictTemplates:true},files:['src/main.ts','src/server.ts'],include:undefined},null,2);
  files['angular.json']=JSON.stringify({version:1,projects:{consumer:{projectType:'application',root:'',sourceRoot:'src',architect:{build:{builder:'@angular/build:application',options:{browser:'src/main.ts',server:'src/server.ts',index:'index.html',tsConfig:'tsconfig.json',outputPath:{base:'dist',browser:'browser',server:'server'},styles:['src/styles.css'],polyfills:[],outputMode:'static'}}}}}},null,2);
  typecheck=['exec','ngc','--noEmit','-p','tsconfig.json'];
 }
 return {dependencies,devDependencies,files,typecheck};
}
