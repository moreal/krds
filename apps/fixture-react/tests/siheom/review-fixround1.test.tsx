import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import {useState,useLayoutEffect} from 'react';
import {test,expect,afterEach,vi} from 'vitest';
import {render,screen,within,waitFor,cleanup,fireEvent,act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as K from '@unofficial-krds/react';
import {CatalogExample} from '../../src/CatalogExample';
import {LocalSpeechDriver} from '../../src/LocalSpeechDriver';
import {FixtureApp} from '../../src/FixtureApp';
import {catalogScenario} from '../../src/CatalogFixture';
afterEach(cleanup);

test('F1 a public Modal inside a native sheet owns the one topmost isolation stack',async()=>{
 render(<K.BottomSheet defaultOpen title="외부 시트"><K.Modal title="내부 대화상자" trigger={<button>내부 열기</button>}><button>내부 작업</button></K.Modal></K.BottomSheet>);
 await userEvent.click(screen.getByRole('button',{name:'내부 열기'}));
 const inner=screen.getByRole('dialog',{name:'내부 대화상자',hidden:true});
 expect(inner.closest('[inert]')).toBeNull();await waitFor(()=>expect(inner).toHaveFocus());
 const late=document.createElement('button');late.textContent='나중 배경';document.body.append(late);await waitFor(()=>expect(late.inert).toBe(true));
 await userEvent.keyboard('{Escape}');await waitFor(()=>expect(screen.queryByRole('dialog',{name:'내부 대화상자'})).toBeNull());expect(screen.getByRole('dialog',{name:'외부 시트'})).toBeVisible();late.remove();
});

test('F1 removing an older layer retains isolation and scroll lock for the newer sheet',async()=>{
 const view=render(<><K.BottomSheet key="a" open title="첫 시트"/><K.BottomSheet key="b" open title="둘째 시트"/></>);
 view.rerender(<K.BottomSheet key="b" open title="둘째 시트"/>);
 const top=screen.getByRole('dialog',{name:'둘째 시트'});expect(top.closest('[inert]')).toBeNull();expect(document.body.style.overflow).toBe('hidden');expect(view.container.inert).toBe(true);
});

test('F9 sheet initialFocusId can select its actual first interactive close control',async()=>{
 render(<K.BottomSheet id="entry-sheet" defaultOpen title="진입 시트" initialFocusId="entry-sheet-close"><button>나중 작업</button></K.BottomSheet>);
 await waitFor(()=>expect(within(screen.getByRole('dialog',{name:'진입 시트'})).getByRole('button',{name:'닫기'})).toHaveFocus());
});

test('F4 two same-name stores preserve each file and unrelated successful controls',()=>{
 const one=new File(['one'],'one.txt',{type:'text/plain'}),two=new File(['two'],'two.txt',{type:'text/plain'});
 const form=document.createElement('form');const input=document.createElement('input');input.name='documents';input.value='receipt';form.append(input);const data=new FormData(form);
 K.appendFileUploadFormData(data,'documents',[{id:'one',file:one,status:'staged'}]);K.appendFileUploadFormData(data,'documents',[{id:'two',file:two,status:'staged'}]);K.appendFileUploadFormData(data,'documents',[{id:'disabled',file:one,status:'staged'}],true);
 expect(data.getAll('documents').map(value=>typeof value==='string'?value:value.name)).toEqual(['receipt','one.txt','two.txt']);
});

test('F5 inconsistent final step is rejected before QuantityToggle or RangeSlider can crash on End',()=>{
 expect(()=>render(<K.QuantityToggle label="수량" min={0} max={10} step={3} defaultValue={9}/>)).toThrow(RangeError);
 expect(()=>render(<K.RangeSlider label="범위" min={0} max={1} step={0.3} defaultValue={0.9}/>)).toThrow(RangeError);
});

test('F11 replacing or disabling the roving item retains a visible enabled sequential tag stop',()=>{
 const view=render(<K.Tag mode="toggle" items={[{id:'a',label:'가'},{id:'b',label:'나'}]}/>);
 view.rerender(<K.Tag mode="toggle" items={[{id:'b',label:'나'},{id:'c',label:'다'}]}/>);expect(screen.getByRole('button',{name:'나'})).toHaveAttribute('tabindex','0');
 view.rerender(<K.Tag mode="toggle" items={[{id:'b',label:'나',disabled:true},{id:'c',label:'다'}]}/>);expect(screen.getByRole('button',{name:'다'})).toHaveAttribute('tabindex','0');
});

const nestedMenu=[{id:'a',label:'상위 분류',children:[{id:'b',label:'하위 분류',children:[{id:'leaf',label:'세 번째 수준 목적지',href:'/local/deep'}]}]}];
test('F2 nested menu branches expand and collapse their own level while retaining ancestors',async()=>{
 const request=vi.fn();render(<K.MainMenu items={nestedMenu} defaultExpandedId="a" onExpandedChange={request}/>);
 const parent=screen.getByRole('button',{name:'상위 분류'}),child=screen.getByRole('button',{name:'하위 분류'});expect(child).toHaveAttribute('aria-expanded','false');
 await userEvent.click(child);expect(parent).toHaveAttribute('aria-expanded','true');expect(child).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('link',{name:'세 번째 수준 목적지'})).toBeVisible();
 await userEvent.click(child);expect(parent).toHaveAttribute('aria-expanded','true');expect(child).toHaveAttribute('aria-expanded','false');expect(request.mock.calls.map(call=>call[0].id)).toEqual(['b','a']);
});
test('F2 controlled deep expansion and recursive search retain the full ancestor path',()=>{
 render(<K.MainMenu items={nestedMenu} expandedId="b" query="세 번째 수준"/>);expect(screen.getByRole('button',{name:'상위 분류'})).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('button',{name:'하위 분류'})).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('link',{name:'세 번째 수준 목적지'})).toBeVisible();
});

