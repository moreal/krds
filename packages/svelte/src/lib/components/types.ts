import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
export type { DateRangeValue, SelectOption, ValueChangeDetails, OpenChangeDetails } from '@unofficial-krds/contracts';
import type { DateRangeValue, SelectOption, ValueChangeDetails, OpenChangeDetails } from '@unofficial-krds/contracts';
export type Locale = 'ko-KR' | 'en-US';
export type DateValue = string | null | DateRangeValue;
export interface ButtonProps extends HTMLButtonAttributes {
    element?: HTMLButtonElement | null;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    children?: Snippet;
}
export interface NativeSelectProps {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (details: ValueChangeDetails<string>) => void;
    id?: string;
    label?: string;
    hint?: string;
    error?: string;
    name?: string;
    form?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    size?: 'small' | 'medium' | 'large';
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
export interface ModalTriggerContext {
    open: (event?: Event) => void;
    expanded: boolean;
    controls: string;
}
export interface ModalContentContext {
    close: () => void;
}
export interface ModalProps {
    /** Native composition transport; public open requests retain their existing shape. */
    onDismissReason?: (reason:'close'|'escape'|'outside')=>void;
    trigger?: Snippet<[
        ModalTriggerContext
    ]>;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (details: OpenChangeDetails) => void;
    title: string;
    id?: string;
    description?: string;
    children?: Snippet<[
        ModalContentContext
    ]>;
    actions?: Snippet<[
        ModalContentContext
    ]>;
    closeOnOutsideClick?: boolean;
    showCloseButton?: boolean;
    closeLabel?: string;
    initialFocusId?: string;
    returnFocusId?: string;
    locale?: Locale;
}
export interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
    panel?: Snippet;
    content?: string;
}
export interface TabsProps {
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (details: ValueChangeDetails<string>) => void;
    activationMode?: 'manual' | 'automatic';
    orientation?: 'horizontal' | 'vertical';
    label?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    id?: string;
}
export interface CalendarTranslations {
    previousMonth: string;
    nextMonth: string;
    today: string;
    clear: string;
    cancel: string;
    confirm: string;
    selected: string;
    unavailable: string;
    adjacentMonth: string;
    dateLabel: string;
    visibleDayLabel: string;
    monthLabel: string;
    startLabel: string;
    endLabel: string;
    weekdays: string[];
    months: string[];
}
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
export interface DateBaseProps {
    mode?: 'single' | 'range';
    value?: DateValue;
    defaultValue?: DateValue;
    min?: string;
    max?: string;
    disabled?: boolean;
    locale?: Locale;
    referenceDate?: string;
    today?: string;
    onValueChange?: (details: ValueChangeDetails<DateValue>) => void;
}
export interface CalendarProps extends DateBaseProps {
    label?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    translations?: Partial<CalendarTranslations>;
    required?: boolean;
    onConfirm?: (details: ValueChangeDetails<DateValue>) => void;
    onCancel?: () => void;
    id?: string;
}
export interface DateInputProps extends DateBaseProps {
    id?: string;
    name?: string;
    form?: string;
    required?: boolean;
    label: string;
    hint?: string;
    error?: string;
    invalid?: boolean;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    withCalendar?: boolean;
    translations?: Partial<DateInputTranslations>;
}
