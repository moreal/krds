import {Component,signal} from '@angular/core';
import {FormControl,ReactiveFormsModule,RequiredValidator} from '@angular/forms';
import {render,screen} from '@testing-library/angular';
import {By} from '@angular/platform-browser';
import userEvent from '@testing-library/user-event';
import {RadioGroup} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
@Component({standalone:true,imports:[RadioGroup,ReactiveFormsModule],template:`<button>이전</button><krds-radio-group id="review-radio" label="방법" name="method" [options]="options" [formControl]="value" [required]="required()" (valueChange)="requests.push($event.value)"/><button>이후</button>`})
class RadioHarness{readonly options=[{value:'',label:'빈 방법'},{value:'one',label:'첫 방법'},{value:'disabled',label:'불가',disabled:true},{value:'two',label:'둘 방법'}];readonly value=new FormControl<string|null>('one');readonly required=signal(true);readonly requests:(string|null)[]=[];}
test('S1 every enabled radio remains sequential after ordinary and empty-string selection without Tab edits',async()=>{
 const view=await render(RadioHarness);const user=userEvent.setup();const instance=view.fixture.componentInstance;
 for(const value of ['one','']){instance.value.setValue(value);view.fixture.detectChanges();const radios=['빈 방법','첫 방법','둘 방법'].map(name=>screen.getByRole('radio',{name}));await user.click(screen.getByRole('button',{name:'이전'}));await user.tab();expect(radios[0]).toHaveFocus();await user.tab();expect(radios[1]).toHaveFocus();await user.tab();expect(radios[2]).toHaveFocus();await user.tab();expect(screen.getByRole('button',{name:'이후'})).toHaveFocus();await user.tab({shift:true});expect(radios[2]).toHaveFocus();await user.tab({shift:true});expect(radios[1]).toHaveFocus();await user.tab({shift:true});expect(radios[0]).toHaveFocus();expect(instance.value.value).toBe(value);}
 expect(instance.requests).toEqual([]);
});
test('S1 required validation uses supported provider registration and keeps the selected empty option valid',async()=>{
 const view=await render(RadioHarness);const instance=view.fixture.componentInstance;const control=view.fixture.debugElement.query(By.directive(RadioGroup));const required=control.injector.get(RequiredValidator,null);
 expect(required).not.toBeNull();expect(Object.hasOwn(required!,'validate')).toBe(false);
 instance.value.setValue('');view.fixture.detectChanges();expect(instance.value.valid).toBe(true);instance.value.setValue(null);view.fixture.detectChanges();expect(instance.value.invalid).toBe(true);instance.required.set(false);view.fixture.detectChanges();expect(instance.value.valid).toBe(true);instance.required.set(true);view.fixture.detectChanges();expect(instance.value.invalid).toBe(true);
 const values:(string|null)[]=[];const subscription=instance.value.valueChanges.subscribe(value=>values.push(value));await userEvent.click(screen.getByRole('radio',{name:'빈 방법'}));expect(values).toEqual(['']);expect(instance.requests).toEqual(['']);subscription.unsubscribe();
});
for(const [name,options] of [['empty',[{value:'one',label:'첫',id:''},{value:'two',label:'둘'}]],['duplicate',[{value:'one',label:'첫',id:'same'},{value:'two',label:'둘',id:'same'}]],['generated collision',[{value:'one',label:'첫',id:'checked-radio-1'},{value:'two',label:'둘'}]]] as const)test('S1 rejects '+name+' explicit option IDs',async()=>{await expect(render(RadioGroup,{componentProperties:{id:'checked-radio',label:'방법',name:'method',options}})).rejects.toThrow(TypeError);});
