<script lang="ts">
import { goto } from '$app/navigation';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import Chip from '$lib/components/Chip.svelte';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import Pill from '$lib/components/Pill.svelte';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import PlayingCard from '$lib/components/PlayingCard.svelte';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import TopBar from '$lib/components/TopBar.svelte';

type Phase = 'setup' | 'read' | 'decide' | 'reveal';
type Choice = 'fold' | 'call' | 'raise' | null;

let phase = $state<Phase>('setup');
let confidence = $state(60);
let choice = $state<Choice>(null);
let tellMeter = $state(0);
let handNumber = $state(1);
let totalHands = 5;
let xpEarned = $state(0);

const correct = $derived(choice === 'raise');

const phaseText = $derived.by(() => {
	switch (phase) {
		case 'setup':
			return 'Folded to you on the button.';
		case 'read':
			return 'Villain just min-raised. Quickly.';
		case 'decide':
			return "What's your move?";
		case 'reveal':
			return correct ? 'Nice read.' : 'Hmm. Re-deal that one.';
	}
});

const xpResult = $derived.by(() => {
	if (phase !== 'reveal' || !choice) return 0;
	const base = confidence > 0 ? confidence : 1;
	if (correct) return Math.round((20 * base) / 60);
	return -Math.round((5 * base) / 60);
});

$effect(() => {
	if (phase !== 'read') return;
	let v = 0;
	const id = setInterval(() => {
		v = Math.min(100, v + 4);
		tellMeter = v;
		if (v >= 100) clearInterval(id);
	}, 60);
	return () => clearInterval(id);
});

$effect(() => {
	if (phase === 'setup') {
		const t = setTimeout(() => {
			phase = 'read';
		}, 1400);
		return () => clearTimeout(t);
	}
});

function choose(c: Choice) {
	choice = c;
	phase = 'reveal';
	xpEarned += xpResult;
}

function nextHand() {
	if (handNumber >= totalHands) {
		goto('/home');
		return;
	}
	handNumber += 1;
	phase = 'setup';
	choice = null;
	tellMeter = 0;
	confidence = 60;
}
</script>

