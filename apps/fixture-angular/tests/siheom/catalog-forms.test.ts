import {Component} from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {expect,test} from 'vitest';
import {TextInput,Textarea,Checkbox,Switch,RadioGroup,RangeSlider,QuantityToggle} from '@unofficial-krds/angular';
@Component({standalone:true,imports:[ReactiveFormsModule,TextInput,Textarea,Checkbox,Switch,RadioGroup,RangeSlider,QuantityToggle],template:`
<form [formGroup]="form"><krds-text-input id="person" name="person" label="신청인" formControlName="person" [required]="true" (valueChange)="edits.push($event.value)"/>
<krds-textarea id="reason" name="reason" label="신청 사유" formControlName="reason" [maxLength]="20"/>
<krds-checkbox id="consent" name="consent" label="동의" formControlName="consent" [required]="true"/>
<krds-switch id="notice" name="notice" label="알림" formControlName="notice"/>
<krds-radio-group id="route" name="route" label="신청 방법" formControlName="route" [required]="true" [options]="options"/>
<krds-range-slider id="amount" name="amount" label="범위" formControlName="amount" [min]="0" [max]="10" [step]="1"/>
<krds-quantity-toggle id="quantity" name="quantity" label="수량" formControlName="quantity" [min]="0" [max]="10" [step]="1"/>
<button type="reset">초기화</button></form>`})
class FormsHarness {
 readonly edits:string[]=[];readonly options=[{value:'',label:'빈 값'},{value:'online',label:'온라인'}];
 readonly form=new FormGroup({person:new FormControl(''),reason:new FormControl('처음'),consent:new FormControl(false),notice:new FormControl(false),route:new FormControl<string|null>(null),amount:new FormControl(2),quantity:new FormControl(1)});
}
test('catalog CVAs connect required validity, silent writes, one edit notification, touch, disabled FormData and reset',async()=>{
 const view=await render(FormsHarness);const instance=view.fixture.componentInstance;const user=userEvent.setup();
 expect(instance.form.controls.person.invalid,"person required").toBe(true);expect(instance.form.controls.consent.invalid,"checkbox required").toBe(true);expect(instance.form.controls.route.invalid,"radio required").toBe(true);
 const values:string[]=[];const subscription=instance.form.controls.person.valueChanges.subscribe(value=>values.push(value??''));
 try{
  instance.form.controls.person.setValue('프로그램');view.fixture.detectChanges();expect(screen.getByRole('textbox',{name:'신청인'})).toHaveValue('프로그램');expect(instance.edits).toEqual([]);values.length=0;
  await user.clear(screen.getByRole('textbox',{name:'신청인'}));await user.type(screen.getByRole('textbox',{name:'신청인'}),'가');await user.tab();
  expect(instance.edits).toEqual(['','가']);expect(values).toEqual(['','가']);expect(instance.form.controls.person.touched,"person touched").toBe(true);
  await user.click(screen.getByRole('checkbox',{name:'동의'}));expect(instance.form.controls.consent.value).toBe(true);expect(instance.form.controls.consent.valid,"checkbox accepted").toBe(true);
  await user.click(screen.getByRole('radio',{name:'빈 값'}));expect(instance.form.controls.route.value).toBe('');expect(instance.form.controls.route.valid,"radio selected empty-string option").toBe(true);
  instance.form.disable();view.fixture.detectChanges();expect([...new FormData(view.container.querySelector('form')!)]).toEqual([]);
  instance.form.enable();view.fixture.detectChanges();const count=instance.edits.length;await user.click(screen.getByRole('button',{name:'초기화'}));expect(instance.edits).toHaveLength(count);expect(screen.getByRole('textbox',{name:'신청인'})).toHaveValue('');
 }finally{subscription.unsubscribe();}
});
@Component({standalone:true,imports:[Checkbox],template:`<form><krds-checkbox id="mixed" name="mixed" label="모두 동의" [checked]="false" [indeterminate]="true" (checkedChange)="requests.push($event.checked)"/><button type="reset">초기화</button></form>`})
class MixedHarness{readonly requests:boolean[]=[];}
test('rejected controlled checkbox restores native checked and authoritative mixed bits after activation and canceled reset',async()=>{
 const view=await render(MixedHarness);const user=userEvent.setup();const input=screen.getByRole('checkbox',{name:'모두 동의'}) as HTMLInputElement;
 expect(input.indeterminate).toBe(true);await user.click(input);expect(input.checked).toBe(false);expect(input.indeterminate).toBe(true);expect(view.fixture.componentInstance.requests).toEqual([true]);
 input.form!.addEventListener('reset',event=>event.preventDefault(),{once:true});await user.click(screen.getByRole('button',{name:'초기화'}));expect(input.checked).toBe(false);expect(input.indeterminate).toBe(true);expect(view.fixture.componentInstance.requests).toEqual([true]);
});
@Component({standalone:true,imports:[TextInput,Textarea,Checkbox,Switch,RangeSlider,QuantityToggle],template:`<krds-text-input id="bare-name" label="필수 이름" required disabled/><krds-textarea id="bare-reason" label="비활성 사유" disabled/><krds-checkbox id="bare-check" label="필수 동의" required disabled/><krds-switch id="bare-switch" label="비활성 알림" disabled/><krds-range-slider id="bare-range" label="비활성 범위" disabled/><krds-quantity-toggle id="bare-quantity" label="비활성 수량" disabled/>`})
class BooleanCatalogHarness{}
test('catalog boolean attributes configure actual native required and disabled controls',async()=>{
 await render(BooleanCatalogHarness);
 expect(screen.getByRole('textbox',{name:'필수 이름'})).toBeDisabled();expect(screen.getByRole('textbox',{name:'필수 이름'})).toBeRequired();
 expect(screen.getByRole('textbox',{name:'비활성 사유'})).toBeDisabled();expect(screen.getByRole('checkbox',{name:'필수 동의'})).toBeDisabled();expect(screen.getByRole('checkbox',{name:'필수 동의'})).toBeRequired();
 expect(screen.getByRole('switch',{name:'비활성 알림'})).toBeDisabled();expect(screen.getByRole('slider',{name:'비활성 범위'})).toBeDisabled();expect(screen.getByRole('button',{name:'비활성 수량 늘리기'})).toHaveAttribute('aria-disabled','true');
});
@Component({standalone:true,imports:[TextInput,Checkbox,RadioGroup],template:`<krds-text-input label="기본 식별자 첫 이름"/><krds-text-input label="기본 식별자 둘 이름"/><krds-checkbox label="기본 식별자 동의"/><krds-radio-group label="기본 식별자 방법" name="generated-route" [options]="options"/>`})
class GeneratedIdentityHarness{readonly options=[{value:'one',label:'기본 첫 방법'},{value:'two',label:'기본 둘 방법'}];}
test('optional field IDs produce unique real label targets across native instances',async()=>{
 await render(GeneratedIdentityHarness);const user=userEvent.setup();
 const first=screen.getByRole('textbox',{name:'기본 식별자 첫 이름'});const second=screen.getByRole('textbox',{name:'기본 식별자 둘 이름'});expect(first.id).not.toBe('');expect(second.id).not.toBe(first.id);
 await user.click(screen.getByText('기본 식별자 둘 이름',{exact:true}));expect(second).toHaveFocus();
 await user.click(screen.getByText('기본 식별자 동의',{exact:true}));expect(screen.getByRole('checkbox',{name:'기본 식별자 동의'})).toBeChecked();
 const radios=screen.getAllByRole('radio');expect(new Set(radios.map(node=>node.id)).size).toBe(2);for(const radio of radios)expect(radio.id).not.toBe('');
});