test('F3 native child trigger retains independent descriptions and executes touch primary action once',async()=>{
 const action=vi.fn();render(<><p id="independent-help">추가 안내</p><K.Tooltip text="도움말 설명" triggerLabel="도움말" triggerId="child-trigger" textId="child-tooltip"><button aria-describedby="independent-help" onClick={action}>원래 작업</button></K.Tooltip></>);
 const button=screen.getByRole('button',{name:'도움말'});expect(button.getAttribute('aria-describedby')?.split(' ')).toEqual(['independent-help','child-tooltip']);
 fireEvent.pointerDown(button,{pointerType:'touch'});fireEvent.focus(button);fireEvent.click(button);expect(action).toHaveBeenCalledTimes(1);await waitFor(()=>expect(document.getElementById('child-tooltip')).toHaveAttribute('data-krds-state',expect.stringContaining('open')));
});
test('F3 label-mode child removes duplicate tooltip description while preserving other help',()=>{
 render(<><p id="separate-help">독립 도움</p><K.Tooltip relationship="label" text="실제 동작 이름" triggerId="label-trigger" textId="label-tooltip"><button aria-label="오래된 이름" aria-describedby="label-tooltip separate-help">작업</button></K.Tooltip></>);
 const button=screen.getByRole('button',{name:'실제 동작 이름'});expect(button).toHaveAttribute('aria-describedby','separate-help');
});
test('F3 noninteractive Tooltip child is an explicit configuration error',()=>{
 expect(()=>render(<K.Tooltip text="도움말" triggerId="invalid-trigger" textId="invalid-tooltip"><span>작업</span></K.Tooltip>)).toThrow(TypeError);
 expect(()=>render(<K.Tooltip text="숨은 제어" triggerId="hidden-trigger" textId="hidden-tooltip"><input type="hidden"/></K.Tooltip>)).toThrow(TypeError);
});

test('F6 direct page draft follows committed page and accepted reset without navigation callbacks',async()=>{
 const request=vi.fn();const view=render(<form><K.Pagination page={1} pageCount={5} variant="direct-page" hrefForPage={page=>`/local/results?page=${page}`} onPageChange={request}/><button type="reset">페이지 초기화</button></form>);
 view.rerender(<form><K.Pagination page={2} pageCount={5} variant="direct-page" hrefForPage={page=>`/local/results?page=${page}`} onPageChange={request}/><button type="reset">페이지 초기화</button></form>);await waitFor(()=>expect(screen.getByRole('textbox',{name:'페이지'})).toHaveValue('2'));
 await userEvent.clear(screen.getByRole('textbox',{name:'페이지'}));await userEvent.type(screen.getByRole('textbox',{name:'페이지'}),'99');await userEvent.click(screen.getByRole('button',{name:'이동'}));expect(screen.getByRole('textbox',{name:'페이지'})).toHaveAttribute('aria-invalid','true');await userEvent.click(screen.getByRole('button',{name:'페이지 초기화'}));await waitFor(()=>expect(screen.getByRole('textbox',{name:'페이지'})).toHaveValue('2'));expect(screen.getByRole('textbox',{name:'페이지'})).not.toHaveAttribute('aria-invalid');expect(request).not.toHaveBeenCalled();
});
test('F7 failed load-more never focuses the previous insertion target',()=>{
 const props={pageCount:1,variant:'load-more' as const,hrefForPage:()=>'/local/results'};const make=(pending:boolean)=><><button>다른 작업</button><div id="previous-result">이전 추가 결과</div><K.Pagination {...props} loadMore={{shown:10,total:30,pending,firstNewItemId:'previous-result',onLoadMore:()=>{}}}/></>;
 const view=render(make(false));view.rerender(make(true));screen.getByRole('button',{name:'다른 작업'}).focus();view.rerender(make(false));expect(screen.getByRole('button',{name:'다른 작업'})).toHaveFocus();expect(document.getElementById('previous-result')).not.toHaveAttribute('tabindex');
});

test('F10 unknown row header identity is rejected rather than emitting dangling cell headers',()=>{
 expect(()=>render(<K.Table caption="내역" columns={[{id:'name',label:'이름',kind:'text'}]} rows={[{id:'a',cells:{name:'가'}}]} rowHeaderColumnId="missing"/>)).toThrow(RangeError);
});

test('F8 accepted Snackbar close returns to the actual usable initiating control',async()=>{
 function Example(){const [shown,setShown]=useState(false);return <><button onClick={()=>setShown(true)}>알림 시작</button><K.Snackbar message={shown?{id:'notice',title:'저장',text:'저장 완료'}:null} onDismiss={()=>setShown(false)}/></>;}
 render(<Example/>);const origin=screen.getByRole('button',{name:'알림 시작'});await userEvent.click(origin);await userEvent.click(screen.getByRole('button',{name:'알림 닫기'}));await waitFor(()=>expect(origin).toHaveFocus());
});
test('F8 replacing a focused Snackbar action restores its origin and names new-window links',async()=>{
 function Example(){const [shown,setShown]=useState(false),[linked,setLinked]=useState(false);return <><button onClick={()=>setShown(true)}>작업 시작</button><K.Snackbar message={shown?{id:'action',title:'진행',text:'안내'}:null} action={linked?{kind:'link',id:'link',label:'자세히',href:'/local/details',target:'_blank'}:{kind:'button',id:'do',label:'실행'}} onAction={()=>setLinked(true)} onDismiss={()=>setShown(false)}/></>;}
 render(<Example/>);const origin=screen.getByRole('button',{name:'작업 시작'});await userEvent.click(origin);await userEvent.click(screen.getByRole('button',{name:'실행'}));await waitFor(()=>expect(origin).toHaveFocus());expect(screen.getByRole('link',{name:'자세히 (새 창)'})).toHaveAttribute('rel',expect.stringContaining('noopener'));
});

