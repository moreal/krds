import {Component,signal} from '@angular/core';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {HelpPanel} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[HelpPanel],template:`<krds-help-panel id="default-help" [topics]="topics"/>`})
class DefaultHelp{readonly topics=[{id:'a',title:'주제',content:'설명',relatedLinks:[]}];}
test('S4 default help is open wide and opener-only at the actual narrow viewport',async()=>{
 await render(DefaultHelp);const opener=screen.getByRole('button',{name:'도움말 패널 열기'});expect(opener).toHaveAttribute('aria-expanded',matchMedia('(max-width:767px)').matches?'false':'true');
});
@Component({standalone:true,imports:[HelpPanel],template:`<div id="topic-ancestor" tabindex="-1"><button id="topic-icon" [disabled]="blocked()" (click)="topic.set('b');open.set(true)">문맥 도움말</button></div><button id="help-fallback" [disabled]="blocked()">대체 도움말 초점</button>
<krds-help-panel id="other-help" [open]="otherOpen" [topics]="topics"/>
@if(mounted()){<krds-help-panel id="owned-help" [open]="open()" [selectedTopicId]="topic()" [topics]="topics" [showOpener]="false" fallbackFocusId="help-fallback" (openChange)="requests.push($event.open)" (topicChange)="topicRequests.push($event.id)"/>}`})
class OwnedHelp{readonly otherOpen=!matchMedia('(max-width:767px)').matches;readonly open=signal(false);readonly topic=signal<string|null>('a');readonly mounted=signal(true);readonly blocked=signal(false);readonly topics=[{id:'a',title:'첫 도움말',content:'첫 설명',relatedLinks:[]},{id:'b',title:'둘째 도움말',content:'둘째 설명',relatedLinks:[]}];readonly requests:boolean[]=[];readonly topicRequests:(string|null)[]=[];}
async function settle(view:any){view.fixture.detectChanges();await view.fixture.whenStable();await Promise.resolve();}
test('S4 actual accepted contextual change focuses this panel, rejection stays put, and close/unmount use one owner and saved ancestry',async()=>{
 const view=await render(OwnedHelp);const instance=view.fixture.componentInstance;const user=userEvent.setup();await user.click(screen.getByRole('button',{name:'문맥 도움말'}));await settle(view);
 const roots=[...document.querySelectorAll<HTMLElement>('[data-krds-component="help-panel"][data-krds-part="root"]')];const owned=roots.find(root=>root.getAttribute('aria-labelledby')==='owned-help-title')!;expect(owned).toHaveFocus();
 const close=owned.querySelector<HTMLButtonElement>('[data-krds-part="close"]')!;await user.click(close);expect(close).toHaveFocus();expect(instance.requests).toEqual([false]);expect(instance.open()).toBe(true);
 instance.open.set(false);await settle(view);expect(screen.getByRole('button',{name:'대체 도움말 초점'})).toHaveFocus();
 await user.click(screen.getByRole('button',{name:'문맥 도움말'}));await settle(view);instance.blocked.set(true);instance.mounted.set(false);await settle(view);expect(document.getElementById('topic-ancestor')).toHaveFocus();
});
