import { html } from 'lit';
import type { FaviconContract, IconAsset } from '@unofficial-krds/contracts';
import { KrdsElement } from '../base.js';
function validate(icon: IconAsset) {
  if (!icon?.href || !icon.type || !icon.sizes || /^(?:https?:)?\/\//.test(icon.href)) throw new TypeError('Favicon requires local assets and explicit MIME/sizes');
}
/** Use inside the actual document head for standalone SSR. Imports have no DOM effects. */
export function faviconLinks({ light, dark, touchIcon }: FaviconContract) {
  validate(light); if (dark) validate(dark); if (touchIcon) validate(touchIcon);
  return html`<link data-krds-favicon="light" rel="icon" href=${light.href} type=${light.type} sizes=${light.sizes} media=${dark ? '(prefers-color-scheme: light)' : 'all'}>${dark ? html`<link data-krds-favicon="dark" rel="icon" href=${dark.href} type=${dark.type} sizes=${dark.sizes} media="(prefers-color-scheme: dark)">` : ''}${touchIcon ? html`<link data-krds-favicon="touch" rel="apple-touch-icon" href=${touchIcon.href} type=${touchIcon.type} sizes=${touchIcon.sizes}>` : ''}`;
}
export class Favicon extends KrdsElement {
  static override properties = { light: { attribute: false }, dark: { attribute: false }, touchIcon: { attribute: false } };
  declare light: IconAsset;
  declare dark: IconAsset | undefined;
  declare touchIcon: IconAsset | undefined;
  private links: HTMLLinkElement[] = [];
  private configuration = '';
  override updated() {
    const key = JSON.stringify([this.light, this.dark, this.touchIcon]);
    if (key === this.configuration && this.links.every(link => link.isConnected)) return;
    this.clear(); this.configuration = key;
    for (const [icon, rel, media, role] of [[this.light, 'icon', this.dark ? '(prefers-color-scheme: light)' : 'all', 'light'], [this.dark, 'icon', '(prefers-color-scheme: dark)', 'dark'], [this.touchIcon, 'apple-touch-icon', 'all', 'touch']] as const) {
      if (!icon) continue;
      validate(icon);
      const existing = [...this.ownerDocument.head.querySelectorAll<HTMLLinkElement>(`link[data-krds-favicon="${role}"]`)].find(link => link.getAttribute('href') === icon.href && link.rel === rel && link.type === icon.type && link.getAttribute('sizes') === icon.sizes && link.media === media);
      const link = existing ?? this.ownerDocument.createElement('link');
      if (!existing) {
        link.dataset.krdsFavicon = role;
        link.rel = rel; link.setAttribute('href', icon.href); link.type = icon.type; link.setAttribute('sizes', icon.sizes); link.media = media;
        this.ownerDocument.head.append(link);
      }
      this.links.push(link);
    }
  }
  private clear() { for (const link of this.links) link.remove(); this.links = []; }
  override disconnectedCallback() { this.clear(); this.configuration = ''; super.disconnectedCallback(); }
  override render() { validate(this.light); return html``; }
}
