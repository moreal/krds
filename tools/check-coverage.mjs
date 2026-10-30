#!/usr/bin/env node
/** T10 release gate. Tracking integrity alone never awards coverage. */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { validateCatalog, validateCoverage } from '../packages/contracts/src/catalog.ts';
const stable = ['solid', 'react', 'svelte', 'vue', 'lit', 'qwik', 'angular'];
const forms = new Set(['native-select','date-input','radio-group','checkbox','switch','textarea','text-input','file-upload','range-slider','quantity-toggle']);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const safePath = value => nonempty(value) && !isAbsolute(value) && !value.includes('\\') && !value.includes(':') && !value.split('/').some(part => ['', '.', '..'].includes(part));
const equalMembers = (actual, expected) => Array.isArray(actual) && new Set(actual).size === actual.length && actual.length === expected.length && expected.every(value => actual.includes(value));
export function inspectCoverage(root) {
  root = realpathSync(root);
  const errors = [];
  const fail = message => errors.push(message);
  function file(path, label = path) {
    if (!safePath(path)) { fail(`${label}: unsafe repository-relative path`); return; }
    const full = resolve(root, path);
    if (!existsSync(full)) { fail(`${label}: missing ${path}`); return; }
    const real = realpathSync(full);
    if (relative(root, real).startsWith('..') || !statSync(real).isFile()) { fail(`${label}: evidence must be a file inside the repository`); return; }
    const bytes = readFileSync(real);
    if (!bytes.length) fail(`${label}: empty file ${path}`);
    return bytes;
  }
  function json(path, label = path) {
    const bytes = file(path, label); if (!bytes) return;
    try { return JSON.parse(bytes.toString()); } catch { fail(`${label}: invalid JSON ${path}`); }
  }
  function boundFile(path, proof, label) {
    const bytes = file(path, label);
    if (!bytes) return;
    if (proof.fileHashes?.[path] !== createHash('sha256').update(bytes).digest('hex')) { fail(`${label}: missing/stale accepted hash ${path}`); return; }
    return bytes;
  }
  function boundJson(path, proof, label) {
    const bytes = boundFile(path, proof, label); if (!bytes) return;
    try { return JSON.parse(bytes.toString()); } catch { fail(`${label}: invalid JSON ${path}`); }
  }
  const parsedModules = new Map();
  function parseModule(path,bytes,hash) {
    const key = `${path}:${hash}`;
    if (!parsedModules.has(key)) parsedModules.set(key,ts.createSourceFile(path,bytes.toString(),ts.ScriptTarget.Latest,true,/\.tsx$/.test(path)?ts.ScriptKind.TSX:/\.jsx$/.test(path)?ts.ScriptKind.JSX:ts.ScriptKind.TS));
    return parsedModules.get(key);
  }
  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function publicModuleExport(path, exportName, proof, prefix, mode, seen = new Set()) {
    const key = `${path}:${exportName}:${mode}`;
    if (seen.has(key)) return false;
    seen.add(key);
    if (!safePath(path) || !path.startsWith(prefix)) { fail(`public ${mode} export: resolved artifact escapes native dist`); return false; }
    if (existsSync(resolve(root,path)) && relative(resolve(root,prefix),realpathSync(resolve(root,path))).startsWith('..')) { fail(`public ${mode} export: artifact symlink escapes native dist`); return false; }
    const bytes = boundFile(path,proof,`public ${mode} export ${exportName}`); if (!bytes) return false;
    const text = bytes.toString();
    // Svelte component default exports are supplied by its selected native compiler.
    if (exportName === 'default' && path.endsWith('.svelte')) return /<(?:script|[a-z][\w-]*)\b/i.test(text);
    const source = parseModule(path,bytes,proof.fileHashes[path]);
    if (source.parseDiagnostics.length) return false;
    function resolveTarget(specifier) {
      if (!specifier.startsWith('.')) return;
      const resolved = relative(root,resolve(dirname(resolve(root,path)),specifier));
      const typeBase = resolved.replace(/\.mjs$/,'.d.mts').replace(/\.cjs$/,'.d.cts').replace(/\.js$/,'.d.ts');
      const candidates = mode === 'types' ? [typeBase,`${resolved}.d.ts`,resolved,`${resolved}/index.d.ts`] : [resolved,`${resolved}.js`,`${resolved}/index.js`];
      return candidates.find(candidate => safePath(candidate) && candidate.startsWith(prefix) && existsSync(resolve(root,candidate)) && statSync(resolve(root,candidate)).isFile());
    }
    for (const statement of source.statements) {
      const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) ?? [] : [];
      const exported = modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
      if (exportName === 'default' && (ts.isExportAssignment(statement) && !statement.isExportEquals || exported && modifiers.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword))) return true;
      if (exported && ts.isVariableStatement(statement) && statement.declarationList.declarations.some(declaration => ts.isIdentifier(declaration.name) && declaration.name.text === exportName)) return true;
      if (exported && (ts.isClassDeclaration(statement) || ts.isFunctionDeclaration(statement) || ts.isEnumDeclaration(statement)) && statement.name?.text === exportName) return true;
      if (!ts.isExportDeclaration(statement) || mode === 'runtime' && statement.isTypeOnly) continue;
      const specifier = statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier) ? statement.moduleSpecifier.text : undefined;
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          if (element.name.text !== exportName || mode === 'runtime' && element.isTypeOnly) continue;
          if (!specifier) return true;
          const next = resolveTarget(specifier);
          if (next && publicModuleExport(next,element.propertyName?.text ?? element.name.text,proof,prefix,mode,seen)) return true;
        }
      } else if (!statement.exportClause && specifier) {
        const next = resolveTarget(specifier);
        if (next && publicModuleExport(next,exportName,proof,prefix,mode,seen)) return true;
      }
    }
    return false;
  }
  function inspectPublicApi(component, framework, proof) {
    const at = `${component.id}/${framework} public API`;
    const api = proof.publicApi;
    const packagePrefix = `packages/${framework}/`, distPrefix = `${packagePrefix}dist/`;
    if (!api || api.exportName !== component.exportName || api.packageName !== `@unofficial-krds/${framework}` || !nonempty(api.entryPoint)) { fail(`${at}: missing exact public API proof`); return; }
    if (!safePath(api.packageJsonPath) || !api.packageJsonPath.startsWith(packagePrefix) || !api.packageJsonPath.endsWith('/package.json')) { fail(`${at}: package export metadata must belong to the same native package`); return; }
    const pkg = boundJson(api.packageJsonPath,proof,`${at} package metadata`);
    if (!pkg || pkg.name !== api.packageName) { fail(`${at}: package identity mismatch`); return; }
    const entry = pkg.exports?.[api.entryPoint];
    const targets = [];
    function collect(value, conditions = []) {
      if (typeof value === 'string') targets.push({value,conditions});
      else if (value && typeof value === 'object' && !Array.isArray(value)) for (const [key,item] of Object.entries(value)) collect(item,[...conditions,key]);
    }
    collect(entry);
    const manifestDir = dirname(resolve(root,api.packageJsonPath));
    const exportedPath = target => safePath(target?.value?.replace(/^\.\//,'')) ? relative(root,resolve(manifestDir,target.value)) : undefined;
    const runtimeTargets = targets.filter(target => !target.conditions.includes('types')).map(exportedPath);
    const typesTargets = targets.filter(target => target.conditions.includes('types')).map(exportedPath);
    if (!runtimeTargets.includes(api.runtimeEntryPath) || !typesTargets.includes(api.typesEntryPath)) fail(`${at}: selected built JS/types must match actual package exports`);
    const specifier = api.entryPoint === '.' ? api.packageName : api.entryPoint.startsWith('./') ? api.packageName+api.entryPoint.slice(1) : undefined;
    if (api.importSpecifier !== specifier) fail(`${at}: consumer must use the exact public package entry point`);
    if (!Array.isArray(api.artifactPaths) || !api.artifactPaths.length || !api.artifactPaths.includes(api.runtimeEntryPath) || !api.artifactPaths.includes(api.typesEntryPath) || api.artifactPaths.some(path => !safePath(path) || !path.startsWith(distPrefix))) fail(`${at}: actual built JS/types artifact paths required`);
    else for (const path of api.artifactPaths) boundFile(path,proof,`${at} built artifact`);
    if (!publicModuleExport(api.runtimeEntryPath,component.exportName,proof,distPrefix,'runtime')) fail(`${at}: public runtime export ${component.exportName} absent`);
    if (!publicModuleExport(api.typesEntryPath,component.exportName,proof,distPrefix,'types')) fail(`${at}: public types export ${component.exportName} absent`);
    if (!Array.isArray(api.entrySourcePaths) || !api.entrySourcePaths.length || api.entrySourcePaths.some(path => !safePath(path) || !path.startsWith(`${packagePrefix}src/`) || /probe|bootstrap/.test(path))) fail(`${at}: hash-bound native public source entry required`);
    else for (const path of api.entrySourcePaths) boundFile(path,proof,`${at} source entry`);
    const allowedWorkspaces = [`apps/fixture-${framework}/package.json`,`apps/storybook-${framework}/package.json`,`${packagePrefix}package.json`];
    if (!allowedWorkspaces.includes(api.consumerWorkspacePath)) { fail(`${at}: public consumer must execute inside its same-framework workspace`); return; }
    const consumerPkg = boundJson(api.consumerWorkspacePath,proof,`${at} consumer workspace`);
    if (!consumerPkg || (consumerPkg.name !== api.packageName && !consumerPkg.dependencies?.[api.packageName] && !consumerPkg.devDependencies?.[api.packageName])) fail(`${at}: consumer must declare its public adapter dependency directly`);
    const workspacePrefix = dirname(api.consumerWorkspacePath)+'/';
    let namedImport = false;
    if (!Array.isArray(api.consumerSourcePaths) || !api.consumerSourcePaths.length || api.consumerSourcePaths.some(path => !safePath(path) || !path.startsWith(workspacePrefix) || path.includes('/dist/') || /probe|bootstrap/.test(path))) fail(`${at}: actual workspace consumer source required`);
    else for (const path of api.consumerSourcePaths) {
      const source = boundFile(path,proof,`${at} consumer source`); if (!source) continue;
      const raw = source.toString();
      const script = /\.(?:svelte|vue)$/.test(path) ? [...raw.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).join('\n') : raw;
      const parsed = ts.createSourceFile(path,script,ts.ScriptTarget.Latest,true,/\.tsx$/.test(path)?ts.ScriptKind.TSX:ts.ScriptKind.TS);
      function usesValue(node,local) {
        if (ts.isImportDeclaration(node) || ts.isTypeNode(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) return false;
        if (ts.isIdentifier(node) && node.text === local) {
          const parent = node.parent;
          if (!(ts.isPropertyAssignment(parent) && parent.name === node || ts.isPropertyAccessExpression(parent) && parent.name === node || ts.isVariableDeclaration(parent) && parent.name === node || (ts.isFunctionDeclaration(parent) || ts.isClassDeclaration(parent)) && parent.name === node)) return true;
        }
        return ts.forEachChild(node,child => usesValue(child,local) || undefined) === true;
      }
      for (const statement of parsed.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) || statement.moduleSpecifier.text !== specifier || !statement.importClause || statement.importClause.isTypeOnly || !statement.importClause.namedBindings || !ts.isNamedImports(statement.importClause.namedBindings)) continue;
        for (const element of statement.importClause.namedBindings.elements) {
          if (element.isTypeOnly || (element.propertyName?.text ?? element.name.text) !== component.exportName) continue;
          if (parsed.statements.some(item => !ts.isImportDeclaration(item) && usesValue(item,element.name.text)) || /\.(?:svelte|vue)$/.test(path) && new RegExp(`<\\s*${escapeRegExp(element.name.text)}(?:[\\s/>])`).test(raw)) namedImport = true;
        }
      }
    }
    if (!namedImport) fail(`${at}: executed consumer requires a named public value import used by the example`);
    const report = boundJson(api.reportPath,proof,`${at} consumer report`);
    if (!report || report.kind !== 'public-api-consumer' || report.componentId !== component.id || report.framework !== framework || report.packageName !== api.packageName || report.packageJsonPath !== api.packageJsonPath || !equalMembers(report.entrySourcePaths,api.entrySourcePaths) || report.exportName !== component.exportName || report.entryPoint !== api.entryPoint || report.importSpecifier !== specifier || report.runtimeEntryPath !== api.runtimeEntryPath || report.typesEntryPath !== api.typesEntryPath || report.consumerWorkspacePath !== api.consumerWorkspacePath || !equalMembers(report.consumerSourcePaths,api.consumerSourcePaths) || !equalMembers(report.artifactPaths,api.artifactPaths) || report.status !== 'passed' || report.executed !== true || report.exitCode !== 0 || report.runtimeImported !== true || report.typesCompiled !== true || !nonempty(report.command) || !report.observations?.length) fail(`${at}: actual executed public import and example compile required`);
    else boundFile(report.logPath,proof,`${at} consumer log`);
  }
  const catalog = json('catalog/components.json');
  const manifest = json('upstream/krds/manifest.json');
  const coverage = json('catalog/coverage.json');
  const activeStories = json('catalog/story-cases.json');
  const activeScenarios = json('catalog/fixture-cases.json');
  const stagedStories = json('catalog/full-catalog-stories.json');
  const stagedScenarios = json('catalog/full-catalog-scenarios.json');
  const obligations = json('catalog/full-catalog-contracts.json');
  const activeStoryCoverage = json('catalog/story-coverage.json');
  const fullStoryCoverage = json('catalog/full-catalog-story-coverage.json');
  if (!catalog || !manifest || !coverage || !activeStories || !activeScenarios || !stagedStories || !stagedScenarios || !obligations || !activeStoryCoverage || !fullStoryCoverage) return {errors, stablePairs:0, acceptedPairs:0};
  errors.push(...validateCatalog(catalog, manifest), ...validateCoverage(coverage, catalog));
  if (errors.length) return {errors, stablePairs:0, acceptedPairs:0};
  const web = catalog.components.filter(item => item.webApplicable);
  if (catalog.components.length !== 55 || web.length !== 54 || !equalMembers(catalog.components.filter(item => !item.webApplicable).map(item => item.id), ['splash-screen'])) fail('Only source-backed SplashScreen platform N/A is allowed; require 55 frozen / 54 web items');
  if (!equalMembers(coverage.stableFrameworks,stable) || !equalMembers(coverage.previewFrameworks,['solid-next'])) fail('Require exactly seven stable native frameworks and isolated Solid 2 preview');
  const fullIds = obligations.items?.map(item => item.id) ?? [];
  const pilots = ['button','native-select','modal','tabs','date-input','calendar'];
  if (!equalMembers(fullIds,web.map(item => item.id).filter(id => !pilots.includes(id)))) fail('Full contract obligations must cover all 48 additions exactly once');
  if (!Array.isArray(stagedStories.cases) || stagedStories.cases.length !== 344 || !Array.isArray(stagedScenarios.cases) || stagedScenarios.cases.length !== 315) fail('Require all 344 staged stories and 315 staged outcomes');
  const storyCases = [...(activeStories.cases ?? []), ...(stagedStories.cases ?? [])];
  const scenarioCases = [...(activeScenarios.cases ?? []), ...(stagedScenarios.cases ?? [])];
  const storyTracking = [...(activeStoryCoverage.entries ?? []),...(fullStoryCoverage.entries ?? [])];
  const storyPairs = new Set();
  for (const row of storyTracking) {
    const key = `${row.framework}:${row.id}`;
    if (!stable.includes(row.framework) || storyPairs.has(key) || !storyCases.some(story => story.id === row.id && story.componentId === row.componentId)) fail(`Unknown/duplicate native story tracking ${key}`);
    storyPairs.add(key);
  }
  if (storyTracking.length !== storyCases.length*stable.length) fail('Every stable native story must be tracked; no preview/probe replacement');
  const ids = new Set();
  for (const entry of storyCases) {
    if (!web.some(item => item.id === entry.componentId) || !nonempty(entry.id) || ids.has(entry.id) || /probe|bootstrap/i.test(entry.id)) fail(`Invalid/duplicate canonical story ${entry.id}`);
    ids.add(entry.id);
    if (!entry.state || !Object.keys(entry.state).length || !Array.isArray(entry.expected)) fail(`Story ${entry.id} requires concrete state and expectations`);
    if (entry.status === 'staged' && (!entry.assertions?.length || !entry.actions?.length || entry.coverageAwarded !== false)) fail(`Staged story ${entry.id} lacks observable obligations or falsely awards coverage`);
  }
  const pairs = coverage.coverage.filter(entry => stable.includes(entry.framework));
  if (pairs.length !== 54*7) fail('Require 378 stable component/framework pairs');
  let acceptedPairs = 0;
  for (const component of web) {
    const source = file(component.source.localPath,`${component.id} source`);
    if (source && (source.length !== component.source.bytes || createHash('sha256').update(source).digest('hex') !== component.source.sha256)) fail(`${component.id}: source bytes/hash differ from frozen record`);
    file(component.specPath,`${component.id} spec`);
    const requiredStories = storyCases.filter(item => item.componentId === component.id).map(item => item.id);
    const requiredCases = scenarioCases.filter(item => item.componentId === component.id).map(item => item.caseId);
    if (!requiredStories.length || !requiredCases.length) fail(`${component.id}: zero canonical story/behavior obligations`);
    const obligation = obligations.items?.find(item => item.id === component.id);
    if (obligation && (!equalMembers(requiredStories,obligation.requiredStoryCases.map(id => 'krds-'+id)) || obligation.requiredOutcomes.length !== requiredCases.length)) fail(`${component.id}: source contract obligations differ from staged story/outcome inventory`);
    for (const framework of stable) {
      const at = `${component.id}/${framework}`;
      const row = pairs.find(item => item.componentId === component.id && item.framework === framework);
      const before = errors.length;
      for (const path of row?.evidencePaths ?? []) file(path,`${at} tracked evidence`);
      if (!row || row.status !== 'verified') { fail(`${at}: native coverage is ${row?.status ?? 'absent'}, not independently verified`); continue; }
      const proof = row.verification;
      if (!proof || proof.componentId !== component.id || proof.framework !== framework || proof.nativeRenderer !== framework || proof.profile !== 'stable' || proof.status !== 'accepted') { fail(`${at}: missing or mismatched native accepted verification metadata`); continue; }
      const boundPaths = new Set([component.specPath,proof.docsPath,proof.reviewPath,...(proof.nativeSourcePaths ?? []),...(proof.storySourcePaths ?? []),proof.behavior?.reportPath,proof.behavior?.rawPath,proof.stories?.reportPath,...(proof.stories?.storyIds ?? []).map(id => `${proof.stories.screenshotDirectory}/${id}.png`),...(proof.checks ?? []).map(check => check.reportPath)]);
      for (const path of boundPaths) {
        if (!safePath(path)) { fail(`${at}: all executed evidence must be bound to safe file hashes`); continue; }
        const bytes = file(path,`${at} bound evidence`);
        if (bytes && (!proof.fileHashes || proof.fileHashes[path] !== createHash('sha256').update(bytes).digest('hex'))) fail(`${at}: missing/stale evidence hash ${path}`);
      }
      if (proof.sourceSha256 !== component.source.sha256 || proof.specPath !== component.specPath || !nonempty(proof.reviewPath)) fail(`${at}: verification must bind frozen source, accepted spec and independent review`);
      const decision = proof.reviewAcceptance;
      if (!decision || decision.status !== 'approved' || decision.independent !== true || decision.critical !== 0 || decision.important !== 0 || decision.componentId !== component.id || decision.framework !== framework || !nonempty(decision.reviewer)) fail(`${at}: no independent zero-open-finding scoped review acceptance`);
      const review = file(proof.reviewPath,`${at} review`);
      if (review && !/\b(?:approved|accepted|pass)\b/i.test(review.toString())) fail(`${at}: independent review does not record acceptance`);
      if (proof.candidate !== false || proof.preview === true || proof.coverageAwarded === false) fail(`${at}: candidate/preview/unsupported verification cannot count as stable acceptance`);
      if (!safePath(proof.docsPath) || !/^(?:apps\/docs\/|docs\/)/.test(proof.docsPath)) fail(`${at}: component documentation required`); else file(proof.docsPath,`${at} docs`);
      for (const [field,prefix] of [['nativeSourcePaths',`packages/${framework}/src/`],['storySourcePaths',`apps/storybook-${framework}/src/`]]) {
        const paths = proof[field];
        if (!Array.isArray(paths) || !paths.length || paths.some(path => !safePath(path) || !path.startsWith(prefix) || /probe|bootstrap/i.test(path))) fail(`${at}: ${field} must name actual same-framework native files`);
        else for (const path of paths) file(path,`${at} ${field}`);
      }
      inspectPublicApi(component,framework,proof);
      const behavior = proof.behavior;
      if (!behavior || !equalMembers(behavior.caseIds,requiredCases)) fail(`${at}: behavior must cover every required outcome`);
      else {
        const summary = json(behavior.reportPath,`${at} behavior summary`);
        const result = summary?.results?.find(item => item.framework === framework);
        if (summary?.kind !== 'contract' || !['pilot','catalog'].includes(summary.mode) || summary.error || result?.status !== 'passed' || result.exitCode !== 0 || result.canonicalSelection !== true || !result.tests?.length || result.tests.some(test => test.classification !== 'passed' || test.nativeHealth !== true || test.status !== 'passed')) fail(`${at}: behavior summary has no healthy executed native pass`);
        const raw = json(behavior.rawPath,`${at} raw behavior`);
        const rawTests = [];
        function visit(suite) {
          for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) rawTests.push({title:spec.title,ok:spec.ok,test});
          for (const child of suite.suites ?? []) visit(child);
        }
        if (raw) for (const suite of raw.suites ?? []) visit(suite);
        if (raw?.errors?.length || raw?.stats?.unexpected > 0 || raw?.stats?.skipped > 0) fail(`${at}: raw behavior contains errors or unexecuted/skipped cases`);
        if (!rawTests.length) fail(`${at}: zero raw executed tests`);
        for (const caseId of requiredCases) {
          const match = rawTests.filter(entry => entry.title === `${framework} ${component.id}/${caseId}`);
          if (!match.length || match.some(entry => entry.ok !== true || entry.test.status !== 'expected' || !entry.test.results?.length || entry.test.results.some(result => result.status !== 'passed'))) { fail(`${at}: no unskipped raw native pass for ${caseId}`); continue; }
          for (const entry of match) for (const result of entry.test.results) {
            const attachment = result.attachments?.find(item => item.name === 'native-health.json');
            const external = new Map();
            for (const item of result.attachments ?? []) if (item.path) {
              const path = relative(root,resolve(dirname(resolve(root,behavior.rawPath)),item.path));
              const bytes = boundFile(path,proof,`${at} native attachment ${item.name}`);
              if (bytes) external.set(item,bytes);
            }
            let health;
            try {
              if (attachment?.body) health = JSON.parse(Buffer.from(attachment.body,'base64').toString());
              else if (attachment?.path && external.has(attachment)) health = JSON.parse(external.get(attachment).toString());
            } catch { /* Hash binding precedes parsing; a filename alone is never healthy evidence. */ }
            if (health?.healthy !== true || health.framework !== framework || health.fixture?.componentId !== component.id || health.fixture?.caseId !== caseId) fail(`${at}: raw native health does not bind framework/component/case ${caseId}`);
          }
        }
      }
      const stories = proof.stories;
      if (!stories || !equalMembers(stories.storyIds,requiredStories)) fail(`${at}: every required native story must be executed`);
      else {
        const summary = json(stories.reportPath,`${at} stories report`);
        const result = summary?.results?.find(item => item.framework === framework);
        if (summary?.kind !== 'stories' || !['pilot','catalog'].includes(summary.mode) || summary.error || result?.status !== 'passed' || result.canonicalSelection !== true || !result.stories?.length) fail(`${at}: no executed canonical same-framework story report`);
        for (const id of requiredStories) {
          const tracking = storyTracking.find(item => item.framework === framework && item.id === id && item.componentId === component.id);
          if (tracking?.status !== 'verified' || !Array.isArray(tracking.evidencePaths) || !tracking.evidencePaths.length) fail(`${at}: native story tracking ${id} is not verified with evidence`);
          else for (const path of tracking.evidencePaths) file(path,`${at} tracked story ${id}`);
          const story = result?.stories?.find(item => item.id === id);
          if (story?.status !== 'passed' || !Array.isArray(story.requests) || !Array.isArray(story.violations) || story.violations.length || !story.axe || !Array.isArray(story.axe.violations) || story.axe.violations.length) fail(`${at}: story ${id} lacks successful request/accessibility evidence`);
          const png = file(`${stories.screenshotDirectory}/${id}.png`,`${at} story screenshot ${id}`);
          if (png && !png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) fail(`${at}: story ${id} screenshot is not PNG evidence`);
        }
      }
      const requiredChecks = ['typecheck','build','visual'];
      if (framework === 'lit') requiredChecks.push('shadow-dom');
      if (framework === 'qwik') requiredChecks.push('lazy-first-event');
      if (framework === 'angular') { requiredChecks.push('partial-apf'); if (forms.has(component.id)) requiredChecks.push('cva-form-reset'); }
      if (['accessible-media','visually-hidden'].includes(component.id)) requiredChecks.push('manual-accessibility');
      if (['favicon','image','identifier','header','footer','accessible-media'].includes(component.id)) requiredChecks.push('local-assets-provenance');
      for (const kind of requiredChecks) {
        const check = proof.checks?.find(item => item.kind === kind);
        const report = check && json(check.reportPath,`${at} ${kind}`);
        if (!report || report.kind !== kind || report.framework !== framework || report.componentId !== component.id || report.status !== 'passed' || report.executed !== true || report.exitCode !== 0 || !nonempty(report.command) || !Array.isArray(report.observations) || !report.observations.length) fail(`${at}: missing executed ${kind} native evidence`);
        else {
          const log = file(report.logPath,`${at} ${kind} log`);
          if (log && proof.fileHashes?.[report.logPath] !== createHash('sha256').update(log).digest('hex')) fail(`${at}: missing/stale native check log hash ${kind}`);
        }
      }
      if (errors.length === before) acceptedPairs++;
    }
  }
  return {errors, stablePairs:pairs.length, acceptedPairs};
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = inspectCoverage(resolve(import.meta.dirname,'..'));
  if (result.errors.length) {
    console.error(`Coverage gate failed: ${result.acceptedPairs}/${result.stablePairs} stable pairs accepted; ${result.errors.length} gaps.\n${result.errors.slice(0,40).map(error=>'- '+error).join('\n')}${result.errors.length>40?'\n- Additional gaps omitted; inspect tracking and evidence for all 378 pairs.':''}`);
    process.exitCode = 1;
  } else console.log(`Coverage verified: ${result.acceptedPairs} actual native component/framework pairs; Solid 2 preview separate.`);
}
