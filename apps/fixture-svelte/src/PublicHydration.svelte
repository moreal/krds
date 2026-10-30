<script lang="ts">
import {Button} from '@unofficial-krds/svelte';import CatalogConsumer from './CatalogConsumer.svelte';import '@unofficial-krds/styles/all.css';let count=$state(0);
</script>
<main id="main-content"><h1>Native public54 hydration consumer</h1><Button id="hydration-action" type="button" onclick={()=>count++}>Hydrated {count}</Button><form id="public-catalog-form"><CatalogConsumer/></form></main>
