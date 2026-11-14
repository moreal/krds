import {Component,signal} from '@angular/core';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {SideNavigation,MainMenu} from '@unofficial-krds/angular';
import {afterEach,expect,test} from 'vitest';
import {page} from 'vitest/browser';
afterEach(async()=>{await page.viewport(1280,800);});
const items=[{id:'root',label:'상위 분류',description:'상위 설명',children:[{id:'branch',label:'세부 분류',description:'세부 설명',children:[{id:'leaf',label:'현재 페이지',href:'/local/leaf'}]},{id:'sibling',label:'다른 페이지',href:'/local/sibling'}]},{id:'other',label:'독립 분류',children:[{id:'other-leaf',label:'독립 페이지',href:'/local/other'}]}];
@Component({standalone:true,imports:[SideNavigation],template:`<krds-side-navigation title="예제 메뉴" currentId="leaf" [items]="items"/>`})
class DefaultSide{readonly items=items;}
test('S6 side navigation names its actual landmark, defaults to the current branch and progressively exposes deep context',async()=>{
 const view=await render(DefaultSide);expect(screen.getByRole('navigation',{name:'예제 메뉴'})).toBeVisible();expect(screen.getByRole('link',{name:'현재 페이지'})).toHaveAttribute('aria-current','page');expect(screen.getByRole('heading',{name:'세부 분류'})).toBeVisible();expect(screen.queryByRole('button',{name:'독립 분류'})).toBeNull();await userEvent.setup().click(screen.getByRole('button',{name:'상위 메뉴'}));expect(screen.getByRole('button',{name:'세부 분류 펼치기'})).toHaveFocus();expect(screen.getByRole('button',{name:'상위 분류 접기'})).toHaveAttribute('aria-expanded','true');
});
@Component({standalone:true,imports:[SideNavigation],template:`<krds-side-navigation [items]="items" [expandedIds]="expanded()" (expandedChange)="requests.push($event.ids)"/>`})
class ControlledSide{readonly items=items;readonly expanded=signal<readonly string[]>(['root']);readonly requests:(readonly string[])[]=[];}
test('S6 accepted external side collapse recovers focused descendants to their own trigger',async()=>{const view=await render(ControlledSide);const instance=view.fixture.componentInstance;screen.getByRole('link',{name:'다른 페이지'}).focus();instance.expanded.set([]);view.fixture.detectChanges();await view.fixture.whenStable();expect(screen.getByRole('button',{name:'상위 분류 펼치기'})).toHaveFocus();expect(instance.requests).toEqual([]);});
@Component({standalone:true,imports:[MainMenu],template:`<krds-main-menu [items]="items" [mobileOpen]="mobile()" [expandedId]="expanded()" (mobileOpenChange)="mobile.set($event.open)" (expandedChange)="requests.push($event.id)"/>`})
class ControlledMenu{readonly items=items;readonly mobile=signal(false);readonly expanded=signal<string|null>(null);readonly requests:(string|null)[]=[];}
test('S6 mobile menu has one real tree and committed drilldown title/description; rejected back leaves focus until accepted',async()=>{
 await page.viewport(390,800);const view=await render(ControlledMenu);const instance=view.fixture.componentInstance;const user=userEvent.setup();await user.click(screen.getByRole('button',{name:'전체 메뉴'}));await user.click(screen.getByRole('button',{name:'상위 분류'}));expect(instance.requests).toEqual(['root']);instance.expanded.set('root');view.fixture.detectChanges();await view.fixture.whenStable();expect(screen.getByRole('heading',{name:'상위 분류'})).toBeVisible();expect(screen.getByText('상위 설명')).toBeVisible();expect(screen.getByRole('button',{name:'상위 분류'})).toHaveAttribute('aria-expanded','true');expect(screen.getByRole('button',{name:'독립 분류'})).toHaveAttribute('aria-expanded','false');const back=screen.getByRole('button',{name:'이전 메뉴'});await user.click(back);expect(back).toHaveFocus();expect(instance.requests).toEqual(['root',null]);instance.expanded.set(null);view.fixture.detectChanges();await view.fixture.whenStable();expect(screen.getByRole('button',{name:'상위 분류'})).toHaveFocus();
});
