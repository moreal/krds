import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CatalogControl } from '../../internal/catalog-control';

@Component({selector: 'krds-quantity-toggle', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, providers:[{provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>QuantityToggle),multi:true},{provide:NG_VALIDATORS,useExisting:forwardRef(()=>QuantityToggle),multi:true}],host:{'[attr.id]':'null'}, template: `<div data-krds-component="quantity-toggle" data-krds-part="root" role="group" [attr.aria-label]="label" [attr.data-krds-state]="state()"><span data-krds-component="quantity-toggle" data-krds-part="label">{{label}}</span><button type="button" data-krds-component="quantity-toggle" data-krds-part="decrement" [attr.aria-label]="label+' 줄이기'" [attr.aria-describedby]="id+'-output'" [attr.aria-disabled]="isDisabled()||current()<=min" (click)="adjust(-1)">−</button><output data-krds-component="quantity-toggle" data-krds-part="output" [id]="id+'-output'">{{current()}}{{unit}}</output><input type="hidden" [name]="name" [value]="current()" [disabled]="isDisabled()"/><button type="button" data-krds-component="quantity-toggle" data-krds-part="increment" [attr.aria-label]="label+' 늘리기'" [attr.aria-describedby]="id+'-output'" [attr.aria-disabled]="isDisabled()||current()>=max" (click)="adjust(1)">+</button></div>`})
export class QuantityToggle extends CatalogControl<number> {
 @Input() min=0;@Input() max=10;@Input() step=1;@Input() unit='';
 protected override initial():number{return this.min??0;}
 protected override validateConfiguration():void{const count=(this.max-this.min)/this.step;if(!Number.isFinite(count)||this.step<=0||count<0||count>10||Math.abs(count-Math.round(count))>1e-8)throw new RangeError('Quantity requires at most 11 consistent values.');const value=this.initialized||this.forms?this.current():this.value!==undefined?this.value:this.defaultValue!==undefined?this.defaultValue:this.min;const index=(value-this.min)/this.step;if(typeof value!=='number'||!Number.isFinite(value)||value<this.min||value>this.max||Math.abs(index-Math.round(index))>1e-8)throw new RangeError('Quantity value must be a finite in-bounds step member.');}
 adjust(direction:number):void{if(this.isDisabled())return;const next=Number((this.current()+direction*this.step).toPrecision(12));if(next>=this.min&&next<=this.max)this.request(next);}
}
