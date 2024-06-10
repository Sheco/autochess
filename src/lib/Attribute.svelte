<script lang="ts">
let { unit, attribute }:{
	unit:BoardUnit,
	attribute:string
} = $props()
let base = unit.unit[attribute as keyof typeof unit.unit] as number
let active = unit[attribute as keyof typeof unit] as number
let isModded = base!=active
</script>
{#if isModded}
	<span class="text-success fw-bold">{active}</span>
{:else}
	{active}
{/if}
