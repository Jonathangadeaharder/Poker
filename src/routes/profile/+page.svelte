<script lang="ts">
import { goto } from '$app/navigation';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import ThemePicker from '$lib/components/ThemePicker.svelte';
// biome-ignore lint/correctness/noUnusedImports: used in Svelte template
import TopBar from '$lib/components/TopBar.svelte';
import { ACHIEVEMENTS, AchievementManager, calculateLevel } from '$lib/core/gamification';
import soundManager from '$lib/core/soundManager';
import { auth } from '$lib/stores/auth.svelte';
import { profileStore } from '$lib/stores/profile.svelte';

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

const achievementManager = new AchievementManager();
const userStats = $derived({ sessionsCompleted: sessionCount, currentStreak: streak });
const achievements = $derived(Object.values(ACHIEVEMENTS));
const unlockedAchievementIds = $derived(() => {
	achievementManager.checkAchievements(userStats);
	return new Set(
		achievements
			.filter((a) => achievementManager.getProgress(a.id, userStats)?.unlocked)
			.map((a) => a.id)
	);
});
const unlockedCount = $derived(unlockedAchievementIds().size);

let soundEnabled = $state(soundManager.isEnabled());

function toggleSound() {
	soundEnabled = !soundEnabled;
	soundManager.setEnabled(soundEnabled);
}

async function handleLogout() {
	await auth.signOut();
	goto('/login');
}

// TODO: replace with real session data from training_sessions table
const xpTrend = [
	{ day: 'Mon', xp: 45 },
	{ day: 'Tue', xp: 80 },
	{ day: 'Wed', xp: 60 },
	{ day: 'Thu', xp: 120 },
	{ day: 'Fri', xp: 90 },
	{ day: 'Sat', xp: 150 },
	{ day: 'Sun', xp: 70 }
];

const accuracyTrend = [
	{ day: 'Mon', pct: 65 },
	{ day: 'Tue', pct: 72 },
	{ day: 'Wed', pct: 68 },
	{ day: 'Thu', pct: 85 },
	{ day: 'Fri', pct: 78 },
	{ day: 'Sat', pct: 90 },
	{ day: 'Sun', pct: 82 }
];

const xpMax = Math.max(...xpTrend.map((d) => d.xp));
const accMax = 100;

function toPoints(
	data: { day: string; value: number }[],
	max: number,
	w: number,
	h: number
): string {
	if (data.length === 0) return '';
	if (data.length === 1) return `${w / 2},${h - (data[0].value / max) * h}`;
	return data
		.map((d, i) => {
			const x = (i / (data.length - 1)) * w;
			const y = h - (d.value / max) * h;
			return `${x},${y}`;
		})
		.join(' ');
}

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	prompt(): Promise<void>;
}

let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
let canInstall = $state(false);

$effect(() => {
	function handler(e: Event) {
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		canInstall = true;
	}
	window.addEventListener('beforeinstallprompt', handler);
	return () => window.removeEventListener('beforeinstallprompt', handler);
});

async function handleInstall() {
	if (!deferredPrompt) return;
	deferredPrompt.prompt();
	const { outcome } = await deferredPrompt.userChoice;
	if (outcome === 'accepted') {
		canInstall = false;
	}
	deferredPrompt = null;
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
					{@const progress = achievementManager.getProgress(achievement.id, userStats)}
					{@const unlocked = unlockedAchievementIds().has(achievement.id)}
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

		<!-- Analytics -->
		<div class="section">
			<div class="eyebrow" style="margin-bottom: 12px;">Your Progress</div>
			<div class="analytics-card">
				<div style="margin-bottom: 16px;">
					<div class="mono" style="font-size: 10px; color: var(--cream-dim); text-transform: uppercase; margin-bottom: 8px;">XP This Week</div>
					<svg viewBox="0 0 280 60" style="width: 100%; height: 60px;">
						<polyline
							points={toPoints(xpTrend.map(d => ({ ...d, value: d.xp })), xpMax, 280, 60)}
							fill="none"
							stroke="var(--coral)"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						{#each xpTrend as d}
							<div class="mono" style="font-size: 9px; color: var(--cream-dim);">{d.day}</div>
						{/each}
					</div>
				</div>
				<div>
					<div class="mono" style="font-size: 10px; color: var(--cream-dim); text-transform: uppercase; margin-bottom: 8px;">Accuracy</div>
					<svg viewBox="0 0 280 60" style="width: 100%; height: 60px;">
						<polyline
							points={toPoints(accuracyTrend.map(d => ({ ...d, value: d.pct })), accMax, 280, 60)}
							fill="none"
							stroke="var(--gold)"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						{#each accuracyTrend as d}
							<div class="mono" style="font-size: 9px; color: var(--cream-dim);">{d.day}</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Settings -->
		<div class="section">
			<div class="eyebrow" style="margin-bottom: 12px;">Settings</div>
			<div class="settings-card">
				<div class="setting-row">
					<div>
						<div style="font-size: 15px; font-weight: 600;">Sound Effects</div>
						<div style="font-size: 12px; color: var(--cream-dim);">Play sounds on actions</div>
					</div>
					<button
						type="button"
						class="toggle"
						class:toggle-on={soundEnabled}
						onclick={toggleSound}
					>
						<div class="toggle-knob"></div>
					</button>
				</div>

				<div class="setting-row">
					<div>
						<div style="font-size: 15px; font-weight: 600;">Theme</div>
						<div style="font-size: 12px; color: var(--cream-dim);">Choose your table style</div>
					</div>
				</div>
				<div style="padding: 0 0 12px;">
					<ThemePicker />
				</div>

				{#if canInstall}
					<button type="button" class="setting-row tap" onclick={handleInstall}>
						<div>
							<div style="font-size: 15px; font-weight: 600;">Install App</div>
							<div style="font-size: 12px; color: var(--cream-dim);">Add to home screen</div>
						</div>
						<div style="font-size: 18px;">📲</div>
					</button>
				{/if}

				<button type="button" class="setting-row tap" onclick={handleLogout} style="color: var(--coral);">
					<div>
						<div style="font-size: 15px; font-weight: 600;">Log Out</div>
						<div style="font-size: 12px; color: var(--cream-dim);">Sign out of your account</div>
					</div>
				</button>
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

	.analytics-card {
		padding: 18px;
		border-radius: 22px;
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
	}

	.settings-card {
		border-radius: 22px;
		background: rgba(245,233,212,0.04);
		border: 1px solid var(--hairline);
		overflow: hidden;
	}

	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 18px;
		border-bottom: 1px solid var(--hairline);
		background: none;
		border-left: none;
		border-right: none;
		border-top: none;
		width: 100%;
		text-align: left;
		color: var(--cream);
		font-family: inherit;
		cursor: default;
	}

	.setting-row.tap {
		cursor: pointer;
	}

	.setting-row.tap:active {
		opacity: 0.8;
	}

	.toggle {
		width: 48px;
		height: 28px;
		border-radius: 14px;
		background: rgba(245,233,212,0.15);
		border: none;
		cursor: pointer;
		position: relative;
		transition: background 200ms ease;
	}

	.toggle-on {
		background: var(--coral);
	}

	.toggle-knob {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--cream);
		position: absolute;
		top: 3px;
		left: 3px;
		transition: transform 200ms ease;
	}

	.toggle-on .toggle-knob {
		transform: translateX(20px);
	}
</style>
