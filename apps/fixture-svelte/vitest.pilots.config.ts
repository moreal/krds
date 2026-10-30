import config from './vitest.config.ts';
export default { ...config, test: { ...config.test, include: ['tests/siheom/pilots.test.ts'] } };
