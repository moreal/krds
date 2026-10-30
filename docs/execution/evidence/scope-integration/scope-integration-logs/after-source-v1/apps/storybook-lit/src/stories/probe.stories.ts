/** Test-only native WebComponents states; excluded from KRDS coverage. */
import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { WorkspaceProbe } from '@unofficial-krds/lit';
import type { StoryStateCase } from '@unofficial-krds/test-contracts';
import { infrastructureStoryCases, storyStateCases } from '@unofficial-krds/test-contracts/fixtures';

if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);

class NativeStoryProbe extends LitElement {
  static override properties = {
    count: { type: Number }, label: { type: String }, disabled: { type: Boolean }, errorMessage: { type: String },
  };
  declare count: number;
  declare label: string;
  declare disabled: boolean;
  declare errorMessage: string;
  constructor() { super(); this.count = 0; this.label = 'Probe increment'; this.disabled = false; this.errorMessage = ''; }
  override render() {
    if (this.errorMessage) return html`<p role="alert">${this.errorMessage}</p>`;
    return html`<button ?disabled=${this.disabled} @click=${() => { this.count += 1; }}>${this.label}</button>
      <p role="status" aria-label="Probe value">${this.count}</p>`;
  }
}
if (!customElements.get('krds-lit-story-probe')) customElements.define('krds-lit-story-probe', NativeStoryProbe);

type ProbeArgs = { count: number; label: string; disabled: boolean; errorMessage: string };
const argsFor = (story: StoryStateCase): ProbeArgs => ({
  count: Number(story.state.count ?? 0), label: String(story.state.label ?? 'Probe increment'),
  disabled: Boolean(story.state.disabled), errorMessage: String(story.state.errorMessage ?? ''),
});
const meta = {
  title: 'Infrastructure/Native probe',
  parameters: { krds: { infrastructureOnly: true, pendingPilotStories: storyStateCases.map(story => story.id) } },
  render: (args: ProbeArgs) => html`<krds-lit-story-probe .count=${args.count} .label=${args.label} .disabled=${args.disabled} .errorMessage=${args.errorMessage}></krds-lit-story-probe>`,
} satisfies Meta<ProbeArgs>;
export default meta;
type Story = StoryObj<ProbeArgs>;
export const Default: Story = { args: argsFor(infrastructureStoryCases[0]!) };
export const Loading: Story = { args: argsFor(infrastructureStoryCases[1]!) };
export const Error: Story = { args: argsFor(infrastructureStoryCases[2]!) };
