-- NEURON OS Waitlist — run in Supabase SQL Editor
-- Creates the waitlist table with auto-incrementing position numbers.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  position bigint generated always as identity,
  github_source boolean not null default false,
  beta_invited boolean not null default false,
  launch_notified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_email_idx on public.waitlist (email);
create index if not exists waitlist_position_idx on public.waitlist (position desc);
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- Optional: enable RLS (service role key bypasses RLS for API routes)
alter table public.waitlist enable row level security;

-- No public policies — all access via service role from Next.js API routes
