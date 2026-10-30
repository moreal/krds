/** Test-only native renderer probe, never KRDS catalog coverage. */
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
    selector: 'krds-native-probe', standalone: true,
    template: `<button type="button" [disabled]="disabled" (click)="change.emit(count + 1)">{{ label }}</button>
    <output role="status" aria-label="Probe value">{{ count }}</output>`,
})
export class NativeProbe {
    @Input()
    count = 0;
    @Input()
    label = 'Probe increment';
    @Input()
    disabled = false;
    @Output()
    change = new EventEmitter<number>();
}
