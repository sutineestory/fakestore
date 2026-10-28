import { createAsyncStorage } from '@react-native-async-storage/async-storage';

const DATABASE = 'favorites';
const KEY = 'ids';

// Opened per call instead of held at module scope: it is only a handle, and a
// held one would outlive the Jest mock's reset between tests.
function storage() {
  return createAsyncStorage(DATABASE);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

/**
 * The saved favorite ids, oldest first. Missing or malformed data reads as no
 * favorites; a storage failure rejects.
 */
export async function loadFavoriteIds(): Promise<string[]> {
  const raw = await storage().getItem(KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(ids: string[]): Promise<void> {
  await storage().setItem(KEY, JSON.stringify(ids));
}
