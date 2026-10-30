import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {playwright} from '@vitest/browser-playwright';
export default defineConfig({root:new URL('..',import.meta.url).pathname,plugins:[react()],resolve:{dedupe:['react','react-dom']},optimizeDeps:{include:['react','react-dom/client','react/jsx-runtime','@siheom/react','@testing-library/react','@testing-library/user-event']},test:{include:['tests/patterns/*.test.tsx'],setupFiles:['tests/setup.ts'],passWithNoTests:false,browser:{enabled:true,headless:true,provider:playwright(),viewport:{width:1280,height:800},instances:[{browser:'chromium'}]}}});
