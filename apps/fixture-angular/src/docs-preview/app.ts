import { Component, type Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { examples } from './examples';

const params = new URLSearchParams(location.search);

/** Selects exactly one native example by URL identity; a local route shows its deterministic in-frame destination. */
export function selectedExample(): Type<unknown> | null {
  const componentId = params.get('component') ?? '';
  return params.get('example') === 'default' && Object.hasOwn(examples, componentId) ? examples[componentId] : null;
}

@Component({
  selector: 'docs-preview',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    @if (route !== null) {
      <section aria-labelledby="destination-title">
        <h1 id="destination-title">로컬 예제 목적지</h1>
        <p role="status">{{ route }}</p>
        <a [href]="back">예제로 돌아가기</a>
      </section>
    } @else {
      <ng-container [ngComponentOutlet]="example" />
    }`,
})
export class PreviewApplication {
  readonly example = selectedExample();
  readonly route = params.get('route');
  readonly back = (() => { const url = new URL(location.href); url.searchParams.delete('route'); return url.pathname + url.search; })();
}
