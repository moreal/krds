import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export default {
  framework: require.resolve('storybook-framework-qwik/package.json').replace(/package\.json$/, ''),
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'], addons: [], staticDirs: ['../public'],
  core: { disableTelemetry: true },
  viteFinal: async (config: import('vite').UserConfig) => ({...config, publicDir:false}),
};
