<script lang="ts">
    import BoardGrid from './BoardGrid.svelte';
import TraitInfo from './TraitInfo.svelte';
    import type { Snippet } from 'svelte';

let { player, mirrored=false, unitCard, dropUnitCard, columns=6, rows=3, attacks }:{
	player:Player, 
	mirrored:boolean,
	unitCard: Snippet<[BoardUnit]>,
	dropUnitCard?: Snippet<[Coordinate]>,
	columns?:number,
	rows?:number,
	attacks?: Attack[]
} = $props()


let isAlive = $derived(player.board.filter(boardUnit => boardUnit.hp>0).length>0)
let status = $derived(isAlive? "bg-"+player.color: "bg-secondary")

</script>
<div class="card mb-1 border-{player.color} border-2">
	<div class="card-body p-1">
		<div class="row">
			<div class="col-4">
				<div class="bg-{status} text-white">
					<!-- 
					we're not doing any validation, if the user enters HTML code here, it'll be used in the logs
					no big deal :)
					-->
					<input type="text" bind:value={player.name} />
					<span class="badge bg-danger ">{player.board.reduce((total, v) => total+v.hp, 0)}</span><br>
				</div>

				{#each player.traits as trait}
						<TraitInfo {trait} /><br>
				{/each}
			</div>
			<div class="col-8">
				<BoardGrid board={player.board} {mirrored} {unitCard} {dropUnitCard} {columns} {rows} />
			</div>

		</div>
	</div>
</div>

