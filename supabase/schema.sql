-- ============================================================
-- Smart Bookmark App — Database Schema (IDEMPOTENT — safe to re-run)
-- ============================================================

-- 1. Create the bookmarks table
create table if not exists public.bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  url         text not null,
  favicon_url text,
  favorite    boolean default false,
  tags        text[] default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Indexes
create index if not exists idx_bookmarks_user    on public.bookmarks(user_id);
create index if not exists idx_bookmarks_created on public.bookmarks(created_at desc);
create index if not exists idx_bookmarks_tags    on public.bookmarks using gin(tags);

-- 3. Enable Row Level Security
alter table public.bookmarks enable row level security;

-- 4. RLS Policies (drop first to make idempotent)
drop policy if exists "Users see own bookmarks"    on public.bookmarks;
drop policy if exists "Users insert own bookmarks" on public.bookmarks;
drop policy if exists "Users update own bookmarks" on public.bookmarks;
drop policy if exists "Users delete own bookmarks" on public.bookmarks;

create policy "Users see own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

create policy "Users delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- 5. Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.bookmarks;
create trigger set_updated_at
  before update on public.bookmarks
  for each row
  execute function public.handle_updated_at();

-- 6. Enable Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
    and tablename = 'bookmarks'
  ) then
    alter publication supabase_realtime add table public.bookmarks;
  end if;
end $$;
