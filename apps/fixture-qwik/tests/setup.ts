import '@noma.to/qwik-testing-library/setup/qwik-v1';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@noma.to/qwik-testing-library';
afterEach(cleanup);
