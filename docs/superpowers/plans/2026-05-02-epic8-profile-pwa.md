# Epic 8: Profile & PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a profile page with stats, achievements, analytics (mock), and settings, plus PWA support with manifest and service worker.

**Architecture:** Single `/profile` route combining user stats, achievement gallery, mock analytics charts, and settings. PWA via `vite-plugin-pwa` for auto-generated service worker. Install button in profile settings uses `beforeinstallprompt` event.

**Tech Stack:** Svelte 5 (runes), SvelteKit, Supabase (existing client), vite-plugin-pwa, existing design system (CSS tokens, components)

---

## File Structure

### Files to Create
- `tilt-app/src/routes/profile/+page.svelte` — main profile page
- `tilt-app/static/manifest.json` — PWA manifest

### Files to Modify
- `tilt-app/src/routes/+layout.svelte:31-38` — update "you" route to `/profile`
- `tilt-app/vite.config.ts` — add vite-plugin-pwa
- `tilt-app/package.json` — add vite-plugin-pwa dependency

---

## Task 1: Update BottomNav Routing

**Files:**
- Modify: `tilt-app/src/routes/+layout.svelte:31-38`

- [ ] **Step 1: Update the "you" route**

In `tilt-app/src/routes/+layout.svelte`, change the `handleNav` function's route map:

```typescript
function handleNav(id: string) {
	const routes: Record<string, string> = {
		today: '/home',
		practice: '/practice',
		replay: '/replay',
		you: '/profile'
	};
	goto(routes[id] ?? '/home');
}
```

- [ ] **Step 2: Verify active tab highlighting**

The `activeTab` derived already checks `path.startsWith('/profile')` at line 27. No change needed — confirm it works by reading the file.

- [ ] **Step 3: Commit**

```bash
git add tilt-app/src/routes/+layout.svelte
git commit -m "feat: route BottomNav 'you' tab to /profile"
```

---

## Task 2: Create Profile Page — Hero & Stats

**Files:**
- Create: `tilt-app/src/routes/profile/+page.svelte`

- [ ] **Step 1: Create the profile page with hero section**

Create `tilt-app/src/routes/profile/+page.svelte`:

```svelte
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
```

- [ ] **Step 2: Add the hero section markup**

Add after the closing `</script>` tag:

```svelte
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
```

- [ ] **Step 3: Add the stats row**

```svelte
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
```

- [ ] **Step 4: Commit**

```bash
git add tilt-app/src/routes/profile/+page.svelte
git commit -m "feat: profile page hero and stats section"
```

---

## Task 3: Add Achievement Gallery

**Files:**
- Modify: `tilt-app/src/routes/profile/+page.svelte`

- [ ] **Step 1: Add achievement gallery section**

Add after the stats-grid closing `</div>`:

```svelte
		<!-- Achievements -->
		<div class="section">
			<div class="section-header">
				<div class="eyebrow">Achievements</div>
				<div class="mono" style="font-size: 10px; color: var(--cream-dim);">{unlockedCount} / {achievements.length}</div>
			</div>
			<div class="achievement-scroll">
				{#each achievements as achievement}
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
```

- [ ] **Step 2: Commit**

```bash
git add tilt-app/src/routes/profile/+page.svelte
git commit -m "feat: achievement gallery with progress bars"
```

---

## Task 4: Add Analytics Section (Mock Data)

**Files:**
- Modify: `tilt-app/src/routes/profile/+page.svelte`

- [ ] **Step 1: Add mock analytics data and chart section**

Add at the top of the script block (after existing state/derived):

```typescript
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

const xpMax = Math.max(...xpTrend.map(d => d.xp));
const accMax = 100;

function toPoints(data: { day: string; value: number }[], max: number, w: number, h: number): string {
	return data.map((d, i) => {
		const x = (i / (data.length - 1)) * w;
		const y = h - (d.value / max) * h;
		return `${x},${y}`;
	}).join(' ');
}
```

- [ ] **Step 2: Add the analytics card markup**

Add after the achievement section:

```svelte
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
```

- [ ] **Step 3: Commit**

```bash
git add tilt-app/src/routes/profile/+page.svelte
git commit -m "feat: analytics section with mock XP and accuracy charts"
```

---

## Task 5: Add Settings Section

**Files:**
- Modify: `tilt-app/src/routes/profile/+page.svelte`

- [ ] **Step 1: Add PWA install state**

Add to the script block:

```typescript
let deferredPrompt = $state<any>(null);
let canInstall = $state(false);

$effect(() => {
	function handler(e: Event) {
		e.preventDefault();
		deferredPrompt = e;
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
```

- [ ] **Step 2: Add settings section markup**

Add after the analytics section:

```svelte
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
```

- [ ] **Step 3: Add component styles**

Add a `<style>` block at the end of the file:

```svelte
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
```

- [ ] **Step 4: Commit**

