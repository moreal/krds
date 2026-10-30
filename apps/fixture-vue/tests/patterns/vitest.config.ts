import {defineConfig} from 'vitest/config';
import {playwright} from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';
export default defineConfig({plugins:[vue()],test:{include:['tests/patterns/*.test.ts'],setupFiles:['tests/setup.ts'],passWithNoTests:false,browser:{enabled:true,provider:playwright({contextOptions:{locale:'ko-KR',timezoneId:'Asia/Seoul',reducedMotion:'reduce'}}),headless:true,viewport:{width:1280,height:800},instances:[{browser:'chromium'}]}}});
