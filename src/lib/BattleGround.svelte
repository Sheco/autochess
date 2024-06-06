<script lang="ts">
    import type { Snippet } from "svelte";
    import BoardGrid from "./BoardGrid.svelte";

let { player1, player2, unitCard, dropUnitCard, attacks}:
	{
		player1:Player,
		player2:Player,
		unitCard: Snippet<[Player,BoardUnit]>,
		dropUnitCard?: Snippet<[Player,Coordinate]>,
		attacks:Attack[]
	} = $props()
		
</script>
<BoardGrid player={player2} mirrored={true} {unitCard} {dropUnitCard} {attacks} />
<BoardGrid player={player1} mirrored={false} {unitCard} {dropUnitCard} {attacks} />
