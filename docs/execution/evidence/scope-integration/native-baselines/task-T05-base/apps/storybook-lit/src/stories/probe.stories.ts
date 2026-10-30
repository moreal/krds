/** Toolchain probe: excluded from KRDS catalog/story coverage. */
import { html } from 'lit';
import { WorkspaceProbe } from '@krds-native/lit';
if (!customElements.get('krds-workspace-probe')) customElements.define('krds-workspace-probe', WorkspaceProbe);
export default { title: 'Bootstrap/T01 probe', render: () => html`<krds-workspace-probe></krds-workspace-probe>` };
export const Probe = { args: {} };
