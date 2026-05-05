-- Add "general" feed section for Apple Newsroom, Google News / The Keyword, wire summaries, etc.
alter table public.feed_items drop constraint if exists feed_items_section_check;

alter table public.feed_items add constraint feed_items_section_check
  check (section in ('ai', 'tech', 'programming', 'integrations', 'general'));
