<script lang="ts">
import { updatePlayer } from '$lib/state';
import { Units } from '$lib/database'
import UnitCard from '$lib/UnitCard.svelte';
    import TraitInfo from '../play/TraitInfo.svelte';

let { player, mirrored=false, onAddUnit, onRemoveUnit }:{
	player:Player, 
	mirrored:boolean,
	onAddUnit: (player:Player, c:Coordinate, value:string)=>void,
	onRemoveUnit: (player:Player, c:Coordinate)=>void
} = $props()
let boardArray = $derived(boardToArray(player.board, mirrored))

function boardToArray(board:Board, mirrored:boolean=false) {
	let newboard = Array(9).fill(undefined).map((_, i) => {
		let x = i%3
		let y = Math.floor(i/3)
		return board.find(boardUnit => {
			return (boardUnit.setx == x) && (boardUnit.sety == y)
		})
	})
	if(!mirrored) return newboard
	return [ ...newboard.slice(6), ...newboard.slice(3,6), ...newboard.slice(0,3)]
}

function add(index:number) {
	return (ev:Event) => {
		if(!ev.target)
			return
		let select = ev.target as HTMLSelectElement
		let y = Math.floor(index/3)
		let mirroredy = mirrored? 2-y: y
		let x = index%3
		let c:Coordinate = { x, y: mirroredy }
		onRemoveUnit(player, c)
		onAddUnit(player, c, select.value)
		updatePlayer(player)
	}
}


let isAlive = $derived(player.board.filter(boardUnit => boardUnit.hp>0).length>0)
let status = $derived(isAlive? "bg-"+player.color: "bg-secondary")
let units = [...Units].sort((a, b) => a.name.localeCompare(b.name));

</script>
<div class="card mb-1 border-{player.color} border-2"  >
	<div class="card-body p-1">
		<div class="row">
			<div class="col-6">
				<div class="row gx-1">
					{#each boardArray as boardUnit, index (index)}
						<div class="col-4 mb-1">
							{#if boardUnit}
								<UnitCard unit={boardUnit.unit} {boardUnit} onclick={() => onRemoveUnit(player, {x: boardUnit.setx, y: boardUnit.sety})} board={player.board} />
							{:else}
								<div class="card h-100">
									<div class="card-header p-0 ps-2">Espacio vacio
									</div>
									<div class="card-body p-1">
										<select onchange={add(index)} value="" class="mw-100 form-control">
											<option value="">-</option>
											{#each units as unit}
												<option value="{unit.id}">{unit.name}</option>
											{/each}
										</select>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="col-3">
				<div class="bg-{status} text-white">
					<!-- 
					we're not doing any validation, if the user enters HTML code here, it'll be used in the logs
					no big deal :)
					-->
					<input type="text" bind:value={player.name} />
					<span class="badge bg-danger position-absolute top-0 end-0 border">{player.board.reduce((total, v) => total+v.hp, 0)}</span><br>
				</div>

				{#each player.traits as trait}
						<TraitInfo {trait} /><br>
				{/each}
			</div>
		</div>
	</div>
</div>

