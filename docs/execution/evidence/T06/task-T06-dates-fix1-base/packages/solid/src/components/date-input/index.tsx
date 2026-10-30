import { Show, createEffect, createMemo, createSignal, createUniqueId, on, onCleanup, untrack } from 'solid-js';
import type { JSX } from 'solid-js';
import { parseIsoDate } from '@krds-native/contracts';
import { useKrdsEnvironment } from '../../providers';
import { Calendar } from '../calendar';
import type { CalendarProps, CalendarTranslations } from '../calendar';
import { copyValue, dateConfig, emptyValue, endpoints, interpolate, nonemptyDictionary, notifyValue, sameValue, validateValue } from '../calendar/model';
import type { DateModeProps, DateValue } from '../calendar/model';

export interface DateInputTranslations {
  startLabel:string; endLabel:string; formatHint:string; openCalendar:string; calendarTitle:string;
  requiredError:string; formatError:string; incompleteRangeError:string; orderError:string; minError:string; maxError:string;
}
const dictionaries: Record<'ko-KR'|'en-US',DateInputTranslations> = {
  'ko-KR': { startLabel:'시작일', endLabel:'종료일', formatHint:'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar:'달력 열기', calendarTitle:'날짜 선택', requiredError:'날짜를 입력하세요', formatError:'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError:'시작일과 종료일을 모두 입력하세요', orderError:'종료일은 시작일보다 빠를 수 없습니다', minError:'{min} 이후 날짜를 입력하세요 (당일 포함)', maxError:'{max} 이전 날짜를 입력하세요 (당일 포함)' },
  'en-US': { startLabel:'Start date', endLabel:'End date', formatHint:'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar:'Open calendar', calendarTitle:'Choose date', requiredError:'Enter a date', formatError:'Enter a valid date in YYYY-MM-DD format', incompleteRangeError:'Enter both start and end dates', orderError:'End date must not precede start date', minError:'Enter a date on or after {min}', maxError:'Enter a date on or before {max}' },
};
interface DateInputBaseProps {
  id?:string; name?:string; form?:string; returnFocusId?:string; autocomplete?:JSX.InputHTMLAttributes<HTMLInputElement>['autocomplete'];
  label:JSX.Element; hint?:JSX.Element; error?:JSX.Element; errorMessage?:JSX.Element; invalid?:boolean;
  required?:boolean; disabled?:boolean; min?:string; max?:string; locale?:'ko-KR'|'en-US';
  translations?:Partial<DateInputTranslations>; calendarTranslations?:Partial<CalendarTranslations>;
  withCalendar?:boolean; referenceDate?:string; today?:string; class?:string; style?:JSX.CSSProperties|string;
}
export type DateInputProps = DateInputBaseProps & DateModeProps;
interface Validation { message:string; fields:readonly number[]; value?:DateValue }

/** Text drafts are separate from strict, canonical date-only form values. */
export function DateInput(props: DateInputProps): JSX.Element {
  const environment = useKrdsEnvironment();
  const range = props.mode === 'range', controlled = props.value !== undefined;
  if (props.mode !== undefined && props.mode !== 'single' && props.mode !== 'range') throw new TypeError('Invalid date mode.');
  if (controlled && props.defaultValue !== undefined) throw new TypeError('value and defaultValue are mutually exclusive.');
  if (props.label === undefined || props.label === null || props.label === '') throw new TypeError('DateInput requires a task label.');
  const config = createMemo(() => dateConfig(props));
  const initial = copyValue(validateValue(props.value !== undefined ? props.value : props.defaultValue ?? emptyValue(range),range,config().min,config().max));
  const [internal,setInternal] = createSignal<DateValue>(copyValue(initial));
  const committed = createMemo(() => {
    if ((props.mode === 'range') !== range || (props.value !== undefined) !== controlled) throw new TypeError('Date mode and control mode are immutable.');
    return validateValue(controlled ? props.value! : internal(),range,config().min,config().max);
  });
  const textFor = (value:DateValue): [string,string] => { const [start,end]=endpoints(value); return [start ?? '',end ?? '']; };
  const [draft,setDraft] = createSignal<[string,string]>(textFor(initial));
  const [error,setError] = createSignal<Validation|null>(null);
  const [composing,setComposing] = createSignal(false);
  const [open,setOpen] = createSignal(false);
  const translations = createMemo(() => {
    const locale=props.locale ?? environment.locale();
    if (!(locale in dictionaries)) throw new TypeError('Unsupported locale.');
    return nonemptyDictionary(dictionaries[locale],props.translations);
  });
  const id=props.id ?? createUniqueId();
  let root!:HTMLElement, first!:HTMLInputElement, second:HTMLInputElement|undefined, trigger:HTMLButtonElement|undefined, dialog:HTMLDialogElement|undefined;
  const fields = () => [first,second].filter((input):input is HTMLInputElement => !!input);
  const externalError = () => props.error ?? props.errorMessage;
  const invalid = () => !!error() || !!props.invalid || !!externalError();
  const fieldInvalid = (index:number) => !!props.invalid || !!externalError() || !!error()?.fields.includes(index);
  function validate():Validation {
    const [start,end]=draft(), t=translations();
    const failure=(message:string,indices:readonly number[]):Validation => ({message,fields:indices});
    // Format failures take precedence over incomplete/bounds/order failures.
    if (start && !parseIsoDate(start)) return failure(t.formatError,[0]);
    if (range && end && !parseIsoDate(end)) return failure(t.formatError,[1]);
    if (!start && (!range || !end)) return props.required ? failure(t.requiredError,range ? [0,1] : [0]) : {message:'',fields:[],value:emptyValue(range)};
    if (range && (!start || !end)) return failure(t.incompleteRangeError,!start ? [0] : [1]);
    if (start < config().min) return failure(interpolate(t.minError,{min:config().min}),[0]);
    if (start > config().max) return failure(interpolate(t.maxError,{max:config().max}),[0]);
    if (range && end < config().min) return failure(interpolate(t.minError,{min:config().min}),[1]);
    if (range && end > config().max) return failure(interpolate(t.maxError,{max:config().max}),[1]);
    if (range && start > end) return failure(t.orderError,[0,1]);
    return {message:'',fields:[],value:range ? {start,end} : start};
  }
  function mirrorValidity(validation=validate()) {
    fields().forEach((input,index) => input.setCustomValidity(!props.disabled && validation.fields.includes(index) ? validation.message : ''));
  }
  function replaceDraft(value:DateValue) {
    setDraft(textFor(value)); setError(null); mirrorValidity();
    // Always restore DOM too: a controlled parent may reject a same-prop request.
    fields().forEach((input,index) => { input.value=textFor(value)[index]; });
  }
  createEffect(on(committed,value => replaceDraft(value),{defer:true}));
  createEffect(() => { props.disabled; translations(); config(); draft(); props.required; if (!untrack(composing)) mirrorValidity(); });
  function commitValue(value:DateValue):boolean {
    if (!sameValue(value,committed())) {
      if (!controlled) setInternal(copyValue(value));
      notifyValue(props,value);
    }
    const accepted=sameValue(value,committed());
    replaceDraft(committed());
    return accepted;
  }
  function commit():boolean {
    if (props.disabled || composing()) return false;
    const result=validate(); mirrorValidity(result);
    if (result.message) { setError(result); return false; }
    return commitValue(result.value!);
  }
  function updateDraft(index:number,event:InputEvent & {currentTarget:HTMLInputElement}) {
    if (props.disabled) return;
    const next:[string,string]=[...draft()]; next[index]=event.currentTarget.value; setDraft(next);
    if (!composing() && !event.isComposing) mirrorValidity();
  }
  function keydown(event:KeyboardEvent) {
    if (props.disabled || composing() || event.isComposing || event.keyCode === 229) return;
    if (event.key === 'Enter') { event.preventDefault(); commit(); }
  }
  function restoreFocus() {
    const doc=environment.getDocument();
    const usable=(element:HTMLElement|null|undefined):element is HTMLElement => !!element?.isConnected && !element.closest('[inert],[hidden]') && !element.matches(':disabled') && element.getClientRects().length>0;
    const fallback=props.returnFocusId ? doc?.getElementById(props.returnFocusId) : undefined;
    const target=usable(trigger) ? trigger : usable(fallback) ? fallback : undefined;
    if (target) { target.focus({preventScroll:true}); return; }
    if (doc) { const tabindex=doc.body.getAttribute('tabindex'); doc.body.tabIndex=-1; doc.body.focus({preventScroll:true}); if (tabindex===null) doc.body.removeAttribute('tabindex'); else doc.body.setAttribute('tabindex',tabindex); }
  }
  function closePopup() {
    if (!open()) return;
    dialog?.close(); setOpen(false); queueMicrotask(restoreFocus);
  }
  function openPopup() {
    if (props.disabled || composing() || open()) return;
    setOpen(true);
    queueMicrotask(() => {
      if (!dialog || !open()) return;
      dialog.showModal();
      const selected=dialog.querySelector<HTMLButtonElement>('[data-krds-part="day"][aria-pressed="true"]:not(:disabled)');
      const current=dialog.querySelector<HTMLButtonElement>('[data-krds-part="day"]:not([data-krds-state~="outside-month"]):not(:disabled)');
      const navigation=dialog.querySelector<HTMLButtonElement>('[data-krds-part="previous"]:not(:disabled),[data-krds-part="next"]:not(:disabled)');
      (selected ?? current ?? navigation ?? dialog).focus();
    });
  }
  createEffect(() => { if (props.disabled && open()) closePopup(); });
  // Listen on the associated form, including the native external `form` relationship.
  createEffect(() => {
    props.form;
    const form=first?.form;
    if (!form) return;
    const reset=(event:Event) => queueMicrotask(() => {
      if (event.defaultPrevented) return;
      if (!controlled) setInternal(copyValue(initial));
      replaceDraft(committed()); closePopup();
    });
    const submit=(event:SubmitEvent) => {
      if (!props.disabled && !commit()) { event.preventDefault(); const index=error()?.fields[0] ?? 0; fields()[index]?.focus(); }
    };
    form.addEventListener('reset',reset); form.addEventListener('submit',submit);
    onCleanup(() => { form.removeEventListener('reset',reset); form.removeEventListener('submit',submit); });
  });
  onCleanup(() => { if (open()) { dialog?.close(); queueMicrotask(restoreFocus); } });
  const attr=(part:string,state='') => ({'data-krds-component':'date-input','data-krds-part':part,'data-krds-state':state});
  const fieldState=(index:number) => [props.disabled && 'disabled',fieldInvalid(index) && 'invalid'].filter(Boolean).join(' ');
  const describedBy=() => [`${id}-hint`,invalid() ? `${id}-error` : ''].filter(Boolean).join(' ');
  const input=(index:number) => <input ref={element => { if (index===0) first=element; else second=element; }} id={index===0 ? id : `${id}-end`} type="text" inputmode="numeric" autocomplete={props.autocomplete} placeholder="YYYY-MM-DD" form={props.form} required={props.required} disabled={props.disabled} value={draft()[index]} aria-describedby={describedBy()} aria-invalid={fieldInvalid(index) ? 'true' : undefined} {...attr(range ? index===0 ? 'start-input' : 'end-input' : 'control',fieldState(index))} onInput={event => updateDraft(index,event)} onKeyDown={keydown} onCompositionStart={() => setComposing(true)} onCompositionEnd={event => { const next:[string,string]=[...draft()]; next[index]=event.currentTarget.value; setDraft(next); setComposing(false); }} onInvalid={() => { if (!composing()) setError(validate()); }} />;
  const popup=() => <Show when={open()}><dialog ref={dialog} id={`${id}-popup`} aria-modal="true" aria-labelledby={`${id}-popup-title`} tabIndex={-1} {...attr('popup','open')} onCancel={event => { const handled=event.defaultPrevented; event.preventDefault(); if (!handled && !composing()) closePopup(); }} onKeyDown={event => {
      // The native popup owns these keys; an ancestor Modal must not process them.
      if (event.key==='Tab') { event.stopPropagation(); return; }
      if (event.key!=='Escape') return;
      event.stopPropagation();
      if (event.defaultPrevented) return;
      event.preventDefault();
      if (!composing() && !event.isComposing && event.keyCode!==229) closePopup();
    }} onClose={() => { if (open()) { setOpen(false); queueMicrotask(restoreFocus); } }}>
    <h2 id={`${id}-popup-title`}>{translations().calendarTitle}</h2>
    <Calendar {...({ mode:range ? 'range':'single', value:committed(), label:translations().calendarTitle, min:props.min, max:props.max, disabled:props.disabled, required:props.required, locale:props.locale, referenceDate:props.referenceDate, today:props.today, translations:{startLabel:translations().startLabel,endLabel:translations().endLabel,...props.calendarTranslations}, onConfirm:({value}:{value:DateValue}) => { commitValue(value); closePopup(); }, onCancel:closePopup } as CalendarProps)} />
    <button type="button" onClick={closePopup}>{(props.locale ?? environment.locale())==='ko-KR' ? '닫기':'Close'}</button>
  </dialog></Show>;
  const contents=() => <>
    <Show when={range}><label for={id} {...attr('label')}>{translations().startLabel}</label></Show>{input(0)}
    <Show when={range}><label for={`${id}-end`} {...attr('label')}>{translations().endLabel}</label>{input(1)}</Show>
    <Show when={props.withCalendar !== false}><button ref={trigger} type="button" aria-label={range && typeof props.label==='string' ? `${props.label} ${translations().openCalendar}` : translations().openCalendar} aria-haspopup="dialog" aria-expanded={open()} aria-controls={`${id}-popup`} disabled={props.disabled} {...attr('trigger',open() ? 'open':'closed')} onClick={openPopup}>{translations().openCalendar}</button></Show>
    <span id={`${id}-hint`} {...attr('hint')}>{props.hint ?? translations().formatHint}</span>
    <span id={`${id}-error`} role="status" aria-live="polite" aria-atomic="true" {...attr('error',invalid() ? 'invalid':'')}>{error()?.message || externalError()}</span>
    <input type="hidden" name={props.name ? range ? `${props.name}.start` : props.name : undefined} value={endpoints(committed())[0] ?? ''} disabled={props.disabled} form={props.form}/>
    <Show when={range}><input type="hidden" name={props.name ? `${props.name}.end` : undefined} value={endpoints(committed())[1] ?? ''} disabled={props.disabled} form={props.form}/></Show>
    {popup()}
  </>;
  const focusout:JSX.EventHandler<HTMLElement,FocusEvent> = event => {
    if (!composing() && !open() && !(event.relatedTarget instanceof Node && root.contains(event.relatedTarget))) commit();
  };
  return range ? <fieldset ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><legend {...attr('label')}>{props.label}</legend>{contents()}</fieldset> : <div ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><label for={id} {...attr('label')}>{props.label}</label>{contents()}</div>;
}
