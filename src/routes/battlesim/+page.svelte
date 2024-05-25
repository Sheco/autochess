<script lang="ts">
import { initBattle, fight, createBoardUnit, resetUnits } from "$lib/combat";
import { getPlayers, updatePlayer } from "$lib/state";
import { UnitMap, updatePlayerTraits } from "$lib/database";
import BoardGrid from "./BoardGrid.svelte";
    import DiceRoll from "$lib/DiceRoll.svelte";

let [ _player1, _player2 ] = getPlayers()
let home = $state(_player1)
let visitor = $state(_player2)
$effect(() => {
	initBattle(home, visitor)
})

let winner = $state("Nadie")
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


async function ondamage(attack:AttackRoll[]) {
	let sleep = async () => new Promise((resolve) => setTimeout(resolve, 1000))
	attack.attacker.highlight = "success"
	attack.defender.highlight = "danger"
	attack.defender.damage = attack
	await sleep()
	attack.attacker.highlight = undefined
	attack.defender.highlight = undefined
	attack.defender.damage = undefined
}

async function run() {
	log = []
	let result = await fight(home, visitor, ondamage)
	if(!result.winner) 
		winner = "Nadie"
	else {
		winner = `<b class="text-${result.winner.color}">${result.winner.name}</b>`
		if (result.winner == home) stats.victories.home++
		else if(result.winner == visitor) stats.victories.visitor++
	}
	stats.combats++
	log = result.attacks
	home = home
	visitor = visitor
}
function resetCombat() {
	initBattle(home, visitor)
	home = home
	visitor = visitor
	log = []
}

function resetAll() {
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
	player.board=player.board.filter(i => !(i.setx==c.x && i.sety==c.y))
	updatePlayerTraits(player)
	updatePlayer(player)
	resetUnits(player)
}
let onAddUnit = (player:Player, c:Coordinate, value:string) => {
	if(!value) {
		return;
	}
	player.board.push(createBoardUnit(UnitMap[value], c))
	updatePlayerTraits(player)
	updatePlayer(player)
	resetUnits(player)
}
</script>

<div class="container mt-2">
	<div class="mb-2">
		<a class="btn btn-primary" href="/">Regresar</a>
		<button onclick={resetAll} class="btn btn-secondary">Limpiar</button>
		<button onclick={run} class="btn btn-success">Pelear</button>
		<button onclick={run100} class="btn btn-warning">Pelear x100</button>
		{@html winner} ganó!
		{#if stats.combats>0}
			Combates: {stats.combats}
			Victorias de <span class="text-{home.color}">{home.name}</span>: {stats.victories.home} 
				({Math.round(stats.victories.home/stats.combats*100)}%)
			Victorias de <span class="text-{visitor.color}">{visitor.name}</span>: {stats.victories.visitor} 
				({Math.round(stats.victories.visitor/stats.combats*100)}%)
		{/if}
	</div>

	<div>
	</div>
			<BoardGrid player={visitor} mirrored={true} {onAddUnit} {onRemoveUnit} />
			<BoardGrid player={home} mirrored={false} {onAddUnit} {onRemoveUnit}  />
		<br>
		{#each log as attack}
			<span class="text-{attack.attackingPlayer.color}">{attack.attacker.unit.name}</span> ataca a 
			<span class="text-{attack.defendingPlayer.color}">{attack.defender.unit.name}</span> y hace <b>{attack.damage}</b> de daño. (
				<DiceRoll dice={attack.dice} />
			)<br>
		{/each}
</div>
