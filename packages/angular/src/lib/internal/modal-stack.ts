import {composing,focusables} from './behavior';
interface ModalOptions {handleKeys?:boolean;focusGuard?:boolean;onEscape?:()=>void;}
const stacks=new WeakMap<Document,ModalLayer[]>();
/** Shared native DOM ownership for public Modal and modal compositions. */
export class ModalLayer {
 private isolated:[HTMLElement,boolean][]=[];private overflow='';private originalInert=false;private originalZ='';private observer:MutationObserver|null=null;private entered=false;
 private readonly key=(event:KeyboardEvent)=>this.keydown(event);
 private readonly focus=(event:FocusEvent)=>{if(this.isTop()&&!this.content.contains(event.target as Node))this.content.focus();};
 constructor(readonly document:Document,readonly root:HTMLElement,readonly content:HTMLElement,private readonly options:ModalOptions={}){}
 isTop():boolean{return stacks.get(this.document)?.at(-1)===this;}
 enter():void{
  if(this.entered)return;this.entered=true;this.overflow=this.document.body.style.overflow;this.originalInert=this.root.inert;this.originalZ=this.root.style.zIndex;
  const stack=stacks.get(this.document)??[];stack.push(this);stacks.set(this.document,stack);this.document.body.style.overflow='hidden';this.reconcile();
  const Observer=this.document.defaultView?.MutationObserver;if(Observer){this.observer=new Observer(()=>this.reconcile());this.observer.observe(this.document.body,{childList:true});}
  if(this.options.handleKeys!==false)this.document.addEventListener('keydown',this.key);
  if(this.options.focusGuard!==false)this.document.addEventListener('focusin',this.focus);
 }
 reconcile():void{
  const stack=stacks.get(this.document)??[];if(stack.at(-1)!==this)return;
  for(let index=0;index<stack.length;index++){
   const layer=stack[index];layer.root.style.zIndex=String(1000+index*2);const higher=stack.slice(index+1).map(item=>item.root);
   for(const child of Array.from(this.document.body.children)){
    const element=child as HTMLElement;if(element===layer.root||higher.includes(element))continue;
    if(!layer.isolated.some(([candidate])=>candidate===element))layer.isolated.push([element,element.inert]);element.inert=true;
   }
  }
  this.root.inert=false;
 }
 leave(detach:()=>void=()=>{}):{wasTop:boolean;remaining:boolean}{
  if(!this.entered){detach();return {wasTop:false,remaining:!!stacks.get(this.document)?.length};}
  this.entered=false;this.observer?.disconnect();this.observer=null;
  const stack=stacks.get(this.document)??[];const index=stack.indexOf(this);const wasTop=index===stack.length-1;const successor=stack[index+1];
  if(successor){for(const [element,inert] of this.isolated){const snapshot=successor.isolated.find(([candidate])=>candidate===element);if(snapshot)snapshot[1]=inert;else successor.isolated.push([element,inert]);}successor.overflow=this.overflow;}
  if(index>=0)stack.splice(index,1);
  this.document.removeEventListener('keydown',this.key);this.document.removeEventListener('focusin',this.focus);
  for(const [element,inert] of this.isolated)element.inert=inert;this.isolated=[];this.root.inert=this.originalInert;this.root.style.zIndex=this.originalZ;
  detach();this.document.body.style.overflow=this.overflow;
  if(stack.length){this.document.body.style.overflow='hidden';stack.at(-1)!.reconcile();}
  return {wasTop,remaining:stack.length>0};
 }
 keydown(event:KeyboardEvent):void{
  if(!this.isTop()||event.defaultPrevented||composing(event))return;
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();this.options.onEscape?.();}
  else if(event.key==='Tab'){
   const candidates=focusables(this.content);
   const items=candidates.filter(element=>{
    if(element.tagName!=='INPUT')return true;
    const radio=element as HTMLInputElement;
    if(radio.type!=='radio'||!radio.name||radio.closest('[data-krds-component="radio-group"][data-krds-part="root"]'))return true;
    const group=candidates.filter(candidate=>candidate.tagName==='INPUT'&&(candidate as HTMLInputElement).type==='radio'&&(candidate as HTMLInputElement).name===radio.name&&(candidate as HTMLInputElement).form===radio.form&&candidate.getRootNode()===radio.getRootNode()) as HTMLInputElement[];
    return radio===(group.find(candidate=>candidate.checked)??group[0]);
   }),active=this.document.activeElement;
   if(!items.length){event.preventDefault();this.content.focus();}
   else if(event.shiftKey&&(active===items[0]||active===this.content)){event.preventDefault();items.at(-1)!.focus();}
   else if(!event.shiftKey&&(active===items.at(-1)||active===this.content)){event.preventDefault();items[0].focus();}
  }
 }
}
export function topModalContent(document:Document):HTMLElement|null{return stacks.get(document)?.at(-1)?.content??null;}
