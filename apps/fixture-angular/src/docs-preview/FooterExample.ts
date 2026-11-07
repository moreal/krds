import { Component } from '@angular/core';
import { Footer } from '@unofficial-krds/angular/footer';
import { localAsset, localRoute } from './preview-data';

@Component({
  selector: 'docs-footer-example',
  standalone: true,
  imports: [Footer],
  template: `
    <krds-footer [serviceLogo]="logo" [contacts]="contacts" [utilityLinks]="links" [privacyPolicy]="privacy"
      [policyLinks]="links" copyrightText="Independent local specimen" [institution]="institution" />`,
})
export class FooterExample {
  readonly logo = { src: localAsset('specimen-logo.svg'), alt: '예제 서비스' };
  readonly contacts = [{ label: '예제 문의', text: '로컬 예제 연락처' }];
  readonly links = [{ id: 'policy', label: '이용약관', href: localRoute('policy') }];
  readonly privacy = { href: localRoute('privacy'), label: '개인정보처리방침' };
  readonly institution = {
    institutionName: '독립 예제 운영기관',
    logo: { src: localAsset('specimen-logo.svg'), alt: '독립 예제 운영기관' },
    theme: 'light' as const,
    relationshipText: '독립 운영기관이 운영하는 예제 서비스입니다.',
  };
}
