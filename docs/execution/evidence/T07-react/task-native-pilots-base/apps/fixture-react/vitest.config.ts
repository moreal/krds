import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';

const artifacts = resolve(import.meta.dirname, `../../test-results/t05/react-siheom-native-${Date.now()}-${process.pid}`);

export default defineConfig({
  plugins: [react()],
  test: {
    include: process.env.KRDS_TEST_MODE === 'probe'
      ? ['tests/siheom/native-probe.test.tsx']
      : ['tests/siheom/{button,native-select,modal,tabs,date-input}.test.tsx'],
    setupFiles: ['tests/setup.ts'],
    attachmentsDir: resolve(artifacts, 'attachments'),
    passWithNoTests: false,
    browser: {
      enabled: true,
      screenshotDirectory: resolve(artifacts, 'screenshots'),
      provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }),
      headless: true,
      viewport: { width: 1280, height: 800 },
      instances: [{ browser: 'chromium' }],
    },
  },
});