afterEach(()=>document.querySelectorAll('[data-review-late-target]').forEach(node=>node.remove()));
test('F12 passive section tracking binds a late mounted target and its same-ID replacement',async()=>{
 const request=vi.fn(),sections=[{id:'late-target',label:'늦은 본문'},{id:'other-target',label:'다른 본문'}];render(<K.InPageNavigation sections={sections} activeId="other-target" onActiveChange={request}/>);
 const make=()=>{const node=document.createElement('section');node.id='late-target';node.dataset.reviewLateTarget='true';node.style.cssText='position:fixed;top:100px;left:500px;width:100px;height:100px';node.textContent='늦게 삽입한 본문';document.body.append(node);return node;};
 let node=make();await waitFor(()=>expect(request).toHaveBeenCalledWith({id:'late-target',reason:'scroll'}));const count=request.mock.calls.length;node.remove();node=make();await waitFor(()=>expect(request.mock.calls.length).toBeGreaterThan(count));node.remove();
});

const tutorialTasks=[{id:'valid',title:'실제 작업',steps:[{id:'step',title:'실제 단계',instruction:'실제 안내',targetId:'real-target'}]}];
test('F13 ordinary desktop Tutorial open enters the panel and accepted Close returns to its opener',async()=>{
 render(<K.TutorialPanel tasks={tutorialTasks} activeTaskId={null} activeStepId={null} defaultOpen={false} startActionId="tutorial-start"/>);const opener=screen.getByRole('button',{name:'튜토리얼 열기'});await userEvent.click(opener);const panel=screen.getByRole('complementary',{name:'따라하기'});await waitFor(()=>expect(panel).toHaveFocus());await userEvent.click(within(panel).getByRole('button',{name:'튜토리얼 닫기'}));await waitFor(()=>expect(opener).toHaveFocus());
});
for(const selected of [null,'empty'])test(`F14 Tutorial Start finds a real task after empty selection ${selected}`,async()=>{
 const start=vi.fn();render(<K.TutorialPanel tasks={[{id:'empty',title:'빈 작업',steps:[]},...tutorialTasks]} activeTaskId={selected} activeStepId={null} startActionId={`available-start-${selected}`} onStart={start}/>);await userEvent.click(screen.getByRole('button',{name:'따라하기 시작'}));expect(start).toHaveBeenCalledExactlyOnceWith({taskId:'valid',stepId:'step'});
});

