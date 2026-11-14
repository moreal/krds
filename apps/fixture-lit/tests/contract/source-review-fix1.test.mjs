import test from 'node:test';
import assert from 'node:assert/strict';
import {browserPath,serveProduction} from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const {chromium,webkit}=await import('playwright');
async function run(engine,work,options={}){
 const server=await serveProduction(new URL('../../dist/',import.meta.url).pathname,{fixture:true});
 const browser=await ({chromium,webkit})[engine].launch();
 try{
  const page=await browser.newPage(options);page.setDefaultTimeout(2000);
  await page.goto(`${server.origin}/harness.html`);await page.waitForFunction(()=>customElements.get('krds-modal'));
  await work(page);
 }finally{await browser.close();await server.close();}
}
for(const engine of ['chromium','webkit']){
 test(`F01 ${engine}: directly slotted native custom controls retain logical Tab order and hidden subtrees are excluded`,()=>run(engine,async page=>{
  await page.evaluate(async()=>{const modal=document.createElement('krds-modal');Object.assign(modal,{title:'슬롯 모달',open:true});for(const label of ['첫 작업','둘째 작업']){const button=document.createElement('krds-button');button.textContent=label;modal.append(button);}const hidden=document.createElement('div');hidden.hidden=true;hidden.innerHTML='<button>숨은 작업</button>';modal.append(hidden);document.querySelector('main').append(modal);await modal.updateComplete;await Promise.all([...modal.children].map(child=>child.updateComplete));});
  const first=page.getByRole('button',{name:'첫 작업',exact:true});const second=page.getByRole('button',{name:'둘째 작업',exact:true});await first.focus();await page.keyboard.press('Tab');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));assert.equal(await second.evaluate(node=>node.getRootNode().activeElement===node),true,JSON.stringify(await page.locator('krds-modal').evaluate(host=>({logical:host.focusables().map(node=>node.textContent),active:host.shadowRoot.activeElement?.outerHTML,document:document.activeElement?.outerHTML}))));await page.keyboard.press('Shift+Tab');assert.equal(await first.evaluate(node=>node.getRootNode().activeElement===node),true);await page.keyboard.press('Shift+Tab');assert.equal(await page.getByRole('button',{name:'닫기',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);
 }));
 test(`F02 ${engine}: public Modal and composition surfaces share one interleaved scroll lock`,()=>run(engine,async page=>{
  const state=await page.evaluate(async()=>{document.body.style.overflow='scroll';const modal=document.createElement('krds-modal');Object.assign(modal,{title:'먼저 연 모달',open:true});document.querySelector('main').append(modal);await modal.updateComplete;const sheet=document.createElement('krds-bottom-sheet');Object.assign(sheet,{title:'나중 시트',open:true});document.querySelector('main').append(sheet);await sheet.updateComplete;modal.remove();await Promise.resolve();const whileSheet={overflow:document.body.style.overflow,modal:sheet.shadowRoot.querySelector('dialog').matches(':modal')};sheet.open=false;await sheet.updateComplete;return{whileSheet,after:document.body.style.overflow};});assert.deepEqual(state,{whileSheet:{overflow:'hidden',modal:true},after:'scroll'});
 }));
 test(`F03 ${engine}: restoration follows activation order rather than DOM order`,()=>run(engine,async page=>{
  await page.evaluate(async()=>{const a=document.createElement('krds-modal');Object.assign(a,{title:'앞 DOM 나중 열림',open:false});a.innerHTML='<button id="preferred-a">복귀 A</button><button id="last-a">마지막 A</button>';const tooltip=document.createElement('krds-tooltip');Object.assign(tooltip,{text:'대상 안내',triggerLabel:'정보',triggerId:'tip-trigger',textId:'tip-text',defaultOpen:true,fallbackFocusId:'preferred-a'});a.append(tooltip);const b=document.createElement('krds-bottom-sheet');Object.assign(b,{title:'뒤 DOM 먼저 열림',open:false});b.innerHTML='<button id="preferred-b">복귀 B</button>';document.querySelector('main').append(a,b);await Promise.all([a.updateComplete,b.updateComplete,tooltip.updateComplete]);b.open=true;await b.updateComplete;a.open=true;await a.updateComplete;window.removeRestoringTooltip=()=>tooltip.remove();});
  await page.getByRole('button',{name:'마지막 A',exact:true}).focus();await page.evaluate(()=>window.removeRestoringTooltip());assert.equal(await page.getByRole('button',{name:'복귀 A',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);assert.equal(await page.locator('krds-modal').locator('dialog').evaluate(node=>node.matches(':modal')),true);
 }));
}

for(const engine of ['chromium','webkit']){
 test(`F04 ${engine}: standalone mobile MainMenu is a native modal with one lock and a usable opener`,()=>run(engine,async page=>{
  await page.evaluate(async()=>{document.querySelector('main').innerHTML='<button id="outside">바깥 작업</button>';const menu=document.createElement('krds-main-menu');Object.assign(menu,{items:[{id:'group',label:'신청',children:[{id:'leaf',label:'상세 신청',href:'/local/item'}]}]});document.querySelector('main').append(menu);await menu.updateComplete;});
  const opener=page.getByRole('button',{name:'전체 메뉴',exact:true});await opener.click();const dialog=page.getByRole('dialog');assert.equal(await dialog.count(),1);assert.equal(await dialog.evaluate(node=>node.matches(':modal')),true);assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');for(let n=0;n<7;n++){await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(node=>node.contains(node.getRootNode().activeElement)),true);}await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert.equal(await opener.evaluate(node=>node.getRootNode().activeElement===node),true);assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
 },{viewport:{width:360,height:700}}));
 test(`F05 ${engine}: controlled MainMenu rejects drilldown/query edits and rejected Escape keeps focus`,()=>run(engine,async page=>{
  await page.evaluate(async()=>{const menu=document.createElement('krds-main-menu');Object.assign(menu,{mobileOpen:true,expandedId:null,mobileVariant:'drilldown',query:'',items:[{id:'group',label:'신청',children:[{id:'leaf',label:'상세 신청',href:'/local/item'}]}]});window.menuRequests=[];for(const type of ['expanded-change','query-change'])menu.addEventListener(type,event=>window.menuRequests.push({type,detail:event.detail}));document.querySelector('main').append(menu);await menu.updateComplete;});
  const branch=page.getByRole('button',{name:'신청',exact:true});await branch.click();assert.equal(await branch.getAttribute('aria-expanded'),'false');assert.equal(await page.getByRole('link',{name:'상세 신청',exact:true}).isVisible(),false);const query=page.getByRole('searchbox');await query.fill('거절 편집');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));assert.equal(await query.inputValue(),'');await page.locator('krds-main-menu').evaluate(async host=>{host.expandedId='group';await host.updateComplete;});await query.focus();await page.keyboard.press('Escape');assert.equal(await branch.getAttribute('aria-expanded'),'true');assert.equal(await query.evaluate(node=>node.getRootNode().activeElement===node),true);
 },{viewport:{width:360,height:700}}));
}

