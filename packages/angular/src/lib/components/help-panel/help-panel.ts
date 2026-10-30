import {CatalogIds} from '../../internal/catalog-ids';
import {booleanAttribute, Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject, ElementRef, afterEveryRender, ViewChild, type OnInit, type OnChanges, type OnDestroy } from '@angular/core';
import type * as C from '@unofficial-krds/contracts';
import { ControlMode, usable, focusables, composing, KRDS_ENVIRONMENT } from '../../internal/behavior';
import { OwnedState, CatalogOpen } from '../../internal/catalog-state';
import {restoreCatalogFocus} from '../../internal/catalog-focus';
import {NgTemplateOutlet} from '@angular/common';import {NativeLayer} from '../../internal/native-layer';
@Component({selector: 'krds-help-panel', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, imports:[NgTemplateOutlet,NativeLayer], template: `<div>@if(showOpener){<button data-krds-component="help-panel" data-krds-part="opener" type="button" [id]="actualOpenerId()" [attr.aria-expanded]="isOpen()" (click)="setOpen(!isOpen())">도움말 패널 열기</button>}@if(narrow()){<dialog [krdsLayer]="isOpen()" [layerRestore]="false" [layerEntryFocus]="false" (layerClose)="setOpen(false)" tabindex="-1" data-krds-component="help-panel" data-krds-part="root" [attr.aria-labelledby]="id+'-title'"><ng-container [ngTemplateOutlet]="content"/></dialog>}@else{<aside #wide tabindex="-1" data-krds-component="help-panel" data-krds-part="root" [attr.aria-labelledby]="id+'-title'" [hidden]="!isOpen()"><ng-container [ngTemplateOutlet]="content"/></aside>}<ng-template #content><h2 data-krds-component="help-panel" data-krds-part="title" [id]="id+'-title'">{{mode==='help'?'도움말':'이용 안내'}}</h2><button type="button" data-krds-component="help-panel" data-krds-part="close" (click)="setOpen(false)">도움말 닫기</button><ul data-krds-component="help-panel" data-krds-part="body">@for(topic of topics;track topic.id){<li><h3><button data-krds-component="help-panel" data-krds-part="topic-trigger" type="button" [attr.aria-expanded]="selected()===topic.id" [attr.aria-controls]="id+'-'+topic.id+'-content'" (click)="choose(topic.id)">{{topic.title}}</button></h3><div data-krds-component="help-panel" data-krds-part="body" [id]="id+'-'+topic.id+'-content'" [hidden]="selected()!==topic.id"><p>{{topic.content}}</p>@for(link of topic.relatedLinks;track $index){<a data-krds-component="help-panel" data-krds-part="related" [href]="link.href" target="_blank" rel="noopener noreferrer">{{link.label}} (새 창)</a>}</div></li>}</ul><ng-content/></ng-template></div>`})
export class HelpPanel extends CatalogOpen implements OnDestroy {
 @Input() id=inject(CatalogIds).allocate('help');@Input() openerId='';@Input({transform:booleanAttribute}) showOpener=true;@Input() topics:readonly C.HelpTopic[]=[];@Input() selectedTopicId:string|null|undefined;@Input() defaultSelectedTopicId:string|null|undefined;@Input() mode:'help'|'tutorial'='help';@Input() fallbackFocusId='';
 @Output() readonly topicChange=new EventEmitter<{id:string|null}>();@ViewChild('wide') wide?:ElementRef<HTMLElement>;@ViewChild(NativeLayer) layer?:NativeLayer;
 protected override initialOpen=true;readonly narrow=signal(false);private readonly topic=new OwnedState<string|null>();private readonly document=inject(KRDS_ENVIRONMENT).document;private readonly element=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 private media:MediaQueryList|undefined;private previous=false;private priorTopic:string|null|undefined;private initiator:HTMLElement|null=null;private ancestors:HTMLElement[]=[];private generation=0;private destroyed=false;
 private readonly resize=()=>this.narrow.set(this.media?.matches??false);
 constructor(){super();this.media=this.document.defaultView?.matchMedia?.('(max-width: 767px)');this.resize();this.initialOpen=!this.narrow();this.media?.addEventListener('change',this.resize);afterEveryRender(()=>this.reconcile());}
 actualOpenerId():string{return this.openerId||this.id+'-opener';}
 override ngOnInit():void{super.ngOnInit();this.check();}override ngOnChanges():void{super.ngOnChanges();this.check();}
 private check():void{this.topic.initialize(this.selectedTopicId,this.defaultSelectedTopicId,null);}
 selected():string|null{return this.topic.current(this.selectedTopicId);}
 choose(id:string):void{this.topic.request(this.selectedTopicId,this.selected()===id?null:id,next=>this.topicChange.emit({id:next}));}
 override setOpen(open:boolean):void{if(open&&!this.isOpen())this.capture();super.setOpen(open);}
 private capture():void{const active=this.document.activeElement as HTMLElement|null;const panel=this.layer?.element??this.wide?.nativeElement;if(active&&active!==this.document.body&&!panel?.contains(active)){this.initiator=active;this.ancestors=[];for(let parent=active.parentElement;parent;parent=parent.parentElement)this.ancestors.push(parent);}}
 private reconcile():void{
  const open=this.isOpen(),changedTopic=this.priorTopic!==undefined&&this.priorTopic!==this.selected();const opened=open&&!this.previous;const closed=!open&&this.previous;
  if(opened||open&&changedTopic){this.capture();const generation=++this.generation;queueMicrotask(()=>{if(this.destroyed||generation!==this.generation||!this.isOpen())return;const panel=this.narrow()?this.layer?.element:this.wide?.nativeElement;if(usable(panel??null))panel!.focus();});}
  if(closed){this.generation++;this.layer?.closeForOwner();this.restore();}
  this.previous=open;this.priorTopic=this.selected();
 }
 private restore(destroying=false):void{const candidates=[this.document.getElementById(this.actualOpenerId()),this.document.getElementById(this.fallbackFocusId),this.initiator,...this.ancestors].filter(node=>!destroying||!node||!this.element.contains(node));restoreCatalogFocus(this.document,candidates);}
 ngOnDestroy():void{this.destroyed=true;this.generation++;this.media?.removeEventListener('change',this.resize);const wasOpen=this.previous;this.layer?.closeForOwner();if(wasOpen)this.restore(true);}
}
