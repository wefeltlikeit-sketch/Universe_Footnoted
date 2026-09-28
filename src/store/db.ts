/**
 * Minimal promise wrapper over IndexedDB, with an in-memory fallback (private windows, tests,
 * blocked storage) so the app always works, merely without persistence.
 */
export type StoreName = 'concepts' | 'edges' | 'sources' | 'journeys' | 'sessions' | 'kv' | 'aicache';

export interface KV {
  getAll<T>(store: StoreName): Promise<T[]>;
  get<T>(store: StoreName, key: string): Promise<T | undefined>;
  put<T>(store: StoreName, key: string, value: T): Promise<void>;
  putMany<T>(store: StoreName, items: [string, T][]): Promise<void>;
  delete(store: StoreName, key: string): Promise<void>;
  clear(store: StoreName): Promise<void>;
  persistent: boolean;
}

const STORES: StoreName[] = ['concepts', 'edges', 'sources', 'journeys', 'sessions', 'kv', 'aicache'];
const DB_NAME = 'universe-footnoted';
const DB_VERSION = 1;

export async function openStore(): Promise<KV> {
  try {
    if (typeof indexedDB === 'undefined') throw new Error('no indexedDB');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        for (const s of STORES) if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('blocked'));
    });
    return idbStore(db);
  } catch {
    return memoryStore();
  }
}

function idbStore(db: IDBDatabase): KV {
  const run = <T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest | void) =>
    new Promise<T>((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const req = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve((req ? req.result : undefined) as T);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  return {
    persistent: true,
    getAll: (store) => run(store, 'readonly', (s) => s.getAll()),
    get: (store, key) => run(store, 'readonly', (s) => s.get(key)),
    put: (store, key, value) => run(store, 'readwrite', (s) => s.put(value, key)),
    putMany: (store, items) => run(store, 'readwrite', (s) => { for (const [k, v] of items) s.put(v, k); }),
    delete: (store, key) => run(store, 'readwrite', (s) => s.delete(key)),
    clear: (store) => run(store, 'readwrite', (s) => s.clear()),
  };
}

export function memoryStore(): KV {
  const data = new Map<StoreName, Map<string, unknown>>(STORES.map((s) => [s, new Map()]));
  return {
    persistent: false,
    getAll: async <T,>(store: StoreName) => [...data.get(store)!.values()] as T[],
    get: async <T,>(store: StoreName, key: string) => data.get(store)!.get(key) as T | undefined,
    put: async (store, key, value) => void data.get(store)!.set(key, value),
    putMany: async (store, items) => { for (const [k, v] of items) data.get(store)!.set(k, v); },
    delete: async (store, key) => void data.get(store)!.delete(key),
    clear: async (store) => data.get(store)!.clear(),
  };
}
