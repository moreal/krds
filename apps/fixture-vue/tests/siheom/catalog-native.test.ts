import { test, expect,vi,afterEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick } from 'vue';
import * as catalog from '@unofficial-krds/vue';

afterEach(()=>vi.restoreAllMocks());
const required = ['Masthead','Identifier','Header','Footer','SkipLink','MainMenu','Breadcrumb','SideNavigation','InPageNavigation','Pagination','StructuredList','CriticalAlert','Disclosure','Badge','Accordion','Image','Carousel','Table','TextList','Favicon','Link','FAB','RadioGroup','Checkbox','Tag','Switch','StepIndicator','Spinner','HelpPanel','TutorialPanel','ContextualHelp','CoachMark','Tooltip','TTS','Textarea','TextInput','FileUpload','LanguageSwitcher','Resize','AccessibleMedia','VisuallyHidden','RangeSlider','BackButton','BottomSheet','QuantityToggle','Toast','Snackbar','TabBar'] as const;
for (const name of required) test(`${name} is a public native Vue component`, () => expect(catalog).toHaveProperty(name));

test('native checkbox controlled rejection preserves checked and authoritative mixed bits, reset emits zero', async () => {
 const events: unknown[] = [];
 render(defineComponent({setup: () => () => h('form', [h((catalog as any).Checkbox, {label:'All',name:'all',checked:false,indeterminate:true,onCheckedChange:(e:unknown)=>events.push(e)}),h('button',{type:'reset'},'Reset')])}));
 const input = screen.getByRole('checkbox') as HTMLInputElement;
 expect(input.indeterminate).toBe(true); input.click(); await nextTick();
 expect(input.checked).toBe(false); expect(input.indeterminate).toBe(true); expect(events).toEqual([{checked:true}]);
 screen.getByRole('button',{name:'Reset'}).click(); await new Promise(r=>setTimeout(r,0)); await nextTick();
 expect(input.indeterminate).toBe(true); expect(events).toHaveLength(1); expect(new FormData(input.form!).has('all')).toBe(false);
});
test('text field rejects controlled edits after composition, retaining native FormData', async () => {
 const events:unknown[]=[];
 render(defineComponent({setup:()=>()=>h('form',[h((catalog as any).TextInput,{label:'Name',name:'name',value:'committed',onValueChange:(e:unknown)=>events.push(e)})])}));
 const input=screen.getByRole('textbox') as HTMLInputElement;
 input.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true})); input.value='한'; input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true})); await nextTick(); expect(input.value).toBe('한');
 input.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true})); await nextTick(); expect(input.value).toBe('committed'); expect(events).toEqual([{value:'한'}]); expect(new FormData(input.form!).get('name')).toBe('committed');
});
test('range emits input requests once and never duplicates on change', async () => {
 const events:unknown[]=[]; render((catalog as any).RangeSlider,{props:{label:'Volume',value:20,min:0,max:100,step:10,onValueChange:(e:unknown)=>events.push(e)}});
 const input=screen.getByRole('slider') as HTMLInputElement; input.value='30'; input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true})); await nextTick(); expect(input.value).toBe('20'); expect(events).toEqual([{value:30}]);
});
test('accordion keeps genuine child controls mounted but inaccessible when collapsed', async () => {
 render((catalog as any).Accordion,{props:{items:[{id:'a',title:'Details',content:'Info'}]},slots:{a:()=>h('input',{'aria-label':'Child'})}});
 screen.getByRole('button',{name:'Details'}).click(); await nextTick(); const input=screen.getByRole('textbox') as HTMLInputElement; input.value='retained'; screen.getByRole('button',{name:'Details'}).click(); await nextTick(); expect(screen.queryByRole('textbox')).toBeNull(); screen.getByRole('button',{name:'Details'}).click(); await nextTick(); expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('retained');
});
test('table uses native row and column header relationships', async () => {
 render((catalog as any).Table,{props:{caption:'Applications',rowHeaderColumnId:'name',columns:[{id:'name',label:'Name',kind:'text'},{id:'count',label:'Count',kind:'number'}],rows:[{id:'a',cells:{name:'Kim',count:2}}]}});
 expect(screen.getByRole('table')).toBeTruthy(); const rowHeader=screen.getByRole('rowheader'); expect(rowHeader.textContent).toBe('Kim'); expect(screen.getByRole('cell').getAttribute('headers')).toContain(rowHeader.id);
});
test('tooltip label exists before opening and hover Escape focuses the trigger without reopening', async () => {
 render((catalog as any).Tooltip,{props:{text:'Save',relationship:'label',triggerId:'save-tooltip',textId:'save-label'}});
 const trigger=screen.getByRole('button',{name:'Save'}); trigger.parentElement!.dispatchEvent(new PointerEvent('pointerenter')); await nextTick(); expect(screen.getByRole('tooltip')).toBeTruthy(); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})); await expect.poll(()=>document.activeElement).toBe(trigger); expect(screen.queryByRole('tooltip')).toBeNull();
});
test('carousel keeps hidden slides out of the accessibility tree and navigation stops playback intent', async () => {
 const events:unknown[]=[];render((catalog as any).Carousel,{props:{items:[{id:'a',label:'First',content:'First content'},{id:'b',label:'Second',content:'Second content'}],onIndexChange:(e:unknown)=>events.push(e)}});
 expect(screen.getByText('Second content').closest('[hidden]')).toBeTruthy();screen.getByRole('button',{name:'다음 슬라이드'}).click();await nextTick();expect(events).toEqual([{index:1,reason:'next'}]);expect(screen.getByText('First content').closest('[hidden]')).toBeTruthy();
});
test('snackbar link action stays a genuine anchor and close request does not locally hide controlled content', async () => {
 const events:unknown[]=[];render((catalog as any).Snackbar,{props:{message:{id:'a',title:'Saved',text:'Saved result'},action:{kind:'link',id:'visit',label:'Visit',href:'/local/result'},onDismiss:(e:unknown)=>events.push(e)}});expect(screen.getByRole('link',{name:'Visit'}).getAttribute('href')).toBe('/local/result');screen.getByRole('button',{name:'알림 닫기'}).click();await nextTick();expect(screen.getByRole('status').textContent).toContain('Saved result');expect(events).toMatchObject([{id:'a',reason:'close',generation:1}]);
});
test('file upload retains real File handles and rejects a declined removal from the committed set', async () => {
 const file=new File(['bytes'],'example.txt',{type:'text/plain'});const events:unknown[]=[];
 render((catalog as any).FileUpload,{props:{files:[{id:'a',file,status:'staged'}],name:'files',label:'Attachments',onFilesChange:(e:unknown)=>events.push(e)}});screen.getByRole('button',{name:'example.txt 삭제'}).click();await nextTick();expect(screen.getByText('example.txt')).toBeTruthy();expect(events).toMatchObject([{value:[],reason:'remove',removedIds:['a'],addedIds:[]}]);
});
test('favicon inserts actual document head links and removes only its own nodes', async () => {
 const view=render((catalog as any).Favicon,{props:{light:{href:'/local-assets/specimen-icon-light.svg',type:'image/svg+xml',sizes:'any'},dark:{href:'/local-assets/specimen-icon-dark.svg',type:'image/svg+xml',sizes:'any'}}});await nextTick();expect(document.head.querySelector('link[rel="icon"][media="(prefers-color-scheme: dark)"]')?.getAttribute('href')).toBe('/local-assets/specimen-icon-dark.svg');view.unmount();expect(document.head.querySelector('link[data-krds-favicon]')).toBeNull();
});
test('controlled carousel exposes a distinct trusted Stop intent command while actual movement is inhibited', async()=>{
 const events:unknown[]=[];render(catalog.Carousel,{props:{items:[{id:'a',label:'First',content:'First'},{id:'b',label:'Second',content:'Second'}],playing:true,index:0,onPlayingChange:(e:unknown)=>events.push(e)}});
 screen.getByRole('button',{name:'다음 슬라이드'}).focus();await nextTick();expect(screen.getByRole('button',{name:'재생'})).toBeTruthy();screen.getByRole('button',{name:'자동 재생 중지'}).click();await nextTick();expect(events).toEqual([{playing:false,reason:'stop'}]);expect(screen.getByText('First').closest('[hidden]')).toBeNull();
});
test('Tutorial Start is one atomic request and repeated Start while running is a no-op',async()=>{
 const events:unknown[]=[];render(catalog.TutorialPanel,{props:{defaultOpen:true,defaultRunning:false,activeTaskId:'apply',activeStepId:'one',startActionId:'start-once',tasks:[{id:'apply',title:'Apply',steps:[{id:'one',title:'Name',targetId:'name',instruction:'Type name'}]}],onStart:(e:unknown)=>events.push(e)}});
 const start=screen.getByRole('button',{name:'따라하기 시작'});start.click();await nextTick();start.click();await nextTick();expect(events).toEqual([{taskId:'apply',stepId:'one'}]);expect(document.querySelector('[data-krds-component="tutorial-panel"][data-krds-part="root"]')?.getAttribute('data-krds-state')).toContain('running');
});
test('FileUpload FormData carries committed File bytes and reset retains controlled files without a change event',async()=>{
 const file=new File(['native bytes'],'committed.txt',{type:'text/plain'});const events:unknown[]=[];
 render(defineComponent({setup:()=>()=>h('form',[h(catalog.FileUpload,{label:'Upload',name:'docs',files:[{id:'a',file,status:'staged'}],onFilesChange:(e:unknown)=>events.push(e)}),h('button',{type:'reset'},'Reset files')])}));
 const input=document.querySelector('input[type=file]') as HTMLInputElement;const stored=new FormData(input.form!).get('docs') as File;expect(stored.name).toBe('committed.txt');expect(await stored.text()).toBe('native bytes');screen.getByRole('button',{name:'Reset files'}).click();await new Promise(r=>setTimeout(r,0));expect(await (new FormData(input.form!).get('docs') as File).text()).toBe('native bytes');expect(events).toEqual([]);
});
test('Toast timeout requests dismissal once and leaves rejected host-owned content present',async()=>{
 const events:unknown[]=[];render(catalog.Toast,{props:{message:{id:'same',text:'Saved',tone:'information',persistentResultId:'history'},durationMs:30,onDismiss:(e:unknown)=>events.push(e)}});await new Promise(r=>setTimeout(r,80));expect(events).toEqual([{id:'same',reason:'timeout',generation:1}]);expect(screen.getByRole('status')).toHaveTextContent('Saved');await new Promise(r=>setTimeout(r,60));expect(events).toHaveLength(1);
});

