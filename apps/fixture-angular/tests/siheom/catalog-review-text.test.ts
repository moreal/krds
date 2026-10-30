import {Component} from '@angular/core';
import {render,screen} from '@testing-library/angular';
import {TextInput,Textarea} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[TextInput,Textarea],template:`<form><krds-text-input id="ime-input" label="이름" defaultValue="처음"/><krds-textarea id="ime-area" label="사유" defaultValue="처음" [maxLength]="10"/></form>`})
class ResetText{}
function composition(field:HTMLInputElement|HTMLTextAreaElement,value:string){field.focus();field.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));field.value=value;field.dispatchEvent(new InputEvent('input',{bubbles:true,data:value,inputType:'insertCompositionText',isComposing:true}));}
test('S8 canceled reset preserves composing drafts; accepted native reset clears drafts and count silently',async()=>{
 const view=await render(ResetText);const fields=screen.getAllByRole('textbox') as (HTMLInputElement|HTMLTextAreaElement)[];const form=view.container.querySelector('form')!;
 for(const field of fields)composition(field,'입력 중');view.fixture.detectChanges();form.addEventListener('reset',event=>event.preventDefault(),{once:true});form.reset();await Promise.resolve();view.fixture.detectChanges();expect(fields.map(field=>field.value)).toEqual(['입력 중','입력 중']);
 form.reset();await Promise.resolve();view.fixture.detectChanges();expect(fields.map(field=>field.value)).toEqual(['처음','처음']);expect(screen.getByText('2 / 10')).toBeVisible();
});
@Component({standalone:true,imports:[TextInput,Textarea],template:`<krds-text-input id="reject-input" label="반려 이름" value="원래" status="success" (valueChange)="edits.push($event.value)"/><krds-textarea id="reject-area" label="반려 사유" value="원래" (valueChange)="areaEdits.push($event.value)"/>`})
class RejectedText{readonly edits:string[]=[];readonly areaEdits:string[]=[];}
test('S8 rejected IME completion plus its trailing input emits one semantic request and exposes noncolor success state',async()=>{
 const view=await render(RejectedText);const instance=view.fixture.componentInstance;const fields=screen.getAllByRole('textbox') as (HTMLInputElement|HTMLTextAreaElement)[];
 for(const field of fields){composition(field,'완료');field.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:'완료'}));field.value='완료';field.dispatchEvent(new InputEvent('input',{bubbles:true,data:'료',inputType:'insertText'}));view.fixture.detectChanges();expect(field.value).toBe('원래');}
 expect(instance.edits).toEqual(['완료']);expect(instance.areaEdits).toEqual(['완료']);const root=fields[0].closest('[data-krds-part="root"]')!;expect(root).toHaveAttribute('data-krds-state','success');expect(screen.getByText('확인되었습니다.')).toBeVisible();
});
