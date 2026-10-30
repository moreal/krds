import {Component,ErrorHandler} from '@angular/core';
import {FormControl,ReactiveFormsModule} from '@angular/forms';
import {render,screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {RangeSlider,QuantityToggle} from '@unofficial-krds/angular';
import {expect,test} from 'vitest';
for(const component of [RangeSlider,QuantityToggle])for(const value of [200,NaN,Infinity,1.5])test(`S9 ${component.name} rejects invalid committed ${value} instead of silently serializing a different number`,async()=>{
 const errors:unknown[]=[];let caught:unknown;let view:any;try{view=await render<RangeSlider|QuantityToggle>(component,{inputs:{min:0,max:10,step:1,value},providers:[{provide:ErrorHandler,useValue:{handleError(error:unknown){errors.push(error);}}}]});}catch(error){caught=error;}
 try{expect(caught instanceof RangeError||errors.some(error=>error instanceof RangeError)).toBe(true);}finally{view?.fixture.destroy();}
});
@Component({standalone:true,imports:[RangeSlider,QuantityToggle,ReactiveFormsModule],template:`<form><krds-range-slider id="fraction-range" name="range" label="범위" [min]="0.1" [max]="1.1" [step]="0.1" [formControl]="range" (valueChange)="rangeEdits.push($event.value)"/><krds-quantity-toggle id="fraction-quantity" name="quantity" label="수량" [min]="0.1" [max]="1.1" [step]="0.1" [formControl]="quantity" (valueChange)="quantityEdits.push($event.value)"/></form>`})
class NumberHarness{readonly range=new FormControl(0.3,{nonNullable:true});readonly quantity=new FormControl(0.3,{nonNullable:true});readonly rangeEdits:number[]=[];readonly quantityEdits:number[]=[];}
test('S9 finite step members agree with native FormData, expose endpoints/output relationships and notify CVA exactly once',async()=>{
 const view=await render(NumberHarness);const instance=view.fixture.componentInstance;const rangeValues:number[]=[],quantityValues:number[]=[];instance.range.valueChanges.subscribe(value=>rangeValues.push(value));instance.quantity.valueChanges.subscribe(value=>quantityValues.push(value));
 const form=view.container.querySelector('form')!;expect(new FormData(form).get('range')).toBe('0.3');expect(new FormData(form).get('quantity')).toBe('0.3');expect(view.container.querySelector('[data-krds-part="min"]')).toHaveTextContent('0.1');expect(view.container.querySelector('[data-krds-part="max"]')).toHaveTextContent('1.1');
 const increase=screen.getByRole('button',{name:'수량 늘리기'});expect(increase).toHaveAttribute('aria-describedby','fraction-quantity-output');await userEvent.setup().click(increase);expect(instance.quantity.value).toBe(0.4);expect(quantityValues).toEqual([0.4]);expect(instance.quantityEdits).toEqual([0.4]);
 const slider=screen.getByRole('slider') as HTMLInputElement;slider.value='0.4';slider.dispatchEvent(new InputEvent('input',{bubbles:true}));view.fixture.detectChanges();expect(rangeValues).toEqual([0.4]);expect(instance.rangeEdits).toEqual([0.4]);expect(new FormData(form).get('range')).toBe('0.4');
});
