import { createSignal } from 'solid-js';
import { Tabs } from '@unofficial-krds/solid';
export function TabsExample() {
 const [value, setValue] = createSignal('overview');
 return <section aria-label="탭 예제"><Tabs label="신청 안내" value={value()} onValueChange={detail => setValue(detail.value)} items={[{value:'overview',label:'안내',content:<p>신청 절차를 확인하세요.</p>},{value:'documents',label:'제출 서류',content:<p>신분증과 신청서를 준비하세요.</p>},{value:'closed',label:'사용 불가',content:<p>준비 중입니다.</p>,disabled:true}]} /><p role="status">{value() === 'overview' ? '안내를 보고 있습니다.' : '제출 서류를 보고 있습니다.'}</p></section>;
}
