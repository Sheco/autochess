<script lang="ts">
import { goto } from "$app/navigation";
    import { createBoardUnit } from "$lib/combat";
import Manage from "./Manage.svelte";
    import PlayerBoard from "./PlayerBoard.svelte";
import PlayerSetup from "./PlayerSetup.svelte";
import Shop from "./Shop.svelte";

let players:Player[] = $state([])
let livingPlayers = $derived(players.filter(player => player.hp>0))

let mode= $state("selectplayer")
let currentPlayerIndex:number|undefined = $state(undefined)
let currentPlayer:Player|undefined = $derived(currentPlayerIndex==undefined? 
		undefined: 
		livingPlayers[currentPlayerIndex])

let resetPlayer = (player:Player) => {
	player.finished = false
	player.hp = 3
	player.rolls = 2
	player.gold = 10
	player.bench = {
		units: [],
		rows: 1,
		columns: 6
	}
	player.board = {
		units: [],
		rows: 3,
		columns: 6
	}
}
let onrestart = () => {
	for(let player of players) {
		resetPlayer(player)
	}
		
	mode = "selectplayer"	
	currentPlayerIndex = undefined
	goto("/play")
		
}

let onstart = (player:Player) => {
	let index = players.findIndex(p => p.id==player.id)
	players = [...players.slice(index), ...players.slice(0, index)]
	currentPlayerIndex = 0
	mode = "shop"
}

let onroll = (player:Player) => {
	player.rolls--
	player.gold -= 2
}
let onbuy = (player:Player, unit:Unit, c:Coordinate) => {
	player.gold--
	let boardUnit = createBoardUnit(unit, c)
	player.bench.units.push(boardUnit)
}
let oncontinue = () => {
		//FIXME esto no funciona bien cuando el primer jugador ya esta muerto
		if(currentPlayerIndex===livingPlayers.length-1 || currentPlayerIndex===undefined)
			currentPlayerIndex=0
		else
			currentPlayerIndex++
		if(currentPlayer===undefined) {
			console.log('oncontinue: currentPlayer==undefined, index:', currentPlayerIndex, 'livingplayers', livingPlayers)
			return
		}

		if(currentPlayer.rolls==0) {
			mode="manage"
			return
		}
}
let colors = [ "none", "primary", "danger", "warning", "info", "success", "secondary", "dark", "$indigo-200" ]
let onnewplayer = () => {
	let id = players.length+1
	players.push({
			id: 'player'+id,
			name: 'Player'+id,
			hp: 3,
			mirrored: false,
			color: colors[id],
			finished: false,
			maxgold: 5,
			gold: 10,
			rolls: 2,
			traits: [],
			bench: {
				rows: 1,
				columns: 6,
				units: [],
			},
			board: {
				rows: 3,
				columns: 6,
				units: []
			}
	})
}
onnewplayer()
onnewplayer()
let onremoveplayer = (player:Player) => {
	players = players.filter(p => player.id!=p.id)
}
let ondamage = (player:Player, amount:number) => {
	player.hp-=amount
}
let onendcombat = () => {
	if (players.filter(player => player.hp>0).length==1) {
		mode="victory"
		return
	}
	mode="shop"
	currentPlayerIndex = players.findIndex(player => player.hp>0)
	for(let player of players) {
		if(player.hp<=0) continue
		player.rolls=1
		player.gold+=4
	}
}
</script>

<div class="container mt-2">
	<a href="/" class="btn btn-primary">Regresar</a>
	<button onclick={onrestart} class="btn btn-secondary">Reiniciar</button>
	{#if mode=="selectplayer"}
		<PlayerSetup {players} onselect={onstart} {onnewplayer} {onremoveplayer} />
	{:else if currentPlayer && mode=="shop"}
		<Shop player={currentPlayer} {oncontinue} {onroll} {onbuy} />
	{:else if mode=="manage"}
		<Manage {players} {ondamage} {onendcombat} />
	{:else if mode=="victory"}
		{@const winner = livingPlayers[0]}
		<div>
			El ganador del torneo es <span class="fw-bold text-{winner.color}">{winner.name}</span>!
		</div>
		<PlayerBoard {players} />
	{/if}
</div>
