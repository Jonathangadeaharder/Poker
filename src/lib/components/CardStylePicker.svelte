<script lang="ts">
import type { CardStyle } from '$lib/stores/settings.svelte';

interface Props {
	value?: CardStyle;
	onchange?: (style: CardStyle) => void;
}

let { value = 'classic', onchange }: Props = $props();

const styles: { name: CardStyle; label: string; preview: string }[] = [
	{ name: 'classic', label: 'Classic', preview: 'A♠' },
	{ name: 'minimal', label: 'Minimal', preview: 'A♠' },
	{ name: 'luxury', label: 'Luxury', preview: 'A♠' }
];

function select(style: CardStyle) {
	value = style;
	onchange?.(style);
}
</script>

<div class="card-style-picker">
	{#each styles as style (style.name)}
		<button
			type="button"
			class={['style-option', value === style.name && 'active']}
			onclick={() => select(style.name)}
		>
			<span class={['style-preview', style.name]}>{style.preview}</span>
			<span class="style-label">{style.label}</span>
		</button>
	{/each}
</div>

<style>
	.card-style-picker {
		display: flex;
		gap: 8px;
	}
	.style-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		background: transparent;
		border: 1.5px solid var(--hairline);
		border-radius: 12px;
		cursor: pointer;
		color: var(--cream);
		transition: all 0.15s ease;
	}
	.style-option.active {
		background: rgba(245, 233, 212, 0.1);
		border-color: var(--coral);
	}
	.style-preview {
		font-size: 22px;
		font-weight: 700;
	}
	.style-preview.luxury {
		color: var(--gold);
		text-shadow: 0 1px 4px rgba(233, 185, 73, 0.4);
	}
	.style-preview.minimal {
		opacity: 0.7;
		font-weight: 400;
	}
	.style-label {
		font-family: var(--mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
</style>
