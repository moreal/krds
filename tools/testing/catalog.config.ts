import base from '../../playwright.config.js';
import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testDir:import.meta.dirname,testMatch:'catalog.spec.ts'});
