<script lang="ts">
    import type { Snippet } from "svelte";
    import PlayerBoard from "./PlayerBoard.svelte";

let { player1, player2, unitCard, dropUnitCard, attacks}:
	{
		player1:Player,
		player2:Player,
		unitCard: Snippet<[BoardUnit]>,
		dropUnitCard?: Snippet<[Coordinate]>,
		attacks:Attack[]
	} = $props()
		
</script>
<PlayerBoard player={player2} mirrored={true} {unitCard} {dropUnitCard} {attacks} />
<PlayerBoard player={player1} mirrored={false} {unitCard} {dropUnitCard} {attacks} />
