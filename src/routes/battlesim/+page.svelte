<script lang="ts">
import { createBoardUnit, fightStatus, fight, createThrottledGenerator, animatedFight } from "$lib/combat";
import { UnitMap, Units, updatePlayerTraits } from "$lib/database";
import BattleGround from "$lib/BattleGround.svelte";
import { onMount } from "svelte";
    import Modal from "$lib/Modal.svelte";
    import UnitCard from "$lib/UnitCard.svelte";
    import DropUnitCard from "$lib/DropUnitCard.svelte";
    import EmptyUnitCard from "$lib/EmptyUnitCard.svelte";
    import BoardUnitCard from "$lib/BoardUnitCard.svelte";
    import PlayerBoard from "$lib/PlayerBoard.svelte";

function loadPlayer(id:string) {
	let ls = JSON.parse(localStorage.getItem('player'+id)??"null")
	if(!ls) return 
	for(let bu of ls.board.units) {
		bu.unit = UnitMap[bu.unit.id] 
	}
	updatePlayerTraits(ls)
	return ls as Player
}

function savePlayer(player:Player) {
	let copy = Object.assign({}, player)
	copy.traits = []
	copy.board.units = copy.board.units.map(bu  => {
		bu.ui.damage = undefined
		bu.mods = []
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
	bench: {
		units: [],
		rows: 1,
		columns: 6,
	},
	board: {
		units: [],
		rows: 1,
		columns: 6
	}
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
	traits: [],
	bench: {
		units: [],
		rows: 1,
		columns: 6,
	},
	board: {
		units: [],
		rows: 1,
		columns: 6
	}
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
	let unit = player.board.units.find(u => u.setCoord.x==c.x && u.setCoord.y==c.y)
	if(unit) hand = unit.unit
	player.board.units=player.board.units.filter(i => !(i.setCoord.x==c.x && i.setCoord.y==c.y))
	updatePlayerTraits(player)
	savePlayer($state.snapshot(player))
}
let onAddUnit = (player:Player, c:Coordinate) => {
	generator.stop()
	if(!hand) {
		return;
	}
	player.board.units.push(createBoardUnit(hand, c))
	updatePlayerTraits(player)
	savePlayer($state.snapshot(player))
}
let showUnitList = $state(false)
let hand:Unit|undefined = $state(undefined)
let createUnitDialog = () => {
	showUnitList = true
}
let oncreateunit = (unit:Unit) => {
	showUnitList = false
	hand = unit
}
let oncancelunit = () => {
	hand = undefined
}
</script>

{#if showUnitList}
<Modal title="Crear unidad" onclose={() => showUnitList = false}>
	<div class="row">
		{#each Units as unit}
			<div class="col-2" style="height: 200px;">
				<button><UnitCard unit={createBoardUnit(unit, {x: 0, y: 0})} onclick={() => oncreateunit(unit)}/></button>
			</div>
		{/each}
	</div>
</Modal>
{/if}

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/"><i class="bi bi-house-fill"></i> Regresar</a>
		<button onclick={resetAll} class="btn btn-secondary"><i class="bi bi-pause-fill"></i> Pausa</button>
		<button onclick={run} class="btn btn-success"><i class="bi bi-file-play-fill"></i> Pelear</button>
		{#if !hand}
			<button onclick={createUnitDialog} class="btn btn-secondary"><i class="bi bi-box-arrow-up"></i> Tomar únidad</button>
		{:else}
			<button onclick={oncancelunit} class="btn btn-warning"><i class="bi bi-x-circle-fill"></i> Soltar {hand.name}</button>
		{/if}
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
		{#snippet player2dropUnitCard(c:Coordinate)}
		{#if hand}
			<DropUnitCard unit={hand} onclick={() => onAddUnit(player2, c)}/>
		{:else}
			<EmptyUnitCard />
		{/if}
		{/snippet}

		{#snippet player2unitCard(boardUnit:BoardUnit)}
			<BoardUnitCard unit={boardUnit} onclick={() => onRemoveUnit(player2, boardUnit.setCoord)} />
		{/snippet}
		<PlayerBoard player={player2} mirrored={true} unitCard={player2unitCard} dropUnitCard={player2dropUnitCard} {attacks} />

		{#snippet player1dropUnitCard(c:Coordinate)}
		{#if hand}
			<DropUnitCard unit={hand} onclick={() => onAddUnit(player1, c)}/>
		{:else}
			<EmptyUnitCard />
		{/if}
		{/snippet}

		{#snippet player1unitCard(boardUnit:BoardUnit)}
			<BoardUnitCard unit={boardUnit} onclick={() => onRemoveUnit(player1, boardUnit.setCoord)} />
		{/snippet}
		<PlayerBoard player={player1} mirrored={false} unitCard={player1unitCard} dropUnitCard={player1dropUnitCard} {attacks} />
	</div>
</div>
