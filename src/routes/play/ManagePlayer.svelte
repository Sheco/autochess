<script lang="ts">
import type { Snippet } from "svelte";
import { createBoardUnit, firstOpenSpace, setBattleCoordinates } from "$lib/combat";
    import { updatePlayerTraits } from "$lib/database";
    import DropUnitCard from "$lib/DropUnitCard.svelte";
    import EmptyUnitCard from "$lib/EmptyUnitCard.svelte";
    import BoardUnitCard from "$lib/BoardUnitCard.svelte";
    import BoardGrid from "$lib/BoardGrid.svelte";
    import TraitInfo from "$lib/TraitInfo.svelte";

let { player, onclose }: {player:Player, onclose?:()=>void} = $props();
let takenUnit:BoardUnit|undefined = $state(undefined)
function ontakeFromBench(c:Coordinate) {
	let otherUnit = takenUnit
	let index=player.hand.units.findIndex(bu => c.x==bu.setCoord.x && c.y==bu.setCoord.y);
	[takenUnit] = player.hand.units.splice(index, 1)
	if(otherUnit) player.hand.units.push(createBoardUnit(otherUnit.unit, c))
}
function ontakeFromBoard(c:Coordinate) {
	let otherUnit = takenUnit
	let index=player.board.units.findIndex(bu => c.x==bu.setCoord.x && c.y==bu.setCoord.y)
	takenUnit = player.board.units[index]
	player.board.units.splice(index, 1)
	if(otherUnit) player.board.units.push(createBoardUnit(otherUnit.unit, c))
	updatePlayerTraits(player)
}
function onreleaseToBench(c:Coordinate) {
	if(!takenUnit)
		return
	player.hand.units.push(createBoardUnit(takenUnit.unit, c))
	updatePlayerTraits(player)
	takenUnit = undefined
}

function onreleaseToBoard(c:Coordinate) {
	if(takenUnit===undefined) {
		console.log("ERROR: transferCard() taken===undefined")
		return
	}

	player.board.units.push(createBoardUnit(takenUnit.unit, c))
	setBattleCoordinates(player)
	updatePlayerTraits(player)
	takenUnit = undefined
}

function onclose_here() {
	if(takenUnit) {
		let c = firstOpenSpace(player.hand)
		if(c) onreleaseToBench(c)
	}
	if(onclose) onclose()
}
$effect(()=> {
	// track player, when it changes, reset state.
	player;
	takenUnit = undefined
})
</script>

{#if takenUnit}
	<div class="fixed-top" style="width:100px">
		<BoardUnitCard unit={takenUnit} onclick={() => {}}/>
	</div>
{/if}

<div class="row">
	<div class="col-4">
		<div class="card mt-2">
			<div class="card-header">Rasgos</div>
			<div class="card-body">
				{#each player.traits as trait}
						<TraitInfo {trait} /><br>
				{/each}
			</div>
		</div>

		{#if onclose}
			<button class="btn btn-secondary" onclick={onclose_here}>
				Cerrar
			</button>
		{/if}
	</div>
	<div class="col-8">
		{#snippet benchDropUnitCard(c:Coordinate)}
		{#if takenUnit}
			<DropUnitCard unit={takenUnit} onclick={() => onreleaseToBench(c)}/>
		{:else}
			<EmptyUnitCard />
		{/if}
		{/snippet}
		{#snippet benchUnitCard(boardUnit:BoardUnit)}
			<BoardUnitCard unit={boardUnit} onclick={() => ontakeFromBench(boardUnit.setCoord)} />
		{/snippet}
		<div class="card mt-2" id="board">
			<div class="card-header bg-{player.color} text-light">
				Banca
			</div>
			<div class="card-body">
				<BoardGrid board={player.hand} mirrored={false} dropUnitCard={benchDropUnitCard} unitCard={benchUnitCard} rows={1} />
			</div>
		</div>

		{#snippet boardDropUnitCard(c:Coordinate)}
		{#if takenUnit}
			<DropUnitCard unit={takenUnit} onclick={() => onreleaseToBoard(c)}/>
		{:else}
			<EmptyUnitCard />
		{/if}
		{/snippet}
		{#snippet boardUnitCard(boardUnit:BoardUnit)}
			<BoardUnitCard unit={boardUnit} onclick={() => ontakeFromBoard(boardUnit.setCoord)} />
		{/snippet}
		<div class="card mt-2" id="board">
			<div class="card-header bg-{player.color} text-light">
				Tablero
			</div>
			<div class="card-body">
				<BoardGrid board={player.board} mirrored={false} dropUnitCard={boardDropUnitCard} unitCard={boardUnitCard} />
			</div>
		</div>
	</div>
</div>