<div class="screen felt-bg">
	<TopBar onBack={() => goto('/home')}>
		{#snippet center()}
			Hand {handNumber} of {totalHands}
		{/snippet}
		{#snippet right()}
			<Pill><span style="color: var(--gold);">●</span> {xpEarned >= 0 ? `+${xpEarned}` : xpEarned} XP</Pill>
		{/snippet}
	</TopBar>

	<div class="scenario">
		<div class="eyebrow" style="color: var(--gold);">UTG · 100BB · $1/$2 NLHE</div>
		<div class="serif scenario-text">
			{phaseText}
		</div>
	</div>

	<div class="table-felt">
		<div class="opponent-zone">
			<div class="opponent-avatar">🎩</div>
			<div class="mono opponent-label">Villain · UTG</div>
			{#if phase === 'read' || phase === 'decide'}
				<div class="tell-meter">
					<span style="font-size: 10px;">👁</span>
					<div class="tell-track">
						<div class="tell-fill" style="width: {tellMeter}%;"></div>
					</div>
					<span class="mono tell-label">TELL</span>
				</div>
			{/if}
		</div>

		<div class="opponent-cards">
			<PlayingCard faceDown size="sm" treatment="classic" />
			<PlayingCard faceDown size="sm" treatment="classic" delay={80} />
		</div>

		<div class="pot-zone">
			<div class="eyebrow">Pot</div>
			<div class="mono pot-amount">$7</div>
			<div class="pot-chips">
				<Chip label="$1" class="chip-sm" />
				<Chip label="$2" class="chip-sm" />
			</div>
		</div>

		<div class="hero-cards">
			<PlayingCard rank="A" suit="♠" size="lg" treatment="classic" />
			<PlayingCard rank="K" suit="♠" size="lg" treatment="classic" delay={120} />
		</div>
	</div>

	<div class="decision-panel">
		{#if phase === 'read'}
			<div class="anim-float read-panel">
				<div class="eyebrow">Reading...</div>
				<div class="read-hint">
					Quick min-raise after a long pause = uncertainty.<br />
					Often a hand he wishes was bigger.
				</div>
				<button class="btn btn-primary" style="width: 100%; margin-top: 14px;" onclick={() => { phase = 'decide'; }}>
					Got it →
				</button>
			</div>
		{/if}

		{#if phase === 'decide'}
			<div class="anim-float">
				<div class="confidence-section">
					<div class="confidence-header">
						<span class="eyebrow">Confidence</span>
						<span class="mono confidence-value">{confidence}%</span>
					</div>
					<input
						type="range"
						min="20"
						max="100"
						bind:value={confidence}
						class="confidence-slider"
					/>
					<div class="confidence-hint">
						Right + bold = bigger XP. Wrong + bold = bigger lesson.
					</div>
				</div>

				<div class="action-grid">
					<button class="action-btn action-fold" onclick={() => choose('fold')}>
						<div class="action-icon">🗑️</div>
						<div class="action-label">Fold</div>
					</button>
					<button class="action-btn action-call" onclick={() => choose('call')}>
						<div class="action-icon">➡️</div>
						<div class="action-label">Call $4</div>
					</button>
					<button class="action-btn action-raise" onclick={() => choose('raise')}>
						<div class="action-icon">🔥</div>
						<div class="action-label">3-bet $14</div>
					</button>
				</div>
			</div>
		{/if}

		{#if phase === 'reveal'}
			<div class="anim-float reveal-panel" class:reveal-correct={correct} class:reveal-wrong={!correct}>
				<div class="reveal-header">
					<div class="eyebrow reveal-verdict">
						{correct ? '✓ Correct' : '✗ Not quite'}
					</div>
					<div class="mono reveal-xp">
						{correct ? `+${xpResult}` : xpResult} XP
					</div>
				</div>
				<div class="reveal-explanation">
					AKs vs an UTG min-raiser is a <em class="serif" style="color: var(--coral-soft);">premium 3-bet</em>.
					You either fold out his marginal stuff or build a pot you'll often win.
				</div>
				<button class="btn btn-cream" style="width: 100%; margin-top: 14px;" onclick={nextHand}>
					{handNumber >= totalHands ? 'Finish session' : 'Next hand →'}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.screen {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--felt);
	}

	.scenario {
		padding: 4px 24px 0;
	}

	.scenario-text {
		font-size: 26px;
		line-height: 1.1;
		margin-top: 6px;
	}

	.table-felt {
		flex: 1;
		position: relative;
		margin: 20px 16px 0;
		border-radius: 32px;
		background: radial-gradient(ellipse at center, var(--felt-3) 0%, var(--felt) 70%);
		border: 1px solid var(--hairline-strong);
		box-shadow: inset 0 0 60px rgba(0,0,0,0.4);
		overflow: hidden;
	}

	.opponent-zone {
		position: absolute;
		top: 24px;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.opponent-avatar {
		width: 56px;
		height: 56px;
		border-radius: 999px;
		background: #2a1a14;
		border: 2px solid var(--hairline-strong);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
	}

	.opponent-label {
		font-size: 11px;
		margin-top: 6px;
		color: var(--cream-dim);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.tell-meter {
		margin-top: 10px;
		padding: 6px 12px;
		background: rgba(0,0,0,0.5);
		border-radius: 999px;
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid rgba(255,91,72,0.3);
	}

	.tell-track {
		width: 80px;
		height: 4px;
		border-radius: 2px;
		background: rgba(245,233,212,0.15);
		overflow: hidden;
	}

	.tell-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--gold), var(--coral));
		transition: width 100ms linear;
	}

	.tell-label {
		font-size: 10px;
		color: var(--gold);
	}

	.opponent-cards {
		position: absolute;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 4px;
	}

	.pot-zone {
		position: absolute;
		top: 46%;
		left: 0;
		right: 0;
		text-align: center;
	}

	.pot-amount {
		font-size: 22px;
		font-weight: 700;
		color: var(--gold);
	}

	.pot-chips {
		display: inline-flex;
		gap: 2px;
		margin-top: 4px;
	}

	.chip-sm :global(.chip) {
		width: 22px;
		height: 22px;
		font-size: 9px;
	}

	.hero-cards {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 6px;
	}

	.decision-panel {
		padding: 20px 20px 28px;
	}

	.read-panel {
		text-align: center;
		padding: 12px;
	}

	.read-hint {
		font-size: 14px;
		color: var(--cream-dim);
		margin-top: 6px;
	}

	.confidence-section {
		padding: 0 4px 16px;
	}

	.confidence-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.confidence-value {
		font-size: 12px;
		font-weight: 700;
		color: var(--coral);
	}

	.confidence-slider {
		width: 100%;
		accent-color: var(--coral);
	}

	.confidence-hint {
		font-size: 11px;
		color: var(--cream-dim);
		text-align: center;
		margin-top: 4px;
	}

	.action-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 8px;
	}

	.action-btn {
		border-radius: 14px;
		padding: 14px 8px;
		cursor: pointer;
		font-family: inherit;
		border: 1.5px solid var(--hairline-strong);
	}

	.action-btn:active {
		opacity: 0.85;
		transform: translateY(1px);
	}

	.action-fold {
		background: rgba(245,233,212,0.06);
		color: var(--cream);
	}

	.action-call {
		background: rgba(233,185,73,0.1);
		color: var(--gold-soft);
		border-color: rgba(233,185,73,0.4);
	}

	.action-raise {
		background: var(--coral);
		color: #2a0a05;
		border-color: var(--coral);
		box-shadow: 0 4px 0 #b03d30;
	}

	.action-icon {
		font-size: 18px;
		margin-bottom: 4px;
	}

	.action-label {
		font-size: 13px;
		font-weight: 600;
	}

	.reveal-panel {
		border-radius: 18px;
		padding: 18px;
	}

	.reveal-correct {
		background: rgba(72,200,120,0.12);
		border: 1px solid rgba(72,200,120,0.4);
	}

	.reveal-wrong {
		background: rgba(255,91,72,0.12);
		border: 1px solid rgba(255,91,72,0.4);
	}

	.reveal-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8px;
	}

	.reveal-verdict {
		color: #7adb9c;
	}

	.reveal-wrong .reveal-verdict {
		color: var(--coral-soft);
	}

	.reveal-xp {
		font-size: 14px;
		font-weight: 700;
		color: #7adb9c;
	}

	.reveal-wrong .reveal-xp {
		color: var(--coral-soft);
	}

	.reveal-explanation {
		font-size: 14px;
		line-height: 1.4;
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
