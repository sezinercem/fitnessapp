create table if not exists public.onboarding_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  main_goal text not null,
  experience_level text not null,
  training_days_per_week integer not null,
  equipment_available text not null,
  session_length integer not null,
  nutrition_goal text not null,
  dietary_preference text not null,
  current_weight numeric(6,2),
  target_weight numeric(6,2),
  height numeric(6,2),
  age integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null,
  goal text not null,
  difficulty_level text not null,
  expected_outcome text not null,
  weekly_structure text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weekly_plan_id uuid not null references public.weekly_training_plans(id) on delete cascade,
  day_of_week text not null,
  day_index integer not null,
  training_focus text not null,
  is_rest_day boolean not null default false,
  estimated_duration integer not null default 45,
  why_it_exists text not null,
  main_muscles text[] not null default '{}',
  recovery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planned_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  training_day_id uuid not null references public.training_days(id) on delete cascade,
  exercise_name text not null,
  muscle_groups text[] not null default '{}',
  sets integer not null default 3,
  reps text not null default '10',
  target_weight text,
  rest_seconds integer not null default 60,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workout_logs add column if not exists weekly_plan_id uuid references public.weekly_training_plans(id) on delete set null;
alter table public.workout_logs add column if not exists training_day_id uuid references public.training_days(id) on delete set null;

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  exercise_name text not null,
  set_number integer not null,
  weight text,
  reps integer,
  rest_seconds integer,
  rpe numeric(3,1),
  notes text,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.body_weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight numeric(6,2) not null,
  notes text,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chest numeric(6,2),
  waist numeric(6,2),
  hips numeric(6,2),
  arm numeric(6,2),
  thigh numeric(6,2),
  notes text,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal text not null,
  daily_calories integer not null,
  protein_target integer not null,
  carbs_target integer not null,
  fat_target integer not null,
  water_target_liters numeric(4,1) not null,
  explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nutrition_target_id uuid not null references public.nutrition_targets(id) on delete cascade,
  meal_name text not null,
  time_of_day text not null,
  foods text,
  calories integer not null default 0,
  protein integer not null default 0,
  carbs integer not null default 0,
  fat integer not null default 0,
  purpose text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists weekly_training_plans_user_id_idx on public.weekly_training_plans(user_id);
create index if not exists training_days_user_id_idx on public.training_days(user_id);
create index if not exists training_days_weekly_plan_id_idx on public.training_days(weekly_plan_id);
create index if not exists planned_exercises_user_id_idx on public.planned_exercises(user_id);
create index if not exists planned_exercises_training_day_id_idx on public.planned_exercises(training_day_id);
create index if not exists workout_sets_user_id_idx on public.workout_sets(user_id);
create index if not exists workout_sets_workout_log_id_idx on public.workout_sets(workout_log_id);
create index if not exists body_weight_logs_user_id_idx on public.body_weight_logs(user_id);
create index if not exists body_measurements_user_id_idx on public.body_measurements(user_id);
create index if not exists nutrition_targets_user_id_idx on public.nutrition_targets(user_id);
create index if not exists meals_user_id_idx on public.meals(user_id);
create index if not exists meals_nutrition_target_id_idx on public.meals(nutrition_target_id);

drop trigger if exists onboarding_answers_set_updated_at on public.onboarding_answers;
create trigger onboarding_answers_set_updated_at before update on public.onboarding_answers for each row execute function public.set_updated_at();
drop trigger if exists weekly_training_plans_set_updated_at on public.weekly_training_plans;
create trigger weekly_training_plans_set_updated_at before update on public.weekly_training_plans for each row execute function public.set_updated_at();
drop trigger if exists training_days_set_updated_at on public.training_days;
create trigger training_days_set_updated_at before update on public.training_days for each row execute function public.set_updated_at();
drop trigger if exists planned_exercises_set_updated_at on public.planned_exercises;
create trigger planned_exercises_set_updated_at before update on public.planned_exercises for each row execute function public.set_updated_at();
drop trigger if exists workout_sets_set_updated_at on public.workout_sets;
create trigger workout_sets_set_updated_at before update on public.workout_sets for each row execute function public.set_updated_at();
drop trigger if exists body_weight_logs_set_updated_at on public.body_weight_logs;
create trigger body_weight_logs_set_updated_at before update on public.body_weight_logs for each row execute function public.set_updated_at();
drop trigger if exists body_measurements_set_updated_at on public.body_measurements;
create trigger body_measurements_set_updated_at before update on public.body_measurements for each row execute function public.set_updated_at();
drop trigger if exists nutrition_targets_set_updated_at on public.nutrition_targets;
create trigger nutrition_targets_set_updated_at before update on public.nutrition_targets for each row execute function public.set_updated_at();
drop trigger if exists meals_set_updated_at on public.meals;
create trigger meals_set_updated_at before update on public.meals for each row execute function public.set_updated_at();

alter table public.onboarding_answers enable row level security;
alter table public.weekly_training_plans enable row level security;
alter table public.training_days enable row level security;
alter table public.planned_exercises enable row level security;
alter table public.workout_sets enable row level security;
alter table public.body_weight_logs enable row level security;
alter table public.body_measurements enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.meals enable row level security;

create policy "onboarding_answers_own_all" on public.onboarding_answers for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "weekly_training_plans_own_all" on public.weekly_training_plans for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "training_days_own_all" on public.training_days for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.weekly_training_plans where id = weekly_plan_id and user_id = auth.uid())
);
create policy "planned_exercises_own_all" on public.planned_exercises for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.training_days where id = training_day_id and user_id = auth.uid())
);
create policy "workout_sets_own_all" on public.workout_sets for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.workout_logs where id = workout_log_id and user_id = auth.uid())
);
create policy "body_weight_logs_own_all" on public.body_weight_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "body_measurements_own_all" on public.body_measurements for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "nutrition_targets_own_all" on public.nutrition_targets for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meals_own_all" on public.meals for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.nutrition_targets where id = nutrition_target_id and user_id = auth.uid())
);
