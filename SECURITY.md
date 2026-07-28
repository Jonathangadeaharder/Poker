# Security

## Row Level Security and the single-player assumption

All progression data is protected by Row Level Security policies scoped to
`auth.uid() = user_id` (see `supabase/migrations/`). A user can write their own
progression — `profiles.xp` / `level` / `streak_count` (UPDATE), `user_achievements`
(INSERT), and `sessions` (INSERT) — **without server-side validation** of the
underlying performance.

This is safe **only because Tilt is single-player**: there is no leaderboard or
competitive surface, so falsifying your own progress gains nothing.

**If a leaderboard or any shared/competitive feature is ever added**, these grants
must move behind a `SECURITY DEFINER` RPC (with `SET search_path`) that validates
the completed session server-side before awarding xp / level / streak /
achievements. Until then, self-reported progression is an accepted trade-off for a
client-driven single-player app.
