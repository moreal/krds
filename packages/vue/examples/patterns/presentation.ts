import type { NavigationItem, LogoData } from '@unofficial-krds/contracts';

/** UI-only data: no request IDs, reducer actions, drivers or test-contract dependency. */
export interface Identity { name: string; notice: string; dataNotice: string; copyrightText: string }
export interface Option { value: string; label: string }
export interface FormView {
  kind: 'form'; busy: boolean; error: string | null;
  values: { title: string; category: string; detail: string };
  errors: { field: 'title'|'category'|'detail'; targetId: string; errorId: string; message: string }[];
  receipt: {id: string; title: string} | null; categories: Option[];
}
export interface SearchView {
  kind: 'search'; busy: boolean; ready: boolean; error: string | null;
  query: string; appliedQuery: string; category: string; categories: Option[];
  total: number; page: number; pageCount: number;
  items: {id: string; title: string; category: string; summary: string; date: string}[];
}
export interface ConsentView {
  kind: 'consent'; busy: boolean; error: string | null; invalid: boolean; open: boolean;
  requiredChoice: boolean|null; optionalChoice: boolean;
  groups: {id: 'requiredChoice'|'optionalChoice'; title: string; paragraphs: string[]}[];
  receipt: {id: string; optionalChoice: boolean} | null;
}
export interface LayoutView {
  kind: 'layout'; currentId: string; expandedIds: string[]; mobileOpen: boolean;
  navigation: NavigationItem[]; title: string; body: string; logo: LogoData;
  homeHref: string; privacyHref: string; helpHref: string;
}
export type Presentation = FormView|SearchView|ConsentView|LayoutView;