test('F1 DateInput calendar composes inside a native sheet without inherited inertness',async()=>{
 render(<K.BottomSheet defaultOpen title="날짜 시트"><K.DateInput label="신청 날짜" defaultValue="2024-02-29"/></K.BottomSheet>);await userEvent.click(screen.getByRole('button',{name:'달력 열기'}));const calendar=screen.getByRole('dialog',{name:'날짜 선택'});expect(calendar.closest('[inert]')).toBeNull();expect(calendar.contains(document.activeElement)).toBe(true);await userEvent.keyboard('{Escape}');await waitFor(()=>expect(screen.queryByRole('dialog',{name:'날짜 선택'})).toBeNull());expect(screen.getByRole('dialog',{name:'날짜 시트'})).toBeVisible();
});
test('F4 native choosers contribute no ephemeral same-name entries to the aggregate submission',()=>{
 const one={id:'one',file:new File(['1'],'one.txt'),status:'staged' as const},two={id:'two',file:new File(['22'],'two.txt'),status:'staged' as const};
 render(<form aria-label="두 첨부 양식"><input name="documents" defaultValue="metadata"/><K.FileUpload name="documents" label="첫 첨부" files={[one]} onFilesChange={()=>{}}/><K.FileUpload name="documents" label="둘째 첨부" files={[two]} onFilesChange={()=>{}}/><K.FileUpload name="documents" label="제외 첨부" files={[one]} disabled onFilesChange={()=>{}}/></form>);
 const data=new FormData(screen.getByRole('form',{name:'두 첨부 양식'}) as HTMLFormElement);expect(data.getAll('documents')).toEqual(['metadata']);K.appendFileUploadFormData(data,'documents',[one]);K.appendFileUploadFormData(data,'documents',[two]);K.appendFileUploadFormData(data,'documents',[one],true);expect(data.getAll('documents').map(value=>typeof value==='string'?value:value.name)).toEqual(['metadata','one.txt','two.txt']);
});
test('F5 consistent fractional endpoints remain usable at the final interval',async()=>{
 const request=vi.fn();render(<><K.QuantityToggle label="분수 수량" min={0} max={0.3} step={0.1} defaultValue={0.2} onValueChange={request}/><K.RangeSlider label="분수 범위" min={0} max={0.3} step={0.1} defaultValue={0.2}/></>);await userEvent.click(screen.getByRole('button',{name:'분수 수량 늘리기'}));expect(request).toHaveBeenCalledExactlyOnceWith({value:0.3});const slider=screen.getByRole('slider',{name:'분수 범위'});fireEvent.input(slider,{target:{value:'0.3'}});expect(slider).toHaveValue('0.3');
});
test('F7 a genuinely new successful result receives focus and restores its temporary tabindex after blur',()=>{
 const make=(pending:boolean,shown:number)=><><button>결과 다음 작업</button>{shown>10&&<li id="newly-added-result">새 결과</li>}<K.Pagination pageCount={1} variant="load-more" hrefForPage={()=>'/local/results'} loadMore={{shown,total:20,pending,firstNewItemId:'newly-added-result',onLoadMore:()=>{}}}/></>;
 const view=render(make(false,10));view.rerender(make(true,10));view.rerender(make(false,11));expect(document.getElementById('newly-added-result')).toHaveFocus();screen.getByRole('button',{name:'결과 다음 작업'}).focus();expect(document.getElementById('newly-added-result')).not.toHaveAttribute('tabindex');
});
test('F9 invalid sheet entry target is rejected and releases isolation',()=>{
 expect(()=>render(<K.BottomSheet defaultOpen title="잘못된 진입" initialFocusId="later-sheet-action"><button id="later-sheet-action">뒤의 작업</button></K.BottomSheet>)).toThrow(RangeError);expect(document.body.style.overflow).not.toBe('hidden');
});
test('F11 hiding the active tag through visibleCount repairs keyboard entry and accepted focus',async()=>{
 const items=[{id:'a',label:'가'},{id:'b',label:'나'},{id:'c',label:'다'}];const view=render(<K.Tag mode="toggle" items={items} visibleCount={3}/>);act(()=>screen.getByRole('button',{name:'다'}).focus());view.rerender(<K.Tag mode="toggle" items={items} visibleCount={1}/>);await waitFor(()=>expect(screen.getByRole('button',{name:'가'})).toHaveFocus());expect(screen.getByRole('button',{name:'가'})).toHaveAttribute('tabindex','0');
});
test('F13 a rejected controlled Tutorial close retains focused Close without restoration',async()=>{
 render(<K.TutorialPanel tasks={tutorialTasks} activeTaskId={null} activeStepId={null} open startActionId="rejected-tutorial-start" onOpenChange={()=>{}}/>);const close=screen.getByRole('button',{name:'튜토리얼 닫기'});await userEvent.click(close);expect(close).toHaveFocus();expect(screen.getByRole('complementary',{name:'따라하기'})).toBeVisible();
});
for(const placement of ['top-start','top','top-end','bottom-start','bottom','bottom-end'] as const)test(`F16 ${placement} uses one actual collision-aware alignment`,async()=>{
 render(<div style={{marginLeft:400,marginTop:350}}><K.ContextualHelp title="정렬" content="안내 내용" triggerLabel="위치 안내" placement={placement} defaultOpen/></div>);
 await waitFor(()=>{const trigger=screen.getByRole('button',{name:'위치 안내'}).getBoundingClientRect(),popup=screen.getByRole('region',{name:'정렬'}).getBoundingClientRect();const difference=placement.endsWith('-start')?popup.left-trigger.left:placement.endsWith('-end')?popup.right-trigger.right:(popup.left+popup.right-trigger.left-trigger.right)/2;expect(Math.abs(difference)).toBeLessThan(2);expect(Math.abs(placement.startsWith('top')?popup.bottom-trigger.top+8:popup.top-trigger.bottom-8)).toBeLessThan(2);});
});
test('F16 top popover repositions after its real native content grows',async()=>{
 const make=(height:number)=><div style={{marginLeft:400,marginTop:400}}><K.ContextualHelp title="변경 안내" content="내용" triggerLabel="내용 도움" placement="top-start" defaultOpen><div style={{height}}>실제 슬롯 내용</div></K.ContextualHelp></div>;const view=render(make(30));await waitFor(()=>{const trigger=screen.getByRole('button',{name:'내용 도움'}).getBoundingClientRect(),popup=screen.getByRole('region',{name:'변경 안내'}).getBoundingClientRect();expect(Math.abs(popup.bottom-trigger.top+8)).toBeLessThan(2);});view.rerender(make(140));await waitFor(()=>{const trigger=screen.getByRole('button',{name:'내용 도움'}).getBoundingClientRect(),popup=screen.getByRole('region',{name:'변경 안내'}).getBoundingClientRect();expect(Math.abs(popup.bottom-trigger.top+8)).toBeLessThan(2);});
});

test('F11 link-mode roving arrows skip disabled native link options',async()=>{
 render(<K.Tag mode="link" items={[{id:'a',label:'제외 링크',href:'/local/a',disabled:true},{id:'b',label:'첫 링크',href:'/local/b'},{id:'c',label:'끝 링크',href:'/local/c'}]}/>);screen.getByRole('link',{name:'첫 링크'}).focus();await userEvent.keyboard('{ArrowLeft}');expect(screen.getByRole('link',{name:'끝 링크'})).toHaveFocus();
});

test('FAB showLabel changes only visible primary text while preserving its native name and focus',async()=>{
 const action=vi.fn(),expanded=vi.fn();const view=render(<K.FAB label="새 신청" icon="plus" showLabel onAction={action} onExpandedChange={expanded}/>);const button=screen.getByRole('button',{name:'새 신청'});button.focus();view.rerender(<K.FAB label="새 신청" icon="plus" showLabel={false} onAction={action} onExpandedChange={expanded}/>);expect(button).toHaveFocus();expect(button.querySelector('[data-krds-part="label"]')).not.toBeVisible();expect(button).toHaveAccessibleName('새 신청');expect(action).not.toHaveBeenCalled();expect(expanded).not.toHaveBeenCalled();await userEvent.click(button);expect(action).toHaveBeenCalledTimes(1);
});

