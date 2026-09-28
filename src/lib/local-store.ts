import { useCallback, useEffect, useState } from "react";

/**
 * Persist state in the visitor's browser (localStorage). Reads happen after
 * hydration so server and client render the same initial markup.
 */
export function useLocalStore<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore unreadable storage */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be full or blocked */
    }
  }, [key, value, loaded]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return { value, setValue, loaded, reset } as const;
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
