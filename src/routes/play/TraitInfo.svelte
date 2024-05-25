<script lang="ts">
    import Modal from "$lib/Modal.svelte";
    import TraitIcon from "$lib/TraitIcon.svelte";

let { trait }: {
	trait: TraitRankActive
} = $props()

let modal = $state(false)
</script>
{#snippet type(type:string)}
	{#if type=="attack.modifier"}
		Daño
	{:else if type=="hp"}
		HP
	{:else}
		{type}
	{/if}
{/snippet}
{#snippet info()}
	<div class="card">
		<div class="card-header"><TraitIcon trait={trait.trait} /> {trait.trait.name} nível {trait.level+1}</div>
		<div class="card-body">
			<p>{@html trait.message}</p>
			{#each trait.mods as mod}
				Aplica a <TraitIcon trait={mod.target} />:
				{#if mod.values.hp!==undefined}
					HP+{mod.values.hp}
				{/if}
				{#if mod.values.attack!==undefined}
						{#each mod.values.attack as dice}
							Ataque: {dice.type.icon}{dice.amount}d{dice.sides}+{dice.modifier}
						{/each}
				{/if}
				<br>
			{/each}
		</div>
	</div>
{/snippet}
{#if modal}
<Modal onclose={() => modal = false} body={info} />
{/if}
<button class="btn btn-info btn-sm p-0" onclick={()=> modal=true}><span class="bi bi-info-circle"></span></button>
<TraitIcon trait={trait.trait} /> {trait.trait.name} nível {trait.level+1}
