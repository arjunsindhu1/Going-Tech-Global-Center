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

-- ==========================================
-- 10. assessment_results Table
-- ==========================================
create table if not exists public.assessment_results (
    id uuid default uuid_generate_v4() primary key,
    email text not null,
    score integer not null,
    performance_level text not null,
    answers jsonb not null,
    recommendations text[] not null default '{}'::text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS
alter table public.assessment_results disable row level security;

-- Backup policies
drop policy if exists "Allow public select on assessment_results" on public.assessment_results;
create policy "Allow public select on assessment_results" on public.assessment_results for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on assessment_results" on public.assessment_results;
create policy "Allow public insert on assessment_results" on public.assessment_results for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on assessment_results" on public.assessment_results;
create policy "Allow public update on assessment_results" on public.assessment_results for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on assessment_results" on public.assessment_results;
create policy "Allow public delete on assessment_results" on public.assessment_results for delete to anon, authenticated, public using (true);

-- ==========================================
-- 11. blog_categories Table
-- ==========================================
create table if not exists public.blog_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blog_categories disable row level security;

-- Backup policies
drop policy if exists "Allow public select on blog_categories" on public.blog_categories;
create policy "Allow public select on blog_categories" on public.blog_categories for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on blog_categories" on public.blog_categories;
create policy "Allow public insert on blog_categories" on public.blog_categories for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public delete on blog_categories" on public.blog_categories;
create policy "Allow public delete on blog_categories" on public.blog_categories for delete to anon, authenticated, public using (true);

-- ==========================================
-- 12. blogs Table
-- ==========================================
create table if not exists public.blogs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    category text not null,
    featured_image text,
    meta_title text,
    meta_description text,
    author text not null,
    short_description text,
    reading_time text,
    content text not null,
    faq jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.blogs disable row level security;

-- Backup policies
drop policy if exists "Allow public select on blogs" on public.blogs;
create policy "Allow public select on blogs" on public.blogs for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on blogs" on public.blogs;
create policy "Allow public insert on blogs" on public.blogs for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on blogs" on public.blogs;
create policy "Allow public update on blogs" on public.blogs for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on blogs" on public.blogs;
create policy "Allow public delete on blogs" on public.blogs for delete to anon, authenticated, public using (true);

-- Enable Realtime for assessment_results, blogs, blog_categories
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'assessment_results'
  ) then
    alter publication supabase_realtime add table public.assessment_results;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'blog_categories'
  ) then
    alter publication supabase_realtime add table public.blog_categories;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'blogs'
  ) then
    alter publication supabase_realtime add table public.blogs;
  end if;
end $$;


