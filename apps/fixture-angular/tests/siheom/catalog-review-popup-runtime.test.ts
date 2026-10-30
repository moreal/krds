import {Component,signal} from '@angular/core';
import {render,screen,waitFor} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {CoachMark,ContextualHelp} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[CoachMark],template:`<button id="geometry-target">실제 대상</button><div id="geometry-boundary"></div><krds-coach-mark [open]="true" [steps]="steps" [boundaries]="boundaries"/>`})
class Geometry{readonly steps=[{id:'s',targetId:'geometry-target',title:'실제 안내',instruction:'실제 콘텐츠와 동작이 있는 안내입니다.'}];readonly boundaries=[{targetId:'geometry-target',insertionBoundaryId:'geometry-boundary'}];}
test('runtime actual adjacent Coach root has nonzero committed geometry and remains inside the real viewport',async()=>{const view=await render(Geometry);const root=view.container.ownerDocument.querySelector<HTMLElement>('[data-krds-component="coach-mark"][data-krds-part="root"]')!;const box=root.getBoundingClientRect();expect(box.height).toBeGreaterThan(0);expect(box.left).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(innerWidth);});
@Component({standalone:true,imports:[ContextualHelp],template:`<krds-contextual-help id="literal-outside" [open]="open()" title="설명" triggerLabel="설명 열기" (openChange)="open.set($event.open)"/><button (click)="actions=actions+1">실제 외부 작업</button>`})
class OutsideLiteral{readonly open=signal(false);actions=0;}
test('runtime accepted contextual outside click runs its actual target action and then follows the literal trigger-return policy once',async()=>{const view=await render(OutsideLiteral);const user=userEvent.setup();const trigger=screen.getByRole('button',{name:'설명 열기'});await user.click(trigger);await user.click(screen.getByRole('button',{name:'실제 외부 작업'}));await waitFor(()=>expect(trigger).toHaveFocus());expect(view.fixture.componentInstance.actions).toBe(1);expect(view.fixture.componentInstance.open()).toBe(false);});
