<script lang="ts">
let { boardUnit, attribute }:{
	boardUnit:BoardUnit,
	attribute:string
} = $props()
let base = boardUnit.unit[attribute as keyof typeof boardUnit.unit] as number
let mod = boardUnit.mods[attribute as keyof typeof boardUnit.mods] as number
</script>
{#if mod}
	<span class="text-success fw-bold">{base+mod}</span>
{:else}
	{base}
{/if}
