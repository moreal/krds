import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.tsx'],
        exclude: ['tests/responsive.test.tsx'],
    passWithNoTests: false,
    browser: {
      enabled: true,
      headless: true,
            viewport: {width:1280,height:800},
      provider: playwright(),
      instances: [{ browser: (process.env.KRDS_SOLID_BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit' }],
    },
  },
});
