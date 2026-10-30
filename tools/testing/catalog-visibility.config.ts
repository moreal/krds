import base from './catalog.config.ts';
import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testMatch:'catalog-visibility.spec.ts'});
