import { restoreModalAware } from '@unofficial-krds/lit';
import type { LitElement, ReactiveController } from 'lit';
import type { FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
/** Plain local fixture state, never a component renderer or a remote integration. */
export class LocalState implements ReactiveController {
    confirmationPending = false; private confirmationResolver?: (accepted: boolean) => void; private confirmationShell: HTMLDialogElement | null = null; private savedOverflow = ''; private history: string[] = [];
    running = false; panelOpen = true; panelActive: 'help' | 'tutorial' = 'tutorial'; coachStepId = ''; stopCoordinating = false;
    state: Record<string, any> = {};
    host: Record<string, any> = {};
    result = '';
    persistentText = '';
    private barObserver?: ResizeObserver;
    private observedBar?: Element;
    private awaitingBar = false;
    language = 'ko';
    route = '/local/current';
    verifiedTarget = false;
    children: {
        id: string;
        checked: boolean;
        defaultChecked: boolean;
        disabled?: boolean;
    }[] = [];
    private input?: FullCatalogStoryCase;
    private timer?: ReturnType<typeof setTimeout>;
    private stopped = false;
    private speechSession?: AbortController;
    private speechTimer?: ReturnType<typeof setInterval>;
    speechLifecycle: 'idle' | 'playing' | 'paused' | 'disposed' = 'idle';
    speechElapsedMs = 0;
    get speechDriverActive() { return !!this.speechSession && !this.speechSession.signal.aborted && this.speechLifecycle === 'playing'; }
    /** Local deterministic speech-driver mock: a real abortable playback clock, no remote speech service. */
    private runSpeech() {
        if (!this.speechSession || this.speechSession.signal.aborted) {
            this.speechSession = new AbortController();
            this.speechElapsedMs = 0;
            this.speechSession.signal.addEventListener('abort', () => { clearInterval(this.speechTimer); this.speechTimer = undefined; }, { once: true });
        }
        clearInterval(this.speechTimer);
        const session = this.speechSession;
        let previous = performance.now();
        this.speechTimer = setInterval(() => {
            if (session.signal.aborted) return;
            const now = performance.now();
            this.speechElapsedMs += now - previous;
            previous = now;
        }, 20);
        this.speechLifecycle = 'playing';
    }
    disposeSpeech() { this.speechSession?.abort(); clearInterval(this.speechTimer); this.speechTimer = undefined; this.speechLifecycle = 'disposed'; }

    private pendingStartFocus?: { taskId: string; stepId: string };
    constructor(private element: LitElement) { element.addController(this); }
    configure(input: FullCatalogStoryCase) { if (this.input === input)
        return; this.disposeSpeech(); this.speechLifecycle = 'idle'; this.input = input; this.state = structuredClone(input.state); if (input.componentId === 'tts' && this.state.state === 'playing') this.runSpeech(); this.host = structuredClone(input.host); this.history = [...this.host.history ?? ['/local/parent', '/local/current']]; this.host.linkedTutorial ||= input.componentId === 'tutorial-panel'; this.running = input.componentId === 'tutorial-panel' ? this.state.running ?? this.state.defaultRunning ?? false : this.host.running ?? true; this.panelOpen = input.componentId === 'tutorial-panel' ? this.state.open ?? this.state.defaultOpen ?? true : this.host.initialPanelOpen ?? true; this.panelActive = input.componentId === 'tutorial-panel' ? this.state.activePanel ?? this.state.defaultActivePanel ?? 'tutorial' : this.host.activePanel ?? (this.host.acceptTutorialTab === false ? 'help' : 'tutorial'); this.coachStepId = this.state.activeStepId ?? this.state.stepId ?? this.state.defaultStepId ?? this.state.steps?.[0]?.id ?? this.state.tasks?.[0]?.steps[0]?.id ?? ''; this.result = ''; this.persistentText = this.state.message?.text ?? this.host.persistentResult?.text ?? ''; this.children = (this.host.children ?? []).map((child: any) => ({ ...child, checked: !!child.defaultChecked })); this.verifiedTarget = false; this.language = String(this.state.currentLocale ?? 'ko'); this.route = '/local/current'; if (Array.isArray(this.state.files))
        this.state.files = this.state.files.map((record: any) => { const specimen = this.host.fileFixtures?.find((file: any) => file.id === (record.fileFixtureId ?? record.id)); return { ...record, file: record.file instanceof File ? record.file : new File([specimen?.contents ?? record.file?.contents ?? record.contents ?? 'local file'], specimen?.name ?? record.file?.name ?? record.name ?? `${record.id}.txt`, { type: specimen?.type ?? record.file?.type ?? record.type ?? 'text/plain' }) }; }); }
    accept(name: string, detail: any) {
        const fields: Record<string, [
            string,
            string
        ]> = { 'active-change': ['activeId', 'id'], 'value-change': ['value', 'value'], 'checked-change': ['checked', 'checked'], 'open-change': ['open', 'open'], 'expanded-change': ['expandedId', 'id'], 'mobile-open-change': ['mobileOpen', 'open'], 'page-change': ['page', 'page'], 'index-change': ['index', 'index'], 'playing-change': ['playing', 'playing'], 'topic-change': ['selectedTopicId', 'id'], 'step-change': ['stepId', 'id'], 'active-panel-change': ['activePanel', 'value'], 'running-change': ['running', 'running'], 'query-change': ['query', 'value'] };
        const accepted = this.host.acceptChanges !== false && !(this.input?.componentId === 'coach-mark' && name === 'open-change' && detail.open === false && this.host.acceptStop === false) && !(name === 'open-change' && detail.open === false && this.host.acceptClose === false) && !(name === 'open-change' && detail.open === true && this.host.acceptOpenTrue === false) && !(name === 'active-panel-change' && detail.value === 'tutorial' && this.host.acceptTutorialTab === false);
        if (accepted && fields[name]) {
            const [field, key] = fields[name]!;
            if (this.state[field] !== undefined)
                this.state = { ...this.state, [field]: detail[key] };
        }
        if (accepted && name === 'open-change' && Array.isArray(detail.ids) && this.state.openIds !== undefined) this.state = { ...this.state, openIds: detail.ids };
        if (accepted && name === 'expanded-change' && Array.isArray(detail.ids) && this.state.expandedIds !== undefined) this.state = { ...this.state, expandedIds: detail.ids };
        if (name === 'start' && this.host.acceptChanges !== false && this.host.acceptStart !== false) {
            const fields = this.host.startCommitFields ?? ['running', 'activeTaskId', 'activeStepId'];
            if (fields.includes('running')) this.running = true;
            if (fields.includes('activeStepId')) this.coachStepId = detail.stepId;
            this.state = { ...this.state, ...(fields.includes('activeTaskId') ? { activeTaskId: detail.taskId } : {}), ...(fields.includes('activeStepId') ? { activeStepId: detail.stepId } : {}), ...(this.state.running !== undefined && fields.includes('running') ? { running: true } : {}) };
            this.pendingStartFocus = detail;
        }
        if (name === 'task-change' && this.host.acceptChanges !== false)
            this.state = { ...this.state, activeTaskId: detail.id };
        if (name === 'step-change' && this.state.activeStepId !== undefined && this.host.acceptChanges !== false)
            this.state = { ...this.state, activeStepId: detail.id };
        if (name === 'files-change' && this.host.acceptChanges !== false)
            this.state = { ...this.state, files: detail.value };
        if (name === 'selection-change' && this.host.acceptChanges !== false)
            this.state = { ...this.state, selectedIds: detail.ids, selection: this.state.selection ? { ...this.state.selection, ids: detail.ids } : undefined };
        if (name === 'sort-change' && this.host.acceptChanges !== false)
            this.state = { ...this.state, sort: detail };
        if (name === 'remove' && this.host.acceptChanges !== false)
            this.state = { ...this.state, items: this.state.items.filter((item: any) => item.id !== detail.id) };
        if (name === 'clear' && this.host.acceptChanges !== false)
            this.state = { ...this.state, items: [] };
        if (name === 'dismiss' && this.host.acceptDismissal !== false)
            this.state = { ...this.state, message: this.host.queue?.shift() ?? null };
        if (name === 'action') {
            this.result = detail.actionId === 'undo' ? '저장을 취소했습니다.' : '로컬 작업 완료';
        }
        if (name === 'request') {
            if (detail.action === 'stop') this.disposeSpeech();
            else if (detail.action === 'pause') { clearInterval(this.speechTimer); this.speechTimer = undefined; this.speechLifecycle = 'paused'; }
            else this.runSpeech();
            this.stopped = detail.action === 'stop';
            this.state = { ...this.state, state: detail.action === 'stop' ? 'idle' : detail.action === 'pause' ? 'paused' : 'playing' };
            this.result = `${detail.summary} (${this.state.state})`;
        }
        if (name === 'back-request') {
            if (this.state.canGoBack && this.history.length > 1) this.history = this.history.slice(0, -1); this.route = this.state.canGoBack ? this.history.at(-1) ?? this.state.fallbackHref : this.state.fallbackHref;
            this.result = `현재 경로: ${this.route}`;
        }
        if (name === 'locale-request') {
            this.language = detail.locale;
            this.state = { ...this.state, currentLocale: detail.locale };
            this.element.ownerDocument.documentElement.lang = detail.locale;
            this.result = detail.locale === 'en' ? 'English — Local application guide' : `${this.state.options?.find((option: any) => option.locale === detail.locale)?.nativeLabel ?? '한국어'} — 로컬 신청 안내`;
        }
        if (accepted && name === 'step-change' && this.state.steps) this.state = { ...this.state, coachStepId: detail.id };
        if (name === 'step-change' && this.host.linkedTutorial && this.host.acceptChanges !== false) this.coachStepId = detail.id;
        if (name === 'stop' && this.host.linkedTutorial) { this.stopLinked(); return; }
        if (name === 'stop' && this.host.acceptStop !== false && this.host.acceptRunningFalse !== false)
            this.state = { ...this.state, ...(this.state.running !== undefined ? { running: false } : {}), ...(this.state.open !== undefined ? { open: false } : {}) };
        if (name === 'return-request' && this.host.linkedTutorial) { this.element.requestUpdate(); void this.restoreLinked(); return; }
        if (name === 'return-request' && this.host.acceptExposure !== false) {
            const start = this.element.querySelector<HTMLElement>(`#${CSS.escape(detail.startActionId)}`);
            if (start)
                start.hidden = false;
        }
        this.element.requestUpdate();
    }
    localLink(event: MouseEvent) { const anchor = event.composedPath().find(node => node instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined; if (anchor?.dataset.krdsComponent === 'language-switcher' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0 && anchor.target !== '_blank') { event.preventDefault(); return; } if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || anchor.target === '_blank' || !anchor.getAttribute('href')?.startsWith('/local/'))
        return; event.preventDefault(); this.route = anchor.pathname; this.result = `로컬 페이지: ${anchor.textContent?.trim()}`; this.element.requestUpdate(); }
    submit(event: SubmitEvent) { event.preventDefault(); const data = [...new FormData(event.currentTarget as HTMLFormElement)]; this.result = data.map(([name, value]) => `${name}: ${value instanceof File ? `${value.name} (${value.size} B)` : value}`).join(', ') || '제출할 값 없음'; this.element.requestUpdate(); }
    toggleChildren(checked: boolean) { if (this.host.acceptChanges === false)
        return; this.children = this.children.map(child => child.disabled ? child : { ...child, checked }); this.element.requestUpdate(); }
    toggleChild(id: string, checked: boolean) { this.children = this.children.map(child => child.id === id && !child.disabled ? { ...child, checked } : child); this.element.requestUpdate(); }
    get aggregateChecked() { const eligible = this.children.filter(child => !child.disabled); return eligible.length > 0 && eligible.every(child => child.checked); }
    get aggregateMixed() { const eligible = this.children.filter(child => !child.disabled); return eligible.some(child => child.checked) && !eligible.every(child => child.checked); }
    reset() { this.children = this.children.map(child => ({ ...child, checked: !!child.defaultChecked })); if (this.host.hostResetClears)
        this.state = { ...this.state, files: [] }; this.element.requestUpdate(); }
    protected publish() {}
    loadMore() { if (!this.state.loadMore || this.state.loadMore.pending)
        return; this.state = { ...this.state, loadMore: { ...this.state.loadMore, pending: true } }; this.element.requestUpdate(); this.timer = setTimeout(() => { const success = this.host.loadMoreSucceeds !== false; const shown = success ? Math.min(this.state.loadMore.total, this.state.loadMore.shown + (this.host.appendCount ?? 10)) : this.state.loadMore.shown; this.state = { ...this.state, loadMore: { ...this.state.loadMore, pending: false, shown } }; this.result = success ? '추가 결과를 불러왔습니다.' : '추가 결과를 불러오지 못했습니다. 다시 시도하세요.'; this.publish(); this.element.requestUpdate(); }, 80); }
    confirmBack(): Promise<boolean> { if (this.confirmationPending) return Promise.resolve(false); this.confirmationPending = true; this.element.requestUpdate(); return new Promise(resolve => { this.confirmationResolver = resolve; }); }
    answerBack(accepted: boolean) { if (!this.confirmationPending) return; this.confirmationPending = false; this.element.requestUpdate(); const resolve = this.confirmationResolver; this.confirmationResolver = undefined; resolve?.(accepted); }
    async browserBack() { if (this.state.dirty && !await this.confirmBack()) return; this.accept('back-request', { reason: this.state.dirty ? 'confirmed' : 'activate' }); }
    private async restoreLinked() { await this.element.updateComplete; const panels = [...this.element.querySelectorAll('krds-tutorial-panel')]; await Promise.all(panels.map(panel => panel.updateComplete)); if (!this.element.isConnected || this.running) return; const panel = panels[0]; const start = panel?.shadowRoot?.getElementById(String(this.state.startActionId)) ?? null; const fallback = panel?.shadowRoot?.getElementById(String(this.state.fallbackFocusId)) ?? (this.state.fallbackFocusId ? this.element.querySelector<HTMLElement>(`#${CSS.escape(String(this.state.fallbackFocusId))}`) : null); restoreModalAware(this.element, [start, fallback, panel?.shadowRoot?.querySelector<HTMLElement>('[part="opener"]') ?? null]); this.stopCoordinating = false; this.element.requestUpdate(); }
    stopLinked() { if (this.host.acceptStop === false || this.host.acceptRunningFalse === false) return; this.running = false; this.state = { ...this.state, ...(this.state.running !== undefined ? { running: false } : {}) }; this.stopCoordinating = true; if (this.host.acceptTutorialTab !== false) this.panelActive = 'tutorial'; if (this.host.acceptPanelExposure !== false && this.host.acceptOpenTrue !== false) this.panelOpen = true; this.element.requestUpdate(); }
    linkedPanel(open: boolean) { if (!open && this.host.acceptClose === false) return; this.panelOpen = open; this.element.requestUpdate(); }
    linkedTab(value: 'help' | 'tutorial') { if (value === 'tutorial' && this.host.acceptTutorialTab === false) return; this.panelActive = value; this.element.requestUpdate(); }
    private async focusStartedStep(detail: { taskId: string; stepId: string }) { await this.element.updateComplete; const panel = this.element.querySelector('krds-tutorial-panel'); const coach = this.element.querySelector('krds-coach-mark'); if (!panel || !coach) return; await Promise.all([panel.updateComplete, coach.updateComplete]); if (this.element.isConnected && panel.running === true && panel.activeTaskId === detail.taskId && panel.activeStepId === detail.stepId && coach.open === true && coach.stepId === detail.stepId) this.element.querySelector<HTMLElement>('[data-krds-component="coach-mark"][data-krds-part="title"]')?.focus(); }
    hostUpdated() { if (this.pendingStartFocus) { const detail = this.pendingStartFocus; this.pendingStartFocus = undefined; void this.focusStartedStep(detail); } const barHost = this.element.querySelector('krds-tab-bar'); const bar = barHost?.shadowRoot?.querySelector('[part="root"]'); if (barHost && !bar && !this.awaitingBar) { this.awaitingBar = true; void barHost.updateComplete.then(() => { this.awaitingBar = false; if (this.element.isConnected) this.element.requestUpdate(); }); } if (bar && bar !== this.observedBar) { this.barObserver?.disconnect(); this.observedBar = bar; this.barObserver = new ResizeObserver(() => { for (const layer of this.element.querySelectorAll<HTMLElement>('krds-fab,krds-toast,krds-snackbar')) layer.style.setProperty('--krds-fixed-navigation-height', `${bar.getBoundingClientRect().height}px`); }); this.barObserver.observe(bar); } const dialog = this.element.querySelector<HTMLDialogElement>('[data-krds-host="back-confirmation"]'); if (this.confirmationPending && dialog && !dialog.open) { this.savedOverflow = this.element.ownerDocument.body.style.overflow; this.element.ownerDocument.body.style.overflow = 'hidden'; dialog.showModal(); this.confirmationShell = dialog; } else if (!this.confirmationPending && this.confirmationShell) { this.confirmationShell.close(); this.confirmationShell = null; this.element.ownerDocument.body.style.overflow = this.savedOverflow; } if (this.host.removePanelOpener) this.element.querySelector('krds-help-panel')?.shadowRoot?.querySelector('[part="opener"]')?.remove(); if (this.host.startActionPresent === false) for (const panel of this.element.querySelectorAll('krds-tutorial-panel')) void panel.updateComplete.then(() => { if (this.host.startActionPresent === false) panel.shadowRoot?.getElementById(String(this.state.startActionId ?? 'tutorial-start'))?.remove(); }); }
    hostDisconnected() { this.disposeSpeech(); this.barObserver?.disconnect(); this.observedBar = undefined; this.answerBack(false); this.confirmationShell?.close(); if (this.confirmationShell) this.element.ownerDocument.body.style.overflow = this.savedOverflow; this.confirmationShell = null; clearTimeout(this.timer); this.stopped = true; }
}
