import { test, expect, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { defineComponent, h, nextTick, ref } from 'vue';
import { render, screen } from '@testing-library/vue';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/vue';

const fireEvent = {
 change: async (el: Element) => { el.dispatchEvent(new Event('change', {bubbles:true})); await nextTick(); },
 update: async (el: HTMLInputElement, value:string) => { el.value=value; el.dispatchEvent(new Event('input', {bubbles:true})); await nextTick(); },
 keyDown: async (el: Element, init:KeyboardEventInit) => { el.dispatchEvent(new KeyboardEvent('keydown', {bubbles:true,cancelable:true,...init})); await nextTick(); },
 compositionStart: async (el: Element) => { el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true})); await nextTick(); },
 compositionEnd: async (el: Element) => { el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true})); await nextTick(); }
};
const settle = async () => { await nextTick(); await new Promise(resolve => setTimeout(resolve, 10)); };

test('Button uses native submitter, default button, reset and disabled action boundaries', async () => {
  let clicks = 0; let submits = 0; let submitter = '';
  const app = defineComponent({ setup: () => () => h('form', { onSubmit: (event: SubmitEvent) => { event.preventDefault(); submits++; submitter = new FormData(event.target as HTMLFormElement, event.submitter).get('action') as string; } }, [h(Button, { onClick: () => clicks++ }, () => 'Action'), h(Button, { type: 'submit', name: 'action', value: 'save' }, () => 'Submit'), h(Button, { disabled: true, onClick: () => clicks++ }, () => 'Disabled')]) });
  render(app); screen.getByRole('button', { name: 'Action' }).click(); expect(submits).toBe(0); expect(clicks).toBe(1);
  screen.getByRole('button', { name: 'Submit' }).click(); expect(submits).toBe(1); expect(submitter).toBe('save');
  screen.getByRole('button', { name: 'Disabled' }).click(); expect(clicks).toBe(1);
});

test('NativeSelect rejects controlled input, emits once and retains exact uncontrolled reset baseline', async () => {
  const events: unknown[] = []; const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
  const view = render(NativeSelect, { props: { label: 'Region', options, value: 'a', onValueChange: (value: unknown) => events.push(value) } });
  const select = screen.getByRole('combobox') as HTMLSelectElement;
  select.value = 'b'; await fireEvent.change(select); await settle(); expect(select.value).toBe('a'); expect(events).toEqual([{ value: 'b' }]);
  await view.rerender({ value: 'b' }); await settle(); expect(events).toHaveLength(1); expect(select.value).toBe('b');
});

test('Tabs preserve all sequential stops, manual arrows, mounted panels and rejected selection', async () => {
  const events: unknown[] = []; render(Tabs, { props: { label: 'Sections', value: 'a', items: [{value:'a',label:'Alpha'},{value:'disabled',label:'Disabled',disabled:true},{value:'b',label:'Beta'}], onValueChange: (event:unknown)=>events.push(event) }, slots: {a:'Alpha panel', b:'Beta panel'} });
  const alpha=screen.getByRole('tab',{name:'Alpha'}); const beta=screen.getByRole('tab',{name:'Beta'});
  expect(alpha.tabIndex).toBe(0); expect(beta.tabIndex).toBe(0); alpha.focus(); await fireEvent.keyDown(alpha,{key:'ArrowRight'}); expect(document.activeElement).toBe(beta); expect(alpha.getAttribute('aria-selected')).toBe('true'); beta.click(); await settle(); expect(alpha.getAttribute('aria-selected')).toBe('true'); expect(events).toEqual([{value:'b'}]); expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(3);
});

test('Calendar keeps tentative selection separate, six native table rows and all enabled date stops', async () => {
  const events:unknown[]=[];render(Calendar,{props:{referenceDate:'2024-02-15',onValueChange:(e:unknown)=>events.push(e)}});
  expect(document.querySelectorAll('tbody tr')).toHaveLength(6);const date=screen.getByRole('button',{name:'2024년 2월 29일 목요일'});expect(date.tabIndex).toBe(0);date.click();await settle();expect(events).toEqual([]);screen.getByRole('button',{name:'확인'}).click();await settle();expect(events).toEqual([{value:'2024-02-29'}]);
});

