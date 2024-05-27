<script lang="ts">
import { animatedFight, createBoardUnit, resetUnits, fightStatus, abortFight, fight } from "$lib/combat";
import { getPlayers, updatePlayer } from "$lib/state";
import { UnitMap, updatePlayerTraits } from "$lib/database";
import DiceRoll from "$lib/DiceRoll.svelte";
import BattleGround from "$lib/BattleGround.svelte";

let [ _player1, _player2 ] = getPlayers()
let home:Player = $state(_player1)
let visitor:Player = $state(_player2)
let winner:Player|undefined = $state(undefined)
let wait:string = $state("1000")

async function run() {
	attackRolls = []
	winner = undefined
	document.querySelector("#grid")?.scrollIntoView()
	let attacks = animatedFight(fight(home, visitor), Number(wait))
	for await (let attack of attacks) {
		attackRolls.push(attack)
	}
	let result = fightStatus(home, visitor)

	if(!result.winner) 
		winner = undefined
	else {
		winner = result.winner
		if (result.winner == home) stats.victories.home++
		else if(result.winner == visitor) stats.victories.visitor++
	}
	stats.combats++
	home = home
	visitor = visitor
}
function resetCombat() {
	home = home
	visitor = visitor
	attackRolls = []
}

function resetAll() {
	abortFight()
	resetCombat()
	resetStats()
}
function resetStats() {
	stats.combats = 0 
	stats.victories.home = 0 
	stats.victories.visitor = 0 
}


let attackRolls:AttackRoll[] = $state([])
let stats = $state({
	combats: 0,
	victories: {
		home: 0,
		visitor: 0,
	}
})

let onRemoveUnit = (player:Player, c:Coordinate) => {
	abortFight()
	player.board=player.board.filter(i => !(i.setCoord.x==c.x && i.setCoord.y==c.y))
	updatePlayerTraits(player)
	updatePlayer($state.snapshot(player))
	resetUnits(player)
}
let onAddUnit = (player:Player, c:Coordinate, value:string) => {
	abortFight()
	if(!value) {
		return;
	}
	player.board.push(createBoardUnit(UnitMap[value], c))
	updatePlayerTraits(player)
	updatePlayer($state.snapshot(player))
	resetUnits(player)
}
</script>

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/">Regresar</a>
		<button onclick={resetAll} class="btn btn-secondary">Limpiar</button>
		<button onclick={run} class="btn btn-success">Pelear</button>
		<select class="form-control d-inline-block" style="width: 10rem" bind:value={wait}>
			<option value="2000">Lento</option>
			<option value="1000">Velocidad normal</option>
			<option value="500">Rápido</option>
			<option value="200">Rápidisimo</option>
		</select>
		{#if winner}
			<b class="text-{winner.color}">{winner.name}</b> ha ganado!
		{/if}
		{#if stats.combats>0}
			Combates: {stats.combats}
			Victorias de <span class="text-{home.color}">{home.name}</span>: {stats.victories.home} 
				({Math.round(stats.victories.home/stats.combats*100)}%)
			Victorias de <span class="text-{visitor.color}">{visitor.name}</span>: {stats.victories.visitor} 
				({Math.round(stats.victories.visitor/stats.combats*100)}%)
		{/if}
	</div>

	<div id="grid">
		<BattleGround player1={home} player2={visitor} {onAddUnit} {onRemoveUnit} editable={true} {attackRolls} />
	</div>
</div>
