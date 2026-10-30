<script setup lang="ts">
import {ref} from 'vue';
import {Button,NativeSelect,DateInput,Calendar,Tabs,Modal} from '@unofficial-krds/vue';
const count=ref(0),select=ref('seoul'),requests=ref(0),open=ref(false);
const options=[{value:'seoul',label:'Seoul'},{value:'busan',label:'Busan'}];
const items=[{value:'a',label:'First'},{value:'b',label:'Second'}];
</script>
<template><main><h1>Native Vue SSR</h1><Button id="ssr-button" @click="count++">Hydrated {{count}}</Button><form id="ssr-form"><NativeSelect id="ssr-select" name="region" label="Region" hint="Select a region" :value="select" :options="options" @value-change="detail=>{select=detail.value;requests++;}"/><DateInput id="ssr-date" name="visit" label="Visit date" default-value="2024-02-29" :with-calendar="false"/></form><output id="ssr-requests">{{requests}}</output><Tabs id="ssr-tabs" label="Sections" :items="items"><template #a>First panel</template><template #b>Second panel</template></Tabs><Calendar id="ssr-calendar" label="Calendar" reference-date="2024-02-01"/><Button @click="open=true">Open modal</Button><Modal id="ssr-modal" title="Review" :open="open" @open-change="detail=>open=detail.open">Modal content</Modal></main></template>
