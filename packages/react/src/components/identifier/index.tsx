import type { IdentifierContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export interface IdentifierProps extends IdentifierContract {
    specimen?: boolean;
}
export function Identifier({ institutionName, logo, relationshipText, theme = 'light', specimen = false }: IdentifierProps) { return <section {...part('identifier', 'root', theme)} data-krds-theme={theme} aria-label={institutionName}>{specimen && <p>비공식 독립 로컬 예제</p>}<img {...part('identifier', 'logo')} src={logo.src} alt={logo.alt}/><p {...part('identifier', 'text')}>{relationshipText}</p></section>; }