test('F06: valid retained FileRecord IDs cannot collide with newly selected native Files',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const form=document.createElement('form');const upload=document.createElement('krds-file-upload');Object.assign(upload,{label:'서류',name:'docs',multiple:true,files:[{id:'file-1',file:new File(['A'],'A.txt'),status:'staged'}]});window.fileRequests=[];upload.addEventListener('files-change',event=>{window.fileRequests.push({ids:event.detail.value.map(record=>record.id),names:event.detail.value.map(record=>record.file.name)});upload.files=event.detail.value;});form.append(upload);document.querySelector('main').append(form);await upload.updateComplete;});
 await page.locator('krds-file-upload input[type=file]').setInputFiles({name:'B.txt',mimeType:'text/plain',buffer:Buffer.from('B')});const requests=await page.evaluate(()=>window.fileRequests);assert.equal(new Set(requests[0].ids).size,2);assert.deepEqual(requests[0].names,['A.txt','B.txt']);assert.deepEqual(await page.evaluate(()=>[...new FormData(document.querySelector('form'))].map(([name,file])=>[name,file.name])),[['docs','A.txt'],['docs','B.txt']]);
}));
test('F07: exact same native File is a no-op while a distinct equal-metadata File remains valid',()=>run('chromium',async page=>{
 const result=await page.evaluate(async()=>{const form=document.createElement('form');const upload=document.createElement('krds-file-upload');const same=new DataTransfer();same.items.add(new File(['A'],'same.txt',{type:'text/plain',lastModified:1}));const a=same.files[0];const distinct=new DataTransfer();distinct.items.add(new File(['A'],'same.txt',{type:'text/plain',lastModified:1}));const b=distinct.files[0];Object.assign(upload,{label:'서류',name:'docs',multiple:true,files:[{id:'retained',file:a,status:'staged'}]});let count=0;upload.addEventListener('files-change',event=>{count++;upload.files=event.detail.value;});form.append(upload);document.querySelector('main').append(form);await upload.updateComplete;const drop=upload.shadowRoot.querySelector('[part=dropzone]');const identity=same.files[0]===a;drop.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:same}));await upload.updateComplete;drop.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:distinct}));await upload.updateComplete;return{identity,count,records:upload.files.map(record=>record.file===a?'A':record.file===b?'B':'other'),form:[...new FormData(form)].map(([name,file])=>[name,file.name])};});assert.deepEqual(result,{identity:true,count:1,records:['A','B'],form:[['docs','same.txt'],['docs','same.txt']]});
}));
test('F07: accepted removal prefers the preceding survivor and reset clears transient drag state without requests',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const form=document.createElement('form');const upload=document.createElement('krds-file-upload');Object.assign(upload,{label:'서류',name:'docs',multiple:true,files:['A','B','C','D'].map(id=>({id,file:new File([id],id+'.txt'),status:'staged'}))});window.fileChanges=0;upload.addEventListener('files-change',event=>{window.fileChanges++;upload.files=event.detail.value;});form.append(upload);document.querySelector('main').append(form);await upload.updateComplete;});await page.getByRole('button',{name:'C.txt 삭제',exact:true}).click();assert.equal(await page.getByRole('button',{name:'B.txt 삭제',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);const state=await page.evaluate(async()=>{const host=document.querySelector('krds-file-upload');host.shadowRoot.querySelector('[part=dropzone]').dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true}));await host.updateComplete;document.querySelector('form').reset();await host.updateComplete;return{drag:host.shadowRoot.querySelector('[part=root]').dataset.krdsState,requests:window.fileChanges,names:host.files.map(record=>record.file.name)};});assert.ok(!state.drag.includes('drag-over'));assert.equal(state.requests,1);assert.deepEqual(state.names,['A.txt','B.txt','D.txt']);
}));
test('F08: rejected StructuredList selection reconciles the actual native checkbox',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const list=document.createElement('krds-structured-list');Object.assign(list,{label:'선택 결과',items:[{id:'a',title:'항목 A',metadata:[]}],selection:{ids:[],onChange:()=>{}}});window.selections=[];list.addEventListener('selection-change',event=>window.selections.push(event.detail));document.querySelector('main').append(list);await list.updateComplete;});const checkbox=page.getByRole('checkbox',{name:'항목 A 선택',exact:true});await checkbox.click();await page.evaluate(()=>Promise.resolve());assert.equal(await checkbox.isChecked(),false);assert.deepEqual(await page.evaluate(()=>window.selections),[{ids:['a']}]);
}));
test('F09: accepted default rows, range keyboard step and resize levels affect the actual native UI',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const textarea=document.createElement('krds-textarea');textarea.label='설명';const range=document.createElement('krds-range-slider');Object.assign(range,{label:'금액',name:'amount'});const resize=document.createElement('krds-resize');document.querySelector('main').append(textarea,range,resize);await Promise.all([textarea.updateComplete,range.updateComplete,resize.updateComplete]);});await page.getByRole('slider',{name:'금액',exact:true}).focus();await page.keyboard.press('ArrowRight');const result=await page.evaluate(()=>({rows:document.querySelector('krds-textarea').shadowRoot.querySelector('textarea').rows,value:document.querySelector('krds-range-slider').shadowRoot.querySelector('input').value,levels:document.querySelector('krds-resize').levels.map(level=>level.percent)}));assert.deepEqual(result,{rows:5,value:'10',levels:[90,100,110,130,150]});
}));
test('F14: actual route change invalidates a pending verified action even when controlled close is declined',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{history.replaceState({},'','#before');history.pushState({},'','#after');document.querySelector('main').innerHTML='<button id="start">시작</button><button id="target-a">검증 작업</button><div id="after-a"></div><button id="target-b">다음 작업</button><div id="after-b"></div>';const coach=document.createElement('krds-coach-mark');Object.assign(coach,{open:true,startActionId:'start',steps:[{id:'one',targetId:'target-a',title:'검증 단계',instruction:'실제 작업 후 확인',requiresAction:true},{id:'two',targetId:'target-b',title:'다음 단계',instruction:'다음 안내'}],boundaries:[{targetId:'target-a',insertionBoundaryId:'after-a'},{targetId:'target-b',insertionBoundaryId:'after-b'}],onTargetAction:()=>new Promise(resolve=>{window.pendingVerifications.push(resolve);})});window.pendingVerifications=[];window.coachChanges=[];coach.addEventListener('step-change',event=>window.coachChanges.push(event.detail));document.querySelector('main').append(coach);await coach.updateComplete;});await page.getByRole('button',{name:'검증 작업',exact:true}).click();await page.waitForFunction(()=>window.pendingVerifications.length===1);await page.evaluate(()=>history.back());await page.waitForFunction(()=>location.hash==='#before');await page.evaluate(()=>window.pendingVerifications[0](true));await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));assert.deepEqual(await page.evaluate(()=>window.coachChanges),[]);await page.getByRole('button',{name:'검증 작업',exact:true}).click();await page.waitForFunction(()=>window.pendingVerifications.length===2);await page.evaluate(()=>window.pendingVerifications[1](true));await page.waitForFunction(()=>window.coachChanges.length===1);assert.equal(await page.getByRole('heading',{name:'다음 단계',exact:true}).count(),1);
}));
test('F15: optional Image descriptions clear and resolve again on actual external target changes',()=>run('chromium',async page=>{
 const result=await page.evaluate(async()=>{const description=document.createElement('p');description.id='image-description';description.textContent='이전 설명';const image=document.createElement('krds-image');Object.assign(image,{src:'/logo.svg',alt:'독립 도형',descriptionId:'image-description'});document.querySelector('main').append(description,image);await image.updateComplete;await new Promise(resolve=>{const native=image.shadowRoot.querySelector('img');if(native.complete)resolve();else{native.addEventListener('load',resolve,{once:true});native.addEventListener('error',resolve,{once:true});}});const refs=()=>image.shadowRoot.querySelector('img').ariaDescribedByElements?.map(element=>element.textContent)??[];image.descriptionId='';await image.updateComplete;const cleared=refs();image.descriptionId='image-description';await image.updateComplete;description.remove();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const removed=refs();const replacement=document.createElement('p');replacement.id='image-description';replacement.textContent='새 설명';document.querySelector('main').append(replacement);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return{cleared,removed,replaced:refs()};});assert.deepEqual(result,{cleared:[],removed:[],replaced:['새 설명']});
}));
test('F16: omitted Table sort stays read-only and an explicit nonfirst controlled column remains authoritative',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const table=document.createElement('krds-table');Object.assign(table,{caption:'신청 수량',columns:[{id:'title',label:'제목',kind:'text',sortable:true},{id:'qty',label:'수량',kind:'number',sortable:true}],rows:[{id:'a',cells:{title:'A',qty:1}},{id:'b',cells:{title:'B',qty:3}}]});window.sortRequests=[];table.addEventListener('sort-change',event=>window.sortRequests.push(event.detail));document.querySelector('main').append(table);await table.updateComplete;});assert.equal(await page.locator('krds-table [part=sort-trigger]').count(),0);await page.locator('krds-table').evaluate(async host=>{host.sort={columnId:'qty',direction:'descending'};await host.updateComplete;});assert.equal(await page.getByRole('columnheader',{name:'수량',exact:true}).getAttribute('aria-sort'),'descending');assert.deepEqual(await page.locator('krds-table tbody tr td:first-child').allTextContents(),['B','A']);await page.getByRole('button',{name:'수량',exact:true}).click();assert.equal(await page.getByRole('columnheader',{name:'수량',exact:true}).getAttribute('aria-sort'),'descending');assert.deepEqual(await page.evaluate(()=>window.sortRequests),[{columnId:'qty',direction:'ascending'}]);
}));

