import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
const require = createRequire(import.meta.url);
const config: StorybookConfig = {
  framework: { name: dirname(require.resolve('@storybook/react-vite/package.json')), options: {} },
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [],
  core: { disableTelemetry: true },
};
export default config;
