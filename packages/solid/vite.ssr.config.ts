import { defineConfig, mergeConfig } from 'vite';
import client from './vite.config';

/** The same explicit public entries, compiled by Solid's actual server renderer. */
export default mergeConfig(client, defineConfig({
  build: {
    ssr: true,
    outDir: 'dist/server',
    emptyOutDir: true,
  },
}));
