# T06 dates exact uncommitted scoped changes

Baseline reviewed T05 foundation. Sharedintegration/providers/publicbarrel/fixture and othercomponents are distinctowners; fullT06acceptance later.

## packages/solid/src/components/date-input/index.tsx

```diff
--- base/packages/solid/src/components/date-input/index.tsx
+++ packages/solid/src/components/date-input/index.tsx
@@ -0,0 +1,180 @@
+import { Show, createEffect, createMemo, createSignal, createUniqueId, on, onCleanup, untrack } from 'solid-js';
+import type { JSX } from 'solid-js';
+import { parseIsoDate } from '@krds-native/contracts';
+import { useKrdsEnvironment } from '../../providers';
+import { Calendar } from '../calendar';
+import type { CalendarProps, CalendarTranslations } from '../calendar';
+import { copyValue, dateConfig, emptyValue, endpoints, interpolate, nonemptyDictionary, notifyValue, sameValue, validateValue } from '../calendar/model';
+import type { DateModeProps, DateValue } from '../calendar/model';
+
+export interface DateInputTranslations {
+  startLabel:string; endLabel:string; formatHint:string; openCalendar:string; calendarTitle:string;
+  requiredError:string; formatError:string; incompleteRangeError:string; orderError:string; minError:string; maxError:string;
+}
+const dictionaries: Record<'ko-KR'|'en-US',DateInputTranslations> = {
+  'ko-KR': { startLabel:'시작일', endLabel:'종료일', formatHint:'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar:'달력 열기', calendarTitle:'날짜 선택', requiredError:'날짜를 입력하세요', formatError:'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError:'시작일과 종료일을 모두 입력하세요', orderError:'종료일은 시작일보다 빠를 수 없습니다', minError:'{min} 이후 날짜를 입력하세요 (당일 포함)', maxError:'{max} 이전 날짜를 입력하세요 (당일 포함)' },
+  'en-US': { startLabel:'Start date', endLabel:'End date', formatHint:'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar:'Open calendar', calendarTitle:'Choose date', requiredError:'Enter a date', formatError:'Enter a valid date in YYYY-MM-DD format', incompleteRangeError:'Enter both start and end dates', orderError:'End date must not precede start date', minError:'Enter a date on or after {min}', maxError:'Enter a date on or before {max}' },
+};
+interface DateInputBaseProps {
+  id?:string; name?:string; form?:string; returnFocusId?:string; autocomplete?:JSX.InputHTMLAttributes<HTMLInputElement>['autocomplete'];
+  label:JSX.Element; hint?:JSX.Element; error?:JSX.Element; errorMessage?:JSX.Element; invalid?:boolean;
+  required?:boolean; disabled?:boolean; min?:string; max?:string; locale?:'ko-KR'|'en-US';
+  translations?:Partial<DateInputTranslations>; calendarTranslations?:Partial<CalendarTranslations>;
+  withCalendar?:boolean; referenceDate?:string; today?:string; class?:string; style?:JSX.CSSProperties|string;
+}
+export type DateInputProps = DateInputBaseProps & DateModeProps;
+interface Validation { message:string; fields:readonly number[]; value?:DateValue }
+
+/** Text drafts are separate from strict, canonical date-only form values. */
+export function DateInput(props: DateInputProps): JSX.Element {
+  const environment = useKrdsEnvironment();
+  const range = props.mode === 'range', controlled = props.value !== undefined;
+  if (props.mode !== undefined && props.mode !== 'single' && props.mode !== 'range') throw new TypeError('Invalid date mode.');
+  if (controlled && props.defaultValue !== undefined) throw new TypeError('value and defaultValue are mutually exclusive.');
+  if (props.label === undefined || props.label === null || props.label === '') throw new TypeError('DateInput requires a task label.');
+  const config = createMemo(() => dateConfig(props));
+  const initial = copyValue(validateValue(props.value !== undefined ? props.value : props.defaultValue ?? emptyValue(range),range,config().min,config().max));
+  const [internal,setInternal] = createSignal<DateValue>(copyValue(initial));
+  const committed = createMemo(() => {
+    if ((props.mode === 'range') !== range || (props.value !== undefined) !== controlled) throw new TypeError('Date mode and control mode are immutable.');
+    return validateValue(controlled ? props.value! : internal(),range,config().min,config().max);
+  });
+  const textFor = (value:DateValue): [string,string] => { const [start,end]=endpoints(value); return [start ?? '',end ?? '']; };
+  const [draft,setDraft] = createSignal<[string,string]>(textFor(initial));
+  const [error,setError] = createSignal<Validation|null>(null);
+  const [composing,setComposing] = createSignal(false);
+  const [open,setOpen] = createSignal(false);
+  const translations = createMemo(() => {
+    const locale=props.locale ?? environment.locale();
+    if (!(locale in dictionaries)) throw new TypeError('Unsupported locale.');
+    return nonemptyDictionary(dictionaries[locale],props.translations);
+  });
+  const id=props.id ?? createUniqueId();
+  let root!:HTMLElement, first!:HTMLInputElement, second:HTMLInputElement|undefined, trigger:HTMLButtonElement|undefined, dialog:HTMLDialogElement|undefined;
+  const fields = () => [first,second].filter((input):input is HTMLInputElement => !!input);
+  const externalError = () => props.error ?? props.errorMessage;
+  const invalid = () => !!error() || !!props.invalid || !!externalError();
+  const fieldInvalid = (index:number) => !!props.invalid || !!externalError() || !!error()?.fields.includes(index);
+  function validate():Validation {
+    const [start,end]=draft(), t=translations();
+    const failure=(message:string,indices:readonly number[]):Validation => ({message,fields:indices});
+    // Format failures take precedence over incomplete/bounds/order failures.
+    if (start && !parseIsoDate(start)) return failure(t.formatError,[0]);
+    if (range && end && !parseIsoDate(end)) return failure(t.formatError,[1]);
+    if (!start && (!range || !end)) return props.required ? failure(t.requiredError,range ? [0,1] : [0]) : {message:'',fields:[],value:emptyValue(range)};
+    if (range && (!start || !end)) return failure(t.incompleteRangeError,!start ? [0] : [1]);
+    if (start < config().min) return failure(interpolate(t.minError,{min:config().min}),[0]);
+    if (start > config().max) return failure(interpolate(t.maxError,{max:config().max}),[0]);
+    if (range && end < config().min) return failure(interpolate(t.minError,{min:config().min}),[1]);
+    if (range && end > config().max) return failure(interpolate(t.maxError,{max:config().max}),[1]);
+    if (range && start > end) return failure(t.orderError,[0,1]);
+    return {message:'',fields:[],value:range ? {start,end} : start};
+  }
+  function mirrorValidity(validation=validate()) {
+    fields().forEach((input,index) => input.setCustomValidity(!props.disabled && validation.fields.includes(index) ? validation.message : ''));
+  }
+  function replaceDraft(value:DateValue) {
+    setDraft(textFor(value)); setError(null); mirrorValidity();
+    // Always restore DOM too: a controlled parent may reject a same-prop request.
+    fields().forEach((input,index) => { input.value=textFor(value)[index]; });
+  }
+  createEffect(on(committed,value => replaceDraft(value),{defer:true}));
+  createEffect(() => { props.disabled; translations(); config(); draft(); props.required; if (!untrack(composing)) mirrorValidity(); });
+  function commitValue(value:DateValue):boolean {
+    if (!sameValue(value,committed())) {
+      if (!controlled) setInternal(copyValue(value));
+      notifyValue(props,value);
+    }
+    const accepted=sameValue(value,committed());
+    replaceDraft(committed());
+    return accepted;
+  }
+  function commit():boolean {
+    if (props.disabled || composing()) return false;
+    const result=validate(); mirrorValidity(result);
+    if (result.message) { setError(result); return false; }
+    return commitValue(result.value!);
+  }
+  function updateDraft(index:number,event:InputEvent & {currentTarget:HTMLInputElement}) {
+    if (props.disabled) return;
+    const next:[string,string]=[...draft()]; next[index]=event.currentTarget.value; setDraft(next);
+    if (!composing() && !event.isComposing) mirrorValidity();
+  }
+  function keydown(event:KeyboardEvent) {
+    if (props.disabled || composing() || event.isComposing || event.keyCode === 229) return;
+    if (event.key === 'Enter') { event.preventDefault(); commit(); }
+  }
+  function restoreFocus() {
+    const doc=environment.getDocument();
+    const usable=(element:HTMLElement|null|undefined):element is HTMLElement => !!element?.isConnected && !element.closest('[inert],[hidden]') && !element.matches(':disabled') && element.getClientRects().length>0;
+    const fallback=props.returnFocusId ? doc?.getElementById(props.returnFocusId) : undefined;
+    const target=usable(trigger) ? trigger : usable(fallback) ? fallback : undefined;
+    if (target) { target.focus({preventScroll:true}); return; }
+    if (doc) { const tabindex=doc.body.getAttribute('tabindex'); doc.body.tabIndex=-1; doc.body.focus({preventScroll:true}); if (tabindex===null) doc.body.removeAttribute('tabindex'); else doc.body.setAttribute('tabindex',tabindex); }
+  }
+  function closePopup() {
+    if (!open()) return;
+    dialog?.close(); setOpen(false); queueMicrotask(restoreFocus);
+  }
+  function openPopup() {
+    if (props.disabled || composing() || open()) return;
+    setOpen(true);
+    queueMicrotask(() => {
+      if (!dialog || !open()) return;
+      dialog.showModal();
+      const selected=dialog.querySelector<HTMLButtonElement>('[data-krds-part="day"][aria-pressed="true"]:not(:disabled)');
+      const current=dialog.querySelector<HTMLButtonElement>('[data-krds-part="day"]:not([data-krds-state~="outside-month"]):not(:disabled)');
+      const navigation=dialog.querySelector<HTMLButtonElement>('[data-krds-part="previous"]:not(:disabled),[data-krds-part="next"]:not(:disabled)');
+      (selected ?? current ?? navigation ?? dialog).focus();
+    });
+  }
+  createEffect(() => { if (props.disabled && open()) closePopup(); });
+  // Listen on the associated form, including the native external `form` relationship.
+  createEffect(() => {
+    props.form;
+    const form=first?.form;
+    if (!form) return;
+    const reset=(event:Event) => queueMicrotask(() => {
+      if (event.defaultPrevented) return;
+      if (!controlled) setInternal(copyValue(initial));
+      replaceDraft(committed()); closePopup();
+    });
+    const submit=(event:SubmitEvent) => {
+      if (!props.disabled && !commit()) { event.preventDefault(); const index=error()?.fields[0] ?? 0; fields()[index]?.focus(); }
+    };
+    form.addEventListener('reset',reset); form.addEventListener('submit',submit);
+    onCleanup(() => { form.removeEventListener('reset',reset); form.removeEventListener('submit',submit); });
+  });
+  onCleanup(() => { if (open()) { dialog?.close(); queueMicrotask(restoreFocus); } });
+  const attr=(part:string,state='') => ({'data-krds-component':'date-input','data-krds-part':part,'data-krds-state':state});
+  const fieldState=(index:number) => [props.disabled && 'disabled',fieldInvalid(index) && 'invalid'].filter(Boolean).join(' ');
+  const describedBy=() => [`${id}-hint`,invalid() ? `${id}-error` : ''].filter(Boolean).join(' ');
+  const input=(index:number) => <input ref={element => { if (index===0) first=element; else second=element; }} id={index===0 ? id : `${id}-end`} type="text" inputmode="numeric" autocomplete={props.autocomplete} placeholder="YYYY-MM-DD" form={props.form} required={props.required} disabled={props.disabled} value={draft()[index]} aria-describedby={describedBy()} aria-invalid={fieldInvalid(index) ? 'true' : undefined} {...attr(range ? index===0 ? 'start-input' : 'end-input' : 'control',fieldState(index))} onInput={event => updateDraft(index,event)} onKeyDown={keydown} onCompositionStart={() => setComposing(true)} onCompositionEnd={event => { const next:[string,string]=[...draft()]; next[index]=event.currentTarget.value; setDraft(next); setComposing(false); }} onInvalid={() => { if (!composing()) setError(validate()); }} />;
+  const popup=() => <Show when={open()}><dialog ref={dialog} id={`${id}-popup`} aria-modal="true" aria-labelledby={`${id}-popup-title`} tabIndex={-1} {...attr('popup','open')} onCancel={event => { const handled=event.defaultPrevented; event.preventDefault(); if (!handled && !composing()) closePopup(); }} onKeyDown={event => {
+      // The native popup owns these keys; an ancestor Modal must not process them.
+      if (event.key==='Tab') { event.stopPropagation(); return; }
+      if (event.key!=='Escape') return;
+      event.stopPropagation();
+      if (event.defaultPrevented) return;
+      event.preventDefault();
+      if (!composing() && !event.isComposing && event.keyCode!==229) closePopup();
+    }} onClose={() => { if (open()) { setOpen(false); queueMicrotask(restoreFocus); } }}>
+    <h2 id={`${id}-popup-title`}>{translations().calendarTitle}</h2>
+    <Calendar {...({ mode:range ? 'range':'single', value:committed(), label:translations().calendarTitle, min:props.min, max:props.max, disabled:props.disabled, required:props.required, locale:props.locale, referenceDate:props.referenceDate, today:props.today, translations:{startLabel:translations().startLabel,endLabel:translations().endLabel,...props.calendarTranslations}, onConfirm:({value}:{value:DateValue}) => { commitValue(value); closePopup(); }, onCancel:closePopup } as CalendarProps)} />
+    <button type="button" onClick={closePopup}>{(props.locale ?? environment.locale())==='ko-KR' ? '닫기':'Close'}</button>
+  </dialog></Show>;
+  const contents=() => <>
+    <Show when={range}><label for={id} {...attr('label')}>{translations().startLabel}</label></Show>{input(0)}
+    <Show when={range}><label for={`${id}-end`} {...attr('label')}>{translations().endLabel}</label>{input(1)}</Show>
+    <Show when={props.withCalendar !== false}><button ref={trigger} type="button" aria-label={range && typeof props.label==='string' ? `${props.label} ${translations().openCalendar}` : translations().openCalendar} aria-haspopup="dialog" aria-expanded={open()} aria-controls={`${id}-popup`} disabled={props.disabled} {...attr('trigger',open() ? 'open':'closed')} onClick={openPopup}>{translations().openCalendar}</button></Show>
+    <span id={`${id}-hint`} {...attr('hint')}>{props.hint ?? translations().formatHint}</span>
+    <span id={`${id}-error`} role="status" aria-live="polite" aria-atomic="true" {...attr('error',invalid() ? 'invalid':'')}>{error()?.message || externalError()}</span>
+    <input type="hidden" name={props.name ? range ? `${props.name}.start` : props.name : undefined} value={endpoints(committed())[0] ?? ''} disabled={props.disabled} form={props.form}/>
+    <Show when={range}><input type="hidden" name={props.name ? `${props.name}.end` : undefined} value={endpoints(committed())[1] ?? ''} disabled={props.disabled} form={props.form}/></Show>
+    {popup()}
+  </>;
+  const focusout:JSX.EventHandler<HTMLElement,FocusEvent> = event => {
+    if (!composing() && !open() && !(event.relatedTarget instanceof Node && root.contains(event.relatedTarget))) commit();
+  };
+  return range ? <fieldset ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><legend {...attr('label')}>{props.label}</legend>{contents()}</fieldset> : <div ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><label for={id} {...attr('label')}>{props.label}</label>{contents()}</div>;
+}
```

