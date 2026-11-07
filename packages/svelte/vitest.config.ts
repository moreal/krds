import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Package-local native Svelte behavior tests (real Chromium); cross-adapter siheom suites remain in apps/fixture-svelte.
export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ['tests/*.test.ts'],
    passWithNoTests: false,
    browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }], viewport: { width: 1280, height: 800 } },
  },
});
