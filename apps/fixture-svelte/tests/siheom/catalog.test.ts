import {expect,test,afterEach} from 'vitest';
import {mount,unmount,tick} from 'svelte';
import {page} from 'vitest/browser';
import Harness from './CatalogHarness.svelte';
const cleanup:(()=>Promise<void>)[]=[];afterEach(async()=>{for(const cb of cleanup.splice(0))await cb();});
test('native controlled mixed rejection retains bits and form reset emits no request',async()=>{
 const host=document.createElement('div');document.body.append(host);const app=mount(Harness,{target:host});cleanup.push(async()=>{await unmount(app);host.remove();});await tick();
 await page.getByRole('checkbox',{name:'동의'}).click();await tick();
 expect(host.querySelector('output[aria-label]')?.textContent).toBe('1');
 const control=host.querySelector('input[type=checkbox]') as HTMLInputElement;
 expect(control.checked).toBe(false);expect(control.indeterminate).toBe(true);
 expect(new FormData(host.querySelector('form')!).get('consent')).toBe(null);
 await page.getByRole('textbox',{name:'이름'}).fill('edited');
 expect(host.querySelector('output[aria-label]')?.textContent).toBe('2');
 await page.getByRole('button',{name:'초기화'}).click();await tick();
 await expect.poll(()=>(host.querySelector('input[name=name]') as HTMLInputElement).value).toBe('initial');
 expect(host.querySelector('output[aria-label]')?.textContent).toBe('2');
 
});
test('controlled disclosure rejection keeps native descendants hidden',async()=>{
 const host=document.createElement('div');document.body.append(host);const app=mount(Harness,{target:host});cleanup.push(async()=>{await unmount(app);host.remove();});await tick();
 await page.getByRole('button',{name:'도움말'}).click();await tick();
 expect(host.querySelector('button[aria-controls=help]')?.getAttribute('aria-expanded')).toBe('false');
 expect((host.querySelector('#help') as HTMLElement).hidden).toBe(true);
 
});
