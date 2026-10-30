<script lang="ts">
import "@unofficial-krds/styles/all.css";
import type { PatternState } from '@unofficial-krds/test-contracts/patterns';
import { demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections } from '@unofficial-krds/test-contracts/patterns';
import FormErrors from '../../../../../packages/svelte/examples/patterns/FormErrors.svelte';
import SearchResults from '../../../../../packages/svelte/examples/patterns/SearchResults.svelte';
import ConsentConfirmation from '../../../../../packages/svelte/examples/patterns/ConsentConfirmation.svelte';
import ServiceLayout from '../../../../../packages/svelte/examples/patterns/ServiceLayout.svelte';
let { state }: {
    state: PatternState;
} = $props();
const nav = layoutNavigation.map(group => ({ ...group, children: group.children?.map(item => ({ ...item, href: `/examples/service-layout?section=${item.id}` })) }));
</script>
{#if state.patternId==='form-errors'}<FormErrors view={state} identity={demoIdentity} categories={formCategories}/>{:else if state.patternId==='search-results'}<SearchResults view={state} identity={demoIdentity} categories={resourceCategories} hrefForPage={page=>`/examples/search-results?page=${page}`}/>{:else if state.patternId==='consent-confirmation'}<ConsentConfirmation view={state} identity={demoIdentity} content={consentContent}/>{:else}<ServiceLayout view={state} identity={demoIdentity} navigation={nav} section={layoutSections[state.currentId]} logo={{src:'/local-assets/service-logo.svg',alt:demoIdentity.name}} homeHref="/examples/service-layout?section=overview" privacyHref="/examples/service-layout?section=privacy" helpHref="/examples/service-layout?section=accessibility"/>{/if}
