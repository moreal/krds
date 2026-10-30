import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';
import solid from 'vite-plugin-solid';
export default defineConfig({plugins:[solid()],test:{environment:'node',include:['tests/patterns/*.test.tsx'],setupFiles:['tests/setup.ts'],passWithNoTests:false,browser:{enabled:true,provider:playwright({contextOptions:{locale:'ko-KR',reducedMotion:'reduce'}}),headless:true,viewport:{width:1280,height:800},instances:[{browser:'chromium'}]}}});
