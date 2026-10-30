import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import solid from 'vite-plugin-solid';
export default defineConfig({ plugins: [solid()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
