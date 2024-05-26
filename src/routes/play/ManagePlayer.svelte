<script lang="ts">
import type { Snippet } from "svelte";
import ManagePlayerBench from "./ManagePlayerBench.svelte";
import ManagePlayerBoard from "./ManagePlayerBoard.svelte";
import UnitCard from "$lib/UnitCard.svelte";
import { fade } from "svelte/transition";
import { createBoardUnit } from "$lib/combat";
    import { updatePlayerTraits } from "$lib/database";

let { player, actions }: {player:Player, actions?:Snippet|undefined} = $props();
let takenUnit:Unit|undefined = $state(undefined)
function ontakeFromBench(index:number) {
	if (takenUnit) {
		onreleaseToBench()
	}
	[takenUnit] = player.hand.splice(index, 1)
}
function ontakeFromBoard(c:Coordinate) {
	if (takenUnit) {
		onreleaseToBoard(c)
	}
	let index=player.board.findIndex(bu => c.x==bu.setCoord.x && c.y==bu.setCoord.y)
	takenUnit = player.board[index].unit
	player.board.splice(index, 1)
	updatePlayerTraits(player)
}
function onreleaseToBench() {
	if(!takenUnit)
		return
	player.hand.push(takenUnit)
	updatePlayerTraits(player)
	takenUnit = undefined
}

function onreleaseToBoard(c:Coordinate) {
	if(takenUnit===undefined) {
		console.log("ERROR: transferCard() taken===undefined")
		return
	}
	player.board.push(createBoardUnit(takenUnit, c))
	updatePlayerTraits(player)
	takenUnit = undefined
}

$effect(()=> {
	// track player, when it changes, reset state.
	player;
	takenUnit = undefined
})
</script>

<ManagePlayerBench {player} onclick={ontakeFromBench} onrelease={onreleaseToBench} {actions} {takenUnit} />
<ManagePlayerBoard {player} onclick={ontakeFromBoard} onrelease={onreleaseToBoard} {takenUnit} />
{#if takenUnit}
	<div class="position-fixed top-0 end-0" in:fade out:fade style="width: 210px">
		<UnitCard unit={takenUnit} onclick={onreleaseToBench} />
	</div>
{/if}
