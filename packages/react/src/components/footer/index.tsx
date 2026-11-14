import type { FooterContract, LinkData } from '@unofficial-krds/contracts';
import { part, safeRel } from '../../catalog-utils.js';
import { Identifier } from '../identifier/index.js';
export interface FooterProps extends FooterContract {
    specimen?: boolean;
}
const plain = (link: LinkData, key: number) => <a key={key} href={link.href} target={link.target} rel={safeRel(link.target, link.rel)}>{link.label}{link.target === '_blank' && <span> (새 창)</span>}</a>;
export function Footer({ serviceLogo, contacts, utilityLinks, privacyPolicy, policyLinks, copyrightText, institution, specimen = false }: FooterProps) { return <footer {...part('footer', 'root')}><img {...part('footer', 'logo')} src={serviceLogo.src} alt={serviceLogo.alt}/><address {...part('footer', 'contacts')}>{contacts.map((contact, i) => <p key={i}>{contact.label}: {contact.href ? <a href={contact.href}>{contact.text}</a> : contact.text}</p>)}</address><nav {...part('footer', 'utilities')} aria-label="서비스 관련 링크">{utilityLinks.map((link, i) => plain(link, i))}</nav><nav {...part('footer', 'policies')} aria-label="정책"><a {...part('footer', 'privacy-link')} href={privacyPolicy.href} target={privacyPolicy.target} rel={safeRel(privacyPolicy.target, privacyPolicy.rel)}>{privacyPolicy.label}{privacyPolicy.target === '_blank' && <span> (새 창)</span>}</a>{policyLinks.map((link, i) => plain(link, i))}</nav><p {...part('footer', 'copyright')}>{copyrightText}</p>{institution && <Identifier {...institution} specimen={specimen}/>}</footer>; }