## apps/fixture-solid/tests/siheom/date-input.test.tsx

```diff
--- base/apps/fixture-solid/tests/siheom/date-input.test.tsx
+++ apps/fixture-solid/tests/siheom/date-input.test.tsx
@@ -0,0 +1,169 @@
+import { expect, test } from 'vitest';
+import { fireEvent, render, screen } from '@solidjs/testing-library';
+import { createSignal } from 'solid-js';
+import * as solid from '@krds-native/solid';
+import { assertions, query, runSiheom } from '@siheom/solid';
+
+const DateInput = (props: any) => {
+  expect(typeof (solid as any).DateInput).toBe('function');
+  return (solid as any).DateInput(props);
+};
+const enter = (input: HTMLElement) => fireEvent.keyDown(input, { key: 'Enter' });
+
+test('date input retains raw draft, commits leap date once and submits canonical value', async () => {
+  const changes: unknown[] = [];
+  render(() => <form><DateInput label="방문일" name="visit" onValueChange={(v:any) => changes.push(v)} /></form>);
+  await runSiheom(assertions.visible(query.textbox('방문일')));
+  const input = screen.getByRole('textbox', { name: '방문일' }) as HTMLInputElement;
+  expect(input).toHaveAttribute('type', 'text');
+  fireEvent.input(input, { target: { value: '2024-02-29' } });
+  expect(changes).toEqual([]);
+  enter(input);
+  fireEvent.focusOut(input);
+  expect(changes).toEqual([{ value: '2024-02-29' }]);
+  expect(new FormData(input.form!).get('visit')).toBe('2024-02-29');
+});
+
+test('invalid/non-padded drafts stay visible, expose linked errors and block stale form submission', () => {
+  const changes: unknown[] = [];
+  render(() => <form><DateInput label="날짜" name="date" defaultValue="2024-02-29" onValueChange={(v:any) => changes.push(v)} /><button type="submit">제출</button></form>);
+  const input = screen.getByRole('textbox', { name: '날짜' }) as HTMLInputElement;
+  fireEvent.input(input, { target: { value: '2024-2-30' } });
+  enter(input);
+  expect(input.value).toBe('2024-2-30');
+  expect(input).toHaveAttribute('aria-invalid', 'true');
+  expect(input.validity.valid).toBe(false);
+  expect(screen.getByText('YYYY-MM-DD 형식의 올바른 날짜를 입력하세요')).toBeVisible();
+  expect(input.getAttribute('aria-describedby')).toContain(screen.getByText('YYYY-MM-DD 형식의 올바른 날짜를 입력하세요').id);
+  expect(input.form!.checkValidity()).toBe(false);
+  expect(changes).toEqual([]);
+});
+
+test('controlled rejected edit restores display and external update emits nothing', () => {
+  const changes: unknown[] = [];
+  const [value, setValue] = createSignal<string|null>('0001-01-01');
+  render(() => <DateInput label="날짜" value={value()} onValueChange={(v:any) => changes.push(v)} />);
+  const input = screen.getByRole('textbox') as HTMLInputElement;
+  fireEvent.input(input, { target: { value: '9999-12-31' } }); enter(input);
+  expect(input.value).toBe('0001-01-01');
+  setValue('2024-02-29');
+  expect(input.value).toBe('2024-02-29');
+  expect(changes).toEqual([{ value: '9999-12-31' }]);
+});
+
+test('range fields defer group commit, reject reversed/incomplete and apply inclusive limits', () => {
+  const changes: unknown[] = [];
+  render(() => <DateInput mode="range" label="기간" name="period" min="2024-02-01" max="2024-02-29" onValueChange={(v:any) => changes.push(v)} />);
+  const start = screen.getByRole('textbox', { name: '시작일' });
+  const end = screen.getByRole('textbox', { name: '종료일' });
+  fireEvent.input(start, { target: { value: '2024-02-29' } });
+  fireEvent.focusOut(start, { relatedTarget: end });
+  expect(changes).toEqual([]);
+  fireEvent.input(end, { target: { value: '2024-02-01' } }); enter(end);
+  expect(screen.getByText('종료일은 시작일보다 빠를 수 없습니다')).toBeVisible();
+  fireEvent.input(start, { target: { value: '2024-02-01' } });
+  fireEvent.input(end, { target: { value: '2024-02-29' } }); enter(end);
+  expect(changes).toEqual([{ value: { start: '2024-02-01', end: '2024-02-29' } }]);
+});
+
+test('composition and keycode 229 suppress validation and Enter commits until later explicit Enter', () => {
+  const changes: unknown[] = [];
+  render(() => <DateInput label="날짜" onValueChange={(v:any) => changes.push(v)} />);
+  const input = screen.getByRole('textbox');
+  fireEvent.compositionStart(input);
+  fireEvent.input(input, { target: { value: '2024-02-29' } }); enter(input);
+  fireEvent.compositionEnd(input);
+  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
+  expect(changes).toEqual([]);
+  enter(input);
+  expect(changes).toEqual([{ value: '2024-02-29' }]);
+});
+
+test('native reset restores baseline without callback; canceled reset and disabled entries obey forms', async () => {
+  const changes: unknown[] = [];
+  const [disabled, setDisabled] = createSignal(false);
+  render(() => <form><DateInput label="날짜" name="date" disabled={disabled()} defaultValue="2024-02-01" onValueChange={(v:any) => changes.push(v)} /></form>);
+  const input = screen.getByRole('textbox') as HTMLInputElement;
+  fireEvent.input(input, { target: { value: '2024-02-29' } }); enter(input);
+  input.form!.reset(); await Promise.resolve();
+  expect(input.value).toBe('2024-02-01');
+  expect(changes).toHaveLength(1);
+  setDisabled(true);
+  expect(new FormData(input.form!).has('date')).toBe(false);
+});
+
+test('calendar cancel preserves invalid draft; confirm commits once and returns focus to opener', async () => {
+  const changes: unknown[] = [];
+  render(() => <DateInput label="날짜" defaultValue="2024-02-12" onValueChange={(v:any) => changes.push(v)} />);
+  const input = screen.getByRole('textbox') as HTMLInputElement;
+  fireEvent.input(input, { target: { value: '잘못된 날짜' } }); enter(input);
+  const trigger = screen.getByRole('button', { name: '달력 열기' });
+  fireEvent.click(trigger);
+  expect(await screen.findByRole('dialog', { name: '날짜 선택' })).toBeVisible();
+  fireEvent.click(screen.getByRole('button', { name: '취소' })); await Promise.resolve();
+  expect(input.value).toBe('잘못된 날짜');
+  fireEvent.click(trigger);
+  await screen.findByRole('dialog', { name: '날짜 선택' });
+  fireEvent.click(screen.getByRole('button', { name: /^2024년 2월 29일/ }));
+  fireEvent.click(screen.getByRole('button', { name: '확인' })); await Promise.resolve();
+  expect(input.value).toBe('2024-02-29');
+  expect(changes).toEqual([{ value: '2024-02-29' }]);
+  expect(document.activeElement).toBe(trigger);
+});
+
+test('required empty draft blocks validity and popup empty confirm; valid pending submit commits once', () => {
+  const changes: unknown[] = [];
+  render(() => <form><DateInput label="날짜" name="date" required onValueChange={(v:any) => changes.push(v)} /></form>);
+  const input = screen.getByRole('textbox') as HTMLInputElement;
+  expect(input.form!.checkValidity()).toBe(false);
+  fireEvent.input(input, { target: { value: '2024-02-29' } });
+  fireEvent.submit(input.form!);
+  expect(new FormData(input.form!).get('date')).toBe('2024-02-29');
+  expect(changes).toEqual([{ value: '2024-02-29' }]);
+});
+
+test('popup returns focus to explicit fallback when its opener disappears', async () => {
+  const [withCalendar,setWithCalendar]=createSignal(true);
+  render(() => <><DateInput label="날짜" withCalendar={withCalendar()} returnFocusId="date-fallback" /><button id="date-fallback">다음 작업</button></>);
+  fireEvent.click(screen.getByRole('button',{name:'달력 열기'}));
+  await screen.findByRole('dialog',{name:'날짜 선택'});
+  setWithCalendar(false);
+  fireEvent.click(screen.getByRole('button',{name:'취소'}));
+  await Promise.resolve();
+  expect(document.activeElement).toBe(screen.getByRole('button',{name:'다음 작업'}));
+});
+
+test('native submit rejects a declined controlled pending commit and never sends stale values', () => {
+  const changes:unknown[]=[];
+  render(() => <form><DateInput label="날짜" name="date" value="2024-02-01" onValueChange={(value:any)=>changes.push(value)} /></form>);
+  const input=screen.getByRole('textbox') as HTMLInputElement;
+  fireEvent.input(input,{target:{value:'2024-02-29'}});
+  const submit=new SubmitEvent('submit',{bubbles:true,cancelable:true});
+  input.form!.dispatchEvent(submit);
+  expect(submit.defaultPrevented).toBe(true);
+  expect(input.value).toBe('2024-02-01');
+  expect(changes).toEqual([{value:'2024-02-29'}]);
+});
+
+test('canceled native reset keeps draft and committed value untouched', async () => {
+  render(() => <form onReset={event=>event.preventDefault()}><DateInput label="날짜" name="date" defaultValue="2024-02-01" /></form>);
+  const input=screen.getByRole('textbox') as HTMLInputElement;
+  fireEvent.input(input,{target:{value:'2024-02-29'}}); enter(input);
+  fireEvent.input(input,{target:{value:'unfinished'}});
+  input.form!.reset(); await Promise.resolve();
+  expect(input.value).toBe('unfinished');
+  expect(new FormData(input.form!).get('date')).toBe('2024-02-29');
+});
+
+test('popup Escape closes only the topmost dialog and ignores composing Escape', async () => {
+  const Modal=(solid as any).Modal;
+  render(() => <Modal title="바깥 대화상자" defaultOpen><DateInput label="날짜" /></Modal>);
+  fireEvent.click(screen.getByRole('button',{name:'달력 열기'}));
+  const popup=await screen.findByRole('dialog',{name:'날짜 선택'});
+  fireEvent.keyDown(popup,{key:'Escape',isComposing:true});
+  expect(popup).toBeVisible();
+  fireEvent.keyDown(popup,{key:'Escape'});
+  await Promise.resolve();
+  expect(screen.queryByRole('dialog',{name:'날짜 선택'})).toBeNull();
+  expect(screen.getByRole('dialog',{name:'바깥 대화상자'})).toBeVisible();
+});
```

