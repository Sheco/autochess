<script lang="ts">
    import type { Snippet } from "svelte";

let { board, mirrored=false, unitCard, dropUnitCard, columns=6, rows=3 }:{
	board:Board,
	mirrored:boolean,
	unitCard: Snippet<[BoardUnit]>,
	dropUnitCard?: Snippet<[Coordinate]>,
	columns?:number,
	rows?:number,
	attacks?: Attack[]
} = $props()
let boardArray = $derived(boardToArray(board, mirrored))
function boardToArray(board:Board, mirrored:boolean=false) {
	let newboard = Array(columns*rows).fill(undefined).map((_, i) => {
		let x = i%columns
		let y = Math.floor(i/columns)
		return board.units.find(boardUnit => {
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
</script>

<div class="row gx-1">
	{#each boardArray as boardUnit, index (index)}
		<div class="col-{12/columns} mb-1">
			{#if boardUnit}
				{@render unitCard(boardUnit)}
			{:else if dropUnitCard}
				{@render dropUnitCard(indexToCoordinate(index))}
			{/if}
		</div>
	{/each}
</div>
