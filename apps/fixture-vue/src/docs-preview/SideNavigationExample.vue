<script setup lang="ts">
import { ref } from 'vue';
import { SideNavigation, type NavigationItem } from '@unofficial-krds/vue';
const navigation: readonly NavigationItem[] = [{id:'home',label:'홈',href:'#local-home'},{id:'apply',label:'신청',children:[{id:'new',label:'신규 신청',href:'#local-apply'},{id:'history',label:'신청 내역',href:'#local-history'}]},{id:'support',label:'지원',href:'#local-support'}];
const expanded=ref<readonly string[]>(['apply']);
</script>
<template><div><SideNavigation :items="navigation" current-id="new" title="신청 안내" :default-expanded-ids="['apply']" @expanded-change="expanded=$event.ids"/></div></template>
