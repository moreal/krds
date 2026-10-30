import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { DateInput } from '@krds-native/solid';

const meta={id:'krds-date-input',title:'KRDS/DateInput',component:DateInput,args:{label:'날짜',referenceDate:'2024-02-15'}} satisfies Meta<typeof DateInput>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={args:{}};
export const Disabled:Story={args:{disabled:true,value:'2024-02-15'}};
export const Invalid:Story={args:{value:null,invalid:true,errorMessage:'날짜를 확인하세요'}};
export const Selected:Story={args:{value:'2024-02-29'}};
export const Range:Story={args:{mode:'range',label:'방문 기간',defaultValue:{start:'2024-02-12',end:'2024-02-18'}}};
export const WithoutCalendar:Story={args:{withCalendar:false}};
export const Controlled:Story={render:() => {const [value,setValue]=createSignal<string|null>('2024-02-15');return <DateInput label="방문일" value={value()} referenceDate="2024-02-15" onValueChange={({value})=>setValue(value)} />;}};
