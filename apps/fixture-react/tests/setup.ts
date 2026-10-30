import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanupReactRoots } from '@siheom/react';

declare global { var IS_REACT_ACT_ENVIRONMENT: boolean | undefined; }
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(async () => { await cleanupReactRoots(); });
