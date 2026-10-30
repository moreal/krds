import {Component,Input,ChangeDetectionStrategy,inject,type OnChanges,type OnDestroy} from '@angular/core';
import type {IconAsset} from '@unofficial-krds/contracts';
import {KRDS_ENVIRONMENT} from '../../internal/behavior';
import {CatalogIds} from '../../internal/catalog-ids';
@Component({selector:'krds-favicon',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,template:``})
export class Favicon implements OnChanges,OnDestroy{
 @Input() light:IconAsset={href:'',type:'image/svg+xml',sizes:'any'};@Input() dark:IconAsset|undefined;@Input() touchIcon:IconAsset|undefined;
 private readonly document=inject(KRDS_ENVIRONMENT).document;private readonly identity=inject(CatalogIds).allocate('favicon');private nodes:HTMLLinkElement[]=[];
 ngOnChanges():void{const old=[...new Set([...this.nodes,...Array.from(this.document.head.querySelectorAll<HTMLLinkElement>('link[data-krds-favicon]')).filter(node=>node.getAttribute('data-krds-favicon')===this.identity)])];const next:HTMLLinkElement[]=[];
  for(const [asset,rel,media] of [[this.light,'icon',this.dark?'(prefers-color-scheme: light)':''],[this.dark,'icon','(prefers-color-scheme: dark)'],[this.touchIcon,'apple-touch-icon','']] as const){if(!asset?.href)continue;const link=old.find(node=>!next.includes(node)&&node.rel===rel&&(node.getAttribute('media')??'')===media)??this.document.createElement('link');link.rel=rel;link.href=asset.href;link.type=asset.type;link.setAttribute('sizes',asset.sizes);if(media)link.media=media;else link.removeAttribute('media');link.setAttribute('data-krds-favicon',this.identity);if(!link.parentNode)this.document.head.appendChild(link);next.push(link);}
  for(const node of old)if(!next.includes(node))node.parentNode?.removeChild(node);this.nodes=next;
 }
 ngOnDestroy():void{for(const node of this.nodes)node.parentNode?.removeChild(node);this.nodes=[];}
}
