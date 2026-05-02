# Profile Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Profile page at `/you` with stats, achievements grid, settings (sound/haptics/theme/card style), and logout.

**Architecture:** Compose existing components (Screen, TopBar, ProgressRing, StreakBadge, Button, ThemePicker) with new components (AchievementBadge, CardStylePicker, StatCard). Create a settings store for card style persistence. All data from existing Supabase-backed stores.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Supabase, Vitest

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/lib/stores/settings.svelte.ts` | Card style + sound/haptics preferences |
| Create | `src/lib/components/AchievementBadge.svelte` | Single achievement badge (locked/unlocked) |
| Create | `src/lib/components/CardStylePicker.svelte` | 3-option segmented control for card style |
| Create | `src/lib/components/StatCard.svelte` | Stats grid cell |
| Create | `src/routes/you/+page.svelte` | Profile page |
| Create | `src/lib/components/AchievementBadge.test.ts` | Tests for AchievementBadge |
| Create | `src/lib/components/CardStylePicker.test.ts` | Tests for CardStylePicker |
| Create | `src/lib/components/StatCard.test.ts` | Tests for StatCard |
| Create | `src/lib/stores/settings.test.ts` | Tests for settings store |

---

### Task 1: Settings Store

**Files:**
- Create: `src/lib/stores/settings.svelte.ts`
- Create: `src/lib/stores/settings.test.ts`

- [ ] **Step 1: Write failing tests for settings store**

```typescript
// src/lib/stores/settings.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults card style to classic', async () => {
    const { cardStyle } = await import('./settings.svelte.ts');
    expect(cardStyle.value).toBe('classic');
  });

  it('updates card style', async () => {
    const { cardStyle, setCardStyle } = await import('./settings.svelte.ts');
    setCardStyle('luxury');
    expect(cardStyle.value).toBe('luxury');
  });

  it('persists card style to localStorage', async () => {
    const { setCardStyle } = await import('./settings.svelte.ts');
    setCardStyle('minimal');
    expect(localStorage.getItem('tilt_card_style')).toBe('minimal');
  });

  it('loads saved card style from localStorage', async () => {
    localStorage.setItem('tilt_card_style', 'luxury');
    // Re-import to trigger initialization
    const { cardStyle } = await import('./settings.svelte.ts');
    expect(cardStyle.value).toBe('luxury');
  });

  it('defaults sound enabled to true', async () => {
    const { soundEnabled } = await import('./settings.svelte.ts');
    expect(soundEnabled.value).toBe(true);
  });

  it('toggles sound', async () => {
    const { soundEnabled, toggleSound } = await import('./settings.svelte.ts');
    toggleSound();
    expect(soundEnabled.value).toBe(false);
    toggleSound();
    expect(soundEnabled.value).toBe(true);
  });

  it('defaults haptics enabled to true', async () => {
    const { hapticsEnabled } = await import('./settings.svelte.ts');
    expect(hapticsEnabled.value).toBe(true);
  });

  it('toggles haptics', async () => {
    const { hapticsEnabled, toggleHaptics } = await import('./settings.svelte.ts');
    toggleHaptics();
    expect(hapticsEnabled.value).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/stores/settings.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement settings store**

```typescript
// src/lib/stores/settings.svelte.ts
import { browser } from '$app/environment';

export type CardStyle = 'classic' | 'minimal' | 'luxury';

function loadCardStyle(): CardStyle {
  if (!browser) return 'classic';
  const saved = localStorage.getItem('tilt_card_style');
  if (saved === 'classic' || saved === 'minimal' || saved === 'luxury') return saved;
  return 'classic';
}

function loadBool(key: string, fallback: boolean): boolean {
  if (!browser) return fallback;
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === 'true';
}

export const cardStyle = $state<{ value: CardStyle }>({ value: loadCardStyle() });
export const soundEnabled = $state<{ value: boolean }>({ value: loadBool('tilt_sound', true) });
export const hapticsEnabled = $state<{ value: boolean }>({ value: loadBool('tilt_haptics', true) });

export function setCardStyle(style: CardStyle): void {
  cardStyle.value = style;
  if (browser) localStorage.setItem('tilt_card_style', style);
}

export function toggleSound(): void {
  soundEnabled.value = !soundEnabled.value;
  if (browser) localStorage.setItem('tilt_sound', String(soundEnabled.value));
}

export function toggleHaptics(): void {
  hapticsEnabled.value = !hapticsEnabled.value;
  if (browser) localStorage.setItem('tilt_haptics', String(hapticsEnabled.value));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/stores/settings.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/stores/settings.svelte.ts src/lib/stores/settings.test.ts
git commit -m "feat: add settings store for card style, sound, haptics"
```

---

### Task 2: StatCard Component

**Files:**
- Create: `src/lib/components/StatCard.svelte`
- Create: `src/lib/components/StatCard.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/components/StatCard.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StatCard from './StatCard.svelte';

describe('StatCard', () => {
  it('renders value and label', () => {
    render(StatCard, { props: { value: 42, label: 'Sessions' } });
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('Sessions')).toBeTruthy();
  });

  it('renders string values', () => {
    render(StatCard, { props: { value: '12h', label: 'Time' } });
    expect(screen.getByText('12h')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/components/StatCard.test.ts`
Expected: FAIL — component not found

- [ ] **Step 3: Implement StatCard**

```svelte
<!-- src/lib/components/StatCard.svelte -->
<script lang="ts">
interface Props {
	value: string | number;
	label: string;
}

let { value, label }: Props = $props();
</script>

<div class="stat-card">
	<span class="stat-value">{value}</span>
	<span class="stat-label">{label}</span>
</div>

<style>
	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 16px 12px;
		background: rgba(245, 233, 212, 0.06);
		border: 1px solid var(--hairline);
		border-radius: 12px;
	}
	.stat-value {
		font-family: var(--serif);
		font-size: 28px;
		font-weight: 700;
		color: var(--cream);
		line-height: 1;
	}
	.stat-label {
		font-family: var(--mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cream-dim, rgba(245, 233, 212, 0.5));
	}
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/components/StatCard.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/StatCard.svelte src/lib/components/StatCard.test.ts
git commit -m "feat: add StatCard component for profile stats grid"
```

---

### Task 3: AchievementBadge Component

**Files:**
- Create: `src/lib/components/AchievementBadge.svelte`
- Create: `src/lib/components/AchievementBadge.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/components/AchievementBadge.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AchievementBadge from './AchievementBadge.svelte';

const mockAchievement = {
  id: 'first_session',
  title: 'First Steps',
  description: 'Complete your first training session',
  icon: '🎯',
  xpReward: 50,
  requirement: { type: 'sessions' as const, count: 1 }
};

describe('AchievementBadge', () => {
  it('renders achievement icon and title when unlocked', () => {
    render(AchievementBadge, {
      props: { achievement: mockAchievement, unlocked: true }
    });
    expect(screen.getByText('🎯')).toBeTruthy();
    expect(screen.getByText('First Steps')).toBeTruthy();
  });

  it('shows lock overlay when locked', () => {
    render(AchievementBadge, {
      props: { achievement: mockAchievement, unlocked: false }
    });
    expect(screen.getByText('🔒')).toBeTruthy();
    expect(screen.getByText('First Steps')).toBeTruthy();
  });

  it('applies greyed style when locked', () => {
    const { container } = render(AchievementBadge, {
      props: { achievement: mockAchievement, unlocked: false }
    });
    const badge = container.querySelector('.achievement-badge');
    expect(badge?.classList.contains('locked')).toBe(true);
  });

  it('shows description on hover', async () => {
    render(AchievementBadge, {
      props: { achievement: mockAchievement, unlocked: true }
    });
    const badge = screen.getByText('First Steps').closest('.achievement-badge');
    expect(badge).toBeTruthy();
    // CSS-only tooltip — description exists in DOM
    expect(screen.getByText('Complete your first training session')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/components/AchievementBadge.test.ts`
Expected: FAIL — component not found

- [ ] **Step 3: Implement AchievementBadge**

```svelte
<!-- src/lib/components/AchievementBadge.svelte -->
<script lang="ts">
interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	xpReward: number;
	requirement: { type: string; count: number };
}

interface Props {
	achievement: Achievement;
	unlocked: boolean;
}

let { achievement, unlocked }: Props = $props();
</script>

<div class="achievement-badge" class:locked={!unlocked}>
	<div class="badge-icon">
		<span>{achievement.icon}</span>
		{#if !unlocked}
			<span class="lock-overlay">🔒</span>
		{/if}
	</div>
	<span class="badge-title">{achievement.title}</span>
	<div class="badge-tooltip">
		<p>{achievement.description}</p>
		<span class="badge-xp">+{achievement.xpReward} XP</span>
	</div>
</div>

<style>
	.achievement-badge {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 12px 8px;
		border-radius: 12px;
		background: rgba(245, 233, 212, 0.06);
		border: 1.5px solid var(--coral);
		cursor: pointer;
		transition: transform 0.15s ease;
	}
	.achievement-badge:hover {
		transform: scale(1.05);
	}
	.achievement-badge.locked {
		border-color: var(--hairline);
		opacity: 0.45;
		filter: grayscale(0.8);
	}
	.achievement-badge.locked:hover {
		transform: none;
	}
	.badge-icon {
		position: relative;
		font-size: 28px;
		line-height: 1;
	}
	.lock-overlay {
		position: absolute;
		bottom: -4px;
		right: -4px;
		font-size: 12px;
	}
	.badge-title {
		font-family: var(--mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--cream);
		text-align: center;
		line-height: 1.2;
	}
	.badge-tooltip {
		display: none;
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--felt-3, #1d4a36);
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 8px 12px;
		z-index: 10;
		width: max-content;
		max-width: 180px;
	}
	.achievement-badge:hover .badge-tooltip {
		display: block;
	}
	.badge-tooltip p {
		margin: 0;
		font-size: 11px;
		color: var(--cream);
		line-height: 1.4;
	}
	.badge-xp {
		font-family: var(--mono);
		font-size: 10px;
		color: var(--coral);
	}
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/components/AchievementBadge.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/AchievementBadge.svelte src/lib/components/AchievementBadge.test.ts
git commit -m "feat: add AchievementBadge component with locked/unlocked states"
```

---

### Task 4: CardStylePicker Component

**Files:**
- Create: `src/lib/components/CardStylePicker.svelte`
- Create: `src/lib/components/CardStylePicker.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/components/CardStylePicker.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import CardStylePicker from './CardStylePicker.svelte';

describe('CardStylePicker', () => {
  it('renders all three style options', () => {
    render(CardStylePicker, { props: { value: 'classic' } });
    expect(screen.getByText('Classic')).toBeTruthy();
    expect(screen.getByText('Minimal')).toBeTruthy();
    expect(screen.getByText('Luxury')).toBeTruthy();
  });

  it('highlights the active option', () => {
    const { container } = render(CardStylePicker, { props: { value: 'minimal' } });
    const buttons = container.querySelectorAll('button');
    const minimalBtn = Array.from(buttons).find(b => b.textContent?.includes('Minimal'));
    expect(minimalBtn?.classList.contains('active')).toBe(true);
  });

  it('calls onchange when selecting a different style', async () => {
    const onchange = vi.fn();
    render(CardStylePicker, { props: { value: 'classic', onchange } });
    const luxuryBtn = screen.getByText('Luxury');
    await fireEvent.click(luxuryBtn);
    expect(onchange).toHaveBeenCalledWith('luxury');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/components/CardStylePicker.test.ts`
Expected: FAIL — component not found

- [ ] **Step 3: Implement CardStylePicker**

```svelte
<!-- src/lib/components/CardStylePicker.svelte -->
<script lang="ts">
import type { CardStyle } from '$lib/stores/settings.svelte';

interface Props {
	value?: CardStyle;
	onchange?: (style: CardStyle) => void;
}

let { value = 'classic', onchange }: Props = $props();

const styles: { name: CardStyle; label: string; preview: string }[] = [
	{ name: 'classic', label: 'Classic', preview: 'A♠' },
	{ name: 'minimal', label: 'Minimal', preview: 'A♠' },
	{ name: 'luxury', label: 'Luxury', preview: 'A♠' }
];

function select(style: CardStyle) {
	value = style;
	onchange?.(style);
}
</script>

<div class="card-style-picker">
	{#each styles as style}
		<button
			type="button"
			class="style-option"
			class:active={value === style.name}
			onclick={() => select(style.name)}
		>
			<span class="style-preview {style.name}">{style.preview}</span>
			<span class="style-label">{style.label}</span>
		</button>
	{/each}
</div>

<style>
	.card-style-picker {
		display: flex;
		gap: 8px;
	}
	.style-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		background: transparent;
		border: 1.5px solid var(--hairline);
		border-radius: 12px;
		cursor: pointer;
		color: var(--cream);
		transition: all 0.15s ease;
	}
	.style-option.active {
		background: rgba(245, 233, 212, 0.1);
		border-color: var(--coral);
	}
	.style-preview {
		font-size: 22px;
		font-weight: 700;
	}
	.style-preview.luxury {
		color: var(--gold);
		text-shadow: 0 1px 4px rgba(233, 185, 73, 0.4);
	}
	.style-preview.minimal {
		opacity: 0.7;
		font-weight: 400;
	}
	.style-label {
		font-family: var(--mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run src/lib/components/CardStylePicker.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/CardStylePicker.svelte src/lib/components/CardStylePicker.test.ts
git commit -m "feat: add CardStylePicker component with classic/minimal/luxury options"
```

---

### Task 5: Profile Page

**Files:**
- Create: `src/routes/you/+page.svelte`

- [ ] **Step 1: Create the profile page**

```svelte
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
import { cardStyle, soundEnabled, hapticsEnabled, setCardStyle, toggleSound, toggleHaptics } from '$lib/stores/settings.svelte';
import { calculateLevel, ACHIEVEMENTS, AchievementManager, type UserStats } from '$lib/core/gamification';
import { createClient } from '$lib/supabase';

const profile = $derived(profileStore.profile);
const level = $derived(profile ? calculateLevel(profile.xp) : null);
const achievements = $derived(Object.values(ACHIEVEMENTS));

// Session stats fetched separately (not in Profile interface)
let sessionStats = $state<{ total: number; perfect: number; longestStreak: number }>({
	total: 0, perfect: 0, longestStreak: 0
});

// AchievementManager instance for checking unlock status
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

const unlockedIds = $derived(achievementManager.getUnlockedAchievements().map(a => a.id));

async function fetchSessionStats() {
	if (!browser || !auth.user) return;
	const supabase = createClient();
	const { data } = await supabase
		.from('sessions')
		.select('xp_earned, accuracy')
		.eq('user_id', auth.user.id);
	if (data) {
		sessionStats.total = data.length;
		sessionStats.perfect = data.filter(s => s.accuracy === 100).length;
	}
	sessionStats.longestStreak = profile?.streak_count ?? 0;
}

$effect(() => {
	if (!auth.isAuthenticated && !auth.loading) {
		goto('/login');
	}
});

$effect(() => {
	if (auth.isAuthenticated) {
		profileStore.fetchProfile();
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
						<AchievementBadge
							{achievement}
							unlocked={unlockedIds.includes(achievement.id)}
						/>
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm exec tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to this file)

- [ ] **Step 3: Verify page loads in dev**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm dev`
Navigate to `/you` — should render profile page (may need auth redirect)

- [ ] **Step 4: Commit**

```bash
git add src/routes/you/+page.svelte
git commit -m "feat: add profile page with stats, achievements, settings, logout"
```

---

### Task 6: Integration Verification

- [ ] **Step 1: Run full test suite**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm vitest run`
Expected: ALL PASS

- [ ] **Step 2: Run typecheck**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm exec tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Run linter**

Run: `cd /Users/jonathangadeaharder/Documents/projects/games/Poker/tilt-app && pnpm dlx @biomejs/biome check src/`
Expected: No errors

- [ ] **Step 4: Commit any fixes**

If lint/type errors found, fix and commit.

---

### Task 7: Update Plane

- [ ] **Step 1: Mark work item as completed**

Update the Plane work item "Port Profile screen (stats, achievements, settings) with Tilt design" state to completed.
