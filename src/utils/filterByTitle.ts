/**
 * Case-insensitive title match. The query is used as given, so trim it first;
 * an empty query keeps every item.
 */
export function filterByTitle<T extends { title: string }>(
  items: T[],
  query: string,
): T[] {
  if (!query) {
    return items;
  }
  const needle = query.toLocaleLowerCase();
  return items.filter(item => item.title.toLocaleLowerCase().includes(needle));
}
