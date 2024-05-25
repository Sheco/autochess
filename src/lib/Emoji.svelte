<script lang="ts">
import type { Snippet } from "svelte";
let { children }:{children:Snippet} = $props()
</script>
<span class="emoji">{@render children()}</span>
