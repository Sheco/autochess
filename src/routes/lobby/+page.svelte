<script lang="ts">
    import { page } from "$app/stores";

let nickname = $state($page.data.nickname)
let lobby = $state('')
</script>
<div class="container">
Bienvenido, ingresa tu sobrenombre y el nombre del lobby al que quieres unirte.
	<div class="row">
		<div class="col-3">
			<form method="post">
				<label class="form-label" for="nickname">Tu sobrenombre:</label>
				<input class="form-control" name="nickname" id="nickname" bind:value={nickname}/>

				<label class="form-label" for="lobby">Nombre del lobby:</label>
				<input class="form-control" name="lobby" id="lobby" bind:value={lobby} >
				<button class="btn btn-primary mt-2" type="submit">Unirte</button>
			</form>
		</div>
	</div>
</div>
