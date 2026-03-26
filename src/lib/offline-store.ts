import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Tables } from '@/integrations/supabase/types';

type Problem = Tables<'problems'>;
type UserProgress = Tables<'user_progress'>;

interface OfflineDB extends DBSchema {
  problems: {
    key: string;
    value: Problem & { _cachedAt: number };
    indexes: {
      'by-difficulty': string;
      'by-path': string;
    };
  };
  userProgress: {
    key: string;
    value: UserProgress & { _cachedAt: number; _dirty?: boolean };
    indexes: {
      'by-user': string;
      'by-problem': string;
      'by-user-problem': [string, string];
    };
  };
  meta: {
    key: string;
    value: { key: string; value: string | number };
  };
}

const DB_NAME = 'algotrainer-offline';
const DB_VERSION = 1;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Problems store
        const problemStore = db.createObjectStore('problems', { keyPath: 'id' });
        problemStore.createIndex('by-difficulty', 'difficulty');
        problemStore.createIndex('by-path', 'learning_path');

        // User progress store
        const progressStore = db.createObjectStore('userProgress', { keyPath: 'id' });
        progressStore.createIndex('by-user', 'user_id');
        progressStore.createIndex('by-problem', 'problem_id');
        progressStore.createIndex('by-user-problem', ['user_id', 'problem_id']);

        // Meta store for timestamps etc
        db.createObjectStore('meta', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

// ─── Problems ───

export async function cacheProblems(problems: Problem[]) {
  const db = await getDB();
  const tx = db.transaction('problems', 'readwrite');
  const now = Date.now();
  await Promise.all([
    ...problems.map(p => tx.store.put({ ...p, _cachedAt: now })),
    tx.done,
  ]);
  const metaTx = db.transaction('meta', 'readwrite');
  await metaTx.store.put({ key: 'problems_lastSync', value: now });
}

export async function getCachedProblems(): Promise<Problem[] | null> {
  const db = await getDB();
  const meta = await db.get('meta', 'problems_lastSync');
  if (!meta || Date.now() - (meta.value as number) > CACHE_TTL) return null;
  const all = await db.getAll('problems');
  return all.map(({ _cachedAt, ...p }) => p as Problem);
}

export async function getCachedProblem(id: string): Promise<Problem | null> {
  const db = await getDB();
  const item = await db.get('problems', id);
  if (!item) return null;
  const { _cachedAt, ...p } = item;
  return p as Problem;
}

// ─── User Progress ───

export async function cacheUserProgress(progress: UserProgress[]) {
  const db = await getDB();
  const tx = db.transaction('userProgress', 'readwrite');
  const now = Date.now();
  await Promise.all([
    ...progress.map(p => tx.store.put({ ...p, _cachedAt: now })),
    tx.done,
  ]);
  const metaTx = db.transaction('meta', 'readwrite');
  await metaTx.store.put({ key: 'progress_lastSync', value: now });
}

export async function getCachedUserProgress(userId: string): Promise<UserProgress[] | null> {
  const db = await getDB();
  const meta = await db.get('meta', 'progress_lastSync');
  if (!meta || Date.now() - (meta.value as number) > CACHE_TTL) return null;
  const all = await db.getAllFromIndex('userProgress', 'by-user', userId);
  return all.map(({ _cachedAt, _dirty, ...p }) => p as UserProgress);
}

export async function getCachedProgressForProblem(userId: string, problemId: string): Promise<UserProgress | null> {
  const db = await getDB();
  const result = await db.getFromIndex('userProgress', 'by-user-problem', [userId, problemId]);
  if (!result) return null;
  const { _cachedAt, _dirty, ...p } = result;
  return p as UserProgress;
}

/** Save progress locally (marks as dirty for later sync) */
export async function saveDirtyProgress(progress: UserProgress) {
  const db = await getDB();
  await db.put('userProgress', { ...progress, _cachedAt: Date.now(), _dirty: true });
}

/** Get all dirty (unsynced) progress entries */
export async function getDirtyProgress(): Promise<UserProgress[]> {
  const db = await getDB();
  const all = await db.getAll('userProgress');
  return all
    .filter(p => p._dirty)
    .map(({ _cachedAt, _dirty, ...p }) => p as UserProgress);
}

/** Mark synced progress as clean */
export async function markProgressClean(ids: string[]) {
  const db = await getDB();
  const tx = db.transaction('userProgress', 'readwrite');
  await Promise.all(
    ids.map(async id => {
      const item = await tx.store.get(id);
      if (item) {
        delete item._dirty;
        await tx.store.put(item);
      }
    })
  );
  await tx.done;
}

// ─── Sync utility ───

export async function clearAllCache() {
  const db = await getDB();
  const tx1 = db.transaction('problems', 'readwrite');
  await tx1.store.clear();
  const tx2 = db.transaction('userProgress', 'readwrite');
  await tx2.store.clear();
  const tx3 = db.transaction('meta', 'readwrite');
  await tx3.store.clear();
}

export async function isCacheStale(key: 'problems_lastSync' | 'progress_lastSync'): Promise<boolean> {
  const db = await getDB();
  const meta = await db.get('meta', key);
  if (!meta) return true;
  return Date.now() - (meta.value as number) > CACHE_TTL;
}
