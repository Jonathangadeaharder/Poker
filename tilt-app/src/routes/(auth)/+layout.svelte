<script lang="ts">
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';

let { children } = $props();

$effect(() => {
	if (!auth.loading && auth.isAuthenticated) {
		goto('/');
	}
});
</script>

{#if auth.loading}
	<div class="loading-screen">
		<div class="spinner"></div>
	</div>
{:else if !auth.isAuthenticated}
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