## apps/storybook-solid/src/stories/date-input.stories.tsx

```diff
--- base/apps/storybook-solid/src/stories/date-input.stories.tsx
+++ apps/storybook-solid/src/stories/date-input.stories.tsx
@@ -0,0 +1,14 @@
+import type { Meta, StoryObj } from 'storybook-solidjs-vite';
+import { createSignal } from 'solid-js';
+import { DateInput } from '@krds-native/solid';
+
+const meta={id:'krds-date-input',title:'KRDS/DateInput',component:DateInput,args:{label:'날짜',referenceDate:'2024-02-15'}} satisfies Meta<typeof DateInput>;
+export default meta;
+type Story=StoryObj<typeof meta>;
+export const Default:Story={args:{}};
+export const Disabled:Story={args:{disabled:true,value:'2024-02-15'}};
+export const Invalid:Story={args:{value:null,invalid:true,errorMessage:'날짜를 확인하세요'}};
+export const Selected:Story={args:{value:'2024-02-29'}};
+export const Range:Story={args:{mode:'range',label:'방문 기간',defaultValue:{start:'2024-02-12',end:'2024-02-18'}}};
+export const WithoutCalendar:Story={args:{withCalendar:false}};
+export const Controlled:Story={render:() => {const [value,setValue]=createSignal<string|null>('2024-02-15');return <DateInput label="방문일" value={value()} referenceDate="2024-02-15" onValueChange={({value})=>setValue(value)} />;}};
```