```bash
git add tilt-app/src/routes/profile/+page.svelte
git commit -m "feat: settings section with sound toggle, theme picker, install, logout"
```

---

## Task 6: Set Up PWA Manifest

**Files:**
- Create: `tilt-app/static/manifest.json`

- [ ] **Step 1: Create the manifest**

Create `tilt-app/static/manifest.json`:

```json
{
	"name": "Tilt Poker Training",
	"short_name": "Tilt",
	"description": "Poker training app with GTO principles",
	"start_url": "/home",
	"display": "standalone",
	"theme_color": "#0e2a20",
	"background_color": "#0e2a20",
	"orientation": "portrait",
	"icons": [
		{
			"src": "/icon-192.svg",
			"sizes": "192x192",
			"type": "image/svg+xml"
		},
		{
			"src": "/icon-512.svg",
			"sizes": "512x512",
			"type": "image/svg+xml"
		}
	]
}
```

- [ ] **Step 2: Create placeholder SVG icons**

Create `tilt-app/static/icon-192.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#0e2a20"/>
  <circle cx="96" cy="96" r="60" fill="none" stroke="#ff5b48" stroke-width="8"/>
  <circle cx="96" cy="96" r="40" fill="none" stroke="#e9b949" stroke-width="4" stroke-dasharray="8 6"/>
  <text x="96" y="108" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="48" fill="#f5e9d4">T</text>
</svg>
```

Create `tilt-app/static/icon-512.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0e2a20"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="#ff5b48" stroke-width="16"/>
  <circle cx="256" cy="256" r="108" fill="none" stroke="#e9b949" stroke-width="8" stroke-dasharray="16 12"/>
  <text x="256" y="288" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="128" fill="#f5e9d4">T</text>
</svg>
```

- [ ] **Step 3: Link manifest in app layout**

Add to the `<svelte:head>` in `tilt-app/src/routes/+layout.svelte`:

```svelte
<svelte:head>
	<title>Tilt — Poker Training</title>
	<meta name="description" content="Poker training app with GTO principles" />
	<meta name="theme-color" content="#0e2a20" />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>
```

- [ ] **Step 4: Commit**

```bash
git add tilt-app/static/manifest.json tilt-app/static/icon-192.svg tilt-app/static/icon-512.svg tilt-app/src/routes/+layout.svelte
git commit -m "feat: PWA manifest with app icons and theme color"
```

---

## Task 7: Add vite-plugin-pwa

**Files:**
- Modify: `tilt-app/vite.config.ts`
- Modify: `tilt-app/package.json`

- [ ] **Step 1: Install vite-plugin-pwa**

```bash
cd tilt-app && pnpm add -D vite-plugin-pwa
```

- [ ] **Step 2: Update vite.config.ts**

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				name: 'Tilt Poker Training',
				short_name: 'Tilt',
				theme_color: '#0e2a20',
				background_color: '#0e2a20',
				display: 'standalone'
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
			}
		})
	]
});
```

- [ ] **Step 3: Commit**

```bash
git add tilt-app/vite.config.ts tilt-app/package.json
git commit -m "feat: add vite-plugin-pwa for service worker generation"
```

---

## Task 8: Build Verification

- [ ] **Step 1: Run typecheck**

```bash
cd tilt-app && pnpm run typecheck
```

Expected: No new errors (pre-existing errors in PlayingCard/TopBar may remain).

- [ ] **Step 2: Run build**

```bash
cd tilt-app && pnpm run build
```

Expected: Build succeeds, manifest.json and service worker generated in output.

- [ ] **Step 3: Run lint**

```bash
cd tilt-app && pnpm run lint
```

Expected: No new warnings.

- [ ] **Step 4: Commit any fixes**

If any issues found, fix and commit:

```bash
git add -A
git commit -m "fix: resolve build/typecheck issues for profile page"
```

---

## Task 9: Plane Work Item Updates

- [ ] **Step 1: Move Profile work item to Done**

Update Plane work item `e4481862-85dd-4b09-9d4c-d73b2da23ff7` state to Done.

- [ ] **Step 2: Move Analytics work item to Done**

Update Plane work item `77b5ec0a-d69e-44c2-8086-2532ed194a8c` state to Done.

- [ ] **Step 3: Move PWA work item to Done**

Update Plane work item `a3481554-b6ba-41b6-98b0-e94d5b31be46` state to Done.

- [ ] **Step 4: Create PR**

```bash
git push -u origin feature/epic8-profile-pwa
gh pr create --title "Epic 8: Profile Page & PWA" --body "## Summary
- Profile page with hero, stats, achievement gallery, mock analytics, settings
- PWA manifest and service worker via vite-plugin-pwa
- Install button in profile settings
- BottomNav 'you' tab routes to /profile

## Plane
- 3 work items moved to Done (Profile, Analytics, PWA)"
```
