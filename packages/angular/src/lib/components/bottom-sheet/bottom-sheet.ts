import {CatalogIds} from '../../internal/catalog-ids';
import {booleanAttribute,Component,Input,Output,EventEmitter,ChangeDetectionStrategy,inject,ViewChild,afterEveryRender,type OnInit,type OnChanges,ElementRef} from '@angular/core';
import {OwnedState} from '../../internal/catalog-state';
import {NativeLayer} from '../../internal/native-layer';
export type BottomSheetChange={open:false;reason:'close'|'escape'|'outside'|'drag'};
@Component({selector:'krds-bottom-sheet',standalone:true,imports:[NativeLayer],changeDetection:ChangeDetectionStrategy.OnPush,template:`
<dialog #dialog [krdsLayer]="isOpen()" layerRootComponent="bottom-sheet" [layerReturnId]="returnFocusId" [layerInitialId]="initialFocusId" [layerDismissOnOutside]="dismissOnOutside" (layerOutside)="close('outside')" (layerClose)="close('escape')" tabindex="-1" data-krds-component="bottom-sheet" data-krds-part="content" [attr.data-krds-state]="isOpen()?'open':'closed'" [attr.aria-labelledby]="id+'-title'" [attr.aria-describedby]="description?id+'-description':null" >
 <button type="button" data-krds-component="bottom-sheet" data-krds-part="handle" aria-label="하단 패널 닫기" (pointerdown)="dragStart($event)" (pointerup)="dragEnd($event)" (click)="handleClick($event)" (pointercancel)="cancelDrag()"></button>
 <header data-krds-component="bottom-sheet" data-krds-part="header"><h2 data-krds-component="bottom-sheet" data-krds-part="title" [id]="id+'-title'">{{title}}</h2><button type="button" data-krds-component="bottom-sheet" data-krds-part="close" (click)="close('close')">닫기</button></header>
 @if(description){<p [id]="id+'-description'">{{description}}</p>}
 <div data-krds-component="bottom-sheet" data-krds-part="body"><ng-content/></div>
</dialog>`})
export class BottomSheet implements OnInit,OnChanges {
 @Input() id=inject(CatalogIds).allocate('sheet');@Input() open:boolean|undefined;@Input() defaultOpen:boolean|undefined;@Input() title='';@Input() description='';@Input() initialFocusId='';@Input() returnFocusId='';@Input({transform:booleanAttribute}) dismissOnOutside=false;
 @Output() readonly openChange=new EventEmitter<BottomSheetChange>();@Output() readonly cancel=new EventEmitter<void>();@ViewChild('dialog') dialog?:ElementRef<HTMLDialogElement>;private readonly state=new OwnedState<boolean>();private dragY:number|null=null;private suppressHandleClick=false;private pendingCancel=false;constructor(){afterEveryRender(()=>{if(this.pendingCancel&&!this.isOpen()){this.pendingCancel=false;this.cancel.emit();}});}
 ngOnInit():void{this.check();}ngOnChanges():void{this.check();}private check():void{this.state.initialize(this.open,this.defaultOpen,false);}isOpen():boolean{return this.state.current(this.open);}
 close(reason:'close'|'escape'|'outside'|'drag'):void{if(!this.isOpen())return;this.pendingCancel=true;this.state.request(this.open,false,()=>this.openChange.emit({open:false,reason}));}

 outside(event:PointerEvent):void{if(!this.dismissOnOutside||event.target!==event.currentTarget)return;const box=this.dialog?.nativeElement.getBoundingClientRect();if(box&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))this.close('outside');}
 dragStart(event:PointerEvent):void{this.suppressHandleClick=false;this.dragY=event.clientY;try{(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);}catch{/* A canceled or synthetic pointer has no capture to retain. */}}
 handleClick(event:MouseEvent):void{if(this.suppressHandleClick&&event.detail>0){this.suppressHandleClick=false;return;}this.suppressHandleClick=false;this.close('close');}cancelDrag():void{this.dragY=null;this.suppressHandleClick=false;}
 dragEnd(event:PointerEvent):void{const start=this.dragY;this.dragY=null;if(start!==null&&event.clientY-start>80){this.suppressHandleClick=true;this.close('drag');}}
}
