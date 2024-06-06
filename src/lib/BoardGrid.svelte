<script lang="ts">
import TraitInfo from './TraitInfo.svelte';
    import DiceRoll from './DiceRoll.svelte';
    import type { Snippet } from 'svelte';

let { player, mirrored=false, unitCard, dropUnitCard, attacks }:{
	player:Player, 
	mirrored:boolean,
	unitCard: Snippet<[Player,BoardUnit]>,
	dropUnitCard?: Snippet<[Player,Coordinate]>,
	attacks?: Attack[]
} = $props()
let boardArray = $derived(boardToArray(player.board, mirrored))

function boardToArray(board:Board, mirrored:boolean=false) {
	let newboard = Array(9).fill(undefined).map((_, i) => {
		let x = i%3
		let y = Math.floor(i/3)
		return board.find(boardUnit => {
			return (boardUnit.setCoord.x == x) && (boardUnit.setCoord.y == y)
		})
	})
	if(!mirrored) return newboard
	return [ ...newboard.slice(6), ...newboard.slice(3,6), ...newboard.slice(0,3)]
}

function indexToCoordinate(index:number) {
	let y = Math.floor(index/3)
	let mirroredy = mirrored? 2-y: y
	let x = index%3
	return { x, y: mirroredy } as Coordinate
}


let isAlive = $derived(player.board.filter(boardUnit => boardUnit.hp>0).length>0)
let status = $derived(isAlive? "bg-"+player.color: "bg-secondary")

</script>
<div class="card mb-1 border-{player.color} border-2">
	<div class="card-body p-1">
		<div class="row">
			<div class="col-6">
				<div class="row gx-1">
					{#each boardArray as boardUnit, index (index)}
						<div class="col-4 mb-1">
							{#if boardUnit}
								{@render unitCard(player, boardUnit)}
							{:else if dropUnitCard}
								{@render dropUnitCard(player, indexToCoordinate(index))}
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="col-6">
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

				{#if attacks}
					<div>
					{#each attacks.filter(a => a.attackingPlayer.name==player.name) as attack}
					{#each attack.attacks.filter(r => r.roll.damage>0) as a}
						<span class="text-{attack.attackingPlayer.color}">{attack.attacker.unit.name}</span> ataca a 
						<span class="text-{a.defendingPlayer.color}">{a.defender.unit.name}</span> y hace <b>{a.roll.damage}</b> de daño. (
							<DiceRoll dice={a.roll.
							dice} />
						)<br>
					{/each}
					{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

