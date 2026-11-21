import { useSyncExternalStore } from 'react';

function subscribe(notify: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  preference.addEventListener('change', notify);
  return () => preference.removeEventListener('change', notify);
}

function snapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
