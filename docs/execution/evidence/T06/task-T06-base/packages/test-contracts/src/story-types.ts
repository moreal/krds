export interface StoryStateCase {
  id: string;
  componentId: string;
  state: Readonly<Record<string, unknown>>;
  environment: { locale: string; direction: 'ltr' | 'rtl'; colorMode: 'light' | 'dark'; nowIso: string; viewport: {width: number; height: number} };
  expected: ReadonlyArray<{role: string; name?: string; visibleText?: string}>;
}
