/** Native Storybook infrastructure only; this is not a KRDS widget. */
import { Component, Input } from '@angular/core';
@Component({
    selector: 'krds-story-native-probe', standalone: true,
    template: `@if (errorMessage) { <p role="alert">{{ errorMessage }}</p> } @else {
    <button type="button" [disabled]="disabled || loading" (click)="count = count + 1">{{ label }}</button>
    <output role="status" aria-label="Probe value">{{ count }}</output>
  }`,
})
export class NativeStoryProbe {
    @Input()
    count = 0;
    @Input()
    label = 'Probe increment';
    @Input()
    disabled = false;
    @Input()
    loading = false;
    @Input()
    errorMessage = '';
}
