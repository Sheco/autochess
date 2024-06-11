<script lang="ts">
import { Units } from "$lib/database";
import ShopContents from "./ShopContents.svelte";
import ManagePlayer from "./ManagePlayer.svelte";
    import { firstOpenSpace } from "$lib/combat";

let {player, oncontinue: oncontinue_parent, onroll: onroll_parent, onbuy: onbuy_parent}:{
	player:Player,
	oncontinue:()=>void,
	onroll:(player:Player)=>void,
	onbuy:(player:Player, unit:Unit, c:Coordinate)=>void,
} = $props()

let newDeck = Units
	.flatMap(unit => Array(5).fill(unit))
	.map((unit,index) => ({...unit, index}) as Unit)

let shuffle = (deck:Unit[]) => deck
	.map(unit => ({ unit, order: Math.random()*deck.length }))
	.sort((a, b) => b.order-a.order)
	.map(({unit}) => unit)

let deck = $state(shuffle(newDeck))
let cards:Unit[] = $state([])
let rolled = $state(false)
let onroll = () => {
	deck.push(...cards)
	cards = deck.splice(0,4)
	rolled = true
	onroll_parent(player)
}
let onbuy = (index:number) => {
	if(player.gold==0)
		return;
	let c = firstOpenSpace(player.bench)
	if(!c) {
		alert('La banca esta llena')
		return;
	}
	let [card] = cards.splice(index, 1)
	onbuy_parent(player, card, c)
}
let oncontinue = () => {
	deck.push(...cards)
	cards = []
	rolled = false
	oncontinue_parent()
}
</script>

{#snippet buttons()}
	{#if !rolled}
		<button class="btn btn-outline-primary" onclick={onroll}>Mostrar unidades</button>
	{/if}

	<button onclick={oncontinue} class="btn btn-outline-danger">Siguiente jugador</button>
{/snippet}
<ShopContents {player} {buttons} {cards} {onbuy} {rolled} />
<ManagePlayer {player} />

<p>
	<b>Instrucciones:</b><br>
	Ya empezó el juego, el primer jugador toma el control de este dispositivo y le puede dar click al botón "Mostrar Cartas".<br>
	A continuación, verá las cartas que le tocaron y tiene una cantidad de oro limitada para comprar algunas, para agregarlas a su mano. (Volvera a ver otras cartas más adelante)<br>
	En cualquier momento puedes ver que cartas tienes en la mano dandole click al botón "Ver mano".<br>
	Cuando ya no le interesé ninguna carta, le puede dar click en "Siguiente jugador" y le da el dispositivo al otro jugador, quien puede ver sus cartas y elegir si quiere comprar alguna.<br>
	Este proceso se puede repetir algunas veces, cuando se haya repetido suficientes veces, pasarán a la siguiente etapa.<br>
</p>
