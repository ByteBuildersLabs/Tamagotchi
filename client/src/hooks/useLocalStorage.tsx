import { useState } from 'react';
import { StorageValue, StorageError, STORAGE_ERROR_CODES } from '../types/game';

// Utility Functions
const getStorageItem = <T,>(key: string): StorageValue<T> => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const setStorageItem = <T,>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    const storageError = error as StorageError;
    if (storageError.code === STORAGE_ERROR_CODES.QUOTA_EXCEEDED) {
      console.error('Storage quota exceeded');
    } else {
      console.error('Error writing to localStorage:', error);
    }
  }
};

// Hook
export function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getStorageItem<T>(key);
    return item ?? initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    setStorageItem(key, value);
  };

  return [storedValue, setValue];
}
