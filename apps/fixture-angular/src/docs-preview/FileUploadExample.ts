import { Component, signal } from '@angular/core';
import { FileUpload } from '@unofficial-krds/angular/file-upload';
import { Button } from '@unofficial-krds/angular/button';
import type { FileRecord } from '@unofficial-krds/angular';

@Component({
  selector: 'docs-file-upload-example',
  standalone: true,
  imports: [FileUpload, Button],
  template: `
    <form>
      <krds-file-upload id="documents" name="documents" label="첨부 서류" accept=".txt,.pdf" [maxFiles]="3"
        [maxBytes]="1048576" [files]="files()" (filesChange)="files.set($event.value); receipt.set('')" />
      <div class="preview-actions"><button krdsButton type="button" (click)="submit()">제출</button></div>
      <p role="status">{{ receipt() }}</p>
    </form>`,
})
export class FileUploadExample {
  readonly files = signal<readonly FileRecord[]>([]);
  readonly receipt = signal('');
  submit(): void {
    // Handled on click: the docs iframe sandbox blocks form submission. Local submit gate: the selected File objects stay in memory and are never sent anywhere.
    this.receipt.set('제출한 파일: ' + (this.files().map(record => record.file.name).join(', ') || '없음'));
  }
}
