/** Plain strings can be consumed by native renderers without a shared runtime. */
export type CssEntry = 'base' | 'reset' | 'fonts' | 'button' | 'native-select' | 'modal' | 'tabs' | 'date-input' | 'calendar' | 'all';
export type StyleStrings = Readonly<Record<CssEntry, string>>;
