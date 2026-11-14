import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';

@Component({selector: 'krds-visually-hidden', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, host:{'[attr.id]':'null'}, template: `<span data-krds-component="visually-hidden" data-krds-part="root" [id]="id" [attr.lang]="lang||null" [attr.data-krds-state]="variant??'text'" [attr.data-krds-variant]="variant??'text'" [style]="variant==='interactive-overlay'?'position:relative;display:inline-block':clipping">@if(variant!=='interactive-overlay'){{{content}}}<ng-content/></span>`})
export class VisuallyHidden {@Input() id='';@Input() lang='';@Input() content='';@Input() variant:C.VisuallyHiddenContract['variant']='text';readonly clipping='position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0';}
