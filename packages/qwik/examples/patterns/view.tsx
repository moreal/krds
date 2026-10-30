import './patterns.css';
import { initializePatternFormBoundary } from './form-boundary';
import { $, component$, useOnDocument, useSignal, useVisibleTask$, type QRL } from '@builder.io/qwik';
import { Button, TextInput, NativeSelect, Textarea, Spinner, StructuredList, Pagination, RadioGroup, Modal, Header, SideNavigation, Footer, SkipLink, Link } from '@unofficial-krds/qwik';

/** Structural, serializable presentation contract. No fixture model/driver imports. */
type ViewPhase='editing'|'invalid'|'confirming'|'loading'|'success'|'error';
interface ViewBase {phase:ViewPhase;error:string|null}
interface FormValues {title:string;category:string;detail:string}
interface FormError {field:'title'|'category'|'detail';targetId:string;errorId:string;message:string}
interface ResourceView {id:string;title:string;category:string;summary:string;date:string}
export type PatternViewState =
 | (ViewBase & {patternId:'form-errors';values:FormValues;errors:FormError[];receipt:(FormValues&{id:string})|null})
 | (ViewBase & {patternId:'search-results';query:string;appliedQuery:string;category:string;page:number;pageCount:number;total:number;items:ResourceView[]})
 | (ViewBase & {patternId:'consent-confirmation';requiredChoice:boolean|null;optionalChoice:boolean;modalOpen:boolean;receipt:{id:string;optionalChoice:boolean}|null})
 | (ViewBase & {patternId:'service-layout';currentId:string;expandedIds:string[];mobileOpen:boolean});
interface NavigationView {id:string;label:string;href?:string;children?:readonly NavigationView[]}

