<script lang="ts">
    import Emoji from "$lib/Emoji.svelte";
    import Modal from "$lib/Modal.svelte";
    import TraitIcon from "$lib/TraitIcon.svelte";

let { trait }: {
	trait: TraitRankActive
} = $props()

let modal = $state(false)
</script>
{#if modal}
<Modal onclose={() => modal = false} title="{trait.trait.icon} {trait.trait.name} nível {trait.level+1}">
			<p>{@html trait.message}</p>
			{#each trait.mods as mod}
				Aplica a <TraitIcon trait={mod.target} />:
				{#if mod.values.maxhp!==undefined}
					HP+{mod.values.maxhp}
				{/if}
				{#if mod.values.attack!==undefined}
						{#each mod.values.attack as dice}
							Ataque: <Emoji>{dice.type.icon}</Emoji>{dice.amount}d{dice.sides}+{dice.modifier}
						{/each}
				{/if}
				<br>
			{/each}
</Modal>
{/if}
<button class="btn btn-info btn-sm p-0" onclick={()=> modal=true}><span class="bi bi-info-circle"></span></button>
<TraitIcon trait={trait.trait} /> {trait.trait.name} <span class="badge bg-secondary">{trait.active}</span>
{#each trait.levels as level, i}
	{#if i == trait.level}
		<b>{level.amount}</b> >
	{:else}
		<span class="text-muted">{level.amount} ></span>
	{/if}
{/each}
