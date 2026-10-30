/** Toolchain probe: excluded from KRDS catalog/story coverage. */
import { WorkspaceProbe } from '@krds-native/qwik';
export default { title: 'Bootstrap/T01 probe', component: WorkspaceProbe };
export const Probe = { render: () => <WorkspaceProbe />, args: {} };
