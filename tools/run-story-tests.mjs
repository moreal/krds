import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createBrowserEnvironment} from '../tests/compatibility/browser-environment.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {selectOptions} from './testing/selection.mjs';
import {root,browserPath,serveProduction,reportDirectory,writeReport} from './testing/support.mjs';
import {inspectStorySources,verifyStory} from './testing/stories.mjs';
import {selectCatalogStories,validateCatalogStoryIndex,inspectCatalogRenderer,verifyCatalogStory,selectStoryDist} from './testing/catalog-stories.mjs';
import {infrastructureStoryCases,storyStateCases} from '../packages/test-contracts/dist/fixtures/index.js';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const directory=await reportDirectory('stories');const report={kind:'stories',mode:'pilot',results:[]};let browser,runtime;
try {
  const options=selectOptions(process.argv.slice(2),'story');report.mode=options.probe?'probe':options.catalog?'catalog':'pilot';
  const cases=options.catalog?selectCatalogStories(JSON.parse(await readFile(join(root,'catalog/full-catalog-stories.json'),'utf8')),options):(options.probe?infrastructureStoryCases:storyStateCases).filter(item=>!options.component||item.componentId===options.component);
  if(options.catalog)report.selection={scope:options.component||options.caseId?'catalog-subset':'full-catalog',completeRequiredSelection:cases.length===344&&!options.component&&!options.caseId,sourceCandidate:'catalog/full-catalog-stories.json',selected:cases.length,fullCatalogRequired:344,canonicalPilotRequired:6,requiredCombinedStates:350,canonicalPilotGate:'separate-default-selection',coverageAwarded:false};
  if(!cases.length)throw new Error('Zero required story cases selected');
  if(process.env.KRDS_STORYBOOK_DIST&&options.frameworks.length!==1)throw new Error('KRDS_STORYBOOK_DIST requires exactly one selected framework');
  const playwright=await import('playwright');runtime=await createBrowserEnvironment(options.browser);browser=await playwright[options.browser].launch({env:runtime.env});
  for(const framework of options.frameworks) {
    let server;const result={framework,canonicalSelection:!options.probe&&!options.catalog,coverageAwarded:false,stories:[]};
    try {
      if(options.catalog)result.renderer=await inspectCatalogRenderer(join(root,`apps/storybook-${framework}`),framework);
      result.sourceFiles=await inspectStorySources(join(root,`apps/storybook-${framework}/src/stories`));
      const dist=selectStoryDist(root,framework,options.frameworks,process.env.KRDS_STORYBOOK_DIST);
      if(options.catalog)result.productionDirectory=dist;
      server=await serveProduction(dist);
      result.artifactSnapshot=server.snapshot;
      const indexResponse=await fetch(server.origin+'/index.json');
      if(!indexResponse.ok)throw new Error('Required production Storybook index missing from immutable artifact');
      const indexBytes=await indexResponse.text();
      const index=JSON.parse(indexBytes);
      if(options.catalog)result.indexSha256=createHash('sha256').update(indexBytes).digest('hex');
      const frameworkDirectory=join(directory,framework);await mkdir(frameworkDirectory);
      const entries=options.catalog?validateCatalogStoryIndex(index,cases):null;
      for(const story of cases) {
        if(options.catalog){
          result.stories.push(await verifyCatalogStory(browser,server,story,frameworkDirectory,{framework,sourceEntry:entries.find(entry=>entry.id===story.id)}));
          await writeFile(join(frameworkDirectory,'partial-report.json'),JSON.stringify({framework,mode:'catalog',selection:report.selection,...result},null,2)+'\n');
          console.log(`${result.stories.at(-1).status}: ${framework} ${story.id}`);
        }
        else if(!index.entries?.[story.id] || index.entries[story.id].type!=='story')result.stories.push({id:story.id,status:'missing',error:'Required native story missing; infrastructure probes do not replace canonical stories'});
        else result.stories.push(await verifyStory(browser,server,story,frameworkDirectory));
      }
      result.status=result.stories.every(item=>item.status==='passed')?'passed':'failed';
      if(options.catalog){result.selectedStories=cases.length;result.passedStories=result.stories.filter(item=>item.status==='passed').length;result.failedStories=result.stories.length-result.passedStories;result.fullCatalogGateSatisfied=report.selection.completeRequiredSelection&&result.status==='passed'&&result.stories.length===344;}
    } catch(error){result.status='infrastructure-failed';result.error=String(error);}
    finally{await server?.close();report.results.push(result);}
  }
} catch(error){report.error=String(error);}
finally {try{await browser?.close();}finally{await runtime?.cleanup();}}
await writeReport(directory,report);if(report.error||!report.results.length||report.results.some(item=>item.status!=='passed'))process.exitCode=1;
