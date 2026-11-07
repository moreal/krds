import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';

// Package-local native React behavior tests (real Chromium); cross-adapter siheom suites remain in apps/fixture-react.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/*.browser.test.tsx'],
    passWithNoTests: false,
    browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }], viewport: { width: 1280, height: 800 } },
  },
});
