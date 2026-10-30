import { useControlledMode } from '../../use-controlled-mode.js';
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { parseIsoDate } from '@unofficial-krds/contracts';
import { useKrdsEnvironment, type KrdsLocale } from '../../providers/index.js';
import { Calendar, type CalendarTranslations } from '../calendar/index.js';
import { clone, configuration, dictionary, empty, equal, notify, pair, text, validate, type DateModeProps, type DateValue } from '../calendar/model.js';
import { Modal } from '../modal/index.js';
export interface DateInputTranslations { startLabel: string; endLabel: string; formatHint: string; openCalendar: string; calendarTitle: string; requiredError: string; formatError: string; incompleteRangeError: string; orderError: string; minError: string; maxError: string; }
export type DateInputProps = DateModeProps & { label: ReactNode; id?: string; name?: string; required?: boolean; disabled?: boolean; form?: string; autoComplete?: string; min?: string; max?: string; referenceDate?: string; today?: string; locale?: KrdsLocale; translations?: Partial<DateInputTranslations>; calendarTranslations?: Partial<CalendarTranslations>; withCalendar?: boolean; hint?: ReactNode; error?: ReactNode; invalid?: boolean; };
function translations(locale: KrdsLocale, overrides?: Partial<DateInputTranslations>) {
  const en = locale === 'en-US';
  return dictionary({ startLabel: en ? 'Start date' : '시작일', endLabel: en ? 'End date' : '종료일', formatHint: en ? 'Enter YYYY-MM-DD, for example 2024-02-29' : 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: en ? 'Open calendar' : '달력 열기', calendarTitle: en ? 'Choose date' : '날짜 선택', requiredError: en ? 'Enter a date' : '날짜를 입력하세요', formatError: en ? 'Enter a valid date in YYYY-MM-DD format' : 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: en ? 'Enter both start and end dates' : '시작일과 종료일을 모두 입력하세요', orderError: en ? 'End date must not precede start date' : '종료일은 시작일보다 빠를 수 없습니다', minError: en ? 'Enter a date on or after {min}' : '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: en ? 'Enter a date on or before {max}' : '{max} 이전 날짜를 입력하세요 (당일 포함)' }, overrides);
}
export function DateInput(props: DateInputProps) {
  const controlled = useControlledMode(props.value, props.defaultValue, 'DateInput');
  const env = useKrdsEnvironment(); const locale = props.locale ?? env.locale; const t = translations(locale, props.translations);
  const range = props.mode === 'range'; const originalMode = useRef(range); if (range !== originalMode.current) throw new TypeError('DateInput mode is immutable.');
  const bounds = configuration(props); const generatedId = useId(); const id = props.id ?? generatedId;
  const [baseline] = useState<DateValue>(() => clone(validate(props.defaultValue ?? empty(range), range, bounds.min, bounds.max)));
  const [local, setLocal] = useState<DateValue>(() => clone(baseline)); const committed = validate(controlled ? props.value! : local, range, bounds.min, bounds.max);
  const toDraft = (value: DateValue) => pair(value).map(date => date ?? '') as [string, string];
  const [draft, setDraft] = useState<[string, string]>(() => toDraft(committed)); const raw = useRef(draft); raw.current = draft;
  const [error, setError] = useState(''); const [open, setOpen] = useState(false); const composing = useRef(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]); const root = useRef<HTMLFieldSetElement>(null);
  const pending = useRef<{ value: DateValue } | null>(null);
  const current = useRef(committed); current.current = committed; const key = JSON.stringify(committed); const previous = useRef(key);
  function validation(values: [string, string]): { value: DateValue; error: string } {
    const [start, end] = values;
    if ((start && !parseIsoDate(start)) || (range && end && !parseIsoDate(end))) return { value: committed, error: t.formatError };
    if (range && !!start !== !!end) return { value: committed, error: t.incompleteRangeError };
    if (!start && props.required) return { value: committed, error: t.requiredError };
    if (range && start && end && start > end) return { value: committed, error: t.orderError };
    const dates = range ? [start, end] : [start];
    if (dates.some(date => date && date < bounds.min)) return { value: committed, error: text(t.minError, { min: bounds.min }) };
    if (dates.some(date => date && date > bounds.max)) return { value: committed, error: text(t.maxError, { max: bounds.max }) };
    return { value: range ? { start: start || null, end: end || null } : start || null, error: '' };
  }
  const validity = (values: [string, string]) => { const result = validation(values); for (const input of inputs.current) input?.setCustomValidity(composing.current ? '' : result.error); return result; };
  const replace = (value: DateValue, retainPending = false) => {
    if (!retainPending) pending.current = null;
    const next = toDraft(value);
    raw.current = next;
    setDraft(next);
    setError('');
    validity(next);
  };
  useLayoutEffect(() => { if (key !== previous.current) { previous.current = key; replace(committed); } });
  useLayoutEffect(() => { validity(raw.current); });
  useLayoutEffect(() => { if (props.disabled) setOpen(false); }, [props.disabled]);
  const commitValue = (next: DateValue): boolean => {
    if (controlled) {
      if (!equal(next, current.current) && (!pending.current || !equal(next, pending.current.value))) {
        pending.current = { value: clone(next) };
        notify(props, next);
      }
      const unresolved = pending.current !== null && !equal(pending.current.value, current.current);
      // Restore parent-truth display without losing the intent rejected during blur.
      // A following submit must evaluate that request, not the restored old text.
      replace(current.current, unresolved);
      return !unresolved;
    }
    if (!equal(next, current.current)) {
      current.current = clone(next);
      setLocal(clone(next));
      notify(props, next);
    }
    replace(next);
    return true;
  };
  function commit(): boolean { if (props.disabled || composing.current) return false; const result = validity(raw.current); setError(result.error); return !result.error && commitValue(result.value); }
  const latest = useRef({ commit, reset: () => { replace(controlled ? current.current : baseline); if (!controlled) setLocal(clone(baseline)); setOpen(false); } });
  latest.current = { commit, reset: () => { replace(controlled ? current.current : baseline); if (!controlled) setLocal(clone(baseline)); setOpen(false); } };
  useLayoutEffect(() => {
    const form = inputs.current[0]?.form; if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) latest.current.reset(); });
    const submit = (event: Event) => {
      // Disabled fields are omitted successful controls, never form-wide barriers.
      if (props.disabled) return;
      const result = validation(raw.current);
      const desired = pending.current ? pending.current.value : result.value;
      const allowed = !composing.current;
      flushSync(() => { latest.current.commit(); });
      const accepted = allowed && !result.error && equal(desired, current.current);
      if (!accepted) {
        event.preventDefault();
        inputs.current.find(input => input && !input.validity.valid)?.reportValidity();
      }
    };
    form.addEventListener('reset', reset); form.addEventListener('submit', submit, true);
    return () => { form.removeEventListener('reset', reset); form.removeEventListener('submit', submit, true); };
  });
  const invalid = !!error || !!props.invalid || props.error != null; const describedBy = `${id}-hint${invalid ? ` ${id}-error` : ''}`;
  const attrs = (part: string) => ({ 'data-krds-component': 'date-input', 'data-krds-part': part });
  const field = (index: number) => <input {...attrs(range ? index ? 'end-input' : 'start-input' : 'control')} ref={node => { inputs.current[index] = node; }} id={`${id}-${index}`} type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete={props.autoComplete} form={props.form} required={props.required} disabled={props.disabled} value={draft[index]} aria-describedby={describedBy} aria-invalid={invalid || undefined} data-krds-state={[invalid && 'invalid', props.disabled && 'disabled'].filter(Boolean).join(' ') || undefined}
    onChange={event => { pending.current = null; const next = [...raw.current] as [string, string]; next[index] = event.currentTarget.value; raw.current = next; setDraft(next); validity(next); }}
    onCompositionStart={() => { pending.current = null; composing.current = true; inputs.current.forEach(input => input?.setCustomValidity('')); }}
    onCompositionEnd={event => { composing.current = false; const next = [...raw.current] as [string, string]; next[index] = event.currentTarget.value; raw.current = next; setDraft(next); }}
    onInvalid={() => { if (!composing.current) setError(validation(raw.current).error); }}
    onKeyDown={event => { if (event.key === 'Enter' && !composing.current && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); commit(); } }} />;
  const dateMode = range ? { mode: 'range' as const, value: committed as { start: string | null; end: string | null } } : { mode: 'single' as const, value: committed as string | null };
  return <fieldset {...attrs('root')} ref={root} dir={env.direction} lang={locale} disabled={props.disabled} onBlur={event => { if (composing.current || open) return; const next = event.relatedTarget as Node | null; if (!next || !root.current?.contains(next)) commit(); }}>
    {range ? <legend {...attrs('label')}>{props.label}</legend> : <label {...attrs('label')} htmlFor={`${id}-0`}>{props.label}</label>}
    {range && <label htmlFor={`${id}-0`}>{t.startLabel}</label>}{field(0)}
    {range && <><label htmlFor={`${id}-1`}>{t.endLabel}</label>{field(1)}</>}
    {props.name && (range ? [0, 1] : [0]).map(index => <input key={index} type="hidden" name={range ? `${props.name}.${index ? 'end' : 'start'}` : props.name} value={pair(committed)[index] ?? ''} disabled={props.disabled} form={props.form} />)}
    {props.withCalendar !== false && <button {...attrs('trigger')} id={`${id}-trigger`} type="button" disabled={props.disabled} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-popup`} onPointerDown={event => event.preventDefault()} onClick={() => { if (!props.disabled && !composing.current) { inputs.current[0]?.ownerDocument.getElementById(`${id}-trigger`)?.focus(); setOpen(true); } }}>{t.openCalendar}</button>}
    <div {...attrs('hint')} id={`${id}-hint`}>{props.hint ?? t.formatHint}</div>
    <div {...attrs('error')} id={`${id}-error`} role="status" aria-live="polite">{error || props.error}</div>
    <Modal locale={locale} contentAttributes={{ 'data-krds-component': 'date-input', 'data-krds-part': 'popup', style: { height: 'fit-content' } }} open={open && !props.disabled} id={`${id}-popup`} title={t.calendarTitle} returnFocusId={`${id}-trigger`} onOpenChange={({ open }) => setOpen(open)} onEntryFocus={dialog => {
      const selected = dialog.querySelector<HTMLButtonElement>('button[data-date][aria-pressed="true"]:not(:disabled)');
      const first = dialog.querySelector<HTMLButtonElement>('button[data-date]:not(:disabled):not([data-krds-state~="outside-month"])');
      (selected ?? first ?? dialog.querySelector<HTMLButtonElement>('button:not(:disabled)') ?? dialog).focus();
    }}>
      {open && <Calendar {...dateMode} min={props.min} max={props.max} referenceDate={props.referenceDate} today={props.today} locale={locale} translations={{ ...props.calendarTranslations, startLabel: t.startLabel, endLabel: t.endLabel }} required={props.required} onConfirm={({ value }) => {
        // Confirm is a new deliberate action, unlike a following blur/submit phase.
        // It supersedes an earlier rejected intent, including a retry of that value.
        pending.current = null;
        commitValue(value);
        setOpen(false);
      }} onCancel={() => setOpen(false)} />}
    </Modal>
  </fieldset>;
}
