ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weekly_xp integer NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS league text NOT NULL DEFAULT 'bronze';