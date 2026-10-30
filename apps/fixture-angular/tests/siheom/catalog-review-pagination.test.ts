import {Component} from '@angular/core';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {Pagination} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[Pagination],template:`<form (submit)="$event.preventDefault();submits=submits+1"><krds-pagination variant="direct-page" [page]="3" [pageCount]="10000" [hrefForPage]="href" (pageChange)="requests.push($event.page)"/></form>`})
class DirectPage{readonly href=(page:number)=>'#p-'+page;readonly requests:number[]=[];submits=0;}
test('S7 direct pagination keeps editable invalid strings, associates errors, suppresses composing Enter and resets silently with bounded page links',async()=>{
 const view=await render(DirectPage);const instance=view.fixture.componentInstance;const user=userEvent.setup();const field=screen.getByRole('textbox',{name:'페이지'}) as HTMLInputElement;expect(field.type).toBe('text');expect(view.container.querySelectorAll('[data-krds-part="list"] li').length).toBeLessThanOrEqual((matchMedia('(max-width:767px)').matches?7:11)+2);
 await user.clear(field);await user.type(field,'오류');await user.click(screen.getByRole('button',{name:'이동'}));expect(field.value).toBe('오류');expect(field).toHaveAttribute('aria-invalid','true');const error=document.getElementById(field.getAttribute('aria-describedby')!);expect(error).toHaveTextContent('페이지');expect(instance.requests).toEqual([]);
 await user.clear(field);await user.type(field,'4');field.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));await user.keyboard('{Enter}');expect(instance.requests).toEqual([]);expect(instance.submits).toBe(0);field.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));await user.keyboard('{Enter}');expect(instance.requests).toEqual([4]);expect(instance.submits).toBe(0);
 field.form!.addEventListener('reset',event=>event.preventDefault(),{once:true});field.form!.reset();await Promise.resolve();view.fixture.detectChanges();expect(field.value).toBe('4');field.form!.reset();await Promise.resolve();view.fixture.detectChanges();expect(field.value).toBe('3');expect(instance.requests).toEqual([4]);
});
