<script lang="ts">
    import Emoji from "./Emoji.svelte";

let { dice }:{dice:Dice[]} = $props()
</script>
{#each dice as die}
	<Emoji>{die.type.icon}</Emoji>{die.amount}d{die.sides}+{die.modifier}
{/each}

