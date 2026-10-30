import type { JSX } from 'solid-js';
import type { VisuallyHiddenContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export interface VisuallyHiddenProps extends VisuallyHiddenContract {
 children?:JSX.Element;
 surrogate?:JSX.Element;
 /** Native input transport keeps the owned overlay token on the actual control. */
 control?:(attributes:JSX.InputHTMLAttributes<HTMLInputElement>)=>JSX.Element;
}
export function VisuallyHidden(props:VisuallyHiddenProps){
 if(props.variant==='interactive-overlay'&&!props.control)throw new TypeError('Interactive overlay requires an actual native input render slot');
 return <span id={props.id} lang={props.lang} {...owned('visually-hidden','root',props.variant??'text')} data-krds-variant={props.variant??'text'} style={props.variant==='interactive-overlay'?{position:'relative',display:'inline-block'}:{position:'absolute',width:'1px',height:'1px',padding:'0',margin:'-1px',overflow:'hidden',clip:'rect(0,0,0,0)','white-space':'nowrap','border-width':'0'}}>{props.variant==='interactive-overlay'?<>{props.control?.({...owned('visually-hidden','overlay-control'),tabIndex:0})}<span {...owned('visually-hidden','visible-surrogate')} aria-hidden="true">{props.surrogate}</span></>:props.content??props.children}</span>;
}
