/** Native test infrastructure only. No KRDS component coverage. */
import { LitElement, html } from 'lit';
import { WorkspaceProbe } from '@krds-native/lit';
import { createFixtureBridge } from '@krds-native/test-contracts/driver';
import type { FixtureBridge } from '@krds-native/test-contracts';

// Resolve the adapter's built public entry without a development source alias.
if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);

class LitFixture extends LitElement {
  static override properties = { state: { state: true } };
  declare private state: Record<string, unknown>;
  private bridge?: FixtureBridge;
  private unsubscribe?: () => void;
  private readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? '');
  private readonly caseId = new URLSearchParams(location.search).get('case') ?? '';
  constructor() { super(); this.state = {}; }

  override connectedCallback() {
    super.connectedCallback();
    this.bridge = createFixtureBridge('lit', this.componentId === '__probe'
      ? { count: 0, label: 'Probe increment', disabled: false } : {});
    this.unsubscribe = this.bridge.subscribe(state => { this.state = state; });
  }
  override disconnectedCallback() {
    this.unsubscribe?.();
    this.bridge?.dispose();
    super.disconnectedCallback();
  }
  private increment() {
    if (this.state.disabled) return;
    const count = Number(this.state.count) + 1;
    this.bridge!.recordEvent('change', { value: count });
    void this.bridge!.setState({ count });
  }
  override render() {
    return html`
      <p role="status" aria-label="Fixture health">ready</p>
      ${this.componentId === '__probe' && this.caseId === 'native-state' ? html`
        <button ?disabled=${Boolean(this.state.disabled)} @click=${this.increment}>${String(this.state.label)}</button>
        <p role="status" aria-label="Probe value">${String(this.state.count)}</p>
      ` : html`<p role="note">Component not implemented: ${this.componentId}/${this.caseId}</p>`}
    `;
  }
}
customElements.define('krds-lit-fixture', LitFixture);
document.getElementById('app')!.append(document.createElement('krds-lit-fixture'));
