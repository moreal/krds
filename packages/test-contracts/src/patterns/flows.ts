import { formCategories, resources, resourceCategories, layoutNavigation, layoutSections } from './content.js';
import type { FormField, FormValues, FieldError, FormState, PatternId, PatternState, PatternStateMap, PatternAction, PatternEffect, TransitionResult, SearchResult, Category } from './types.js';

export const fieldIds = Object.freeze({ title: 'example-form-title', category: 'example-form-category', detail: 'example-form-detail' });
const blankValues = () => ({ title: '', category: '', detail: '' });
const clone = <T>(value: T): T => structuredClone(value);
const result = <S extends PatternState>(state: S, effects: PatternEffect[] = []): TransitionResult<S> => ({ state, effects });
const focus = (targetId: string): PatternEffect => ({ type: 'focus', targetId });
const formError = (field: FormField, message: string): FieldError => ({ field, targetId: fieldIds[field], message, errorId: `${fieldIds[field]}-error` });

export function validateForm(values: FormValues): FieldError[] {
  const errors = [];
  const length = Array.from(values.title.trim()).length;
  if (length < 4 || length > 60) errors.push(formError('title', '예제 제목을 4자 이상 60자 이하로 입력하세요.'));
  if (!formCategories.some(option => option.value !== '' && option.value === values.category)) errors.push(formError('category', '연습 유형을 선택하세요.'));
  if (Array.from(values.detail).length > 120) errors.push(formError('detail', '추가 설명은 120자 이하로 입력하세요.'));
  return errors;
}

export function searchResources({ query = '', category = 'all', page = 1, pageSize = 3 }: { query?: string; category?: Category; page?: number; pageSize?: number } = {}): SearchResult {
  if (pageSize !== 3) throw new RangeError('This example has a fixed page size of three.');
  if (!resourceCategories.some(option => option.value === category)) throw new RangeError('Unknown resource category.');
  const tokens = query.trim().toLowerCase().split(/\s+/u).filter(Boolean);
  const matching = resources.filter(item => (category === 'all' || item.category === category)
    && tokens.every(token => `${item.title} ${item.summary}`.toLowerCase().includes(token)));
  const pageCount = Math.ceil(matching.length / pageSize);
  const actualPage = Math.max(1, Math.min(Number.isInteger(page) ? page : 1, pageCount || 1));
  return { items: clone(matching.slice((actualPage - 1) * pageSize, actualPage * pageSize)), total: matching.length, pageCount, page: actualPage, pageSize };
}

export function createPatternState<P extends PatternId>(patternId: P, caseId?: string): PatternStateMap[P];
export function createPatternState(patternId: PatternId, caseId = ''): PatternState {
  const common = { requestId: 0, pendingRequestId: null, pendingPayload: null, failedPayload: null, error: null };
  if (patternId === 'form-errors') return { ...common, patternId, phase: 'editing', values: blankValues(), errors: [], receipt: null };
  if (patternId === 'search-results') {
    const page = caseId === 'filter-resets-page' ? 3 : 1;
    return { ...common, patternId, phase: 'success', query: '', appliedQuery: '', category: 'all', ...searchResources({ page }) };
  }
  if (patternId === 'consent-confirmation') return { ...common, patternId, phase: 'editing', requiredChoice: null, optionalChoice: false, modalOpen: false, receipt: null };
  if (patternId === 'service-layout') return { ...common, patternId, phase: 'success', currentId: 'overview', expandedIds: ['examples'], mobileOpen: false };
  throw new RangeError(`Unknown pattern: ${patternId}`);
}

function request<S extends Exclude<PatternState, { patternId: 'service-layout' }>>(state: S, operation: 'submit-form' | 'search' | 'confirm-consent', payload: NonNullable<S['pendingPayload']>): TransitionResult<S> {
  const requestId = state.requestId + 1;
  return result({ ...state, phase: 'loading', error: null, requestId, pendingRequestId: requestId, pendingPayload: clone(payload) } as S,
    [{ type: 'request', operation, requestId, payload: clone(payload) }]);
}

function resolve(state: PatternState, action: Extract<PatternAction, { type: 'resolve' }>): TransitionResult {
  if (state.phase !== 'loading' || action.requestId !== state.pendingRequestId) return result(state);
  const settled = { pendingRequestId: null, pendingPayload: null, failedPayload: null };
  if (!action.ok) return result({ ...state, ...settled, phase: 'error', failedPayload: state.pendingPayload, error: '로컬 예제 처리에 실패했습니다. 입력을 유지한 채 다시 시도할 수 있습니다.' } as PatternState);
  if (state.patternId === 'form-errors') return result({ ...state, ...settled, phase: 'success', receipt: { id: 'DEMO-FORM-001', title: state.values.title.trim(), category: state.values.category, detail: state.values.detail } });
  if (state.patternId === 'search-results' && state.pendingPayload) return result({ ...state, pendingRequestId: null, pendingPayload: null, failedPayload: null, phase: 'success', appliedQuery: state.pendingPayload.query, ...searchResources(state.pendingPayload) });
  if (state.patternId === 'consent-confirmation') return result({ ...state, pendingRequestId: null, pendingPayload: null, failedPayload: null, phase: 'success', modalOpen: false, receipt: { id: 'DEMO-CONSENT-001', requiredChoice: true, optionalChoice: state.optionalChoice } });
  return result(state);
}

