create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  qualification text not null default '',
  experience text not null default '',
  mobile text not null default '',
  is_visiting boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.team_members add column if not exists is_visiting boolean not null default false;

alter table public.team_members enable row level security;

drop policy if exists "Public can view active team members" on public.team_members;
create policy "Public can view active team members"
on public.team_members
for select
using (is_active = true);

drop policy if exists "Authenticated users can manage team members" on public.team_members;
create policy "Authenticated users can manage team members"
on public.team_members
for all
to authenticated
using (true)
with check (true);

insert into public.team_members (name, qualification, experience, mobile, is_visiting, display_order, is_active) values
  ('Dr. Dinesh Tanna', 'BDS', '20+ Years', '+91 98607 03424', false, 10, true),
  ('Dr. Krupa Tanna', 'BDS', '10+ Years', '', false, 20, true)
on conflict do nothing;
