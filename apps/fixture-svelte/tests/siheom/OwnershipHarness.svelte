<script lang="ts">
import {untrack} from 'svelte';import type {Component} from 'svelte';let {component:Control,initial}:{component:Component<any>;initial:Record<string,unknown>}=$props();let snapshot=$state(untrack(()=>({...initial}))),error=$state('');export function patch(next:Record<string,unknown>){snapshot={...snapshot,...next};}
</script>
<svelte:boundary onerror={e=>error=String(e)}><Control {...snapshot}/></svelte:boundary><output data-error>{error}</output>
