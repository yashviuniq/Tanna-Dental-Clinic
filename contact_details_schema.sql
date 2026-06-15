create table if not exists public.contact_details (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  type text not null default 'phone',
  value text not null,
  display_text text default '',
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists contact_details_type_value_idx
on public.contact_details (type, value);

alter table public.contact_details enable row level security;

drop policy if exists "Public can view active contact details" on public.contact_details;
create policy "Public can view active contact details"
on public.contact_details
for select
using (is_active = true);

drop policy if exists "Authenticated users can manage contact details" on public.contact_details;
create policy "Authenticated users can manage contact details"
on public.contact_details
for all
to authenticated
using (true)
with check (true);

create or replace function public.set_contact_details_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_contact_details_updated_at on public.contact_details;
create trigger set_contact_details_updated_at
before update on public.contact_details
for each row
execute function public.set_contact_details_updated_at();

insert into public.contact_details (label, type, value, display_text, display_order, is_active)
values
  ('Clinic Landline', 'phone', '+917123573986', '+91 712 357 3986', 10, true),
  ('Appointment Booking', 'phone', '+919766646897', '+91 97666 46897', 20, true),
  ('WhatsApp Support', 'whatsapp', '+919766646897', 'Chat on WhatsApp', 30, true),
  ('Primary Email', 'email', 'drdineshtanna79@gmail.com', 'drdineshtanna79@gmail.com', 40, true),
  ('Secondary Email', 'email', 'drdineshtanna79@yahoo.com', 'drdineshtanna79@yahoo.com', 50, true),
  ('Instagram', 'instagram', 'https://www.instagram.com/tannadr?igsh=MWlrcHY2eG1na2NzNw==', '@tannadr', 60, true),
  ('Clinic Location', 'address', 'Nagpur, Maharashtra', 'Nagpur, Maharashtra', 70, true),
  ('Clinic Hours', 'hours', 'Mon-Fri: Morning 10:30AM - 2PM, Evening 6:00PM - 8:30PM. Sun: Closed', 'Mon-Fri: Morning 10:30AM - 2PM, Evening 6:00PM - 8:30PM. Sun: Closed', 80, true)
on conflict (type, value) do nothing;

notify pgrst, 'reload schema';
