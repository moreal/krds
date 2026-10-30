import { Show } from 'solid-js';
import type { MastheadContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type MastheadProps = MastheadContract;
export function Masthead(props: MastheadProps) { return <Show when={props.governmentService}><div {...owned('masthead')}><p {...owned('masthead', 'text')}>이 누리집은 대한민국 공식 전자정부 누리집입니다.</p></div></Show>; }
