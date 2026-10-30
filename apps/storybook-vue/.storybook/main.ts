import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/vue3-vite';
const require = createRequire(import.meta.url);
const config: StorybookConfig = {
  framework: { name: dirname(require.resolve('@storybook/vue3-vite/package.json')), options: {} },
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [],
  core: { disableTelemetry: true },
};
export default config;
