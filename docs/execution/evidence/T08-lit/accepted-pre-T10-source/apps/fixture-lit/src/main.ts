import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import '@unofficial-krds/tokens/tokens.css';
import { LitElement, html } from 'lit';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import type { FixtureBridge } from '@unofficial-krds/test-contracts';
registerKrdsElements(customElements);
class LitFixture extends LitElement {
    static override properties = { state: { state: true } };
    declare private state: Record<string, unknown>;
    private bridge?: FixtureBridge;
    private unsubscribe?: () => void;
    private readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? '');
    private readonly caseId = new URLSearchParams(location.search).get('case') ?? '';
    constructor() { super(); this.state = {}; }
    override createRenderRoot() { return this; }
    override connectedCallback() { super.connectedCallback(); const initial: Record<string, unknown> = { value: 'seoul', triggerVisible: true, open: false }; if (this.componentId === 'date-input')
        initial.value = this.caseId === 'timezone-invariance' ? '2024-02-29' : null; if (this.componentId === 'tabs')
        initial.value = 'first'; this.bridge = createFixtureBridge('lit', initial); this.unsubscribe = this.bridge.subscribe(state => { this.state = state; }); }
    override disconnectedCallback() { this.unsubscribe?.(); this.bridge?.dispose(); super.disconnectedCallback(); }
    private value = (event: CustomEvent<{
        value: unknown;
    }>) => { event.stopPropagation(); this.bridge?.recordEvent('valueChange', event.detail); if (!this.state.reject)
        void this.bridge?.setState({ value: event.detail.value }); };
    private modal = (event: CustomEvent<{
        open: boolean;
    }>) => { this.bridge?.recordEvent('openChange', event.detail); if (!this.state.reject)
        void this.bridge?.setState({ open: event.detail.open }); };
    override render() { return html `<main style="max-width:58rem;margin:1rem auto;padding:1rem"><p role="status" aria-label="Fixture health">ready</p>${this.pilot()}</main>`; }
    private pilot() {
        if (this.componentId === 'button')
            return html `<krds-button ?disabled=${this.state.disabled ?? true} @click=${() => this.bridge?.recordEvent('click', {})}>저장</krds-button>`;
        if (this.componentId === 'native-select')
            return html `<form id="select-form"><krds-native-select label="지역" name="region" .options=${[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'blocked', label: '사용 불가', disabled: true }]} .value=${this.caseId === 'form-reset' ? undefined : this.state.value} .defaultValue=${this.caseId === 'form-reset' ? 'seoul' : undefined} .disabled=${Boolean(this.state.disabled)} .required=${Boolean(this.state.required)} @value-change=${this.value}></krds-native-select><button type="reset">초기화</button></form>`;
        if (this.componentId === 'modal')
            return html `${this.state.triggerVisible ? html `<button type="button" @click=${(event: Event) => { (event.currentTarget as HTMLButtonElement).focus(); void this.bridge?.setState({ open: true }); }}>열기</button>` : ''}<button id="next-task" type="button">다음 작업</button><krds-modal .open=${Boolean(this.state.open)} title="확인" .body=${html `<p>작업 내용을 확인하세요.</p><button type="button">본문 작업</button>`} return-focus-id="next-task" @open-change=${this.modal}></krds-modal>`;
        if (this.componentId === 'tabs')
            return html `<krds-tabs label="작업" .items=${[{ value: 'first', label: '첫 번째', content: html `<input aria-label="보존되는 값" value="초기 값">` }, { value: 'second', label: '두 번째', content: '두 번째 내용' }, { value: 'disabled', label: '사용 불가', content: '비활성', disabled: true }]} .value=${String(this.state.value)} .activationMode=${this.state.activationMode ?? 'manual'} @value-change=${this.value}></krds-tabs>`;
        if (this.componentId === 'calendar')
            return html `<krds-calendar label="날짜 선택" reference-date="2024-02-01" @value-change=${this.value}></krds-calendar>`;
        if (this.componentId === 'date-input')
            return html `<form id="date-form"><krds-date-input label="날짜" name="visit" .value=${this.caseId === 'timezone-invariance' ? this.state.value : undefined} .disabled=${Boolean(this.state.disabled)} .required=${Boolean(this.state.required)} .withCalendar=${this.state.withCalendar !== false} reference-date="2024-02-01" @value-change=${this.value}></krds-date-input><button type="submit">제출</button><button type="reset">초기화</button></form>`;
        return html `<p role="note">Unknown fixture ${this.componentId}/${this.caseId}</p>`;
    }
}
customElements.define('krds-lit-fixture', LitFixture);
document.getElementById('app')!.append(document.createElement('krds-lit-fixture'));
