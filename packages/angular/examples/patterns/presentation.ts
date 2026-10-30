import {afterEveryRender,ChangeDetectionStrategy,Component,ElementRef,EventEmitter,Input,Output,inject,type OnChanges,type OnDestroy,type SimpleChanges} from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import {Button,TextInput,Textarea,NativeSelect,RadioGroup,Modal,Spinner,StructuredList,Pagination,Header,SideNavigation,Footer,SkipLink,Link} from '@unofficial-krds/angular';
import type {PatternView,PatternContent,Interaction,FormView,SearchView,ConsentView,LayoutView,Field,Destination,Category,NavigationEntry} from './view';
/** Plain presentation composition, shared by the running fixture and sixteen local stories. */
@Component({selector:'krds-pattern-presentation',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,
 imports:[ReactiveFormsModule,Button,TextInput,Textarea,NativeSelect,RadioGroup,Modal,Spinner,StructuredList,Pagination,Header,SideNavigation,Footer,SkipLink,Link],
 styles:[`
 :host{display:block;color:var(--krds-color-text-basic,#171717);font-family:system-ui,sans-serif;line-height:1.6}*{box-sizing:border-box}main,.pattern-notice{max-width:68rem;margin-inline:auto;padding:1rem}h1{font-size:2rem}h2{font-size:1.4rem}form,.consent-fields{display:grid;gap:1.25rem;max-width:42rem}input,select,textarea,button{font:inherit}p{overflow-wrap:anywhere}a:focus-visible,button:focus-visible,[tabindex]:focus-visible{outline:3px solid Highlight;outline-offset:3px}.pattern-actions{display:flex;flex-wrap:wrap;gap:1rem;align-items:center}.pattern-reset{margin-inline-start:2rem}.pattern-error{border-inline-start:4px solid #b31b1b;padding:.75rem}#example-form-errors{border:2px solid #b31b1b;padding:1rem}.consent-intro{min-height:24rem}.layout-body{display:grid;grid-template-columns:minmax(12rem,18rem) minmax(0,1fr);max-width:76rem;margin:auto;gap:1.5rem;padding:1rem}.layout-body main{width:100%;min-width:0;min-height:22rem}.layout-notice{padding:1rem} @media(max-width:48rem){.layout-body{display:block}.layout-sidebar{display:none}} @media(forced-colors:active){.pattern-error,#example-form-errors{border-color:CanvasText}}
 `],template:`
 @if(view.patternId==='service-layout'){
  <krds-skip-link [links]="skipLinks"/>
  <krds-header [home]="home" [utilityItems]="utilities" [search]="headerSearch" [mainNavigation]="navigation" [currentId]="layout.currentId" [mobileOpen]="layout.mobileOpen" mobileTriggerId="example-layout-mobile-open" mobileTriggerLabel="전체메뉴" navigationLabel="주요 메뉴" (mobileOpenChange)="send({type:'mobile',open:$event.open})" (click)="layoutClick($event)"/>
  <section class="layout-notice" aria-label="독립 예제 안내"><p>{{content.identity.notice}}</p></section>
  <div class="layout-body"><aside class="layout-sidebar"><krds-side-navigation title="예제 메뉴" [items]="navigation" [currentId]="layout.currentId" [expandedIds]="layout.expandedIds" (expandedChange)="expanded($event.ids)" (click)="layoutClick($event)"/></aside>
   <main id="example-layout-main"><h1 id="example-main-heading" tabindex="-1">{{content.sections[layout.currentId].title}}</h1><p>{{content.sections[layout.currentId].body}}</p><krds-link [href]="destination('accessibility')" label="키보드 이용 안내" (click)="destinationClick($event,'accessibility')"/></main></div>
  <krds-footer [serviceLogo]="logo" [contacts]="[]" [utilityLinks]="utilities" [privacyPolicy]="privacy" [policyLinks]="policies" [copyrightText]="content.identity.copyrightText" (click)="layoutClick($event)"/>
 }@else{
  <section class="pattern-notice" aria-label="독립 예제 안내"><p>{{content.identity.notice}}</p><p>{{content.identity.dataNotice}}</p></section>
  <main [attr.data-pattern]="view.patternId">
   @switch(view.patternId){
    @case('form-errors'){
     <h1>예제 입력폼</h1>
     @if(formView.errors.length){<section id="example-form-errors" role="alert" aria-labelledby="example-form-errors-heading"><h2 id="example-form-errors-heading">입력 내용을 확인하세요</h2><ol>@for(error of formView.errors;track error.field){<li><a [href]="'#'+error.targetId" (click)="errorLink($event,error.field)">{{error.message}}</a></li>}</ol></section>}
     <form id="example-form" novalidate [attr.aria-busy]="busy" (submit)="submit($event,'submit')" (reset)="reset($event)" (keydown)="compositionKey($event)">
      <krds-text-input id="example-form-title" label="예제 제목 (필수)" name="title" [formControl]="form.controls.title" (valueChange)="send({type:'field',field:'title',value:$event.value})" [required]="true" helpId="example-form-title-help" [invalid]="!!fieldError('title')" [errorId]="fieldError('title')?'example-form-title-error':''"/>
      <p id="example-form-title-help">4자 이상 60자 이하의 예제 제목을 입력하세요.</p>
      @if(fieldError('title')){<p class="pattern-error" id="example-form-title-error">{{fieldError('title')}}</p>}
      <krds-native-select id="example-form-category" label="연습 유형 (필수)" name="category" [options]="content.formCategories" [formControl]="form.controls.category" (valueChange)="send({type:'field',field:'category',value:$event.value})" [required]="true" [invalid]="!!fieldError('category')" [error]="fieldError('category')"/>
      <krds-textarea id="example-form-detail" label="추가 설명 (선택)" name="detail" [formControl]="form.controls.detail" (valueChange)="send({type:'field',field:'detail',value:$event.value})" helpId="example-form-detail-help" [invalid]="!!fieldError('detail')" [errorId]="fieldError('detail')?'example-form-detail-error':''"/>
      <p id="example-form-detail-help">추가 설명은 120자 이하로 입력하세요.</p>
      @if(fieldError('detail')){<p class="pattern-error" id="example-form-detail-error">{{fieldError('detail')}}</p>}
      <div class="pattern-actions"><button krdsButton id="example-form-submit" type="submit" [disabled]="busy">예제 저장</button><button krdsButton class="pattern-reset" id="example-form-reset" type="reset">초기화</button></div>
     </form>
     @if(busy){<krds-spinner [pending]="true" label="예제 저장 처리 중"/>}
     @if(formView.phase==='error'){<p role="alert">{{formView.error}}</p><button krdsButton id="example-form-retry" (click)="send({type:'retry'})">다시 시도</button>}
     @if(formView.receipt){<p role="status">로컬 예제 완료 {{formView.receipt.id}} · {{formView.receipt.title}}. 실제 신청이나 전송은 이루어지지 않았습니다.</p>}
    }
    @case('search-results'){
     <h1>로컬 자료 검색</h1><p>열두 개 자료는 모두 가상의 학습 기록입니다.</p>
     <form role="search" (submit)="submit($event,'search')" (keydown)="compositionKey($event)"><krds-text-input id="example-search-query" type="search" label="검색어" name="query" [formControl]="searchQuery" (valueChange)="send({type:'query',value:$event.value})"/><button krdsButton id="example-search-submit" type="submit" [disabled]="busy">검색</button></form>
     <krds-native-select id="example-search-category" label="자료 유형" name="category" [options]="content.resourceCategories" [formControl]="searchCategory" (valueChange)="filterValue($event.value)"/>
     @if(busy){<krds-spinner [pending]="true" label="검색 중"/><p role="status">검색 결과를 확인하고 있습니다.</p>}
     @if(searchView.phase==='error'){<p role="alert">{{searchView.error}}</p><button krdsButton id="example-search-retry" (click)="send({type:'retry'})">다시 시도</button>}
     @if(searchView.phase==='success'){
      <p id="example-search-count" aria-live="polite">검색어 “{{searchView.appliedQuery}}” · {{categoryLabel(searchView.category)}} · {{searchView.total}}건</p>
      @if(searchView.total){
       <ng-template #resourceContent let-item><h2>{{item.title}}</h2><p>{{resourceSummary(item.id)}}</p></ng-template>
       <krds-structured-list id="example-search-resources" [items]="resourceItems" [itemTemplate]="resourceContent"/>
      }@else{<p role="status">검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.</p>}
     }
     @if(searchView.pageCount>0&&(searchView.phase==='success'||searchView.phase==='loading')){<section aria-label="검색 결과 페이지" [attr.aria-busy]="busy"><krds-pagination [page]="searchView.page" [pageCount]="searchView.pageCount" [hrefForPage]="pageHref" (pageChange)="send({type:'page',page:$event.page})"/></section>}
    }
    @case('consent-confirmation'){
     <h1>예제 이용 안내 확인</h1><div class="consent-intro"><h2>로컬 예제 이용 안내</h2><p>이 예제는 선택 사항을 읽고 확인 대화상자를 이용하는 연습 화면입니다.</p><p>필수 안내와 선택 안내를 각각 읽어 주세요. 선택한 결과는 현재 화면에서만 확인합니다.</p></div>
     <div class="consent-fields">@for(group of content.consent;track group.id){<section [attr.aria-labelledby]="group.id+'-heading'"><h2 [id]="group.id+'-heading'">{{group.title}}</h2><div [id]="group.id+'-help'">@for(paragraph of group.paragraphs;track $index){<p>{{paragraph}}</p>}</div>
      <krds-radio-group [id]="group.id" [name]="group.id" [label]="group.title" [options]="radioOptions(group.id)" [formControl]="group.id==='requiredChoice'?requiredChoice:optionalChoice" (valueChange)="consentValue(group.id,$event.value)" [required]="group.required" [helpId]="group.id+'-help'" [invalid]="group.required&&view.phase==='invalid'" [errorId]="group.required&&view.phase==='invalid'?'example-consent-error':''"/>
     </section>}</div>
     @if(consentView.phase==='invalid'){<p id="example-consent-error" role="alert">{{consentView.error}}</p>}
     <button krdsButton id="example-consent-review" (click)="review($event)">확인하기</button>
     <krds-modal id="example-consent-dialog" title="예제 선택 확인" description="선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다." [open]="consentView.modalOpen" initialFocusId="example-consent-dialog" (openChange)="modalChange($event.open)">
      <div [attr.aria-busy]="busy"><p>필수 {{consentView.requiredChoice?'동의함':'동의하지 않음'}}</p><p>선택 {{consentView.optionalChoice?'동의함':'동의하지 않음'}}</p>
       @if(busy){<krds-spinner [pending]="true" label="선택 확인 중"/>}
       @if(consentView.phase==='error'){<p role="alert">{{consentView.error}}</p><button krdsButton id="example-consent-retry" (click)="send({type:'retry'})">다시 시도</button>}
      </div>
      <div krdsModalActions class="pattern-actions"><button krdsButton id="example-consent-cancel" (click)="send({type:'close'})">돌아가기</button><button krdsButton id="example-consent-confirm" [disabled]="busy||consentView.phase==='error'" (click)="send({type:'confirm'})">예제 완료</button></div>
     </krds-modal>
     @if(consentView.receipt){<p role="status">로컬 예제 완료 {{consentView.receipt.id}} · 필수 동의함 · 선택 {{consentView.receipt.optionalChoice?'동의함':'동의하지 않음'}}</p>}
    }
   }
  </main>
 }
 `})
