-- Add unique constraint on reactions for upsert support
ALTER TABLE public.reactions DROP CONSTRAINT IF EXISTS reactions_user_post_unique;
CREATE UNIQUE INDEX IF NOT EXISTS reactions_user_post_unique ON public.reactions (user_id, post_id);
