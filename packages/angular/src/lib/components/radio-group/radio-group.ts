import {afterEveryRender,booleanAttribute,ChangeDetectionStrategy,Component,ElementRef,EventEmitter,forwardRef,inject,Input,Output,signal,type OnDestroy,type OnInit,type SimpleChanges} from '@angular/core';
import {NG_VALIDATORS,NG_VALUE_ACCESSOR,RequiredValidator,type AbstractControl,type ControlValueAccessor,type ValidationErrors} from '@angular/forms';
import type {RadioGroupOption} from '@unofficial-krds/contracts';
import {CatalogIds} from '../../internal/catalog-ids';
import {ControlMode} from '../../internal/behavior';
@Component({selector:'krds-radio-group',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,host:{'[attr.id]':'null'},providers:[
 {provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>RadioGroup),multi:true},
 {provide:NG_VALIDATORS,useExisting:forwardRef(()=>RadioGroup),multi:true},
 // Angular's broad [required][formControl] selector also matches a custom group.
 // Alias its public validator token to this RequiredValidator subtype, so both
 // registrations use the option-aware implementation without mutating a directive.
 {provide:RequiredValidator,useExisting:forwardRef(()=>RadioGroup)},
],template:`
<fieldset data-krds-component="radio-group" data-krds-part="root" [disabled]="isDisabled()" [attr.data-krds-state]="state()" [attr.aria-describedby]="description()" [attr.data-krds-size]="size" [attr.data-krds-appearance]="appearance" (focusin)="enter($event)" (focusout)="leave($event)">
 <legend data-krds-component="radio-group" data-krds-part="legend">{{label}}</legend>
 @for(option of options;track option.value;let i=$index){<div data-krds-component="radio-group" data-krds-part="item">
  <input data-krds-component="radio-group" data-krds-part="control" type="radio" tabindex="0" [id]="optionId(option,i)" [attr.name]="name||null" [value]="option.value" [checked]="current()===option.value" [disabled]="!!option.disabled||isDisabled()" [required]="required" (change)="request(option.value)" (keydown)="key($event,i)" (blur)="onTouched()"/>
  <label data-krds-component="radio-group" data-krds-part="label" [for]="optionId(option,i)">{{option.label}}<span data-krds-component="radio-group" data-krds-part="indicator" aria-hidden="true"></span></label>
 </div>}
</fieldset>`})
export class RadioGroup extends RequiredValidator implements OnInit,OnDestroy,ControlValueAccessor {
 @Input() id=inject(CatalogIds).allocate('radio');@Input() name='';@Input() label='';@Input() options:readonly RadioGroupOption[]=[];
 @Input() value:string|null|undefined;@Input() defaultValue:string|null|undefined;
 @Input({transform:booleanAttribute}) override required=false;@Input({transform:booleanAttribute}) disabled=false;@Input({transform:booleanAttribute}) invalid=false;
 @Input() helpId='';@Input() errorId='';@Input() size:'medium'|'large'='medium';@Input() appearance:'default'|'chip'='default';
 @Output() readonly valueChange=new EventEmitter<{value:string|null}>();
 private readonly element=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;private readonly local=signal<string|null>(null);private readonly formDisabled=signal(false);private readonly mode=new ControlMode();
 private forms=false;private initialized=false;private baseline:string|null=null;private form:HTMLFormElement|null=null;private tabIntent:KeyboardEvent|null=null;
 private validatorChange=()=>{};onChange:(value:string|null)=>void=()=>{};onTouched=()=>{};
 private readonly recordTab=(event:KeyboardEvent)=>{this.tabIntent=event.key==='Tab'&&!event.defaultPrevented?event:null;};
 private readonly cancelTab=()=>{this.tabIntent=null;};
 private readonly reset=(event:Event)=>queueMicrotask(()=>{if(event.defaultPrevented)return;if(!this.forms&&this.value===undefined)this.local.set(this.baseline);this.sync();});
 constructor(){super();const document=this.element.ownerDocument;document.addEventListener('keydown',this.recordTab);document.addEventListener('pointerdown',this.cancelTab);afterEveryRender(()=>{this.sync();const form=this.element.closest('form');if(form!==this.form){this.form?.removeEventListener('reset',this.reset);this.form=form;form?.addEventListener('reset',this.reset);}});}
 ngOnInit():void{this.mode.check(this.value,this.defaultValue);this.baseline=this.defaultValue??null;if(!this.forms)this.local.set(this.baseline);this.initialized=true;this.check();}
 override ngOnChanges(_changes:SimpleChanges={}):void{if(this.initialized)this.mode.check(this.value,this.defaultValue);this.check();this.validatorChange();}
 current():string|null{return this.forms?this.local():this.value===undefined?this.local():this.value;}
 isDisabled():boolean{return this.disabled||this.formDisabled();}
 state():string{return [this.isDisabled()&&'disabled',this.invalid&&'invalid'].filter(Boolean).join(' ');}
 description():string|null{return [this.helpId,this.invalid?this.errorId:''].filter(Boolean).join(' ')||null;}
 optionId(option:RadioGroupOption,index:number):string{return option.id??this.id+'-'+index;}
 private check():void{
  if(new Set(this.options.map(option=>option.value)).size!==this.options.length)throw new TypeError('Duplicate radio values.');
  const ids=this.options.map((option,index)=>{if(option.id!==undefined&&(typeof option.id!=='string'||!option.id.trim()))throw new TypeError('Radio option IDs must be nonempty strings.');return this.optionId(option,index);});
  if(new Set(ids).size!==ids.length)throw new TypeError('Radio option IDs must be unique, including generated IDs.');
  const value=this.current();if(value!==null&&!this.options.some(option=>option.value===value))throw new TypeError('Unknown radio value.');
 }
 private controls():HTMLInputElement[]{return [...this.element.querySelectorAll<HTMLInputElement>('input[type=radio]')];}
 private sync():void{for(const control of this.controls())control.checked=this.current()!==null&&control.value===this.current();}
 request(value:string):void{if(this.isDisabled()||value===this.current()){this.sync();return;}if(this.forms||this.value===undefined)this.local.set(value);this.onChange(value);this.valueChange.emit({value});/* Controlled parents re-render next; afterEveryRender reconciles, so a pending change is not reverted before the owner applies it. */if(this.forms||this.value===undefined)this.sync();}
 key(event:KeyboardEvent,index:number):void{if(event.key!=='Tab'||event.altKey||event.metaKey||event.ctrlKey)return;const controls=this.controls();const direction=event.shiftKey?-1:1;for(let next=index+direction;next>=0&&next<controls.length;next+=direction){const control=controls[next];if(control&&!control.disabled){event.preventDefault();control.focus();return;}}}
 enter(event:FocusEvent):void{
  if(this.element.contains(event.relatedTarget as Node))return;
  const intent=this.tabIntent;this.tabIntent=null;if(!intent||intent.defaultPrevented||event.relatedTarget!==intent.target&&!(event.relatedTarget===null&&intent.target===this.element.ownerDocument.body))return;
  const enabled=this.controls().filter(control=>!control.disabled);const target=intent.shiftKey?enabled.at(-1):enabled[0];if(target&&target!==event.target)target.focus();
 }
 leave(event:FocusEvent):void{if(!this.element.contains(event.relatedTarget as Node))this.tabIntent=null;}
 writeValue(value:string|null):void{this.forms=true;this.local.set(value);if(this.initialized)this.check();this.sync();}
 registerOnChange(fn:(value:string|null)=>void):void{this.onChange=fn;}registerOnTouched(fn:()=>void):void{this.onTouched=fn;}setDisabledState(disabled:boolean):void{this.formDisabled.set(disabled);}
 override validate(_control:AbstractControl):ValidationErrors|null{return this.required&&this.current()===null?{required:true}:null;}
 override registerOnValidatorChange(fn:()=>void):void{this.validatorChange=fn;}
 ngOnDestroy():void{this.form?.removeEventListener('reset',this.reset);this.element.ownerDocument.removeEventListener('keydown',this.recordTab);this.element.ownerDocument.removeEventListener('pointerdown',this.cancelTab);}
}
