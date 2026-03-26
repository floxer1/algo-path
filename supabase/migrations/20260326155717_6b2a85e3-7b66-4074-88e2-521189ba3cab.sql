-- Create difficulty enum
CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- Create problems table
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'easy',
  category TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 10,
  starter_code JSONB NOT NULL DEFAULT '{}',
  test_cases JSONB NOT NULL DEFAULT '[]',
  solution JSONB DEFAULT '{}',
  hints TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  learning_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Problems are readable by everyone
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Problems are viewable by everyone"
  ON public.problems FOR SELECT USING (true);

-- Only admins can modify problems (via service role)
-- No insert/update/delete policies for regular users

CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'attempted' CHECK (status IN ('attempted', 'solved')),
  language TEXT NOT NULL DEFAULT 'javascript',
  code TEXT,
  attempts INTEGER NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  solved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, problem_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_problem ON public.user_progress(problem_id);
CREATE INDEX idx_problems_path ON public.problems(learning_path);
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);