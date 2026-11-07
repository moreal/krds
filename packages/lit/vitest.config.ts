import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// Package-local native Lit behavior tests (real Chromium, real Shadow DOM); Lit has no supported upstream siheom adapter.
export default defineConfig({
  test: {
    include: ['tests/*.browser.test.ts'],
    passWithNoTests: false,
    browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }], viewport: { width: 1280, height: 800 } },
  },
});
