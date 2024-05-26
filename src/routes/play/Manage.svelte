<script lang="ts">
import Combat from './Combat.svelte';
import ManagePlayer from './ManagePlayer.svelte';

let {players,ondamage,onendcombat}:{
	players:Player[],
	ondamage:(player:Player, amount:number)=>void,
	onendcombat:()=>void,
} = $props()
let player:Player|undefined = $state(undefined)
let view = $state("main")

let doFight = () => {
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
	<div class="row">
		<div class="col-3">
			<table class="table table-bordered">
			<tbody>
			<tr>
				<td>Nombre</td>
				<td>HP</td>
				<td title="Unidades en el tablero">Unidades</td>
				<td>Acciones</td>
			</tr>
			{#each players as p}
			<tr>
				<td>{p.name}</td>
				<td>{p.hp}</td>
				<td>{p.board.length}</td>
				<td>
					<button onclick={() => onmanage(p)} class="btn btn-{p.color} me-2">
						Administrar
					</button>
				</td>
			</tr>
			{/each}
			<tr>
				<td colspan="3"></td>
				<td colspan="2">
					<button disabled={!(players[0].board.length==3 && players[1].board.length==3)} 
						onclick={() => doFight()} class="btn btn-secondary">
						Pelear
					</button>
				</td>
			</tr>
			</tbody>
			</table>
		</div>
	</div>
{:else if view == "manage" && player}
	{#snippet actions()}
		<button class="btn btn-secondary" onclick={onclose}>
			Cerrar
		</button>
	{/snippet}
	<ManagePlayer {player} {actions} />
{:else if view == "combat"}
	<Combat {players} {ondamage} {onendcombat} />
{/if}
