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
<div class="card w-100 {boardUnit.ui.style}" style="height: 100px">
	<div class="overlay position-absolute top-0 start-0" style="z-index: 1500">
		{#if boardUnit.ui.damage && boardUnit.ui.damage.damage>0}
		{@const dmg = boardUnit.ui.damage}
		{@const force = (1+(dmg.damage-dmg.min)/(dmg.max-dmg.min))*100}
			<div style="font-size: 0.5rem">
			<div class="damage-splash" style="font-size: {force}%">
					{#each boardUnit.ui.damage.dice as dice}
						<Emoji>{dice.type.icon}</Emoji>
					{/each}
					{boardUnit.ui.damage.damage}
			</div>
			</div>
		{/if}
	</div>
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
	<div class="card-body p-0 overflow-hidden w-100" style="height: 50px">

		<button {onclick} class="unit p-0 position-relative">
			<img src="/units/{unit.id}.png" class="{unit.id}" alt={unit.name} style="height: 200px"/>
		</button>
	</div>
</div>

<style>
.unit {
  height: 100px;
  width: 200%;
  overflow: hidden;
 position:relative;
}
.unit img {
position: absolute;
  top: 50%;
  left: 40%;
  transform: translate(-70%, -30%);
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

.damage-splash {
    font-size: 0.05rem;
    color: red;
    padding: 20px 20px;
    background: linear-gradient(45deg, #ff0000, #ff9900);
    position: relative;
    text-align: center;
    clip-path: polygon(
        50% 0%, 75% 30%, 100% 30%, 90% 50%, 
        100% 70%, 75% 70%, 50% 100%, 25% 70%, 
        0% 70%, 10% 50%, 0% 30%, 25% 30%
    );
}

.damage-splash::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #ffff00, #ffcc00);
    clip-path: inherit;
    z-index: -1;
    transform: scale(1.2);
}

</style>

