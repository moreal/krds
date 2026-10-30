<script lang="ts">
import Pagination from '@unofficial-krds/svelte/pagination';
import type { PaginationProps } from '@unofficial-krds/svelte';
const props: PaginationProps = {
  "defaultPage": 1,
  "pageCount": 12,
  "variant": "number-links"
,
hrefForPage: page => `/local/list?page=${page}`
};
</script>
<section data-example="pagination"><Pagination {...props}/></section>
