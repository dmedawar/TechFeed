-- Tech Feed schema
create extension if not exists "pgcrypto";

create table public.feed_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  summary text,
  thumbnail_url text,
  section text not null check (section in ('ai', 'tech', 'programming', 'integrations')),
  tags text[] not null default '{}',
  source_name text,
  published_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index feed_items_section_published_idx on public.feed_items (section, published_at desc);
create index feed_items_tags_gin on public.feed_items using gin (tags);

create table public.custom_topics (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('language', 'integration')),
  slug text not null,
  label text not null,
  icon_slug text,
  created_at timestamptz not null default now(),
  constraint custom_topics_kind_slug_key unique (kind, slug)
);

alter table public.feed_items enable row level security;
alter table public.custom_topics enable row level security;

create policy "feed_items_select_anon"
  on public.feed_items for select
  using (true);

create policy "custom_topics_select_anon"
  on public.custom_topics for select
  using (true);

create policy "custom_topics_insert_anon"
  on public.custom_topics for insert
  with check (
    length(slug) between 2 and 80
    and length(label) between 1 and 120
    and slug ~ '^[a-z0-9]+(?:[.-][a-z0-9]+)*$'
  );
