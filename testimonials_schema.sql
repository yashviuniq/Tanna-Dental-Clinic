create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  content text not null,
  source text not null default 'manual' check (source in ('google', 'manual')),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can view active testimonials" on public.testimonials;
create policy "Public can view active testimonials"
on public.testimonials
for select
using (is_active = true);

drop policy if exists "Authenticated users can manage testimonials" on public.testimonials;
create policy "Authenticated users can manage testimonials"
on public.testimonials
for all
to authenticated
using (true)
with check (true);

insert into public.testimonials (patient_name, rating, content, source, display_order, is_active) values
  ('Rahul S.', 5, 'Dr. Tanna is incredibly thorough and gentle. The clinic is spotless and modern. Highly recommend for anyone nervous about dental visits!', 'manual', 10, true),
  ('Priya M.', 5, 'Best dental experience I have ever had. The team is professional and the facilities are world-class. My smile has never looked better!', 'manual', 20, true),
  ('Amit K.', 4, 'Very professional service. The root canal was virtually painless. Dr. Tanna explained everything clearly before starting.', 'manual', 30, true),
  ('Sneha P.', 5, 'I brought my child here and the staff was amazing with kids. The environment is so calming. We have found our family dentist!', 'manual', 40, true)
on conflict do nothing;
