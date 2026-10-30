import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/web-components-vite';
const require = createRequire(import.meta.url);
// pnpm links keep framework packages local to this consuming workspace.
const config: StorybookConfig = {
  framework: dirname(require.resolve('@storybook/web-components-vite/package.json')),
  stories: ['../src/stories/**/*.stories.ts'],
  staticDirs: ['../public'],
  // Storybook owns this copy; Vite must not concurrently copy the same public tree.
  viteFinal: async config => ({ ...config, publicDir: false }),
  addons: [],
  core: { disableTelemetry: true },
};
export default config;
