<script lang="ts">
import Modal from "./Modal.svelte";
import TraitIcon from "./TraitIcon.svelte";
import UnitInfo from "./UnitInfo.svelte";
import Emoji from "./Emoji.svelte";

let { unit, onclick }:{
	unit:BoardUnit, 
	onclick:()=>void,
} = $props()
let showModal = $state(false)
</script>

{#if showModal}
	<Modal title="{unit.name} de la unidad" width="30rem" onclose={()=>showModal=false}>
		<UnitInfo {unit} />
	</Modal>
{/if}
<div class="card w-100 {unit.ui.style}">
	<div class="card-header p-1">
		<button onclick={() => showModal=true} class="btn btn-sm btn-info p-0"><span class="bi bi-info-circle"></span></button>
		{unit.name}
			{#if unit}
			{@const maxhp = unit.maxhp }
			{@const percent = Math.floor((unit.ui.hp??0)/maxhp*100) }
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
					<div class="trait mb-0 pe-3 ps-1 text-start">
						<TraitIcon {trait} /> {trait.name}<br>
					</div>
				{/each}
			</div>
			<div class="overlay position-absolute top-0 start-0">
				{#if unit.ui.damage && unit.ui.damage.damage>0}
				{@const dmg = unit.ui.damage}
				{@const force = (1+(dmg.damage-dmg.min)/(dmg.max-dmg.min))*100}
					<div class="badge bg-danger text-light" style="font-size: {force}%">
							{#each unit.ui.damage.dice as dice}
								<Emoji>{dice.type.icon}</Emoji>
							{/each}
							{unit.ui.damage.damage}
					</div>
				{/if}
			</div>
		</button>
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

@keyframes damaged {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(2);
  }
}
.attacked-defend {
  animation: damaged 0.30s 1 ease-in-out;
  border: 2px solid #f00;
  z-index: 1500;
}
.attacking-defend {
  border: 2px solid #f00;
  z-index: 1500;
}

.attacking-attack {
  transform: scale(1.2);
  z-index: 1500;
  transition: transform .2s;
}

.attacked-attack {
  transform: scale(1.2);
  z-index: 1500;
  transition: transform .2s;
}
</style>