test('DateInput retains invalid draft, IME, canonical FormData and zero-event reset', async () => {
  const events:unknown[]=[];render(defineComponent({setup:()=>()=>h('form',[h(DateInput,{label:'Visit',name:'visit',defaultValue:'2024-02-29',onValueChange:(e:unknown)=>events.push(e)}),h('button',{type:'reset'},'Reset')])}));
  const field=screen.getByRole('textbox',{name:'Visit'}) as HTMLInputElement;const form=field.form!;
  await fireEvent.update(field,'2023-02-29');await fireEvent.keyDown(field,{key:'Enter'});expect(field.value).toBe('2023-02-29');expect(field.getAttribute('aria-invalid')).toBe('true');expect(new FormData(form).get('visit')).toBe('2024-02-29');expect(events).toEqual([]);
  await fireEvent.compositionStart(field);await fireEvent.update(field,'이월');await fireEvent.keyDown(field,{key:'Enter',isComposing:true});expect(field.value).toBe('이월');expect(events).toEqual([]);await fireEvent.compositionEnd(field);
  screen.getByRole('button',{name:'Reset'}).click();await settle();expect(field.value).toBe('2024-02-29');expect(events).toEqual([]);
});

test('DateInput controlled rejected commit restores prop and never replays prop changes', async () => {
  const events:unknown[]=[];const view=render(DateInput,{props:{label:'Date',value:'2024-02-29',onValueChange:(e:unknown)=>events.push(e)}});const field=screen.getByRole('textbox') as HTMLInputElement;
  await fireEvent.update(field,'2024-03-01');await fireEvent.keyDown(field,{key:'Enter'});await settle();expect(field.value).toBe('2024-02-29');expect(events).toEqual([{value:'2024-03-01'}]);await view.rerender({value:'2024-04-01'});await settle();expect(field.value).toBe('2024-04-01');expect(events).toHaveLength(1);
});

test('Modal rejected Escape stays isolated; actual close and unmount restore opener and body states', async () => {
  const open=ref(false);const events:unknown[]=[];const app=defineComponent({setup:()=>()=>h('div',[h('button',{onClick:()=>open.value=true},'Open'),h(Modal,{open:open.value,title:'Confirm',onOpenChange:(e:unknown)=>events.push(e)},()=>h('input',{'aria-label':'Inside'}))])});const view=render(app);
  const opener=screen.getByRole('button',{name:'Open'});opener.focus();opener.click();await settle();const dialog=screen.getByRole('dialog');expect(document.activeElement).toBe(dialog);expect(document.body.style.overflow).toBe('hidden');await fireEvent.keyDown(dialog,{key:'Escape'});await settle();expect(screen.getByRole('dialog')).toBeTruthy();expect(events).toEqual([{open:false}]);open.value=false;await settle();expect(document.activeElement).toBe(opener);expect(document.body.style.overflow).toBe('');opener.click();await settle();view.unmount();await settle();expect(document.body.style.overflow).toBe('');expect(events).toHaveLength(1);
});

test('NativeSelect absent selection and canceled reset preserve semantic FormData', async () => {
  const events: unknown[]=[];
  render(defineComponent({setup:()=>()=>h('form',{onReset:(e:Event)=>e.preventDefault()},[h(NativeSelect,{label:'No enabled region',name:'region',options:[{value:'off',label:'Unavailable',disabled:true}],onValueChange:(e:unknown)=>events.push(e)}),h('button',{type:'reset'},'Reset absent')])}));
  const select=screen.getByRole('combobox') as HTMLSelectElement;
  expect(select.selectedIndex).toBe(-1);expect(new FormData(select.form!).has('region')).toBe(false);screen.getByRole('button',{name:'Reset absent'}).click();await settle();expect(select.selectedIndex).toBe(-1);expect(events).toEqual([]);
});

