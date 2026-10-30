import { booleanAttribute, Directive, Input, Output, EventEmitter, signal, inject, ElementRef, afterEveryRender, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type { ControlValueAccessor, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import {CatalogIds} from './catalog-ids';
import { ControlMode } from './behavior';
@Directive()
export abstract class CatalogControl<T> implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {
 @Input() id=inject(CatalogIds).allocate('field'); @Input() name=''; @Input() label=''; @Input({transform:booleanAttribute}) disabled=false; @Input({transform:booleanAttribute}) required=false; @Input({transform:booleanAttribute}) invalid=false; @Input() helpId=''; @Input() errorId='';
 @Input() value:T|undefined; @Input() defaultValue:T|undefined;
 @Output() readonly valueChange=new EventEmitter<{value:T}>();
 readonly element=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 readonly local=signal<T>(this.initial()); readonly formDisabled=signal(false);
 private validatorChange=()=>{};
 protected forms=false; protected initialized=false; protected baseline!:T; protected composing=false;
 private mode=new ControlMode(); private owner:HTMLFormElement|null=null;
 protected initial():T {return '' as T;}
 current():T{return this.forms?this.local():this.value===undefined?this.local():this.value;}
 isDisabled():boolean{return this.disabled||this.formDisabled();}
 description():string|null{return [this.helpId,this.errorId].filter(Boolean).join(' ')||null;}
 state():string{return [this.isDisabled()&&'disabled',this.invalid&&'invalid'].filter(Boolean).join(' ');}
 constructor(){afterEveryRender(()=>{this.sync();const owner=this.element.closest('form');if(owner!==this.owner){this.owner?.removeEventListener('reset',this.reset);this.owner=owner;owner?.addEventListener('reset',this.reset);}});}
 private reset=(event:Event)=>queueMicrotask(()=>{if(event.defaultPrevented)return;if(!this.forms&&this.value===undefined)this.local.set(this.baseline);this.composing=false;this.resetTransient();this.sync();});
 ngOnInit():void{this.mode.check(this.value,this.defaultValue);this.baseline=this.defaultValue===undefined?this.initial():this.defaultValue;if(!this.forms)this.local.set(this.baseline);this.initialized=true;this.validateConfiguration();}
 ngOnChanges():void{if(this.initialized)this.mode.check(this.value,this.defaultValue);this.validateConfiguration();this.validatorChange();}
 validate(_control:AbstractControl):ValidationErrors|null{const value=this.current();if(this.required&&(value===null||value===undefined||value===''))return {required:true};return null;}
 registerOnValidatorChange(fn:()=>void):void{this.validatorChange=fn;}
 protected validateConfiguration():void{}
 protected sync():void{}
 protected resetTransient():void{}
 request(value:T):void{if(this.isDisabled()||Object.is(value,this.current())){this.sync();return;}if(this.forms||this.value===undefined)this.local.set(value);this.onChange(value);this.valueChange.emit({value});this.sync();}
 onChange: (value:T)=>void=()=>{};onTouched=()=>{};
 writeValue(value:T|null):void{this.forms=true;this.local.set(value===null?this.initial():value);if(this.initialized)this.validateConfiguration();this.sync();}
 registerOnChange(fn:(value:T)=>void):void{this.onChange=fn;} registerOnTouched(fn:()=>void):void{this.onTouched=fn;} setDisabledState(disabled:boolean):void{this.formDisabled.set(disabled);}
 ngOnDestroy():void{this.owner?.removeEventListener('reset',this.reset);}
}
