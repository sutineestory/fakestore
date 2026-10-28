import { filterByTitle } from '../filterByTitle';

type Item = { id: string; title: string; description: string };

const ITEMS: Item[] = [
  { id: '1', title: 'Apple pie', description: 'Dessert' },
  { id: '2', title: 'Banana bread', description: 'Apple-free' },
  { id: '3', title: 'Pineapple', description: 'Fruit' },
];

function idsOf(items: Item[]) {
  return items.map(item => item.id);
}

test('keeps every item for an empty query', () => {
  expect(idsOf(filterByTitle(ITEMS, ''))).toEqual(['1', '2', '3']);
});

test('matches part of the title, ignoring case, in the original order', () => {
  expect(idsOf(filterByTitle(ITEMS, 'APPLE'))).toEqual(['1', '3']);
});

test('does not match other fields', () => {
  expect(filterByTitle(ITEMS, 'dessert')).toEqual([]);
});

test('matches the query as given, including spaces', () => {
  expect(idsOf(filterByTitle(ITEMS, 'apple '))).toEqual(['1']);
});

test('returns nothing when no title matches', () => {
  expect(filterByTitle(ITEMS, 'cherry')).toEqual([]);
});

test('returns nothing for no items', () => {
  expect(filterByTitle([], 'apple')).toEqual([]);
});
