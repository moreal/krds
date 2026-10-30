import './catalog-layout.css';
import {LocalSpeechDriver} from './LocalSpeechDriver';
import {NativeConfigurationBoundary} from './NativeConfigurationBoundary';
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import * as K from '@unofficial-krds/react';
type Data = Record<string, any>;
export interface CatalogExampleProps {
    componentId: string;
    initialState: Data;
    host?: Data;
    state?: Data;
    onEvent?: (name: string, detail: unknown) => void;
    onCommit?: (patch: Data) => void;
}
/** Explicit native examples with local host state. Stories contain no behavior tests. */
export function CatalogExample({ componentId, initialState, host: initialHost = {}, state: remote = {}, onEvent, onCommit }: CatalogExampleProps) {
    const [local, setLocal] = useState<Data>({});
    const data = { ...initialState, ...local, ...remote };
    const host = { ...initialHost, ...remote.__host };
    const [result, setResult] = useState('');
    const [appended,setAppended]=useState(false);
    const loadTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
    const liveHost=useRef(host);liveHost.current=host;
    useEffect(()=>()=>{if(loadTimer.current!==undefined)clearTimeout(loadTimer.current);},[]);
    const [route, setRoute] = useState(host.history?.at(-1) ?? '/local/current');
    const [confirmationOpen,setConfirmationOpen]=useState(false);
    const confirmationResolver=useRef<((value:boolean)=>void)|null>(null);
    const confirmationPromise=useRef<Promise<boolean>|null>(null);
    const requestBackConfirmation=()=>{if(confirmationPromise.current)return confirmationPromise.current;confirmationPromise.current=new Promise<boolean>(resolve=>{confirmationResolver.current=resolve;setConfirmationOpen(true);});return confirmationPromise.current;};
    const finishBackConfirmation=(value:boolean)=>{const resolve=confirmationResolver.current;confirmationResolver.current=null;confirmationPromise.current=null;setConfirmationOpen(false);resolve?.(value);};
    useEffect(()=>()=>{confirmationResolver.current?.(false);confirmationResolver.current=null;},[]);
    const [selection, setSelection] = useState(host.selection ?? 'seoul');
    const speechDriver = useRef<LocalSpeechDriver | null>(null);
    if (!speechDriver.current) speechDriver.current = new LocalSpeechDriver();
    const [speech, setSpeech] = useState(data.state ?? 'idle');
    useEffect(() => () => speechDriver.current?.dispose(), []);
    const [summary, setSummary] = useState('');
    const [applied, setApplied] = useState<string[]>([]);
    const [barHeight,setBarHeight]=useState(0);
    useLayoutEffect(()=>{if(!['fab','toast','snackbar'].includes(componentId))return;const bar=document.querySelector<HTMLElement>('[data-krds-component="tab-bar"][data-krds-part="root"]');if(!bar)return;const update=()=>setBarHeight(bar.getBoundingClientRect().height);update();const observer=new ResizeObserver(update);observer.observe(bar);return()=>observer.disconnect();},[componentId,host.mounted]);
    const [childChecked,setChildChecked]=useState<Record<string,boolean>>(()=>Object.fromEntries((initialHost.children??[]).map((c:Data)=>[c.id,!!c.defaultChecked])));
    const [files, setFiles] = useState<K.FileUploadProps['files']>(() => {
        if (componentId !== 'file-upload' || typeof File === 'undefined')
            return [];
        return (initialState.files ?? []).map((record: Data) => {
            const fixture = host.fileFixtures?.find((f: Data) => f.id === record.id) ?? record;
            return { ...record, file: new File([fixture.contents ?? 'local'], fixture.name ?? record.name ?? 'local.txt', { type: fixture.type ?? 'text/plain' }) };
        });
    });
    const currentFiles = useRef(files);
    currentFiles.current = files;
    const lastStateFiles = useRef(remote.files);
    useEffect(() => {
        if (componentId === 'file-upload' && remote.files !== lastStateFiles.current) {
            lastStateFiles.current = remote.files;
            if (remote.files)
                setFiles(remote.files.map((record: Data) => {
                    const existing = currentFiles.current.find(f => f.id === record.id);
                    return { ...record, file: record.file instanceof File ? record.file : existing?.file ?? new File(['local'], record.file?.name ?? 'local.txt', { type: record.file?.type ?? 'text/plain' }) };
                }));
        }
    }, [remote.files]);
    const commit = (patch: Data) => { setLocal(current => ({ ...current, ...patch })); onCommit?.(patch); };
    const record = (name: string, detail: unknown) => onEvent?.(name, detail);
    const change = (name: string, key: string, detail: Data) => {
        record(name, detail);
        if (host.acceptChanges === false)
            return;
        if (['radio-group', 'textarea', 'text-input', 'range-slider', 'quantity-toggle','pagination'].includes(componentId) && key === 'value' && initialState.value === undefined)
            return;
        if(componentId==='pagination'&&key==='page'&&initialState.page===undefined)return;
    if (componentId === 'switch' && key === 'checked' && initialState.checked === undefined)
            return;
        const field=[key,'value','ids','id','open'].find(field=>Object.prototype.hasOwnProperty.call(detail,field));
    if(field)commit({[key]:detail[field]});
    };
    const body = (content: ReactNode) => <form onSubmit={e => { e.preventDefault(); setResult('제출 완료'); }} onReset={e => { if(e.defaultPrevented)return;
    if (host.cancelReset) e.preventDefault();
    else if (componentId === 'checkbox'){commit({ indeterminate: initialState.indeterminate });setChildChecked(Object.fromEntries((host.children??[]).map((c:Data)=>[c.id,!!c.defaultChecked])));} }}>
    {content}<button type="reset">초기화</button><button type="submit">제출</button>
  </form>;
    useEffect(() => {
        if (componentId !== 'language-switcher')
            return;
        document.documentElement.lang = data.currentLocale;
    }, [data.currentLocale]);
    useEffect(()=>{if(componentId==='tts'&&(host.mounted===false||host.routeChange)&&speech!=='idle'){const command={action:'stop' as const,summary:data.summary,locale:data.locale};record('request',command);speechDriver.current?.request(command);setSpeech('idle');}},[host.mounted,host.routeChange]);
    const outside = <button type="button" id="outside-action" data-krds-host="outside-action" onClick={() => setResult('예제 작업 완료')}>다음 작업</button>;
    const fallback = <button type="button" id={data.fallbackFocusId ?? host.fallbackFocusId ?? 'panel-fallback'}>{host.fallbackLabel??'다음 작업으로 돌아가기'}</button>;
    const speechReceipts = <><p data-krds-host="speech-state">{speech}</p><p data-krds-host="speech-driver-active">{String(speechDriver.current.active)}</p><p data-krds-host="speech-driver-lifecycle">{speechDriver.current.lifecycle}</p></>;
    const targetFields = <div data-krds-host="tour-targets">
    {!host.targetRemoved && <><label htmlFor="applicant-name">신청인 이름</label><input id="applicant-name" defaultValue={host.targetInputs?.['applicant-name'] ?? ''} onChange={e => setResult(e.currentTarget.value)}/><div id="applicant-name-after"/>
      <button id="save-application" type="button" onClick={() => setResult('신청 저장 완료')}>신청 저장</button><div id="save-application-after"/></>}
  </div>;
    const pendingStop=useRef(false);
    useLayoutEffect(()=>{if(pendingStop.current&&data.running===false){pendingStop.current=false;K.restoreTutorialFocus(data.startActionId,data.fallbackFocusId,document.querySelector<HTMLElement>('[data-krds-component="tutorial-panel"][data-krds-part="opener"]')?.id);}},[data.running,data.open,data.activePanel]);
    const stop = (detail: Parameters<NonNullable<K.TutorialPanelProps['onStop']>>[0]) => {
        record('stop', detail);
        if (host.acceptStop === false)
            return;
        pendingStop.current=true;
        commit({ running: false, open: host.acceptPanelExposure === false ? data.open : true, activePanel: host.acceptPanelExposure === false||host.acceptTutorialTab===false ? data.activePanel : 'tutorial' });
    };
    let content: ReactNode;
    const mainContent = !host.removeTarget ? <main id="main-content" tabIndex={-1}><h2>본문</h2><button type="button">본문 작업</button></main> : null;
    if (host.mounted === false || host.routeChange)
        return <>{componentId==='favicon'&&<K.Favicon {...data as K.FaviconProps}/ >}{outside}{fallback}<p data-krds-host="result">{result}</p>{componentId==='tts'&&speechReceipts}{componentId==='resize'&&<section data-krds-host="resize-content" style={{fontSize:'100%'}}><h2>신청 안내</h2><p>화면 설정에 따라 이 내용과 버튼이 함께 커집니다.</p><button type="button">예제 작업</button></section>}</>;
    if (host.testConfiguration) {
        const configuration = host.testConfiguration;
        if (componentId === 'badge') return <>{outside}<NativeConfigurationBoundary key={JSON.stringify(configuration)}><K.Badge {...data as K.BadgeProps} {...configuration}/></NativeConfigurationBoundary></>;
        if (componentId === 'quantity-toggle') return <>{outside}<NativeConfigurationBoundary key={JSON.stringify(configuration)}><K.QuantityToggle {...data as K.QuantityToggleProps} {...configuration}/></NativeConfigurationBoundary></>;
    }
    switch (componentId) {
        case 'masthead':
            content = <>{host.specimenLabel&&<p>{host.specimenLabel}</p>}<K.SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]}/><K.Masthead {...data as K.MastheadProps}/><header>예제 서비스</header></>;
            break;
        case 'identifier':
            content = <K.Footer serviceLogo={{ src: '/local-assets/service-logo.svg', alt: '예제 서비스' }} contacts={[]} utilityLinks={[]} privacyPolicy={{ href: '/local/privacy', label: '개인정보처리방침' }} policyLinks={[]} copyrightText="Independent local specimen" institution={data as K.IdentifierProps} specimen/>;
            break;
        case 'header':
            content = <K.Header {...data as K.HeaderProps} specimen search={{ label: data.search?.label ?? '검색', onRequest: () => record('searchRequest', {}) }}/>;
            break;
        case 'footer':
            content = <div style={{marginTop:host.shortPage?'auto':undefined}}><K.Footer {...data as K.FooterProps} specimen/></div>;
            break;
        case 'skip-link':
            content = <><K.SkipLink {...data as K.SkipLinkProps}/>{host.removeTarget ? <p data-krds-host="configuration-error">{data.links[0].targetId}</p> : null}</>;
            break;
        case 'main-menu':
            content = <K.MainMenu {...data as K.MainMenuProps} expandedId={data.expandedId ?? data.defaultExpandedId ?? null} defaultExpandedId={undefined} mobileOpen={data.mobileOpen ?? data.defaultMobileOpen ?? false} defaultMobileOpen={undefined} onExpandedChange={d => change('expandedChange', 'expandedId', d)} onMobileOpenChange={d => change('mobileOpenChange', 'mobileOpen', d)} onQueryChange={d => change('queryChange', 'query', d)}/>;
            break;
        case 'breadcrumb':
            content = <><K.Breadcrumb {...data as K.BreadcrumbProps}/><h2>신청 상세</h2></>;
            break;
        case 'side-navigation':
            content = <K.SideNavigation {...data as K.SideNavigationProps} expandedIds={data.expandedIds ?? data.defaultExpandedIds ?? []} defaultExpandedIds={undefined} onExpandedChange={d => change('expandedChange', 'expandedIds', d)}/>;
            break;
        case 'in-page-navigation': {
            const sections = data.sections.filter((s: Data) => s.id !== host.removeSectionId);
            content = <div data-krds-host="outline-layout"><K.InPageNavigation {...data as K.InPageNavigationProps} sections={sections} activeId={data.activeId} onActiveChange={d => change('activeChange', 'activeId', d)}/><div data-krds-host="outline-body">{sections.map((s: Data) => <section id={s.id} key={s.id} tabIndex={-1} style={{ minHeight: 900, scrollMarginTop: host.stickyHeaderHeight ?? 0 }}><h2>{s.label}</h2><button type="button">{s.label} 작업</button></section>)}</div></div>;
            break;
        }
        case 'pagination': {
            const shown=data.loadMore?.shown??0;const initialShown=initialState.loadMore?.shown??0;
            content=<>{data.loadMore&&<ul aria-label="검색 결과">{Array.from({length:shown},(_,index)=><li key={index} id={appended&&index===initialShown?'first-added-result':undefined} data-krds-host={appended&&index===initialShown?'first-added-result':undefined} tabIndex={appended&&index===initialShown?-1:undefined}><a href={`/local/result/${index+1}`}>결과 {index+1}</a></li>)}</ul>}
            <K.Pagination {...data as K.PaginationProps} hrefForPage={page=>(data.hrefTemplate??'/local/results?page={page}').replace('{page}',String(page))} onPageChange={d=>change('pageChange','page',d)} loadMore={data.loadMore?{...data.loadMore,firstNewItemId:appended?'first-added-result':undefined,onLoadMore:()=>{
                record('loadMore',{});commit({loadMore:{...data.loadMore,pending:true}});
                loadTimer.current=setTimeout(()=>{loadTimer.current=undefined;if(liveHost.current.mounted===false||liveHost.current.routeChange)return;
                    if(liveHost.current.loadMoreSucceeds===false){commit({loadMore:{...data.loadMore,pending:false}});return;}
                    setAppended(true);commit({loadMore:{...data.loadMore,pending:false,shown:data.loadMore.shown+(host.appendCount??2),firstNewItemId:'first-added-result'}});
                },0);
            }}:undefined}/><span data-krds-host="shown-count">{shown}</span></>;
            break;
        }
        case 'structured-list':
            content = <K.StructuredList {...data as K.StructuredListProps} selection={data.selection ? { ids: data.selection.ids, onChange: d => { record('selectionChange', d); if (host.acceptChanges !== false)
                    commit({ selection: { ...data.selection, ids: d.ids } }); } } : undefined} sort={data.sort ? { ...data.sort, onChange: d => { record('sortChange', d); if (host.acceptChanges !== false)
                    commit({ sort: d, items: [...data.items].reverse() }); } } : undefined} onToolbarAction={d => { record('toolbarAction', d); setResult('목록 작업 완료'); }} itemActions={Object.fromEntries(data.items.map((item: Data) => [item.id, <><button type="button" onClick={() => setResult(`${item.title} 공유`)}>공유</button><button type="button" onClick={() => setResult(`${item.title} 저장`)}>저장</button></>]))}/>;
            break;
        case 'critical-alert':
            content = <K.CriticalAlert {...data as K.CriticalAlertProps}/>;
            break;
        case 'disclosure':
            content = <K.Disclosure {...data as K.DisclosureProps} open={data.open ?? data.defaultOpen ?? false} defaultOpen={undefined} onOpenChange={d => change('openChange', 'open', d)}>{data.content}{host.contentLink && <a href={host.contentLink.href}>{host.contentLink.label}</a>}</K.Disclosure>;
            break;
        case 'badge':
            content = host.samples?.length ? <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}><K.Badge {...data as K.BadgeProps}/>{host.samples.map((sample:Data,index:number)=><K.Badge key={index} {...data as K.BadgeProps} {...sample}/>)}</div> : <K.Badge {...data as K.BadgeProps}/>;
            break;
        case 'accordion':
            content = <K.Accordion {...data as K.AccordionProps} headingLevel={2} openIds={data.openIds ?? data.defaultOpenIds ?? []} defaultOpenIds={undefined} onOpenChange={d => change('openChange', 'openIds', d)} content={Object.fromEntries(data.items.map((item: Data) => [item.id, <><p>{item.content.repeat(host.repeatContent ?? 1)}</p>{host.panelLink && <a href={host.panelLink.href}>{host.panelLink.label}</a>}</>]))}/>;
            break;
        case 'image':
            content = <>{host.imageLink ? <a href={host.imageLink.href} aria-label={host.imageLink.label}><K.Image {...data as K.ImageProps}/></a> : <K.Image {...data as K.ImageProps}/>}{host.descriptionText && <p id={data.descriptionId}>{host.descriptionText}</p>}</>;
            break;
        case 'carousel':
            content = <K.Carousel {...data as K.CarouselProps} index={data.index ?? data.defaultIndex ?? 0} defaultIndex={undefined} playing={data.playing ?? data.defaultPlaying ?? data.autoplay ?? false} defaultPlaying={undefined} onIndexChange={d => change('indexChange', 'index', d)} onPlayingChange={d => change('playingChange', 'playing', d)}/>;
            break;
        case 'table':
            content = <K.Table {...data as K.TableProps} layout={host.layout} onSortChange={data.columns.some((c: Data) => c.sortable) ? d => { record('sortChange', d); if (host.acceptChanges !== false)
                commit({ sort: d, rows: [...data.rows].reverse() }); } : undefined}/>;
            break;
        case 'text-list':
            content = <K.TextList {...data as K.TextListProps}/>;
            break;
        case 'favicon':
            content = <><K.Favicon {...data as K.FaviconProps} touchIcon={host.touchIcon?{href:'/local-assets/specimen-touch-icon.png',type:'image/png',sizes:'180x180'}:data.touchIcon}/><section aria-label="파비콘 예제"><h2>로컬 파비콘 미리보기</h2><p>문서 탭에 실제 로컬 아이콘을 연결합니다. 브라우저 UI에서의 인식은 별도 확인이 필요합니다.</p><div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}><figure><img src={data.light.href} alt="밝은 테마 로컬 아이콘" width={64} height={64}/><figcaption>밝은 테마</figcaption></figure>{host.themePreview&&data.dark&&<figure style={{background:'#172a35',color:'white',padding:'1rem'}}><img src={data.dark.href} alt="어두운 테마 로컬 아이콘" width={64} height={64}/><figcaption>어두운 테마</figcaption></figure>}</div></section></>;
            break;
        case 'link':
            content = <K.Link {...data as K.LinkProps}/>;
            break;
        case 'fab':
            content = <K.FAB {...data as K.FABProps} clearance={barHeight+16} expanded={data.expanded ?? data.defaultExpanded ?? false} defaultExpanded={undefined} onExpandedChange={d => change('expandedChange', 'expanded', d)} onAction={() => { record('action', {}); setResult('새 신청 생성'); }} actions={data.actions?.map((a: Data) => ({ ...a, onAction: () => { record('action', { id: a.id }); setResult(`${a.label} 완료`); } }))}/>;
            break;
        case 'radio-group':
            content = body(<K.RadioGroup {...data as K.RadioGroupProps} onValueChange={d => change('valueChange', 'value', d)}/>);
            break;
        case 'checkbox':
            content = body(<><K.Checkbox {...data as K.CheckboxProps} checked={data.checked} onCheckedChange={d => { record('checkedChange', d); if (host.acceptChanges !== false) {
                setChildChecked(current=>Object.fromEntries((host.children??[]).map((child:Data)=>[child.id,child.disabled?current[child.id]:d.checked])));
                if (data.checked !== undefined)
                    commit({ checked: d.checked, indeterminate: false });
                else
                    commit({ indeterminate: false });
            } }}/>{host.children?.map((child: Data) => <label key={child.id}><input id={child.id} type="checkbox" disabled={child.disabled} checked={childChecked[child.id]??false} onChange={e=>setChildChecked(current=>({...current,[child.id]:e.currentTarget.checked}))}/>{child.label ?? child.id}</label>)}</>);
            break;
        case 'tag':
            content = <><K.Tag {...data as K.TagProps} appliedBarId={host.appliedBarId} onSelectionChange={d => change('selectionChange', 'selectedIds', d)} onRemove={d => { record('remove', d); if (host.acceptChanges !== false)
                commit({ items: data.items.filter((i: Data) => i.id !== d.id) }); }} onAdd={d => { record('add', d); if (host.acceptChanges !== false)
                setApplied([...applied, d.id]); }} onClear={['toggle','removable'].includes(data.mode)?()=>{record('clear',{});setApplied([]);commit({items:[]});}:undefined}/><p data-krds-host="filtered-results">{(data.selectedIds??[]).map((id:string)=>data.items.find((i:Data)=>i.id===id)?.label).join(' ')}</p><div id={host.appliedBarId ?? 'applied-filters'} tabIndex={-1}>{applied.map(id => data.items.find((i: Data) => i.id === id)?.label).join(' ')}</div></>;
            break;
        case 'switch':
            content = body(<><K.Switch {...data as K.SwitchProps} helpId="switch-help" onCheckedChange={d => change('checkedChange', 'checked', d)}/><p id="switch-help">{host.helpText}</p><p>설정: {String(data.checked ?? data.defaultChecked ?? false)}</p></>);
            break;
        case 'step-indicator':
            content = <>{host.compact&&<p data-krds-host="compact-process-position">현재 {Math.max(1,data.steps.findIndex((step:Data)=>step.status==='current')+1)} / {data.steps.length} 단계</p>}<K.StepIndicator {...data as K.StepIndicatorProps} onStepRequest={d=>{record('stepRequest',d);setResult(d.id);}}/>{host.skipAction&&<button type="button" data-krds-host="skip-action" onClick={()=>{record('stepRequest',{id:data.steps.at(-1).id});setRoute(host.skipDestination??'/local/complete');}}>{host.skipAction}</button>}<p data-krds-host="route">{route}</p></>;
            break;
        case 'spinner':
            content = <K.Spinner {...data as K.SpinnerProps} layout={host.layout}/>;
            break;
        case 'help-panel':
            content = <>{fallback}<K.HelpPanel {...data as K.HelpPanelProps} showOpener={!host.removePanelOpener} showTopicTriggers={!host.removeTopicTrigger} open={data.open ?? data.defaultOpen ?? true} defaultOpen={undefined} selectedTopicId={data.selectedTopicId ?? data.defaultSelectedTopicId ?? null} defaultSelectedTopicId={undefined} onTopicChange={d => change('topicChange', 'selectedTopicId', d)} onOpenChange={d => { record('openChange', d); if (host.acceptChanges !== false && host.acceptClose !== false)
                commit({ open: d.open }); }}/></>;
            break;
        case 'tutorial-panel':
            content = <><div data-krds-host="tutorial-layout"><div>{targetFields}{fallback}</div><div><K.TutorialPanel {...data as K.TutorialPanelProps} delegateRestoration startActionVisible={host.startActionPresent!==false} open={data.open ?? data.defaultOpen ?? true} defaultOpen={undefined} running={data.running ?? data.defaultRunning ?? false} defaultRunning={undefined} activePanel={data.activePanel ?? data.defaultActivePanel ?? 'tutorial'} defaultActivePanel={undefined} onTaskChange={d => change('taskChange', 'activeTaskId', d)} onStepChange={d => change('stepChange', 'activeStepId', d)} onOpenChange={d => change('openChange', 'open', d)} onActivePanelChange={d => change('activePanelChange', 'activePanel', d)} onStop={stop} onStart={d=>{record('start',d);if(host.acceptStart!==false)commit({running:true,activeTaskId:d.taskId,activeStepId:d.stepId});}}/></div></div>{(data.running ?? data.defaultRunning) && data.activeStepId && <K.CoachMark steps={data.tasks.find((t: Data) => t.id === data.activeTaskId).steps} boundaries={[{ targetId: 'applicant-name', insertionBoundaryId: 'applicant-name-after' }, { targetId: 'save-application', insertionBoundaryId: 'save-application-after' }]} open stepId={data.activeStepId} startActionId={data.startActionId} fallbackFocusId={data.fallbackFocusId} onStepChange={d => change('stepChange', 'activeStepId', d)} onStop={stop} onTargetAction={detail=>host.targetActionVerified===true&&(detail.targetId==='save-application'?result==='신청 저장 완료':result.trim().length>0)}/>}</>;
            break;
        case 'contextual-help':
            content = <>{host.removeTrigger&&fallback}{!onEvent&&host.placements?.length>0&&<div data-krds-host="placement-examples" style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>{host.placements.map((placement:K.ContextualHelpProps['placement'])=><K.ContextualHelp key={placement} {...data as K.ContextualHelpProps} open={undefined} defaultOpen={false} placement={placement} triggerLabel={`${data.triggerLabel} ${placement}`}/>)}</div>}{!host.removeTrigger && <K.ContextualHelp {...data as K.ContextualHelpProps} open={data.open ?? data.defaultOpen ?? false} defaultOpen={undefined} onOpenChange={d => change('openChange', 'open', d)}>{host.relatedLink && <a href={host.relatedLink.href}>{host.relatedLink.label}</a>}</K.ContextualHelp>}</>;
            break;
        case 'coach-mark': {
            const running=data.running??host.running??data.open??data.defaultOpen??false;
            const panelOpen=data.panelOpen??host.panelOpen??host.initialPanelOpen??(host.layout==='narrow-modal');
            const active=data.activePanel??host.activePanel??(host.acceptTutorialTab===false?'help':'tutorial');
            const targetInPanel=host.layout==='narrow-modal'&&host.outsideInert===true;
            const stopCoach=(detail:Parameters<NonNullable<K.CoachMarkProps['onStop']>>[0])=>{
                record('stop',detail);if(host.acceptStop===false)return;
                pendingStop.current=true;commit({running:false,open:false,panelOpen:host.acceptPanelExposure===false?panelOpen:host.acceptOpenTrue!==false,activePanel:host.acceptTutorialTab===false?active:'tutorial'});
            };
            content=<>{!targetInPanel&&targetFields}{fallback}{!host.linkedTutorial&&!running&&!panelOpen&&<button id={data.startActionId} type="button" onClick={()=>{record('openChange',{open:true});commit({open:true,running:true});}}>따라하기 시작</button>}
              {host.linkedTutorial&&<K.TutorialPanel helpContent={targetInPanel?targetFields:undefined} tasks={[{id:'coach-task',title:'예제 신청',steps:data.steps}]} activeTaskId="coach-task" activeStepId={data.stepId??data.defaultStepId??data.steps[0].id} running={running} open={panelOpen} activePanel={active} delegateRestoration startActionVisible={host.startActionPresent!==false} startActionId={data.startActionId} fallbackFocusId={data.fallbackFocusId} onOpenChange={d=>{record('panelOpenChange',d);commit({panelOpen:d.open});}} onActivePanelChange={d=>change('activePanelChange','activePanel',d)} onStop={stopCoach} onStart={d=>{record('start',d);commit({running:true,open:true,stepId:d.stepId});}}/>}
              <K.CoachMark {...data as K.CoachMarkProps} open={running} defaultOpen={undefined} stepId={data.stepId??data.defaultStepId??data.steps[0].id} defaultStepId={undefined} onStepChange={d=>change('stepChange','stepId',d)} onOpenChange={d=>{record('openChange',d);if(host.acceptChanges!==false&&(d.open||host.acceptStop!==false))commit({open:d.open,...(!host.linkedTutorial?{running:d.open}:{})});}} onStop={host.linkedTutorial?stopCoach:undefined} onTargetAction={detail=>host.targetActionVerified===true&&(detail.targetId==='save-application'?result==='신청 저장 완료':result.trim().length>0)}/></>;
            break;
        }
        case 'tooltip':
            content = !host.removeTrigger ? <K.Tooltip {...data as K.TooltipProps} open={data.open ?? data.defaultOpen ?? false} defaultOpen={undefined} onOpenChange={d => { record('openChange', d); if (host.acceptClose !== false || d.open)
                commit({ open: d.open }); }}>{['information-icon','icon-button','vertical','box'].includes(host.presentation)&&<button type="button" style={{display:'inline-flex',flexDirection:host.presentation==='vertical'?'column':'row',alignItems:'center',gap:'.5rem',padding:host.presentation==='box'?'1rem':'.5rem'}}><svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 10v7M12 6v2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>{['vertical','box'].includes(host.presentation)&&<span>{data.triggerLabel}</span>}</button>}</K.Tooltip> : fallback;
            break;
        case 'tts':
            content = <><K.TTS {...data as K.TTSProps} state={speech} onRequest={d => { record('request', d); const next=speechDriver.current!.request(d);setSummary(speechDriver.current!.summary);setSpeech(next); }}/><p data-krds-host="speech-summary">{summary}</p>{speechReceipts}<button type="button" onClick={() => {speechDriver.current!.fail();setSpeech('error');}}>음성 오류 모의</button></>;
            break;
        case 'textarea':
            content = body(<K.Textarea {...data as K.TextareaProps} help={host.helpText} error={data.invalid ? host.errorText : undefined} onValueChange={d => change('valueChange', 'value', d)}/>);
            break;
        case 'text-input':
            content = !onEvent && host.samples?.length ? body(<><K.TextInput {...data as K.TextInputProps}/>{host.samples.map((sample:Data,index:number)=><K.TextInput key={index} {...data as K.TextInputProps} {...sample} label={`${data.label} ${sample.disabled?'사용 불가':'읽기 전용'}`}/>)}</>) : body(<K.TextInput {...data as K.TextInputProps} error={data.invalid || data.status === 'error' ? host.errorText : undefined} onValueChange={d => change('valueChange', 'value', d)} iconAction={data.iconAction ? { ...data.iconAction, onAction: () => record('iconAction', {}) } : undefined}/>);
            break;
        case 'file-upload':
            content = <form onSubmit={e => { e.preventDefault(); const formData = new FormData(e.currentTarget); setResult([...formData.getAll(data.name)].map(file => typeof file === 'string' ? file : `${file.name} (${file.size} bytes)`).join(', ')); setFiles(files.map(record => ({ ...record, status: 'success', progress: 100 }))); }} onReset={e => { if(e.defaultPrevented)return;if (host.cancelReset)
                e.preventDefault();
            else if (host.hostResetClears)
                setFiles([]); }} ref={node => { if (!node)
                return; node.onformdata = e => K.appendFileUploadFormData((e as FormDataEvent).formData, data.name, currentFiles.current, data.disabled); }}><K.FileUpload {...data as K.FileUploadProps} files={files} variant={host.pickerPresentation ?? 'dropzone'} onFilesChange={d => { record('filesChange', d); if (host.acceptChanges !== false){setFiles(d.value);onCommit?.({files:d.value});} }} onFilesRejected={d => record('filesRejected', d)}/><button type="reset">초기화</button><button type="submit">제출</button><p data-krds-host="upload-receipt">{result}</p></form>;
            break;
        case 'language-switcher':
            content = <><K.LanguageSwitcher {...data as K.LanguageSwitcherProps} open={data.open ?? data.defaultOpen ?? false} defaultOpen={undefined} onOpenChange={d => change('openChange', 'open', d)} onLocaleRequest={d => { record('localeRequest', d); if (host.acceptChanges !== false) {
                commit({ currentLocale: d.locale });
                setRoute(d.href);
            } }}/><p data-krds-host="locale-content">{data.options.find((o: Data) => o.locale === data.currentLocale)?.nativeLabel}</p></>;
            break;
        case 'resize':
            content = <><K.Resize {...data as K.ResizeProps} value={data.value ?? data.defaultValue ?? '100'} defaultValue={undefined} open={data.open ?? data.defaultOpen ?? false} defaultOpen={undefined} onValueChange={d => change('valueChange', 'value', d)} onOpenChange={d => change('openChange', 'open', d)}/><section data-krds-host="resize-content" style={{ fontSize: `${data.levels.find((l: Data) => l.id === (data.value ?? data.defaultValue))?.percent ?? 100}%` }}><h2>신청 안내</h2><p>화면 설정에 따라 이 내용과 버튼이 함께 커집니다.</p><button type="button">예제 작업</button></section></>;
            break;
        case 'accessible-media':
            content = <><K.AccessibleMedia {...data as K.AccessibleMediaProps} signLanguageSource={undefined}/>{data.signLanguageSource&&<p role="note">진본 수어 영상은 제공되지 않았습니다. 실제 수어 자료와 수동 동등성 검토가 필요합니다.</p>}</>;
            break;
        case 'visually-hidden':
            content = data.variant === 'interactive-overlay' ? <K.VisuallyHidden {...data as K.VisuallyHiddenProps} surrogate={<span>{host.visibleControlLabel}</span>}><button type="button">{host.visibleControlLabel}</button></K.VisuallyHidden> : <><K.VisuallyHidden {...data as K.VisuallyHiddenProps}/><button type="button" aria-describedby={data.id}>{host.visibleControlLabel}</button></>;
            break;
        case 'range-slider':
            content = body(<K.RangeSlider {...data as K.RangeSliderProps} onValueChange={d => change('valueChange', 'value', d)}/>);
            break;
        case 'back-button': {
            const back = (reason: 'activate' | 'confirmed') => { record('backRequest', { reason }); setRoute(data.canGoBack ? host.history?.at(-2) ?? '/local/parent' : data.fallbackHref); };
            content = <><label>작성 중인 내용<input data-krds-host="dirty-input" defaultValue="" onChange={event=>commit({dirty:event.currentTarget.value.length>0})}/></label><K.BackButton {...data as K.BackButtonProps} onBackRequest={d => back(d.reason)} requestConfirmation={requestBackConfirmation}/><button type="button" onClick={async()=>{if(!data.dirty){back('activate');return;}if(await requestBackConfirmation())back('confirmed');}}>브라우저 뒤로가기 모의</button><p data-krds-host="route">{route}</p><K.Modal open={confirmationOpen} title="작성 중인 내용이 있습니다" description="이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다." showCloseButton={false} onOpenChange={({open})=>{if(!open)finishBackConfirmation(false);}} actions={<><button type="button" onClick={()=>finishBackConfirmation(false)}>취소</button><button type="button" onClick={()=>finishBackConfirmation(true)}>확인</button></>}>작성 내용을 보존하려면 취소를 선택하세요.</K.Modal></>;
            break;
        }
        case 'bottom-sheet':
            content = <><button id={host.openerId ?? 'sheet-opener'} type="button" onClick={() => commit({ open: true })}>지역 선택 열기</button><K.BottomSheet {...data as K.BottomSheetProps} open={data.open ?? data.defaultOpen ?? true} defaultOpen={undefined} returnFocusId={host.openerId ?? 'sheet-opener'} onOpenChange={d => change('openChange', 'open', d)} onCancel={() => setSelection(host.selection ?? 'seoul')}><K.RadioGroup label="지역" name="sheet-region" value={selection} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} onValueChange={d => setSelection(d.value ?? 'seoul')}/></K.BottomSheet><p data-krds-host="committed-selection">{host.selection ?? 'seoul'}</p></>;
            break;
        case 'quantity-toggle':
            content = body(<K.QuantityToggle {...data as K.QuantityToggleProps} onValueChange={d => change('valueChange', 'value', d)}/>);
            break;
        case 'toast':
            content = <><button type="button" onClick={()=>commit({message:host.actionMessage??initialState.message})}>신청 저장</button><button type="button" onClick={() => document.getElementById(data.message?.persistentResultId ?? host.persistentResult?.id)?.focus()}>{host.persistentResult?.discoverableLabel ?? '처리 결과 확인'}</button><p id={data.message?.persistentResultId ?? host.persistentResult?.id ?? 'saved-result'} tabIndex={-1}>{host.persistentResult?.text ?? initialState.message?.text}</p><K.Toast {...data as K.ToastProps} clearance={barHeight+16} onDismiss={d => { record('dismiss', d); if (host.acceptDismissal !== false)
                commit({ message: null }); }}/></>;
            break;
        case 'snackbar':
            content = <>{fallback}<K.Snackbar {...data as K.SnackbarProps} clearance={barHeight+16} fallbackFocusId={host.fallbackFocusId} onAction={d => { record('action', d); setResult('저장 취소'); }} onDismiss={d => { record('dismiss', d); if (host.acceptDismissal !== false)
                commit({ message: null }); }}/></>;
            break;
        case 'tab-bar':
            content = <><K.TabBar {...data as K.TabBarProps} menuAction={host.menuAction || data.menuAction ? { label: '전체 메뉴', onRequest: () => commit({ menuOpen: true }) } : undefined}/><K.Modal open={!!data.menuOpen} title="전체 메뉴" onOpenChange={d => commit({ menuOpen: d.open })}>로컬 전체 메뉴</K.Modal><div style={{ height: host.pageHeight ?? 1000 }}/><button type="button" data-krds-host="last-content-action">마지막 작업</button></>;
            break;
        default: content = <p role="note">Component not implemented: {componentId}</p>;
    }
    return <div style={{ minHeight: host.shortPage ? '100vh' : undefined, display:host.shortPage?'flex':undefined,flexDirection:'column', paddingBottom: host.tabBarHeight ? `${host.tabBarHeight + 24}px` : undefined }}>
    {['contextual-help','language-switcher'].includes(componentId)&&outside}{componentId==='footer' ? <>{mainContent}{content}</> : componentId==='critical-alert' ? <>{content}{mainContent}</> : <>{content}{mainContent}</>}
    {!['contextual-help','language-switcher'].includes(componentId)&&outside}<p data-krds-host="result">{result}</p>{['fab','toast','snackbar'].includes(componentId)&&<K.TabBar items={[{id:'home',label:'홈',href:'/local/home',icon:'⌂'},{id:'apply',label:'신청',href:'/local/apply',icon:'▤'},{id:'profile',label:'내 정보',href:'/local/profile',icon:'○'}]} currentId="home"/>}
  </div>;
}
