import {html} from 'lit';
import {registerKrdsElements} from '@unofficial-krds/lit';
import acceptance from './data.json';
import audio from '../../public/local-assets/specimen-audio.wav?url';
import landscape from '../../public/local-assets/specimen-landscape.svg?url';
import logo from '../../public/local-assets/specimen-logo.svg?url';
import serviceLogo from '../../public/local-assets/service-logo.svg?url';
import light from '../../public/local-assets/specimen-icon-light.svg?url';
import dark from '../../public/local-assets/specimen-icon-dark.svg?url';

type El = HTMLElement & Record<string, any> & {updateComplete: Promise<boolean>};
type Ctx = {bind<T extends EventTarget>(target: T): T; id: string; element: El; form: HTMLFormElement; announce(text: string): void; action(label: string, run: (event: MouseEvent) => void, id?: string): El; button(label: string, options?: {id?: string; type?: 'button' | 'reset'; variant?: string}): El; reset(label: string, run: () => void): El; state: Record<string, any>; note(text: string, id?: string): HTMLElement; count: number};

const assets: Record<string, string> = {'specimen-audio.wav': audio, 'specimen-landscape.svg': landscape, 'specimen-logo.svg': logo, 'service-logo.svg': serviceLogo, 'specimen-icon-light.svg': light, 'specimen-icon-dark.svg': dark};
/** In-frame destinations: every `/local/<name>` anchor is a real same-document URL that renders visible route content. */
export const routeUrl = (_id: string, route: string) => { const query = new URLSearchParams(location.search); query.set('component', _id); query.set('example', 'default'); query.set('route', route); return `${location.pathname}?${query}`; };
function local(value: any, id: string): any {
 if (typeof value === 'string' && value.startsWith('/local-assets/')) return assets[value.split('/').pop()!] ?? `${(import.meta as any).env.BASE_URL}local-assets/${value.split('/').pop()}`;
 if (typeof value === 'string' && value.startsWith('/local/')) return routeUrl(id, value.slice(7).replaceAll('/', '-'));
 if (Array.isArray(value)) return value.map(item => local(item, id));
 if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, local(item, id)]));
 return value;
}
/** Null values mean “not supplied”; this keeps every Lit element uncontrolled unless the example intentionally controls it. */
function initial(value: Record<string, unknown>, id: string) {
 const out: Record<string, unknown> = {};
 for (const [key, item] of Object.entries(local(structuredClone(value), id))) if (item !== null) out[key] = item;
 return out;
}
/** Every host control is the public `krds-button` element; its focusable part lives in the shadow root. */
const hostButton = (label: string, options: {id?: string; type?: 'button' | 'reset'; variant?: string} = {}) => {
 const button = document.createElement('krds-button') as El;
 button.variant = options.variant ?? 'secondary'; button.size = 'small'; button.type = options.type ?? 'button';
 button.textContent = label;
 if (options.id) button.id = options.id;
 return button;
};
const focusButton = (host: El) => ((host.shadowRoot?.querySelector('button') as HTMLElement | null) ?? host).focus();
const sameTarget = (event: Event, selector: string) => (event.composedPath().find(node => node instanceof Element && node.matches(selector)) as HTMLElement | undefined);