## packages/solid/src/components/calendar/index.tsx

```diff
--- base/packages/solid/src/components/calendar/index.tsx
+++ packages/solid/src/components/calendar/index.tsx
@@ -0,0 +1,146 @@
+import { For, Show, createEffect, createMemo, createSignal, createUniqueId, on, splitProps } from 'solid-js';
+import type { JSX } from 'solid-js';
+import { addDays, addMonths, calendarMonthGrid, parseIsoDate, weekday } from '@krds-native/contracts';
+import type { DateRangeValue, ValueChangeDetails } from '@krds-native/contracts';
+import { useKrdsEnvironment } from '../../providers';
+import { copyValue, dateConfig, emptyValue, endpoints, interpolate, nonemptyDictionary, notifyValue, sameValue, validateValue } from './model';
+import type { DateModeProps, DateValue } from './model';
+
+export interface CalendarTranslations {
+  previousMonth: string; nextMonth: string; today: string; clear: string; cancel: string; confirm: string;
+  selected: string; unavailable: string; adjacentMonth: string; dateLabel: string; monthLabel: string;
+  startLabel: string; endLabel: string; weekdays: readonly string[]; weekdayShort: readonly string[]; months: readonly string[];
+}
+const englishMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
+const dictionaries: Record<'ko-KR'|'en-US', CalendarTranslations> = {
+  'ko-KR': { previousMonth:'이전 달', nextMonth:'다음 달', today:'오늘', clear:'지우기', cancel:'취소', confirm:'확인', selected:'선택됨', unavailable:'선택할 수 없음', adjacentMonth:'다른 달', dateLabel:'{year}년 {month}월 {day}일 {weekday}', monthLabel:'{year}년 {month}월', startLabel:'시작일', endLabel:'종료일', weekdays:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], weekdayShort:['일','월','화','수','목','금','토'], months:englishMonths },
+  'en-US': { previousMonth:'Previous month', nextMonth:'Next month', today:'Today', clear:'Clear', cancel:'Cancel', confirm:'Confirm', selected:'Selected', unavailable:'Unavailable', adjacentMonth:'Outside displayed month', dateLabel:'{weekday}, {monthName} {day}, {year}', monthLabel:'{monthName} {year}', startLabel:'Start date', endLabel:'End date', weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], weekdayShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], months:englishMonths },
+};
+interface CalendarBaseProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'|'onChange'|'onInput'|'onSelect'> {
+  label?: JSX.Element; min?: string; max?: string; disabled?: boolean; required?: boolean;
+  locale?: 'ko-KR'|'en-US'; translations?: Partial<CalendarTranslations>; referenceDate?: string; today?: string;
+  onCancel?: () => void;
+}
+export type CalendarProps = CalendarBaseProps & (DateModeProps extends infer P ? P extends { mode?: 'single' } ? P & { onConfirm?: (details:ValueChangeDetails<string|null>) => void } : P & { onConfirm?: (details:ValueChangeDetails<DateRangeValue>) => void } : never);
+
+/** A native Solid date selector. Selection remains tentative until Confirm. */
+export function Calendar(props: CalendarProps): JSX.Element {
+  const environment = useKrdsEnvironment();
+  const [, native] = splitProps(props, ['mode','value','defaultValue','onValueChange','onConfirm','onCancel','label','min','max','disabled','required','locale','translations','referenceDate','today','id','class','style','dir','aria-label','aria-labelledby','ref']);
+  if (!props.label && !props['aria-label'] && !props['aria-labelledby']) throw new TypeError('Calendar requires an accessible label.');
+  const range = props.mode === 'range';
+  const controlled = props.value !== undefined;
+  if (props.mode !== undefined && props.mode !== 'single' && props.mode !== 'range') throw new TypeError('Invalid date mode.');
+  if (controlled && props.defaultValue !== undefined) throw new TypeError('value and defaultValue are mutually exclusive.');
+  const config = createMemo(() => dateConfig(props));
+  const initial = copyValue(validateValue(props.value !== undefined ? props.value : props.defaultValue ?? emptyValue(range), range, config().min, config().max));
+  const [internal, setInternal] = createSignal<DateValue>(initial);
+  const committed = createMemo(() => {
+    if ((props.mode === 'range') !== range || (props.value !== undefined) !== controlled) throw new TypeError('Date mode and control mode are immutable.');
+    return validateValue(controlled ? props.value! : internal(), range, config().min, config().max);
+  });
+  const [draft, setDraft] = createSignal<DateValue>(copyValue(initial));
+  const initialMonth = (value: DateValue) => {
+    const target = endpoints(value)[0] ?? config().referenceDate;
+    return `${(target < config().min ? config().min : target > config().max ? config().max : target).slice(0,7)}-01`;
+  };
+  const [month, setMonth] = createSignal(initialMonth(initial));
+  createEffect(on(committed, value => { setDraft(copyValue(value)); setMonth(initialMonth(value)); }, { defer: true }));
+  const translations = createMemo(() => {
+    const locale = props.locale ?? environment.locale();
+    if (!(locale in dictionaries)) throw new TypeError('Unsupported locale.');
+    const result = nonemptyDictionary(dictionaries[locale], props.translations);
+    for (const [key, length] of [['weekdays',7],['weekdayShort',7],['months',12]] as const) {
+      if (!Array.isArray(result[key]) || result[key].length !== length || result[key].some(value => typeof value !== 'string' || !value.trim())) throw new TypeError(`Invalid ${key} translation list.`);
+    }
+    return result;
+  });
+  const heading = createMemo(() => {
+    const date = parseIsoDate(month())!;
+    return interpolate(translations().monthLabel, { ...date, monthName: translations().months[date.month-1] });
+  });
+  const grid = createMemo(() => calendarMonthGrid(month()));
+  const selectable = (date: string) => !props.disabled && date >= config().min && date <= config().max;
+  const navigationMonth = (delta: number) => {
+    const target = addMonths(month(),delta);
+    if (!target) return null;
+    const next = addMonths(target,1);
+    const last = next ? addDays(next,-1)! : '9999-12-31';
+    return target <= config().max && last >= config().min ? target : null;
+  };
+  const selected = (date: string) => {
+    const [start,end] = endpoints(draft());
+    return start !== null && (range ? date >= start && date <= (end ?? start) : date === start);
+  };
+  const states = (date: string) => {
+    const [start,end] = endpoints(draft());
+    return [date === props.today && 'today', selected(date) && 'selected', range && date === start && 'range-start', range && date === end && 'range-end', range && start && end && date > start && date < end && 'in-range', date.slice(0,7) !== month().slice(0,7) && 'outside-month', !selectable(date) && 'disabled'].filter(Boolean).join(' ');
+  };
+  const dateName = (date: string) => {
+    const parts = parseIsoDate(date)!;
+    const t = translations();
+    const [start,end] = endpoints(draft());
+    return [interpolate(t.dateLabel, { ...parts, weekday:t.weekdays[weekday(date)], monthName:t.months[parts.month-1] }), date === props.today && t.today, selected(date) && t.selected, !selectable(date) && t.unavailable, date.slice(0,7) !== month().slice(0,7) && t.adjacentMonth, range && date === start && t.startLabel, range && date === end && t.endLabel].filter(Boolean).join(', ');
+  };
+  let root!: HTMLDivElement;
+  const id = props.id ?? createUniqueId();
+  function focusDate(date: string) {
+    setMonth(`${date.slice(0,7)}-01`);
+    queueMicrotask(() => root?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus());
+  }
+  function activate(date: string) {
+    if (!selectable(date)) return;
+    if (!range) setDraft(date);
+    else {
+      const [start,end] = endpoints(draft());
+      setDraft(!start || end ? { start:date,end:null } : { start:date < start ? date : start, end:date > start ? date : start });
+    }
+    if (date.slice(0,7) !== month().slice(0,7)) focusDate(date);
+  }
+  function keydown(event: KeyboardEvent, date: string) {
+    if (props.disabled || event.isComposing || event.keyCode === 229) return;
+    let target: string|null = null, direction = 1, targetMonth: string|undefined;
+    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
+      const delta = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key as 'ArrowLeft'];
+      direction = Math.sign(delta); target = addDays(date,delta);
+    } else if (event.key === 'Home' || event.key === 'End') {
+      direction = event.key === 'Home' ? 1 : -1;
+      target = addDays(date,event.key === 'Home' ? -weekday(date) : 6-weekday(date));
+      const limit = addDays(date,event.key === 'Home' ? 6-weekday(date) : -weekday(date));
+      while (target && !selectable(target) && target !== limit) target = addDays(target,direction);
+      event.preventDefault(); if (target && selectable(target)) focusDate(target); return;
+    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
+      direction = event.key === 'PageUp' ? -1 : 1;
+      target = addMonths(date,direction*(event.shiftKey ? 12 : 1)); targetMonth = target?.slice(0,7);
+    } else return;
+    event.preventDefault();
+    while (target && !selectable(target)) {
+      if ((direction < 0 && target < config().min) || (direction > 0 && target > config().max)) return;
+      target = addDays(target,direction);
+      if (targetMonth && target?.slice(0,7) !== targetMonth) return;
+    }
+    if (target && selectable(target)) focusDate(target);
+  }
+  const canConfirm = () => {
+    if (props.disabled) return false;
+    const [start,end] = endpoints(draft());
+    return start === null ? !props.required : selectable(start) && (!range || end !== null && selectable(end));
+  };
+  function confirm() {
+    if (!canConfirm()) return;
+    const value = copyValue(draft());
+    if (!sameValue(value,committed())) {
+      if (!controlled) setInternal(copyValue(value));
+      notifyValue(props,value);
+    }
+    (props.onConfirm as ((detail:ValueChangeDetails<DateValue>)=>void)|undefined)?.({ value:copyValue(value) });
+    if (controlled) { setDraft(copyValue(committed())); setMonth(initialMonth(committed())); }
+  }
+  const attr = (part:string, state='') => ({ 'data-krds-component':'calendar', 'data-krds-part':part, 'data-krds-state':state });
+  return <div {...native} ref={element => { root=element; if (typeof props.ref==='function') props.ref(element); }} id={id} class={props.class} style={props.style} dir={props.dir ?? environment.direction()} role="group" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label ? `${id}-label` : undefined)} {...attr('root',props.disabled ? 'disabled' : '')}>
+    <Show when={props.label}><div id={`${id}-label`}>{props.label}</div></Show>
+    <div {...attr('header')}><button type="button" {...attr('previous',props.disabled || !navigationMonth(-1) ? 'disabled' : '')} aria-label={translations().previousMonth} disabled={props.disabled || !navigationMonth(-1)} onClick={() => { const target=navigationMonth(-1); if (!props.disabled && target) setMonth(target); }}>‹</button><h2 id={`${id}-heading`} aria-live="polite" aria-atomic="true" {...attr('heading')}>{heading()}</h2><button type="button" {...attr('next',props.disabled || !navigationMonth(1) ? 'disabled' : '')} aria-label={translations().nextMonth} disabled={props.disabled || !navigationMonth(1)} onClick={() => { const target=navigationMonth(1); if (!props.disabled && target) setMonth(target); }}>›</button></div>
+    <table aria-labelledby={`${id}-heading`} {...attr('table')}><thead><tr><For each={translations().weekdays}>{(name,index) => <th scope="col" aria-label={name} {...attr('weekday')}>{translations().weekdayShort[index()]}</th>}</For></tr></thead><tbody><For each={[0,1,2,3,4,5]}>{row => <tr><For each={grid().slice(row*7,row*7+7)}>{date => <td {...attr('cell')}><Show when={date}>{date => <button type="button" data-date={date()} {...attr('day',states(date()))} aria-label={dateName(date())} aria-current={date() === props.today ? 'date' : undefined} aria-pressed={selected(date())} disabled={!selectable(date())} onKeyDown={event => keydown(event,date())} onClick={() => activate(date())}>{parseIsoDate(date())!.day}</button>}</Show></td>}</For></tr>}</For></tbody></table>
+    <div {...attr('footer')}><Show when={props.today}><button type="button" {...attr('today',!selectable(props.today!) ? 'disabled' : '')} disabled={!selectable(props.today!)} onClick={() => { if (props.today && selectable(props.today)) focusDate(props.today); }}>{translations().today}</button></Show><Show when={!props.required}><button type="button" {...attr('clear',props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick={() => { if (!props.disabled) setDraft(emptyValue(range)); }}>{translations().clear}</button></Show><button type="button" {...attr('cancel',props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick={() => { if (!props.disabled) { setDraft(copyValue(committed())); setMonth(initialMonth(committed())); props.onCancel?.(); } }}>{translations().cancel}</button><button type="button" {...attr('confirm',!canConfirm() ? 'disabled' : '')} disabled={!canConfirm()} onClick={confirm}>{translations().confirm}</button></div>
+  </div>;
+}
```

