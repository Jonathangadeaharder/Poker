<script lang="ts">
interface Props {
	value: number;
	size?: number;
	stroke?: number;
	label?: string;
	sublabel?: string;
}

let { value, size = 64, stroke = 6, label, sublabel }: Props = $props();

const r = $derived((size - stroke) / 2);
const c = $derived(2 * Math.PI * r);
const clamped = $derived(Math.max(0, Math.min(100, value)));
const offset = $derived(c - (clamped / 100) * c);
</script>

<div style="position: relative; width: {size}px; height: {size}px;">
	<svg width={size} height={size} style="transform: rotate(-90deg);">
		<circle class="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" stroke-width={stroke}
		></circle>
		<circle
			class="ring-fill"
			cx={size / 2}
			cy={size / 2}
			r={r}
			fill="none"
			stroke-width={stroke}
			stroke-dasharray={c}
			stroke-dashoffset={offset}
			stroke-linecap="round"
		></circle>
	</svg>
	{#if label}
		<div
			style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;"
		>
			<span class="mono" style="font-size: 16px; font-weight: 700;">{label}</span>
			{#if sublabel}
				<span style="font-size: 10px; color: var(--cream-dim);">{sublabel}</span>
			{/if}
		</div>
	{/if}
</div>
