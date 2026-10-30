import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CatalogControl } from '../../internal/catalog-control';

@Component({selector: 'krds-range-slider', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, providers:[{provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>RangeSlider),multi:true},{provide:NG_VALIDATORS,useExisting:forwardRef(()=>RangeSlider),multi:true}],host:{'[attr.id]':'null'}, template: `<div data-krds-component="range-slider" data-krds-part="root" [attr.data-krds-state]="state()"><label data-krds-component="range-slider" data-krds-part="label" [for]="id">{{label}}</label><input #control data-krds-component="range-slider" data-krds-part="control" type="range" [id]="id" [attr.name]="name||null" [min]="min" [max]="max" [step]="step" [value]="current()" [disabled]="isDisabled()" [attr.aria-describedby]="description()" [attr.aria-valuetext]="format()" (input)="adjust($event)" (blur)="onTouched()"/><span data-krds-component="range-slider" data-krds-part="min">{{min}}</span><span data-krds-component="range-slider" data-krds-part="max">{{max}}</span><output data-krds-component="range-slider" data-krds-part="output" [attr.for]="id">{{format()}}</output></div>`})
export class RangeSlider extends CatalogControl<number> {
 @Input() min=0;@Input() max=100;@Input() step=10;@Input() valueText:((value:number)=>string)|undefined;
 @ViewChild('control') control?:ElementRef<HTMLInputElement>;
 protected override initial():number{return this.min??0;}
 protected override validateConfiguration():void{if(!Number.isFinite(this.min)||!Number.isFinite(this.max)||!Number.isFinite(this.step)||this.min>=this.max||this.step<=0)throw new RangeError('Invalid range bounds or step.');const value=this.initialized||this.forms?this.current():this.value!==undefined?this.value:this.defaultValue!==undefined?this.defaultValue:this.min;const index=(value-this.min)/this.step;if(typeof value!=='number'||!Number.isFinite(value)||value<this.min||value>this.max||Math.abs(index-Math.round(index))>1e-8)throw new RangeError('Range value must be a finite in-bounds step member.');}
 format():string{return this.valueText?.(this.current())??String(this.current());}
 adjust(event:Event):void{const value=Number((event.target as HTMLInputElement).value);this.request(Number((this.min+Math.round((value-this.min)/this.step)*this.step).toPrecision(12)));}
 protected override sync():void{if(this.control)this.control.nativeElement.value=String(this.current());}
}
