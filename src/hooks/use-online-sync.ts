import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { syncOfflineProgress } from '@/hooks/use-problems';

/** Syncs dirty offline progress when the browser comes back online */
export function useOnlineSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = async () => {
      await syncOfflineProgress();
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    };

    window.addEventListener('online', handler);
    // Also sync on mount if already online
    if (navigator.onLine) handler();

    return () => window.removeEventListener('online', handler);
  }, [queryClient]);
}
