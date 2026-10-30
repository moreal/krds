import {Component,signal} from '@angular/core';
import {render,screen,waitFor} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {Header,Modal,Pagination} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[Header],template:`<krds-header [home]="home" [mainNavigation]="navigation" [mobileOpen]="open()" (mobileOpenChange)="requests.push($event.open);open.set($event.open)"/>`})
class HeaderHarness{readonly open=signal(false);readonly requests:boolean[]=[];readonly home={href:'/local/home',label:'홈',logo:{src:'/local-assets/specimen-logo.svg',alt:'예제'}};readonly navigation=[{id:'first',label:'첫 메뉴',children:[{id:'leaf',label:'실제 경로',href:'/local/leaf'}]}];}
test('S3 official native document Escape closes controlled Header layer once and removes its actual isolation',async()=>{
 const view=await render(HeaderHarness);const instance=view.fixture.componentInstance;const user=userEvent.setup();const opener=screen.getByRole('button',{name:'전체 메뉴'});await user.click(opener);expect(screen.getByRole('dialog',{name:'전체 메뉴'})).toBeVisible();await user.keyboard('{Escape}');await waitFor(()=>expect(document.querySelector('[data-krds-native-layer]')).toBeNull());expect(instance.requests).toEqual([true,false]);expect(opener).toHaveFocus();await user.click(opener);expect(screen.getByRole('dialog',{name:'전체 메뉴'})).toBeVisible();
});
@Component({standalone:true,imports:[Modal],template:`<krds-modal id="disabled-focus-modal" title="처리 확인" [open]="true"><button [disabled]="pending()" (click)="pending.set(true)">처리 시작</button><button>취소</button></krds-modal>`})
class DisabledModal{readonly pending=signal(false);}
test('S3 top public Modal recovers its focus when the focused real action becomes disabled',async()=>{const view=await render(DisabledModal);await userEvent.setup().click(screen.getByRole('button',{name:'처리 시작'}));await waitFor(()=>expect(screen.getByRole('dialog',{name:'처리 확인'})).toContainElement(document.activeElement as HTMLElement));expect(document.activeElement).not.toBe(screen.getByRole('button',{name:'처리 시작'}));});
@Component({standalone:true,imports:[Pagination],template:`<krds-pagination [page]="page()" [pageCount]="100" [hrefForPage]="href" (pageChange)="page.set($event.page)"/>`})
class AnchorHarness{readonly page=signal(50);readonly href=(page:number)=>'#p-'+page;}
test('S7 accepted shifted-window page preserves the exact activating native anchor for that page',async()=>{const view=await render(AnchorHarness);const link=screen.getByRole('link',{name:'51'});await userEvent.setup().click(link);await waitFor(()=>expect(view.fixture.componentInstance.page()).toBe(51));expect(link).toHaveTextContent('51');expect(link).toHaveFocus();expect(link).toHaveAttribute('aria-current','page');});
@Component({standalone:true,imports:[Modal],template:`<div style="font-family:monospace;font-size:23px"><krds-modal id="font-portal" title="포털 글꼴" [open]="true"><button>포털 작업</button></krds-modal></div>`})
class PortalFontHarness{}
test('S3 native body portal retains the actual inherited host typography',async()=>{await render(PortalFontHarness);const dialog=screen.getByRole('dialog',{name:'포털 글꼴'});expect(getComputedStyle(dialog).fontFamily).toContain('monospace');expect(getComputedStyle(dialog).fontSize).toBe('23px');});