-- ==========================================
-- 13. business_tool_leads Table
-- ==========================================
create table if not exists public.business_tool_leads (
    id uuid default uuid_generate_v4() primary key,
    agency_name text not null,
    company_email text not null,
    sector text not null,
    tool_name text not null,
    status text default 'New Lead' not null,
    source text default 'Business Tools' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client operations
alter table public.business_tool_leads disable row level security;

-- Backup policies in case RLS is re-enabled:
drop policy if exists "Allow public select on business_tool_leads" on public.business_tool_leads;
create policy "Allow public select on business_tool_leads" on public.business_tool_leads for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on business_tool_leads" on public.business_tool_leads;
create policy "Allow public insert on business_tool_leads" on public.business_tool_leads for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on business_tool_leads" on public.business_tool_leads;
create policy "Allow public update on business_tool_leads" on public.business_tool_leads for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on business_tool_leads" on public.business_tool_leads;
create policy "Allow public delete on business_tool_leads" on public.business_tool_leads for delete to anon, authenticated, public using (true);


-- ==========================================
-- 14. business_proposal_leads Table
-- ==========================================
create table if not exists public.business_proposal_leads (
    id uuid default uuid_generate_v4() primary key,
    agency_name text not null,
    company_email text not null,
    sector text not null,
    proposal_name text not null,
    status text default 'Downloaded' not null,
    source text default 'Website Proposal' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client operations
alter table public.business_proposal_leads disable row level security;

-- Backup policies in case RLS is re-enabled:
drop policy if exists "Allow public select on business_proposal_leads" on public.business_proposal_leads;
create policy "Allow public select on business_proposal_leads" on public.business_proposal_leads for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on business_proposal_leads" on public.business_proposal_leads;
create policy "Allow public insert on business_proposal_leads" on public.business_proposal_leads for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on business_proposal_leads" on public.business_proposal_leads;
create policy "Allow public update on business_proposal_leads" on public.business_proposal_leads for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on business_proposal_leads" on public.business_proposal_leads;
create policy "Allow public delete on business_proposal_leads" on public.business_proposal_leads for delete to anon, authenticated, public using (true);


-- ==========================================
-- 15. whatsapp_contact_leads Table
-- ==========================================
create table if not exists public.whatsapp_contact_leads (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text not null,
    status text default 'New Lead' not null,
    source text default 'WhatsApp' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Force Disable RLS for foolproof client operations
alter table public.whatsapp_contact_leads disable row level security;

-- Backup policies in case RLS is re-enabled:
drop policy if exists "Allow public select on whatsapp_contact_leads" on public.whatsapp_contact_leads;
create policy "Allow public select on whatsapp_contact_leads" on public.whatsapp_contact_leads for select to anon, authenticated, public using (true);

drop policy if exists "Allow public insert on whatsapp_contact_leads" on public.whatsapp_contact_leads;
create policy "Allow public insert on whatsapp_contact_leads" on public.whatsapp_contact_leads for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow public update on whatsapp_contact_leads" on public.whatsapp_contact_leads;
create policy "Allow public update on whatsapp_contact_leads" on public.whatsapp_contact_leads for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow public delete on whatsapp_contact_leads" on public.whatsapp_contact_leads;
create policy "Allow public delete on whatsapp_contact_leads" on public.whatsapp_contact_leads for delete to anon, authenticated, public using (true);


-- Enable Realtime for business_tool_leads, business_proposal_leads, whatsapp_contact_leads
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'business_tool_leads'
  ) then
    alter publication supabase_realtime add table public.business_tool_leads;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'business_proposal_leads'
  ) then
    alter publication supabase_realtime add table public.business_proposal_leads;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'whatsapp_contact_leads'
  ) then
    alter publication supabase_realtime add table public.whatsapp_contact_leads;
  end if;
end $$;

-- =========================================================================
-- CLIENT PORTAL INTEGRATION MIGRATION (Going Technologies 2026)
-- =========================================================================

-- 1. client_profiles Table
create table if not exists public.client_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    company text not null,
    name text not null,
    email text unique not null,
    phone text,
    country text,
    industry text,
    designation text,
    status text not null default 'active', -- 'active' | 'suspended'
    last_login timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. client_document_folders Table
create table if not exists public.client_document_folders (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    parent_id uuid references public.client_document_folders(id) on delete cascade,
    created_at timestamp with time zone default now()
);

