import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { HelpTopic } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { target } from '../catalog-support.js';
import { SurfaceController } from '../../controllers/surface-controller.js';
export class HelpPanel extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, topics: { attribute: false }, selectedTopicId: { attribute: false }, defaultSelectedTopicId: { attribute: false }, mode: { type: String }, fallbackFocusId: { type: String, attribute: 'fallback-focus-id' }, narrow: { state: true } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare topics: readonly HelpTopic[];
    declare selectedTopicId: string | null | undefined;
    declare defaultSelectedTopicId: string | null | undefined;
    declare mode: 'help' | 'tutorial';
    declare fallbackFocusId: string;
    declare private narrow: boolean;
    private state = new ValueState<boolean>();
    private topicState = new ValueState<string | null>();
    private media?: MediaQueryList;
    private focusPanel = false;
    readonly surface = new SurfaceController(this, { open: () => this.committedOpen, modal: () => this.narrow, onClose: () => this.show(false), preferredReturn: () => this.renderRoot.querySelector('[part="opener"]'), fallback: () => target(this, this.fallbackFocusId) });
    constructor() { super(); this.topics = []; this.mode = 'help'; this.fallbackFocusId = ''; this.narrow = false; }
    get committedOpen() { return this.state.read(this.open, this.defaultOpen, () => true); }
    get committedTopic() { const id = this.topicState.read(this.selectedTopicId, this.defaultSelectedTopicId, () => null); if (id !== null && !this.topics.some(topic => topic.id === id))
        throw new TypeError('Unknown help topic'); return id; }
    private resize = () => { this.narrow = this.media?.matches ?? false; };
    override connectedCallback() { super.connectedCallback(); this.media = this.ownerDocument.defaultView!.matchMedia('(max-width: 47.99rem)'); this.resize(); this.media.addEventListener('change', this.resize); }
    override disconnectedCallback() { this.media?.removeEventListener('change', this.resize); super.disconnectedCallback(); }
    show(open: boolean) { if (open === this.committedOpen)
        return; this.state.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    selectTopic(id: string) { if (!this.topics.some(topic => topic.id === id))
        throw new TypeError('Unknown help topic'); if (id !== this.committedTopic) {
        this.topicState.set(id);
        this.emit('topic-change', { id });
    } this.focusPanel = true; this.show(true); this.requestUpdate(); }
    override updated() { if (this.focusPanel && this.committedOpen)
        this.renderRoot.querySelector<HTMLDialogElement>('dialog')?.focus(); this.focusPanel = false; }
    override render() { unique(this.topics.map(topic => topic.id)); if (!['help', 'tutorial'].includes(this.mode))
        throw new TypeError('Invalid help mode'); const selected = this.topics.find(topic => topic.id === this.committedTopic); const state = `${this.committedOpen ? 'open' : 'closed'} ${this.narrow ? 'modal' : ''}`; return html `<button data-krds-component="help-panel" data-krds-part="opener" data-krds-state=${state} part="opener" type="button" aria-controls="help-panel" aria-expanded=${this.committedOpen} @click=${() => this.show(!this.committedOpen)}>도움말 열기</button><aside data-krds-component="help-panel" data-krds-part="root" data-krds-state=${state} part="root" data-krds-mode=${this.mode}><dialog data-krds-component="help-panel" data-krds-part="body" data-krds-state=${selected ? 'active-topic' : ''} part="body" id="help-panel" aria-labelledby="help-title" tabindex="-1"><h2 id="help-title" data-krds-component="help-panel" data-krds-part="title" data-krds-state="" part="title">${selected?.title ?? (this.mode === 'tutorial' ? '튜토리얼' : '도움말')}</h2><div data-krds-component="help-panel" data-krds-part="tabs" data-krds-state="" part="tabs" role="group" aria-label="도움말 주제">${this.topics.map(topic => html `<button data-krds-component="help-panel" data-krds-part="topic-trigger" data-krds-state=${topic.id === this.committedTopic ? 'active-topic' : ''} part="topic-trigger" type="button" aria-pressed=${topic.id === this.committedTopic} @click=${() => this.selectTopic(topic.id)}>${topic.title}</button>`)}</div><div>${selected?.content ?? '도움말 주제를 선택하세요.'}</div>${selected?.relatedLinks.length ? html `<nav data-krds-component="help-panel" data-krds-part="related" data-krds-state="" part="related" aria-label="관련 정보">${selected.relatedLinks.map(link => html `<a href=${link.href}>${link.label}</a>`)}</nav>` : ''}<slot></slot><button data-krds-component="help-panel" data-krds-part="close" data-krds-state="" part="close" type="button" @click=${() => this.show(false)}>도움말 닫기</button></dialog></aside>`; }
}
