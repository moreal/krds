import {Component,ErrorHandler,signal,ViewChild} from '@angular/core';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {BottomSheet,Modal} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[Modal,BottomSheet],template:`
<button id="layer-origin" (click)="openPublic($event)">공개 모달 열기</button><button id="native-origin" (click)="nativeParent.set(true)">네이티브 부모 열기</button>
@if(publicMounted()){<krds-modal #public id="public-layer" title="공개 부모" [open]="publicOpen()" (openChange)="publicOpen.set($event.open)"><button id="native-child-opener" (click)="nativeChild.set(true)">네이티브 자식 열기</button></krds-modal>}
@if(nativeMounted()){<krds-bottom-sheet id="native-parent" title="네이티브 부모" [open]="nativeParent()" returnFocusId="native-origin" (openChange)="nativeParent.set($event.open)"><button id="public-child-opener" (click)="openChild($event)">공개 자식 열기</button><button id="second-native-opener" (click)="nativeChild.set(true)">둘째 네이티브 열기</button></krds-bottom-sheet>}
<krds-bottom-sheet id="native-child" title="네이티브 자식" [open]="nativeChild()" returnFocusId="layer-origin" (openChange)="nativeChild.set($event.open)"><button>자식 작업</button></krds-bottom-sheet>
<krds-modal #child id="public-child" title="공개 자식" [open]="childOpen()" (openChange)="childOpen.set($event.open)"><button>공개 자식 작업</button></krds-modal>
`})
class LayersHarness{
 readonly publicOpen=signal(false);readonly childOpen=signal(false);readonly nativeParent=signal(false);readonly nativeChild=signal(false);readonly publicMounted=signal(true);readonly nativeMounted=signal(true);@ViewChild('public') public?:Modal;@ViewChild('child') child?:Modal;
 openPublic(event:Event):void{this.public?.openFrom(event.currentTarget as HTMLElement);}openChild(event:Event):void{this.child?.openFrom(event.currentTarget as HTMLElement);}
}
async function settle(view:Awaited<ReturnType<typeof render<LayersHarness>>>){view.fixture.detectChanges();await view.fixture.whenStable();}
test('S3 native child survives public-parent teardown with real focus, isolation and original scroll restored last',async()=>{
 const original=document.body.style.overflow;document.body.style.overflow='scroll';const late=document.createElement('button');late.textContent='나중 배경';const inert=document.createElement('button');inert.textContent='원래 비활성 배경';inert.inert=true;
 const view=await render(LayersHarness);const user=userEvent.setup();try{
  await user.click(screen.getByRole('button',{name:'공개 모달 열기'}));await user.click(screen.getByRole('button',{name:'네이티브 자식 열기'}));const child=screen.getByRole('dialog',{name:'네이티브 자식'});expect(child).toHaveFocus();document.body.append(late,inert);await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));expect(late.inert).toBe(true);expect(inert.inert).toBe(true);
  view.fixture.componentInstance.publicMounted.set(false);await settle(view);expect(document.body.style.overflow).toBe('hidden');expect(child).toContainElement(document.activeElement as HTMLElement);late.focus();expect(child).toContainElement(document.activeElement as HTMLElement);
  await user.keyboard('{Escape}');await settle(view);expect(child).not.toBeVisible();expect(document.body.style.overflow).toBe('scroll');expect(late.inert).toBe(false);expect(inert.inert).toBe(true);expect(screen.getByRole('button',{name:'공개 모달 열기'})).toHaveFocus();
 }finally{view.fixture.destroy();late.remove();inert.remove();document.body.style.overflow=original;}
});
test('S3 public child can open above a native parent and retain trap while its native ancestor is destroyed',async()=>{
 const original=document.body.style.overflow;const view=await render(LayersHarness);const user=userEvent.setup();try{
  await user.click(screen.getByRole('button',{name:'네이티브 부모 열기'}));await user.click(screen.getByRole('button',{name:'공개 자식 열기'}));const child=screen.getByRole('dialog',{name:'공개 자식'});expect(child).toHaveFocus();view.fixture.componentInstance.nativeMounted.set(false);await settle(view);expect(document.body.style.overflow).toBe('hidden');expect(child).toContainElement(document.activeElement as HTMLElement);
  for(let index=0;index<4;index++){await user.tab();expect(child).toContainElement(document.activeElement as HTMLElement);}await user.keyboard('{Escape}');await settle(view);expect(child).not.toBeVisible();expect(document.body.style.overflow).toBe(original);
 }finally{view.fixture.destroy();document.body.style.overflow=original;}
});
test('S3 native/native ancestor-first cleanup transfers body state and keeps the top owner',async()=>{
 const original=document.body.style.overflow;document.body.style.overflow='auto';const view=await render(LayersHarness);const user=userEvent.setup();try{
  await user.click(screen.getByRole('button',{name:'네이티브 부모 열기'}));await user.click(screen.getByRole('button',{name:'둘째 네이티브 열기'}));view.fixture.componentInstance.nativeMounted.set(false);await settle(view);expect(document.body.style.overflow).toBe('hidden');const child=screen.getByRole('dialog',{name:'네이티브 자식'});expect(child).toContainElement(document.activeElement as HTMLElement);await user.keyboard('{Escape}');await settle(view);expect(document.body.style.overflow).toBe('auto');
 }finally{view.fixture.destroy();document.body.style.overflow=original;}
});
@Component({standalone:true,imports:[BottomSheet],template:`<button id="outside-initial">외부 초기 대상</button><krds-bottom-sheet id="invalid-initial" title="초기 대상 검사" [open]="true" initialFocusId="outside-initial"><button>내부 작업</button></krds-bottom-sheet>`})
class InvalidInitialHarness{}
test('S3 an outside initial focus ID is rejected without leaking a layer or scroll lock',async()=>{
 const errors:unknown[]=[];const original=document.body.style.overflow;const view=await render(InvalidInitialHarness,{providers:[{provide:ErrorHandler,useValue:{handleError(error:unknown){errors.push(error);}}}]});await view.fixture.whenStable();expect(errors.some(error=>error instanceof TypeError)).toBe(true);expect(document.body.style.overflow).toBe(original);view.fixture.destroy();
});
