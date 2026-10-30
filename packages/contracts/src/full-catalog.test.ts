import {readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';
import {fullCatalogDefinitions,fullCatalogPartStates,fullCatalogPresentation} from './full-catalog.js';
import {validateCatalog} from './catalog.js';
const load=(path:string)=>JSON.parse(readFileSync(new URL(`../../../${path}`,import.meta.url),'utf8'));
const catalog=load('catalog/components.json'),manifest=load('upstream/krds/manifest.json');
const obligations=load('catalog/full-catalog-contracts.json');
const stories=load('catalog/full-catalog-stories.json').cases;
const scenarios=load('catalog/full-catalog-scenarios.json').cases;
const keys=Object.keys(fullCatalogDefinitions) as (keyof typeof fullCatalogDefinitions)[];
describe('complete semantic foundation',()=>{
 it('specifies all 48 additions without replacing six pilots or exempting host integrations',()=>{
  expect(keys).toHaveLength(48);expect(keys.sort()).toEqual(obligations.items.map((item:{id:string})=>item.id).sort());
  expect(catalog.components.filter((item:{webApplicable:boolean})=>item.webApplicable)).toHaveLength(54);
  expect(catalog.components.filter((item:{webApplicable:boolean})=>!item.webApplicable).map((item:{id:string})=>item.id)).toEqual(['splash-screen']);
 });
 it('freezes valid part/state tokens with exact per-part ownership',()=>{
  for(const id of keys){const definition=fullCatalogDefinitions[id];
   expect(new Set(definition.parts).size).toBe(definition.parts.length);
   for(const part of definition.parts)expect(part).toMatch(/^[a-z][a-z0-9-]*$/);
   for(const [part,states] of Object.entries(fullCatalogPartStates[id])){expect(definition.parts as readonly string[]).toContain(part);for(const state of states)expect(definition.states as readonly string[]).toContain(state);}
  }
  expect(fullCatalogDefinitions.favicon.parts).toEqual([]);
  expect(fullCatalogDefinitions['back-button'].parts).toEqual(['root','icon','label']);
 });
 it('keeps orthogonal presentation axes distinct',()=>{
  expect(fullCatalogPresentation.badge.appearance).toEqual(['outline','filled','pastel']);
  expect(fullCatalogPresentation.badge.tone).not.toContain('primary');
  expect(fullCatalogPresentation.header['action-layout']).toEqual(['horizontal','vertical']);
  expect(fullCatalogPresentation['radio-group'].appearance).toEqual(['default','chip']);
 });
 it('stages 344 component-specific local stories and 315 outcome states without awarding coverage',()=>{
  expect(stories).toHaveLength(344);expect(scenarios).toHaveLength(315);
  expect(new Set(stories.map((item:{id:string})=>item.id)).size).toBe(344);
  for(const id of keys){
   const contract=obligations.items.find((item:{id:string})=>item.id===id);
   expect(stories.filter((item:{componentId:string})=>item.componentId===id).map((item:{id:string})=>item.id)).toEqual(contract.requiredStoryCases.map((name:string)=>'krds-'+name));
   expect(scenarios.filter((item:{componentId:string})=>item.componentId===id)).toHaveLength(contract.requiredOutcomes.length);
  }
  for(const entry of stories){expect(Object.keys(entry.state).length).toBeGreaterThan(0);expect(entry.actions.length).toBeGreaterThan(0);expect(entry.assertions.length).toBeGreaterThan(0);expect(entry.coverageAwarded).toBe(false);expect(entry.host.localOnly).toBe(true);}
  for(const entry of scenarios){expect(entry.expectedOutcome).toBeTruthy();expect(Object.keys(entry.initialState).length).toBeGreaterThan(0);expect(entry.coverageAwarded).toBe(false);}
 });
 it('never stages controlled values beside uncontrolled initializers',()=>{
  for(const entry of stories)for(const [field,initial] of [['page','defaultPage'],['value','defaultValue'],['open','defaultOpen'],['checked','defaultChecked'],['running','defaultRunning'],['activePanel','defaultActivePanel'],['openIds','defaultOpenIds'],['expandedId','defaultExpandedId']])if(field!=='value'||!['checkbox','switch'].includes(entry.componentId))if(Object.hasOwn(entry.state,field))expect(Object.hasOwn(entry.state,initial),entry.id).toBe(false);
 });
 it('keeps new first-start outcomes idle until real user/host action',()=>{
  const start=scenarios.find((item:{componentId:string;caseId:string})=>item.componentId==='coach-mark'&&item.caseId==='outcome-01');expect(start.initialState.open).toBe(false);expect(start.initialState).not.toHaveProperty('defaultOpen');
  const toast=scenarios.find((item:{componentId:string;caseId:string})=>item.componentId==='toast'&&item.caseId==='outcome-01');expect(toast.initialState.message).toBe(null);expect(toast.host.actionMessage.persistentResultId).toBe('saved-result');expect(toast.host.actionMessage.text).toBe('신청이 저장되었습니다.');
 });
});
describe('concrete outcome starting states',()=>{
 it('selects real interactive state for each action outcome instead of a title-only fixture',()=>{
  const get=(componentId:string,number:number)=>scenarios.find((entry:{componentId:string;caseId:string})=>entry.componentId===componentId&&entry.caseId===`outcome-${String(number).padStart(2,'0')}`);
  expect(get('tag',2).initialState.mode).toBe('toggle');expect(get('tag',3).initialState.mode).toBe('removable');
  for(const number of [2,3,5])expect(get('fab',number).initialState.actions.length).toBeGreaterThan(0);
  expect(get('table',5).initialState.sort.columnId).toBe('name');expect(get('structured-list',4).initialState.selection.ids).toContain('a');
  expect(get('visually-hidden',3).initialState.variant).toBe('interactive-overlay');
  expect(get('back-button',2).host.expectedConfirmationResult).toBe(false);expect(get('back-button',3).host.expectedConfirmationResult).toBe(true);
  expect(get('resize',2).host.acceptChanges).toBe(true);expect(get('toast',10).host.acceptDismissal).toBe(false);
  expect(get('snackbar',8).initialState.action.kind).toBe('link');
  for(const entry of scenarios){expect(entry.environment.viewport.width).toBeGreaterThan(0);for(const [field,initial] of [['page','defaultPage'],['value','defaultValue'],['open','defaultOpen'],['checked','defaultChecked'],['running','defaultRunning'],['activePanel','defaultActivePanel']])if(field!=='value'||!['checkbox','switch'].includes(entry.componentId))if(Object.hasOwn(entry.initialState,field))expect(Object.hasOwn(entry.initialState,initial),entry.componentId+'/'+entry.caseId).toBe(false);}
 });
});
describe('local media and motion fixtures',()=>{
 it('matches tone/visual descriptions and separates intentional autoplay from reduced motion',()=>{
  const media=stories.filter((entry:{componentId:string})=>entry.componentId==='accessible-media');
  for(const entry of media){if(entry.state.media.kind==='audio')expect(entry.state.transcript.content).toBe('약 1초 동안 일정한 높이의 예제 신호음이 들립니다.');if(entry.state.media.kind==='silent-video')expect(entry.state.transcript.content).toBe('연한 파란색 배경 아래 초록색 영역과 가운데 파란색 세로 띠가 표시됩니다.');if(entry.state.signLanguageSource)expect(entry.host.signLanguageAssetStatus).toContain('pending-cleared-authentic');}
  expect(stories.find((entry:{id:string})=>entry.id==='krds-carousel--autoplay').environment.reducedMotion).toBe('no-preference');expect(stories.find((entry:{id:string})=>entry.id==='krds-carousel--reduced-motion').environment.reducedMotion).toBe('reduce');
 });
});
describe('native review handoff refinements',()=>{
 it('keeps visible story expectations and explicit native semantic configuration coherent',()=>{
  const story=(id:string)=>stories.find((entry:{id:string})=>entry.id===id);
  expect(story('krds-header--horizontal-actions').state.home.logo.alt).toBe(story('krds-header--horizontal-actions').state.home.label);
  expect(story('krds-identifier--light').state.logo.alt).toBe('독립 예제 운영기관');
  expect(story('krds-main-menu--desktop-links').expected.map((entry:{role:string})=>entry.role)).not.toContain('button');
  expect(story('krds-carousel--single-item').expected.map((entry:{role:string})=>entry.role)).not.toContain('button');
  expect(story('krds-carousel--reduced-motion').expected[0].name).toBe('재생');
  expect(story('krds-table--row-headers').state.rowHeaderColumnId).toBe('name');
  const parent=story('krds-breadcrumb--missing-parent-href');expect(parent.state.items[0].label).toBe('상위 분류');expect(parent.state.currentItem.id).toBe('detail');
  expect(story('krds-coach-mark--single').expected[1].name).toBe('확인');expect(story('krds-coach-mark--single').host.targetVerifier).toContain('real-native-action');
  const duration=scenarios.find((entry:{componentId:string;caseId:string})=>entry.componentId==='toast'&&entry.caseId==='outcome-03');expect(Object.hasOwn(duration.initialState,'durationMs')).toBe(false);
 });
});
describe('bounded source/project completion classifications',()=>{
 it.each(['text-list','help-panel','coach-mark','file-upload','back-button'])('requires original source kind for accepted %s project correction',id=>{
  expect(validateCatalog(catalog,manifest)).toEqual([]);
  const changed=structuredClone(catalog);const item=changed.components.find((entry:{id:string})=>entry.id===id);item.sourceKind='asset';expect(validateCatalog(changed,manifest).length).toBeGreaterThan(0);
 });
 it('rejects source-heading provenance drift and spec metadata masquerading as native coverage',()=>{
  const changed=structuredClone(catalog);changed.components.find((item:{id:string})=>item.id==='identifier').officialTypeHeadings[0].sourcePath='wrong-source.html';expect(validateCatalog(changed,manifest).length).toBeGreaterThan(0);
  const promoted=structuredClone(catalog);promoted.components.find((item:{id:string})=>item.id==='identifier').coverageAcceptance=true;expect(validateCatalog(promoted,manifest).length).toBeGreaterThan(0);
 });
 it('does not generalize the five corrections into arbitrary classification changes',()=>{
  const changed=structuredClone(catalog);changed.components.find((item:{id:string})=>item.id==='masthead').kind='integration';expect(validateCatalog(changed,manifest).length).toBeGreaterThan(0);
 });
});

describe('COMMON independent review closures',()=>{
 const story=(id:string)=>stories.find((entry:{id:string})=>entry.id===id);
 const scenario=(id:string,number:number)=>scenarios.find((entry:{componentId:string;caseId:string})=>entry.componentId===id&&entry.caseId===`outcome-${String(number).padStart(2,'0')}`);
 it('gives leaf and overflow menu cases actions and names supported by actual items',()=>{
  const leaf=story('krds-main-menu--desktop-links');expect(leaf.actions.join(' ')).toContain('Modified-click');expect(leaf.actions.join(' ')).not.toContain('Activate parent trigger');
  const overflow=story('krds-main-menu--large-menu-overflow');const parent=overflow.state.items.find((item:{id:string})=>item.id===overflow.host.overflowParentId);
  expect(overflow.expected.some((entry:{name?:string})=>entry.name===parent.label)).toBe(true);expect(parent.children.length).toBe(40);expect(overflow.actions.join(' ')).toContain(parent.label);
 });
 it('does not activate absent single-slide controls or inhibit the eligible timer-rejection interval',()=>{
  const single=story('krds-carousel--single-item');expect(single.actions.join(' ')).not.toContain('Press Play');expect(single.actions.join(' ')).toContain('absence');
  const timer=scenario('carousel',11);expect(timer.host.initialFocusOutside).toBe(true);expect(timer.host.initialPointerOutside).toBe(true);expect(timer.host.hoverInhibited).toBe(false);expect(timer.host.focusStopLatched).toBe(false);expect(timer.actions.join(' ')).toContain('reason:"timer"');expect(timer.actions.join(' ')).not.toContain('Focus slide link');
  expect(fullCatalogDefinitions.carousel.parts).toContain('stop-intent');expect(fullCatalogPartStates.carousel['stop-intent']).toEqual(['paused','disabled']);
  expect(scenario('carousel',10).host.trustedActivationRequired).toBe(true);expect(scenario('carousel',10).actions.join(' ')).toContain('자동 재생 중지');
 });
 it('supplies real distinct linked coordinator states and exposure/focus destinations before Stop',()=>{
  const ordinary=story('krds-coach-mark--multi-step'),fold=story('krds-coach-mark--stop-hidden-panel'),help=story('krds-coach-mark--stop-help-tab');
  expect(fold.host.linkedTutorial).toBe(true);expect(help.host.linkedTutorial).toBe(true);expect(fold.host.beforeStop.panelOpen).toBe(false);expect(help.host.beforeStop.activePanel).toBe('help');
  expect(fold.host).not.toEqual(ordinary.host);expect(help.actions).not.toEqual(ordinary.actions);expect(fold.actions.join(' ')).toContain('fold/close');expect(help.actions.join(' ')).toContain('Help tab');
  for(const entry of [fold,help])expect(entry.host.afterStop).toEqual({running:false,panelOpen:true,activePanel:'tutorial',focusId:entry.state.startActionId,startActionUsable:true});
 });
 it('starts through one explicit transaction and keeps actual lifecycle and overflow setup executable',()=>{
  const start=story('krds-tutorial-panel--task-overview');expect(start.host.startCallback).toBe('onStart({taskId,stepId})');expect(start.host.startSecondaryCallbacks).toBe(false);expect(start.host.startFocusOnRejection).toBe(false);
  expect(scenario('help-panel',8).environment.viewport.width).toBe(360);expect(scenario('help-panel',8).host.layout).toBe('narrow-modal');
  for(const entry of scenarios)expect(entry.host.routeChange).not.toBe(true);
  expect(scenario('step-indicator',3).initialState.steps.some((step:{href?:string})=>step.href)).toBe(true);expect(scenario('step-indicator',5).host.skipDestination).toBe('/local/review');
  for(const number of [3,8,10])expect(scenario('file-upload',number).host.pickerPresentation).toBe('dropzone');
  expect(scenario('pagination',4).host.appendCount).toBe(10);expect(scenario('accordion',3).initialState.items[0].content.length).toBeGreaterThan(8000);expect(scenario('table',6).initialState.columns.length).toBe(9);
 });
});