test('F09/F10: omitted Carousel timing is six seconds, finite navigation stops, and multiple layout has real visible primary cards',()=>run('chromium',async page=>{
 await page.clock.install();await page.evaluate(async()=>{const carousel=document.createElement('krds-carousel');Object.assign(carousel,{label:'소식',items:['A','B','C','D'].map(id=>({id,label:id,content:id+' 내용'})),layout:'multiple'});document.querySelector('main').append(carousel);await carousel.updateComplete;});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const root=page.locator('krds-carousel [data-krds-part=root]');assert.equal(await root.getAttribute('data-krds-layout'),'multiple');assert.ok(await page.locator('krds-carousel [data-krds-part=slide]:not([hidden])').count()>=2);await page.setViewportSize({width:360,height:700});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(await page.locator('krds-carousel [data-krds-part=indicators]:not([hidden]) [data-krds-part=indicator]').count(),0);assert.match(await page.locator('krds-carousel [data-krds-part=position]').textContent(),/1\s*\/\s*4/);assert.equal(await page.locator('krds-carousel [data-krds-part=position]').getAttribute('aria-label'),null);
 await page.clock.pauseAt(new Date(await page.evaluate(()=>Date.now())+1000));const playBounds=await page.getByRole('button',{name:'재생',exact:true}).boundingBox();await page.mouse.click(playBounds.x+playBounds.width/2,playBounds.y+playBounds.height/2);await page.mouse.move(0,0);await page.locator('krds-carousel').evaluate(host=>host.updateComplete);await page.clock.fastForward(5999);assert.equal(await page.locator('krds-carousel').evaluate(host=>host.committedIndex),0);await page.clock.fastForward(1);assert.equal(await page.locator('krds-carousel').evaluate(host=>host.committedIndex),1);for(let i=0;i<2;i++){await page.getByRole('button',{name:'다음 슬라이드',exact:true}).click();await page.locator('krds-carousel').evaluate(host=>host.updateComplete);}assert.equal(await page.getByRole('button',{name:'다음 슬라이드',exact:true}).isDisabled(),true);assert.equal(await page.locator('krds-carousel').evaluate(host=>host.committedIndex),3);
}));
test('F11: Tag has one roving group stop, skips disabled items, and moves add focus to the actual applied bar',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const tag=document.createElement('krds-tag');Object.assign(tag,{label:'관심 필터',mode:'toggle',items:[{id:'a',label:'서울'},{id:'b',label:'중지',disabled:true},{id:'c',label:'부산'}]});window.tagChanges=[];tag.addEventListener('selection-change',event=>window.tagChanges.push(event.detail));document.querySelector('main').append(tag);await tag.updateComplete;});assert.equal(await page.locator('krds-tag button[tabindex="0"]').count(),1);await page.getByRole('button',{name:'서울',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('button',{name:'부산',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);await page.keyboard.press('Home');assert.equal(await page.getByRole('button',{name:'서울',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);assert.deepEqual(await page.evaluate(()=>window.tagChanges),[]);
 await page.evaluate(async()=>{document.querySelector('krds-tag').remove();const bar=document.createElement('section');bar.id='applied';bar.tabIndex=-1;const tag=document.createElement('krds-tag');Object.assign(tag,{mode:'add-filter',appliedBarId:'applied',items:[{id:'a',label:'서울'}]});tag.addEventListener('add',()=>{bar.textContent='서울';});document.querySelector('main').append(tag,bar);await tag.updateComplete;});await page.getByRole('button',{name:'서울 필터 옵션 추가',exact:true}).click();assert.equal(await page.locator('#applied').evaluate(node=>node.ownerDocument.activeElement===node),true);
}));
test('F11: Tag removal skips disabled predecessors and uses the group when no usable tags survive',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const tag=document.createElement('krds-tag');Object.assign(tag,{mode:'removable',items:[{id:'a',label:'A'},{id:'b',label:'B',disabled:true},{id:'c',label:'C'},{id:'d',label:'D'}]});tag.addEventListener('remove',event=>{tag.items=tag.items.filter(item=>item.id!==event.detail.id);});document.querySelector('main').append(tag);await tag.updateComplete;});await page.getByRole('button',{name:'C 옵션 삭제',exact:true}).click();assert.equal(await page.getByRole('button',{name:'A 옵션 삭제',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);await page.getByRole('button',{name:'A 옵션 삭제',exact:true}).click();assert.equal(await page.getByRole('button',{name:'D 옵션 삭제',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);await page.getByRole('button',{name:'D 옵션 삭제',exact:true}).click();assert.equal(await page.locator('krds-tag [part=root]').evaluate(node=>node.getRootNode().activeElement===node),true);
}));
test('F12: BottomSheet puts Close before body and honors the reviewed first-control initial focus target',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{const sheet=document.createElement('krds-bottom-sheet');Object.assign(sheet,{title:'조건 선택',initialFocusId:'close',open:true});sheet.innerHTML='<p>긴 본문 내용</p><button id="body-action">본문 작업</button>';document.querySelector('main').append(sheet);await sheet.updateComplete;});assert.equal(await page.getByRole('button',{name:'닫기',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);assert.equal(await page.locator('krds-bottom-sheet dialog').evaluate(dialog=>Boolean(dialog.querySelector('[part=close]').compareDocumentPosition(dialog.querySelector('slot'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
}));
for(const id of ['tooltip','contextual-help'])test(`F13: ${id} ignores handled and 229 Escape without a close request`,()=>run('chromium',async page=>{
 const result=await page.evaluate(async id=>{const widget=document.createElement('krds-'+id);Object.assign(widget,id==='tooltip'?{open:true,text:'설명',triggerLabel:'정보',triggerId:'tooltip-trigger',textId:'tooltip-text'}:{open:true,title:'도움말',triggerLabel:'도움말',content:'실제 도움 내용'});let requests=0;widget.addEventListener('open-change',()=>requests++);document.querySelector('main').append(widget);await widget.updateComplete;const button=widget.shadowRoot.querySelector('button');button.addEventListener('keydown',event=>event.preventDefault(),{once:true});button.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true}));const event=new KeyboardEvent('keydown',{key:'Escape',keyCode:229,bubbles:true,composed:true,cancelable:true});const code=event.keyCode;button.dispatchEvent(event);await widget.updateComplete;return{requests,code};},id);assert.deepEqual(result,{requests:0,code:229});
}));
test('F13: touch Tooltip closes on an actual outside tap',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{document.querySelector('main').innerHTML='<p id="touch-outside" style="padding:3rem">바깥 여백</p>';const tooltip=document.createElement('krds-tooltip');Object.assign(tooltip,{touchToggle:true,text:'터치 설명',triggerLabel:'정보',triggerId:'touch-trigger',textId:'touch-text'});document.querySelector('main').append(tooltip);await tooltip.updateComplete;});await page.getByRole('button',{name:'정보',exact:true}).tap();assert.equal(await page.getByRole('tooltip').isVisible(),true);await page.locator('#touch-outside').tap();assert.equal(await page.getByRole('tooltip').isVisible(),false);
},{hasTouch:true}));
test('F13: a declined hover Escape does not restore focus until the controlled close actually commits',()=>run('chromium',async page=>{
 await page.evaluate(async()=>{document.querySelector('main').innerHTML='<button id="outside-focus">다른 작업</button>';const tooltip=document.createElement('krds-tooltip');Object.assign(tooltip,{open:true,text:'지연 설명',triggerLabel:'정보',triggerId:'delayed-trigger',textId:'delayed-text'});window.tooltipCloseRequests=[];tooltip.addEventListener('open-change',event=>window.tooltipCloseRequests.push(event.detail));document.querySelector('main').append(tooltip);await tooltip.updateComplete;});await page.locator('#outside-focus').focus();await page.getByRole('button',{name:'정보',exact:true}).hover();await page.keyboard.press('Escape');assert.equal(await page.locator('#outside-focus').evaluate(node=>node.ownerDocument.activeElement===node),true);await page.locator('krds-tooltip').evaluate(async host=>{host.open=false;await host.updateComplete;});assert.equal(await page.getByRole('button',{name:'정보',exact:true}).evaluate(node=>node.getRootNode().activeElement===node),true);assert.deepEqual(await page.evaluate(()=>window.tooltipCloseRequests),[{open:false}]);
}));

