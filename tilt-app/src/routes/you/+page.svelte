<!-- src/routes/you/+page.svelte -->
<script lang="ts">
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import Screen from '$lib/components/Screen.svelte';
import TopBar from '$lib/components/TopBar.svelte';
import ProgressRing from '$lib/components/ProgressRing.svelte';
import StreakBadge from '$lib/components/StreakBadge.svelte';
import Button from '$lib/components/Button.svelte';
import ThemePicker from '$lib/components/ThemePicker.svelte';
import StatCard from '$lib/components/StatCard.svelte';
import AchievementBadge from '$lib/components/AchievementBadge.svelte';
import CardStylePicker from '$lib/components/CardStylePicker.svelte';
import { auth } from '$lib/stores/auth.svelte';
import { profileStore } from '$lib/stores/profile.svelte';
import {
	cardStyle,
	soundEnabled,
	hapticsEnabled,
	setCardStyle,
	toggleSound,
	toggleHaptics
} from '$lib/stores/settings.svelte';
import { calculateLevel, ACHIEVEMENTS, AchievementManager, type UserStats } from '$lib/core/gamification';
import { createClient } from '$lib/supabase';

const profile = $derived(profileStore.profile);
const level = $derived(profile ? calculateLevel(profile.xp) : null);
const achievements = $derived(Object.values(ACHIEVEMENTS));

let sessionStats = $state<{ total: number; perfect: number; longestStreak: number }>({
	total: 0,
	perfect: 0,
	longestStreak: 0
});

const achievementManager = $derived.by(() => {
	const mgr = new AchievementManager();
	if (profile) {
		const stats: UserStats = {
			sessionsCompleted: sessionStats.total,
			currentStreak: profile.streak_count,
			perfectQuizzes: sessionStats.perfect,
			totalXP: profile.xp
		};
		mgr.checkAchievements(stats);
	}
	return mgr;
});

const unlockedIds = $derived(achievementManager.getUnlockedAchievements().map((a) => a.id));

async function fetchSessionStats() {
	if (!browser || !auth.user) return;
	const supabase = createClient();
	const { data } = await supabase
		.from('sessions')
		.select('xp_earned, accuracy')
		.eq('user_id', auth.user.id);
	if (data) {
		sessionStats.total = data.length;
		sessionStats.perfect = data.filter((s) => s.accuracy === 100).length;
	}
	sessionStats.longestStreak = profile?.streak_count ?? 0;
}

$effect(() => {
	if (!auth.isAuthenticated && !auth.loading) {
		goto('/login');
	}
});

$effect(() => {
	if (auth.isAuthenticated && auth.user) {
		profileStore.fetchProfile(auth.user.id);
		fetchSessionStats();
	}
});

async function handleSignOut() {
	await auth.signOut();
	goto('/login');
}

function scrollToSettings() {
	document.getElementById('settings-section')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<Screen>
	{#snippet children()}
		<TopBar center="You">
			{#snippet right()}
				<button
					type="button"
					aria-label="Settings"
					onclick={scrollToSettings}
					style="background: rgba(245,233,212,0.08); border: 1px solid var(--hairline); border-radius: 999px; width: 36px; height: 36px; color: var(--cream); cursor: pointer; font-size: 16px; display: inline-flex; align-items: center; justify-content: center;"
				>
					⚙
				</button>
			{/snippet}
		</TopBar>

		<div class="profile-content">
			<!-- Hero -->
			<div class="profile-hero">
				{#if level}
					<ProgressRing
						value={level.progress * 100}
						size={120}
						label="Lv. {level.level}"
						sublabel={level.levelData.title}
					/>
				{/if}
				{#if profile}
					<div class="profile-info">
						<span class="profile-name">{profile.username ?? 'Player'}</span>
						<span class="profile-email">{auth.user?.email ?? ''}</span>
					</div>
				{/if}
			</div>

			<!-- Streak -->
			<div class="streak-section">
				<StreakBadge count={profile?.streak_count ?? 0} />
				{#if (profile?.streak_count ?? 0) > 0}
					<span class="streak-text">{profile?.streak_count} day streak</span>
				{:else}
					<span class="streak-text">Start your streak today!</span>
				{/if}
			</div>

			<!-- Stats Grid -->
			<div class="stats-grid">
				<StatCard value={sessionStats.total} label="Sessions" />
				<StatCard value={sessionStats.perfect} label="Perfect" />
				<StatCard value={sessionStats.longestStreak} label="Best Streak" />
				<StatCard value="{unlockedIds.length}/{achievements.length}" label="Badges" />
			</div>

			<!-- Achievements -->
			<section class="section">
				<h2 class="section-title">Achievements ({unlockedIds.length}/{achievements.length})</h2>
				<div class="achievements-grid">
					{#each achievements as achievement}
						<AchievementBadge {achievement} unlocked={unlockedIds.includes(achievement.id)} />
					{/each}
				</div>
			</section>

			<!-- Settings -->
			<section class="section" id="settings-section">
				<h2 class="section-title">Settings</h2>

				<div class="setting-row">
					<span class="setting-label">Sound</span>
					<button
						type="button"
						class="toggle"
						class:active={soundEnabled.value}
						onclick={toggleSound}
						aria-label="Toggle sound"
					>
						<span class="toggle-knob"></span>
					</button>
				</div>

				<div class="setting-row">
					<span class="setting-label">Haptics</span>
					<button
						type="button"
						class="toggle"
						class:active={hapticsEnabled.value}
						onclick={toggleHaptics}
						aria-label="Toggle haptics"
					>
						<span class="toggle-knob"></span>
					</button>
				</div>

				<div class="setting-group">
					<span class="setting-label">Theme</span>
					<ThemePicker />
				</div>

				<div class="setting-group">
					<span class="setting-label">Card Style</span>
					<CardStylePicker value={cardStyle.value} onchange={setCardStyle} />
				</div>
			</section>

			<!-- About -->
			<section class="section about">
				<span class="about-text">Tilt v0.1.0</span>
			</section>

			<!-- Logout -->
			<div class="logout-section">
				<Button variant="ghost" onclick={handleSignOut}>Sign Out</Button>
			</div>
		</div>
	{/snippet}
</Screen>

<style>
	.profile-content {
		padding: 0 20px 40px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.profile-hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 20px 0;
	}
	.profile-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.profile-name {
		font-family: var(--serif);
		font-size: 24px;
		font-weight: 700;
		color: var(--cream);
	}
	.profile-email {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--cream-dim, rgba(245, 233, 212, 0.5));
	}
	.streak-section {
		display: flex;
		align-items: center;
		gap: 10px;
		justify-content: center;
	}
	.streak-text {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--cream);
	}
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.section {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.section-title {
		font-family: var(--mono);
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--cream-dim, rgba(245, 233, 212, 0.5));
		margin: 0;
	}
	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}
	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 0;
		border-bottom: 1px solid var(--hairline);
	}
	.setting-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 12px 0;
		border-bottom: 1px solid var(--hairline);
	}
	.setting-label {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--cream);
	}
	.toggle {
		position: relative;
		width: 44px;
		height: 24px;
		background: var(--hairline);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: background 0.2s ease;
	}
	.toggle.active {
		background: var(--coral);
	}
	.toggle-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: var(--cream);
		border-radius: 50%;
		transition: transform 0.2s ease;
	}
	.toggle.active .toggle-knob {
		transform: translateX(20px);
	}
	.about {
		align-items: center;
		padding: 8px 0;
	}
	.about-text {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--cream-dim, rgba(245, 233, 212, 0.3));
	}
	.logout-section {
		padding-top: 8px;
	}
</style>
