import {CatalogIds} from '../../internal/catalog-ids';
import {booleanAttribute,Component,Input,Output,EventEmitter,ChangeDetectionStrategy,signal,inject,type OnInit,type OnChanges} from '@angular/core';
import type {HeaderContract,NavigationItem} from '@unofficial-krds/contracts';
import {OwnedState} from '../../internal/catalog-state';
import {MainMenu} from '../main-menu/main-menu';
@Component({selector:'krds-header',standalone:true,imports:[MainMenu],host:{style:'display:contents'},changeDetection:ChangeDetectionStrategy.OnPush,template:`
<header data-krds-component="header" data-krds-part="root" [attr.data-krds-state]="sticky?'sticky':''" [attr.data-krds-action-layout]="actionLayout" [style.position]="sticky?'sticky':null" [style.top]="sticky?'0':null">
 <a data-krds-component="header" data-krds-part="identity" [href]="home.href" [attr.aria-label]="home.label"><img [src]="home.logo.src" [alt]="home.logo.alt"/></a>
 @if(utilityItems.length>4){<button data-krds-component="header" data-krds-part="utility-trigger" type="button" [attr.aria-expanded]="utilitiesOpen()" [attr.aria-controls]="mobileTriggerId+'-utilities'" (click)="utilitiesOpen.update(toggle)">서비스 도구</button>}
 <ul data-krds-component="header" data-krds-part="utilities" [id]="mobileTriggerId+'-utilities'" [hidden]="utilityItems.length>4&&!utilitiesOpen()">@for(item of utilityItems;track item.id){<li><a [href]="item.href">{{item.label}}</a></li>}</ul>
 <div data-krds-component="header" data-krds-part="actions">@if(search){<button type="button" data-krds-component="header" data-krds-part="search" (click)="search.onRequest()">{{search.label}}</button>}
 <button type="button" data-krds-component="header" data-krds-part="mobile-trigger" [id]="mobileTriggerId" [attr.aria-expanded]="mobile()" (click)="setMobile(!mobile())">{{mobileTriggerLabel}}</button></div>
 <krds-main-menu data-krds-component="header" data-krds-part="navigation" [items]="mainNavigation" [label]="navigationLabel" [currentId]="currentId" [mobileOpen]="mobile()" [mobileTriggerId]="mobileTriggerId" [showMobileTrigger]="false" (mobileOpenChange)="setMobile($event.open)"/>
</header>`})
export class Header implements OnInit,OnChanges {
 @Input() home:HeaderContract['home']={href:'',label:'',logo:{src:'',alt:''}};@Input() utilityItems:HeaderContract['utilityItems']=[];@Input() search:HeaderContract['search'];@Input() mainNavigation:readonly NavigationItem[]=[];@Input() actionLayout:'vertical'|'horizontal'='horizontal';@Input({transform:booleanAttribute}) sticky=false;@Input() currentId='';@Input() mobileOpen:boolean|undefined;@Input() defaultMobileOpen:boolean|undefined;@Input() mobileTriggerId=inject(CatalogIds).allocate('header-menu');@Input() mobileTriggerLabel='전체 메뉴';@Input() navigationLabel='주요 메뉴';
 @Output() readonly mobileOpenChange=new EventEmitter<{open:boolean}>();readonly utilitiesOpen=signal(false);readonly toggle=(value:boolean)=>!value;private readonly mobileState=new OwnedState<boolean>();
 ngOnInit():void{this.check();}ngOnChanges():void{this.check();}private check():void{this.mobileState.initialize(this.mobileOpen,this.defaultMobileOpen,false);}mobile():boolean{return this.mobileState.current(this.mobileOpen);}setMobile(open:boolean):void{this.mobileState.request(this.mobileOpen,open,open=>this.mobileOpenChange.emit({open}));}
}
