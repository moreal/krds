import type { DateRangeValue, SelectOption, ValueChangeDetails, OpenChangeDetails } from '@unofficial-krds/contracts';
export type { DateRangeValue, SelectOption, ValueChangeDetails, OpenChangeDetails };
export type DateValue = string | null | DateRangeValue;
export type DateMode = 'single' | 'range';
export interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
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
    weekdayLabels: string[];
    months: string[];
}