test('Spinner determinate graphic reflects the actual percentage and keeps readable text outside rotation',()=>{
 const view=render(<K.Spinner pending value={40} label="자료 불러오는 중" completionMessage="완료"/>);const progress=screen.getByRole('progressbar',{name:'자료 불러오는 중'});expect(progress.tagName.toLowerCase()).toBe('progress');expect(progress).toHaveAttribute('data-krds-part','indicator');expect(progress).toHaveAttribute('data-krds-state','determinate');expect(progress).toHaveAttribute('aria-valuenow','40');expect((progress as HTMLProgressElement).value).toBe(40);const label=document.querySelector('[data-krds-component="spinner"][data-krds-part="label"]')!;expect(label).toHaveTextContent('자료 불러오는 중');expect(getComputedStyle(label).transform).toBe('none');view.rerender(<K.Spinner pending value={70} label="자료 불러오는 중" completionMessage="완료"/>);expect(progress).toHaveAttribute('aria-valuenow','70');expect((progress as HTMLProgressElement).value).toBe(70);
});

test('F3 description mode removes a stale own tooltip-name relation from a native child',()=>{
 render(<K.Tooltip relationship="description" text="보조 설명" triggerLabel="원래 작업" triggerId="description-trigger" textId="description-tooltip"><button aria-labelledby="description-tooltip">원래 작업</button></K.Tooltip>);const button=screen.getByRole('button',{name:'원래 작업'});expect(button).not.toHaveAttribute('aria-labelledby');expect(button).toHaveAttribute('aria-describedby','description-tooltip');
});

test('F5 an accepted small scientific step reaches its exact maximum and submitted value',async()=>{
 const request=vi.fn();render(<form aria-label="작은 단위 양식"><K.QuantityToggle name="tiny" label="작은 단위" min={0} max={1e-11} step={1e-12} defaultValue={9e-12} onValueChange={request}/></form>);await userEvent.click(screen.getByRole('button',{name:'작은 단위 늘리기'}));expect(request).toHaveBeenCalledExactlyOnceWith({value:1e-11});expect(new FormData(screen.getByRole('form',{name:'작은 단위 양식'}) as HTMLFormElement).get('tiny')).toBe('1e-11');
});

test('Catalog configuration evidence comes from the actual native Badge error boundary',()=>{
 render(<CatalogExample componentId="badge" initialState={{label:'실제 배지',tone:'information'}} host={{testConfiguration:{tone:'unsupported-local-tone'}}}/>);expect(document.querySelector('[data-krds-host="configuration-error"]')).toHaveTextContent('TypeError');
});

test('Masthead false never emits the official sentence even with legacy specimen data',()=>{
 const legacy={governmentService:false,specimen:true};render(<K.Masthead {...legacy}/>);expect(screen.queryByText('이 누리집은 대한민국 공식 전자정부 누리집입니다.')).toBeNull();
});

test('F3 focused child Tooltip consumes Escape before its containing public Modal',async()=>{
 const modal=vi.fn();render(<K.Modal defaultOpen title="도움말 대화상자" onOpenChange={modal}><K.Tooltip text="자세한 안내" triggerLabel="정보" triggerId="modal-help" textId="modal-help-text"><button>정보</button></K.Tooltip></K.Modal>);await userEvent.click(screen.getByRole('button',{name:'정보'}));await userEvent.keyboard('{Escape}');expect(screen.getByRole('dialog',{name:'도움말 대화상자'})).toBeVisible();expect(document.getElementById('modal-help-text')).toHaveAttribute('data-krds-state',expect.stringContaining('closed'));expect(modal).not.toHaveBeenCalled();
});
test('F3 hover-only Tooltip Escape also preserves its containing Modal',async()=>{
 render(<K.Modal defaultOpen title="호버 대화상자"><button>다른 작업 유지</button><K.Tooltip text="호버 안내" triggerLabel="호버 정보" triggerId="hover-help" textId="hover-help-text"><button>호버 정보</button></K.Tooltip></K.Modal>);await userEvent.click(screen.getByRole('button',{name:'다른 작업 유지'}));await userEvent.hover(screen.getByRole('button',{name:'호버 정보'}));await userEvent.keyboard('{Escape}');expect(screen.getByRole('dialog',{name:'호버 대화상자'})).toBeVisible();expect(document.getElementById('hover-help-text')).toHaveAttribute('data-krds-state',expect.stringContaining('closed'));
});
test('F3 actual child-owned Tab departure clears accepted Escape suppression on return',async()=>{
 render(<><K.Tooltip text="라디오 안내" triggerLabel="첫 라디오" triggerId="first-child-radio" textId="radio-help"><input type="radio" defaultChecked name="child-group" onKeyDown={event=>{if(event.key==='Tab'&&!event.shiftKey){event.preventDefault();document.getElementById('second-child-radio')?.focus();}}}/></K.Tooltip><input id="second-child-radio" aria-label="둘째 라디오" type="radio" name="child-group" onKeyDown={event=>{if(event.key==='Tab'&&event.shiftKey){event.preventDefault();document.getElementById('first-child-radio')?.focus();}}}/></>);await userEvent.click(screen.getByRole('radio',{name:'첫 라디오'}));await userEvent.keyboard('{Escape}');await userEvent.keyboard('{Tab}');expect(screen.getByRole('radio',{name:'둘째 라디오'})).toHaveFocus();await userEvent.keyboard('{Shift>}{Tab}{/Shift}');expect(screen.getByRole('radio',{name:'첫 라디오'})).toHaveFocus();expect(document.getElementById('radio-help')).toHaveAttribute('data-krds-state',expect.stringContaining('open'));
});
test('F3 an explicit child touch toggle can reopen after accepted Escape',async()=>{
 render(<K.Tooltip text="터치 안내" triggerLabel="터치 정보" triggerId="touch-again" textId="touch-again-text"><button>터치 정보</button></K.Tooltip>);const button=screen.getByRole('button',{name:'터치 정보'});await userEvent.click(button);await userEvent.keyboard('{Escape}');fireEvent.pointerDown(button,{pointerType:'touch'});fireEvent.click(button);await waitFor(()=>expect(document.getElementById('touch-again-text')).toHaveAttribute('data-krds-state',expect.stringContaining('open')));
});
test('F3 native child callback refs retain React19 cleanup and do not churn with tooltip state',async()=>{
 const released=vi.fn(),ref=vi.fn(()=>released);const view=render(<K.Tooltip text="참조 안내" triggerLabel="참조 정보" triggerId="ref-trigger" textId="ref-help"><button ref={ref}>참조 정보</button></K.Tooltip>);await userEvent.click(screen.getByRole('button',{name:'참조 정보'}));await userEvent.keyboard('{Escape}');expect(ref).toHaveBeenCalledTimes(1);view.unmount();expect(released).toHaveBeenCalledTimes(1);
});

