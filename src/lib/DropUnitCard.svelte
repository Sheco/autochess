<script lang="ts">
let { onclick, unit }:{
	unit?:Unit,
	onclick:()=>void
}= $props()
</script>
<div class="card w-100" style="height: 100px">
	<div class="card-header p-0 ps-2" style="height: 2rem">&nbsp;</div>
	<div class="card-body p-0">
		<button {onclick} class="btn btn-sm btn-primary h-100 w-100" title="Colocar {unit?.name} aquí"><i class="bi bi-box-arrow-down"></i></button>
	</div>
</div>
