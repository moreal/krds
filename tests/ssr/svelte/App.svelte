<script lang="ts">
import {Button,NativeSelect,DateInput,Calendar,Tabs,Modal} from '@unofficial-krds/svelte';
let count=$state(0),select=$state('seoul'),requests=$state(0),open=$state(false);
const options=[{value:'seoul',label:'Seoul'},{value:'busan',label:'Busan'}];
const items=[{value:'a',label:'First',content:'First panel'},{value:'b',label:'Second',content:'Second panel'}];
</script>
<main><h1>Native Svelte SSR</h1><Button id="ssr-button" onclick={()=>count++}>Hydrated {count}</Button><form id="ssr-form"><NativeSelect id="ssr-select" name="region" label="Region" hint="Select a region" value={select} {options} onValueChange={detail=>{select=detail.value;requests++;}}/><DateInput id="ssr-date" name="visit" label="Visit date" defaultValue="2024-02-29" withCalendar={false}/></form><output id="ssr-requests">{requests}</output><Tabs id="ssr-tabs" label="Sections" {items}/><Calendar id="ssr-calendar" label="Calendar" referenceDate="2024-02-01"/><Button onclick={()=>open=true}>Open modal</Button><Modal id="ssr-modal" title="Review" {open} onOpenChange={detail=>open=detail.open}>Modal content</Modal></main>
