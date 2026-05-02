<script lang="ts">
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import { goto } from '$app/navigation';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import TopBar from '$lib/components/TopBar.svelte';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import { ICM_GUIDELINES, PUSH_FOLD_CHARTS } from '$lib/data/pushFoldCharts';

let selectedStack = $state<'TWENTY_BB' | 'FIFTEEN_BB' | 'TEN_BB'>('TWENTY_BB');
let selectedAction = $state<'openShove' | 'reShove'>('openShove');
let selectedPosition = $state('BTN');

const currentStack = $derived(PUSH_FOLD_CHARTS[selectedStack]);

const stackColorMap: Record<string, string> = {
	TWENTY_BB: '#22c55e',
	FIFTEEN_BB: '#ff9800',
	TEN_BB: '#f44336'
};

const stackColor = $derived(stackColorMap[selectedStack] || '#666');

const currentOpenShove = $derived(
	selectedAction === 'openShove' ? currentStack.openShove[selectedPosition] : null
);

const reShoveEntries = $derived(
	selectedAction === 'reShove' ? Object.entries(currentStack.reShove || {}) : []
);
</script>

<div class="screen felt-bg">
	<TopBar onBack={() => goto('/home')}>
		{#snippet center()}
			Push/Fold Explorer
		{/snippet}
	</TopBar>

	<div class="scroll-content">
		<p class="subtitle">Nash Equilibrium ranges for MTT short-stack play</p>

		<!-- Stack Size Selector -->
		<div class="section-label">Stack Size</div>
		<div class="stack-row">
			{#each Object.entries(PUSH_FOLD_CHARTS) as [key, stack]}
				<button
					class="stack-btn"
					class:active={selectedStack === key}
					style={selectedStack === key ? `background: ${stackColorMap[key]}; border-color: ${stackColorMap[key]};` : ''}
					onclick={() => {
						selectedStack = key as 'TWENTY_BB' | 'FIFTEEN_BB' | 'TEN_BB';
						selectedPosition = 'BTN';
					}}
				>
					<div class="stack-label">{stack.stackSize}</div>
				</button>
			{/each}
		</div>
		<div class="scenario-pill mono">{currentStack.scenario}</div>

		<!-- Action Toggle -->
		<div class="action-row">
			<button
				class="action-btn"
				class:active={selectedAction === 'openShove'}
				onclick={() => { selectedAction = 'openShove'; }}
			>
				Open-Shove
			</button>
			<button
				class="action-btn"
				class:active={selectedAction === 'reShove'}
				onclick={() => { selectedAction = 'reShove'; }}
			>
				Re-Shove
			</button>
		</div>

		<!-- Position Selector (Open-Shove only) -->
		{#if selectedAction === 'openShove'}
			<div class="section-label">Position</div>
			<div class="position-row">
				{#each Object.keys(currentStack.openShove) as pos}
					<button
						class="pos-btn"
						class:active={selectedPosition === pos}
						onclick={() => { selectedPosition = pos; }}
					>
						{pos}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Chart Display -->
		{#if selectedAction === 'openShove' && currentOpenShove}
			<div class="chart-card">
				<div class="chart-header">
					<span class="chart-title">{currentOpenShove.position}</span>
					<span class="range-pill" style="background: {stackColor}">{currentOpenShove.range}</span>
				</div>
				<p class="chart-desc">{currentOpenShove.description}</p>
				<div class="hands-grid">
					{#each currentOpenShove.hands as hand}
						<span class="hand-chip">{hand}</span>
					{/each}
				</div>
			</div>
		{:else if selectedAction === 'reShove'}
			{#each reShoveEntries as [key, posData]}
				<div class="chart-card">
					<div class="chart-header">
						<span class="chart-title">{posData.scenario}</span>
						<span class="range-pill" style="background: {stackColor}">{posData.range}</span>
					</div>
					<p class="chart-desc">{posData.description}</p>
					<div class="hands-grid">
						{#each posData.hands as hand}
							<span class="hand-chip">{hand}</span>
						{/each}
					</div>
				</div>
			{/each}
		{/if}

		<!-- ICM Guidelines -->
		<div class="icm-card">
			<div class="icm-title">ICM Adjustments</div>

			<div class="icm-section">
				<div class="icm-subtitle">{ICM_GUIDELINES.BUBBLE.scenario}</div>
				<span class="icm-badge">{ICM_GUIDELINES.BUBBLE.adjustment}</span>
				<p class="icm-desc">{ICM_GUIDELINES.BUBBLE.description}</p>
				{#each ICM_GUIDELINES.BUBBLE.keyPoints as point}
					<div class="icm-point">• {point}</div>
				{/each}
			</div>

			<div class="icm-section">
				<div class="icm-subtitle">{ICM_GUIDELINES.FINAL_TABLE.scenario}</div>
				<span class="icm-badge">{ICM_GUIDELINES.FINAL_TABLE.adjustment}</span>
				<p class="icm-desc">{ICM_GUIDELINES.FINAL_TABLE.description}</p>
				{#each ICM_GUIDELINES.FINAL_TABLE.keyPoints as point}
					<div class="icm-point">• {point}</div>
				{/each}
			</div>
		</div>

		<!-- Note -->
		<div class="note-card">
			<div class="note-title">Important</div>
			<p class="note-text">
				These charts are for chip-EV situations (pre-bubble, no extreme pay jumps).
				At bubble and final table: play TIGHTER than these charts (see ICM adjustments).
				As big stack: play aggressively against medium stacks.
			</p>
		</div>
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

	.subtitle {
		font-size: 13px;
		color: var(--cream-dim);
		margin: 4px 0 16px;
		line-height: 1.4;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cream-dim);
		margin-bottom: 8px;
	}

	.stack-row {
		display: flex;
		gap: 8px;
		margin-bottom: 10px;
	}

	.stack-btn {
		flex: 1;
		padding: 14px;
		border-radius: 14px;
		background: rgba(245,233,212,0.06);
		border: 1.5px solid var(--hairline-strong);
		color: var(--cream);
		cursor: pointer;
		font-family: inherit;
		text-align: center;
	}

	.stack-btn.active {
		color: #2a0a05;
		font-weight: 700;
	}

	.stack-label {
		font-size: 16px;
		font-weight: 700;
	}

	.scenario-pill {
		display: inline-block;
		padding: 5px 12px;
		border-radius: 999px;
		background: rgba(245,233,212,0.08);
		border: 1px solid var(--hairline);
		font-size: 11px;
		color: var(--cream-dim);
		margin-bottom: 20px;
	}

	.action-row {
		display: flex;
		gap: 6px;
		margin-bottom: 16px;
	}

	.action-btn {
		flex: 1;
		padding: 10px;
		border-radius: 999px;
		background: rgba(245,233,212,0.06);
		border: 1px solid var(--hairline);
		color: var(--cream-dim);
		font-size: 13px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
	}

	.action-btn.active {
		background: var(--coral);
		border-color: var(--coral);
		color: #2a0a05;
	}

	.position-row {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}

	.pos-btn {
		padding: 8px 16px;
		border-radius: 999px;
		background: rgba(245,233,212,0.06);
		border: 1px solid var(--hairline);
		color: var(--cream-dim);
		font-size: 13px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
	}

	.pos-btn.active {
		background: #2d5f3f;
		border-color: #2d5f3f;
		color: #fff;
	}

	.chart-card {
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
		border-radius: 16px;
		padding: 16px;
		margin-bottom: 12px;
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.chart-title {
		font-size: 18px;
		font-weight: 700;
		color: var(--cream);
	}

	.range-pill {
		padding: 4px 12px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 700;
		color: #fff;
	}

	.chart-desc {
		font-size: 13px;
		color: var(--cream-dim);
		margin-bottom: 12px;
		line-height: 1.4;
	}

	.hands-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}

	.hand-chip {
		display: inline-block;
		padding: 4px 8px;
		border-radius: 8px;
		background: rgba(245,233,212,0.08);
		border: 1px solid var(--hairline);
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 700;
		color: var(--cream);
	}

	.icm-card {
		margin-top: 24px;
		background: rgba(34,197,94,0.1);
		border: 1px solid rgba(34,197,94,0.3);
		border-radius: 16px;
		padding: 18px;
	}

	.icm-title {
		font-size: 18px;
		font-weight: 700;
		color: #22c55e;
		margin-bottom: 16px;
	}

	.icm-section {
		margin-bottom: 16px;
	}

	.icm-subtitle {
		font-size: 15px;
		font-weight: 700;
		color: var(--cream);
		margin-bottom: 6px;
	}

	.icm-badge {
		display: inline-block;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(255,159,67,0.2);
		border: 1px solid rgba(255,159,67,0.4);
		font-size: 11px;
		font-weight: 700;
		color: #ff9f43;
		margin-bottom: 8px;
	}

	.icm-desc {
		font-size: 13px;
		color: var(--cream-dim);
		margin-bottom: 8px;
		line-height: 1.4;
	}

	.icm-point {
		font-size: 12px;
		color: var(--cream-dim);
		margin-bottom: 4px;
		line-height: 1.4;
	}

	.note-card {
		margin-top: 16px;
		background: rgba(255,159,67,0.1);
		border: 1px solid rgba(255,159,67,0.3);
		border-radius: 14px;
		padding: 16px;
	}

	.note-title {
		font-size: 14px;
		font-weight: 700;
		color: #ff9f43;
		margin-bottom: 8px;
	}

	.note-text {
		font-size: 13px;
		color: var(--cream-dim);
		line-height: 1.5;
	}
</style>
