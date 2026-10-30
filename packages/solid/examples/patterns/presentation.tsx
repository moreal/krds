import { For, Match, Show, Switch, createEffect, onCleanup, type JSX } from 'solid-js';
import { Button, TextInput, NativeSelect, Textarea, Spinner, StructuredList, Pagination, RadioGroup, Modal, Header, SideNavigation, Footer, Link, SkipLink } from '@unofficial-krds/solid';
import type { TextInputProps, NativeSelectProps, TextareaProps, RadioGroupProps, HeaderProps, SideNavigationProps, FooterProps } from '@unofficial-krds/solid';
export interface ExampleIdentity { notice:string;dataNotice:string; }
export interface FormView { values:{title:string;category:string;detail:string}; errors:readonly {field:'title'|'category'|'detail';targetId:string;errorId:string;message:string}[]; busy:boolean;error:string|null;receiptText:string|null; }
export interface FormPresentationProps { view:FormView;identity:ExampleIdentity;categories:NativeSelectProps['options'];onFieldChange:(field:'title'|'category'|'detail',value:string)=>void;onSubmit:()=>void;onReset:()=>void;onRetry:()=>void;onErrorLink:(field:'title'|'category'|'detail')=>void; }
export interface SearchView { query:string;category:string;busy:boolean;error:string|null;successful:boolean;countText:string;items:{id:string;title:string;category:string;date:string;summary:string}[];page:number;pageCount:number;total:number; }
export interface SearchPresentationProps {view:SearchView;identity:ExampleIdentity;categories:NativeSelectProps['options'];hrefForPage:(page:number)=>string;onQueryChange:(value:string)=>void;onSearch:()=>void;onFilter:(value:string)=>void;onPage:(page:number)=>void;onRetry:()=>void;}
export interface ConsentView { requiredChoice:boolean|null;optionalChoice:boolean;invalid:boolean;busy:boolean;failed:boolean;modalOpen:boolean;error:string|null;receiptText:string|null; }
export interface ConsentPresentationProps {view:ConsentView;identity:ExampleIdentity;groups:readonly {id:'requiredChoice'|'optionalChoice';title:string;required:boolean;paragraphs:readonly string[];options:RadioGroupProps['options']}[];onChoice:(field:'requiredChoice'|'optionalChoice',value:boolean)=>void;onReview:()=>void;onClose:()=>void;onConfirm:()=>void;onRetry:()=>void;}
import './patterns.css';
function Identity(props:{identity:ExampleIdentity}) { return <aside class="pattern-notice" aria-label="독립 예제 안내"><p>{props.identity.notice}</p><p>{props.identity.dataNotice}</p></aside>; }
function Busy(props:{pending:boolean}) {return <Spinner pending={props.pending} label="로컬 예제 처리 중" completionMessage=""/>;}
export function FormPresentation(props: FormPresentationProps) {
  let form!:HTMLFormElement;
  const error=(field:'title'|'category'|'detail')=>props.view.errors.find(error=>error.field===field);
  const busy=()=>props.view.busy;
  createEffect(()=>{for(const field of ['title','category','detail'] as const){const input=form?.elements.namedItem(field) as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|null;input?.setCustomValidity(error(field)?.message??'');}});
  let disposed=false;onCleanup(()=>{disposed=true;});
  return <main class="pattern-page"><h1>예제 입력폼</h1><Identity identity={props.identity}/><form ref={form} noValidate aria-busy={busy()} onSubmit={event=>{event.preventDefault();props.onSubmit();}} onKeyDown={event=>{if(event.key==='Enter'&&event.isComposing)event.preventDefault();}} onReset={event=>{queueMicrotask(()=>{if(!disposed&&!event.defaultPrevented)props.onReset();});}}>
    <Show when={props.view.errors.length}><section id="example-form-errors" aria-labelledby="example-form-errors-heading" role="alert"><h2 id="example-form-errors-heading">입력 내용을 확인하세요</h2><ol><For each={props.view.errors}>{error=><li><a href={`#${error.targetId}`} onClick={event=>{event.preventDefault();props.onErrorLink(error.field);}}>{error.message}</a></li>}</For></ol></section></Show>
    <TextInput id="example-form-title" name="title" label="예제 제목 (필수)" required value={props.view.values.title} disabled={busy()} invalid={Boolean(error('title'))} helpId="example-form-title-help" errorId="example-form-title-error" onValueChange={({value})=>props.onFieldChange('title',value)}/>
    <p id="example-form-title-help">4자 이상 60자 이하의 예제 제목을 입력하세요.</p><Show when={error('title')}>{value=><p id={value().errorId}>{value().message}</p>}</Show>
    <NativeSelect id="example-form-category" name="category" label="연습 유형 (필수)" required options={props.categories} value={props.view.values.category} disabled={busy()} invalid={Boolean(error('category'))} error={error('category')?.message} onValueChange={({value})=>props.onFieldChange('category',value)}/>
    <Textarea id="example-form-detail" name="detail" label="추가 설명 (선택)" value={props.view.values.detail} disabled={busy()} invalid={Boolean(error('detail'))} helpId="example-form-detail-help" errorId="example-form-detail-error" onValueChange={({value})=>props.onFieldChange('detail',value)}/>
    <p id="example-form-detail-help">120자 이하로 입력하세요.</p><Show when={error('detail')}>{value=><p id={value().errorId}>{value().message}</p>}</Show>
    <div class="pattern-actions"><Button id="example-form-submit" type="submit" disabled={busy()}>예제 저장</Button><Button id="example-form-reset" type="reset" variant="secondary">초기화</Button></div><Busy pending={busy()}/>
    <Show when={props.view.error}><p role="alert">{props.view.error}</p><Button id="example-form-retry" onClick={()=>props.onRetry()}>다시 시도</Button></Show>
    <Show when={props.view.receiptText}><p role="status">{props.view.receiptText}</p></Show>
  </form></main>;
}
export function SearchPresentation(props:SearchPresentationProps) {
  return <main class="pattern-page"><h1>로컬 자료 검색</h1><Identity identity={props.identity}/><p>열두 개 자료는 모두 가상의 학습 기록입니다.</p>
    <form role="search" onSubmit={event=>{event.preventDefault();props.onSearch();}} onKeyDown={event=>{if(event.key==='Enter'&&event.isComposing)event.preventDefault();}}><TextInput id="example-search-query" name="query" type="search" label="검색어" value={props.view.query} onValueChange={({value})=>props.onQueryChange(value)}/><Button id="example-search-submit" type="submit">검색</Button></form>
    <NativeSelect id="example-search-category" label="자료 유형" value={props.view.category} options={props.categories} onValueChange={({value})=>props.onFilter(value)}/>
    <Busy pending={props.view.busy}/><Show when={props.view.error}><p role="alert">{props.view.error}</p><Button id="example-search-retry" onClick={()=>props.onRetry()}>다시 시도</Button></Show>
    <Show when={props.view.successful}><p id="example-search-count" aria-live="polite">{props.view.countText}</p>
    <Show when={props.view.total>0} fallback={<p role="status">검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.</p>}><StructuredList title="검색 결과" items={props.view.items.map(item=>({id:item.id,title:item.title,metadata:[{label:'자료 유형',value:props.categories.find(category=>category.value===item.category)!.label},{label:'등록일',value:item.date},{label:'설명',value:item.summary}]}))}/><Pagination page={props.view.page} pageCount={props.view.pageCount} hrefForPage={props.hrefForPage} onPageChange={({page})=>props.onPage(page)}/></Show></Show>
  </main>;
}
const choice=(value:boolean|null)=>value===null?null:value?'agree':'decline';
export function ConsentPresentation(props:ConsentPresentationProps) {
 let disposed=false;onCleanup(()=>{disposed=true;});
 createEffect(()=>{if(props.view.modalOpen&&(props.view.busy||props.view.failed))queueMicrotask(()=>{if(disposed)return;const dialog=document.getElementById('example-consent-dialog');if(dialog&&!dialog.contains(document.activeElement))dialog.focus({preventScroll:true});});});
 return <main class="pattern-page"><h1>예제 이용 안내 확인</h1><Identity identity={props.identity}/><For each={props.groups}>{content=><section class="pattern-consent-section" aria-label={content.title}><For each={content.paragraphs}>{paragraph=><p id={`${content.id}-description-${content.paragraphs.indexOf(paragraph)}`}>{paragraph}</p>}</For><RadioGroup id={`example-consent-${content.required?'required':'optional'}`} name={content.id} label={content.title} value={choice(props.view[content.id])} required={content.required} invalid={content.required&&props.view.invalid} helpId={`${content.id}-description-0 ${content.id}-description-1`} errorId="example-consent-error" options={content.options} onValueChange={({value})=>{if(value!==null)props.onChoice(content.id,value==='agree');}}/></section>}</For>
 <Show when={!props.view.modalOpen&&props.view.error}><p role="alert" id="example-consent-error">{props.view.error}</p></Show>
 <Button id="example-consent-review" onClick={()=>props.onReview()}>확인하기</Button>
 <Show when={props.view.receiptText}><p role="status">{props.view.receiptText}</p></Show>
 <Modal id="example-consent-dialog" title="예제 선택 확인" titleId="example-consent-dialog-title" description="선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다." open={props.view.modalOpen} initialFocusId="example-consent-dialog" returnFocusId="example-consent-review" onOpenChange={({open})=>{if(!open)props.onClose();}} closeLabel="닫기" aria-busy={props.view.busy} actions={<><Button id="example-consent-cancel" variant="secondary" onClick={()=>props.onClose()}>돌아가기</Button><Button id={props.view.failed?'example-consent-retry':'example-consent-confirm'} disabled={props.view.busy} onClick={()=>props.view.failed?props.onRetry():props.onConfirm()}>{props.view.failed?'다시 시도':'예제 완료'}</Button></>}>
 <dl><dt>필수 안내</dt><dd>{props.view.requiredChoice?'동의함':'동의하지 않음'}</dd><dt>선택 안내</dt><dd>{props.view.optionalChoice?'동의함':'동의하지 않음'}</dd></dl><Busy pending={props.view.busy}/><Show when={props.view.modalOpen&&props.view.error}><p role="alert">{props.view.error}</p></Show></Modal></main>;
}

export interface LayoutPresentationProps { identity:ExampleIdentity;header:HeaderProps;sidebar:SideNavigationProps;footer:FooterProps;heading:string;body:string;helpHref:string; }
export function LayoutPresentation(props:LayoutPresentationProps) {return <div class="pattern-layout"><SkipLink links={[{id:'main',label:'본문 바로가기',targetId:'example-main-heading'}]}/><Header {...props.header}/><div class="pattern-layout-body"><SideNavigation {...props.sidebar}/><main><h1 id="example-main-heading" tabIndex={-1}>{props.heading}</h1><Identity identity={props.identity}/><p>{props.body}</p><Link href={props.helpHref} label="키보드 이용 안내"/></main></div><Footer {...props.footer}/></div>;}
