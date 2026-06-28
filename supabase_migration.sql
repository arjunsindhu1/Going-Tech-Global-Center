-- GOING TECHNOLOGIES GLOBAL CENTER
-- SUPABASE SCHEMAS & MIGRATION SCRIPT
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- RECOMMENDATION FOR PRODUCTION & STAGING:
-- Since these tables are used for public lead intake from the website, 
-- we either disable Row Level Security (RLS) entirely for foolproof operation,
-- or we explicitly configure public insert policies for the "anon" role.
--
-- To guarantee instant success, we disable RLS below. If you prefer high-security
-- locked down authenticated-only tables, keep RLS active and configure custom roles.
-- ==========================================

-- ==========================================
-- 1. contact_leads Table
-- ==========================================
create table if not exists public.contact_leads (
    id uuid default uuid_generate_v4() primary key,
    company_name text not null,
    company_type text,
    premium_volume text,
    bottlenecks text[],
    client_name text not null,
    client_email text not null,
    status text default 'New' not null, -- New, Contacted, In Progress, Closed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client-side form submissions
alter table public.contact_leads disable row level security;

-- Backup policy in case RLS is re-enabled:
drop policy if exists "Allow public inserts on contact_leads" on public.contact_leads;
create policy "Allow public inserts on contact_leads"
on public.contact_leads for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public select on contact_leads" on public.contact_leads;
create policy "Allow public select on contact_leads"
on public.contact_leads for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public update on contact_leads" on public.contact_leads;
create policy "Allow public update on contact_leads"
on public.contact_leads for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on contact_leads" on public.contact_leads;
create policy "Allow public delete on contact_leads"
on public.contact_leads for delete
to anon, authenticated, public
using (true);

create index if not exists idx_contact_leads_email on public.contact_leads(client_email);
create index if not exists idx_contact_leads_created_at on public.contact_leads(created_at);


-- ==========================================
-- 2. consultation_requests Table
-- ==========================================
create table if not exists public.consultation_requests (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    phone text,
    company text,
    service text,
    notes text,
    date text, -- Storing preferred slot day & time
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client-side form submissions
alter table public.consultation_requests disable row level security;

-- Backup policy in case RLS is re-enabled:
drop policy if exists "Allow public inserts on consultation_requests" on public.consultation_requests;
create policy "Allow public inserts on consultation_requests"
on public.consultation_requests for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public select on consultation_requests" on public.consultation_requests;
create policy "Allow public select on consultation_requests"
on public.consultation_requests for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public update on consultation_requests" on public.consultation_requests;
create policy "Allow public update on consultation_requests"
on public.consultation_requests for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on consultation_requests" on public.consultation_requests;
create policy "Allow public delete on consultation_requests"
on public.consultation_requests for delete
to anon, authenticated, public
using (true);

-- Indexes
create index if not exists idx_consultation_requests_email on public.consultation_requests(email);
create index if not exists idx_consultation_created_at on public.consultation_requests(created_at);


-- ==========================================
-- 3. diagnostic_requests Table
-- ==========================================
create table if not exists public.diagnostic_requests (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    phone text,
    company text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client-side form submissions
alter table public.diagnostic_requests disable row level security;

-- Backup policy in case RLS is re-enabled:
drop policy if exists "Allow public inserts on diagnostic_requests" on public.diagnostic_requests;
create policy "Allow public inserts on diagnostic_requests"
on public.diagnostic_requests for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public select on diagnostic_requests" on public.diagnostic_requests;
create policy "Allow public select on diagnostic_requests"
on public.diagnostic_requests for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public update on diagnostic_requests" on public.diagnostic_requests;
create policy "Allow public update on diagnostic_requests"
on public.diagnostic_requests for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on diagnostic_requests" on public.diagnostic_requests;
create policy "Allow public delete on diagnostic_requests"
on public.diagnostic_requests for delete
to anon, authenticated, public
using (true);

-- Indexes
create index if not exists idx_diagnostic_requests_email on public.diagnostic_requests(email);
create index if not exists idx_diagnostic_created_at on public.diagnostic_requests(created_at);


-- ==========================================
-- 4. newsletter_subscribers Table
-- ==========================================
create table if not exists public.newsletter_subscribers (
    id uuid default uuid_generate_v4() primary key,
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client-side form submissions
alter table public.newsletter_subscribers disable row level security;

-- Backup policy in case RLS is re-enabled:
drop policy if exists "Allow public inserts on newsletter_subscribers" on public.newsletter_subscribers;
create policy "Allow public inserts on newsletter_subscribers"
on public.newsletter_subscribers for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public select on newsletter_subscribers" on public.newsletter_subscribers;
create policy "Allow public select on newsletter_subscribers"
on public.newsletter_subscribers for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public update on newsletter_subscribers" on public.newsletter_subscribers;
create policy "Allow public update on newsletter_subscribers"
on public.newsletter_subscribers for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on newsletter_subscribers" on public.newsletter_subscribers;
create policy "Allow public delete on newsletter_subscribers"
on public.newsletter_subscribers for delete
to anon, authenticated, public
using (true);

-- Indexes
create index if not exists idx_newsletter_subscribers_email on public.newsletter_subscribers(email);


-- ==========================================
-- 5. callback_requests Table
-- ==========================================
create table if not exists public.callback_requests (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    phone text not null,
    preferred_time text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client-side form submissions
alter table public.callback_requests disable row level security;

-- Backup policy in case RLS is re-enabled:
drop policy if exists "Allow public inserts on callback_requests" on public.callback_requests;
create policy "Allow public inserts on callback_requests"
on public.callback_requests for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public select on callback_requests" on public.callback_requests;
create policy "Allow public select on callback_requests"
on public.callback_requests for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public update on callback_requests" on public.callback_requests;
create policy "Allow public update on callback_requests"
on public.callback_requests for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on callback_requests" on public.callback_requests;
create policy "Allow public delete on callback_requests"
on public.callback_requests for delete
to anon, authenticated, public
using (true);

-- Indexes
create index if not exists idx_callback_requests_phone on public.callback_requests(phone);
create index if not exists idx_callback_created_at on public.callback_requests(created_at);


-- ==========================================
-- 6. jobs Table (Careers CMS)
-- ==========================================
create table if not exists public.jobs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    department text not null,
    location text not null,
    employment_type text not null,
    salary text,
    experience text,
    slug text unique not null,
    description text not null,
    requirements text[] not null default '{}'::text[],
    status text default 'Draft' not null, -- Draft, Published
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Backup policies in case RLS is re-enabled:
drop policy if exists "Allow public select on jobs" on public.jobs;
create policy "Allow public select on jobs"
on public.jobs for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public insert on jobs" on public.jobs;
create policy "Allow public insert on jobs"
on public.jobs for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public update on jobs" on public.jobs;
create policy "Allow public update on jobs"
on public.jobs for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on jobs" on public.jobs;
create policy "Allow public delete on jobs"
on public.jobs for delete
to anon, authenticated, public
using (true);

-- Indexes
create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_created_at on public.jobs(created_at);


-- ==========================================
-- 7. job_applications Table
-- ==========================================
create table if not exists public.job_applications (
    id uuid default uuid_generate_v4() primary key,
    job_id uuid references public.jobs(id) on delete cascade,
    name text not null,
    email text not null,
    phone text,
    resume text, -- Base64 data or external link
    linkedin_profile text,
    experience_years text,
    cover_letter text,
    status text default 'New' not null, -- New, Shortlisted, Interview Scheduled, Selected, Rejected
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS or configure public policies for foolproof operation
alter table public.job_applications disable row level security;

-- Backup policies in case RLS is re-enabled:
drop policy if exists "Allow public insert on job_applications" on public.job_applications;
create policy "Allow public insert on job_applications"
on public.job_applications for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Allow public select on job_applications" on public.job_applications;
create policy "Allow public select on job_applications"
on public.job_applications for select
to anon, authenticated, public
using (true);

drop policy if exists "Allow public update on job_applications" on public.job_applications;
create policy "Allow public update on job_applications"
on public.job_applications for update
to anon, authenticated, public
using (true)
with check (true);

drop policy if exists "Allow public delete on job_applications" on public.job_applications;
create policy "Allow public delete on job_applications"
on public.job_applications for delete
to anon, authenticated, public
using (true);

-- Indexes
create index if not exists idx_job_applications_job_id on public.job_applications(job_id);
create index if not exists idx_job_applications_email on public.job_applications(email);
create index if not exists idx_job_applications_created_at on public.job_applications(created_at);


-- ==========================================
-- 8. Enable Supabase Realtime for All Tables
-- ==========================================
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'contact_leads'
  ) then
    alter publication supabase_realtime add table public.contact_leads;
  end if;
  
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'consultation_requests'
  ) then
    alter publication supabase_realtime add table public.consultation_requests;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'diagnostic_requests'
  ) then
    alter publication supabase_realtime add table public.diagnostic_requests;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'newsletter_subscribers'
  ) then
    alter publication supabase_realtime add table public.newsletter_subscribers;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'callback_requests'
  ) then
    alter publication supabase_realtime add table public.callback_requests;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'jobs'
  ) then
    alter publication supabase_realtime add table public.jobs;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'job_applications'
  ) then
    alter publication supabase_realtime add table public.job_applications;
  end if;
