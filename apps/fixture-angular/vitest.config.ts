import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import ts from 'typescript';
import { createServer, type AddressInfo } from 'node:net';
// Vitest 4 treats api.port=0 as its fixed default; reserve an OS-selected port explicitly.
const reservation = createServer();
await new Promise<void>((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
const browserPort = (reservation.address() as AddressInfo).port;
await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
// Official TestBed JIT needs legacy Angular decorators transformed by the selected TypeScript compiler.
// This test-only transform never replaces the production Angular CLI application builder.
export default defineConfig({
  resolve: { dedupe: ['@angular/core', '@angular/common', '@angular/forms', '@angular/compiler', '@angular/platform-browser'] },
  optimizeDeps: { include: ['@angular/core', '@angular/common', '@angular/forms', '@angular/compiler', '@angular/core/testing', '@angular/platform-browser', '@angular/platform-browser-dynamic/testing', '@testing-library/angular', '@testing-library/dom', '@testing-library/user-event', '@siheom/angular'] },
  plugins: [{
    name: 'angular-testbed-jit-typescript', enforce: 'pre',
    transform(source, id) {
      if (!id.includes('/fixture-angular/') || !/\.ts$/.test(id) || id.includes('/node_modules/')) return;
      return { code: ts.transpileModule(source, { compilerOptions: {
        target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
        experimentalDecorators: true, sourceMap: false,
      }, fileName: id }).outputText, map: null };
    },
  }],
  test: {
    globals: true,
    include: process.env.KRDS_TEST_MODE === 'probe' ? ['tests/siheom/native-probe.test.ts'] : ['tests/siheom/*.test.ts'],
    exclude: process.env.KRDS_TEST_MODE === 'probe' ? [] : ['tests/siheom/native-probe.test.ts',...(process.env.KRDS_TEST_NARROW?[]:['tests/siheom/catalog-review-tour-narrow.test.ts'])],
    setupFiles: ['tests/setup.ts'],
    passWithNoTests: false,
    browser: {
      enabled: true, headless: true, api: { host: '127.0.0.1', port: browserPort },
      viewport: { width: process.env.KRDS_TEST_NARROW ? 390 : 1280, height: 800 },
      screenshotDirectory: `../../.superpowers/sdd/PLAN/t05-angular-logs/siheom-${process.pid}-screenshots`,
      provider: playwright({ contextOptions: { locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: process.env.KRDS_TEST_MOTION ? 'no-preference' : 'reduce' } }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
