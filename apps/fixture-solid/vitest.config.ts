import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    // Suppress vite-plugin-solid's automatic jsdom fallback; execution is real browser mode below.
    environment: 'node',
    include: process.env.KRDS_TEST_MODE === 'probe' ? ['tests/siheom/native-probe.test.tsx'] : ['tests/siheom/*.test.tsx'],
    exclude: process.env.KRDS_TEST_MODE === 'probe' ? [] : ['tests/siheom/native-probe.test.tsx'],
    setupFiles: ['tests/setup.ts'],
    passWithNoTests: false,
    browser: {
      enabled: true,
      provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }),
      headless: true,
      screenshotDirectory: `test-results/siheom-${process.pid}`,
      viewport: { width: 1280, height: 800 },
      instances: [{ browser: 'chromium' }],
    },
  },
});
