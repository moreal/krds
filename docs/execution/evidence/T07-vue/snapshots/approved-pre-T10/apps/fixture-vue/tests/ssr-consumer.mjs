import assert from 'node:assert/strict';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, KrdsProvider } from '@unofficial-krds/vue';
import ButtonSubpath from '@unofficial-krds/vue/button';
assert.equal(typeof document, 'undefined');
const html=await renderToString(createSSRApp({render:()=>h(KrdsProvider,{},()=>[
 h(Button,{type:'submit'},()=> '저장'),h(ButtonSubpath,{},()=> '하위 경로'),
 h(NativeSelect,{label:'지역',options:[{value:'a',label:'A'}]}),
 h(Tabs,{label:'정보',items:[{value:'a',label:'첫 번째'}]},{a:()=> '내용'}),
 h(Calendar,{label:'방문일',referenceDate:'2024-02-15'}),
 h(DateInput,{label:'날짜',value:'2024-02-29',withCalendar:false}),
 h(Modal,{title:'확인'})])}));
assert.match(html,/<button/);assert.match(html,/<select/);assert.match(html,/<table/);assert.match(html,/2024-02-29/);assert.doesNotMatch(html,/role="dialog"/);
console.log('Built public root/subpath native Vue SSR without DOM globals: passed');
