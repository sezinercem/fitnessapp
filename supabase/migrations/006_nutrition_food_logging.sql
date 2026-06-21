create table if not exists public.global_foods (
  id uuid primary key default gen_random_uuid(),
  food_name text not null,
  brand text,
  serving_size numeric(8,2) not null default 1,
  serving_unit text not null,
  calories numeric(8,2) not null default 0 check (calories >= 0),
  protein numeric(8,2) not null default 0 check (protein >= 0),
  carbs numeric(8,2) not null default 0 check (carbs >= 0),
  fat numeric(8,2) not null default 0 check (fat >= 0),
  source text not null default 'local' check (source in ('local', 'manual', 'api')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null,
  brand text,
  serving_size numeric(8,2) not null default 1,
  serving_unit text not null,
  calories numeric(8,2) not null default 0 check (calories >= 0),
  protein numeric(8,2) not null default 0 check (protein >= 0),
  carbs numeric(8,2) not null default 0 check (carbs >= 0),
  fat numeric(8,2) not null default 0 check (fat >= 0),
  source text not null default 'manual' check (source in ('local', 'manual', 'api')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_date date not null default current_date,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snacks')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_date, meal_type)
);

create table if not exists public.meal_log_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_log_id uuid not null references public.meal_logs(id) on delete cascade,
  food_id uuid,
  food_source text not null default 'manual' check (food_source in ('global', 'user', 'manual')),
  food_name text not null,
  brand text,
  serving_size numeric(8,2) not null default 1,
  serving_unit text not null,
  quantity numeric(8,2) not null default 1 check (quantity > 0),
  calories_per_serving numeric(8,2) not null default 0 check (calories_per_serving >= 0),
  protein_per_serving numeric(8,2) not null default 0 check (protein_per_serving >= 0),
  carbs_per_serving numeric(8,2) not null default 0 check (carbs_per_serving >= 0),
  fat_per_serving numeric(8,2) not null default 0 check (fat_per_serving >= 0),
  total_calories numeric(9,2) not null default 0 check (total_calories >= 0),
  total_protein numeric(9,2) not null default 0 check (total_protein >= 0),
  total_carbs numeric(9,2) not null default 0 check (total_carbs >= 0),
  total_fat numeric(9,2) not null default 0 check (total_fat >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists global_foods_food_name_idx on public.global_foods using gin (to_tsvector('english', food_name || ' ' || coalesce(brand, '')));
create index if not exists user_foods_user_id_idx on public.user_foods(user_id);
create index if not exists meal_logs_user_date_idx on public.meal_logs(user_id, logged_date);
create index if not exists meal_log_items_user_id_idx on public.meal_log_items(user_id);
create index if not exists meal_log_items_meal_log_id_idx on public.meal_log_items(meal_log_id);

drop trigger if exists global_foods_set_updated_at on public.global_foods;
create trigger global_foods_set_updated_at before update on public.global_foods for each row execute function public.set_updated_at();
drop trigger if exists user_foods_set_updated_at on public.user_foods;
create trigger user_foods_set_updated_at before update on public.user_foods for each row execute function public.set_updated_at();
drop trigger if exists meal_logs_set_updated_at on public.meal_logs;
create trigger meal_logs_set_updated_at before update on public.meal_logs for each row execute function public.set_updated_at();
drop trigger if exists meal_log_items_set_updated_at on public.meal_log_items;
create trigger meal_log_items_set_updated_at before update on public.meal_log_items for each row execute function public.set_updated_at();

alter table public.global_foods enable row level security;
alter table public.user_foods enable row level security;
alter table public.meal_logs enable row level security;
alter table public.meal_log_items enable row level security;

create policy "global_foods_read_all_authenticated" on public.global_foods for select using (auth.uid() is not null);
create policy "user_foods_own_all" on public.user_foods for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meal_logs_own_all" on public.meal_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meal_log_items_own_all" on public.meal_log_items for all using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and exists (select 1 from public.meal_logs where id = meal_log_id and user_id = auth.uid())
);

insert into public.global_foods (food_name, brand, serving_size, serving_unit, calories, protein, carbs, fat, source)
values
  ('Eggs', null, 1, 'large egg', 70, 6, 0.5, 5, 'local'),
  ('Sourdough bread', null, 1, 'slice', 110, 4, 21, 1, 'local'),
  ('Chicken breast', null, 100, 'grams', 165, 31, 0, 3.6, 'local'),
  ('Rice', null, 100, 'grams cooked', 130, 2.7, 28, 0.3, 'local'),
  ('Pasta', null, 100, 'grams cooked', 157, 5.8, 31, 0.9, 'local'),
  ('Oats', null, 40, 'grams', 150, 5, 27, 3, 'local'),
  ('Greek yoghurt', null, 170, 'grams', 100, 17, 6, 0.7, 'local'),
  ('Banana', null, 1, 'medium banana', 105, 1.3, 27, 0.4, 'local'),
  ('Apple', null, 1, 'medium apple', 95, 0.5, 25, 0.3, 'local'),
  ('Tuna', null, 100, 'grams', 116, 26, 0, 1, 'local'),
  ('Salmon', null, 100, 'grams', 208, 20, 0, 13, 'local'),
  ('Beef mince', null, 100, 'grams', 250, 26, 0, 15, 'local'),
  ('Potatoes', null, 100, 'grams', 87, 2, 20, 0.1, 'local'),
  ('Sweet potato', null, 100, 'grams', 86, 1.6, 20, 0.1, 'local'),
  ('Avocado', null, 100, 'grams', 160, 2, 9, 15, 'local'),
  ('Olive oil', null, 1, 'tablespoon', 119, 0, 0, 13.5, 'local'),
  ('Protein shake', null, 1, 'scoop', 120, 24, 3, 1.5, 'local'),
  ('Tesco sourdough bread', 'Tesco', 1, 'slice', 120, 4, 22, 1, 'local'),
  ('Tesco eggs', 'Tesco', 1, 'large egg', 70, 6, 0.5, 5, 'local')
on conflict do nothing;