end $$;

-- ==========================================
-- 9. proposal_downloads Table
-- ==========================================
create table if not exists public.proposal_downloads (
    id uuid default uuid_generate_v4() primary key,
    email text not null,
    company_domain text,
    source text not null, -- Popup, Contact Page, Forms Page, Future Download Widget
    page_url text,
    downloaded_file text not null,
    download_time timestamp with time zone default timezone('utc'::text, now()) not null,
    ip_address text,
    country text,
    city text,
    browser text,
    device text,
    user_agent text,
    download_count integer default 1 not null,
    last_downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client/server-side operations
alter table public.proposal_downloads disable row level security;

-- Setup Policies in case RLS is re-enabled:
drop policy if exists "Allow public select on proposal_downloads" on public.proposal_downloads;
create policy "Allow public select on proposal_downloads" on public.proposal_downloads for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on proposal_downloads" on public.proposal_downloads;
create policy "Allow public insert on proposal_downloads" on public.proposal_downloads for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on proposal_downloads" on public.proposal_downloads;
create policy "Allow public update on proposal_downloads" on public.proposal_downloads for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on proposal_downloads" on public.proposal_downloads;
create policy "Allow public delete on proposal_downloads" on public.proposal_downloads for delete to anon, authenticated, public using (true);

-- Indexes for performance
create index if not exists idx_proposal_downloads_email on public.proposal_downloads(email);
create index if not exists idx_proposal_downloads_domain on public.proposal_downloads(company_domain);
create index if not exists idx_proposal_downloads_created_at on public.proposal_downloads(created_at);

-- Add to Realtime publication
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'proposal_downloads'
  ) then
    alter publication supabase_realtime add table public.proposal_downloads;
  end if;
end $$;
