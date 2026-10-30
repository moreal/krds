import { booleanAttribute, afterEveryRender, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, inject, Input, Output, signal, ViewChild, type OnChanges, type OnDestroy, type OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, type AbstractControl, type ControlValueAccessor, type ValidationErrors, type Validator } from '@angular/forms';
import type { SelectOption, ValueChangeDetails } from '@unofficial-krds/contracts';
import { oneOf, ControlMode, unique } from '../../internal/behavior';
@Component({ selector: 'krds-native-select', standalone: true, host: { '[attr.id]': 'null' }, changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NativeSelect), multi: true }, { provide: NG_VALIDATORS, useExisting: forwardRef(() => NativeSelect), multi: true }],
    template: `<div data-krds-component="native-select" data-krds-part="root" [attr.data-krds-state]="state()">
    @if (label) { <label data-krds-component="native-select" data-krds-part="label" [for]="id">{{label}}</label> }
    <select #control data-krds-component="native-select" data-krds-part="control" [id]="id" [attr.name]="name || null" [attr.form]="form || null"
      [attr.aria-label]="ariaLabel || null" [attr.aria-labelledby]="ariaLabelledby || null" [attr.aria-describedby]="describedBy()"
      [attr.aria-invalid]="invalid ? 'true' : null" [disabled]="isDisabled()" [required]="required" [attr.data-krds-state]="state()" [attr.data-krds-size]="size"
      (input)="nativeInput()" (change)="choose($event)" (blur)="onTouched()">
      @for (option of options; track option.value) { <option [value]="option.value" [attr.selected]="!absent() && option.value === current() ? '' : null" [disabled]="!!option.disabled">{{option.label}}</option> }
    </select>
    @if (hint) { <p data-krds-component="native-select" data-krds-part="hint" [id]="id + '-hint'">{{hint}}</p> }
    @if (error) { <p data-krds-component="native-select" data-krds-part="error" [id]="id + '-error'">{{error}}</p> }
  </div>`,
})
export class NativeSelect implements OnInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {
    @Input({ required: true })
    id = '';
    @Input()
    options: readonly SelectOption[] = [];
    @Input()
    value: string | undefined;
    @Input()
    defaultValue: string | undefined;
    @Input()
    label = '';
    @Input()
    ariaLabel = '';
    @Input()
    ariaLabelledby = '';
    @Input()
    name = '';
    @Input()
    form = '';
    @Input()
    hint = '';
    @Input()
    error = '';
    @Input({ transform: booleanAttribute })
    required = false;
    @Input({ transform: booleanAttribute })
    disabled = false;
    @Input({ transform: booleanAttribute })
    invalid = false;
    @Input()
    size: 'small' | 'medium' | 'large' = 'medium';
    @Output()
    readonly valueChange = new EventEmitter<ValueChangeDetails<string>>();
    @ViewChild('control')
    private control?: ElementRef<HTMLSelectElement>;
    readonly local = signal('');
    readonly absent = signal(false);
    private baselineAbsent = false;
    readonly formDisabled = signal(false);
    private readonly mode = new ControlMode();
    private forms = false;
    private initialized = false;
    private pendingNativeChange = false;
    private baseline = '';
    private resetForm: HTMLFormElement | null = null;
    private readonly reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) {
        this.pendingNativeChange = false;
        if (!this.forms && this.value === undefined)
            { this.local.set(this.baseline); this.absent.set(this.baselineAbsent); }
        this.sync();
    } });
    onChange: (value: string) => void = () => { };
    onTouched = () => { };
    private validatorChange = () => { };
    constructor() { afterEveryRender(() => { this.sync(); const form = this.control?.nativeElement.form ?? null; if (form !== this.resetForm) {
        this.resetForm?.removeEventListener('reset', this.reset);
        this.resetForm = form;
        form?.addEventListener('reset', this.reset);
    } }); }
    ngOnInit(): void {
        this.mode.check(this.value, this.defaultValue);
        this.baselineAbsent = !this.forms && this.value === undefined && this.defaultValue === undefined && !this.options.some(option => !option.disabled);
        this.absent.set(this.baselineAbsent);
        this.baseline = this.defaultValue ?? this.options.find(option => !option.disabled)?.value ?? '';
        if (!this.forms)
            { this.local.set(this.baseline); this.absent.set(this.baselineAbsent); }
        this.initialized = true;
        this.validateConfiguration();
    }
    ngOnChanges(): void { this.pendingNativeChange = false; if (this.initialized)
        this.mode.check(this.value, this.defaultValue); this.validateConfiguration(); this.validatorChange(); }
    private validateConfiguration(): void { oneOf(this.size, ['small', 'medium', 'large'], 'select size'); unique(this.options.map(option => option.value)); const value = this.current(); if (value && !this.options.some(option => option.value === value))
        throw new TypeError('Unknown select value.'); }
    current(): string { return this.forms ? this.local() : this.value ?? this.local(); }
    isDisabled(): boolean { return this.disabled || this.formDisabled(); }
    state(): string { return [this.isDisabled() && 'disabled', this.invalid && 'invalid'].filter(Boolean).join(' '); }
    describedBy(): string | null { return [this.hint && this.id + '-hint', this.error && this.id + '-error'].filter(Boolean).join(' ') || null; }
    private sync(): void { if (this.pendingNativeChange) return; const control = this.control?.nativeElement; if (control && this.absent()) { control.selectedIndex = -1; return; }
        if (control && control.value !== this.current())
        control.value = this.current(); }
    // Angular may render between the native input and change events; preserve that pending selection.
    nativeInput(): void { this.pendingNativeChange = true; }
    choose(event: Event): void {
        this.pendingNativeChange = false;
        const next = (event.target as HTMLSelectElement).value;
        if (this.isDisabled() || next === this.current()) {
            this.sync();
            return;
        }
        if (this.forms || this.value === undefined) { this.absent.set(false); this.local.set(next); }
        this.onChange(next);
        this.valueChange.emit({ value: next });
        this.sync();
    }
    writeValue(value: string | null): void { this.pendingNativeChange = false; this.absent.set(false); this.forms = true; this.local.set(value ?? ''); if (this.initialized) this.validateConfiguration(); this.sync(); }
    registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
    validate(_control: AbstractControl): ValidationErrors | null { return this.required && !this.current() ? { required: true } : null; }
    registerOnValidatorChange(fn: () => void): void { this.validatorChange = fn; }
    ngOnDestroy(): void { this.resetForm?.removeEventListener('reset', this.reset); }
}
