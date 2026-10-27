import { filterSampleItems } from '../filterSampleItems';
import type { SampleItem } from '../types';

const ITEMS: SampleItem[] = [
  { id: '1', title: 'Apple pie', description: 'Dessert' },
  { id: '2', title: 'Banana bread', description: 'Apple-free' },
  { id: '3', title: 'Pineapple', description: 'Fruit' },
];

function idsOf(items: SampleItem[]) {
  return items.map(item => item.id);
}

test('keeps every item for an empty query', () => {
  expect(idsOf(filterSampleItems(ITEMS, ''))).toEqual(['1', '2', '3']);
});

test('matches part of the title, ignoring case, in the original order', () => {
  expect(idsOf(filterSampleItems(ITEMS, 'APPLE'))).toEqual(['1', '3']);
});

test('does not match the description', () => {
  expect(filterSampleItems(ITEMS, 'dessert')).toEqual([]);
});

test('matches the query as given, including spaces', () => {
  expect(idsOf(filterSampleItems(ITEMS, 'apple '))).toEqual(['1']);
});

test('returns nothing when no title matches', () => {
  expect(filterSampleItems(ITEMS, 'cherry')).toEqual([]);
});

test('returns nothing for no items', () => {
  expect(filterSampleItems([], 'apple')).toEqual([]);
});
