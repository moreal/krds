import { createRequire } from 'node:module';
import { dirname } from 'node:path';
const require = createRequire(import.meta.url);
export default {
  framework: dirname(require.resolve('@storybook/angular/package.json')),
  stories: ['../src/stories/**/*.stories.ts'],
  addons: [],
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
};
