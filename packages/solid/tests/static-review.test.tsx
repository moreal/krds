import { afterEach, expect, test } from 'vitest';
import { createSignal, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import * as K from '../src';

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()));
function mount(view: () => JSX.Element) {
  const host = document.createElement('div');
  document.body.append(host);
  const dispose = render(view, host);
  cleanups.push(() => { dispose(); host.remove(); });
  return { host, dispose };
}

test('BackButton ignores a confirmation completion after native unmount', async () => {
  let finish!: (accepted: boolean) => void;
  const requests: unknown[] = [];
  const { host, dispose } = mount(() => <K.BackButton canGoBack={true} dirty={true} requestConfirmation={() => new Promise<boolean>(resolve => { finish = resolve; })} onBackRequest={detail => requests.push(detail)}/>);
  host.querySelector('button')!.click();
  dispose();
  finish(true);
  await Promise.resolve();
  await Promise.resolve();
  expect(requests).toEqual([]);
});

test('BackButton dirty fallback anchor preserves the draft when confirmation is rejected', async () => {
  let confirmations = 0;
  const { host } = mount(() => <K.BackButton canGoBack={false} fallbackHref="/local/parent" dirty={true} requestConfirmation={() => { confirmations++; return false; }} onBackRequest={() => { throw new Error('Rejected confirmation cannot navigate'); }}/>);
  let preventedByComponent = false;
  const safety = (event: MouseEvent) => { preventedByComponent = event.defaultPrevented; event.preventDefault(); };
  window.addEventListener('click', safety, { once: true });
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  host.querySelector('a')!.dispatchEvent(event);
  window.removeEventListener('click', safety);
  expect(preventedByComponent).toBe(true);
  await Promise.resolve();
  expect(confirmations).toBe(1);
});

test('CriticalAlert urgency remains a named static banner without unsolicited live alerts', () => {
  const { host } = mount(() => <K.CriticalAlert urgency="high" label="긴급 안내" message="정적 서비스 안내입니다."/>);
  expect(host.querySelector('[role="banner"]')?.getAttribute('aria-label')).toBe('긴급 안내');
  expect(host.querySelector('[role="alert"],[aria-live]')).toBeNull();
});

test('Spinner rejects non-finite and out-of-range determinate values', () => {
  for (const value of [NaN, Infinity, -1, 101]) {
    const host = document.createElement('div');
    document.body.append(host);
    cleanups.push(() => host.remove());
    expect(() => render(() => <K.Spinner pending={true} value={value} label="처리 중" completionMessage="완료"/>, host)).toThrow(TypeError);
  }
});

for (const component of ['text-input', 'textarea'] as const) {
  test(`${component} retains actual IME draft when a controlled host value changes`, () => {
    const [value, setValue] = createSignal('committed');
    const [id,setId]=createSignal('ime-original');
    const requests: string[] = [];
    const { host } = mount(() => component === 'text-input'
      ? <K.TextInput id={id()} label="입력" value={value()} onValueChange={detail => requests.push(detail.value)}/>
      : <K.Textarea id={id()} label="입력" value={value()} onValueChange={detail => requests.push(detail.value)}/>);
    const field = host.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')!;
    field.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    field.value = '입력 중';
    field.setSelectionRange(4, 4);
    setValue('external committed revision');
    setId('ime-renamed');
    expect(field.id).toBe('ime-renamed');
    expect(field.value).toBe('입력 중');
    expect(field.selectionStart).toBe(4);
    field.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '입력 중' }));
    expect(requests).toEqual(['입력 중']);
    expect(field.value).toBe('external committed revision');
  });
}

function invalid(view: () => JSX.Element) {
  const host = document.createElement('div');
  document.body.append(host);
  cleanups.push(() => host.remove());
  let dispose: (() => void) | undefined;
  expect(() => { dispose = render(view, host); }).toThrow(TypeError);
  if (dispose) cleanups.push(dispose);
}

test('QuantityToggle rejects nonfinite or misaligned committed values and names each quantity', () => {
  invalid(() => <K.QuantityToggle label="신청 수량" min={0} max={10} step={1} value={0.5}/>);
  invalid(() => <K.QuantityToggle label="신청 수량" min={0} max={10} step={NaN}/>);
  const { host } = mount(() => <K.QuantityToggle label="참석 인원" min={0} max={10} step={1}/>);
  for (const control of host.querySelectorAll('button')) expect(control.getAttribute('aria-label')).toContain('참석 인원');
});

test('RangeSlider rejects invalid finite bounds, step and contradictory committed values', () => {
  invalid(() => <K.RangeSlider label="비율" min={NaN} max={100}/>);
  invalid(() => <K.RangeSlider label="비율" min={0} max={100} step={Infinity}/>);
  invalid(() => <K.RangeSlider label="비율" min={0} max={100} value={150}/>);
});

test('StructuredList reset keeps controlled native selection and cancellation emits no request', async () => {
  let changes = 0;
  const { host } = mount(() => <form><K.StructuredList items={[{id:'one',title:'하나',metadata:[]}]} selection={{ids:['one'],onChange:()=>changes++}}/></form>);
  const form = host.querySelector('form')!;
  const field = host.querySelector('input')!;
  expect(field.checked).toBe(true);
  form.reset();
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(field.checked).toBe(true);
  expect(changes).toBe(0);
});

