import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';

@Component({selector: 'krds-identifier', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush,  template: `<section data-krds-component="identifier" data-krds-part="root" [attr.data-krds-state]="theme"><img data-krds-component="identifier" data-krds-part="logo" [src]="logo.src" [alt]="logo.alt"/><p data-krds-component="identifier" data-krds-part="text">{{relationshipText}}</p></section>`})
export class Identifier { @Input() institutionName=''; @Input() logo:C.LogoData={src:'',alt:''}; @Input() relationshipText=''; @Input() theme:'light'|'dark'='light'; }
