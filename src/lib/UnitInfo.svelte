<script lang="ts">
import UnitTraits from "./UnitTraits.svelte";
    import Attribute from "./Attribute.svelte";
import Effect from './Effect.svelte';
    import { createBoardUnit } from "./combat";
    import { NoUnit } from "./database";

let { unit, boardUnit=undefined }:{
	unit:Unit, 
	board?:Board|undefined,
	boardUnit?:BoardUnit|undefined
} = $props()

let attackMods = boardUnit? boardUnit.mods.attack??[]: []
</script>
<div class="row">
	
	<div class="col-12">
		<div style="font-size: 80%; height: 4rem;" class="fw-light">{#each unit.info.split('\n') as line}
			{@html line}<br>
		{/each}
		</div>
	</div>
	<div class="col-6">
		<b>Precio:</b>
		<div class="float-end">
		{unit.cost} <span class="icon">🪙</span>
		</div>
	</div>
	<div class="col-6">
		<b>Rasgos:</b> 
		<UnitTraits {unit} />
	</div>
	<div class="col-12">
		<b>Ataque:</b><br>
		<div class="ms-3">
			{#each [...unit.attack, ...attackMods] as die}
				{die.type.icon}{die.amount}d{die.sides}+{die.modifier}
			{/each}
		</div>
	</div>
	<div class="col-12">
		<b>Debilidades:</b><br>
		<div class="ms-3">
			{#each unit.weakness as die}
				{die.type.icon}{die.amount}d{die.sides}+{die.modifier}
			{/each}
		</div>
	</div>
	<div class="col-12">
		<b>HP:</b> 
		<span class="float-end"><Attribute value={unit.maxhp} mod={boardUnit?.mods.maxhp} /></span>
	</div>
	<div class="col-6">
		<b>Energía por tick:</b>
		<span class="float-end">{unit.energypertick}</span>
	</div>
	<div class="col-6">
		<b>Energía maxima:</b>
		<span class="float-end">{unit.energymax}</span>
	</div>
	<div class="col-12">
		<b>Objetivos:</b> <br>
		<div class="ms-2" style="height: 3rem">
		{unit.targetting.name}
		</div>
	</div>
</div>