test('automatic Tabs reject once per focus/click gesture and allow future deliberate gestures', async () => {
  const events:unknown[]=[];
  render(Tabs,{props:{label:'Automatic',activationMode:'automatic',value:'a',items:[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}],onValueChange:(e:unknown)=>events.push(e)}});
  const beta=screen.getByRole('tab',{name:'Beta'});
  beta.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true}));beta.focus();beta.click();await settle();expect(events).toEqual([{value:'b'}]);
  beta.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true}));beta.click();await settle();expect(events).toHaveLength(2);expect(screen.getByRole('tab',{name:'Alpha'}).getAttribute('aria-selected')).toBe('true');
});

test('Calendar range, clear, cancel, keyboard bounds and disabled controls remain native', async () => {
  const events:unknown[]=[];const confirmations:unknown[]=[];
  const view=render(Calendar,{props:{mode:'range',referenceDate:'2024-02-15',min:'2024-02-01',max:'2024-02-29',onValueChange:(e:unknown)=>events.push(e),onConfirm:(e:unknown)=>confirmations.push(e)}});
  screen.getByRole('button',{name:'2024년 2월 20일 화요일'}).click();await settle();expect((screen.getByRole('button',{name:'확인'}) as HTMLButtonElement).disabled).toBe(true);
  screen.getByRole('button',{name:'2024년 2월 12일 월요일'}).click();await settle();screen.getByRole('button',{name:'확인'}).click();await settle();expect(events).toEqual([{value:{start:'2024-02-12',end:'2024-02-20'}}]);
  const leap=screen.getByRole('button',{name:'2024년 2월 29일 목요일'});leap.focus();await fireEvent.keyDown(leap,{key:'ArrowRight'});expect(document.activeElement).toBe(leap);expect(events).toHaveLength(1);
  screen.getByRole('button',{name:'지우기'}).click();screen.getByRole('button',{name:'취소'}).click();await settle();expect(events).toHaveLength(1);
  await view.rerender({disabled:true});await settle();expect(Array.from(document.querySelectorAll('[data-krds-component="calendar"][data-krds-part="root"] button')).every(el=>(el as HTMLButtonElement).disabled)).toBe(true);expect(confirmations).toHaveLength(1);
});

test('DateInput range groups, popup cancel/confirm and invalid draft submission preserve committed values', async () => {
  const events:unknown[]=[];let submits=0;
  render(defineComponent({setup:()=>()=>h('form',{onSubmit:(e:Event)=>{e.preventDefault();submits++;}},[h(DateInput,{mode:'range',label:'Visit range',name:'visit',defaultValue:{start:'2024-02-12',end:'2024-02-18'},referenceDate:'2024-02-15',onValueChange:(e:unknown)=>events.push(e)}),h('button',{type:'submit'},'Submit range')])}));
  const start=screen.getByRole('textbox',{name:'시작일'}) as HTMLInputElement;const end=screen.getByRole('textbox',{name:'종료일'}) as HTMLInputElement;
  await fireEvent.update(start,'2024-02-20');end.focus();start.dispatchEvent(new FocusEvent('focusout',{bubbles:true,relatedTarget:end}));await settle();expect(events).toEqual([]);
  screen.getByRole('button',{name:'Visit range 달력 열기'}).click();await settle();expect(screen.getByRole('dialog')).toBeTruthy();screen.getByRole('button',{name:'취소'}).click();await settle();expect(start.value).toBe('2024-02-20');expect(events).toEqual([]);
  screen.getByRole('button',{name:'Submit range'}).click();await settle();expect(submits).toBe(0);expect(new FormData(start.form!).get('visit.start')).toBe('2024-02-12');expect(events).toEqual([]);
  await fireEvent.update(start,'2024-02-12');await fireEvent.keyDown(start,{key:'Enter'});await settle();screen.getByRole('button',{name:'Visit range 달력 열기'}).click();await settle();screen.getByRole('button',{name:'확인'}).click();await settle();expect(screen.queryByRole('dialog')).toBeNull();expect(events).toEqual([]);
});

