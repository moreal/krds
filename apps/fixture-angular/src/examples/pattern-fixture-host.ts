import {afterEveryRender,ChangeDetectionStrategy,Component,signal,type OnDestroy} from '@angular/core';
import {PatternPresentation} from '../../../../packages/angular/examples/patterns/presentation';
import type {Destination,Interaction,PatternContent} from '../../../../packages/angular/examples/patterns/view';
import {createFixtureBridge} from '@unofficial-krds/test-contracts/driver';
import {createLocalDriver,createPatternState,transition,searchResources,patternScenarios,demoIdentity,formCategories,resourceCategories,consentContent,layoutNavigation,layoutSections,type PatternId,type PatternState,type PatternAction,type PatternEffect,type PatternFixtureCommand,type LocalDriver,type Category,type SearchState} from '@unofficial-krds/test-contracts/patterns';
/** Private, route-scoped integration host. Only this host owns model, URL and local completion. */
@Component({selector:'krds-fixture-app',standalone:true,imports:[PatternPresentation],changeDetection:ChangeDetectionStrategy.OnPush,host:{'(document:click)':'routeClick($event)'},
 template:`@if(mounted()){<krds-pattern-presentation [view]="state()" [content]="content" [caseId]="caseId" [urls]="urls()" (interaction)="dispatch($event)" (opening)="saveOpening($event)"/>}`})
