import {Component} from '@angular/core';
import {render,screen,waitFor} from '@testing-library/angular';
import {InPageNavigation,Breadcrumb} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[InPageNavigation],template:`<button id="quiet-focus">유지할 초점</button><krds-in-page-navigation [sections]="sections" activeId="third-section" (activeChange)="events.push($event)"/>`})
class OutlineHarness{readonly sections=[{id:'first-section',label:'첫 구성',children:[{id:'second-section',label:'둘째 구성',children:[{id:'third-section',label:'셋째 구성'}]}]}];readonly events:{id:string;reason:string}[]=[];}
test('S6 outline renders all three levels/current cue and observes late or same-ID replacement native targets without stealing focus',async()=>{
 const view=await render(OutlineHarness);const instance=view.fixture.componentInstance;expect(screen.getByRole('navigation',{name:'이 페이지의 구성'})).toBeVisible();expect(screen.getByRole('link',{name:'셋째 구성'})).toHaveAttribute('aria-current','location');const focus=screen.getByRole('button',{name:'유지할 초점'});focus.focus();
 const target=document.createElement('h2');target.id='second-section';target.textContent='늦은 실제 대상';target.style.cssText='position:fixed;top:20%;left:20px;height:50px';document.body.append(target);
 try{await waitFor(()=>expect(instance.events.some(event=>event.id==='second-section'&&event.reason==='scroll')).toBe(true));expect(focus).toHaveFocus();instance.events.length=0;const replacement=target.cloneNode(true) as HTMLElement;target.replaceWith(replacement);await waitFor(()=>expect(instance.events.some(event=>event.id==='second-section'&&event.reason==='scroll')).toBe(true));expect(focus).toHaveFocus();replacement.remove();}finally{target.remove();}
});
@Component({standalone:true,imports:[Breadcrumb],template:`<krds-breadcrumb [home]="home" [items]="items"/>`})
class CrumbHarness{readonly home={href:'/local/home',label:'홈'};readonly items=[{id:'one',href:'/local/one',label:'첫 상위'},{id:'two',href:'/local/two',label:'둘째 상위'},{id:'three',href:'/local/three',label:'가까운 상위'}];}
test('S6 breadcrumb uses actual viewport reduction with Home and nearest parent retained',async()=>{
 await render(CrumbHarness);expect(screen.getByRole('link',{name:'홈'})).toBeVisible();expect(screen.getByRole('link',{name:'가까운 상위'})).toBeVisible();if(matchMedia('(max-width:767px)').matches){expect(screen.queryByRole('link',{name:'첫 상위'})).toBeNull();expect(screen.queryByRole('link',{name:'둘째 상위'})).toBeNull();expect(screen.getByLabelText('첫 상위 > 둘째 상위')).toBeVisible();}else expect(screen.getByRole('link',{name:'첫 상위'})).toBeVisible();
});