test('Modal ignores composing/handled Escape, traps focus and guards backdrop drags', async () => {
  const events:unknown[]=[];render(Modal,{props:{defaultOpen:true,title:'Guarded',closeOnOutsideClick:true,onOpenChange:(e:unknown)=>events.push(e)},slots:{default:()=>[h('button',{},'First'),h('button',{},'Last')]}});await settle();
  const dialog=screen.getByRole('dialog');const first=screen.getByRole('button',{name:'First'});const close=screen.getByRole('button',{name:'닫기'});close.focus();await fireEvent.keyDown(close,{key:'Tab'});expect(document.activeElement).toBe(first);
  await fireEvent.keyDown(first,{key:'Tab',shiftKey:true});expect(document.activeElement).toBe(close);
  await fireEvent.keyDown(dialog,{key:'Escape',isComposing:true});expect(events).toEqual([]);
  const handled=new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});handled.preventDefault();dialog.dispatchEvent(handled);expect(events).toEqual([]);
  const backdrop=document.querySelector('[data-krds-component="modal"][data-krds-part="backdrop"]')!;
  dialog.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,isPrimary:true}));backdrop.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0,isPrimary:true}));expect(events).toEqual([]);
  backdrop.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,isPrimary:true}));backdrop.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,button:0,isPrimary:true}));await settle();expect(events).toEqual([{open:false}]);expect(screen.queryByRole('dialog')).toBeNull();
});

test('nested Modal handles only topmost Escape and restores parent isolation and original states', async () => {
  const parent=ref(false),child=ref(false);const events:string[]=[];const originalOverflow=document.body.style.overflow;document.body.style.overflow='clip';
  const preexisting=document.createElement('aside');preexisting.inert=true;document.body.append(preexisting);
  const view=render(defineComponent({setup:()=>()=>h('div',[h('button',{onClick:()=>parent.value=true},'Parent opener'),h(Modal,{open:parent.value,title:'Parent',onOpenChange:(detail:{open:boolean})=>{events.push('parent');parent.value=detail.open;}},()=>[h('button',{onClick:()=>child.value=true},'Child opener'),h(Modal,{open:child.value,title:'Child',onOpenChange:(detail:{open:boolean})=>{events.push('child');child.value=detail.open;}},()=> 'Child content')])])}));
  try {
    screen.getByRole('button',{name:'Parent opener'}).click();await settle();screen.getByRole('button',{name:'Child opener'}).click();await settle();
    const childDialog=screen.getByRole('dialog',{name:'Child'});await fireEvent.keyDown(childDialog,{key:'Escape'});await settle();expect(events).toEqual(['child']);expect(screen.getByRole('dialog',{name:'Parent'})).toBeTruthy();expect(document.body.style.overflow).toBe('hidden');
    await fireEvent.keyDown(screen.getByRole('dialog',{name:'Parent'}),{key:'Escape'});await settle();expect(events).toEqual(['child','parent']);expect(document.body.style.overflow).toBe('clip');expect(preexisting.inert).toBe(true);
    for(let index=0;index<3;index++){screen.getByRole('button',{name:'Parent opener'}).click();await settle();parent.value=false;await settle();}
    expect(events).toHaveLength(2);expect(document.body.style.overflow).toBe('clip');
  } finally {view.unmount();preexisting.remove();document.body.style.overflow=originalOverflow;}
});

test('rich native slots preserve functional accessible names and description relationships', async () => {
  render(NativeSelect,{props:{options:[{value:'a',label:'A'}],invalid:true},slots:{label:()=>h('span',[h('strong','방문'),' 지역']),hint:()=>h('em','지역 안내'),error:()=>h('span','선택 오류')}});
  const select=screen.getByRole('combobox',{name:'방문 지역'});const ids=select.getAttribute('aria-describedby')!.split(' ');expect(ids).toHaveLength(2);expect(ids.map(id=>document.getElementById(id)?.textContent)).toEqual(['지역 안내','선택 오류']);expect(select.getAttribute('aria-invalid')).toBe('true');
});

