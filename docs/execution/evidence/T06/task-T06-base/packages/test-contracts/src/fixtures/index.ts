import type { StoryStateCase } from '../story-types.js';
export const storyEnvironment: StoryStateCase['environment'] = {locale:'ko-KR',direction:'ltr',colorMode:'light',nowIso:'2024-02-29T12:00:00.000Z',viewport:{width:1280,height:800}};
export const infrastructureStoryCases: readonly StoryStateCase[] = [
  {id:'infrastructure-native-probe--default',componentId:'__probe',state:{count:0,label:'Probe increment',disabled:false},environment:storyEnvironment,expected:[{role:'button',name:'Probe increment'},{role:'status',name:'Probe value',visibleText:'0'}]},
  {id:'infrastructure-native-probe--loading',componentId:'__probe',state:{loading:true,label:'Loading',disabled:true},environment:storyEnvironment,expected:[{role:'button',name:'Loading'}]},
  {id:'infrastructure-native-probe--error',componentId:'__probe',state:{errorMessage:'Local error'},environment:storyEnvironment,expected:[{role:'alert',visibleText:'Local error'}]},
];
export const storyStateCases: readonly StoryStateCase[] = [
  {id:'krds-button--disabled',componentId:'button',state:{disabled:true,label:'저장'},environment:storyEnvironment,expected:[{role:'button',name:'저장'}]},
  {id:'krds-native-select--controlled',componentId:'native-select',state:{value:'seoul',options:[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}]},environment:storyEnvironment,expected:[{role:'combobox',name:'지역'}]},
  {id:'krds-modal--open',componentId:'modal',state:{open:true,title:'확인'},environment:storyEnvironment,expected:[{role:'dialog',name:'확인'}]},
  {id:'krds-tabs--manual',componentId:'tabs',state:{value:'first',activationMode:'manual'},environment:storyEnvironment,expected:[{role:'tab',name:'첫 번째'}]},
  {id:'krds-date-input--invalid',componentId:'date-input',state:{value:'2023-02-29',invalid:true},environment:storyEnvironment,expected:[{role:'textbox',name:'날짜'}]},
];
