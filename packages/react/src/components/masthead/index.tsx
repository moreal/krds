import type {MastheadContract} from '@unofficial-krds/contracts';
import {part} from '../../catalog-utils.js';
export type MastheadProps = MastheadContract;
/** The caller's real eligibility flag is authoritative; examples label their simulation outside this component. */
export function Masthead({governmentService}:MastheadProps) {
    if (!governmentService) return null;
    return <div {...part('masthead','root')}><p {...part('masthead','text')}>이 누리집은 대한민국 공식 전자정부 누리집입니다.</p></div>;
}
