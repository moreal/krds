import { expect, test } from 'vitest';
import { render } from '@solidjs/testing-library';
import { TextList } from '@unofficial-krds/solid/text-list';
import { Table } from '@unofficial-krds/solid/table';
import { Link } from '@unofficial-krds/solid/link';
import '@unofficial-krds/styles/base.css';
import '@unofficial-krds/styles/text-list.css';

test('public rich list/table/Link render props retain native content and default fallbacks', () => {
 const view=render(()=><>
  <TextList ordered start={3} items={[{id:'a',content:'fallback'}]} renderItem={item=><><strong>{item.content}</strong><TextList items={[{id:'b',content:'nested'}]} /></>} />
  <Table caption="Rich API" columns={[{id:'api',label:'API',kind:'text'}]} rows={[{id:'a',cells:{api:'fallback'}}]} renderCell={(row,column)=><Link href="#api" label={<code>{row.cells[column.id]}</code>} />} />
  <Table caption="Default API" columns={[{id:'api',label:'API',kind:'text'}]} rows={[{id:'a',cells:{api:'string fallback'}}]} />
 </>);
 expect(view.container.querySelector('li strong')?.textContent).toBe('fallback');
 expect(view.container.querySelector('ol')?.start).toBe(3);
 expect(view.container.querySelector('ol ul li')?.textContent).toBe('nested');
 expect(view.getByRole('link',{name:'fallback'}).querySelector('code')).not.toBeNull();
 expect(view.getByRole('cell',{name:'string fallback'})).toBeVisible();
});
test('actual KRDS CSS computes decimal, dot, hollow and dash markers',()=>{
 const view=render(()=><><TextList ordered items={[{id:'a',content:'number'}]} /><TextList marker="dot" items={[{id:'a',content:'dot'}]} /><TextList marker="hollow" items={[{id:'a',content:'hollow'}]} /><TextList marker="dash" items={[{id:'a',content:'dash'}]} /></>);
 const lists=[...view.container.querySelectorAll('ol,ul')];
 expect(lists.map(x=>x.getAttribute('data-krds-ordering'))).toEqual(['ordered','unordered','unordered','unordered']);
 // KRDS draws markers on the item (component.css 1579–1612), not with native list-style.
 expect(lists.map(x=>getComputedStyle(x).listStyleType)).toEqual(['none','none','none','none']);
 const markers=lists.map(x=>getComputedStyle(x.querySelector('li')!,'::before'));
 expect(markers.map(m=>m.content)).toEqual(['counter(list-item) "."','""','""','"-"']);
});
test('default string and three-level children stay intact and reject deeper data',()=>{
 const view=render(()=><TextList items={[{id:'a',content:'one',children:[{id:'b',content:'two',children:[{id:'c',content:'three'}]}]}]} />);
 expect(view.container.querySelectorAll('li')).toHaveLength(3);
 expect(()=>render(()=><TextList items={[{id:'a',content:'one',children:[{id:'b',content:'two',children:[{id:'c',content:'three',children:[{id:'d',content:'four'}]}]}]}]} />)).toThrow('at most three levels');
});