const builders: Record<string, (c: Ctx) => void> = {
 button(c) {
  c.element.textContent = '신청하기';
  c.element.addEventListener('click', () => c.announce(`신청이 ${++c.count}회 완료되었습니다.`));
 },
 accordion(c) {
  c.element.addEventListener('open-change', ((event: CustomEvent) => c.announce(`열린 항목: ${event.detail.ids?.join(', ') || '없음'}`)) as EventListener);
 },
 'back-button'(c) {
  // Local history driver: ['parent','current']; the visible route follows the back request.
  const history = ['parent', 'current'];
  const view = c.note('현재 화면: current');
  view.dataset.routeView = '';
  c.element.addEventListener('back-request', () => { history.pop(); view.textContent = `현재 화면: ${history.at(-1)}`; c.announce(`이전 화면: ${history.at(-1)}`); });
 },
 'bottom-sheet'(c) {
  const element = c.element;
  element.open = true;
  const opener = c.action('지역 선택 열기', () => { element.open = true; }, 'sheet-opener');
  let selected = 'seoul';
  const draw = () => html`<fieldset><legend>지역</legend>${[['seoul', '서울'], ['busan', '부산']].map(([value, label]) => html`<label><input type="radio" name="sheet-region" value=${value} .checked=${selected === value} @change=${() => { selected = value!; c.announce(`선택한 지역: ${label}`); element.body = draw(); }}>${label}</label>`)}</fieldset>`;
  element.body = draw();
  element.addEventListener('open-change', ((event: CustomEvent) => { element.open = event.detail.open; if (!event.detail.open) { c.announce(`선택한 지역: ${selected === 'busan' ? '부산' : '서울'}`); queueMicrotask(() => focusButton(opener)); } }) as EventListener);
 },
 calendar(c) {
  c.element.label = '방문일';
  c.element.referenceDate = '2024-02-01';
  c.element.addEventListener('value-change', ((event: CustomEvent) => c.announce(`선택한 날짜: ${event.detail.value}`)) as EventListener);
 },
 carousel(c) {
  // Passive timer playback must not produce callbacks; only user intent changes are counted.
  const status = c.note('자동 재생 요청 0회');
  status.dataset.carouselRequests = '';
  c.element.addEventListener('playing-change', ((event: CustomEvent) => { if (event.detail.playing) { c.count++; status.textContent = `자동 재생 요청 ${c.count}회`; } }) as EventListener);
 },
 checkbox: formControls, 'radio-group': formControls, switch: formControls, 'quantity-toggle': formControls, 'range-slider': formControls, 'text-input': formControls, textarea: formControls,
 'coach-mark'(c) { tutorialTargets(c); },
 'contextual-help'(c) {
  c.element.addEventListener('open-change', ((event: CustomEvent) => c.announce(event.detail.open ? '도움말을 열었습니다.' : '도움말을 닫았습니다.')) as EventListener);
 },
 'critical-alert'() {},
 'date-input'(c) {
  c.element.label = '방문일';
  c.element.referenceDate = '2024-02-01';
  c.element.addEventListener('value-change', ((event: CustomEvent) => c.announce(`입력한 날짜: ${event.detail.value}`)) as EventListener);
 },
 disclosure(c) {
  c.element.addEventListener('open-change', ((event: CustomEvent) => c.announce(event.detail.open ? '내용을 열었습니다.' : '내용을 닫았습니다.')) as EventListener);
 },
 fab(c) {
  c.element.addEventListener('action', () => c.announce(`새 신청 ${++c.count}건`));
 },
 favicon(c) { c.note('문서 머리말의 로컬 밝은/어두운 아이콘 링크를 확인하세요.'); },
 'file-upload'(c) {
  const element = c.element;
  element.addEventListener('files-change', ((event: CustomEvent) => { element.files = event.detail.value; c.announce(`선택한 파일: ${event.detail.value.map((record: any) => record.file.name).join(', ') || '없음'}`); }) as EventListener);
  element.addEventListener('files-rejected', ((event: CustomEvent) => c.announce(event.detail.rejected.map((item: any) => item.message).join(' '))) as EventListener);
 },
 footer() {},
 header(c) {
  const skip = document.createElement('krds-skip-link') as El;
  skip.links = [{id: 'main', label: '본문 바로가기', targetId: 'main-content'}];
  c.form.insertBefore(skip, c.element);
  c.element.search = {label: '검색', onRequest: () => c.announce('검색 요청을 받았습니다.')};
  const spacer = document.createElement('div');
  spacer.style.cssText = 'block-size:600px;inline-size:100%';
  spacer.setAttribute('role', 'presentation');
  const main = document.createElement('section');
  main.id = 'main-content'; main.tabIndex = -1; main.innerHTML = '<h2>신청 안내 본문</h2><p>긴 페이지를 스크롤해도 머리말의 읽기 순서는 유지됩니다.</p>';
  c.form.append(main, spacer);
 },
 'help-panel'(c) {
  const fallback = c.button('도움말 바깥 위치', {id: 'panel-fallback'}); c.form.append(fallback);
  c.element.addEventListener('open-change', ((event: CustomEvent) => c.announce(event.detail.open ? '도움말을 열었습니다.' : '도움말을 닫았습니다.')) as EventListener);
  c.element.addEventListener('topic-change', ((event: CustomEvent) => c.announce(`선택한 주제: ${event.detail.id}`)) as EventListener);
 },
 identifier(c) {
  const footer = document.createElement('footer'); footer.setAttribute('role', 'contentinfo');
  c.element.replaceWith(footer); footer.append(c.element);
 },
 image(c) {
  // The loaded example plus an intentionally absent reference: the failure specimen keeps its informative alternative.
  const {failureSpecimen, ...own} = c.state;
  const specimen = document.createElement('krds-image') as El;
  Object.assign(specimen, {...own, ...failureSpecimen});
  c.form.append(specimen);
 },
 'in-page-navigation'(c) {
  c.element.addEventListener('active-change', ((event: CustomEvent) => { c.element.activeId = event.detail.id; c.announce(`현재 구간: ${event.detail.id}`); }) as EventListener);
  // DOM outline first; desktop grid places it visually on the right.
  const layout = document.createElement('div');
  layout.dataset.layout = 'desktop-side';
  layout.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 16rem;gap:24px;inline-size:100%;align-items:start';
  c.element.style.cssText = 'grid-column:2;grid-row:1;position:sticky;inset-block-start:8px';
  layout.append(c.element);
  const column = document.createElement('div'); column.style.cssText = 'grid-column:1;grid-row:1;min-inline-size:0';
  layout.append(column);
  for (const section of c.element.sections) {
   const part = document.createElement('section'); part.id = section.id; part.tabIndex = -1;
   part.style.minBlockSize = '520px';
   part.innerHTML = `<h2>${section.label}</h2><p>예제 신청 안내 본문입니다.</p>`;
   column.append(part);
  }
  c.form.append(layout);
 },
 'language-switcher'(c) {
  const page = c.note('한국어 예제', 'language-page'); page.lang = 'ko';
  c.element.addEventListener('locale-request', ((event: CustomEvent) => { event.detail && (c.element.currentLocale = event.detail.locale); const english = event.detail.locale === 'en'; page.lang = english ? 'en' : 'ko'; page.textContent = english ? 'English example' : '한국어 예제'; c.announce(english ? 'English' : '한국어'); }) as EventListener);
  c.form.addEventListener('click', event => { if (sameTarget(event, '[data-krds-part="option"]') && !(event as MouseEvent).metaKey && !(event as MouseEvent).ctrlKey && !(event as MouseEvent).shiftKey) event.preventDefault(); });
 },
 link() {},
 'main-menu'() {},
 masthead(c) {
  const skip = document.createElement('krds-skip-link') as El;
  skip.links = [{id: 'main', label: '본문 바로가기', targetId: 'main-content'}];
  const notice = document.createElement('p'); notice.setAttribute('role', 'note'); notice.dataset.specimenLabel = '';
  notice.textContent = '공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.';
  const main = document.createElement('section'); main.id = 'main-content'; main.tabIndex = -1; main.innerHTML = '<h2>신청 안내 본문</h2>';
  c.form.insertBefore(skip, c.element); c.form.insertBefore(notice, c.element); c.form.append(main);
 },
 modal(c) {
  const element = c.element;
  element.open = false;
  element.title = '신청 확인';
  element.description = '신청 내용을 확인한 뒤 닫아 주세요.';
  element.body = html`<p>예제 신청 내용을 확인합니다.</p>`;
  element.actions = html`<krds-button data-krds-close variant="secondary" size="small">확인</krds-button>`;
  c.action('열기', () => { element.open = true; }, 'modal-opener');
  element.addEventListener('open-change', ((event: CustomEvent) => { element.open = event.detail.open; c.announce(event.detail.open ? '대화상자를 열었습니다.' : '대화상자를 닫았습니다.'); }) as EventListener);
 },
 'native-select'(c) {
  c.element.label = '지역';
  c.element.options = [{value: 'seoul', label: '서울'}, {value: 'busan', label: '부산'}];
  c.element.addEventListener('value-change', ((event: CustomEvent) => c.announce(`선택한 지역: ${event.detail.value}`)) as EventListener);
 },
 pagination(c) {
  c.element.addEventListener('page-change', ((event: CustomEvent) => c.announce(`현재 페이지: ${event.detail.page}`)) as EventListener);
  // Page boundaries stay in-frame; modified clicks keep native browser behaviour.
  c.form.addEventListener('click', event => { const me = event as MouseEvent; if (sameTarget(event, 'a[href]') && me.button === 0 && !me.metaKey && !me.ctrlKey && !me.shiftKey && !me.altKey) event.preventDefault(); });
 },
 resize(c) {
  const content = document.createElement('section'); content.id = 'resize-content'; content.setAttribute('aria-label', '크기 조절 대상');
  content.innerHTML = '<h2>신청 안내</h2><p>선택한 화면 크기가 이 예제 영역에만 적용됩니다.</p>';
  content.style.fontSize = '100%';
  c.element.scaleTargetId = 'resize-content';
  const button = c.action('예제 확인', () => c.announce('확대된 예제 영역의 버튼을 확인했습니다.'));
  c.form.append(content); content.append(button);
  c.element.addEventListener('value-change', ((event: CustomEvent) => c.announce(`화면 크기: ${event.detail.value}%`)) as EventListener);
 },
 'side-navigation'(c) {
  c.element.addEventListener('expanded-change', ((event: CustomEvent) => c.announce(`열린 메뉴: ${event.detail.ids.join(', ') || '없음'}`)) as EventListener);
  c.form.addEventListener('click', event => {
   const anchor = sameTarget(event, 'a[href]') as HTMLAnchorElement | undefined; const me = event as MouseEvent;
   if (!anchor || me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
   event.preventDefault();
   const route = new URL(anchor.href).searchParams.get('route') ?? '';
   const item = c.element.items.flatMap((entry: any) => [entry, ...(entry.children ?? [])]).find((entry: any) => entry.href === anchor.getAttribute('href'));
   if (item) c.element.currentId = item.id;
   c.announce(route.replace(/^apply-new$/, 'apply'));
  });
 },
 'skip-link'(c) { mainTarget(c); },
 snackbar(c) {
  const element = c.element;
  element.durationMs = 5000;
  element.fallbackFocusId = 'after-notification';
  element.action = {kind: 'button', id: 'undo', label: '실행 취소'};
  const after = c.button('알림 뒤 위치', {id: 'after-notification'});
  c.form.append(after);
  element.addEventListener('action', () => { element.message = null; c.announce('신청 저장을 취소했습니다.'); });
  element.addEventListener('dismiss', () => { element.message = null; c.announce('알림을 닫았습니다.'); });
 },
 spinner(c) {
  c.action('작업 완료', () => { c.element.pending = false; c.announce('신청 내역을 불러왔습니다.'); }, 'finish-work');
 },
 'step-indicator'() {},
 'structured-list'(c) {
  for (const item of c.element.items) for (const [label, verb] of [['공유', '공유'], ['저장', '저장']] as const) {
   const button = c.button(`${item.title} ${label}`); button.slot = `actions-${item.id}`;
   c.bind(button).addEventListener('click', () => c.announce(`${item.title}을(를) ${verb}했습니다.`));
   c.element.append(button);
  }
 },
 'tab-bar'(c) { c.element.addEventListener('menu-request', () => c.announce('전체 메뉴 요청')); pageTall(c); },
 table() {},
 tabs(c) {
  c.element.label = '신청 정보';
  c.element.items = [{value: 'basic', label: '기본', content: '기본 내용'}, {value: 'detail', label: '상세', content: '상세 내용'}];
  c.element.addEventListener('value-change', ((event: CustomEvent) => c.announce(`선택한 탭: ${event.detail.value}`)) as EventListener);
 },
 tag(c) {
  c.element.addEventListener('selection-change', ((event: CustomEvent) => c.announce(`선택한 필터: ${event.detail.ids.map((id: string) => c.element.items.find((item: any) => item.id === id)?.label).join(', ') || '없음'}`)) as EventListener);
  c.form.addEventListener('click', event => { if (sameTarget(event, 'a[href]')) event.preventDefault(); });
 },
 'text-list'() {},
 toast(c) {
  const element = c.element;
  const result = document.createElement('section'); result.setAttribute('aria-label', '처리 결과 확인');
  const persistent = document.createElement('p'); persistent.id = 'saved-result'; persistent.dataset.persistentResult = ''; result.append(persistent);
  const save = c.action('신청 저장', () => {
   persistent.textContent = '신청이 저장되었습니다.';
   element.message = {id: `saved-${++c.count}`, text: '신청이 저장되었습니다.', tone: 'information', persistentResultId: 'saved-result'};
  }, 'save-button');
  save.after(result);
  element.addEventListener('dismiss', () => { element.message = null; });
 },
 tooltip(c) {
  c.element.addEventListener('open-change', ((event: CustomEvent) => c.announce(event.detail.open ? '보충 설명을 보였습니다.' : '보충 설명을 숨겼습니다.')) as EventListener);
 },
 tts(c) {
  const note = c.note('로컬 음성 안내 시뮬레이션 — 실제 음성을 재생하지 않으며 네트워크를 사용하지 않습니다.');
  note.setAttribute('role', 'note');
  const names: Record<string, string> = {playing: '읽는 중', paused: '일시 정지됨', idle: '준비'};
  const status = c.note('시뮬레이션 상태: 준비'); status.dataset.ttsState = '';
  c.element.addEventListener('request', ((event: CustomEvent) => {
   const next = {play: 'playing', resume: 'playing', pause: 'paused', stop: 'idle'}[event.detail.action as 'play'] ?? 'idle';
   c.element.state = next; status.textContent = `시뮬레이션 상태: ${names[next]}`; c.announce(`음성 시뮬레이션: ${names[next]}`);
  }) as EventListener);
 },
 'tutorial-panel'(c) { tutorialTargets(c); },
 'visually-hidden'(c) {
  c.element.id = 'hidden-help'; c.element.lang = 'ko';
  const button = c.action('신청 확인', () => c.announce('신청 내용을 확인했습니다.'));
  button.setAttribute('aria-describedby', 'hidden-help');
  c.form.insertBefore(button, c.element);
 },
 'accessible-media'() {},
 badge() {},
 breadcrumb() {},
};

function mainTarget(c: Ctx) {
 const main = document.createElement('section'); main.id = 'main-content'; main.tabIndex = -1;
 main.innerHTML = '<h2>신청 안내 본문</h2><p>화면 안에서 이동할 수 있는 로컬 신청 안내입니다.</p>';
 c.form.append(main);
}
function pageTall(c: Ctx) {
 const spacer = document.createElement('div'); spacer.style.cssText = 'block-size:600px;inline-size:100%'; spacer.setAttribute('role', 'presentation'); c.form.append(spacer);
}
function formControls(c: Ctx) {
 const result = document.createElement('output'); result.setAttribute('aria-label', '입력 결과'); result.dataset.formResult = '';
 const check = c.button('입력 확인');
 c.bind(check).addEventListener('click', () => { const data = new FormData(c.form); result.textContent = JSON.stringify([...data.entries()].map(([key, value]) => [key, String(value)])); });
 c.reset('입력 초기화', () => { result.textContent = ''; });
 c.form.addEventListener('submit', event => event.preventDefault());
 c.form.append(check, result);
 const events = ['value-change', 'checked-change'];
 for (const name of events) c.element.addEventListener(name, ((event: CustomEvent) => { c.count++; c.announce(`${name} ${c.count}회: ${JSON.stringify(event.detail ?? {})}`); }) as EventListener);
 if (c.id === 'text-input') { const error = document.createElement('p'); error.id = 'name-error'; error.textContent = '신청인 이름을 입력하세요'; c.form.insertBefore(error, c.element); }
 if (c.id === 'text-input') c.element.iconAction = {label: '입력 지우기', onAction: () => c.announce('아이콘 동작을 실행했습니다.')};
}
function tutorialTargets(c: Ctx) {
 const input = document.createElement('input'); input.id = 'applicant-name'; input.setAttribute('aria-label', '신청인 이름');
 const after = document.createElement('span'); after.id = 'applicant-name-after';
 const save = c.button('신청 저장', {id: 'save-application'});
 c.bind(save).addEventListener('click', () => c.announce('신청이 저장되었습니다.'));
 const saveAfter = document.createElement('span'); saveAfter.id = 'save-application-after';
 const fallback = c.button('도움 바깥 위치', {id: c.id === 'coach-mark' ? 'coach-fallback' : 'tutorial-fallback'});
 const status = c.note('현재 대상: 없음'); status.dataset.tutorialStatus = '';
 c.form.append(input, after, save, saveAfter, fallback);
 const label = (stepId?: string | null) => (c.element.tasks?.flatMap((task: any) => task.steps) ?? c.element.steps ?? []).find((step: any) => step.id === stepId)?.title;
 if (c.id === 'coach-mark') {
  const start = c.action('따라하기 시작', () => c.element.start?.(), 'tutorial-start');
  c.form.insertBefore(start, input);
  c.element.addEventListener('open-change', ((event: CustomEvent) => { c.element.open = event.detail.open; status.textContent = event.detail.open ? '현재 대상: 신청인 이름' : '현재 대상: 없음'; }) as EventListener);
  return;
 }
 c.element.tasks = [...c.element.tasks, {id: 'review', title: '신청 검토하기', steps: [{id: 'check', title: '이름 확인', targetId: 'applicant-name', instruction: '입력한 이름을 확인하세요'}]}];
 c.element.addEventListener('task-change', ((event: CustomEvent) => { c.element.activeTaskId = event.detail.id; if (event.detail.id === null) c.element.activeStepId = null; }) as EventListener);
 const mark = (stepId: string | null) => {
  for (const target of [input, save]) target.removeAttribute('data-tour-active');
  const step = c.element.tasks[0].steps.find((item: any) => item.id === stepId);
  if (step) document.getElementById(step.targetId)?.setAttribute('data-tour-active', '');
  status.textContent = `현재 대상: ${step ? label(step.id) === '신청 저장' ? '신청 저장' : '신청인 이름' : '없음'}`;
 };
 c.element.addEventListener('start', ((event: CustomEvent) => { c.element.activeTaskId = event.detail.taskId; c.element.activeStepId = event.detail.stepId; mark(event.detail.stepId); }) as EventListener);
 c.element.addEventListener('step-change', ((event: CustomEvent) => { c.element.activeStepId = event.detail.id; mark(event.detail.id); }) as EventListener);
 c.element.addEventListener('stop', () => { c.element.activeStepId = null; mark(null); });
}

/** A fresh native instance per mount; only the selected custom element is connected. */
export function mountLitExample(container: HTMLElement, id: string) {
 const record = acceptance.find(x => x.componentId === id); const build = builders[id];
 if (!record || !build) throw Error('Missing Lit example ' + id);
 registerKrdsElements(customElements);
 const element = document.createElement('krds-' + id) as El;
 const state = initial(record.initialState as Record<string, unknown>, id) as Record<string, any>;
 const initialState = structuredClone(state);
 // Controlled `page`/`running`/`activePanel` are replaced by their uncontrolled Lit equivalents so no mode switches occur.
 if ('page' in state) { state.defaultPage = state.page; delete state.page; }
 if (id === 'tutorial-panel') { delete state.running; delete state.activePanel; delete state.activeStepId; state.defaultRunning = false; state.defaultActivePanel = 'tutorial'; }
 if (id === 'bottom-sheet') { delete state.defaultOpen; }
 if (id === 'tag') delete state.selectedIds;
 if (id === 'image') delete state.failureSpecimen;
 if (id === 'pagination') { const template = String(record.initialState.hrefTemplate); delete state.hrefTemplate; state.hrefForPage = (page: number) => routeUrl(id, template.replace('/local/', '').replace('{page}', String(page)).replaceAll('/', '-').replace(/[?=]/g, '-')); }
 Object.assign(element, state);
 // Explicit disposal: every listener on the example element and its form is bound to one AbortController.
 const abort = new AbortController();
 const bind = <T extends EventTarget>(target: T): T => { const original = target.addEventListener.bind(target); target.addEventListener = ((type: string, listener: any, options?: any) => original(type, listener, {...(typeof options === 'object' ? options : {capture: !!options}), signal: abort.signal})) as typeof target.addEventListener; return target; };
 bind(element);
 const result = document.createElement('output'); result.dataset.demoResult = ''; result.setAttribute('aria-live', 'polite'); result.hidden = true; // announcements appear only after a real action
 const form = document.createElement('form'); bind(form); form.addEventListener('submit', event => event.preventDefault());
 const resets = document.createElement('div'); resets.dataset.demoActions = ''; resets.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
 const ctx: Ctx = {bind, id, element, form, count: 0,
  announce(text) { result.hidden = false; result.textContent = text; },
  state: initialState, button: hostButton,
  action(label, run, buttonId) { const button = hostButton(label, {id: buttonId}); bind(button); button.addEventListener('click', run); form.append(button); return button; },
  reset(label, run) { const button = hostButton(label, {type: 'reset'}); bind(button).addEventListener('click', run); resets.append(button); return button; },
  note(text, noteId) { const p = document.createElement('p'); p.textContent = text; if (noteId) p.id = noteId; form.append(p); return p; }};
 form.append(element);
 build(ctx);
 // Hosts add trigger controls before the primary element so the document order is trigger, component, result.
 form.append(result);
 // Reset controls sit in an actions row after the result region, never inside it.
 if (resets.childElementCount) form.append(resets);
 container.append(form);
 return {element, dispose() {
  // Every example listener is signal-bound, so one abort removes them all.
  abort.abort(); form.remove();
 }};
}
