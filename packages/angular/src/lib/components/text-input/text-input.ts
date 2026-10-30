import {booleanAttribute, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CatalogControl } from '../../internal/catalog-control';

@Component({selector: 'krds-text-input', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, providers:[{provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>TextInput),multi:true},{provide:NG_VALIDATORS,useExisting:forwardRef(()=>TextInput),multi:true}],host:{'[attr.id]':'null'}, template: `<div data-krds-component="text-input" data-krds-part="root" [attr.data-krds-state]="state()" [attr.data-krds-size]="size"><label data-krds-component="text-input" data-krds-part="label" [for]="id">{{label}}</label><input #control data-krds-component="text-input" data-krds-part="control" [id]="id" [attr.name]="name||null" [disabled]="isDisabled()" [required]="required" [readOnly]="readOnly" [attr.maxlength]="maxLength??null" [attr.aria-describedby]="textDescription()" [attr.aria-invalid]="invalid||status==='error'?'true':null" [value]="display()" (input)="input($event)" (blur)="blur()" (keydown)="freshGesture($event)" (pointerdown)="freshGesture()" (compositionstart)="begin()" (compositionend)="end($event)" [type]="type" [attr.autocomplete]="autocomplete||null" [attr.inputmode]="inputMode||null" [attr.minlength]="minLength??null" [attr.pattern]="pattern||null" />@if(iconAction){<button type="button" data-krds-component="text-input" data-krds-part="icon-action" [attr.aria-label]="iconAction.label" [disabled]="isDisabled()" (click)="iconAction.onAction()">{{iconAction.label}}</button>}@if(status==='success'||status==='error'){<p data-krds-component="text-input" data-krds-part="status" [id]="id+'-status'">{{status==='success'?'확인되었습니다.':'입력 내용을 확인하세요.'}}</p>}</div>`})
export class TextInput extends CatalogControl<string> {
 @Input({transform:booleanAttribute}) readOnly=false; @Input() maxLength:number|undefined; @Input() minLength:number|undefined; @Input() pattern:string|undefined; @Input() type:C.TextInputContract['type']='text'; @Input() autocomplete=''; @Input() inputMode=''; @Input() status:C.TextInputContract['status']='default'; @Input() size:C.Size='medium'; @Input() iconAction:C.TextInputContract['iconAction'];
 @ViewChild('control') control?:ElementRef<HTMLInputElement|HTMLTextAreaElement>;
 readonly draft=signal<string|null>(null);private compositionPair:string|null=null;
 override state():string{return [super.state(),this.status==='success'?'success':this.status==='error'?'invalid error':''].filter(Boolean).join(' ');}
 textDescription():string|null{return [super.description(),(this.status==='success'||this.status==='error')?this.id+'-status':null].filter(Boolean).join(' ')||null;}
 display():string{return this.draft()??this.current();}
 begin():void{this.compositionPair=null;this.composing=true;this.draft.set(this.control?.nativeElement.value??this.current());}
 input(event:Event):void{const value=(event.target as HTMLInputElement).value;if(this.composing){this.draft.set(value);return;}const pair=this.compositionPair;this.compositionPair=null;const type=(event as InputEvent).inputType;if(pair===value&&(!type||['insertText','insertCompositionText','insertFromComposition'].includes(type))){this.sync();return;}this.request(value);}
 end(event:Event):void{const value=(event.target as HTMLInputElement).value;this.composing=false;this.draft.set(null);this.compositionPair=value;this.request(value);}
 freshGesture(event?:KeyboardEvent):void{if(!event||!event.isComposing&&event.keyCode!==229)this.compositionPair=null;}
 blur():void{this.compositionPair=null;this.onTouched();}
 protected override resetTransient():void{this.draft.set(null);this.compositionPair=null;}
 protected override sync():void{const field=this.control?.nativeElement;if(field&&!this.composing&&field.value!==this.current()){const start=field.selectionStart,end=field.selectionEnd,direction=field.selectionDirection;field.value=this.current();if(start!==null&&end!==null)try{field.setSelectionRange(Math.min(start,field.value.length),Math.min(end,field.value.length),direction??undefined);}catch{}}}
}
