import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/native', workers: 1, fullyParallel: false, timeout: 20000,
  outputDir: '../../.superpowers/sdd/PLAN/t07a-angular-logs/native-artifacts',
  reporter: [['list'], ['json', { outputFile: '../../.superpowers/sdd/PLAN/t07a-angular-logs/native-results.json' }]],
  use: { baseURL: process.env.KRDS_ANGULAR_ORIGIN, locale: 'ko-KR', timezoneId: 'Asia/Seoul', headless: true, reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'webkit', use: { browserName: 'webkit' } }],
});
