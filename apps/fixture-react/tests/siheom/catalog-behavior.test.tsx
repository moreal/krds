import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import {expect,test,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
afterEach(cleanup);
import * as K from '@unofficial-krds/react';

test('Disclosure controlled rejection keeps real content hidden and emits one request',async()=>{
 const request=vi.fn();render(<K.Disclosure label="추가 안내" contentId="additional" open={false} onOpenChange={request}><a href="#result">상세 안내</a></K.Disclosure>);
 await userEvent.click(screen.getByRole('button',{name:'추가 안내'}));
 expect(request.mock.calls).toEqual([[{open:true}]]);expect(screen.queryByRole('link',{name:'상세 안내'})).toBeNull();
});
test('Accordion preserves a child input when collapsed and opens independent sections',async()=>{
 render(<K.Accordion items={[{id:'a',title:'첫 안내',content:'A'},{id:'b',title:'둘째 안내',content:'B'}]} content={{a:<input aria-label="보존 입력" defaultValue="처음"/>}}/>);
 await userEvent.click(screen.getByRole('button',{name:'첫 안내'}));await userEvent.type(screen.getByRole('textbox',{name:'보존 입력'}),' 추가');await userEvent.click(screen.getByRole('button',{name:'둘째 안내'}));await userEvent.click(screen.getByRole('button',{name:'첫 안내'}));await userEvent.click(screen.getByRole('button',{name:'첫 안내'}));expect(screen.getByRole('textbox',{name:'보존 입력'})).toHaveValue('처음 추가');
});
test('Uncontrolled radio null and empty-string selection retain native FormData/reset',async()=>{
 const request=vi.fn();render(<form aria-label="입력 양식"><K.RadioGroup label="지역" name="region" required options={[{value:'',label:'빈 문자열 선택'},{value:'b',label:'부산'}]} onValueChange={request}/><button type="reset">초기화</button></form>);
 const form=screen.getByRole('form',{name:'입력 양식'}) as HTMLFormElement;expect(new FormData(form).getAll('region')).toEqual([]);await userEvent.click(screen.getByLabelText('빈 문자열 선택'));expect(new FormData(form).getAll('region')).toEqual(['']);await userEvent.click(screen.getByText('초기화'));await waitFor(()=>expect(new FormData(form).getAll('region')).toEqual([]));expect(request).toHaveBeenCalledExactlyOnceWith({value:''});
});
test('TextInput read-only and disabled participation and canceled reset use real form',async()=>{
 const change=vi.fn();render(<form aria-label="신청 양식"><K.TextInput label="이름" name="name" defaultValue="가나다" onValueChange={change}/><K.TextInput label="읽기" name="readonly" defaultValue="값" readOnly/><K.TextInput label="사용 불가" name="disabled" defaultValue="제외" disabled/><button type="reset">초기화</button></form>);
 const form=screen.getByRole('form',{name:'신청 양식'}) as HTMLFormElement;expect([...new FormData(form).keys()]).toEqual(['name','readonly']);await userEvent.clear(screen.getByLabelText('이름'));await userEvent.type(screen.getByLabelText('이름'),'변경');const before=change.mock.calls.length;form.addEventListener('reset',e=>e.preventDefault(),{once:true});await userEvent.click(screen.getByText('초기화'));expect(screen.getByLabelText('이름')).toHaveValue('변경');await userEvent.click(screen.getByText('초기화'));await waitFor(()=>expect(screen.getByLabelText('이름')).toHaveValue('가나다'));expect(change).toHaveBeenCalledTimes(before);
});
test('Range controlled rejection reconciles output and submitted value with one input request',()=>{
 const change=vi.fn();render(<form aria-label="비율 양식"><K.RangeSlider label="비율" name="ratio" min={0} max={1} step={0.1} value={0.2} onValueChange={change}/></form>);const input=screen.getByRole('slider',{name:'비율'});fireEvent.input(input,{target:{value:'0.3'}});expect(input).toHaveValue('0.2');expect(new FormData(screen.getByRole('form',{name:'비율 양식'}) as HTMLFormElement).get('ratio')).toBe('0.2');expect(change.mock.calls).toEqual([[{value:0.3}]]);
});
test('Quantity boundary remains focused while blocked action emits nothing',async()=>{
 const request=vi.fn();render(<K.QuantityToggle label="수량" defaultValue={0} min={0} max={10} onValueChange={request}/>);const minus=screen.getByRole('button',{name:'수량 줄이기'});await userEvent.click(minus);expect(minus).toHaveFocus();expect(minus).toHaveAttribute('aria-disabled','true');expect(request).not.toHaveBeenCalled();
});
test('FileUpload passes real native Files and clears only ephemeral chooser',async()=>{
 const changed=vi.fn();const file=new File(['A'],'local.txt',{type:'text/plain'});render(<K.FileUpload files={[]} name="documents" label="첨부" accept=".txt" onFilesChange={changed}/>);const input=screen.getByLabelText('첨부',{selector:'input'}) as HTMLInputElement;await userEvent.upload(input,file);expect(input.value).toBe('');expect(changed.mock.calls[0][0].value[0].file).toBe(file);expect(changed.mock.calls[0][0].reason).toBe('picker');expect(changed).toHaveBeenCalledTimes(1);
});
test('Tooltip hover never steals focus and accepted Escape suppresses induced trigger focus',async()=>{
 render(<><button>다음 작업</button><K.Tooltip text="추가 정보" triggerLabel="안내" triggerId="test-trigger" textId="test-tooltip"/></>);await userEvent.click(screen.getByText('다음 작업'));await userEvent.hover(screen.getByRole('button',{name:'안내'}));expect(screen.getByText('다음 작업')).toHaveFocus();await userEvent.keyboard('{Escape}');await waitFor(()=>expect(screen.getByRole('button',{name:'안내'})).toHaveFocus());expect(document.getElementById('test-tooltip')).toHaveAttribute('data-krds-state',expect.stringContaining('suppressed'));
});
test('Native table retains caption and column/row header relationships',()=>{
 render(<K.Table caption="신청 내역" columns={[{id:'name',label:'이름',kind:'text'},{id:'count',label:'수량',kind:'number'}]} rowHeaderColumnId="name" rows={[{id:'a',cells:{name:'가',count:2}}]}/>);const table=screen.getByRole('table',{name:'신청 내역'});expect(table.querySelector('th[scope="row"]')).toHaveTextContent('가');const cell=screen.getByRole('cell',{name:'2'});expect(cell.getAttribute('headers')?.split(' ')).toHaveLength(2);
});

test('Controlled radio clearing and accepted reset never reinstate prior checked bits',async()=>{
 const props={label:'선택',name:'choice',options:[{value:'a',label:'가'},{value:'b',label:'나'}],required:true};
 const view=render(<form aria-label="제어 양식"><K.RadioGroup {...props} value="a"/><button type="reset">리셋</button></form>);
 view.rerender(<form aria-label="제어 양식"><K.RadioGroup {...props} value={null}/><button type="reset">리셋</button></form>);
 const form=screen.getByRole('form',{name:'제어 양식'}) as HTMLFormElement;
 expect(new FormData(form).getAll('choice')).toEqual([]);
 await userEvent.click(screen.getByText('리셋'));
 await waitFor(()=>expect(new FormData(form).getAll('choice')).toEqual([]));
 for(const radio of screen.getAllByRole('radio'))expect(radio).not.toBeChecked();
});

test('React delegated canceled reset preserves uncontrolled checked and mixed bits',async()=>{
 render(<form onReset={event=>event.preventDefault()}><K.Checkbox label="보존 동의" defaultChecked={false}/><button type="reset">취소되는 리셋</button></form>);
 const input=screen.getByRole('checkbox',{name:'보존 동의'});await userEvent.click(input);expect(input).toBeChecked();await userEvent.click(screen.getByText('취소되는 리셋'));await new Promise(resolve=>setTimeout(resolve,20));expect(input).toBeChecked();
});

test('BackButton ignores an asynchronous confirmation after native unmount',async()=>{
 let finish:(value:boolean)=>void=()=>{};const request=vi.fn();
 const view=render(<K.BackButton canGoBack dirty requestConfirmation={()=>new Promise<boolean>(resolve=>{finish=resolve;})} onBackRequest={request}/>);
 await userEvent.click(screen.getByRole('button',{name:'뒤로가기'}));view.unmount();finish(true);await Promise.resolve();expect(request).not.toHaveBeenCalled();
});
test('TextInput and Textarea keep active composition buffers through parent prop updates',()=>{
 const inputView=render(<K.TextInput label="조합 입력" value="기존"/>);const input=screen.getByRole('textbox',{name:'조합 입력'});fireEvent.compositionStart(input);inputView.rerender(<K.TextInput label="조합 입력" value="외부 변경"/>);expect(input).toHaveValue('기존');fireEvent.compositionEnd(input);expect(input).toHaveValue('외부 변경');
 const areaView=render(<K.Textarea label="조합 설명" value="기존"/>);const area=screen.getByRole('textbox',{name:'조합 설명'});fireEvent.compositionStart(area);areaView.rerender(<K.Textarea label="조합 설명" value="외부 변경"/>);expect(area).toHaveValue('기존');fireEvent.compositionEnd(area);expect(area).toHaveValue('외부 변경');
});
test('Link underline false changes actual decoration for a navigation context',()=>{
 render(<K.Link href="/local/parent" label="상위 페이지" underline={false}/>);expect(getComputedStyle(screen.getByRole('link',{name:'상위 페이지'})).textDecorationLine).not.toContain('underline');
});

test('SideNavigation expansion control includes its visible action in the accessible name',async()=>{
 render(<K.SideNavigation items={[{id:'help',label:'도움말',children:[{id:'topic',label:'안내',href:'/local/help'}]}]}/>);
 await userEvent.click(screen.getByRole('button',{name:'도움말 펼치기'}));expect(screen.getByRole('button',{name:'도움말 접기'})).toHaveAttribute('aria-expanded','true');
});

test('Table only exposes a named tabbable scroll region when content actually overflows',async()=>{
 render(<K.Table layout="narrow-scroll" caption="짧은 내역" columns={[{id:'name',label:'이름',kind:'text'}]} rows={[{id:'a',cells:{name:'가'}}]}/>);
 await waitFor(()=>expect(document.querySelector('[data-krds-component="table"][data-krds-part="scroll-region"]')).not.toHaveAttribute('tabindex'));expect(screen.queryByRole('button',{name:'오른쪽 보기'})).toBeNull();
});

test('StepIndicator renders a fully completed process without inventing a current step',()=>{
 render(<K.StepIndicator steps={[{id:'done',label:'신청 완료',status:'complete'}]}/>);expect(screen.getByRole('list')).toHaveTextContent('신청 완료');expect(document.querySelector('[aria-current="step"]')).toBeNull();
});

test('RadioGroup forwards explicit public option control IDs to native labels',()=>{
 render(<K.RadioGroup label="필수 동의" options={[{id:'required-agree-control',value:'yes',label:'동의'}]}/>);expect(screen.getByRole('radio',{name:'동의'})).toHaveAttribute('id','required-agree-control');
});
test('Header default navigation forwards public current identity and navigation label',()=>{
 render(<K.Header home={{href:'/local/home',label:'홈',logo:{src:'/local-assets/service-logo.svg',alt:'예제'}}} utilityItems={[]} mainNavigation={[{id:'here',label:'현재 화면',href:'/local/current'}]} currentId="here" navigationLabel="주요 메뉴"/>);expect(screen.getByRole('navigation',{name:'주요 메뉴'}).querySelector('[aria-current="page"]')).toHaveTextContent('현재 화면');
});

test('Snackbar renders its configured information icon as a decorative native graphic',()=>{
 render(<K.Snackbar message={{id:'message',title:'저장 완료',text:'예제 신청 저장',icon:'information'}} onDismiss={()=>{}}/>);expect(document.querySelector('[data-krds-component="snackbar"][data-krds-part="icon"] svg')).not.toBeNull();expect(screen.getByRole('status')).toHaveTextContent('저장 완료');
});

test('ContextualHelp end placement aligns the native popover with its actual trigger edge',async()=>{
 render(<div style={{marginLeft:400}}><K.ContextualHelp title="정렬 도움말" content="충분한 너비의 안내 설명입니다." triggerLabel="정렬 안내" defaultOpen placement="bottom-end"/></div>);
 await waitFor(()=>{const trigger=screen.getByRole('button',{name:'정렬 안내'}).getBoundingClientRect(),popup=screen.getByRole('region',{name:'정렬 도움말'}).getBoundingClientRect();expect(Math.abs(trigger.right-popup.right)).toBeLessThan(2);});
});

test('RadioGroup uses one visible native circle with its label in the same row',()=>{
 render(<K.RadioGroup label="신청 동의" options={[{value:'agree',label:'동의합니다'}]}/>);const control=screen.getByRole('radio',{name:'동의합니다'}),label=screen.getByText('동의합니다');const box=control.getBoundingClientRect(),text=label.getBoundingClientRect();expect(Math.abs(box.top-text.top)).toBeLessThan(8);expect(text.left).toBeGreaterThanOrEqual(box.right);expect(document.querySelector('[data-krds-component="radio-group"][data-krds-part="indicator"]')).not.toBeVisible();
});
