import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({ plugins: [svelte()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
