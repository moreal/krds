import { booleanAttribute, afterEveryRender, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild, type OnInit, type OnChanges, type SimpleChanges } from '@angular/core';
import { addDays, addMonths, calendarMonthGrid, formatIsoDate, parseIsoDate, weekday, type DateRangeValue, type ValueChangeDetails } from '@unofficial-krds/contracts';
import { oneOf, checkBounds, checkDate, composing, ControlMode, dateFields, emptyDate, KRDS_ENVIRONMENT, same, type DateValue, type Locale } from '../../internal/behavior';
import { calendarTranslations, interpolate, type CalendarTranslations } from '../../internal/translations';
@Component({ selector: 'krds-calendar', standalone: true, host: { '[attr.id]': 'null' }, changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div #root role="group" data-krds-component="calendar" data-krds-part="root" [attr.aria-label]="label || null">
    <div data-krds-component="calendar" data-krds-part="header">
      <button type="button" data-krds-component="calendar" data-krds-part="previous" [disabled]="disabled || !canNavigate(-1)" [attr.aria-label]="t().previousMonth" (click)="navigate(-1)">‹</button>
      <h2 data-krds-component="calendar" data-krds-part="heading" [id]="id + '-heading'" aria-live="polite" aria-atomic="true">{{heading()}}</h2>
      <button type="button" data-krds-component="calendar" data-krds-part="next" [disabled]="disabled || !canNavigate(1)" [attr.aria-label]="t().nextMonth" (click)="navigate(1)">›</button>
    </div>
    <div data-krds-component="calendar" data-krds-internal="table-scroll" role="region" [attr.aria-labelledby]="id + '-heading'" tabindex="0"><table data-krds-component="calendar" data-krds-part="table" [attr.aria-labelledby]="id + '-heading'">
      <thead><tr>@for (name of t().weekdays; track $index; let index = $index) { <th scope="col" data-krds-component="calendar" data-krds-part="weekday" [attr.aria-label]="name">{{t().weekdayShort[index]}}</th> }</tr></thead>
      <tbody>@for (week of weeks(); track $index) { <tr>@for (day of week; track $index) {
        <td data-krds-component="calendar" data-krds-part="cell">@if (day) {
          <button type="button" data-krds-component="calendar" data-krds-part="day" [id]="id + '-date-' + day" [attr.data-date]="day" [disabled]="unavailable(day)" [attr.aria-label]="dayName(day)" [attr.aria-current]="day === today ? 'date' : null" [attr.aria-pressed]="selected(day)" [attr.data-krds-state]="dayState(day)" (click)="choose(day)" (keydown)="keydown($event, day)">{{visibleDay(day)}}</button>
        }</td>
      }</tr> }</tbody>
    </table></div>
    <div data-krds-component="calendar" data-krds-part="footer">
      @if (today) { <button type="button" data-krds-component="calendar" data-krds-part="today" [disabled]="unavailable(today)" (click)="goToday()">{{t().today}}</button> }
      @if (!required) { <button type="button" data-krds-component="calendar" data-krds-part="clear" [disabled]="disabled" (click)="clear()">{{t().clear}}</button> }
      <button type="button" data-krds-component="calendar" data-krds-part="cancel" [disabled]="disabled" (click)="cancel()">{{t().cancel}}</button>
      <button type="button" data-krds-component="calendar" data-krds-part="confirm" [disabled]="!canConfirm()" (click)="confirm()">{{t().confirm}}</button>
    </div>
  </div>`,
})
export class Calendar implements OnInit, OnChanges {
    @Input({ required: true })
    id = '';
    @Input()
    label = '';
    @Input()
    mode: 'single' | 'range' = 'single';
    @Input()
    value: DateValue | undefined;
    @Input()
    defaultValue: DateValue | undefined;
    @Input()
    min: string | undefined;
    @Input()
    max: string | undefined;
    @Input()
    referenceDate = '2000-01-01';
    @Input()
    today: string | undefined;
    @Input()
    locale: Locale = inject(KRDS_ENVIRONMENT).locale;
    @Input()
    translations: Partial<CalendarTranslations> = {};
    @Input({ transform: booleanAttribute })
    disabled = false;
    @Input({ transform: booleanAttribute })
    required = false;
    @Output()
    readonly valueChange = new EventEmitter<ValueChangeDetails<DateValue>>();
    @Output()
    readonly confirmed = new EventEmitter<ValueChangeDetails<DateValue>>();
    @Output()
    readonly canceled = new EventEmitter<void>();
    @ViewChild('root')
    root?: ElementRef<HTMLElement>;
    readonly tentative = signal<DateValue>(null);
    readonly month = signal('2000-01-01');
    private readonly local = signal<DateValue>(null);
    private readonly controlMode = new ControlMode();
    private initialMode = 'single';
    private initialized = false;
    private pendingFocus: string | null = null;
    constructor() { afterEveryRender(() => { if (this.pendingFocus && this.root) {
        this.root.nativeElement.querySelector<HTMLElement>(`[data-date="${this.pendingFocus}"]`)?.focus();
        this.pendingFocus = null;
    } }); }
    ngOnInit(): void { this.initialMode = this.mode; this.controlMode.check(this.value, this.defaultValue); this.local.set(this.defaultValue === undefined ? emptyDate(this.mode) : this.defaultValue); this.initialized = true; this.validate(); this.resetDraft(); }
    ngOnChanges(changes: SimpleChanges): void { if (!this.initialized)
        return; if (this.mode !== this.initialMode)
        throw new TypeError('Calendar mode is immutable.'); this.controlMode.check(this.value, this.defaultValue); this.validate(); if (changes['value'])
        this.resetDraft(); }
    private validate(): void { oneOf(this.mode, ['single', 'range'], 'calendar mode'); checkBounds(this.min, this.max, this.referenceDate, this.today); checkDate(this.current(), this.mode, this.min, this.max); this.t(); }
    current(): DateValue { return this.value === undefined ? this.local() : this.value; }
    t(): CalendarTranslations { return calendarTranslations(this.locale, this.translations); }
    private resetDraft(): void { this.tentative.set(this.current()); const source = dateFields(this.current())[0] || this.referenceDate; this.month.set((source < (this.min ?? '0001-01-01') ? this.min! : source > (this.max ?? '9999-12-31') ? this.max! : source).slice(0, 7) + '-01'); }
    weeks(): ReadonlyArray<ReadonlyArray<string | null>> { const cells = calendarMonthGrid(this.month()); return Array.from({ length: 6 }, (_, i) => cells.slice(i * 7, i * 7 + 7)); }
    private values(day: string): Record<string, string | number> { const parts = parseIsoDate(day)!; return { ...parts, weekday: this.t().weekdays[weekday(day)], monthName: this.t().months[parts.month - 1] }; }
    heading(): string { return interpolate(this.t().monthLabel, this.values(this.month())); }
    visibleDay(day: string): string { return interpolate(this.t().visibleDayLabel, this.values(day)); }
    unavailable(day: string): boolean { return this.disabled || !!this.min && day < this.min || !!this.max && day > this.max; }
    selected(day: string): boolean { const [start, end] = dateFields(this.tentative()); return this.mode === 'single' ? start === day : !!start && (end ? day >= start && day <= end : day === start); }
    dayState(day: string): string { const [start, end] = dateFields(this.tentative()); return [day === this.today && 'today', this.selected(day) && 'selected', this.mode === 'range' && start === day && 'range-start', this.mode === 'range' && end === day && 'range-end', this.mode === 'range' && !!start && !!end && day > start && day < end && 'in-range', day.slice(0, 7) !== this.month().slice(0, 7) && 'outside-month', this.unavailable(day) && 'disabled'].filter(Boolean).join(' '); }
    dayName(day: string): string { const t = this.t(); const [start, end] = dateFields(this.tentative()); return [interpolate(t.dateLabel, this.values(day)), day === this.today && t.today, this.selected(day) && t.selected, this.unavailable(day) && t.unavailable, day.slice(0, 7) !== this.month().slice(0, 7) && t.adjacentMonth, this.mode === 'range' && start === day && t.startLabel, this.mode === 'range' && end === day && t.endLabel].filter(Boolean).join(', '); }
    choose(day: string): void { if (this.unavailable(day))
        return; if (this.mode === 'single')
        this.tentative.set(day);
    else {
        const [start, end] = dateFields(this.tentative());
        this.tentative.set(!start || end ? { start: day, end: null } : { start: start < day ? start : day, end: start < day ? day : start });
    } this.month.set(day.slice(0, 7) + '-01'); }
    clear(): void { if (!this.disabled && !this.required)
        this.tentative.set(emptyDate(this.mode)); }
    canConfirm(): boolean { try { checkDate(this.tentative(), this.mode, this.min, this.max); } catch { return false; } if (this.disabled)
        return false; const [start, end] = dateFields(this.tentative()); return !(this.required && !start) && !(this.mode === 'range' && !!start !== !!end); }
    confirm(): void { if (!this.canConfirm())
        return; const value = this.tentative(); if (!same(value, this.current())) {
        if (this.value === undefined)
            this.local.set(value);
        this.valueChange.emit({ value });
    } this.confirmed.emit({ value }); if (this.value !== undefined)
        this.tentative.set(this.value); }
    cancel(): void { if (!this.disabled) {
        this.tentative.set(this.current());
        this.canceled.emit();
    } }
    canNavigate(delta: number): boolean { const target = addMonths(this.month(), delta); if (!target)
        return false; const next = addMonths(target, 1); const last = next ? addDays(next, -1)! : '9999-12-31'; return target <= (this.max ?? '9999-12-31') && last >= (this.min ?? '0001-01-01'); }
    navigate(delta: number): void { if (!this.disabled && this.canNavigate(delta))
        this.month.set(addMonths(this.month(), delta)!); }
    goToday(): void { if (this.today && !this.unavailable(this.today))
        this.moveFocus(this.today); }
    private moveFocus(day: string): void { this.month.set(day.slice(0, 7) + '-01'); this.pendingFocus = day; }
    keydown(event: KeyboardEvent, day: string): void {
        if (this.disabled || composing(event))
            return;
        let target: string | null = null;
        let direction = 1;
        let weekOnly = false;
        let monthOnly = false;
        switch (event.key) {
            case 'ArrowLeft':
                direction = -1;
                target = addDays(day, -1);
                break;
            case 'ArrowRight':
                target = addDays(day, 1);
                break;
            case 'ArrowUp':
                direction = -1;
                target = addDays(day, -7);
                break;
            case 'ArrowDown':
                target = addDays(day, 7);
                break;
            case 'Home':
                direction = 1;
                target = addDays(day, -weekday(day));
                weekOnly = true;
                break;
            case 'End':
                direction = -1;
                target = addDays(day, 6 - weekday(day));
                weekOnly = true;
                break;
            case 'PageUp':
                direction = -1;
                target = addMonths(day, event.shiftKey ? -12 : -1);
                monthOnly = true;
                break;
            case 'PageDown':
                target = addMonths(day, event.shiftKey ? 12 : 1);
                monthOnly = true;
                break;
            default: return;
        }
        event.preventDefault();
        const month = target?.slice(0, 7);
        const weekStart = addDays(day, -weekday(day)) ?? '0001-01-01';
        const weekEnd = addDays(day, 6 - weekday(day)) ?? '9999-12-31';
        while (target && this.unavailable(target)) {
            if (direction < 0 && target < (this.min ?? '0001-01-01') || direction > 0 && target > (this.max ?? '9999-12-31'))
                return;
            target = addDays(target, direction);
            if (!target || monthOnly && target.slice(0, 7) !== month || weekOnly && (target < weekStart || target > weekEnd))
                return;
        }
        if (target)
            this.moveFocus(target);
    }
}
