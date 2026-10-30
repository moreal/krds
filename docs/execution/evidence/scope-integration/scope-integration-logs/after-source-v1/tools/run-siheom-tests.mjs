import {join} from 'node:path';
import {readdir,readFile} from 'node:fs/promises';
import {selectOptions} from './testing/selection.mjs';
import {root,reportDirectory,writeReport,runSelected} from './testing/support.mjs';
const directory=await reportDirectory('siheom');const report={kind:'siheom',mode:'pilot',results:[],unsupported:[{framework:'lit',reason:'No upstream native siheom adapter',alternative:'test:contract --framework lit'},{framework:'solid-next',reason:'Solid1 adapter peer does not cover exact Solid2 RC',alternative:'test:contract --framework solid-next'}]};
try {
  const options=selectOptions(process.argv.slice(2),'siheom');report.mode=options.probe?'probe':'pilot';
  for(const framework of options.frameworks) {
    const result={framework,canonicalSelection:!options.probe,coverageAwarded:false};
    try {
      const workspace=`@unofficial-krds/fixture-${framework}`;const app=join(root,`apps/fixture-${framework}`);
      const manifest=JSON.parse(await readFile(join(app,'package.json'),'utf8'));
      if(!manifest.scripts['siheom:local'])throw new Error(`Missing native siheom:local command in ${workspace}`);
      const names=(await readdir(join(app,'tests/siheom'))).filter(name=>/\.test\.[cm]?[jt]sx?$/.test(name)).filter(name=>options.probe?name.startsWith('native-probe.test.'):!name.startsWith('native-probe.test.')).filter(name=>!options.component||name.startsWith(`${options.component}.test.`));
      if(!names.length)throw new Error('Zero native siheom cases selected; probes never satisfy required pilot suites');
      result.files=names;result.adapter=Object.entries(manifest.devDependencies??{}).find(([name])=>name===`@siheom/${framework}`);
      if(!result.adapter)throw new Error('Required native siheom adapter is not directly installed');
      const output=join(directory,`${framework}-vitest.json`);
      const executed=await runSelected(['workspace',workspace,'siheom:local',...names.map(name=>`tests/siheom/${name}`),'--reporter=json',`--outputFile=${output}`],{env:{KRDS_TEST_MODE:report.mode},log:join(directory,`${framework}-command.log`)});
      result.commandExitCode=executed.code;result.commandLog=join(directory,`${framework}-command.log`);
      let summary;
      try {summary=JSON.parse(await readFile(output,'utf8'));}
      catch {throw new Error(`Native Vitest produced no readable report (exit ${executed.code}); inspect ${result.commandLog}`);}
      result.tests=summary.numTotalTests;result.passed=summary.numPassedTests;result.failed=summary.numFailedTests;result.report=output;
      result.status=!summary.numTotalTests?'infrastructure-failed':executed.code===0 && summary.numPassedTests===summary.numTotalTests?'passed':'failed';
    } catch(error){result.status='failed';result.error=String(error);}
    report.results.push(result);
  }
}catch(error){report.error=String(error);}
await writeReport(directory,report);if(report.error||!report.results.length||report.results.some(item=>item.status!=='passed'))process.exitCode=1;
