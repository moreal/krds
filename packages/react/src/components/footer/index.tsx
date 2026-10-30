import type { FooterContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
import { Identifier } from '../identifier/index.js';
import { Link } from '../link/index.js';
export interface FooterProps extends FooterContract {
    specimen?: boolean;
}
export function Footer({ serviceLogo, contacts, utilityLinks, privacyPolicy, policyLinks, copyrightText, institution, specimen = false }: FooterProps) { return <footer {...part('footer', 'root')}><div><img {...part('footer', 'logo')} src={serviceLogo.src} alt={serviceLogo.alt}/><address {...part('footer', 'contacts')}>{contacts.map((contact, i) => <p key={i}>{contact.label}: {contact.href ? <a href={contact.href}>{contact.text}</a> : contact.text}</p>)}</address><ul {...part('footer', 'utilities')}>{utilityLinks.map((link, i) => <li key={i}><Link {...link}/></li>)}</ul></div><nav {...part('footer', 'policies')} aria-label="정책"><strong><a {...part('footer', 'privacy-link')} href={privacyPolicy.href}>{privacyPolicy.label}</a></strong>{policyLinks.map((link, i) => <Link key={i} {...link}/>)}</nav><p {...part('footer', 'copyright')}>{copyrightText}</p>{institution && <Identifier {...institution} specimen={specimen}/>}</footer>; }
