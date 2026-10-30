<script lang="ts">
import {Carousel} from '@unofficial-krds/svelte';let index=$state(0);export function next(){index=1;}
</script>
<Carousel {index} items={[{id:'one',label:'One',content:'First'},{id:'two',label:'Two',content:'Second'}]}>{#snippet slide(item)}<input aria-label={item.label}/>{/snippet}</Carousel>
