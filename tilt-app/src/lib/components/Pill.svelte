<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	class?: string;
	children: Snippet;
}

let { class: className = '', children }: Props = $props();
</script>

<span class="pill {className}">
	{@render children()}
</span>
