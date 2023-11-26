import { useCallback, useEffect, useState } from 'react';

/**
 * Retrieves a value from storage based on the provided key.
 * If the value does not exist or an error occurs, it will return the initial value.
 *
 * @param {string} key - The key of the value to retrieve from storage.
 * @param {T} initialValue - The initial value to be returned if the value does not exist or an error occurs.
 * @param {"localStorage" | "sessionStorage"} [storageType="localStorage"] - The type of storage to retrieve the value from. Default is "localStorage".
 * @returns {T} - The retrieved value from storage or the initial value if it does not exist or an error occurs.
 */
const getFromStorage = <T>(
  key: string,
  initialValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
): T => {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window[storageType].getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
};

/**
 * Custom hook to store a JSON serializable value into the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
 * The API of this function is almost the same as React's `useState` function. The only difference is that the *dispatcher* does not allow the usage of a function.
 *
 * @param {string} key The key must be unique
 * @param initialValue Default value
 * @param {"localStorage" | "sessionStorage"} storageType Where to store the value, either in `localStorage` or in `sessionStorage`
 * @see [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
 * @example
 * // Example using TypeScript
 * const [value, setValue] = useStorage<boolean>("my-unique-key", true, "sessionStorage");
 * setValue(false);
 */
export const useStorage = <T>(
  key: string,
  initialValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getFromStorage(key, initialValue, storageType),
  );

  const setValue = (value: T) => {
    try {
      setStoredValue(value);

      if (typeof window !== 'undefined') {
        window[storageType].setItem(key, JSON.stringify(value));
        window.dispatchEvent(
          new CustomEvent('usestoragehook', { detail: { key, value } }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const storageEventHandler = useCallback(
    (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(
          event.newValue === null ? null : JSON.parse(event.newValue),
        );
      }
    },
    [key, setStoredValue],
  );

  const useStorageEventHandler = useCallback(
    (event: CustomEvent) => {
      if (event.detail.key === key) {
        setStoredValue(event.detail.value);
      }
    },
    [setStoredValue],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', storageEventHandler);
      // @ts-ignore CustomEvent not supported by TypeScript's typings
      window.addEventListener('usestoragehook', useStorageEventHandler);

      return () => {
        window.removeEventListener('storage', storageEventHandler);
        // @ts-ignore
        window.removeEventListener('usestoragehook', useStorageEventHandler);
      };
    }
  }, [storageEventHandler, useStorageEventHandler]);

  return [storedValue, setValue];
};
