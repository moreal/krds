<script lang="ts">
import {untrack} from 'svelte';import type {Component as NativeComponent} from 'svelte';
let {component: Component,initial}:{component:NativeComponent<any>;initial:Record<string,unknown>}=$props();
let state=$state(untrack(()=>({...initial})));
export function patch(next:Record<string,unknown>){state={...state,...next};}
</script>
<Component {...state}/>
