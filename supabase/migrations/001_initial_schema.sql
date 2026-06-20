create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  goal text,
  experience text,
  equipment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal text not null,
  experience text not null,
  equipment text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  day_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_id uuid not null references public.workout_days(id) on delete cascade,
  exercise_name text not null,
  sets integer not null default 3,
  reps text not null default '10',
  rest_seconds integer not null default 60,
  tempo text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exercise_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  muscle_groups text[] not null default '{}',
  equipment text not null,
  difficulty text not null,
  instructions text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  safety_tips text[] not null default '{}',
  related_exercises text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, slug)
);

create table if not exists public.nutrition_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  goal text not null,
  daily_calories integer not null,
  protein_target integer not null,
  carbs_target integer not null,
  fat_target integer not null,
  meals_per_day integer not null,
  water_target_liters numeric(4,1) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nutrition_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.nutrition_plans(id) on delete cascade,
  meal_name text not null,
  calories integer not null default 0,
  protein integer not null default 0,
  carbs integer not null default 0,
  fat integer not null default 0,
  ingredients text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.workout_plans(id) on delete set null,
  day_id uuid references public.workout_days(id) on delete set null,
  completed_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workout_plans_user_id_idx on public.workout_plans(user_id);
create index if not exists workout_days_user_id_idx on public.workout_days(user_id);
create index if not exists workout_days_plan_id_idx on public.workout_days(plan_id);
create index if not exists workout_exercises_user_id_idx on public.workout_exercises(user_id);
create index if not exists workout_exercises_day_id_idx on public.workout_exercises(day_id);
create index if not exists nutrition_meals_user_id_idx on public.nutrition_meals(user_id);
create index if not exists workout_logs_user_id_idx on public.workout_logs(user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists workout_plans_set_updated_at on public.workout_plans;
create trigger workout_plans_set_updated_at before update on public.workout_plans for each row execute function public.set_updated_at();
drop trigger if exists workout_days_set_updated_at on public.workout_days;
create trigger workout_days_set_updated_at before update on public.workout_days for each row execute function public.set_updated_at();
drop trigger if exists workout_exercises_set_updated_at on public.workout_exercises;
create trigger workout_exercises_set_updated_at before update on public.workout_exercises for each row execute function public.set_updated_at();
drop trigger if exists exercise_library_set_updated_at on public.exercise_library;
create trigger exercise_library_set_updated_at before update on public.exercise_library for each row execute function public.set_updated_at();
drop trigger if exists nutrition_plans_set_updated_at on public.nutrition_plans;
create trigger nutrition_plans_set_updated_at before update on public.nutrition_plans for each row execute function public.set_updated_at();
drop trigger if exists nutrition_meals_set_updated_at on public.nutrition_meals;
create trigger nutrition_meals_set_updated_at before update on public.nutrition_meals for each row execute function public.set_updated_at();
drop trigger if exists workout_logs_set_updated_at on public.workout_logs;
create trigger workout_logs_set_updated_at before update on public.workout_logs for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_days enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.exercise_library enable row level security;
alter table public.nutrition_plans enable row level security;
alter table public.nutrition_meals enable row level security;
alter table public.workout_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "workout_plans_select_own" on public.workout_plans for select using (user_id = auth.uid());
create policy "workout_plans_insert_own" on public.workout_plans for insert with check (user_id = auth.uid());
create policy "workout_plans_update_own" on public.workout_plans for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout_plans_delete_own" on public.workout_plans for delete using (user_id = auth.uid());

create policy "workout_days_select_own" on public.workout_days for select using (user_id = auth.uid());
create policy "workout_days_insert_own" on public.workout_days for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.workout_plans where id = plan_id and user_id = auth.uid())
);
create policy "workout_days_update_own" on public.workout_days for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.workout_plans where id = plan_id and user_id = auth.uid())
);
create policy "workout_days_delete_own" on public.workout_days for delete using (user_id = auth.uid());

