import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';

// Package-local native Vue behavior tests (real Chromium); cross-adapter siheom suites remain in apps/fixture-vue.
export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['tests/*.test.ts'],
    passWithNoTests: false,
    browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: (process.env.KRDS_VUE_BROWSER ?? 'chromium') as 'chromium' | 'webkit' }], viewport: { width: 1280, height: 800 } },
  },
});
