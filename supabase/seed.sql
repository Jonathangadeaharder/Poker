-- Seed data for local development (`supabase db reset` runs this after the
-- migrations). Seeds the `achievements` reference table so the local DB
-- matches the 13 achievements defined client-side in
-- src/lib/core/gamification.ts (key/description/emoji/requirement mirror the
-- client's id/description/icon/requirement). Idempotent via ON CONFLICT.

INSERT INTO public.achievements (key, name, description, emoji, category, requirement_type, requirement_value) VALUES
  ('first_steps',      'First Steps',      'Complete your first training session',        '🎯', 'sessions', 'sessionsCompleted',     1),
  ('dedicated_learner','Dedicated Learner','Complete 10 training sessions',               '📖', 'sessions', 'sessionsCompleted',    10),
  ('tilt_scholar',     'Tilt Scholar',     'Complete all 7 days of the training plan',    '🎓', 'plan',     'trainingPlanCompleted', 1),
  ('week_warrior',     '7-Day Streak',     'Train 7 days in a row',                       '🔥', 'streak',   'currentStreak',         7),
  ('month_master',     '30-Day Streak',    'Train 30 days in a row',                      '💪', 'streak',   'currentStreak',        30),
  ('unstoppable',      'Unstoppable',      'Train 100 days in a row',                     '⚡', 'streak',   'currentStreak',       100),
  ('quiz_rookie',      'Quiz Rookie',      'Complete your first quiz',                    '❓', 'quiz',     'quizzesCompleted',      1),
  ('perfect_score',    'Perfect!',         'Score 100% in a quiz',                        '💯', 'quiz',     'perfectQuizzes',        1),
  ('quiz_master',      'Quiz Master',      'Score 100% in 5 quizzes in a row',            '🏆', 'quiz',     'perfectQuizStreak',     5),
  ('range_explorer',   'Range Explorer',   'Study all 6 positions',                       '🗺️', 'learn',    'positionsStudied',      6),
  ('push_fold_pro',    'Push/Fold Pro',    'Master all 3 stack sizes',                    '📊', 'learn',    'stackSizesMastered',    3),
  ('exploit_hunter',   'Exploit Hunter',   'Study all 5 common leaks',                    '🎯', 'learn',    'leaksStudied',          5),
  ('lightning_fast',   'Lightning Fast',   'Answer 10 questions in under 5 seconds each', '⚡', 'speed',    'speedDrillsFast',      10)
ON CONFLICT (key) DO NOTHING;
