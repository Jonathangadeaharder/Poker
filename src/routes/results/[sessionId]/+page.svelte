<script lang="ts">
import { page } from '$app/state';

let showConfetti = $state(false);

$effect(() => {
	const t = setTimeout(() => {
		showConfetti = true;
	}, 400);
	return () => clearTimeout(t);
});

const sessionId = $derived(page.params.sessionId);

const stats = [
	{ label: 'XP earned', value: '+85', color: 'var(--coral)' },
	{ label: 'Accuracy', value: '4/5', color: 'var(--gold)' },
	{ label: 'Streak', value: '8 🔥', color: 'var(--coral-soft)' },
	{ label: 'Time', value: '4:12', color: 'var(--cream)' }
];
</script>

<div class="screen felt-bg" style="overflow-y: auto;">
	<Confetti active={showConfetti} />

	<div style="padding: 70px 28px 32px; text-align: center; position: relative;">
		<div class="anim-pop" style="font-size: 64px;">🃏</div>
		<div class="eyebrow anim-float" style="margin-top: 12px; color: var(--gold);">Session complete</div>
		<h1 class="h-display anim-float" style="margin-top: 8px; font-size: 56px;">
			<em class="serif" style="color: var(--coral-soft);">Sharp</em><br />play, dealer.
		</h1>
		<p class="anim-float" style="font-size: 15px; color: var(--cream-dim); margin-top: 12px;">
			You're calibrated 18% better than yesterday.
		</p>
	</div>

	<div style="padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
		{#each stats as stat, i (stat.label)}
			<div
				class="anim-float"
				style="padding: 18px; background: rgba(245,233,212,0.04); border: 1px solid var(--hairline); border-radius: 18px;"
			>
				<div class="eyebrow">{stat.label}</div>
				<div class="serif" style="font-size: 32px; margin-top: 4px; color: {stat.color};">
					{stat.value}
				</div>
			</div>
		{/each}
	</div>

	<div
		class="anim-float"
		style="margin: 20px 20px 0; padding: 22px; border-radius: 22px; background: linear-gradient(180deg, rgba(233,185,73,0.12), rgba(233,185,73,0.03)); border: 1px solid rgba(233,185,73,0.3);"
	>
		<div class="eyebrow" style="color: var(--gold);">The Read · Insight</div>
		<div class="serif" style="font-size: 22px; margin-top: 6px;">
			You bluff-catch <em style="color: var(--gold-soft);">too rarely</em> on the river.
		</div>
		<div style="font-size: 13px; color: var(--cream-dim); margin-top: 8px;">
			When opponents over-bet rivers, you fold 78% of the time. The math says 55% is closer to optimal.
		</div>
		<button class="btn btn-ghost" style="width: 100%; margin-top: 14px; font-size: 14px; padding: 12px;">
			Drill this tomorrow →
		</button>
	</div>

	<div
		class="anim-float"
		style="margin: 14px 20px 0; padding: 16px; border-radius: 18px; background: rgba(255,91,72,0.1); border: 1px solid rgba(255,91,72,0.3); display: flex; align-items: center; gap: 14px;"
	>
		<div
			style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, var(--coral), var(--gold)); display: flex; align-items: center; justify-content: center; font-size: 22px;"
		>
			🏅
		</div>
		<div style="flex: 1;">
			<div class="eyebrow" style="color: var(--coral-soft);">Achievement unlocked</div>
			<div style="font-size: 15px; font-weight: 600; margin-top: 2px;">Week One Wonder</div>
			<div style="font-size: 12px; color: var(--cream-dim);">7-day streak. Keep going.</div>
		</div>
		<div class="mono" style="font-size: 13px; color: var(--coral-soft); font-weight: 700;">+25 XP</div>
	</div>

	<div style="padding: 20px 20px 32px;">
		<button class="btn btn-primary" style="width: 100%;" onclick={() => goto('/home')}>
			Done · See you tomorrow
		</button>
	</div>
</div>
