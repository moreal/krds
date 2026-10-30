import {isPlatformBrowser} from '@angular/common';
import {Directive,Input,Output,EventEmitter,ElementRef,inject,afterEveryRender,PLATFORM_ID,type OnDestroy} from '@angular/core';
import {focusables,KRDS_ENVIRONMENT,usable} from './behavior';
import {restoreCatalogFocus} from './catalog-focus';
import {ModalLayer} from './modal-stack';
/** Native dialog markup, one shared modal stack, and composition-owned return focus. */
@Directive({selector:'dialog[krdsLayer]',standalone:true,host:{'[attr.open]':'renderOpen() ? "" : null','[attr.aria-modal]':'renderOpen() ? "true" : null','(cancel)':'cancel($event)'}})
export class NativeLayer implements OnDestroy {
 @Input() krdsLayer=false;@Input() layerRootComponent='';@Input() layerReturnId='';@Input() layerFallbackId='';@Input() layerInitialId='';@Input() layerRestore=true;@Input() layerEntryFocus=true;@Input() layerDismissOnOutside=false;
 @Output() readonly layerClose=new EventEmitter<void>();@Output() readonly layerOutside=new EventEmitter<void>();
 readonly element=inject<ElementRef<HTMLDialogElement>>(ElementRef).nativeElement;
 private readonly document=inject(KRDS_ENVIRONMENT).document;private readonly browser=isPlatformBrowser(inject(PLATFORM_ID));
 private layer:ModalLayer|null=null;private active=false;private rendered=false;private failedSignature:string|null=null;
 private opener:HTMLElement|null=null;private ancestors:HTMLElement[]=[];private requested:HTMLElement|null=null;private requestedAncestors:HTMLElement[]=[];
 private wrapper:HTMLDivElement|null=null;private outsidePointer:number|null=null;private placeholder:Comment|null=null;private origin:HTMLElement|null=null;private priorDir:string|null=null;private theme:Map<string,string>|null=null;
 constructor(){afterEveryRender({write:()=>this.sync()});}
 renderOpen():boolean{return this.browser?this.active:this.krdsLayer;}
 captureOpener(element:HTMLElement):void{this.requested=element;this.requestedAncestors=[];for(let parent=element.parentElement;parent;parent=parent.parentElement)this.requestedAncestors.push(parent);}
 private sync():void{
  if(!this.krdsLayer){this.failedSignature=null;if(this.active)this.close();this.requested=null;this.requestedAncestors=[];}
  else if(!this.active&&this.failedSignature!==this.layerInitialId)this.enter();
  if(this.active)this.inheritTheme();this.rendered=true;
 }
 private enter():void{
  const active=this.document.activeElement as HTMLElement|null;this.opener=this.requested??(this.rendered&&usable(active)&&active!==this.document.body?active:null);
  this.ancestors=this.requested?[...this.requestedAncestors]:[];if(!this.requested)for(let parent=this.opener?.parentElement;parent;parent=parent.parentElement)this.ancestors.push(parent);
  this.requested=null;this.requestedAncestors=[];this.origin=this.element.parentElement;this.placeholder=this.document.createComment('krds-layer-origin');this.element.parentNode?.insertBefore(this.placeholder,this.element);
  this.priorDir=this.element.getAttribute('dir');this.theme=new Map();this.inheritTheme();const wrapper=this.document.createElement('div');wrapper.setAttribute('data-krds-native-layer','');if(this.layerRootComponent){wrapper.setAttribute('data-krds-component',this.layerRootComponent);wrapper.setAttribute('data-krds-part','root');wrapper.setAttribute('data-krds-state','open');}wrapper.style.cssText='position:fixed;inset:0;background:var(--krds-color-light-alpha-black50,rgba(0,0,0,.5))';wrapper.addEventListener('pointerdown',this.outsideStart);wrapper.addEventListener('pointerup',this.outsideEnd);wrapper.appendChild(this.element);this.document.body.appendChild(wrapper);this.wrapper=wrapper;
  // The same explicit inert/focus/scroll owner is used for custom Modal and native
  // dialog compositions. Avoid a second browser top-layer/return-focus owner.
  this.element.open=true;this.element.setAttribute('aria-modal','true');this.active=true;this.layer=new ModalLayer(this.document,this.wrapper!,this.element,{onEscape:()=>this.layerClose.emit()});this.layer.enter();
  try{
   const first=focusables(this.element)[0];const target=this.layerInitialId?this.document.getElementById(this.layerInitialId):this.element;
   if(!target||!usable(target)||target!==this.element&&target!==first)throw new TypeError('Initial focus must identify this dialog or its first usable interactive element.');
   if(this.layerEntryFocus)target.focus();
  }catch(error){this.failedSignature=this.layerInitialId;this.close(false);throw error;}
 }
 private inheritTheme():void{
  const source=this.origin;if(!source)return;const style=this.document.defaultView?.getComputedStyle(source);if(!style)return;
  for(const property of [...Array.from(style).filter(property=>property.startsWith('--krds-')),'font-family','font-size','font-weight','font-style','line-height','letter-spacing','color']){if(this.theme&&!this.theme.has(property))this.theme.set(property,this.element.style.getPropertyValue(property));this.element.style.setProperty(property,style.getPropertyValue(property));}
  this.element.setAttribute('dir',style.direction);
 }
 private detach():void{
  this.element.open=false;this.element.removeAttribute('aria-modal');
  if(this.placeholder?.parentNode)this.placeholder.parentNode.insertBefore(this.element,this.placeholder);
  else this.element.parentNode?.removeChild(this.element);
  this.placeholder?.parentNode?.removeChild(this.placeholder);this.placeholder=null;this.wrapper?.removeEventListener('pointerdown',this.outsideStart);this.wrapper?.removeEventListener('pointerup',this.outsideEnd);this.wrapper?.parentNode?.removeChild(this.wrapper);this.wrapper=null;this.outsidePointer=null;
  if(this.priorDir===null)this.element.removeAttribute('dir');else this.element.setAttribute('dir',this.priorDir);
  for(const [property,value] of this.theme??[])value?this.element.style.setProperty(property,value):this.element.style.removeProperty(property);this.theme=null;this.origin=null;
 }
 cancel(event:Event):void{event.preventDefault();if(this.layer?.isTop())this.layerClose.emit();}
 private readonly outsideStart=(event:PointerEvent)=>{this.outsidePointer=this.layer?.isTop()&&event.button===0&&event.target===event.currentTarget?event.pointerId:null;};
 private readonly outsideEnd=(event:PointerEvent)=>{const allowed=this.layer?.isTop()&&this.outsidePointer===event.pointerId&&event.button===0&&event.target===event.currentTarget;this.outsidePointer=null;if(allowed&&this.layerDismissOnOutside)this.layerOutside.emit();};
 isActive():boolean{return this.active;}closeForOwner():void{this.close(false);}
 private close(restore=true,destroying=false):void{
  if(!this.active)return;const origin=this.origin;this.active=false;const result=this.layer?.leave(()=>this.detach())??{wasTop:false,remaining:false};this.layer=null;
  if(restore&&result.wasTop&&this.layerRestore){const named=this.layerReturnId?this.document.getElementById(this.layerReturnId):null;const fallback=this.layerFallbackId?this.document.getElementById(this.layerFallbackId):null;const candidates=[named,fallback,this.opener,...this.ancestors].filter(node=>!destroying||!node||!origin?.contains(node));restoreCatalogFocus(this.document,candidates);}
  this.opener=null;this.ancestors=[];
 }
 ngOnDestroy():void{this.close(true,true);}
}
