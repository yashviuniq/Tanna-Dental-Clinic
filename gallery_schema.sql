create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  caption text,
  image_url text not null,
  media_url text,
  storage_path text,
  file_name text,
  media_type text,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

drop policy if exists "Public can view gallery" on public.gallery;
create policy "Public can view gallery"
on public.gallery
for select
using (true);

drop policy if exists "Authenticated users can manage gallery" on public.gallery;
create policy "Authenticated users can manage gallery"
on public.gallery
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view gallery files" on storage.objects;
create policy "Public can view gallery files"
on storage.objects
for select
using (bucket_id = 'gallery');

drop policy if exists "Authenticated users can upload gallery files" on storage.objects;
create policy "Authenticated users can upload gallery files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery');

drop policy if exists "Authenticated users can update gallery files" on storage.objects;
create policy "Authenticated users can update gallery files"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery')
with check (bucket_id = 'gallery');

drop policy if exists "Authenticated users can delete gallery files" on storage.objects;
create policy "Authenticated users can delete gallery files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery');
