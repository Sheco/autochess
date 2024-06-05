<script lang="ts">
    import BoardGrid from "./BoardGrid.svelte";

let { player1, player2, onAddUnit, onRemoveUnit, editable, attacks}:
	{
		player1:Player,
		player2:Player,
		onAddUnit?: (player:Player, c:Coordinate, value:string)=>void,
		onRemoveUnit?: (player:Player, c:Coordinate)=>void,
		editable:boolean,
		attacks:Attack[]
	} = $props()
		
</script>
<BoardGrid player={player2} mirrored={true} {onAddUnit} {onRemoveUnit} {editable} {attacks} />
<BoardGrid player={player1} mirrored={false} {onAddUnit} {onRemoveUnit}  {editable} {attacks} />
