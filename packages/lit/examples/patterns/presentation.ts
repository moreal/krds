/** Native, presentation-only Lit composition. No private model, driver or browser routing. */
import { LitElement, html, type PropertyValues } from 'lit';
import { registerKrdsElements } from '@unofficial-krds/lit';
import type { PatternView, PatternContent, PresentationAction, LayoutId } from './types.js';
export class PatternPresentation extends LitElement {
    static override properties = { state: { attribute: false }, content: { attribute: false }, onAction: { attribute: false }, hrefForPage: { attribute: false }, hrefForSection: { attribute: false } };
    declare state: PatternView;
    declare content: PatternContent;
    declare onAction: (action: PresentationAction) => void;
    declare hrefForPage: (page: number) => string;
    declare hrefForSection: (section: LayoutId) => string;
    private scrollPosition: {
        x: number;
        y: number;
    } | null = null;
    private previousModal = false;
    private pageFocus = false;
    override createRenderRoot() { return this; }
    constructor() { super(); this.onAction = () => { }; this.hrefForPage = page => `?page=${page}`; this.hrefForSection = section => `?section=${section}`; }
    private action(action: PresentationAction) { if (action.type === 'page')
        this.pageFocus = true;
    else if (['query', 'filter', 'search', 'reset'].includes(action.type))
        this.pageFocus = false; this.onAction(action); }
    private field(field: 'title' | 'category' | 'detail') { return (event: CustomEvent<{
        value: string;
    }>) => { event.stopPropagation(); this.action({ type: 'field', field, value: event.detail.value }); }; }
    private link = (event: MouseEvent) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
        const anchor = event.composedPath().find(node => node instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined;
        if (!anchor)
            return;
        const section = new URL(anchor.href).searchParams.get('section');
        if (section && Object.hasOwn(this.content.layoutSections, section)) {
            event.preventDefault();
            this.action({ type: 'navigate', id: section as LayoutId });
        }
    };
    private implicitSubmit = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229 || event.defaultPrevented)
            return;
        const input = event.composedPath()[0];
        if (!(input instanceof HTMLInputElement) || !input.shadowRoot && input.getRootNode() instanceof Document)
            return;
        const form = event.currentTarget as HTMLFormElement;
        const submit = form.querySelector<HTMLElement>('krds-button[type=submit]')?.shadowRoot?.querySelector<HTMLButtonElement>('button');
        if (!submit || submit.disabled)
            return;
        event.preventDefault();
        submit.click();
    };
    private formSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        // Preserve the browser's real submitter and FACE data for host observability.
        const form = event.currentTarget as HTMLFormElement;
        const data = new FormData(form, event.submitter as HTMLButtonElement | null);
        this.dispatchEvent(new CustomEvent('pattern-form-submit', { bubbles: true, composed: true, detail: { entries: [...data.entries()], submitter: event.submitter?.getAttribute('name') ?? null } }));
        this.action({ type: this.state.patternId === 'search-results' ? 'search' : 'submit' });
    };
    private reset = (event: Event) => { queueMicrotask(() => { if (!event.defaultPrevented && this.isConnected)
        this.action({ type: 'reset' }); }); };
    private review = (event: Event) => { const button = (event.currentTarget as HTMLElement).shadowRoot?.querySelector('button'); button?.focus({ preventScroll: true }); this.scrollPosition = { x: window.scrollX, y: window.scrollY }; this.action({ type: 'review' }); };
    /** Wait for actual nested native commits, then resolve semantic IDs to real controls. */
    async settled() {
        await this.updateComplete;
        const visit = async (root: ParentNode): Promise<void> => { for (const element of root.querySelectorAll('*')) {
            if ('updateComplete' in element)
                await (element as LitElement).updateComplete;
            if (element.shadowRoot)
                await visit(element.shadowRoot);
        } };
        await visit(this);
        this.wireControlIds();
    }
    private wireControlIds() {
        const assign = (hostId: string, selector: string, id = hostId) => { const host = this.querySelector(`#${hostId}`); const control = host?.shadowRoot?.querySelector<HTMLElement>(selector); if (!control)
            return; const old = control.id; control.id = id; host!.shadowRoot!.querySelectorAll('label').forEach(label => { if (label.htmlFor === old)
            label.htmlFor = id; }); };
        for (const [field, id] of Object.entries(this.content?.fieldIds ?? {}))
            assign(id, field === 'category' ? 'select' : field === 'detail' ? 'textarea' : 'input');
        const category = this.querySelector('#example-form-category');
        const categoryError = this.state.patternId === 'form-errors' ? this.state.errors.find(item => item.field === 'category') : undefined;
        if (categoryError) {
            const message = category?.shadowRoot?.querySelector('[part=error]');
            const select = category?.shadowRoot?.querySelector('select');
            if (message)
                message.id = categoryError.errorId;
            select?.setAttribute('aria-describedby', categoryError.errorId);
        }
        assign('example-search-query', 'input');
        assign('example-search-category', 'select');
        const modal = this.querySelector('krds-modal');
        const dialog = modal?.shadowRoot?.querySelector('dialog');
        if (dialog) {
            dialog.id = 'example-consent-dialog';
            dialog.setAttribute('aria-labelledby', 'example-consent-dialog-title');
            const title = dialog.querySelector('h2');
            if (title)
                title.id = 'example-consent-dialog-title';
        }
    }
    async focusTarget(id: string) {
        await this.settled();
        const search = (root: ParentNode): HTMLElement | null => { const direct = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`); if (direct) {
            const control = direct.shadowRoot?.querySelector<HTMLElement>('input,select,textarea,button');
            return control ?? direct;
        } for (const element of root.querySelectorAll('*'))
            if (element.shadowRoot) {
                const found = search(element.shadowRoot);
                if (found)
                    return found;
            } return null; };
        const target = search(this);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ block: 'nearest' });
    }
    override updated(_changed: PropertyValues) {
        void this.settled().then(() => { if (!this.isConnected)
            return; const open = this.state.patternId === 'consent-confirmation' && this.state.modalOpen; if (this.previousModal && !open && this.scrollPosition) {
            window.scrollTo({ left: this.scrollPosition.x, top: this.scrollPosition.y, behavior: 'instant' });
            this.scrollPosition = null;
        } this.previousModal = open; if (this.pageFocus && this.state.patternId === 'search-results' && this.state.phase === 'success') {
            this.pageFocus = false;
            if (document.activeElement === document.body) {
                const current = this.querySelector('krds-pagination')?.shadowRoot?.querySelector<HTMLElement>('[aria-current]');
                if (current) {
                    current.tabIndex = -1;
                    current.focus({ preventScroll: true });
                }
            }
        } });
    }
    private status() { const s = this.state; return html `${s.phase === 'loading' && !(s.patternId==='consent-confirmation'&&s.modalOpen) ? html `<krds-spinner completion-message="로컬 예제 처리 완료" label="로컬 예제 처리 중" .pending=${true}></krds-spinner>` : ''}${s.error && !(s.patternId === 'consent-confirmation' && s.modalOpen) ? html `<p role="alert">${s.error}</p>${s.phase === 'error' ? html `<krds-button id=${s.patternId === 'search-results' ? 'example-search-retry' : 'example-form-retry'} @click=${() => this.action({ type: 'retry' })}>다시 시도</krds-button>` : ''}` : ''}`; }
    private form() {
        const s = this.state;
        if (s.patternId !== 'form-errors')
            return '';
        const error = (field: string) => s.errors.find(item => item.field === field);
        return html `<main><h1>예제 입력폼</h1>${this.notices()}${s.errors.length ? html `<section id="example-form-errors" role="alert" aria-labelledby="error-summary-heading"><h2 id="error-summary-heading">입력 내용을 확인하세요</h2><ol>${s.errors.map(item => html `<li><a href=${`#${item.targetId}`} @click=${(event: Event) => { event.preventDefault(); this.action({ type: 'error-link', field: item.field }); }}>${item.message}</a></li>`)}</ol></section>` : ''}<form id="example-form" novalidate aria-busy=${s.phase === 'loading'} @keydown=${this.implicitSubmit} @submit=${this.formSubmit} @reset=${this.reset}>
    <krds-text-input id="example-form-title" label="예제 제목 (필수)" name="title" .value=${s.values.title} .required=${true} .disabled=${s.phase === 'loading'} .invalid=${!!error('title')} .error=${error('title')?.message ?? ''} .errorId=${error('title')?.errorId ?? ''} hint="4자 이상 60자 이하의 예제 문구" @value-change=${this.field('title')}></krds-text-input>
    <krds-native-select id="example-form-category" label="연습 유형 (필수)" name="category" .options=${this.content.formCategories} .value=${s.values.category} .required=${true} .disabled=${s.phase === 'loading'} .invalid=${!!error('category')} .error=${error('category')?.message ?? ''} @value-change=${this.field('category')}></krds-native-select>
    <krds-textarea id="example-form-detail" label="추가 설명 (선택)" name="detail" .value=${s.values.detail} .disabled=${s.phase === 'loading'} .invalid=${!!error('detail')} .error=${error('detail')?.message ?? ''} .errorId=${error('detail')?.errorId ?? ''} hint="120자 이하의 예제 설명" @value-change=${this.field('detail')}></krds-textarea>
    <div class="pattern-actions"><krds-button id="example-form-submit" type="submit" name="intent" value="save" .disabled=${s.phase === 'loading' || s.phase === 'success'}>예제 저장</krds-button><krds-button id="example-form-reset" type="reset" variant="secondary">초기화</krds-button></div></form>${this.status()}${s.receipt ? html `<p role="status">로컬 예제 완료 ${s.receipt.id}: ${s.receipt.title}</p>` : ''}</main>`;
    }
    private search() { const s = this.state; if (s.patternId !== 'search-results')
        return ''; return html `<main><h1>로컬 자료 검색</h1>${this.notices()}<p>열두 개의 가상 학습 자료를 검색합니다.</p><form role="search" @keydown=${this.implicitSubmit} @submit=${this.formSubmit}><krds-text-input id="example-search-query" label="검색어" name="query" type="search" .value=${s.query} @value-change=${(event: CustomEvent<{
        value: string;
    }>) => this.action({ type: 'query', value: event.detail.value })}></krds-text-input><krds-button id="example-search-submit" type="submit" name="intent" value="search" .disabled=${s.phase === 'loading'}>검색</krds-button><krds-native-select id="example-search-category" label="자료 유형" name="category" .value=${s.category} .options=${this.content.resourceCategories} @value-change=${(event: CustomEvent<{
        value: 'all' | 'guide' | 'example' | 'reference';
    }>) => this.action({ type: 'filter', category: event.detail.value })}></krds-native-select></form>${this.status()}${s.phase === 'success' ? html `<p id="example-search-count" aria-live="polite">${s.appliedQuery ? `“${s.appliedQuery}”` : '전체 검색'} · ${this.content.resourceCategories.find(item => item.value === s.category)?.label}: ${s.total}건</p>${s.total ? html `<h2>검색 결과</h2><krds-structured-list .items=${s.items.map(item => ({ id: item.id, title: item.title, metadata: [{ label: '요약', value: item.summary }, { label: '자료 유형', value: this.content.resourceCategories.find(category => category.value === item.category)?.label ?? item.category }, { label: '작성일', value: item.date }] }))}></krds-structured-list><krds-pagination .page=${s.page} .pageCount=${s.pageCount} .hrefForPage=${this.hrefForPage} @click=${(event: MouseEvent) => { if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey)
        event.preventDefault(); }} @page-change=${(event: CustomEvent<{
        page: number;
    }>) => this.action({ type: 'page', page: event.detail.page })}></krds-pagination>` : html `<p>검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.</p>`}` : ''}</main>`; }
    private consent() { const s = this.state; if (s.patternId !== 'consent-confirmation')
        return ''; return html `<main><h1>예제 이용 안내 확인</h1>${this.notices()}${this.content.consentContent.map((item, index) => html `<section class="consent-section"><h2>${item.title}</h2><div id=${`consent-description-${index}`}>${item.paragraphs.map(p => html `<p>${p}</p>`)}</div><krds-radio-group id=${`example-consent-${index === 0 ? 'required' : 'optional'}`} name=${item.id} .label=${item.title} .hint=${item.paragraphs.join(' ')} .options=${[{ value: 'agree', label: '동의함', id: `example-consent-${index === 0 ? 'required' : 'optional'}-agree` }, { value: 'decline', label: '동의하지 않음', id: `example-consent-${index === 0 ? 'required' : 'optional'}-decline` }]} .value=${s[item.id] === null ? null : s[item.id] ? 'agree' : 'decline'} .invalid=${index === 0 && s.phase === 'invalid'} .error=${index === 0 && s.phase === 'invalid' ? s.error ?? '' : ''} @value-change=${(event: CustomEvent<{
        value: string;
    }>) => this.action({ type: 'consent', field: item.id, value: event.detail.value === 'agree' })}></krds-radio-group></section>`)}<krds-button id="example-consent-review" @click=${this.review}>확인하기</krds-button>${this.status()}${s.receipt ? html `<p role="status">로컬 예제 완료 ${s.receipt.id} · 필수 동의함 · 선택 ${s.receipt.optionalChoice ? '동의함' : '동의하지 않음'}</p>` : ''}<krds-modal .open=${s.modalOpen} title="예제 선택 확인" description="선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다." return-focus-id="example-consent-review" @open-change=${(event: CustomEvent<{
        open: boolean;
    }>) => { if (!event.detail.open)
        this.action({ type: 'close' }); }} .body=${html `<div aria-busy=${s.phase === 'loading'}><p>필수: ${s.requiredChoice ? '동의함' : '동의하지 않음'}</p><p>선택: ${s.optionalChoice ? '동의함' : '동의하지 않음'}</p>${s.phase === 'loading' ? html `<krds-spinner completion-message="로컬 예제 처리 완료" label="로컬 예제 처리 중" .pending=${true}></krds-spinner>` : ''}${s.error ? html `<p role="alert">${s.error}</p><krds-button id="example-consent-retry" @click=${() => this.action({ type: 'retry' })}>다시 시도</krds-button>` : ''}</div>`} .actions=${html `<krds-button id="example-consent-cancel" variant="secondary" @click=${() => this.action({ type: 'close' })}>돌아가기</krds-button><krds-button id="example-consent-confirm" .disabled=${s.phase === 'loading' || s.phase === 'error'} @click=${() => this.action({ type: 'confirm' })}>예제 완료</krds-button>`}></krds-modal></main>`; }
    private notices() { return html `<p class="pattern-identity">${this.content.demoIdentity.name}</p><p>${this.content.demoIdentity.notice}</p><p>${this.content.demoIdentity.dataNotice}</p>`; }
    private layout() { const s = this.state; if (s.patternId !== 'service-layout')
        return ''; const nav = this.content.layoutNavigation.map(branch => ({ ...branch, children: branch.children?.map(item => ({ ...item, href: this.hrefForSection(item.id as LayoutId) })) })); const logo = { src: new URL('./independent-mark.svg', import.meta.url).href, alt: this.content.demoIdentity.name }; return html `<krds-skip-link .links=${[{ id: 'main', label: '본문 바로가기', targetId: 'example-main-heading' }]}></krds-skip-link><krds-header .home=${{ href: this.hrefForSection('overview'), label: this.content.demoIdentity.name, logo }} .mainNavigation=${nav} .utilityItems=${[]} .currentId=${s.currentId} .mobileOpen=${s.mobileOpen} mobile-trigger-id="example-layout-mobile-open" mobile-trigger-label="전체메뉴" navigation-label="주요 메뉴" @mobile-open-change=${(event: CustomEvent<{
        open: boolean;
    }>) => this.action({ type: 'mobile', open: event.detail.open })} @click=${this.link}></krds-header><div class="pattern-layout"><krds-side-navigation title="예제 메뉴" .items=${nav} .currentId=${s.currentId} .expandedIds=${s.expandedIds} @expanded-change=${(event: CustomEvent<{
        ids: string[];
    }>) => { for (const id of ['examples', 'help'] as const)
        if (s.expandedIds.includes(id) !== event.detail.ids.includes(id))
            this.action({ type: 'expand', id, expanded: event.detail.ids.includes(id) }); }} @click=${this.link}></krds-side-navigation><main id="example-main"><p>${this.content.demoIdentity.notice}</p><h1 id="example-main-heading" tabindex="-1">${this.content.layoutSections[s.currentId].title}</h1><p>${this.content.layoutSections[s.currentId].body}</p><krds-link label="키보드 이용 안내" .href=${this.hrefForSection('accessibility')} @click=${this.link}></krds-link></main></div><krds-footer .serviceLogo=${logo} .contacts=${[]} .utilityLinks=${[]} .privacyPolicy=${{ label: '개인정보 처리방침', href: this.hrefForSection('privacy') }} .policyLinks=${[{ label: '키보드 이용 안내', href: this.hrefForSection('accessibility') }]} .copyrightText=${this.content.demoIdentity.copyrightText} @click=${this.link}></krds-footer>`; }
    override render() { if (!this.state || !this.content)
        return html ``; return html `<style>krds-pattern-presentation{display:flex;flex-direction:column;min-block-size:100vh;max-inline-size:80rem;margin:auto;padding:1rem;box-sizing:border-box;font-family:system-ui;line-height:1.6;color:var(--krds-color-text-primary,#1e2124)}krds-pattern-presentation *{box-sizing:border-box}krds-pattern-presentation main{min-inline-size:0;flex:1}krds-pattern-presentation form{display:grid;gap:1.5rem;max-inline-size:48rem}krds-pattern-presentation .pattern-actions{display:flex;gap:2rem;flex-wrap:wrap;margin-block:1rem}krds-pattern-presentation .consent-section{padding-block:2rem;max-inline-size:52rem}krds-pattern-presentation .pattern-layout{display:grid;grid-template-columns:minmax(12rem,18rem) minmax(0,1fr);gap:2rem;flex:1}krds-pattern-presentation h1{font-size:2rem}krds-pattern-presentation p{overflow-wrap:anywhere}krds-pattern-presentation a:focus-visible{outline:3px solid Highlight;outline-offset:3px}krds-pattern-presentation krds-footer{margin-block-start:3rem}@media(max-width:47.99rem){krds-pattern-presentation .pattern-layout{grid-template-columns:minmax(0,1fr)}krds-pattern-presentation .pattern-layout>krds-side-navigation{display:none}}</style>${this.state.patternId === 'form-errors' ? this.form() : this.state.patternId === 'search-results' ? this.search() : this.state.patternId === 'consent-confirmation' ? this.consent() : this.layout()}`; }
}
export function registerPatternPresentation(registry: CustomElementRegistry) { registerKrdsElements(registry); if (!registry.get('krds-pattern-presentation'))
    registry.define('krds-pattern-presentation', PatternPresentation); }