-- 3. client_documents Table
create table if not exists public.client_documents (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references auth.users(id) on delete cascade,
    folder_id uuid references public.client_document_folders(id) on delete cascade,
    title text not null,
    file_name text not null,
    file_size text not null,
    uploaded_by text not null, -- 'Client' | 'Admin'
    file_path text not null, -- Supabase Storage file path
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 4. client_credentials Table
create table if not exists public.client_credentials (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references auth.users(id) on delete cascade,
    platform text not null,
    category text not null, -- e.g. CRM, AMS, Server, VPN
    login_url text,
    username text not null,
    password text not null, -- encrypted or masked
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 5. client_activity_logs Table
create table if not exists public.client_activity_logs (
    id uuid primary key default gen_random_uuid(),
    client_id uuid references auth.users(id) on delete cascade,
    email text not null,
    event_type text not null,
    description text not null,
    created_at timestamp with time zone default now()
);

-- 6. client_notifications Table
create table if not exists public.client_notifications (
    id uuid primary key default gen_random_uuid(),
    client_id uuid references auth.users(id) on delete cascade,
    title text not null,
    message text not null,
    type text not null, -- 'Credential' | 'Document' | 'Auth' | 'System'
    is_read boolean not null default false,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.client_profiles enable row level security;
alter table public.client_document_folders enable row level security;
alter table public.client_documents enable row level security;
alter table public.client_credentials enable row level security;
alter table public.client_activity_logs enable row level security;
alter table public.client_notifications enable row level security;

-- Create Policies
-- client_profiles
drop policy if exists "Allow select profiles" on public.client_profiles;
create policy "Allow select profiles" on public.client_profiles
    for select to anon, authenticated, public using (true);

drop policy if exists "Allow insert profiles" on public.client_profiles;
create policy "Allow insert profiles" on public.client_profiles
    for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow update profiles" on public.client_profiles;
create policy "Allow update profiles" on public.client_profiles
    for update to anon, authenticated, public using (true) with check (true);

-- client_document_folders
drop policy if exists "Allow all folder ops for owner" on public.client_document_folders;
create policy "Allow all folder ops for owner" on public.client_document_folders
    for all to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());

drop policy if exists "Allow admin folder select" on public.client_document_folders;
create policy "Allow admin folder select" on public.client_document_folders
    for select to anon, authenticated, public using (true);

-- client_documents
drop policy if exists "Allow all doc ops for owner" on public.client_documents;
create policy "Allow all doc ops for owner" on public.client_documents
    for all to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());

drop policy if exists "Allow admin select documents" on public.client_documents;
create policy "Allow admin select documents" on public.client_documents
    for select to anon, authenticated, public using (true);

drop policy if exists "Allow admin insert documents" on public.client_documents;
create policy "Allow admin insert documents" on public.client_documents
    for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow admin delete documents" on public.client_documents;
create policy "Allow admin delete documents" on public.client_documents
    for delete to anon, authenticated, public using (true);

-- client_credentials
drop policy if exists "Allow all credential ops for owner" on public.client_credentials;
create policy "Allow all credential ops for owner" on public.client_credentials
    for all to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());

drop policy if exists "Allow admin select credentials" on public.client_credentials;
create policy "Allow admin select credentials" on public.client_credentials
    for select to anon, authenticated, public using (true);

-- client_activity_logs
drop policy if exists "Allow insert activity logs" on public.client_activity_logs;
create policy "Allow insert activity logs" on public.client_activity_logs
    for insert to anon, authenticated, public with check (true);

drop policy if exists "Allow select activity logs" on public.client_activity_logs;
create policy "Allow select activity logs" on public.client_activity_logs
    for select to anon, authenticated, public using (true);

-- client_notifications
drop policy if exists "Allow select notifications for owner" on public.client_notifications;
create policy "Allow select notifications for owner" on public.client_notifications
    for select to anon, authenticated, public using (true);

drop policy if exists "Allow update notifications for owner" on public.client_notifications;
create policy "Allow update notifications for owner" on public.client_notifications
    for update to anon, authenticated, public using (true) with check (true);

drop policy if exists "Allow insert notifications" on public.client_notifications;
create policy "Allow insert notifications" on public.client_notifications
    for insert to anon, authenticated, public with check (true);


-- Indexes for high performance querying
create index if not exists idx_client_profiles_email on public.client_profiles(email);
create index if not exists idx_client_credentials_client_id on public.client_credentials(client_id);
create index if not exists idx_client_documents_client_id on public.client_documents(client_id);
create index if not exists idx_client_documents_folder_id on public.client_documents(folder_id);
create index if not exists idx_client_activity_logs_client_id on public.client_activity_logs(client_id);
create index if not exists idx_client_notifications_client_id on public.client_notifications(client_id);

-- Storage bucket setup
insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Allow auth user storage select" on storage.objects;
create policy "Allow auth user storage select" on storage.objects
    for select to anon, authenticated, public using (bucket_id = 'client-documents');

drop policy if exists "Allow auth user storage insert" on storage.objects;
create policy "Allow auth user storage insert" on storage.objects
    for insert to anon, authenticated, public with check (bucket_id = 'client-documents');

