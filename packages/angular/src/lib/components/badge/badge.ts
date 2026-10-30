import {booleanAttribute, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';

@Component({selector: 'krds-badge', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush,  template: `<span data-krds-component="badge" data-krds-part="root" [attr.data-krds-state]="numeric?'numeric':null" [attr.data-krds-appearance]="appearance" [attr.data-krds-tone]="tone" [attr.data-krds-size]="size"><span data-krds-component="badge" data-krds-part="label">{{label}}</span></span>`})
export class Badge implements OnChanges { @Input() label='';@Input() appearance:C.BadgeContract['appearance']='outline';@Input() tone:C.BadgeContract['tone']='secondary';@Input() size:C.Size='medium';@Input({transform:booleanAttribute}) numeric=false;ngOnChanges():void{if(String(this.tone)==='primary')throw new TypeError('Badge primary tone is unsupported.');} }