export class PatternFixtureHost implements OnDestroy{
 readonly patternId=location.pathname.split('/')[2] as PatternId;readonly caseId=new URLSearchParams(location.search).get('case')??'';
 private readonly scenario=patternScenarios.find(item=>item.patternId===this.patternId&&item.caseId===this.caseId);
 readonly content:PatternContent={identity:demoIdentity,formCategories,resourceCategories,consent:consentContent,navigation:layoutNavigation,sections:layoutSections};
 readonly mounted=signal(true);readonly state=signal<PatternState>(this.initial());
 private driver:LocalDriver<PatternId>|null=null;private driverUnsubscribe:(()=>void)|null=null;private lastSequence=0;private pendingFocus:string[]=[];private savedScroll:{x:number;y:number}|null=null;private restoreScroll=false;private destroyed=false;
 readonly bridge=createFixtureBridge('angular',{__patternMounted:true,patternId:this.patternId,caseId:this.caseId});
 private readonly bridgeUnsubscribe=this.bridge.subscribe(snapshot=>{
  const mounted=snapshot['__patternMounted']!==false;if(mounted!==this.mounted()){this.mounted.set(mounted);this.releaseDriver();if(mounted)this.mountDriver();}
  const command=snapshot['__patternCommand'] as PatternFixtureCommand|undefined;
  if(command&&Number.isSafeInteger(command.sequence)&&command.sequence>this.lastSequence&&command.command==='settle'){
   this.lastSequence=command.sequence;if(this.driver)this.apply(this.driver.settle(command.ok===undefined?{}:{ok:command.ok}));
  }
 });
 private readonly popstate=()=>{if(this.driver){this.releaseDriver();this.mountDriver();this.pendingFocus.push(this.patternId==='service-layout'?'example-main-heading':'');}};
 constructor(){if(!this.scenario)throw new RangeError('Unknown example scenario: '+this.patternId+'/'+this.caseId);this.mountDriver();window.addEventListener('popstate',this.popstate);afterEveryRender(()=>{queueMicrotask(()=>{if(this.destroyed||!this.mounted())return;for(const id of this.pendingFocus.splice(0)){if(!id)continue;const target=document.getElementById(id);if(target&&!target.closest('[inert]'))target.focus();}if(this.restoreScroll&&!document.getElementById('example-consent-dialog')){this.restoreScroll=false;if(this.savedScroll)window.scrollTo({left:this.savedScroll.x,top:this.savedScroll.y,behavior:'instant'});}});});}
 private initial():PatternState{
  let state:PatternState=createPatternState(this.patternId,this.caseId);for(const action of this.scenario?.initialActions??[])state=transition(state,action).state;
  const params=new URLSearchParams(location.search);
  if(state.patternId==='search-results'){
   const query=params.get('query')??state.query;const rawCategory=params.get('category');const category:Category=resourceCategories.some(item=>item.value===rawCategory)?rawCategory as Category:rawCategory===null?state.category:'all';
   const rawPage=params.get('page');const parsed=rawPage!==null&&/^\d+$/.test(rawPage)?Number(rawPage):rawPage===null?state.page:1;const page=Number.isSafeInteger(parsed)&&parsed>0?parsed:1;
   state={...state,query,appliedQuery:query,category,...searchResources({query,category,page})};
  }
  if(state.patternId==='service-layout'){const id=params.get('section');if(id&&Object.hasOwn(layoutSections,id))state=transition(state,{type:'navigate',id:id as Destination}).state;}
  return state;
 }
 private mountDriver(){const initialState=this.initial();this.state.set(initialState);this.driver=createLocalDriver(this.patternId,{caseId:this.caseId,seed:this.scenario?.seed??'success',initialState});this.driverUnsubscribe=this.driver.subscribe(next=>{const previous=this.state();this.state.set(next);if(previous.patternId==='consent-confirmation'&&next.patternId==='consent-confirmation'&&previous.modalOpen&&!next.modalOpen)this.restoreScroll=true;});}
 private releaseDriver(){this.driverUnsubscribe?.();this.driverUnsubscribe=null;this.driver?.dispose();this.driver=null;this.pendingFocus=[];this.restoreScroll=false;}
 routeClick(event:MouseEvent){if(this.patternId!=='service-layout'||!this.mounted()||event.defaultPrevented||event.button!==0||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;const anchor=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!anchor||anchor.target&&anchor.target!=='_self'||anchor.hasAttribute('download'))return;const url=new URL(anchor.href,location.href),id=url.searchParams.get('section');if(url.origin!==location.origin||url.pathname!=='/examples/service-layout'||url.searchParams.get('case')!==this.caseId||!id||!Object.hasOwn(layoutSections,id))return;event.preventDefault();this.dispatch({type:'navigate',id:id as Destination});}
 saveOpening(_opener:HTMLElement){this.savedScroll={x:scrollX,y:scrollY};}
 dispatch(action:Interaction){if(!this.driver)return;const before=this.driver.getState();this.bridge.recordEvent('pattern:action',action);const result=this.driver.dispatch(action as PatternAction);this.apply(result);
  if(action.type==='navigate'&&result.state.patternId==='service-layout'&&before.patternId==='service-layout'&&before.currentId!==result.state.currentId){history.pushState(null,'',this.destination(result.state.currentId));this.bridge.recordEvent('pattern:route',{id:result.state.currentId});}
 }
 private apply(result:{state:PatternState;effects:PatternEffect[]}){for(const effect of result.effects){if(effect.type==='request'){this.bridge.recordEvent('pattern:request',{operation:effect.operation,requestId:effect.requestId,payload:effect.payload});if(result.state.patternId==='search-results'){const payload=effect.payload as {query:string;category:Category;page:number};const next=this.searchUrl(payload.query,payload.category,payload.page);if(location.pathname+location.search!==next)history.pushState(null,'',next);}}else this.pendingFocus.push(effect.targetId);}}
 private searchUrl(query:string,category:Category,page:number){return '/examples/search-results?'+new URLSearchParams({case:this.caseId,query,category,page:String(page)});}
 private destination(id:Destination){return '/examples/service-layout?'+new URLSearchParams({case:this.caseId,section:id});}
 urls(){const state=this.state();const search=state.patternId==='search-results'?state as SearchState:null;return {pages:Object.fromEntries(Array.from({length:search?.pageCount??0},(_,index)=>[index+1,this.searchUrl(search!.appliedQuery,search!.category,index+1)])),destinations:Object.fromEntries(Object.keys(layoutSections).map(id=>[id,this.destination(id as Destination)])) as Record<Destination,string>};}
 ngOnDestroy(){this.destroyed=true;window.removeEventListener('popstate',this.popstate);this.releaseDriver();this.bridgeUnsubscribe();this.bridge.dispose();}
}
