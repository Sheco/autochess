<script lang="ts">
import Modal from "./Modal.svelte";
import TraitIcon from "./TraitIcon.svelte";
import UnitInfo from "./UnitInfo.svelte";
import Emoji from "./Emoji.svelte";
import { createBoardUnit } from "./combat";

let { unit, onclick, boardUnit }:{
	unit:Unit, 
	boardUnit?:BoardUnit,
	onclick:()=>void,
} = $props()
let showModal = $state(false)
if(!boardUnit) boardUnit=createBoardUnit(unit, {x:0, y:0})
</script>

{#if showModal}
	<Modal title="{unit.name}" width="30rem" onclose={()=>showModal=false}>
		<UnitInfo {unit} {boardUnit} />
	</Modal>
{/if}
<div class="card w-100 {boardUnit.ui.style}" style="height: 120px">
	<div class="card-header p-1" style="height: 2rem">
		<button onclick={() => showModal=true} class="btn btn-sm btn-info p-0 float-end"><span class="bi bi-info-circle"></span></button>
			{#if boardUnit}
			{@const maxhp = unit.maxhp+(boardUnit.mods.maxhp??0) }
			{@const percent = Math.floor((boardUnit.ui.hp??0)/maxhp*100) }
			<div class="progress">
				<div class="progress-bar bg-danger" role="progressbar" style="width: {percent}%" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"></div>
			</div>
			{/if}
	</div>
	<div class="card-body p-0 overflow-hidden w-100" style="height: 70px">

		<button {onclick} class="unit p-0 position-relative">
			<img src="/units/{unit.id}.png" class="{unit.id}" alt={unit.name} style="height: 200px"/>
			<div class="overlay position-absolute top-0 start-0">
				{#if boardUnit.ui.damage && boardUnit.ui.damage.damage>0}
				{@const dmg = boardUnit.ui.damage}
				{@const force = (1+(dmg.damage-dmg.min)/(dmg.max-dmg.min))*100}
					<div class="badge bg-danger text-light" style="font-size: {force}%">
							{#each boardUnit.ui.damage.dice as dice}
								<Emoji>{dice.type.icon}</Emoji>
							{/each}
							{boardUnit.ui.damage.damage}
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

