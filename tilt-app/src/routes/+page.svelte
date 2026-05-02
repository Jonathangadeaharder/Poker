<script lang="ts">
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';

$effect(() => {
	if (!auth.loading) {
		if (auth.isAuthenticated) {
			goto('/home');
		} else {
			goto('/login');
		}
	}
});
</script>

{#if auth.loading}
	<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: var(--cream-dim);">
		Loading...
	</div>
{/if}
