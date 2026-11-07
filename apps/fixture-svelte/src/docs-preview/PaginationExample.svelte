<script lang="ts">
import Pagination from '@unofficial-krds/svelte/pagination';
import { localRoute } from './shared';
let page = $state(1);
</script>
<Pagination {page} pageCount={12} variant="number-links" hrefForPage={(n) => localRoute(`results?page=${n}`)} onPageChange={(d) => page = d.page} />
