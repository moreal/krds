import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Calendar } from '@unofficial-krds/solid';

const meta = { id:'krds-calendar', title:'KRDS/Calendar', component:Calendar, args:{label:'날짜 선택',referenceDate:'2024-02-15'} } satisfies Meta<typeof Calendar>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={args:{}};
export const Disabled:Story={args:{disabled:true,value:'2024-02-15'}};
export const Selected:Story={args:{value:'2024-02-29',today:'2024-02-15'}};
export const SelectedRange:Story={args:{mode:'range',value:{start:'2024-02-12',end:'2024-02-18'},referenceDate:'2024-02-15',today:'2024-02-15'}};
export const Boundaries:Story={args:{referenceDate:'0001-01-01',min:'0001-01-01',max:'0001-01-31'}};
export const Controlled:Story={render:() => {const [value,setValue]=createSignal<string|null>('2024-02-15');return <Calendar label="방문일 선택" value={value()} referenceDate="2024-02-15" onValueChange={({value})=>setValue(value)} />;}};