export class PatternPresentation implements OnChanges,OnDestroy{
 @Input({required:true}) view!:PatternView;@Input({required:true}) content!:PatternContent;@Input() caseId='';
 @Input() urls:{pages:Record<number,string>;destinations:Record<Destination,string>}={pages:{},destinations:{overview:'#',form:'#',search:'#',consent:'#',accessibility:'#',privacy:'#'}};
 @Output() readonly interaction=new EventEmitter<Interaction>();@Output() readonly opening=new EventEmitter<HTMLElement>();
 readonly form=new FormGroup({title:new FormControl('',{nonNullable:true}),category:new FormControl('',{nonNullable:true}),detail:new FormControl('',{nonNullable:true})});
 readonly searchQuery=new FormControl('',{nonNullable:true});readonly searchCategory=new FormControl<Category>('all',{nonNullable:true});readonly requiredChoice=new FormControl<string|null>(null);readonly optionalChoice=new FormControl<string|null>('decline');
 private readonly element=inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 readonly skipLinks=[{id:'main',label:'본문 바로가기',targetId:'example-main-heading'}];
 // Self-authored independent text mark; no original KRDS or third-party image is embedded.
 readonly logo={src:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="240" height="48" viewBox="0 0 240 48"%3E%3Crect width="240" height="48" fill="%23ffffff"/%3E%3Ctext x="8" y="32" font-size="23" fill="%23171717"%3EKRDS Practice%3C/text%3E%3C/svg%3E',alt:'독립 KRDS 조합 예제'};
 get home(){return {href:this.destination('overview'),label:this.content.identity.name,logo:this.logo};}get utilities(){return [{id:'accessibility',label:'키보드 이용 안내',href:this.destination('accessibility')}];}get headerSearch(){return {label:'검색 연습',onRequest:()=>this.send({type:'navigate',id:'search'})};}get privacy(){return {label:'개인정보 처리방침',href:this.destination('privacy')};}get policies(){return [{label:'키보드 이용 안내',href:this.destination('accessibility')}];}
 get busy(){return this.view.phase==='loading';}get formView(){return this.view as FormView;}get searchView(){return this.view as SearchView;}get consentView(){return this.view as ConsentView;}get layout(){return this.view as LayoutView;}
 get navigation():readonly NavigationEntry[]{const map=(entries:readonly NavigationEntry[]):NavigationEntry[]=>entries.map(item=>({...item,...(item.href?{href:this.destination(item.id as Destination)}:{}),...(item.children?{children:map(item.children)}:{})}));return map(this.content.navigation);}
 get resourceItems(){return this.searchView.items.map(item=>({id:item.id,title:item.title,metadata:[{label:'자료 유형',value:this.categoryLabel(item.category)},{label:'등록일',value:item.date}],tags:[]}));}
 resourceSummary(id:string){return this.searchView.items.find(item=>item.id===id)?.summary??'';}
 readonly pageHref=(page:number)=>this.urls.pages[page]??'#';destination(id:Destination){return this.urls.destinations[id];}
 categoryLabel(category:string){return this.content.resourceCategories.find(item=>item.value===category)?.label??category;}
 fieldError(field:Field){return this.view.patternId==='form-errors'?this.view.errors.find(error=>error.field===field)?.message??'':'';}
 ngOnChanges(changes:SimpleChanges):void{if(!changes['view'])return;
  if(this.view.patternId==='form-errors'){this.form.setValue(this.view.values,{emitEvent:false});if(this.busy)this.form.disable({emitEvent:false});else this.form.enable({emitEvent:false});}
  if(this.view.patternId==='search-results'){this.searchQuery.setValue(this.view.query,{emitEvent:false});this.searchCategory.setValue(this.view.category,{emitEvent:false});}
  if(this.view.patternId==='consent-confirmation'){this.requiredChoice.setValue(this.view.requiredChoice===null?null:this.view.requiredChoice?'agree':'decline',{emitEvent:false});this.optionalChoice.setValue(this.view.optionalChoice?'agree':'decline',{emitEvent:false});}
 }
 constructor(){afterEveryRender(()=>{if(this.view?.patternId==='form-errors')for(const field of ['title','category','detail'] as const)this.element.querySelector<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('#example-form-'+field)?.setCustomValidity(this.fieldError(field));});}
 send(action:Interaction){this.interaction.emit(action);}submit(event:Event,type:'submit'|'search'){if(event.defaultPrevented)return;event.preventDefault();this.send({type});}
 compositionKey(event:KeyboardEvent){if(event.key==='Enter'&&(event.isComposing||event.keyCode===229))event.preventDefault();}
 reset(event:Event){queueMicrotask(()=>{if(!event.defaultPrevented){this.form.reset({title:'',category:'',detail:''},{emitEvent:false});this.send({type:'reset'});}});}
 errorLink(event:Event,field:Field){event.preventDefault();this.send({type:'error-link',field});}
 readonly choices={requiredChoice:[{id:'example-consent-required-agree',value:'agree',label:'동의함'},{id:'example-consent-required-decline',value:'decline',label:'동의하지 않음'}],optionalChoice:[{id:'example-consent-optional-agree',value:'agree',label:'동의함'},{id:'example-consent-optional-decline',value:'decline',label:'동의하지 않음'}]};
 radioOptions(field:'requiredChoice'|'optionalChoice'){return this.choices[field];}
 review(event:Event){this.opening.emit(event.currentTarget as HTMLElement);this.send({type:'review'});}modalChange(open:boolean){if(!open)this.send({type:'close'});}
 expanded(ids:readonly string[]){for(const id of ['examples','help'] as const)if(ids.includes(id)!==this.layout.expandedIds.includes(id))this.send({type:'expand',id,expanded:ids.includes(id)});}
 destinationClick(event:MouseEvent,id:Destination){if(event.defaultPrevented||event.button!==0||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;event.preventDefault();this.send({type:'navigate',id});}
 layoutClick(event:MouseEvent){const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!link)return;const id=(Object.keys(this.urls.destinations) as Destination[]).find(id=>link.getAttribute('href')===this.destination(id));if(id)this.destinationClick(event,id);}
 filterValue(category:string){if(this.content.resourceCategories.some(item=>item.value===category))this.send({type:'filter',category:category as Category});}
 consentValue(field:'requiredChoice'|'optionalChoice',value:string|null){if(value==='agree'||value==='decline')this.send({type:'consent',field,value:value==='agree'});}
 ngOnDestroy(){}
}
