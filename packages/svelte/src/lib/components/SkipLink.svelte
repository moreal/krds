<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { SkipLinkContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: SkipLinkContract  = $props();
function activate(e:MouseEvent,targetId:string){const target=document.getElementById(targetId);if(!target)throw new TypeError(`SkipLink target does not exist: ${targetId}`);if(target){e.preventDefault();const before=target.getAttribute('tabindex');if(target.tabIndex<0)target.tabIndex=-1;target.focus();target.scrollIntoView();if(before===null)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}}
</script>
<nav aria-label="건너뛰기" {...owned('skip-link','root')} data-krds-visibility={p.visibility??'focus-revealed'}><ul {...owned('skip-link','list')}>{#each p.links as item(item.id)}<li {...owned('skip-link','item')}><a {...owned('skip-link','link')} href={`#${item.targetId}`} onclick={e=>activate(e,item.targetId)}>{item.label}</a></li>{/each}</ul></nav>
