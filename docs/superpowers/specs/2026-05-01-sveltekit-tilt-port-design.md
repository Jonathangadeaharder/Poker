# Tilt — SvelteKit Poker Training Port Design

## Summary

Full rewrite of the React Native Poker Training Pro app into modern SvelteKit 2 + Svelte 5, fused with the Tilt design system (source of truth: `Design/` folder). All existing features ported and restyled. Supabase for auth + DB + realtime.

## Architecture

**Stack**: SvelteKit 2, Svelte 5 (runes), TailwindCSS 4, Supabase (auth + Postgres + Realtime), Vitest, Playwright, Biome

**Source of truth**: `Design/` folder — its visual language, component styling, screen layouts, and UX patterns override the existing React Native UI.

### Routing

```
src/routes/
├── +layout.svelte              # Auth guard, theme, global shell
├── +page.svelte                # redirect → /onboarding or /home
├── onboarding/
│   └── +page.svelte            # 3-step wizard → personalized plan
├── home/
│   └── +page.svelte            # Dashboard (daily XP, hand of day, mood picker, skill tree)
├── lesson/
│   └── [id]/
│       └── +page.svelte        # Interactive hand simulation (tell meter, confidence, reveal)
├── results/
│   └── [sessionId]/
│       └── +page.svelte        # Session stats, confetti, achievement, insight
├── learn/
│   ├── ranges/
│   │   └── +page.svelte        # GTO range trainer (RFI, 3-bet, cold call)
│   ├── pushfold/
│   │   └── +page.svelte        # Push/fold chart explorer
│   ├── exploits/
│   │   └── +page.svelte        # Exploitative strategy guide
│   └── plan/
│       └── +page.svelte        # 40-hour training plan tracker
├── practice/
│   ├── quiz/
│   │   └── +page.svelte        # Interactive quiz game
│   └── srs/
│       └── +page.svelte        # Spaced repetition flashcards
└── profile/
    └── +page.svelte            # Stats, achievements, settings
```

### State Management

Svelte 5 runes throughout. No external state library.

- `$state` — component-level reactive state
- `$derived` — computed values (XP progress, streak status, card stats)
- `$effect` — side effects (Supabase sync, animations, sound triggers)
- Shared stores in `src/lib/stores/` as Svelte 5 module-level state (user profile, settings, SRS decks)

### Data Layer

```
src/lib/
├── supabase.ts                 # Client init, typed DB schema
├── stores/
│   ├── auth.svelte.ts          # User session, auth state
│   ├── profile.svelte.ts       # XP, level, streak, achievements
│   ├── settings.svelte.ts      # Sound, haptics, theme, card style
│   └── srs.svelte.ts           # Decks, cards, study sessions
├── core/
│   ├── gamification.ts         # XP rewards, levels, achievements, streaks
│   ├── spacedRepetition.ts     # SM-2 algorithm, Card/Deck/StudySession classes
│   ├── soundManager.ts         # Web Audio API + vibration
│   └── adaptiveEngine.ts       # Difficulty adjustment
├── data/
│   ├── pokerRanges.ts          # GTO preflop ranges
│   ├── pushFoldCharts.ts       # MTT push/fold charts
│   ├── exploitativeStrategies.ts
│   ├── trainingPlan.ts         # 40-hour plan
│   ├── miniGames.ts            # Quiz generators
│   ├── ploQuestions.ts         # PLO quiz bank
│   └── nlheMttQuestions.ts     # NLHE MTT quiz bank
└── components/
    ├── ui/                     # Design system primitives
    │   ├── PlayingCard.svelte
    │   ├── TopBar.svelte
    │   ├── StreakBadge.svelte
    │   ├── ProgressRing.svelte
    │   ├── Confetti.svelte
    │   ├── Button.svelte
    │   ├── Pill.svelte
    │   └── Chip.svelte
    ├── layout/                 # Page shells
    │   ├── BottomNav.svelte
    │   └── Screen.svelte
    └── gamification/           # XP bar, achievements, streak flame
        ├── XPBar.svelte
        ├── StreakFlame.svelte
        └── AchievementBadge.svelte
```

### Supabase Schema

