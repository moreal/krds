import { html } from 'lit';
import type { TutorialPanelContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { target } from '../catalog-support.js';
import { SurfaceController, restoreModalAware } from '../../controllers/surface-controller.js';
export class TutorialPanel extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, tasks: { attribute: false }, activeTaskId: { attribute: false }, activeStepId: { attribute: false }, running: { type: Boolean }, defaultRunning: { type: Boolean, attribute: 'default-running' }, activePanel: { type: String }, defaultActivePanel: { type: String, attribute: 'default-active-panel' }, startActionId: { type: String, attribute: 'start-action-id' }, fallbackFocusId: { type: String, attribute: 'fallback-focus-id' }, narrow: { state: true }, coordinatedStop: { type: Boolean } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare tasks: TutorialPanelContract['tasks'];
    declare activeTaskId: string | null;
    declare activeStepId: string | null;
    declare running: boolean | undefined;
    declare defaultRunning: boolean | undefined;
    declare activePanel: 'help' | 'tutorial' | undefined;
    declare defaultActivePanel: 'help' | 'tutorial' | undefined;
    declare startActionId: string;
    declare fallbackFocusId: string;
    declare private narrow: boolean; declare coordinatedStop: boolean;
    private openState = new ValueState<boolean>();
    private runningState = new ValueState<boolean>();
    private panelState = new ValueState<'help' | 'tutorial'>();
    private media?: MediaQueryList;
    private observer?: MutationObserver;
    private stopPending = false;
    private exposurePending = false;
    private observedTarget = '';
    private pendingStart: {
        taskId: string;
        stepId: string;
    } | null = null;
    readonly surface = new SurfaceController(this, { open: () => this.committedOpen, modal: () => this.narrow, onClose: () => this.show(false), preferredReturn: () => this.renderRoot.querySelector('[part="opener"]'), fallback: () => target(this, this.fallbackFocusId), suppressEntryFocus: () => this.exposurePending || this.coordinatedStop });
    constructor() { super(); this.tasks = []; this.activeTaskId = null; this.activeStepId = null; this.startActionId = ''; this.fallbackFocusId = ''; this.narrow = false; this.coordinatedStop = false; }
    get committedOpen() { return this.openState.read(this.open, this.defaultOpen, () => true); }
    get committedRunning() { return this.runningState.read(this.running, this.defaultRunning, () => false); }
    get committedPanel() { return this.panelState.read(this.activePanel, this.defaultActivePanel, () => 'tutorial'); }
    private resize = () => { this.narrow = this.media?.matches ?? false; };
    private route = () => this.stop('route-change');
    override connectedCallback() { super.connectedCallback(); this.media = this.ownerDocument.defaultView!.matchMedia('(max-width: 47.99rem)'); this.resize(); this.media.addEventListener('change', this.resize); this.ownerDocument.defaultView!.addEventListener('popstate', this.route); this.observer = new MutationObserver(() => { if (this.committedRunning && this.observedTarget && !target(this, this.observedTarget))
        this.requestUpdate(); }); this.observer.observe(this.getRootNode(), { childList: true, subtree: true }); }
    override disconnectedCallback() { this.observer?.disconnect(); this.media?.removeEventListener('change', this.resize); this.ownerDocument.defaultView?.removeEventListener('popstate', this.route); super.disconnectedCallback(); }
    private stopDetails(reason: TutorialStopDetails['reason']): TutorialStopDetails { return { reason, running: false, returnTo: { panel: 'tutorial', open: true, startActionId: this.startActionId } }; }
    private show(open: boolean) { if (open === this.committedOpen)
        return; this.openState.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    private selectPanel(value: 'help' | 'tutorial') { if (value === this.committedPanel)
        return; this.panelState.set(value); this.emit('active-panel-change', { value }); this.requestUpdate(); }
    start(taskId = this.activeTaskId ?? this.tasks.find(task => task.steps.length)?.id, stepId?: string) { if (this.committedRunning)
        return; const task = this.tasks.find(task => task.id === taskId); if (!task?.steps.length)
        return; const step = task.steps.find(step => step.id === (stepId ?? (task.id === this.activeTaskId ? this.activeStepId : null))) ?? task.steps[0]; if (!step)
        return; this.pendingStart = { taskId: task.id, stepId: step.id }; this.runningState.set(true); this.emit('start', this.pendingStart); this.requestUpdate(); }
    stop(reason: TutorialStopDetails['reason'] = 'stop') { if (!this.committedRunning || this.stopPending)
        return; this.stopPending = true; this.runningState.set(false); this.emit('stop', this.stopDetails(reason)); this.requestUpdate(); }
    override updated() { if (this.pendingStart && this.committedRunning && this.activeTaskId === this.pendingStart.taskId && this.activeStepId === this.pendingStart.stepId) {
        this.pendingStart = null;
    } const step = this.tasks.find(task => task.id === this.activeTaskId)?.steps.find(step => step.id === this.activeStepId); this.observedTarget = step?.targetId ?? ''; if (this.stopPending) {
        this.stopPending = false;
        if (!this.committedRunning) {
            if (this.coordinatedStop) { this.emit('return-request', { panel: 'tutorial', open: true, startActionId: this.startActionId }); return; }
            this.selectPanel('tutorial');
            this.show(true);
            this.exposurePending = true;
            this.requestUpdate();
            return;
        }
    } if (this.exposurePending && !this.committedRunning) {
        this.exposurePending = false;
        const start = this.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(this.startActionId)}`) ?? target(this, this.startActionId);
        restoreModalAware(this, [start, target(this, this.fallbackFocusId), this.renderRoot.querySelector('dialog')]);
    } }
    override render() { unique(this.tasks.map(task => task.id)); if (!this.startActionId || !['help', 'tutorial'].includes(this.committedPanel))
        throw new TypeError('Tutorial needs start action and panel'); const task = this.tasks.find(task => task.id === this.activeTaskId); const state = `${this.committedOpen ? 'open' : 'closed'} ${this.committedRunning ? 'running' : 'idle'}`; return html `<button data-krds-component="tutorial-panel" data-krds-part="opener" data-krds-state=${state} part="opener" type="button" aria-expanded=${this.committedOpen} aria-controls="tutorial" @click=${() => this.show(!this.committedOpen)}>튜토리얼 열기</button><aside data-krds-component="tutorial-panel" data-krds-part="root" data-krds-state=${state} part="root"><dialog id="tutorial" aria-labelledby="title" tabindex="-1"><h2 id="title" data-krds-component="tutorial-panel" data-krds-part="title" data-krds-state="" part="title">이용 방법</h2><div data-krds-component="tutorial-panel" data-krds-part="tabs" data-krds-state=${state} part="tabs" role="tablist" aria-label="도움말과 이용 방법"><button type="button" role="tab" aria-selected=${this.committedPanel === 'help'} aria-controls="help" @click=${() => this.selectPanel('help')}>도움말</button><button type="button" role="tab" aria-selected=${this.committedPanel === 'tutorial'} aria-controls="tasks" @click=${() => this.selectPanel('tutorial')}>튜토리얼</button></div><div id="help" role="tabpanel" ?hidden=${this.committedPanel !== 'help'}><slot name="help">도움말을 선택하세요</slot></div><div id="tasks" role="tabpanel" ?hidden=${this.committedPanel !== 'tutorial'}>${this.tasks.map(item => html `<section data-krds-component="tutorial-panel" data-krds-part="task" data-krds-state=${item.id === this.activeTaskId ? 'active-step' : ''} part="task"><h3>${item.title}</h3><button id=${item.id === this.activeTaskId || !this.activeTaskId && item === this.tasks[0] ? this.startActionId : `start-${item.id}`} type="button" ?disabled=${!item.steps.length || this.committedRunning} @click=${() => this.start(item.id)}>따라하기 시작</button><ol data-krds-component="tutorial-panel" data-krds-part="step-list" data-krds-state="" part="step-list">${item.steps.map(step => html `<li aria-current=${step.id === this.activeStepId ? 'step' : 'false'}><button type="button" @click=${() => { if (step.id !== this.activeStepId) this.emit('step-change', { id: step.id }); }}>${step.title}</button><p>${step.instruction}</p></li>`)}</ol></section>`)}</div>${this.narrow ? html`<slot name="tour-targets"></slot>` : ''}<button data-krds-component="tutorial-panel" data-krds-part="close" data-krds-state="" part="close" type="button" @click=${() => this.show(false)}>튜토리얼 닫기</button>${this.committedRunning ? html`<button data-krds-component="tutorial-panel" data-krds-part="stop" data-krds-state="running" part="stop" type="button" @click=${() => this.stop()}>따라하기 중지</button>` : ''}</dialog></aside>${!this.narrow ? html`<slot name="tour-targets"></slot>` : ''}`; }
}
