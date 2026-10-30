<script lang="ts">
import {VisuallyHidden,TabBar} from '@unofficial-krds/svelte';let {mode}:{mode:'overlay'|'icons'}=$props();let replacement=$state(false),variant=$state<'interactive-overlay'|'text'>('interactive-overlay');export function replace(){replacement=true;}export function changeVariant(){variant='text';}
</script>
{#if mode==='overlay'}<VisuallyHidden content="Check" {variant}>{#if replacement}<input type="checkbox" aria-label="Replacement"/>{:else}<button type="button">Initial</button>{/if}</VisuallyHidden>{:else}{#snippet custom()}<svg data-custom-icon="true" aria-hidden="true" viewBox="0 0 24 24"><path d="M1 1h22v22H1Z"/></svg>{/snippet}<TabBar currentId="one" items={[{id:'one',label:'One',href:'/one',icon:'home',currentIcon:'custom'}]} icons={{custom}}/>{/if}
