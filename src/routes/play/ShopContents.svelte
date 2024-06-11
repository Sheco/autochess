<script lang="ts">
import UnitCard from '$lib/UnitCard.svelte';
    import { createBoardUnit } from '$lib/combat';
import type { Snippet } from 'svelte';

let { player, buttons, cards, onbuy, rolled }:{
	player:Player,
	buttons:Snippet,
	cards:Unit[],
	onbuy:(i:number) => void,
	rolled:boolean
} = $props()
</script>
<div class="card mt-2">
	<div class="card-header">
		Tienda para <span class="text-{player.color}">{player.name}</span>
		<span class="float-end">
			{@render buttons()}
		</span>
	</div>
	<div class="card-body">
		Oro: {player.gold} Cartas en la mano: {player.hand.length}<br>
		<div class="row mt-2">
				{#each cards as unit, i}
					<div class="col-3 mb-1 d-flex align-items-stretch">
						<UnitCard onclick={() => onbuy(i)} unit={createBoardUnit(unit, {x:0, y:0})} />
					</div>
				{:else}
					<div class="col-12">
						{#if rolled}
							Es momento de darle click al botón de "Siguiente jugador"
						{:else}
							<div class="row row-col-4">
								{#each Array(4).fill(0) as _}
								<div class="col">
									<div class="card">
										<div class="card-header">Carta oculta</div>
										<div class="card-body">Puedes darle click en el boton de "Mostrar cartas"</div>
									</div>
								</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
		</div>

	</div>
</div>
