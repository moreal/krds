import {readdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {guardStoryNetwork} from './network.mjs';
export async function inspectStorySources(directory) {
  let count=0;
  async function walk(path) {for(const entry of await readdir(path,{withFileTypes:true})) {
    const file=join(path,entry.name);if(entry.isDirectory())await walk(file);
    else if(/\.stories\.[^.]+$/.test(entry.name)) {
      count++;const source=await readFile(file,'utf8');
      const forbidden=[[/\bplay\s*:/,'story play'],[/\bloaders?\s*:/,'story loaders'],[/\bfetch\s*\(/,'fetch'],[/\b(?:WebSocket|EventSource|XMLHttpRequest)\b/,'network transport'],[/https?:\/\/[^\s"'`]+/,'external URL'],[/\bserviceWorker\b/,'service worker']];
      for(const [pattern,label] of forbidden) if(pattern.test(source))throw new Error(`Forbidden ${label} in ${file}`);
    }
  }}
  await walk(directory);if(!count)throw new Error(`No native story source files in ${directory}`);return count;
}
export async function verifyStory(browser,server,story,directory,{axe=true}={}) {
  const context=await browser.newContext({viewport:story.environment.viewport,locale:story.environment.locale,timezoneId:'Asia/Seoul',colorScheme:story.environment.colorMode,reducedMotion:'reduce',serviceWorkers:'block'});
  const network=await guardStoryNetwork(context,server.origin,server.assets);
  const errors=[];const page=await context.newPage();page.on('pageerror',error=>errors.push(String(error)));
  let result;
  try {
    await page.goto(`${server.origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`,{waitUntil:'networkidle'});
    for(const expected of story.expected) {
      const element=page.getByRole(expected.role,expected.name?{name:expected.name,exact:true}:{});
      await element.waitFor({state:'visible',timeout:10000});
      if(expected.visibleText!==undefined && (await element.textContent())?.trim()!==expected.visibleText)throw new Error(`Story ${story.id} text mismatch for ${expected.role}: expected ${expected.visibleText}`);
    }
    if(story.state.disabled===true) {
      const button=page.getByRole('button',{name:story.state.label,exact:true});if(!await button.isDisabled())throw new Error('Disabled story button is enabled');
    }
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:join(directory,`${story.id}.png`),animations:'disabled',caret:'hide',scale:'css'});
    let accessibility;
    if(axe) {const {default:AxeBuilder}=await import('@axe-core/playwright');accessibility=await new AxeBuilder({page}).include('#storybook-root').analyze();}
    network.assertClean();if(errors.length)throw new Error(`Story runtime errors: ${errors.join('; ')}`);
    result={id:story.id,status:'passed',requests:network.requests,violations:network.violations,axe:accessibility?{version:accessibility.testEngine.version,violations:accessibility.violations}:undefined};
  } catch(error) {result={id:story.id,status:'failed',error:String(error),runtimeErrors:errors,requests:network.requests,violations:network.violations};}
  finally {await context.close();}
  return result;
}
