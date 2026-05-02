<script lang="ts">
interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	xpReward: number;
	requirement: { type: string; count: number };
}

interface Props {
	achievement: Achievement;
	unlocked: boolean;
}

let { achievement, unlocked }: Props = $props();
</script>

<div class="achievement-badge" class:locked={!unlocked}>
	<div class="badge-icon">
		<span>{achievement.icon}</span>
		{#if !unlocked}
			<span class="lock-overlay">🔒</span>
		{/if}
	</div>
	<span class="badge-title">{achievement.title}</span>
	<div class="badge-tooltip">
		<p>{achievement.description}</p>
		<span class="badge-xp">+{achievement.xpReward} XP</span>
	</div>
</div>

<style>
	.achievement-badge {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 12px 8px;
		border-radius: 12px;
		background: rgba(245, 233, 212, 0.06);
		border: 1.5px solid var(--coral);
		cursor: pointer;
		transition: transform 0.15s ease;
	}
	.achievement-badge:hover {
		transform: scale(1.05);
	}
	.achievement-badge.locked {
		border-color: var(--hairline);
		opacity: 0.45;
		filter: grayscale(0.8);
	}
	.achievement-badge.locked:hover {
		transform: none;
	}
	.badge-icon {
		position: relative;
		font-size: 28px;
		line-height: 1;
	}
	.lock-overlay {
		position: absolute;
		bottom: -4px;
		right: -4px;
		font-size: 12px;
	}
	.badge-title {
		font-family: var(--mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--cream);
		text-align: center;
		line-height: 1.2;
	}
	.badge-tooltip {
		display: none;
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--felt-3, #1d4a36);
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 8px 12px;
		z-index: 10;
		width: max-content;
		max-width: 180px;
	}
	.achievement-badge:hover .badge-tooltip {
		display: block;
	}
	.badge-tooltip p {
		margin: 0;
		font-size: 11px;
		color: var(--cream);
		line-height: 1.4;
	}
	.badge-xp {
		font-family: var(--mono);
		font-size: 10px;
		color: var(--coral);
	}
</style>
