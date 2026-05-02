<script lang="ts">
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';
import { profileStore } from '$lib/stores/profile.svelte';
import { calculateLevel } from '$lib/core/gamification';
import TopBar from '$lib/components/TopBar.svelte';
import StreakBadge from '$lib/components/StreakBadge.svelte';
import ProgressRing from '$lib/components/ProgressRing.svelte';
import PlayingCard from '$lib/components/PlayingCard.svelte';

const DAILY_GOAL = 100;

const moods = [
	{ emoji: '⚡', title: 'Just 5 min', sub: 'Quick drill', bg: 'rgba(255,91,72,0.12)', border: 'rgba(255,91,72,0.3)' },
	{ emoji: '🧠', title: 'Feel smart', sub: 'Easy wins', bg: 'rgba(233,185,73,0.12)', border: 'rgba(233,185,73,0.3)' },
	{ emoji: '🔥', title: 'Challenge', sub: 'Hard mode', bg: 'rgba(178,76,228,0.12)', border: 'rgba(178,76,228,0.3)' },
	{ emoji: '🎬', title: 'Replay', sub: 'Last session', bg: 'rgba(72,180,255,0.12)', border: 'rgba(72,180,255,0.3)' }
] as const;

const skillTree = [
	{ title: 'Preflop ranges', progress: 100, status: 'Mastered', color: 'var(--gold)', locked: false },
	{ title: 'Continuation betting', progress: 65, status: 'In progress', color: 'var(--coral)', locked: false },
	{ title: 'River decisions', progress: 0, status: 'Locked · Lvl 5', color: 'var(--cream-dim)', locked: true }
] as const;

$effect(() => {
	if (!auth.loading && auth.isAuthenticated && auth.user) {
		const userId = auth.user.id;
		profileStore.fetchProfile(userId);
		const d = new Date();
		const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		profileStore.fetchDailyProgress(userId, today);
		profileStore.fetchTrainingProgress(userId);
	}
});

const profile = $derived(profileStore.profile);
const dailyProgress = $derived(profileStore.dailyProgress);
const levelResult = $derived(profile ? calculateLevel(profile.xp) : null);
const xpToday = $derived(dailyProgress?.xp_earned ?? 0);
const xpPercent = $derived(Math.min(100, Math.max(0, Math.round((xpToday / DAILY_GOAL) * 100))));
const streak = $derived(profile?.streak_count ?? 0);
const username = $derived(profile?.username ?? 'Player');
const initial = $derived(username.charAt(0).toUpperCase());
const levelTitle = $derived(levelResult?.levelData.title ?? 'Poker Novice');
const level = $derived(levelResult?.level ?? 1);
const xpRemaining = $derived(Math.max(0, DAILY_GOAL - xpToday));

function handleMood(_mood: string) {
	goto('/lesson');
}
</script>

