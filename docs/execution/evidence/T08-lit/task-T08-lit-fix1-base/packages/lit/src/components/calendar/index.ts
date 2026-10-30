import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { addDays, addMonths, calendarMonthGrid, parseIsoDate, weekday, daysInMonth, formatIsoDate } from '@unofficial-krds/contracts';
import type { DateRangeValue } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState } from '../base.js';
import { empty, equal, validateValue, translations, template, type DateValue, type CalendarTranslations } from './model.js';
export class Calendar extends KrdsElement {
    static override properties = { mode: { type: String }, value: { attribute: false }, defaultValue: { attribute: false }, min: { type: String }, max: { type: String }, disabled: { type: Boolean }, required: { type: Boolean }, referenceDate: { attribute: 'reference-date' }, today: { type: String }, translations: { attribute: false }, tentative: { state: true }, view: { state: true } };
    declare mode: 'single' | 'range';
    declare value: DateValue | undefined;
    declare defaultValue: DateValue | undefined;
    declare min: string | undefined;
    declare max: string | undefined;
    declare disabled: boolean;
    declare required: boolean;
    declare referenceDate: string;
    declare today: string | undefined;
    declare translations: Partial<CalendarTranslations>;
    declare private tentative: DateValue;
    declare private view: string;
    private state = new ValueState<DateValue>();
    private previous: DateValue | undefined;
    private initialMode?: string;
    constructor() { super(); this.mode = 'single'; this.disabled = false; this.required = false; this.referenceDate = '2000-01-01'; this.translations = {}; this.tentative = null; this.view = '2000-01-01'; }
    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => empty(this.mode)); validateValue(value, this.mode, this.min, this.max); return value; }
    override willUpdate(_changed: PropertyValues) {
        if (this.initialMode && this.mode !== this.initialMode)
            throw new TypeError('Calendar mode is immutable');
        this.initialMode = this.mode;
        if (!parseIsoDate(this.referenceDate) || (this.today !== undefined && !parseIsoDate(this.today)))
            throw new RangeError('Invalid calendar reference date');
        const committed = this.committedValue;
        if (this.previous === undefined || !equal(committed, this.previous)) {
            this.previous = structuredClone(committed);
            this.tentative = structuredClone(committed);
            const start = typeof committed === 'string' ? committed : committed && 'start' in committed ? committed.start : null;
            this.view = start ?? this.referenceDate;
            if (this.min && this.view.slice(0, 7) < this.min.slice(0, 7))
                this.view = this.min;
            if (this.max && this.view.slice(0, 7) > this.max.slice(0, 7))
                this.view = this.max;
        }
    }
    private unavailable(date: string) { return this.disabled || !!(this.min && date < this.min) || !!(this.max && date > this.max); }
    private selected(date: string) { if (typeof this.tentative === 'string')
        return date === this.tentative; if (!this.tentative)
        return false; return !!this.tentative.start && date >= this.tentative.start && date <= (this.tentative.end ?? this.tentative.start); }
    private select(date: string) { if (this.unavailable(date))
        return; if (this.mode === 'single')
        this.tentative = date;
    else {
        const range = this.tentative as DateRangeValue;
        if (!range.start || range.end)
            this.tentative = { start: date, end: null };
        else
            this.tentative = { start: range.start < date ? range.start : date, end: range.start < date ? date : range.start };
    } this.view = date; }
    private canConfirm() { try {
        validateValue(this.tentative, this.mode, this.min, this.max);
        if (this.required && (this.tentative === null || (typeof this.tentative === 'object' && !this.tentative.start)))
            return false;
        return !this.disabled;
    }
    catch {
        return false;
    } }
    private confirm() { if (!this.canConfirm())
        return; const value = structuredClone(this.tentative); if (!equal(value, this.committedValue)) {
        this.state.set(value);
        this.emit('value-change', { value });
    } this.emit('confirm', { value }); this.requestUpdate(); }
    private navigate(delta: number) { const target = addMonths(this.view, delta); if (!target)
        return; const p = parseIsoDate(target)!; const end = formatIsoDate({ ...p, day: daysInMonth(p.year, p.month) }), start = formatIsoDate({ ...p, day: 1 }); if ((this.min && end < this.min) || (this.max && start > this.max))
        return; this.view = target; }
    private canNavigate(delta: number) { const target = addMonths(this.view, delta); if (!target)
        return false; const p = parseIsoDate(target)!; return !this.disabled && !(this.min && formatIsoDate({ ...p, day: daysInMonth(p.year, p.month) }) < this.min) && !(this.max && formatIsoDate({ ...p, day: 1 }) > this.max); }
    async focusDate(date: string) { this.view = date; await this.updateComplete; this.renderRoot.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus(); }
    private key = (event: KeyboardEvent, date: string) => {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
            return;
        let target: string | null = null;
        let direction = 1;
        let limitMonth: string | undefined;
        if (event.key === 'ArrowLeft') {
            target = addDays(date, -1);
            direction = -1;
        }
        else if (event.key === 'ArrowRight')
            target = addDays(date, 1);
        else if (event.key === 'ArrowUp') {
            target = addDays(date, -7);
            direction = -1;
        }
        else if (event.key === 'ArrowDown')
            target = addDays(date, 7);
        else if (event.key === 'Home') {
            target = addDays(date, -weekday(date));
            direction = 1;
        }
        else if (event.key === 'End') {
            target = addDays(date, 6 - weekday(date));
            direction = -1;
        }
        else if (event.key === 'PageUp' || event.key === 'PageDown') {
            direction = event.key === 'PageUp' ? -1 : 1;
            target = addMonths(date, direction * (event.shiftKey ? 12 : 1));
            limitMonth = target?.slice(0, 7);
        }
        else
            return;
        event.preventDefault();
        while (target && this.unavailable(target)) {
            const next = addDays(target, direction);
            if (!next || limitMonth && next.slice(0, 7) !== limitMonth || ['Home', 'End'].includes(event.key) && Math.abs(weekday(next) - weekday(date)) > 6) {
                target = null;
                break;
            }
            if (this.min && next < this.min || this.max && next > this.max) {
                target = null;
                break;
            }
            target = next;
        }
        if (target)
            void this.focusDate(target);
    };
    override render() {
        const t = translations(this.locale, this.translations), p = parseIsoDate(this.view)!;
        const parts = { year: p.year, month: p.month, monthName: t.monthNames[p.month - 1] };
        const heading = template(t.monthLabel, parts);
        const grid = calendarMonthGrid(this.view);
        const range = typeof this.tentative === 'object' ? this.tentative : null;
        return html `<section data-krds-component="calendar" data-krds-part="root" part="root" data-krds-state=${this.disabled ? 'disabled' : ''} aria-label=${this.label || (this.locale === 'ko-KR' ? '날짜 선택' : 'Choose date')}><div data-krds-component="calendar" data-krds-part="header" part="header" data-krds-state=""><button data-krds-component="calendar" data-krds-part="previous" part="previous" data-krds-state="" type="button" ?disabled=${!this.canNavigate(-1)} @click=${() => this.navigate(-1)}>${t.previousMonth}</button><h2 data-krds-component="calendar" data-krds-part="heading" part="heading" data-krds-state="" id="heading" aria-live="polite">${heading}</h2><button data-krds-component="calendar" data-krds-part="next" part="next" data-krds-state="" type="button" ?disabled=${!this.canNavigate(1)} @click=${() => this.navigate(1)}>${t.nextMonth}</button></div>
  <div data-krds-component="calendar" data-krds-internal="table-scroll"><table data-krds-component="calendar" data-krds-part="table" part="table" data-krds-state="" aria-labelledby="heading"><thead><tr>${t.weekdayNames.map(name => html `<th data-krds-component="calendar" data-krds-part="weekday" part="weekday" data-krds-state="" scope="col" aria-label=${name}>${this.locale === 'ko-KR' ? name.slice(0, 1) : name.slice(0, 3)}</th>`)}</tr></thead><tbody>${Array.from({ length: 6 }, (_, row) => html `<tr>${grid.slice(row * 7, row * 7 + 7).map(date => {
            if (!date)
                return html `<td data-krds-component="calendar" data-krds-part="cell" part="cell" data-krds-state=""></td>`;
            const day = parseIsoDate(date)!;
            const outside = date.slice(0, 7) !== this.view.slice(0, 7);
            const selected = this.selected(date);
            const disabled = this.unavailable(date);
            const start = range?.start === date, end = range?.end === date;
            const state = [this.today === date ? 'today' : '', selected ? 'selected' : '', start ? 'range-start' : '', end ? 'range-end' : '', selected && range && !start && !end ? 'in-range' : '', outside ? 'outside-month' : '', disabled ? 'disabled' : ''].filter(Boolean).join(' ');
            const base = template(t.dateLabel, { year: day.year, month: day.month, day: day.day, weekday: t.weekdayNames[weekday(date)], monthName: t.monthNames[day.month - 1] });
            const name = [base, this.today === date ? t.today : '', selected ? t.selected : '', disabled ? t.unavailable : '', outside ? t.adjacentMonth : '', start ? t.startLabel : '', end ? t.endLabel : ''].filter(Boolean).join(', ');
            return html `<td data-krds-component="calendar" data-krds-part="cell" part="cell" data-krds-state=""><button data-krds-component="calendar" data-krds-part="day" part="day" data-krds-state=${state} type="button" data-date=${date} tabindex=${disabled ? -1 : 0} ?disabled=${disabled} aria-label=${name} aria-pressed=${String(selected)} aria-current=${ifDefined(this.today === date ? 'date' : undefined)} @click=${() => this.select(date)} @keydown=${(event: KeyboardEvent) => this.key(event, date)}>${template(t.visibleDayLabel, { year: day.year, month: day.month, day: day.day })}</button></td>`;
        })}</tr>`)}</tbody></table></div><div data-krds-component="calendar" data-krds-part="footer" part="footer" data-krds-state="">
   ${this.today ? html `<button data-krds-component="calendar" data-krds-part="today" part="today" data-krds-state="" type="button" ?disabled=${this.unavailable(this.today)} @click=${() => this.focusDate(this.today!)}>${t.today}</button>` : ''}
   ${!this.required ? html `<button data-krds-component="calendar" data-krds-part="clear" part="clear" data-krds-state="" type="button" ?disabled=${this.disabled} @click=${() => { this.tentative = empty(this.mode); }}>${t.clear}</button>` : ''}
   <button data-krds-component="calendar" data-krds-part="cancel" part="cancel" data-krds-state="" type="button" ?disabled=${this.disabled} @click=${() => { this.tentative = structuredClone(this.committedValue); this.emit('cancel', {}); }}>${t.cancel}</button><button data-krds-component="calendar" data-krds-part="confirm" part="confirm" data-krds-state="" type="button" ?disabled=${!this.canConfirm()} @click=${() => this.confirm()}>${t.confirm}</button></div></section>`;
    }
}
