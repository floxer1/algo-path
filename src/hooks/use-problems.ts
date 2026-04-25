import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  cacheProblems,
  getCachedProblems,
  getCachedProblem,
  cacheUserProgress,
  getCachedUserProgress,
  getCachedProgressForProblem,
  saveDirtyProgress,
  getDirtyProgress,
  markProgressClean,
} from '@/lib/offline-store';
import type { Tables } from '@/integrations/supabase/types';

type Problem = Tables<'problems'>;
type UserProgress = Tables<'user_progress'>;

export function useProblems() {
  return useQuery({
    queryKey: ['problems'],
    queryFn: async (): Promise<Problem[]> => {
      // Try network first
      const { data, error } = await (supabase as any)
        .from('problems_public')
        .select('*')
        .order('sort_order');

      if (!error && data) {
        // Cache for offline use
        cacheProblems(data as Problem[]).catch(console.warn);
        return data as Problem[];
      }

      // Fall back to cache
      const cached = await getCachedProblems();
      if (cached && cached.length > 0) return cached;

      throw error || new Error('No problems available');
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ['problem', id],
    queryFn: async (): Promise<Problem> => {
      const { data, error } = await (supabase as any)
        .from('problems_public')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return data as Problem;

      const cached = await getCachedProblem(id);
      if (cached) return cached;

      throw error || new Error('Problem not found');
    },
    enabled: !!id,
  });
}

export function useUserProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['userProgress', user?.id],
    queryFn: async (): Promise<UserProgress[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        cacheUserProgress(data).catch(console.warn);
        return data;
      }

      const cached = await getCachedUserProgress(user.id);
      if (cached) return cached;

      throw error || new Error('Could not load progress');
    },
    enabled: !!user,
  });
}

export function useProgressForProblem(problemId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['userProgress', user?.id, problemId],
    queryFn: async (): Promise<UserProgress | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('problem_id', problemId)
        .maybeSingle();

      if (!error && data) return data;
      if (!error && !data) return null;

      const cached = await getCachedProgressForProblem(user.id, problemId);
      return cached;
    },
    enabled: !!user && !!problemId,
  });
}

export function useSaveProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      problem_id: string;
      code: string;
      language: string;
      status: string;
      xp_earned?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const progressData = {
        user_id: user.id,
        ...payload,
        solved_at: payload.status === 'solved' ? new Date().toISOString() : null,
      };

      // Try upsert online
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progressData, { onConflict: 'user_id,problem_id' })
        .select()
        .single();

      if (!error && data) {
        return data;
      }

      // Offline fallback — save dirty
      const dirtyEntry: UserProgress = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        attempts: 1,
        time_spent_seconds: 0,
        xp_earned: payload.xp_earned ?? 0,
        solved_at: payload.status === 'solved' ? new Date().toISOString() : null,
        ...progressData,
      };
      await saveDirtyProgress(dirtyEntry);
      return dirtyEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}

/** Sync dirty offline progress to server */
export async function syncOfflineProgress() {
  const dirty = await getDirtyProgress();
  if (dirty.length === 0) return;

  const synced: string[] = [];
  for (const entry of dirty) {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: entry.user_id,
        problem_id: entry.problem_id,
        status: entry.status,
        language: entry.language,
        code: entry.code,
        attempts: entry.attempts,
        xp_earned: entry.xp_earned,
        solved_at: entry.solved_at,
      }, { onConflict: 'user_id,problem_id' });

    if (!error) synced.push(entry.id);
  }

  if (synced.length > 0) await markProgressClean(synced);
}
