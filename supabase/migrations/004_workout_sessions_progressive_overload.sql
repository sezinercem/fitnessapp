alter table public.profiles
add column if not exists default_weight_unit text not null default 'kg'
check (default_weight_unit in ('kg', 'lb'));

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  training_day_id uuid references public.training_days(id) on delete set null,
  date date not null default current_date,
  day_of_week text not null,
  workout_name text not null,
  status text not null default 'started' check (status in ('started', 'completed', 'skipped')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_session_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_session_id uuid not null references public.workout_sessions(id) on delete cascade,
  planned_exercise_id uuid references public.planned_exercises(id) on delete set null,
  exercise_name text not null,
  exercise_order integer not null default 0,
  status text not null default 'started' check (status in ('started', 'completed', 'skipped')),
  planned_sets integer not null default 3,
  planned_reps text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workout_sets
alter column workout_log_id drop not null;

alter table public.workout_sets
add column if not exists workout_session_id uuid references public.workout_sessions(id) on delete cascade,
add column if not exists workout_session_exercise_id uuid references public.workout_session_exercises(id) on delete cascade,
add column if not exists weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lb'));

create table if not exists public.exercise_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_name text not null,
  workout_session_id uuid references public.workout_sessions(id) on delete cascade,
  workout_set_id uuid references public.workout_sets(id) on delete cascade,
  weight numeric(8,2) not null default 0,
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lb')),
  reps integer not null default 0,
  volume numeric(10,2) not null default 0,
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_name text not null,
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lb')),
  best_weight numeric(8,2) not null default 0,
  best_reps integer not null default 0,
  best_volume numeric(10,2) not null default 0,
  achieved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, exercise_name, weight_unit)
);

create index if not exists workout_sessions_user_id_idx on public.workout_sessions(user_id);
create index if not exists workout_sessions_training_day_id_idx on public.workout_sessions(training_day_id);
create index if not exists workout_session_exercises_user_id_idx on public.workout_session_exercises(user_id);
create index if not exists workout_session_exercises_session_id_idx on public.workout_session_exercises(workout_session_id);
create index if not exists workout_sets_session_id_idx on public.workout_sets(workout_session_id);
create index if not exists workout_sets_session_exercise_id_idx on public.workout_sets(workout_session_exercise_id);
create index if not exists exercise_history_user_exercise_idx on public.exercise_history(user_id, exercise_name);
create index if not exists personal_records_user_exercise_idx on public.personal_records(user_id, exercise_name);

drop trigger if exists workout_sessions_set_updated_at on public.workout_sessions;
create trigger workout_sessions_set_updated_at before update on public.workout_sessions for each row execute function public.set_updated_at();
drop trigger if exists workout_session_exercises_set_updated_at on public.workout_session_exercises;
create trigger workout_session_exercises_set_updated_at before update on public.workout_session_exercises for each row execute function public.set_updated_at();
drop trigger if exists exercise_history_set_updated_at on public.exercise_history;
create trigger exercise_history_set_updated_at before update on public.exercise_history for each row execute function public.set_updated_at();
drop trigger if exists personal_records_set_updated_at on public.personal_records;
create trigger personal_records_set_updated_at before update on public.personal_records for each row execute function public.set_updated_at();

alter table public.workout_sessions enable row level security;
alter table public.workout_session_exercises enable row level security;
alter table public.exercise_history enable row level security;
alter table public.personal_records enable row level security;

create policy "workout_sessions_own_all" on public.workout_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "workout_session_exercises_own_all" on public.workout_session_exercises for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.workout_sessions where id = workout_session_id and user_id = auth.uid())
);
create policy "exercise_history_own_all" on public.exercise_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "personal_records_own_all" on public.personal_records for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "workout_sets_own_all" on public.workout_sets;
create policy "workout_sets_own_all" on public.workout_sets for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and (
    (workout_log_id is not null and exists (select 1 from public.workout_logs where id = workout_log_id and user_id = auth.uid()))
    or
    (workout_session_id is not null and exists (select 1 from public.workout_sessions where id = workout_session_id and user_id = auth.uid()))
  )
);
