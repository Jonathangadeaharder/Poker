<script lang="ts">
import { goto } from '$app/navigation';
// biome-ignore lint/correctness/noUnusedImports: Used in template
import PlayingCard from '$lib/components/PlayingCard.svelte';

interface Option {
	v: string | number;
	label: string;
	emoji?: string;
	sub?: string;
}

interface Slide {
	kind: string;
	eyebrow?: string;
	q?: string;
	key?: string;
	opts?: Option[];
}

let step = $state(0);
let picks = $state({
	goal: null as string | null,
	time: null as number | null,
	level: null as string | null
});

const slides: Slide[] = [
	{
		kind: 'hero'
	},
	{
		kind: 'q',
		eyebrow: 'Question 1 of 3',
		q: 'What brings you to the table?',
		key: 'goal',
		opts: [
			{ v: 'win', label: 'Win money from friends', emoji: '💰' },
			{ v: 'pro', label: 'Take poker seriously', emoji: '🎯' },
			{ v: 'fun', label: 'Just enjoy the game more', emoji: '✨' },
			{ v: 'crush', label: 'Crush online cash games', emoji: '🔥' }
		]
	},
	{
		kind: 'q',
		eyebrow: 'Question 2 of 3',
		q: 'How honest are we being about your game?',
		key: 'level',
		opts: [
			{ v: 'new', label: 'I know what a flush is. Mostly.', sub: 'Brand new' },
			{ v: 'casual', label: "I lose more than I'd like to admit", sub: 'Casual' },
			{ v: 'mid', label: 'I know GTO but I freeze on the river', sub: 'Improving' },
			{ v: 'shark', label: "I'm a shark sharpening teeth", sub: 'Advanced' }
		]
	},
	{
		kind: 'q',
		eyebrow: 'Question 3 of 3',
		q: 'How much time can you steal each day?',
		key: 'time',
		opts: [
			{ v: 5, label: '5 min', sub: 'Coffee break' },
			{ v: 10, label: '10 min', sub: 'Commute' },
			{ v: 20, label: '20 min', sub: 'Serious' },
			{ v: 30, label: '30+ min', sub: 'All in' }
		]
	},
	{
		kind: 'plan'
	}
];

const slide = $derived(slides[step]);

let advanceTimer: ReturnType<typeof setTimeout> | null = null;

function advance(key: string | undefined, value: string | number | null) {
	if (advanceTimer) return;
	if (key && value !== null) {
		picks = { ...picks, [key]: value };
	}
	advanceTimer = setTimeout(() => {
		step = step + 1;
		advanceTimer = null;
	}, 240);
}

async function complete() {
	try {
		localStorage.setItem('tilt_onboarding', JSON.stringify(picks));
	} catch {
		// localStorage unavailable — continue anyway
	}
	// TODO: Save onboarding choices to Supabase
	goto('/');
}
</script>

