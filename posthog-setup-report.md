<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Tilt poker training app. The integration includes:

- **Client-side initialization** via `src/hooks.client.ts` — PostHog JS is initialized once at app start using the EU host with a reverse proxy at `/ingest`, session replay enabled, and automatic exception capture.
- **Server-side error capture** via `src/hooks.server.ts` — a reverse proxy routes `/ingest` requests to EU PostHog servers; unhandled server errors are captured with `handleError`.
- **Server-side PostHog singleton** at `src/lib/server/posthog.ts` for future server-side event tracking.
- **Session replay** support enabled by setting `paths.relative: false` in `svelte.config.js`.
- **User identification** — users are identified in PostHog on login (`posthog.identify`) and the session is reset on logout (`posthog.reset`).
- **13 custom events** instrumented across 8 files covering authentication, onboarding, all three practice modes (quiz, SRS flashcards, lesson), and engagement signals.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully registered; email sent for confirmation | `src/routes/(auth)/register/+page.svelte` |
| `user_signed_in` | User signed in with email/password | `src/routes/(auth)/login/+page.svelte` |
| `user_signed_out` | User signed out from profile settings | `src/routes/profile/+page.svelte` |
| `onboarding_question_answered` | User answered one of 3 onboarding questions (goal, level, time) | `src/routes/onboarding/+page.svelte` |
| `onboarding_completed` | User finished onboarding; includes goal, level, and daily_minutes | `src/routes/onboarding/+page.svelte` |
| `quiz_completed` | 10-question quiz finished; includes score, accuracy, xp_earned, is_perfect | `src/routes/practice/quiz/+page.svelte` |
| `srs_session_started` | User started a spaced-repetition flashcard session; includes deck_name | `src/routes/practice/srs/+page.svelte` |
| `srs_session_completed` | SRS session finished; includes new_cards, reviews, accuracy, xp_earned | `src/routes/practice/srs/+page.svelte` |
| `srs_card_rated` | User rated a flashcard (again/hard/good/easy); includes next_interval_days | `src/routes/practice/srs/+page.svelte` |
| `lesson_decision_made` | User made a poker action (fold/call/raise); includes choice, is_correct, confidence | `src/routes/lesson/+page.svelte` |
| `lesson_session_completed` | User finished all lesson hands; includes total_hands, xp_earned | `src/routes/lesson/+page.svelte` |
| `mood_selected` | User tapped a mood button on the home screen (e.g. "Challenge") | `src/routes/home/+page.svelte` |
| `app_install_accepted` | User accepted the PWA add-to-home-screen prompt | `src/routes/profile/+page.svelte` |

## Next steps

We've built a dashboard and five insights to monitor user behavior based on the events instrumented above:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/171629/dashboard/666609
- **Signup → Onboarding Funnel** (conversion rate from signup to onboarding completion): https://eu.posthog.com/project/171629/insights/WGGNkwNq
- **Daily Practice Activity** (trend of quiz, SRS, and lesson completions per day): https://eu.posthog.com/project/171629/insights/nDvVATYI
- **Quiz Average Accuracy** (weekly average accuracy % from quiz_completed events): https://eu.posthog.com/project/171629/insights/2a8iu2F1
- **SRS Card Rating Distribution** (breakdown of Again / Hard / Good / Easy ratings): https://eu.posthog.com/project/171629/insights/9Otr3WIP
- **Lesson Decision Accuracy Rate** (weekly correct vs incorrect poker decisions): https://eu.posthog.com/project/171629/insights/ARzNGid4

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
