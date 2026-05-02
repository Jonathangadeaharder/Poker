<script lang="ts">
import type { DaySchedule } from '$lib/data/trainingPlan';
import { TRAINING_PATHS, TRAINING_SCHEDULE } from '$lib/data/trainingPlan';

let selectedPath = $state<'CASH_GAME' | 'MTT'>('CASH_GAME');
let expandedDay = $state<number | null>(null);
let completedModules = $state<Record<string, boolean>>({});

const schedule = $derived(TRAINING_SCHEDULE[selectedPath]);
const currentPath = $derived(TRAINING_PATHS[selectedPath]);

const totalModules = $derived(schedule.reduce((sum, day) => sum + day.modules.length, 0));

const completedCount = $derived(Object.values(completedModules).filter(Boolean).length);

const progress = $derived(totalModules > 0 ? completedCount / totalModules : 0);

const totalHours = $derived(schedule.reduce((sum, day) => sum + day.totalHours, 0));

const completedHours = $derived(
	schedule.reduce(
		(sum, day, di) =>
			sum +
			day.modules.reduce(
				(dSum, _, mi) =>
					dSum + (completedModules[`${di}-${mi}`] ? day.totalHours / day.modules.length : 0),
				0
			),
		0
	)
);

function storageKey() {
	return `tilt_progress_${selectedPath}`;
}

function loadProgress() {
	try {
		const saved = localStorage.getItem(storageKey());
		completedModules = saved ? JSON.parse(saved) : {};
	} catch {
		completedModules = {};
	}
}

function saveProgress(newCompleted: Record<string, boolean>) {
	try {
		localStorage.setItem(storageKey(), JSON.stringify(newCompleted));
	} catch {}
}

function toggleModule(dayIndex: number, moduleIndex: number) {
	const key = `${dayIndex}-${moduleIndex}`;
	completedModules = { ...completedModules, [key]: !completedModules[key] };
	saveProgress(completedModules);
}

function resetProgress() {
	completedModules = {};
	try {
		localStorage.removeItem(storageKey());
	} catch {}
}

function dayCompleted(dayIndex: number, day: DaySchedule): number {
	return day.modules.filter((_, mi) => completedModules[`${dayIndex}-${mi}`]).length;
}

const moduleIcons: Record<string, string> = {
	drill: '🎯',
	video: '▶️',
	play: '🃏',
	review: '📊',
	theory: '📖',
	assessment: '📋'
};

const moduleColors: Record<string, string> = {
	drill: 'var(--coral)',
	video: '#4a9eff',
	play: 'var(--gold)',
	review: '#ff9f43',
	theory: '#a855f7',
	assessment: '#22c55e'
};

$effect(() => {
	loadProgress();
});
</script>