create policy "workout_exercises_select_own" on public.workout_exercises for select using (user_id = auth.uid());
create policy "workout_exercises_insert_own" on public.workout_exercises for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.workout_days where id = day_id and user_id = auth.uid())
);
create policy "workout_exercises_update_own" on public.workout_exercises for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.workout_days where id = day_id and user_id = auth.uid())
);
create policy "workout_exercises_delete_own" on public.workout_exercises for delete using (user_id = auth.uid());

create policy "exercise_library_select_public_or_own" on public.exercise_library for select using (user_id is null or user_id = auth.uid());
create policy "exercise_library_insert_own" on public.exercise_library for insert with check (user_id = auth.uid());
create policy "exercise_library_update_own" on public.exercise_library for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "exercise_library_delete_own" on public.exercise_library for delete using (user_id = auth.uid());

create policy "nutrition_plans_select_own" on public.nutrition_plans for select using (user_id = auth.uid());
create policy "nutrition_plans_insert_own" on public.nutrition_plans for insert with check (user_id = auth.uid());
create policy "nutrition_plans_update_own" on public.nutrition_plans for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "nutrition_plans_delete_own" on public.nutrition_plans for delete using (user_id = auth.uid());

create policy "nutrition_meals_select_own" on public.nutrition_meals for select using (user_id = auth.uid());
create policy "nutrition_meals_insert_own" on public.nutrition_meals for insert with check (
  user_id = auth.uid()
  and exists (select 1 from public.nutrition_plans where id = plan_id and user_id = auth.uid())
);
create policy "nutrition_meals_update_own" on public.nutrition_meals for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.nutrition_plans where id = plan_id and user_id = auth.uid())
);
create policy "nutrition_meals_delete_own" on public.nutrition_meals for delete using (user_id = auth.uid());

create policy "workout_logs_select_own" on public.workout_logs for select using (user_id = auth.uid());
create policy "workout_logs_insert_own" on public.workout_logs for insert with check (user_id = auth.uid());
create policy "workout_logs_update_own" on public.workout_logs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout_logs_delete_own" on public.workout_logs for delete using (user_id = auth.uid());

insert into public.exercise_library
  (user_id, slug, name, muscle_groups, equipment, difficulty, instructions, common_mistakes, safety_tips, related_exercises)
values
  (null, 'back-squat', 'Back Squat', array['Quads','Glutes','Core'], 'Barbell', 'Intermediate', array['Brace before unracking','Sit between the hips with knees tracking toes','Drive through the mid-foot to stand tall'], array['Knees collapsing inward','Losing brace at the bottom','Good-morning the weight up'], array['Use safeties','Keep reps crisp','Stop before form breaks'], array['Goblet Squat','Leg Press','Romanian Deadlift']),
  (null, 'dumbbell-press', 'Dumbbell Press', array['Chest','Shoulders','Triceps'], 'Dumbbells', 'Beginner', array['Set shoulder blades back','Lower dumbbells under control','Press up while keeping wrists stacked'], array['Flaring elbows too wide','Bouncing the weights','Overarching the lower back'], array['Start light','Use a controlled setup','Keep feet planted'], array['Bench Press','Incline Dumbbell Press','Push-up']),
  (null, 'romanian-deadlift', 'Romanian Deadlift', array['Hamstrings','Glutes','Back'], 'Barbell or dumbbells', 'Intermediate', array['Soften knees','Hinge hips back','Keep lats tight and stand by squeezing glutes'], array['Rounding the back','Squatting instead of hinging','Letting the weight drift forward'], array['Keep load close','Own the bottom position','Avoid chasing range with a rounded spine'], array['Back Squat','Hip Thrust','Hamstring Curl']),
  (null, 'push-up', 'Push-up', array['Chest','Core','Triceps'], 'Bodyweight', 'Beginner', array['Create a straight line from head to heel','Lower chest toward the floor','Push the floor away without sagging'], array['Dropping hips','Shrugging shoulders','Half reps'], array['Elevate hands if needed','Keep ribs down','Stop at pain-free depth'], array['Incline Push-up','Dumbbell Press','Bench Press'])
on conflict (user_id, slug) do nothing;
