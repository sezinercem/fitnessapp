alter table public.onboarding_answers
add column if not exists routine_type text not null default 'Use Apex recommendation',
add column if not exists split_preference text not null default 'recommended',
add column if not exists custom_split jsonb not null default '{}'::jsonb;

alter table public.training_days
add column if not exists workout_category text not null default 'full_body'
check (workout_category in ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'mobility', 'core'));

alter table public.planned_exercises
add column if not exists workout_category text not null default 'full_body'
check (workout_category in ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'mobility', 'core'));

alter table public.exercise_library
add column if not exists primary_muscle_group text,
add column if not exists secondary_muscle_groups text[] not null default '{}',
add column if not exists movement_pattern text,
add column if not exists workout_category text default 'full_body'
check (workout_category in ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'mobility', 'core'));

update public.training_days
set workout_category = case
  when lower(training_focus) like '%push%' or lower(training_focus) like '%chest%' then 'push'
  when lower(training_focus) like '%pull%' or lower(training_focus) like '%back%' then 'pull'
  when lower(training_focus) like '%leg%' then 'legs'
  when lower(training_focus) like '%lower%' then 'lower'
  when lower(training_focus) like '%upper%' then 'upper'
  when lower(training_focus) like '%cardio%' or lower(training_focus) like '%conditioning%' then 'cardio'
  when lower(training_focus) like '%mobility%' or is_rest_day then 'mobility'
  else 'full_body'
end;

update public.exercise_library
set primary_muscle_group = 'Quads',
    secondary_muscle_groups = array['Glutes', 'Core'],
    movement_pattern = 'squat',
    workout_category = 'legs'
where slug = 'back-squat';

update public.exercise_library
set primary_muscle_group = 'Chest',
    secondary_muscle_groups = array['Shoulders', 'Triceps'],
    movement_pattern = 'horizontal push',
    workout_category = 'push'
where slug = 'dumbbell-press';

update public.exercise_library
set primary_muscle_group = 'Hamstrings',
    secondary_muscle_groups = array['Glutes', 'Back'],
    movement_pattern = 'hinge',
    workout_category = 'legs'
where slug = 'romanian-deadlift';

update public.exercise_library
set primary_muscle_group = 'Chest',
    secondary_muscle_groups = array['Core', 'Triceps'],
    movement_pattern = 'bodyweight push',
    workout_category = 'push'
where slug = 'push-up';
