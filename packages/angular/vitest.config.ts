import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import ts from 'typescript';
import { createServer, type AddressInfo } from 'node:net';
const reservation = createServer();
await new Promise<void>((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
const browserPort = (reservation.address() as AddressInfo).port;
await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
// Test-only JIT transform; production output is still built by ng-packagr (partial APF).
export default defineConfig({
  resolve: { dedupe: ['@angular/core', '@angular/common', '@angular/compiler', '@angular/platform-browser'] },
  optimizeDeps: { include: ['@angular/core', '@angular/common', '@angular/compiler', '@angular/core/testing', '@angular/platform-browser', '@angular/platform-browser-dynamic/testing'] },
  plugins: [{
    name: 'angular-testbed-jit-typescript', enforce: 'pre',
    transform(source, id) {
      if (!/\.ts$/.test(id) || id.includes('/node_modules/')) return;
      return { code: ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, experimentalDecorators: true, sourceMap: false }, fileName: id }).outputText, map: null };
    },
  }],
  test: {
    globals: true,
    include: ['tests/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    passWithNoTests: false,
    browser: { enabled: true, headless: true, api: { host: '127.0.0.1', port: browserPort }, provider: playwright(), instances: [{ browser: 'chromium' }] },
  },
});
