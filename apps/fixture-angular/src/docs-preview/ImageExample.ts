import { Component } from '@angular/core';
import { Image } from '@unofficial-krds/angular/image';
import { localAsset } from './preview-data';

@Component({
  selector: 'docs-image-example',
  standalone: true,
  imports: [Image],
  // The first image is a resolved local SVG. The second points at an intentionally absent local file:
  // its informative alternative must survive the load failure.
  template: `
    <krds-image [src]="src" alt="산과 강이 있는 독립 예제 그림" [width]="640" [height]="360" loading="eager" />
    <krds-image [src]="failureSrc" alt="불러올 수 없는 예제 그림" [width]="640" [height]="360" loading="eager" />`,
  styles: `:host { display: grid; gap: 16px; }`,
})
export class ImageExample {
  readonly src = localAsset('example-landscape.svg');
  readonly failureSrc = localAsset('intentional-missing-image.svg');
}
