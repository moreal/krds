import {CatalogIds} from '../../internal/catalog-ids';
import {booleanAttribute, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
@Component({selector: 'krds-checkbox', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, providers:[{provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>Checkbox),multi:true},{provide:NG_VALIDATORS,useExisting:forwardRef(()=>Checkbox),multi:true}],host:{'[attr.id]':'null'}, template: `<div data-krds-component="checkbox" data-krds-part="root" [attr.data-krds-state]="bits()" [attr.data-krds-size]="size" [attr.data-krds-appearance]="appearance"><input #control data-krds-component="checkbox" data-krds-part="control" type="checkbox"  [id]="id" [attr.name]="name||null" [value]="value" [checked]="current()" [indeterminate]="indeterminate" [required]="required" [disabled]="isDisabled()" [attr.aria-invalid]="invalid?'true':null" [attr.aria-describedby]="description()" (change)="toggle($event)" (blur)="onTouched()"/><label data-krds-component="checkbox" data-krds-part="label" [for]="id"><span data-krds-component="checkbox" data-krds-part="indicator" [attr.data-krds-state]="bits()" aria-hidden="true"></span>{{label}}</label></div>`})
export class Checkbox implements OnInit,OnChanges,OnDestroy {
 @Input() id=inject(CatalogIds).allocate('checkbox');@Input() name='';@Input() label='';@Input() value='on';@Input() checked:boolean|undefined;@Input() defaultChecked:boolean|undefined;@Input({transform:booleanAttribute}) indeterminate=false;@Input({transform:booleanAttribute}) disabled=false;@Input({transform:booleanAttribute}) required=false;@Input({transform:booleanAttribute}) invalid=false;@Input() helpId='';@Input() errorId='';@Input() size:'medium'|'large'='medium';@Input() appearance:'default'|'chip'='default';
 @Output() readonly checkedChange=new EventEmitter<{checked:boolean}>();@ViewChild('control') control?:ElementRef<HTMLInputElement>;
 readonly local=signal(false);readonly formDisabled=signal(false);private mode=new ControlMode();private initialized=false;private baseline=false;private forms=false;private owner:HTMLFormElement|null=null;
 validate():{required:true}|null{return this.required&&!this.current()?{required:true}:null;}
 onChange:(value:boolean)=>void=()=>{};onTouched=()=>{};
 current():boolean{return this.forms?this.local():this.checked??this.local();}isDisabled():boolean{return this.disabled||this.formDisabled();}description():string|null{return [this.helpId,this.errorId].filter(Boolean).join(' ')||null;}
 bits():string{return [this.current()?'checked':'unchecked',this.indeterminate&&'mixed',this.isDisabled()&&'disabled',this.invalid&&'invalid'].filter(Boolean).join(' ');}
 constructor(){afterEveryRender(()=>{this.sync();const owner=this.control?.nativeElement.form??null;if(owner!==this.owner){this.owner?.removeEventListener('reset',this.reset);this.owner=owner;owner?.addEventListener('reset',this.reset);}});}
 ngOnInit():void{this.mode.check(this.checked,this.defaultChecked);this.baseline=this.defaultChecked??false;if(!this.forms)this.local.set(this.baseline);this.initialized=true;}
 ngOnChanges():void{if(this.initialized)this.mode.check(this.checked,this.defaultChecked);}
 private reset=(event:Event)=>queueMicrotask(()=>{if(event.defaultPrevented)return;if(!this.forms&&this.checked===undefined)this.local.set(this.baseline);this.sync();});
 sync():void{if(this.control){this.control.nativeElement.checked=this.current();this.control.nativeElement.indeterminate=this.indeterminate;}}
 toggle(event:Event):void{const checked=(event.target as HTMLInputElement).checked;if(this.isDisabled()||checked===this.current()){this.sync();return;}if(this.forms||this.checked===undefined)this.local.set(checked);this.onChange(checked);this.checkedChange.emit({checked});this.sync();}
 writeValue(value:boolean|null):void{this.forms=true;this.local.set(value??false);this.sync();}registerOnChange(fn:(value:boolean)=>void):void{this.onChange=fn;}registerOnTouched(fn:()=>void):void{this.onTouched=fn;}setDisabledState(value:boolean):void{this.formDisabled.set(value);}ngOnDestroy():void{this.owner?.removeEventListener('reset',this.reset);}
}
