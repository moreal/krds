import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', lib: { entry: { index: 'src/index.ts', providers: 'src/providers/index.tsx', 'button': 'src/components/button/index.tsx', 'native-select': 'src/components/native-select/index.tsx', 'modal': 'src/components/modal/index.tsx', 'tabs': 'src/components/tabs/index.tsx', 'calendar': 'src/components/calendar/index.tsx', 'date-input': 'src/components/date-input/index.tsx' }, formats: ['es'], fileName: (_, entryName) => `${entryName}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
