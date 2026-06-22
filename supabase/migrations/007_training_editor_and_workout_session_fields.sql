alter table public.workout_sessions
add column if not exists duration_seconds integer;

alter table public.workout_session_exercises
add column if not exists muscle_group text,
add column if not exists rest_seconds integer not null default 60;

alter table public.planned_exercises
add column if not exists muscle_group text;

update public.planned_exercises
set muscle_group = coalesce(muscle_group, array_to_string(muscle_groups, ', '))
where muscle_group is null;

create index if not exists workout_sessions_user_day_started_idx on public.workout_sessions(user_id, training_day_id, started_at desc);
