<script lang="ts">
import { enhance } from '$app/forms';
import { page } from '$app/stores';
import { source } from 'sveltekit-sse'
let log:string[] = $state([])
let lobby = $page.params.id
source(`/lobby/${lobby}/connection`).select('chat').subscribe((data) => {
	log.push(data)
})
</script>

<div class="container">
	<div class="row mt-2">
		<div class="col-12 col-lg-3">
			<div class="card">
				<div class="card-header">Chat {$page.params.id}</div>
				<div class="card-body">
					<div>
						<form action="/lobby/{lobby}?/send" method="post" use:enhance>
							<div class="input-group">
								<!-- svelte-ignore a11y_autofocus -->
								<input autofocus autocomplete="off" class="form-control" name="message" />
								<button class="btn btn-outline-secondary">✉️</button>
							</div>
						</form>

						<div class="mt-3" style="height: 7rem; scroll-behavior: auto; overflow-y: scroll;display: flex; flex-direction: column-reverse;">
						{#each log as message}
						{message}<br>
						{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
