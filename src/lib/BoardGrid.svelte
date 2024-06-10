<script lang="ts">
import TraitInfo from './TraitInfo.svelte';
    import type { Snippet } from 'svelte';

let { player, mirrored=false, unitCard, dropUnitCard, attacks }:{
	player:Player, 
	mirrored:boolean,
	unitCard: Snippet<[Player,BoardUnit]>,
	dropUnitCard?: Snippet<[Player,Coordinate]>,
	attacks?: Attack[]
} = $props()
let columns=6
let boardArray = $derived(boardToArray(player.board, mirrored))
function boardToArray(board:Board, mirrored:boolean=false) {
	let newboard = Array(columns*3).fill(undefined).map((_, i) => {
		let x = i%columns
		let y = Math.floor(i/columns)
		return board.find(boardUnit => {
			return (boardUnit.setCoord.x == x) && (boardUnit.setCoord.y == y)
		})
	})
	if(!mirrored) return newboard
	return [ ...newboard.slice(columns*2), ...newboard.slice(columns,columns*2), ...newboard.slice(0,columns)]
}

function indexToCoordinate(index:number) {
	let y= Math.floor(index/columns)
	let mirroredy = mirrored? 2-y: y
	let x = index%columns
	return { x, y: mirroredy } as Coordinate
}


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
				<div class="row gx-1">
					{#each boardArray as boardUnit, index (index)}
						<div class="col-{12/columns} mb-1">
							{#if boardUnit}
								{@render unitCard(player, boardUnit)}
							{:else if dropUnitCard}
								{@render dropUnitCard(player, indexToCoordinate(index))}
							{/if}
						</div>
					{/each}
				</div>
			</div>

		</div>
	</div>
</div>

