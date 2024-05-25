<script lang="ts">
import UnitCard from "$lib/UnitCard.svelte";
import type { Snippet } from "svelte";
import DropUnitCard from "./DropUnitCard.svelte";
import { fade } from "svelte/transition";

let {player, onclick, onrelease, actions = undefined, takenUnit}:{
	player:Player, 
	actions?:Snippet|undefined,
	onclick:(i:number)=>void,
	onrelease:()=>void,
	takenUnit:Unit|undefined,
} = $props();

</script>
<div class="card mt-2" id="hand">
	<div class="card-header bg-{player.color} text-light">
		Banca
		{#if actions}
		<div class="float-end">
		{@render actions()}
		</div>
		{/if}
	</div>
	<div class="card-body">
		<div class="row">
			{#each player.hand as unit, index}
				<div class="col-3 mb-2 d-flex align-items-stretch" in:fade>
					<UnitCard {unit} onclick={() => onclick(index)} />
				</div>
			{/each}
			{#if player.hand.length == 0 && !takenUnit}
				<div class="col-3 mb-2 d-flex align-items-stretch">
					<div class="card w-100">
						<div class="card-header p-0">Oops</div>
						<div class="card-body" style="height: 100px">
							No tienes cartas en la mano.
						</div>
					</div>
				</div>
			{:else if takenUnit}
				<div class="col-3 mb-2 d-flex align-items-stretch">
					<DropUnitCard unit={takenUnit} onclick={onrelease}/>
				</div>
			{/if}
		</div>
	</div>
</div>