```sql
-- Auth: Supabase Auth (email + password + magic link)

-- Profiles
profiles (
  id UUID PK REFERENCES auth.users,
  total_xp INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  total_sessions INT DEFAULT 0,
  perfect_quizzes INT DEFAULT 0,
  onboarding_goal TEXT,
  onboarding_level TEXT,
  onboarding_time INT,
  created_at TIMESTAMPTZ
)

-- Achievements
user_achievements (
  id UUID PK,
  user_id UUID REFERENCES profiles,
  achievement_key TEXT,
  unlocked_at TIMESTAMPTZ
)

-- Training progress
training_progress (
  id UUID PK,
  user_id UUID REFERENCES profiles,
  path_key TEXT,        -- 'CASH_GAME' | 'MTT'
  completed_modules INT[],
  updated_at TIMESTAMPTZ
)

-- SRS cards
srs_cards (
  id UUID PK,
  user_id UUID REFERENCES profiles,
  deck_key TEXT,
  front TEXT,
  back TEXT,
  category TEXT,
  tags TEXT[],
  n INT DEFAULT 0,
  ef REAL DEFAULT 2.5,
  interval_days INT DEFAULT 0,
  next_review DATE,
  last_reviewed DATE,
  total_reviews INT DEFAULT 0,
  correct_reviews INT DEFAULT 0,
  streak_correct INT DEFAULT 0
)

-- Session history
sessions (
  id UUID PK,
  user_id UUID REFERENCES profiles,
  type TEXT,             -- 'quiz' | 'srs' | 'lesson'
  duration_seconds INT,
  accuracy REAL,
  xp_earned INT,
  cards_studied INT,
  metadata JSONB,
  created_at TIMESTAMPTZ
)

-- Settings
user_settings (
  user_id UUID PK REFERENCES profiles,
  sound_enabled BOOLEAN DEFAULT true,
  haptics_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'felt',
  card_style TEXT DEFAULT 'classic'
)
```

### Design System (from Design/ folder)

**Color tokens** (CSS custom properties):
- `--felt`: #0e2a20 (primary background)
- `--cream`: #f5e9d4 (primary text)
- `--coral`: #ff5b48 (CTA, accents)
- `--gold`: #e9b949 (progress, rewards)
- Theme variants: felt, midnight, clay, paper

**Typography**:
- Display/headlines: Instrument Serif
- Body: Geist
- Monospace/data: JetBrains Mono

**Key components from Design/**:
- `PlayingCard` — 3 treatments (classic, minimal, luxury), 4 sizes, face-down state, deal animation
- `TopBar` — back button, center title, right slot
- `StreakBadge` — fire emoji + count pill
- `ProgressRing` — SVG circular progress
- `Confetti` — celebration animation
- `Button` variants: btn-primary (coral 3D), btn-ghost, btn-cream
- `Pill` — metadata badge
- `Chip` — poker chip visual

**Novel UX from Design/ (not in existing app)**:
- **Tell meter**: animated progress bar during hand reading phase
- **Confidence slider**: scales XP reward/penalty based on player confidence
- **Mood picker**: 2x2 grid (quick drill, easy wins, hard mode, replay)
- **Hand of the Day**: daily featured hand scenario
- **Skill tree**: visual path progress (mastered/in-progress/locked)
- **Session insights**: post-session analytics ("You bluff-catch too rarely on the river")
- **Onboarding wizard**: 3 questions → personalized daily plan

## Epics (8)

1. **Project Scaffold & Design System** — SvelteKit project, Tailwind config, Tilt tokens, base components
2. **Auth & Onboarding** — Supabase auth, onboarding wizard (3-step + plan reveal)
3. **Core Engines** — Gamification (XP/levels/achievements/streaks), SM-2 spaced repetition, sound/haptics
4. **Home Dashboard** — Daily progress, hand of the day, mood picker, skill tree, bottom nav
5. **Interactive Lesson** — Hand simulation screen (tell meter, confidence slider, reveal, XP calc)
6. **Learning Tools** — Range trainer, push/fold charts, exploitative guide, training plan (all restyled)
7. **Practice Modes** — Quiz game, SRS flashcards, results screen
8. **Profile & Settings** — User stats, achievement gallery, theme picker, settings

## Testing

- Vitest for unit tests (core engines, stores)
- Playwright for E2E (full flows)
- Branch coverage ≥90%
