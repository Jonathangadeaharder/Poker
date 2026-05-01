<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	variant?: 'primary' | 'ghost' | 'cream';
	disabled?: boolean;
	onclick?: () => void;
	class?: string;
	children: Snippet;
}

let {
	variant = 'primary',
	disabled = false,
	onclick,
	class: className = '',
	children
}: Props = $props();
</script>

<button
	class="btn btn-{variant} {className}"
	{disabled}
	{onclick}
>
	{@render children()}
</button>
