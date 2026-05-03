# GitHub Copilot Instructions for Tilt Poker Training App

## Project Overview

Tilt is a mobile-first SvelteKit PWA for poker training. Duolingo-style approach: interactive lessons, quizzes, spaced repetition flashcards, and reference charts. Built with Svelte 5 runes, TypeScript, Tailwind CSS 4, and Supabase.

## Technology Stack

- **Framework**: SvelteKit 2 with Svelte 5 (runes mode: `$state`, `$derived`, `$effect`, `$props`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + custom CSS design tokens
- **Auth/DB**: Supabase (`@supabase/ssr` + `@supabase/supabase-js`)
- **PWA**: `@vite-pwa/sveltekit`
- **Build**: Vite 8, adapter-auto
- **Linting**: Biome (tabs, single quotes, no trailing commas)
- **Testing**: Vitest 4 + `@testing-library/svelte` + Playwright for E2E

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Root layout, auth guard
│   ├── +page.svelte            # Redirect: /home or /login
│   ├── (auth)/
│   │   ├── login/+page.svelte
│   │   └── register/+page.svelte
│   ├── home/+page.svelte       # Main dashboard
│   ├── lesson/+page.svelte     # Interactive hand scenario
│   ├── learn/
│   │   ├── ranges/+page.svelte
│   │   ├── pushfold/+page.svelte
│   │   ├── exploits/+page.svelte
│   │   └── plan/+page.svelte
│   ├── practice/
│   │   ├── quiz/+page.svelte
│   │   └── srs/+page.svelte
│   ├── profile/+page.svelte
│   ├── onboarding/+page.svelte
│   └── results/[sessionId]/+page.svelte
├── lib/
│   ├── stores/
│   │   ├── auth.svelte.ts      # Supabase auth state
│   │   ├── profile.svelte.ts   # Profile, XP, progress
│   │   └── settings.svelte.ts  # Theme, card style, sound
│   ├── engines/
│   │   ├── spacedRepetition.ts # SM-2 algorithm
│   │   ├── gamification.ts     # XP, levels, achievements
│   │   ├── adaptiveEngine.ts   # Difficulty adjustment
│   │   └── soundManager.ts     # Sound effects
│   ├── components/             # Reusable UI components
│   └── data/                   # Static content (ranges, charts, etc.)
└── app.css                     # Global styles + design tokens
```

## Coding Standards

### Svelte 5 Runes

Use runes exclusively. No legacy Svelte 4 patterns.

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
  $effect(() => {
    console.log(count);
  });
  let { title, onclick }: { title: string; onclick: () => void } = $props();
</script>
```

### State Management

- Use `$state` / `$derived` / `$effect` for component state
- Use Svelte 5 stores (`*.svelte.ts`) for shared state
- Supabase auth via `auth.svelte.ts` store
- Profile data via `profile.svelte.ts` store
- Local settings via `settings.svelte.ts` (localStorage persistence)

### Supabase Patterns

```typescript
// Server-side (in +page.server.ts or +layout.server.ts)
import { createServerClient } from '@supabase/ssr';

// Client-side (in components/stores)
import { createBrowserClient } from '@supabase/ssr';
```

- Use RLS policies for all tables
- Auth state via `onAuthStateChange` listener
- Browser client for client-side queries
- Server client with cookies for SSR

### Styling

- Tailwind CSS 4 utility classes
- Custom CSS variables for design tokens
- Mobile-first responsive design
- Use `app.css` for global styles

### Testing

- Unit tests: Vitest + Testing Library
- E2E tests: Playwright
- 90% branch coverage threshold
- Test files in `tests/` directory

## Key Patterns

### Screen Component Pattern

```svelte
<script lang="ts">
  import { profileStore } from '$lib/stores/profile.svelte';
  
  let loading = $state(true);
  
  $effect(() => {
    loadData();
  });
  
  async function loadData() {
    try {
      await profileStore.load();
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  <!-- content -->
{/if}
```

### Gamification Integration

```typescript
import { gamification } from '$lib/engines/gamification';

// Award XP
gamification.awardXP('quiz_completed');

// Check achievements
gamification.checkAchievements();
```

### Spaced Repetition

```typescript
import { SpacedRepetition } from '$lib/engines/spacedRepetition';

const sr = new SpacedRepetition();
sr.addCard({ front: '...', back: '...', deck: 'preflop' });
const dueCards = sr.getDueCards();
sr.reviewCard(cardId, 'good'); // again | hard | good | easy
```

## Anti-Patterns to Avoid

1. **No Svelte 4 syntax** — No `export let`, no `$:` reactive declarations, no `stores`
2. **No `any` types** — Use proper TypeScript types
3. **No direct DOM manipulation** — Use Svelte bindings
4. **No `onMount` for data loading** — Use `$effect` or `+page.server.ts`
5. **No client-side auth checks in `+page.server.ts`** — Use `+layout.server.ts` for auth guards

## Build & Development

```bash
pnpm install       # Install dependencies
pnpm dev           # Dev server
pnpm build         # Production build
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests
pnpm lint          # Biome check
pnpm check         # Type check
```

## Design Tokens

- **Fonts**: Instrument Serif (display), JetBrains Mono, Geist
- **Card styles**: Classic, Minimal, Luxury
- **PWA**: Standalone display mode
