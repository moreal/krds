import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { addDays, addMonths, calendarMonthGrid, daysInMonth, formatIsoDate, parseIsoDate, weekday, type ValueChangeDetails } from '@unofficial-krds/contracts';
import { useKrdsEnvironment, type KrdsLocale } from '../../providers/index.js';
import { clone, configuration, dictionary, empty, equal, notify, pair, text, validate, type DateModeProps, type DateValue } from './model.js';
export interface CalendarTranslations { previousMonth: string; nextMonth: string; today: string; clear: string; cancel: string; confirm: string; selected: string; unavailable: string; adjacentMonth: string; dateLabel: string; visibleDayLabel: string; monthLabel: string; startLabel: string; endLabel: string; weekdayNames: string[]; weekdayShortNames: string[]; monthNames: string[]; }
const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function calendarTranslations(locale: KrdsLocale, overrides?: Partial<CalendarTranslations>): CalendarTranslations {
  const en = locale === 'en-US';
  const result = dictionary({ previousMonth: en ? 'Previous month' : '이전 달', nextMonth: en ? 'Next month' : '다음 달', today: en ? 'Today' : '오늘', clear: en ? 'Clear' : '지우기', cancel: en ? 'Cancel' : '취소', confirm: en ? 'Confirm' : '확인', selected: en ? 'Selected' : '선택됨', unavailable: en ? 'Unavailable' : '선택할 수 없음', adjacentMonth: en ? 'Outside displayed month' : '다른 달', dateLabel: en ? '{weekday}, {monthName} {day}, {year}' : '{year}년 {month}월 {day}일 {weekday}', visibleDayLabel: en ? '{day}' : '{day}일', monthLabel: en ? '{monthName} {year}' : '{year}년 {month}월', startLabel: en ? 'Start date' : '시작일', endLabel: en ? 'End date' : '종료일', weekdayNames: en ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], weekdayShortNames: en ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['일', '월', '화', '수', '목', '금', '토'], monthNames: en ? enMonths : Array.from({ length: 12 }, (_, index) => `${index + 1}월`) }, overrides);
  for (const [names, length] of [[result.weekdayNames, 7], [result.weekdayShortNames, 7], [result.monthNames, 12]] as const) if (names.length !== length || names.some(name => !name.trim())) throw new TypeError('Calendar name arrays must be complete.');
  return result;
}
export type CalendarProps = DateModeProps & { min?: string; max?: string; referenceDate?: string; today?: string; disabled?: boolean; required?: boolean; locale?: KrdsLocale; translations?: Partial<CalendarTranslations>; label?: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string; id?: string; onConfirm?: (details: ValueChangeDetails<DateValue>) => void; onCancel?: () => void; /** Popup integration focuses a selected/first date after mount. */ autoFocus?: boolean; };
export function Calendar(props: CalendarProps) {
  const environment = useKrdsEnvironment(); const locale = props.locale ?? environment.locale;
  const t = calendarTranslations(locale, props.translations); const { min, max, referenceDate } = configuration(props);
  const range = props.mode === 'range'; const initialMode = useRef(range); if (initialMode.current !== range) throw new TypeError('Calendar mode is immutable.');
  const [local, setLocal] = useState<DateValue>(() => clone(validate(props.defaultValue ?? empty(range), range, min, max)));
  const committed = validate(props.value !== undefined ? props.value : local, range, min, max);
  const firstMonth = (value: DateValue) => { const date = pair(value)[0] ?? referenceDate; return (date.slice(0, 7) < min.slice(0, 7) ? min : date.slice(0, 7) > max.slice(0, 7) ? max : date).slice(0, 7) + '-01'; };
  const [draft, setDraft] = useState<DateValue>(() => clone(committed)); const [month, setMonth] = useState(() => firstMonth(committed));
  const key = JSON.stringify(committed); const previous = useRef(key);
  const root = useRef<HTMLDivElement>(null); const pendingFocus = useRef<string | null>(null); const generatedId = useId(); const id = props.id ?? generatedId;
  useLayoutEffect(() => { if (previous.current !== key) { previous.current = key; setDraft(clone(committed)); setMonth(firstMonth(committed)); } });
  const available = (date: string | null): date is string => date !== null && date >= min && date <= max && !props.disabled;
  const focusDate = (date: string) => { pendingFocus.current = date; setMonth(date.slice(0, 7) + '-01'); const button = root.current?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`); if (button && button.dataset.month === date.slice(0, 7)) { button.focus(); pendingFocus.current = null; } };
  useLayoutEffect(() => { if (pendingFocus.current) { root.current?.querySelector<HTMLButtonElement>(`[data-date="${pendingFocus.current}"]`)?.focus(); pendingFocus.current = null; } });
  useLayoutEffect(() => {
    if (!props.autoFocus) return;
    const selected = pair(committed)[0]; const date = selected && available(selected) ? selected : calendarMonthGrid(month).find(date => available(date) && date.slice(0, 7) === month.slice(0, 7));
    if (date) root.current?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus();
    else root.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
  }, []);
  const monthAllowed = (date: string | null) => date !== null && date.slice(0, 7) >= min.slice(0, 7) && date.slice(0, 7) <= max.slice(0, 7);
  const navigate = (delta: number) => { const target = addMonths(month, delta); if (target && monthAllowed(target)) setMonth(target); };
  const [start, end] = pair(draft); const selected = (date: string) => range ? !!(start && end && date >= start && date <= end) || date === start : date === start;
  const complete = !range || (start === null && end === null) || !!(start && end);
  const canConfirm = !props.disabled && complete && (!props.required || !!start);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    if (event.nativeEvent.isComposing || event.keyCode === 229 || props.disabled) return;
    let target: string | null = null; let step = 1; let withinMonth = false; let limit: string | null = null;
    switch (event.key) {
      case 'ArrowLeft': target = addDays(date, -1); step = -1; break;
      case 'ArrowRight': target = addDays(date, 1); break;
      case 'ArrowUp': target = addDays(date, -7); step = -1; break;
      case 'ArrowDown': target = addDays(date, 7); break;
      case 'Home': target = addDays(date, -weekday(date)); limit = date; break;
      case 'End': target = addDays(date, 6 - weekday(date)); step = -1; limit = date; break;
      case 'PageUp': step = -1; target = addMonths(date, event.shiftKey ? -12 : -1); withinMonth = true; break;
      case 'PageDown': target = addMonths(date, event.shiftKey ? 12 : 1); withinMonth = true; break;
      default: return;
    }
    event.preventDefault(); const targetMonth = target?.slice(0, 7);
    while (target && !available(target)) { target = addDays(target, step); if (withinMonth && target?.slice(0, 7) !== targetMonth || limit && target && (step > 0 ? target > limit : target < limit)) return; if (target && (step > 0 ? target > max : target < min)) return; }
    if (target) focusDate(target);
  }
  const monthParts = parseIsoDate(month)!; const heading = text(t.monthLabel, { ...monthParts, monthName: t.monthNames[monthParts.month - 1] }); const grid = calendarMonthGrid(month);
  const attrs = (part: string) => ({ 'data-krds-component': 'calendar', 'data-krds-part': part });
  return <div {...attrs('root')} ref={root} id={id} dir={environment.direction} lang={locale}>
    {props.label != null && <div id={`${id}-label`}>{props.label}</div>}
    <div {...attrs('header')}><button {...attrs('previous')} type="button" disabled={props.disabled || !monthAllowed(addMonths(month, -1))} onClick={() => navigate(-1)}>{t.previousMonth}</button><h2 {...attrs('heading')} id={`${id}-heading`} aria-live="polite">{heading}</h2><button {...attrs('next')} type="button" disabled={props.disabled || !monthAllowed(addMonths(month, 1))} onClick={() => navigate(1)}>{t.nextMonth}</button></div>
    <div data-krds-component="calendar" data-krds-internal="table-scroll"><table {...attrs('table')} aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : `${id}-heading`)}><thead><tr>{t.weekdayShortNames.map((name, index) => <th {...attrs('weekday')} key={index} scope="col" aria-label={t.weekdayNames[index]}>{name}</th>)}</tr></thead><tbody>{Array.from({ length: 6 }, (_, row) => <tr key={row}>{grid.slice(row * 7, row * 7 + 7).map((date, column) => {
      if (!date) return <td {...attrs('cell')} key={column} />;
      const parts = parseIsoDate(date)!; const outside = date.slice(0, 7) !== month.slice(0, 7); const chosen = selected(date); const unavailable = !available(date); const isToday = date === props.today;
      const values = { ...parts, weekday: t.weekdayNames[weekday(date)], monthName: t.monthNames[parts.month - 1] };
      const name = [text(t.dateLabel, values), isToday && t.today, chosen && t.selected, unavailable && t.unavailable, outside && t.adjacentMonth, range && date === start && t.startLabel, range && date === end && t.endLabel].filter(Boolean).join(', ');
      return <td {...attrs('cell')} key={date}><button {...attrs('day')} type="button" data-date={date} data-month={month.slice(0, 7)} disabled={unavailable} aria-label={name} aria-current={isToday ? 'date' : undefined} aria-pressed={chosen} data-krds-state={[isToday && 'today', chosen && 'selected', outside && 'outside-month', unavailable && 'disabled', range && date === start && 'range-start', range && date === end && 'range-end', range && chosen && 'in-range'].filter(Boolean).join(' ') || undefined} onKeyDown={event => keyboard(event, date)} onClick={() => { setDraft(range ? start && !end ? { start: date < start ? date : start, end: date < start ? start : date } : { start: date, end: null } : date); if (outside) setMonth(date.slice(0, 7) + '-01'); }}>{text(t.visibleDayLabel, parts as unknown as Record<string, number>)}</button></td>;
    })}</tr>)}</tbody></table></div>
    <div {...attrs('footer')}>
      {props.today && <button {...attrs('today')} type="button" disabled={!available(props.today)} onClick={() => focusDate(props.today!)}>{t.today}</button>}
      {!props.required && <button {...attrs('clear')} type="button" disabled={props.disabled} onClick={() => setDraft(empty(range))}>{t.clear}</button>}
      <button {...attrs('cancel')} type="button" disabled={props.disabled} onClick={() => { setDraft(clone(committed)); props.onCancel?.(); }}>{t.cancel}</button>
      <button {...attrs('confirm')} type="button" disabled={!canConfirm} onClick={() => { if (!equal(draft, committed)) { if (props.value === undefined) setLocal(clone(draft)); notify(props, draft); } props.onConfirm?.({ value: clone(draft) }); if (props.value !== undefined) { setDraft(clone(committed)); setMonth(firstMonth(committed)); } }}>{t.confirm}</button>
    </div>
  </div>;
}
