import {booleanAttribute, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CatalogControl } from '../../internal/catalog-control';

@Component({selector: 'krds-textarea', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, providers:[{provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>Textarea),multi:true},{provide:NG_VALIDATORS,useExisting:forwardRef(()=>Textarea),multi:true}],host:{'[attr.id]':'null'}, template: `<div data-krds-component="textarea" data-krds-part="root" [attr.data-krds-state]="state()"><label data-krds-component="textarea" data-krds-part="label" [for]="id">{{label}}</label><textarea #control data-krds-component="textarea" data-krds-part="control" [id]="id" [attr.name]="name||null" [disabled]="isDisabled()" [required]="required" [readOnly]="readOnly" [attr.maxlength]="maxLength??null" [attr.aria-describedby]="description()" [attr.aria-invalid]="invalid?'true':null" [value]="display()" (input)="input($event)" (blur)="blur()" (keydown)="freshGesture($event)" (pointerdown)="freshGesture()" (compositionstart)="begin()" (compositionend)="end($event)" [rows]="rows"></textarea><span data-krds-component="textarea" data-krds-part="count">{{display().length}}{{maxLength!==undefined?' / '+maxLength:''}}</span></div>`})
export class Textarea extends CatalogControl<string> {
 @Input({transform:booleanAttribute}) readOnly=false;@Input() maxLength:number|undefined;@Input() rows=5;
 @ViewChild('control') control?:ElementRef<HTMLInputElement|HTMLTextAreaElement>;
 readonly draft=signal<string|null>(null);private compositionPair:string|null=null;
 display():string{return this.draft()??this.current();}
 begin():void{this.compositionPair=null;this.composing=true;this.draft.set(this.control?.nativeElement.value??this.current());}
 input(event:Event):void{const value=(event.target as HTMLInputElement).value;if(this.composing){this.draft.set(value);return;}const pair=this.compositionPair;this.compositionPair=null;const type=(event as InputEvent).inputType;if(pair===value&&(!type||['insertText','insertCompositionText','insertFromComposition'].includes(type))){this.sync();return;}this.request(value);}
 end(event:Event):void{const value=(event.target as HTMLInputElement).value;this.composing=false;this.draft.set(null);this.compositionPair=value;this.request(value);}
 freshGesture(event?:KeyboardEvent):void{if(!event||!event.isComposing&&event.keyCode!==229)this.compositionPair=null;}
 blur():void{this.compositionPair=null;this.onTouched();}
 protected override resetTransient():void{this.draft.set(null);this.compositionPair=null;}
 protected override sync():void{const field=this.control?.nativeElement;if(field&&!this.composing&&field.value!==this.current()){const start=field.selectionStart,end=field.selectionEnd,direction=field.selectionDirection;field.value=this.current();if(start!==null&&end!==null)try{field.setSelectionRange(Math.min(start,field.value.length),Math.min(end,field.value.length),direction??undefined);}catch{}}}
}
