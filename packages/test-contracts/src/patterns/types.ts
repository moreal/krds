export type PatternId = 'form-errors' | 'search-results' | 'consent-confirmation' | 'service-layout';
export type Phase = 'editing' | 'invalid' | 'confirming' | 'loading' | 'success' | 'error';
export type FormField = 'title' | 'category' | 'detail';
export type Category = 'all' | 'guide' | 'example' | 'reference';
export type LayoutId = 'overview' | 'form' | 'search' | 'consent' | 'accessibility' | 'privacy';
export interface FormValues { title: string; category: string; detail: string }
export interface FieldError { field: FormField; targetId: string; errorId: string; message: string }
export interface Resource { id: string; title: string; category: Exclude<Category, 'all'>; summary: string; date: string }
export interface SearchPayload { query: string; category: Category; page: number }
export interface ConsentPayload { requiredChoice: boolean | null; optionalChoice: boolean }
export type RequestPayload = FormValues | SearchPayload | ConsentPayload;
export interface CommonState<P = RequestPayload> { phase: Phase; requestId: number; pendingRequestId: number | null; pendingPayload: P | null; failedPayload: P | null; error: string | null }
export interface FormState extends CommonState<FormValues> { patternId: 'form-errors'; values: FormValues; errors: FieldError[]; receipt: (FormValues & { id: string }) | null }
export interface SearchResult { items: Resource[]; total: number; pageCount: number; page: number; pageSize: number }
export interface SearchState extends CommonState<SearchPayload>, SearchResult { patternId: 'search-results'; query: string; appliedQuery: string; category: Category }
export interface ConsentState extends CommonState<ConsentPayload> { patternId: 'consent-confirmation'; requiredChoice: boolean | null; optionalChoice: boolean; modalOpen: boolean; receipt: (ConsentPayload & { id: string }) | null }
export interface LayoutState extends CommonState<never> { patternId: 'service-layout'; currentId: LayoutId; expandedIds: string[]; mobileOpen: boolean }
export interface PatternStateMap { 'form-errors': FormState; 'search-results': SearchState; 'consent-confirmation': ConsentState; 'service-layout': LayoutState }
export type PatternState = PatternStateMap[PatternId];
export type PatternAction =
  | { type: 'field'; field: FormField; value: string }
  | { type: 'error-link'; field: FormField }
  | { type: 'submit' | 'retry' | 'reset' | 'search' | 'review' | 'confirm' | 'close' }
  | { type: 'query'; value: string }
  | { type: 'filter'; category: Category }
  | { type: 'page'; page: number }
  | { type: 'consent'; field: 'requiredChoice' | 'optionalChoice'; value: boolean }
  | { type: 'expand'; id: 'examples' | 'help'; expanded: boolean }
  | { type: 'mobile'; open: boolean }
  | { type: 'navigate'; id: LayoutId }
  | { type: 'resolve'; requestId: number; ok: boolean };
export type PatternEffect = { type: 'focus'; targetId: string } | { type: 'request'; operation: 'submit-form' | 'search' | 'confirm-consent'; requestId: number; payload: RequestPayload };
export interface TransitionResult<S extends PatternState = PatternState> { state: S; effects: PatternEffect[] }
/** Existing FixtureBridge.setState envelope; consumed only by native example hosts. */
export interface PatternFixtureCommand { sequence: number; command: 'settle'; ok?: boolean }
