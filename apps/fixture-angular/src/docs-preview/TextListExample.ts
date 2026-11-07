import { Component } from '@angular/core';
import { TextList } from '@unofficial-krds/angular/text-list';

@Component({
  selector: 'docs-text-list-example',
  standalone: true,
  imports: [TextList],
  template: `<krds-text-list [ordered]="true" marker="dot" [items]="items" />`,
})
export class TextListExample {
  readonly items = [{ id: 'one', content: '신청 조건 확인' }, { id: 'two', content: '제출 서류 준비' }];
}
