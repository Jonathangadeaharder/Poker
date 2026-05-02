<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import { goto } from '$app/navigation';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import Confetti from '$lib/components/Confetti.svelte';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import TopBar from '$lib/components/TopBar.svelte';
import { XP_REWARDS } from '$lib/core/gamification';
import soundManager, { SOUND_EVENTS } from '$lib/core/soundManager';
import type { QuizQuestion } from '$lib/data/miniGames';
import { generateMixedQuiz } from '$lib/data/miniGames';

let quiz = $state<QuizQuestion[]>(generateMixedQuiz(10, 'mixed'));
let currentIndex = $state(0);
let selectedAnswer = $state<string | null>(null);
let showFeedback = $state(false);
let score = $state(0);
let totalXP = $state(0);
let isComplete = $state(false);
let showConfetti = $state(false);
let answerRevealed = $state(false);

const currentQuestion = $derived(quiz[currentIndex] ?? null);
const progress = $derived(quiz.length > 0 ? (currentIndex + 1) / quiz.length : 0);
const accuracy = $derived(quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0);
const isPerfect = $derived(score === quiz.length && quiz.length > 0);

async function handleAnswer(answer: string) {
	if (showFeedback || !currentQuestion) return;
	selectedAnswer = answer;
	showFeedback = true;
	answerRevealed = true;

	const correct = answer === currentQuestion.correctAnswer;
	if (correct) {
		score += 1;
		totalXP += currentQuestion.points;
		await soundManager.playSound(SOUND_EVENTS.CORRECT_ANSWER);
	} else {
		await soundManager.playSound(SOUND_EVENTS.WRONG_ANSWER);
	}
}

async function handleNext() {
	if (!currentQuestion) return;

	if (currentIndex + 1 >= quiz.length) {
		isComplete = true;
		if (isPerfect) {
			await soundManager.playSound(SOUND_EVENTS.QUIZ_PERFECT);
			totalXP += XP_REWARDS.QUIZ_PERFECT;
		} else if (accuracy >= 70) {
			totalXP += XP_REWARDS.QUIZ_GOOD;
		} else {
			totalXP += XP_REWARDS.QUIZ_COMPLETED;
		}
		showConfetti = isPerfect;
	} else {
		currentIndex += 1;
		selectedAnswer = null;
		showFeedback = false;
		answerRevealed = false;
	}
}

function handlePlayAgain() {
	quiz = generateMixedQuiz(10, 'mixed');
	currentIndex = 0;
	selectedAnswer = null;
	showFeedback = false;
	score = 0;
	totalXP = 0;
	isComplete = false;
	showConfetti = false;
	answerRevealed = false;
}
</script>

