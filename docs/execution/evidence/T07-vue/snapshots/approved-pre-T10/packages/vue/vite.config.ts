import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [vue()],
  build: { outDir: 'dist', lib: { entry: { index: 'src/index.ts', button: 'src/components/button/Button.vue', 'native-select': 'src/components/native-select/NativeSelect.vue', modal: 'src/components/modal/Modal.vue', tabs: 'src/components/tabs/Tabs.vue', calendar: 'src/components/calendar/Calendar.vue', 'date-input': 'src/components/date-input/DateInput.vue' }, formats: ['es'], fileName: (_format, name) => `${name}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
