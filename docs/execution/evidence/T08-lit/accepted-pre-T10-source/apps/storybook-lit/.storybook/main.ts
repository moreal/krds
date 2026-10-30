import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/web-components-vite';
const require = createRequire(import.meta.url);
// pnpm links keep framework packages local to this consuming workspace.
const config: StorybookConfig = {
  framework: dirname(require.resolve('@storybook/web-components-vite/package.json')),
  stories: ['../src/stories/**/*.stories.ts'],
  addons: [],
  core: { disableTelemetry: true },
};
export default config;