export interface PatternViewProps {
 state: PatternViewState;
 content: {
  identity: {name:string;notice:string;dataNotice:string;copyrightText:string};
  formCategories: {value:string;label:string}[];
  resourceCategories: {value:string;label:string}[];
  consent: {id:'requiredChoice'|'optionalChoice';title:string;paragraphs:string[]}[];
  navigation: NavigationView[]; sections: Record<string,{title:string;body:string}>;
 };
 caseId: string;
 onAction$: QRL<(action:any)=>unknown>;
}
export const PatternView = component$<PatternViewProps>(p => {
 useOnDocument('qinit', initializePatternFormBoundary);
 const formRoot=useSignal<HTMLElement>();
 // CSR remounts occur after the document's one qinit event. Install only the
 // same idempotent DOM boundary; semantic state and native rendering stay QRLs.
 useVisibleTask$(async({track})=>{const root=track(()=>formRoot.value);if(root)await initializePatternFormBoundary(undefined,root);},{strategy:'document-ready'});
 const s=p.state, c=p.content, action=p.onAction$;
 const notice=<aside aria-label="예제 안내"><p>{c.identity.notice}</p><p>{c.identity.dataNotice}</p></aside>;
 if(s.patternId==='form-errors') return <main ref={formRoot} data-pattern={s.patternId}><h1>예제 입력폼</h1>{notice}
  <form id="example-form" data-krds-pattern-form noValidate aria-busy={s.phase==='loading'} preventdefault:submit onSubmit$={async(_,form)=>{const data=new FormData(form);if(s.phase!=='loading')for(const field of ['title','category','detail'] as const){const value=String(data.get(field)??'');if(value!==s.values[field])await action({type:'field',field,value});}await action({type:'submit'});}} onReset$={async event=>{await Promise.resolve();if(!event.defaultPrevented)await action({type:'reset'});}}>
   {!!s.errors.length&&<section id="example-form-errors" aria-labelledby="example-form-errors-title" role="alert"><h2 id="example-form-errors-title">입력 내용을 확인하세요</h2><ol>{s.errors.map((error)=><li key={error.field}><a href={'#'+error.targetId} preventdefault:click onClick$={()=>action({type:'error-link',field:error.field})}>{error.message}</a></li>)}</ol></section>}
   <TextInput id="example-form-title" name="title" label="예제 제목 (필수)" required value={s.values.title} disabled={s.phase==='loading'} invalid={s.errors.some((e)=>e.field==='title')} helpId="example-form-title-help" errorId="example-form-title-error" onValueChange$={({value})=>action({type:'field',field:'title',value})}/>
   <p id="example-form-title-help">제목은 4자 이상 60자 이하로 입력하세요.</p>
   {s.errors.filter((e)=>e.field==='title').map((e)=><p key={e.field} id={e.errorId}>{e.message}</p>)}
   <NativeSelect id="example-form-category" name="category" label="연습 유형 (필수)" required options={c.formCategories} value={s.values.category} disabled={s.phase==='loading'} invalid={s.errors.some((e)=>e.field==='category')} error={s.errors.find((e)=>e.field==='category')?.message} onValueChange$={({value})=>action({type:'field',field:'category',value})}/>
   <Textarea id="example-form-detail" name="detail" label="추가 설명 (선택)" value={s.values.detail} disabled={s.phase==='loading'} invalid={s.errors.some((e)=>e.field==='detail')} helpId="example-form-detail-help" errorId="example-form-detail-error" onValueChange$={({value})=>action({type:'field',field:'detail',value})}/>
   <p id="example-form-detail-help">추가 설명은 120자 이하로 입력하세요.</p>{s.errors.filter((e)=>e.field==='detail').map((e)=><p key={e.field} id={e.errorId}>{e.message}</p>)}
   <div><Button id="example-form-submit" type="submit" disabled={s.phase==='loading'}>예제 저장</Button> <Button id="example-form-reset" type="reset" variant="tertiary">초기화</Button></div>
   {s.phase==='loading'&&<Spinner pending label="예제 저장 중" completionMessage="예제 저장 완료"/>}{s.phase==='error'&&<div role="alert"><p>{s.error}</p><Button id="example-form-retry" onClick$={()=>action({type:'retry'})}>다시 시도</Button></div>}
   {s.receipt&&<p role="status">로컬 예제 완료: {s.receipt.id} · {s.receipt.title}</p>}
  </form></main>;
 if(s.patternId==='search-results') {
  const params=new URLSearchParams({case:p.caseId,query:s.appliedQuery,category:s.category});
  return <main ref={formRoot} data-pattern={s.patternId}><h1>로컬 자료 검색</h1>{notice}<p>열두 개의 가상 학습 자료를 검색합니다.</p>
   <form id="example-search-form" data-krds-pattern-form role="search" preventdefault:submit onSubmit$={async(_,form)=>{const value=String(new FormData(form).get('query')??'');if(value!==s.query)await action({type:'query',value});await action({type:'search'});}}>
    <TextInput id="example-search-query" name="query" type="search" label="검색어" value={s.query} onValueChange$={({value})=>action({type:'query',value})}/><Button id="example-search-submit" type="submit">검색</Button>
    <NativeSelect id="example-search-category" name="category" label="자료 유형" options={c.resourceCategories} value={s.category} onValueChange$={({value})=>action({type:'filter',category:value})}/>
   </form>
   {s.phase==='loading'&&<Spinner pending label="검색 중" completionMessage="검색 완료"/>}{s.phase==='error'&&<div role="alert"><p>{s.error}</p><Button id="example-search-retry" onClick$={()=>action({type:'retry'})}>다시 시도</Button></div>}
   <div id="example-search-count" aria-live="polite">{s.phase==='success'?`검색어: ${s.appliedQuery||'전체'} · 자료 유형: ${c.resourceCategories.find(o=>o.value===s.category)?.label} · ${s.total}건`:s.phase==='loading'?'검색 중입니다.':'검색을 완료하지 못했습니다.'}</div>
   {s.phase==='success'&&(s.total===0?<p>검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.</p>:<><StructuredList title="검색 결과" items={s.items.map((item)=>({id:item.id,title:item.title,metadata:[{label:'자료 유형',value:c.resourceCategories.find(o=>o.value===item.category)?.label??null},{label:'날짜',value:item.date},{label:'설명',value:item.summary}]}))}/><Pagination page={s.page} pageCount={s.pageCount} hrefForPage$={(page)=>'/examples/search-results?'+new URLSearchParams({case:p.caseId,query:s.appliedQuery,category:s.category,page:String(page)}).toString()} hrefTemplate={'/examples/search-results?'+params.toString()+'&page={page}'}/></>)}
  </main>;
 }
 if(s.patternId==='consent-confirmation') return <main data-pattern={s.patternId}><h1>예제 이용 안내 확인</h1>{notice}
  {c.consent.map(group=><section key={group.id}><h2>{group.title}</h2>{group.paragraphs.map(text=><p key={text}>{text}</p>)}<RadioGroup id={'example-consent-'+(group.id==='requiredChoice'?'required':'optional')} name={group.id} label={group.title} required={group.id==='requiredChoice'} value={s[group.id]===null?null:s[group.id]?'agree':'decline'} invalid={group.id==='requiredChoice'&&s.phase==='invalid'} helpId={'example-consent-'+group.id+'-help'} options={[{id:`example-consent-${group.id==='requiredChoice'?'required':'optional'}-agree`,value:'agree',label:'동의함'},{id:`example-consent-${group.id==='requiredChoice'?'required':'optional'}-decline`,value:'decline',label:'동의하지 않음'}]} onValueChange$={({value})=>action({type:'consent',field:group.id,value:value==='agree'})}/><p id={'example-consent-'+group.id+'-help'}>{group.id==='requiredChoice'?'필수 안내에 동의해야 계속할 수 있습니다.':'동의하지 않아도 예제를 완료할 수 있습니다.'}</p></section>)}
  <p>선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다.</p>{s.phase==='invalid'&&<p role="alert">{s.error}</p>}
  <Button id="example-consent-review" onClick$={()=>action({type:'review'})}>확인하기</Button>
  <Modal id="example-consent-dialog" titleId="example-consent-dialog-title" title="예제 선택 확인" open={s.modalOpen} onOpenChange$={({open})=>{if(!open)return action({type:'close'});}} actions={<><Button id="example-consent-cancel" variant="tertiary" onClick$={()=>action({type:'close'})}>돌아가기</Button><Button id="example-consent-confirm" disabled={s.phase==='loading'} onClick$={()=>action({type:s.phase==='error'?'retry':'confirm'})}>{s.phase==='error'?'다시 시도':'예제 완료'}</Button></>}>
   <p>선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다.</p><dl><dt>필수 안내</dt><dd>{s.requiredChoice?'동의함':'동의하지 않음'}</dd><dt>선택 안내</dt><dd>{s.optionalChoice?'동의함':'동의하지 않음'}</dd></dl>{s.phase==='loading'&&<Spinner pending label="예제 완료 중" completionMessage="예제 완료"/>}{s.phase==='error'&&<p role="alert">{s.error}</p>}
  </Modal>{s.receipt&&<p role="status">로컬 예제 완료: {s.receipt.id} · 선택 안내: {s.receipt.optionalChoice?'동의함':'동의하지 않음'}</p>}
 </main>;
 const href=(id:string)=>'/examples/service-layout?'+new URLSearchParams({case:p.caseId,section:id}).toString();
 const navigation=c.navigation.map(item=>({...item,children:item.children?.map((child)=>({...child,href:href(child.id)}))}));
 // Independent inline text mark; no copied official assets or external resource.
 const logo={src:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="250" height="48"><rect width="250" height="48" fill="white"/><text x="8" y="31" font-size="19" fill="black">독립 KRDS 조합 예제</text></svg>'),alt:c.identity.name};
 return <div data-pattern={s.patternId}><SkipLink links={[{id:"main",label:"본문 바로가기",targetId:"example-main-heading"}]}/><Header home={{href:href('overview'),label:c.identity.name,logo}} utilityItems={[{id:'help',label:'키보드 이용 안내',href:href('accessibility')}]} navigationLabel="주요 메뉴" search={{label:"자료 검색",onRequest:$(async()=>{await action({type:"navigate",id:"search"});})}} mainNavigation={navigation} currentId={s.currentId} mobileOpen={s.mobileOpen} mobileTriggerId="example-layout-mobile-open" mobileTriggerLabel="전체메뉴" onMobileOpenChange$={({open})=>action({type:'mobile',open})}/>{notice}<div class="pattern-layout"><SideNavigation title="예제 메뉴" items={navigation} currentId={s.currentId} expandedIds={s.expandedIds} onExpandedChange$={async({ids})=>{for(const id of ['examples','help'])if(ids.includes(id)!==s.expandedIds.includes(id))await action({type:'expand',id,expanded:ids.includes(id)});}}/><main><h1 id="example-main-heading" tabIndex={-1}>{c.sections[s.currentId].title}</h1><p>{c.sections[s.currentId].body}</p><Link href={href('overview')} label="예제 소개로 이동"/></main></div><Footer serviceLogo={logo} contacts={[]} utilityLinks={[{label:'키보드 이용 안내',href:href('accessibility')}]} privacyPolicy={{label:'개인정보 처리방침',href:href('privacy')}} policyLinks={[]} copyrightText={c.identity.copyrightText}/></div>;
});
