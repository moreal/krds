import type { IdentifierContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type IdentifierProps = IdentifierContract;
export function Identifier(props: IdentifierProps) { return <section {...owned('identifier', 'root', props.theme ?? 'light')} data-krds-theme={props.theme ?? 'light'} aria-label={props.institutionName}><img {...owned('identifier', 'logo')} src={props.logo.src} alt={props.logo.alt}/><p {...owned('identifier', 'text')}>{props.relationshipText}</p></section>; }
