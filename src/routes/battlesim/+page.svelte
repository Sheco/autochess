<script lang="ts">
import { fight, createBoardUnit, resetUnits, fightStatus } from "$lib/combat";
import { getPlayers, updatePlayer } from "$lib/state";
import { UnitMap, updatePlayerTraits } from "$lib/database";
import DiceRoll from "$lib/DiceRoll.svelte";
import BattleGround from "$lib/BattleGround.svelte";

let [ _player1, _player2 ] = getPlayers()
let home = $state(_player1)
let visitor = $state(_player2)
let winner = $state("")
function run100() {
	resetStats()
	for(let i=0; i<100; i++) {
		run()
	}
	if (stats.victories.home>stats.victories.visitor) {
		winner = `<b class="text-${home.color}">${home.name}</b>`
	} else if (stats.victories.home<stats.victories.visitor) {
		winner = `<b class="text-${visitor.color}">${visitor.name}</b>`
	} else {
		winner = "Nadie"
	}
}


let abortController:AbortController
async function ondamage(attack:AttackRoll) {
	let sleep = async () => new Promise((resolve, reject) => {
		let timeout = setTimeout(resolve, 1000)
		let abort = () => { 
			clearTimeout(timeout)
			reject('abort')
		}
		abortController.signal.addEventListener('abort', abort)
	})
	attack.attacker.highlight = "success"
	attack.defender.highlight = "danger"
	attack.defender.damage = attack
	log.push(attack)
	await sleep()
	attack.attacker.highlight = undefined
	attack.defender.highlight = undefined
	attack.defender.damage = undefined
}

async function run() {
	log = []
	winner = ""
	if(abortController) abortController.abort()
	abortController = new AbortController()
	document.querySelector("#grid")?.scrollIntoView()
	for(let attack of fight(home, visitor)) {
		try {
			await ondamage(attack)
		} catch(err) {
			break
		}
	}
	let result = fightStatus(home, visitor)
	if(!result.winner) 
		winner = "Nadie"
	else {
		winner = `<b class="text-${result.winner.color}">${result.winner.name}</b>`
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
	log = []
}

function resetAll() {
	if(abortController) abortController.abort()
	resetCombat()
	resetStats()
}
function resetStats() {
	stats.combats = 0 
	stats.victories.home = 0 
	stats.victories.visitor = 0 
}


let log:AttackRoll[] = $state([])
let stats = $state({
	combats: 0,
	victories: {
		home: 0,
		visitor: 0,
	}
})

let onRemoveUnit = (player:Player, c:Coordinate) => {
	if(abortController) {
		abortController.abort()
	}
	player.board=player.board.filter(i => !(i.setCoord.x==c.x && i.setCoord.y==c.y))
	updatePlayerTraits(player)
	updatePlayer($state.snapshot(player))
	resetUnits(player)
}
let onAddUnit = (player:Player, c:Coordinate, value:string) => {
	if(abortController) {
		abortController.abort()
	}
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
		<button onclick={run100} class="btn btn-warning">Pelear x100</button>
		{#if winner}
		{@html winner} ganó!
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
		<BattleGround player1={home} player2={visitor} {onAddUnit} {onRemoveUnit} editable={true} />
	</div>

	<br>
	{#each log as attack}
		<span class="text-{attack.attackingPlayer.color}">{attack.attacker.unit.name}</span> ataca a 
		<span class="text-{attack.defendingPlayer.color}">{attack.defender.unit.name}</span> y hace <b>{attack.damage}</b> de daño. (
			<DiceRoll dice={attack.dice} />
		)<br>
	{/each}
</div>