test('TextInput reset follows its current live native form owner after reassociation', async () => {
  const { host } = mount(() => <><form id="review-form-one"><K.TextInput label="이름" defaultValue="기준"/></form><form id="review-form-two"/></>);
  const field = host.querySelector('input')!;
  field.setAttribute('form','review-form-two');
  field.value='변경';field.dispatchEvent(new InputEvent('input',{bubbles:true}));
  host.querySelector<HTMLFormElement>('#review-form-one')!.reset();
  await new Promise(resolve=>setTimeout(resolve,10));
  expect(field.value).toBe('변경');
  const currentForm=host.querySelector<HTMLFormElement>('#review-form-two')!;
  currentForm.addEventListener('reset',event=>event.preventDefault(),{once:true});currentForm.reset();
  await new Promise(resolve=>setTimeout(resolve,10));expect(field.value).toBe('변경');
  currentForm.reset();
  await new Promise(resolve=>setTimeout(resolve,10));
  expect(field.value).toBe('기준');
});

test('Accepted appearance properties produce native presentation and functional names', () => {
  const { host }=mount(()=><><K.TTS label="본문 읽기" iconOnly={true} summary="내용" locale="ko-KR" state="idle" onRequest={()=>{}}/><K.TextInput label="완료 입력" status="success" size="large"/><K.Checkbox label="칩" appearance="chip"/><K.Link label="안내" href="/local/help" underline={false}/><K.Badge label="1234" numeric={true}/></>);
  expect(host.querySelector('[data-krds-component="tts"][data-krds-part="play"]')?.getAttribute('aria-label')).toBe('본문 읽기 재생');
  expect(host.querySelector('[data-krds-component="tts"][data-krds-part="play"]')?.textContent).not.toContain('음성 안내 재생');
  expect(host.querySelector('[data-krds-component="text-input"][data-krds-part="root"]')?.getAttribute('data-krds-status')).toBe('success');
  expect(host.querySelector('[data-krds-component="text-input"][data-krds-part="root"]')?.getAttribute('data-krds-size')).toBe('large');
  expect(host.querySelector('[data-krds-component="checkbox"][data-krds-part="root"]')?.getAttribute('data-krds-appearance')).toBe('chip');
  expect(host.querySelector('[data-krds-component="link"][data-krds-part="root"]')?.getAttribute('style')).toContain('text-decoration: none');
  expect(host.querySelector('[data-krds-component="badge"][data-krds-part="root"]')?.getAttribute('data-krds-state')).toContain('numeric');
});

test('Footer preserves target and rel and discloses every configured new-window destination', () => {
  const link={label:'정책',href:'/local/policy',target:'_blank',rel:'external'};
  const {host}=mount(()=><K.Footer serviceLogo={{src:'/local-assets/service-logo.svg',alt:'예제'}} contacts={[]} utilityLinks={[link]} privacyPolicy={{...link,label:'개인정보'}} policyLinks={[{...link,label:'이용약관'}]} copyrightText="예제"/>);
  const anchors=host.querySelectorAll('a');
  expect(anchors).toHaveLength(3);
  for(const anchor of anchors){expect(anchor.target).toBe('_blank');expect(anchor.rel).toContain('noopener');expect(anchor.rel).toContain('external');expect(anchor.textContent).toContain('새 창');}
});

test('SkipLink renders a real list and rejects more than three configured links',()=>{
  const {host}=mount(()=><K.SkipLink links={[{id:'one',label:'본문',targetId:'main'}]}/>);
  expect(host.querySelectorAll('nav > ul > li > a')).toHaveLength(1);
  invalid(()=><K.SkipLink links={Array.from({length:4},(_,index)=>({id:String(index),label:String(index),targetId:`target-${index}`}))}/>);
});

test('TextList, StepIndicator and Breadcrumb reject unsupported public configurations',()=>{
  invalid(()=><K.TextList items={[{id:'one',content:'1',children:[{id:'two',content:'2',children:[{id:'three',content:'3',children:[{id:'four',content:'4'}]}]}]}]}/>);
  invalid(()=><K.StepIndicator steps={[{id:'only',label:'한 단계',status:'current'}]}/>);
  invalid(()=><K.Breadcrumb home={{label:'홈',href:'/local/home'}} items={[]} omitCurrent={false}/>);
});


test('Table names and focuses only actual overflow and provides a real simple scroll action',async()=>{
 const {host}=mount(()=><K.Table caption="검토 내역" columns={[{id:'reference',label:'참조 번호',kind:'text'},{id:'department',label:'담당 기관',kind:'text'}]} rows={[{id:'one',cells:{reference:'REFERENCE_NUMBER_1234567890123456789012345678901234567890',department:'DEPARTMENT_123456789012345678901234567890'}}]}/>);
 const region=host.querySelector<HTMLElement>('[data-krds-part="scroll-region"]')!;
 region.style.width='200px';region.style.overflow='auto';
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
 expect(region.tabIndex).toBe(0);expect(region.getAttribute('role')).toBe('region');
 const next=host.querySelector<HTMLButtonElement>('[data-krds-part="scroll-next"]')!;expect(next).not.toBeNull();next.click();expect(region.scrollLeft).toBeGreaterThan(0);
 region.style.width='10000px';await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 expect(region.getAttribute('tabindex')).toBeNull();expect(region.getAttribute('role')).toBeNull();
});
