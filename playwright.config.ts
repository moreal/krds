import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tools/testing', testMatch: 'contract.spec.ts', fullyParallel: false,
  forbidOnly: true, retries: 0, workers: 1, timeout: 15000,
  outputDir: process.env.KRDS_REPORT_DIR ? `${process.env.KRDS_REPORT_DIR}/artifacts` : './test-results/t05/manual/artifacts',
  reporter: [['list'], ['json', {outputFile: process.env.KRDS_REPORT_DIR ? `${process.env.KRDS_REPORT_DIR}/playwright.json` : './test-results/t05/manual/playwright.json'}]],
  use: {viewport:{width:1280,height:800}, locale:'ko-KR',timezoneId:'Asia/Seoul',colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects: ['chromium','firefox','webkit'].map(browserName=>({name:browserName,use:{browserName:browserName as 'chromium'|'firefox'|'webkit'}})),
});
