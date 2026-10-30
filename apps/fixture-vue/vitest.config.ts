import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  test: {
    include: process.env.KRDS_TEST_MODE === 'probe'
      ? ['tests/siheom/native-probe.test.ts']
      : ['tests/siheom/*.test.ts'],
    exclude: process.env.KRDS_TEST_MODE === 'probe' ? [] : ['tests/siheom/native-probe.test.ts'],
    setupFiles: ['tests/setup.ts'],
    passWithNoTests: false,
    browser: { enabled: true, provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }), headless: true, viewport: { width: 1280, height: 800 }, instances: [{ browser: 'chromium' }] },
  },
});
