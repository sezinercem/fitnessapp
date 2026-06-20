# Apex

Premium black-and-red full-stack fitness app built with Next.js, TypeScript, Tailwind CSS, Supabase Auth, Supabase database, server actions, RLS policies, and Zod validation.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Supabase values to `.env.local`. Do not commit `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

The frontend uses only public Supabase browser-safe keys. Never add a Supabase service-role key to this app or any committed file.

## Supabase database

Run the SQL migrations in order from `supabase/migrations` in your Supabase SQL editor or through the Supabase CLI:

1. `001_initial_schema.sql`
2. `002_guided_onboarding_tracking.sql`
3. `003_selected_training_days.sql`
4. `004_workout_sessions_progressive_overload.sql`
5. `005_exercise_categories_and_split_preferences.sql`

They create:

- `profiles`
- `workout_plans`
- `workout_days`
- `workout_exercises`
- `exercise_library`
- `nutrition_plans`
- `nutrition_meals`
- `workout_logs`
- `onboarding_answers`
- `weekly_training_plans`
- `training_days`
- `planned_exercises`
- `workout_sets`
- `workout_sessions`
- `workout_session_exercises`
- `exercise_history`
- `personal_records`
- `body_weight_logs`
- `body_measurements`
- `nutrition_targets`
- `meals`

RLS is enabled on every table. User-owned tables use `auth.uid()` policies so users can only read, create, edit, and delete their own rows. Child tables also validate that their parent record belongs to the authenticated user.

## Features

- Landing page, login, sign up, password reset request
- Middleware-protected private routes
- Guided onboarding after sign up with generated weekly training and starter nutrition plans
- Dashboard command centre with today’s plan and Monday-Sunday cards
- Workout tracking with sets, weight, reps, rest time, RPE, notes, and completion status
- Progress page with history, weekly consistency, volume, PRs, body weight, and measurements
- First-login plan templates and scratch plan creation
- Workout plan editing, day rename, exercise add/edit/replace/delete, completion logging
- Recommendation picker based on goal, experience, and equipment
- Editable nutrition targets and meals with plain-English purpose text
- Exercise library with polished coded visual explainers
- Profile/settings page
- Zod validation, input sanitisation, best-effort auth action rate limiting

## GitHub push steps

```bash
cd fitnessapp
git init
git add .
git commit -m "Initial fitness app build"
git branch -M main
git remote add origin https://github.com/sezinercem/fitnessapp.git
git push -u origin main
```
