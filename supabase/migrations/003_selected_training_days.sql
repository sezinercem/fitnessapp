alter table public.onboarding_answers
add column if not exists selected_training_days text[] not null default '{}';

update public.onboarding_answers
set selected_training_days = case
  when training_days_per_week <= 1 then array['Monday']
  when training_days_per_week = 2 then array['Monday', 'Thursday']
  when training_days_per_week = 3 then array['Monday', 'Wednesday', 'Friday']
  when training_days_per_week = 4 then array['Monday', 'Tuesday', 'Thursday', 'Saturday']
  when training_days_per_week = 5 then array['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday']
  when training_days_per_week = 6 then array['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  else array['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
end
where selected_training_days = '{}';
