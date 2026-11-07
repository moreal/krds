import { Show, createEffect, createSignal } from 'solid-js';
import type { ImageContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type ImageProps=ImageContract;
export function Image(props:ImageProps){
 const [state,setState]=createSignal('loading');createEffect(()=>{props.src;setState('loading');if(!props.decorative&&!props.alt.trim())throw new TypeError('Meaningful images require an alternative');});
 return <figure {...owned('image','figure')}><img {...owned('image','root',`${state()}${props.decorative?' decorative':''}`)} src={props.src} alt={props.decorative?'':props.alt} width={props.width} height={props.height} srcset={props.srcset} sizes={props.sizes} loading={props.loading??'lazy'} aria-describedby={props.descriptionId} onLoad={()=>setState('loaded')} onError={()=>setState('error')}/><Show when={props.caption}><figcaption {...owned('image','caption')}>{props.caption}</figcaption></Show><Show when={state()==='error'}><span {...owned('image','description')}>이미지를 불러올 수 없습니다.</span></Show></figure>;
}