test('Spinner completion removes the pending graphic and keeps actual completion status',()=>{
 const view=render(<K.Spinner pending label="처리 중" completionMessage="처리 완료"/>);expect(screen.getByRole('progressbar',{name:'처리 중'})).toBeVisible();view.rerender(<K.Spinner pending={false} label="처리 중" completionMessage="처리 완료"/>);expect(document.querySelector('[data-krds-component="spinner"][data-krds-part="indicator"]')).toBeNull();expect(screen.getByRole('status')).toHaveTextContent('처리 완료');expect(screen.queryByRole('progressbar')).toBeNull();
});

test('R2-01 deep MainMenu Escape closes all dropdowns and returns the top-level trigger',async()=>{
 render(<K.MainMenu items={nestedMenu} defaultExpandedId="b"/>);const top=screen.getByRole('button',{name:'상위 분류'});screen.getByRole('link',{name:'세 번째 수준 목적지'}).focus();await userEvent.keyboard('{Escape}');expect(top).toHaveAttribute('aria-expanded','false');expect(top).toHaveFocus();expect(screen.queryByRole('link',{name:'세 번째 수준 목적지'})).toBeNull();
});
test('R2-01 rejected controlled deep Escape retains focus until delayed actual closure',async()=>{
 const request=vi.fn();const make=(expandedId:string|null)=><K.MainMenu items={nestedMenu} expandedId={expandedId} onExpandedChange={request}/>;const view=render(make('b'));const leaf=screen.getByRole('link',{name:'세 번째 수준 목적지'});leaf.focus();await userEvent.keyboard('{Escape}');expect(request).toHaveBeenCalledExactlyOnceWith({id:null});expect(leaf).toHaveFocus();expect(screen.getByRole('button',{name:'상위 분류'})).toHaveAttribute('aria-expanded','true');await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});view.rerender(make('b'));expect(leaf).toHaveFocus();expect(request).toHaveBeenCalledTimes(1);view.rerender(make(null));await waitFor(()=>expect(screen.getByRole('button',{name:'상위 분류'})).toHaveFocus());expect(screen.getByRole('button',{name:'상위 분류'})).toHaveAttribute('aria-expanded','false');
});
test('R2-02 focused inner combobox handles Escape before hover Tooltip and containing Modal',async()=>{
 const tooltip=vi.fn(),modal=vi.fn();function Inner(){const[expanded,setExpanded]=useState(true);return <><label htmlFor="escape-combobox">선택 검색</label><input id="escape-combobox" role="combobox" aria-expanded={expanded} aria-controls="escape-options" onKeyDown={event=>{if(event.key==='Escape'&&expanded){event.preventDefault();setExpanded(false);}}}/><ul id="escape-options" role="listbox" hidden={!expanded}><li role="option" aria-selected="false">실제 선택지</li></ul></>;}
 render(<K.Modal defaultOpen title="우선순위 대화상자" onOpenChange={modal}><Inner/><K.Tooltip text="호버 설명" triggerLabel="설명" triggerId="priority-trigger" textId="priority-text" onOpenChange={tooltip}><button>설명</button></K.Tooltip></K.Modal>);const input=screen.getByRole('combobox',{name:'선택 검색'});await userEvent.click(input);await userEvent.hover(screen.getByRole('button',{name:'설명'}));await waitFor(()=>expect(document.getElementById('priority-text')).toHaveAttribute('data-krds-state',expect.stringContaining('open')));tooltip.mockClear();await userEvent.keyboard('{Escape}');expect(input).toHaveAttribute('aria-expanded','false');expect(input).toHaveFocus();expect(screen.getByRole('dialog',{name:'우선순위 대화상자'})).toBeVisible();expect(document.getElementById('priority-text')).toHaveAttribute('data-krds-state',expect.stringContaining('open'));expect(tooltip).not.toHaveBeenCalled();expect(modal).not.toHaveBeenCalled();await userEvent.keyboard('{Escape}');expect(document.getElementById('priority-text')).toHaveAttribute('data-krds-state',expect.stringContaining('closed'));expect(modal).not.toHaveBeenCalled();
});
test('R2-03 uncontrolled Pagination reset restores draft to the actual committed page',async()=>{
 const request=vi.fn();render(<form><K.Pagination defaultPage={1} pageCount={5} variant="direct-page" hrefForPage={page=>`/local/results?page=${page}`} onPageChange={request}/><button type="reset">현재 페이지 초안 복원</button></form>);const input=screen.getByRole('textbox',{name:'페이지'});await userEvent.clear(input);await userEvent.type(input,'2');await userEvent.click(screen.getByRole('button',{name:'이동'}));expect(request).toHaveBeenCalledExactlyOnceWith({page:2});expect(input).toHaveValue('2');await userEvent.clear(input);await userEvent.type(input,'99');await userEvent.click(screen.getByRole('button',{name:'이동'}));expect(input).toHaveAttribute('aria-invalid','true');await userEvent.click(screen.getByRole('button',{name:'현재 페이지 초안 복원'}));await waitFor(()=>expect(input).toHaveValue('2'));expect(input).not.toHaveAttribute('aria-invalid');expect(request).toHaveBeenCalledExactlyOnceWith({page:2});
});
test('R2-04 split insertion and completion retain the load-more transaction start baseline',async()=>{
 const props={pageCount:1,variant:'load-more' as const,hrefForPage:()=>'/local/results'};const make=(pending:boolean,shown:number,inserted:boolean)=><><button>다른 결과 작업</button>{inserted&&<article id="split-result">새로 도착한 실제 결과</article>}<K.Pagination {...props} loadMore={{shown,total:30,pending,firstNewItemId:'split-result',onLoadMore:()=>{}}}/></>;const view=render(make(false,10,false));const outside=screen.getByRole('button',{name:'다른 결과 작업'});outside.focus();view.rerender(make(true,10,false));await act(async()=>{await Promise.resolve();});view.rerender(make(true,11,true));expect(outside).toHaveFocus();await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});view.rerender(make(false,11,true));expect(document.getElementById('split-result')).toHaveFocus();outside.focus();expect(document.getElementById('split-result')).not.toHaveAttribute('tabindex');
});

