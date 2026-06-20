# fitnessapp

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

Run the SQL migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor or through the Supabase CLI. It creates:

- `profiles`
- `workout_plans`
- `workout_days`
- `workout_exercises`
- `exercise_library`
- `nutrition_plans`
- `nutrition_meals`
- `workout_logs`

RLS is enabled on every table. User-owned tables use `auth.uid()` policies so users can only read, create, edit, and delete their own rows. Child tables also validate that their parent record belongs to the authenticated user.

## Features

- Landing page, login, sign up, password reset request
- Middleware-protected private routes
- Dashboard with plan, today workout, progress, nutrition, quick actions, recommendations, and recent activity
- First-login plan templates and scratch plan creation
- Workout plan editing, day rename, exercise add/edit/replace/delete, completion logging
- Recommendation picker based on goal, experience, and equipment
- Editable nutrition plan with meal add/edit/delete/reorder
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
