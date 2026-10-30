import type { PatternAction, PatternId } from './types.js';
import type { LocalSeed } from './local-driver.js';

export interface PatternScenario {
  id: string;
  patternId: PatternId;
  caseId: string;
  route: string;
  seed: LocalSeed;
  initialActions: readonly PatternAction[];
  steps: readonly { action: string; dispatch?: PatternAction; settle?: { ok?: boolean }; expected: readonly string[] }[];
}
const validForm: readonly PatternAction[] = [
  { type: 'field', field: 'title', value: '예제 입력폼 연습' },
  { type: 'field', field: 'category', value: 'practice' },
];
const agreed: readonly PatternAction[] = [{ type: 'consent', field: 'requiredChoice', value: true }];
function scenario(patternId: PatternId, caseId: string, steps: PatternScenario['steps'], options: { seed?: LocalSeed; initialActions?: readonly PatternAction[] } = {}): PatternScenario {
  return { id: `pattern-${patternId}-${caseId}`, patternId, caseId, route: `/examples/${patternId}?case=${caseId}`, seed: options.seed ?? 'success', initialActions: options.initialActions ?? [], steps };
}

/** Future native integration obligations. These descriptors are not coverage. */
export const patternScenarios: readonly PatternScenario[] = [
  scenario('form-errors', 'error-summary-focus', [
    { action: 'Activate 예제 저장 with empty fields', dispatch: { type: 'submit' }, expected: ['Two inline errors and the named error summary are visible.', 'Actual native title input receives focus.', 'No local request is started.'] },
    { action: 'Activate the 연습 유형 summary link', dispatch: { type: 'error-link', field: 'category' }, expected: ['Actual native select with id example-form-category receives focus.', 'The title draft is unchanged.'] },
  ]),
  scenario('form-errors', 'retry-success', [
    { action: 'Activate 예제 저장', dispatch: { type: 'submit' }, expected: ['Form is busy; duplicate submit cannot start a second request.'] },
    { action: 'Release local completion', settle: {}, expected: ['Visible error with 다시 시도; title and category remain entered.'] },
    { action: 'Activate 다시 시도', dispatch: { type: 'retry' }, expected: ['Exactly one second local request is pending.'] },
    { action: 'Release local completion', settle: {}, expected: ['DEMO-FORM-001 appears as a local example completion.', 'No claim that an application was sent to an institution.'] },
  ], { seed: 'error-once', initialActions: validForm }),
  scenario('form-errors', 'reset-cancels-pending', [
    { action: 'Activate 예제 저장', dispatch: { type: 'submit' }, expected: ['Busy state is visible.'] },
    { action: 'Trigger the native form reset', dispatch: { type: 'reset' }, expected: ['All initial blank values return with no field-change callbacks.'] },
    { action: 'Release the earlier local completion', settle: { ok: true }, expected: ['No completion replaces the reset form.'] },
  ], { seed: 'loading', initialActions: validForm }),
  scenario('search-results', 'filter-resets-page', [
    { action: 'Start on page 3, change 자료 유형 to 예제', dispatch: { type: 'filter', category: 'example' }, expected: ['Page becomes 1 and loading is announced.', 'Focus remains on the category select.'] },
    { action: 'Release local completion', settle: {}, expected: ['4 results, 2 pages, resource-02/resource-05/resource-08 are shown.', 'Page 1 is current with no navigable href.'] },
    { action: 'Activate page 2', dispatch: { type: 'page', page: 2 }, expected: ['A real same-origin page URL remains available to native link behavior.'] },
    { action: 'Release local completion', settle: {}, expected: ['Only resource-11 is shown; page 2 is current.', 'Page size remains three at a narrow viewport.'] },
  ]),
  scenario('search-results', 'empty-results', [
    { action: 'Type 존재하지않는예제 in 검색어', dispatch: { type: 'query', value: '존재하지않는예제' }, expected: ['Query draft is retained.'] },
    { action: 'Submit 검색', dispatch: { type: 'search' }, expected: ['Loading status appears without focus theft.'] },
    { action: 'Release local completion', settle: {}, expected: ['0 results and a visible query/filter adjustment suggestion.', 'No numbered pagination or invented result is rendered.'] },
  ]),
  scenario('search-results', 'retry-success', [
    { action: 'Submit 검색', dispatch: { type: 'search' }, expected: ['Loading is visible.'] },
    { action: 'Release local completion', settle: {}, expected: ['Error and retry are shown; draft and applied criteria are retained.'] },
    { action: 'Activate 다시 시도', dispatch: { type: 'retry' }, expected: ['Failed submitted criteria are retried once.'] },
    { action: 'Release local completion', settle: {}, expected: ['12 local results, page 1 of 4; count is announced politely.'] },
  ], { seed: 'error-once' }),
  scenario('search-results', 'query-during-loading', [
    { action: 'Type 접근성', dispatch: { type: 'query', value: '접근성' }, expected: ['Draft is 접근성.'] },
    { action: 'Submit 검색', dispatch: { type: 'search' }, expected: ['Submitted query is captured in pending payload.'] },
    { action: 'Type 대화상자 before completion', dispatch: { type: 'query', value: '대화상자' }, expected: ['Draft editing remains available.'] },
    { action: 'Release local completion', settle: {}, expected: ['4 results are labeled for applied query 접근성; draft remains 대화상자.'] },
  ]),
  scenario('consent-confirmation', 'required-refusal', [
    { action: 'Choose 필수 동의하지 않음', dispatch: { type: 'consent', field: 'requiredChoice', value: false }, expected: ['Refusal is visible and programmatic.'] },
    { action: 'Activate 확인하기', dispatch: { type: 'review' }, expected: ['Modal remains closed; required guidance error is visible.', 'Focus is on example-consent-required-agree.'] },
  ]),
  scenario('consent-confirmation', 'optional-refusal-success', [
    { action: 'Keep optional refusal and activate 확인하기', dispatch: { type: 'review' }, expected: ['Named dialog 예제 선택 확인 opens; both decisions are summarized.'] },
    { action: 'Activate 예제 완료', dispatch: { type: 'confirm' }, expected: ['Dialog remains open and busy until local completion.'] },
    { action: 'Release local completion', settle: {}, expected: ['DEMO-CONSENT-001 and optional refusal are displayed.', 'Dialog closes and focus returns to its usable opener.'] },
  ], { initialActions: agreed }),
  scenario('consent-confirmation', 'modal-focus-return', [
    { action: 'Scroll so 확인하기 is visible; record focus and scroll; activate it', dispatch: { type: 'review' }, expected: ['Dialog container receives initial focus; background is inert.'] },
    { action: 'Tab and Shift+Tab through dialog', expected: ['Focus stays inside; close icon is last in dialog DOM.'] },
    { action: 'Press Escape', dispatch: { type: 'close' }, expected: ['Actual opener example-consent-review receives focus.', 'The saved page position is restored without a jump to document top.', 'Both consent choices remain unchanged.'] },
  ], { initialActions: agreed }),
  scenario('consent-confirmation', 'retry-in-dialog', [
    { action: 'Activate 확인하기', dispatch: { type: 'review' }, expected: ['Dialog opens.'] },
    { action: 'Activate 예제 완료', dispatch: { type: 'confirm' }, expected: ['Busy state is inside the dialog.'] },
    { action: 'Release local completion', settle: {}, expected: ['Visible error stays in open dialog; focus is not restored prematurely.'] },
    { action: 'Activate 다시 시도', dispatch: { type: 'retry' }, expected: ['Retry is pending.'] },
    { action: 'Release local completion', settle: {}, expected: ['Local success closes dialog and restores opener/location once.'] },
  ], { seed: 'error-once', initialActions: agreed }),
  scenario('service-layout', 'skip-main', [
    { action: 'Press Tab from document start and activate 본문 바로가기', expected: ['SkipLink is first actionable content.', 'Main heading example-main-heading receives actual focus.', 'Header, navigation, main and footer remain distinct landmarks.'] },
  ]),
  scenario('service-layout', 'navigate-current', [
    { action: 'Expand 도움말 without selecting a page', dispatch: { type: 'expand', id: 'help', expanded: true }, expected: ['Both groups remain expanded; 예제 소개 remains current.'] },
    { action: 'Activate 검색 연습', dispatch: { type: 'navigate', id: 'search' }, expected: ['URL section=search and current link agree.', 'Main heading changes to 검색 연습 and receives focus.'] },
  ]),
  scenario('service-layout', 'narrow-navigation', [
    { action: 'Use a 360px viewport and activate 전체메뉴', dispatch: { type: 'mobile', open: true }, expected: ['Every sidebar destination remains reachable through equivalent MainMenu.'] },
    { action: 'Activate 검색 연습', dispatch: { type: 'navigate', id: 'search' }, expected: ['Mobile menu closes and heading receives focus.', 'Header/SideNavigation/Footer use the same route identity and labels.'] },
    { action: 'Reopen 전체메뉴 on the current 검색 연습 page', dispatch: { type: 'mobile', open: true }, expected: ['검색 연습 remains the current destination.'] },
    { action: 'Activate the current 검색 연습 destination', dispatch: { type: 'navigate', id: 'search' }, expected: ['Mobile menu closes and the existing main heading receives focus.', 'Current route identity stays search without a route-change notification.'] },
  ]),
  scenario('service-layout', 'footer-policy', [
    { action: 'Activate 개인정보 처리방침 in Footer', dispatch: { type: 'navigate', id: 'privacy' }, expected: ['Local policy content explains memory-only example data.', 'Help branch expands so its current privacy link is reachable.', 'Footer follows main content without covering it, including short and narrow pages.', 'Independent identity is visible; no official-government banner or invented contact.'] },
  ]),
];
