import {Component,ErrorHandler} from '@angular/core';
import {render,screen,waitFor} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {Table,StructuredList} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
test('S11 table rejects a row-header ID outside its real column set',async()=>{let caught:unknown;const errors:unknown[]=[];let view:any;try{view=await render(Table,{inputs:{caption:'검사 표',columns:[{id:'a',label:'열',kind:'text'}],rows:[{id:'r',cells:{a:'값'}}],rowHeaderColumnId:'missing'},providers:[{provide:ErrorHandler,useValue:{handleError(error:unknown){errors.push(error);}}}]});}catch(error){caught=error;}try{expect(caught instanceof TypeError||errors.some(error=>error instanceof TypeError)).toBe(true);}finally{view?.fixture.destroy();}});
test('S11 ordinary sortable metadata without configured sort has no dead button or unnecessary overflow tab stop',async()=>{
 const view=await render(Table,{inputs:{caption:'읽기 표',columns:[{id:'a',label:'열',kind:'text',sortable:true}],rows:[{id:'r',cells:{a:'값'}}]}});expect(screen.queryByRole('button',{name:'열'})).toBeNull();expect(view.container.querySelector('[data-krds-part="scroll-region"]')).not.toHaveAttribute('tabindex');expect(screen.queryByRole('button',{name:'표 다음 열'})).toBeNull();
});
@Component({standalone:true,imports:[StructuredList],template:`<krds-structured-list variant="table" [items]="items" [sort]="sort" [actionsTemplate]="actions"/><ng-template #actions let-item><button (click)="saved=item.id">{{item.title}} 저장</button></ng-template>`})
class StructuredHarness{readonly items=[{id:'one',title:'첫 문서',metadata:[{label:'분류',value:'공개'}]},{id:'two',title:'둘째 문서',metadata:[{label:'분류',value:null}]}];readonly sort={key:'title',direction:'ascending' as const,onChange:(detail:unknown)=>this.requests.push(detail)};readonly requests:unknown[]=[];saved='';}
test('S7 structured table preserves real header relationships and supplies native per-item actions and configured sorting',async()=>{
 const view=await render(StructuredHarness);const instance=view.fixture.componentInstance;expect(screen.getByRole('table')).toBeVisible();expect(screen.getByRole('columnheader',{name:'분류'})).toBeVisible();await userEvent.setup().click(screen.getByRole('button',{name:'둘째 문서 저장'}));expect(instance.saved).toBe('two');await userEvent.setup().click(screen.getByRole('button',{name:'정렬 오름차순'}));expect(instance.requests).toEqual([{key:'title',direction:'descending'}]);
});
