<script lang="ts">
    import { onMount, type Snippet } from "svelte";

	let { children, title, onclose, width }:{ 
		children:Snippet, 
		title:string, 
		width?:string,
		onclose:()=>void
	} = $props()

	let dialog:HTMLDialogElement; // HTMLDialogElement

	$effect(() => {
		if (dialog) dialog.showModal();
	})
	let style = $derived(width? `width: ${width}`: undefined)
	onMount(() => {
		document.querySelectorAll('dialog').forEach(element => 
		element.addEventListener('mousedown', 
			event => {
				if(!event.target) return
				let dialog = event.target as HTMLDialogElement
				if (dialog === event.currentTarget) dialog.close()
			}
		))
	})

</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	{style}
	{onclose}>
	<div class="card">
		<div class="card-header">
			{title}
			<form method="dialog" class="float-end">
				<button class="btn btn-sm btn-danger">x</button>
			</form>
		</div>
		<div class="card-body">
			{@render children()}
		</div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 90%;
		border-radius: 1em;
		border: none;
		padding: 0;
		z-index: 1000;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.3s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

