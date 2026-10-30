import {booleanAttribute,Component,Input,ChangeDetectionStrategy} from '@angular/core';
@Component({selector:'krds-masthead',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:`@if(governmentService){<div data-krds-component="masthead" data-krds-part="root"><p data-krds-component="masthead" data-krds-part="text">이 누리집은 대한민국 공식 전자정부 누리집입니다.</p></div>}`})
export class Masthead{@Input({transform:booleanAttribute}) governmentService=false;}
