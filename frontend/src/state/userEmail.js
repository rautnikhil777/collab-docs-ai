import { useSyncExternalStore } from 'react';

const KEY = 'x-user-email';
const listeners = new Set();

function getSnapshot() {
  return window.sessionStorage.getItem(KEY);
}

function emit() {
  for (const l of listeners) l();
}

export function setUserEmail(email) {
  if (!email) {
    window.sessionStorage.removeItem(KEY);
    emit();
    return;
  }
  window.sessionStorage.setItem(KEY, String(email).toLowerCase());
  emit();
}

export function clearUserEmail() {
  window.sessionStorage.removeItem(KEY);
  emit();
}

export function useUserEmail() {
  const subscribe = (cb) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  };

  const email = useSyncExternalStore(subscribe, getSnapshot);
  return email;
}

