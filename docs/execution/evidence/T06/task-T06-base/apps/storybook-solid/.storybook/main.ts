import { dirname } from 'node:path';
import { createRequire } from 'node:module';
import type { StorybookConfig } from 'storybook-solidjs-vite';

const require = createRequire(import.meta.url);

export default {
  framework: { name: dirname(require.resolve('storybook-solidjs-vite/preset')), options: { docgen: false } },
  stories: ['../src/stories/**/*.stories.tsx'],
  addons: [],
  core: { disableTelemetry: true },
} satisfies StorybookConfig;
