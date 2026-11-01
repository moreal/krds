import { For } from 'solid-js';
import { Link } from '@unofficial-krds/solid/link';
import type { DocInline as Inline } from '../content';
export function DocInline(props: { nodes: Inline[] }) {
 return <For each={props.nodes}>{node => {
  switch(node.type) {
   case 'text': return node.value;
   case 'code': return <code>{node.value}</code>;
   case 'break': return <br />;
   case 'link': return <Link href={node.href} target={node.target} title={node.title} rel={node.rel} label={<DocInline nodes={node.children} />} />;
   case 'strong': return <strong><DocInline nodes={node.children} /></strong>;
   case 'em': return <em><DocInline nodes={node.children} /></em>;
   case 'del': return <del><DocInline nodes={node.children} /></del>;
   case 'kbd': return <kbd><DocInline nodes={node.children} /></kbd>;
   case 'sub': return <sub><DocInline nodes={node.children} /></sub>;
   case 'sup': return <sup><DocInline nodes={node.children} /></sup>;
   case 'mark': return <mark><DocInline nodes={node.children} /></mark>;
   case 'abbr': return <abbr title={node.title}><DocInline nodes={node.children} /></abbr>;
  }
 }}</For>;
}
