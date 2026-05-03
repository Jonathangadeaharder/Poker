# Tilt — Poker Training App

Mobile-first PWA poker training app. Learn strategy through interactive lessons, quizzes, spaced repetition flashcards, and reference charts. Duolingo-style approach to poker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 2 (Svelte 5 runes) |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (auth, database, SSR) |
| PWA | @vite-pwa/sveltekit |
| Build | Vite 8, adapter-auto |
| Linting | Biome |
| Testing | Vitest 4 + Testing Library + Playwright |
| Language | TypeScript |

## Getting Started

```bash
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Dev server
pnpm dev
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview build |
| `pnpm test` | Unit tests |
| `pnpm test:watch` | Watch mode |
| `pnpm test:coverage` | Coverage report |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm lint` | Biome check |
| `pnpm lint:fix` | Biome fix |
| `pnpm format` | Biome format |
| `pnpm check` | Svelte check + type check |

## Features

- **Onboarding** — 3-question quiz (goal, skill level, daily time) to personalize experience.
- **Home** — XP progress ring, daily goal, streak tracker, "Hand of the Day", mood picker, skill tree.
- **Interactive Lessons** — 5-hand sessions with setup/read/decide/reveal phases. Confidence slider, tell meter, XP rewards.
- **Learn** — 4 modules:
  - **Ranges** — GTO preflop RFI/3-bet/cold-call ranges for 6-max cash
  - **Push/Fold** — Nash equilibrium shove charts for MTT (20bb/15bb/10bb)
  - **Exploits** — Common leaks, exploit matrix, C-bet strategy, player profiles
  - **Training Plan** — 40-hour structured plans (Cash Game or MTT path)
- **Practice** — 10-question mixed quiz + SM-2 spaced repetition flashcard review (4 decks).
- **Profile** — Level/XP, stats, achievements (13), XP/accuracy charts, theme/card style pickers, PWA install.
- **Gamification** — 10 levels (Novice to Legend), XP for every action, daily goals, streak tracking, 13 achievements.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Redirect to `/home` or `/login` |
| `/login` | Email/password login |
| `/register` | Email/password signup |
| `/onboarding` | 3-question onboarding wizard |
| `/home` | Main dashboard |
| `/lesson` | Interactive hand scenario |
| `/learn/ranges` | GTO preflop ranges |
| `/learn/pushfold` | Push/fold charts |
| `/learn/exploits` | Exploitative strategy guide |
| `/learn/plan` | Training plans |
| `/practice/quiz` | Mixed quiz |
| `/practice/srs` | Spaced repetition review |
| `/profile` | Profile, stats, settings |
| `/results/[sessionId]` | Post-session results |

## Architecture

- `src/lib/stores/auth.svelte.ts` — Supabase auth state
- `src/lib/stores/profile.svelte.ts` — Profile, XP, training progress
- `src/lib/stores/settings.svelte.ts` — Theme, card style, sound/haptics
- `src/lib/engines/spacedRepetition.ts` — SM-2 algorithm, 4 poker decks
- `src/lib/engines/gamification.ts` — XP, levels, achievements, streaks
- `src/lib/engines/adaptiveEngine.ts` — Dynamic difficulty, weak topic detection
- `src/lib/engines/soundManager.ts` — Sound effects
- `src/lib/components/` — BottomNav, PlayingCard, ProgressRing, Confetti, etc.

## Supabase Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile (username, level, XP, streak) |
| `user_settings` | Per-user settings (theme, card style, sound) |
| `achievements` | Achievement definitions |
| `user_achievements` | Unlocked achievements |
| `training_progress` | Module progress |
| `srs_cards` | Flashcard state (SM-2 parameters) |
| `sessions` | Completed training sessions |
| `daily_progress` | Daily XP/session tracking |

All tables have RLS. Auto-created profile + settings on signup via trigger.

## Design

- **Fonts**: Instrument Serif (display), JetBrains Mono, Geist
- **PWA**: Standalone display, workbox caching
- **Card styles**: Classic, Minimal, Luxury
