import { createAsyncStorage } from '@react-native-async-storage/async-storage';

const DATABASE = 'cart';
const KEY = 'ids';

// Opened per call instead of held at module scope: it is only a handle, and a
// held one would outlive the Jest mock's reset between tests.
function storage() {
  return createAsyncStorage(DATABASE);
}

function isIdArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(item => Number.isInteger(item));
}

/**
 * The saved cart's product ids, in the order they were added. Missing or
 * malformed data reads as an empty cart; a storage failure rejects.
 */
export async function loadCartIds(): Promise<number[]> {
  const raw = await storage().getItem(KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isIdArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCartIds(ids: readonly number[]): Promise<void> {
  await storage().setItem(KEY, JSON.stringify(ids));
}