<div class="screen felt-bg">
	<TopBar>
		{#snippet left()}
			<div style="display: inline-flex; align-items: center; gap: 8px;">
				<div style="width: 36px; height: 36px; border-radius: 999px; background: linear-gradient(135deg, #ff5b48, #e9b949); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #2a0a05;">
					{initial}
				</div>
				<div>
					<div style="font-size: 13px; font-weight: 600;">Hey, {username}</div>
					<div class="mono" style="font-size: 10px; color: var(--cream-dim); text-transform: uppercase; letter-spacing: 0.1em;">
						Lvl {level} · {levelTitle}
					</div>
				</div>
			</div>
		{/snippet}
		{#snippet right()}
			<StreakBadge count={streak} />
		{/snippet}
	</TopBar>

	<div class="scroll-content">
		<!-- Daily progress hero -->
		<div class="hero-card">
			<div class="hero-glow"></div>
			<div class="eyebrow">Today</div>
			<div class="hero-row">
				<div>
					<div class="serif hero-xp">
						{xpToday}<span class="hero-xp-goal">/{DAILY_GOAL} xp</span>
					</div>
					<div class="hero-sub">Keep the streak hot 🔥</div>
				</div>
				<ProgressRing value={xpPercent} size={64} label="{xpPercent}%" />
			</div>
			<button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick={() => goto('/lesson')}>
				Continue session · {xpRemaining} xp left
			</button>
		</div>

		<!-- Hand of the Day -->
		<div class="section">
			<div class="section-header">
				<div class="eyebrow">Hand of the Day</div>
				<div class="mono" style="font-size: 10px; color: var(--gold);">2,847 PLAYING</div>
			</div>
			<button type="button" class="hand-card tap" onclick={() => goto('/lesson')}>
				<div class="hand-cards">
					<div style="transform: rotate(-8deg);">
						<PlayingCard rank="Q" suit="♥" size="md" treatment="classic" />
					</div>
					<div style="transform: rotate(8deg) translateX(-12px);">
						<PlayingCard rank="J" suit="♥" size="md" treatment="classic" delay={100} />
					</div>
				</div>
				<div class="eyebrow" style="color: var(--gold);">WED · #284</div>
				<div class="serif hand-title">
					QJ suited on a wet board. Hero or zero?
				</div>
				<div class="hand-footer">
					<div class="hand-dots">
						{#each ['🟢','🟢','🟢','🟡','⚪'] as dot}
							<span style="font-size: 8px;">{dot}</span>
						{/each}
					</div>
					<div class="mono" style="font-size: 11px; color: var(--cream-dim);">3 MIN · +50 XP</div>
				</div>
			</button>
		</div>

		<!-- Mood picker -->
		<div class="section">
			<div class="eyebrow" style="margin-bottom: 12px;">What's the mood?</div>
			<div class="mood-grid">
				{#each moods as mood}
					<button
						type="button"
						class="mood-btn"
						style="background: {mood.bg}; border: 1px solid {mood.border};"
						onclick={() => handleMood(mood.title)}
					>
						<div style="font-size: 22px; margin-bottom: 6px;">{mood.emoji}</div>
						<div style="font-size: 14px; font-weight: 600;">{mood.title}</div>
						<div style="font-size: 11px; color: var(--cream-dim);">{mood.sub}</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Skill tree -->
		<div class="section">
			<div class="section-header">
				<div class="eyebrow">Your path</div>
				<div class="mono" style="font-size: 10px; color: var(--cream-dim);">3 / 18 MASTERED</div>
			</div>
			<div class="skill-tree">
				{#each skillTree as skill, i}
					<div class="skill-row" style="border-top: {i ? '1px solid var(--hairline)' : 'none'}; opacity: {skill.locked ? 0.5 : 1};">
						<div class="skill-bar" style="background: {skill.color};"></div>
						<div class="skill-info">
							<div style="font-size: 15px; font-weight: 600;">{skill.title}</div>
							<div class="mono" style="font-size: 10px; color: var(--cream-dim); text-transform: uppercase; letter-spacing: 0.08em;">
								{skill.status}
							</div>
						</div>
						<div class="skill-progress-track">
							<div class="skill-progress-fill" style="width: {skill.progress}%; background: {skill.color};"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
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

	.scroll-content {
		padding: 8px 20px 100px;
		overflow-y: auto;
		flex: 1;
	}

	.hero-card {
		margin-top: 12px;
		padding: 22px;
		border-radius: 24px;
		background: linear-gradient(180deg, rgba(255,91,72,0.18), rgba(255,91,72,0.04));
		border: 1px solid rgba(255,91,72,0.3);
		position: relative;
		overflow: hidden;
	}

	.hero-glow {
		position: absolute;
		top: -20px;
		right: -20px;
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255,91,72,0.25), transparent 70%);
	}

	.hero-row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: 8px;
	}

	.hero-xp {
		font-size: 44px;
		line-height: 1;
		color: var(--cream);
	}

	.hero-xp-goal {
		color: var(--cream-dim);
		font-size: 22px;
	}

	.hero-sub {
		font-size: 13px;
		color: var(--cream-dim);
		margin-top: 4px;
	}

	.section {
		margin-top: 28px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 12px;
	}

	.hand-card {
		display: block;
		width: 100%;
		border-radius: 22px;
		overflow: hidden;
		position: relative;
		background: linear-gradient(135deg, #1a3d2e 0%, #0e2a20 100%);
		border: 1px solid var(--hairline-strong);
		padding: 22px;
		height: 180px;
		cursor: pointer;
		text-align: left;
		color: var(--cream);
		font-family: inherit;
	}

	.hand-cards {
		position: absolute;
		right: 14px;
		top: 18px;
		display: flex;
	}

	.hand-title {
		font-size: 28px;
		line-height: 1.05;
		margin-top: 8px;
		max-width: 200px;
	}

	.hand-footer {
		position: absolute;
		bottom: 18px;
		left: 22px;
		right: 22px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.hand-dots {
		display: flex;
		gap: 6px;
	}

	.mood-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.mood-btn {
		border-radius: 16px;
		padding: 14px;
		color: var(--cream);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
	}

	.mood-btn:active {
		opacity: 0.8;
	}

	.skill-tree {
		background: rgba(245,233,212,0.04);
		border-radius: 22px;
		border: 1px solid var(--hairline);
		overflow: hidden;
	}

	.skill-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
	}

	.skill-bar {
		width: 8px;
		height: 40px;
		border-radius: 4px;
	}

	.skill-info {
		flex: 1;
	}

	.skill-progress-track {
		width: 50px;
		height: 4px;
		border-radius: 2px;
		background: rgba(245,233,212,0.1);
		overflow: hidden;
	}

	.skill-progress-fill {
		height: 100%;
	}
</style>
