import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { parseIsoDate } from '@unofficial-krds/contracts';
import type { DateRangeValue } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState } from '../base.js';
import { FormControlController } from '../../controllers/form-control-controller.js';
import { empty, equal, validateValue, bounds, template, type DateValue } from '../calendar/model.js';
import type { Calendar } from '../calendar/index.js';
import type { Modal } from '../modal/index.js';
export interface DateInputTranslations {
    startLabel: string;
    endLabel: string;
    formatHint: string;
    openCalendar: string;
    calendarTitle: string;
    requiredError: string;
    formatError: string;
    incompleteRangeError: string;
    orderError: string;
    minError: string;
    maxError: string;
}
function dictionary(locale: string, overrides: Partial<DateInputTranslations>): DateInputTranslations { const ko = locale === 'ko-KR'; if (!ko && locale !== 'en-US')
    throw new TypeError('Unsupported locale'); const t = { startLabel: ko ? '시작일' : 'Start date', endLabel: ko ? '종료일' : 'End date', formatHint: ko ? 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29' : 'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar: ko ? '달력 열기' : 'Open calendar', calendarTitle: ko ? '날짜 선택' : 'Choose date', requiredError: ko ? '날짜를 입력하세요' : 'Enter a date', formatError: ko ? 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요' : 'Enter a valid date in YYYY-MM-DD format', incompleteRangeError: ko ? '시작일과 종료일을 모두 입력하세요' : 'Enter both start and end dates', orderError: ko ? '종료일은 시작일보다 빠를 수 없습니다' : 'End date must not precede start date', minError: ko ? '{min} 이후 날짜를 입력하세요 (당일 포함)' : 'Enter a date on or after {min}', maxError: ko ? '{max} 이전 날짜를 입력하세요 (당일 포함)' : 'Enter a date on or before {max}', ...overrides }; if (Object.values(t).some(value => !value.trim()))
    throw new TypeError('Translation cannot be empty'); return t; }
export class DateInput extends KrdsElement {
    static formAssociated = true;
    static override properties = { mode: { type: String }, value: { attribute: false }, defaultValue: { attribute: false }, name: { type: String, reflect: true }, required: { type: Boolean }, disabled: { type: Boolean, reflect: true }, min: { type: String }, max: { type: String }, withCalendar: { attribute: 'with-calendar', type: Boolean }, referenceDate: { attribute: 'reference-date' }, today: { type: String }, translations: { attribute: false }, error: { type: String }, invalid: { type: Boolean }, autocomplete: { type: String }, draftStart: { state: true }, draftEnd: { state: true }, localError: { state: true }, popup: { state: true } };
    declare mode: 'single' | 'range';
    declare value: DateValue | undefined;
    declare defaultValue: DateValue | undefined;
    declare name: string;
    declare required: boolean;
    declare disabled: boolean;
    declare min: string | undefined;
    declare max: string | undefined;
    declare withCalendar: boolean;
    declare referenceDate: string;
    declare today: string | undefined;
    declare translations: Partial<DateInputTranslations>;
    declare error: string;
    declare invalid: boolean;
    declare autocomplete: string;
    declare private draftStart: string;
    declare private draftEnd: string;
    declare private localError: string;
    declare private popup: boolean;
    readonly formControl = new FormControlController(this);
    private state = new ValueState<DateValue>();
    private previous: DateValue | undefined;
    private initialMode?: string;
    private composing = false;
    constructor() { super(); this.mode = 'single'; this.name = ''; this.required = false; this.disabled = false; this.withCalendar = true; this.referenceDate = '2000-01-01'; this.translations = {}; this.error = ''; this.invalid = false; this.autocomplete = 'off'; this.draftStart = ''; this.draftEnd = ''; this.localError = ''; this.popup = false; }
    get committedValue() { const value = this.state.read(this.value, this.defaultValue, () => empty(this.mode)); validateValue(value, this.mode, this.min, this.max); return value; }
    private display(value: DateValue) { this.draftStart = typeof value === 'string' ? value : value && typeof value === 'object' ? value.start ?? '' : ''; this.draftEnd = value && typeof value === 'object' ? value.end ?? '' : ''; }
    override willUpdate(_changed: PropertyValues) { if (this.initialMode && this.initialMode !== this.mode)
        throw new TypeError('DateInput mode is immutable'); this.initialMode = this.mode; bounds(this.min, this.max); if (!parseIsoDate(this.referenceDate) || (this.today !== undefined && !parseIsoDate(this.today)))
        throw new RangeError('Invalid reference date'); const value = this.committedValue; if (this.previous === undefined || !equal(value, this.previous)) {
        this.previous = structuredClone(value);
        this.display(value);
        this.localError = '';
    } }
    override updated() { this.syncForm(); if (this.popup)
        void this.focusCalendar(); }
    private async focusCalendar() { const modal = this.renderRoot.querySelector<Modal>('krds-modal'); if (!modal)
        return; await modal.updateComplete; const calendar = modal.shadowRoot?.querySelector<Calendar>('krds-calendar'); if (!calendar || calendar.hasAttribute('data-focused'))
        return; calendar.setAttribute('data-focused', ''); await calendar.updateComplete; const selected = calendar.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]:not(:disabled)') ?? calendar.shadowRoot?.querySelector<HTMLButtonElement>('button[data-date]:not(:disabled):not([data-krds-state~="outside-month"])') ?? calendar.shadowRoot?.querySelector<HTMLButtonElement>('button:not(:disabled)'); selected?.focus(); }
    private rawValue(): DateValue { return this.mode === 'single' ? this.draftStart || null : { start: this.draftStart || null, end: this.draftEnd || null }; }
    private problem() { const t = dictionary(this.locale, this.translations); const dates = this.mode === 'single' ? [this.draftStart] : [this.draftStart, this.draftEnd]; if (dates.some(date => date && !parseIsoDate(date)))
        return t.formatError; if (this.mode === 'range' && !!dates[0] !== !!dates[1])
        return t.incompleteRangeError; if (this.mode === 'range' && dates[0] && dates[1] && dates[0] > dates[1])
        return t.orderError; if (this.required && dates.every(date => !date))
        return t.requiredError; for (const date of dates) {
        if (date && this.min && date < this.min)
            return template(t.minError, { min: this.min });
        if (date && this.max && date > this.max)
            return template(t.maxError, { max: this.max });
    } return ''; }
    private syncForm() { const value = this.committedValue; let payload: string | FormData = typeof value === 'string' ? value : ''; if (this.mode === 'range') {
        payload = new FormData();
        if (this.name) {
            const range = value as DateRangeValue;
            payload.append(`${this.name}.start`, range.start ?? '');
            payload.append(`${this.name}.end`, range.end ?? '');
        }
    } this.formControl.setValue(payload, JSON.stringify(value)); const input = this.renderRoot.querySelector<HTMLInputElement>('input') ?? undefined; for (const field of this.renderRoot.querySelectorAll<HTMLInputElement>('input'))
        field.setCustomValidity(this.problem()); this.formControl.setValidity(this.problem(), input); }
    private commit() { if (this.formControl.disabled || this.composing)
        return false; const error = this.problem(); this.localError = error; if (error) {
        this.syncForm();
        return false;
    } const next = this.rawValue(); if (!equal(next, this.committedValue)) {
        this.state.set(next);
        this.emit('value-change', { value: next });
    } this.display(this.committedValue); this.requestUpdate(); this.syncForm(); return equal(next, this.committedValue); }
    validateSubmission() { const result = this.commit(); if (!result) {
        this.formControl.setValidity(this.localError || 'Commit the date before submitting', this.renderRoot.querySelector<HTMLInputElement>('input')!);
        this.renderRoot.querySelector<HTMLInputElement>('input')?.focus();
    } return result; }
    resetControl() { this.state.reset(); this.display(this.committedValue); this.localError = ''; this.popup = false; this.requestUpdate(); }
    restoreControl(state: string | FormData | File | null) { if (typeof state === 'string') {
        const value = JSON.parse(state) as DateValue;
        validateValue(value, this.mode, this.min, this.max);
        this.state.set(value);
        this.display(this.committedValue);
        this.localError = '';
        this.requestUpdate();
    } }
    formResetCallback() { this.resetControl(); }
    formDisabledCallback(value: boolean) { this.formControl.disabledCallback(value); }
    formStateRestoreCallback(state: string | FormData | File | null) { this.restoreControl(state); }
    private input = (event: InputEvent, end = false) => { if (this.formControl.disabled)
        return; const value = (event.target as HTMLInputElement).value; if (end)
        this.draftEnd = value;
    else
        this.draftStart = value; if (!this.composing && !event.isComposing)
        this.syncForm(); };
    private key = (event: KeyboardEvent) => { if (event.key === 'Enter' && !this.composing && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault();
        this.commit();
    } };
    private groupBlur = () => { queueMicrotask(() => { if (!this.popup && !this.renderRoot.contains(this.shadowRoot?.activeElement ?? null))
        this.commit(); }); };
    private accept = (event: CustomEvent<{
        value: DateValue;
    }>) => { event.stopPropagation(); const next = event.detail.value; if (!equal(next, this.committedValue)) {
        this.state.set(next);
        this.emit('value-change', { value: next });
    } this.display(this.committedValue); this.localError = ''; this.popup = false; this.requestUpdate(); };
    override render() {
        if (!this.label)
            throw new TypeError('DateInput needs a task label');
        const t = dictionary(this.locale, this.translations);
        const error = this.localError || this.error;
        const invalid = !!error || this.invalid;
        const state = [this.formControl.disabled ? 'disabled' : '', invalid ? 'invalid' : ''].filter(Boolean).join(' ');
        const field = (end = false) => html `<input data-krds-component="date-input" data-krds-part=${this.mode === 'single' ? 'control' : end ? 'end-input' : 'start-input'} part=${this.mode === 'single' ? 'control' : end ? 'end-input' : 'start-input'} data-krds-state=${state} id=${end ? 'end' : 'control'} type="text" inputmode="numeric" autocomplete=${this.autocomplete} placeholder="YYYY-MM-DD" .value=${live(end ? this.draftEnd : this.draftStart)} ?disabled=${this.formControl.disabled} ?required=${this.required} aria-label=${ifDefined(this.mode === 'range' ? end ? t.endLabel : t.startLabel : undefined)} aria-invalid=${ifDefined(invalid ? 'true' : undefined)} aria-describedby=${error ? 'hint error' : 'hint'} @input=${(event: InputEvent) => this.input(event, end)} @keydown=${this.key} @compositionstart=${() => { this.composing = true; }} @compositionend=${(event: CompositionEvent) => { const text = (event.target as HTMLInputElement).value; if (end)
            this.draftEnd = text;
        else
            this.draftStart = text; this.composing = false; }}>`;
        return html `<div data-krds-component="date-input" data-krds-part="root" part="root" data-krds-state=${state} @focusout=${this.groupBlur}>
  ${this.mode === 'single' ? html `<label data-krds-component="date-input" data-krds-part="label" part="label" data-krds-state="" for="control">${this.label}</label>${field()}` : html `<fieldset><legend data-krds-component="date-input" data-krds-part="label" part="label" data-krds-state="">${this.label}</legend>${field()}${field(true)}</fieldset>`}
  ${this.withCalendar ? html `<button data-krds-component="date-input" data-krds-part="trigger" part="trigger" data-krds-state=${this.popup ? 'open' : 'closed'} id="calendar-trigger" type="button" ?disabled=${this.formControl.disabled} aria-label=${t.openCalendar} aria-haspopup="dialog" aria-expanded=${String(this.popup)} aria-controls="popup" @click=${(event: Event) => { (event.currentTarget as HTMLButtonElement).focus(); this.popup = true; }}>${t.openCalendar}</button>` : ''}
  <p data-krds-component="date-input" data-krds-part="hint" part="hint" data-krds-state="" id="hint">${t.formatHint}</p><p data-krds-component="date-input" data-krds-part="error" part="error" data-krds-state="" id="error" role="status" aria-live="polite">${error}</p>
  ${this.popup ? html `<krds-modal part="popup" id="popup" .open=${true} .title=${t.calendarTitle} .locale=${this.locale} .body=${html `<krds-calendar .mode=${this.mode} .value=${this.committedValue} .required=${this.required} .disabled=${this.formControl.disabled} .min=${this.min} .max=${this.max} .referenceDate=${this.referenceDate} .today=${this.today} .locale=${this.locale} .label=${t.calendarTitle} @value-change=${(event: Event) => event.stopPropagation()} @confirm=${this.accept} @cancel=${() => { this.popup = false; }}></krds-calendar>`} @open-change=${(event: CustomEvent<{
            open: boolean;
        }>) => { event.stopPropagation(); if (!event.detail.open)
            this.popup = false; }}></krds-modal>` : ''}
  </div>`;
    }
}
