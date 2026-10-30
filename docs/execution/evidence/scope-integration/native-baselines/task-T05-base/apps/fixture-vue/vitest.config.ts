import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
export default defineConfig({ plugins: [vue()], test: { include: ['tests/siheom/**/*.siheom.{ts,tsx}'], browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] } } });
