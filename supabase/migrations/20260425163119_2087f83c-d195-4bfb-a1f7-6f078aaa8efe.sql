-- 1. Create a public view of problems WITHOUT the `solution` column
CREATE OR REPLACE VIEW public.problems_public
WITH (security_invoker=on) AS
SELECT
  id,
  title,
  slug,
  description,
  difficulty,
  category,
  xp,
  starter_code,
  test_cases,
  hints,
  tags,
  sort_order,
  learning_path,
  created_at,
  updated_at
FROM public.problems;

-- 2. Lock down the base table: remove the public SELECT policy and replace with deny-all
DROP POLICY IF EXISTS "Problems are viewable by everyone" ON public.problems;

CREATE POLICY "No direct access to problems base table"
ON public.problems
FOR SELECT
USING (false);

-- 3. Allow the view itself to be readable by anyone (anon + authenticated)
GRANT SELECT ON public.problems_public TO anon, authenticated;

-- 4. Secure function to retrieve a solution — only authenticated users
CREATE OR REPLACE FUNCTION public.get_problem_solution(_problem_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT solution
  FROM public.problems
  WHERE id = _problem_id
    AND auth.uid() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.get_problem_solution(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_problem_solution(uuid) TO authenticated;