<div class="screen felt-bg">
	{#if step > 0 && step < slides.length - 1}
		<div class="progress-dots">
			{#each [1, 2, 3] as i}
				<div
					class="dot"
					class:active={i === step}
					class:completed={i < step}
				></div>
			{/each}
		</div>
	{/if}

	{#if slide.kind === 'hero'}
		<div class="hero-slide">
			<div class="floating-cards">
				<div class="card-float card-1">
					<PlayingCard rank="A" suit="♠" size="lg" />
				</div>
				<div class="card-float card-2">
					<PlayingCard rank="K" suit="♥" size="xl" delay={150} />
				</div>
				<div class="card-float card-3">
					<PlayingCard rank="?" suit="?" faceDown size="lg" delay={300} />
				</div>
			</div>

			<div class="hero-content">
				<div class="eyebrow">◆ Tilt</div>
			</div>

			<div class="hero-cta">
				<h1 class="h-display hero-title">
					Poker is<br />
					reading <em class="serif italic">minds.</em>
				</h1>
				<p class="hero-subtitle">
					We'll teach you how. Five minutes a day. No theory dumps.
				</p>
				<button class="btn btn-primary" onclick={() => (step = 1)}>
					Deal me in →
				</button>
				<button class="btn btn-ghost" onclick={() => goto('/login')}>
					I have an account
				</button>
			</div>
		</div>
	{:else if slide.kind === 'q'}
		<div class="question-slide">
			<div class="eyebrow anim-float">{slide.eyebrow}</div>
			<h2 class="h-1 anim-float question-title">{slide.q}</h2>
			<div class="options">
				{#each slide.opts ?? [] as opt, i}
					<button
						class="option-btn anim-float"
						style="animation-delay: {120 + i * 60}ms"
						onclick={() => advance(slide.key, opt.v)}
					>
						{#if opt.emoji}
							<span class="option-emoji">{opt.emoji}</span>
						{/if}
						<div class="option-text">
							<div class="option-label">{opt.label}</div>
							{#if opt.sub}
								<div class="option-sub">{opt.sub}</div>
							{/if}
						</div>
						<span class="option-arrow">›</span>
					</button>
				{/each}
			</div>
		</div>
	{:else if slide.kind === 'plan'}
		<div class="plan-slide">
			<div class="eyebrow anim-float">Your plan</div>
			<h2 class="h-1 anim-float plan-title">
				Built for <em class="serif italic">you</em>, dealer.
			</h2>

			<div class="plan-card anim-float">
				<div class="plan-header">
					<div class="eyebrow">Daily session</div>
					<div class="mono plan-time">~{picks.time || 10} MIN</div>
				</div>
				{#each [{ e: '🃏', t: 'Hand of the Day', s: 'A new tricky spot, every morning' }, { e: '🧠', t: 'Pattern Drills', s: 'Repetition that actually sticks' }, { e: '👁️', t: 'The Read', s: 'Spot tells in <3 seconds' }, { e: '🎬', t: 'Replay Theater', s: 'Watch your last session, narrated' }] as item}
					<div class="plan-item">
						<span class="plan-emoji">{item.e}</span>
						<div>
							<div class="plan-item-title">{item.t}</div>
							<div class="plan-item-desc">{item.s}</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="spacer"></div>

			<button class="btn btn-primary anim-float" style="animation-delay: 300ms" onclick={complete}>
				Start your first hand →
			</button>
		</div>
	{/if}
</div>

<style>
	.screen {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--felt);
		overflow: hidden;
	}

	.progress-dots {
		position: absolute;
		top: 60px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 6px;
		z-index: 10;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: rgba(245, 233, 212, 0.2);
		transition: all 300ms ease;
	}

	.dot.active {
		width: 28px;
		background: var(--coral);
	}

	.dot.completed {
		background: var(--coral);
	}

	.hero-slide {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 60px 28px 40px;
		position: relative;
	}

	.floating-cards {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.card-float {
		position: absolute;
	}

	.card-1 {
		top: 12%;
		right: -20px;
		transform: rotate(18deg);
		opacity: 0.5;
	}

	.card-2 {
		top: 22%;
		right: 40px;
		transform: rotate(-8deg);
	}

	.card-3 {
		top: 8%;
		left: -30px;
		transform: rotate(-22deg);
		opacity: 0.4;
	}

	.hero-content {
		margin-top: 80px;
		position: relative;
		z-index: 2;
	}

	.hero-title {
		font-size: 64px;
	}

	.italic {
		color: var(--coral-soft);
		font-style: italic;
	}

	.hero-subtitle {
		font-size: 18px;
		color: var(--cream-dim);
		margin-top: 16px;
		line-height: 1.4;
		max-width: 280px;
	}

	.hero-cta {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 28px;
	}

	.question-slide {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 90px 24px 28px;
	}

	.question-title {
		margin-top: 8px;
		font-size: 30px;
		animation-delay: 60ms;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 28px;
	}

	.option-btn {
		background: rgba(245, 233, 212, 0.05);
		border: 1.5px solid var(--hairline-strong);
		border-radius: 16px;
		padding: 16px 18px;
		display: flex;
		align-items: center;
		gap: 14px;
		color: var(--cream);
		cursor: pointer;
		text-align: left;
		transition: all 180ms ease;
		font-family: var(--sans);
	}

	.option-btn:active {
		background: rgba(255, 91, 72, 0.12);
	}

	.option-emoji {
		font-size: 22px;
	}

	.option-text {
		flex: 1;
	}

	.option-label {
		font-size: 16px;
		font-weight: 600;
	}

	.option-sub {
		font-size: 12px;
		color: var(--cream-dim);
		margin-top: 2px;
	}

	.option-arrow {
		color: var(--cream-dim);
	}

	.plan-slide {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 80px 28px 40px;
	}

	.plan-title {
		margin-top: 8px;
		font-size: 30px;
		animation-delay: 80ms;
		max-width: 300px;
	}

	.plan-card {
		margin-top: 32px;
		padding: 22px;
		border-radius: 22px;
		background: linear-gradient(180deg, rgba(255, 91, 72, 0.12), rgba(233, 185, 73, 0.08));
		border: 1px solid rgba(255, 91, 72, 0.25);
		animation-delay: 160ms;
	}

	.plan-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.plan-time {
		font-size: 11px;
		color: var(--gold);
	}

	.plan-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 0;
		border-top: 1px solid var(--hairline);
	}

	.plan-emoji {
		font-size: 18px;
	}

	.plan-item-title {
		font-size: 14px;
		font-weight: 600;
	}

	.plan-item-desc {
		font-size: 12px;
		color: var(--cream-dim);
	}

	.spacer {
		flex: 1;
	}

	.anim-float {
		animation: float-up 400ms ease both;
	}

	@keyframes float-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
