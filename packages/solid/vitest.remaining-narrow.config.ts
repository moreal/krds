import { defineConfig } from 'vitest/config';
import base from './vitest.config';
export default defineConfig({ ...base, test: { ...base.test, include: ['tests/remaining-review-narrow.test.tsx'], exclude: [], browser: { ...base.test?.browser, viewport: { width: 360, height: 800 } } } });
