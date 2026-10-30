/** T01 toolchain probe only; no component coverage. */
import { render } from '@solidjs/web';
import { WorkspaceProbe } from '@krds-native/solid-next';
render(() => <WorkspaceProbe />, document.getElementById('app')!);
