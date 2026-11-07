import { Component, signal } from '@angular/core';
import { Carousel } from '@unofficial-krds/angular/carousel';

@Component({
  selector: 'docs-carousel-example',
  standalone: true,
  imports: [Carousel],
  template: `
    <a id="carousel-before" href="#carousel-region">캐러셀로 이동</a>
    <div id="carousel-region">
      <krds-carousel [items]="items" [defaultIndex]="0" layout="single" [autoplay]="true" [intervalMs]="6000"
        [loop]="false" (playingChange)="requests.set(requests() + 1)" />
    </div>
    <p role="status">자동 재생 요청 {{ requests() }}회</p>
    <a id="carousel-after" href="#carousel-region">캐러셀 다음 내용</a>`,
})
export class CarouselExample {
  readonly requests = signal(0);
  readonly items = [
    { id: 'a', label: '신청 안내', content: '첫 번째 신청 안내' },
    { id: 'b', label: '서류 안내', content: '두 번째 서류 안내' },
    { id: 'c', label: '문의 안내', content: '세 번째 문의 안내' },
  ];
}
