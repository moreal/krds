<script lang="ts">
import {ContextualHelp} from '@unofficial-krds/svelte';let snapshot=$state({open:true,title:'Context',content:'Initial',triggerLabel:'Context help'});export function update(){snapshot={...snapshot,content:'Updated'};}
</script>
<ContextualHelp {...snapshot}><a href="/local/help">Related link</a></ContextualHelp><button type="button" id="metadata-outside">Outside metadata</button>
