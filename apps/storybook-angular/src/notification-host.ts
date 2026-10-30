import {afterEveryRender,ChangeDetectionStrategy,Component,ElementRef,inject,type OnDestroy} from '@angular/core';
import {TabBar} from '@unofficial-krds/angular';

/** Local application chrome for the notification specimens, with real native navigation. */
@Component({selector:'krds-notification-host',standalone:true,imports:[TabBar],changeDetection:ChangeDetectionStrategy.OnPush,styles:':host{display:block;min-inline-size:0}',template:`<div data-krds-host="notification-frame"><ng-content/><krds-tab-bar currentId="home" [items]="items"/></div>`})
export class NotificationHost implements OnDestroy{
 readonly items=[{id:'home',label:'홈',href:'/local/home',icon:'⌂'},{id:'apply',label:'신청',href:'/local/apply',icon:'▣'},{id:'support',label:'지원',href:'/local/support',icon:'?'}];
 private readonly element=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 private readonly view=this.element.ownerDocument.defaultView;
 private bar:HTMLElement|null=null;private observer:ResizeObserver|undefined;private destroyed=false;
 private readonly align=()=>{if(this.destroyed||!this.view||!this.bar)return;const clearance=Math.max(0,this.view.innerHeight-this.bar.getBoundingClientRect().top)+16;for(const notification of this.element.querySelectorAll<HTMLElement>('[data-krds-component="toast"][data-krds-part="root"],[data-krds-component="snackbar"][data-krds-part="root"]'))if(notification.style.insetBlockEnd!==clearance+'px')notification.style.insetBlockEnd=clearance+'px';};
 constructor(){this.view?.addEventListener('resize',this.align);afterEveryRender(()=>{if(this.destroyed)return;const bar=this.element.querySelector<HTMLElement>('[data-krds-component="tab-bar"][data-krds-part="root"]');if(bar!==this.bar){this.observer?.disconnect();this.bar=bar;const Observer=this.view?.ResizeObserver;if(bar&&Observer){this.observer=new Observer(this.align);this.observer.observe(bar);}}this.align();});}
 ngOnDestroy():void{this.destroyed=true;this.observer?.disconnect();this.view?.removeEventListener('resize',this.align);this.bar=null;}
}
