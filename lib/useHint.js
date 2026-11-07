import { useSyncExternalStore } from "react";

// Which how-to hints the visitor no longer needs. A hint goes the moment its
// interaction has been tried, and stays gone until the page is next loaded.
const tried = new Set();
const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function markHint(key) {
  tried.add(key);
  listeners.forEach((fn) => fn());
}

export const useHintDone = (key) =>
  useSyncExternalStore(
    subscribe,
    () => tried.has(key),
    () => true,
  );
