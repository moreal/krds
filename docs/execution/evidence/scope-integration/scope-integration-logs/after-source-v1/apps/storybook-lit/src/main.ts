/** T01 toolchain probe only; no component coverage. */
import { WorkspaceProbe } from '@unofficial-krds/lit';
customElements.define('krds-workspace-probe', WorkspaceProbe);
document.getElementById('app')!.append(document.createElement('krds-workspace-probe'));
