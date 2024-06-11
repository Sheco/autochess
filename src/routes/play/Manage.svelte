<script lang="ts">
import Combat from './Combat.svelte';
import ManagePlayer from './ManagePlayer.svelte';
    import PlayerBoard from './PlayerBoard.svelte';

let {players,ondamage,onendcombat}:{
	players:Player[],
	ondamage:(player:Player, amount:number)=>void,
	onendcombat:()=>void,
} = $props()
let player:Player|undefined = $state(undefined)
let view = $state("main")

let onfight = () => {
	player = undefined
	view = "combat"
}
let onclose = () => {
	player = undefined
	view = "main"
}

let onmanage = (p:Player) => {
	player = p
	view = "manage"
}
</script>

<h5>Etapa de administración de tablero y de batalla.</h5>

{#if view == "main"}
	<PlayerBoard {players} {onmanage} {onfight} />
{:else if view == "manage" && player}
	<ManagePlayer {player} {onclose} />
{:else if view == "combat"}
	<Combat {players} {ondamage} {onendcombat} />
{/if}

