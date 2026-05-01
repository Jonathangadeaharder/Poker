<script lang="ts">
import '../app.css';

let { children } = $props();
</script>

<svelte:head>
	<title>Tilt — Poker Training</title>
	<meta name="description" content="Poker training app with GTO principles" />
</svelte:head>

{@render children()}