/** Pure host state. Effects are intentions; native owners perform real DOM focus. */
export function transition<S extends PatternState>(input: S, action: PatternAction): TransitionResult<S>;
export function transition(input: PatternState, action: PatternAction): TransitionResult {
  const state = clone(input);
  if (action.type === 'resolve') return resolve(state, action);
  if (action.type === 'reset') return result({ ...createPatternState(state.patternId), requestId: state.requestId });
  if (state.patternId === 'form-errors') {
    if (action.type === 'error-link') return result(state, state.errors.some(error => error.field === action.field) ? [focus(fieldIds[action.field])] : []);
    if (action.type === 'field' && Object.hasOwn(fieldIds, action.field) && typeof action.value === 'string' && state.phase !== 'loading') {
      const next: FormState = { ...state, phase: 'editing', receipt: null, error: null, values: { ...state.values, [action.field]: action.value } };
      next.errors = state.errors.length ? validateForm(next.values) : [];
      return result(next);
    }
    if ((action.type === 'submit' || (action.type === 'retry' && state.phase === 'error')) && state.phase !== 'loading' && state.phase !== 'success') {
      const errors = validateForm(state.values);
      if (errors.length) return result({ ...state, phase: 'invalid', errors, error: null }, [focus(errors[0].targetId)]);
      return request({ ...state, errors: [] }, 'submit-form', { ...state.values, title: state.values.title.trim() });
    }
  }
  if (state.patternId === 'search-results') {
    if (action.type === 'query' && typeof action.value === 'string') return result({ ...state, query: action.value });
    if (action.type === 'filter' && resourceCategories.some(option => option.value === action.category)) {
      if (state.category === action.category) return result(state);
      return request({ ...state, category: action.category, page: 1 }, 'search', { query: state.appliedQuery, category: action.category, page: 1 });
    }
    if (action.type === 'search') return request({ ...state, page: 1 }, 'search', { query: state.query, category: state.category, page: 1 });
    if (action.type === 'page' && state.phase === 'success' && Number.isInteger(action.page) && action.page >= 1 && action.page <= state.pageCount && action.page !== state.page) return request({ ...state, page: action.page }, 'search', { query: state.appliedQuery, category: state.category, page: action.page });
    if (action.type === 'retry' && state.phase === 'error' && state.failedPayload) return request(state, 'search', state.failedPayload);
  }
  if (state.patternId === 'consent-confirmation') {
    if (action.type === 'consent' && ['requiredChoice', 'optionalChoice'].includes(action.field) && typeof action.value === 'boolean' && !state.modalOpen) return result({ ...state, phase: 'editing', [action.field]: action.value, error: null, receipt: null });
    if (action.type === 'review' && !state.modalOpen && state.phase !== 'success') {
      if (state.requiredChoice !== true) return result({ ...state, phase: 'invalid', error: '필수 예제 이용 안내에 동의해야 계속할 수 있습니다.' }, [focus('example-consent-required-agree')]);
      return result({ ...state, phase: 'confirming', modalOpen: true, error: null });
    }
    if (action.type === 'close' && state.modalOpen) return result({ ...state, phase: 'editing', modalOpen: false, pendingRequestId: null, pendingPayload: null, error: null });
    if ((action.type === 'confirm' && state.phase === 'confirming') || (action.type === 'retry' && state.phase === 'error' && state.modalOpen)) return request(state, 'confirm-consent', { requiredChoice: state.requiredChoice, optionalChoice: state.optionalChoice });
  }
  if (state.patternId === 'service-layout') {
    if (action.type === 'expand' && ['examples', 'help'].includes(action.id) && typeof action.expanded === 'boolean') return result({ ...state, expandedIds: action.expanded ? [...new Set([...state.expandedIds, action.id])] : state.expandedIds.filter(id => id !== action.id) });
    if (action.type === 'mobile' && typeof action.open === 'boolean') return result({ ...state, mobileOpen: action.open });
    if (action.type === 'navigate' && Object.hasOwn(layoutSections, action.id)) {
      const branch = layoutNavigation.find(item => item.children?.some(child => child.id === action.id));
      const branchClosed = Boolean(branch && !state.expandedIds.includes(branch.id));
      if (action.id === state.currentId && !state.mobileOpen && !branchClosed) return result(state);
      const expandedIds = branch ? [...new Set([...state.expandedIds, branch.id])] : state.expandedIds;
      return result({ ...state, currentId: action.id, expandedIds, mobileOpen: false }, [focus('example-main-heading')]);
    }
  }
  return result(state);
}
