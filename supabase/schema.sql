-- Supabase schema for GDG UTBM
-- Run in Supabase SQL editor

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  first_name text,
  last_name text,
  role text default 'student' check (role in ('student','professional','admin')),
  school text,
  study_level text,
  company text,
  avatar_url text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists role text,
  add column if not exists school text,
  add column if not exists study_level text,
  add column if not exists company text,
  add column if not exists avatar_url text,
  add column if not exists is_verified boolean,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  description_fr text not null,
  description_en text not null,
  date timestamptz not null,
  end_date timestamptz,
  location text,
  image_url text,
  partner text,
  partners text[],
  type text check (type in ('workshop','conference','meetup','coding')),
  status text check (status in ('upcoming','past')),
  video_url text,
  highlights text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events
  add column if not exists title_fr text,
  add column if not exists title_en text,
  add column if not exists description_fr text,
  add column if not exists description_en text,
  add column if not exists date timestamptz,
  add column if not exists end_date timestamptz,
  add column if not exists location text,
  add column if not exists image_url text,
  add column if not exists partner text,
  add column if not exists partners text[],
  add column if not exists type text,
  add column if not exists status text,
  add column if not exists video_url text,
  add column if not exists highlights text[],
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

-- Topics
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  theme text not null,
  description text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.topics
  add column if not exists user_id uuid,
  add column if not exists event_id uuid,
  add column if not exists theme text,
  add column if not exists description text,
  add column if not exists status text,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

-- Event participants
create table if not exists public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  role text not null check (role in ('student','professional')),
  school text,
  study_level text,
  profession text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.event_participants
  add column if not exists event_id uuid,
  add column if not exists user_id uuid,
  add column if not exists full_name text,
  add column if not exists role text,
  add column if not exists school text,
  add column if not exists study_level text,
  add column if not exists profession text,
  add column if not exists status text,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

-- Event marks
create table if not exists public.event_marks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, user_id)
);

alter table public.event_marks
  add column if not exists event_id uuid,
  add column if not exists user_id uuid,
  add column if not exists created_at timestamptz;

-- Activities
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title_fr text not null,
  title_en text not null,
  description_fr text not null,
  description_en text not null,
  icon text,
  details_fr text,
  details_en text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.activities
  add column if not exists title_fr text,
  add column if not exists title_en text,
  add column if not exists description_fr text,
  add column if not exists description_en text,
  add column if not exists icon text,
  add column if not exists details_fr text,
  add column if not exists details_en text,
  add column if not exists display_order integer,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_topics_updated_at on public.topics;
create trigger set_topics_updated_at
before update on public.topics
for each row execute function public.set_updated_at();

drop trigger if exists set_participants_updated_at on public.event_participants;
create trigger set_participants_updated_at
before update on public.event_participants
for each row execute function public.set_updated_at();

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_topics_event_id on public.topics(event_id);
create index if not exists idx_participants_event_id on public.event_participants(event_id);
create index if not exists idx_marks_event_id on public.event_marks(event_id);

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, first_name, last_name, role, school, study_level, company, created_at, updated_at
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    nullif(new.raw_user_meta_data->>'school', ''),
    nullif(new.raw_user_meta_data->>'study_level', ''),
    nullif(new.raw_user_meta_data->>'company', ''),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.topics enable row level security;
alter table public.event_participants enable row level security;
alter table public.event_marks enable row level security;
alter table public.activities enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Events policies
drop policy if exists "events_select_all" on public.events;
create policy "events_select_all" on public.events
for select using (true);

drop policy if exists "events_admin_manage" on public.events;
create policy "events_admin_manage" on public.events
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Topics policies
drop policy if exists "topics_select_all" on public.topics;
create policy "topics_select_all" on public.topics
for select using (true);

drop policy if exists "topics_insert_auth" on public.topics;
create policy "topics_insert_auth" on public.topics
for insert with check (auth.uid() = user_id);

drop policy if exists "topics_admin_update" on public.topics;
create policy "topics_admin_update" on public.topics
for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Participants policies
drop policy if exists "participants_select_all" on public.event_participants;
create policy "participants_select_all" on public.event_participants
for select using (true);

drop policy if exists "participants_insert_any" on public.event_participants;
create policy "participants_insert_any" on public.event_participants
for insert with check (true);

drop policy if exists "participants_admin_update" on public.event_participants;
create policy "participants_admin_update" on public.event_participants
for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Marks policies
drop policy if exists "marks_select_all" on public.event_marks;
create policy "marks_select_all" on public.event_marks
for select using (true);

drop policy if exists "marks_insert_auth" on public.event_marks;
create policy "marks_insert_auth" on public.event_marks
for insert with check (auth.uid() = user_id);

drop policy if exists "marks_delete_own" on public.event_marks;
create policy "marks_delete_own" on public.event_marks
for delete using (auth.uid() = user_id);

-- Activities policies
drop policy if exists "activities_select_all" on public.activities;
create policy "activities_select_all" on public.activities
for select using (true);

drop policy if exists "activities_admin_manage" on public.activities;
create policy "activities_admin_manage" on public.activities
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
