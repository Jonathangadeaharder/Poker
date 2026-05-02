<script lang="ts">
import { goto } from '$app/navigation';
import { auth } from '$lib/stores/auth.svelte';
import { profileStore } from '$lib/stores/profile.svelte';
import { calculateLevel, ACHIEVEMENTS, AchievementManager } from '$lib/core/gamification';
import soundManager from '$lib/core/soundManager';
import TopBar from '$lib/components/TopBar.svelte';
import ProgressRing from '$lib/components/ProgressRing.svelte';
import ThemePicker from '$lib/components/ThemePicker.svelte';

$effect(() => {
	if (!auth.loading && auth.isAuthenticated && auth.user) {
		const userId = auth.user.id;
		profileStore.fetchProfile(userId);
		profileStore.fetchTrainingProgress(userId);
	}
});

const profile = $derived(profileStore.profile);
const levelResult = $derived(profile ? calculateLevel(profile.xp) : null);
const username = $derived(profile?.username ?? 'Player');
const initial = $derived(username.charAt(0).toUpperCase());
const level = $derived(levelResult?.level ?? 1);
const levelTitle = $derived(levelResult?.levelData.title ?? 'Poker Novice');
const levelIcon = $derived(levelResult?.levelData.icon ?? '🌱');
const xpInLevel = $derived(levelResult?.xpInCurrentLevel ?? 0);
const xpForNext = $derived(levelResult?.xpNeededForNext ?? 0);
const levelProgress = $derived(levelResult?.progress ?? 0);
const streak = $derived(profile?.streak_count ?? 0);
const sessionCount = $derived(profileStore.trainingProgress.length);

const achievements = $derived(Object.values(ACHIEVEMENTS));
const unlockedCount = $derived(
	achievements.filter(a => {
		const mgr = new AchievementManager();
		return mgr.checkAchievements({ sessionsCompleted: sessionCount, currentStreak: streak }).some(n => n.id === a.id);
	}).length
);

let soundEnabled = $state(true);

function toggleSound() {
	soundEnabled = !soundEnabled;
	soundManager.setEnabled(soundEnabled);
}

async function handleLogout() {
	if (!auth.logout) return;
	await auth.logout();
	goto('/login');
}
</script>

<div class="screen felt-bg">
	<TopBar>
		{#snippet left()}
			<div class="eyebrow">Profile</div>
		{/snippet}
	</TopBar>

	<div class="scroll-content">
		<!-- Hero card -->
		<div class="hero-card">
			<div class="hero-row">
				<div
					style="width: 56px; height: 56px; border-radius: 999px; background: linear-gradient(135deg, var(--coral), var(--gold)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 22px; color: #2a0a05;"
				>
					{initial}
				</div>
				<div style="flex: 1; margin-left: 16px;">
					<div style="font-size: 20px; font-weight: 600;">{username}</div>
					<div class="mono" style="font-size: 11px; color: var(--cream-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px;">
						{levelIcon} Lvl {level} · {levelTitle}
					</div>
				</div>
			</div>
			<div class="xp-bar-section">
				<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
					<div class="mono" style="font-size: 11px; color: var(--cream-dim); text-transform: uppercase;">Level Progress</div>
					<div class="mono" style="font-size: 12px; color: var(--gold);">{xpInLevel} / {xpInLevel + xpForNext} XP</div>
				</div>
				<div class="xp-bar-track">
					<div class="xp-bar-fill" style="width: {Math.round(levelProgress * 100)}%;"></div>
				</div>
			</div>
		</div>

		<!-- Stats row -->
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value">{sessionCount}</div>
				<div class="stat-label">Sessions</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{streak}</div>
				<div class="stat-label">Streak</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{unlockedCount}</div>
				<div class="stat-label">Badges</div>
			</div>
			<div class="stat-card">
				<div class="stat-value">{profile?.xp ?? 0}</div>
				<div class="stat-label">Total XP</div>
			</div>
		</div>

		<!-- Achievements -->
		<div class="section">
			<div class="section-header">
				<div class="eyebrow">Achievements</div>
				<div class="mono" style="font-size: 10px; color: var(--cream-dim);">{unlockedCount} / {achievements.length}</div>
			</div>
			<div class="achievement-scroll">
				{#each achievements as achievement (achievement.id)}
					{@const mgr = new AchievementManager()}
					{@const progress = mgr.getProgress(achievement.id, { sessionsCompleted: sessionCount, currentStreak: streak })}
					{@const unlocked = progress?.unlocked ?? false}
					<div class="achievement-card" style="opacity: {unlocked ? 1 : 0.5};">
						<div style="font-size: 28px;">{achievement.icon}</div>
						<div style="font-size: 13px; font-weight: 600; margin-top: 6px;">{achievement.title}</div>
						<div style="font-size: 11px; color: var(--cream-dim); margin-top: 2px;">{achievement.description}</div>
						{#if unlocked}
							<div class="mono" style="font-size: 11px; color: var(--gold); margin-top: 6px;">+{achievement.xpReward} XP</div>
						{:else}
							<div class="achievement-bar-track">
								<div class="achievement-bar-fill" style="width: {progress?.percentage ?? 0}%;"></div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
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
	}

	.hero-row {
		display: flex;
		align-items: center;
	}

	.xp-bar-section {
		margin-top: 18px;
	}

	.xp-bar-track {
		height: 8px;
		border-radius: 4px;
		background: rgba(245,233,212,0.12);
		overflow: hidden;
	}

	.xp-bar-fill {
		height: 100%;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--coral), var(--gold));
		transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 8px;
		margin-top: 20px;
	}

	.stat-card {
		padding: 14px 8px;
		border-radius: 16px;
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
		text-align: center;
	}

	.stat-value {
		font-size: 22px;
		font-weight: 700;
		font-family: var(--mono);
	}

	.stat-label {
		font-size: 10px;
		color: var(--cream-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-top: 2px;
		font-family: var(--mono);
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

	.achievement-scroll {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	.achievement-card {
		min-width: 140px;
		padding: 16px;
		border-radius: 18px;
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
	}

	.achievement-bar-track {
		height: 4px;
		border-radius: 2px;
		background: rgba(245,233,212,0.12);
		overflow: hidden;
		margin-top: 8px;
	}

	.achievement-bar-fill {
		height: 100%;
		border-radius: 2px;
		background: var(--cream-dim);
	}
</style>
