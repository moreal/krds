import {afterEach,expect,test} from 'vitest';
import {mount,unmount,tick} from 'svelte';
import {Tooltip,ContextualHelp} from '@unofficial-krds/svelte';
import type {HelpPlacement} from '@unofficial-krds/svelte';
import '@unofficial-krds/styles/all.css';
const teardown:(()=>Promise<void>)[]=[];
afterEach(async()=>{for(const callback of teardown.splice(0))await callback();});
for(const placement of ['top-start','top','top-end','bottom-start','bottom','bottom-end'] as HelpPlacement[]){
 for(const kind of ['tooltip','contextual-help'] as const){
  test(`${kind} honors ${placement} with actual safe native popup bounds`,async()=>{
   const host=document.createElement('div');host.style.cssText='position:absolute;left:620px;top:300px';document.body.append(host);let requests=0;
   const app=kind==='tooltip'?mount(Tooltip,{target:host,props:{text:'짧은 안내',triggerId:'placement-trigger',textId:'placement-text',triggerLabel:'도움말',placement,defaultOpen:true,onOpenChange:()=>requests++}}):mount(ContextualHelp,{target:host,props:{title:'안내',content:'짧은 안내',triggerLabel:'도움말',placement,defaultOpen:true,onOpenChange:()=>requests++}});
   teardown.push(async()=>{await unmount(app);host.remove();});await tick();
   const trigger=host.querySelector<HTMLButtonElement>('[data-krds-part=trigger]')!;
   const popup=host.querySelector<HTMLElement>(kind==='tooltip'?'[role=tooltip]':'[data-krds-part=popover]')!;
   await expect.poll(()=>{const a=trigger.getBoundingClientRect(),b=popup.getBoundingClientRect();return placement.startsWith('top')?b.bottom<a.top:b.top>a.bottom;}).toBe(true);
   const a=trigger.getBoundingClientRect(),b=popup.getBoundingClientRect();
   expect(b.left).toBeGreaterThanOrEqual(0);expect(b.right).toBeLessThanOrEqual(innerWidth);expect(b.top).toBeGreaterThanOrEqual(0);expect(b.bottom).toBeLessThanOrEqual(innerHeight);
   if(placement.endsWith('start'))expect(b.left).toBeCloseTo(a.left,0);
   else if(placement.endsWith('end'))expect(b.right).toBeCloseTo(a.right,0);
   else expect(b.left+b.width/2).toBeCloseTo(a.left+a.width/2,0);
   expect(requests).toBe(0);
  });
 }
}
