import { Header } from '@unofficial-krds/solid/header';
import type { JSX } from 'solid-js';
import { TextList } from '@unofficial-krds/solid/text-list';
import { Table } from '@unofficial-krds/solid/table';
import { Link } from '@unofficial-krds/solid/link';
const header={home:{href:'/krds/',label:'Home',logo:{src:'/krds/mark.svg',alt:'KRDS Native'}},utilityItems:[],mainNavigation:[],search:{label:'Search',onRequest(){}}};
export const headerCompatibility=<><Header {...header} /><Header {...header} searchTriggerId="docs-search-trigger" /></>;
export const content: JSX.Element = <>
 <TextList ordered start={3} items={[{id:'a',content:'API'}]} renderItem={item=><strong>{item.content}</strong>} />
 <Table caption="API" columns={[{id:'a',label:'API',kind:'text'}]} rows={[{id:'row',cells:{a:'value'}}]} renderHeader={column=><code>{column.label}</code>} renderCell={(row,column)=><Link href="#api" title="API" label={<code>{row.cells[column.id]}</code>} />} />
 <TextList items={[{id:'default',content:'plain'}]} /><Link href="#plain" label="plain" />
</>;
