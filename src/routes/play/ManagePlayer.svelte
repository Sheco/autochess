<script lang="ts">
import type { Snippet } from "svelte";
import { createBoardUnit, setBattleCoordinates } from "$lib/combat";
    import { updatePlayerTraits } from "$lib/database";
    import DropUnitCard from "$lib/DropUnitCard.svelte";
    import EmptyUnitCard from "$lib/EmptyUnitCard.svelte";
    import BoardUnitCard from "$lib/BoardUnitCard.svelte";
    import BoardGrid from "$lib/BoardGrid.svelte";

let { player }: {player:Player, actions?:Snippet|undefined} = $props();
let takenUnit:BoardUnit|undefined = $state(undefined)
function ontakeFromBench(c:Coordinate) {
	let index=player.hand.findIndex(bu => c.x==bu.setCoord.x && c.y==bu.setCoord.y);
	[takenUnit] = player.hand.splice(index, 1)
}
function ontakeFromBoard(c:Coordinate) {
	let index=player.board.findIndex(bu => c.x==bu.setCoord.x && c.y==bu.setCoord.y)
	takenUnit = player.board[index]
	player.board.splice(index, 1)
	updatePlayerTraits(player)
}
function onreleaseToBench(c:Coordinate) {
	if(!takenUnit)
		return
	player.hand.push(createBoardUnit(takenUnit.unit, c))
	updatePlayerTraits(player)
	takenUnit = undefined
}

function onreleaseToBoard(c:Coordinate) {
	if(takenUnit===undefined) {
		console.log("ERROR: transferCard() taken===undefined")
		return
	}

	player.board.push(createBoardUnit(takenUnit.unit, c))
	setBattleCoordinates(player)
	updatePlayerTraits(player)
	takenUnit = undefined
}

$effect(()=> {
	// track player, when it changes, reset state.
	player;
	takenUnit = undefined
})
</script>

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
