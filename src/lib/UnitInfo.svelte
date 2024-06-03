<script lang="ts">
import UnitTraits from "./UnitTraits.svelte";
    import Attribute from "./Attribute.svelte";
    import Emoji from "./Emoji.svelte";

let { unit, mods = {} }:{ unit:Unit, mods?:Mods } = $props()


let attackMods = mods.attack??[]
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
		{unit.cost} <span class="emoji">🪙</span>
		</div>
	</div>
	<div class="col-6">
		<b>Rasgos:</b> 
		<UnitTraits unit={unit} />
	</div>
	<div class="col-12">
		<b>Ataque:</b><br>
		<div class="ms-3">
			{#each [...unit.attack, ...attackMods] as die}
				<Emoji>{die.type.icon}</Emoji>{die.amount}d{die.sides}+{die.modifier}
			{/each}
		</div>
	</div>
	<div class="col-12">
		<b>Debilidades:</b><br>
		<div class="ms-3">
			{#each unit.weakness as die}
				<Emoji>{die.type.icon}</Emoji>{die.amount}d{die.sides}+{die.modifier}
			{/each}
		</div>
	</div>
	<div class="col-12">
		<b>HP:</b> 
		<span class="float-end"><Attribute {unit} attribute={'maxhp'} /></span>
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

