import type { StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'balance-storage',
});

const inactivityStorage = new MMKV({
  id: 'inactivity-storage',
});

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

export const recordStartTime = () => {
  const startTime = Date.now();
  inactivityStorage.set('startTime', startTime);
};

export const getStartTime = () => {
  return inactivityStorage.getNumber('startTime') || 0;
};