test('native date rendering respects Gregorian century rules, strict ASCII years and bounds', async () => {
  const events:unknown[]=[];render(DateInput,{props:{label:'Gregorian',withCalendar:false,min:'0001-01-01',max:'9999-12-31',onValueChange:(e:unknown)=>events.push(e)}});const field=screen.getByRole('textbox') as HTMLInputElement;
  for(const value of ['1900-02-29','2024-2-29',' 2024-02-29','2024/02/29']){await fireEvent.update(field,value);await fireEvent.keyDown(field,{key:'Enter'});expect(field.getAttribute('aria-invalid')).toBe('true');}
  expect(events).toEqual([]);
  for(const value of ['0001-01-01','2000-02-29','9999-12-31']){await fireEvent.update(field,value);await fireEvent.keyDown(field,{key:'Enter'});await settle();expect(field.getAttribute('aria-invalid')).toBeNull();expect(field.value).toBe(value);}
  expect(events).toEqual([{value:'0001-01-01'},{value:'2000-02-29'},{value:'9999-12-31'}]);
});

test('Calendar boundary months leave out-of-era cells empty and disable unavailable navigation', async () => {
  const view=render(Calendar,{props:{referenceDate:'0001-01-01',value:null}});expect(document.querySelectorAll('tbody td')).toHaveLength(42);expect(document.querySelectorAll('tbody button')).toHaveLength(41);expect((screen.getByRole('button',{name:'이전 달'}) as HTMLButtonElement).disabled).toBe(true);
  await view.rerender({value:'9999-12-31'});await settle();expect(document.querySelectorAll('tbody td')).toHaveLength(42);expect(document.querySelectorAll('tbody button').length).toBeLessThan(42);expect((screen.getByRole('button',{name:'다음 달'}) as HTMLButtonElement).disabled).toBe(true);
});

test('native configuration rejects competing defaults, malformed enums and invalid date shapes', () => {
  expect(() => render(NativeSelect,{props:{label:'Region',value:'a',defaultValue:'a',options:[{value:'a',label:'A'}]}})).toThrow(TypeError);
  expect(() => render(Tabs,{props:{label:'Tabs',value:'a',defaultValue:'a',items:[{value:'a',label:'A'}]}})).toThrow(TypeError);
  expect(() => render(Modal,{props:{title:'Dialog',open:false,defaultOpen:false}})).toThrow(TypeError);
  expect(() => render(DateInput,{props:{label:'Date',value:'2024-02-29',defaultValue:null}})).toThrow(TypeError);
  expect(() => render(Calendar,{props:{value:'2023-02-29'}})).toThrow(RangeError);
  expect(() => render(DateInput,{props:{label:'Range',mode:'range',value:'2024-02-29'}})).toThrow(TypeError);
});

test('Vue provide/inject locale and direction remain reactive through native modal portals', async () => {
  const locale=ref<'en-US'|'ko-KR'>('en-US');const direction=ref<'ltr'|'rtl'>('rtl');
  render(defineComponent({setup:()=>()=>h(KrdsProvider,{locale:locale.value,direction:direction.value},()=>h(Modal,{title:'Provider dialog',defaultOpen:true},()=>h(Calendar,{label:'Dates',referenceDate:'2024-02-15'})))}));await settle();
  expect(screen.getByRole('button',{name:'Close'})).toBeTruthy();expect(screen.getByRole('heading',{name:'February 2024'})).toBeTruthy();expect(screen.getByRole('dialog').closest('[data-krds-part="root"]')?.getAttribute('dir')).toBe('rtl');
  locale.value='ko-KR';direction.value='ltr';await settle();expect(screen.getByRole('button',{name:'닫기'})).toBeTruthy();expect(screen.getByRole('heading',{name:'2024년 2월'})).toBeTruthy();expect(screen.getByRole('dialog').closest('[data-krds-part="root"]')?.getAttribute('dir')).toBe('ltr');
});