<div class="screen felt-bg">
	<Confetti active={showConfetti} />

	<TopBar onBack={() => goto('/practice')}>
		{#snippet center()}Quiz{/snippet}
	</TopBar>

	<div class="scroll-content">
		{#if !isComplete && currentQuestion}
			<!-- Progress Bar -->
			<div class="progress-wrap">
				<div class="progress-bar" style="width: {progress * 100}%"></div>
			</div>
			<div class="progress-label">
				<span class="eyebrow">{currentIndex + 1} / {quiz.length}</span>
				<span class="eyebrow">{score} correct</span>
			</div>

			<!-- Question Card -->
			<div class="question-card anim-float">
				<div class="question-meta">
					<span class="category-chip">{currentQuestion.category}</span>
					<span class="difficulty-chip" class:easy={currentQuestion.difficulty === 'easy'} class:medium={currentQuestion.difficulty === 'medium'} class:hard={currentQuestion.difficulty === 'hard'}>
						{currentQuestion.difficulty}
					</span>
				</div>
				<p class="question-text">{currentQuestion.question}</p>
				<span class="points-label">+{currentQuestion.points} XP</span>
			</div>

			<!-- Answer Options -->
			<div class="answers">
				{#each currentQuestion.answers as answer, i (answer)}
					{@const isCorrect = answer === currentQuestion.correctAnswer}
					{@const isSelected = answer === selectedAnswer}
					<button
						class="answer-btn"
						class:correct={answerRevealed && isCorrect}
						class:wrong={answerRevealed && isSelected && !isCorrect}
						class:dimmed={answerRevealed && !isCorrect && !isSelected}
						class:anim-shake={answerRevealed && isSelected && !isCorrect}
						onclick={() => handleAnswer(answer)}
						disabled={showFeedback}
					>
						<span class="answer-letter">{String.fromCharCode(65 + i)}</span>
						<span class="answer-text">{answer}</span>
					</button>
				{/each}
			</div>

			<!-- Feedback Card -->
			{#if showFeedback}
				<div class="feedback-card" class:feedback-correct={selectedAnswer === currentQuestion.correctAnswer} class:feedback-wrong={selectedAnswer !== currentQuestion.correctAnswer}>
					<div class="feedback-header">
						{#if selectedAnswer === currentQuestion.correctAnswer}
							<span class="feedback-icon">&#10003;</span>
							<span class="feedback-title">Correct!</span>
						{:else}
							<span class="feedback-icon">&#10007;</span>
							<span class="feedback-title">Incorrect</span>
						{/if}
					</div>
					<p class="feedback-explanation">{currentQuestion.explanation}</p>
				</div>

				<button class="btn btn-primary next-btn" onclick={handleNext}>
					{currentIndex + 1 >= quiz.length ? 'See Results' : 'Next Question'}
				</button>
			{/if}

		{:else}
			<!-- Results Screen -->
			<div class="results-wrap anim-float">
				<div class="results-emoji">
					{#if isPerfect}&#127942;{:else if accuracy >= 70}&#127881;{:else}&#127919;{/if}
				</div>
				<h2 class="results-title serif">
					{#if isPerfect}Perfect Score!{:else if accuracy >= 70}Great Job!{:else}Quiz Complete{/if}
				</h2>
				<p class="results-sub">
					{#if isPerfect}You answered every question correctly!{:else if accuracy >= 70}Strong performance. Keep studying!{:else}Practice makes perfect. Try again!{/if}
				</p>

				<!-- Stats Grid -->
				<div class="stats-grid">
					<div class="stat-card">
						<span class="stat-value mono">{score}/{quiz.length}</span>
						<span class="stat-label eyebrow">Score</span>
					</div>
					<div class="stat-card">
						<span class="stat-value mono">{accuracy}%</span>
						<span class="stat-label eyebrow">Accuracy</span>
					</div>
					<div class="stat-card">
						<span class="stat-value mono">+{totalXP}</span>
						<span class="stat-label eyebrow">XP Earned</span>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="results-actions">
					<button class="btn btn-primary" onclick={handlePlayAgain}>Play Again</button>
					<button class="btn btn-ghost" onclick={() => goto('/practice')}>Done</button>
				</div>
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
		margin-bottom: 20px;
	}

	/* Question Card */
	.question-card {
		background: rgba(245, 233, 212, 0.04);
		border: 1px solid var(--hairline);
		border-radius: 16px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.question-meta {
		display: flex;
		gap: 8px;
		margin-bottom: 14px;
	}

	.category-chip {
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(245, 233, 212, 0.08);
		border: 1px solid var(--hairline);
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cream-dim);
	}

	.difficulty-chip {
		padding: 4px 10px;
		border-radius: 999px;
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: rgba(245, 233, 212, 0.08);
		border: 1px solid var(--hairline);
		color: var(--cream-dim);
	}

	.difficulty-chip.easy {
		background: rgba(34, 197, 94, 0.15);
		border-color: rgba(34, 197, 94, 0.3);
		color: #22c55e;
	}

	.difficulty-chip.medium {
		background: rgba(233, 185, 73, 0.15);
		border-color: rgba(233, 185, 73, 0.3);
		color: var(--gold);
	}

	.difficulty-chip.hard {
		background: rgba(255, 91, 72, 0.15);
		border-color: rgba(255, 91, 72, 0.3);
		color: var(--coral);
	}

	.question-text {
		font-size: 17px;
		font-weight: 600;
		color: var(--cream);
		line-height: 1.5;
		white-space: pre-line;
		margin-bottom: 12px;
	}

	.points-label {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--gold);
		font-weight: 700;
	}

	/* Answers */
	.answers {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 16px;
	}

	.answer-btn {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px;
		background: rgba(245, 233, 212, 0.04);
		border: 1.5px solid var(--hairline-strong);
		border-radius: 14px;
		color: var(--cream);
		font-size: 15px;
		font-family: inherit;
		cursor: pointer;
		text-align: left;
		transition: background 200ms ease, border-color 200ms ease, transform 120ms ease;
	}

	.answer-btn:active:not(:disabled) {
		transform: scale(0.98);
	}

	.answer-btn:disabled {
		cursor: default;
	}

	.answer-btn.correct {
		background: rgba(34, 197, 94, 0.15);
		border-color: #22c55e;
	}

	.answer-btn.wrong {
		background: rgba(255, 91, 72, 0.15);
		border-color: var(--coral);
	}

	.answer-btn.dimmed {
		opacity: 0.4;
	}

	.answer-letter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: rgba(245, 233, 212, 0.08);
		border: 1px solid var(--hairline);
		font-family: var(--mono);
		font-size: 13px;
		font-weight: 700;
		color: var(--cream-dim);
		flex-shrink: 0;
	}

	.answer-btn.correct .answer-letter {
		background: #22c55e;
		border-color: #22c55e;
		color: #0a1d15;
	}

	.answer-btn.wrong .answer-letter {
		background: var(--coral);
		border-color: var(--coral);
		color: #0a1d15;
	}

	.answer-text {
		flex: 1;
		white-space: pre-line;
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
		margin-bottom: 8px;
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

	.feedback-explanation {
		font-size: 13px;
		color: var(--cream-dim);
		line-height: 1.5;
		white-space: pre-line;
	}

	.next-btn {
		width: 100%;
		margin-bottom: 12px;
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
		grid-template-columns: repeat(3, 1fr);
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
