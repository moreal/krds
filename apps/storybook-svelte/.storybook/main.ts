import { createRequire } from 'node:module';
import { dirname } from 'node:path';
const require = createRequire(import.meta.url);
export default {
  framework: { name: dirname(require.resolve('@storybook/svelte-vite/package.json')), options: {} },
  stories: ['../src/stories/**/*.stories.ts'],
  staticDirs: ['../public'],
  addons: [],
  // Storybook staticDirs owns these bytes; avoid racing Vite's second public copy.
  viteFinal: async (config: import('vite').InlineConfig) => ({ ...config, build: { ...config.build, copyPublicDir: false } }),
  core: { disableTelemetry: true },
};