test('fix1 Modal reaches native summary in both Tab directions and activates its disclosure', async () => {
  render(Modal, {
    props: { title: 'Disclosure', defaultOpen: true },
    slots: { default: () => [
      h('div', { hidden: true }, [h('button', {}, 'Hidden action')]),
      h('div', { inert: true }, [h('button', {}, 'Inert action')]),
      h('details', {}, [
        h('summary', { id: 'disclosure-summary' }, 'More information'),
        h('input', { 'aria-label': 'Disclosure note' }),
      ]),
    ] },
  });
  await settle();
  const summary = document.querySelector('summary')!;
  const details = summary.parentElement as HTMLDetailsElement;
  const close = screen.getByRole('button', { name: '닫기' });
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(summary);
  await userEvent.keyboard('{Enter}');
  expect(details.open).toBe(true);
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Disclosure note' }));
  close.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(summary);
  await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
  expect(document.activeElement).toBe(close);
});

test('fix1 Modal accepts its first native summary as the explicit initial focus target', async () => {
  render(Modal, {
    props: { title: 'Initial disclosure', defaultOpen: true, initialFocusId: 'first-summary' },
    slots: { default: () => h('details', {}, [
      h('summary', { id: 'first-summary' }, 'First disclosure'),
      h('button', {}, 'Closed disclosure action'),
    ]) },
  });
  await settle();
  expect(document.activeElement).toBe(document.getElementById('first-summary'));
});

test('fix1 NativeSelect follows current external form for reset and isolates the old owner', async () => {
  const association = ref('select-old');
  const events: unknown[] = [];
  const view = render(defineComponent({ setup: () => () => h('div', [
    h('form', { id: 'select-old' }),
    h('form', { id: 'select-new' }),
    h(NativeSelect, {
      form: association.value,
      label: 'Reassociated region',
      name: 'region',
      defaultValue: 'b',
      options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
      onValueChange: (detail: unknown) => events.push(detail),
    }),
  ]) }));
  const select = screen.getByRole('combobox') as HTMLSelectElement;
  const oldForm = document.getElementById('select-old') as HTMLFormElement;
  const newForm = document.getElementById('select-new') as HTMLFormElement;
  select.value = 'a';
  await fireEvent.change(select);
  association.value = 'select-new';
  await settle();
  expect(select.form).toBe(newForm);
  oldForm.reset();
  await settle();
  expect(select.value).toBe('a');
  expect(new FormData(oldForm).has('region')).toBe(false);
  expect(new FormData(newForm).get('region')).toBe('a');
  newForm.addEventListener('reset', event => event.preventDefault(), { once: true });
  newForm.reset();
  await settle();
  expect(select.value).toBe('a');
  newForm.reset();
  await settle();
  expect(select.value).toBe('b');
  expect(events).toEqual([{ value: 'a' }]);
  view.unmount();
  oldForm.reset();
  newForm.reset();
  await settle();
  expect(events).toEqual([{ value: 'a' }]);
});

