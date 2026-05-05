-- Track content changes for client-side cache invalidation (vs. stable rows on re-ingest).
alter table public.feed_items
  add column if not exists updated_at timestamptz not null default now();

update public.feed_items
set updated_at = created_at
where updated_at is null;

create or replace function public.feed_items_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'insert' then
    new.updated_at := coalesce(new.updated_at, now());
    return new;
  end if;
  if row(
    new.title,
    new.summary,
    new.thumbnail_url,
    new.section,
    new.tags,
    new.source_name,
    new.published_at
  ) is distinct from row(
    old.title,
    old.summary,
    old.thumbnail_url,
    old.section,
    old.tags,
    old.source_name,
    old.published_at
  ) then
    new.updated_at := now();
  else
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;

drop trigger if exists feed_items_touch_updated_at on public.feed_items;
create trigger feed_items_touch_updated_at
  before insert or update on public.feed_items
  for each row
  execute procedure public.feed_items_touch_updated_at();
