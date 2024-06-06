<script lang="ts">
    import BattleGround from "$lib/BattleGround.svelte";
    import DropUnitCard from "$lib/DropUnitCard.svelte";
    import EmptyUnitCard from "$lib/EmptyUnitCard.svelte";
    import UnitCard from "$lib/UnitCard.svelte";
import { fight, createThrottledGenerator, fightStatus, animatedFight } from "$lib/combat";

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

let attacks:Attack[]=$state([])
let winner:Player|undefined=$state(undefined)
let player1:Player|undefined=$state(undefined)
let player2:Player|undefined=$state(undefined)
let next:Player[] = $state([])
let generator:ThrottledGenerator<Attack> = $state(createThrottledGenerator([], 0))

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

	generator = animatedFight(fight(player1, player2), 1)
	try {
		for await (let attack of generator.items) {
			attacks.push(attack)
		}

		let result = fightStatus(player1, player2)
		winner = result.winner
		if(result.loser && result.winner) {
			let unitsAlive = result.winner.board.filter(u => u.hp>0).length
			ondamage(result.loser, unitsAlive)
		}
	} catch(Exception) {
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
	{#snippet unitCard(player:Player, boardUnit:BoardUnit)}
		<UnitCard unit={boardUnit.unit} {boardUnit} onclick={() => {}} />
	{/snippet}
	{#snippet dropUnitCard(player:Player, c:Coordinate)}
		<EmptyUnitCard />
	{/snippet}
	
	<BattleGround {player1} {player2} {unitCard} {dropUnitCard} {attacks} />
{/if}

