<script lang="ts">
let { unit, attribute }:{
	unit:Unit|BoardUnit,
	attribute:string
} = $props()
type key = keyof typeof unit
</script>
{#if 'mods' in unit}
	{#if attribute in unit.mods && unit.mods[attribute as keyof typeof unit.mods]}
		<span class="text-success fw-bold">{(unit[attribute as key] as number)+(unit.mods[attribute as keyof typeof unit.mods] as number)}</span>
	{:else}
		{unit[attribute as key]}
	{/if}
{/if}
