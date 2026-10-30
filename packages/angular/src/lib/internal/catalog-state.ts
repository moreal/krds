import { Directive, Input, Output, EventEmitter, signal, type OnInit, type OnChanges } from '@angular/core';
import { ControlMode } from './behavior';
export class OwnedState<T> {
 readonly local=signal<T|undefined>(undefined);private readonly mode=new ControlMode();private initialized=false;
 initialize(value:T|undefined,initial:T|undefined,fallback:T):void{this.mode.check(value,initial);if(!this.initialized){this.local.set(initial===undefined?fallback:initial);this.initialized=true;}}
 current(value:T|undefined):T{return value===undefined?this.local()!:value;}
 request(value:T|undefined,next:T,emit:(next:T)=>void):boolean{if(Object.is(this.current(value),next))return false;if(value===undefined)this.local.set(next);emit(next);return true;}
}
@Directive()
export abstract class CatalogOpen implements OnInit,OnChanges {
 @Input() open:boolean|undefined;@Input() defaultOpen:boolean|undefined;
 @Output() readonly openChange=new EventEmitter<{open:boolean}>();
 protected readonly visibility=new OwnedState<boolean>();protected initialOpen=false;
 ngOnInit():void{this.visibility.initialize(this.open,this.defaultOpen,this.initialOpen);}
 ngOnChanges():void{this.visibility.initialize(this.open,this.defaultOpen,this.initialOpen);}
 isOpen():boolean{return this.visibility.current(this.open)??this.initialOpen;}
 setOpen(open:boolean):void{this.visibility.request(this.open,open,next=>this.openChange.emit({open:next}));}
}
