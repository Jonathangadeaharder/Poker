<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	left?: Snippet;
	center?: string;
	right?: Snippet;
	onBack?: () => void;
}

let { left, center, right, onBack }: Props = $props();
</script>

<div
	style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 8px; position: relative; z-index: 5;"
>
	<div style="min-width: 40px;">
		{#if onBack}
			<button
				onclick={onBack}
				style="background: rgba(245,233,212,0.08); border: 1px solid var(--hairline); border-radius: 999px; width: 36px; height: 36px; color: var(--cream); cursor: pointer; font-size: 18px; display: inline-flex; align-items: center; justify-content: center;"
				>‹</button
			>
		{/if}
		{#if left}
			{@render left()}
		{/if}
	</div>
	<div
		style="flex: 1; text-align: center; font-size: 13px; font-family: var(--mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--cream-dim);"
	>
		{center ?? ''}
	</div>
	<div style="min-width: 40px; text-align: right;">
		{#if right}
			{@render right()}
		{/if}
	</div>
</div>