<div class="screen felt-bg">
	<TopBar onBack={() => goto('/home')}>
		{#snippet center()}
			Training Plan
		{/snippet}
	</TopBar>

	<div class="scroll-content">
		<!-- Path Selector -->
		<div class="path-selector">
			{#each Object.entries(TRAINING_PATHS) as [key, path]}
				<button
					class="path-btn"
					class:active={selectedPath === key}
					style={selectedPath === key ? `background: ${path.color}; border-color: ${path.color};` : ''}
					onclick={() => {
						selectedPath = key as 'CASH_GAME' | 'MTT';
						expandedDay = null;
						loadProgress();
					}}
				>
					<div class="path-btn-title">{key === 'CASH_GAME' ? 'Cash Game' : 'MTT'}</div>
					<div class="path-btn-sub">{path.subtitle}</div>
				</button>
			{/each}
		</div>
		<p class="path-desc">{currentPath.description}</p>

		<!-- Progress Overview -->
		<div class="progress-card">
			<div class="progress-header">
				<span class="eyebrow">Progress</span>
				<span class="mono progress-pct">{Math.round(progress * 100)}%</span>
			</div>
			<div class="progress-track">
				<div class="progress-fill" style="width: {progress * 100}%; background: {currentPath.color};"></div>
			</div>
			<div class="stats-row">
				<div class="stat">
					<div class="stat-value">{Math.round(totalHours)}h</div>
					<div class="stat-label">Total</div>
				</div>
				<div class="stat">
					<div class="stat-value">{Math.round(completedHours)}h</div>
					<div class="stat-label">Done</div>
				</div>
				<div class="stat">
					<div class="stat-value">{Math.max(0, Math.round(totalHours - completedHours))}h</div>
					<div class="stat-label">Left</div>
				</div>
			</div>
			<button class="btn btn-ghost reset-btn" onclick={resetProgress}>Reset progress</button>
		</div>

		<!-- Schedule -->
		<div class="section-title">7-Day Plan</div>
		{#each schedule as day, di}
			{@const isOpen = expandedDay === di}
			{@const done = dayCompleted(di, day)}
			<button type="button" class="day-card" onclick={() => { expandedDay = isOpen ? null : di; }}>
				<div class="day-header">
					<div class="day-info">
						<div class="day-title">{day.title}</div>
						<div class="day-hours mono">{day.totalHours}h</div>
					</div>
					<div class="day-right">
						<span class="mono day-count">{done}/{day.modules.length}</span>
						<span class="day-chevron">{isOpen ? '▲' : '▼'}</span>
					</div>
				</div>
			</button>
			{#if isOpen}
				<div class="day-modules">
					{#each day.modules as mod, mi}
						{@const key = `${di}-${mi}`}
						{@const isDone = completedModules[key]}
						<div class="module-row" class:module-done={isDone}>
							<button
								type="button"
								class="module-check"
								onclick={(e) => { e.stopPropagation(); toggleModule(di, mi); }}
							>
								{isDone ? '✅' : '⬜'}
							</button>
							<div class="module-info">
								<div class="module-title">
									<span class="module-icon" style="color: {moduleColors[mod.type] || '#666'}">{moduleIcons[mod.type] || '●'}</span>
									{mod.title}
								</div>
								<div class="module-meta mono">{mod.hours}h{mod.description ? ` · ${mod.description}` : ''}</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.screen {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--felt);
	}

	.scroll-content {
		padding: 0 20px 100px;
		overflow-y: auto;
		flex: 1;
	}

	.path-selector {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 4px;
	}

	.path-btn {
		border-radius: 14px;
		padding: 14px;
		background: rgba(245,233,212,0.06);
		border: 1.5px solid var(--hairline-strong);
		color: var(--cream);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
	}

	.path-btn.active {
		color: #2a0a05;
		font-weight: 600;
	}

	.path-btn-title {
		font-size: 15px;
		font-weight: 600;
	}

	.path-btn-sub {
		font-size: 11px;
		opacity: 0.7;
		margin-top: 2px;
	}

	.path-desc {
		font-size: 13px;
		color: var(--cream-dim);
		margin: 8px 0 0;
		line-height: 1.4;
	}

	.progress-card {
		margin-top: 20px;
		padding: 18px;
		border-radius: 18px;
		background: rgba(245,233,212,0.06);
		border: 1px solid var(--hairline);
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.progress-pct {
		font-size: 13px;
		font-weight: 700;
		color: var(--coral);
	}

	.progress-track {
		height: 6px;
		border-radius: 3px;
		background: rgba(245,233,212,0.12);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 300ms ease;
	}

	.stats-row {
		display: flex;
		justify-content: space-around;
		margin-top: 14px;
	}

	.stat {
		text-align: center;
	}

	.stat-value {
		font-size: 20px;
		font-weight: 700;
		color: var(--cream);
	}

	.stat-label {
		font-size: 11px;
		color: var(--cream-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-top: 2px;
	}

	.reset-btn {
		width: 100%;
		margin-top: 14px;
		font-size: 12px;
	}

	.section-title {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cream-dim);
		margin-top: 28px;
		margin-bottom: 12px;
	}

	.day-card {
		display: block;
		width: 100%;
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
		border-radius: 14px;
		padding: 14px 16px;
		margin-bottom: 6px;
		cursor: pointer;
		color: var(--cream);
		font-family: inherit;
		text-align: left;
	}

	.day-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.day-title {
		font-size: 14px;
		font-weight: 600;
	}

	.day-hours {
		font-size: 11px;
		color: var(--cream-dim);
		margin-top: 2px;
	}

	.day-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.day-count {
		font-size: 12px;
		color: var(--gold);
	}

	.day-chevron {
		font-size: 10px;
		color: var(--cream-dim);
	}

	.day-modules {
		padding: 0 0 8px 8px;
	}

	.module-row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 12px;
		border-left: 2px solid var(--hairline-strong);
		margin-left: 6px;
	}

	.module-done {
		opacity: 0.6;
	}

	.module-check {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 16px;
		padding: 0;
		line-height: 1;
		flex-shrink: 0;
	}

	.module-info {
		flex: 1;
		min-width: 0;
	}

	.module-title {
		font-size: 13px;
		font-weight: 600;
		color: var(--cream);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.module-icon {
		font-size: 14px;
	}

	.module-meta {
		font-size: 11px;
		color: var(--cream-dim);
		margin-top: 2px;
	}
</style>
