-- VibeAudit Initial Migration
-- Copy of supabase/schema.sql for automated migration tools

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  stripe_customer_id text,
  stripe_subscription_id text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  github_repo_id bigint not null,
  full_name text not null,
  default_branch text not null default 'main',
  installation_id bigint not null,
  connected_at timestamptz not null default now(),
  unique(user_id, github_repo_id)
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  repo_id uuid not null references public.repos(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  score integer check (score >= 0 and score <= 100),
  commit_sha text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.findings (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  check_type text not null,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low')),
  file_path text not null,
  line integer not null default 1,
  title text not null,
  plain_english text,
  fix_suggestion text,
  cwe text
);

create table if not exists public.fix_prs (
  id uuid primary key default gen_random_uuid(),
  finding_id uuid not null references public.findings(id) on delete cascade,
  scan_id uuid not null references public.scans(id) on delete cascade,
  pr_url text not null,
  status text not null default 'open' check (status in ('open', 'merged', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.monitoring_config (
  repo_id uuid primary key references public.repos(id) on delete cascade,
  enabled boolean not null default false,
  alert_email text,
  alert_discord_webhook text
);

create index if not exists idx_repos_user_id on public.repos(user_id);
create index if not exists idx_scans_repo_id on public.scans(repo_id);
create index if not exists idx_scans_user_id on public.scans(user_id);
create index if not exists idx_findings_scan_id on public.findings(scan_id);
create index if not exists idx_fix_prs_finding_id on public.fix_prs(finding_id);
create index if not exists idx_fix_prs_scan_id on public.fix_prs(scan_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan, onboarding_completed)
  values (new.id, new.email, 'free', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

alter table public.profiles enable row level security;
alter table public.repos enable row level security;
alter table public.scans enable row level security;
alter table public.findings enable row level security;
alter table public.fix_prs enable row level security;
alter table public.monitoring_config enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own repos" on public.repos for select using (auth.uid() = user_id);
create policy "Users can insert own repos" on public.repos for insert with check (auth.uid() = user_id);
create policy "Users can update own repos" on public.repos for update using (auth.uid() = user_id);
create policy "Users can delete own repos" on public.repos for delete using (auth.uid() = user_id);
create policy "Users can view own scans" on public.scans for select using (auth.uid() = user_id);
create policy "Users can insert own scans" on public.scans for insert with check (auth.uid() = user_id);
create policy "Users can update own scans" on public.scans for update using (auth.uid() = user_id);
create policy "Users can view findings of own scans" on public.findings for select using (exists (select 1 from public.scans where scans.id = findings.scan_id and scans.user_id = auth.uid()));
create policy "Users can view fix_prs of own scans" on public.fix_prs for select using (exists (select 1 from public.scans where scans.id = fix_prs.scan_id and scans.user_id = auth.uid()));
create policy "Users can insert fix_prs for own scans" on public.fix_prs for insert with check (exists (select 1 from public.scans where scans.id = fix_prs.scan_id and scans.user_id = auth.uid()));
create policy "Users can update fix_prs for own scans" on public.fix_prs for update using (exists (select 1 from public.scans where scans.id = fix_prs.scan_id and scans.user_id = auth.uid()));
create policy "Users can view monitoring_config of own repos" on public.monitoring_config for select using (exists (select 1 from public.repos where repos.id = monitoring_config.repo_id and repos.user_id = auth.uid()));
create policy "Users can insert monitoring_config for own repos" on public.monitoring_config for insert with check (exists (select 1 from public.repos where repos.id = monitoring_config.repo_id and repos.user_id = auth.uid()));
create policy "Users can update monitoring_config for own repos" on public.monitoring_config for update using (exists (select 1 from public.repos where repos.id = monitoring_config.repo_id and repos.user_id = auth.uid()));
