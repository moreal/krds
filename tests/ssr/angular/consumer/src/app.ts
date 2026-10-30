import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VisitForm } from './visit-form';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideKrds, type DateValue } from '@unofficial-krds/angular';
import { Button } from '@unofficial-krds/angular/button';
import { NativeSelect } from '@unofficial-krds/angular/native-select';
import { Modal } from '@unofficial-krds/angular/modal';
import { Tabs } from '@unofficial-krds/angular/tabs';
import { Calendar } from '@unofficial-krds/angular/calendar';
import { DateInput } from '@unofficial-krds/angular/date-input';
import { DateInput as FormDateInput } from '@unofficial-krds/angular/forms';
@Component({ selector: 'outside-consumer', standalone: true, imports: [Button, NativeSelect, Modal, Tabs, Calendar, DateInput, ReactiveFormsModule, VisitForm], providers: [provideKrds({ locale: 'en-US', direction: 'ltr' })], changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<h1>Independent Angular APF consumer</h1>
    <button krdsButton (click)="count.set(count() + 1)">Increment {{count()}}</button>
    <krds-native-select id="consumer-region" label="Region" [options]="options" [formControl]="region" />
    <output aria-label="Region changes">{{regionChanges()}}</output>
    <krds-date-input id="consumer-date" label="Visit date" [formControl]="date" referenceDate="2024-02-15" />
    <krds-tabs id="consumer-tabs" label="Topics" [items]="items" />
    <krds-calendar id="consumer-calendar" label="Choose date" referenceDate="2024-02-15" />
    <button krdsButton #opener (click)="dialog.openFrom(opener)">Open confirmation</button>
    <krds-modal #dialog id="consumer-modal" title="Confirmation" [open]="open()" (openChange)="open.set($event.open)"><p>Confirm your choice.</p></krds-modal>
    <visit-form />
    <p role="status" aria-label="Consumer health">{{ready ? 'ready' : 'missing'}}</p>`,
})
export class ConsumerApplication {
    readonly ready = FormDateInput === DateInput;
    readonly count = signal(0);
    readonly open = signal(false);
    readonly region = new FormControl('seoul', { nonNullable: true });
    readonly regionChanges = signal(0);
    constructor() { this.region.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.regionChanges.update(value => value + 1)); }
    readonly date = new FormControl<DateValue>('2024-02-29');
    readonly options = [{ value: 'seoul', label: 'Seoul' }, { value: 'busan', label: 'Busan' }];
    readonly items = [{ value: 'one', label: 'First', panel: 'First content' }, { value: 'two', label: 'Second', panel: 'Second content' }];
}
