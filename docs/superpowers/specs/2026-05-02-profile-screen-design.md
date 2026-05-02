# Profile Screen Design Spec

**Date:** 2026-05-02
**Epic:** TILT Epic 8 — Profile & Settings
**Work Item:** Port Profile screen (stats, achievements, settings) with Tilt design

## Overview

Port the React Native `ProfileScreen.js` to SvelteKit as `/you/+page.svelte` using the Tilt design system (felt/coral/cream theme). The screen serves as the user's personal hub: level progress, streak, achievements, settings, and account actions.

## Route

- **Path:** `/you/+page.svelte`
- **Layout:** Uses existing `+layout.svelte` with BottomNav (already maps "You" tab to `/you`)
- **Auth:** Protected route — redirect to `/login` if unauthenticated (handled by root layout guard)

## Visual Layout (top to bottom)

### 1. TopBar
- Title: "You"
- Right slot: Settings gear icon (smooth-scrolls to Settings section)

### 2. Profile Hero
- **ProgressRing** (existing component, size=120px)
  - Shows current level progress (XP into current level / XP for next level)
  - Center: level number
  - Sublabel: level name (e.g., "Card Shark")
- Username (bold, --serif font)
- Email (muted, --sans font, smaller)

### 3. Streak Section
- **StreakBadge** (existing component) with current streak count
- Text: "{X} day streak" or "Start your streak today!"
- Last active date if streak > 0

### 4. Stats Grid
- 2x2 grid layout
- Each cell: stat value (large, bold) + label (small, muted)
- Stats: Total Sessions, Perfect Quizzes, Longest Streak, Achievements Unlocked
- Use `Chip` or custom stat card with felt background

### 5. Achievements Section
- Header: "Achievements ({unlocked}/{total})"
- 3-column grid of achievement badges
- Each badge: icon + short name
- **Unlocked:** Full color, coral border
- **Locked:** Greyscale, opacity 0.4, lock icon overlay
- Tap/click badge → popover tooltip showing name + description (CSS-only, no JS library)
- Source: `ACHIEVEMENTS` from `gamification.ts`, cross-reference with `AchievementManager.getUnlocked()`

### 6. Settings Section
- Header: "Settings"
- **Sound toggle** — Switch, reads/writes `soundManager.isEnabled`
- **Haptics toggle** — Switch, reads/writes `soundManager.isHapticsEnabled`
- **Theme picker** — Existing `ThemePicker.svelte` component (felt/midnight/clay/paper)
- **Card style picker** — New 3-option segmented control: Classic / Minimal / Luxury
  - Each option shows a mini PlayingCard preview in that style
  - Persisted to Supabase `user_settings.card_style`

### 7. About Section
- Header: "About"
- App version (e.g., "Tilt v0.1.0")
- Subtle, muted text

### 8. Logout Button
- `Button` component, variant="ghost", full width
- Text: "Sign Out"
- Calls `auth.signOut()`, redirects to `/login`

## Data Sources

| Data | Store/Source | Notes |
|------|-------------|-------|
| Username, email, XP, level, streak | `profile.svelte.ts` → `fetchProfile()` | Supabase `profiles` table |
| Achievements list | `gamification.ts` → `ACHIEVEMENTS` | Static data |
| Unlocked achievements | `gamification.ts` → `AchievementManager` | Checks XP/milestones |
| Sound/haptics state | `soundManager.ts` | Singleton, in-memory + localStorage |
| Theme | `settings.svelte.ts` (existing `theme` store) | CSS variable switching |
| Card style | `settings.svelte.ts` (new `cardStyle` store) | Persisted to Supabase |
| Session stats | Supabase `sessions` table | For total sessions, perfect quizzes |

## New Store: Card Style

**File:** `src/lib/stores/settings.svelte.ts` (extend existing)

```typescript
export type CardStyle = 'classic' | 'minimal' | 'luxury';

export const cardStyle = $state<CardStyle>('classic');

// Load from Supabase user_settings on auth
// Save to Supabase on change via $effect
```

**PlayingCard integration:** `PlayingCard.svelte` reads `cardStyle` and applies different visual treatments:
- `classic` — Full card with suit symbols, decorative borders
- `minimal` — Clean, thin borders, subtle suits
- `luxury` — Gold accents, deeper shadows, premium feel

## Components to Create

### `src/routes/you/+page.svelte`
Main profile page. Composes existing components + new sections.

### `src/lib/components/AchievementBadge.svelte`
Props: `achievement` (from ACHIEVEMENTS), `unlocked: boolean`
- Icon + name
- Locked state: greyscale, lock overlay
- Hover/tap: show description tooltip

### `src/lib/components/CardStylePicker.svelte`
Props: `value: CardStyle`, `onchange: (style: CardStyle) => void`
- 3-option segmented control
- Mini PlayingCard preview per option

### `src/lib/components/StatCard.svelte`
Props: `value: string | number`, `label: string`
- Large value + muted label
- Felt background card

## Components to Modify

### `src/lib/components/PlayingCard.svelte`
- Import `cardStyle` store
- Add conditional CSS classes based on style

### `src/lib/stores/settings.svelte.ts`
- Add `cardStyle` state
- Add load/save logic for Supabase `user_settings`

## Supabase Schema

The `user_settings` table (from Epic 2 schema) should have a `card_style` column:

```sql
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'classic';
```

If the column doesn't exist, create a migration.

## Testing

- Unit tests for `AchievementBadge` (locked/unlocked rendering)
- Unit tests for `CardStylePicker` (selection, visual preview)
- Unit tests for card style store (load/save)
- Integration test: profile page loads data, displays correctly
- E2E: navigate to /you, verify stats display, toggle settings, change card style

## Out of Scope

- Analytics charts (separate work item)
- PWA support (separate work item)
- Avatar upload (future feature)
- Account deletion (future feature)
