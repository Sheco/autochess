<script lang="ts">
import { enhance } from '$app/forms';
import { page } from '$app/stores';
import { source } from 'sveltekit-sse'
let log:string[] = $state([])
let lobby = $page.params.id
let newMessages = $state(false)
let showChat = $state(false)
source(`/lobby/${lobby}/connection`).select('chat').subscribe((data) => {
	log.push(data)
	if (!showChat) newMessages = true
})
function toggleChat() {
	showChat = !showChat
	newMessages = false
}
</script>

<div class="container">
	<button class:btn-outline-primary={!newMessages} class:btn-outline-danger={newMessages} class="btn btn-sm" onclick={toggleChat}>✉️</button>
	{#if showChat}
	<div class="card">
		<div class="card-header">Chat {$page.params.id}</div>
		<div class="card-body p-1">
			<form action="/lobby/{lobby}?/send" method="post" use:enhance={() => ({update}) => update({invalidateAll: false}) }>
				<div class="input-group">
					<!-- svelte-ignore a11y_autofocus -->
					<input autofocus autocomplete="off" class="form-control p-0" name="message" />
					<button class="btn btn-outline-secondary p-0">✉️</button>
				</div>
			</form>

			<div class="mt-3" style="height: 7rem; scroll-behavior: auto; overflow-y: scroll;display: flex; flex-direction: column-reverse;">
			{#each log as message}
			{message}<br>
			{/each}
			</div>
		</div>
	</div>
	{/if}
</div>
