<script lang="ts">
import type { Position } from '$lib/data/pokerRanges';
import { RFI_RANGES } from '$lib/data/pokerRanges';

let selectedCategory = $state<'RFI' | '3BET' | 'CALL'>('RFI');
let selectedPosition = $state<Position>('UTG');
let showHands = $state(false);

const categories = [
	{ key: 'RFI', label: 'RFI' },
	{ key: '3BET', label: '3-Bet' },
	{ key: 'CALL', label: 'Cold Call' }
] as const;

const currentRange = $derived(selectedCategory === 'RFI' ? RFI_RANGES[selectedPosition] : null);
</script>

<div class="screen felt-bg">
	<TopBar onBack={() => goto('/home')}>
		{#snippet center()}
			Range Trainer
		{/snippet}
	</TopBar>

	<div class="scroll-content">
		<p class="subtitle">GTO preflop ranges for 6-max cash games (100bb)</p>

		<!-- Category Tabs -->
		<div class="tabs">
			{#each categories as cat}
				<button
					class="tab-btn"
					class:active={selectedCategory === cat.key}
					onclick={() => {
						selectedCategory = cat.key;
						showHands = false;
						if (cat.key === 'RFI') selectedPosition = 'UTG';
					}}
				>
					{cat.label}
				</button>
			{/each}
		</div>

		{#if selectedCategory === 'RFI'}
			<!-- RFI Range Display -->
			{#if currentRange}
				<div class="range-card">
					<div class="range-header">
						<span class="range-title">{currentRange.position}</span>
						<span class="percent-pill">{currentRange.percentage}</span>
					</div>
					<p class="range-desc">{currentRange.description}</p>

					<div class="hands-section">
						<div class="hands-header">
							<span class="hands-title">Hands</span>
							<button class="toggle-btn" onclick={() => { showHands = !showHands; }}>
								{showHands ? 'Hide' : 'Show'}
							</button>
						</div>
						{#if showHands}
							<div class="hands-grid">
								{#each currentRange.hands as hand}
									<span class="hand-chip">{hand}</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Position Selector -->
			<div class="section-label">Position</div>
			<div class="position-grid">
				{#each Object.keys(RFI_RANGES) as pos}
					<button
						class="pos-btn"
						class:active={selectedPosition === pos}
						onclick={() => { selectedPosition = pos as Position; showHands = false; }}
					>
						{pos}
					</button>
				{/each}
			</div>

		{:else if selectedCategory === '3BET'}
			<!-- Linear Range -->
			<div class="strategy-card linear-card">
				<div class="strategy-title">{THREE_BET_RANGES.LINEAR.type}</div>
				<span class="usage-pill">{THREE_BET_RANGES.LINEAR.usage}</span>
				<p class="strategy-desc">{THREE_BET_RANGES.LINEAR.description}</p>
				<div class="hands-label">Hands</div>
				<div class="hands-grid">
					{#each THREE_BET_RANGES.LINEAR.hands as hand}
						<span class="hand-chip">{hand}</span>
					{/each}
				</div>
			</div>

			<!-- Polarized Range -->
			<div class="strategy-card polar-card">
				<div class="strategy-title">{THREE_BET_RANGES.POLAR.type}</div>
				<span class="usage-pill">{THREE_BET_RANGES.POLAR.usage}</span>
				<p class="strategy-desc">{THREE_BET_RANGES.POLAR.description}</p>

				<div class="hands-label">Value</div>
				<div class="hands-grid">
					{#each THREE_BET_RANGES.POLAR.valueHands as hand}
						<span class="hand-chip value-chip">{hand}</span>
					{/each}
				</div>

				<div class="hands-label">Bluff (Blockers)</div>
				<div class="hands-grid">
					{#each THREE_BET_RANGES.POLAR.bluffHands as hand}
						<span class="hand-chip bluff-chip">{hand}</span>
					{/each}
				</div>
			</div>

			<!-- When to use which -->
			<div class="tip-card">
				<div class="tip-title">When to use which?</div>
				<p class="tip-text">
					<strong>Linear:</strong> Against passive players who rarely 4-bet.
				</p>
				<p class="tip-text">
					<strong>Polarized:</strong> Against aggressive players who frequently 4-bet.
				</p>
				<p class="tip-text highlight">
					At micro-stakes: almost always use LINEAR.
				</p>
			</div>

		{:else if selectedCategory === 'CALL'}
			<!-- IP Cold Call -->
			<div class="strategy-card">
				<div class="strategy-title">{COLD_CALL_RANGES.IP.type}</div>
				<p class="strategy-desc">{COLD_CALL_RANGES.IP.description}</p>
				<div class="hands-label">Hands</div>
				<div class="hands-grid">
					{#each COLD_CALL_RANGES.IP.hands as hand}
						<span class="hand-chip">{hand}</span>
					{/each}
				</div>
			</div>

			<!-- OOP Cold Call -->
			<div class="strategy-card">
				<div class="strategy-title">{COLD_CALL_RANGES.OOP.type}</div>
				<p class="strategy-desc">{COLD_CALL_RANGES.OOP.description}</p>
				<div class="hands-label">Hands</div>
				<div class="hands-grid">
					{#each COLD_CALL_RANGES.OOP.hands as hand}
						<span class="hand-chip">{hand}</span>
					{/each}
				</div>
			</div>

			<!-- 10x Rule -->
			<div class="tip-card mining-tip">
				<div class="tip-title">10x Rule for Set Mining</div>
				<p class="tip-text">
					Call with small pairs (22-66) only when:
				</p>
				<p class="tip-text highlight">
					Effective stacks ≥ 10x the call amount
				</p>
				<p class="tip-text">
					Example: Villain raises 6bb → you need ≥ 60bb stack
				</p>
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

	.tabs {
		display: flex;
		gap: 6px;
		margin-bottom: 16px;
	}

	.tab-btn {
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
		text-align: center;
	}

	.tab-btn.active {
		background: #2d5f3f;
		border-color: #2d5f3f;
		color: #fff;
	}

	.section-label {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cream-dim);
		margin: 16px 0 8px;
	}

	/* RFI */
	.range-card {
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
		border-radius: 16px;
		padding: 16px;
		margin-bottom: 12px;
	}

	.range-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.range-title {
		font-size: 20px;
		font-weight: 700;
		color: var(--cream);
	}

	.percent-pill {
		padding: 4px 12px;
		border-radius: 999px;
		background: #2d5f3f;
		font-size: 12px;
		font-weight: 700;
		color: #fff;
	}

	.range-desc {
		font-size: 13px;
		color: var(--cream-dim);
		margin-bottom: 14px;
		line-height: 1.4;
	}

	.hands-section {
		border-top: 1px solid var(--hairline);
		padding-top: 12px;
	}

	.hands-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.hands-title {
		font-size: 14px;
		font-weight: 700;
		color: var(--cream);
	}

	.toggle-btn {
		padding: 6px 14px;
		border-radius: 999px;
		background: rgba(245,233,212,0.08);
		border: 1px solid var(--hairline);
		color: var(--cream);
		font-size: 12px;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
	}

	.position-grid {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
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

	/* 3-Bet & Cold Call */
	.strategy-card {
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
		border-radius: 16px;
		padding: 16px;
		margin-bottom: 12px;
	}

	.linear-card {
		border-color: rgba(72,180,255,0.3);
		background: rgba(72,180,255,0.06);
	}

	.polar-card {
		border-color: rgba(168,85,247,0.3);
		background: rgba(168,85,247,0.06);
	}

	.strategy-title {
		font-size: 18px;
		font-weight: 700;
		color: var(--cream);
		margin-bottom: 6px;
	}

	.usage-pill {
		display: inline-block;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(245,233,212,0.1);
		border: 1px solid var(--hairline);
		font-size: 11px;
		color: var(--cream-dim);
		margin-bottom: 10px;
	}

	.strategy-desc {
		font-size: 13px;
		color: var(--cream-dim);
		margin-bottom: 12px;
		line-height: 1.4;
	}

	.hands-label {
		font-size: 12px;
		font-weight: 700;
		color: var(--gold);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin: 10px 0 6px;
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

	.value-chip {
		background: rgba(34,197,94,0.2);
		border-color: rgba(34,197,94,0.4);
		color: #22c55e;
	}

	.bluff-chip {
		background: rgba(244,67,54,0.2);
		border-color: rgba(244,67,54,0.4);
		color: #f44336;
	}

	.tip-card {
		background: rgba(72,180,255,0.1);
		border: 1px solid rgba(72,180,255,0.3);
		border-radius: 14px;
		padding: 16px;
		margin-top: 4px;
	}

	.mining-tip {
		background: rgba(168,85,247,0.1);
		border-color: rgba(168,85,247,0.3);
	}

	.tip-title {
		font-size: 15px;
		font-weight: 700;
		color: var(--cream);
		margin-bottom: 8px;
	}

	.tip-text {
		font-size: 13px;
		color: var(--cream-dim);
		line-height: 1.5;
		margin-bottom: 4px;
	}

	.tip-text.highlight {
		color: var(--gold);
		font-weight: 700;
	}

	.tip-text strong {
		color: var(--cream);
	}
</style>