## packages/solid/src/components/calendar/model.ts

```diff
--- base/packages/solid/src/components/calendar/model.ts
+++ packages/solid/src/components/calendar/model.ts
@@ -0,0 +1,53 @@
+import { parseIsoDate } from '@krds-native/contracts';
+import type { DateRangeValue, ValueChangeDetails } from '@krds-native/contracts';
+
+export type DateValue = string | null | DateRangeValue;
+export type DateModeProps = {
+  mode?: 'single'; value?: string | null; defaultValue?: string | null;
+  onValueChange?: (details: ValueChangeDetails<string | null>) => void;
+} | {
+  mode: 'range'; value?: DateRangeValue; defaultValue?: DateRangeValue;
+  onValueChange?: (details: ValueChangeDetails<DateRangeValue>) => void;
+};
+export const emptyValue = (range: boolean): DateValue => range ? { start: null, end: null } : null;
+export const copyValue = (value: DateValue): DateValue => typeof value === 'object' && value !== null ? { ...value } : value;
+export const endpoints = (value: DateValue): [string | null, string | null] => typeof value === 'object' && value !== null ? [value.start, value.end] : [value, null];
+export const sameValue = (a: DateValue, b: DateValue): boolean => endpoints(a).every((value, index) => value === endpoints(b)[index]);
+export function strictDate(value: string, name: string): string {
+  if (typeof value !== 'string' || !parseIsoDate(value)) throw new RangeError(`${name} must be a strict Gregorian ISO date.`);
+  return value;
+}
+export function dateConfig(props: { min?: string; max?: string; referenceDate?: string; today?: string }) {
+  const min = strictDate(props.min ?? '0001-01-01', 'min');
+  const max = strictDate(props.max ?? '9999-12-31', 'max');
+  if (min > max) throw new RangeError('min must not exceed max.');
+  const referenceDate = strictDate(props.referenceDate ?? '2000-01-01', 'referenceDate');
+  if (props.today !== undefined) strictDate(props.today, 'today');
+  return { min, max, referenceDate };
+}
+export function validateValue(value: DateValue, range: boolean, min: string, max: string): DateValue {
+  if (range) {
+    if (typeof value !== 'object' || value === null || !('start' in value) || !('end' in value)) throw new TypeError('Range mode requires { start, end }.');
+    if (value.start === null && value.end === null) return value;
+    if (value.start === null || value.end === null) throw new RangeError('A committed range must have both endpoints.');
+    strictDate(value.start, 'start'); strictDate(value.end, 'end');
+    if (value.start > value.end || value.start < min || value.end > max) throw new RangeError('Invalid or unavailable committed range.');
+  } else {
+    if (value !== null && typeof value !== 'string') throw new TypeError('Single mode requires a date string or null.');
+    if (value !== null && (strictDate(value, 'value') < min || value > max)) throw new RangeError('Committed date is outside bounds.');
+  }
+  return value;
+}
+export function notifyValue(props: DateModeProps, value: DateValue) {
+  (props.onValueChange as ((details: ValueChangeDetails<DateValue>) => void) | undefined)?.({ value: copyValue(value) });
+}
+export function interpolate(text: string, values: Record<string, string | number>): string {
+  return text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
+}
+export function nonemptyDictionary<T extends object>(defaults: T, overrides?: Partial<T>): T {
+  const result = { ...defaults, ...overrides };
+  for (const value of Object.values(result)) {
+    if (typeof value === 'string' && !value.trim()) throw new TypeError('Translations must not be empty.');
+  }
+  return result;
+}
```

