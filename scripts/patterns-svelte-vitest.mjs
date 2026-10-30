import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const snapshot=process.env.KRDS_SVELTE_PACKAGE_SNAPSHOT;if(!snapshot)throw new Error('An immutable package snapshot is required');
const require = createRequire(new URL('../apps/fixture-svelte/package.json', import.meta.url));
const { svelte } = await import(require.resolve('@sveltejs/vite-plugin-svelte'));
const { playwright } = await import(require.resolve('@vitest/browser-playwright'));
export default {
    root: fileURLToPath(new URL('../apps/fixture-svelte/', import.meta.url)),
    plugins: [svelte()],
    resolve:{alias:[{find:/^@unofficial-krds\/svelte$/,replacement:resolve(snapshot,'dist/index.js')}]},
    test: { include: ['src/examples/PatternHost.test.ts'], setupFiles: ['./tests/setup.ts'], passWithNoTests: false,
        browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }], viewport: { width: 1200, height: 800 } } },
};
