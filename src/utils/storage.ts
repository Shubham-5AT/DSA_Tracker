export const STORAGE_VERSION = "v1";
export const STORAGE_PREFIX = `ascent:${STORAGE_VERSION}:`;

export const storage = {
  getItem: <T>(key: string, fallback: T): T => {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      const item = localStorage.getItem(fullKey);
      if (!item) return fallback;
      
      // Attempt safe parsing
      try {
        return JSON.parse(item) as T;
      } catch (parseError) {
        console.warn(`[Storage] Failed to parse key "${fullKey}". Resetting to fallback.`, parseError);
        localStorage.removeItem(fullKey);
        return fallback;
      }
    } catch (e) {
      console.error(`[Storage] Error reading key "${key}" from localStorage.`, e);
      return fallback;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
    } catch (e) {
      console.error(`[Storage] Error writing key "${key}" to localStorage.`, e);
    }
  },

  removeItem: (key: string): void => {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(fullKey);
    } catch (e) {
      console.error(`[Storage] Error removing key "${key}" from localStorage.`, e);
    }
  },

  clearAll: (): void => {
    try {
      // Clear only keys matching our prefix
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error(`[Storage] Error during clearAll.`, e);
    }
  }
};
