<script lang="ts">
import TopBar from '$lib/components/TopBar.svelte';
import { goto } from '$app/navigation';
import { createPokerDecks, StudySession, DIFFICULTY_RATINGS } from '$lib/core/spacedRepetition';
import type { Deck, DeckStats, SessionSummary, QualityRating } from '$lib/core/spacedRepetition';
import soundManager, { SOUND_EVENTS } from '$lib/core/soundManager';
import { XP_REWARDS } from '$lib/core/gamification';

const DECK_META: Record<string, { icon: string; color: string }> = {
	'Preflop Ranges (6-Max)': { icon: '🃏', color: 'var(--gold)' },
	'Push/Fold Charts (MTT)': { icon: '📊', color: 'var(--coral)' },
	'Exploitative Strategies': { icon: '🎯', color: '#22c55e' },
	'Concepts & Theory': { icon: '🧠', color: '#7c6cf0' }
};

let decks = $state<Deck[]>([]);
let selectedDeck = $state<Deck | null>(null);
let session = $state<StudySession | null>(null);
let showAnswer = $state(false);
let sessionSummary = $state<SessionSummary | null>(null);
let totalXP = $state(0);
let lastResult = $state<{ success: boolean; interval: number } | null>(null);

const currentCard = $derived(session?.getCurrentCard() ?? null);
const sessionCards = $derived(session?.cardsToday.length ?? 0);
const currentIndex = $derived(session?.currentIndex ?? 0);
const progress = $derived(sessionCards > 0 ? currentIndex / sessionCards : 0);

const deckStats = $derived(decks.map((d) => ({ deck: d, stats: d.getStats() })));

const ratingButtons: { label: string; quality: QualityRating; xp: number; preview: string }[] = [
	{ label: 'Again', quality: DIFFICULTY_RATINGS.AGAIN, xp: 0, preview: '<1m' },
	{ label: 'Hard', quality: DIFFICULTY_RATINGS.HARD, xp: XP_REWARDS.CARD_REVIEW_HARD, preview: '6m' },
	{ label: 'Good', quality: DIFFICULTY_RATINGS.GOOD, xp: XP_REWARDS.CARD_REVIEW_GOOD, preview: '1d' },
	{ label: 'Easy', quality: DIFFICULTY_RATINGS.EASY, xp: XP_REWARDS.CARD_REVIEW_EASY, preview: '4d' }
];

$effect(() => {
	decks = createPokerDecks();
});

function startSession(deck: Deck) {
	const s = new StudySession(deck, 5, 20);
	const info = s.startSession();
	if (info.totalCards === 0) return;
	session = s;
	selectedDeck = deck;
	showAnswer = false;
	sessionSummary = null;
	totalXP = 0;
	lastResult = null;
	soundManager.playSound(SOUND_EVENTS.SESSION_START);
}

async function handleRating(quality: QualityRating) {
	if (!session || !currentCard) return;
	const result = session.submitAnswer(quality);
	if (!result) return;

	lastResult = { success: result.success, interval: result.interval };

	if (result.success) {
		await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
		const ratingXP =
			quality === DIFFICULTY_RATINGS.EASY
				? XP_REWARDS.CARD_REVIEW_EASY
				: quality === DIFFICULTY_RATINGS.GOOD
					? XP_REWARDS.CARD_REVIEW_GOOD
					: XP_REWARDS.CARD_REVIEW_HARD;
		totalXP += ratingXP;
	} else {
		await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
	}

	const next = session.getCurrentCard();
	if (!next) {
		sessionSummary = session.getSessionSummary();
		await soundManager.playSound(SOUND_EVENTS.SESSION_COMPLETE);
	} else {
		showAnswer = false;
		lastResult = null;
	}
}

function handlePlayAgain() {
	if (selectedDeck) startSession(selectedDeck);
}

function handleBackToDecks() {
	session = null;
	selectedDeck = null;
	showAnswer = false;
	sessionSummary = null;
	totalXP = 0;
	lastResult = null;
	decks = createPokerDecks();
}
</script>

