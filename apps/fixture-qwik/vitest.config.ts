import { createServer } from 'node:net';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { qwikVite } from '@builder.io/qwik/optimizer';

// Vitest treats api.port=0 as its default 63315; reserve an ephemeral loopback port explicitly.
const apiPort = await new Promise<number>((resolve, reject) => {
  const reservation = createServer();
  reservation.once('error', reject);
  reservation.listen(0, '127.0.0.1', () => {
    const address = reservation.address();
    if (!address || typeof address === 'string') { reservation.close(); reject(new Error('No browser API port')); return; }
    reservation.close((error) => error ? reject(error) : resolve(address.port));
  });
});

export default defineConfig({
  plugins: [qwikVite({ csr: true })],
  // Qwik excludes native Qwik packages from prebundling; explicitly optimize the DOM CJS dependencies.
  optimizeDeps: { include: ['@testing-library/dom', '@testing-library/jest-dom/vitest', '@testing-library/user-event'] },
  test: {
    include: process.env.KRDS_TEST_MODE === 'probe'
      ? ['tests/siheom/native-probe.test.tsx']
      : ['tests/siheom/catalog.test.tsx', 'tests/siheom/button.test.tsx', 'tests/siheom/native-select.test.tsx', 'tests/siheom/modal.test.tsx', 'tests/siheom/tabs.test.tsx', 'tests/siheom/calendar.test.tsx', 'tests/siheom/date-input.test.tsx'],
    setupFiles: ['tests/setup.ts'],
    passWithNoTests: false,
    browser: {
      enabled: true, provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' } }), headless: true,
      api: { port: apiPort, host: '127.0.0.1' },
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 800 },
    },
  },
});
