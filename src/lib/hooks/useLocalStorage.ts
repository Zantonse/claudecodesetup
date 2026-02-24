"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { safeGetItem, safeSetItem } from "../storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Always initialize with the default to match server-rendered HTML.
  // localStorage is synced after mount to avoid hydration mismatches.
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const saved = safeGetItem(key, initialValue);
      // Only update if the stored value differs from the default
      if (JSON.stringify(saved) !== JSON.stringify(initialValue)) {
        setStoredValue(saved);
      }
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        safeSetItem(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
