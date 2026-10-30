<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { HeaderContract } from '@unofficial-krds/contracts';
import MainMenu from '../main-menu/MainMenu.vue';
import { useOwned } from '../catalog-state';
const p = withDefaults(defineProps<HeaderContract>(), { mobileOpen: undefined, defaultMobileOpen: undefined });
const emit = defineEmits<{
    mobileOpenChange: [
        detail: {
            open: boolean;
        }
    ];
}>();
watchEffect(() => { for (const value of [p.mobileTriggerId, p.mobileTriggerLabel, p.navigationLabel])
    if (value !== undefined && !value.trim())
        throw new TypeError('Navigation identifiers and labels must be nonempty'); });
const utilities = ref(false);
const mobile = useOwned(() => p.mobileOpen, () => p.defaultMobileOpen, false, open => emit('mobileOpenChange', { open }));
</script>
<template>
<slot name="skip-link"/>
<slot name="masthead"/>
<header data-krds-part="root" :data-krds-state="sticky?'sticky':''" :data-krds-action-layout="actionLayout??'horizontal'" data-krds-component="header">
<a data-krds-part="identity" :href="home.href" :target="home.target" :rel="home.target==='_blank'?[home.rel,'noopener noreferrer'].filter(Boolean).join(' '):home.rel" :aria-label="home.target==='_blank'?`${home.label} (새 창)`:home.label" data-krds-component="header" data-krds-state="">
<img :src="home.logo.src" :alt="home.logo.alt"/>
</a>
<div data-krds-part="utilities" data-krds-component="header" data-krds-state="">
<button v-if="utilityItems.length>=5" type="button" data-krds-part="utility-trigger" :aria-expanded="utilities" @click="utilities=!utilities" data-krds-component="header" data-krds-state="">이용 메뉴</button>
<ul :hidden="utilityItems.length>=5&&!utilities">
<li v-for="item in utilityItems" :key="item.id">
<a :href="item.href" :target="item.target" :rel="item.target==='_blank'?[item.rel,'noopener noreferrer'].filter(Boolean).join(' '):item.rel">{{item.label}}<span v-if="item.target==='_blank'"> (새 창)</span>
</a>
</li>
</ul>
</div>
<div data-krds-component="header" data-krds-part="actions" data-krds-state="">
<button v-if="search" data-krds-part="search" type="button" @click="search.onRequest()" data-krds-component="header" data-krds-state="">{{search.label}}</button>
<slot name="actions"/>
</div>
<MainMenu :items="mainNavigation" :current-id="currentId" :label="navigationLabel" :mobile-open="mobile.value.value" :mobile-trigger-id="mobileTriggerId" :mobile-trigger-label="mobileTriggerLabel" @mobile-open-change="mobile.request($event.open)">
<template #mobile-trigger="{open,openMenu}">
<button :id="mobileTriggerId" type="button" data-krds-component="header" data-krds-part="mobile-trigger" :data-krds-state="open?'expanded':'collapsed'" :aria-expanded="open" @click="openMenu">{{mobileTriggerLabel??'모바일 메뉴 열기'}}</button>
</template>
</MainMenu>
</header>
</template>
