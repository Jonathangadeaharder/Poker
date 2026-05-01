<script lang="ts">
interface Props {
	rank: string;
	suit: string;
	faceDown?: boolean;
	treatment?: 'classic' | 'minimal' | 'luxury';
	size?: 'sm' | 'md' | 'lg' | 'xl';
	delay?: number;
	class?: string;
}

let {
	rank,
	suit,
	faceDown = false,
	treatment = 'classic',
	size = 'md',
	delay = 0,
	class: className = ''
}: Props = $props();

const isRed = $derived(suit === '♥' || suit === '♦');

const sizes: Record<string, { w: number; h: number; rank: number; suit: number }> = {
	sm: { w: 44, h: 62, rank: 18, suit: 14 },
	md: { w: 64, h: 90, rank: 26, suit: 22 },
	lg: { w: 88, h: 124, rank: 36, suit: 30 },
	xl: { w: 120, h: 168, rank: 52, suit: 42 }
};

const s = $derived(sizes[size]);
</script>

{#if faceDown}
	<div
		class="card face-down anim-deal {className}"
		style="width: {s.w}px; height: {s.h}px; animation-delay: {delay}ms;"
	></div>
{:else if treatment === 'minimal'}
	<div
		class="card {isRed ? 'red' : ''} anim-deal {className}"
		style="width: {s.w}px; height: {s.h}px; animation-delay: {delay}ms; padding: 0; justify-content: center; align-items: center;"
	>
		<div style="display: flex; align-items: baseline; gap: 2px;">
			<span style="font-size: {s.rank * 1.1}px; font-weight: 800; letter-spacing: -0.06em;"
				>{rank}</span
			>
			<span style="font-size: {s.suit * 0.7}px;">{suit}</span>
		</div>
	</div>
{:else if treatment === 'luxury'}
	<div
		class="card {isRed ? 'red' : ''} anim-deal {className}"
		style="width: {s.w}px; height: {s.h}px; animation-delay: {delay}ms; background: linear-gradient(135deg, #f5e9d4, #ede0c7); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 0 24px rgba(180,140,80,0.15), 0 8px 16px -4px rgba(0,0,0,0.5);"
	>
		<div style="display: flex; flex-direction: column; align-items: flex-start;">
			<span style="font-size: {s.rank}px; font-weight: 700; letter-spacing: -0.04em;">{rank}</span
			>
			<span style="font-size: {s.suit}px;">{suit}</span>
		</div>
		<div style="align-self: center; font-size: {s.rank * 1.5}px; opacity: 0.18;">{suit}</div>
		<div
			style="display: flex; flex-direction: column; align-items: flex-end; transform: rotate(180deg);"
		>
			<span style="font-size: {s.rank}px; font-weight: 700; letter-spacing: -0.04em;">{rank}</span
			>
			<span style="font-size: {s.suit}px;">{suit}</span>
		</div>
	</div>
{:else}
	<div
		class="card {isRed ? 'red' : ''} anim-deal {className}"
		style="width: {s.w}px; height: {s.h}px; animation-delay: {delay}ms;"
	>
		<div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1;">
			<span class="rank" style="font-size: {s.rank}px;">{rank}</span>
			<span class="suit" style="font-size: {s.suit}px; margin-top: 2px;">{suit}</span>
		</div>
		<div
			style="display: flex; flex-direction: column; align-items: flex-end; transform: rotate(180deg); line-height: 1;"
		>
			<span class="rank" style="font-size: {s.rank}px;">{rank}</span>
			<span class="suit" style="font-size: {s.suit}px; margin-top: 2px;">{suit}</span>
		</div>
	</div>
{/if}
