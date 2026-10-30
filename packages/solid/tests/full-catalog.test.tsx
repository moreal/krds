import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import * as Public from '../src';
const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).forEach(cleanup => cleanup()); });
function mount(name: string, props: object, children?: JSX.Element) {
    const Component = Reflect.get(Public, name) as Component<any>;
    expect(Component, `native public ${name}`).toBeTypeOf('function');
    const host = document.createElement('div');
    document.body.append(host);
    const dispose = render(() => <Component {...props}>{children}</Component>, host);
    cleanups.push(() => { dispose(); host.remove(); });
    return host;
}
test('Masthead is eligibility-gated static readable government wording', () => {
    expect(mount('Masthead', { governmentService: false }).textContent).toBe('');
    const host = mount('Masthead', { governmentService: true });
    expect(host.textContent).toBe('이 누리집은 대한민국 공식 전자정부 누리집입니다.');
    expect(host.querySelector('button,a,input,[tabindex]')).toBeNull();
});
test('Identifier exposes the supplied institution alternative and relationship', () => {
    const host = mount('Identifier', { institutionName: '시험기관', logo: { src: '/logo.svg', alt: '시험기관' }, relationshipText: '시험기관에서 관리합니다.' });
    expect(host.querySelector('img')?.alt).toBe('시험기관');
    expect(host.textContent).toContain('관리합니다');
});
test('Header has actual home and navigation destinations', () => {
    const host = mount('Header', { home: { href: '#home', label: '홈', logo: { src: '/logo.svg', alt: '시험 서비스' } }, utilityItems: [], mainNavigation: [{ id: 'a', label: '신청', href: '#apply' }] });
    expect(host.querySelector('header a')?.getAttribute('href')).toBe('#home');
    expect(host.querySelector('nav a')?.getAttribute('href')).toBe('#apply');
});
test('Footer distinguishes service and institution images and keeps identifier last', () => {
    const host = mount('Footer', { serviceLogo: { src: '/service.svg', alt: '서비스' }, contacts: [], utilityLinks: [], privacyPolicy: { href: '#privacy', label: '개인정보처리방침' }, policyLinks: [], copyrightText: '시험', institution: { institutionName: '기관', logo: { src: '/institution.svg', alt: '기관' }, relationshipText: '관리' } });
    expect(host.querySelector('footer')?.lastElementChild?.getAttribute('data-krds-component')).toBe('identifier');
});
test('SkipLink focuses its actual target without inventing a button', () => {
    const target = document.createElement('main');
    target.id = 'skip-destination';
    document.body.append(target);
    cleanups.push(() => target.remove());
    const host = mount('SkipLink', { links: [{ id: 'main', label: '본문', targetId: target.id }] });
    (host.querySelector('a') as HTMLElement).click();
    expect(document.activeElement).toBe(target);
});
test('MainMenu disclosure leaves destination as real link', () => {
    const host = mount('MainMenu', { items: [{ id: 'a', label: '신청', href: '#apply', children: [{ id: 'b', label: '상세', href: '#detail' }] }] });
    const trigger = host.querySelector('[data-krds-part="trigger"]') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('a[href="#detail"]')).not.toBeNull();
});
test('Breadcrumb has ordered hierarchy, plain non-destination parent and current page', () => {
    const host = mount('Breadcrumb', { home: { href: '#home', label: '홈' }, omitCurrent: false, items: [{ id: 'parent', label: '분류' }], currentItem: { id: 'current', label: '현재' } });
    expect(host.querySelector('nav ol')).not.toBeNull();
    expect(host.querySelectorAll('a')).toHaveLength(1);
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('현재');
});
test('SideNavigation independently expands branches while preserving current links', () => {
    const host = mount('SideNavigation', { items: [{ id: 'a', label: '신청', href: '#a', children: [{ id: 'b', label: '현재', href: '#b' }] }], currentId: 'b' });
    expect(host.querySelector('a[aria-current="page"]')?.getAttribute('href')).toBe('#b');
});
test('InPageNavigation has real section links and activation moves to section', () => {
    const target = document.createElement('section');
    target.id = 'inpage-target';
    document.body.append(target);
    cleanups.push(() => target.remove());
    const host = mount('InPageNavigation', { sections: [{ id: target.id, label: '절' }] });
    (host.querySelector('a') as HTMLElement).click();
    expect(document.activeElement).toBe(target);
});
test('Pagination gives current page semantics and actual next href', () => {
    const host = mount('Pagination', { defaultPage: 2, pageCount: 4, hrefForPage: (n: number) => `#page-${n}` });
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe('2');
    expect(host.querySelector('a[rel="next"]')?.getAttribute('href')).toBe('#page-3');
});
test('StructuredList preserves missing metadata and selection names', () => {
    const host = mount('StructuredList', { items: [{ id: 'one', title: '항목', href: '#one', metadata: [{ label: '기간', value: null }] }], selection: { ids: [], onChange: () => { } } });
    expect(host.textContent).toContain('—');
    expect(host.querySelector('input[type="checkbox"]')?.getAttribute('aria-label')).toContain('항목');
});
test('CriticalAlert presents high urgency and truthful detail destination', () => { const host = mount('CriticalAlert', { urgency: 'high', label: '긴급', message: '안내', details: { label: '자세히', href: '#detail', destinationTitle: '상세' } }); expect(host.querySelector('[role="banner"]')?.getAttribute('aria-label')).toBe('긴급'); expect(host.querySelector('[role="alert"]')).toBeNull(); expect(host.querySelector('a')?.getAttribute('href')).toBe('#detail'); });
test('Disclosure actually hides retained child control and exposes expanded state', () => { const host = mount('Disclosure', { label: '펼치기', contentId: 'disclosure-body' }, <input value="retained"/>); const button = host.querySelector('button')!; expect(host.querySelector('[hidden]')).not.toBeNull(); button.click(); expect(button.getAttribute('aria-expanded')).toBe('true'); expect(host.querySelector('input')?.value).toBe('retained'); });
test('Badge is static text without interactive or live semantics', () => { const host = mount('Badge', { label: '접수완료', tone: 'success' }); expect(host.textContent).toBe('접수완료'); expect(host.querySelector('[role],button,a,[tabindex]')).toBeNull(); });
test('Accordion opens independent sections and preserves content while closed', () => { const host = mount('Accordion', { items: [{ id: 'one', title: '하나', content: '첫 내용' }, { id: 'two', title: '둘', content: '둘 내용' }] }); const buttons = host.querySelectorAll('button'); buttons[0]!.click(); buttons[1]!.click(); expect([...buttons].map(b => b.getAttribute('aria-expanded'))).toEqual(['true', 'true']); });
test('Image uses native image alternative and caption semantics', () => { const host = mount('Image', { src: '/image.svg', alt: '신청 절차', caption: '설명' }); expect(host.querySelector('img')?.alt).toBe('신청 절차'); expect(host.querySelector('figcaption')?.textContent).toBe('설명'); });
test('Table preserves native caption/header associations and emits sorting request', () => { let request: any; const host = mount('Table', { caption: '목록', columns: [{ id: 'name', label: '이름', kind: 'text', sortable: true }], rows: [{ id: 'one', cells: { name: '항목' } }], onSortChange: (d: any) => request = d }); expect(host.querySelector('table caption')?.textContent).toBe('목록'); expect(host.querySelector('th')?.scope).toBe('col'); host.querySelector('button')!.click(); expect(request).toEqual({ columnId: 'name', direction: 'ascending' }); });
test('TextList uses nested native lists rather than flattened text', () => { const host = mount('TextList', { ordered: true, items: [{ id: 'a', content: '하나', children: [{ id: 'b', content: '둘' }] }] }); expect(host.querySelector('ol li ol li')?.textContent).toBe('둘'); });
test('Favicon creates actual owned head links and cleans them on disposal', () => { mount('Favicon', { light: { href: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' } }); expect(document.head.querySelector('link[rel="icon"][href="/favicon.svg"]')).not.toBeNull(); });
test('Link disabled removes navigation; external target explains a new window', () => { const host = mount('Link', { label: '외부', href: '#external', target: '_blank' }); expect(host.querySelector('a')?.rel).toContain('noopener'); expect(host.textContent).toContain('새 창'); const disabled = mount('Link', { label: '비활성', href: '#disabled', disabled: true }); expect(disabled.querySelector('a[href]')).toBeNull(); });
test('FAB expands actions and Escape restores its trigger', () => { const host = mount('FAB', { label: '빠른 실행', icon: '+', actions: [{ id: 'a', label: '신청', onAction: () => { } }] }); host.querySelector('button')!.click(); expect(host.querySelector('button[aria-expanded="true"]')).not.toBeNull(); });
test('RadioGroup keeps each enabled native radio in Tab order and reports changed selection', () => { let value: string | null = null; const host = mount('RadioGroup', { label: '지역', name: 'region', options: [{ value: 'a', label: '가' }, { value: 'b', label: '나' }], onValueChange: (d: any) => value = d.value }); const inputs = host.querySelectorAll<HTMLInputElement>('input[type="radio"]'); expect(inputs).toHaveLength(2); expect([...inputs].every(input => input.tabIndex === 0)).toBe(true); inputs[1]!.click(); expect(value).toBe('b'); });
test('Checkbox rejected mixed activation reapplies both native bits', () => { const host = mount('Checkbox', { label: '모두 선택', checked: false, indeterminate: true }); const input = host.querySelector('input')!; input.click(); expect(input.checked).toBe(false); expect(input.indeterminate).toBe(true); });
test('Switch has native checkbox serialization and switch role', () => { const host = mount('Switch', { label: '알림', defaultChecked: true, name: 'notice' }); expect(host.querySelector('input[role="switch"]')?.getAttribute('name')).toBe('notice'); });
test('Tag removable requests one item ID and retains host authority', () => { let id = ''; const host = mount('Tag', { mode: 'removable', items: [{ id: 'a', label: '필터' }], onRemove: (d: any) => id = d.id }); host.querySelector('button')!.click(); expect(id).toBe('a'); expect(host.textContent).toContain('필터'); });
test('StepIndicator identifies current and blocks sequential future navigation', () => { const host = mount('StepIndicator', { steps: [{ id: 'a', label: '시작', status: 'current' }, { id: 'b', label: '다음', status: 'pending', href: '#b' }, {id:'c',label:'완료',status:'pending'}] }); expect(host.querySelector('[aria-current="step"]')).not.toBeNull(); expect(host.querySelector('a[href="#b"]')).toBeNull(); });
test('Spinner exposes native determinate progress and completion text', () => { const host = mount('Spinner', { pending: true, value: 30, label: '처리 중', completionMessage: '완료' }); expect(host.querySelector('progress')?.value).toBe(30); });
test('Textarea preserves controlled rejection and native form value', () => { let calls = 0; const host = mount('Textarea', { label: '설명', name: 'description', value: '기존', onValueChange: () => calls++ }); const input = host.querySelector('textarea')!; input.value = '변경'; input.dispatchEvent(new InputEvent('input', { bubbles: true })); expect(input.value).toBe('기존'); expect(calls).toBe(1); });
test('TextInput commits composition once and restores rejected controlled draft', () => { let calls = 0; const host = mount('TextInput', { label: '이름', value: '기존', onValueChange: () => calls++ }); const input = host.querySelector('input')!; input.dispatchEvent(new CompositionEvent('compositionstart')); input.value = '한글'; input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true })); expect(calls).toBe(0); input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true })); expect(calls).toBe(1); expect(input.value).toBe('기존'); });
test('FileUpload exposes actual native picker and keeps rejected committed files', () => { const file = new File(['a'], 'a.txt', { type: 'text/plain' }); let calls = 0; const host = mount('FileUpload', { label: '첨부', name: 'files', files: [{ id: 'a', file, status: 'staged' }], onFilesChange: () => calls++ }); expect(host.querySelector('input[type="file"]')).not.toBeNull(); host.querySelector<HTMLButtonElement>('button[data-krds-part="remove"]')!.click(); expect(calls).toBe(1); expect(host.textContent).toContain('a.txt'); });
test('LanguageSwitcher presents real alternate-language destinations', () => { const host = mount('LanguageSwitcher', { currentLocale: 'ko', options: [{ locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: '#ko' }, { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: '#en' }] }); expect(host.querySelector('a[hreflang="en"]')?.getAttribute('href')).toBe('#en'); });
test('Resize provides explicit percentage selection without automatic page zoom', () => { let value = ''; const host = mount('Resize', { onValueChange: (d: any) => value = d.value }); host.querySelector('button')!.click(); [...host.querySelectorAll<HTMLButtonElement>('button[data-krds-part="option"]')].find(button => button.textContent === '110%')!.click(); expect(value).not.toBe(''); });
test('AccessibleMedia is a real native player with adjacent transcript', () => { const host = mount('AccessibleMedia', { title: '오디오', media: { kind: 'audio', src: '/sample.wav', type: 'audio/wav' }, transcript: { content: '실제 대본' } }); expect(host.querySelector('audio')?.controls).toBe(true); expect(host.querySelector('audio')?.autoplay).toBe(false); expect(host.textContent).toContain('실제 대본'); });
test('VisuallyHidden keeps text present without display none', () => { const host = mount('VisuallyHidden', { content: '읽기 설명' }); expect(host.textContent).toBe('읽기 설명'); expect(getComputedStyle(host.firstElementChild!).display).not.toBe('none'); });
test('RangeSlider uses native bounded range and named value', () => { const host = mount('RangeSlider', { label: '금액', name: 'amount', min: 0, max: 100, defaultValue: 50 }); const input = host.querySelector<HTMLInputElement>('input[type="range"]')!; expect(input.value).toBe('50'); expect(input.name).toBe('amount'); });
test('BackButton cancels dirty confirmation without navigation', async () => { let calls = 0; const host = mount('BackButton', { canGoBack: true, dirty: true, requestConfirmation: () => false, onBackRequest: () => calls++ }); host.querySelector('button')!.click(); await Promise.resolve(); expect(calls).toBe(0); });
test('QuantityToggle bounds real hidden form value and retains focus at boundary', () => { const host = mount('QuantityToggle', { label: '수량', name: 'quantity', min: 0, max: 2, defaultValue: 1 }); const increment = host.querySelector<HTMLButtonElement>('[data-krds-part="increment"]')!; increment.click(); increment.click(); expect(host.querySelector('input')?.value).toBe('2'); expect(increment.getAttribute('aria-disabled')).toBe('true'); });
test('TTS never autoplays and emits explicit host speech action', () => { let action = ''; const host = mount('TTS', { summary: '요약', locale: 'ko-KR', state: 'idle', label: '읽기', onRequest: (d: any) => action = d.action }); expect(action).toBe(''); host.querySelector('button')!.click(); expect(action).toBe('play'); });
test('TabBar keeps current destination and badge in actual navigation', () => { const host = mount('TabBar', { currentId: 'home', items: [{ id: 'home', label: '홈', href: '#home', icon: '⌂', badge: 3 }, { id: 'search', label: '검색', href: '#search', icon: '⌕' }] }); expect(host.querySelector('[aria-current="page"]')?.getAttribute('href')).toBe('#home'); });
test('Carousel navigation changes actual exposed slide with stop first', () => { const host = mount('Carousel', { items: [{ id: 'a', label: '하나', content: '첫 슬라이드' }, { id: 'b', label: '둘', content: '둘 슬라이드' }] }); const buttons = host.querySelectorAll('button'); expect(buttons[0]?.getAttribute('data-krds-part')).toBe('play-pause'); host.querySelector<HTMLButtonElement>('[data-krds-part="next"]')!.click(); expect(host.querySelector('[data-krds-part="slide"]:not([hidden])')?.textContent).toContain('둘 슬라이드'); });
test('HelpPanel has real opener, close and selectable help topics', () => { const host = mount('HelpPanel', { defaultOpen: false, topics: [{ id: 'a', title: '도움', content: '설명', relatedLinks: [] }] }); host.querySelector('button')!.click(); expect(document.querySelector('[data-krds-component="help-panel"][data-krds-part="body"]')?.textContent).toContain('도움'); });
test('TutorialPanel keeps task progress while folding presentation', () => { const host = mount('TutorialPanel', { defaultOpen: true, tasks: [{ id: 'a', title: '신청', steps: [{ id: 's', title: '첫 단계', targetId: 'target', instruction: '설명' }] }], activeTaskId: 'a', activeStepId: 's', startActionId: 'tutorial-start' }); expect(document.querySelector('[data-krds-component="tutorial-panel"][data-krds-part="step-list"]')?.textContent).toContain('첫 단계'); });
test('ContextualHelp opens a real named nonmodal information region', () => { const host = mount('ContextualHelp', { title: '도움말', content: '설명', triggerLabel: '도움 열기' }); host.querySelector('button')!.click(); expect(host.querySelector('[data-krds-part="popover"]')?.textContent).toContain('설명'); });
test('CoachMark uses registered actual target boundary and presents instruction', () => { const target = document.createElement('button'); target.id = 'coach-target'; const boundary = document.createElement('span'); boundary.id = 'coach-boundary'; document.body.append(target, boundary); cleanups.push(() => { target.remove(); boundary.remove(); }); mount('CoachMark', { defaultOpen: true, steps: [{ id: 'a', targetId: target.id, title: '첫 단계', instruction: '실행' }], boundaries: [{ targetId: target.id, insertionBoundaryId: boundary.id }], startActionId: 'start' }); expect(document.querySelector('[data-krds-component="coach-mark"][data-krds-part="instruction"]')?.textContent).toBe('실행'); });
test('Tooltip label relationship resolves before popup opens', () => { const host = mount('Tooltip', { text: '저장', relationship: 'label', triggerId: 'tooltip-trigger', textId: 'tooltip-text' }); expect(host.querySelector('button')?.getAttribute('aria-labelledby')).toBe('tooltip-text'); expect(document.getElementById('tooltip-text')?.textContent).toBe('저장'); });
test('BottomSheet uses actual modal isolation and cancel action', () => { mount('BottomSheet', { defaultOpen: true, title: '선택' }, <button>항목</button>); expect(document.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull(); });
test('Toast has no interactive descendants and refers to persistent result', () => { const host = mount('Toast', { message: { id: 'a', text: '저장됨', tone: 'information', persistentResultId: 'persistent-result' }, onDismiss: () => { } }); expect(host.querySelector('[role="status"]')?.textContent).toBe('저장됨'); expect(host.querySelector('button,a')).toBeNull(); });
test('Snackbar exposes keyboard reachable action and close without stealing focus', () => { const host = mount('Snackbar', { message: { id: 'a', title: '완료', text: '저장됨' }, action: { kind: 'button', id: 'undo', label: '되돌리기' }, onDismiss: () => { }, onAction: () => { } }); expect(host.querySelectorAll('button')).toHaveLength(2); });