for (const engine of ['chromium', 'webkit']) {
 test(`F02 ${engine}: the shared lock preserves axis priorities and unrelated body declarations`, () => run(engine, async page => {
  const result = await page.evaluate(async () => {
   document.body.style.setProperty('overflow-x', 'scroll', 'important');
   document.body.style.setProperty('overflow-y', 'auto');
   const modal = document.createElement('krds-modal');
   Object.assign(modal, {title: '우선순위 보존', open: true});
   document.querySelector('main').append(modal);
   await modal.updateComplete;
   document.body.style.setProperty('color', 'rgb(1, 2, 3)');
   modal.remove();
   const style = document.body.style;
   return {x: style.getPropertyValue('overflow-x'), priority: style.getPropertyPriority('overflow-x'), y: style.getPropertyValue('overflow-y'), color: style.color};
  });
  assert.deepEqual(result, {x: 'scroll', priority: 'important', y: 'auto', color: 'rgb(1, 2, 3)'});
 }));
 test(`F12 ${engine}: a later interactive initial target is rejected and releases native isolation and lock`, () => run(engine, async page => {
  const result = await page.evaluate(async () => {
   const sheet = document.createElement('krds-bottom-sheet');
   Object.assign(sheet, {title: '초기 초점 검증', open: true, initialFocusId: 'later'});
   sheet.innerHTML = '<button id="later">나중 작업</button>';
   document.querySelector('main').append(sheet);
   let error = '';
   try { await sheet.updateComplete; } catch (failure) { error = String(failure); }
   return {error, modal: !!sheet.shadowRoot.querySelector('dialog:modal'), overflow: document.body.style.overflow};
  });
  assert.match(result.error, /initialFocusId/);
  assert.equal(result.modal, false);
  assert.equal(result.overflow, '');
 }));
}

