create extension if not exists pgcrypto;

do $$
begin
  create type public.user_role as enum ('registered', 'subscriber', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.publication_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_status as enum (
    'trialing',
    'active',
    'past_due',
    'canceled',
    'expired'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.download_content_type as enum (
    'sample',
    'sample_pack',
    'instrumental'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  role public.user_role not null default 'registered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  price_monthly numeric(10, 2) not null default 0 check (price_monthly >= 0),
  monthly_sample_limit integer check (
    monthly_sample_limit is null or monthly_sample_limit >= 0
  ),
  monthly_instrumental_limit integer check (
    monthly_instrumental_limit is null or monthly_instrumental_limit >= 0
  ),
  includes_courses boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id),
  status public.subscription_status not null default 'active',
  provider text,
  provider_subscription_id text unique,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_period_end > current_period_start)
);

create table if not exists public.sample_packs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  genre text not null,
  bpm integer check (bpm is null or bpm between 20 and 400),
  musical_key text,
  pack_type text not null,
  tags text[] not null default '{}',
  preview_path text,
  file_path text not null,
  cover_path text,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.samples (
  id uuid primary key default gen_random_uuid(),
  sample_pack_id uuid references public.sample_packs(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null default '',
  genre text not null,
  bpm integer check (bpm is null or bpm between 20 and 400),
  musical_key text,
  sample_type text not null,
  tags text[] not null default '{}',
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  preview_path text,
  file_path text not null,
  cover_path text,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instrumentals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  genre text not null,
  bpm integer not null check (bpm between 20 and 400),
  musical_key text not null,
  mood text not null,
  tags text[] not null default '{}',
  preview_path text,
  file_path text not null,
  cover_path text,
  license text not null,
  price numeric(10, 2) check (price is null or price >= 0),
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  content_type public.download_content_type not null,
  sample_pack_id uuid references public.sample_packs(id) on delete set null,
  sample_id uuid references public.samples(id) on delete set null,
  instrumental_id uuid references public.instrumentals(id) on delete set null,
  created_at timestamptz not null default now(),
  check (
    num_nonnulls(sample_pack_id, sample_id, instrumental_id) = 1
  ),
  check (
    (content_type = 'sample_pack' and sample_pack_id is not null) or
    (content_type = 'sample' and sample_id is not null) or
    (content_type = 'instrumental' and instrumental_id is not null)
  )
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  instructor text not null,
  cover_path text,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, position)
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  position integer not null default 0 check (position >= 0),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  video_path text,
  external_video_url text,
  is_preview boolean not null default false,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, position),
  check (num_nonnulls(video_path, external_video_url) <= 1)
);

create index if not exists user_subscriptions_user_status_period_idx
  on public.user_subscriptions (user_id, status, current_period_end desc);
create index if not exists user_subscriptions_plan_id_idx
  on public.user_subscriptions (plan_id);
create index if not exists sample_packs_status_published_idx
  on public.sample_packs (status, published_at desc);
create index if not exists samples_pack_id_idx
  on public.samples (sample_pack_id);
create index if not exists samples_status_genre_bpm_idx
  on public.samples (status, genre, bpm);
create index if not exists instrumentals_status_genre_bpm_idx
  on public.instrumentals (status, genre, bpm);
create index if not exists downloads_user_created_idx
  on public.downloads (user_id, created_at desc);
create index if not exists downloads_user_type_created_idx
  on public.downloads (user_id, content_type, created_at desc);
create index if not exists course_modules_course_position_idx
  on public.course_modules (course_id, position);
create index if not exists course_lessons_module_position_idx
  on public.course_lessons (module_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users',
    'subscription_plans',
    'user_subscriptions',
    'sample_packs',
    'samples',
    'instrumentals',
    'courses',
    'course_modules',
    'course_lessons'
  ]
  loop
    execute format(
      'drop trigger if exists set_%I_updated_at on public.%I',
      table_name,
      table_name
    );
    execute format(
      'create trigger set_%I_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, new.id::text || '@pending.local'),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'iniciado'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.has_course_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1
    from public.user_subscriptions us
    join public.subscription_plans sp on sp.id = us.plan_id
    where us.user_id = (select auth.uid())
      and us.status in ('trialing', 'active')
      and now() >= us.current_period_start
      and now() < us.current_period_end
      and sp.includes_courses
  );
$$;

alter table public.users enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.sample_packs enable row level security;
alter table public.samples enable row level security;
alter table public.instrumentals enable row level security;
alter table public.downloads enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;

create policy "users_select_own_or_admin"
  on public.users for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "users_admin_manage"
  on public.users for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "plans_public_read"
  on public.subscription_plans for select
  to anon, authenticated
  using (is_active or (select public.is_admin()));

