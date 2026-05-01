<script lang="ts">
import '../app.css';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { auth } from '$lib/stores/auth.svelte';

let { children } = $props();

$effect(() => {
	auth.init();
});

const isAuthRoute = $derived(
	page.url.pathname.startsWith('/login') || page.url.pathname.startsWith('/register')
);

$effect(() => {
	if (!auth.loading && !auth.isAuthenticated && !isAuthRoute) {
		goto('/login');
	}
});
</script>

<svelte:head>
	<title>Tilt — Poker Training</title>
	<meta name="description" content="Poker training app with GTO principles" />
</svelte:head>

{#if auth.loading}
	<div class="loading-screen">
		<div class="spinner"></div>
	</div>
{:else if isAuthRoute || auth.isAuthenticated}
	{@render children()}
{/if}

<style>
	.loading-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: var(--felt);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--hairline);
		border-top-color: var(--coral);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
