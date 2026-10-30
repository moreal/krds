import { expect,test } from 'vitest';
import { fireEvent,render } from '@solidjs/testing-library';
import { given,assertions,query,runSiheom } from '@siheom/solid';
import { getPresentation,presentationCases } from '@unofficial-krds/test-contracts/patterns';
import { KrdsProvider } from '@unofficial-krds/solid';
import { PatternPresentation } from '../../src/examples/presentation';
import { PatternFixture } from '../../src/examples/pattern-fixture';

test('supported Solid siheom renders native form composition separately from stories',async()=>{
 await runSiheom(given.render(()=><PatternFixture patternId="form-errors" caseId="error-summary-focus"/>),assertions.visible(query.button('예제 저장')));
});
test.each(presentationCases)('plain presentation $id mounts with no driver bridge or request',item=>{
 const state=getPresentation(item.patternId,item.variant).state;
 const actions:unknown[]=[];
 const view=render(()=><KrdsProvider><PatternPresentation state={state} onAction={action=>actions.push(action)}/></KrdsProvider>);
 expect(view.container.querySelector('main')).not.toBeNull();
 expect(window.__KRDS_FIXTURE__).toBeUndefined();
 expect(actions).toEqual([]);
 expect(state).toEqual(getPresentation(item.patternId,item.variant).state);
});
test('native reset can be canceled; accepted reset invalidates pending submission',async()=>{
 const view=render(()=><PatternFixture patternId="form-errors" caseId="reset-cancels-pending"/>);
 const form=view.container.querySelector('form')!;
 fireEvent.submit(form);
 expect(form).toHaveAttribute('aria-busy','true');
 const cancel=(event:Event)=>event.preventDefault();form.addEventListener('reset',cancel);
 form.reset();await new Promise<void>(resolve=>queueMicrotask(resolve));
 expect(form).toHaveAttribute('aria-busy','true');
 form.removeEventListener('reset',cancel);form.reset();await new Promise<void>(resolve=>queueMicrotask(resolve));
 expect(form).toHaveAttribute('aria-busy','false');
 expect(new FormData(form).get('title')).toBe('');
 await window.__KRDS_FIXTURE__!.setState({__patternCommand:{sequence:1,command:'settle',ok:true}});
 expect(view.queryByText(/DEMO-FORM/)).toBeNull();
});
test('unmount removes an open real Modal portal and fixture bridge',()=>{
 const view=render(()=><PatternFixture patternId="consent-confirmation" caseId="modal-focus-return"/>);
 fireEvent.click(view.getByRole('button',{name:'확인하기'}));
 expect(document.querySelector('[role="dialog"]')).not.toBeNull();
 view.unmount();
 expect(document.querySelector('[role="dialog"]')).toBeNull();
 expect(document.body.style.overflow).not.toBe('hidden');
 expect(window.__KRDS_FIXTURE__).toBeUndefined();
});

test('teardown invalidates pending work and remount starts a fresh local request lifecycle',async()=>{
 const first=render(()=><PatternFixture patternId="form-errors" caseId="reset-cancels-pending"/>);
 fireEvent.submit(first.container.querySelector('form')!);
 const old=window.__KRDS_FIXTURE__!;
 expect(old.readEvents().filter(event=>event.name==='pattern:request')).toHaveLength(1);
 first.unmount();
 await expect(old.setState({__patternCommand:{sequence:1,command:'settle',ok:true}})).rejects.toThrow('disposed');
 const second=render(()=><PatternFixture patternId="form-errors" caseId="error-summary-focus"/>);
 expect(window.__KRDS_FIXTURE__).not.toBe(old);
 expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
 expect(second.getByLabelText('예제 제목 (필수)')).toHaveValue('');
 expect(second.queryByText(/DEMO-FORM/)).toBeNull();
});