test('Spinner live status keeps the supplied start label while actual percentage changes separately',async()=>{
 const view=render(<K.Spinner pending value={40} label="실제 자료 처리 중" completionMessage="실제 자료 처리 완료"/>);const status=screen.getByRole('status');expect(status).toHaveTextContent(/^실제 자료 처리 중$/);let changes=0;const observer=new MutationObserver(records=>{changes+=records.length;});observer.observe(status,{childList:true,characterData:true,subtree:true});view.rerender(<K.Spinner pending value={70} label="실제 자료 처리 중" completionMessage="실제 자료 처리 완료"/>);await act(async()=>{await Promise.resolve();});expect(changes).toBe(0);expect(screen.getByRole('progressbar',{name:'실제 자료 처리 중'})).toHaveAttribute('aria-valuenow','70');expect(document.querySelector('[data-krds-component="spinner"][data-krds-part="label"]')).toHaveTextContent('실제 자료 처리 중');view.rerender(<K.Spinner pending={false} value={70} label="실제 자료 처리 중" completionMessage="실제 자료 처리 완료"/>);expect(status).toHaveTextContent('실제 자료 처리 완료');observer.disconnect();
});
test('Masthead simulation host preserves the exact adjacent visible paragraph notice',()=>{
 const label='공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.';render(<CatalogExample componentId="masthead" initialState={{governmentService:true}} host={{specimenLabel:label,authorizedGovernmentHost:false}}/>);expect(screen.getAllByRole('paragraph').some(node=>node.textContent===label)).toBe(true);expect(screen.getByText(label)).toBeVisible();expect(screen.getByText('이 누리집은 대한민국 공식 전자정부 누리집입니다.')).toBeVisible();
});

test('Pagination pending and failed load preserve the actual initiating button focus and block repeat requests',async()=>{
 const request=vi.fn();let complete=()=>{};function Example(){const[pending,setPending]=useState(false);complete=()=>setPending(false);return <K.Pagination pageCount={1} variant="load-more" hrefForPage={()=>'/local/results'} loadMore={{shown:10,total:20,pending,onLoadMore:()=>{request();setPending(true);}}}/>;}
 render(<Example/>);await userEvent.click(screen.getByRole('button',{name:'더 보기'}));const pending=screen.getByRole('button',{name:'더 보기'});expect(pending).toBeDisabled();expect(pending).toHaveAttribute('data-krds-state','pending');await userEvent.click(pending);expect(request).toHaveBeenCalledTimes(1);await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));complete();});expect(screen.getByRole('button',{name:'더 보기'})).toHaveFocus();expect(request).toHaveBeenCalledTimes(1);
});
test('Standalone Coach host rejects Stop through its actual controlled open request',async()=>{
 const event=vi.fn();render(<CatalogExample componentId="coach-mark" initialState={{defaultOpen:true,defaultStepId:'one',steps:[{id:'one',title:'이름 입력',targetId:'applicant-name',instruction:'이름을 입력하세요'}],boundaries:[{targetId:'applicant-name',insertionBoundaryId:'applicant-name-after'}],startActionId:'standalone-start',fallbackFocusId:'standalone-fallback'}} host={{acceptChanges:true,acceptStop:false,targetInputs:{'applicant-name':''}}} onEvent={event}/>);const stop=screen.getByRole('button',{name:'그만보기'});stop.focus();await userEvent.keyboard('{Enter}');expect(document.querySelector('[data-krds-component="coach-mark"][data-krds-part="root"]')).toBeVisible();expect(stop).toHaveFocus();expect(event).toHaveBeenCalledExactlyOnceWith('openChange',{open:false});
});

test('Pagination failed completion respects a real outside focus handoff during pending',async()=>{
 let complete=()=>{};function Example(){const[pending,setPending]=useState(false);complete=()=>setPending(false);return <><button>독립 작업으로 이동</button><K.Pagination pageCount={1} variant="load-more" hrefForPage={()=>'/local/results'} loadMore={{shown:10,total:20,pending,onLoadMore:()=>setPending(true)}}/></>;}
 render(<Example/>);await userEvent.click(screen.getByRole('button',{name:'더 보기'}));await userEvent.click(screen.getByRole('button',{name:'독립 작업으로 이동'}));await act(async()=>{complete();});expect(screen.getByRole('button',{name:'독립 작업으로 이동'})).toHaveFocus();
});

