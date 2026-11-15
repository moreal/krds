import base from '../../playwright.config.js';
import {defineConfig} from '@playwright/test';
// Release evidence runs once (0). Everyday CI (--automated) may retry a timing-sensitive scenario; the runner reports which ones needed it.
const retries=Number(process.env.KRDS_CATALOG_RETRIES??0);
export default defineConfig({...base,retries,testDir:import.meta.dirname,testMatch:'catalog.spec.ts'});