test('speech custom labels name retry and icon controls without losing their functional name',async()=>{
 const events:unknown[]=[];render(catalog.TTS,{props:{summary:'Help summary',locale:'ko-KR',state:'error',label:'신청 도움말',iconOnly:true,onRequest:(e:unknown)=>events.push(e)}});const retry=screen.getByRole('button',{name:'신청 도움말 다시 재생'});expect(retry.querySelector('svg[aria-hidden=true]')).toBeTruthy();retry.click();expect(events).toEqual([{action:'play',summary:'Help summary',locale:'ko-KR'}]);
});
test('public input status and size and explicit navigation underline are honored',()=>{
 render(catalog.TextInput,{props:{label:'Success',status:'success',size:'large'}});const input=screen.getByRole('textbox');expect(input.getAttribute('data-krds-size')).toBe('large');expect(input.getAttribute('data-krds-state')).toContain('success');expect(input.parentElement?.getAttribute('data-krds-status')).toBe('success');render(catalog.Link,{props:{href:'/local/help',label:'Help',underline:false}});expect((screen.getByRole('link',{name:'Help'}) as HTMLElement).style.textDecorationLine).toBe('none');
});
test('quantity commands retain a custom purpose in their accessible names',()=>{
 render(catalog.QuantityToggle,{props:{label:'방문 인원',defaultValue:2}});expect(screen.getByRole('button',{name:'방문 인원 늘리기'})).toBeTruthy();expect(screen.getByRole('button',{name:'방문 인원 줄이기'})).toBeTruthy();
});
test('dirty fallback navigation waits for confirmation and ignores a late acceptance after unmount',async()=>{
 let resolve!:(allowed:boolean)=>void;let confirmations=0;const view=render(catalog.BackButton,{props:{canGoBack:false,fallbackHref:'#guarded-fallback',label:'Fallback',dirty:true,requestConfirmation:()=>{confirmations++;return new Promise<boolean>(r=>resolve=r);}}});const anchor=screen.getByRole('link',{name:'Fallback'});const click=new MouseEvent('click',{bubbles:true,cancelable:true});anchor.dispatchEvent(click);expect(click.defaultPrevented).toBe(true);expect(confirmations).toBe(1);view.unmount();resolve(true);await nextTick();expect(location.hash).not.toBe('#guarded-fallback');
});
test('quantity reset serializes its original hidden baseline immediately after uncanceled native dispatch',async()=>{
 render(defineComponent({setup:()=>()=>h('form',[h(catalog.QuantityToggle,{label:'Count',name:'count',defaultValue:2}),h('input',{type:'hidden',name:'count',value:'other'})])}));screen.getByRole('button',{name:'Count 늘리기'}).click();await nextTick();const form=document.querySelector('form')!;expect(new FormData(form).getAll('count')).toEqual(['3','other']);form.reset();expect(new FormData(form).getAll('count')).toEqual(['2','other']);
});
test('Header owns one genuine named MainMenu and one identified primary mobile trigger with controlled rejection',async()=>{
 const media=window.matchMedia.bind(window);vi.spyOn(window,'matchMedia').mockImplementation(query=>query.includes('max-width')?({...media(query),matches:true,addEventListener(){},removeEventListener(){}} as MediaQueryList):media(query));
 const events:unknown[]=[];const view=render(catalog.Header,{props:{home:{href:'/local/home',label:'Home',logo:{src:'/local-assets/specimen-logo.svg',alt:'Independent service'}},utilityItems:[],mainNavigation:[{id:'home',label:'Home',href:'/local/home'}],currentId:'home',mobileOpen:false,mobileTriggerId:'primary-menu-open',mobileTriggerLabel:'메뉴 표시',navigationLabel:'주요 메뉴',onMobileOpenChange:(event:unknown)=>events.push(event)}});
 await expect.poll(()=>screen.queryByRole('button',{name:'메뉴 표시'})).not.toBeNull();expect(screen.getAllByRole('navigation',{name:'주요 메뉴'})).toHaveLength(1);const trigger=screen.getByRole('button',{name:'메뉴 표시'});expect(trigger.id).toBe('primary-menu-open');trigger.click();await nextTick();expect(screen.queryByRole('dialog')).toBeNull();expect(events).toEqual([{open:true}]);await view.rerender({mobileOpen:true});expect(screen.getByRole('dialog',{name:'전체 메뉴'})).toBeTruthy();expect(document.querySelectorAll('[data-krds-component=main-menu][data-krds-part=root]')).toHaveLength(1);expect(screen.getByRole('dialog',{name:'전체 메뉴'}).querySelector('a[aria-current=page]')?.textContent?.trim()).toBe('Home');
});
test('RadioGroup uses supplied option IDs on actual labeled native inputs',()=>{
 render(catalog.RadioGroup,{props:{label:'Decision',options:[{id:'decision-agree',value:'yes',label:'Agree'},{id:'decision-disagree',value:'no',label:'Disagree'}]}});const input=screen.getByRole('radio',{name:'Agree'});expect(input.id).toBe('decision-agree');expect(document.querySelector('label[for="decision-agree"]')).toBeTruthy();
});
test('RadioGroup rejects simultaneous Vue model and semantic controlled values',()=>{
 expect(()=>render(catalog.RadioGroup,{props:{label:'Decision',value:'yes',modelValue:'no',options:[{value:'yes',label:'Agree'},{value:'no',label:'Disagree'}]}})).toThrow();
});
