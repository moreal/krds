import config from '../apps/fixture-qwik/vitest.config.ts';
export default {...config,test:{...config.test,include:['src/examples/patterns.siheom.test.tsx']}};