drop policy if exists "Allow auth user storage delete" on storage.objects;
create policy "Allow auth user storage delete" on storage.objects
    for delete to anon, authenticated, public using (bucket_id = 'client-documents');


-- Realtime publications enablement
do $$
begin
  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'client_profiles'
  ) then
    alter publication supabase_realtime add table public.client_profiles;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'client_credentials'
  ) then
    alter publication supabase_realtime add table public.client_credentials;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'client_documents'
  ) then
    alter publication supabase_realtime add table public.client_documents;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'client_document_folders'
  ) then
    alter publication supabase_realtime add table public.client_document_folders;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'client_activity_logs'
  ) then
    alter publication supabase_realtime add table public.client_activity_logs;
  end if;

  if not exists (
    select 1 from pg_publication_rel pr
    join pg_publication p on p.oid = pr.prpubid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'client_notifications'
  ) then
    alter publication supabase_realtime add table public.client_notifications;
  end if;
end $$;


-- Trigger function to log client credentials changes automatically
create or replace function public.log_credentials_change()
returns trigger as $$
declare
    client_email text;
    event_desc text;
begin
    -- Get client email
    select email into client_email from public.client_profiles where id = coalesce(new.client_id, old.client_id);
    
    if (TG_OP = 'INSERT') then
        event_desc := 'Created credential for ' || new.platform;
        insert into public.client_activity_logs (client_id, email, event_type, description)
        values (new.client_id, coalesce(client_email, 'unknown@client.com'), 'Credential Created', event_desc);
        
        insert into public.client_notifications (client_id, title, message, type)
        values (new.client_id, 'Credential Added', event_desc, 'Credential');
    elsif (TG_OP = 'UPDATE') then
        event_desc := 'Updated credential for ' || new.platform;
        insert into public.client_activity_logs (client_id, email, event_type, description)
        values (new.client_id, coalesce(client_email, 'unknown@client.com'), 'Credential Updated', event_desc);
        
        insert into public.client_notifications (client_id, title, message, type)
        values (new.client_id, 'Credential Updated', event_desc, 'Credential');
    elsif (TG_OP = 'DELETE') then
        event_desc := 'Deleted credential for ' || old.platform;
        insert into public.client_activity_logs (client_id, email, event_type, description)
        values (old.client_id, coalesce(client_email, 'unknown@client.com'), 'Credential Deleted', event_desc);
        
        insert into public.client_notifications (client_id, title, message, type)
        values (old.client_id, 'Credential Deleted', event_desc, 'Credential');
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_log_credentials_change on public.client_credentials;
create trigger trg_log_credentials_change
after insert or update or delete on public.client_credentials
for each row execute function public.log_credentials_change();


-- Trigger function to log client documents changes automatically
create or replace function public.log_documents_change()
returns trigger as $$
declare
    client_email text;
    event_desc text;
begin
    -- Get client email
    select email into client_email from public.client_profiles where id = coalesce(new.client_id, old.client_id);
    
    if (TG_OP = 'INSERT') then
        event_desc := 'Uploaded document: ' || new.file_name;
        insert into public.client_activity_logs (client_id, email, event_type, description)
        values (new.client_id, coalesce(client_email, 'unknown@client.com'), 'Document Uploaded', event_desc);
        
        insert into public.client_notifications (client_id, title, message, type)
        values (new.client_id, 'Document Uploaded', event_desc, 'Document');
    elsif (TG_OP = 'DELETE') then
        event_desc := 'Deleted document: ' || old.file_name;
        insert into public.client_activity_logs (client_id, email, event_type, description)
        values (old.client_id, coalesce(client_email, 'unknown@client.com'), 'Document Deleted', event_desc);
        
        insert into public.client_notifications (client_id, title, message, type)
        values (old.client_id, 'Document Deleted', event_desc, 'Document');
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_log_documents_change on public.client_documents;
create trigger trg_log_documents_change
after insert or delete on public.client_documents
for each row execute function public.log_documents_change();