## apps/fixture-solid/tests/siheom/calendar.test.tsx

```diff
--- base/apps/fixture-solid/tests/siheom/calendar.test.tsx
+++ apps/fixture-solid/tests/siheom/calendar.test.tsx
@@ -0,0 +1,94 @@
+import { expect, test } from 'vitest';
+import { fireEvent, render, screen } from '@solidjs/testing-library';
+import { createSignal } from 'solid-js';
+import * as solid from '@krds-native/solid';
+import { assertions, query, runSiheom } from '@siheom/solid';
+
+const Calendar = (props: any) => {
+  expect(typeof (solid as any).Calendar).toBe('function');
+  return (solid as any).Calendar(props);
+};
+const day = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}`) });
+
+test('calendar renders six native rows, full Korean names and sequential enabled dates', async () => {
+  render(() => <Calendar label="날짜 선택" referenceDate="2024-02-15" today="2024-02-29" />);
+  expect(screen.getByRole('table', { name: '2024년 2월' }).querySelectorAll('tbody tr')).toHaveLength(6);
+  await runSiheom(assertions.visible(query.button('확인')));
+  const leap = day('2024년 2월 29일 목요일');
+  expect(leap).toHaveAttribute('aria-current', 'date');
+  expect(leap).not.toHaveAttribute('tabindex', '-1');
+  expect(screen.getByRole('columnheader', { name: '목요일' })).toBeVisible();
+});
+
+test('calendar selection is tentative, confirms once and cancel restores committed selection', () => {
+  const changes: unknown[] = [], confirms: unknown[] = [], cancels: unknown[] = [];
+  render(() => <Calendar label="날짜 선택" defaultValue="2024-02-12" onValueChange={(v:any) => changes.push(v)} onConfirm={(v:any) => confirms.push(v)} onCancel={() => cancels.push(true)} />);
+  fireEvent.click(day('2024년 2월 14일'));
+  expect(changes).toEqual([]);
+  fireEvent.click(screen.getByRole('button', { name: '취소' }));
+  expect(day('2024년 2월 12일')).toHaveAttribute('aria-pressed', 'true');
+  fireEvent.click(day('2024년 2월 14일'));
+  fireEvent.click(screen.getByRole('button', { name: '확인' }));
+  fireEvent.click(screen.getByRole('button', { name: '확인' }));
+  expect(changes).toEqual([{ value: '2024-02-14' }]);
+  expect(confirms).toEqual([{ value: '2024-02-14' }, { value: '2024-02-14' }]);
+  expect(cancels).toHaveLength(1);
+});
+
+test('calendar range sorts clicked endpoints, prevents partial confirmation and exposes range states', () => {
+  const changes: unknown[] = [];
+  render(() => <Calendar mode="range" label="기간" referenceDate="2024-02-15" onValueChange={(v:any) => changes.push(v)} />);
+  fireEvent.click(day('2024년 2월 18일'));
+  expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
+  fireEvent.click(day('2024년 2월 12일'));
+  expect(day('2024년 2월 15일')).toHaveAttribute('data-krds-state', expect.stringContaining('in-range'));
+  expect(day('2024년 2월 12일')).toHaveAccessibleName(/시작일/);
+  fireEvent.click(screen.getByRole('button', { name: '확인' }));
+  expect(changes).toEqual([{ value: { start: '2024-02-12', end: '2024-02-18' } }]);
+});
+
+test('calendar respects inclusive bounds and Gregorian year edges without phantom dates', () => {
+  render(() => <Calendar label="날짜" referenceDate="0001-01-01" min="0001-01-01" max="0001-01-03" />);
+  expect(screen.getByRole('button', { name: '이전 달' })).toBeDisabled();
+  expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
+  expect(day('1년 1월 1일')).toBeEnabled();
+  expect(day('1년 1월 4일')).toBeDisabled();
+  expect(screen.queryByRole('button', { name: /0년 12월/ })).toBeNull();
+});
+
+test('calendar keyboard changes focus without selecting; month/year movement clamps leap days', async () => {
+  const changes: unknown[] = [];
+  render(() => <Calendar label="날짜" referenceDate="2024-02-29" onValueChange={(v:any) => changes.push(v)} />);
+  day('2024년 2월 29일').focus();
+  fireEvent.keyDown(document.activeElement!, { key: 'PageDown', shiftKey: true });
+  await Promise.resolve();
+  expect(document.activeElement).toHaveAccessibleName(/^2025년 2월 28일/);
+  fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
+  await Promise.resolve();
+  expect(document.activeElement).toHaveAccessibleName(/^2025년 3월 1일/);
+  expect(changes).toEqual([]);
+});
+
+test('controlled rejected confirm restores parent selection; external updates never emit', async () => {
+  const changes: unknown[] = [];
+  const [value, setValue] = createSignal<string|null>('2024-02-12');
+  render(() => <Calendar label="날짜" value={value()} onValueChange={(v:any) => changes.push(v)} />);
+  fireEvent.click(day('2024년 2월 14일'));
+  fireEvent.click(screen.getByRole('button', { name: '확인' }));
+  expect(day('2024년 2월 12일')).toHaveAttribute('aria-pressed', 'true');
+  setValue('2024-03-01');
+  expect(day('2024년 3월 1일')).toHaveAttribute('aria-pressed', 'true');
+  expect(changes).toEqual([{ value: '2024-02-14' }]);
+});
+
+test('disabled calendar suppresses all actions; optional clear commits empty', () => {
+  const changes: unknown[] = [];
+  const [disabled, setDisabled] = createSignal(true);
+  render(() => <Calendar label="날짜" disabled={disabled()} defaultValue="9999-12-31" onValueChange={(v:any) => changes.push(v)} />);
+  expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
+  expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
+  setDisabled(false);
+  fireEvent.click(screen.getByRole('button', { name: '지우기' }));
+  fireEvent.click(screen.getByRole('button', { name: '확인' }));
+  expect(changes).toEqual([{ value: null }]);
+});
```

## apps/storybook-solid/src/stories/calendar.stories.tsx

```diff
--- base/apps/storybook-solid/src/stories/calendar.stories.tsx
+++ apps/storybook-solid/src/stories/calendar.stories.tsx
@@ -0,0 +1,13 @@
+import type { Meta, StoryObj } from 'storybook-solidjs-vite';
+import { createSignal } from 'solid-js';
+import { Calendar } from '@krds-native/solid';
+
+const meta = { id:'krds-calendar', title:'KRDS/Calendar', component:Calendar, args:{label:'날짜 선택',referenceDate:'2024-02-15'} } satisfies Meta<typeof Calendar>;
+export default meta;
+type Story=StoryObj<typeof meta>;
+export const Default:Story={args:{}};
+export const Disabled:Story={args:{disabled:true,value:'2024-02-15'}};
+export const Selected:Story={args:{value:'2024-02-29',today:'2024-02-15'}};
+export const SelectedRange:Story={args:{mode:'range',value:{start:'2024-02-12',end:'2024-02-18'},referenceDate:'2024-02-15',today:'2024-02-15'}};
+export const Boundaries:Story={args:{referenceDate:'0001-01-01',min:'0001-01-01',max:'0001-01-31'}};
+export const Controlled:Story={render:() => {const [value,setValue]=createSignal<string|null>('2024-02-15');return <Calendar label="방문일 선택" value={value()} referenceDate="2024-02-15" onValueChange={({value})=>setValue(value)} />;}};
```