test('fix1 DateInput submits a pending draft through its new native form and resets only there', async () => {
  const association = ref('date-old');
  const events: unknown[] = [];
  const submitted: string[] = [];
  const view = render(defineComponent({ setup: () => () => h('div', [
    h('form', { id: 'date-old' }),
    h('form', { id: 'date-new', onSubmit: (event: SubmitEvent) => {
      if (!event.defaultPrevented) submitted.push(String(new FormData(event.currentTarget as HTMLFormElement).get('visit')));
      event.preventDefault();
    } }),
    h(DateInput, {
      form: association.value,
      label: 'Reassociated visit',
      name: 'visit',
      defaultValue: '2024-02-29',
      referenceDate: '2024-02-15',
      onValueChange: (detail: unknown) => events.push(detail),
    }),
  ]) }));
  const field = screen.getByRole('textbox', { name: 'Reassociated visit' }) as HTMLInputElement;
  const oldForm = document.getElementById('date-old') as HTMLFormElement;
  const newForm = document.getElementById('date-new') as HTMLFormElement;
  association.value = 'date-new';
  await settle();
  expect(field.form).toBe(newForm);
  field.focus();
  await fireEvent.update(field, '2024-03-01');
  newForm.requestSubmit();
  await settle();
  expect(submitted).toEqual(['2024-03-01']);
  expect(events).toEqual([{ value: '2024-03-01' }]);
  expect(new FormData(oldForm).has('visit')).toBe(false);
  expect(new FormData(newForm).get('visit')).toBe('2024-03-01');
  await fireEvent.update(field, 'bad draft');
  await fireEvent.keyDown(field, { key: 'Enter' });
  oldForm.reset();
  await settle();
  expect(field.value).toBe('bad draft');
  expect(field.getAttribute('aria-invalid')).toBe('true');
  newForm.addEventListener('reset', event => event.preventDefault(), { once: true });
  newForm.reset();
  await settle();
  expect(field.value).toBe('bad draft');
  screen.getByRole('button', { name: '달력 열기' }).click();
  await settle();
  expect(screen.getByRole('dialog')).toBeTruthy();
  newForm.reset();
  await settle();
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(field.value).toBe('2024-02-29');
  expect(field.getAttribute('aria-invalid')).toBeNull();
  expect(new FormData(newForm).get('visit')).toBe('2024-02-29');
  expect(events).toEqual([{ value: '2024-03-01' }]);
  view.unmount();
  oldForm.reset();
  newForm.reset();
  await settle();
  expect(events).toHaveLength(1);
});

test('fix1 DateInput blocks a rejected pending controlled draft on the new native form', async () => {
  const association = ref('controlled-old');
  const events: unknown[] = [];
  const submitted: boolean[] = [];
  render(defineComponent({ setup: () => () => h('div', [
    h('form', { id: 'controlled-old' }),
    h('form', { id: 'controlled-new', onSubmit: (event: SubmitEvent) => {
      submitted.push(event.defaultPrevented);
      event.preventDefault();
    } }),
    h(DateInput, {
      form: association.value,
      label: 'Controlled reassociation',
      name: 'visit',
      value: '2024-02-29',
      withCalendar: false,
      onValueChange: (detail: unknown) => events.push(detail),
    }),
  ]) }));
  const field = screen.getByRole('textbox') as HTMLInputElement;
  association.value = 'controlled-new';
  await settle();
  field.focus();
  await fireEvent.update(field, '2024-03-01');
  const newForm = document.getElementById('controlled-new') as HTMLFormElement;
  newForm.requestSubmit();
  await settle();
  expect(submitted).toEqual([true]);
  expect(events).toEqual([{ value: '2024-03-01' }]);
  expect(field.value).toBe('2024-02-29');
  expect(new FormData(newForm).get('visit')).toBe('2024-02-29');
});

test('fix1 form-control unmount removes its native reset and submit observers', async () => {
  const form = document.createElement('form');
  form.id = 'cleanup-owner';
  document.body.append(form);
  const added = vi.spyOn(document, 'addEventListener');
  const removed = vi.spyOn(document, 'removeEventListener');
  const events: unknown[] = [];
  try {
    for (let iteration = 0; iteration < 2; iteration++) {
      const view = render(defineComponent({ setup: () => () => h('div', [
        h(NativeSelect, {
          form: form.id, label: 'Cleanup select', name: 'region',
          options: [{ value: 'a', label: 'A' }],
          onValueChange: (detail: unknown) => events.push(detail),
        }),
        h(DateInput, {
          form: form.id, label: 'Cleanup date', name: 'visit', withCalendar: false,
          onValueChange: (detail: unknown) => events.push(detail),
        }),
      ]) }));
      await settle();
      view.unmount();
      await settle();
      form.reset();
    }
    const registrations = added.mock.calls.filter(([name]) => name === 'reset' || name === 'submit');
    expect(registrations.length).toBeGreaterThan(0);
    for (const [name, listener, options] of registrations) {
      expect(removed.mock.calls.some(([removedName, removedListener, removedOptions]) =>
        removedName === name && removedListener === listener && removedOptions === options)).toBe(true);
    }
    expect(events).toEqual([]);
  } finally {
    added.mockRestore();
    removed.mockRestore();
    form.remove();
  }
});
