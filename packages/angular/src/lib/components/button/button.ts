import { booleanAttribute, ElementRef, inject, ChangeDetectionStrategy, Component, Input, type OnChanges } from '@angular/core';
import { oneOf } from '../../internal/behavior';

@Component({ selector: 'button[krdsButton]', standalone: true, template: '<span data-krds-component="button" data-krds-part="label"><ng-content /></span>', changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[attr.type]': 'type', '[disabled]': 'disabled', 'data-krds-component': 'button', 'data-krds-part': 'root', '[attr.data-krds-state]': 'disabled ? "disabled" : ""', '[attr.data-krds-variant]': 'variant', '[attr.data-krds-size]': 'size' },
})
export class Button implements OnChanges {
    ngOnChanges(): void {
        oneOf(this.type, ['button', 'submit', 'reset'], 'button type');
        oneOf(this.variant, ['primary', 'secondary', 'tertiary', 'text', 'icon'], 'button variant');
        oneOf(this.size, ['xsmall', 'small', 'medium', 'large', 'xlarge'], 'button size');
    }
    readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
    @Input()
    type: 'button' | 'submit' | 'reset' = 'button';
    @Input({ transform: booleanAttribute })
    disabled = false;
    @Input()
    variant: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon' = 'primary';
    @Input()
    size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
}
