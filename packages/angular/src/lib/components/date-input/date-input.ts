import { booleanAttribute, afterEveryRender, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, inject, Input, Output, signal, ViewChild, type OnInit, type OnChanges, type OnDestroy, type SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, type AbstractControl, type ControlValueAccessor, type ValidationErrors, type Validator } from '@angular/forms';
import { parseIsoDate, type ValueChangeDetails } from '@unofficial-krds/contracts';
import { oneOf, checkBounds, checkDate, composing, ControlMode, dateFields, emptyDate, KRDS_ENVIRONMENT, same, type DateValue, type Locale } from '../../internal/behavior';
import { dateTranslations, interpolate, type DateInputTranslations, type CalendarTranslations } from '../../internal/translations';
import { Calendar } from '../calendar/calendar';
import { Modal } from '../modal/modal';
@Component({ selector: 'krds-date-input', standalone: true, host: { '[attr.id]': 'null' }, imports: [Calendar, Modal], changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateInput), multi: true }, { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateInput), multi: true }],
    template: `<div #root data-krds-component="date-input" data-krds-part="root" [attr.data-krds-state]="state()" (focusout)="groupBlur($event)">
    <fieldset [attr.aria-labelledby]="mode === 'range' ? id + '-legend' : null" style="border:0;padding:0;margin:0;min-width:0">
      @if (mode === 'range') { <legend data-krds-component="date-input" data-krds-part="label" [id]="id + '-legend'">{{label}}</legend> }
      <label data-krds-component="date-input" data-krds-part="label" [for]="id">{{mode === 'range' ? t().startLabel : label}}</label>
      <input #start type="text" inputmode="numeric" placeholder="YYYY-MM-DD" data-krds-component="date-input" [attr.data-krds-part]="mode === 'single' ? 'control' : 'start-input'" [id]="id" [value]="raw()[0]" [disabled]="isDisabled()" [required]="required" [attr.form]="form || null" [attr.autocomplete]="autocomplete || null" [attr.aria-describedby]="describedBy()" [attr.aria-invalid]="fieldInvalid(0) ? 'true' : null" [attr.data-krds-state]="fieldState(0)" (invalid)="announceInvalidDraft()" (input)="edit($event, 0)" (keydown)="keydown($event)" (compositionstart)="beginComposition()" (compositionend)="endComposition($event, 0)" />
      @if (mode === 'range') {
        <label data-krds-component="date-input" data-krds-part="label" [for]="id + '-end'">{{t().endLabel}}</label>
        <input #end type="text" inputmode="numeric" placeholder="YYYY-MM-DD" data-krds-component="date-input" data-krds-part="end-input" [id]="id + '-end'" [value]="raw()[1]" [disabled]="isDisabled()" [required]="required" [attr.form]="form || null" [attr.autocomplete]="autocomplete || null" [attr.aria-describedby]="describedBy()" [attr.aria-invalid]="fieldInvalid(1) ? 'true' : null" [attr.data-krds-state]="fieldState(1)" (invalid)="announceInvalidDraft()" (input)="edit($event, 1)" (keydown)="keydown($event)" (compositionstart)="beginComposition()" (compositionend)="endComposition($event, 1)" />
      }
      @if (withCalendar) { <button type="button" data-krds-component="date-input" data-krds-part="trigger" [id]="id + '-trigger'" [disabled]="isDisabled()" aria-haspopup="dialog" [attr.aria-expanded]="popup()" [attr.aria-controls]="popup() ? id + '-popup' : null" [attr.aria-label]="mode === 'range' ? label + ': ' + t().openCalendar : t().openCalendar" [attr.data-krds-state]="popup() ? 'open' : 'closed'" (click)="openCalendar()">{{t().openCalendar}}</button> }
    </fieldset>
    <p data-krds-component="date-input" data-krds-part="hint" [id]="id + '-hint'">{{hint || t().formatHint}}</p>
    @if (message()) { <p data-krds-component="date-input" data-krds-part="error" [id]="id + '-error'">{{message()}}</p> }
    <span role="status" aria-live="polite" class="krds-angular-status">{{announcement()}}</span>
    @if (name) {
      <input type="hidden" [name]="mode === 'single' ? name : name + '.start'" [value]="fields()[0]" [disabled]="isDisabled()" [attr.form]="form || null" />
      @if (mode === 'range') { <input type="hidden" [name]="name + '.end'" [value]="fields()[1]" [disabled]="isDisabled()" [attr.form]="form || null" /> }
    }
    <krds-modal #popupModal [id]="id + '-popup'" [title]="t().calendarTitle" [open]="popup()" [returnFocusId]="id + '-trigger'" (openChange)="popup.set($event.open)">
      @if (popup()) { <div data-krds-component="date-input" data-krds-part="popup" data-krds-state="open" class="krds-angular-popup-content"><krds-calendar [id]="id + '-calendar'" [label]="t().calendarTitle" [mode]="mode" [value]="current()" [min]="min" [max]="max" [required]="required" [locale]="locale" [translations]="calendarTranslations" [referenceDate]="referenceDate" [today]="today" (confirmed)="confirmCalendar($event.value)" (canceled)="closeCalendar()" /></div> }
    </krds-modal>
  </div>`,
    styles: [`.krds-angular-popup-content { position:static; inline-size:auto; max-inline-size:100%; max-block-size:none; padding:0; margin:0; overflow:visible; border:0; border-radius:0; background:transparent; color:inherit; } fieldset { display:flex; flex-wrap:wrap; align-items:center; gap:var(--krds-gap-2); max-inline-size:100%; } input[type="text"] { max-inline-size:100%; } label { flex-basis:100%; } .krds-angular-status { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }`],
})
export class DateInput implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {
    @Input({ required: true })
    id = '';
    @Input({ required: true })
    label = '';
    @Input()
    mode: 'single' | 'range' = 'single';
    @Input()
    value: DateValue | undefined;
    @Input()
    defaultValue: DateValue | undefined;
    @Input()
    name = '';
    @Input()
    form = '';
    @Input()
    autocomplete = '';
    @Input({ transform: booleanAttribute })
    required = false;
    @Input({ transform: booleanAttribute })
    disabled = false;
    @Input({ transform: booleanAttribute })
    invalid = false;
    @Input()
    error = '';
    @Input()
    hint = '';
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
    translations: Partial<DateInputTranslations> = {};
    @Input()
    calendarTranslations: Partial<CalendarTranslations> = {};
    @Input({ transform: booleanAttribute })
    withCalendar = true;
    @Output()
    readonly valueChange = new EventEmitter<ValueChangeDetails<DateValue>>();
    @ViewChild('popupModal')
    popupModal?: Modal;
    @ViewChild('root')
    root?: ElementRef<HTMLElement>;
    @ViewChild('start')
    start?: ElementRef<HTMLInputElement>;
    @ViewChild('end')
    end?: ElementRef<HTMLInputElement>;
    readonly raw = signal<[
        string,
        string
    ]>(['', '']);
    readonly localError = signal('');
    readonly announcement = signal('');
    readonly popup = signal(false);
    readonly formDisabled = signal(false);
    private readonly local = signal<DateValue>(null);
    private readonly controlMode = new ControlMode();
    private initialMode: 'single' | 'range' = 'single';
    private baseline: DateValue = null;
    private forms = false;
    private initialized = false;
    private isComposing = false;
    private awaitingCompositionCommit = false;
    private readonly errorField = signal<0 | 1 | 'both'>(0);
    private popupFocused = false;
    private resetForm: HTMLFormElement | null = null;
    private rejectedCommit = false;
    private readonly submit = (event: Event) => {
        if (this.isDisabled())
            return;
        const canceled = event.defaultPrevented;
        if (this.rejectedCommit || !this.commit()) {
            event.preventDefault();
            if (!canceled && !this.isComposing)
                (this.invalidField() === 1 ? this.end : this.start)?.nativeElement.focus();
        }
        this.rejectedCommit = false;
    };
    private readonly reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) {
        this.isComposing = false;
        if (!this.forms && this.value === undefined)
            this.local.set(this.baseline);
        this.rejectedCommit = false;
        this.restore();
        this.popup.set(false);
    } });
    private onChange: (value: DateValue) => void = () => { };
    private onTouched = () => { };
    private validatorChange = () => { };
    constructor() { afterEveryRender(() => { if (this.popup() && !this.popupFocused) {
        this.popupFocused = true;
        queueMicrotask(() => this.root?.nativeElement.ownerDocument.getElementById(this.initialDayId())?.focus());
    }
    else if (!this.popup())
        this.popupFocused = false; this.syncValidity(); const form = this.start?.nativeElement.form ?? null; if (form !== this.resetForm) {
        this.resetForm?.removeEventListener('reset', this.reset);
        this.resetForm?.removeEventListener('submit', this.submit, true);
        this.resetForm = form;
        form?.addEventListener('reset', this.reset);
        form?.addEventListener('submit', this.submit, true);
    } }); }
    ngOnInit(): void {
        this.initialMode = this.mode;
        this.controlMode.check(this.value, this.defaultValue);
        this.baseline = this.defaultValue === undefined ? emptyDate(this.mode) : this.defaultValue;
        if (!this.forms)
            this.local.set(this.baseline);
        this.initialized = true;
        this.validateConfiguration();
        this.restore();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (!this.initialized)
            return;
        if (this.initialMode !== this.mode)
            throw new TypeError('DateInput mode is immutable.');
        this.controlMode.check(this.value, this.defaultValue);
        this.validateConfiguration();
        if (changes['value']) {
            this.rejectedCommit = false;
            this.restore();
        }
        if (this.isDisabled())
            this.popup.set(false);
        this.validatorChange();
    }
    private validateConfiguration(): void { oneOf(this.mode, ['single', 'range'], 'date input mode'); checkBounds(this.min, this.max, this.referenceDate, this.today); checkDate(this.current(), this.mode, this.min, this.max); this.t(); }
    current(): DateValue { return this.forms ? this.local() : this.value === undefined ? this.local() : this.value; }
    fields(): [
        string,
        string
    ] { return dateFields(this.current()); }
    t(): DateInputTranslations { return dateTranslations(this.locale, this.translations); }
    isDisabled(): boolean { return this.disabled || this.formDisabled(); }
    message(): string { return this.localError() || this.error; }
    isInvalid(): boolean { return this.invalid || !!this.message(); }
    fieldInvalid(index: 0 | 1): boolean { return this.invalid || !!this.error || !!this.localError() && (this.errorField() === 'both' || this.errorField() === index); }
    fieldState(index: 0 | 1): string { return [this.isDisabled() && 'disabled', this.fieldInvalid(index) && 'invalid'].filter(Boolean).join(' '); }
    state(): string { return [this.isDisabled() && 'disabled', this.isInvalid() && 'invalid'].filter(Boolean).join(' '); }
    describedBy(): string { return this.id + '-hint' + (this.message() ? ' ' + this.id + '-error' : ''); }
    private restore(): void { this.awaitingCompositionCommit = false; this.errorField.set(0); this.raw.set(this.fields()); this.localError.set(''); this.announcement.set(''); const fields = this.fields(); this.root?.nativeElement.querySelectorAll<HTMLInputElement>('input[type="hidden"]').forEach((element, index) => element.value = fields[index]); this.syncValidity(); }
    private errorForDraft(): string {
        const [start, end] = this.raw();
        const t = this.t();
        const fields = this.mode === 'single' ? [start] : [start, end];
        for (const field of fields)
            if (field && !parseIsoDate(field))
                return t.formatError;
        if (this.mode === 'range' && !!start !== !!end)
            return t.incompleteRangeError;
        if (!start && this.required)
            return t.requiredError;
        if (this.mode === 'range' && start && end && start > end)
            return t.orderError;
        for (const field of fields) {
            if (field && this.min && field < this.min)
                return interpolate(t.minError, { min: this.min });
            if (field && this.max && field > this.max)
                return interpolate(t.maxError, { max: this.max });
        }
        return '';
    }
    private draftValue(): DateValue { const [start, end] = this.raw(); return this.mode === 'single' ? start || null : { start: start || null, end: end || null }; }
    private invalidField(): 0 | 1 {
        if (this.mode === 'single') return 0;
        const [start, end] = this.raw();
        if (start && !parseIsoDate(start)) return 0;
        if (end && !parseIsoDate(end)) return 1;
        if (!start && end) return 0;
        if (start && !end) return 1;
        if (!start && this.required) return 0;
        if (start && end && start > end) return 1;
        if (start && (this.min && start < this.min || this.max && start > this.max)) return 0;
        if (end && (this.min && end < this.min || this.max && end > this.max)) return 1;
        const committed = this.fields();
        return start !== committed[0] ? 0 : end !== committed[1] ? 1 : 0;
    }
    private syncValidity(): void {
        if (this.isDisabled() || this.isComposing || this.awaitingCompositionCommit) {
            this.start?.nativeElement.setCustomValidity(''); this.end?.nativeElement.setCustomValidity(''); return;
        }
        const error = this.errorForDraft();
        const pending = !error && !same(this.draftValue(), this.current());
        const validity = error || (pending ? (this.locale === 'en-US' ? 'Commit the date with Enter before submitting.' : 'Enter 키로 날짜를 확정하세요.') : '');
        const field = this.invalidField();
        this.start?.nativeElement.setCustomValidity(field === 0 ? validity : '');
        this.end?.nativeElement.setCustomValidity(field === 1 ? validity : '');
    }
    announceInvalidDraft(): void {
        if (this.isComposing) return;
        this.awaitingCompositionCommit = false;
        const error = this.errorForDraft();
        if (error) { this.errorField.set(this.mode === 'range' && this.required && this.raw().every(value => !value) ? 'both' : this.invalidField()); this.localError.set(error); this.announcement.set(error); this.validatorChange(); }
    }
    edit(event: Event, index: 0 | 1): void {
        if (this.isDisabled()) return;
        this.rejectedCommit = false;
        const next: [string, string] = [...this.raw()];
        next[index] = (event.target as HTMLInputElement).value; this.raw.set(next);
        if (!this.isComposing) { this.awaitingCompositionCommit = false; this.syncValidity(); this.validatorChange(); }
    }
    beginComposition(): void { this.isComposing = true; this.awaitingCompositionCommit = true; this.syncValidity(); }
    endComposition(event: CompositionEvent, index: 0 | 1): void {
        this.isComposing = false; this.awaitingCompositionCommit = true;
        const next: [string, string] = [...this.raw()]; next[index] = (event.target as HTMLInputElement).value; this.raw.set(next);
    }
    keydown(event: KeyboardEvent): void { if (this.isDisabled() || this.isComposing || composing(event))
        return; if (event.key === 'Enter') {
        event.preventDefault();
        this.commit();
    } }
    groupBlur(event: FocusEvent): void { if (this.root?.nativeElement.contains(event.relatedTarget as Node) || this.popup())
        return; this.onTouched(); if (!this.isComposing)
        this.commit(); }
    private apply(value: DateValue): void {
        if (same(value, this.current()))
            return;
        if (this.forms || this.value === undefined)
            this.local.set(value);
        this.onChange(value);
        this.valueChange.emit({ value });
    }
    commit(): boolean {
        if (this.isDisabled() || this.isComposing)
            return false;
        this.awaitingCompositionCommit = false;
        const error = this.errorForDraft();
        this.errorField.set(error && this.mode === 'range' && this.required && this.raw().every(value => !value) ? 'both' : this.invalidField());
        this.localError.set(error);
        if (error) {
            this.announcement.set(error);
            this.syncValidity();
            this.validatorChange();
            return false;
        }
        const next = this.draftValue();
        this.apply(next);
        const accepted = same(next, this.current());
        this.rejectedCommit = !accepted;
        this.restore();
        this.validatorChange();
        return accepted;
    }
    initialDayId(): string {
        const selected = this.fields()[0];
        let day = selected || this.referenceDate;
        if (day < (this.min ?? '0001-01-01'))
            day = this.min!;
        else if (day > (this.max ?? '9999-12-31'))
            day = this.max!;
        if (!selected)
            day = day.slice(0, 7) + '-01' < (this.min ?? '0001-01-01') ? this.min! : day.slice(0, 7) + '-01';
        return this.id + '-calendar-date-' + day;
    }
    openCalendar(): void { if (!this.isDisabled() && !this.isComposing) {
        const opener = this.root?.nativeElement.querySelector<HTMLElement>('[data-krds-part="trigger"]');
        if (opener && this.popupModal)
            this.popupModal.openFrom(opener);
    } }
    closeCalendar(): void { this.popup.set(false); }
    confirmCalendar(value: DateValue): void { if (!this.isDisabled()) {
        this.apply(value);
        this.rejectedCommit = false;
        this.restore();
        this.popup.set(false);
        this.onTouched();
        this.validatorChange();
    } }
    writeValue(value: DateValue): void { this.rejectedCommit = false; this.forms = true; this.local.set(value ?? emptyDate(this.mode)); if (this.initialized)
        this.validateConfiguration(); this.restore(); }
    registerOnChange(fn: (value: DateValue) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); if (disabled)
        this.popup.set(false); }
    validate(_control: AbstractControl): ValidationErrors | null { if (this.isComposing || this.awaitingCompositionCommit) return null; const error = this.errorForDraft(); return error ? { krdsDate: { message: error } } : null; }
    registerOnValidatorChange(fn: () => void): void { this.validatorChange = fn; }
    ngOnDestroy(): void { this.resetForm?.removeEventListener('reset', this.reset); this.resetForm?.removeEventListener('submit', this.submit, true); }
}
