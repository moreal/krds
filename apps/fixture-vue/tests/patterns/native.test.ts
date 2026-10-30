import {test,expect} from 'vitest';
import {render,screen} from '@testing-library/vue';
import {nextTick,defineComponent,h,shallowRef} from 'vue';
import {KrdsProvider} from '@unofficial-krds/vue';
import {createPatternState,transition,type PatternAction,type PatternState} from '@unofficial-krds/test-contracts/patterns';
import {mapPresentation,identity} from '../../src/examples/presentation';
import PatternPresentation from '../../../../packages/vue/examples/patterns/PatternPresentation.vue';
import PatternHost from '../../src/examples/PatternHost.vue';
import {actions,assertions,given,query,runSiheom} from '@siheom/vue';

test('supported native siheom renders the actual form and submitting exposes error summary',async()=>{
 history.replaceState(null,'','/examples/form-errors?case=error-summary-focus');
 await runSiheom(given.render(PatternHost),actions.click(query.button('예제 저장')));
 await nextTick();
 expect(document.getElementById('example-form-errors')?.textContent).toContain('입력 내용을 확인하세요');
 expect(document.activeElement?.id).toBe('example-form-title');
 expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
});

test('supported native siheom search retains real loading until bridge settlement',async()=>{
 history.replaceState(null,'','/examples/search-results?case=retry-success');
 await runSiheom(given.render(PatternHost),actions.click(query.button('검색')));
 expect(window.__KRDS_FIXTURE__!.readEvents().filter(event=>event.name==='pattern:request')).toHaveLength(1);
 expect(document.querySelector('[role="progressbar"]')).not.toBeNull();
 await window.__KRDS_FIXTURE__!.setState({__patternCommand:{sequence:1,command:'settle'}});
 expect(screen.getByRole('button',{name:'다시 시도'})).toBeTruthy();
});

test('supported native siheom consent uses its actual modal and optional refusal permits completion',async()=>{
 history.replaceState(null,'','/examples/consent-confirmation?case=optional-refusal-success');
 await runSiheom(given.render(PatternHost),actions.click(query.button('확인하기')));
 await nextTick();await nextTick();expect(document.activeElement?.id).toBe('example-consent-dialog');
 await runSiheom(actions.click(query.button('예제 완료')));
 await window.__KRDS_FIXTURE__!.setState({__patternCommand:{sequence:1,command:'settle'}});
 expect(document.querySelector('[role="dialog"]')).toBeNull();
 expect(document.activeElement?.id).toBe('example-consent-review');
 expect(screen.getByRole('status').textContent).toContain('DEMO-CONSENT-001');
});

test('supported native siheom layout Header action changes the real destination and focus',async()=>{
 history.replaceState(null,'','/examples/service-layout?case=navigate-current');
 await runSiheom(given.render(PatternHost),actions.click(query.button('검색 연습')));
 await nextTick();await nextTick();
 expect(document.getElementById('example-main-heading')?.textContent).toBe('검색 연습');
 expect(document.activeElement?.id).toBe('example-main-heading');
 expect(location.search).toContain('section=search');
});

test('presentation controls produce one semantic callback and native FormData; canceled reset is silent',async()=>{
 const events:unknown[]=[]; const state=shallowRef<PatternState>(createPatternState('form-errors'));
 const dispatch=(action:PatternAction)=>{events.push(action);state.value=transition(state.value,action).state;};
 const App=defineComponent({setup:()=>()=>h(KrdsProvider,{},()=>h(PatternPresentation,{presentation:mapPresentation(state.value,'error-summary-focus'),identity,hrefForPage:()=>'',onField:(field:'title'|'category'|'detail',value:string)=>dispatch({type:'field',field,value}),onReset:()=>dispatch({type:'reset'})}))});
 render(App);const input=screen.getByLabelText('예제 제목 (필수)') as HTMLInputElement;
 input.value='예제 입력폼';input.dispatchEvent(new Event('input',{bubbles:true}));await nextTick();
 expect(events).toEqual([{type:'field',field:'title',value:'예제 입력폼'}]);
 expect(new FormData(input.form!).get('title')).toBe('예제 입력폼');
 input.form!.addEventListener('reset',event=>event.preventDefault(),{once:true});
 screen.getByRole('button',{name:'초기화'}).click();await nextTick();
 expect(events).toHaveLength(1);expect(input.value).toBe('예제 입력폼');
});

test('native route teardown disposes driver bridge and modal portal isolation',async()=>{
 history.replaceState(null,'','/examples/consent-confirmation?case=modal-focus-return');
 const view=render(PatternHost);screen.getByRole('button',{name:'확인하기'}).click();await nextTick();await nextTick();
 expect(screen.getByRole('dialog',{name:'예제 선택 확인'})).toBeTruthy();
 const bridge=window.__KRDS_FIXTURE__!;view.unmount();await nextTick();
 expect(document.querySelector('[role="dialog"]')).toBeNull();expect(document.body.style.overflow).toBe('');
 expect(window.__KRDS_FIXTURE__).toBeUndefined();expect(()=>bridge.recordEvent('late',{})).toThrow('disposed');
});
