# Epic 8: Profile & PWA

## Overview

Combined epic covering:
1. **Profile page** (`/profile`) — user stats, achievements, analytics (mock), settings
2. **PWA support** — manifest, service worker, install prompt

## Profile Page

### Route
`/profile/+page.svelte`

### Layout (top to bottom)

1. **Hero card**
   - Avatar initial circle (gradient background, first letter of username)
   - Username text
   - Level badge: "Lvl {n} · {title}" (from `calculateLevel()`)
   - XP progress bar: animated, shows `xpInCurrentLevel / xpForNextLevel`

2. **Stats row**
   - 4-column grid
   - Sessions: `profileStore.trainingProgress.length` (count of training_progress rows)
   - Streak: `profile.streak_count`
   - Achievements: count of unlocked achievements
   - Best Streak: `profile.streak_count` (current streak — `longest_streak` column can be added to schema later)

3. **Analytics card** — "Your Progress"
   - XP trend chart: SVG polyline, last 7 days, mock data
   - Accuracy chart: SVG polyline, last 7 days, mock data
   - Both marked `// TODO: replace with real session data`

4. **Achievement gallery**
   - Horizontal scroll of badge cards
   - Unlocked: full color, icon, title, XP reward
   - Locked: grayed out, progress bar (from `AchievementManager.getProgress()`)
   - Uses `ACHIEVEMENTS` from gamification.ts

5. **Settings card**
   - Sound toggle: `soundManager.setEnabled(bool)` (Switch component)
   - Theme picker: existing `ThemePicker` component
   - Install app: PWA install button (hidden if unsupported/installed)
   - Logout: coral button, confirmation dialog, calls `auth.logout()`

### Data Sources

| Data | Source | Real/Mock |
|------|--------|-----------|
| XP, streak, username, level | `profileStore.profile` | Real |
| Daily XP | `profileStore.dailyProgress` | Real |
| Module progress | `profileStore.trainingProgress` | Real |
| Achievements | `ACHIEVEMENTS` + `AchievementManager` | Real |
| XP trend (7 days) | Hardcoded array | Mock |
| Accuracy (7 days) | Hardcoded array | Mock |
| Best streak | `profile.streak_count` | Real (current streak) |

### Settings Persistence

- Sound: in-memory via `soundManager.setEnabled()` (singleton)
- Theme: CSS variables via `applyTheme()` (theme.ts)
- No Supabase settings table — localStorage can be added later

## PWA Setup

### Manifest
`static/manifest.json`
- name: "Tilt Poker Training"
- short_name: "Tilt"
- theme_color: `#0e2a20` (felt green)
- background_color: `#0e2a20`
- display: `standalone`
- Icons: poker chip SVG (192x192, 512x512) — placeholder, replace with real icon later

### Service Worker
Use `vite-plugin-pwa` (standard for SvelteKit):
- Auto-generates service worker from manifest config
- Caches app shell + static assets on install
- Network-first for Supabase calls
- Cache-first for static assets

### Install Button
- Listens for `beforeinstallprompt` browser event
- Stores event, calls `.prompt()` on button click
- Hidden if already installed (`appinstalled` event) or unsupported
- Lives in profile settings section

## Routing

### BottomNav Integration
- "You" tab routes to `/profile` (update `+layout.svelte` from `/you`)
- `activeTab` checks `path.startsWith('/profile')`
- Auth guard: redirect to `/login` if not authenticated

### Files to Create
- `tilt-app/src/routes/profile/+page.svelte`
- `tilt-app/static/manifest.json`

### Files to Modify
- `tilt-app/src/routes/+layout.svelte` — update "you" route
- `tilt-app/vite.config.ts` — add vite-plugin-pwa
- `tilt-app/package.json` — add vite-plugin-pwa dependency

## Design Tokens

Uses existing CSS variables:
- `--felt`, `--felt-2`, `--felt-3` — backgrounds
- `--cream`, `--cream-dim` — text
- `--coral`, `--gold` — accents
- `--hairline` — borders
- `--mono` — monospace font
- `.eyebrow`, `.serif`, `.mono` — text styles
- `.btn`, `.btn-primary`, `.btn-ghost` — button styles

## Component Reuse

| Component | Usage |
|-----------|-------|
| `TopBar` | Page header with back button |
| `ProgressRing` | XP progress in hero |
| `StreakBadge` | Streak display in stats |
| `ThemePicker` | Theme selection in settings |
| `Pill` | Achievement XP rewards |
| `Confetti` | Achievement unlock animation |

## Scope Exclusions

- No Supabase `user_settings` table (settings are client-side only)
- No real analytics data (mock arrays until `training_sessions` table exists)
- No card style picker (deferred)
- No haptics toggle in settings (deferred)
- No "About" section (low value for MVP)
