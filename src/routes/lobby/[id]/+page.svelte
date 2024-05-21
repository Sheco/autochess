<script lang="ts">
import { enhance } from '$app/forms';
import { page } from '$app/stores';
import { source } from 'sveltekit-sse'
import type { PageData } from './$types';
let log:string[] = $state([])
let lobby = $page.params.id
source(`/lobby/${lobby}/log`).select('message').subscribe((data) => {
	log.push(data)
})
</script>

<div class="container">
	<div class="row mt-2">
		<div class="col-3">
			<div class="card">
				<div class="card-header">Chat {$page.data.nickname}</div>
				<div class="card-body">
					<div>
						<form action="/lobby/{lobby}/send" method="post" use:enhance>
							<div class="input-group">
								<input autofocus class="form-control" name="message" />
								<button class="btn btn-outline-secondary" role="button">✉️</button>
							</div>
						</form>

						{#each log as message}
						{message}<br>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
