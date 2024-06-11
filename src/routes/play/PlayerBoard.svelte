<script lang="ts">
let { players, onfight, onmanage }:{
	players:Player[],
	onfight?:()=>void,
	onmanage?:(player:Player)=>void,
} = $props();
</script>
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
				<td>{p.board.units.length}</td>
				<td>
					{#if onmanage}
					<button onclick={() => onmanage(p)} class="btn btn-{p.color} me-2">
						Administrar
					</button>
					{/if}
				</td>
			</tr>
			{/each}
			<tr>
				<td colspan="3"></td>
				<td colspan="2">
					{#if onfight}
					<button disabled={!(players[0].board.units.length==3 && players[1].board.units.length==3)} 
						onclick={onfight} class="btn btn-secondary">
						Pelear
					</button>
					{/if}
				</td>
			</tr>
			</tbody>
			</table>
		</div>
	</div>

