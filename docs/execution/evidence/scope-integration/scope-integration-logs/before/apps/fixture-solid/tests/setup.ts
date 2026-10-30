import type {} from '@krds-native/test-contracts';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@solidjs/testing-library';

afterEach(() => {
  cleanup();
  window.__KRDS_FIXTURE__?.dispose();
});
