import { Component, signal, type OnDestroy } from '@angular/core';
import { WorkspaceProbe } from '@krds-native/angular';
import { createFixtureBridge } from '@krds-native/test-contracts/driver';
import { NativeProbe } from './native-probe';

@Component({
  selector: 'krds-fixture-app', standalone: true, imports: [NativeProbe, WorkspaceProbe],
  template: `<h1>Angular native fixture</h1>
    <krds-workspace-probe hidden />
    <p role="status" aria-label="Fixture health">ready</p>
    @if (isProbe) {
      <krds-native-probe [count]="count()" [label]="label()" [disabled]="disabled()" (change)="update($event)" />
    } @else {
      <p role="note">Component not implemented: {{ componentId }}/{{ caseId }}</p>
    }`,
})
export class FixtureApplication implements OnDestroy {
  readonly componentId = decodeURIComponent(location.pathname.split('/')[2] ?? 'unknown');
  readonly caseId = new URLSearchParams(location.search).get('case') ?? 'unknown';
  readonly isProbe = this.componentId === '__probe' && this.caseId === 'native-state';
  readonly state = signal<Record<string, unknown>>({});
  readonly bridge = createFixtureBridge('angular', this.isProbe ? { count: 0, label: 'Probe increment', disabled: false } : {});
  private readonly unsubscribe = this.bridge.subscribe(next => this.state.set(next));
  count() { return Number(this.state()['count'] ?? 0); }
  label() { return String(this.state()['label'] ?? 'Probe increment'); }
  disabled() { return this.state()['disabled'] === true; }
  update(value: number) {
    this.bridge.recordEvent('change', { value });
    void this.bridge.setState({ count: value });
  }
  ngOnDestroy() { this.unsubscribe(); this.bridge.dispose(); }
}