create policy "plans_admin_manage"
  on public.subscription_plans for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "subscriptions_select_own_or_admin"
  on public.user_subscriptions for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "subscriptions_admin_manage"
  on public.user_subscriptions for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "sample_packs_read_published"
  on public.sample_packs for select
  to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

create policy "sample_packs_admin_manage"
  on public.sample_packs for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "samples_read_published"
  on public.samples for select
  to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

create policy "samples_admin_manage"
  on public.samples for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "instrumentals_read_published"
  on public.instrumentals for select
  to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

create policy "instrumentals_admin_manage"
  on public.instrumentals for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "downloads_select_own_or_admin"
  on public.downloads for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "downloads_admin_manage"
  on public.downloads for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "courses_read_published"
  on public.courses for select
  to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

create policy "courses_admin_manage"
  on public.courses for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "course_modules_read"
  on public.course_modules for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.courses
      where courses.id = course_modules.course_id
        and courses.status = 'published'
    )
    or (select public.is_admin())
  );

create policy "course_modules_admin_manage"
  on public.course_modules for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "course_lessons_read"
  on public.course_lessons for select
  to anon, authenticated
  using (
    (status = 'published' and is_preview)
    or (status = 'published' and (select public.has_course_access()))
    or (select public.is_admin())
  );

create policy "course_lessons_admin_manage"
  on public.course_lessons for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

insert into storage.buckets (id, name, public)
values
  ('ssr-previews', 'ssr-previews', true),
  ('ssr-private', 'ssr-private', false)
on conflict (id) do update set public = excluded.public;

create policy "previews_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'ssr-previews');

create policy "storage_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('ssr-previews', 'ssr-private')
    and (select public.is_admin())
  );

create policy "storage_admin_update"
  on storage.objects for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "storage_admin_delete"
  on storage.objects for delete
  to authenticated
  using ((select public.is_admin()));

create or replace function public.request_download(
  p_content_type public.download_content_type,
  p_content_id uuid
)
returns table (
  download_id uuid,
  storage_path text,
  remaining_count integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_is_admin boolean := false;
  v_limit integer;
  v_used integer;
  v_storage_path text;
  v_download_id uuid;
  v_period_start timestamptz := date_trunc('month', now() at time zone 'utc') at time zone 'utc';
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select public.is_admin() into v_is_admin;

  if p_content_type = 'sample_pack' then
    select file_path into v_storage_path
    from public.sample_packs
    where id = p_content_id and status = 'published';
  elsif p_content_type = 'sample' then
    select file_path into v_storage_path
    from public.samples
    where id = p_content_id and status = 'published';
  elsif p_content_type = 'instrumental' then
    select file_path into v_storage_path
    from public.instrumentals
    where id = p_content_id and status = 'published';
  end if;

  if v_storage_path is null then
    raise exception 'CONTENT_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(v_user_id::text || v_period_start::text, 0)
  );

  if not v_is_admin then
    select
      case
        when p_content_type = 'instrumental'
          then sp.monthly_instrumental_limit
        else sp.monthly_sample_limit
      end
    into v_limit
    from public.user_subscriptions us
    join public.subscription_plans sp on sp.id = us.plan_id
    where us.user_id = v_user_id
      and us.status in ('trialing', 'active')
      and now() >= us.current_period_start
      and now() < us.current_period_end
      and sp.is_active
    order by us.current_period_end desc
    limit 1;

    if not found then
      raise exception 'ACTIVE_SUBSCRIPTION_REQUIRED' using errcode = 'P0001';
    end if;

    if v_limit is not null then
      select count(*)::integer
      into v_used
      from public.downloads
      where user_id = v_user_id
        and created_at >= v_period_start
        and (
          (p_content_type = 'instrumental' and content_type = 'instrumental')
          or (
            p_content_type in ('sample', 'sample_pack')
            and content_type in ('sample', 'sample_pack')
          )
        );

      if v_used >= v_limit then
        raise exception 'MONTHLY_LIMIT_REACHED' using errcode = 'P0001';
      end if;
    end if;
  end if;

  insert into public.downloads (
    user_id,
    content_type,
    sample_pack_id,
    sample_id,
    instrumental_id
  )
  values (
    v_user_id,
    p_content_type,
    case when p_content_type = 'sample_pack' then p_content_id end,
    case when p_content_type = 'sample' then p_content_id end,
    case when p_content_type = 'instrumental' then p_content_id end
  )
  returning id into v_download_id;

  return query
  select
    v_download_id,
    v_storage_path,
    case
      when v_is_admin or v_limit is null then null
      else greatest(v_limit - coalesce(v_used, 0) - 1, 0)
    end;
end;
$$;

revoke all on function public.request_download(
  public.download_content_type,
  uuid
) from public;
grant execute on function public.request_download(
  public.download_content_type,
  uuid
) to authenticated;

