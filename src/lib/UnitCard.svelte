<script lang="ts">
import type { Snippet } from "svelte";
import Modal from "./Modal.svelte";
import TraitIcon from "./TraitIcon.svelte";
import UnitInfo from "./UnitInfo.svelte";
import Emoji from "./Emoji.svelte";

let { unit, actions = undefined, onclick }:{
	unit:Unit|BoardUnit, 
	onclick:()=>void,
	actions?:Snippet|undefined
} = $props()
let showModal = $state(false)
let highlight = $derived('highlight' in unit? unit.highlight: '')
</script>

{#snippet card()}
	<div class="card">
		<div class="card-header">{unit.name}</div>
		<div class="card-body">
			<UnitInfo {unit} />
		</div>
	</div>
{/snippet}
{#if showModal}
	<Modal onclose={()=>showModal=false} body={card} />
{/if}
<div class="card w-100" class:border={highlight} class:border-danger={highlight=="danger"} class:border-success={highlight=="success"} class:border-3={highlight}>
	<div class="card-header p-1">
		<button onclick={() => showModal=true} class="btn btn-sm btn-info p-0"><span class="bi bi-info-circle"></span></button>
		{unit.name}
			{#if 'mods' in unit}
			{@const maxhp = unit.maxhp+(unit.mods.maxhp??0) }
			{@const percent = Math.floor(unit.hp/maxhp*100) }
			<div class="progress">
				<div class="progress-bar bg-danger" role="progressbar" style="width: {percent}%" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"></div>
			</div>
			{/if}
	</div>
	<div class="card-body p-0" style="height: 100px">

		<button {onclick} class="unit p-0 position-relative">
			<img src="/units/{unit.id}.png" width="100%" class="{unit.id}" alt={unit.name} />
			<div class="overlay position-absolute bottom-0 pb-0 ps-0">
				{#each unit.traits.filter(t => t.name) as trait}
					<div class="trait mb-0 pe-3 ps-1 text-start" style="font-size: 80%">
						<TraitIcon {trait} /> {trait.name}<br>
					</div>
				{/each}
			</div>
			{#if 'damage' in unit && unit.damage}
				<div class="overlay position-absolute top-0 start-0">
					<div class="badge bg-danger text-light" style="font-size: 150%">
						{#each unit.damage.dice as dice}
							<Emoji>{dice.type.icon}</Emoji>
						{/each}
						{unit.damage.damage}
					</div>
				</div>
			{/if}
		</button>
			<div>
				{#if actions}
					{@render actions()}
				{/if}
			</div>
	</div>
</div>

<style>
.unit {
  height: 100px;
  width: 100%;
  overflow: hidden;
}

.overlay .trait {
background: #eee;
border-radius: 1rem;
border: 1px solid #aaa;
}
</style>