test('ContextualHelp removal restores owned focus after the fallback actually mounts',async()=>{
 const view=render(<K.ContextualHelp defaultOpen title="실제 제거 안내" content="제거 후 다음 작업으로 이동" triggerLabel="실제 제거 안내" fallbackFocusId="new-context-fallback"/>);await userEvent.click(screen.getByRole('button',{name:'닫기'}));await userEvent.click(screen.getByRole('button',{name:'실제 제거 안내'}));expect(screen.getByRole('button',{name:'닫기'})).toHaveFocus();view.rerender(<button id="new-context-fallback">새로 표시된 다음 작업</button>);await waitFor(()=>expect(screen.getByRole('button',{name:'새로 표시된 다음 작업'})).toHaveFocus());
});
test('TTS host teardown disposes an actual AbortController driver with bounded lifecycle Stop',async()=>{
 const props={componentId:'tts',initialState:{summary:'실제 로컬 안내',locale:'ko-KR',state:'idle',label:'음성 안내'}};const request=vi.fn();const view=render(<CatalogExample {...props} host={{}} onEvent={request}/>);await userEvent.click(screen.getByRole('button',{name:'음성 안내 재생'}));const calls=request.mock.calls.length;const abort=vi.spyOn(AbortController.prototype,'abort');try{view.rerender(<CatalogExample {...props} host={{mounted:false}} onEvent={request}/>);await waitFor(()=>expect(document.querySelector('[data-krds-host="speech-driver-active"]')).toHaveTextContent('false'));expect(document.querySelector('[data-krds-host="speech-driver-lifecycle"]')).toHaveTextContent('disposed');expect(document.querySelector('[data-krds-host="speech-state"]')).toHaveTextContent('idle');expect(abort).toHaveBeenCalledTimes(1);const delta=request.mock.calls.slice(calls);expect(delta.length).toBeLessThanOrEqual(1);if(delta.length)expect(delta).toEqual([['request',{action:'stop',summary:'실제 로컬 안내',locale:'ko-KR'}]]);}finally{abort.mockRestore();}
});

test('ContextualHelp removal respects focus already handed to a real outside action',async()=>{
 const view=render(<><button>이미 선택한 다른 작업</button><K.ContextualHelp defaultOpen title="다른 안내" content="내용" triggerLabel="다른 안내" fallbackFocusId="later-context-fallback"/></>);const outside=screen.getByRole('button',{name:'이미 선택한 다른 작업'});outside.focus();view.rerender(<><button>이미 선택한 다른 작업</button><button id="later-context-fallback">나중 대체 작업</button></>);await act(async()=>{await Promise.resolve();});expect(screen.getByRole('button',{name:'이미 선택한 다른 작업'})).toHaveFocus();
});
test('Local speech driver pauses actual position and resumes the same cancellable session',async()=>{
 const driver=new LocalSpeechDriver();try{driver.request({action:'play',summary:'실제 모의 안내',locale:'ko-KR'});expect(driver.active).toBe(true);await new Promise(resolve=>setTimeout(resolve,20));driver.request({action:'pause',summary:'실제 모의 안내',locale:'ko-KR'});const paused=driver.positionMs;expect(paused).toBeGreaterThan(0);expect(driver.state).toBe('paused');await new Promise(resolve=>setTimeout(resolve,20));expect(driver.positionMs).toBe(paused);driver.request({action:'resume',summary:'실제 모의 안내',locale:'ko-KR'});await new Promise(resolve=>setTimeout(resolve,20));expect(driver.positionMs).toBeGreaterThan(paused);expect(driver.summary).toBe('실제 모의 안내');expect(driver.locale).toBe('ko-KR');driver.dispose();expect(driver.active).toBe(false);expect(driver.lifecycle).toBe('disposed');expect(driver.state).toBe('idle');}finally{driver.dispose();}
});
test('Closed ContextualHelp does not consume Escape owned by its containing Modal',async()=>{
 render(<K.Modal defaultOpen title="닫힌 도움말의 대화상자"><K.ContextualHelp title="도움말" content="설명" triggerLabel="도움말"/></K.Modal>);await userEvent.click(screen.getByRole('button',{name:'도움말'}));await userEvent.keyboard('{Escape}');expect(screen.getByRole('dialog',{name:'닫힌 도움말의 대화상자'})).toBeVisible();expect(screen.getByRole('button',{name:'도움말'})).toHaveFocus();await userEvent.keyboard('{Escape}');expect(screen.queryByRole('dialog',{name:'닫힌 도움말의 대화상자'})).toBeNull();
});

test('A catalog fixture first native commit uses its supplied scenario rather than Probe state',()=>{
 let firstLabel:string|null=null;function InspectFirstCommit(){useLayoutEffect(()=>{firstLabel=document.querySelector('[data-krds-component="badge"][data-krds-part="label"]')?.textContent??null;},[]);return <FixtureApp componentId="badge" caseId="outcome-01"/>;}
 const scenario=catalogScenario('badge','outcome-01');if(!scenario||!('label'in scenario.initialState))throw new Error('Actual Badge source label required');render(<InspectFirstCommit/>);expect(firstLabel).toBe(scenario.initialState.label);expect(document.querySelector('[data-krds-component="badge"][data-krds-part="label"]')).toHaveTextContent(String(scenario.initialState.label));
});
