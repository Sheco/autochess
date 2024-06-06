<script lang="ts">
import { createBoardUnit, resetUnits, fightStatus, fight, createThrottledGenerator, animatedFight } from "$lib/combat";
import { UnitMap, updatePlayerTraits } from "$lib/database";
import BattleGround from "$lib/BattleGround.svelte";
import { onMount } from "svelte";

function loadPlayer(id:string) {
	let ls = JSON.parse(localStorage.getItem('player'+id)??"null")
	if(!ls) return 
	for(let bu of ls.board) {
		bu.unit = UnitMap[bu.unit.id] 
	}
	updatePlayerTraits(ls)
	return ls as Player
}

function savePlayer(player:Player) {
	let copy = Object.assign({}, player)
	copy.traits = []
	copy.board = copy.board.map(bu  => {
		bu.ui.damage = undefined
		bu.mods = {}
		return bu
	})
	localStorage.setItem(player.id, JSON.stringify(copy))
}

onMount(() => {
	player1 = loadPlayer("1")??player1
	player2 = loadPlayer("2")??player2
})

let player1:Player = $state({ 
	id: 'player1',
	name: 'Azul',
	hp: 3,
	mirrored: false,
	color: 'primary',
	finished: false,
	maxgold: 5,
	gold: 5,
	rolls: 2,
	traits: [],
	hand: [],
	board: [],
})
let player2:Player = $state({
	id: 'player2',
	name: 'Rojo',
	hp: 3,
	mirrored: true,
	color: 'danger',
	finished: false,
	maxgold: 5,
	gold: 5,
	rolls: 2,
	hand: [],
	traits: [],
	board: [ ]
})
let winner:Player|undefined = $state(undefined)
let speedValue:string = $state("1")
let speed:number = $derived(Number(speedValue))
let generator:ThrottledGenerator<Attack> = $state(createThrottledGenerator([], 0))

async function run() {
	attacks = []
	winner = undefined
	document.querySelector("#grid")?.scrollIntoView()
	generator.stop()
	generator = animatedFight(fight(player1, player2), speed)
	try {
		for await (let attack of generator.items) {
			attacks.push(attack)
		}
		let result = fightStatus(player1, player2)
		winner = result.winner
		if (result.winner == player1) stats.victories.player1++
		else if(result.winner == player2) stats.victories.player2++
		stats.combats++
	} catch (Exception) {
		return
	}
}
function resetCombat() {
	attacks = []
}

function resetAll() {
	generator.stop()
	resetCombat()
	resetStats()
}
function resetStats() {
	stats.combats = 0 
	stats.victories.player1 = 0 
	stats.victories.player2 = 0 
}


let attacks:Attack[] = $state([])
let stats = $state({
	combats: 0,
	victories: {
		player1: 0,
		player2: 0,
	}
})

let onRemoveUnit = (player:Player, c:Coordinate) => {
	generator.stop()
	player.board=player.board.filter(i => !(i.setCoord.x==c.x && i.setCoord.y==c.y))
	updatePlayerTraits(player)
	savePlayer($state.snapshot(player))
	resetUnits(player)
}
let onAddUnit = (player:Player, c:Coordinate, value:string) => {
	generator.stop()
	if(!value) {
		return;
	}
	player.board.push(createBoardUnit(UnitMap[value], c))
	updatePlayerTraits(player)
	savePlayer($state.snapshot(player))
	resetUnits(player)
}
</script>

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/">Regresar</a>
		<button onclick={resetAll} class="btn btn-secondary">Limpiar</button>
		<button onclick={run} class="btn btn-success">Pelear</button>
		<select class="form-control d-inline-block" style="width: 10rem" bind:value={speedValue}>
			<option value="0.5">Lento</option>
			<option value="1">Velocidad normal</option>
			<option value="1.5">Rápido</option>
			<option value="2">Rápidisimo</option>
		</select>
		{#if winner}
			<b class="text-{winner.color}">{winner.name}</b> ha ganado!
		{/if}
		{#if stats.combats>0}
			Combates: {stats.combats}
			Victorias de <span class="text-{player1.color}">{player1.name}</span>: {stats.victories.player1} 
				({Math.round(stats.victories.player1/stats.combats*100)}%)
			Victorias de <span class="text-{player2.color}">{player2.name}</span>: {stats.victories.player2} 
				({Math.round(stats.victories.player2/stats.combats*100)}%)
		{/if}
	</div>

	<div id="grid">
		<BattleGround player1={player1} player2={player2} {onAddUnit} {onRemoveUnit} editable={true} {attacks} />
	</div>
</div>
