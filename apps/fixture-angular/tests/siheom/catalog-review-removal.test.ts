import {Component,signal} from '@angular/core';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {FileUpload,Tag,Snackbar,type FileRecord} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[FileUpload],template:`<krds-file-upload id="removal-files" label="첨부" [files]="files()" (filesChange)="requested=$event.value"/>`})
class FilesHarness{readonly files=signal<readonly FileRecord[]>(['a','b','c'].map(id=>({id,file:new File([id],id+'.txt'),status:'staged' as const})));requested:readonly FileRecord[]=[];}
async function settle(view:any){view.fixture.detectChanges();await view.fixture.whenStable();}
test('S2 file removal waits for acceptance then prefers the previous surviving remove control, next, then picker',async()=>{
 const view=await render(FilesHarness);const user=userEvent.setup();const instance=view.fixture.componentInstance;
 await user.click(screen.getByRole('button',{name:'b.txt 삭제'}));expect(screen.getByRole('button',{name:'b.txt 삭제'})).toHaveFocus();expect(instance.files()).toHaveLength(3);
 instance.files.set([...instance.requested]);await settle(view);expect(screen.getByRole('button',{name:'a.txt 삭제'})).toHaveFocus();
 await user.click(screen.getByRole('button',{name:'a.txt 삭제'}));instance.files.set([...instance.requested]);await settle(view);expect(screen.getByRole('button',{name:'c.txt 삭제'})).toHaveFocus();
 await user.click(screen.getByRole('button',{name:'c.txt 삭제'}));instance.files.set([...instance.requested]);await settle(view);expect(screen.getByRole('button',{name:/^파일 선택(?:\s|$)/})).toHaveFocus();
});
@Component({standalone:true,imports:[Tag],template:`<button>태그 앞</button><krds-tag mode="removable" [items]="items()" (remove)="requested=$event.id" (clear)="clears=clears+1"/><button>태그 뒤</button>`})
class TagsHarness{readonly items=signal([{id:'a',label:'첫째'},{id:'b',label:'둘째',disabled:true},{id:'c',label:'셋째'},{id:'d',label:'넷째'}]);requested='';clears=0;}
test('S2 tags use one tab stop with native activation, roving keys, and accepted previous/next/group removal',async()=>{
 const view=await render(TagsHarness);const instance=view.fixture.componentInstance;const user=userEvent.setup();await user.click(screen.getByRole('button',{name:'태그 앞'}));await user.tab();expect(screen.getByRole('button',{name:'첫째 옵션 삭제'})).toHaveFocus();await user.keyboard('{ArrowRight}');expect(screen.getByRole('button',{name:'셋째 옵션 삭제'})).toHaveFocus();await user.keyboard('{End}');expect(screen.getByRole('button',{name:'넷째 옵션 삭제'})).toHaveFocus();await user.keyboard('{Home}');expect(screen.getByRole('button',{name:'첫째 옵션 삭제'})).toHaveFocus();await user.keyboard('{ArrowRight}');await user.keyboard('{Enter}');expect(instance.requested).toBe('c');expect(screen.getByRole('button',{name:'셋째 옵션 삭제'})).toHaveFocus();
 instance.items.update(items=>items.filter(item=>item.id!=='c'));await settle(view);expect(screen.getByRole('button',{name:'첫째 옵션 삭제'})).toHaveFocus();
 await user.click(screen.getByRole('button',{name:'전체 삭제'}));expect(instance.clears).toBe(1);instance.items.set([]);await settle(view);expect(screen.getByRole('group',{name:'옵션 태그'})).toHaveFocus();
});
@Component({standalone:true,imports:[Snackbar],template:`<div tabindex="-1" id="saved-ancestor"><button id="snack-initiator" [disabled]="blocked()" (click)="shown.set(true)">알림 표시</button></div><button id="snack-fallback" [disabled]="blocked()">대체 초점</button><krds-snackbar [message]="shown()?message:null" [action]="action()" fallbackFocusId="snack-fallback" (dismiss)="requests=requests+1"/>`})
class SnackHarness{readonly shown=signal(false);readonly blocked=signal(false);readonly action=signal<{kind:'button';id:string;label:string}|undefined>({kind:'button',id:'retry',label:'재시도'});readonly message={id:'m',title:'안내',text:'처리 결과'};requests=0;}
test('S2 snackbar rejected close retains focus; accepted action removal uses saved usable ancestry and never steals delivered focus',async()=>{
 const view=await render(SnackHarness);const instance=view.fixture.componentInstance;const user=userEvent.setup();await user.click(screen.getByRole('button',{name:'알림 표시'}));await user.click(screen.getByRole('button',{name:'알림 닫기'}));expect(instance.requests).toBe(1);expect(screen.getByRole('button',{name:'알림 닫기'})).toHaveFocus();
 await user.click(screen.getByRole('button',{name:'재시도'}));instance.blocked.set(true);instance.action.set(undefined);await settle(view);expect(document.getElementById('saved-ancestor')).toHaveFocus();
 instance.blocked.set(false);await settle(view);screen.getByRole('button',{name:'대체 초점'}).focus();instance.shown.set(false);await settle(view);expect(screen.getByRole('button',{name:'대체 초점'})).toHaveFocus();
});
