import {afterEach,expect,test,vi} from 'vitest';
import {mount,unmount,tick} from 'svelte';
import {BottomSheet} from '@unofficial-krds/svelte';
import '@unofficial-krds/styles/all.css';
const cleanup:(()=>unknown)[]=[];
afterEach(async()=>{for(const callback of cleanup.splice(0))await callback();});
test('BottomSheet: open sheet anchors to the viewport bottom with a clickable close button (no transformed containing block)',async()=>{
 const changed=vi.fn(),host=document.createElement('div');document.body.append(host);
 const app=mount(BottomSheet,{target:host,props:{title:'지역 선택',description:'예제 지역을 선택하세요',defaultOpen:true,onOpenChange:changed}});
 cleanup.push(async()=>{await unmount(app);host.remove();});await tick();
 const content=host.querySelector<HTMLElement>('[data-krds-component="bottom-sheet"][data-krds-part="content"]')!;
 const close=host.querySelector<HTMLButtonElement>('[data-krds-component="bottom-sheet"][data-krds-part="close"]')!;
 expect(content).not.toBeNull();expect(close).not.toBeNull();
 // No ancestor of the sheet's fixed layers may establish a containing block for fixed descendants.
 for(let node=content.parentElement;node;node=node.parentElement){const style=getComputedStyle(node);expect(style.transform,`${node.tagName} transform`).toBe('none');}
 const sheet=content.getBoundingClientRect();
 expect(sheet.bottom).toBeCloseTo(innerHeight,0);expect(sheet.left).toBeCloseTo(0,0);expect(sheet.right).toBeCloseTo(innerWidth,0);
 const box=close.getBoundingClientRect();
 expect(box.width).toBeGreaterThan(0);expect(box.height).toBeGreaterThan(0);
 expect(box.left).toBeGreaterThanOrEqual(0);expect(box.top).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(innerWidth);expect(box.bottom).toBeLessThanOrEqual(innerHeight);
 const x=box.left+box.width/2,y=box.top+box.height/2;
 expect(document.elementFromPoint(x,y)).toBe(close);
 const handle=host.querySelector<HTMLElement>('[data-krds-component="bottom-sheet"][data-krds-part="handle"]')!;
 expect(handle.getAttribute('aria-hidden')).toBe('true');expect(handle.hasAttribute('role')).toBe(false);
 expect(getComputedStyle(handle).touchAction).toBe('none');
 close.click();await tick();
 expect(changed).toHaveBeenCalledExactlyOnceWith({open:false,reason:'close'});
});
