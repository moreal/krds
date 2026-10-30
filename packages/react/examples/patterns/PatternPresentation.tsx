import {useState, type MouseEvent, type ReactNode} from 'react';
import { Button, Header, Footer, MainMenu, Modal, NativeSelect, Pagination, RadioGroup, SideNavigation, Spinner, StructuredList, TextInput, Textarea } from '@unofficial-krds/react';
import type { PatternView, PatternContent, PresentationAction, LayoutId } from './types';
import './patterns.css';
export interface PatternPresentationProps { state: PatternView; content: PatternContent; onAction?: (action: PresentationAction) => void; hrefForPage?: (page:number) => string; hrefForSection?: (id:string) => string; }
const noop = () => {};
const choice = (value: boolean | null) => value === null ? '선택하지 않음' : value ? '동의함' : '동의하지 않음';
function Identity({demoIdentity}: Pick<PatternContent,'demoIdentity'>) { return <aside className="pattern-notice" aria-label="독립 예제 안내"><p>{demoIdentity.notice}</p><p>{demoIdentity.dataNotice}</p></aside>; }
function primary(event: MouseEvent) { return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey; }
export function PatternPresentation({state,content,onAction = noop,hrefForPage = page => `#page-${page}`,hrefForSection = id => `#section-${id}`} : PatternPresentationProps) {
 const {consentContent,demoIdentity,fieldIds,formCategories,layoutNavigation,layoutSections,resourceCategories} = content;
 const action = onAction;
 const [menuExpanded,setMenuExpanded] = useState<string|null>('examples');
 let body: ReactNode;
 if (state.patternId === 'form-errors') {
  const busy = state.phase === 'loading';
  const error = (field: keyof typeof fieldIds) => state.errors.find(item => item.field === field);
  body = <main className="pattern-main"><h1>예제 입력폼</h1><Identity demoIdentity={demoIdentity}/>
   <form aria-label="예제 입력폼" noValidate aria-busy={busy} onSubmit={event => {event.preventDefault();action({type:'submit'});}} onReset={event => {const native = event.nativeEvent;queueMicrotask(() => {if (!native.defaultPrevented) action({type:'reset'});});}} onKeyDown={event => {if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault();}}>
    {!!state.errors.length && <section id="example-form-errors" role="region" aria-label="입력 오류 요약" aria-live="polite" className="pattern-errors"><h2>입력 내용을 확인하세요</h2><ol>{state.errors.map(item => <li key={item.field}><a href={`#${item.targetId}`} onClick={event => {event.preventDefault();action({type:'error-link',field:item.field});}}>{item.message}</a></li>)}</ol></section>}
    <TextInput id={fieldIds.title} name="title" label="예제 제목 (필수)" value={state.values.title} required disabled={busy} help="예제 문구 4~60자를 입력하세요." invalid={!!error('title')} error={error('title')?.message} errorId={error('title')?.errorId} onValueChange={({value}) => action({type:'field',field:'title',value})}/>
    <NativeSelect id={fieldIds.category} name="category" label="연습 유형 (필수)" value={state.values.category} required disabled={busy} options={formCategories.map(item => ({...item}))} invalid={!!error('category')} error={error('category')?.message} onValueChange={({value}) => action({type:'field',field:'category',value})}/>
    <Textarea id={fieldIds.detail} name="detail" label="추가 설명 (선택)" value={state.values.detail} disabled={busy} help="예제 설명은 120자까지 입력할 수 있습니다." invalid={!!error('detail')} error={error('detail')?.message} errorId={error('detail')?.errorId} onValueChange={({value}) => action({type:'field',field:'detail',value})}/>
    <div className="pattern-actions"><Button type="submit" id="example-form-submit" disabled={busy || state.phase === 'success'}>예제 저장</Button><Button type="reset" id="example-form-reset" variant="tertiary">초기화</Button></div>
   </form>
   {busy && <Spinner pending completionMessage="로컬 예제 처리 완료" label="로컬 예제 처리 중"/>}
   {state.error && <div role="alert"><p>{state.error}</p><Button id="example-form-retry" onClick={() => action({type:'retry'})}>다시 시도</Button></div>}
   <div role="status" aria-live="polite">{state.receipt && <p>이 화면에서만 완료했습니다. {state.receipt.id} · {state.receipt.title}</p>}</div>
  </main>;
 } else if (state.patternId === 'search-results') {
  const href = hrefForPage;
  const pagination = state.phase === 'success' && state.pageCount > 0 ? <div onClick={event => {const target = (event.target as HTMLElement).closest('a[href]');if (target && primary(event)) event.preventDefault();}}><Pagination page={state.page} pageCount={state.pageCount} hrefForPage={href} onPageChange={({page}) => action({type:'page',page})}/></div> : null;
  body = <main className="pattern-main"><h1>로컬 자료 검색</h1><Identity demoIdentity={demoIdentity}/><p>열두 개의 자료는 모두 학습용 가상 자료입니다.</p>
   <form role="search" aria-label="로컬 자료 검색" onSubmit={event => {event.preventDefault();action({type:'search'});}} onKeyDown={event => {if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault();}}>
    <TextInput id="example-search-query" name="query" type="search" label="검색어" value={state.query} onValueChange={({value}) => action({type:'query',value})}/><Button id="example-search-submit" type="submit">검색</Button>
    <NativeSelect id="example-search-category" name="category" label="자료 유형" value={state.category} options={resourceCategories.map(item => ({...item}))} onValueChange={({value}) => action({type:'filter',category:value as typeof state.category})}/>
   </form>
   <div id="example-search-count" role="status" aria-live="polite">{state.phase === 'loading' ? '불러오는 중' : state.phase === 'success' ? `검색어 ${state.appliedQuery || '전체'} · ${resourceCategories.find(item => item.value === state.category)?.label} · ${state.total}건` : ''}</div>
   {state.phase === 'loading' && <Spinner pending completionMessage="로컬 예제 처리 완료" label="로컬 검색 처리 중"/>}
   {state.error && <div role="alert"><p>{state.error}</p><Button id="example-search-retry" onClick={() => action({type:'retry'})}>다시 시도</Button></div>}
   {state.phase === 'success' && <><StructuredList title="검색 결과" items={state.items.map(item => ({id:item.id,title:item.title,metadata:[{label:'자료 유형',value:resourceCategories.find(category => category.value === item.category)?.label ?? item.category},{label:'등록일',value:item.date},{label:'설명',value:item.summary}]}))} pagination={pagination}/>{!state.total && <p>검색어나 자료 유형을 바꿔 보세요.</p>}</>}
  </main>;
 } else if (state.patternId === 'consent-confirmation') {
  body = <main className="pattern-main"><h1>예제 이용 안내 확인</h1><Identity demoIdentity={demoIdentity}/>
   {consentContent.map(item => {const required = item.id === 'requiredChoice';const prefix = required ? 'required' : 'optional';const value = state[item.id];return <section key={item.id} className="pattern-consent"><h2>{item.title}</h2><div id={`example-consent-${prefix}-help`}>{item.paragraphs.map(text => <p key={text}>{text}</p>)}</div><RadioGroup id={`example-consent-${prefix}`} name={item.id} label={item.title} helpId={`example-consent-${prefix}-help`} errorId={required && state.phase === 'invalid' ? 'example-consent-error' : undefined} required={required} invalid={required && state.phase === 'invalid'} value={value === null ? null : value ? 'agree' : 'decline'} optionIds={{agree:`example-consent-${prefix}-agree`,decline:`example-consent-${prefix}-decline`}} options={[{value:'agree',label:`${required?'필수':'선택'} 동의함`},{value:'decline',label:`${required?'필수':'선택'} 동의하지 않음`}]} onValueChange={({value:next}) => action({type:'consent',field:item.id,value:next === 'agree'})}/></section>;})}
   {!state.modalOpen && state.error && <p id="example-consent-error" role="alert">{state.error}</p>}
   <Button id="example-consent-review" onClick={() => action({type:'review'})}>확인하기</Button>
   <Modal id="example-consent-dialog" titleId="example-consent-dialog-title" title="예제 선택 확인" open={state.modalOpen} onOpenChange={({open}) => {if (!open) action({type:'close'});}} returnFocusId="example-consent-review" description="선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다." actions={<><Button id="example-consent-cancel" variant="tertiary" onClick={() => action({type:'close'})}>돌아가기</Button><Button id="example-consent-confirm" disabled={state.phase === 'loading'} onClick={() => action({type:'confirm'})}>예제 완료</Button></>}>
    <dl><dt>필수 안내</dt><dd>{choice(state.requiredChoice)}</dd><dt>선택 안내</dt><dd>{choice(state.optionalChoice)}</dd></dl>
    {state.phase === 'loading' && <Spinner pending completionMessage="로컬 예제 처리 완료" label="로컬 선택 처리 중"/>}
    {state.error && <div role="alert"><p>{state.error}</p><Button onClick={() => action({type:'retry'})}>다시 시도</Button></div>}
   </Modal>
   <div role="status" aria-live="polite">{state.receipt && <p>이 화면에서만 완료했습니다. {state.receipt.id} · 필수 {choice(state.receipt.requiredChoice)} · 선택 {choice(state.receipt.optionalChoice)}</p>}</div>
  </main>;
 } else {
  const destination = hrefForSection;
  const items = layoutNavigation.map(item => ({id:item.id,label:item.label,children:item.children?.map(child => ({id:child.id,label:child.label,href:destination(child.id)}))}));
  const navigate = (event: MouseEvent) => {const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');if (!anchor || !primary(event)) return;const id = Object.keys(layoutSections).find(id => destination(id) === anchor.getAttribute('href'));if (!id) return;event.preventDefault();action({type:'navigate',id:id as LayoutId});};
  body = <div className="pattern-service" onClick={navigate}><Header mainContentId="example-main-heading" home={{href:destination('overview'),label:demoIdentity.name,logo:{src:'/local-assets/service-logo.svg',alt:demoIdentity.name}}} utilityItems={[]} mainNavigation={[]} navigationContent={<MainMenu label="주요 메뉴" mobileTriggerId="example-layout-mobile-open" mobileTriggerLabel="전체메뉴" items={items} currentId={state.currentId} expandedId={menuExpanded} onExpandedChange={({id}) => setMenuExpanded(id)} mobileOpen={state.mobileOpen} onMobileOpenChange={({open}) => action({type:'mobile',open})}/>}/><Identity demoIdentity={demoIdentity}/>
   <div className="pattern-service-columns"><SideNavigation title="예제 메뉴" items={items} currentId={state.currentId} expandedIds={state.expandedIds} onExpandedChange={({ids}) => {for (const id of ['examples','help'] as const) if (ids.includes(id) !== state.expandedIds.includes(id)) action({type:'expand',id,expanded:ids.includes(id)});}}/>
   <main className="pattern-main"><h1 id="example-main-heading" tabIndex={-1}>{layoutSections[state.currentId].title}</h1><p>{layoutSections[state.currentId].body}</p><p>독립적인 로컬 조합 예제입니다.</p></main></div>
   <Footer serviceLogo={{src:'/local-assets/service-logo.svg',alt:demoIdentity.name}} contacts={[]} utilityLinks={[]} privacyPolicy={{id:'privacy',href:destination('privacy'),label:'개인정보 처리방침'}} policyLinks={[{id:'accessibility',href:destination('accessibility'),label:'키보드 이용 안내'}]} copyrightText={demoIdentity.copyrightText}/>
  </div>;
 }
 return <div className="pattern-example" data-pattern={state.patternId} data-phase={state.phase}>{body}</div>;
}
