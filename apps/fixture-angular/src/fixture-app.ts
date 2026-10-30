import { Component, signal, ViewChild, type OnDestroy } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput, type DateValue, type SelectOption, type TabItem } from '@unofficial-krds/angular';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import {CatalogExample} from './catalog-example';
import {catalogSeed} from './catalog-state';
import { NativeProbe } from './native-probe';
@Component({
    selector: 'krds-fixture-app', standalone: true, imports: [CatalogExample, NativeProbe, Button, NativeSelect, Modal, Tabs, Calendar, DateInput, ReactiveFormsModule, JsonPipe],
    template: `<h1 data-krds-host="fixture-title">Angular native fixture</h1><p role="status" aria-label="Fixture health">ready</p>
    @if(catalog){<krds-catalog-example [componentId]="componentId" [caseId]="caseId" [state]="state()" (action)="catalogAction($event)" (statePatch)="patch($event)"/>}@else{@switch (componentId) {
      @case ('__probe') { <krds-native-probe [count]="count()" [label]="text('label', 'Probe increment')" [disabled]="flag('disabled')" (change)="updateProbe($event)" /> }
      @case ('button') { <form (submit)="submit($event)"><button krdsButton [disabled]="flag('disabled')" [type]="buttonType()" name="action" value="save" (click)="record('click', {})">저장</button></form> }
      @case ('native-select') {
        <form id="select-form" (submit)="submit($event)">
          <krds-native-select id="region" label="지역" name="region" [options]="options" [value]="caseId === 'controlled' ? text('value', 'seoul') : undefined" [defaultValue]="caseId === 'controlled' ? undefined : 'seoul'" [disabled]="flag('disabled')" [required]="flag('required')" (valueChange)="selection($event.value)" />
          <button krdsButton type="reset">초기화</button><button krdsButton type="submit">제출</button>
        </form>
      }
      @case ('modal') {
        @if (state()['triggerVisible'] !== false) { <button krdsButton id="opener" (click)="confirmation.openFrom($any($event.currentTarget))">열기</button> }
        <button krdsButton id="fallback">다음 작업</button>
        <krds-modal #confirmation id="confirmation" title="확인" [open]="flag('open')" returnFocusId="fallback" [closeOnOutsideClick]="flag('closeOnOutsideClick')" (openChange)="changeOpen($event.open)"><p>내용을 확인하세요.</p></krds-modal>
      }
      @case ('initial-modal') {
        <button krdsButton id="unrelated">관련 없는 작업</button><button krdsButton id="initial-fallback">대체 작업</button>
        @if (flag('mounted')) { <krds-modal id="initial-dialog" title="초기 대화상자" [defaultOpen]="true" [returnFocusId]="flag('noAlternate') ? '' : 'initial-fallback'" (openChange)="record('openChange', $event)" /> }
      }
      @case ('tabs') {
        @if (caseId === 'content') {
          <ng-template #leading><p>첫 번째 안내</p><input aria-label="패널 메모" /></ng-template>
          <ng-template #action><button type="button">패널 작업</button></ng-template>
          <krds-tabs id="local-panels" label="로컬 내용" [items]="[{ value: 'first', label: '첫 번째', panel: leading }, { value: 'second', label: '두 번째', panel: action }]" />
        } @else { <krds-tabs id="topics" label="주제" [items]="tabs" [value]="text('value', 'first')" [activationMode]="flag('automatic') ? 'automatic' : 'manual'" [orientation]="flag('vertical') ? 'vertical' : 'horizontal'" (valueChange)="changeValue($event.value)" /> }
      }
      @case ('calendar') { <krds-calendar id="dates" label="날짜 선택" referenceDate="2024-02-15" [today]="optionalText('today')" [min]="optionalText('min')" [max]="optionalText('max')" [mode]="flag('range') ? 'range' : 'single'" [value]="dateValue()" [disabled]="flag('disabled')" (valueChange)="record('valueChange', $event)" /> }
      @case ('date-input') {
        <form id="date-form" (submit)="submit($event)">
          <krds-date-input id="visit" label="날짜" name="visit" referenceDate="2024-02-15" [value]="dateValue()" [mode]="flag('range') ? 'range' : 'single'" [disabled]="flag('disabled')" [required]="flag('required')" [withCalendar]="state()['withCalendar'] !== false" [min]="optionalText('min')" [max]="optionalText('max')" (valueChange)="dateChange($event.value)" />
          <button krdsButton type="reset">초기화</button><button krdsButton type="submit">제출</button>
        </form>
      }
      @case ('instances') {
        <form id="instances-form">
          @if (state()['mounted'] !== false) {
            <krds-native-select id="instance-one" label="첫 지역" name="one" [options]="options" defaultValue="seoul" (valueChange)="record('one', $event)" />
            <krds-native-select id="instance-two" label="둘 지역" name="two" [options]="options" defaultValue="busan" (valueChange)="record('two', $event)" />
            <krds-date-input id="instance-date-one" label="첫 날짜" name="firstDate" defaultValue="2024-02-29" (valueChange)="record('firstDate', $event)" />
            <krds-date-input id="instance-date-two" label="둘 날짜" name="secondDate" defaultValue="2024-03-01" (valueChange)="record('secondDate', $event)" />
          }
          <button krdsButton type="reset">초기화</button>
        </form>
      }
      @case ('nested') {
        <button krdsButton id="nested-opener" (click)="openParent($event)">열기</button>
        <button krdsButton id="nested-fallback">다음 작업</button>
        @if (state()['mounted'] !== false) {
          <krds-modal #parentModal id="parent-dialog" title="부모" [open]="flag('open')" returnFocusId="nested-fallback" (openChange)="patch({ open: $event.open })">
            <button krdsButton (click)="childModal.openFrom($any($event.currentTarget))">중첩 열기</button>
          </krds-modal>
          <krds-modal #childModal id="child-dialog" title="자식" [open]="flag('child')" returnFocusId="nested-fallback" (openChange)="patch({ child: $event.open })"><p>중첩 내용</p></krds-modal>
        }
      }
      @case ('forms') {
        <form id="reactive-form" [formGroup]="form" (submit)="submit($event)">
          <krds-native-select id="form-region" label="폼 지역" name="region" [options]="options" formControlName="region" [required]="true" (valueChange)="record('selectChange', $event)" />
          <krds-date-input id="form-date" label="폼 날짜" name="date" formControlName="date" [required]="true" referenceDate="2024-02-15" (valueChange)="record('dateChange', $event)" />
          <button krdsButton type="reset">초기화</button><button krdsButton type="submit">제출</button>
        </form>
        <button krdsButton (click)="writeForm()">프로그램 값</button><button krdsButton (click)="disableForm()">비활성화</button>
        <output aria-label="폼 값">{{form.getRawValue() | json}}</output>
        <output aria-label="폼 상태">{{form.valid ? 'valid' : 'invalid'}} {{form.touched ? 'touched' : 'untouched'}}</output>
      }
      @default { <p role="note">Component not implemented: {{componentId}}/{{caseId}}</p> }
    }}`,
})
export class FixtureApplication implements OnDestroy {
    readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? 'unknown');
    readonly caseId = new URLSearchParams(location.search).get('case') ?? 'unknown';
    readonly catalog = !['__probe','button','native-select','modal','initial-modal','tabs','calendar','date-input','instances','nested','forms'].includes(this.componentId);
    catalogAction(event:{name:string;detail:unknown;patch?:Record<string,unknown>}):void{this.record(event.name,event.detail);if(event.patch)void this.bridge.setState(event.patch);}
    readonly state = signal<Record<string, unknown>>({});
    readonly options: readonly SelectOption[] = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'disabled', label: '선택 불가', disabled: true }];
    readonly tabs: readonly TabItem[] = [{ value: 'first', label: '첫 번째', panel: '첫 번째 내용' }, { value: 'second', label: '두 번째', panel: '두 번째 내용' }, { value: 'disabled', label: '사용 불가', disabled: true, panel: '사용 불가 내용' }];
    readonly form = new FormGroup({ region: new FormControl('seoul', { nonNullable: true, validators: Validators.required }), date: new FormControl<DateValue>('2024-02-29', Validators.required) });
    readonly bridge = createFixtureBridge('angular', this.initialState());
    private readonly unsubscribe = this.bridge.subscribe(next => this.state.set(next));
    private initialState(): Record<string, unknown> {
        if(this.catalog)return catalogSeed(this.componentId,this.caseId);
        if (this.componentId === 'button')
            return { disabled: this.caseId === 'disabled' };
        if ((this.componentId === 'date-input' || this.componentId === 'calendar') && this.caseId === 'range')
            return { range: true };
        if (this.componentId === 'date-input' && this.caseId === 'controlled')
            return { value: '2024-02-29', reject: true };
        if (this.componentId === 'native-select' && this.caseId === 'controlled')
            return { value: 'seoul' };
        if (this.componentId === 'tabs')
            return { value: 'first' };
        if (this.componentId === 'modal')
            return { open: false, triggerVisible: true };
        if (this.componentId === 'date-input' && this.caseId === 'timezone-invariance')
            return { value: null };
        return {};
    }
    @ViewChild('parentModal')
    parentModal?: Modal;
    openParent(event: Event): void { this.parentModal?.openFrom(event.currentTarget as HTMLElement); }
    patch(state: Record<string, unknown>): void { void this.bridge.setState(state); }
    text(key: string, fallback: string): string { return String(this.state()[key] ?? fallback); }
    optionalText(key: string): string | undefined { return typeof this.state()[key] === 'string' ? this.state()[key] as string : undefined; }
    flag(key: string): boolean { return this.state()[key] === true; }
    count(): number { return Number(this.state()['count'] ?? 0); }
    buttonType(): 'button' | 'submit' | 'reset' { return (this.state()['type'] as 'button' | 'submit' | 'reset') ?? 'button'; }
    dateValue(): DateValue | undefined { return this.state()['value'] as DateValue | undefined; }
    record(name: string, detail: unknown): void { this.bridge.recordEvent(name, detail); }
    selection(value: string): void { this.record('valueChange', { value }); if (this.caseId === 'controlled' && !this.flag('reject'))
        void this.bridge.setState({ value }); }
    changeValue(value: string): void { this.record('valueChange', { value }); if (!this.flag('reject'))
        void this.bridge.setState({ value }); }
    changeOpen(open: boolean): void { this.record('openChange', { open }); if (!this.flag('reject'))
        void this.bridge.setState({ open }); }
    dateChange(value: DateValue): void { this.record('valueChange', { value }); if ((this.caseId === 'timezone-invariance' || this.caseId === 'controlled') && !this.flag('reject'))
        void this.bridge.setState({ value }); }
    updateProbe(value: number): void { this.record('change', { value }); void this.bridge.setState({ count: value }); }
    submit(event: Event): void { if (event.defaultPrevented)
        return; event.preventDefault(); this.record('submit', Object.fromEntries(new FormData(event.target as HTMLFormElement, (event as SubmitEvent).submitter as HTMLButtonElement | null))); }
    writeForm(): void { this.form.setValue({ region: 'busan', date: '2024-03-01' }); }
    disableForm(): void { this.form.disabled ? this.form.enable() : this.form.disable(); }
    ngOnDestroy(): void { this.unsubscribe(); this.bridge.dispose(); }
}
