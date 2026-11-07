<script setup lang="ts">
import { Table } from '@unofficial-krds/vue';
</script>
<template><div><Table caption="예제 신청 내역" :columns="[{id:'name',label:'신청명',kind:'text'},{id:'count',label:'수량',kind:'number'}]" :rows="[{id:'a',cells:{name:'신청 가',count:2}},{id:'b',cells:{name:'신청 나',count:1}}]" row-header-column-id="name"/></div></template>
