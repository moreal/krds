export const stableFrameworks = ['react','solid','svelte','vue','lit','qwik','angular'];
export const siheomFrameworks = ['react','solid','svelte','vue','angular','qwik'];
export function selectOptions(args, kind) {
  const options = {frameworks:[], probe:false, browser:'chromium', component:undefined};
  for (let index=0; index<args.length; index++) {
    const arg=args[index];
    if (arg==='--probe') options.probe=true;
    else if (arg==='--catalog' && ['contract','story'].includes(kind)) options.catalog=true;
    else if (arg==='--case' && ['contract','story'].includes(kind)) {
      const value=args[++index]; if (!value || value.startsWith('--')) throw new Error('Missing value for --case'); options.caseId=value;
    }
    else if (arg==='--all-stable' && kind!=='siheom') options.frameworks.push(...stableFrameworks);
    else if (arg==='--supported' && kind==='siheom') options.frameworks.push(...siheomFrameworks);
    else if (['--framework','--component','--browser'].includes(arg)) {
      const value=args[++index]; if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      if (arg==='--framework') options.frameworks.push(...value.split(','));
      else options[arg.slice(2)]=value;
    } else throw new Error(`Unknown option: ${arg}`);
  }
  options.frameworks=[...new Set(options.frameworks)];
  if (!options.frameworks.length) throw new Error('Select --framework or --all-stable/--supported explicitly');
  for (const framework of options.frameworks) {
    if (![...stableFrameworks,'solid-next'].includes(framework)) throw new Error(`Unknown framework: ${framework}`);
    if (kind==='story' && framework==='solid-next') throw new Error('Solid2 Storybook is unsupported pending native integration');
    if (kind==='siheom' && !siheomFrameworks.includes(framework)) throw new Error(`siheom ${framework} unsupported: no upstream native adapter; use native contract Playwright`);
  }
  if (!['chromium','firefox','webkit'].includes(options.browser)) throw new Error(`Unknown browser: ${options.browser}`);
  if (options.probe && options.component && options.component!=='__probe') throw new Error('--probe cannot select canonical components');
  if(options.catalog && options.probe) throw new Error('--catalog cannot select probes');
  if(options.caseId && !options.catalog) throw new Error('--case requires explicit --catalog mode');
  return options;
}