<div class="screen felt-bg">
	<TopBar onBack={() => goto('/practice')}>
		{#snippet center()}SRS Flashcards{/snippet}
	</TopBar>

	<div class="scroll-content">
		{#if sessionSummary}
			<!-- Session Complete -->
			<div class="results-wrap anim-float">
				<div class="results-emoji">&#127942;</div>
				<h2 class="results-title serif">Session Complete</h2>
				<p class="results-sub">
					Reviewed {sessionSummary.newCards + sessionSummary.reviews} cards
					{#if sessionSummary.accuracy >= 90} — excellent retention!{:else if sessionSummary.accuracy >= 70} — solid work.{:else} — keep practicing!{/if}
				</p>

				<div class="stats-grid">
					<div class="stat-card">
						<span class="stat-value mono">{sessionSummary.newCards}</span>
						<span class="stat-label eyebrow">New Cards</span>
					</div>
					<div class="stat-card">
						<span class="stat-value mono">{sessionSummary.reviews}</span>
						<span class="stat-label eyebrow">Reviews</span>
					</div>
					<div class="stat-card">
						<span class="stat-value mono">{sessionSummary.accuracy}%</span>
						<span class="stat-label eyebrow">Accuracy</span>
					</div>
					<div class="stat-card">
						<span class="stat-value mono">+{totalXP}</span>
						<span class="stat-label eyebrow">XP Earned</span>
					</div>
				</div>

				<div class="results-actions">
					<button class="btn btn-primary" onclick={handlePlayAgain}>Play Again</button>
					<button class="btn btn-ghost" onclick={handleBackToDecks}>Back to Decks</button>
					<button class="btn btn-ghost" onclick={() => goto('/practice')}>Done</button>
				</div>
			</div>

		{:else if session && currentCard}
			<!-- Active Session -->
			<div class="progress-wrap">
				<div class="progress-bar" style="width: {progress * 100}%"></div>
			</div>
			<div class="progress-label">
				<span class="eyebrow">{currentIndex + 1} / {sessionCards}</span>
				<span class="eyebrow">{selectedDeck?.name ?? ''}</span>
			</div>

			<!-- Flashcard with flip -->
			<button
				type="button"
				class="flashcard-container"
				onclick={() => { if (!showAnswer) { showAnswer = true; soundManager.playSound(SOUND_EVENTS.CARD_FLIP); } }}
			>
				<div class="flashcard-inner" class:flipped={showAnswer}>
					<div class="flashcard-face flashcard-front">
						<span class="card-category eyebrow">{currentCard.category}</span>
						<p class="card-text">{currentCard.front}</p>
						<span class="tap-hint mono">Tap to reveal</span>
					</div>
					<div class="flashcard-face flashcard-back">
						<span class="card-category eyebrow">{currentCard.category}</span>
						<p class="card-text card-answer">{currentCard.back}</p>
					</div>
				</div>
			</button>

			<!-- Rating Buttons -->
			{#if showAnswer && lastResult === null}
				<div class="rating-row">
					{#each ratingButtons as rb}
						<button
							class="rating-btn"
							class:again={rb.quality === DIFFICULTY_RATINGS.AGAIN}
							class:hard={rb.quality === DIFFICULTY_RATINGS.HARD}
							class:good={rb.quality === DIFFICULTY_RATINGS.GOOD}
							class:easy={rb.quality === DIFFICULTY_RATINGS.EASY}
							onclick={() => handleRating(rb.quality)}
						>
							<span class="rating-label">{rb.label}</span>
							<span class="rating-preview mono">{rb.preview}</span>
							{#if rb.xp > 0}<span class="rating-xp mono">+{rb.xp}xp</span>{/if}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Feedback after rating -->
			{#if lastResult}
				<div class="feedback-card" class:feedback-correct={lastResult.success} class:feedback-wrong={!lastResult.success}>
					<div class="feedback-header">
						{#if lastResult.success}
							<span class="feedback-icon">&#10003;</span>
							<span class="feedback-title">Correct</span>
						{:else}
							<span class="feedback-icon">&#10007;</span>
							<span class="feedback-title">Again</span>
						{/if}
					</div>
					<p class="feedback-sub">
						Next review: {lastResult.interval === 0 ? 'now' : `${lastResult.interval}d`}
					</p>
				</div>
			{/if}

		{:else if session && !currentCard && !sessionSummary}
			<!-- Edge: session ended between checks -->
			<div class="results-wrap anim-float">
				<p class="results-sub">No cards to review.</p>
				<button class="btn btn-primary" onclick={handleBackToDecks}>Back to Decks</button>
			</div>

		{:else}
			<!-- Deck Selection -->
			<div class="deck-header">
				<h2 class="serif deck-title">Choose a Deck</h2>
				<p class="deck-sub">Spaced repetition for poker mastery</p>
			</div>

			<div class="deck-list">
				{#each deckStats as { deck, stats }}
					{@const meta = DECK_META[deck.name] ?? { icon: '🃏', color: 'var(--cream-dim)' }}
					<button
						type="button"
						class="deck-card"
						onclick={() => startSession(deck)}
						disabled={stats.total === 0}
					>
						<div class="deck-icon" style="color: {meta.color};">{meta.icon}</div>
						<div class="deck-info">
							<div class="deck-name">{deck.name}</div>
							<div class="deck-desc">{deck.description}</div>
							<div class="deck-stats-row">
								<span class="deck-stat"><span class="mono">{stats.total}</span> cards</span>
								<span class="deck-stat due"><span class="mono">{stats.due}</span> due</span>
								<span class="deck-stat new"><span class="mono">{stats.newCards}</span> new</span>
								<span class="deck-stat retention"><span class="mono">{stats.avgRetention}%</span> retention</span>
							</div>
						</div>
						<span class="deck-arrow">›</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.scroll-content {
		padding: 0 20px 100px;
		overflow-y: auto;
		flex: 1;
	}

	/* Deck Selection */
	.deck-header {
		text-align: center;
		padding: 20px 0 24px;
	}

	.deck-title {
		font-size: 28px;
		color: var(--cream);
		margin-bottom: 6px;
	}

	.deck-sub {
		font-size: 13px;
		color: var(--cream-dim);
	}

	.deck-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.deck-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 18px;
		background: rgba(245, 233, 212, 0.04);
		border: 1px solid var(--hairline);
		border-radius: 16px;
		color: var(--cream);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition: background 200ms ease, border-color 200ms ease;
	}

	.deck-card:active:not(:disabled) {
		background: rgba(245, 233, 212, 0.08);
	}

	.deck-card:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.deck-icon {
		font-size: 28px;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: rgba(245, 233, 212, 0.06);
		flex-shrink: 0;
	}

	.deck-info {
		flex: 1;
		min-width: 0;
	}

	.deck-name {
		font-size: 15px;
		font-weight: 700;
		margin-bottom: 2px;
	}

	.deck-desc {
		font-size: 12px;
		color: var(--cream-dim);
		margin-bottom: 8px;
	}

	.deck-stats-row {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.deck-stat {
		font-size: 11px;
		color: var(--cream-dim);
	}

	.deck-stat .mono {
		font-weight: 700;
	}

	.deck-stat.due .mono {
		color: var(--coral);
	}

	.deck-stat.new .mono {
		color: var(--gold);
	}

	.deck-stat.retention .mono {
		color: #22c55e;
	}

	.deck-arrow {
		font-size: 22px;
		color: var(--cream-dim);
		flex-shrink: 0;
	}

	/* Progress */
	.progress-wrap {
		height: 4px;
		background: rgba(245, 233, 212, 0.1);
		border-radius: 999px;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.progress-bar {
		height: 100%;
		background: var(--coral);
		border-radius: 999px;
		transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	/* Flashcard Flip */
	.flashcard-container {
		perspective: 1000px;
		width: 100%;
		min-height: 240px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		margin-bottom: 20px;
	}

	.flashcard-inner {
		position: relative;
		width: 100%;
		min-height: 240px;
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		transform-style: preserve-3d;
	}

	.flashcard-inner.flipped {
		transform: rotateY(180deg);
	}

	.flashcard-face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		border-radius: 20px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--hairline);
	}

	.flashcard-front {
		background: linear-gradient(135deg, rgba(245, 233, 212, 0.06), rgba(245, 233, 212, 0.02));
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.flashcard-back {
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.03));
		border-color: rgba(34, 197, 94, 0.25);
		transform: rotateY(180deg);
		overflow-y: auto;
	}

	.card-category {
		align-self: flex-start;
		margin-bottom: 12px;
	}

	.card-text {
		font-size: 17px;
		font-weight: 600;
		color: var(--cream);
		line-height: 1.5;
		white-space: pre-line;
		flex: 1;
	}

	.card-answer {
		font-size: 15px;
		font-weight: 500;
	}

	.tap-hint {
		font-size: 11px;
		color: var(--cream-dim);
		margin-top: 12px;
	}

	/* Rating Buttons */
	.rating-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
		margin-bottom: 16px;
	}

	.rating-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 14px 4px;
		border-radius: 14px;
		border: 1.5px solid var(--hairline);
		background: rgba(245, 233, 212, 0.04);
		color: var(--cream);
		cursor: pointer;
		font-family: inherit;
		transition: background 150ms ease, border-color 150ms ease, transform 120ms ease;
	}

	.rating-btn:active {
		transform: scale(0.96);
	}

	.rating-btn.again {
		border-color: rgba(255, 91, 72, 0.4);
		background: rgba(255, 91, 72, 0.08);
	}

	.rating-btn.hard {
		border-color: rgba(233, 185, 73, 0.4);
		background: rgba(233, 185, 73, 0.08);
	}

	.rating-btn.good {
		border-color: rgba(34, 197, 94, 0.4);
		background: rgba(34, 197, 94, 0.08);
	}

	.rating-btn.easy {
		border-color: rgba(124, 108, 240, 0.4);
		background: rgba(124, 108, 240, 0.08);
	}

	.rating-label {
		font-size: 13px;
		font-weight: 700;
	}

	.rating-preview {
		font-size: 11px;
		color: var(--cream-dim);
	}

	.rating-xp {
		font-size: 10px;
		color: var(--gold);
	}

	/* Feedback */
	.feedback-card {
		border-radius: 14px;
		padding: 16px;
		margin-bottom: 16px;
	}

	.feedback-card.feedback-correct {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.feedback-card.feedback-wrong {
		background: rgba(255, 91, 72, 0.1);
		border: 1px solid rgba(255, 91, 72, 0.3);
	}

	.feedback-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
	}

	.feedback-icon {
		font-size: 18px;
		font-weight: 700;
	}

	.feedback-correct .feedback-icon {
		color: #22c55e;
	}

	.feedback-wrong .feedback-icon {
		color: var(--coral);
	}

	.feedback-title {
		font-size: 15px;
		font-weight: 700;
		color: var(--cream);
	}

	.feedback-sub {
		font-size: 13px;
		color: var(--cream-dim);
	}

	/* Results */
	.results-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-top: 40px;
	}

	.results-emoji {
		font-size: 64px;
		margin-bottom: 16px;
	}

	.results-title {
		font-size: 32px;
		color: var(--cream);
		margin-bottom: 8px;
	}

	.results-sub {
		font-size: 14px;
		color: var(--cream-dim);
		margin-bottom: 32px;
		max-width: 280px;
		line-height: 1.4;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
		width: 100%;
		margin-bottom: 36px;
	}

	.stat-card {
		background: rgba(245, 233, 212, 0.04);
		border: 1px solid var(--hairline);
		border-radius: 14px;
		padding: 16px 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.stat-value {
		font-size: 22px;
		font-weight: 700;
		color: var(--cream);
	}

	.stat-label {
		font-size: 10px;
	}

	.results-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}
</style>
