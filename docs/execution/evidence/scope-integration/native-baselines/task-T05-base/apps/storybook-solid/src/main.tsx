/** T01 toolchain probe only; no component coverage. */
import { render } from 'solid-js/web';
import { WorkspaceProbe } from '@krds-native/solid';
render(() => <WorkspaceProbe />, document.getElementById('app')!);