for (const engine of ['chromium', 'webkit']) for (const id of ['tooltip', 'contextual-help']) {
 test(`F13 ${engine} ${id}: removal resolves the configured fallback in its original Shadow boundary`, () => run(engine, async page => {
  await page.evaluate(async id => {
   const wrapper = document.createElement('div');
   const boundary = wrapper.attachShadow({mode: 'open'});
   boundary.innerHTML = '<button id="owned-fallback">다음 작업</button>';
   const duplicate = document.createElement('button');
   duplicate.id = 'owned-fallback';
   duplicate.textContent = '다른 경계';
   const help = document.createElement(`krds-${id}`);
   Object.assign(help, {title: '도움말', text: '도움말 내용', triggerLabel: '도움말 열기', triggerId: 'tip', textId: 'tip-text', touchToggle: true, fallbackFocusId: 'owned-fallback'});
   boundary.append(help);
   document.querySelector('main').append(wrapper, duplicate);
   await help.updateComplete;
   window.removalBlur = [];
   help.shadowRoot.querySelector('button').addEventListener('blur', () => window.removalBlur.push({connected: help.isConnected, open: help.committedOpen}), {capture: true});
   window.removeBoundaryHelp = () => help.remove();
   window.boundaryFallbackFocused = () => boundary.activeElement === boundary.getElementById('owned-fallback') && document.activeElement !== duplicate;
  }, id);
  await page.getByRole('button', {name: '도움말 열기', exact: true}).click();
  await page.evaluate(() => window.removeBoundaryHelp());
  assert.equal(await page.evaluate(() => window.boundaryFallbackFocused()), true, JSON.stringify(await page.evaluate(() => window.removalBlur)));
 }));
}

test('TTS host: playback owns a real abortable clock and teardown stops its work', () => run('chromium', async page => {
 await page.goto(new URL('/fixtures/tts?case=outcome-06', page.url()).href);
 await page.getByRole('button', {name: '음성 안내 재생', exact: true}).click();
 await page.waitForFunction(() => document.querySelector('krds-tts-fixture').local.speechElapsedMs > 0);
 const stopped = await page.locator('krds-tts-fixture').evaluate(async host => {
  const session = host.local.speechSession;
  host.local.host = {...host.local.host, mounted: false};
  host.requestUpdate();
  await host.updateComplete;
  return {elapsed: host.local.speechElapsedMs, aborted: session.signal.aborted, active: host.local.speechDriverActive, lifecycle: host.local.speechLifecycle};
 });
 await page.waitForTimeout(60);
 const later = await page.locator('krds-tts-fixture').evaluate(host => host.local.speechElapsedMs);
 assert.ok(stopped.elapsed > 0);
 assert.equal(stopped.aborted, true);
 assert.equal(stopped.active, false);
 assert.equal(stopped.lifecycle, 'disposed');
 assert.equal(later, stopped.elapsed);
}));
