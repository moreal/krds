/** T01 toolchain probe only; no component coverage. */
import { createRoot } from 'react-dom/client';
import { WorkspaceProbe } from '@krds-native/react';
createRoot(document.getElementById('app')!).render(<WorkspaceProbe />);
