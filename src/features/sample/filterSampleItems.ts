import type { SampleItem } from './types';

/**
 * Case-insensitive title match. The query is used as given, so trim it first;
 * an empty query keeps every item.
 */
export function filterSampleItems(
  items: SampleItem[],
  query: string,
): SampleItem[] {
  if (!query) {
    return items;
  }
  const needle = query.toLocaleLowerCase();
  return items.filter(item => item.title.toLocaleLowerCase().includes(needle));
}
