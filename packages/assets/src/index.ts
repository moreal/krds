/** Local generic KRDS icons; no institution identity or third-party brand marks. */
export const krdsIconUrls = {
  close: new URL('../icons/ico_close.svg', import.meta.url).href,
  search: new URL('../icons/ico_sch.svg', import.meta.url).href,
  plus: new URL('../icons/ico_plus.svg', import.meta.url).href,
  calendar: new URL('../icons/ico_calendar.svg', import.meta.url).href,
  download: new URL('../icons/ico_download.svg', import.meta.url).href,
  information: new URL('../icons/ico_information.svg', import.meta.url).href,
  angle: new URL('../icons/ico_angle.svg', import.meta.url).href,
  checkboxChecked: new URL('../icons/ico_checkbox_checked.svg', import.meta.url).href,
} as const;
export type KrdsIconName = keyof typeof krdsIconUrls;

/** Consumers supply institution identity and verify their own rights to that identity. */
export interface InstitutionIdentity {
  name: string;
  homepageUrl?: string;
  logoUrl?: string;
  logoAlternativeText?: string;
}
