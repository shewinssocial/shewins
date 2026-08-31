-- Shewings — Supabase schema
--
-- Run this in the Supabase SQL Editor (or via `supabase db push`) on a
-- fresh project. Creates all four tables plus Row Level Security policies:
-- public visitors can only read published/public data; all writes require
-- an authenticated (admin) session.
--
-- Admin accounts are created via Supabase Auth (Dashboard → Authentication
-- → Users → Add User), not via a custom table — see README "Supabase setup".

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  event_time text not null,
  location text not null,
  image_url text not null,
  cloudinary_public_id text,
  registration_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- gallery
-- ---------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  cloudinary_public_id text,
  title text,
  caption text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- videos
-- ---------------------------------------------------------------------
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  youtube_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- enquiries
-- ---------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  location text,
  profession text,
  reason text,
  message text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'In Progress', 'Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- site_settings — single-row table for configurable contact info
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1,
  email text,
  phone text,
  location text,
  instagram text,
  linkedin text,
  facebook text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id, email, phone, location)
values (1, 'hello@shewings.com', '+91 98765 43210', 'Chennai, Tamil Nadu, India')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.events;
create trigger set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.gallery;
create trigger set_updated_at before update on public.gallery
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.videos;
create trigger set_updated_at before update on public.videos
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.enquiries;
create trigger set_updated_at before update on public.enquiries
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.site_settings;
create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.videos enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- events: public can read only published rows; any authenticated user
-- (i.e. the admin, since there is no public sign-up) can do everything.
create policy "Public can read published events" on public.events
  for select using (status = 'published');

create policy "Admins can read all events" on public.events
  for select using (auth.role() = 'authenticated');

create policy "Admins can insert events" on public.events
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update events" on public.events
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete events" on public.events
  for delete using (auth.role() = 'authenticated');

-- gallery: fully public read (used in the site's fallback/highlights view)
create policy "Public can read gallery" on public.gallery
  for select using (true);

create policy "Admins can insert gallery" on public.gallery
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update gallery" on public.gallery
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete gallery" on public.gallery
  for delete using (auth.role() = 'authenticated');

-- videos: fully public read
create policy "Public can read videos" on public.videos
  for select using (true);

create policy "Admins can insert videos" on public.videos
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update videos" on public.videos
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete videos" on public.videos
  for delete using (auth.role() = 'authenticated');

-- enquiries: anyone can submit (insert); only admins can read/update.
-- Enquiry contents are private, so there is deliberately no public select policy.
create policy "Anyone can submit an enquiry" on public.enquiries
  for insert with check (true);

create policy "Admins can read enquiries" on public.enquiries
  for select using (auth.role() = 'authenticated');

create policy "Admins can update enquiries" on public.enquiries
  for update using (auth.role() = 'authenticated');

-- site_settings: public read (used by the Contact section/footer), admin write
create policy "Public can read site settings" on public.site_settings
  for select using (true);

create policy "Admins can update site settings" on public.site_settings
  for update using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------
create index if not exists events_status_date_idx on public.events (status, event_date);
create index if not exists gallery_created_at_idx on public.gallery (created_at desc);
create index if not exists videos_created_at_idx on public.videos (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
