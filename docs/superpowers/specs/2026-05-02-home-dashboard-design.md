# Home Dashboard — Design Spec

## Goal

Port `Design/screens/home.jsx` to SvelteKit as `src/routes/home/+page.svelte` with real Supabase data.

## Files

### New
- `src/lib/stores/profile.svelte.ts` — Profile + daily progress store (Svelte 5 runes)
- `src/routes/home/+page.server.ts` — SSR profile/daily-progress fetch
- `src/routes/home/+page.svelte` — Home dashboard component

### Modified
- `src/routes/+layout.svelte` — Add BottomNav for authenticated non-auth routes

## Profile Store

```ts
interface Profile {
  username: string | null;
  avatarUrl: string | null;
  level: number;
  xp: number;
  streakCount: number;
  lastSessionDate: string | null;
  onboardingCompleted: boolean;
  onboardingGoal: string | null;
  onboardingLevel: string | null;
  onboardingTime: number | null;
}

interface DailyProgress {
  xpEarned: number;
  sessionsCompleted: number;
  timeSpentSeconds: number;
}

interface ProfileStore {
  profile: Profile | null;
  dailyProgress: DailyProgress | null;
  loading: boolean;
  fetchProfile(userId: string): Promise<void>;
  fetchDailyProgress(userId: string, date: string): Promise<void>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<void>;
  addXP(userId: string, amount: number): Promise<void>;
}
```

- `$state` for profile, dailyProgress, loading
- `fetchProfile` — `supabase.from('profiles').select('*').eq('id', userId).single()`
- `fetchDailyProgress` — `supabase.from('daily_progress').select('*').eq('user_id', userId).eq('date', date).single()`
- `updateProfile` — `supabase.from('profiles').update(updates).eq('id', userId)`
- `addXP` — Updates both `profiles.xp` and `daily_progress.xp_earned`

## Home Page Sections

### 1. TopBar
- Left: avatar circle (gradient bg, first letter of username), "Hey, {name}", "Lvl {level} · {levelTitle}"
- Right: StreakBadge with streak count
- Uses existing `TopBar.svelte` component

### 2. Daily XP Hero Card
- Coral gradient background with radial glow
- "Today" eyebrow
- Large serif XP counter: `{xpToday}/{dailyGoal} xp`
- "Keep the streak hot 🔥" subtitle
- ProgressRing showing percentage
- "Continue session · {remaining} xp left" primary button
- Daily goal default: 100 XP (from profile or hardcoded default)

### 3. Hand of the Day
- Dark gradient card with PlayingCard display (Q♥ J♥)
- "WED · #284" eyebrow (date-based)
- "QJ suited on a wet board. Hero or zero?" title
- Difficulty dots (5 dots)
- "3 MIN · +50 XP" footer
- Clickable — navigates to lesson

### 4. Mood Picker
- 2x2 grid of buttons
- ⚡ "Just 5 min" / "Quick drill"
- 🧠 "Feel smart" / "Easy wins"
- 🔥 "Challenge" / "Hard mode"
- 🎬 "Replay" / "Last session"
- Each button navigates to lesson with mood param

### 5. Skill Tree
- "Your path" eyebrow, "3 / 18 MASTERED" counter
- 3 rows: Preflop ranges (100%), Continuation betting (65%), River decisions (0%)
- Each row: color bar, title, status label, progress bar
- Locked rows at 50% opacity
- Data from `training_progress` table

### 6. BottomNav
- Moved to `+layout.svelte` for authenticated routes
- Active tab: 'today'
- Uses existing `BottomNav.svelte` component

## Data Flow

1. `+page.server.ts` uses `createServerSupabase` to fetch profile + daily_progress
2. Returns `PageData` with profile, dailyProgress
3. `+page.svelte` receives via `$props()` and renders
4. Client-side profile store for live updates (XP earned during sessions)
5. `calculateLevel` from gamification module for level title/progress

## Supabase Queries

```sql
-- Profile
SELECT * FROM profiles WHERE id = :userId

-- Daily progress
SELECT * FROM daily_progress WHERE user_id = :userId AND date = :today

-- Training progress (for skill tree)
SELECT * FROM training_progress WHERE user_id = :userId
```

## Error Handling

- Profile not found → redirect to /onboarding
- Supabase error → show skeleton/placeholder, log error
- No daily progress row → default to { xpEarned: 0, sessionsCompleted: 0, timeSpentSeconds: 0 }

## Testing

- Manual verification: page loads, data displays, BottomNav works
- TypeScript: `pnpm exec tsc --noEmit` passes
- Build: `pnpm build` passes
