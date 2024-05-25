<script lang="ts">
let { value, mod }:{
	value:number,
	mod?:number
} = $props()

</script>
{#if mod}
	<span class="text-success fw-bold">{value+mod}</span>
{:else}
	{value}
{/if}
