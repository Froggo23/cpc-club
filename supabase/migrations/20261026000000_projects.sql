-- Student projects shown on the showcase. All reads/writes go through the
-- Next.js server with the service-role key, so RLS stays on with no policies.
create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  repo_url     text not null unique,
  owner        text not null,
  repo         text not null,
  description  text,
  language     text,
  stars        integer not null default 0,
  homepage     text,
  author_name  text not null,
  created_at   timestamptz not null default now()
);

create index projects_created_at_idx on public.projects (created_at desc);

alter table public.projects enable row level security;
