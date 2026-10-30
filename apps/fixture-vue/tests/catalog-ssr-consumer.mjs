import assert from 'node:assert/strict';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import * as components from '@unofficial-krds/vue';
import { fullCatalogStoryCases } from '@unofficial-krds/test-contracts';
const names = {
 'masthead':'Masthead','identifier':'Identifier','header':'Header','footer':'Footer','skip-link':'SkipLink','main-menu':'MainMenu','breadcrumb':'Breadcrumb','side-navigation':'SideNavigation','in-page-navigation':'InPageNavigation','pagination':'Pagination','structured-list':'StructuredList','critical-alert':'CriticalAlert','disclosure':'Disclosure','badge':'Badge','accordion':'Accordion','image':'Image','carousel':'Carousel','table':'Table','text-list':'TextList','favicon':'Favicon','link':'Link','fab':'FAB','radio-group':'RadioGroup','checkbox':'Checkbox','tag':'Tag','switch':'Switch','step-indicator':'StepIndicator','spinner':'Spinner','help-panel':'HelpPanel','tutorial-panel':'TutorialPanel','contextual-help':'ContextualHelp','coach-mark':'CoachMark','tooltip':'Tooltip','tts':'TTS','textarea':'Textarea','text-input':'TextInput','file-upload':'FileUpload','language-switcher':'LanguageSwitcher','resize':'Resize','accessible-media':'AccessibleMedia','visually-hidden':'VisuallyHidden','range-slider':'RangeSlider','back-button':'BackButton','bottom-sheet':'BottomSheet','quantity-toggle':'QuantityToggle','toast':'Toast','snackbar':'Snackbar','tab-bar':'TabBar'
};
assert.equal(typeof document,'undefined');
for (const [id,name] of Object.entries(names)) {
 const source=fullCatalogStoryCases.find(item=>item.componentId===id);
 const props={...source.state};
 if(id==='header')props.search={label:'검색',onRequest(){}};
 if(id==='pagination')props.hrefForPage=page=>`/local/page/${page}`;
 if(id==='back-button')props.onBackRequest=()=>{};
 if(id==='toast'||id==='snackbar')props.onDismiss=()=>{};
 if(id==='tts')props.onRequest=()=>{};
 if(id==='file-upload'){props.files=[];props.onFilesChange=()=>{};}
 if(id==='coach-mark')props.onTargetAction=()=>false;
 const html=await renderToString(createSSRApp({render:()=>h(components[name],props)}));
 if(id!=='favicon'&&id!=='bottom-sheet'&&id!=='coach-mark')assert.match(html,new RegExp(`data-krds-component="${id}"`),id);
 const subpath=await import(`@unofficial-krds/vue/${id}`);assert.ok(subpath.default,`${id} subpath`);
}
console.log('48 new public native Vue roots and exact subpaths render under SSR without DOM globals; Favicon head effects remain host/mount integration.');
