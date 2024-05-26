<script lang="ts">
    import BattleGround from "$lib/BattleGround.svelte";
import DiceRoll from "$lib/DiceRoll.svelte";
import { fight, animatedFight, fightStatus } from "$lib/combat";

let { players, onendcombat, ondamage }:{
	players:Player[],
	ondamage: (player:Player, amount:number)=>void,
	onendcombat: ()=>void,
} = $props()

let shuffledPairs = () => {
	let shuffled = players
		.filter(p => p.hp>0)
		.map(i => ({ order: Math.random(), value: i}))
		.sort((a, b)=>a.order-b.order)
		.map(({value}) => value)
	return shuffled.reduce((result, _, index, array) => { 
		if(index%2==0) 
			result.push(array.slice(index, index+2)); 
		return result
	}, [] as Player[][] )
}
let pairs = shuffledPairs()

let attackRolls:AttackRoll[]=$state([])
let winner:Player|undefined=$state(undefined)
let player1:Player|undefined=$state(undefined)
let player2:Player|undefined=$state(undefined)
let next:Player[] = $state([])

$effect(() => {
	next = pairs.shift()??[]
})
let active = $state(false)
let nextFight = async () => {
	[ player1, player2 ] = next
	if(!player1 || !player2) {
		onendcombat()
		return
	}
	winner = undefined
	active = true

	let asyncattacks = animatedFight(fight(player1, player2))
	for await (let attack of asyncattacks)
		attackRolls.push(attack)

	let result = fightStatus(player1, player2)
	winner = result.winner
	if(result.loser && result.winner) {
		let unitsAlive = result.winner.board.filter(u => u.hp>0).length
		ondamage(result.loser, unitsAlive)
	}
	next = pairs.shift()??[]
	active = false
}
</script>
{#if !active}
	{@const next1 = next[0]}
	{@const next2 = next[1]}
	{#if next1 && next2}
		La siguiente pelea es entre <span class="fw-bold text-{next1.color}">{next1.name}</span> 
		y <span class="fw-bold text-{next2.color}">{next2.name}</span>
		<button class="btn btn-sm btn-success" onclick={nextFight}>Iniciar combate</button>
	{:else}
		Las etapa de pelea ha terminado.
		<button class="btn btn-sm btn-info" onclick={onendcombat}>Regresar</button>
	{/if}
{/if}
{#if player1 && player2}
	{#if winner}
	Ganador: <span class="fw-bold text-{winner.color}">{winner.name}</span>
	{/if}
	<BattleGround {player1} {player2} editable={false} {attackRolls} />
	<div>
	{#each attackRolls as attack}
		<span class="text-{attack.attackingPlayer.color}">{attack.attacker.unit.name}</span> ataca a 
		<span class="text-{attack.defendingPlayer.color}">{attack.defender.unit.name}</span> y hace <b>{attack.damage}</b> de daño. (
			<DiceRoll dice={attack.dice} />
		)<br>
	{/each}
	</div>
{/if}

