import { For, Show, createEffect, createMemo, createSignal, createUniqueId, on, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { addDays, addMonths, calendarMonthGrid, parseIsoDate, weekday } from '@unofficial-krds/contracts';
import type { DateRangeValue, ValueChangeDetails } from '@unofficial-krds/contracts';
import { useKrdsEnvironment } from '../../providers';
import { copyValue, dateConfig, emptyValue, endpoints, interpolate, nonemptyDictionary, notifyValue, sameValue, validateValue } from './model';
import type { DateModeProps, DateValue } from './model';

export interface CalendarTranslations {
  previousMonth: string; nextMonth: string; today: string; clear: string; cancel: string; confirm: string;
  selected: string; unavailable: string; adjacentMonth: string; dateLabel: string; monthLabel: string; visibleDayLabel: string;
  startLabel: string; endLabel: string; weekdays: readonly string[]; weekdayShort: readonly string[]; months: readonly string[];
}
const englishMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dictionaries: Record<'ko-KR'|'en-US', CalendarTranslations> = {
  'ko-KR': { previousMonth:'이전 달', nextMonth:'다음 달', today:'오늘', clear:'지우기', cancel:'취소', confirm:'확인', selected:'선택됨', unavailable:'선택할 수 없음', adjacentMonth:'다른 달', dateLabel:'{year}년 {month}월 {day}일 {weekday}', monthLabel:'{year}년 {month}월', visibleDayLabel:'{day}일', startLabel:'시작일', endLabel:'종료일', weekdays:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], weekdayShort:['일','월','화','수','목','금','토'], months:englishMonths },
  'en-US': { previousMonth:'Previous month', nextMonth:'Next month', today:'Today', clear:'Clear', cancel:'Cancel', confirm:'Confirm', selected:'Selected', unavailable:'Unavailable', adjacentMonth:'Outside displayed month', dateLabel:'{weekday}, {monthName} {day}, {year}', monthLabel:'{monthName} {year}', visibleDayLabel:'{day}', startLabel:'Start date', endLabel:'End date', weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], weekdayShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], months:englishMonths },
};
interface CalendarBaseProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'|'onChange'|'onInput'|'onSelect'> {
  label?: JSX.Element; min?: string; max?: string; disabled?: boolean; required?: boolean;
  locale?: 'ko-KR'|'en-US'; translations?: Partial<CalendarTranslations>; referenceDate?: string; today?: string;
  onCancel?: () => void;
}
export type CalendarProps = CalendarBaseProps & (DateModeProps extends infer P ? P extends { mode?: 'single' } ? P & { onConfirm?: (details:ValueChangeDetails<string|null>) => void } : P & { onConfirm?: (details:ValueChangeDetails<DateRangeValue>) => void } : never);

/** A native Solid date selector. Selection remains tentative until Confirm. */
export function Calendar(props: CalendarProps): JSX.Element {
  const environment = useKrdsEnvironment();
  const [, native] = splitProps(props, ['mode','value','defaultValue','onValueChange','onConfirm','onCancel','label','min','max','disabled','required','locale','translations','referenceDate','today','id','class','style','dir','aria-label','aria-labelledby','ref']);
  if (!props.label && !props['aria-label'] && !props['aria-labelledby']) throw new TypeError('Calendar requires an accessible label.');
  const range = props.mode === 'range';
  const controlled = props.value !== undefined;
  if (props.mode !== undefined && props.mode !== 'single' && props.mode !== 'range') throw new TypeError('Invalid date mode.');
  if (controlled && props.defaultValue !== undefined) throw new TypeError('value and defaultValue are mutually exclusive.');
  const config = createMemo(() => dateConfig(props));
  const initial = copyValue(validateValue(props.value !== undefined ? props.value : props.defaultValue ?? emptyValue(range), range, config().min, config().max));
  const [internal, setInternal] = createSignal<DateValue>(initial);
  const committed = createMemo(() => {
    if ((props.mode === 'range') !== range || (props.value !== undefined) !== controlled) throw new TypeError('Date mode and control mode are immutable.');
    return validateValue(controlled ? props.value! : internal(), range, config().min, config().max);
  });
  const [draft, setDraft] = createSignal<DateValue>(copyValue(initial));
  const initialMonth = (value: DateValue) => {
    const target = endpoints(value)[0] ?? config().referenceDate;
    return `${(target < config().min ? config().min : target > config().max ? config().max : target).slice(0,7)}-01`;
  };
  const [month, setMonth] = createSignal(initialMonth(initial));
  createEffect(on(committed, value => { setDraft(copyValue(value)); setMonth(initialMonth(value)); }, { defer: true }));
  const translations = createMemo(() => {
    const locale = props.locale ?? environment.locale();
    if (!(locale in dictionaries)) throw new TypeError('Unsupported locale.');
    const result = nonemptyDictionary(dictionaries[locale], props.translations);
    for (const [key, length] of [['weekdays',7],['weekdayShort',7],['months',12]] as const) {
      if (!Array.isArray(result[key]) || result[key].length !== length || result[key].some(value => typeof value !== 'string' || !value.trim())) throw new TypeError(`Invalid ${key} translation list.`);
    }
    return result;
  });
  const heading = createMemo(() => {
    const date = parseIsoDate(month())!;
    return interpolate(translations().monthLabel, { ...date, monthName: translations().months[date.month-1] });
  });
  const grid = createMemo(() => calendarMonthGrid(month()));
  const selectable = (date: string) => !props.disabled && date >= config().min && date <= config().max;
  const navigationMonth = (delta: number) => {
    const target = addMonths(month(),delta);
    if (!target) return null;
    const next = addMonths(target,1);
    const last = next ? addDays(next,-1)! : '9999-12-31';
    return target <= config().max && last >= config().min ? target : null;
  };
  const selected = (date: string) => {
    const [start,end] = endpoints(draft());
    return start !== null && (range ? date >= start && date <= (end ?? start) : date === start);
  };
  const states = (date: string) => {
    const [start,end] = endpoints(draft());
    return [date === props.today && 'today', selected(date) && 'selected', range && date === start && 'range-start', range && date === end && 'range-end', range && start && end && date > start && date < end && 'in-range', date.slice(0,7) !== month().slice(0,7) && 'outside-month', !selectable(date) && 'disabled'].filter(Boolean).join(' ');
  };
  const dateName = (date: string) => {
    const parts = parseIsoDate(date)!;
    const t = translations();
    const [start,end] = endpoints(draft());
    return [interpolate(t.dateLabel, { ...parts, weekday:t.weekdays[weekday(date)], monthName:t.months[parts.month-1] }), date === props.today && t.today, selected(date) && t.selected, !selectable(date) && t.unavailable, date.slice(0,7) !== month().slice(0,7) && t.adjacentMonth, range && date === start && t.startLabel, range && date === end && t.endLabel].filter(Boolean).join(', ');
  };
  let root!: HTMLDivElement;
  const id = props.id ?? createUniqueId();
  function focusDate(date: string) {
    setMonth(`${date.slice(0,7)}-01`);
    queueMicrotask(() => root?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus());
  }
  function activate(date: string) {
    if (!selectable(date)) return;
    if (!range) setDraft(date);
    else {
      const [start,end] = endpoints(draft());
      setDraft(!start || end ? { start:date,end:null } : { start:date < start ? date : start, end:date > start ? date : start });
    }
    if (date.slice(0,7) !== month().slice(0,7)) focusDate(date);
  }
  function keydown(event: KeyboardEvent, date: string) {
    if (props.disabled || event.isComposing || event.keyCode === 229) return;
    let target: string|null = null, direction = 1, targetMonth: string|undefined;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const delta = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key as 'ArrowLeft'];
      direction = Math.sign(delta); target = addDays(date,delta);
    } else if (event.key === 'Home' || event.key === 'End') {
      direction = event.key === 'Home' ? 1 : -1;
      target = addDays(date,event.key === 'Home' ? -weekday(date) : 6-weekday(date));
      const limit = addDays(date,event.key === 'Home' ? 6-weekday(date) : -weekday(date));
      while (target && !selectable(target) && target !== limit) target = addDays(target,direction);
      event.preventDefault(); if (target && selectable(target)) focusDate(target); return;
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      direction = event.key === 'PageUp' ? -1 : 1;
      target = addMonths(date,direction*(event.shiftKey ? 12 : 1)); targetMonth = target?.slice(0,7);
    } else return;
    event.preventDefault();
    while (target && !selectable(target)) {
      if ((direction < 0 && target < config().min) || (direction > 0 && target > config().max)) return;
      target = addDays(target,direction);
      if (targetMonth && target?.slice(0,7) !== targetMonth) return;
    }
    if (target && selectable(target)) focusDate(target);
  }
  const canConfirm = () => {
    if (props.disabled) return false;
    const [start,end] = endpoints(draft());
    return start === null ? !props.required : selectable(start) && (!range || end !== null && selectable(end));
  };
  function confirm() {
    if (!canConfirm()) return;
    const value = copyValue(draft());
    if (!sameValue(value,committed())) {
      if (!controlled) setInternal(copyValue(value));
      notifyValue(props,value);
    }
    (props.onConfirm as ((detail:ValueChangeDetails<DateValue>)=>void)|undefined)?.({ value:copyValue(value) });
    if (controlled) { setDraft(copyValue(committed())); setMonth(initialMonth(committed())); }
  }
  const attr = (part:string, state='') => ({ 'data-krds-component':'calendar', 'data-krds-part':part, 'data-krds-state':state });
  return <div {...native} ref={element => { root=element; if (typeof props.ref==='function') props.ref(element); }} id={id} class={props.class} style={props.style} dir={props.dir ?? environment.direction()} role="group" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label ? `${id}-label` : undefined)} {...attr('root',props.disabled ? 'disabled' : '')}>
    <Show when={props.label}><div id={`${id}-label`}>{props.label}</div></Show>
    <div {...attr('header')}><button type="button" {...attr('previous',props.disabled || !navigationMonth(-1) ? 'disabled' : '')} aria-label={translations().previousMonth} disabled={props.disabled || !navigationMonth(-1)} onClick={() => { const target=navigationMonth(-1); if (!props.disabled && target) setMonth(target); }}>‹</button><h2 id={`${id}-heading`} aria-live="polite" aria-atomic="true" {...attr('heading')}>{heading()}</h2><button type="button" {...attr('next',props.disabled || !navigationMonth(1) ? 'disabled' : '')} aria-label={translations().nextMonth} disabled={props.disabled || !navigationMonth(1)} onClick={() => { const target=navigationMonth(1); if (!props.disabled && target) setMonth(target); }}>›</button></div>
    <div data-krds-component="calendar" data-krds-internal="table-scroll" role="region" aria-labelledby={`${id}-heading`} tabIndex={0}>
    <table aria-labelledby={`${id}-heading`} {...attr('table')}><thead><tr><For each={translations().weekdays}>{(name,index) => <th scope="col" aria-label={name} {...attr('weekday')}>{translations().weekdayShort[index()]}</th>}</For></tr></thead><tbody><For each={[0,1,2,3,4,5]}>{row => <tr><For each={grid().slice(row*7,row*7+7)}>{date => <td {...attr('cell')}><Show when={date}>{date => <button type="button" data-date={date()} {...attr('day',states(date()))} aria-label={dateName(date())} aria-current={date() === props.today ? 'date' : undefined} aria-pressed={selected(date())} disabled={!selectable(date())} onKeyDown={event => keydown(event,date())} onClick={() => activate(date())}>{interpolate(translations().visibleDayLabel,{...parseIsoDate(date())!})}</button>}</Show></td>}</For></tr>}</For></tbody></table>
    </div>
    <div {...attr('footer')}><Show when={props.today}><button type="button" {...attr('today',!selectable(props.today!) ? 'disabled' : '')} disabled={!selectable(props.today!)} onClick={() => { if (props.today && selectable(props.today)) focusDate(props.today); }}>{translations().today}</button></Show><Show when={!props.required}><button type="button" {...attr('clear',props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick={() => { if (!props.disabled) setDraft(emptyValue(range)); }}>{translations().clear}</button></Show><button type="button" {...attr('cancel',props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick={() => { if (!props.disabled) { setDraft(copyValue(committed())); setMonth(initialMonth(committed())); props.onCancel?.(); } }}>{translations().cancel}</button><button type="button" {...attr('confirm',!canConfirm() ? 'disabled' : '')} disabled={!canConfirm()} onClick={confirm}>{translations().confirm}</button></div>
  </div>;
}
